"use client";

import { PrivacyContent } from "@/components/legal/privacy-content";
import { TermsContent } from "@/components/legal/terms-content";
import { useSiteLocale } from "@/components/site-locale-provider";

export function LegalLocaleContent({ slug }: { slug: "privacy" | "terms" }) {
  const { locale } = useSiteLocale();
  if (slug === "terms") return <TermsContent locale={locale} />;
  return <PrivacyContent locale={locale} />;
}
