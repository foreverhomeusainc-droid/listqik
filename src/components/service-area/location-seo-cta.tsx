"use client";

import Link from "next/link";
import { useSiteLocale } from "@/components/site-locale-provider";
import { startNowSubsonicPricingHref } from "@/lib/stripe-subsonic-landing-promo";
import { localeSitePath } from "@/lib/locale-site-path";

const COPY = {
  en: {
    getListedNow: "Get Listed Now",
    serviceArea: "Service area overview",
    contact: "Contact Concierge",
  },
  es: {
    getListedNow: "Publicar ahora",
    serviceArea: "Resumen de zona de servicio",
    contact: "Contactar concierge",
  },
} as const;

export function LocationSeoCta() {
  const { locale } = useSiteLocale();
  const t = COPY[locale];

  return (
    <div className="flex flex-wrap gap-3">
      <Link
        href={startNowSubsonicPricingHref(locale)}
        className="inline-flex min-h-[44px] items-center rounded-full border border-emerald-400/70 bg-emerald-500/20 px-5 text-sm font-semibold tracking-wide text-emerald-100 transition hover:bg-emerald-400/30"
      >
        {t.getListedNow}
      </Link>
      <Link
        href={localeSitePath("/service-area", locale)}
        className="inline-flex min-h-[44px] items-center rounded-full border border-white/15 px-5 text-sm font-semibold text-white/80 transition hover:border-white/30 hover:text-white"
      >
        {t.serviceArea}
      </Link>
      <a
        href="mailto:concierge@listqik.com?subject=Service%20Area%20Question"
        className="inline-flex min-h-[44px] items-center rounded-full border border-white/15 px-5 text-sm font-semibold text-white/80 transition hover:border-white/30 hover:text-white"
      >
        {t.contact}
      </a>
    </div>
  );
}
