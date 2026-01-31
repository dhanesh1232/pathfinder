"use client";

import { useEffect, useRef, useState } from "react";

const METRICS = [
  { label: "Projects Completed", value: 1000 },
  { label: "Happy Clients", value: 250 },
  { label: "Years Experience", value: 5 },
];

export default function Metrics() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.2 },
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full py-14 md:py-20 bg-transparent overflow-hidden"
    >
      <div className="relative z-10 max-w-6xl mx-auto px-6">
        {/* Metrics Grid */}
        <div
          className={`grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-16 mb-20 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          {METRICS.map((metric, index) => (
            <Counter
              key={index}
              end={metric.value}
              label={metric.label}
              startAnimating={isVisible}
              delay={index * 150}
            />
          ))}
        </div>

        {/* Why Pathfinder Section */}
        <div
          className={`max-w-4xl mx-auto text-center transition-all duration-1000 delay-300 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          {/* Decorative Line */}
          <div className="w-20 h-0.5 bg-linear-to-r from-transparent via-pathfinder-green to-transparent mx-auto mb-8" />

          <h2 className="text-white font-poppins text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 relative">
            <span className="relative inline-block">
              WHY PATHFINDER
              <div className="absolute -bottom-2 left-0 right-0 h-px bg-linear-to-r from-transparent via-pathfinder-green/30 to-transparent" />
            </span>
          </h2>

          <p className="text-white/70 text-base md:text-lg leading-relaxed font-light font-poppins max-w-3xl mx-auto">
            Pathfinder exists to help brands find clarity, direction, and
            growth—no matter their size. From early‑stage startups to
            large‑scale companies, we work closely with businesses at every
            stage of their journey, offering creative and digital solutions that
            are impactful and affordable.
          </p>

          <p className="text-white/70 text-base md:text-lg leading-relaxed font-light font-poppins max-w-3xl mx-auto mt-4">
            We believe great branding should not be limited by budgets, which is
            why our approach is flexible, honest, and focused on real value. By
            combining strategy, design, and execution under one roof, we guide
            brands along the right path—delivering work that is purposeful,
            scalable, and built to last.
          </p>

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
}: {
  end: number;
  label: string;
  startAnimating: boolean;
  delay?: number;
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
    <div className="group relative flex flex-col items-center gap-3 p-6 rounded-2xl transition-all duration-500">
      <div className="relative z-10 flex flex-col items-center gap-2">
        <span className="text-5xl md:text-6xl lg:text-7xl font-poppins font-bold bg-linear-to-br from-pathfinder-green via-pathfinder-green to-emerald-400 bg-clip-text text-transparent">
          {count.toLocaleString()}+
        </span>
        <span className="text-white/60 text-xs md:text-sm text-center text-wrap uppercase tracking-widest font-medium font-poppins">
          {label}
        </span>
      </div>
    </div>
  );
}
