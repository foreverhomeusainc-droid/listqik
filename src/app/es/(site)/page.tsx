import type { Metadata } from "next";
import { HomePageShell } from "@/components/home/home-page-shell";
import { listDealsOfTheWeek } from "@/lib/listings/public-listings-service";
import { getHomepageCopy } from "@/i18n/homepage-copy";
import { buildLocalizedMetadata } from "@/lib/locale-metadata";

export const metadata: Metadata = buildLocalizedMetadata("es", "/", {
  title: getHomepageCopy("es").meta.title,
  description: getHomepageCopy("es").meta.description,
});

export default async function EsHomePage() {
  const featuredListings = await listDealsOfTheWeek(3);
  return <HomePageShell featuredListings={featuredListings} />;
}
