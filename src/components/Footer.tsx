"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export default function ContactSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // Gentle floating animation for the large text
      gsap.to(textRef.current, {
        y: -10,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      // Reveal animation on scroll
      gsap.fromTo(
        ".footer-reveal",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          stagger: 0.1,
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 80%",
          },
        },
      );
    },
    { scope: containerRef },
  );

  return (
    <footer
      ref={containerRef}
      id="contact"
      className="relative w-full pt-32 pb-12 px-6 bg-transparent border-t border-white/5 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto flex flex-col items-center justify-center text-center">
        {/* Main Headline */}
        <div
          ref={textRef}
          className="mb-16 md:mb-24 relative z-10 footer-reveal"
        >
          <h2 className="font-poppins font-black text-6xl md:text-8xl lg:text-9xl uppercase leading-[0.9] text-white tracking-tight">
            FIND THE RIGHT <br />
            PATH <span className="text-pathfinder-green">FOR YOUR</span> <br />
            <span className="text-pathfinder-green">BRAND</span>
          </h2>
        </div>

        {/* CTA Button */}
        <a
          href="mailto:contact@pathfinder.com"
          className="footer-reveal group relative inline-flex items-center gap-4 px-12 py-5 bg-white text-black rounded-full overflow-hidden hover:bg-pathfinder-green transition-colors duration-500"
        >
          <span className="relative z-10 font-poppins font-medium text-lg tracking-wide group-hover:text-white transition-colors duration-300">
            Find Your Path
          </span>
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-black text-white group-hover:bg-white group-hover:text-pathfinder-green transition-all duration-300 relative z-10">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-4 h-4 -rotate-45 group-hover:rotate-0 transition-transform duration-300"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
              />
            </svg>
          </div>
        </a>

        {/* Footer Bottom Links */}
        <div className="w-full mt-32 md:mt-48 flex flex-col md:flex-row justify-between items-center text-zinc-500 text-sm font-poppins border-t border-white/10 pt-8 footer-reveal">
          <div className="mb-4 md:mb-0">
            © 2026 Pathfinder. All rights reserved.
          </div>

          <div className="flex gap-8 mb-4 md:mb-0">
            <a
              href="#"
              className="hover:text-pathfinder-green transition-colors"
            >
              LinkedIn
            </a>
            <a
              href="#"
              className="hover:text-pathfinder-green transition-colors"
            >
              Instagram
            </a>
            <a
              href="#"
              className="hover:text-pathfinder-green transition-colors"
            >
              Twitter
            </a>
          </div>

          <div className="text-zinc-600">Designed by Pathfinder</div>
        </div>
      </div>

      {/* Background Glow Effect */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[50vh] bg-pathfinder-green/5 blur-[120px] rounded-full pointer-events-none z-0" />
    </footer>
  );
}
