"use client";

import { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Draggable } from "gsap/Draggable";
import {
  Play,
  Pause,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import LiquidHeading from "./ui/liquid-text";
import Link from "next/link";

// Register generally to capture early
gsap.registerPlugin(ScrollTrigger, Draggable);

const WORK_ITEMS = [
  {
    id: 1,
    src: "https://ik.imagekit.io/gclqlaadh/pathfinder/Reels/Reel-1_yTZBCnlXn.mp4?updatedAt=1770216808599",
    title: "Brand Motion",
    category: "Reel",
  },
  {
    id: 2,
    src: "https://ik.imagekit.io/gclqlaadh/pathfinder/Reels/Reel-2_gG-28ILIb.mp4?updatedAt=1770216805652",
    title: "Visual Storytelling",
    category: "Production",
  },
  {
    id: 3,
    src: "https://ik.imagekit.io/gclqlaadh/pathfinder/Reels/Reel-3_2lH6-BtUK.mp4?updatedAt=1770216807363",
    title: "Dynamic Edits",
    category: "Social Media",
  },
  {
    id: 4,
    src: "https://ik.imagekit.io/gclqlaadh/pathfinder/Reels/Reel-4_fQ-R5BTHi.mp4?updatedAt=1770216804878",
    title: "Cinematic Cuts",
    category: "Campaign",
  },
  {
    id: 5,
    src: "https://ik.imagekit.io/gclqlaadh/pathfinder/Reels/Reel-5_tE3GC-9i4X.mp4?updatedAt=1770216811133",
    title: "Creative Direction",
    category: "Identity",
  },
  {
    id: 6,
    src: "https://ik.imagekit.io/gclqlaadh/pathfinder/Reels/Reel-6_Xj_2R3_lf.mp4?updatedAt=1770216813755",
    title: "Motion Graphics",
    category: "Animation",
  },
  {
    id: 7,
    src: "https://ik.imagekit.io/gclqlaadh/pathfinder/Reels/celeberaty%201_H1Kh2W-P1.mp4?updatedAt=1770216838139",
    title: "Celebrity Shoot",
    category: "Production",
  },
  {
    id: 8,
    src: "https://ik.imagekit.io/gclqlaadh/pathfinder/Reels/elan%20reel%20eyebrow_Af7bY6E7-.mp4?updatedAt=1770216848543",
    title: "Elan Beauty",
    category: "Commercial",
  },
  {
    id: 9,
    src: "https://ik.imagekit.io/gclqlaadh/pathfinder/Reels/elan%20reel%20hair_ZfxDyHQmf.mp4?updatedAt=1770216855489",
    title: "Elan Hair",
    category: "Commercial",
  },
];

const VideoCard = ({
  item,
  onHoverStart,
  onHoverEnd,
}: {
  item: (typeof WORK_ITEMS)[0];
  onHoverStart: () => void;
  onHoverEnd: () => void;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isInView, setIsInView] = useState(false);

  // Optimize: Play when in/near viewport with margin
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      {
        threshold: 0.1, // Lower threshold
        rootMargin: "200px", // Preload/Play before entering screen to prevent pausing
      },
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Sync Video State with Viewport
  useEffect(() => {
    if (!videoRef.current) return;

    if (isInView) {
      videoRef.current.play().catch(() => {});
    } else {
      videoRef.current.pause();
    }
  }, [isInView]);

  return (
    <div
      ref={containerRef}
      onMouseEnter={onHoverStart}
      onMouseLeave={onHoverEnd}
      className="relative group w-[280px] md:w-[320px] aspect-9/16 rounded-2xl overflow-hidden bg-zinc-900 border border-white/5 transition-all duration-500 hover:border-pathfinder-green/50 hover:z-20 cursor-pointer"
    >
      {/* Video */}
      <video
        ref={videoRef}
        src={item.src}
        muted
        loop
        playsInline
        preload="metadata" // Changed to metadata for smoother start
        className="w-full h-full object-cover transition-all duration-500 opacity-80 grayscale group-hover:opacity-100 group-hover:grayscale-0"
      />

      {/* Overlay Content */}
      <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-transparent transition-opacity duration-300 flex flex-col justify-end p-6 pointer-events-none opacity-0 group-hover:opacity-100">
        <span className="text-pathfinder-green text-xs font-bold uppercase tracking-widest mb-1 translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75">
          {item.category}
        </span>
        <h3 className="text-white text-xl font-bold translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-100">
          {item.title}
        </h3>
      </div>
    </div>
  );
};

export default function OurWork() {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const marqueeTween = useRef<gsap.core.Tween | null>(null);

  useEffect(() => {
    // Marquee Effect
    if (scrollerRef.current) {
      const scrollerContent = scrollerRef.current;

      marqueeTween.current = gsap.to(scrollerContent, {
        xPercent: -50,
        ease: "none",
        duration: 40, // Adjust speed
        repeat: -1,
      });

      marqueeTween.current.timeScale(1);

      // Drag Implementation
      const proxy = document.createElement("div");
      const tracker = Draggable.create(proxy, {
        trigger: scrollerContent,
        type: "x",
        inertia: false, // Standard drag
        onPress: () => {
          marqueeTween.current?.pause();
        },
        onDrag: function () {
          const tween = marqueeTween.current;
          if (!tween) return;

          // The marquee moves 50% of the total width (because of duplicated items)
          // So one full cycle = scrollWidth / 2
          const cycleWidth = scrollerContent.scrollWidth / 2;

          // -deltaX because moving mouse LEFT (negative) should advance animation (move content LEFT)
          const progressChange = -this.deltaX / cycleWidth;

          const newProgress = tween.progress() + progressChange;

          // Wrap between 0 and 1
          tween.progress(gsap.utils.wrap(0, 1, newProgress));
        },
        onRelease: () => {
          // We'll let the hover handlers control play/pause primarily,
          // but we should ensure it plays if we dragged out and released outside
          marqueeTween.current?.play();
        },
      })[0];

      return () => {
        marqueeTween.current?.kill();
        tracker.kill();
      };
    }
  }, []);

  const pauseMarquee = () => marqueeTween.current?.pause();
  const playMarquee = () => marqueeTween.current?.play();

  return (
    <section
      className="relative w-full py-24 bg-black overflow-hidden"
      ref={containerRef}
    >
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-zinc-900/40 via-black to-black opacity-50 pointer-events-none" />

      <div className="relative z-10 max-w-full">
        {/* Header */}
        <div className="px-6 lg:px-12 mb-16 flex flex-col lg:flex-row items-start justify-between gap-6">
          <div>
            {/* <h2 className="text-4xl lg:text-5xl font-black text-white uppercase tracking-tighter mb-2">
              Visual <span className="text-pathfinder-green">Impact</span>
            </h2> */}
            <div className="w-full h-max flex items-center justify-center pointer-events-none select-none">
              <LiquidHeading
                text="VISUAL IMPACT"
                videoSrc="https://cdn.pixabay.com/video/2024/05/25/213616_large.mp4"
                size="120"
                weight="700"
              />
            </div>
            <div className="w-full h-px my-2 bg-linear-to-r from-transparent via-pathfinder-green to-transparent" />
            <p className="text-zinc-400 font-nohemi text-base lg:text-lg max-w-xl">
              Dynamic reels and productions that capture attention.
            </p>
          </div>

          <Link
            href="https://www.instagram.com/thepathfinder.agency?igsh=cm1tcmVpbzRwZm53&utm_source=qr"
            target="_blank"
            className="group relative inline-flex items-center self-end gap-3 px-6 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full backdrop-blur-md transition-all duration-300"
          >
            <span className="text-white text-sm font-medium tracking-wide uppercase">
              View Instagram
            </span>
            <span className="w-2 h-2 rounded-full bg-pathfinder-green shadow-[0_0_10px_rgba(46,204,113,0.8)] group-hover:scale-125 transition-transform duration-300" />
          </Link>
        </div>

        {/* Infinite Scroller */}
        <div className="flex w-full overflow-hidden relative">
          <div ref={scrollerRef} className="flex gap-4 md:gap-8 px-4 w-max">
            {/* Render Double for Loop */}
            {[...WORK_ITEMS, ...WORK_ITEMS].map((item, index) => {
              const uniqueId = `${item.id}-${index}`;
              return (
                <VideoCard
                  key={uniqueId}
                  item={item}
                  onHoverStart={pauseMarquee}
                  onHoverEnd={playMarquee}
                />
              );
            })}
          </div>

          {/* Navigation Controls - Visible on Hover/Always on Mobile */}
          <button
            onClick={() => {
              const total = WORK_ITEMS.length;
              const currentProgress = marqueeTween.current?.progress() || 0;
              const step = 1 / total;
              const target = Math.round(currentProgress * total - 1) * step;
              gsap.to(marqueeTween.current, {
                progress: target,
                duration: 0.5,
                ease: "power2.out",
              });
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-black/20 backdrop-blur-md rounded-full border border-white/10 flex items-center justify-center text-white hover:bg-pathfinder-green hover:text-black transition-all duration-300 pointer-events-auto"
            aria-label="Previous Slide"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={() => {
              const total = WORK_ITEMS.length;
              const currentProgress = marqueeTween.current?.progress() || 0;
              const step = 1 / total;
              const target = Math.round(currentProgress * total + 1) * step;
              gsap.to(marqueeTween.current, {
                progress: target,
                duration: 0.5,
                ease: "power2.out",
              });
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-black/20 backdrop-blur-md rounded-full border border-white/10 flex items-center justify-center text-white hover:bg-pathfinder-green hover:text-black transition-all duration-300 pointer-events-auto"
            aria-label="Next Slide"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>
    </section>
  );
}
