"use client";

import Image from "next/image";

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
  // Split logos into two rows
  const midPoint = Math.ceil(LOGOS.length / 2);
  const topRowLogos = LOGOS.slice(0, midPoint);
  const bottomRowLogos = LOGOS.slice(midPoint);

  return (
    <section className="w-full mt-10 pt-24 bg-transparent overflow-hidden">
      {/* Marquee Container */}
      <div className="relative">
        {/* Gradient Overlays */}
        <div className="absolute left-0 top-0 bottom-0 w-12 bg-linear-to-r from-black to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-12 bg-linear-to-l from-black to-transparent z-10 pointer-events-none" />

        {/* First Marquee Row (Left to Right) */}
        <div className="flex mb-8 overflow-hidden">
          <div className="flex animate-marquee-left">
            {topRowLogos.map((logo, index) => (
              <LogoCard key={`row1-${index}`} logo={logo} />
            ))}
          </div>
          <div className="flex animate-marquee-left" aria-hidden="true">
            {topRowLogos.map((logo, index) => (
              <LogoCard key={`row1-duplicate-${index}`} logo={logo} />
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes marquee-left {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-100%);
          }
        }

        @keyframes marquee-right {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(0);
          }
        }

        .animate-marquee-left {
          animation: marquee-left 60s linear infinite;
        }

        .animate-marquee-right {
          animation: marquee-right 60s linear infinite;
        }

        .animate-marquee-left:hover,
        .animate-marquee-right:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}

function LogoCard({ logo }: { logo: string }) {
  // Extract name for alt text: remove extension and possibly " logo" suffix
  const name = logo
    .replace(/\.(png|jpg|jpeg|svg)$/i, "")
    .replace(/ logo$/i, "");

  return (
    <div className="shrink-0 mx-6 md:mx-8 group cursor-pointer">
      <div className="relative w-24 h-16 md:w-30 md:h-20 overflow-hidden">
        <div className="w-full h-full flex flex-col transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:-translate-y-full">
          {/* Default Logo */}
          <div className="shrink-0 w-full h-full flex items-center justify-center">
            <Image
              src={`/Website logo/${logo}`}
              alt={`${name} logo`}
              width={160}
              height={96}
              className="w-full h-full object-contain opacity-70 transition-opacity duration-300"
              unoptimized
            />
          </div>
          {/* Hover Logo (Slides in from bottom) */}
          <div className="shrink-0 w-full h-full flex items-center justify-center">
            <Image
              src={`/Website logo/${logo}`}
              alt={`${name} logo active`}
              width={160}
              height={96}
              className="w-full h-full object-contain opacity-100"
              unoptimized
            />
          </div>
        </div>
      </div>
    </div>
  );
}
