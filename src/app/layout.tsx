import type { Metadata, Viewport } from "next";
import { Poppins } from "next/font/google"; // Import Poppins
import SmoothScroll from "@/components/SmoothScroll";
import GlobalNav from "@/components/GlobalNav";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
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
    <html lang="en" className="bg-black">
      <body
        className={`${poppins.variable} antialiased text-foreground bg-black`}
      >
        {/* Global Background & Noise */}
        <div className="fixed inset-0 z-[-1]">
          <div className="absolute inset-0 bg-[url(/website-bg.jpeg)] bg-cover bg-center bg-no-repeat" />
        </div>
        <main className="h-full w-full">
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
        </main>
      </body>
    </html>
  );
}
