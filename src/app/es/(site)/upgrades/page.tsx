import type { Metadata } from "next";
import { Suspense } from "react";
import { Container } from "@/components/container";
import { UpgradesConsole } from "@/components/upgrades/upgrades-console";
import { getSitePageMeta } from "@/i18n/site-page-meta";
import { buildLocalizedMetadata } from "@/lib/locale-metadata";

export const metadata: Metadata = buildLocalizedMetadata("es", "/upgrades", getSitePageMeta("upgrades", "es"));

function UpgradesFallback() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center">
      <div className="h-8 w-8 animate-pulse rounded-full border-2 border-emerald-400/40 border-t-emerald-300" />
    </div>
  );
}

export default function EsUpgradesPage() {
  return (
    <div className="py-10 sm:py-14">
      <Container>
        <Suspense fallback={<UpgradesFallback />}>
          <UpgradesConsole />
        </Suspense>
      </Container>
    </div>
  );
}
