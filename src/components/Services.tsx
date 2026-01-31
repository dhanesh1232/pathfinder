"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";

const SERVICES = [
  {
    title: "Brand Identity & Design",
    subtitle: "Finding the visual path for your brand",
    description:
      "We design brand identities that communicate who you are and where you’re going. From logos and color systems to complete brand guidelines, we create visual languages that are timeless, flexible, and easy to scale.",
    note: "Our approach focuses on clarity over complexity — ensuring your brand looks professional, confident, and recognizable, without unnecessary costs.",
  },
  {
    title: "Creative Social Media Design",
    subtitle: "Designing content that stays on the right path",
    description:
      "We create social media designs that feel premium, consistent, and purposeful. Every visual is aligned with your brand identity and tailored to engage your audience across platforms.",
    note: "Our designs are built to perform — eye-catching, scroll-stopping, and affordable for long-term growth.",
  },
  {
    title: "Reel Production & Video Editing",
    subtitle: "Turning moments into meaningful stories",
    description:
      "We produce and edit reels and videos that connect emotionally and perform digitally. From concept and shooting to editing and delivery, we focus on clean storytelling, strong pacing, and platform-ready formats.",
    note: "No overproduction, no shortcuts — just impactful video content that fits your brand and your budget.",
  },
  {
    title: "Creative Campaigns",
    subtitle: "One idea. One direction. One clear path",
    description:
      "We develop creative campaigns that align design, messaging, and content into one strong narrative. Each campaign is crafted to stand out visually while staying focused on purpose and results.",
    note: "Our campaigns are designed to be impactful, scalable, and cost-effective — without losing creative depth.",
  },
  {
    title: "Social Media Design & Management",
    subtitle: "Managing your brand’s journey online",
    description:
      "We handle your social media presence with structure and consistency. From content planning and design to brand tone and posting flow, we ensure your digital presence stays aligned and professional.",
    note: "Our management approach supports steady growth — affordable, organized, and built for long-term visibility.",
  },
  {
    title: "Website & Landing Page Design",
    subtitle: "Building digital paths that convert",
    description:
      "We design websites and landing pages that are clean, responsive, and user-focused. Every layout is built with clear navigation, strong visuals, and purposeful content.",
    note: "Designed to perform, easy to maintain, and created with affordability in mind — without sacrificing quality.",
  },
];

const DESCRIPTION_TEXT =
  "Our holistic creative approach means we navigate without bias, letting the destination dictate the path. This allows us to clear the clutter and solve bigger brand challenges, creating a multiplier effect with our Pathfinder ethos. Strategic creativity helps us ask deeper questions, lead with vision, and discover the most authentic route to growth. Find out more by exploring our services.";

export default function Services() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // 1. Heading Text Reveal (OUR SERVICES - Char by Char)
      const headingAnim = gsap.fromTo(
        ".service-char",
        { yPercent: 100 },
        {
          yPercent: 0,
          duration: 1,
          ease: "power2.out",
          stagger: 0.03, // Faster stagger for chars
          scrollTrigger: {
            trigger: ".service-header",
            start: "top 85%",
            toggleActions: "play reverse play reverse",
          },
        },
      );

      // 2. Description Char Reveal
      gsap.fromTo(
        ".service-char-desc",
        { yPercent: 100 },
        {
          yPercent: 0,
          duration: 0.5,
          ease: "power2.out",
          stagger: 0.005, // Very fast stagger for long text
          scrollTrigger: {
            trigger: ".service-header",
            start: "top 85%",
            toggleActions: "play reverse play reverse",
          },
        },
      );

      // 3. Cards Stagger Reveal
      gsap.fromTo(
        ".service-card",
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
          stagger: 0.1,
          scrollTrigger: {
            trigger: ".service-grid",
            start: "top 85%",
          },
        },
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="service"
      ref={containerRef}
      className="relative w-full py-32 md:py-48 flex flex-col items-center justify-center px-6 md:px-8 z-10"
    >
      <div className="max-w-[1400px] w-full mx-auto">
        {/* Section Header */}
        <div className="service-header text-center mb-24 md:mb-40">
          <h2 className="flex flex-col items-center text-7xl md:text-9xl lg:text-[10rem] font-poppins font-black tracking-tight mb-12 text-white uppercase leading-[0.9]">
            {/* Line 1: OUR */}
            <div className="inline-block whitespace-nowrap">
              {"OUR".split("").map((char, i) => (
                <div key={i} className="overflow-hidden inline-block">
                  <span className="service-char inline-block">{char}</span>
                </div>
              ))}
            </div>
            {/* Line 2: SERVICES */}
            <div className="inline-block whitespace-nowrap">
              {"SERVICES".split("").map((char, i) => (
                <div key={i} className="overflow-hidden inline-block">
                  <span className="service-char inline-block">{char}</span>
                </div>
              ))}
            </div>
          </h2>

          {/* Description with Char-by-Char Animation */}
          <div className="service-subtitle text-zinc-300 text-lg md:text-xl leading-relaxed max-w-4xl mx-auto font-light">
            {DESCRIPTION_TEXT.split(" ").map((word, i) => (
              <span key={i} className="inline-block whitespace-nowrap mr-1.5">
                {word.split("").map((char, j) => (
                  <span
                    key={j}
                    className="overflow-hidden inline-block align-bottom"
                  >
                    <span className="service-char-desc inline-block">
                      {char}
                    </span>
                  </span>
                ))}
              </span>
            ))}
          </div>
        </div>

        {/* Services Grid */}
        <div className="service-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
          {SERVICES.map((service, index) => (
            <div
              key={index}
              className="service-card group relative flex flex-col p-10 rounded-sm bg-zinc-900/40 backdrop-blur-xl border border-white/5 overflow-hidden transition-all duration-500 hover:bg-zinc-900/60 hover:-translate-y-2 op-0"
            >
              {/* Vertical Path Line (Left Edge) */}
              <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-white/5">
                <div className="w-full h-full bg-pathfinder-green shadow-[0_0_15px_rgba(46,204,113,0.5)] -translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-in-out" />
              </div>

              {/* Service Index */}
              <div className="mb-8">
                <span className="text-xs font-mono text-zinc-600 tracking-widest">
                  {(index + 1).toString().padStart(2, "0")}/
                </span>
              </div>

              <div className="mb-auto">
                {/* Title */}
                <h3 className="text-2xl md:text-3xl font-medium text-white mb-4 group-hover:text-white transition-colors">
                  {service.title}
                </h3>
                {/* Subtitle */}
                <p className="text-pathfinder-green text-xs font-bold uppercase tracking-widest mb-6 opacity-90">
                  {service.subtitle}
                </p>
                {/* Description */}
                <p className="text-zinc-400 leading-relaxed text-sm md:text-base font-light">
                  {service.description}
                </p>
              </div>

              {/* Footer Note */}
              <div className="mt-12 pt-6 border-t border-white/5">
                <p className="text-zinc-500 text-xs md:text-sm italic font-light group-hover:text-zinc-400 transition-colors duration-300">
                  {service.note}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Section CTA */}
        <div className="service-card flex justify-center">
          <Link
            href="https://wa.me/"
            target="_blank"
            className="group relative inline-flex items-center gap-3 px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full backdrop-blur-md transition-all duration-300"
          >
            <span className="text-white text-sm font-medium tracking-wide uppercase">
              Start Your Project
            </span>
            <span className="w-2 h-2 rounded-full bg-pathfinder-green shadow-[0_0_10px_rgba(46,204,113,0.8)] group-hover:scale-125 transition-transform duration-300" />
          </Link>
        </div>
      </div>
    </section>
  );
}
