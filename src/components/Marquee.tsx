"use client";
import Image from "next/image";
import React, { useRef, useEffect, useState, useCallback } from "react";

function Logomarquee({ logos1, logos2 }: any) {
  return (
    <div className="items-center overflow-hidden">
      <div className="w-full mx-auto flex flex-col gap-y-6">
        <MarqueeTrack logos={logos1} direction="normal" />
        {logos2 && logos2.length > 0 && logos1 !== logos2 && (
          <MarqueeTrack logos={logos2} direction="reverse" />
        )}
      </div>
    </div>
  );
}

function MarqueeTrack({
  logos,
  direction = "normal",
}: {
  logos: string[];
  direction?: "normal" | "reverse";
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [duration, setDuration] = useState(30);

  // Inject keyframes once
  useEffect(() => {
    const id = "marquee-scroll-keyframes";
    if (document.getElementById(id)) return;
    const style = document.createElement("style");
    style.id = id;
    style.textContent = `
      @keyframes marquee-scroll {
        from { transform: translateX(0); }
        to { transform: translateX(-50%); }
      }
    `;
    document.head.appendChild(style);
  }, []);

  // Calculate duration based on total track width so speed is consistent
  const measureTrack = useCallback(() => {
    if (!trackRef.current) return;
    const fullWidth = trackRef.current.scrollWidth;
    // One set is half the full width (we render 2 copies)
    const oneSetWidth = fullWidth / 2;
    // ~50px per second for smooth scrolling
    const pxPerSecond = 50;
    setDuration(oneSetWidth / pxPerSecond);
  }, []);

  useEffect(() => {
    measureTrack();
    // Recalculate on resize
    window.addEventListener("resize", measureTrack);
    return () => window.removeEventListener("resize", measureTrack);
  }, [logos, measureTrack]);

  return (
    <div
      className="max-w-full relative overflow-hidden group"
      style={{
        maskImage:
          "linear-gradient(to right, transparent, black 2rem, black calc(100% - 2rem), transparent)",
      }}
    >
      <div
        ref={trackRef}
        className="flex w-max group-hover:[animation-play-state:paused]"
        style={{
          animation: `marquee-scroll ${duration}s linear infinite ${direction}`,
        }}
      >
        {/* First full set of ALL logos */}
        {logos.map((logo, index) => (
          <div
            key={`set1-${index}`}
            className="shrink-0 flex justify-center items-center"
            style={{ width: "140px", aspectRatio: "1 / 1.2", margin: "0 20px" }}
          >
            <LogoCard logo={logo} />
          </div>
        ))}
        {/* Second full set — seamless loop */}
        {logos.map((logo, index) => (
          <div
            key={`set2-${index}`}
            className="shrink-0 flex justify-center items-center"
            style={{ width: "140px", aspectRatio: "1 / 1.2", margin: "0 20px" }}
          >
            <LogoCard logo={logo} />
          </div>
        ))}
      </div>
    </div>
  );
}

function LogoCard({ logo }: { logo: string }) {
  const name = logo
    .replace(/\.(png|jpg|jpeg|svg)$/i, "")
    .replace(/ logo$/i, "");

  const logoUrl = (logo: string) =>
    logo.startsWith("http") ? logo : `/Website logo/${logo}`;

  return (
    <div className="shrink-0 group/card cursor-pointer">
      <div className="relative w-24 h-16 md:w-30 md:h-20 overflow-hidden">
        <div className="w-full h-full flex flex-col transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover/card:-translate-y-full">
          {/* Default Logo */}
          <div className="shrink-0 w-full h-full flex items-center justify-center">
            <Image
              src={logoUrl(logo)}
              alt={`${name} logo`}
              width={160}
              height={96}
              className="w-full h-full object-contain opacity-70 transition-opacity duration-300"
            />
          </div>
          {/* Hover Logo (Slides in from bottom) */}
          <div className="shrink-0 w-full h-full flex items-center justify-center">
            <Image
              src={logoUrl(logo)}
              alt={`${name} logo active`}
              width={160}
              height={96}
              className="w-full h-full object-contain opacity-100"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Logomarquee;
