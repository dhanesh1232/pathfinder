"use client";

import { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const ALL_PORTFOLIO_ITEMS = [
  {
    src: "/portfolio one/WhatsApp Image 2026-01-05 at 7.10.33 PM.jpeg",
    alt: "Portfolio Work",
  },
  {
    src: "/portfolio one/WhatsApp Image 2026-01-24 at 10.04.53 PM.jpeg",
    alt: "Portfolio Work",
  },
  {
    src: "/portfolio one/WhatsApp Image 2026-01-29 at 3.01.55 PM.jpeg",
    alt: "Portfolio Work",
  },
  {
    src: "/portfolio one/WhatsApp Image 2026-01-29 at 3.01.55 PM3.jpeg",
    alt: "Portfolio Work",
  },
  {
    src: "/portfolio one/WhatsApp Image 2026-01-29 at 3.01.55 PM7.jpeg",
    alt: "Portfolio Work",
  },
  {
    src: "/portfolio one/WhatsApp Image 2026-01-29 at 3.01.55 PM78.jpeg",
    alt: "Portfolio Work",
  },
  {
    src: "/portfolio one/WhatsApp Image 2026-01-29 at 3.02.05 PM.jpeg",
    alt: "Portfolio Work",
  },
  {
    src: "/portfolio one/WhatsApp Image 2026-01-29 at 3.02.05 PM1.jpeg",
    alt: "Portfolio Work",
  },
  {
    src: "/portfolio one/WhatsApp Image 2026-01-29 at 3.02.05 PM1w.jpeg",
    alt: "Portfolio Work",
  },
  {
    src: "/portfolio one/WhatsApp Image 2026-01-29 at 3.02.27 PM.jpeg",
    alt: "Portfolio Work",
  },
  {
    src: "/portfolio one/WhatsApp Image 2026-01-29 at 3.05.15 PM.jpeg",
    alt: "Portfolio Work",
  },
  { src: "/portfolio one/ark.jpeg", alt: "Ark Architecture" },
  { src: "/portfolio one/book my studio.png", alt: "Book My Studio" },
  { src: "/portfolio one/bra.jpeg", alt: "Bravo Branding" },
  { src: "/portfolio one/cetaphil.png", alt: "Cetaphil Campaign" },
  { src: "/portfolio one/christmas 1.jpeg", alt: "Seasonal Campaign" },
  { src: "/portfolio one/coral 1.jpeg", alt: "Coral Brand Identity" },
  { src: "/portfolio one/elan 2.png", alt: "Elan Identity" },
  { src: "/portfolio one/every page.jpg", alt: "UI Design" },
  { src: "/portfolio one/glamogo.png", alt: "Glamogo" },
  { src: "/portfolio one/gyn phy.png", alt: "Gyn Phy" },
  { src: "/portfolio one/inv.jpeg", alt: "Event Invite" },
  { src: "/portfolio one/jewel.png", alt: "Jewelry Collection" },
  { src: "/portfolio one/jeweller.png", alt: "Jeweller Branding" },
  { src: "/portfolio one/kam 1.jpeg", alt: "Kam Campaign" },
  { src: "/portfolio one/kam.jpeg", alt: "Kam Identity" },
  { src: "/portfolio one/khau gully.png", alt: "Khau Gully" },
  { src: "/portfolio one/mang.jpeg", alt: "Mang" },
  { src: "/portfolio one/mothers day.png", alt: "Mothers Day" },
  { src: "/portfolio one/new prob.jpg", alt: "Problem Solved" },
  { src: "/portfolio one/overseas.png", alt: "Overseas Education" },
  { src: "/portfolio one/paste.png", alt: "Paste Toothpaste" },
  { src: "/portfolio one/raju gari 2.png", alt: "Raju Gari" },
  { src: "/portfolio one/raju gari ruchu 1.png", alt: "Raju Gari Ruchulu" },
  { src: "/portfolio one/raju gari wishes.png", alt: "Raju Gari Wishes" },
  { src: "/portfolio one/rep.jpeg", alt: "Report Design" },
  { src: "/portfolio one/rocj.jpeg", alt: "Rock Music" },
  { src: "/portfolio one/sampada silvers.png", alt: "Sampada Silvers" },
  { src: "/portfolio one/sampradaya 1.jpeg", alt: "Sampradaya" },
  { src: "/portfolio one/silb.png", alt: "Silver Brand" },
  { src: "/portfolio one/skin care solution 1.png", alt: "Skin Care" },
  { src: "/portfolio one/ui.jpeg", alt: "UI Design System" },
  { src: "/portfolio one/unity 1.png", alt: "Unity" },
  { src: "/portfolio one/urigae.png", alt: "Urigae" },
  { src: "/portfolio one/v mart.png", alt: "V Mart Retail" },
  { src: "/portfolio one/vity.jpeg", alt: "Vity" },
];

export default function Portfolio() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [displayedItems, setDisplayedItems] = useState(
    ALL_PORTFOLIO_ITEMS.slice(0, 12),
  );

  // Shuffle Logic
  useEffect(() => {
    const interval = setInterval(() => {
      // Pick 3 random indices to swap
      const indicesToSwap = new Set<number>();
      while (indicesToSwap.size < 3) {
        indicesToSwap.add(Math.floor(Math.random() * displayedItems.length));
      }

      const indicesArray = Array.from(indicesToSwap);
      const cards = containerRef.current?.querySelectorAll(".portfolio-item");

      if (!cards) return;

      // 1. Fade OUT selected cards
      const anim = gsap.to(
        indicesArray.map((i) => cards[i]),
        {
          opacity: 0,
          scale: 0.95,
          duration: 0.5,
          stagger: 0.1,
          onComplete: () => {
            // 2. Swap Data
            setDisplayedItems((prev) => {
              const newItems = [...prev];
              indicesArray.forEach((idx) => {
                // Pick a random image from ALL items that is NOT currently displayed
                // Simple approach: just pick random from ALL (collision chance is low with 46 items)
                let newItem =
                  ALL_PORTFOLIO_ITEMS[
                    Math.floor(Math.random() * ALL_PORTFOLIO_ITEMS.length)
                  ];
                newItems[idx] = newItem;
              });
              return newItems;
            });

            // 3. Fade IN (Needs to wait for state update render, but GSAP doesn't wait for React)
            // We use a small timeout or just animate the SAME DOM elements back in
            // React keeps the DOM elements, just updates the src.
            // So we can animate them back in.
            gsap.to(
              indicesArray.map((i) => cards[i]),
              {
                opacity: 1,
                scale: 1,
                duration: 0.8,
                delay: 0.1,
                stagger: 0.1,
                ease: "power2.out",
              },
            );
          },
        },
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [displayedItems]); // Re-bind if array size changes (it won't)

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
          <p className="text-white/60 font-nohemi text-lg md:text-xl font-light max-w-2xl mx-auto">
            A curation of brands we've helped defined, designed, and elevated.
          </p>
        </div>

        {/* Masonry Grid */}
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          {displayedItems.map((item, idx) => (
            <div
              key={idx} // Using Index as key here is crucial for keeping DOM nodes stable for animation sharing
              className="portfolio-item break-inside-avoid relative mb-6 rounded-lg overflow-hidden bg-zinc-900/50 border border-white/5"
            >
              <img
                src={item.src}
                alt={item.alt}
                className="w-full h-auto object-cover grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all duration-700 ease-out min-h-[200px]"
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

            <span className="font-aalto font-light text-white uppercase tracking-[0.2em] text-sm group-hover:text-pathfinder-green transition-colors">
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
