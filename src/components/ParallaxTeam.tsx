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
    // Added 'layer' for parallax depth sorting
    layer: 1,
    position:
      "left-[-5%] md:left-[5%] lg:left-[12%] z-10 w-[30%] md:w-[22%] lg:w-[18%]",
  },
  {
    id: "left-1",
    normal: "/person/left side image one.png",
    name: "Member 2",
    layer: 2,
    position:
      "left-[10%] md:left-[22%] lg:left-[26%] -z-20 w-[35%] md:w-[26%] lg:w-[21%]",
  },
  {
    id: "center",
    normal: "/person/center normal.png",
    active: "/person/center green.png", // This one has a special active state
    name: "Leader",
    layer: 3,
    position:
      "left-1/2 -translate-x-1/2 md:right-[50%] -z-30 w-[45%] md:w-[30%] lg:w-[24%]",
  },
  {
    id: "right-1",
    normal: "/person/right side image one.png",
    name: "Member 4",
    layer: 2,
    position:
      "right-[10%] md:right-[22%] lg:right-[26%] -z-20 w-[35%] md:w-[26%] lg:w-[21%]",
  },
  {
    id: "right-2",
    normal: "/person/right side image two.png",
    name: "Member 5",
    layer: 1,
    position:
      "right-[-5%] md:right-[5%] lg:right-[12%] z-10 w-[30%] md:w-[22%] lg:w-[18%]",
  },
];

export default function ParallaxTeam() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      // 1. Initial State Setup
      // Start everyone hidden below (yPercent: 100) and Grayscale
      gsap.set(".team-member-container", { yPercent: 100 });

      gsap.set(".team-normal", {
        filter: "grayscale(100%) contrast(125%) brightness(110%)",
      });

      // Start the "Active/Green" overlay as hidden
      gsap.set(".team-active", {
        opacity: 0,
      });

      // Initial Text State: Solid White, Hidden/Offscreen for slide effect
      // Line 1 (Odd chars? Or just whole line from left) -> User said "type text left and right"
      // We'll slide Line 1 from Left, Line 2 from Right
      gsap.set(".text-line-1", { xPercent: -100, opacity: 0 });
      gsap.set(".text-line-2", { xPercent: 100, opacity: 0 });

      // Ensure text starts solid (no stroke) and sets correct colors per line
      gsap.set(".text-line-1 .char", {
        color: "white",
        webkitTextStroke: "0px transparent",
      });
      gsap.set(".text-line-2 .char", {
        color: "#2ecc71", // pathfinder-green
        webkitTextStroke: "0px transparent",
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=300%", // Extended for text animation phase
          pin: true,
          scrub: 1,
          anticipatePin: 1,
        },
      });

      // Phase 1: Everything Enters
      // Team rises
      tl.to(
        ".team-member-container",
        {
          yPercent: 0,
          duration: 2.5,
          ease: "power2.out",
          stagger: {
            amount: 0.8,
            from: "edges",
          },
        },
        "start",
      );

      // Text Slides In (Solid) - Left and Right
      tl.to(
        ".text-line-1",
        { xPercent: 0, opacity: 1, duration: 2, ease: "power2.out" },
        "start+=0.5",
      );
      tl.to(
        ".text-line-2",
        { xPercent: 0, opacity: 1, duration: 2, ease: "power2.out" },
        "start+=0.5",
      );

      // Phase 2: Center turns Green (others stay gray)
      // Wait for rise to complete partially
      tl.to(
        ".team-active",
        {
          opacity: 1,
          duration: 1.5,
          ease: "power2.inOut",
        },
        ">-=0.5", // Slight overlap
      );

      tl.to(
        "#center .team-normal",
        {
          filter: "grayscale(0%) contrast(100%) brightness(100%)",
          duration: 1.5,
          ease: "power2.inOut",
        },
        "<",
      );

      // Phase 3: Text Transforms from Solid to Outline (Letter by Letter)
      // Line 1: White -> Transparent with White Stroke
      tl.to(
        ".text-line-1 .char",
        {
          color: "transparent",
          webkitTextStroke: "1px white",
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
          color: "transparent",
          webkitTextStroke: "1px #2ecc71", // Matching pathfinder-green
          duration: 0.5,
          stagger: {
            amount: 1.5,
            from: "start",
          },
          ease: "power1.inOut",
        },
        "<",
      );

      // Phase 4: Hold / Exit
      tl.to({}, { duration: 1 });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative w-full h-svh overflow-hidden bg-inherit flex flex-col items-center justify-end"
    >
      <div className="absolute top-[15%] lg:top-[12%] -z-20 w-[90%] h-[85%] max-w-full mx-auto flex flex-col md:flex-row items-center md:items-start md:justify-between pointer-events-none gap-4 md:gap-0">
        {/* Left Side Text */}
        <h2 className="text-line-1 text-4xl md:text-6xl lg:text-7xl font-bold uppercase tracking-tighter text-center md:text-left text-wrap leading-[0.9] max-w-2xl">
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

        <h2 className="text-line-2 text-pathfinder-green text-4xl md:text-6xl lg:text-7xl font-bold uppercase tracking-tighter text-center md:text-right text-wrap leading-[0.9] max-w-2xl md:mt-24 lg:mt-32">
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
      <div className="relative z-10 w-full h-[90%] md:h-full max-w-[1600px] flex items-end justify-center perspective-[1000px] pb-0 md:pb-[5vh]">
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
    </section>
  );
}
