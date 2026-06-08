import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/container";
import { LocationSeoCta } from "@/components/service-area/location-seo-cta";
import { LocationSeoJsonLd } from "@/components/service-area/location-seo-json-ld";
import type { HomeLocale } from "@/i18n/home-locale";
import { getTexasLocationCopy, localizedCoverageLabel } from "@/i18n/texas-location-copy";
import { locationAlternates } from "@/lib/locale-metadata";
import { localeSitePath } from "@/lib/locale-site-path";
import {
  cityPagePath,
  citySeoDescription,
  citySeoTitle,
  countyCoverageTier,
  countyPagePath,
  formatTexasLocationDisplayName,
  getCityBySlugs,
  isActiveListQikCounty,
  texasIndexPath,
} from "@/lib/texas-location-seo";

export async function generateTexasCityMetadata(
  locale: HomeLocale,
  params: Promise<{ countySlug: string; citySlug: string }>,
): Promise<Metadata> {
  const { countySlug, citySlug } = await params;
  const match = getCityBySlugs(countySlug, citySlug);
  if (!match) return {};

  const tier = countyCoverageTier(match.county.county);
  const enPath = cityPagePath(countySlug, citySlug, "en");
  const title = citySeoTitle(match.city.name, match.county.county, locale);
  const description = citySeoDescription(match.city.name, match.county.county, tier, locale);
  const hreflang = locationAlternates(enPath);

  return {
    title,
    description,
    alternates: {
      ...hreflang,
      canonical: cityPagePath(countySlug, citySlug, locale),
    },
    openGraph: { title, description },
    robots: { index: false, follow: true },
  };
}

export async function TexasCityLocationPage({
  locale,
  params,
}: {
  locale: HomeLocale;
  params: Promise<{ countySlug: string; citySlug: string }>;
}) {
  const { countySlug, citySlug } = await params;
  const match = getCityBySlugs(countySlug, citySlug);
  if (!match) notFound();

  const { county, city } = match;
  const copy = getTexasLocationCopy(locale);
  const tier = countyCoverageTier(county.county);
  const active = isActiveListQikCounty(county.county);
  const displayName = formatTexasLocationDisplayName(city.name);
  const title = citySeoTitle(city.name, county.county, locale);
  const description = citySeoDescription(city.name, county.county, tier, locale);
  const path = cityPagePath(countySlug, citySlug, locale);

  return (
    <div className="py-10 sm:py-14">
      <LocationSeoJsonLd
        pageTitle={title}
        pageDescription={description}
        canonicalPath={path}
        countyName={county.county}
        cityName={displayName}
        breadcrumbs={[
          { name: copy.breadcrumbHome, path: localeSitePath("/", locale) },
          { name: copy.breadcrumbServiceArea, path: localeSitePath("/service-area", locale) },
          { name: copy.breadcrumbTexas, path: texasIndexPath(locale) },
          { name: copy.countyLinkLabel(county.county), path: countyPagePath(countySlug, locale) },
          { name: displayName, path },
        ]}
      />
      <Container>
        <article className="mx-auto max-w-3xl space-y-6">
          <header className="space-y-3">
            <p className="text-xs font-semibold tracking-widest text-emerald-200/80">
              {localizedCoverageLabel(tier, locale).toUpperCase()} · {copy.countyLinkLabel(county.county)}
            </p>
            <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">{copy.cityH1(displayName)}</h1>
            <p className="text-base text-muted">{description}</p>
          </header>

          <section className="glass-surface space-y-3 rounded-2xl border border-white/10 p-5 text-sm text-white/75">
            <h2 className="text-base font-semibold text-white">{copy.citySectionTitle(displayName, county.county)}</h2>
            {active ? <p>{copy.cityActiveBody(displayName)}</p> : <p>{copy.cityInactiveBody(displayName)}</p>}
            <p>
              {copy.cityCountyLinkIntro}{" "}
              <Link href={countyPagePath(countySlug, locale)} className="text-emerald-300 underline">
                {copy.cityCountyLinkLabel(county.county)}
              </Link>{" "}
              {locale === "es" ? "para ver otras comunidades en este condado." : "page for other communities in this county."}
            </p>
          </section>

          <LocationSeoCta />
        </article>
      </Container>
    </div>
  );
}
