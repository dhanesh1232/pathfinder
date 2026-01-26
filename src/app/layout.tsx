import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google"; // Import Playfair_Display
import SmoothScroll from "@/components/SmoothScroll";
import GlobalNav from "@/components/GlobalNav";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Pathfinder",
  description: "Branding is about connections.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} antialiased text-foreground overflow-x-hidden`}
      >
        {/* Global Background & Noise */}
        <div className="fixed inset-0 z-[-1]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,#1a1a1a_0%,#0a0a0a_100%)]" />
          <div className="absolute inset-0 bg-noise opacity-[0.09] mix-blend-overlay" />
        </div>

        <GlobalNav />
        <main className="z-10 flex flex-col relative">{children}</main>

        <SmoothScroll />
      </body>
    </html>
  );
}
