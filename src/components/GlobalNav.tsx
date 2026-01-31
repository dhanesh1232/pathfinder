"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

export default function GlobalNav() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const toggleMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full z-50 flex items-center justify-between pl-0 pr-4 py-2 transition-all duration-300 focus-visible:outline-none focus-visible:ring-0 ring-0 outline-none ${
          isScrolled ? "backdrop-blur-sm bg-black/30" : ""
        }`}
      >
        {/* Logo */}
        <Link
          href="/"
          onClick={scrollToTop}
          className="focus-visible:outline-none focus-visible:ring-0 ring-0 outline-none"
        >
          <Image
            className="cursor-pointer"
            src="/logo.png"
            alt="Logo"
            width={200}
            height={80}
            priority
          />
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          {["Home", "Service", "About Us", "Contact"].map((item) => (
            <Link
              key={item}
              href={
                item === "Home"
                  ? "/"
                  : `#${item.toLowerCase().replace(" ", "-")}`
              }
              onClick={item === "Home" ? scrollToTop : undefined}
              className="text-white/80 hover:text-pathfinder-green text-sm font-medium uppercase tracking-widest transition-colors duration-300"
            >
              {item}
            </Link>
          ))}
        </div>

        {/* Hamburger (Mobile) */}
        <button
          onClick={toggleMenu}
          className="flex flex-col gap-1.5 md:hidden z-50 group cursor-pointer focus-visible:outline-none focus-visible:ring-0 ring-0 outline-none"
          aria-label="Toggle Menu"
        >
          {[1, 2, 3].map((_, i) => {
            const rotate = isMobileMenuOpen
              ? i == 0
                ? "rotate-45"
                : i == 2
                  ? "-rotate-45"
                  : ""
              : "";
            const translate = isMobileMenuOpen
              ? i == 0
                ? "translate-y-2"
                : i == 2
                  ? "-translate-y-2"
                  : i == 1
                    ? "translate-x-100"
                    : ""
              : "";
            const opacity = isMobileMenuOpen ? (i == 1 ? "opacity-0" : "") : "";
            return (
              <span
                key={i}
                className={`w-8 h-0.5 bg-linear-to-r from-[#B801B8] to-[#6A0D6B] transition-transform duration-300 ${rotate} ${opacity} ${translate}`}
              ></span>
            );
          })}
        </button>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 bg-black z-40 flex flex-col items-center justify-center gap-8 transition-transform duration-500 ease-in-out ${
          isMobileMenuOpen ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        {["Home", "Service", "About Us", "Contact"].map((item) => (
          <Link
            key={item}
            href={
              item === "Home" ? "/" : `#${item.toLowerCase().replace(" ", "-")}`
            }
            onClick={() => {
              setIsMobileMenuOpen(false);
              if (item === "Home") scrollToTop();
            }}
            className="text-white text-3xl font-playfair font-medium hover:text-pathfinder-green transition-colors duration-300"
          >
            {item}
          </Link>
        ))}
      </div>
    </>
  );
}
