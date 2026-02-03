"use client";

import { ArrowRight } from "lucide-react";
import React, { useRef, useEffect, useState } from "react";

const SparkleTrail = ({
  parentRef,
}: {
  parentRef: React.RefObject<HTMLDivElement | null>;
}) => {
  const [sparkles, setSparkles] = useState<
    { id: number; x: number; y: number; age: number }[]
  >([]);

  useEffect(() => {
    const el = parentRef.current;
    if (!el) return;

    let cleanup = false;

    const handleMouseMove = (e: MouseEvent) => {
      if (cleanup) return;
      const target = e.target as HTMLElement;
      if (target.closest("form")) return;

      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      setSparkles((prev) => [...prev, { id: Math.random(), x, y, age: 0 }]);
    };

    el.addEventListener("mousemove", handleMouseMove);

    const interval = setInterval(() => {
      if (cleanup) return;
      setSparkles((prev) => {
        const updated = prev
          .map((p) => ({ ...p, age: p.age + 1 }))
          .filter((p) => p.age < 20); // Keep max 20 frames
        return updated;
      });
    }, 30);

    return () => {
      cleanup = true;
      el.removeEventListener("mousemove", handleMouseMove);
      clearInterval(interval);
    };
  }, [parentRef]);

  return (
    <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden">
      {sparkles.map((s) => (
        <div
          key={s.id}
          className="absolute"
          style={{
            left: s.x,
            top: s.y,
            opacity: 1 - s.age / 20,
            transform: `translate(-50%, -50%) scale(${1 - s.age / 20})`,
            transition: "opacity 0.03s linear, transform 0.03s linear",
          }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="#D4AF37">
            <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
          </svg>
        </div>
      ))}
    </div>
  );
};

export default function ContactForm() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isInsideForm, setIsInsideForm] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      el.style.setProperty("--x", `${x}px`);
      el.style.setProperty("--y", `${y}px`);

      const target = e.target as HTMLElement;
      setIsInsideForm(!!target.closest("form"));
    };

    const handleMouseEnter = () => setIsHovering(true);
    const handleMouseLeave = () => setIsHovering(false);

    el.addEventListener("mousemove", handleMouseMove);
    el.addEventListener("mouseenter", handleMouseEnter);
    el.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      el.removeEventListener("mousemove", handleMouseMove);
      el.removeEventListener("mouseenter", handleMouseEnter);
      el.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative w-full min-h-screen bg-black flex items-center justify-center overflow-hidden py-20"
      style={{ "--x": "50%", "--y": "50%" } as React.CSSProperties}
    >
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Mrs+Saint+Delafield&display=swap');
          @keyframes sparkle {
            0% { background-position: 0% 50%; }
            100% { background-position: 100% 50%; }
          }
          @keyframes marquee {
            0% { transform: translateX(0%); }
            100% { transform: translateX(-50%); }
          }
          .handwritten {
            font-family: 'Mrs Saint Delafield', cursive;
          }
          .gold-sparkle-text {
            background: linear-gradient(90deg, #b58153, #ffebbf, #b58153);
            background-size: 200% auto;
            color: transparent;
            -webkit-background-clip: text;
            background-clip: text;
            animation: sparkle 3s linear infinite;
          }
          .animate-marquee {
            animation: marquee 30s linear infinite;
          }
        `}
      </style>

      {/* Sparkle Trail */}
      <SparkleTrail parentRef={containerRef} />

      {/* Background Text Layers (Marquee) */}
      <div className="absolute inset-0 z-0 pointer-events-none flex flex-col justify-center h-full w-full overflow-hidden">
        {/* Layer 1: Hidden Text (Base Layout - Black) */}
        <div className="absolute inset-0 flex items-center select-none w-full">
          <div className="flex gap-16 animate-marquee whitespace-nowrap w-[200%]">
            <h2 className="text-[15vw] font-normal leading-none text-black handwritten tracking-wide shrink-0">
              Let's Create A Bigger Story Together — Let's Create A Bigger Story
              Together —
            </h2>
            <h2 className="text-[15vw] font-normal leading-none text-black handwritten tracking-wide shrink-0">
              Let's Create A Bigger Story Together — Let's Create A Bigger Story
              Together —
            </h2>
          </div>
        </div>

        {/* Layer 2: Reveal Text (Gradient) - Soft Mask Reveal */}
        <div
          className="absolute inset-0 flex items-center select-none h-full w-full pointer-events-none transition-opacity duration-300"
          style={{
            maskImage: `radial-gradient(circle ${
              isHovering ? "400px" : "0px"
            } at var(--x) var(--y), black 10%, transparent 70%)`,
            WebkitMaskImage: `radial-gradient(circle ${
              isHovering ? "400px" : "0px"
            } at var(--x) var(--y), black 10%, transparent 70%)`,
          }}
        >
          <div className="flex gap-16 animate-marquee whitespace-nowrap w-[200%]">
            <h2 className="text-[15vw] font-normal leading-none handwritten tracking-wide gold-sparkle-text drop-shadow-[0_0_15px_rgba(255,235,191,0.2)] shrink-0">
              Let's Create A Bigger Story Together — Let's Create A Bigger Story
              Together —
            </h2>
            <h2 className="text-[15vw] font-normal leading-none handwritten tracking-wide gold-sparkle-text drop-shadow-[0_0_15px_rgba(255,235,191,0.2)] shrink-0">
              Let's Create A Bigger Story Together — Let's Create A Bigger Story
              Together —
            </h2>
          </div>
        </div>
      </div>

      {/* Custom Gold Star Cursor */}
      <div
        className={`absolute pointer-events-none z-50 transition-opacity duration-300 ${
          isHovering && !isInsideForm ? "opacity-100" : "opacity-0"
        }`}
        style={{
          left: "var(--x)",
          top: "var(--y)",
          transform: "translate(-50%, -50%)",
        }}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="#D4AF37"
          className="drop-shadow-[0_0_10px_rgba(212,175,55,0.8)] animate-spin-slow"
          style={{ animationDuration: "3s" }}
        >
          <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
        </svg>
      </div>

      {/* Form Container */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-4 mt-20">
        {/* Header Text */}
        <div className="mb-8 text-center text-white/50">
          <h2 className="text-4xl md:text-6xl handwritten tracking-wide">
            Let&apos;s build a Bigger story together
          </h2>
        </div>

        {/* Tabs */}
        <div className="flex mb-0">
          <span
            role="cell"
            aria-label="Send an inquiry"
            className={`px-12 py-4 text-sm font-medium transition-colors uppercase tracking-widest bg-pathfinder-green text-black relative z-20 cursor-pointer`}
            style={{
              clipPath: "polygon(10% 0, 100% 0, 90% 100%, 0% 100%)",
            }}
          >
            Send an inquiry
          </span>
        </div>

        {/* Form Box */}
        <div className="border border-white/10 p-8 md:p-12 backdrop-blur-md bg-black/60 shadow-2xl">
          <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Name */}
              <div className="space-y-2 group">
                <input
                  type="text"
                  placeholder="Name"
                  className="w-full bg-transparent border-b border-white/20 px-0 py-4 text-white focus:border-pathfinder-green focus:outline-none transition-colors placeholder:text-zinc-500 text-lg"
                />
              </div>
              {/* Email */}
              <div className="space-y-2 group">
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full bg-transparent border-b border-white/20 px-0 py-4 text-white focus:border-pathfinder-green focus:outline-none transition-colors placeholder:text-zinc-500 text-lg"
                />
              </div>
              {/* Phone */}
              <div className="space-y-2 group">
                <input
                  type="tel"
                  placeholder="Phone"
                  className="w-full bg-transparent border-b border-white/20 px-0 py-4 text-white focus:border-pathfinder-green focus:outline-none transition-colors placeholder:text-zinc-500 text-lg"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* How did you find us */}
              <div className="space-y-2 relative group">
                <div className="relative">
                  <select className="w-full bg-transparent border-b border-white/20 px-0 py-4 text-white focus:border-pathfinder-green focus:outline-none appearance-none transition-colors text-lg">
                    <option className="bg-black">How did you find us?</option>
                    <option className="bg-black text-white">
                      Social Media
                    </option>
                    <option className="bg-black text-white">Referral</option>
                  </select>
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-[#D4AF37]">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </div>
                </div>
              </div>
              {/* Website */}
              <div className="space-y-2 group">
                <input
                  type="text"
                  placeholder="What's your website?"
                  className="w-full bg-transparent border-b border-white/20 px-0 py-4 text-white focus:border-pathfinder-green focus:outline-none transition-colors placeholder:text-zinc-500 text-lg"
                />
              </div>
            </div>

            {/* Message */}
            <div className="space-y-2 group">
              <textarea
                rows={1}
                placeholder="How can we help?"
                className="w-full bg-transparent border-b border-white/20 px-0 py-4 text-white focus:border-pathfinder-green focus:outline-none transition-colors resize-none placeholder:text-zinc-500 text-lg min-h-[60px]"
              />
            </div>

            {/* Submit Button Area */}
            <div className="pt-8 flex items-center gap-4">
              <button
                type="submit"
                className="bg-white text-black px-10 py-4 font-bold uppercase text-sm tracking-wider hover:bg-gray-200 transition-colors relative"
                style={{
                  clipPath: "polygon(0 0, 100% 0, 90% 100%, 0% 100%)",
                }}
              >
                Submit
              </button>
              <button
                type="button"
                className="w-12 h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-pathfinder-green hover:text-black text-white transition-all border border-white/10"
              >
                <ArrowRight className="w-6 h-6" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
