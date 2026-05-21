import type { HomeLocale } from "@/i18n/home-locale";

export type ListingsCopy = {
  eyebrow: string;
  title: string;
  intro: string;
  search: string;
  searchPlaceholder: string;
  status: string;
  statusAll: string;
  statusActive: string;
  statusPending: string;
  statusSold: string;
  city: string;
  cityAll: string;
  sort: string;
  sortFeatured: string;
  sortPriceAsc: string;
  sortPriceDesc: string;
  sortCity: string;
  results: string;
  noMatchesTitle: string;
  noMatchesBody: string;
  priceLabel: string;
  viewDetails: string;
  bedsAbbr: string;
  bathsAbbr: string;
  sqftAbbr: string;
};

const COPY: Record<HomeLocale, ListingsCopy> = {
  en: {
    eyebrow: "LISTINGS INDEX",
    title: "Browse inventory. Filter locally.",
    intro:
      "Review active home listings with local market context and broker-backed support options.",
    search: "SEARCH",
    searchPlaceholder: "Austin, 78704, condo, walkable…",
    status: "STATUS",
    statusAll: "All",
    statusActive: "Active",
    statusPending: "Pending",
    statusSold: "Sold",
    city: "CITY",
    cityAll: "All",
    sort: "SORT",
    sortFeatured: "Featured",
    sortPriceAsc: "Price ↑",
    sortPriceDesc: "Price ↓",
    sortCity: "City",
    results: "Results:",
    noMatchesTitle: "No matches.",
    noMatchesBody: "Try clearing filters or broadening your search terms.",
    priceLabel: "Price",
    viewDetails: "View details →",
    bedsAbbr: "bd",
    bathsAbbr: "ba",
    sqftAbbr: "sqft",
  },
  es: {
    eyebrow: "ÍNDICE DE PROPIEDADES",
    title: "Explore el inventario. Filtre localmente.",
    intro:
      "Revise propiedades activas con contexto del mercado local y opciones de soporte respaldadas por el corretaje.",
    search: "BUSCAR",
    searchPlaceholder: "Austin, 78704, condominio, caminable…",
    status: "ESTADO",
    statusAll: "Todos",
    statusActive: "Activa",
    statusPending: "Pendiente",
    statusSold: "Vendida",
    city: "CIUDAD",
    cityAll: "Todas",
    sort: "ORDENAR",
    sortFeatured: "Destacadas",
    sortPriceAsc: "Precio ↑",
    sortPriceDesc: "Precio ↓",
    sortCity: "Ciudad",
    results: "Resultados:",
    noMatchesTitle: "Sin coincidencias.",
    noMatchesBody: "Intente quitar filtros o ampliar los términos de búsqueda.",
    priceLabel: "Precio",
    viewDetails: "Ver detalles →",
    bedsAbbr: "rec",
    bathsAbbr: "baños",
    sqftAbbr: "pies²",
  },
};

export function getListingsCopy(locale: HomeLocale): ListingsCopy {
  return COPY[locale] ?? COPY.en;
}

export function translateListingStatus(
  locale: HomeLocale,
  status: "active" | "pending" | "sold",
): string {
  const copy = getListingsCopy(locale);
  if (status === "active") return copy.statusActive;
  if (status === "pending") return copy.statusPending;
  return copy.statusSold;
}

const LISTING_TYPE: Record<
  HomeLocale,
  Record<"single-family" | "condo" | "townhome" | "land", string>
> = {
  en: {
    "single-family": "single family",
    condo: "condo",
    townhome: "townhome",
    land: "land",
  },
  es: {
    "single-family": "casa unifamiliar",
    condo: "condominio",
    townhome: "casa adosada",
    land: "terreno",
  },
};

export function translateListingType(
  locale: HomeLocale,
  type: "single-family" | "condo" | "townhome" | "land",
): string {
  return LISTING_TYPE[locale]?.[type] ?? LISTING_TYPE.en[type];
}
