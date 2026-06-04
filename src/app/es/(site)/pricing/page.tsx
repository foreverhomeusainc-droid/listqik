import type { Metadata } from "next";
import { Suspense } from "react";
import { PricingConsole } from "@/components/pricing/pricing-console";
import { getPricingCopy } from "@/i18n/pricing-copy";
import { buildLocalizedMetadata } from "@/lib/locale-metadata";

export const metadata: Metadata = buildLocalizedMetadata(
  "es",
  "/pricing",
  getPricingCopy("es").meta,
);

function PricingFallback() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center py-20">
      <div className="h-8 w-8 animate-pulse rounded-full border-2 border-emerald-400/40 border-t-emerald-300" />
    </div>
  );
}

export default function EsPricingPage() {
  return (
    <Suspense fallback={<PricingFallback />}>
      <PricingConsole />
    </Suspense>
  );
}
