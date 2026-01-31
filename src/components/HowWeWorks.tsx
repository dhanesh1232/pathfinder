"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const cards = [
  {
    title: "Insight that ignites",
    text: "We question deeply before we create.",
  },
  {
    title: "Crafted with purpose",
    text: "Design that feels like it’s always belonged.",
  },
  {
    title: "Built to transform",
    text: "Every pixel moves business forward.",
  },
  {
    title: "Evolved to inspire",
    text: "Creativity that sets the next benchmark.",
  },
];

function TypingText({
  text,
  className,
  as: Component = "p",
}: {
  text: string;
  className?: string;
  as?: any;
}) {
  const el = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!el.current) return;

    // Split text into words to wrap correctly, then chars for animation
    const words = text.split(" ");
    el.current.innerHTML = "";

    words.forEach((word, wordIndex) => {
      const wordSpan = document.createElement("span");
      wordSpan.style.display = "inline-block";
      wordSpan.style.whiteSpace = "nowrap";
      wordSpan.style.marginRight = "0.25em"; // space between words

      const chars = word.split("");
      chars.forEach((char) => {
        const charSpan = document.createElement("span");
        charSpan.textContent = char;
        charSpan.style.opacity = "0";
        charSpan.className = "typing-char";
        wordSpan.appendChild(charSpan);
      });

      el.current!.appendChild(wordSpan);
    });

    gsap.to(el.current.querySelectorAll(".typing-char"), {
      opacity: 1,
      stagger: 0.02,
      duration: 0.1,
      ease: "power1.out",
    });
  }, [text]);

  return <Component ref={el} className={className} />;
}

export default function HowWeWorks() {
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(-1);

  useEffect(() => {
    if (!containerRef.current || !triggerRef.current || !wrapperRef.current)
      return;

    const ctx = gsap.context(() => {
      // 1. Initial Fade In (Independent of Scroll Position)
      gsap.fromTo(
        wrapperRef.current,
        { autoAlpha: 0 },
        {
          autoAlpha: 1,
          duration: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: triggerRef.current,
            start: "top center", // Appear when section hits center
            toggleActions: "play none none reverse",
          },
        },
      );

      // 2. Scroll Movement (Scrubbed)
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: triggerRef.current,
          start: "top top",
          end: "+=1100%",
          pin: true,
          scrub: 1, // Instant response to scroll
          anticipatePin: 1,
          onUpdate: () => {
            if (!containerRef.current) return;

            const viewportCenter = window.innerWidth / 2;
            const children = containerRef.current.children;
            let closestIndex = -1;
            let minDistance = Infinity;

            for (let i = 0; i < children.length; i++) {
              const rect = children[i].getBoundingClientRect();
              const cardCenter = rect.left + rect.width / 2;
              const distance = Math.abs(viewportCenter - cardCenter);
              const threshold = rect.width / 2;

              // Only active if close to center
              if (distance < threshold) {
                if (distance < minDistance) {
                  minDistance = distance;
                  closestIndex = i;
                }
              }
            }

            setActiveIndex(closestIndex);
          },
        },
      });

      // Move instantly from current position to left
      tl.to(containerRef.current, {
        x: () => -(containerRef.current!.scrollWidth - window.innerWidth),
        ease: "none",
      });
    }, triggerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={triggerRef}
      className="relative bg-transparent h-screen w-full overflow-hidden flex items-center justify-center"
    >
      {/* 
        Rotated Wrapper 
        rotate-6 creates the slope: \ (TL down to BR).
        Moving Left (against the slope) creates the visual effect of "Climbing" from BR to TL.
      */}
      {/* Static Title (Fixed inside the rotated container) */}
      <div className="z-20 pointer-events-none absolute left-[15%] top-[20%] md:top-[25%] md:left-[10%] max-w-sm md:max-w-md">
        <h2 className="text-5xl md:text-7xl font-black text-white italic tracking-tighter uppercase leading-[0.8] drop-shadow-xl text-wrap mb-8">
          How We Work
          <br />
          <span
            className="text-transparent"
            style={{ WebkitTextStroke: "2px white" }}
          >
            Pathfinder
          </span>
        </h2>

        {/* Dynamic Typing Title & Text */}
        <div className="pointer-events-auto min-h-[120px]">
          {activeIndex !== -1 && (
            <>
              <TypingText
                text={cards[activeIndex].title}
                as="h3"
                className="text-3xl md:text-4xl font-bold text-pathfinder-green mb-2 uppercase tracking-wide"
              />
              <TypingText
                text={cards[activeIndex].text}
                as="p"
                className="text-zinc-400 text-xl md:text-2xl font-light leading-relaxed"
              />
            </>
          )}
        </div>
      </div>
      <div
        ref={wrapperRef}
        className="relative w-screen h-[60vh] md:h-[80vh] bg-transparent rotate-6 flex items-center opacity-0 will-change-transform perspective-[2500px]"
      >
        {/* Scrollable Track */}
        <div
          ref={containerRef}
          className="flex items-center gap-10 pl-[80vw] pr-[20vw] rotate-x-20"
        >
          {cards.map((card, index) => (
            <div
              key={index}
              className={`shrink-0 w-[70vw] sm:w-[60vw] md:w-[50vw] lg:w-[40vw] h-[65vh] sm:h-[70vh] md:h-[80vh] bg-black border border-white/10 rounded-lg p-10 flex flex-col justify-between group transition-all duration-500 origin-center ${
                index === activeIndex
                  ? "border-pathfinder-green/50 shadow-[0_0_50px_-10px_rgba(46,204,113,0.1)] scale-100 opacity-100"
                  : "opacity-40 scale-95"
              }`}
              style={{
                transform: "rotateX(15deg)",
              }}
            >
              <div className="flex justify-between items-start">
                <span className="text-8xl font-black text-white/5 group-hover:text-pathfinder-green/20 transition-colors">
                  0{index + 1}
                </span>
                <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-pathfinder-green group-hover:border-pathfinder-green transition-all">
                  <span className="kb-arrow-right text-white" />
                </div>
              </div>

              <div>
                <h3 className="text-4xl font-bold text-white mb-4 uppercase tracking-tight">
                  {card.title}
                </h3>
                <p className="text-white/60 text-lg">{card.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
