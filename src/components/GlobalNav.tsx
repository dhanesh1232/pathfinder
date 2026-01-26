"use client";

import { useState } from "react";
import Link from "next/link";

export default function GlobalNav() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-6 py-6 md:px-12 transition-colors duration-300">
        {/* Logo */}
        <div className="text-inherit font-playfair text-2xl font-bold tracking-wider z-50 cursor-pointer">
          <Link href="/">
            <img src="/logo.png" alt="Logo" width={100} height={10} />
          </Link>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          {["Home", "Service", "About Us", "Contact"].map((item) => (
            <Link
              key={item}
              href={`#${item.toLowerCase().replace(" ", "-")}`}
              className="text-white/80 hover:text-white text-sm font-medium uppercase tracking-widest transition-colors duration-300"
            >
              {item}
            </Link>
          ))}
        </div>

        {/* Hamburger (Mobile) */}
        <button
          onClick={toggleMenu}
          className="flex flex-col gap-1.5 md:hidden z-50 group"
          aria-label="Toggle Menu"
        >
          <span
            className={`w-8 h-0.5 bg-white transition-transform duration-300 ${
              isMobileMenuOpen ? "rotate-45 translate-y-2" : ""
            }`}
          ></span>
          <span
            className={`w-8 h-0.5 bg-white transition-opacity duration-300 ${
              isMobileMenuOpen ? "opacity-0" : ""
            }`}
          ></span>
          <span
            className={`w-8 h-0.5 bg-white transition-transform duration-300 ${
              isMobileMenuOpen ? "-rotate-45 -translate-y-2" : ""
            }`}
          ></span>
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
            href={`#${item.toLowerCase().replace(" ", "-")}`}
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-white text-3xl font-playfair font-medium hover:text-pathfinder-green transition-colors duration-300"
          >
            {item}
          </Link>
        ))}
      </div>
    </>
  );
}
