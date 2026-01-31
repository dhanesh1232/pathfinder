"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const PORTFOLIO_ITEMS = [
  { src: "/portfolio one/cetaphil.png", alt: "Cetaphil Campaign" },
  { src: "/portfolio one/elan 2.png", alt: "Elan Identity" },
  { src: "/portfolio one/gyn phy.png", alt: "Gyn Phy Branding" },
  { src: "/portfolio one/jewel.png", alt: "Jewelry Collection" },
  { src: "/portfolio one/book my studio.png", alt: "Book My Studio App" },
  { src: "/portfolio one/overseas.png", alt: "Overseas Education" },
  { src: "/portfolio one/sampada silvers.png", alt: "Sampada Silvers" },
  { src: "/portfolio one/v mart.png", alt: "V Mart Retail" },
  { src: "/portfolio one/ui.jpeg", alt: "UI Design System" },
  { src: "/portfolio one/ark.jpeg", alt: "Ark Architecture" },
  { src: "/portfolio one/christmas 1.jpeg", alt: "Seasonal Campaign" },
  { src: "/portfolio one/coral 1.jpeg", alt: "Coral Brand Identity" },
];

export default function Portfolio() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const items = gsap.utils.toArray<HTMLElement>(".portfolio-item");

      items.forEach((item, i) => {
        gsap.fromTo(
          item,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: item,
              start: "top 90%",
              toggleActions: "play none none reverse",
            },
            delay: (i % 3) * 0.1, // Stagger based on column position roughly
          },
        );
      });
    },
    { scope: containerRef },
  );

  return (
    <section
      ref={containerRef}
      className="w-full py-32 md:py-48 px-6 bg-transparent relative z-10"
    >
      <div className="max-w-[1600px] mx-auto">
        {/* Header */}
        <div className="text-center mb-24 md:mb-32">
          <h2 className="text-white font-poppins font-black text-6xl md:text-8xl lg:text-9xl tracking-tighter uppercase mb-6">
            Selected Works
          </h2>
          <p className="text-white/60 font-poppins text-lg md:text-xl font-light max-w-2xl mx-auto">
            A curation of brands we've helped defined, designed, and elevated.
          </p>
        </div>

        {/* Masonry Grid */}
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          {PORTFOLIO_ITEMS.map((item, idx) => (
            <div
              key={idx}
              className="portfolio-item break-inside-avoid relative mb-6 rounded-lg overflow-hidden bg-zinc-900/50 border border-white/5"
            >
              <img
                src={item.src}
                alt={item.alt}
                className="w-full h-auto object-cover grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all duration-700 ease-out"
                loading="lazy"
              />
            </div>
          ))}
        </div>

        {/* Minimal Luxury Download CTA */}
        <div className="mt-32 flex flex-col items-center justify-center">
          <a
            href="/portfolio.pdf"
            download="The_Pathfinders_Portfolio.pdf"
            className="group relative inline-flex items-center gap-4 px-10 py-5 overflow-hidden rounded-full border border-white/30 hover:border-pathfinder-green transition-colors duration-500 bg-black/20 backdrop-blur-sm"
          >
            <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            <span className="font-poppins font-light text-white uppercase tracking-[0.2em] text-sm group-hover:text-pathfinder-green transition-colors">
              Portfolio
            </span>

            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5 text-white/70 group-hover:text-pathfinder-green transition-colors"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15V3" />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m7 10 5 5 5-5"
              />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
