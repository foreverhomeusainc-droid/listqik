import type { Metadata } from "next";
import { ServiceAreaPageContent } from "@/components/service-area/service-area-page-content";
import { getServiceAreaCopy } from "@/i18n/service-area-copy";
import { localeAlternates } from "@/lib/locale-metadata";

const copy = getServiceAreaCopy("en");

export const metadata: Metadata = {
  title: copy.meta.title,
  description: copy.meta.description,
  alternates: localeAlternates("/service-area"),
  openGraph: {
    title: copy.meta.title,
    description: copy.meta.description,
  },
};

export default function ServiceAreaPage() {
  return <ServiceAreaPageContent />;
}
