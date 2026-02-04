"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";

export default function CookieDisclaimer() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check local storage delay 2 sec
    const consented = localStorage.getItem("pathfinders-cookie-consent");
    if (!consented) {
      const timer = setTimeout(() => setIsVisible(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("pathfinders-cookie-consent", "true");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-8 md:bottom-8 md:max-w-md z-[100] bg-zinc-900/95 backdrop-blur-md border border-white/10 p-6 shadow-2xl animate-in slide-in-from-bottom-5 duration-500">
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-start gap-4">
          <h3 className="text-white font-poppins font-semibold text-lg tracking-wide">
            Experience Notice
          </h3>
          <button
            onClick={handleAccept}
            className="text-white/50 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <p className="text-white/70 text-sm leading-relaxed font-light">
          We use cookies to enhance your journey. For the most immersive visual
          experience, we highly recommend viewing this site on a{" "}
          <span className="text-pathfinder-green font-medium">
            desktop device
          </span>
          .
        </p>

        <div className="flex gap-3 mt-2">
          <button
            onClick={handleAccept}
            className="bg-white text-black hover:bg-pathfinder-green transition-all ease-in-out duration-300 hover:text-white px-6 py-3 text-xs uppercase font-bold tracking-widest"
            style={{ clipPath: "polygon(10% 0, 100% 0, 90% 100%, 0% 100%)" }}
          >
            Acknowledge
          </button>
        </div>
      </div>
    </div>
  );
}
