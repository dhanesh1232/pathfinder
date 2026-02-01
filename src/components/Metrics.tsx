"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const METRICS = [
  { label: "Projects Completed", value: 1000 },
  { label: "Happy Clients", value: 250 },
  { label: "Years Experience", value: 5 },
];

const WHY_TEXT_1 =
  "Pathfinder exists to help brands find clarity, direction, and growth—no matter their size. From early‑stage startups to large‑scale companies, we work closely with businesses at every stage of their journey, offering creative and digital solutions that are impactful and affordable.";

const WHY_TEXT_2 =
  "We believe great branding should not be limited by budgets, which is why our approach is flexible, honest, and focused on real value. By combining strategy, design, and execution under one roof, we guide brands along the right path—delivering work that is purposeful, scalable, and built to last.";

export default function Metrics() {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // 0. Trigger Metrics Counter
      ScrollTrigger.create({
        trigger: ".metrics-grid",
        start: "top 85%",
        onEnter: () => setIsVisible(true),
        onLeave: () => setIsVisible(false),
        onEnterBack: () => setIsVisible(true),
        onLeaveBack: () => setIsVisible(false),
      });

      // 1. Header Char Reveal (WHY PATHFINDER)
      gsap.fromTo(
        ".why-char",
        { yPercent: 100 },
        {
          yPercent: 0,
          duration: 0.3,
          ease: "power2.out",
          stagger: 0.02,
          scrollTrigger: {
            trigger: ".why-header",
            start: "top 85%",
            toggleActions: "play reverse play reverse",
          },
        },
      );

      // 2. Description Char Reveal
      gsap.fromTo(
        ".why-char-desc",
        { yPercent: 100 },
        {
          yPercent: 0,
          duration: 0.3,
          ease: "power2.out",
          stagger: 0.005,
          scrollTrigger: {
            trigger: ".why-content",
            start: "top 85%",
            toggleActions: "play reverse play reverse",
          },
        },
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative w-full py-14 md:py-20 bg-transparent overflow-hidden"
    >
      <div className="relative z-10 max-w-6xl mx-auto px-6">
        {/* Metrics Grid */}
        <div className="metrics-grid grid grid-cols-2 sm:grid-cols-3 gap-8 md:gap-16 mb-20 transition-all duration-1000 max-w-4xl mx-auto">
          {METRICS.map((metric, index) => (
            <Counter
              key={index}
              end={metric.value}
              label={metric.label}
              startAnimating={isVisible}
              delay={index * 150}
              className={index === 2 ? "col-span-2 sm:col-span-1" : ""}
            />
          ))}
        </div>

        {/* Why Pathfinder Section */}
        <div className="max-w-4xl mx-auto text-center">
          {/* Decorative Line */}
          <div className="w-20 h-0.5 bg-linear-to-r from-transparent via-pathfinder-green to-transparent mx-auto mb-8" />

          {/* Animated Header */}
          <h2 className="why-header flex flex-col items-center gap-x-4 text-white font-poppins text-5xl md:text-7xl lg:text-9xl font-bold tracking-tight mb-8 relative">
            <div className="inline-block whitespace-nowrap">
              {"WHY".split("").map((char, i) => (
                <div key={i} className="overflow-hidden inline-block">
                  <span className="why-char inline-block">{char}</span>
                </div>
              ))}
            </div>
            <div className="inline-block whitespace-nowrap">
              {"PATHFINDER".split("").map((char, i) => (
                <div key={i} className="overflow-hidden inline-block">
                  <span className="why-char inline-block">{char}</span>
                </div>
              ))}
            </div>
            <div className="absolute -bottom-2 left-0 right-0 h-px bg-linear-to-r from-transparent via-pathfinder-green/30 to-transparent" />
          </h2>

          {/* Animated Description */}
          <div className="why-content text-white/70 text-base md:text-lg leading-relaxed font-light font-nohemi max-w-3xl mx-auto">
            <div className="mb-4">
              {WHY_TEXT_1.split(" ").map((word, i) => (
                <span key={i} className="inline-block whitespace-nowrap mr-1.5">
                  {word.split("").map((char, j) => (
                    <span
                      key={j}
                      className="overflow-hidden inline-block align-bottom"
                    >
                      <span className="why-char-desc inline-block">{char}</span>
                    </span>
                  ))}
                </span>
              ))}
            </div>
            <div>
              {WHY_TEXT_2.split(" ").map((word, i) => (
                <span key={i} className="inline-block whitespace-nowrap mr-1.5">
                  {word.split("").map((char, j) => (
                    <span
                      key={j}
                      className="overflow-hidden inline-block align-bottom"
                    >
                      <span className="why-char-desc inline-block">{char}</span>
                    </span>
                  ))}
                </span>
              ))}
            </div>
          </div>

          {/* Decorative Bottom Element */}
          <div className="mt-10 flex items-center justify-center gap-2">
            <div className="w-2 h-2 rounded-full bg-pathfinder-green/50" />
            <div className="w-2 h-2 rounded-full bg-pathfinder-green" />
            <div className="w-2 h-2 rounded-full bg-pathfinder-green/50" />
          </div>
        </div>
      </div>
    </section>
  );
}

function Counter({
  end,
  label,
  startAnimating,
  delay = 0,
  className = "",
}: {
  end: number;
  label: string;
  startAnimating: boolean;
  delay?: number;
  className?: string;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let timer: any;
    let startTimer: any;

    if (startAnimating) {
      startTimer = setTimeout(() => {
        let start = 0;
        const duration = 2500;
        const increment = end / (duration / 16);

        timer = setInterval(() => {
          start += increment;
          if (start >= end) {
            setCount(end);
            clearInterval(timer);
          } else {
            setCount(Math.floor(start));
          }
        }, 16);
      }, delay);
    } else {
      // Reset counter when out of view so it can replay
      setCount(0);
    }

    return () => {
      clearTimeout(startTimer);
      clearInterval(timer);
    };
  }, [startAnimating, end, delay]);

  return (
    <div
      className={`group relative flex flex-col items-center gap-3 p-6 rounded-2xl transition-all duration-500 ${className}`}
    >
      <div className="relative z-10 flex flex-col items-center gap-2">
        <span className="text-5xl md:text-6xl lg:text-7xl font-poppins font-bold bg-linear-to-br from-pathfinder-green via-pathfinder-green to-emerald-400 bg-clip-text text-transparent">
          {count.toLocaleString()}+
        </span>
        <span className="text-white/60 text-xs md:text-sm text-center text-wrap uppercase tracking-widest font-medium font-aalto">
          {label}
        </span>
      </div>
    </div>
  );
}
