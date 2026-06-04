import type { Metadata } from "next";
import { ServiceAreaPageContent } from "@/components/service-area/service-area-page-content";
import { getServiceAreaCopy } from "@/i18n/service-area-copy";
import { buildLocalizedMetadata } from "@/lib/locale-metadata";

export const metadata: Metadata = buildLocalizedMetadata(
  "es",
  "/service-area",
  getServiceAreaCopy("es").meta,
);

export default function EsServiceAreaPage() {
  return <ServiceAreaPageContent />;
}
