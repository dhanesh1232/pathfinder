"use client";

import { useEffect, useRef, useState } from "react";

const METRICS = [
  { label: "Projects Completed", value: 1000 },
  { label: "Happy Clients", value: 200 },
  { label: "Awards Won", value: 15 },
  { label: "Years Experience", value: 10 },
];

export default function Metrics() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 },
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="w-full py-32 bg-transparent flex flex-col items-center justify-center"
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-24 text-center">
        {METRICS.map((metric, index) => (
          <Counter
            key={index}
            end={metric.value}
            label={metric.label}
            startAnimating={isVisible}
          />
        ))}
      </div>
    </section>
  );
}

function Counter({
  end,
  label,
  startAnimating,
}: {
  end: number;
  label: string;
  startAnimating: boolean;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!startAnimating) return;

    let start = 0;
    const duration = 2000;
    const increment = end / (duration / 16); // 60fps approx

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [startAnimating, end]);

  return (
    <div className="flex flex-col items-center gap-2">
      <span className="text-4xl md:text-6xl font-playfair text-pathfinder-green font-bold">
        {count}+
      </span>
      <span className="text-white/60 text-sm uppercase tracking-wider">
        {label}
      </span>
    </div>
  );
}
