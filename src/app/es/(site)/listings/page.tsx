import type { Metadata } from "next";
import { ListingsPageContent } from "@/components/listings/listings-page-content";
import { listDealsOfTheWeek, listPublishedListings } from "@/lib/listings/public-listings-service";
import { getSitePageMeta } from "@/i18n/site-page-meta";
import { buildLocalizedMetadata } from "@/lib/locale-metadata";

export const metadata: Metadata = buildLocalizedMetadata("es", "/listings", getSitePageMeta("listings", "es"));

export const revalidate = 60;

export default async function EsListingsPage() {
  const [listings, dealsOfTheWeek] = await Promise.all([
    listPublishedListings(),
    listDealsOfTheWeek(4),
  ]);

  return <ListingsPageContent listings={listings} dealsOfTheWeek={dealsOfTheWeek} />;
}
