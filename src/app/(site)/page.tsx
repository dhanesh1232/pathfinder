import HandSplitHero from "@/components/HandSplitHero";
import ParallaxTeam from "@/components/ParallaxTeam";
import TrustedBy from "@/components/TrustedBy";
import BannerCarousel from "@/components/BannerCarousel";
import Metrics from "@/components/Metrics";
import Services from "@/components/Services";
import Portfolio from "@/components/Portfolio";
import FounderNote from "@/components/FounderNote";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";
import TransformativeSection from "@/components/HowWeWorks";
import ContactForm from "@/components/ContactForm";
import WaveReveal from "@/components/WaveReveal";
import OurWork from "@/components/OurWork";
import TextMarquee from "@/components/TextMarquee";
import { Testimonials } from "@/components/Testimonials";

export default function Home() {
  return (
    <>
      {/* 1. Hero: Hand Split Reveal (Pinned Cinema) */}
      <HandSplitHero />

      {/* 2. Identity: People Section (Natural Scroll, IntersectionObserver) */}
      <ParallaxTeam />

      {/* 3. Trusted By / Logos */}
      <div data-lenis-speed="0.8" className="relative z-10">
        <TrustedBy />
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

      {/* 4c. 3D Slides Portfolio Showcase */}
      {/* <ThreeDCarousel images={PORTFOLIO_IMAGES} /> */}

      {/* 5. Services */}
      <Services />

      {/* 5b. Text Marquee Interlude */}
      <TextMarquee />

      {/* 6. How We Works */}
      <TransformativeSection />

      {/* 7. Portfolio */}
      <Portfolio />

      {/* 7b. Our Work / Reels Showcase */}
      <OurWork />

      {/* 8. Founder Note / Team Philosophy */}
      <FounderNote />

      {/* 9. Testimonials */}
      <Testimonials />

      {/* 10. Contact Form */}
      <ContactForm />

      {/* 11. CTA (Big Video Bg) */}
      <CTA />

      {/* 12. Footer (Links) */}
      <Footer />
    </>
  );
}
