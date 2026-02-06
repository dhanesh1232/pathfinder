"use client";

import { useEffect, useRef, useId } from "react";
import gsap from "gsap";

interface LiquidHeadingProps {
  text?: string;
  videoSrc?: string;
  className?: string;
  size?: string | number;
  weight?: string | number;
}

export default function LiquidHeading({
  text = "VISUAL IMPACT",
  videoSrc = "https://cdn.pixabay.com/video/2024/05/25/213616_large.mp4",
  className = "",
  size = "120",
  weight = "700",
}: LiquidHeadingProps) {
  const turbulence = useRef<SVGFETurbulenceElement>(null);
  const id = useId();
  const filterId = `liquid-filter-${id.replace(/:/g, "")}`;
  const maskId = `text-mask-${id.replace(/:/g, "")}`;

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
          <filter id={filterId}>
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
          <mask id={maskId}>
            <rect x="0" y="0" width="100%" height="100%" fill="black" />
            <text
              x="50%"
              y="50%"
              dominantBaseline="middle"
              textAnchor="middle"
              fontSize={size.toString()}
              fontWeight={weight.toString()}
              fill="white"
              filter={`url(#${filterId})`}
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
          mask={`url(#${maskId})`}
          style={{
            mask: `url(#${maskId})`,
            WebkitMask: `url(#${maskId})`,
          }} // Webkit support
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
