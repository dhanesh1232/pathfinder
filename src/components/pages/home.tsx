"use client";

import dynamic from "next/dynamic";
import HandSplitHero from "@/components/HandSplitHero";
import ParallaxTeam from "@/components/ParallaxTeam";
import TrustedBy from "@/components/TrustedBy";
import BannerCarousel from "@/components/BannerCarousel";
import Metrics from "@/components/Metrics";
import Footer from "@/components/Footer";
import {
  getLogos,
  getPortfolioItems,
  getOurWorkItems,
  getTestimonials,
} from "@/app/actions/content";
import { useEffect, useState } from "react";

// Dynamically import heavy below-the-fold components
const Services = dynamic(() => import("@/components/Services"));
const Portfolio = dynamic(() => import("@/components/Portfolio"));
const FounderNote = dynamic(() => import("@/components/FounderNote"));
const CTA = dynamic(() => import("@/components/CTA"));
const TransformativeSection = dynamic(() => import("@/components/HowWeWorks"));
const ContactForm = dynamic(() => import("@/components/ContactForm"));
const WaveReveal = dynamic(() => import("@/components/WaveReveal"));
const OurWork = dynamic(() => import("@/components/OurWork"));
const TextMarquee = dynamic(() => import("@/components/TextMarquee"));
const Testimonials = dynamic(() =>
  import("@/components/Testimonials").then((mod) => ({
    default: mod.Testimonials,
  })),
);

export function HomePage() {
  const [logos, setLogos] = useState<any[]>([]);
  const [portfolioItems, setPortfolioItems] = useState<any[]>([]);
  const [ourWorkItems, setOurWorkItems] = useState<any[]>([]);
  const [testimonials, setTestimonials] = useState<any[]>([]);

  useEffect(() => {
    const fetchContent = async () => {
      const [logosData, portfolioData, ourWorkData, testimonialsData] =
        await Promise.all([
          getLogos().catch(() => []),
          getPortfolioItems().catch(() => []),
          getOurWorkItems().catch(() => []),
          getTestimonials().catch(() => []),
        ]);
      setLogos(logosData);
      setPortfolioItems(portfolioData);
      setOurWorkItems(ourWorkData);
      setTestimonials(testimonialsData);
    };
    fetchContent();
  }, []);

  return (
    <>
      {/* 1. Hero: Hand Split Reveal (Pinned Cinema) */}
      <HandSplitHero />

      {/* 2. Identity: People Section (Natural Scroll, IntersectionObserver) */}
      <ParallaxTeam />

      {/* 3. Trusted By / Logos */}
      <div data-lenis-speed="0.8" className="relative z-10">
        <TrustedBy initialLogos={logos} />
      </div>

      {/* 3b. Banner Carousel */}
      <div data-lenis-speed="1.1" className="relative z-10">
        <BannerCarousel />
      </div>

      {/* 4. Metrics / Projects */}
      <Metrics />

      {/* 4b. Wave Reveal Transition */}
      <div className="hidden md:block">
        <WaveReveal />
      </div>

      {/* 5. Services */}
      <Services />

      {/* 5b. Text Marquee Interlude */}
      <TextMarquee />

      {/* 6. How We Works */}
      <TransformativeSection />

      {/* 7. Portfolio */}
      <Portfolio initialItems={portfolioItems} />

      {/* 7b. Our Work / Reels Showcase */}
      <OurWork initialItems={ourWorkItems} />

      {/* 8. Founder Note / Team Philosophy */}
      <FounderNote />

      {/* 9. Testimonials */}
      <Testimonials initialTestimonials={testimonials} />

      {/* 10. Contact Form */}
      <ContactForm />

      {/* 11. CTA (Big Video Bg) */}
      <CTA />

      {/* 12. Footer (Links) */}
      <Footer />
    </>
  );
}
