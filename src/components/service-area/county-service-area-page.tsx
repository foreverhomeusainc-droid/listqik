import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/container";
import { LocationSeoJsonLd } from "@/components/service-area/location-seo-json-ld";
import { getCountyLandingCopy } from "@/i18n/county-landing-copy";
import type { HomeLocale } from "@/i18n/home-locale";
import { getTexasLocationCopy, localizedCoverageLabel } from "@/i18n/texas-location-copy";
import { locationAlternates } from "@/lib/locale-metadata";
import { localeSitePath } from "@/lib/locale-site-path";
import { startNowSubsonicPricingHref } from "@/lib/stripe-subsonic-landing-promo";
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

function GetListedButton({
  locale,
  label,
  className = "",
}: {
  locale: HomeLocale;
  label: string;
  className?: string;
}) {
  return (
    <Link
      href={startNowSubsonicPricingHref(locale)}
      className={`inline-flex min-h-[48px] items-center justify-center rounded-full border border-emerald-400/80 bg-emerald-500/25 px-7 text-sm font-semibold tracking-wide text-emerald-50 shadow-[0_0_24px_rgba(16,185,129,0.25)] transition hover:bg-emerald-400/35 ${className}`}
    >
      {label}
    </Link>
  );
}

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

  const nav = getTexasLocationCopy(locale);
  const copy = getCountyLandingCopy(locale);
  const tier = countyCoverageTier(county.county);
  const active = isActiveListQikCounty(county.county);
  const title = countySeoTitle(county.county, locale);
  const description = countySeoDescription(county.county, tier, county.cities.length, locale);
  const path = countyPagePath(countySlug, locale);

  return (
    <div>
      <LocationSeoJsonLd
        pageTitle={title}
        pageDescription={description}
        canonicalPath={path}
        countyName={county.county}
        breadcrumbs={[
          { name: nav.breadcrumbHome, path: localeSitePath("/", locale) },
          { name: nav.breadcrumbServiceArea, path: localeSitePath("/service-area", locale) },
          { name: nav.breadcrumbTexas, path: texasIndexPath(locale) },
          { name: nav.countyLinkLabel(county.county), path },
        ]}
      />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-emerald-500/20">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[url('/cockpit-homepage.webp')] bg-cover bg-center opacity-35"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black via-black/90 to-black/70"
        />
        <Container className="relative py-14 sm:py-20">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div className="space-y-5">
              <p className="text-xs font-semibold tracking-[0.2em] text-emerald-300/90">{copy.heroEyebrow}</p>
              <h1 className="max-w-2xl text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
                {copy.heroTitle}
              </h1>
              <p className="max-w-xl text-base text-emerald-100/85">{copy.heroSubtitle(county.county)}</p>
              <p className="text-2xl font-semibold text-emerald-200">{copy.heroPriceLabel}</p>
              <GetListedButton locale={locale} label={copy.getListedNow} />
            </div>
            <ul className="space-y-3 rounded-2xl border border-emerald-500/25 bg-black/45 p-6 text-sm text-emerald-50/90 backdrop-blur-sm">
              {copy.heroBullets.map((item) => (
                <li key={item} className="flex gap-3">
                  <span aria-hidden className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-emerald-400" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      {/* County + cities strip */}
      <section className="border-b border-white/10 bg-emerald-950/20 py-8">
        <Container>
          <div className="mx-auto max-w-5xl space-y-4 text-center">
            <h2 className="text-2xl font-semibold text-emerald-100 sm:text-3xl">{copy.countyTitle(county.county)}</h2>
            <p className="text-sm text-white/60">{copy.citiesIntro}</p>
            {county.cities.length > 0 ? (
              <p className="text-sm leading-relaxed text-emerald-200/90">
                {county.cities.map((city, index) => (
                  <span key={city.slug}>
                    {index > 0 ? <span className="text-white/30"> · </span> : null}
                    <Link
                      href={cityPagePath(county.countySlug, city.slug, locale)}
                      className="hover:text-emerald-100 hover:underline"
                    >
                      {city.name}
                    </Link>
                  </span>
                ))}
              </p>
            ) : null}
            <div className="pt-2">
              <GetListedButton locale={locale} label={copy.getListedNow} className="mx-auto" />
            </div>
          </div>
        </Container>
      </section>

      {/* Benefits */}
      <section className="py-12">
        <Container>
          <div className="grid gap-4 sm:grid-cols-3">
            {copy.benefits.map((item, index) => (
              <div
                key={item.title}
                className="glass-surface rounded-2xl border border-emerald-500/20 p-6 text-center"
              >
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-emerald-400/40 bg-emerald-950/40 text-lg font-bold text-emerald-200">
                  {index + 1}
                </div>
                <h3 className="text-base font-semibold text-white">{item.title}</h3>
                <p className="mt-2 text-sm text-white/70">{item.body}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* MLS portals */}
      <section className="border-y border-white/10 bg-black/30 py-8">
        <Container>
          <p className="mb-4 text-center text-xs font-semibold tracking-widest text-white/50">{copy.mlsTitle}</p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {copy.mlsPortals.map((portal) => (
              <span
                key={portal}
                className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-white/80"
              >
                {portal}
              </span>
            ))}
          </div>
        </Container>
      </section>

      {/* Info band */}
      <section className="bg-gradient-to-br from-emerald-950/80 via-emerald-900/40 to-black py-12">
        <Container>
          <div className="mx-auto max-w-3xl space-y-4 text-center">
            <p className="text-xs font-semibold tracking-widest text-emerald-300/80">
              {localizedCoverageLabel(tier, locale).toUpperCase()}
            </p>
            <h2 className="text-2xl font-semibold text-white">{copy.infoTitle(county.county)}</h2>
            <p className="text-base text-emerald-50/85">
              {active ? copy.infoActive(county.county) : copy.infoInactive(county.county)}
            </p>
          </div>
        </Container>
      </section>

      {/* Comparison */}
      <section className="py-12">
        <Container>
          <h2 className="mb-8 text-center text-xl font-semibold text-white sm:text-2xl">{copy.compareTitle}</h2>
          <div className="mx-auto grid max-w-4xl gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-emerald-400/40 bg-emerald-950/25 p-6">
              <p className="text-xs font-semibold tracking-widest text-emerald-300">{copy.compareListQik.label}</p>
              <p className="mt-3 text-2xl font-semibold text-emerald-100">{copy.compareListQik.fee}</p>
              <p className="mt-2 text-sm text-white/70">{copy.compareListQik.note}</p>
            </div>
            <div className="rounded-2xl border border-white/15 bg-black/30 p-6">
              <p className="text-xs font-semibold tracking-widest text-white/50">{copy.compareTraditional.label}</p>
              <p className="mt-3 text-2xl font-semibold text-white/90">{copy.compareTraditional.fee}</p>
              <p className="mt-2 text-sm text-white/60">{copy.compareTraditional.note}</p>
            </div>
          </div>
        </Container>
      </section>

      {/* Property types + FAQ */}
      <section className="border-t border-white/10 py-12">
        <Container>
          <div className="grid gap-10 lg:grid-cols-2">
            <div>
              <h2 className="text-lg font-semibold text-white">{copy.propertyTypesTitle}</h2>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {copy.propertyTypes.map((type) => (
                  <li
                    key={type}
                    className="rounded-xl border border-emerald-500/20 bg-emerald-950/15 px-4 py-3 text-sm font-medium text-emerald-100/90"
                  >
                    {type}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">{copy.faqTitle}</h2>
              <div className="mt-4 space-y-4">
                {copy.faqItems.map((item) => (
                  <div key={item.title} className="rounded-xl border border-white/10 bg-black/25 p-4">
                    <h3 className="text-sm font-semibold text-emerald-100">{item.title}</h3>
                    <p className="mt-1 text-sm text-white/65">{item.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* City index */}
      {county.cities.length > 0 ? (
        <section className="border-t border-white/10 py-12">
          <Container>
            <div className="mx-auto max-w-4xl">
              <h2 className="text-xl font-semibold text-white">{copy.citiesSectionTitle(county.county)}</h2>
              <p className="mt-2 text-sm text-white/60">{copy.citiesSectionIntro(county.cities.length)}</p>
              <ul className="mt-6 columns-1 gap-x-6 text-sm sm:columns-2 lg:columns-3">
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
            </div>
          </Container>
        </section>
      ) : null}

      {/* Final CTA */}
      <section className="border-t border-emerald-500/20 bg-emerald-950/20 py-14">
        <Container>
          <div className="mx-auto max-w-2xl space-y-4 text-center">
            <h2 className="text-2xl font-semibold text-white">{copy.finalCtaTitle}</h2>
            <p className="text-sm text-white/70">{copy.finalCtaBody}</p>
            <GetListedButton locale={locale} label={copy.getListedNow} className="mx-auto" />
          </div>
        </Container>
      </section>
    </div>
  );
}
