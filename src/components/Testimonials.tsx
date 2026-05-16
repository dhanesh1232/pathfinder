"use client";

import { useRef, useState, useEffect, useMemo } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { Quote } from "lucide-react";

// --- Fallback Testimonials ---
const TESTIMONIALS_DATA = [
  {
    text: "Pathfinder didn't just design our brand—they helped us find clarity and confidence in how we present ourselves.",
    author: "Sarah J.",
    role: "CEO, TechStart",
  },
  {
    text: "The team's dedication to quality and detail is unmatched. They truly cared about our vision from day one.",
    author: "David M.",
    role: "Founder, GreenLife",
  },
  {
    text: "Creative, strategic, and remarkably efficient. Working with Pathfinder felt like having an internal partner.",
    author: "Elena R.",
    role: "Marketing Director",
  },
  {
    text: "Pathfinder didn't just design our brand—they helped us find clarity and confidence in how we present ourselves.",
    author: "Sarah J.",
    role: "CEO, TechStart",
  },
  {
    text: "The team's dedication to quality and detail is unmatched. They truly cared about our vision from day one.",
    author: "David M.",
    role: "Founder, GreenLife",
  },
  {
    text: "Creative, strategic, and remarkably efficient. Working with Pathfinder felt like having an internal partner.",
    author: "Elena R.",
    role: "Marketing Director",
  },
];

export function Testimonials({ initialTestimonials = [] }: { initialTestimonials?: any[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const testimonialRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number | "auto">("auto");
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  const testimonials = useMemo(() => {
    if (initialTestimonials && initialTestimonials.length > 0) {
      return initialTestimonials;
    }
    return TESTIMONIALS_DATA;
  }, [initialTestimonials]);

  useEffect(() => {
    // Scroll Reveal Animation (Targeting the container itself)
    if (!containerRef.current) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const scrollerEl = document.getElementById("smooth-wrapper");
      const scroller = scrollerEl || window;

      // 1. Container Reveal (Fade Up)
      gsap.fromTo(
        containerRef.current,
        { y: 100, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: containerRef.current,
            scroller: scroller,
            start: "top 90%", // Reveal when top of section hits 90%
            toggleActions: "play none none reverse",
          },
        },
      );

      // 2. Testimonial Heading Char Reveal
      gsap.fromTo(
        ".testimonial-char",
        { yPercent: 100 },
        {
          yPercent: 0,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.02,
          scrollTrigger: {
            trigger: containerRef.current,
            scroller: scroller,
            start: "top 85%",
            toggleActions: "play reverse play reverse",
          },
        },
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);
  useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());

    const updateHeight = () => {
      const slides = api.slideNodes();
      const activeIndex = api.selectedScrollSnap();
      const activeSlide = slides[activeIndex];
      if (activeSlide) {
        // Enforce a minimum height for consistency if slightly empty
        const newHeight = Math.max(activeSlide.offsetHeight, 300);
        setHeight(newHeight);
      }
    };

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
      updateHeight();
    });

    api.on("reInit", updateHeight);
    updateHeight();

    // Resize listener
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, [api]);

  return (
    <section ref={containerRef} className="relative w-full px-6 z-10">
      <div className="max-w-7xl mx-auto">
        <div className="py-12 testimonials-grid relative">
          <h3 className="text-left md:text-center mb-4 relative z-10 py-4">
            <div className="inline-block">
              {"WHAT OUR CLIENTS SAY".split("").map((char, i) => (
                <div key={i} className="overflow-hidden inline-block relative">
                  <span
                    className={`testimonial-char inline-block font-poppins font-bold text-4xl md:text-5xl text-white uppercase leading-[1.1] tracking-tight ${
                      char === " " ? "w-3 md:w-4" : ""
                    }`}
                  >
                    {char === " " ? "\u00A0" : char}
                  </span>
                </div>
              ))}
            </div>
          </h3>

          <div className="px-0 md:px-12 max-w-full mx-auto">
            <Carousel
              setApi={setApi}
              opts={{
                align: "start",
                loop: true,
              }}
              plugins={[
                Autoplay({
                  delay: 4000,
                }),
              ]}
              className="w-full relative"
            >
              <div
                className="transition-[height] duration-500 ease-out overflow-hidden"
                style={{ height: height === "auto" ? "auto" : `${height}px` }}
              >
                <CarouselContent className="-ml-4 items-start">
                  {testimonials.map((t, i) => (
                    <CarouselItem
                      key={i}
                      className="pl-4 basis-full md:basis-1/2 lg:basis-1/3 min-w-[1500px]:basis-1/4"
                    >
                      <div className="p-4 rounded-xl h-full flex flex-col justify-between hover:border-pathfinder-green/30 transition-all duration-300 group min-h-[300px]">
                        <div>
                          <Quote className="text-pathfinder-green text-5xl font-serif mb-4 opacity-50 group-hover:opacity-100 transition-opacity" />
                          <p className="text-zinc-200 font-nohemi text-lg leading-relaxed mb-6">
                            {t.text}
                          </p>
                        </div>
                        <div className="border-t border-white/5 pt-4">
                          <p className="text-white font-bold font-poppins text-lg">
                            {t.author}
                          </p>
                          <p className="text-pathfinder-green text-sm font-aalto uppercase tracking-widest mt-1">
                            {t.role}
                          </p>
                        </div>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </div>

              {/* Mobile Controls */}
              <div className="flex md:hidden justify-end gap-4 mt-6 pr-2">
                <CarouselPrevious className="static translate-y-0 border-white/10 hover:bg-white/10 hover:border-pathfinder-green h-10 w-10" />
                <CarouselNext className="static translate-y-0 border-white/10 hover:bg-white/10 hover:border-pathfinder-green h-10 w-10" />
              </div>

              {/* Desktop Controls */}
              <CarouselPrevious className="hidden md:flex -left-6 lg:-left-12 border-white/10 hover:bg-white/10 hover:border-pathfinder-green" />
              <CarouselNext className="hidden md:flex -right-6 lg:-right-12 border-white/10 hover:bg-white/10 hover:border-pathfinder-green" />
            </Carousel>

            {/* Indicators */}
            <div className="flex justify-center gap-2 mt-8 z-20 relative">
              {Array.from({ length: count }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => api?.scrollTo(index)}
                  className={`h-2 rounded-full overflow-hidden relative transition-all duration-300 ${
                    index === current
                      ? "w-8 bg-white/20"
                      : "w-2 bg-white/20 hover:bg-white/40"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                >
                  {index === current && (
                    <div
                      className="absolute top-0 left-0 h-full bg-pathfinder-green animate-fill-progress rounded-full"
                      style={{ animationDuration: "4000ms" }}
                    />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
