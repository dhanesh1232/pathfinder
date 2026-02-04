"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";

const MARQUEE_TEXT = [
  "Find the Path",
  "Build with Purpose",
  "Design with Clarity",
  "Grow with Confidence",
  "Honest Creativity",
  "Pathfinder",
];

const TextMarquee = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      const textElement = textRef.current;
      if (!textElement) return;

      const totalWidth = textElement.scrollWidth / 2; // Since we duplicate content

      gsap.to(textElement, {
        x: -totalWidth,
        duration: 30, // Adjust speed here
        ease: "none",
        repeat: -1,
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden bg-black py-2 border-y border-white/10"
    >
      {/* Gradient Overlays */}
      <div className="absolute left-0 top-0 bottom-0 w-32 md:w-72 bg-linear-to-r from-black via-black/80 to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-32 md:w-72 bg-linear-to-l from-black via-black/80 to-transparent z-10 pointer-events-none" />

      <div className="flex whitespace-nowrap" ref={textRef}>
        {/* Render text twice for seamless loop */}
        {[0, 1].map((i) => (
          <div key={i} className="flex items-center shrink-0">
            {MARQUEE_TEXT.map((text, index) => (
              <React.Fragment key={index}>
                <span
                  className={`text-3xl md:text-5xl font-poppins font-light uppercase tracking-wider px-6 ${
                    index % 2 === 0 ? "text-white" : "text-pathfinder-green"
                  }`}
                >
                  {text}
                </span>
              </React.Fragment>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TextMarquee;
