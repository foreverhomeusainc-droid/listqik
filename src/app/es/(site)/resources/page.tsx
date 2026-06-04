import type { Metadata } from "next";
import ResourcesPage from "../../../(site)/resources/page";
import { getSitePageMeta } from "@/i18n/site-page-meta";
import { buildLocalizedMetadata } from "@/lib/locale-metadata";

export const metadata: Metadata = buildLocalizedMetadata("es", "/resources", getSitePageMeta("resources", "es"));

export default function EsResourcesPage() {
  return <ResourcesPage />;
}
