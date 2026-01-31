"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const BANNER_ITEMS = [
  {
    type: "video",
    src: "/banner/5884478_Women_Team_1920x1080.mp4",
    alt: "Team Collaboration Video",
  },
  {
    type: "image",
    src: "/banner/think banner.jpg.jpeg",
    alt: "Think Different Banner",
  },
  {
    type: "image",
    src: "/banner/mummy birthday.png",
    alt: "Celebration Event Design",
  },
];

export default function BannerCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);

  const nextSlide = () => {
    setActiveIndex((prev) => (prev + 1) % BANNER_ITEMS.length);
  };

  const prevSlide = () => {
    setActiveIndex(
      (prev) => (prev - 1 + BANNER_ITEMS.length) % BANNER_ITEMS.length,
    );
  };

  useGSAP(
    () => {
      // Animate the slide content when index changes
      gsap.fromTo(
        ".active-slide-media",
        { scale: 1.1, opacity: 0.8 },
        { scale: 1, opacity: 1, duration: 1, ease: "power3.out" },
      );

      // Animate indicators
      gsap.to(".progress-bar", {
        width: "100%",
        duration: 5,
        ease: "linear",
        repeat: -1,
        // Note: If we want auto-advance we can add logic, but user asked for "click to change".
        // I'll leave auto-advance OUT as requested "click to change".
        paused: true, // Paused for now unless we add auto-play
      });
    },
    { dependencies: [activeIndex], scope: containerRef },
  );

  return (
    <section
      ref={containerRef}
      className="w-full py-10 bg-transparent relative z-10 px-6"
    >
      <div className="max-w-[1400px] mx-auto relative group">
        {/* Main Display Area */}
        <div className="relative w-full aspect-video md:aspect-21/9 rounded-sm overflow-hidden border border-white/10 bg-zinc-900 shadow-2xl">
          {BANNER_ITEMS.map((item, index) => (
            <div
              key={index}
              className={`absolute inset-0 w-full h-full transition-opacity duration-700 ${
                index === activeIndex ? "opacity-100 z-10" : "opacity-0 z-0"
              }`}
            >
              {item.type === "video" ? (
                <video
                  src={item.src}
                  className={`w-full h-full object-cover active-slide-media ${index === activeIndex ? "" : "paused"}`}
                  autoPlay
                  muted
                  loop
                  playsInline
                />
              ) : (
                <img
                  src={item.src}
                  alt={item.alt}
                  className="w-full h-full object-cover active-slide-media"
                />
              )}
            </div>
          ))}

          {/* Navigation Arrows (Visible on Hover/Always on Mobile) */}
          <button
            onClick={prevSlide}
            className="absolute left-4 cursor-pointer top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-black/30 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-pathfinder-green hover:text-black transition-all duration-300 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0"
            aria-label="Previous Slide"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 19.5 8.25 12l7.5-7.5"
              />
            </svg>
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-4 cursor-pointer top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-black/30 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-pathfinder-green hover:text-black transition-all duration-300 opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0"
            aria-label="Next Slide"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m8.25 4.5 7.5 7.5-7.5 7.5"
              />
            </svg>
          </button>

          {/* Indicators */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-3">
            {BANNER_ITEMS.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveIndex(idx)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-500 ${
                  idx === activeIndex
                    ? "bg-pathfinder-green w-8"
                    : "bg-white/30 hover:bg-white/60"
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
