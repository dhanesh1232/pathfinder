"use client";

import { ArrowRight, Loader2, Sparkles, CheckCircle2 } from "lucide-react";
import React, { useRef, useEffect, useState } from "react";

import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

const MARQUEE_LINES = [
  "At Pathfinder, we deliver end-to-end creative solutions designed to elevate brand value and drive real impact. From crafting strong content scripts that capture attention instantly, to producing high-quality, trend-aware shoots with a clear visual direction, every detail is planned with intention.",
  "We design unique and creative social media content that reflects brand identity, stands out without noise, and stays visually relevant over time. Our work extends to building clean, modern websites and landing pages that communicate clearly, feel premium, and perform seamlessly across devices.",
  "Every service we offer is guided by strategy, executed with precision, and delivered with consistency ensuring brands don’t just look good, but move forward with clarity, confidence, and measurable growth",
];

export default function ContactForm() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [messageLength, setMessageLength] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);

    const handleMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      el.style.setProperty("--x", `${x}px`);
      el.style.setProperty("--y", `${y}px`);
    };

    const handleMouseEnter = () => setIsHovering(true);
    const handleMouseLeave = () => setIsHovering(false);

    el.addEventListener("mousemove", handleMouseMove);
    el.addEventListener("mouseenter", handleMouseEnter);
    el.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("resize", checkMobile);
      el.removeEventListener("mousemove", handleMouseMove);
      el.removeEventListener("mouseenter", handleMouseEnter);
      el.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <section
      id="contact"
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
          select option {
            background-color: #000;
            color: #fff;
            padding: 10px;
          }
        `}
      </style>

      {/* Background Text Layers (Marquee) */}
      <div className="absolute inset-0 z-0 pointer-events-none flex flex-col justify-center h-full w-full overflow-hidden">
        <div className="absolute inset-0 flex flex-col justify-center gap-10 md:gap-20 select-none w-full opacity-0">
          {MARQUEE_LINES.map((line, i) => (
            <div
              key={i}
              className="flex gap-16 animate-marquee whitespace-nowrap w-[200%]"
            >
              <h2 className="text-[6vw] md:text-[5vw] font-normal leading-none text-black handwritten tracking-wide shrink-0">
                {line} — {line} —
              </h2>
              <h2 className="text-[6vw] md:text-[5vw] font-normal leading-none text-black handwritten tracking-wide shrink-0">
                {line} — {line} —
              </h2>
            </div>
          ))}
        </div>

        <div
          className={`absolute inset-0 flex flex-col justify-center gap-10 md:gap-20 select-none h-full w-full pointer-events-none transition-opacity duration-300 ${
            isMobile ? "opacity-30" : ""
          }`}
          style={{
            maskImage: isMobile
              ? "none"
              : `radial-gradient(circle ${
                  isHovering ? "400px" : "0px"
                } at var(--x) var(--y), black 10%, transparent 70%)`,
            WebkitMaskImage: isMobile
              ? "none"
              : `radial-gradient(circle ${
                  isHovering ? "400px" : "0px"
                } at var(--x) var(--y), black 10%, transparent 70%)`,
          }}
        >
          {MARQUEE_LINES.map((line, i) => (
            <div
              key={i}
              className="flex gap-16 animate-marquee whitespace-nowrap w-[200%]"
            >
              <h2 className="text-[6vw] md:text-[5vw] font-normal leading-none handwritten tracking-wide gold-sparkle-text drop-shadow-[0_0_15px_rgba(255,235,191,0.2)] shrink-0">
                {line} — {line} —
              </h2>
              <h2 className="text-[6vw] md:text-[5vw] font-normal leading-none handwritten tracking-wide gold-sparkle-text drop-shadow-[0_0_15px_rgba(255,235,191,0.2)] shrink-0">
                {line} — {line} —
              </h2>
            </div>
          ))}
        </div>
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
          <form
            className="space-y-8"
            action={async (formData) => {
              setIsPending(true);
              try {
                const data = Object.fromEntries(formData.entries());
                const response = await fetch("/api/contact", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(data),
                });
                const res = await response.json();

                setIsPending(false);
                if (res.error) {
                  toast.error(res.error);
                } else {
                  toast.success(res.message || "Message sent!");
                  (
                    document.getElementById("contact-form") as HTMLFormElement
                  )?.reset();
                }
              } catch (error) {
                setIsPending(false);
                toast.error("Something went wrong. Please try again later.");
              }
            }}
            id="contact-form"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Name */}
              <div className="space-y-2 group">
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="Name"
                  className="w-full bg-transparent border-b border-white/20 px-0 py-4 text-white focus:border-pathfinder-green focus:outline-none transition-colors placeholder:text-zinc-500 text-lg"
                />
              </div>
              {/* Email */}
              <div className="space-y-2 group">
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="Email"
                  className="w-full bg-transparent border-b border-white/20 px-0 py-4 text-white focus:border-pathfinder-green focus:outline-none transition-colors placeholder:text-zinc-500 text-lg"
                />
              </div>
              {/* Phone */}
              <div className="space-y-2 group">
                <input
                  type="tel"
                  name="phone"
                  required
                  placeholder="Phone"
                  className="w-full bg-transparent border-b border-white/20 px-0 py-4 text-white focus:border-pathfinder-green focus:outline-none transition-colors placeholder:text-zinc-500 text-lg"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* How did you find us */}
              <div className="space-y-2 relative group">
                <div className="relative">
                  <select
                    name="source"
                    className="w-full bg-transparent border-b border-white/20 px-0 py-4 text-white focus:border-pathfinder-green focus:outline-none appearance-none transition-colors text-lg"
                  >
                    <option className="bg-black" value="">
                      How did you find us?
                    </option>
                    <option
                      className="bg-black text-white"
                      value="Social Media"
                    >
                      Social Media
                    </option>
                    <option className="bg-black text-white" value="Referral">
                      Referral
                    </option>
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
                  name="website"
                  placeholder="What's your website?"
                  className="w-full bg-transparent border-b border-white/20 px-0 py-4 text-white focus:border-pathfinder-green focus:outline-none transition-colors placeholder:text-zinc-500 text-lg"
                />
              </div>
            </div>

            {/* Message */}
            <div className="space-y-2 group">
              <textarea
                name="message"
                required
                rows={1}
                placeholder="How can we help?"
                className="w-full bg-transparent border-b border-white/20 px-0 py-4 text-white focus:border-pathfinder-green focus:outline-none transition-colors resize-none placeholder:text-zinc-500 text-lg min-h-[60px]"
              />
            </div>

            {/* Submit Button Area */}
            <div className="pt-8 flex items-center gap-4">
              <button
                type="submit"
                disabled={isPending}
                className="bg-white text-black hover:bg-pathfinder-green transition-all ease-in-out duration-300 hover:text-white px-10 py-4 font-bold uppercase text-sm tracking-wider relative disabled:opacity-50 disabled:cursor-not-allowed min-w-[160px]"
                style={{
                  clipPath: "polygon(10% 0, 100% 0, 90% 100%, 0% 100%)",
                }}
              >
                {isPending ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Sending...
                  </span>
                ) : (
                  "Submit"
                )}
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
