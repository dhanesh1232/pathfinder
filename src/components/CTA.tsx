"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ArrowUpRight } from "lucide-react";
import ScrollTrigger from "gsap/ScrollTrigger";
import Link from "next/link";

gsap.registerPlugin(ScrollTrigger);

export default function CTA() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLAnchorElement>(null);

  useGSAP(
    () => {
      if (!containerRef.current) return;

      const scrollerEl = document.getElementById("smooth-wrapper");
      const scroller = scrollerEl || window;

      // Gentle floating animation for the large text
      gsap.to(textRef.current, {
        y: -10,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      // Float animation for button
      gsap.to(buttonRef.current, {
        y: -10,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      // 2. Video Playback Control on Scroll (Re-triggers every time)
      ScrollTrigger.create({
        trigger: videoRef.current,
        scroller: scroller,
        start: "top 80%",
        onEnter: () => {
          if (videoRef.current) {
            videoRef.current.currentTime = 0;
            videoRef.current.play().catch(() => {});
          }
        },
        onEnterBack: () => {
          if (videoRef.current) {
            videoRef.current.currentTime = 0;
            videoRef.current.play().catch(() => {});
          }
        },
      });

      // 3. Button Reveal
      gsap.fromTo(
        ".cta-button",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          delay: 0.5,
          ease: "power2.out",
          scrollTrigger: {
            trigger: containerRef.current,
            scroller: scroller,
            start: "top 60%",
          },
        },
      );
    },
    { scope: containerRef },
  );

  return (
    <section
      ref={containerRef}
      className="relative w-full bg-black px-6 flex flex-col items-center overflow-hidden"
    >
      {/* Heading Top */}
      <div ref={textRef} className="cta-heading mb-4 text-center relative z-10">
        <h2 className="font-poppins font-black text-4xl md:text-6xl lg:text-8xl uppercase leading-[0.9] text-white tracking-tight">
          FIND THE RIGHT <br />
          PATH <span className="text-pathfinder-green">FOR YOUR</span> <br />
          <span className="text-pathfinder-green">BRAND</span>
        </h2>
      </div>

      <Link
        ref={buttonRef}
        href="https://wa.me/+919676104199"
        target="_blank"
        className="cta-button group relative inline-flex items-center gap-4 px-6 py-2 lg:px-8 lg:py-3 bg-white text-black rounded-full overflow-hidden hover:bg-pathfinder-green hover:scale-105 active:scale-95 transition-all duration-300 mb-12"
      >
        <span className="relative z-40 font-poppins font-bold text-lg tracking-wide group-hover:text-white transition-colors duration-300">
          Find Your Path
        </span>
        <div className="flex items-center justify-center lg:w-8 lg:h-8 h-6 w-6 rounded-full bg-black text-white group-hover:bg-white group-hover:text-pathfinder-green transition-all duration-300 relative z-10">
          <ArrowUpRight className="group-hover:rotate-45 transition-transform ease-in-out duration-300" />
        </div>
      </Link>

      {/* Video Container Below Heading */}

      <video
        ref={videoRef}
        muted
        playsInline
        className="w-full h-full lg:w-[800px] lg:h-[600px] object-cover"
      >
        <source
          src="https://pub-236715f1b7584858b15e16f74eeaacb8.r2.dev/IMG_0271.MP4"
          type="video/mp4"
        />
      </video>
    </section>
  );
}
