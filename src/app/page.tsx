import HandSplitHero from "@/components/HandSplitHero";
import ParallaxTeam from "@/components/ParallaxTeam";
import TrustedBy from "@/components/TrustedBy";
import BannerCarousel from "@/components/BannerCarousel";
import Metrics from "@/components/Metrics";
import Services from "@/components/Services";
import Portfolio from "@/components/Portfolio";
import FounderNote from "@/components/FounderNote";
import Footer from "@/components/Footer";
import TransformativeSection from "@/components/HowWeWorks";

export default function Home() {
  return (
    <>
      {/* 1. Hero: Hand Split Reveal (Pinned Cinema) */}
      <HandSplitHero />

      {/* 2. Identity: People Section (Natural Scroll, IntersectionObserver) */}
      <ParallaxTeam />

      {/* 3. Trusted By / Logos */}
      <TrustedBy />

      {/* 3b. Banner Carousel */}
      <BannerCarousel />

      {/* 4. Metrics / Projects */}
      <Metrics />

      {/* 5. Services */}
      <Services />

      {/* 6. How We Works */}
      <TransformativeSection />

      {/* 7. Portfolio */}
      <Portfolio />

      {/* 8. Founder Note / Team Philosophy */}
      <FounderNote />

      {/* 9. Contact / Footer */}
      <Footer />
    </>
  );
}
