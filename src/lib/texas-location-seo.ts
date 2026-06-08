import texasLocations from "@/data/texas-locations.json";
import type { HomeLocale } from "@/i18n/home-locale";
import { localizedCoverageLabel } from "@/i18n/texas-location-copy";
import {
  ALL_SERVICE_COUNTIES,
  EXTENDED_SERVICE_COUNTIES,
  PRIMARY_SERVICE_COUNTIES,
} from "@/lib/service-area";
import { localeSitePath } from "@/lib/locale-site-path";

export type TexasLocationCounty = (typeof texasLocations.locations)[number];
export type TexasLocationCity = TexasLocationCounty["cities"][number];

export type ServiceCoverageTier =
  | "primary"
  | "extended"
  | "har-core"
  | "har-extended"
  | "statewide";

const HAR_CORE = new Set([
  "Harris",
  "Fort Bend",
  "Montgomery",
  "Brazoria",
  "Galveston",
  "Liberty",
  "Waller",
  "Chambers",
  "Austin",
]);

const HAR_EXTENDED = new Set([
  "Walker",
  "San Jacinto",
  "Wharton",
  "Colorado",
  "Matagorda",
  "Grimes",
  "Washington",
]);

const PRIMARY = new Set<string>(PRIMARY_SERVICE_COUNTIES);
const EXTENDED = new Set<string>(EXTENDED_SERVICE_COUNTIES);
const ACTIVE = new Set<string>(ALL_SERVICE_COUNTIES);

export const TEXAS_LOCATION_DATA = texasLocations;
export const TEXAS_COUNTIES = texasLocations.locations;
export const TEXAS_LOCATION_STATS = {
  countyCount: texasLocations.countyCount,
  cityCount: texasLocations.cityCount,
};

export function countyCoverageTier(countyName: string): ServiceCoverageTier {
  if (PRIMARY.has(countyName)) return "primary";
  if (EXTENDED.has(countyName)) return "extended";
  if (HAR_CORE.has(countyName)) return "har-core";
  if (HAR_EXTENDED.has(countyName)) return "har-extended";
  return "statewide";
}

export function isActiveListQikCounty(countyName: string): boolean {
  return ACTIVE.has(countyName);
}

export function getCountyBySlug(countySlug: string): TexasLocationCounty | undefined {
  return TEXAS_COUNTIES.find((c) => c.countySlug === countySlug);
}

export function getCountyByName(countyName: string): TexasLocationCounty | undefined {
  return TEXAS_COUNTIES.find((c) => c.county === countyName);
}

export function countyPagePathForCountyName(
  countyName: string,
  locale: HomeLocale = "en",
): string | undefined {
  const county = getCountyByName(countyName);
  return county ? countyPagePath(county.countySlug, locale) : undefined;
}

export function getCityBySlugs(
  countySlug: string,
  citySlug: string,
): { county: TexasLocationCounty; city: TexasLocationCity } | undefined {
  const county = getCountyBySlug(countySlug);
  if (!county) return undefined;
  const city = county.cities.find((c) => c.slug === citySlug);
  if (!city) return undefined;
  return { county, city };
}

export function texasIndexPath(locale: HomeLocale = "en"): string {
  return localeSitePath("/service-area/texas", locale);
}

export function countyPagePath(countySlug: string, locale: HomeLocale = "en"): string {
  return localeSitePath(`/service-area/texas/${countySlug}`, locale);
}

export function cityPagePath(countySlug: string, citySlug: string, locale: HomeLocale = "en"): string {
  return localeSitePath(`/service-area/texas/${countySlug}/${citySlug}`, locale);
}

/** @deprecated Use localizedCoverageLabel from texas-location-copy */
export function coverageLabel(tier: ServiceCoverageTier, locale: HomeLocale = "en"): string {
  return localizedCoverageLabel(tier, locale);
}

export function countySeoTitle(
  countyName: string,
  tier: ServiceCoverageTier,
  locale: HomeLocale = "en",
): string {
  if (locale === "es") {
    if (tier === "statewide") {
      return `Listado en el condado de ${countyName}, TX | ListQik`;
    }
    if (tier === "har-core" || tier === "har-extended") {
      return `Listado MLS Houston · Condado de ${countyName} por $79 | ListQik`;
    }
    return `Publique en el condado de ${countyName} por $79 | ListQik`;
  }

  if (tier === "statewide") {
    return `List Your Home in ${countyName} County, TX | ListQik`;
  }
  if (tier === "har-core" || tier === "har-extended") {
    return `Houston-Area MLS Listing · ${countyName} County for $79 | ListQik`;
  }
  return `List Your Home in ${countyName} County for $79 | ListQik`;
}

export function countySeoDescription(
  countyName: string,
  tier: ServiceCoverageTier,
  cityCount: number,
  locale: HomeLocale = "en",
): string {
  const coverage = localizedCoverageLabel(tier, locale).toLowerCase();
  if (locale === "es") {
    return `ListQik ayuda a vendedores en Texas en el condado de ${countyName} con apoyo MLS respaldado por correduría. ${coverage}. Explore ${cityCount} ciudades y pueblos en el condado de ${countyName} e inicie su listado en línea.`;
  }
  return `ListQik helps Texas sellers in ${countyName} County with broker-backed MLS listing support. ${coverage}. Explore ${cityCount} cities and towns in ${countyName} County and start your listing online.`;
}

export function formatTexasLocationDisplayName(name: string): string {
  return name.replace(/^Zcta\s+/i, "ZIP ");
}

export function citySeoTitle(cityName: string, countyName: string, locale: HomeLocale = "en"): string {
  const city = formatTexasLocationDisplayName(cityName);
  if (locale === "es") {
    return `Publique su casa en ${city}, condado de ${countyName} TX | ListQik`;
  }
  return `List Your Home in ${city}, ${countyName} County TX | ListQik`;
}

export function citySeoDescription(
  cityName: string,
  countyName: string,
  tier: ServiceCoverageTier,
  locale: HomeLocale = "en",
): string {
  const city = formatTexasLocationDisplayName(cityName);
  const coverage = localizedCoverageLabel(tier, locale).toLowerCase();
  if (locale === "es") {
    return `Venda o liste una casa en ${city}, condado de ${countyName}, Texas con ListQik. ${coverage}. Compare precios, complete el intake del vendedor y trabaje con correduría con licencia.`;
  }
  return `Sell or list a home in ${city}, ${countyName} County, Texas with ListQik. ${coverage}. Compare pricing, complete seller intake, and work with licensed brokerage support.`;
}

export function allCountyStaticParams(): { countySlug: string }[] {
  return TEXAS_COUNTIES.map((c) => ({ countySlug: c.countySlug }));
}

export function allCityStaticParams(): { countySlug: string; citySlug: string }[] {
  const params: { countySlug: string; citySlug: string }[] = [];
  for (const county of TEXAS_COUNTIES) {
    for (const city of county.cities) {
      params.push({ countySlug: county.countySlug, citySlug: city.slug });
    }
  }
  return params;
}

/** County + Texas index URLs only — city pages are noindex and excluded from sitemap. */
export function allLocationSitemapPaths(): string[] {
  const paths: string[] = [];
  for (const locale of ["en", "es"] as const) {
    paths.push(texasIndexPath(locale));
    for (const county of TEXAS_COUNTIES) {
      paths.push(countyPagePath(county.countySlug, locale));
    }
  }
  return paths;
}
