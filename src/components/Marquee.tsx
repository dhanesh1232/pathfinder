"use client";
import Image from "next/image";
import React from "react";

function Logomarquee({ logos1, logos2 }: any) {
  // We need to inject the keyframes animation into the document's head
  // because Tailwind CSS doesn't directly support the 'cqw' unit.
  React.useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.innerText = `
      @keyframes marquee-move {
        to {
          transform: translateX(calc(-100cqw - var(--item-gap)));
        }
      }
      .marquee-container:hover .marquee-item {
        animation-play-state: paused !important;
      }
    `;
    document.head.appendChild(styleSheet);
    return () => {
      document.head.removeChild(styleSheet);
    };
  }, []);

  const Marquee = ({
    logos,
    direction = "forwards",
  }: {
    logos: typeof logos1;
    direction?: string;
  }) => {
    const numItems = logos.length;
    const speed = "15s";
    const itemWidth = "100px";
    const itemGap = "35px";

    return (
      <div
        className="max-w-full relative overflow-hidden marquee-container"
        style={
          {
            "--speed": speed,
            "--numItems": numItems,
            "--item-width": itemWidth,
            "--item-gap": itemGap,
            "--direction": direction,
            maskImage:
              "linear-gradient(to right, transparent, black 2rem, black calc(100% - 2rem), transparent)",
          } as React.CSSProperties
        }
      >
        <div
          className="w-max flex"
          style={
            {
              "--track-width": `calc(var(--item-width) * ${numItems})`,
              "--track-gap": `calc(var(--item-gap) * ${numItems})`,
            } as React.CSSProperties
          }
        >
          {[...logos, ...logos].map((logo, index) => (
            <div
              key={index}
              className="shrink-0 flex justify-center items-center marquee-item"
              style={
                {
                  width: "var(--item-width)",
                  aspectRatio: "1 / 1.2",
                  marginRight: "var(--item-gap)",
                  animation: `marquee-move var(--speed) linear infinite ${direction}`,
                } as React.CSSProperties
              }
            >
              <LogoCard logo={logo} />
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="items-center overflow-hidden">
      <div className="w-full mx-auto flex flex-col gap-y-6">
        <Marquee logos={logos1} />
      </div>
    </div>
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
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Logomarquee;
