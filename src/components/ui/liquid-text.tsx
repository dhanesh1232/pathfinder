"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

interface LiquidHeadingProps {
  text?: string;
  videoSrc?: string;
  className?: string;
}

export default function LiquidHeading({
  text = "VISUAL IMPACT",
  videoSrc = "https://cdn.pixabay.com/video/2024/05/25/213616_large.mp4",
  className = "",
}: LiquidHeadingProps) {
  const turbulence = useRef<SVGFETurbulenceElement>(null);

  useEffect(() => {
    if (!turbulence.current) return;

    gsap.to(turbulence.current, {
      attr: {
        baseFrequency: 0.015,
        seed: 100,
      },
      duration: 3,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });
  }, []);

  return (
    <div className={`relative w-full overflow-hidden ${className}`}>
      <svg
        width="100%"
        height="100%" // Responsive height controlled by container
        viewBox="0 0 1000 200"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
      >
        <defs>
          {/* Liquid Distortion Filter */}
          <filter id="liquid-filter">
            <feTurbulence
              ref={turbulence}
              type="fractalNoise"
              baseFrequency="0.01"
              numOctaves="1"
              seed="1"
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="15"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>

          {/* Mask: Text with Liquid Filter applied */}
          <mask id="text-mask">
            <rect x="0" y="0" width="100%" height="100%" fill="black" />
            <text
              x="50%"
              y="50%"
              dominantBaseline="middle"
              textAnchor="middle"
              fontSize="120"
              fontWeight="700"
              fill="white"
              filter="url(#liquid-filter)"
              style={{ fontFamily: "'Poppins', sans-serif" }} // Ensure font matches
            >
              {text}
            </text>
          </mask>
        </defs>

        {/* Video Video masked by the Liquid Text */}
        <foreignObject
          x="0"
          y="0"
          width="1000"
          height="200"
          mask="url(#text-mask)"
          style={{ mask: "url(#text-mask)", WebkitMask: "url(#text-mask)" }} // Webkit support
        >
          <div className="w-full h-full">
            <video
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            >
              <source src={videoSrc} type="video/mp4" />
            </video>
          </div>
        </foreignObject>
      </svg>
    </div>
  );
}
