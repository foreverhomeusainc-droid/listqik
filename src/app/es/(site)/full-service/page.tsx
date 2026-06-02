import type { Metadata } from "next";
import { Suspense } from "react";
import { FullServiceConsole } from "@/components/full-service/full-service-console";

export const metadata: Metadata = {
  title: "Comisión de servicio completo | ListQik",
  description:
    "Representación completa de listado en Texas con Realtors locales con licencia. Market Expert desde 1%; Local Expert desde 2% de comisión de listado.",
  alternates: { canonical: "/es/full-service" },
};

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
