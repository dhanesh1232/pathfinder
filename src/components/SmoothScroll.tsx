"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function SmoothScroll() {
  useEffect(() => {
    // Target the specific scroll wrapper
    const wrapper = document.getElementById(
      "smooth-wrapper",
    ) as HTMLElement | null;
    const content = document.getElementById(
      "smooth-content",
    ) as HTMLElement | null;

    if (!wrapper || !content) return;

    // Force scroll to top on reload
    if (typeof window !== "undefined") {
      window.history.scrollRestoration = "manual";
      wrapper.scrollTop = 0;
    }

    const lenis = new Lenis({
      wrapper: wrapper,
      content: content,
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Exponential smoothing
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      syncTouch: true,
      touchMultiplier: 2,
    });

    // Synchronize Lenis with ScrollTrigger
    lenis.on("scroll", ScrollTrigger.update);

    // Use GSAP's ticker to drive Lenis for perfect sync
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    // Set default scroller for triggers created after this
    ScrollTrigger.defaults({ scroller: wrapper });

    return () => {
      gsap.ticker.remove(lenis.raf);
      lenis.destroy();
    };
  }, []);

  return null;
}
