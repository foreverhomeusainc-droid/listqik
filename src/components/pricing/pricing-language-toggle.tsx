"use client";

import { SiteLanguageToggle } from "@/components/marketing/site-language-toggle";
import { useSiteLocale } from "@/components/site-locale-provider";
import { getPricingCopy } from "@/i18n/pricing-copy";

export function PricingLanguageToggle() {
  const { locale } = useSiteLocale();
  const copy = getPricingCopy(locale);
  return (
    <SiteLanguageToggle labels={copy.languageToggle} ariaLabel={copy.languageGroupLabel} />
  );
}
