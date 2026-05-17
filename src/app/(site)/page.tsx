import type { Metadata } from "next";
import { HomePage } from "@/components/pages/home";
export const metadata: Metadata = {
  title: "The Pathfinders | Elite Creative Agency & Branding Studio",
  description:
    "Transform your brand with The Pathfinders. We specialize in high-impact branding, digital experiences, and strategic growth for forward-thinking companies.",
  keywords: [
    "creative agency",
    "branding agency",
    "digital strategy",
    "web design",
    "pathfinders",
    "marketing studio",
  ],
};
export default function Page() {
  return <HomePage />;
}
