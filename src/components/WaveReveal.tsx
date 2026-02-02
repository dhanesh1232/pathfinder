"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

class Wave {
  y: number;
  targetY: number;
  amplitude: number;
  wavelength: number;
  phase: number;
  speed: number;
  color: string;
  index: number;

  constructor(
    canvasHeight: number,
    canvasWidth: number,
    index: number,
    totalWaves: number,
  ) {
    this.index = index;
    // Start well below the screen
    this.y = canvasHeight + 300;

    // Calculate target height - The last wave should cover the entire screen (y < 0)
    // Distribute targets from bottom up to top
    // index 0 is first wave (lowest target visible), index total-1 is last wave (highest target)
    const progress = (index + 1) / totalWaves;

    // We want the waves to stack up.
    // The final wave should be at y <= -amplitude (fully covering screen)
    // The first wave should be just visible at bottom.

    // Linear interpolation for target
    const minTarget = canvasHeight * 0.7; // First wave height
    const maxTarget = -100; // Last wave height (above top)

    // Lerp
    this.targetY = minTarget - progress * (minTarget - maxTarget);

    // Randomize shape
    this.wavelength = canvasWidth * (0.4 + Math.random() * 0.2);
    this.amplitude = 30 + Math.random() * 30;
    this.phase = Math.random() * Math.PI * 2;
    this.speed = 0.02 + Math.random() * 0.01;

    // Solid black
    this.color = "#000000";
  }

  update(damping = 0.04) {
    this.phase += this.speed;
    // Smooth easing to target position
    this.y += (this.targetY - this.y) * damping;
  }

  draw(ctx: CanvasRenderingContext2D, width: number, height: number) {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.moveTo(0, height); // Bottom Left

    // Draw wave curve
    for (let x = 0; x <= width; x += 10) {
      const y =
        this.y +
        Math.sin((x / this.wavelength) * Math.PI * 2 + this.phase) *
          this.amplitude;
      ctx.lineTo(x, y);
    }

    ctx.lineTo(width, height); // Bottom Right
    ctx.lineTo(0, height); // Close at Bottom Left
    ctx.closePath();
    ctx.fill();
  }
}

export default function WaveReveal() {
  const container = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const turbulenceRef = useRef<SVGFETurbulenceElement>(null);

  const state = useRef({
    waves: [] as Wave[],
    width: 0,
    height: 0,
    scrollProgress: 0,
    targetWaveCount: 1, // Start with at least 1 wave
  });

  const MAX_WAVES = 6; // Sufficient to create the stacking effect

  useEffect(() => {
    // JavaScript-driven animation for the text wave filter
    if (!turbulenceRef.current) return;

    let frames = 0;
    let reqId: number;

    const animateFilter = () => {
      frames++;
      // Oscillate baseFrequency to create the waving liquid effect
      // freqX handles horizontal ripples, freqY handles vertical
      const freqX = 0.01 + Math.sin(frames * 0.02) * 0.005;
      const freqY = 0.02 + Math.cos(frames * 0.02) * 0.005;

      turbulenceRef.current!.setAttribute("baseFrequency", `${freqX} ${freqY}`);

      reqId = requestAnimationFrame(animateFilter);
    };

    animateFilter();

    return () => cancelAnimationFrame(reqId);
  }, []);

  useGSAP(
    () => {
      if (!container.current) return;

      // Animate waves as the section scrolls through the viewport
      ScrollTrigger.create({
        trigger: container.current,
        start: "top top", // Start pinning when section reaches top of viewport
        end: "top bottom", // Scroll for 400% of viewport height (slow reveal)
        pin: true,
        pinSpacing: true, // Add spacing so next section waits
        scrub: 1,
        onUpdate: (self) => {
          const p = self.progress;
          state.current.scrollProgress = p;

          // Determine how many waves should be active based on scroll
          // We map 0-1 progress to 1-MAX_WAVES
          const count = Math.max(1, Math.ceil(p * MAX_WAVES));
          state.current.targetWaveCount = count;
        },
      });

      // Text entrance
      if (textRef.current) {
        gsap.from(textRef.current, {
          y: 60,
          opacity: 0,
          duration: 1.2,
          ease: "power2.out",
        });
      }

      ScrollTrigger.refresh();
    },
    { scope: container },
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const handleResize = () => {
      if (typeof window === "undefined") return;
      state.current.width = window.innerWidth;
      state.current.height = window.innerHeight;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      state.current.waves = []; // Reset for simplicity
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    let reqId: number;
    const render = () => {
      const { width, height, targetWaveCount, waves } = state.current;

      // 1. Manage Waves
      if (waves.length < targetWaveCount) {
        for (let i = waves.length; i < targetWaveCount; i++) {
          state.current.waves.push(new Wave(height, width, i, MAX_WAVES));
        }
      } else if (waves.length > targetWaveCount) {
        state.current.waves = waves.slice(0, targetWaveCount);
      }

      // 2. Draw
      ctx.clearRect(0, 0, width, height);

      state.current.waves.forEach((wave) => {
        wave.update();
        wave.draw(ctx, width, height);
      });

      reqId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(reqId);
    };
  }, []);

  return (
    <div
      ref={container}
      className="relative h-screen w-full bg-white text-black overflow-hidden"
    >
      {/* SVG Filter for Wave Text Effect */}
      <svg className="hidden">
        <defs>
          <filter id="wave-filter">
            <feTurbulence
              ref={turbulenceRef}
              type="fractalNoise"
              baseFrequency="0.01 0.02"
              numOctaves="1"
              result="noise"
              seed="1"
            />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="10" />
          </filter>
        </defs>
      </svg>

      {/* 
        Text Layer 
        - mix-blend-difference makes it white on black waves, black on white BG.
        - z-20 to be on top of canvas
      */}
      <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none mix-blend-difference text-white">
        <div ref={textRef} className="text-center px-4">
          <h2
            className="font-poppins font-black text-6xl md:text-8xl lg:text-9xl tracking-tighter uppercase leading-none mb-4"
            style={{ filter: "url(#wave-filter)" }}
          >
            Digital <span className="font-nohemi font-light italic">made</span>
            <br />
            Soulful
          </h2>
          <p className="font-nohemi text-xl md:text-2xl text-current max-w-lg mx-auto mt-6 opacity-80">
            Crafting digital experiences that resonate on a deeper level.
          </p>
        </div>
      </div>

      {/* Canvas Layer - z-10 */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-10"
      />
    </div>
  );
}
