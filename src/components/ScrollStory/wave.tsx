"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./ScrollStory.module.css";

gsap.registerPlugin(ScrollTrigger);

export function CanvasWave() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const section = sectionRef.current!;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const wave = {
      y: height * 0.7,
      amplitude: 40,
      frequency: 0.015,
    };

    const drawWave = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = "#0b0b0b";

      ctx.beginPath();
      ctx.moveTo(0, wave.y);

      for (let x = 0; x <= width; x++) {
        const y = wave.y + Math.sin(x * wave.frequency) * wave.amplitude;
        ctx.lineTo(x, y);
      }

      ctx.lineTo(width, 0);
      ctx.lineTo(0, 0);
      ctx.closePath();
      ctx.fill();
    };

    drawWave();

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: "+=300%",
        scrub: true,
        pin: true,
      },
      onUpdate: drawWave,
    });

    tl.to(wave, {
      y: height * 0.2,
      ease: "none",
    }).fromTo(
      textRef.current,
      { opacity: 0, y: 60 },
      { opacity: 1, y: 0 },
      0.3,
    );

    const onResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      wave.y = height * 0.7;
      drawWave();
    };

    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <section ref={sectionRef} className={styles.section}>
      <canvas ref={canvasRef} className={styles.canvas} />
      <div ref={textRef} className={styles.text}>
        Scroll becomes water
      </div>
    </section>
  );
}
