import type { Metadata } from "next";
import { Suspense } from "react";
import { FullServiceConsole } from "@/components/full-service/full-service-console";
import { getFullServiceCopy } from "@/i18n/full-service-copy";
import { buildLocalizedMetadata } from "@/lib/locale-metadata";

export const metadata: Metadata = buildLocalizedMetadata(
  "es",
  "/full-service",
  getFullServiceCopy("es").meta,
);

function FullServiceFallback() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center py-20">
      <div className="h-8 w-8 animate-pulse rounded-full border-2 border-emerald-400/40 border-t-emerald-300" />
    </div>
  );
}

export default function EsFullServicePage() {
  return (
    <Suspense fallback={<FullServiceFallback />}>
      <FullServiceConsole />
    </Suspense>
  );
}
