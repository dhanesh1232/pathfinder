"use client";

import { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

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

// ─── Video Card ────────────────────────────────────────────────────────────────

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

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { threshold: 0.1, rootMargin: "200px" },
    );
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

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
      className="relative group shrink-0 w-[280px] md:w-[320px] aspect-9/16 rounded-2xl overflow-hidden bg-zinc-900 border border-white/5 transition-all duration-500 hover:border-pathfinder-green/50 hover:z-20 cursor-pointer"
    >
      <video
        ref={videoRef}
        src={item.src}
        muted
        loop
        playsInline
        preload="metadata"
        className="w-full h-full object-cover transition-all duration-500 opacity-80 grayscale group-hover:opacity-100 group-hover:grayscale-0"
      />
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

// ─── Main Section ──────────────────────────────────────────────────────────────

const CARD_WIDTH_PX = 320 + 32; // card + gap (md breakpoint)
const SPEED = 0.6; // px per frame

export default function OurWork({
  initialItems = [],
}: {
  initialItems?: any[];
}) {
  const trackRef = useRef<HTMLDivElement>(null);

  // Shared mutable state via refs — no re-renders
  const xRef = useRef(0);
  const isPaused = useRef(false);
  const isDragging = useRef(false);
  const dragStartClientX = useRef(0);
  const dragStartX = useRef(0);
  const rafRef = useRef<number | null>(null);

  const [workItems] = useState<any[]>(() => {
    if (initialItems && initialItems.length > 0) {
      return initialItems.map((item: any) => ({
        id: item._id,
        src: item.videoUrl,
        title: item.title,
        category: item.category || "Reel",
      }));
    }
    return WORK_ITEMS;
  });

  // ── RAF auto-scroll ──────────────────────────────────────────────────────────
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    // Wait one frame for layout so scrollWidth is accurate
    const startRaf = requestAnimationFrame(() => {
      const totalWidth = track.scrollWidth / 2;

      const tick = () => {
        if (!isPaused.current && !isDragging.current) {
          xRef.current -= SPEED;
          // Seamless loop: when we've scrolled one full set, reset
          if (xRef.current <= -totalWidth) {
            xRef.current += totalWidth;
          }
        }
        track.style.transform = `translateX(${xRef.current}px)`;
        rafRef.current = requestAnimationFrame(tick);
      };

      rafRef.current = requestAnimationFrame(tick);
    });

    return () => {
      cancelAnimationFrame(startRaf);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // ── Nav helpers ──────────────────────────────────────────────────────────────
  const wrap = (x: number) => {
    const track = trackRef.current;
    if (!track) return x;
    const totalWidth = track.scrollWidth / 2;
    // Keep x in range (-totalWidth, 0]
    while (x <= -totalWidth) x += totalWidth;
    while (x > 0) x -= totalWidth;
    return x;
  };

  const goNext = () => {
    xRef.current = wrap(xRef.current - CARD_WIDTH_PX);
    if (trackRef.current) {
      trackRef.current.style.transform = `translateX(${xRef.current}px)`;
    }
  };

  const goPrev = () => {
    xRef.current = wrap(xRef.current + CARD_WIDTH_PX);
    if (trackRef.current) {
      trackRef.current.style.transform = `translateX(${xRef.current}px)`;
    }
  };

  // ── Drag / pointer events ───────────────────────────────────────────────────
  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    isDragging.current = true;
    isPaused.current = true;
    dragStartClientX.current = e.clientX;
    dragStartX.current = xRef.current;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging.current) return;
    const dx = e.clientX - dragStartClientX.current;
    xRef.current = wrap(dragStartX.current + dx);
    if (trackRef.current) {
      trackRef.current.style.transform = `translateX(${xRef.current}px)`;
    }
  };

  const onPointerUp = () => {
    isDragging.current = false;
    isPaused.current = false;
  };

  const pauseMarquee = () => {
    isPaused.current = true;
  };

  const playMarquee = () => {
    isPaused.current = false;
  };

  return (
    <section className="relative w-full py-24 bg-black overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-zinc-900/40 via-black to-black opacity-50 pointer-events-none" />

      <div className="relative z-10 max-w-full">
        {/* Header */}
        <div className="px-6 lg:px-12 mb-16 flex flex-col lg:flex-row items-start justify-between gap-6">
          <div>
            <div className="w-full h-max flex items-start">
              <h2 className="font-poppins font-black text-2xl md:text-4xl lg:text-6xl tracking-tighter uppercase text-pathfinder-green">
                Visual Impact
              </h2>
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
        <div
          className="relative flex w-full overflow-hidden select-none"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          style={{ cursor: "grab" }}
        >
          {/* Track — doubled for seamless loop */}
          <div
            ref={trackRef}
            className="flex gap-4 md:gap-8 px-4 w-max will-change-transform"
          >
            {[...workItems, ...workItems].map((item, index) => (
              <VideoCard
                key={`${item.id}-${index}`}
                item={item}
                onHoverStart={pauseMarquee}
                onHoverEnd={playMarquee}
              />
            ))}
          </div>

          {/* Prev Arrow */}
          <button
            onClick={goPrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-black/40 backdrop-blur-md rounded-full border border-white/10 flex items-center justify-center text-white hover:bg-pathfinder-green hover:text-black transition-all duration-300"
            aria-label="Previous"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Next Arrow */}
          <button
            onClick={goNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-black/40 backdrop-blur-md rounded-full border border-white/10 flex items-center justify-center text-white hover:bg-pathfinder-green hover:text-black transition-all duration-300"
            aria-label="Next"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>
    </section>
  );
}
