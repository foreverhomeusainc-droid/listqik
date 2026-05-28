"use client";

import { SiteLanguageToggle } from "@/components/marketing/site-language-toggle";
import { useSiteLocale } from "@/components/site-locale-provider";
import { getHomepageCopy } from "@/i18n/homepage-copy";

export function HomeLanguageToggle() {
  const { locale } = useSiteLocale();
  const copy = getHomepageCopy(locale);
  return (
    <SiteLanguageToggle
      labels={copy.languageToggle}
      ariaLabel={locale === "es" ? "Idioma" : "Language"}
    />
  );
}
