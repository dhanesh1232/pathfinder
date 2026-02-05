"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import GlowLine from "./GlowLine";
import Image from "next/image";
import Link from "next/link";

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
  const startLabelRef = useRef<HTMLDivElement>(null);

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
      gsap.set(startLabelRef.current, { opacity: 0, scale: 0.8 });
      gsap.set(bgRef.current, { opacity: 0, scale: 0.8 });

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
      })
        .to(
          bgRef.current,
          {
            opacity: 1,
            scale: 1,
            duration: 1.8,
            ease: "power4.out",
          },
          "<",
        )
        .to(
          textRef.current,
          {
            opacity: 1,
            y: 10,
            duration: 1,
            ease: "power2.out",
          },
          "-=1.0",
        )
        .to(
          startLabelRef.current,
          {
            opacity: 1,
            scale: 1,
            duration: 1,
            ease: "power2.out",
          },
          "<",
        ); // Sync with text reveal
    }, containerRef);

    return () => ctx.revert();
  }, [isLoading, videoFinished, introFinished]);

  // Phase 2: Scroll Interaction (Enabled after intro)
  useEffect(() => {
    if (!introFinished || !containerRef.current) return;

    const ctx = gsap.context(() => {
      const scrollerEl = document.getElementById("smooth-wrapper");
      const scroller = scrollerEl || window;

      // Re-assert "start" positions to ensure ScrollTrigger matches Intro end state
      gsap.set(leftHandRef.current, { xPercent: 20, rotate: 0 });
      gsap.set(rightHandRef.current, { xPercent: -20, rotate: 0 });
      gsap.set(textRef.current, {
        y: 10,
        opacity: 1,
        scale: 1,
        filter: "none",
      });
      gsap.set(startLabelRef.current, { opacity: 1, scale: 1 });
      gsap.set(bgRef.current, { opacity: 1, scale: 1 });

      // Init char text visibility logic
      const chars = textRef.current?.querySelectorAll(".char");
      gsap.set(chars!, { opacity: 0 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          scroller: scroller,
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
            opacity: 0,
            scale: 1.1,
            ease: "none",
            duration: 1.5,
          },
          "start",
        )
        .to(
          startLabelRef.current,
          {
            opacity: 0,
            scale: 1.5,
            duration: 0.5,
            ease: "power1.in",
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

      // Reveal CTAs
      tl.to(
        ".cta-buttons",
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
        },
        "-=0.5",
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

  const handClass =
    "w-[180%] md:w-[140%] max-w-[800px] lg:w-[280%] lg:max-w-[1000px] 2xl:w-[160%] 2xl:max-w-none min-[1800px]:w-[180%] min-[2400px]:w-[200%] min-[2800px]:w-[250%] min-[3200px]:w-[280%] min-[3800px]:w-[320%] min-[4400px]:w-[360%] min-[5000px]:w-[400%] h-auto object-contain filter brightness-150 contrast-125";

  return (
    <>
      {/* Video Intro Overlay */}
      {!videoFinished && (
        <div className="fixed inset-0 z-60 bg-black flex items-center justify-center">
          <video
            autoPlay
            muted
            playsInline
            preload="auto"
            className="w-full h-full object-cover"
            src="https://ik.imagekit.io/gclqlaadh/pathfinder/PathFinder%20Logo%20animation%20Video_OA2IyTipo.mp4"
            onEnded={() => setVideoFinished(true)}
          />
        </div>
      )}

      {/* Existing Skeleton - Only show if video finished AND still loading */}
      {videoFinished && isLoading && <SkeletonHero />}

      <section
        ref={containerRef}
        className={`relative w-full max-w-[5000px] mx-auto h-[200svh] overflow-hidden bg-black flex justify-center transition-opacity duration-700 ${
          isLoading || !videoFinished ? "opacity-0" : "opacity-100"
        }`}
      >
        <div className="relative z-10 flex flex-col items-center justify-center w-full h-screen overflow-hidden">
          {/* Enhanced Full Screen Background */}
          <div
            ref={bgRef}
            className="absolute inset-0 w-full h-full -z-10 pointer-events-none"
          >
            <Image
              src="/back 1.png"
              alt="Background"
              fill
              priority
              quality={100}
              sizes="100vw"
              className="object-cover"
            />
            {/* Premium Overlays */}
            <div className="absolute inset-0 bg-black/30" />
            <div className="absolute inset-0 bg-linear-to-b from-black/70 via-transparent to-black/70 opacity-60" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.5)_100%)]" />
          </div>

          {/* Headline Text - Now uses SplitText */}
          <AnimationText textRef={textRef} />

          {/* Start Journey Label (Visible initially, fades on split) */}
          <div
            ref={startLabelRef}
            className="absolute z-30 flex flex-col items-center justify-center top-[30%] md:top-[25%] lg:top-[20%] left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none mix-blend-difference gap-8"
          >
            <div className="flex flex-col items-center text-center">
              <span className="text-white/90 font-poppins text-center text-lg md:text-xl tracking-[0.6em] uppercase pl-1">
                Start
              </span>
              <span className="text-white/60 font-poppins text-center text-sm md:text-base tracking-[0.6em] uppercase pl-1">
                The
              </span>
              <h1 className="text-pathfinder-green font-poppins text-center font-extrabold text-6xl md:text-7xl tracking-wide leading-none md:-mt-3">
                Journey
              </h1>
            </div>
          </div>

          <div className="relative z-20 w-full max-w-[5000px] flex items-center justify-center pointer-events-none mt-20">
            <div className="relative w-1/2 flex justify-end px-4">
              <img
                ref={leftHandRef}
                src="/hands/Right-Hand.png"
                alt="Left Hand"
                onLoad={handleImageLoad}
                className={handClass}
              />
            </div>

            <div className="relative w-1/2 flex justify-start px-4">
              <img
                ref={rightHandRef}
                src="/hands/Left-Hand.png"
                alt="Right Hand"
                onLoad={handleImageLoad}
                className={handClass}
              />
            </div>
          </div>

          {/* Scroll Indicator - Bottom of Section */}
          <div className="absolute z-40 bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 opacity-80 pointer-events-none">
            <span className="text-white/70 font-poppins text-[10px] tracking-[0.3em] uppercase animate-pulse">
              Scroll
            </span>
            <div className="w-px h-12 bg-linear-to-b from-transparent via-white to-transparent opacity-60 animate-bounce" />
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
      className="absolute z-10 text-center flex flex-col items-center gap-10 md:gap-8"
    >
      <h1 className="text-white font-poppins text-4xl md:text-7xl lg:text-8xl min-[1800px]:text-9xl min-[2500px]:text-[10rem] min-[3500px]:text-[13rem] min-[4500px]:text-[16rem] leading-tight font-medium tracking-wide drop-shadow-2xl">
        <SplitText>The Best Path For</SplitText>
        <br />
        <span className="text-pathfinder-green italic font-extrabold font-aalto">
          <SplitText>Your Brand</SplitText>
        </span>
      </h1>

      <div className="cta-buttons opacity-0 translate-y-8 flex items-center gap-2 md:gap-4 pointer-events-auto">
        <Link
          href="https://wa.me/919676104199"
          target="_blank"
          rel="noopener noreferrer"
          className="group relative px-6 py-2 md:px-12 md:py-4 bg-white/5 backdrop-blur-md border border-white/10 overflow-hidden transition-all duration-500 hover:border-pathfinder-green/50"
          style={{ clipPath: "polygon(10% 0, 100% 0, 90% 100%, 0% 100%)" }}
        >
          <div className="absolute inset-0 bg-white translate-y-full transition-transform duration-500 cubic-bezier(0.4, 0, 0.2, 1) group-hover:translate-y-0" />
          <span className="relative z-10 text-white group-hover:text-black font-poppins font-bold uppercase text-xs md:text-sm tracking-[0.3em] transition-colors duration-500">
            Chat With Us
          </span>
        </Link>

        <Link
          href="#contact"
          className="group relative px-6 py-2 md:px-12 md:py-4 bg-pathfinder-green overflow-hidden transition-all duration-500 hover:shadow-[0_0_30px_rgba(46,204,113,0.3)]"
          style={{ clipPath: "polygon(10% 0, 100% 0, 90% 100%, 0% 100%)" }}
        >
          <div className="absolute inset-0 bg-white -translate-x-full transition-transform duration-500 cubic-bezier(0.4, 0, 0.2, 1) group-hover:translate-x-0" />
          <span className="relative z-10 text-black font-poppins font-bold uppercase text-xs md:text-sm tracking-[0.3em] transition-colors duration-500">
            Journey with us
          </span>
        </Link>
      </div>
    </div>
  );
}
