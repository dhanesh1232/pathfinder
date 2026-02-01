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
      // 1. Description Char Reveal
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

      // 2. Cards Stagger Reveal
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
      <div className="max-w-7xl w-full mx-auto">
        {/* Section Header */}
        <div className="service-header text-center mb-32 md:mb-48">
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
          <div className="service-subtitle text-zinc-300 text-lg md:text-xl leading-relaxed max-w-4xl mx-auto font-light font-nohemi">
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
              className="service-card group relative flex flex-col p-8 md:p-10 rounded-3xl bg-green-900/20 backdrop-blur-2xl border border-white/10 overflow-hidden transition-all duration-500 hover:border-emerald-500/40 hover:bg-emerald-950/20 hover:shadow-[0_0_40px_rgba(16,185,129,0.1)] opacity-0"
            >
              {/* Internal Emerald Glow Gradient */}
              <div className="absolute -inset-1/2 bg-radial-gradient from-emerald-500/20 to-transparent opacity-0 group-hover:opacity-100 blur-3xl transition-opacity duration-700 pointer-events-none" />

              {/* Right Side Fluid Water Drop Animation */}
              <div className="absolute right-0 top-0 bottom-0 w-[2px] pointer-events-none overflow-visible">
                {/* The Droplet Runner */}
                <div className="absolute top-full right-0 w-[2px] h-[100px] bg-linear-to-t from-transparent to-emerald-400 group-hover:top-[50%] transition-all duration-[1.5s] ease-in-out">
                  {/* Glowing Head with Emerald Noise */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[6px] h-[16px] bg-emerald-400 rounded-full blur-[1px] shadow-[0_0_15px_#34d399] overflow-hidden">
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMjAwIDIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZmlsdGVyIGlkPSJmIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iMC42NSIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIG9wYWNpdHk9IjAuNSIgZmlsdGVyPSJ1cmwoI2YpIi8+PC9zdmc+')] opacity-60 mix-blend-overlay" />
                  </div>
                  {/* Solid Core */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-px h-[2.5px] bg-emerald-400 rounded-full opacity-100 shadow-[0_0_5px_green]" />
                </div>
              </div>

              <div className="mb-auto mt-2 relative z-10">
                {/* Subtitle (Moved Above Title for hierarchy) */}
                <p className="text-emerald-400 text-xs font-bold uppercase tracking-[0.2em] mb-4 opacity-80 font-aalto">
                  {service.subtitle}
                </p>
                {/* Title */}
                <h3 className="text-3xl md:text-4xl font-medium text-white mb-6 leading-tight group-hover:translate-x-0.5 transition-transform duration-300">
                  {service.title}
                </h3>
                {/* Description */}
                <p className="text-zinc-400 group-hover:text-zinc-300 leading-relaxed text-sm md:text-base font-light font-nohemi transition-colors">
                  {service.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Section CTA */}
        <div className="service-card flex justify-center">
          <Link
            href="https://wa.me/+919676104199"
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
