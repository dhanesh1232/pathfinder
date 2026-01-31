import type { Metadata, Viewport } from "next";
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

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: {
    default: "The Pathfinders | Creative Agency",
    template: "%s | The Pathfinders",
  },
  description:
    "The Pathfinders is a premier creative agency specializing in branding, digital experiences, and strategic growth. We connect brands with their audiences through innovative design and storytelling.",
  keywords: [
    "creative agency",
    "branding",
    "web design",
    "digital marketing",
    "strategy",
    "The Pathfinders",
    "design agency",
    "Pathfinders",
  ],
  authors: [{ name: "The Pathfinders" }],
  creator: "The Pathfinders",
  publisher: "The Pathfinders",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://thepathfinderr.com"), // Placeholder URL for relative OG images to work
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "The Pathfinders | Creative Agency",
    description: "Branding is about connections. We help you find yours.",
    url: "https://thepathfinderr.com",
    siteName: "The Pathfinders",
    images: [
      {
        url: "/og-image.jpg", // Ensure this image exists in public folder or update to a valid one
        width: 1200,
        height: 630,
        alt: "The Pathfinders Agency",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Pathfinders | Creative Agency",
    description: "Branding is about connections. We help you find yours.",
    images: ["/twitter-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
  },
  manifest: "/site.webmanifest",
  category: "design",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} antialiased text-foreground`}
      >
        {/* Global Background & Noise */}
        <div className="fixed inset-0 z-[-1]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,#1a1a1a_0%,#0a0a0a_100%)]" />
          <div className="absolute inset-0 bg-noise opacity-[0.09] mix-blend-overlay" />
        </div>
        <main>
          <GlobalNav />
          <div className="z-10 flex flex-col relative">{children}</div>
          <SmoothScroll />
        </main>
      </body>
    </html>
  );
}
