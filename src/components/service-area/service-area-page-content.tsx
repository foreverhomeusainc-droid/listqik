"use client";

import Link from "next/link";
import { Container } from "@/components/container";
import { useSiteLocale } from "@/components/site-locale-provider";
import { ServiceAreaHubJsonLd } from "@/components/service-area/service-area-hub-json-ld";
import { TexasServiceAreaMap } from "@/components/service-area/texas-service-area-map";
import { getServiceAreaCopy } from "@/i18n/service-area-copy";
import { localeSitePath } from "@/lib/locale-site-path";
import { TEXAS_LOCATION_STATS } from "@/lib/texas-location-seo";
import {
  buildTexasCountyMap,
  EXTENDED_SERVICE_COUNT,
  EXTENDED_SERVICE_COUNTIES,
  PRIMARY_SERVICE_COUNT,
  PRIMARY_SERVICE_COUNTIES,
  TOTAL_SERVICE_COUNT,
} from "@/lib/service-area";

const HAR_CORE_COUNTIES = [
  {
    name: "Harris",
    note: "The central hub, including Houston proper, Cypress, and Spring",
  },
  {
    name: "Fort Bend",
    note: "Sugar Land, Missouri City, Katy",
  },
  {
    name: "Montgomery",
    note: "The Woodlands, Conroe",
  },
  {
    name: "Brazoria",
    note: "Pearland, Alvin",
  },
  {
    name: "Galveston",
    note: "Galveston, League City, Friendswood",
  },
  {
    name: "Liberty",
    note: "Liberty, Cleveland",
  },
  {
    name: "Waller",
    note: "Hempstead, Prairie View",
  },
  {
    name: "Chambers",
    note: "Baytown, Anahuac",
  },
  {
    name: "Austin",
    note: "Bellville, Sealy",
  },
] as const;

const HAR_EXTENDED_MARKET_COUNTIES = [
  {
    name: "Walker",
    note: "Huntsville",
  },
  {
    name: "San Jacinto",
    note: "Coldspring, Shepherd",
  },
  {
    name: "Wharton",
    note: "Wharton, El Campo",
  },
  {
    name: "Colorado",
    note: "Columbus, Eagle Lake",
  },
  {
    name: "Matagorda",
    note: "Bay City, Palacios",
  },
  {
    name: "Grimes",
    note: "Navasota",
  },
  {
    name: "Washington",
    note: "Brenham",
  },
] as const;

const HAR_CORE_COUNTY_NAMES = HAR_CORE_COUNTIES.map((county) => county.name);
const HAR_EXTENDED_MARKET_COUNTY_NAMES = HAR_EXTENDED_MARKET_COUNTIES.map((county) => county.name);
const HAR_TOTAL_MARKET_COUNT = HAR_CORE_COUNTIES.length + HAR_EXTENDED_MARKET_COUNTIES.length;
const HOUSTON_HAR_MARKET_MAP = buildTexasCountyMap({
  primaryCounties: HAR_CORE_COUNTY_NAMES,
  extendedCounties: HAR_EXTENDED_MARKET_COUNTY_NAMES,
});

function CountyChip({
  name,
  tone = "secondary",
  className = "",
}: {
  name: string;
  tone?: "primary" | "secondary";
  className?: string;
}) {
  return (
    <span
      className={[
        "inline-flex rounded-full border px-3 py-1 text-xs font-semibold tracking-wide",
        tone === "primary"
          ? "border-emerald-400/45 bg-emerald-500/15 text-emerald-100"
          : "border-white/10 bg-white/5 text-white/75",
        className,
      ].join(" ")}
    >
      {name} County
    </span>
  );
}

function CountyChipGrid({
  counties,
  tone = "secondary",
  className = "",
}: {
  counties: readonly string[];
  tone?: "primary" | "secondary";
  className?: string;
}) {
  return (
    <ul className={["mt-4 grid gap-2 sm:grid-cols-2", className].join(" ")}>
      {counties.map((county) => (
        <li key={county}>
          <CountyChip
            name={county}
            tone={tone}
            className="w-full justify-center text-center sm:justify-start sm:text-left"
          />
        </li>
      ))}
    </ul>
  );
}

function MarketCountyList({
  counties,
  itemTone = "glass",
}: {
  counties: readonly { name: string; note: string }[];
  itemTone?: "glass" | "dark";
}) {
  return (
    <ul className="mt-4 grid gap-3 sm:grid-cols-2">
      {counties.map((county) => (
        <li
          key={county.name}
          className={[
            "rounded-2xl border border-white/10 p-3",
            itemTone === "dark" ? "bg-black/20" : "bg-white/5",
          ].join(" ")}
        >
          <span className="font-semibold text-white">{county.name} County</span>
          <span className="text-white/60"> ({county.note})</span>
        </li>
      ))}
    </ul>
  );
}

function StatPill({
  label,
  value,
  tone = "secondary",
}: {
  label: string;
  value: number;
  tone?: "primary" | "secondary";
}) {
  return (
    <div
      className={[
        "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em]",
        tone === "primary"
          ? "border-emerald-400/45 bg-emerald-500/12 text-emerald-100"
          : "border-white/10 bg-white/5 text-white/65",
      ].join(" ")}
    >
      <span
        className={[
          "h-2.5 w-2.5 rounded-full",
          tone === "primary" ? "bg-emerald-300" : "bg-sky-300/80",
        ].join(" ")}
      />
      {value} {label}
    </div>
  );
}

export function ServiceAreaPageContent() {
  const { locale } = useSiteLocale();
  const t = getServiceAreaCopy(locale);
  const pricingHref = localeSitePath("/pricing", locale);
  const texasIndexHref = localeSitePath("/service-area/texas", locale);
  const visibleExtendedCounties = EXTENDED_SERVICE_COUNTIES.slice(0, 12);
  const hiddenExtendedCounties = EXTENDED_SERVICE_COUNTIES.slice(12);
  const seoSuffix = t.seoIndexSuffix.replace(
    "{cityCount}",
    String(TEXAS_LOCATION_STATS.cityCount),
  );

  return (
    <div className="py-10 sm:py-14">
      <ServiceAreaHubJsonLd />
      <Container>
        <div className="mx-auto max-w-7xl space-y-8">
          <header className="space-y-4">
            <div className="text-xs font-semibold tracking-widest text-white/60">
              {t.eyebrow}
            </div>
            <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              {t.title}
            </h1>
            <p className="max-w-4xl text-base text-muted">{t.intro}</p>
            <div className="flex flex-wrap gap-2">
              <StatPill label={t.statPrimary} value={PRIMARY_SERVICE_COUNT} tone="primary" />
              <StatPill label={t.statExtended} value={EXTENDED_SERVICE_COUNT} />
              <StatPill label={t.statTotal} value={TOTAL_SERVICE_COUNT} />
            </div>
            <p className="text-sm text-white/55">
              {t.seoIndexPrefix}{" "}
              <Link href={texasIndexHref} className="text-emerald-300 underline">
                {TEXAS_LOCATION_STATS.countyCount} {t.seoCountiesLink}
              </Link>{" "}
              {seoSuffix}
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-emerald-500/20 bg-emerald-950/12 p-4">
                <div className="text-xs font-semibold tracking-widest text-emerald-200/70">
                  {t.activeCoverageLabel}
                </div>
                <div className="mt-2 text-base font-semibold text-white">
                  {t.activeCoverageTitle}
                </div>
                <p className="mt-2 text-sm text-white/65">{t.activeCoverageBody}</p>
              </div>
              <div className="rounded-2xl border border-sky-400/15 bg-sky-950/10 p-4">
                <div className="text-xs font-semibold tracking-widest text-sky-200/70">
                  {t.marketRefLabel}
                </div>
                <div className="mt-2 text-base font-semibold text-white">
                  {t.marketRefTitle}
                </div>
                <p className="mt-2 text-sm text-white/65">{t.marketRefBody}</p>
              </div>
            </div>
          </header>

          <div className="glass-surface overflow-hidden">
            <div className="border-b border-white/10 p-4 sm:p-5 lg:p-6">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div className="max-w-3xl space-y-2">
                  <div className="text-xs font-semibold tracking-widest text-white/60">
                    {t.activeListqikLabel}
                  </div>
                  <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                    {t.activeListqikTitle}
                  </h2>
                  <p className="text-sm text-white/68 sm:text-base">{t.activeListqikBody}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <StatPill label={t.statPrimaryShort} value={PRIMARY_SERVICE_COUNT} tone="primary" />
                  <StatPill label={t.statExtendedShort} value={EXTENDED_SERVICE_COUNT} />
                </div>
              </div>
            </div>

            <div className="grid items-start gap-0 lg:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.95fr)]">
              <div className="border-b border-white/10 p-4 sm:p-5 lg:border-b-0 lg:border-r lg:p-6">
                <TexasServiceAreaMap />
                <div className="mt-4 grid gap-2 text-xs text-white/60 sm:flex sm:flex-wrap sm:gap-4">
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 sm:border-0 sm:bg-transparent sm:px-0 sm:py-0">
                    <span className="h-3 w-3 rounded-full bg-[#8BE6A7]" />
                    {t.mapLegendPrimary}
                  </div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 sm:border-0 sm:bg-transparent sm:px-0 sm:py-0">
                    <span className="h-3 w-3 rounded-full bg-[#1D4F7A]" />
                    {t.mapLegendExtended}
                  </div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 sm:border-0 sm:bg-transparent sm:px-0 sm:py-0">
                    <span className="h-3 w-3 rounded-full bg-[#0D2339]" />
                    {t.mapLegendOther}
                  </div>
                </div>
              </div>

              <div className="space-y-4 p-4 sm:p-5 lg:p-6">
                <section className="rounded-2xl border border-emerald-500/20 bg-emerald-950/12 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <h2 className="text-base font-semibold text-white">{t.primaryCountiesTitle}</h2>
                    <span className="text-xs font-mono text-emerald-200/70">
                      {t.primaryCountiesMeta.replace("{count}", String(PRIMARY_SERVICE_COUNT))}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-white/65">{t.primaryCountiesBody}</p>
                  <CountyChipGrid counties={PRIMARY_SERVICE_COUNTIES} tone="primary" />
                </section>

                <section className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <h2 className="text-base font-semibold text-white">{t.extendedCountiesTitle}</h2>
                    <span className="text-xs font-mono text-white/45">
                      {t.extendedCountiesMeta.replace("{count}", String(EXTENDED_SERVICE_COUNT))}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-white/65">{t.extendedCountiesBody}</p>
                  <CountyChipGrid counties={visibleExtendedCounties} />
                  {hiddenExtendedCounties.length > 0 ? (
                    <div className="mt-4 text-xs font-semibold uppercase tracking-[0.16em] text-white/45">
                      {t.fullListBelow}
                    </div>
                  ) : null}
                </section>
              </div>
            </div>

            {hiddenExtendedCounties.length > 0 ? (
              <div className="border-t border-white/10 bg-white/[0.02] px-4 py-4 sm:px-5 lg:px-6">
                <details className="group">
                  <summary className="list-none cursor-pointer rounded-full border border-white/15 bg-white/5 px-4 py-2 text-center text-xs font-semibold uppercase tracking-[0.16em] text-white/80 transition hover:border-white/30 hover:bg-white/10 hover:text-white">
                    <span className="group-open:hidden">
                      {t.viewMore.replace("{count}", String(hiddenExtendedCounties.length))}
                    </span>
                    <span className="hidden group-open:inline">{t.viewLess}</span>
                  </summary>
                  <div className="mt-4 rounded-2xl border border-white/10 bg-black/15 p-4">
                    <div className="text-xs font-semibold uppercase tracking-[0.16em] text-white/45">
                      {t.remainingCounties}
                    </div>
                    <CountyChipGrid
                      counties={hiddenExtendedCounties}
                      className="mt-4 lg:grid-cols-3 xl:grid-cols-4"
                    />
                  </div>
                </details>
              </div>
            ) : null}

            <div className="border-t border-white/10 bg-white/[0.03] px-4 py-4 text-sm text-white/70 sm:px-5">
              <span className="font-semibold text-white">{t.importantNote}</span> {t.importantNoteBody}
              <div className="mt-3 flex flex-wrap gap-3">
                <Link
                  href={pricingHref}
                  className="inline-flex min-h-[40px] items-center rounded-full border border-emerald-400/70 bg-emerald-500/20 px-4 text-sm font-semibold tracking-wide text-emerald-100 transition hover:bg-emerald-400/30"
                >
                  {t.startListing}
                </Link>
                <a
                  href="mailto:concierge@listqik.com?subject=Service%20Area%20Question"
                  className="inline-flex min-h-[40px] items-center rounded-full border border-white/15 px-4 text-sm font-semibold text-white/80 transition hover:border-white/30 hover:text-white"
                >
                  {t.contactConcierge}
                </a>
              </div>
            </div>
          </div>

          <section className="glass-surface overflow-hidden">
            <div className="border-b border-white/10 p-5 sm:p-6">
              <div className="space-y-4">
                <div className="text-xs font-semibold tracking-widest text-white/60">
                  {t.harEyebrow}
                </div>
                <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                  {t.harTitle}
                </h2>
                <p className="max-w-4xl text-sm text-white/70 sm:text-base">{t.harIntro}</p>
                <div className="rounded-2xl border border-sky-400/15 bg-sky-950/10 p-4 text-sm text-white/72">
                  <span className="font-semibold text-white">{t.harCompatNote}</span> {t.harCompatBody}
                </div>
                <div className="flex flex-wrap gap-2">
                  <StatPill label={t.statHarCore} value={HAR_CORE_COUNTIES.length} tone="primary" />
                  <StatPill label={t.statHarExtended} value={HAR_EXTENDED_MARKET_COUNTIES.length} />
                  <StatPill label={t.statHarTotal} value={HAR_TOTAL_MARKET_COUNT} />
                </div>
              </div>
            </div>

            <div className="grid items-start gap-0 lg:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.95fr)]">
              <div className="border-b border-white/10 p-4 sm:p-5 lg:border-b-0 lg:border-r lg:p-6">
                <TexasServiceAreaMap
                  map={HOUSTON_HAR_MARKET_MAP}
                  ariaLabel={t.harMapAria}
                />
                <div className="mt-4 grid gap-2 text-xs text-white/60 sm:flex sm:flex-wrap sm:gap-4">
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 sm:border-0 sm:bg-transparent sm:px-0 sm:py-0">
                    <span className="h-3 w-3 rounded-full bg-[#8BE6A7]" />
                    {t.harLegendCore}
                  </div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 sm:border-0 sm:bg-transparent sm:px-0 sm:py-0">
                    <span className="h-3 w-3 rounded-full bg-[#1D4F7A]" />
                    {t.harLegendExtended}
                  </div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 sm:border-0 sm:bg-transparent sm:px-0 sm:py-0">
                    <span className="h-3 w-3 rounded-full bg-[#0D2339]" />
                    {t.mapLegendOther}
                  </div>
                </div>
              </div>

              <div className="space-y-4 p-4 sm:p-5 lg:p-6">
                <section className="rounded-2xl border border-emerald-500/20 bg-emerald-950/12 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-base font-semibold text-white">{t.harCoreTitle}</h3>
                    <span className="text-xs font-mono text-emerald-200/70">
                      {HAR_CORE_COUNTIES.length} {t.countiesWord}
                    </span>
                  </div>
                  <MarketCountyList counties={HAR_CORE_COUNTIES} />
                </section>

                <section className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-base font-semibold text-white">{t.harExtendedTitle}</h3>
                    <span className="text-xs font-mono text-white/45">
                      {HAR_EXTENDED_MARKET_COUNTIES.length} {t.countiesWord}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-white/65">{t.harExtendedBody1}</p>
                  <p className="mt-3 text-sm text-white/65">{t.harExtendedBody2}</p>
                  <MarketCountyList counties={HAR_EXTENDED_MARKET_COUNTIES} itemTone="dark" />
                </section>
              </div>
            </div>

            <div className="border-t border-white/10 bg-white/[0.03] px-5 py-4 text-sm text-white/72">
              <span className="font-semibold text-white">{t.statewideNote}</span> {t.statewideBody}
            </div>
          </section>
        </div>
      </Container>
    </div>
  );
}
