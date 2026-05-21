import type { HomeLocale } from "@/i18n/home-locale";

export type LegalSlug = "privacy" | "terms";

export type LegalPageMetaCopy = {
  resourcesLegal: string;
  updated: string;
  titles: Record<LegalSlug, string>;
};

const COPY: Record<HomeLocale, LegalPageMetaCopy> = {
  en: {
    resourcesLegal: "RESOURCES · LEGAL",
    updated: "Updated:",
    titles: {
      privacy: "Privacy Policy",
      terms: "Terms of Service",
    },
  },
  es: {
    resourcesLegal: "RECURSOS · LEGAL",
    updated: "Actualizado:",
    titles: {
      privacy: "Política de privacidad",
      terms: "Términos de servicio",
    },
  },
};

export function getLegalPageMetaCopy(locale: HomeLocale): LegalPageMetaCopy {
  return COPY[locale] ?? COPY.en;
}
