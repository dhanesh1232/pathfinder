"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Helper to split text into characters for typing effect
export const SplitText = ({
  children,
  className = "",
}: {
  children: string;
  className?: string;
}) => {
  return (
    <>
      {children.split("").map((char, index) => (
        <span
          key={index}
          className={`char inline-block ${className}`} // "inline-block" respects transform/opacity better
          style={{ opacity: 0 }} // Initially hidden
        >
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </>
  );
};

const SkeletonHero = () => {
  return (
    <div className="absolute inset-0 w-full h-full bg-black z-50 flex flex-col items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,#2a2a2a_0%,#000000_100%)]"></div>
      <div className="relative z-10 flex flex-col items-center gap-4 animate-pulse">
        <div className="w-[300px] h-16 md:w-[500px] md:h-24 bg-white/5 rounded-lg"></div>
        <div className="w-[200px] h-16 md:w-[350px] md:h-24 bg-white/5 rounded-lg"></div>
      </div>
      <div className="absolute bottom-0 w-full flex justify-between px-10 md:px-20 opacity-50">
        <div className="w-[150px] h-[400px] md:w-[300px] md:h-[600px] bg-linear-to-t from-zinc-800 to-transparent rounded-t-full -rotate-12 transform translate-y-20 animate-pulse delay-100"></div>
        <div className="w-[150px] h-[400px] md:w-[300px] md:h-[600px] bg-linear-to-t from-zinc-800 to-transparent rounded-t-full rotate-12 transform translate-y-20 animate-pulse delay-200"></div>
      </div>
    </div>
  );
};

export default function HandSplitHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const leftHandRef = useRef<HTMLImageElement>(null);
  const rightHandRef = useRef<HTMLImageElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [loadedCount, setLoadedCount] = useState(0);
  const [videoFinished, setVideoFinished] = useState(false);
  const [introFinished, setIntroFinished] = useState(false);

  const handleImageLoad = () => {
    setLoadedCount((prev) => prev + 1);
  };

  useEffect(() => {
    if (leftHandRef.current?.complete && rightHandRef.current?.complete) {
      setIsLoading(false);
      return;
    }
    if (loadedCount >= 2) {
      setIsLoading(false);
    }
  }, [loadedCount]);

  // Phase 1: Entry Animation (Auto-play after video)
  useEffect(() => {
    if (isLoading || !videoFinished || introFinished || !containerRef.current)
      return;

    // Lock scroll during intro
    document.body.style.overflow = "hidden";

    const ctx = gsap.context(() => {
      // 1. Initial State: Hands Wide Apart & Text Hidden
      gsap.set(leftHandRef.current, {
        xPercent: -150,
        rotate: -30,
        opacity: 0,
      });
      gsap.set(rightHandRef.current, { xPercent: 150, rotate: 30, opacity: 0 });
      gsap.set(textRef.current, { opacity: 0, y: 20 });

      const tl = gsap.timeline({
        onComplete: () => {
          document.body.style.overflow = ""; // Unlock scroll
          setIntroFinished(true);
        },
      });

      // 2. Animate Hands Together
      tl.to([leftHandRef.current, rightHandRef.current], {
        xPercent: (i) => (i === 0 ? 20 : -20), // Left: 20, Right: -20
        rotate: 0,
        opacity: 1,
        duration: 1.8,
        ease: "power4.out",
      }).to(
        textRef.current,
        {
          opacity: 1,
          y: 10,
          duration: 1,
          ease: "power2.out",
        },
        "-=1.0",
      ); // Overlap slightly with hands arrival
    }, containerRef);

    return () => ctx.revert();
  }, [isLoading, videoFinished, introFinished]);

  // Phase 2: Scroll Interaction (Enabled after intro)
  useEffect(() => {
    if (!introFinished || !containerRef.current) return;

    const ctx = gsap.context(() => {
      // Re-assert "start" positions to ensure ScrollTrigger matches Intro end state
      gsap.set(leftHandRef.current, { xPercent: 20, rotate: 0 });
      gsap.set(rightHandRef.current, { xPercent: -20, rotate: 0 });
      gsap.set(textRef.current, {
        y: 10,
        opacity: 1,
        scale: 1,
        filter: "none",
      });

      // Init chars for typing effect logic (ready for scroll)
      const chars = textRef.current?.querySelectorAll(".char");
      gsap.set(chars!, { opacity: 0 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=150%",
          pin: true,
          scrub: 1,
          anticipatePin: 1,
        },
      });

      // Split Animation
      tl.addLabel("start")
        .to(
          leftHandRef.current,
          {
            xPercent: -90,
            rotate: -25,
            ease: "power2.out",
            duration: 1.5,
          },
          "start",
        )
        .to(
          rightHandRef.current,
          {
            xPercent: 90,
            rotate: 25,
            ease: "power2.out",
            duration: 1.5,
          },
          "start",
        )
        .to(
          bgRef.current,
          {
            opacity: 0.5,
            scale: 1.1,
            ease: "none",
            duration: 1.5,
          },
          "start",
        );

      // Typing Effect
      tl.to(
        chars!,
        {
          opacity: 1,
          duration: 0.1,
          stagger: 0.05,
          ease: "none",
        },
        ">",
      );

      // Hold & Exit
      tl.to({}, { duration: 0.5 });
      tl.to(
        [textRef.current, leftHandRef.current, rightHandRef.current],
        {
          y: -10,
          opacity: 0,
          duration: 1,
          ease: "power1.in",
        },
        "exit",
      );
    }, containerRef);

    return () => ctx.revert();
  }, [introFinished]);

  return (
    <>
      {/* Video Intro Overlay */}
      {!videoFinished && (
        <div className="fixed inset-0 z-[60] bg-black flex items-center justify-center">
          <video
            autoPlay
            muted
            playsInline
            className="w-full h-full object-cover"
            src="/video/PathFinder%20Logo%20animation%20Video.mp4"
            onEnded={() => setVideoFinished(true)}
          />
        </div>
      )}

      {/* Existing Skeleton - Only show if video finished AND still loading */}
      {videoFinished && isLoading && <SkeletonHero />}

      <section
        ref={containerRef}
        className={`relative w-full h-[200svh] overflow-hidden bg-inherit flex justify-center transition-opacity duration-700 ${
          isLoading || !videoFinished ? "opacity-0" : "opacity-100"
        }`}
      >
        <div className="relative z-10 flex flex-col items-center justify-center w-full h-screen">
          {/* Headline Text - Now uses SplitText */}
          <AnimationText textRef={textRef} />

          <div className="relative z-20 w-full max-w-full flex items-center justify-center pointer-events-none mt-20">
            <div className="relative w-1/2 flex justify-end px-4">
              <img
                ref={leftHandRef}
                src="/hands/Right-Hand.png"
                alt="Left Hand"
                onLoad={handleImageLoad}
                className="w-[180%] md:w-[140%] max-w-[800px] lg:w-[280%] lg:max-w-[1000px] h-auto object-contain filter brightness-150 contrast-125"
              />
            </div>

            <div className="relative w-1/2 flex justify-start px-4">
              <img
                ref={rightHandRef}
                src="/hands/Left-Hand.png"
                alt="Right Hand"
                onLoad={handleImageLoad}
                className="w-[180%] md:w-[140%] max-w-[800px] lg:w-[280%] lg:max-w-[1000px] h-auto object-contain filter brightness-150 contrast-125"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function AnimationText({
  textRef,
}: {
  textRef?: React.RefObject<HTMLDivElement | null>;
}) {
  return (
    <div
      ref={textRef as React.RefObject<HTMLDivElement>}
      className="absolute z-10 text-center"
    >
      <h1 className="text-white font-playfair text-5xl md:text-7xl lg:text-8xl leading-tight font-medium tracking-wide drop-shadow-2xl">
        <SplitText>The Best Path For</SplitText>
        <br />
        <span className="text-pathfinder-green italic font-semibold">
          <SplitText>Your Brand</SplitText>
        </span>
      </h1>
    </div>
  );
}
