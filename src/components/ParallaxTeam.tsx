"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const PEOPLE = [
  {
    id: "left-2",
    normal: "/person/left side image two.png",
    name: "Member 1",
    layer: 1,
    position:
      "left-[2%] md:left-[5%] lg:left-[12%] z-0 w-[35%] sm:w-[30%] md:w-[22%] lg:w-[18%] xl:w-[16%] 2xl:w-[15%]",
  },
  {
    id: "left-1",
    normal: "/person/left side image one.png",
    name: "Member 2",
    layer: 2,
    position:
      "left-[15%] md:left-[22%] lg:left-[26%] -z-10 w-[40%] sm:w-[35%] md:w-[26%] lg:w-[21%] xl:w-[19%] 2xl:w-[18%]",
  },
  {
    id: "center",
    normal: "/person/center normal.png",
    active: "/person/center green.png",
    name: "Leader",
    layer: 3,
    position:
      "left-1/2 -translate-x-1/2 -z-30 w-[50%] sm:w-[40%] md:w-[30%] lg:w-[24%] xl:w-[22%] 2xl:w-[20%]",
  },
  {
    id: "right-1",
    normal: "/person/right side image one.png",
    name: "Member 4",
    layer: 2,
    position:
      "right-[15%] md:right-[22%] lg:right-[26%] -z-10 w-[40%] sm:w-[35%] md:w-[26%] lg:w-[21%] xl:w-[19%] 2xl:w-[18%]",
  },
  {
    id: "right-2",
    normal: "/person/right side image two.png",
    name: "Member 5",
    layer: 1,
    position:
      "right-[2%] md:right-[5%] lg:right-[12%] z-0 w-[35%] sm:w-[30%] md:w-[22%] lg:w-[18%] xl:w-[16%] 2xl:w-[15%]",
  },
];

export default function ParallaxTeam() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      // Use element directly if found, otherwise window
      const scrollerEl = document.getElementById("smooth-wrapper");
      const scroller = scrollerEl || window;

      // 1. Initial State Setup
      // Images: Hidden below, Grayscale
      gsap.set(".team-member-container", { yPercent: 100 });
      gsap.set(".team-normal", {
        filter: "grayscale(100%) contrast(125%) brightness(110%)",
      });
      gsap.set(".team-active", { opacity: 0 });

      // Text: Hidden below (y=100%), Opacity 0, Solid Color (no stroke yet)
      gsap.set(".char", {
        yPercent: 100,
        opacity: 0,
        color: (i, target) => {
          return target.closest(".text-line-2") ? "#2ecc71" : "white";
        },
        webkitTextStroke: "0px transparent",
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          scroller: scroller,
          start: "top top",
          end: "+=300%",
          pin: true,
          scrub: 1,
          anticipatePin: 1,
        },
      });

      // --- PHASE 1: ENTRANCE (Team Rise + Text Y-Reveal) ---
      tl.to(
        ".team-member-container",
        {
          yPercent: 0,
          duration: 3, // Slower rise
          ease: "power2.out",
          stagger: { amount: 0.8, from: "edges" },
        },
        "start",
      );

      // "slowly come text hide to visible"
      tl.to(
        ".char",
        {
          yPercent: 0,
          opacity: 1,
          duration: 2, // Much slower relative duration
          ease: "power2.out",
          stagger: { amount: 1.2, from: "start" },
        },
        "start",
      );

      tl.to(
        ".text-line-2 .char",
        {
          color: "transparent",
          webkitTextStroke: "0.5px white",
          duration: 0.5,
          stagger: {
            amount: 1.5,
            from: "start",
          },
          ease: "power1.inOut",
        },
        "<+=0.5",
      );

      // --- PHASE 2: FOCUS (Center Green) ---
      // Occurs after text is fully revealed
      tl.to(
        ".team-active",
        {
          opacity: 1,
          duration: 3,
          ease: "power2.inOut",
        },
        ">-=0.5",
      );

      tl.to(
        "#center .team-normal",
        {
          filter: "grayscale(0%) contrast(100%) brightness(100%)",
          duration: 3,
          ease: "power2.inOut",
        },
        "<",
      );

      // --- PHASE 3: EXIT / TRANSFORMATION (Solid -> Stroke) ---
      // "solid to stroke slowly action not pastly"
      tl.to(
        ".text-line-1 .char",
        {
          color: "transparent",
          webkitTextStroke: "0.5px white",
          duration: 0.5,
          stagger: {
            amount: 1.5,
            from: "start",
          },
          ease: "power1.inOut",
        },
        "<+=0.5",
      );

      // Line 2: Green -> Transparent with Green Stroke
      tl.to(
        ".text-line-2 .char",
        {
          color: "#2ecc71",
          duration: 0.5,
          stagger: {
            amount: 1.5,
            from: "start",
          },
          ease: "power1.inOut",
        },
        ">-=0.5",
      );

      tl.to(".char", {
        opacity: 0,
        duration: 0.5,
        stagger: {
          amount: 1.5,
          from: "start",
        },
        ease: "power2.in",
      });
      // Buffer at end
      tl.to({}, { duration: 1 });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <>
      <section
        ref={containerRef}
        className="relative w-full h-svh overflow-hidden bg-black flex flex-col items-center justify-end"
      >
        <div className="absolute top-[15%] lg:top-[12%] -z-20 w-[90%] h-1/2 max-w-full mx-auto">
          <div className="w-full h-full flex flex-col sm:gap-6 md:gap-0 justify-center gap-8 sm:justify-center md:justify-around lg:justify-start">
            {/* Left Side Text */}
            <h2 className="text-line-1 self-start text-5xl md:text-6xl lg:text-7xl font-bold uppercase tracking-tighter text-left text-wrap leading-[0.9] max-w-xl">
              {"We know what it takes to make".split(" ").map((word, wI) => (
                <span
                  key={wI}
                  className="inline-block whitespace-nowrap mr-[0.25em]"
                >
                  {word.split("").map((char, cI) => (
                    <span key={cI} className="char inline-block">
                      {char}
                    </span>
                  ))}
                </span>
              ))}
            </h2>

            <h2 className="text-line-2 self-end text-pathfinder-green text-5xl md:text-6xl lg:text-7xl font-bold uppercase tracking-tighter text-right text-wrap leading-[0.9] max-w-xl">
              {"your brand stand out".split(" ").map((word, wI) => (
                <span
                  key={`l2-${wI}`}
                  className="inline-block whitespace-nowrap mr-[0.25em]"
                >
                  {word.split("").map((char, cI) => (
                    <span key={cI} className="char inline-block">
                      {char}
                    </span>
                  ))}
                </span>
              ))}
            </h2>
          </div>
        </div>
        <div className="relative z-10 w-full h-[90%] md:h-full max-w-7xl flex items-end justify-center perspective-[1000px] pb-0 md:pb-[5vh]">
          {PEOPLE.map((person) => (
            <div
              key={person.id}
              id={person.id}
              className={`team-member-container absolute bottom-0 flex flex-col items-center justify-end
               layer-${person.layer} ${person.position}`}
            >
              <div className="relative w-full">
                {/* NORMAL IMAGE (Base) */}
                <img
                  src={person.normal}
                  alt={person.name}
                  className="team-normal w-full h-auto object-contain drop-shadow-2xl will-change-filter"
                />

                {/* ACTIVE IMAGE (Green Overlay for Leader) */}
                {person.active && (
                  <img
                    src={person.active}
                    alt={`${person.name} active`}
                    className="team-active absolute top-0 left-0 w-full h-auto object-contain drop-shadow-2xl will-change-opacity"
                  />
                )}
              </div>
            </div>
          ))}
        </div>
        {/* Bottom Fade Gradient for smooth edge */}
        <div className="absolute bottom-0 left-0 right-0 h-32 md:h-48 bg-linear-to-t from-black via-black/50 to-transparent z-30 pointer-events-none" />
      </section>
      {/* Spacer between Hero and People */}
      <div className="h-[300svh]" />
    </>
  );
}
