"use client";

import Logomarquee from "./Marquee";
import { useMemo } from "react";

// Actual logo filenames from /public/Website logo
const RAW_LOGOS = [
  "Aaharam logo.png",
  "Book my studio.png",
  "Layer 5 log.png",
  "NAJAH.png",
  "adari logo.png",
  "alankara beauty.png",
  "babe.png",
  "celodent.png",
  "chimney.png",
  "design fusion logo white.png",
  "diya hilal.png",
  "eshira.png",
  "gg.png",
  "glamigo.png",
  "ithi jewel.png",
  "jewel pik.png",
  "khau gully.png",
  "licoo.png",
  "lo.png",
  "logo 1.png",
  "meat.png",
  "paint.png",
  "prepeat.png",
  "prime ally.png",
  "pv overseas.png",
  "rajugari ruchulu.png",
  "sai service.png",
  "silver blossom.png",
  "smoxy.png",
  "sp.png",
  "summit'.png",
  "sweta silvers.png",
  "taste pod png 1.png",
  "tivi digital.png",
  "unity.png",
  "v jewellery.png",
  "vysya logo.png",
];

// Duplicate logos to create a seamless infinite loop with enough items
const DEFAULT_LOGOS = [...RAW_LOGOS, ...RAW_LOGOS, ...RAW_LOGOS];

export default function TrustedBy({ initialLogos = [] }: { initialLogos?: any[] }) {
  const logos = useMemo(() => {
    if (initialLogos && initialLogos.length > 0) {
      const urls = initialLogos.map((l: any) => l.imageUrl);
      return [...urls, ...urls, ...urls];
    }
    return DEFAULT_LOGOS;
  }, [initialLogos]);

  return (
    <section className="w-full py-24 bg-black overflow-hidden">
      <h1 className="text-white text-center text-2xl md:text-3xl mb-14 font-poppins">
        <span className="text-pathfinder-green">We're trusted</span> by
        companies like
      </h1>
      <div className="relative max-w-full mx-auto">
        {/* Gradient Overlays */}
        <div className="absolute left-0 top-0 bottom-0 w-32 md:w-72 bg-linear-to-r from-black via-black/80 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-32 md:w-72 bg-linear-to-l from-black via-black/80 to-transparent z-10 pointer-events-none" />
        <Logomarquee logos2={logos} logos1={logos} />
      </div>
    </section>
  );
}
