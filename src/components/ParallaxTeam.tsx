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
      "left-1/2 -translate-x-1/2 lg:right-[60%] md:right-[50%] -z-30 w-[45%] md:w-[30%] lg:w-[24%]",
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

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=250%", // Extended for multi-phase animation
          pin: true,
          scrub: 1,
          anticipatePin: 1,
        },
      });

      // Phase 1: Rise Up (Appear into view as gray)
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

      // Phase 2: Center turns Green (others stay gray)
      // Wait for rise to complete partially
      tl.to(
        ".team-active",
        {
          opacity: 1,
          duration: 1.5,
          ease: "power2.inOut",
        },
        ">-=1",
      );

      // Optional: Gently color the center's base image if needed (removes gray underneath)
      // But keeping others gray.
      // We only target the center's normal image to remove grayscale so it blends with the green overlay if transparent.
      // If the overlay is full opacity, this might not be needed, but good for safety.
      tl.to(
        "#center .team-normal",
        {
          filter: "grayscale(0%) contrast(100%) brightness(100%)",
          duration: 1.5,
          ease: "power2.inOut",
        },
        "<",
      );

      // Phase 3: Hold / Exit
      // The section stays pinned. When scroll ends, it naturally unpins.
      tl.to({}, { duration: 1 });

      // 4. Exit/Fade out (optional, if you want them to leave after)
      // tl.to(containerRef.current, { opacity: 0, duration: 1 });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden bg-inherit flex flex-col items-center justify-end"
    >
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
