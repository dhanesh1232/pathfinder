"use client";

import { useEffect, useState, useCallback } from "react";
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

export function Testimonials() {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  const updateState = useCallback((api: CarouselApi) => {
    if (!api) return;
    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());
  }, []);

  useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  return (
    <div className="border-t border-white/10 pt-4 testimonials-grid relative">
      <h3 className="text-center text-4xl md:text-5xl font-poppins font-bold text-white mb-16 animate-fade-in relative z-10 py-4">
        What our clients say
      </h3>

      <div className="px-12 max-w-full mx-auto">
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
          className="w-full"
        >
          <CarouselContent className="-ml-4">
            {TESTIMONIALS_DATA.map((t, i) => (
              <CarouselItem
                key={i}
                className="pl-4 basis-full md:basis-1/2 lg:basis-1/3 min-w-[1500px]:basis-1/4"
              >
                <div className="p-8 rounded-2xl h-full flex flex-col justify-between hover:border-pathfinder-green/30 transition-all duration-300 group min-h-[300px]">
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
          <CarouselPrevious className="cursor-pointer" />
          <CarouselNext className="cursor-pointer" />
        </Carousel>

        {/* Indicators */}
        <div className="flex justify-center gap-2 mt-8">
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
  );
}
