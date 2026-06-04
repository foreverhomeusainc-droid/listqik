import type { Metadata } from "next";
import { ListingsPageContent } from "@/components/listings/listings-page-content";
import { listings } from "@/data/listings";
import { getSitePageMeta } from "@/i18n/site-page-meta";
import { buildLocalizedMetadata } from "@/lib/locale-metadata";

export const metadata: Metadata = buildLocalizedMetadata("es", "/listings", getSitePageMeta("listings", "es"));

export default function EsListingsPage() {
  return <ListingsPageContent listings={listings} />;
}
