import type { Metadata } from "next";
import { HomePageShell } from "@/components/home/home-page-shell";
import { getHomepageCopy } from "@/i18n/homepage-copy";
import { buildLocalizedMetadata } from "@/lib/locale-metadata";

export const metadata: Metadata = buildLocalizedMetadata("es", "/", getHomepageCopy("es").meta);

export default function EsHomePage() {
  return <HomePageShell />;
}
