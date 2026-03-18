"use client";

import ShimmerButton from "./ui/shinny-button";
import { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import LiquidHeading from "./ui/liquid-text";
import { Loader2 } from "lucide-react";
import { getPortfolioItems } from "@/app/actions/content";

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
  const [displayedItems, setDisplayedItems] = useState<any[]>([]);
  const [allPortfolioItems, setAllPortfolioItems] = useState(ALL_PORTFOLIO_ITEMS);
  const [isShuffleActive, setIsShuffleActive] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const fetchItems = async () => {
      const dbItems = await getPortfolioItems();
      if (dbItems && dbItems.length > 0) {
        const formatted = dbItems.map((item: any) => ({
          src: item.imageUrl,
          alt: item.title,
        }));
        setAllPortfolioItems(formatted);
        setDisplayedItems(formatted.slice(0, 12));
      } else {
        setDisplayedItems(ALL_PORTFOLIO_ITEMS.slice(0, 12));
      }
    };
    fetchItems();
  }, []);

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
              allPortfolioItems[
                Math.floor(Math.random() * allPortfolioItems.length)
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

  const handleDownload = async () => {
    if (isDownloading) return;
    setIsDownloading(true);

    const url =
      "https://pub-236715f1b7584858b15e16f74eeaacb8.r2.dev/PathFinder%20Portfolio%20New.pdf";
    const filename = "The_Pathfinders_Portfolio.pdf";

    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);

      // Success animation trigger
      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 3000); // Revert after 3s
    } catch (error) {
      console.error("Download failed:", error);
      // Fallback: open in new tab if fetch fails (e.g. CORS issues)
      window.open(url, "_blank");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <section
      ref={containerRef}
      className="w-full py-12 md:py-24 px-6 bg-transparent relative z-10"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header (Floating) */}
        <div ref={headerTextRef} className="text-center mb-16">
          <div className="w-full max-w-lg mx-auto h-max flex items-center justify-center pointer-events-none select-none">
            <LiquidHeading
              text="SELECTED WORKS"
              videoSrc="https://cdn.pixabay.com/video/2024/05/25/213616_large.mp4"
              size="120"
              weight="700"
            />
          </div>
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

        <div className="mt-12 flex flex-col items-center justify-center">
          <style jsx global>{`
            @keyframes arrow-drop {
              0% {
                transform: translateY(-15px);
                opacity: 0;
              }
              30% {
                opacity: 1;
              }
              60% {
                opacity: 1;
              }
              100% {
                transform: translateY(15px);
                opacity: 0;
              }
            }
            .animate-arrow-drop {
              animation: arrow-drop 0.8s infinite linear;
            }
            @keyframes check-draw {
              from {
                stroke-dashoffset: 30;
              }
              to {
                stroke-dashoffset: 0;
              }
            }
            .animate-check-draw {
              stroke-dasharray: 30;
              stroke-dashoffset: 30;
              animation: check-draw 0.4s cubic-bezier(0.65, 0, 0.45, 1) forwards;
              animation-delay: 0.1s;
            }
            .tray-bounce {
              transition: transform 0.2s ease;
            }
            .fetching .tray-bounce {
              transform: translateY(2px);
            }
          `}</style>
          <button
            onClick={handleDownload}
            disabled={isDownloading || isSuccess}
            className={`group cursor-pointer bg-transparent border-none p-0 transition-all ${
              isDownloading ? "opacity-70 cursor-wait fetching" : ""
            } ${isSuccess ? "cursor-default" : ""}`}
          >
            <ShimmerButton>
              <div className="flex items-center gap-4 font-aalto font-light uppercase tracking-[0.2em] text-sm text-gray-900 group-hover:text-white transition-colors">
                {isDownloading
                  ? "Downloading..."
                  : isSuccess
                    ? "Downloaded"
                    : "Portfolio"}

                <div className="relative w-6 h-6 flex items-center justify-center overflow-hidden">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-full h-full"
                  >
                    {!isSuccess && (
                      <>
                        {/* The Bottom Line/Tray */}
                        <path d="M4 20h16" className="tray-bounce opacity-50" />

                        {/* The Arrow */}
                        <g
                          className={isDownloading ? "animate-arrow-drop" : ""}
                        >
                          <path d="M12 3v13" />
                          <path d="m7 11 5 5 5-5" />
                        </g>
                      </>
                    )}

                    {isSuccess && (
                      <path
                        d="m5 12 5 5L20 7"
                        className="animate-check-draw text-white"
                      />
                    )}
                  </svg>
                </div>
              </div>
            </ShimmerButton>
          </button>
        </div>
      </div>
    </section>
  );
}
