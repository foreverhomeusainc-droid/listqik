import type { Metadata } from "next";
import { Suspense } from "react";
import { FullServiceConsole } from "@/components/full-service/full-service-console";
import { getFullServiceCopy } from "@/i18n/full-service-copy";
import { getRequestHomeLocale, homeOpenGraphLocale } from "@/lib/site-locale-server";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string }>;
}): Promise<Metadata> {
  const params = await searchParams;
  const locale = await getRequestHomeLocale(params.lang);
  const copy = getFullServiceCopy(locale);

  return {
    title: copy.meta.title,
    description: copy.meta.description,
    alternates: { canonical: "/full-service" },
    openGraph: {
      title: copy.meta.title,
      description: copy.meta.description,
      locale: homeOpenGraphLocale(locale),
    },
  };
}

function FullServiceFallback() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center py-20">
      <div className="h-8 w-8 animate-pulse rounded-full border-2 border-emerald-400/40 border-t-emerald-300" />
    </div>
  );
}

export default function FullServicePage() {
  return (
    <Suspense fallback={<FullServiceFallback />}>
      <FullServiceConsole />
    </Suspense>
  );
}
