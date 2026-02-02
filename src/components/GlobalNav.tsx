"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";

export default function GlobalNav() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDots, setActiveDots] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);

  const toggleMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const scrollToTop = () => {
    const wrapper = document.getElementById("smooth-wrapper");
    if (wrapper) {
      wrapper.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  useEffect(() => {
    const wrapper = document.getElementById("smooth-wrapper");
    const handleScroll = () => {
      let scrollTop = 0;
      let scrollHeight = 0;
      let clientHeight = 0;

      if (wrapper) {
        scrollTop = wrapper.scrollTop;
        scrollHeight = wrapper.scrollHeight;
        clientHeight = wrapper.clientHeight;
      } else {
        scrollTop = window.scrollY;
        scrollHeight = document.documentElement.scrollHeight;
        clientHeight = window.innerHeight;
      }

      const currentScrollY = scrollTop;
      if (currentScrollY > lastScrollY.current && currentScrollY > 20) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      lastScrollY.current = currentScrollY;

      setIsScrolled(scrollTop > 50);

      const scrollPercent = scrollTop / (scrollHeight - clientHeight);
      // Map 0-1 to 0-4 range for dots
      // e.g. 10% scroll -> 0.1 * 4 = 0.4 -> 1 dot? Or *4.5 to ensure simple reach?
      // Let's explicitly step:
      // 0-25% -> 1
      // 25-50% -> 2
      // 50-75% -> 3
      // 75-100% -> 4
      // Wait, 0 initial? "change... one by one".
      // Let's do: 1 dot active immediately? Or 0? "change as scroll". Start with 0 (all white).
      const newActive = Math.min(4, Math.ceil(scrollPercent * 4));
      setActiveDots(newActive);
    };

    if (wrapper) {
      wrapper.addEventListener("scroll", handleScroll);
    } else {
      window.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (wrapper) wrapper.removeEventListener("scroll", handleScroll);
      else window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 z-50 w-full transition-transform duration-300 ${
          isVisible ? "translate-y-0" : "-translate-y-full"
        } ${isScrolled ? "bg-black/30" : ""}`}
      >
        <div
          className={`max-w-7xl mx-auto flex items-center justify-between pl-0 pr-4 py-2 transition-all duration-300 focus-visible:outline-none focus-visible:ring-0 ring-0 outline-none`}
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

          <div className="flex items-center justify-between">
            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-14">
              {["Home", "Service", "About Us", "Contact"].map((item) => (
                <Link
                  key={item}
                  href={
                    item === "Home"
                      ? "/"
                      : `#${item.toLowerCase().replace(" ", "-")}`
                  }
                  onClick={item === "Home" ? scrollToTop : undefined}
                  className="relative text-white/80 hover:text-pathfinder-green text-sm font-medium uppercase tracking-widest transition-colors duration-300 after:content-[''] after:absolute after:left-0 after:-bottom-1 after:w-0 after:h-0.5 after:bg-pathfinder-green after:transition-all after:duration-300 hover:after:w-full"
                >
                  {item}
                </Link>
              ))}
            </div>

            {/* Animated Dots Container */}
            <div className="hidden md:block relative w-[22px] h-[22px] ml-14 group cursor-pointer">
              {/* Top Left -> Bottom Right */}
              <div
                className={`absolute top-0 left-0 w-1.5 h-1.5 rounded-full transition-all duration-500 ease-in-out group-hover:translate-x-4 group-hover:translate-y-4 ${
                  activeDots >= 1 ? "bg-pathfinder-green" : "bg-white"
                }`}
              />
              {/* Top Right -> Bottom Left */}
              <div
                className={`absolute top-0 right-0 w-1.5 h-1.5 rounded-full transition-all duration-500 ease-in-out group-hover:-translate-x-4 group-hover:translate-y-4 ${
                  activeDots >= 2 ? "bg-pathfinder-green" : "bg-white"
                }`}
              />
              {/* Bottom Left -> Top Right */}
              <div
                className={`absolute bottom-0 left-0 w-1.5 h-1.5 rounded-full transition-all duration-500 ease-in-out group-hover:translate-x-4 group-hover:-translate-y-4 ${
                  activeDots >= 3 ? "bg-pathfinder-green" : "bg-white"
                }`}
              />
              {/* Bottom Right -> Top Left */}
              <div
                className={`absolute bottom-0 right-0 w-1.5 h-1.5 rounded-full transition-all duration-500 ease-in-out group-hover:-translate-x-4 group-hover:-translate-y-4 ${
                  activeDots >= 4 ? "bg-pathfinder-green" : "bg-white"
                }`}
              />
            </div>
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
              const opacity = isMobileMenuOpen
                ? i == 1
                  ? "opacity-0"
                  : ""
                : "";
              return (
                <span
                  key={i}
                  className={`w-8 h-0.5 bg-linear-to-r from-[#B801B8] to-[#6A0D6B] transition-transform duration-300 ${rotate} ${opacity} ${translate}`}
                ></span>
              );
            })}
          </button>
        </div>
      </header>

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
            className="text-white text-3xl font-poppins font-medium hover:text-pathfinder-green transition-colors duration-300"
          >
            {item}
          </Link>
        ))}
      </div>
    </>
  );
}
