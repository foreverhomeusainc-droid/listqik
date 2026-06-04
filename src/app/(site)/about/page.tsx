import type { Metadata } from "next";
import { AboutPageContent } from "@/components/about/about-page-content";
import { getAboutCopy } from "@/i18n/about-copy";
import { localeAlternates } from "@/lib/locale-metadata";

const copy = getAboutCopy("en");

export const metadata: Metadata = {
  title: copy.meta.title,
  description: copy.meta.description,
  alternates: localeAlternates("/about"),
};

export default function AboutPage() {
  return <AboutPageContent />;
}
