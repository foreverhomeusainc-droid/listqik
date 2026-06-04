import type { Metadata } from "next";
import { StartNowPageShell } from "@/components/marketing/start-now-page-shell";
import { getSitePageMeta } from "@/i18n/site-page-meta";
import { localeAlternates } from "@/lib/locale-metadata";

const meta = getSitePageMeta("startNow", "en");

export const metadata: Metadata = {
  title: meta.title,
  description: meta.description,
  alternates: localeAlternates("/start-now"),
  openGraph: {
    title: meta.title,
    description: meta.description,
    url: "/start-now",
  },
};

export default function StartNowPage() {
  return <StartNowPageShell />;
}
