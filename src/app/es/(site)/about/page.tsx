import type { Metadata } from "next";
import { AboutPageContent } from "@/components/about/about-page-content";
import { getAboutCopy } from "@/i18n/about-copy";
import { buildLocalizedMetadata } from "@/lib/locale-metadata";

export const metadata: Metadata = buildLocalizedMetadata("es", "/about", getAboutCopy("es").meta);

export default function EsAboutPage() {
  return <AboutPageContent />;
}
