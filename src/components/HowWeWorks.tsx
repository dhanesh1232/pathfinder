"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useIsMobile } from "@/hooks/use-mobile";

gsap.registerPlugin(ScrollTrigger);

const cards = [
  {
    title: "Discovery & Strategy",
    text: "We dive deep into your brand, audience, and goals to build a roadmap for success.",
    image: "/portfolio one/overseas.png",
  },
  {
    title: "Research & Analysis",
    text: "Gathering insights and analyzing market trends to inform every decision we make.",
    image: "/portfolio one/book my studio.png",
  },
  {
    title: "Design & Experience",
    text: "Crafting intuitive interfaces and memorable brand identities that resonate with users.",
    image: "/portfolio one/ui.jpeg",
  },
  {
    title: "Development & Engineering",
    text: "Turning designs into high-performance digital products using cutting-edge technologies.",
    image: "/portfolio one/v mart.png",
  },
  {
    title: "Testing & QA",
    text: "Rigorous testing across devices and platforms to ensure a flawless user experience.",
    image: "/portfolio one/cetaphil.png",
  },
  {
    title: "Launch & Growth",
    text: "Deploying your product and continuously optimizing for long-term impact and scale.",
    image: "/portfolio one/jewel.png",
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
  const isMobile = useIsMobile(640);
  const isTablet = useIsMobile(1024);

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

      const end = isMobile ? "+=1000%" : isTablet ? "+=1200%" : "+=1500%";
      // 2. Scroll Movement (Scrubbed)
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: triggerRef.current,
          start: "top top",
          end,
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
    <>
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
        <div className="z-20 pointer-events-none absolute left-[7%] top-[20%] md:top-[25%] md:left-[8%] max-w-sm md:max-w-md">
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
            className="flex items-center gap-4 pl-[80vw] pr-[20vw] rotate-x-20"
          >
            {cards.map((card, index) => (
              <div
                key={index}
                className={`relative shrink-0 w-[80vw] sm:w-[70vw] md:w-[60vw] lg:w-[50vw] h-[70vh] sm:h-[75vh] md:h-[80vh] lg:h-[85vh] bg-black border border-white/10 rounded overflow-hidden flex flex-col justify-between group transition-all duration-500 origin-center ${
                  index === activeIndex
                    ? "border-pathfinder-green/50 scale-100 opacity-100"
                    : "opacity-40 scale-95"
                }`}
                style={{
                  transform: "rotateX(25deg)",
                }}
              >
                {/* Image Background */}
                <div className="absolute inset-0 z-0">
                  <img
                    src={card.image}
                    alt={card.title}
                    className="w-full h-full object-cover transition-transform duration-700"
                    onError={(e) => {
                      e.currentTarget.src =
                        "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800"; // Fallback abstract image
                    }}
                  />
                </div>

                {/* Card Content Overlay */}
                <div className="relative z-10 flex flex-col justify-between h-full p-8 md:p-10">
                  <div className="flex justify-between items-start">
                    <span className="text-6xl md:text-8xl font-black text-white/10 group-hover:text-pathfinder-green/40 transition-colors rounded-full px-2">
                      0{index + 1}
                    </span>
                    <div className="w-12 h-12 md:w-14 md:h-14 rounded-full border border-white/20 flex items-center justify-center bg-black/20 backdrop-blur-md group-hover:bg-pathfinder-green group-hover:border-pathfinder-green group-hover:text-black transition-all" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Spacer between How We Works and Services */}
      <div className="h-[1500svh]" />
    </>
  );
}
