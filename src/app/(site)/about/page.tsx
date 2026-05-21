import type { Metadata } from "next";
import { AboutPageContent } from "@/components/about/about-page-content";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn how ListQik.com and Resolution Realty Group help Texas sellers list through a licensed brokerage with broker-backed guidance.",
  alternates: {
    canonical: "/about",
  },
};

export default function AboutPage() {
  return <AboutPageContent />;
}
