import { connectDb } from "@/lib/mongodb";
import { LANDING_PAGE_CATEGORY_LABELS } from "@/lib/landing-analytics";
import { LandingPageEvent, type LandingPageCategory } from "@/models/LandingPageEvent";

export type LandingAnalyticsSummary = {
  rangeDays: number;
  pageViews: number;
  ctaClicks: number;
  uniqueSessions: number;
  clickThroughRate: number;
  byCategory: { category: LandingPageCategory; pageViews: number; ctaClicks: number }[];
  topPages: { path: string; pageViews: number; ctaClicks: number }[];
  topCounties: { countySlug: string; pageViews: number; ctaClicks: number }[];
  topCampaigns: { utmCampaign: string; pageViews: number; ctaClicks: number }[];
  recentEvents: {
    id: string;
    eventType: string;
    eventName: string | null;
    path: string;
    pageCategory: string;
    createdAt: Date;
    utmCampaign: string | null;
  }[];
};

function pct(clicks: number, views: number): number {
  if (views <= 0) return 0;
  return Math.round((clicks / views) * 1000) / 10;
}

export async function getLandingAnalyticsSummary(rangeDays = 7): Promise<LandingAnalyticsSummary> {
  await connectDb();

  const since = new Date(Date.now() - rangeDays * 24 * 60 * 60 * 1000);

  const [
    pageViews,
    ctaClicks,
    uniqueSessions,
    byCategoryRaw,
    topPagesRaw,
    topCountiesRaw,
    topCampaignsRaw,
    recentEvents,
  ] = await Promise.all([
    LandingPageEvent.countDocuments({ eventType: "page_view", createdAt: { $gte: since } }),
    LandingPageEvent.countDocuments({ eventType: "cta_click", createdAt: { $gte: since } }),
    LandingPageEvent.distinct("sessionId", {
      sessionId: { $nin: [null, ""] },
      createdAt: { $gte: since },
    }),
    LandingPageEvent.aggregate<{ _id: LandingPageCategory; pageViews: number; ctaClicks: number }>([
      { $match: { createdAt: { $gte: since } } },
      {
        $group: {
          _id: "$pageCategory",
          pageViews: {
            $sum: { $cond: [{ $eq: ["$eventType", "page_view"] }, 1, 0] },
          },
          ctaClicks: {
            $sum: { $cond: [{ $eq: ["$eventType", "cta_click"] }, 1, 0] },
          },
        },
      },
      { $sort: { pageViews: -1 } },
    ]),
    LandingPageEvent.aggregate<{ _id: string; pageViews: number; ctaClicks: number }>([
      { $match: { createdAt: { $gte: since } } },
      {
        $group: {
          _id: "$path",
          pageViews: {
            $sum: { $cond: [{ $eq: ["$eventType", "page_view"] }, 1, 0] },
          },
          ctaClicks: {
            $sum: { $cond: [{ $eq: ["$eventType", "cta_click"] }, 1, 0] },
          },
        },
      },
      { $sort: { pageViews: -1 } },
      { $limit: 15 },
    ]),
    LandingPageEvent.aggregate<{ _id: string; pageViews: number; ctaClicks: number }>([
      {
        $match: {
          createdAt: { $gte: since },
          countySlug: { $nin: [null, ""] },
        },
      },
      {
        $group: {
          _id: "$countySlug",
          pageViews: {
            $sum: { $cond: [{ $eq: ["$eventType", "page_view"] }, 1, 0] },
          },
          ctaClicks: {
            $sum: { $cond: [{ $eq: ["$eventType", "cta_click"] }, 1, 0] },
          },
        },
      },
      { $sort: { pageViews: -1 } },
      { $limit: 12 },
    ]),
    LandingPageEvent.aggregate<{ _id: string; pageViews: number; ctaClicks: number }>([
      {
        $match: {
          createdAt: { $gte: since },
          utmCampaign: { $nin: [null, ""] },
        },
      },
      {
        $group: {
          _id: "$utmCampaign",
          pageViews: {
            $sum: { $cond: [{ $eq: ["$eventType", "page_view"] }, 1, 0] },
          },
          ctaClicks: {
            $sum: { $cond: [{ $eq: ["$eventType", "cta_click"] }, 1, 0] },
          },
        },
      },
      { $sort: { pageViews: -1 } },
      { $limit: 10 },
    ]),
    LandingPageEvent.find({ createdAt: { $gte: since } })
      .sort({ createdAt: -1 })
      .limit(40)
      .select("eventType eventName path pageCategory createdAt utmCampaign")
      .lean(),
  ]);

  return {
    rangeDays,
    pageViews,
    ctaClicks,
    uniqueSessions: uniqueSessions.length,
    clickThroughRate: pct(ctaClicks, pageViews),
    byCategory: byCategoryRaw.map((row) => ({
      category: row._id,
      pageViews: row.pageViews,
      ctaClicks: row.ctaClicks,
    })),
    topPages: topPagesRaw.map((row) => ({
      path: row._id,
      pageViews: row.pageViews,
      ctaClicks: row.ctaClicks,
    })),
    topCounties: topCountiesRaw.map((row) => ({
      countySlug: row._id,
      pageViews: row.pageViews,
      ctaClicks: row.ctaClicks,
    })),
    topCampaigns: topCampaignsRaw.map((row) => ({
      utmCampaign: row._id,
      pageViews: row.pageViews,
      ctaClicks: row.ctaClicks,
    })),
    recentEvents: recentEvents.map((event) => ({
      id: String(event._id),
      eventType: event.eventType,
      eventName: event.eventName ?? null,
      path: event.path,
      pageCategory: event.pageCategory,
      createdAt: event.createdAt ?? new Date(),
      utmCampaign: event.utmCampaign ?? null,
    })),
  };
}

export function formatLandingCategory(category: LandingPageCategory): string {
  return LANDING_PAGE_CATEGORY_LABELS[category] ?? category;
}
