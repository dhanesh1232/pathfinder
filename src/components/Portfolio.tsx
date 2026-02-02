"use client";

import ShimmerButton from "./ui/shinny-button";
import { InfiniteDraggableGrid, GalleryItem } from "./infinity-grid";

const ALL_PORTFOLIO_ITEMS = [
  {
    src: "/portfolio one/WhatsApp Image 2026-01-05 at 7.10.33 PM.jpeg",
    alt: "Portfolio Work",
  },
  {
    src: "/portfolio one/WhatsApp Image 2026-01-24 at 10.04.53 PM.jpeg",
    alt: "Portfolio Work",
  },
  {
    src: "/portfolio one/WhatsApp Image 2026-01-29 at 3.01.55 PM.jpeg",
    alt: "Portfolio Work",
  },
  {
    src: "/portfolio one/WhatsApp Image 2026-01-29 at 3.01.55 PM3.jpeg",
    alt: "Portfolio Work",
  },
  {
    src: "/portfolio one/WhatsApp Image 2026-01-29 at 3.01.55 PM7.jpeg",
    alt: "Portfolio Work",
  },
  {
    src: "/portfolio one/WhatsApp Image 2026-01-29 at 3.01.55 PM78.jpeg",
    alt: "Portfolio Work",
  },
  {
    src: "/portfolio one/WhatsApp Image 2026-01-29 at 3.02.05 PM.jpeg",
    alt: "Portfolio Work",
  },
  {
    src: "/portfolio one/WhatsApp Image 2026-01-29 at 3.02.05 PM1.jpeg",
    alt: "Portfolio Work",
  },
  {
    src: "/portfolio one/WhatsApp Image 2026-01-29 at 3.02.05 PM1w.jpeg",
    alt: "Portfolio Work",
  },
  {
    src: "/portfolio one/WhatsApp Image 2026-01-29 at 3.02.27 PM.jpeg",
    alt: "Portfolio Work",
  },
  {
    src: "/portfolio one/WhatsApp Image 2026-01-29 at 3.05.15 PM.jpeg",
    alt: "Portfolio Work",
  },
  { src: "/portfolio one/ark.jpeg", alt: "Ark Architecture" },
  { src: "/portfolio one/book my studio.png", alt: "Book My Studio" },
  { src: "/portfolio one/bra.jpeg", alt: "Bravo Branding" },
  { src: "/portfolio one/cetaphil.png", alt: "Cetaphil Campaign" },
  { src: "/portfolio one/christmas 1.jpeg", alt: "Seasonal Campaign" },
  { src: "/portfolio one/coral 1.jpeg", alt: "Coral Brand Identity" },
  { src: "/portfolio one/elan 2.png", alt: "Elan Identity" },
  { src: "/portfolio one/every page.jpg", alt: "UI Design" },
  { src: "/portfolio one/glamogo.png", alt: "Glamogo" },
  { src: "/portfolio one/gyn phy.png", alt: "Gyn Phy" },
  { src: "/portfolio one/inv.jpeg", alt: "Event Invite" },
  { src: "/portfolio one/jewel.png", alt: "Jewelry Collection" },
  { src: "/portfolio one/jeweller.png", alt: "Jeweller Branding" },
  { src: "/portfolio one/kam 1.jpeg", alt: "Kam Campaign" },
  { src: "/portfolio one/kam.jpeg", alt: "Kam Identity" },
  { src: "/portfolio one/khau gully.png", alt: "Khau Gully" },
  { src: "/portfolio one/mang.jpeg", alt: "Mang" },
  { src: "/portfolio one/mothers day.png", alt: "Mothers Day" },
  { src: "/portfolio one/new prob.jpg", alt: "Problem Solved" },
  { src: "/portfolio one/overseas.png", alt: "Overseas Education" },
  { src: "/portfolio one/paste.png", alt: "Paste Toothpaste" },
  { src: "/portfolio one/raju gari 2.png", alt: "Raju Gari" },
  { src: "/portfolio one/raju gari ruchu 1.png", alt: "Raju Gari Ruchulu" },
  { src: "/portfolio one/raju gari wishes.png", alt: "Raju Gari Wishes" },
  { src: "/portfolio one/rep.jpeg", alt: "Report Design" },
  { src: "/portfolio one/rocj.jpeg", alt: "Rock Music" },
  { src: "/portfolio one/sampada silvers.png", alt: "Sampada Silvers" },
  { src: "/portfolio one/sampradaya 1.jpeg", alt: "Sampradaya" },
  { src: "/portfolio one/silb.png", alt: "Silver Brand" },
  { src: "/portfolio one/skin care solution 1.png", alt: "Skin Care" },
  { src: "/portfolio one/ui.jpeg", alt: "UI Design System" },
  { src: "/portfolio one/unity 1.png", alt: "Unity" },
  { src: "/portfolio one/urigae.png", alt: "Urigae" },
  { src: "/portfolio one/v mart.png", alt: "V Mart Retail" },
  { src: "/portfolio one/vity.jpeg", alt: "Vity" },
];

const galleryItems: GalleryItem[] = ALL_PORTFOLIO_ITEMS.map((item, index) => ({
  id: index,
  thumb_src: item.src,
  full_src: item.src,
  title: item.alt,
}));

export default function Portfolio() {
  return (
    <section className="w-full py-32 md:py-48 bg-transparent relative z-10">
      <div className="max-w-full mx-auto">
        {/* Header */}
        <div className="text-center mb-4">
          <h2 className="text-white font-poppins font-black text-5xl md:text-6xl lg:text-8xl tracking-tighter uppercase mb-2">
            Selected Works
          </h2>
          <p className="text-white/60 font-nohemi text-lg md:text-xl font-light max-w-2xl mx-auto">
            A curation of brands we've helped defined, designed, and elevated.
          </p>
        </div>

        {/* Masonry Grid (Infinite Draggable) */}
        <div className="w-full h-[80vh] min-h-[500px] relative overflow-hidden border border-white/10">
          <InfiniteDraggableGrid gallery={galleryItems} />
        </div>

        {/* Minimal Luxury Download CTA */}
        <div className="mt-12 flex flex-col items-center justify-center">
          <a
            href="/portfolio.pdf"
            download="The_Pathfinders_Portfolio.pdf"
            className="group cursor-pointer"
          >
            <ShimmerButton>
              <div className="flex items-center gap-4 font-aalto font-light uppercase tracking-[0.2em] text-sm">
                Portfolio
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                  className="w-5 h-5 text-gray-900 dark:text-white/70 group-hover:text-pathfinder-green transition-colors"
                >
                  <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5" />
                  <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708z" />
                </svg>
              </div>
            </ShimmerButton>
          </a>
        </div>
      </div>
    </section>
  );
}
