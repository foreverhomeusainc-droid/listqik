import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { Container } from "@/components/container";
import { GhlInlineFormSection } from "@/components/marketing/ghl-inline-form-section";
import { SocialLeadCtaSection } from "@/components/marketing/social-lead-cta-section";
import { BrokerDisclosureBlock } from "@/components/marketing/broker-disclosure-block";
import { SubsonicPricingLink } from "@/components/marketing/subsonic-pricing-link";
import { getDfwSatelliteCopy } from "@/i18n/dfw-satellite-copy";
import type { HomeLocale } from "@/i18n/home-locale";
import { getTexasLocationCopy } from "@/i18n/texas-location-copy";
import { DFW_SATELLITE_LANDING_PATH, getDfwSatelliteCountyLinks } from "@/lib/dfw-satellite-campaign";
import { buildLocalizedMetadata } from "@/lib/locale-metadata";
import { localeSitePath } from "@/lib/locale-site-path";
import { formatTexasLocationDisplayName, texasIndexPath } from "@/lib/texas-location-seo";

function StartListingButton({
  locale,
  label,
  className = "",
  size = "default",
}: {
  locale: HomeLocale;
  label: string;
  className?: string;
  size?: "default" | "large";
}) {
  const sizeClass =
    size === "large"
      ? "min-h-[52px] px-9 text-base sm:min-h-[56px] sm:px-10"
      : "min-h-[48px] px-7 text-sm";

  return (
    <SubsonicPricingLink
      locale={locale}
      className={`inline-flex items-center justify-center rounded-full border border-emerald-400/80 bg-emerald-500/30 font-semibold tracking-wide text-emerald-50 shadow-[0_0_28px_rgba(16,185,129,0.35)] transition hover:bg-emerald-400/40 ${sizeClass} ${className}`}
    >
      {label}
    </SubsonicPricingLink>
  );
}

function SectionHeading({ children }: { children: ReactNode }) {
  return (
    <h2 className="text-center text-xl font-semibold tracking-tight text-white sm:text-2xl">{children}</h2>
  );
}

export function dfwSatelliteMetadata(locale: HomeLocale): Metadata {
  const copy = getDfwSatelliteCopy(locale);
  return buildLocalizedMetadata(locale, DFW_SATELLITE_LANDING_PATH, {
    title: copy.metaTitle,
    description: copy.metaDescription,
  });
}

export function DfwSatelliteLandingPage({ locale }: { locale: HomeLocale }) {
  const copy = getDfwSatelliteCopy(locale);
  const nav = getTexasLocationCopy(locale);
  const counties = getDfwSatelliteCountyLinks(locale);

  return (
    <div>
      <section className="relative overflow-hidden border-b border-emerald-500/25 bg-gradient-to-br from-emerald-950 via-black to-black">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.18),transparent_60%)]"
        />
        <Container className="relative py-10 sm:py-14 lg:py-16">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-semibold tracking-[0.18em] text-emerald-300/95 sm:text-sm">
              {copy.heroEyebrow}
            </p>
            <h1 className="mt-3 text-3xl font-semibold leading-[1.12] tracking-tight text-white sm:text-4xl lg:text-[2.65rem]">
              {copy.heroTitle}
            </h1>
            <p className="mt-4 text-base leading-relaxed text-emerald-50/90 sm:text-lg">{copy.heroSubtitle}</p>

            <div className="mt-6 flex flex-col items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/50 bg-emerald-950/50 px-4 py-2 text-xs font-semibold tracking-wide text-emerald-100 sm:text-sm">
                <span aria-hidden className="h-2 w-2 rounded-full bg-emerald-400" />
                {copy.mlsTrustBadge}
              </span>
              <StartListingButton locale={locale} label={copy.startYourListing} size="large" />
            </div>

            <p className="mt-5 text-xs font-medium tracking-wide text-white/55 sm:text-sm">{copy.heroTrustLine}</p>
          </div>
        </Container>
      </section>

      <section className="border-b border-white/10 bg-black/40 py-8 sm:py-10">
        <Container>
          <div className="mx-auto max-w-2xl">
            <h2 className="sr-only">{copy.brokerDisclosureTitle}</h2>
            <BrokerDisclosureBlock locale={locale} variant="prominent" />
          </div>
        </Container>
      </section>

      <section className="border-b border-white/10 bg-black/30 py-10 sm:py-12">
        <Container>
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-lg font-semibold text-emerald-100 sm:text-xl">{copy.countiesTitle}</h2>
            <p className="mt-3 text-base leading-relaxed text-white/75">{copy.countiesIntro}</p>
            <ul className="mt-8 flex flex-wrap justify-center gap-2 sm:gap-3">
              {counties.map((county) => (
                <li key={county.countySlug}>
                  <Link
                    href={county.path}
                    className="inline-flex rounded-full border border-emerald-500/25 bg-emerald-950/20 px-4 py-2 text-sm text-emerald-100 transition hover:border-emerald-400/40 hover:bg-emerald-900/30"
                  >
                    {formatTexasLocationDisplayName(county.countyName)} County
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      <section className="py-12 sm:py-14">
        <Container>
          <div className="mx-auto max-w-5xl">
            <SectionHeading>{copy.howItWorksTitle}</SectionHeading>
            <ol className="mt-8 grid gap-4 sm:grid-cols-3">
              {copy.howItWorksSteps.map((step, index) => (
                <li
                  key={step.title}
                  className="glass-surface flex h-full flex-col rounded-2xl border border-emerald-500/20 p-6 text-center"
                >
                  <div className="mx-auto mb-4 flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-emerald-400/40 bg-emerald-950/40 text-lg font-bold text-emerald-200">
                    {index + 1}
                  </div>
                  <h3 className="text-base font-semibold text-white">{step.title}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-white/70">{step.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </Container>
      </section>

      <section className="border-y border-white/10 bg-black/20 py-12 sm:py-14">
        <Container>
          <div className="mx-auto max-w-4xl">
            <SectionHeading>{copy.pricingTransparencyTitle}</SectionHeading>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="flex h-full flex-col rounded-2xl border border-emerald-400/40 bg-emerald-950/25 p-6">
                <p className="text-xs font-semibold tracking-widest text-emerald-300">{copy.compareListQik.label}</p>
                <p className="mt-3 text-2xl font-semibold text-emerald-100">{copy.compareListQik.fee}</p>
                <p className="mt-2 text-sm text-white/70">{copy.compareListQik.note}</p>
              </div>
              <div className="flex h-full flex-col rounded-2xl border border-white/15 bg-black/30 p-6">
                <p className="text-xs font-semibold tracking-widest text-white/50">{copy.compareTraditional.label}</p>
                <p className="mt-3 text-2xl font-semibold text-white/90">{copy.compareTraditional.fee}</p>
                <p className="mt-2 text-sm text-white/60">{copy.compareTraditional.note}</p>
              </div>
            </div>

            <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-emerald-200/90">
                {copy.pricingIncludesTitle}
              </h3>
              <ul className="mt-4 space-y-2 text-sm leading-relaxed text-white/75">
                {copy.pricingIncludes.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span aria-hidden className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-5 text-sm leading-relaxed text-emerald-50/85">{copy.pricingClosingDisclosure}</p>
            </div>

            <div className="mt-8 flex justify-center">
              <StartListingButton locale={locale} label={copy.startYourListing} />
            </div>
          </div>
        </Container>
      </section>

      <section className="border-b border-white/10 py-10 sm:py-12">
        <Container>
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-xs font-semibold tracking-widest text-white/50">{copy.mlsTitle}</p>
            <div className="mt-5 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
              {copy.mlsPortals.map((portal) => (
                <span
                  key={portal}
                  className="rounded-full border border-white/15 bg-white/5 px-3 py-2 text-sm font-medium text-white/80 sm:px-4"
                >
                  {portal}
                </span>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section className="py-12 sm:py-14">
        <Container>
          <div className="mx-auto max-w-5xl">
            <SectionHeading>{copy.faqTitle}</SectionHeading>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {copy.faqItems.map((item) => (
                <div
                  key={item.title}
                  className="flex h-full flex-col rounded-xl border border-white/10 bg-black/25 p-5"
                >
                  <h3 className="text-sm font-semibold text-emerald-100 sm:text-base">{item.title}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-white/65">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section className="border-t border-emerald-500/20 bg-emerald-950/20 py-14 sm:py-16">
        <Container>
          <div className="mx-auto max-w-2xl space-y-4 text-center">
            <h2 className="text-2xl font-semibold text-white sm:text-3xl">{copy.finalCtaTitle}</h2>
            <p className="text-sm leading-relaxed text-white/70 sm:text-base">{copy.finalCtaBody}</p>
            <div className="flex justify-center pt-2">
              <StartListingButton locale={locale} label={copy.startYourListing} size="large" />
            </div>
            <p className="pt-4 text-xs text-white/45">
              <Link href={texasIndexPath(locale)} className="underline-offset-2 hover:underline">
                {nav.breadcrumbTexas}
              </Link>
              {" · "}
              <Link href={localeSitePath("/service-area", locale)} className="underline-offset-2 hover:underline">
                {nav.breadcrumbServiceArea}
              </Link>
            </p>
          </div>
        </Container>
      </section>

      <SocialLeadCtaSection locale={locale} />
      <GhlInlineFormSection locale={locale} />
    </div>
  );
}
