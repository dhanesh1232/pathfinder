import HandSplitHero from "@/components/HandSplitHero";
import ParallaxTeam from "@/components/ParallaxTeam";
import TrustedBy from "@/components/TrustedBy";
import Metrics from "@/components/Metrics";
import Services from "@/components/Services";
import Portfolio from "@/components/Portfolio";
import Testimonial from "@/components/Testimonial";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      {/* 1. Hero: Hand Split Reveal (Pinned Cinema) */}
      <HandSplitHero />

      {/* 2. Identity: People Section (Natural Scroll, IntersectionObserver) */}
      <ParallaxTeam />

      <div className="h-[300vh]" />

      {/* 3. Trusted By / Logos */}
      <TrustedBy />

      {/* 4. Metrics / Projects */}
      <Metrics />

      {/* 5. Services */}
      <Services />

      {/* 6. Portfolio */}
      <Portfolio />

      {/* 7. Team / Testimonial */}
      <Testimonial />

      {/* 8. Contact / Footer */}
      <Footer />
    </>
  );
}
