import Link from "next/link";
import { formatAdminDate } from "@/lib/admin-insights";
import {
  formatLandingCategory,
  getLandingAnalyticsSummary,
} from "@/lib/landing-analytics-admin";
import type { LandingPageCategory } from "@/models/LandingPageEvent";

function StatCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string | number;
  hint?: string;
}) {
  return (
    <div className="rounded-2xl border border-white/15 bg-black/30 p-4">
      <p className="text-xs font-semibold uppercase tracking-wider text-white/55">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-emerald-50">{value}</p>
      {hint ? <p className="mt-1 text-xs text-white/50">{hint}</p> : null}
    </div>
  );
}

export default async function AdminLandingAnalyticsPage({
  searchParams,
}: {
  searchParams: Promise<{ days?: string }>;
}) {
  const { days: daysParam } = await searchParams;
  const rangeDays = daysParam === "30" ? 30 : daysParam === "1" ? 1 : 7;
  const summary = await getLandingAnalyticsSummary(rangeDays);

  const rangeLinks = [
    { days: 1, label: "24h" },
    { days: 7, label: "7d" },
    { days: 30, label: "30d" },
  ] as const;

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-emerald-50">Landing analytics</h2>
          <p className="mt-1 text-sm text-white/65">
            Page views and Get Listed Now clicks on marketing and location landing pages.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {rangeLinks.map((link) => (
            <Link
              key={link.days}
              href={`/dashboard/admin/landing-analytics?days=${link.days}`}
              className={[
                "rounded-full border px-3 py-1.5 text-xs font-semibold tracking-wide transition",
                rangeDays === link.days
                  ? "border-emerald-400/60 bg-emerald-500/20 text-emerald-100"
                  : "border-white/15 text-white/70 hover:border-white/30 hover:text-white",
              ].join(" ")}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </header>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Page views" value={summary.pageViews.toLocaleString()} />
        <StatCard label="CTA clicks" value={summary.ctaClicks.toLocaleString()} hint="Get Listed Now" />
        <StatCard
          label="Click-through rate"
          value={`${summary.clickThroughRate}%`}
          hint="CTA clicks ÷ page views"
        />
        <StatCard label="Sessions" value={summary.uniqueSessions.toLocaleString()} hint="Anonymous session IDs" />
      </div>

      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-white">By page type</h3>
        <div className="overflow-x-auto rounded-2xl border border-white/15 bg-black/30">
          <table className="min-w-full text-left text-sm text-white/90">
            <thead className="bg-white/5 text-xs uppercase tracking-wider text-white/70">
              <tr>
                <th className="px-3 py-2">Type</th>
                <th className="px-3 py-2">Views</th>
                <th className="px-3 py-2">CTA clicks</th>
                <th className="px-3 py-2">CTR</th>
              </tr>
            </thead>
            <tbody>
              {summary.byCategory.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-3 py-6 text-center text-white/50">
                    No events yet. Traffic will appear after visitors hit tracked landing pages.
                  </td>
                </tr>
              ) : (
                summary.byCategory.map((row) => (
                  <tr key={row.category} className="border-t border-white/10">
                    <td className="px-3 py-2">
                      {formatLandingCategory(row.category as LandingPageCategory)}
                    </td>
                    <td className="px-3 py-2">{row.pageViews}</td>
                    <td className="px-3 py-2">{row.ctaClicks}</td>
                    <td className="px-3 py-2">
                      {row.pageViews > 0
                        ? `${Math.round((row.ctaClicks / row.pageViews) * 1000) / 10}%`
                        : "—"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="space-y-3">
          <h3 className="text-sm font-semibold text-white">Top pages</h3>
          <div className="overflow-x-auto rounded-2xl border border-white/15 bg-black/30">
            <table className="min-w-full text-left text-sm text-white/90">
              <thead className="bg-white/5 text-xs uppercase tracking-wider text-white/70">
                <tr>
                  <th className="px-3 py-2">Path</th>
                  <th className="px-3 py-2">Views</th>
                  <th className="px-3 py-2">Clicks</th>
                </tr>
              </thead>
              <tbody>
                {summary.topPages.map((row) => (
                  <tr key={row.path} className="border-t border-white/10 align-top">
                    <td className="max-w-[16rem] truncate px-3 py-2 font-mono text-xs">{row.path}</td>
                    <td className="px-3 py-2">{row.pageViews}</td>
                    <td className="px-3 py-2">{row.ctaClicks}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="space-y-3">
          <h3 className="text-sm font-semibold text-white">Top counties</h3>
          <div className="overflow-x-auto rounded-2xl border border-white/15 bg-black/30">
            <table className="min-w-full text-left text-sm text-white/90">
              <thead className="bg-white/5 text-xs uppercase tracking-wider text-white/70">
                <tr>
                  <th className="px-3 py-2">County slug</th>
                  <th className="px-3 py-2">Views</th>
                  <th className="px-3 py-2">Clicks</th>
                </tr>
              </thead>
              <tbody>
                {summary.topCounties.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-3 py-6 text-center text-white/50">
                      No county traffic yet.
                    </td>
                  </tr>
                ) : (
                  summary.topCounties.map((row) => (
                    <tr key={row.countySlug} className="border-t border-white/10">
                      <td className="px-3 py-2 font-mono text-xs">{row.countySlug}</td>
                      <td className="px-3 py-2">{row.pageViews}</td>
                      <td className="px-3 py-2">{row.ctaClicks}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {summary.topCampaigns.length > 0 ? (
        <section className="space-y-3">
          <h3 className="text-sm font-semibold text-white">UTM campaigns</h3>
          <div className="overflow-x-auto rounded-2xl border border-white/15 bg-black/30">
            <table className="min-w-full text-left text-sm text-white/90">
              <thead className="bg-white/5 text-xs uppercase tracking-wider text-white/70">
                <tr>
                  <th className="px-3 py-2">utm_campaign</th>
                  <th className="px-3 py-2">Views</th>
                  <th className="px-3 py-2">Clicks</th>
                </tr>
              </thead>
              <tbody>
                {summary.topCampaigns.map((row) => (
                  <tr key={row.utmCampaign} className="border-t border-white/10">
                    <td className="px-3 py-2">{row.utmCampaign}</td>
                    <td className="px-3 py-2">{row.pageViews}</td>
                    <td className="px-3 py-2">{row.ctaClicks}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ) : null}

      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-white">Recent events</h3>
        <div className="overflow-x-auto rounded-2xl border border-white/15 bg-black/30">
          <table className="min-w-full text-left text-sm text-white/90">
            <thead className="bg-white/5 text-xs uppercase tracking-wider text-white/70">
              <tr>
                <th className="px-3 py-2">Time</th>
                <th className="px-3 py-2">Event</th>
                <th className="px-3 py-2">Path</th>
                <th className="px-3 py-2">Campaign</th>
              </tr>
            </thead>
            <tbody>
              {summary.recentEvents.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-3 py-6 text-center text-white/50">
                    No events recorded yet.
                  </td>
                </tr>
              ) : (
                summary.recentEvents.map((event) => (
                  <tr key={event.id} className="border-t border-white/10 align-top">
                    <td className="px-3 py-2 whitespace-nowrap text-xs">
                      {formatAdminDate(event.createdAt)}
                    </td>
                    <td className="px-3 py-2 text-xs">
                      {event.eventType === "cta_click"
                        ? `Click · ${event.eventName ?? "cta"}`
                        : "Page view"}
                      <span className="block text-white/45">
                        {formatLandingCategory(event.pageCategory as LandingPageCategory)}
                      </span>
                    </td>
                    <td className="max-w-[14rem] truncate px-3 py-2 font-mono text-xs">{event.path}</td>
                    <td className="px-3 py-2 text-xs">{event.utmCampaign ?? "—"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
