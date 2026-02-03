"use client";

import { BsWhatsapp } from "react-icons/bs";
import { HiChevronUp } from "react-icons/hi";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

function BackToTop() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const controls = useAnimation();

  useEffect(() => {
    const wrapper = document.getElementById("smooth-wrapper") || window;

    const handleScroll = () => {
      let totalScroll = 0;
      let maxScroll = 1;

      if (wrapper === window) {
        totalScroll = window.scrollY;
        maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      } else {
        const el = wrapper as HTMLElement;
        totalScroll = el.scrollTop;
        maxScroll = el.scrollHeight - el.clientHeight;
      }

      const scroll = maxScroll > 0 ? totalScroll / maxScroll : 0;
      setScrollProgress(scroll * 100);

      if (totalScroll > 100) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    wrapper.addEventListener("scroll", handleScroll);
    return () => wrapper.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    const wrapper = document.getElementById("smooth-wrapper");
    if (wrapper) {
      wrapper.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, y: 50, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.8 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={scrollToTop}
          className="fixed bottom-4 left-4 z-50 cursor-pointer flex items-center justify-center p-2" // Added padding for easy hover area
          aria-label="Back to top"
          onHoverStart={() => controls.start("hover")}
          onHoverEnd={() => controls.start("idle")}
        >
          {/* Glass Container */}
          <div className="relative flex items-center justify-center w-12 h-12 rounded-full bg-black/40 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] overflow-hidden transition-colors duration-300 hover:bg-black/60 hover:border-pathfinder-green/30">
            {/* SVG Progress Ring */}
            <svg
              className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none p-1" // Added padding to ring
              viewBox="0 0 100 100"
            >
              {/* Background Track */}
              <circle
                cx="50"
                cy="50"
                r="44"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                className="text-white/10"
              />
              {/* Progress Indicator */}
              <motion.circle
                cx="50"
                cy="50"
                r="44"
                fill="none"
                stroke="#D6FF00"
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray="276" // 2 * PI * 44
                strokeDashoffset={276 - (scrollProgress / 100) * 276}
                className="transition-all duration-100 ease-linear shadow-[0_0_10px_#D6FF00]"
              />
            </svg>

            {/* Icon Container with Mask */}
            <div className="relative h-6 w-6 overflow-hidden">
              <motion.div
                className="flex flex-col items-center gap-6" // Gap matches height of container effectively pushing next icon down
                variants={{
                  idle: { y: 0 },
                  hover: {
                    y: -48, // Move up by (icon height + gap) * number of steps? No, just move up enough manually.
                    // Icon is roughly 24px height (text-2xl). Gap 24px (gap-6). Total 48px to next icon.
                    transition: {
                      duration: 0.4,
                      ease: [0.33, 1, 0.68, 1], // Custom ease
                    },
                  },
                }}
                animate={controls}
              >
                <HiChevronUp className="text-white text-2xl shrink-0" />
                <HiChevronUp className="text-pathfinder-green text-2xl shrink-0" />
              </motion.div>
            </div>
          </div>
        </motion.button>
      )}
    </AnimatePresence>
  );
}

function WhatsAppFloat() {
  const [isHovered, setIsHovered] = useState(false);
  const floatRef = useRef(null);

  useGSAP(
    () => {
      gsap.to(floatRef.current, {
        y: -10,
        duration: 1,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    },
    { scope: floatRef },
  );

  return (
    <Link
      ref={floatRef}
      href="https://wa.me/919676104199?text=Hello%20Pathfinders%2C%20I%20would%20like%20to%20know%20more%20about%20your%20services."
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-4 right-4 md:right-8 z-50 flex items-center justify-end"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        layout
        className="flex items-center bg-black/60 backdrop-blur-xl border border-white/10 rounded-full cursor-pointer shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] overflow-hidden"
        initial={{ padding: "6px" }}
        animate={{
          padding: isHovered ? "6px 20px 6px 6px" : "6px",
          gap: isHovered ? "12px" : "0px",
        }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
      >
        <div className="relative shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-[#25D366] shadow-[0_0_15px_rgba(37,211,102,0.4)] z-10">
          <BsWhatsapp className="text-white h-5 w-5 relative z-10" />
          {/* Pulse Ring */}
          <motion.div
            className="absolute inset-0 rounded-full border border-[#25D366]"
            animate={{ scale: [1, 1.5], opacity: [1, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
          />
        </div>

        <motion.span
          className="text-white font-medium text-sm whitespace-nowrap overflow-hidden"
          initial={{ width: 0, opacity: 0 }}
          animate={{
            width: isHovered ? "auto" : 0,
            opacity: isHovered ? 1 : 0,
          }}
          transition={{ duration: 0.3 }}
        >
          Chat with us
        </motion.span>
      </motion.div>
    </Link>
  );
}

export default function FloatingControls() {
  const pathname = usePathname();

  // Do not render on admin pages if applicable, or generic check
  if (pathname?.startsWith("/admin")) return null;

  return (
    <>
      <BackToTop />
      <WhatsAppFloat />
    </>
  );
}
