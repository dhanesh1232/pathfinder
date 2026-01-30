"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const cards = [
  {
    title: "Insight that ignites",
    text: "We question deeply before we create.",
  },
  {
    title: "Crafted with purpose",
    text: "Design that feels like it’s always belonged.",
  },
  {
    title: "Built to transform",
    text: "Every pixel moves business forward.",
  },
  {
    title: "Evolved to inspire",
    text: "Creativity that sets the next benchmark.",
  },
];

export default function HowWeWorks() {
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !triggerRef.current || !wrapperRef.current)
      return;

    const ctx = gsap.context(() => {
      // Horizontal Scroll Animation
      // The track is inside a rotated wrapper.

      // 1. Initial Fade In (Independent of Scroll Position)
      gsap.fromTo(
        wrapperRef.current,
        { autoAlpha: 0 },
        {
          autoAlpha: 1,
          duration: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: triggerRef.current,
            start: "top center", // Appear when section hits center
            toggleActions: "play none none reverse",
          },
        },
      );

      // 2. Scroll Movement (Scrubbed)
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: triggerRef.current,
          start: "top top",
          end: "+=1100%",
          pin: true,
          scrub: 1, // Instant response to scroll
          anticipatePin: 1,
        },
      });

      // Move instantly from current position to left
      tl.to(containerRef.current, {
        x: () => -(containerRef.current!.scrollWidth - window.innerWidth),
        ease: "none",
      });
    }, triggerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={triggerRef}
      className="relative bg-transparent h-screen w-full overflow-hidden flex items-center justify-center"
    >
      {/* 
        Rotated Wrapper 
        rotate-6 creates the slope: \ (TL down to BR).
        Moving Left (against the slope) creates the visual effect of "Climbing" from BR to TL.
      */}
      {/* Static Title (Fixed inside the rotated container) */}
      <div className="z-20 pointer-events-none absolute left-50 md:left-1/5 transform -translate-x-1/2">
        <h2 className="text-5xl md:text-7xl font-black text-white italic tracking-tighter uppercase leading-[0.8] drop-shadow-xl max-w-sm text-wrap">
          How We Work
          <br />
          <span
            className="text-transparent"
            style={{ WebkitTextStroke: "2px white" }}
          >
            Pathfinder
          </span>
        </h2>
      </div>
      <div
        ref={wrapperRef}
        className="relative w-screen h-[60vh] md:h-[80vh] bg-transparent rotate-6 flex items-center opacity-0 will-change-transform perspective-[2500px]"
      >
        {/* Scrollable Track */}
        <div
          ref={containerRef}
          className="flex items-center gap-10 pl-[80vw] pr-[20vw] rotate-x-20"
        >
          {cards.map((card, index) => (
            <div
              key={index}
              className="shrink-0 w-[70vw] sm:w-[50vw] md:w-[50vw] lg:w-[40vw] h-[80vh] bg-black border border-white/10 rounded-lg p-10 flex flex-col justify-between group transition-all duration-500 hover:border-pathfinder-green/50 origin-center"
              style={{
                transform: "rotateX(15deg)",
              }}
            >
              <div className="flex justify-between items-start">
                <span className="text-8xl font-black text-white/5 group-hover:text-pathfinder-green/20 transition-colors">
                  0{index + 1}
                </span>
                <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-pathfinder-green group-hover:border-pathfinder-green transition-all">
                  <span className="kb-arrow-right text-white" />
                </div>
              </div>

              <div>
                <h3 className="text-4xl font-bold text-white mb-4 uppercase tracking-tight">
                  {card.title}
                </h3>
                <p className="text-white/60 text-lg">{card.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
