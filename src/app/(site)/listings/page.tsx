import type { Metadata } from "next";
import { ListingsPageContent } from "@/components/listings/listings-page-content";
import { listDealsOfTheWeek, listPublishedListings } from "@/lib/listings/public-listings-service";
import { getSitePageMeta } from "@/i18n/site-page-meta";
import { localeAlternates } from "@/lib/locale-metadata";

const meta = getSitePageMeta("listings", "en");

export const metadata: Metadata = {
  title: meta.title,
  description: meta.description,
  alternates: localeAlternates("/listings"),
};

export const revalidate = 60;

export default async function ListingsPage() {
  const [listings, dealsOfTheWeek] = await Promise.all([
    listPublishedListings(),
    listDealsOfTheWeek(4),
  ]);

  return <ListingsPageContent listings={listings} dealsOfTheWeek={dealsOfTheWeek} />;
}
