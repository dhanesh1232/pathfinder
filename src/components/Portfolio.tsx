"use client";

import ShimmerButton from "./ui/shinny-button";
import { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

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

const TypingHeading = ({ className }: { className?: string }) => {
  const container = useRef<HTMLHeadingElement>(null);
  const text = "Selected Works";

  useEffect(() => {
    if (!container.current) return;

    const ctx = gsap.context(() => {
      const scrollerEl = document.getElementById("smooth-wrapper");
      const scroller = scrollerEl || window;

      // 1. Typing Animation (Triggered by Scroll) - Matches HowWeWorks style
      gsap.fromTo(
        ".typing-char",
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.05,
          stagger: 0.04,
          ease: "none",
          scrollTrigger: {
            trigger: container.current,
            scroller: scroller,
            start: "top 60%", // Start when section enters view
            toggleActions: "play none none reverse",
          },
        },
      );
    }, container);

    return () => ctx.revert();
  }, []);

  return (
    <h2
      ref={container}
      className={`font-poppins font-black text-5xl md:text-6xl lg:text-8xl tracking-tighter uppercase ${className}`}
    >
      {text.split("").map((char, i) => (
        <span
          key={i}
          className="typing-char inline-block text-white"
          style={{ opacity: 0 }}
        >
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </h2>
  );
}; // End TypingHeading

export default function Portfolio() {
  const containerRef = useRef<HTMLDivElement>(null);
  const headerTextRef = useRef<HTMLDivElement>(null);
  const [displayedItems, setDisplayedItems] = useState(
    ALL_PORTFOLIO_ITEMS.slice(0, 12),
  );
  const [isShuffleActive, setIsShuffleActive] = useState(false);

  // Shuffle Logic
  useEffect(() => {
    if (!isShuffleActive) return;

    const interval = setInterval(() => {
      // Pick 1 random index to swap for constant low-level activity
      const indexToSwap = Math.floor(Math.random() * displayedItems.length);
      const cards = containerRef.current?.querySelectorAll(".portfolio-item");

      if (!cards) return;

      // 1. Fade OUT selected card
      gsap.to(cards[indexToSwap], {
        opacity: 0,
        scale: 0.95,
        duration: 0.5,
        onComplete: () => {
          // 2. Swap Data
          setDisplayedItems((prev) => {
            const newItems = [...prev];
            // Pick a random image from ALL items
            let newItem =
              ALL_PORTFOLIO_ITEMS[
                Math.floor(Math.random() * ALL_PORTFOLIO_ITEMS.length)
              ];
            newItems[indexToSwap] = newItem;
            return newItems;
          });

          // 3. Fade IN
          gsap.to(cards[indexToSwap], {
            opacity: 1,
            scale: 1,
            duration: 0.8,
            delay: 0.1,
            ease: "power2.out",
          });
        },
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [displayedItems, isShuffleActive]);

  // GSAP Logic
  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      const scrollerEl = document.getElementById("smooth-wrapper");
      const scroller = scrollerEl || window;

      ScrollTrigger.create({
        trigger: containerRef.current,
        scroller: scroller,
        start: "top bottom",
        end: "bottom top",
        onToggle: (self) => setIsShuffleActive(self.isActive),
      });

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
              scroller: scroller,
              start: "top 90%",
              toggleActions: "play none none reverse",
            },
            delay: (i % 3) * 0.1,
            onComplete: () => {
              // Anime-style floating effect
              gsap.to(item, {
                y: -10,
                duration: 2 + Math.random() * 2,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut",
                delay: Math.random(),
              });
            },
          },
        );
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="w-full py-12 md:py-24 px-6 bg-transparent relative z-10"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header (Floating) */}
        <div ref={headerTextRef} className="text-center mb-16">
          <TypingHeading className="mb-2" />
          <p className="text-white/60 font-nohemi text-lg md:text-xl font-light max-w-2xl mx-auto">
            A curation of brands we've helped defined, designed, and elevated.
          </p>
        </div>

        {/* Masonry Grid (Fixed Aspect Ratio for Uniform Height) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {displayedItems.map((item, idx) => (
            <div
              key={idx}
              className="portfolio-item relative rounded-lg overflow-hidden bg-zinc-900/50 border border-white/5 aspect-[3/4] group"
            >
              <Image
                src={item.src}
                alt={item.alt}
                fill
                sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 ease-out"
              />
              {/* Glass Effect Overlay */}
              <div className="absolute inset-0 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                <div className="absolute inset-0 bg-linear-to-b from-white/20 to-transparent mix-blend-overlay" />
                <div className="absolute inset-0 ring-1 ring-inset ring-white/30 rounded-lg" />
                {/* Shine Sheen - Left to Right */}
                <div className="absolute top-0 -left-[150%] w-[150%] h-full bg-linear-to-r from-transparent via-pathfinder-green/20 to-transparent transform -skew-x-12 group-hover:left-[100%] transition-all duration-1000 ease-in-out" />
              </div>
            </div>
          ))}
        </div>

        {/* Minimal Luxury Download CTA */}
        <div className="mt-12 flex flex-col items-center justify-center">
          <a
            href="/portfolio.pdf"
            download="The_Pathfinders_Portfolio.pdf"
            className="group cursor-pointer"
          >
            <ShimmerButton>
              <div className="flex items-center gap-4 font-aalto font-light uppercase tracking-[0.2em] text-sm">
                Portfolio
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                  className="w-5 h-5 text-gray-900 group-hover:text-white transition-colors"
                >
                  <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5" />
                  <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708z" />
                </svg>
              </div>
            </ShimmerButton>
          </a>
        </div>
      </div>
    </section>
  );
}
