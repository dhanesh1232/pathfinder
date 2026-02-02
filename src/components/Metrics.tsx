"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const METRICS = [
  { label: "Projects Completed", value: 1000 },
  { label: "Happy Clients", value: 250 },
  { label: "Years Experience", value: 5 },
];

const SLIDES = [
  {
    title: "Why Pathfinder",
    content: [
      "Pathfinder exists to help brands find clarity, direction, and growth—no matter their size. From early‑stage startups to large‑scale companies, we work closely with businesses at every stage of their journey, offering creative and digital solutions that are impactful and affordable.",
    ],
  },
  {
    title: "Why Choose Us",
    content: [
      "We believe great branding should not be limited by budgets, which is why our approach is flexible, honest, and focused on real value. By combining strategy, design, and execution under one roof, we guide brands along the right path—delivering work that is purposeful, scalable, and built to last.",
    ],
  },
  {
    title: "Our Approach",
    content: [
      "We believe in a collaborative journey. Our process is rooted in understanding your unique challenges and opportunities. We don't just deliver assets; we deliver solutions that are tailored to your specific needs. By leveraging data-driven insights and creative innovation, we ensure that every step we take is calculated to maximize your brand's potential.",
    ],
  },
];

export default function Metrics() {
  const [isVisible, setIsVisible] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      const scrollerEl = document.getElementById("smooth-wrapper");
      const scroller = scrollerEl || window;

      // 0. Trigger Metrics Counter
      ScrollTrigger.create({
        trigger: ".metrics-grid",
        scroller: scroller,
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
            scroller: scroller,
            start: "top 65%",
            toggleActions: "play reverse play reverse",
          },
        },
      );

      // 2. Description Block Reveal
      gsap.fromTo(
        ".why-text-block",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
          stagger: 0.2,
          scrollTrigger: {
            trigger: ".why-content",
            scroller: scroller,
            start: "top 75%",
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
          {/* Animated Header */}
          <h2 className="why-header relative w-full mb-12 grid grid-rows-1 grid-cols-1 items-center justify-items-center">
            {SLIDES.map((slide, index) => {
              const words = slide.title.split(" ");
              const firstLine = words[0].toUpperCase();
              const secondLine = words.slice(1).join(" ").toUpperCase();

              return (
                <div
                  key={index}
                  className={`col-start-1 row-start-1 flex flex-col items-center justify-center transition-opacity duration-1000 ${
                    index === currentSlide
                      ? "opacity-100 z-10"
                      : "opacity-0 z-0 pointer-events-none"
                  }`}
                >
                  <div className="flex flex-col items-center gap-x-4 text-5xl md:text-7xl lg:text-9xl font-bold tracking-tight leading-[0.9]">
                    <div className="inline-block whitespace-nowrap">
                      {firstLine.split("").map((char, i) => (
                        <div
                          key={`${index}-1-${i}`}
                          className="overflow-hidden inline-block"
                        >
                          <span className="why-char inline-block">{char}</span>
                        </div>
                      ))}
                    </div>
                    <div className="inline-block whitespace-nowrap">
                      {secondLine.split("").map((char, i) => (
                        <div
                          key={`${index}-2-${i}`}
                          className="overflow-hidden inline-block"
                        >
                          <span
                            className="why-char inline-block"
                            style={{
                              WebkitTextStroke: "2px rgba(255, 255, 255, 0.5)",
                              color: "transparent",
                            }}
                          >
                            {char}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  {/* Divider Line (Included in slide to fade with it) */}
                  <div className="absolute -bottom-2 left-0 right-0 h-px bg-linear-to-r from-transparent via-pathfinder-green/30 to-transparent" />
                </div>
              );
            })}
          </h2>

          {/* Animated Description Slider */}
          <div className="why-content grid grid-rows-1 grid-cols-1 text-white/70 text-base md:text-lg leading-relaxed font-light font-nohemi max-w-3xl mx-auto mt-6 mb-8">
            {SLIDES.map((slide, index) => (
              <div
                key={index}
                className={`col-start-1 row-start-1 transition-opacity duration-1000 flex flex-col gap-6 text-center ${
                  index === currentSlide
                    ? "opacity-100 z-10"
                    : "opacity-0 z-0 pointer-events-none"
                }`}
              >
                {slide.content.map((text, i) => (
                  <p key={i} className="why-text-block">
                    {text}
                  </p>
                ))}
              </div>
            ))}
          </div>

          {/* Slide Indicators */}
          <div className="flex items-center justify-center gap-3">
            {SLIDES.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`transition-all ease-in-out duration-300 rounded-full ${
                  currentSlide === index
                    ? "w-8 h-2 bg-pathfinder-green"
                    : "w-2 h-2 bg-white/20 cursor-pointer hover:bg-white/40"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
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
