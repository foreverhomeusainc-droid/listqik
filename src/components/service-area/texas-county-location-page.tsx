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
  countyCoverageTier,
  countyPagePath,
  countySeoDescription,
  countySeoTitle,
  getCountyBySlug,
  isActiveListQikCounty,
  texasIndexPath,
} from "@/lib/texas-location-seo";

export async function generateTexasCountyMetadata(
  locale: HomeLocale,
  params: Promise<{ countySlug: string }>,
): Promise<Metadata> {
  const { countySlug } = await params;
  const county = getCountyBySlug(countySlug);
  if (!county) return {};

  const tier = countyCoverageTier(county.county);
  const enPath = countyPagePath(countySlug, "en");
  const title = countySeoTitle(county.county, locale);
  const description = countySeoDescription(county.county, tier, county.cities.length, locale);
  const hreflang = locationAlternates(enPath);

  return {
    title,
    description,
    alternates: {
      ...hreflang,
      canonical: countyPagePath(countySlug, locale),
    },
    openGraph: { title, description },
  };
}

export async function TexasCountyLocationPage({
  locale,
  params,
}: {
  locale: HomeLocale;
  params: Promise<{ countySlug: string }>;
}) {
  const { countySlug } = await params;
  const county = getCountyBySlug(countySlug);
  if (!county) notFound();

  const copy = getTexasLocationCopy(locale);
  const tier = countyCoverageTier(county.county);
  const active = isActiveListQikCounty(county.county);
  const title = countySeoTitle(county.county, locale);
  const description = countySeoDescription(county.county, tier, county.cities.length, locale);
  const path = countyPagePath(countySlug, locale);

  return (
    <div className="py-10 sm:py-14">
      <LocationSeoJsonLd
        pageTitle={title}
        pageDescription={description}
        canonicalPath={path}
        countyName={county.county}
        breadcrumbs={[
          { name: copy.breadcrumbHome, path: localeSitePath("/", locale) },
          { name: copy.breadcrumbServiceArea, path: localeSitePath("/service-area", locale) },
          { name: copy.breadcrumbTexas, path: texasIndexPath(locale) },
          { name: copy.countyLinkLabel(county.county), path },
        ]}
      />
      <Container>
        <article className="mx-auto max-w-3xl space-y-6">
          <header className="space-y-3">
            <p className="text-xs font-semibold tracking-widest text-emerald-200/80">
              {localizedCoverageLabel(tier, locale).toUpperCase()}
            </p>
            <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              {copy.countyH1(county.county)}
            </h1>
            <p className="text-base text-muted">{description}</p>
          </header>

          <section className="glass-surface space-y-3 rounded-2xl border border-white/10 p-5 text-sm text-white/75">
            <h2 className="text-base font-semibold text-white">{copy.coverageSectionTitle(county.county)}</h2>
            {active ? (
              <p>{copy.coverageActiveBody(county.county)}</p>
            ) : (
              <p>{copy.coverageInactiveBody(county.county)}</p>
            )}
            <p>
              {copy.countyCityPrompt}{" "}
              <Link href={localeSitePath("/pricing", locale)} className="text-emerald-300 underline">
                {copy.pricingLinkLabel}
              </Link>{" "}
              {locale === "es" ? "para comenzar." : "to begin."}
            </p>
          </section>

          {county.cities.length > 0 ? (
            <section className="rounded-2xl border border-white/10 bg-black/25 p-5">
              <h2 className="text-base font-semibold text-white">{copy.citiesSectionTitle(county.county)}</h2>
              <p className="mt-2 text-sm text-white/60">{copy.citiesSectionIntro(county.county, county.cities.length)}</p>
              <ul className="mt-4 columns-1 gap-x-6 text-sm sm:columns-2">
                {county.cities.map((city) => (
                  <li key={city.slug} className="mb-2 break-inside-avoid">
                    <Link
                      href={cityPagePath(county.countySlug, city.slug, locale)}
                      className="text-emerald-200 underline-offset-2 hover:underline"
                    >
                      {city.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          <LocationSeoCta />
        </article>
      </Container>
    </div>
  );
}
