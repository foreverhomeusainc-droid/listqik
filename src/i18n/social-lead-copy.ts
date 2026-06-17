import type { HomeLocale } from "@/i18n/home-locale";

export type SocialLeadCopy = {
  title: string;
  subtitle: string;
  instagramCta: string;
  tiktokCta: string;
  youtubeCta: string;
  facebookCta: string;
};

const COPY: Record<HomeLocale, SocialLeadCopy> = {
  en: {
    title: "Talk to us on social",
    subtitle:
      "Message the ListQik team on Instagram, Facebook, TikTok, or YouTube — we’ll help you plan your MLS listing.",
    instagramCta: "Message us on Instagram",
    tiktokCta: "TikTok",
    youtubeCta: "YouTube",
    facebookCta: "Messenger",
  },
  es: {
    title: "Hable con nosotros en redes",
    subtitle:
      "Escríbanos en Instagram, Facebook, TikTok o YouTube — le ayudamos a planear su publicación en el MLS.",
    instagramCta: "Escríbanos en Instagram",
    tiktokCta: "TikTok",
    youtubeCta: "YouTube",
    facebookCta: "Messenger",
  },
};

export function getSocialLeadCopy(locale: HomeLocale): SocialLeadCopy {
  return COPY[locale];
}
