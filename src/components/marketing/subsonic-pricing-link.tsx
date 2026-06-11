"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import type { HomeLocale } from "@/i18n/home-locale";
import { trackLandingEvent } from "@/lib/landing-analytics";
import { appendMarketingSearchParams } from "@/lib/marketing-attribution";
import { startNowSubsonicPricingHref } from "@/lib/stripe-subsonic-landing-promo";

type SubsonicPricingLinkProps = {
  locale: HomeLocale;
  children: ReactNode;
  className?: string;
};

export function SubsonicPricingLink({ locale, children, className }: SubsonicPricingLinkProps) {
  const baseHref = startNowSubsonicPricingHref(locale);
  const [href, setHref] = useState(baseHref);

  useEffect(() => {
    setHref(appendMarketingSearchParams(baseHref, window.location.search));
  }, [baseHref]);

  return (
    <Link
      href={href}
      className={className}
      onClick={() => {
        trackLandingEvent({
          eventType: "cta_click",
          eventName: "get_listed_now",
          path: window.location.pathname,
          locale,
        });
      }}
    >
      {children}
    </Link>
  );
}
