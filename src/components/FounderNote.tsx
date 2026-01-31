"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const TESTIMONIALS = [
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

export default function FounderNote() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // Animate text sections
      gsap.fromTo(
        ".founder-reveal",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 70%",
            toggleActions: "play none none reverse",
          },
        },
      );

      // Animate Image Card
      gsap.fromTo(
        ".founder-card",
        { opacity: 0, scale: 0.95, rotationY: 10 },
        {
          opacity: 1,
          scale: 1,
          rotationY: 0,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".founder-card",
            start: "top 80%",
          },
        },
      );

      // Animate Testimonials
      gsap.fromTo(
        ".testimonial-card",
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".testimonials-grid",
            start: "top 85%",
          },
        },
      );
    },
    { scope: containerRef },
  );

  return (
    <section
      ref={containerRef}
      className="relative w-full py-24 md:py-40 px-6 bg-transparent z-10"
    >
      <div className="max-w-[1400px] mx-auto">
        {/* Top Header */}
        <div className="text-center mb-16 md:mb-24 founder-reveal">
          <h2 className="text-4xl md:text-5xl lg:text-7xl font-poppins font-bold text-white leading-[1.1]">
            Our Team
          </h2>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 mb-32 items-center">
          {/* Left: Personal Story */}
          <div className="order-2 lg:order-1">
            <h3 className="text-2xl md:text-3xl lg:text-4xl font-poppins font-bold text-white leading-[1.1]">
              One team. One vision. One Pathfinder Built with belief.{" "}
              <span className="text-pathfinder-green">Driven by purpose.</span>
            </h3>
            <div className="w-20 my-4 h-0.5 bg-linear-to-r from-transparent via-pathfinder-green to-transparent mx-0 mb-8" />
            <div className="founder-reveal space-y-8">
              <p className="text-base md:text-lg text-zinc-300 font-light leading-relaxed font-poppins">
                I started Pathfinder with a simple belief—great brands shouldn't
                be limited to big budgets. In a space where creativity is often
                rushed or overpriced, we chose a different path.
              </p>
              <p className="text-base md:text-lg text-zinc-300 font-light leading-relaxed font-poppins">
                We focus on clarity, quality, and honest delivery, helping
                brands grow with confidence. Every project we take is personal,
                and every solution is built with intention, capability, and
                respect for the client's vision.
              </p>

              {/* Dots Decoration */}
              <div className="flex gap-3 mt-8">
                <div className="w-4 h-4 rounded-full bg-pathfinder-green/40 animate-pulse" />
                <div className="w-4 h-4 rounded-full bg-pathfinder-green/70 animate-pulse delay-100" />
                <div className="w-4 h-4 rounded-full bg-pathfinder-green animate-pulse delay-200" />
              </div>
            </div>
          </div>

          {/* Right: Team Context & Card */}
          <div className="flex flex-col gap-12 items-end relative order-1 lg:order-2">
            {/* Founder Card */}
            <div className="founder-card relative group w-full max-w-md">
              {/* Giant Watermark Name behind image - Vertical */}
              <div className="absolute left-0 top-1/2 -translate-y-1/2 -z-10 hidden lg:flex pointer-events-none select-none mix-blend-overlay opacity-20 h-[120%] items-center">
                <span
                  className="text-4xl font-black text-transparent stroke-2 stroke-white leading-none whitespace-nowrap"
                  style={{
                    WebkitTextStroke: "2px white",
                    writingMode: "vertical-rl",
                    transform: "rotate(180deg)", // To make it read bottom-to-top if desired, or remove for top-to-bottom
                  }}
                >
                  JASWANTH
                </span>
              </div>

              <div className="absolute inset-0 bg-pathfinder-green/20 blur-2xl rounded-full opacity-0 group-hover:opacity-40 transition-opacity duration-700" />
              <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-zinc-900/50 backdrop-blur-sm">
                <img
                  src="/my-img.png"
                  alt="Founder"
                  className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                />

                {/* Gradient Overlay at bottom */}
                <div className="absolute inset-0 bg-linear-to-t from-black/90 via-transparent to-transparent" />

                <div className="absolute bottom-8 left-8">
                  <h4 className="text-white font-poppins font-bold text-2xl tracking-wide">
                    Jaswanth
                  </h4>
                  <p className="text-pathfinder-green font-poppins uppercase tracking-wider text-sm mt-1">
                    Founder & Creative Director
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Testimonials Section */}
        <div className="border-t border-white/10 pt-24 testimonials-grid">
          <h3 className="text-center text-4xl md:text-5xl font-poppins font-bold text-white mb-20">
            What our clients say
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="testimonial-card flex flex-col gap-6">
                <div className="text-pathfinder-green text-4xl font-serif">
                  "
                </div>
                <p className="text-zinc-300 font-poppins text-lg leading-relaxed">
                  {t.text}
                </p>
                <div>
                  <p className="text-white font-bold font-poppins">
                    {t.author}
                  </p>
                  <p className="text-zinc-500 text-sm font-poppins">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
