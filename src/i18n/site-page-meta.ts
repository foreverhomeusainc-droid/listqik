import type { HomeLocale } from "@/i18n/home-locale";

export type SitePageMeta = { title: string; description: string };

const META: Record<string, Record<HomeLocale, SitePageMeta>> = {
  upgrades: {
    en: {
      title: "Listing Upgrades | ListQik",
      description: "Browse and purchase optional listing upgrades for your Texas home listing.",
    },
    es: {
      title: "Mejoras de listado | ListQik",
      description: "Explore y compre mejoras opcionales para su listado de vivienda en Texas.",
    },
  },
  listings: {
    en: {
      title: "Texas Home Listings | ListQik",
      description: "Browse featured Texas home listings on ListQik.com.",
    },
    es: {
      title: "Propiedades en Texas | ListQik",
      description: "Explore propiedades destacadas en Texas en ListQik.com.",
    },
  },
  university: {
    en: {
      title: "ListQik University | YouTube",
      description:
        "Watch ListQik University videos on listing, pricing, compliance, and selling your Texas home.",
    },
    es: {
      title: "Universidad ListQik | YouTube",
      description:
        "Videos de Universidad ListQik sobre listados, precios, cumplimiento y venta de su casa en Texas.",
    },
  },
  startNow: {
    en: {
      title: "Start Now | ListQik",
      description:
        "List smarter, sell faster, and close with confidence. Compare packages and start your Texas listing with ListQik.",
    },
    es: {
      title: "Comenzar ahora | ListQik",
      description:
        "Publique con más claridad y confianza. Compare paquetes e inicie su listado en Texas con ListQik.",
    },
  },
  resources: {
    en: {
      title: "Resources | ListQik",
      description:
        "Browse ListQik.com resources: blogs, videos, legal disclosures, and consumer notices for Texas sellers.",
    },
    es: {
      title: "Recursos | ListQik",
      description:
        "Recursos de ListQik.com: blogs, videos, avisos legales y protección al consumidor para vendedores en Texas.",
    },
  },
  videos: {
    en: {
      title: "Videos | ListQik Resources",
      description: "Watch ListQik videos on home selling, listing strategy, and Texas real estate topics.",
    },
    es: {
      title: "Videos | Recursos ListQik",
      description: "Videos de ListQik sobre venta de casas, estrategia de listado y bienes raíces en Texas.",
    },
  },
};

export type SitePageMetaKey = keyof typeof META;

export function getSitePageMeta(key: SitePageMetaKey, locale: HomeLocale): SitePageMeta {
  return META[key][locale];
}
