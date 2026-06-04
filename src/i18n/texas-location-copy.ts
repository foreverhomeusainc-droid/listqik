import type { HomeLocale } from "@/i18n/home-locale";
import type { ServiceCoverageTier } from "@/lib/texas-location-seo";

export type TexasLocationCopy = {
  meta: { title: string; description: string };
  breadcrumbHome: string;
  breadcrumbServiceArea: string;
  breadcrumbTexas: string;
  indexEyebrow: string;
  indexTitle: string;
  indexIntro: string;
  countiesCitiesStats: (counties: number, cities: number) => string;
  countyLinkLabel: (county: string) => string;
  citiesCountSuffix: (n: number) => string;
  countyH1: (county: string) => string;
  coverageSectionTitle: (county: string) => string;
  coverageActiveBody: (county: string) => string;
  coverageInactiveBody: (county: string) => string;
  countyCityPrompt: string;
  pricingLinkLabel: string;
  citiesSectionTitle: (county: string) => string;
  citiesSectionIntro: (county: string, n: number) => string;
  cityH1: (city: string) => string;
  citySectionTitle: (city: string, county: string) => string;
  cityActiveBody: (city: string) => string;
  cityInactiveBody: (city: string) => string;
  cityCountyLinkIntro: string;
  cityCountyLinkLabel: (county: string) => string;
  countySuffix: string;
};

const COVERAGE: Record<HomeLocale, Record<ServiceCoverageTier, string>> = {
  en: {
    primary: "Primary ListQik service county",
    extended: "Extended ListQik service county",
    "har-core": "Houston HAR core market county",
    "har-extended": "Houston HAR extended market county",
    statewide: "Texas statewide listing support",
  },
  es: {
    primary: "Condado principal de servicio ListQik",
    extended: "Condado extendido de servicio ListQik",
    "har-core": "Condado núcleo HAR Houston",
    "har-extended": "Condado extendido HAR Houston",
    statewide: "Apoyo de listado en todo Texas",
  },
};

export function localizedCoverageLabel(tier: ServiceCoverageTier, locale: HomeLocale): string {
  return COVERAGE[locale][tier];
}

const COPY: Record<HomeLocale, TexasLocationCopy> = {
  en: {
    meta: {
      title: "Texas Counties & Cities | ListQik Service Area",
      description:
        "Browse every Texas county and city ListQik supports for home listing SEO. Find your county or city page for broker-backed MLS listing information and pricing.",
    },
    breadcrumbHome: "Home",
    breadcrumbServiceArea: "Service Area",
    breadcrumbTexas: "Texas",
    indexEyebrow: "TEXAS LOCATION INDEX",
    indexTitle: "Every Texas county and city",
    indexIntro:
      "This index helps search engines and Google Ads connect ListQik to local Texas markets. Each county and city has its own page with listing-focused information—without cluttering the main service area map.",
    countiesCitiesStats: (counties, cities) => `${counties} counties · ${cities} cities`,
    countyLinkLabel: (county) => `${county} County`,
    citiesCountSuffix: (n) => ` · ${n} cities`,
    countyH1: (county) => `Home listings in ${county} County, Texas`,
    coverageSectionTitle: (county) => `Coverage for ${county} County`,
    coverageActiveBody: (county) =>
      `${county} County is part of ListQik's published Texas service footprint. Sellers can start intake online, compare plan pricing, and work with licensed brokerage support for MLS submission.`,
    coverageInactiveBody: (county) =>
      `ListQik provides Texas-wide seller resources for ${county} County. Contact concierge to confirm broker availability, MLS path, and timing for your property address.`,
    countyCityPrompt: "Looking for a specific town? Choose a city below or go to",
    pricingLinkLabel: "pricing",
    citiesSectionTitle: (county) => `Cities and communities in ${county} County`,
    citiesSectionIntro: (county, n) =>
      `${n} locations with dedicated ListQik pages for local search and ads.`,
    cityH1: (city) => `List your home in ${city}, Texas`,
    citySectionTitle: (city, county) => `Seller support in ${city}, ${county} County`,
    cityActiveBody: (city) =>
      `ListQik supports sellers in ${city} with online plan selection, property intake, and broker-backed MLS listing workflows for Texas homes.`,
    cityInactiveBody: (city) =>
      `ListQik offers Texas seller tools for ${city}. We can help confirm whether your address falls within current broker and MLS coverage before you start checkout.`,
    cityCountyLinkIntro: "View the",
    cityCountyLinkLabel: (county) => `${county} County`,
    countySuffix: "County",
  },
  es: {
    meta: {
      title: "Condados y ciudades de Texas | Zona de servicio ListQik",
      description:
        "Explore cada condado y ciudad de Texas que ListQik apoya para SEO de listados. Encuentre su página local con información de MLS respaldada por correduría y precios.",
    },
    breadcrumbHome: "Inicio",
    breadcrumbServiceArea: "Zona de servicio",
    breadcrumbTexas: "Texas",
    indexEyebrow: "ÍNDICE DE UBICACIONES EN TEXAS",
    indexTitle: "Todos los condados y ciudades de Texas",
    indexIntro:
      "Este índice conecta ListQik con mercados locales de Texas para buscadores y anuncios. Cada condado y ciudad tiene su propia página con información orientada al listado.",
    countiesCitiesStats: (counties, cities) => `${counties} condados · ${cities} ciudades`,
    countyLinkLabel: (county) => `Condado de ${county}`,
    citiesCountSuffix: (n) => ` · ${n} ciudades`,
    countyH1: (county) => `Listados de vivienda en el condado de ${county}, Texas`,
    coverageSectionTitle: (county) => `Cobertura en el condado de ${county}`,
    coverageActiveBody: (county) =>
      `El condado de ${county} forma parte de la zona de servicio publicada de ListQik en Texas. Los vendedores pueden iniciar el intake en línea, comparar planes y trabajar con correduría con licencia para el MLS.`,
    coverageInactiveBody: (county) =>
      `ListQik ofrece recursos para vendedores en todo Texas en el condado de ${county}. Contacte a concierge para confirmar disponibilidad de corredor, ruta MLS y tiempos para su dirección.`,
    countyCityPrompt: "¿Busca un municipio específico? Elija una ciudad abajo o vaya a",
    pricingLinkLabel: "precios",
    citiesSectionTitle: (county) => `Ciudades y comunidades en el condado de ${county}`,
    citiesSectionIntro: (_county, n) =>
      `${n} ubicaciones con páginas dedicadas de ListQik para búsqueda local y anuncios.`,
    cityH1: (city) => `Publique su casa en ${city}, Texas`,
    citySectionTitle: (city, county) => `Apoyo al vendedor en ${city}, condado de ${county}`,
    cityActiveBody: (city) =>
      `ListQik apoya a vendedores en ${city} con selección de plan en línea, intake de la propiedad y flujos de listado MLS respaldados por correduría en Texas.`,
    cityInactiveBody: (city) =>
      `ListQik ofrece herramientas para vendedores en Texas en ${city}. Podemos confirmar si su dirección está dentro de la cobertura actual de corredor y MLS antes del pago.`,
    cityCountyLinkIntro: "Vea la página del",
    cityCountyLinkLabel: (county) => `condado de ${county}`,
    countySuffix: "Condado",
  },
};

export function getTexasLocationCopy(locale: HomeLocale): TexasLocationCopy {
  return COPY[locale];
}
