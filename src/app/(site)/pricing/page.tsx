import type { Metadata } from "next";
import { Suspense } from "react";
import { GoogleAdsCheckoutSuccess } from "@/components/analytics/google-ads-checkout-success";
import { GoogleAdsCheckoutSuccessServer } from "@/components/analytics/google-ads-checkout-success-server";
import { PricingConsole } from "@/components/pricing/pricing-console";
import { getPricingCopy } from "@/i18n/pricing-copy";
import { localeAlternates } from "@/lib/locale-metadata";
import { getRequestHomeLocale, homeOpenGraphLocale } from "@/lib/site-locale-server";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string }>;
}): Promise<Metadata> {
  const params = await searchParams;
  const locale = await getRequestHomeLocale(params.lang);
  const copy = getPricingCopy(locale);

  return {
    title: copy.meta.title,
    description: copy.meta.description,
    alternates: localeAlternates("/pricing"),
    openGraph: {
      title: copy.meta.title,
      description: copy.meta.description,
      locale: homeOpenGraphLocale(locale),
    },
  };
}

function PricingFallback() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center py-20">
      <div className="h-8 w-8 animate-pulse rounded-full border-2 border-emerald-400/40 border-t-emerald-300" />
    </div>
  );
}

export default async function PricingPage({
  searchParams,
}: {
  searchParams: Promise<{ checkout?: string; session_id?: string; lang?: string }>;
}) {
  const params = await searchParams;

  return (
    <>
      <GoogleAdsCheckoutSuccessServer
        checkout={params.checkout}
        stripeSessionId={params.session_id}
      />
      <Suspense fallback={<PricingFallback />}>
        <GoogleAdsCheckoutSuccess />
        <PricingConsole />
      </Suspense>
    </>
  );
}
