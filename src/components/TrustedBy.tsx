"use client";

import Image from "next/image";
import Logomarquee from "./Marquee";

// Actual logo filenames from /public/Website logo
const RAW_LOGOS = [
  "Aaharam logo.png",
  "Book my studio.png",
  "Final Whole Ragi Design-1.png",
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
const LOGOS = [...RAW_LOGOS, ...RAW_LOGOS, ...RAW_LOGOS];

export default function TrustedBy() {
  return (
    <section className="w-full mt-10 pt-24 bg-transparent overflow-hidden">
      <h1 className="text-white text-center text-xl mb-14 font-poppins">
        <span className="text-pathfinder-green">We're trusted</span> by
        companies like
      </h1>
      <div className="relative max-w-full mx-auto">
        {/* Gradient Overlays */}
        <div className="absolute left-0 top-0 bottom-0 w-20 bg-linear-to-r from-black to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-20 bg-linear-to-l from-black to-transparent z-10 pointer-events-none" />
        <Logomarquee logos2={LOGOS} logos1={LOGOS} />
      </div>
    </section>
  );
}
