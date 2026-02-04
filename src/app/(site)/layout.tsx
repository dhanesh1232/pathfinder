"use client";

import SmoothScroll from "@/components/SmoothScroll";
import GlobalNav from "@/components/GlobalNav";
import FloatingControls from "@/components/FloatingControls";
import CookieDisclaimer from "@/components/CookieDisclaimer";

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <GlobalNav />
      <div
        id="smooth-wrapper"
        className="w-full h-full overflow-y-auto overflow-x-hidden"
      >
        <div
          id="smooth-content"
          className="z-10 flex flex-col relative min-h-full"
        >
          {children}
        </div>
      </div>
      <SmoothScroll />
      <FloatingControls />
      <CookieDisclaimer />
    </>
  );
}
