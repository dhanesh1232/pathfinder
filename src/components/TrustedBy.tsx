"use client";

import { useEffect, useRef, useState } from "react";

const LOGOS = [
  "Company A",
  "Partner B",
  "Client C",
  "Studio D",
  "Brand E",
  "Agency F",
];

export default function TrustedBy() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); // One-time fade in
        }
      },
      { threshold: 0.3 },
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="w-full py-24 bg-transparent flex flex-col items-center justify-center gap-12"
    >
      <div
        className={`transition-opacity duration-1000 ${isVisible ? "opacity-100" : "opacity-0"}`}
      >
        <p className="text-white/40 text-sm uppercase tracking-widest mb-10 text-center">
          <span className="text-pathfinder-green">We're trusted</span> by
          companies like
        </p>

        <div className="flex flex-wrap items-center justify-center gap-12 md:gap-20 max-w-6xl px-6">
          {LOGOS.map((logo, index) => (
            <div
              key={index}
              className="text-white/60 font-playfair text-2xl font-bold hover:text-white transition-colors duration-300"
            >
              {logo}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
