"use client";

import { useEffect, useRef } from "react";

export function UseResizeReload() {
  const widthRef = useRef<number | null>(null);

  useEffect(() => {
    // Set initial width
    if (typeof window !== "undefined") {
      widthRef.current = window.innerWidth;
    }

    let timeoutId: NodeJS.Timeout;

    const handleResize = () => {
      // Ignore if width didn't change (mobile scroll triggering resize)
      if (widthRef.current === window.innerWidth) return;

      // Update ref to new width
      widthRef.current = window.innerWidth;

      // Debounce logic
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        window.location.reload();
      }, 500); // 500ms debounce
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(timeoutId);
    };
  }, []);

  return null;
}
