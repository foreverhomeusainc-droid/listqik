import type { Metadata } from "next";
import { ListqikUniversityPageContent } from "@/components/listqik-university/listqik-university-page-content";
import { getSitePageMeta } from "@/i18n/site-page-meta";
import { buildLocalizedMetadata } from "@/lib/locale-metadata";
import { fetchListQikYouTubeFeed } from "@/lib/youtube-channel";

export const revalidate = 3600;

export const metadata: Metadata = buildLocalizedMetadata(
  "es",
  "/listqik-university",
  getSitePageMeta("university", "es"),
);

export default async function EsListqikUniversityPage() {
  const feed = await fetchListQikYouTubeFeed();
  return <ListqikUniversityPageContent feed={feed} />;
}
