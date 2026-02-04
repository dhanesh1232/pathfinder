"use client";

import { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Testimonials } from "./Testimonials";

const SLIDE_CONTENT = [
  {
    title: "One team. One vision. One Pathfinder Built with belief.",
    highlight: "Driven by purpose.",
    p1: "I started Pathfinder with a simple belief—great brands shouldn't be limited to big budgets. In a space where creativity is often rushed or overpriced, we chose a different path.",
    p2: "We focus on clarity, quality, and honest delivery, helping brands grow with confidence. Every project we take is personal, and every solution is built with intention, capability, and respect for the client's vision.",
  },
  {
    title: "A Collective of Creators. United by Passion.",
    highlight: "Defined by Excellence.",
    p1: "Our team is a diverse blend of strategists, designers, and developers who share a common goal: to build brands that matter. We don't just work for you; we work with you.",
    p2: "We believe in the power of collaboration. By bringing together different perspectives and skills, we create holistic solutions that are as functional as they are beautiful.",
  },
  {
    title: "About Us. More Than Just an Agency.",
    highlight: "Partners in Growth.",
    p1: "Pathfinder isn't just a creative agency; we are your partners in growth. We understand the challenges of modern business and provide the strategic edge you need to stand out.",
    p2: "From the first spark of an idea to the final launch, we are there every step of the way. Our mission is to empower your brand to reach its full potential and beyond.",
  },
  {
    title: "About Us. More Than Just an Agency.",
    highlight: "Partners in Growth.",
    p1: "Pathfinder isn't just a creative agency; we are your partners in growth. We understand the challenges of modern business and provide the strategic edge you need to stand out.",
    p2: "From the first spark of an idea to the final launch, we are there every step of the way. Our mission is to empower your brand to reach its full potential and beyond.",
  },
];

export default function FounderNote() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-slide Timer (Main Content)
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDE_CONTENT.length);
    }, 15000);
    return () => clearInterval(timer);
  }, []);

  // GSAP Setup (ScrollTriggers)
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      const scrollerEl = document.getElementById("smooth-wrapper");
      const scroller = scrollerEl || window;

      // 1. Text Reveal (Our Team)
      gsap.fromTo(
        ".founder-char",
        { yPercent: 100 },
        {
          yPercent: 0,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.03,
          scrollTrigger: {
            trigger: ".founder-reveal",
            scroller: scroller,
            start: "top 80%",
            toggleActions: "play reverse play reverse",
          },
        },
      );

      // 2. Image Reveal (Anime-style Zoom & Blur Out)
      gsap.fromTo(
        ".founder-img-anim",
        { scale: 0.9, opacity: 0, filter: "blur(12px)" }, // Start small
        {
          scale: 1,
          opacity: 1,
          filter: "blur(0px)",
          duration: 1.5,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".founder-card",
            scroller: scroller,
            start: "top 75%",
            end: "bottom 20%",
            toggleActions: "play reverse play reverse",
          },
        },
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Slide Animation (Triggered on State Change)
  useEffect(() => {
    if (!containerRef.current) return;

    // Animate content of the new active slide
    const activeElements = containerRef.current.querySelectorAll(
      `.slide-${currentSlide} .animate-item`,
    );

    if (activeElements.length > 0) {
      gsap.fromTo(
        activeElements,
        { y: 20, opacity: 0, filter: "blur(4px)" },
        {
          y: 0,
          opacity: 1,
          filter: "blur(0px)",
          duration: 1,
          stagger: 0.1,
          ease: "power3.out",
          overwrite: true, // Ensure we override any ongoing logic
        },
      );
    }
  }, [currentSlide]);

  return (
    <section
      ref={containerRef}
      className="relative w-full py-24 md:py-40 px-6 bg-transparent z-10"
    >
      <div className="max-w-7xl mx-auto">
        {/* Top Header */}
        <div className="text-center mb-4 md:mb-8 founder-reveal">
          <h2 className="text-4xl md:text-5xl lg:text-7xl font-poppins font-bold text-white leading-[1.1] uppercase tracking-tight">
            {/* Text Split for Animation */}
            <div className="inline-block whitespace-nowrap">
              {"OUR TEAM".split("").map((char, i) => (
                <div key={i} className="overflow-hidden inline-block relative">
                  <span
                    className={`founder-char inline-block ${
                      char === " " ? "w-4 md:w-6" : ""
                    }`}
                  >
                    {char}
                  </span>
                </div>
              ))}
            </div>
          </h2>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-14 mb-4 items-center">
          {/* Left: Content Slider */}
          <div className="order-2 md:order-1 relative min-h-[400px]">
            {SLIDE_CONTENT.map((slide, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-opacity duration-1000 ease-in-out slide-${index} ${
                  index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
                }`}
              >
                <h3 className="animate-item text-2xl md:text-3xl lg:text-4xl font-poppins font-bold text-white leading-[1.1]">
                  {slide.title}{" "}
                  <span className="text-pathfinder-green">
                    {slide.highlight}
                  </span>
                </h3>
                <div className="animate-item w-20 my-4 h-0.5 bg-linear-to-r from-transparent via-pathfinder-green to-transparent mx-0 mb-8" />
                <div className="space-y-8">
                  <p className="animate-item text-base md:text-lg text-zinc-300 font-light leading-relaxed font-nohemi">
                    {slide.p1}
                  </p>
                  <p className="animate-item text-base md:text-lg text-zinc-300 font-light leading-relaxed font-nohemi">
                    {slide.p2}
                  </p>

                  {/* Dots Decoration / Indicators */}
                  <div className="flex gap-3 mt-8">
                    {SLIDE_CONTENT.map((_, dotIndex) => (
                      <button
                        key={dotIndex}
                        onClick={() => setCurrentSlide(dotIndex)}
                        className={`h-2 rounded-full overflow-hidden relative transition-all duration-300 ${
                          dotIndex === currentSlide
                            ? "w-8 bg-pathfinder-green/20"
                            : "w-2 bg-pathfinder-green/20 hover:bg-pathfinder-green/40"
                        }`}
                        aria-label={`Go to slide ${dotIndex + 1}`}
                      >
                        {dotIndex === currentSlide && (
                          <div
                            className="absolute top-0 left-0 h-full bg-pathfinder-green animate-fill-progress rounded-full"
                            style={{ animationDuration: "15000ms" }}
                          />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right: Team Context & Card */}
          <div className="flex flex-col gap-12 items-end relative order-1 lg:order-2">
            {/* Founder Card */}
            <div className="founder-card relative group w-full md:max-w-md">
              <div className="absolute inset-0 bg-pathfinder-green/20 blur-2xl rounded-full opacity-0 group-hover:opacity-40 transition-opacity duration-700" />
              <div className="founder-img-anim relative rounded-3xl overflow-hidden">
                <img
                  src="/my-img.png"
                  alt="Founder"
                  className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-100 scale-95 transition-all duration-700"
                />
                {/* Giant Watermark Name behind image - Vertical */}
                <div className="absolute right-0 -top-20 h-full -z-10 flex items-center justify-center pointer-events-none select-none mix-blend-overlay opacity-20">
                  <span
                    className="text-6xl font-black text-transparent stroke-2 stroke-white leading-none whitespace-nowrap"
                    style={{
                      WebkitTextStroke: "0.2px white",
                      writingMode: "vertical-rl",
                      transform: "rotate(180deg)",
                    }}
                  >
                    JASWANTH
                  </span>
                </div>

                {/* Gradient Overlay at bottom */}
                <div className="absolute inset-0 bg-linear-to-t from-black/90 via-transparent to-transparent" />

                <div className="absolute bottom-8 left-8">
                  <h4 className="text-white font-poppins font-bold text-2xl tracking-wide">
                    Jaswanth
                  </h4>
                  <p className="text-pathfinder-green font-aalto uppercase tracking-wider text-sm mt-1">
                    Founder & Creative Director
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Testimonials Section (Slider) */}
        <Testimonials />
      </div>
    </section>
  );
}
