import type { Metadata } from "next";
import { StartNowPageShell } from "@/components/marketing/start-now-page-shell";
import { getSitePageMeta } from "@/i18n/site-page-meta";
import { buildLocalizedMetadata } from "@/lib/locale-metadata";

const meta = getSitePageMeta("startNow", "es");

export const metadata: Metadata = {
  ...buildLocalizedMetadata("es", "/start-now", meta),
  openGraph: {
    title: meta.title,
    description: meta.description,
    url: "/es/start-now",
  },
};

export default function EsStartNowPage() {
  return <StartNowPageShell />;
}
