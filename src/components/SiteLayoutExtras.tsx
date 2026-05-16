"use client";

import dynamic from "next/dynamic";

const SmoothScroll = dynamic(() => import("@/components/SmoothScroll"), {
  ssr: false,
});
const FloatingControls = dynamic(
  () => import("@/components/FloatingControls"),
  { ssr: false }
);
const CookieDisclaimer = dynamic(
  () => import("@/components/CookieDisclaimer"),
  { ssr: false }
);

export default function SiteLayoutExtras() {
  return (
    <>
      <SmoothScroll />
      <FloatingControls />
      <CookieDisclaimer />
    </>
  );
}
