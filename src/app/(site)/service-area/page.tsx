import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/container";
import { TexasServiceAreaMap } from "@/components/service-area/texas-service-area-map";
import {
  EXTENDED_SERVICE_COUNT,
  EXTENDED_SERVICE_COUNTIES,
  PRIMARY_SERVICE_COUNT,
  PRIMARY_SERVICE_COUNTIES,
  TOTAL_SERVICE_COUNT,
} from "@/lib/service-area";

export const metadata: Metadata = {
  title: "Service Area",
  description:
    "See ListQik's current Texas service area, including primary DFW counties and extended county coverage across Texas.",
  alternates: {
    canonical: "/service-area",
  },
};

function CountyChip({
  name,
  tone = "secondary",
}: {
  name: string;
  tone?: "primary" | "secondary";
}) {
  return (
    <span
      className={[
        "inline-flex rounded-full border px-3 py-1 text-xs font-semibold tracking-wide",
        tone === "primary"
          ? "border-emerald-400/45 bg-emerald-500/15 text-emerald-100"
          : "border-white/10 bg-white/5 text-white/75",
      ].join(" ")}
    >
      {name} County
    </span>
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

export default function ServiceAreaPage() {
  return (
    <div className="py-10 sm:py-14">
      <Container>
        <div className="mx-auto max-w-6xl space-y-8">
          <header className="space-y-4">
            <div className="text-xs font-semibold tracking-widest text-white/60">
              CURRENT SERVICE AREA
            </div>
            <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Primary DFW coverage plus extended Texas county support.
            </h1>
            <p className="max-w-3xl text-base text-muted">
              Our core focus is Collin, Denton, Dallas, and Tarrant counties, with additional
              licensed coverage across the counties below based on the current service-area report.
            </p>
            <div className="flex flex-wrap gap-2">
              <StatPill label="Primary Counties" value={PRIMARY_SERVICE_COUNT} tone="primary" />
              <StatPill label="Additional Counties" value={EXTENDED_SERVICE_COUNT} />
              <StatPill label="Total Counties" value={TOTAL_SERVICE_COUNT} />
            </div>
          </header>

          <div className="glass-surface overflow-hidden">
            <div className="grid gap-0 lg:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.95fr)]">
              <div className="border-b border-white/10 p-5 lg:border-b-0 lg:border-r">
                <div className="mb-4 flex flex-wrap gap-2">
                  <StatPill label="Primary" value={PRIMARY_SERVICE_COUNT} tone="primary" />
                  <StatPill label="Extended" value={EXTENDED_SERVICE_COUNT} />
                </div>
                <TexasServiceAreaMap />
                <div className="mt-4 flex flex-wrap gap-4 text-xs text-white/60">
                  <div className="inline-flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-[#8BE6A7]" />
                    Primary counties
                  </div>
                  <div className="inline-flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-[#1D4F7A]" />
                    Extended service counties
                  </div>
                  <div className="inline-flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-[#0D2339]" />
                    Other Texas counties
                  </div>
                </div>
              </div>

              <div className="space-y-4 p-5">
                <section className="rounded-2xl border border-emerald-500/20 bg-emerald-950/12 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <h2 className="text-base font-semibold text-white">Primary counties</h2>
                    <span className="text-xs font-mono text-emerald-200/70">
                      {PRIMARY_SERVICE_COUNT} counties
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-white/65">
                    These are the core counties we want to lead with in messaging and outreach.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {PRIMARY_SERVICE_COUNTIES.map((county) => (
                      <CountyChip key={county} name={county} tone="primary" />
                    ))}
                  </div>
                </section>

                <section className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <h2 className="text-base font-semibold text-white">Extended Texas counties</h2>
                    <span className="text-xs font-mono text-white/45">
                      {EXTENDED_SERVICE_COUNT} counties
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-white/65">
                    Additional counties pulled from the latest coverage report. These are active
                    counties, not a coming-soon list.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {EXTENDED_SERVICE_COUNTIES.map((county) => (
                      <CountyChip key={county} name={county} />
                    ))}
                  </div>
                </section>
              </div>
            </div>

            <div className="border-t border-white/10 bg-white/[0.03] px-5 py-4 text-sm text-white/70">
              <span className="font-semibold text-white">Important note:</span> If your property is
              just outside one of these counties, contact us anyway. We can confirm nearby coverage,
              current broker footprint, and whether there is a workable MLS path for your listing.
              <div className="mt-3 flex flex-wrap gap-3">
                <Link
                  href="/pricing"
                  className="inline-flex min-h-[40px] items-center rounded-full border border-emerald-400/70 bg-emerald-500/20 px-4 text-sm font-semibold tracking-wide text-emerald-100 transition hover:bg-emerald-400/30"
                >
                  Start Listing
                </Link>
                <a
                  href="mailto:concierge@listqik.com?subject=Service%20Area%20Question"
                  className="inline-flex min-h-[40px] items-center rounded-full border border-white/15 px-4 text-sm font-semibold text-white/80 transition hover:border-white/30 hover:text-white"
                >
                  Contact Concierge
                </a>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
