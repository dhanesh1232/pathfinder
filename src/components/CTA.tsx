"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ArrowUpRight } from "lucide-react";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function CTA() {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!textRef.current || !containerRef.current) return;

      const scrollerEl = document.getElementById("smooth-wrapper");
      const scroller = scrollerEl || window;

      // 1. Reveal Animation
      gsap.fromTo(
        ".cta-reveal",
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: containerRef.current,
            scroller: scroller,
            start: "top 70%",
          },
        },
      );

      // 2. Typewriter & Bounce Effect for the Headline
      const chars = textRef.current.querySelectorAll(".char");
      if (chars.length > 0) {
        gsap.fromTo(
          chars,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.05,
            stagger: {
              amount: 1,
              from: "random",
            },
            ease: "back.out(1.7)", // Bounce effect
            scrollTrigger: {
              trigger: textRef.current,
              scroller: scroller,
              start: "top 80%",
            },
          },
        );

        // Continuous Gentle Bounce Loop
        gsap.to(chars, {
          y: -10,
          duration: 2,
          ease: "sine.inOut",
          stagger: {
            amount: 1,
            from: "random",
            repeat: -1,
            yoyo: true,
          },
        });
      }
    },
    { scope: containerRef },
  );

  return (
    <section
      ref={containerRef}
      className="relative w-full h-screen min-h-[800px] flex items-center justify-center overflow-hidden"
    >
      {/* 1. Video Background */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover opacity-100" // Opacity adjusted for readability? 70% might be safer, but user asked for "show this". Let's start with 60% overlay.
        >
          <source
            src="https://res.cloudinary.com/dhzw6k0vc/video/upload/v1770228531/IMG_0271_mjkjdq.mp4"
            type="video/mp4"
          />
        </video>
        {/* Overlay for better text contrast */}
        <div className="absolute inset-0 bg-black/60 z-10" />
      </div>

      <div className="relative z-20 max-w-7xl mx-auto px-6 flex flex-col items-center justify-center text-center">
        {/* Main Headline */}
        <div ref={textRef} className="mb-12 md:mb-16">
          <h2 className="font-poppins font-black text-5xl md:text-7xl lg:text-9xl uppercase leading-[0.9] text-white tracking-tight">
            {"FIND THE RIGHT".split("").map((char, i) => (
              <span key={`l1-${i}`} className="char inline-block">
                {char === " " ? "\u00A0" : char}
              </span>
            ))}
            <br />
            {"PATH FOR YOUR".split("").map((char, i) => (
              <span
                key={`l2-${i}`}
                className={`char inline-block ${
                  i >= 5 ? "text-pathfinder-green" : ""
                }`}
              >
                {char === " " ? "\u00A0" : char}
              </span>
            ))}
            <br />
            {"BRAND".split("").map((char, i) => (
              <span
                key={`l3-${i}`}
                className="char inline-block text-pathfinder-green"
              >
                {char === " " ? "\u00A0" : char}
              </span>
            ))}
          </h2>
        </div>

        {/* CTA Button */}
        <a
          href="https://wa.me/+919676104199"
          target="_blank"
          className="cta-reveal group relative inline-flex items-center gap-4 px-12 py-5 bg-white text-black rounded-full overflow-hidden hover:bg-pathfinder-green transition-colors duration-500"
        >
          <span className="relative z-10 font-poppins font-medium text-lg tracking-wide group-hover:text-white transition-colors duration-300">
            Find Your Path
          </span>
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-black text-white group-hover:bg-white group-hover:text-pathfinder-green transition-all duration-300 relative z-10">
            <ArrowUpRight className="group-hover:rotate-45 transition-transform ease-in-out duration-300" />
          </div>
        </a>
      </div>
    </section>
  );
}
