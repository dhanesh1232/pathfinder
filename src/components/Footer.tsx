"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Link from "next/link";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Footer() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const scrollerEl = document.getElementById("smooth-wrapper");
      const scroller = scrollerEl || window;

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
            scroller: scroller,
            start: "top 95%",
          },
        },
      );
    },
    { scope: containerRef },
  );

  return (
    <footer
      ref={containerRef}
      className="relative w-full py-12 px-6 bg-black border-t border-white/5 z-20"
    >
      <div className="max-w-7xl mx-auto">
        <div className="w-full flex flex-col md:flex-row justify-between items-center text-zinc-500 text-sm font-poppins footer-reveal">
          <div className="mb-4 md:mb-0">
            © 2026{" "}
            <span className="text-pathfinder-green">
              The{" "}
              <Link href="/" className="nav-link">
                Pathfinder
              </Link>
            </span>
            . All rights reserved.
          </div>

          <div className="flex gap-8 mb-4 md:mb-0">
            <Link
              href="#"
              aria-label="Follow The Pathfinders on LinkedIn"
              className="nav-link hover:text-pathfinder-green transition-colors"
            >
              LinkedIn
            </Link>
            <Link
              href="#"
              aria-label="Follow The Pathfinders on Instagram"
              className="nav-link hover:text-pathfinder-green transition-colors"
            >
              Instagram
            </Link>
            <Link
              href="#"
              aria-label="Follow The Pathfinders on Twitter"
              className="nav-link hover:text-pathfinder-green transition-colors"
            >
              Twitter
            </Link>
          </div>

          <div className="text-zinc-600">
            Developed by{" "}
            <Link
              href="https://ecodrix.com"
              target="_blank"
              className="nav-link transition-colors"
            >
              <span className="text-blue-500">ECODrIx</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
