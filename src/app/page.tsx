import HandSplitHero from "@/components/HandSplitHero";
import ParallaxTeam from "@/components/ParallaxTeam";
import TrustedBy from "@/components/TrustedBy";
import Metrics from "@/components/Metrics";
import Services from "@/components/Services";
import Portfolio from "@/components/Portfolio";
import Testimonial from "@/components/Testimonial";
import Footer from "@/components/Footer";
import TransformativeSection from "@/components/HowWeWorks";

export default function Home() {
  return (
    <>
      {/* 1. Hero: Hand Split Reveal (Pinned Cinema) */}
      <HandSplitHero />

      {/* 2. Identity: People Section (Natural Scroll, IntersectionObserver) */}
      <ParallaxTeam />

      {/* Spacer between Hero and People */}
      <div className="h-[300svh]" />

      {/* 3. Trusted By / Logos */}
      <TrustedBy />

      {/* 4. Metrics / Projects */}
      <Metrics />

      {/* 5. How We Works */}
      <TransformativeSection />

      {/* Spacer between How We Works and Services */}
      <div className="h-[1100svh]" />

      {/* 6. Services */}
      <Services />

      {/* 7. Portfolio */}
      <Portfolio />

      {/* 8. Team / Testimonial */}
      <Testimonial />

      {/* 9. Contact / Footer */}
      <Footer />
    </>
  );
}
