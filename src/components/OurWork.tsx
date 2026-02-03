"use client";

import { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Play, Pause, ArrowUpRight } from "lucide-react";

const WORK_ITEMS = [
  {
    id: 1,
    src: "/video/Reels/Reel-1.mp4",
    title: "Brand Motion",
    category: "Reel",
  },
  {
    id: 2,
    src: "/video/Reels/Reel-2.mp4",
    title: "Visual Storytelling",
    category: "Production",
  },
  {
    id: 3,
    src: "/video/Reels/Reel-3.mp4",
    title: "Dynamic Edits",
    category: "Social Media",
  },
  {
    id: 4,
    src: "/video/Reels/Reel-4.mp4",
    title: "Cinematic Cuts",
    category: "Campaign",
  },
  {
    id: 5,
    src: "/video/Reels/Reel-5.mp4",
    title: "Creative Direction",
    category: "Identity",
  },
  {
    id: 6,
    src: "/video/Reels/Reel-6.mp4",
    title: "Motion Graphics",
    category: "Animation",
  },
  {
    id: 7,
    src: "/video/Reels/celeberaty 1.mp4",
    title: "Celebrity Shoot",
    category: "Production",
  },
  {
    id: 8,
    src: "/video/Reels/elan reel eyebrow.mp4",
    title: "Elan Beauty",
    category: "Commercial",
  },
  {
    id: 9,
    src: "/video/Reels/elan reel hair.mp4",
    title: "Elan Hair",
    category: "Commercial",
  },
];

// Video Card Component for Individual interactions
const VideoCard = ({
  item,
  uniqueId,
  activeId,
  setActiveId,
}: {
  item: (typeof WORK_ITEMS)[0];
  uniqueId: string;
  activeId: string | null;
  setActiveId: (id: string | null) => void;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isInView, setIsInView] = useState(false);
  const isPlaying = activeId === uniqueId;

  // Optimize: Only play when in viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.2 }, // 20% visible to start/stop
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Sync Video State with Active ID & Viewport
  useEffect(() => {
    if (!videoRef.current) return;

    if (!isInView) {
      videoRef.current.pause();
      return;
    }

    if (isPlaying) {
      videoRef.current.muted = false;
      videoRef.current.play().catch(() => {});
    } else {
      videoRef.current.muted = true;
      videoRef.current.play().catch(() => {});
    }
  }, [isPlaying, isInView]);

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isPlaying) {
      setActiveId(null); // Pause (revert to background loop)
    } else {
      setActiveId(uniqueId); // Play this one
    }
  };

  return (
    <div
      ref={containerRef}
      onClick={togglePlay}
      className={`relative group w-[280px] md:w-[320px] aspect-9/16 rounded-2xl overflow-hidden bg-zinc-900 border border-white/5 transition-all duration-500 hover:border-pathfinder-green/50 hover:z-20 cursor-pointer ${
        isPlaying
          ? "z-20 border-pathfinder-green ring-1 ring-pathfinder-green/50"
          : ""
      }`}
    >
      {/* Video */}
      <video
        ref={videoRef}
        src={item.src}
        muted={!isPlaying}
        loop
        playsInline
        // autoPlay removed, controlled by effect
        className={`w-full h-full object-cover transition-all duration-500 ${
          isPlaying
            ? "opacity-100 grayscale-0"
            : "opacity-60 grayscale group-hover:opacity-100 group-hover:grayscale-0"
        }`}
      />

      {/* Overlay Content */}
      <div
        className={`absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-transparent transition-opacity duration-300 flex flex-col justify-end p-6 pointer-events-none ${
          isPlaying
            ? "opacity-0 group-hover:opacity-100"
            : "opacity-0 group-hover:opacity-100"
        }`}
      >
        <span className="text-pathfinder-green text-xs font-bold uppercase tracking-widest mb-1 translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75">
          {item.category}
        </span>
        <h3 className="text-white text-xl font-bold translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-100">
          {item.title}
        </h3>
      </div>

      {/* Play/Pause Icon Center */}
      <div
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center transition-all duration-300 border border-white/20 ${
          isPlaying
            ? "opacity-0 group-hover:opacity-100 scale-100"
            : "opacity-0 group-hover:opacity-100 scale-50 group-hover:scale-100"
        }`}
      >
        {isPlaying ? (
          <Pause className="w-6 h-6 text-white fill-current" />
        ) : (
          <Play className="w-6 h-6 text-white fill-current" />
        )}
      </div>
    </div>
  );
};

export default function OurWork() {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Marquee Effect
    if (scrollerRef.current) {
      const scrollerContent = scrollerRef.current;

      gsap
        .to(scrollerContent, {
          xPercent: -50,
          ease: "none",
          duration: 40, // Adjust speed
          repeat: -1,
        })
        .timeScale(1); // Normal speed
    }
  }, []);

  // Handle Hover Slowdown
  useEffect(() => {
    const anims = gsap.getTweensOf(scrollerRef.current);
    if (anims.length > 0) {
      gsap.to(anims[0], {
        timeScale: activeId ? 0 : 1, // Stop scroll ONLY if active (playing), not on hover
        duration: 0.5,
      });
    }
  }, [isHovering, activeId]);

  return (
    <section
      className="relative w-full py-24 bg-black overflow-hidden"
      ref={containerRef}
    >
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-zinc-900/40 via-black to-black opacity-50 pointer-events-none" />

      <div className="relative z-10 max-w-full">
        {/* Header */}
        <div className="px-6 md:px-12 mb-16 flex flex-col md:flex-row items-end justify-between gap-6">
          <div>
            <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter mb-2">
              Visual <span className="text-pathfinder-green">Impact</span>
            </h2>
            <p className="text-zinc-400 font-nohemi text-lg max-w-xl">
              Dynamic reels and productions that capture attention.
            </p>
          </div>

          {/* Decoration Line */}
          <div className="flex-1 h-px bg-white/10 mb-4 hidden md:block mx-12" />

          <a
            href="https://www.instagram.com/pathfinder.vizag/"
            target="_blank"
            className="text-sm font-aalto uppercase tracking-widest text-pathfinder-green hover:text-white transition-colors flex items-center gap-2"
          >
            View Instagram <ArrowUpRight className="w-4 h-4" />
          </a>
        </div>

        {/* Infinite Scroller */}
        <div
          className="flex w-full overflow-hidden"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          <div ref={scrollerRef} className="flex gap-4 md:gap-8 px-4 w-max">
            {/* Render Double for Loop */}
            {[...WORK_ITEMS, ...WORK_ITEMS].map((item, index) => {
              const uniqueId = `${item.id}-${index}`;
              return (
                <VideoCard
                  key={uniqueId}
                  uniqueId={uniqueId}
                  item={item}
                  activeId={activeId}
                  setActiveId={setActiveId}
                />
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
