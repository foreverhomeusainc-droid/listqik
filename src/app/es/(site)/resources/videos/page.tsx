import type { Metadata } from "next";
import VideosPage from "../../../../(site)/resources/videos/page";
import { getSitePageMeta } from "@/i18n/site-page-meta";
import { buildLocalizedMetadata } from "@/lib/locale-metadata";

export const metadata: Metadata = buildLocalizedMetadata("es", "/resources/videos", getSitePageMeta("videos", "es"));

export default function EsVideosPage() {
  return <VideosPage />;
}
