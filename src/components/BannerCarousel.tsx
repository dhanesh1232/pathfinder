"use client";

import { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";
import { ChevronLeft, ChevronRight } from "lucide-react";

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

const SlideItem = ({
  item,
  isActive,
  isInView,
}: {
  item: (typeof BANNER_ITEMS)[0];
  isActive: boolean;
  isInView: boolean;
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (item.type !== "video" || !videoRef.current) return;

    if (isActive && isInView) {
      videoRef.current.play().catch(() => {});
    } else {
      videoRef.current.pause();
    }
  }, [isActive, isInView, item.type]);

  return (
    <div
      className={`absolute inset-0 w-full h-full transition-opacity duration-700 ${
        isActive ? "opacity-100 z-10" : "opacity-0 z-0"
      }`}
    >
      {item.type === "video" ? (
        <video
          ref={videoRef}
          src={item.src}
          className="w-full h-full object-cover active-slide-media"
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
  );
};

export default function BannerCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(true);

  const nextSlide = () => {
    setActiveIndex((prev) => (prev + 1) % BANNER_ITEMS.length);
  };

  const prevSlide = () => {
    setActiveIndex(
      (prev) => (prev - 1 + BANNER_ITEMS.length) % BANNER_ITEMS.length,
    );
  };

  // Intersection Observer to stop playback when out of view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.1 },
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

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
        paused: true,
      });
    },
    { dependencies: [activeIndex], scope: containerRef },
  );

  return (
    <section
      ref={containerRef}
      className="w-full h-screen bg-black relative z-10 p-0 m-0 overflow-hidden"
    >
      <div className="w-full h-full relative group">
        {/* Main Display Area */}
        <div className="relative w-full h-full overflow-hidden bg-zinc-900">
          {BANNER_ITEMS.map((item, index) => (
            <SlideItem
              key={index}
              item={item}
              isActive={index === activeIndex}
              isInView={isInView}
            />
          ))}

          {/* Navigation Arrows (Visible on Hover/Always on Mobile) */}
          <button
            onClick={prevSlide}
            className="absolute left-4 cursor-pointer top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-black/20 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-pathfinder-green hover:text-black transition-all duration-300 opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0"
            aria-label="Previous Slide"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-4 cursor-pointer top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-black/20 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-pathfinder-green hover:text-black transition-all duration-300 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0"
            aria-label="Next Slide"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Indicators */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex gap-4">
            {BANNER_ITEMS.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveIndex(idx)}
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  idx === activeIndex
                    ? "bg-pathfinder-green w-12"
                    : "bg-white/30 w-12 hover:bg-white/60"
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
