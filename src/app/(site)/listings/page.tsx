import type { Metadata } from "next";
import { ListingsPageContent } from "@/components/listings/listings-page-content";
import { listings } from "@/data/listings";
import { getSitePageMeta } from "@/i18n/site-page-meta";
import { localeAlternates } from "@/lib/locale-metadata";

const meta = getSitePageMeta("listings", "en");

export const metadata: Metadata = {
  title: meta.title,
  description: meta.description,
  alternates: localeAlternates("/listings"),
};

export default function ListingsPage() {
  return <ListingsPageContent listings={listings} />;
}
