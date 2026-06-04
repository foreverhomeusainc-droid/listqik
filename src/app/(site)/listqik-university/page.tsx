import type { Metadata } from "next";
import { ListqikUniversityPageContent } from "@/components/listqik-university/listqik-university-page-content";
import { getSitePageMeta } from "@/i18n/site-page-meta";
import { localeAlternates } from "@/lib/locale-metadata";
import { fetchListQikYouTubeFeed } from "@/lib/youtube-channel";

export const revalidate = 3600;

const meta = getSitePageMeta("university", "en");

export const metadata: Metadata = {
  title: meta.title,
  description: meta.description,
  alternates: localeAlternates("/listqik-university"),
};

export default async function ListqikUniversityPage() {
  const feed = await fetchListQikYouTubeFeed();

  return <ListqikUniversityPageContent feed={feed} />;
}
