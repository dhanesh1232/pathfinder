"use client";
import React from "react";

// The main App component that renders our ShimmerButton
// The main App component that renders our ShimmerButton
interface ShimmerButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export default function ShimmerButton({
  children,
  className = "",
  ...props
}: ShimmerButtonProps) {
  const customCss = `
    /* This is the key to the seamless animation.
      The @property rule tells the browser that '--angle' is a custom property
      of type <angle>. This allows the browser to smoothly interpolate it
      during animations, preventing the "jump" at the end of the loop.
    */
    @property --angle {
      syntax: '<angle>';
      initial-value: 0deg;
      inherits: false;
    }

    /* The keyframe animation simply transitions the --angle property
      from its start (0deg) to its end (360deg).
    */
    @keyframes shimmer-spin {
      to {
        --angle: 360deg;
      }
    }
  `;

  return (
    <>
      <style>{customCss}</style>
      <button
        className={`relative inline-flex items-center cursor-pointer justify-center p-[1.5px] bg-pathfinder-green/40 rounded-full overflow-hidden group ${className}`}
        {...props}
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              "conic-gradient(from var(--angle), transparent 25%, #ffffff, transparent 50%)",
            animation: "shimmer-spin 2.5s linear infinite",
          }}
        />
        <span className="relative z-10 inline-flex items-center justify-center w-full h-full px-8 py-3 text-black font-medium bg-pathfinder-green rounded-full group-hover:bg-[#26af61] transition-colors duration-300">
          {children}
        </span>
      </button>
    </>
  );
}
