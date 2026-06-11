import type { LandingPageCategory, LandingPageEventType } from "@/models/LandingPageEvent";

export type LandingAnalyticsPayload = {
  eventType: LandingPageEventType;
  eventName?: string;
  path: string;
  locale?: "en" | "es";
  sessionId?: string;
  referrer?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmTerm?: string;
};

const TRACKABLE_PATH_PREFIXES = [
  "/service-area",
  "/es/service-area",
  "/start-now",
  "/es/start-now",
  "/pricing",
  "/es/pricing",
  "/full-service",
  "/es/full-service",
  "/",
  "/es",
] as const;

const MAX_FIELD_LEN = 256;
const MAX_EVENT_NAME_LEN = 64;

export function isTrackableMarketingPath(path: string): boolean {
  const normalized = path.split("?")[0]?.split("#")[0] ?? path;
  if (normalized === "/" || normalized === "/es") return true;
  return TRACKABLE_PATH_PREFIXES.some(
    (prefix) => prefix !== "/" && prefix !== "/es" && normalized.startsWith(prefix),
  );
}

export function classifyLandingPath(path: string): {
  pageCategory: LandingPageCategory;
  countySlug: string | null;
  citySlug: string | null;
  locale: "en" | "es";
} {
  const normalized = path.split("?")[0]?.split("#")[0] ?? path;
  const es = normalized.startsWith("/es/");
  const base = es ? normalized.slice(3) : normalized;
  const locale: "en" | "es" = es ? "es" : "en";

  if (base === "/" || normalized === "/es") {
    return { pageCategory: "home", countySlug: null, citySlug: null, locale };
  }
  if (base === "/start-now") {
    return { pageCategory: "start_now", countySlug: null, citySlug: null, locale };
  }
  if (base === "/pricing") {
    return { pageCategory: "pricing", countySlug: null, citySlug: null, locale };
  }
  if (base === "/full-service") {
    return { pageCategory: "full_service", countySlug: null, citySlug: null, locale };
  }
  if (base === "/service-area") {
    return { pageCategory: "service_area_hub", countySlug: null, citySlug: null, locale };
  }
  if (base === "/service-area/texas") {
    return { pageCategory: "texas_index", countySlug: null, citySlug: null, locale };
  }
  if (base === "/service-area/texas/dfw") {
    return { pageCategory: "dfw_satellite", countySlug: null, citySlug: null, locale };
  }

  const countyMatch = base.match(/^\/service-area\/texas\/([^/]+)$/);
  if (countyMatch?.[1]) {
    return {
      pageCategory: "county_lander",
      countySlug: countyMatch[1],
      citySlug: null,
      locale,
    };
  }

  const cityMatch = base.match(/^\/service-area\/texas\/([^/]+)\/([^/]+)$/);
  if (cityMatch?.[1] && cityMatch[2]) {
    return {
      pageCategory: "city_lander",
      countySlug: cityMatch[1],
      citySlug: cityMatch[2],
      locale,
    };
  }

  return { pageCategory: "other_marketing", countySlug: null, citySlug: null, locale };
}

function trimField(value: string | undefined, max = MAX_FIELD_LEN): string | undefined {
  if (!value) return undefined;
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  return trimmed.slice(0, max);
}

export function sanitizeLandingAnalyticsPayload(body: unknown): LandingAnalyticsPayload | null {
  if (!body || typeof body !== "object" || Array.isArray(body)) return null;
  const record = body as Record<string, unknown>;

  const eventType = record.eventType;
  if (eventType !== "page_view" && eventType !== "cta_click") return null;

  const path = trimField(typeof record.path === "string" ? record.path : undefined);
  if (!path || !path.startsWith("/") || !isTrackableMarketingPath(path)) return null;

  const eventName = trimField(
    typeof record.eventName === "string" ? record.eventName : undefined,
    MAX_EVENT_NAME_LEN,
  );

  const locale = record.locale === "es" ? "es" : record.locale === "en" ? "en" : undefined;

  return {
    eventType,
    eventName,
    path,
    locale,
    sessionId: trimField(typeof record.sessionId === "string" ? record.sessionId : undefined, 64),
    referrer: trimField(typeof record.referrer === "string" ? record.referrer : undefined, 512),
    utmSource: trimField(typeof record.utmSource === "string" ? record.utmSource : undefined),
    utmMedium: trimField(typeof record.utmMedium === "string" ? record.utmMedium : undefined),
    utmCampaign: trimField(typeof record.utmCampaign === "string" ? record.utmCampaign : undefined),
    utmContent: trimField(typeof record.utmContent === "string" ? record.utmContent : undefined),
    utmTerm: trimField(typeof record.utmTerm === "string" ? record.utmTerm : undefined),
  };
}

const SESSION_STORAGE_KEY = "landing-analytics-session";

export function getLandingAnalyticsSessionId(): string {
  if (typeof window === "undefined") return "";
  try {
    const existing = window.sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (existing) return existing;
    const id =
      typeof window.crypto?.randomUUID === "function"
        ? window.crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
    window.sessionStorage.setItem(SESSION_STORAGE_KEY, id);
    return id;
  } catch {
    return "";
  }
}

function readUtmParams(): Pick<
  LandingAnalyticsPayload,
  "utmSource" | "utmMedium" | "utmCampaign" | "utmContent" | "utmTerm"
> {
  if (typeof window === "undefined") return {};
  const params = new URLSearchParams(window.location.search);
  return {
    utmSource: params.get("utm_source") ?? undefined,
    utmMedium: params.get("utm_medium") ?? undefined,
    utmCampaign: params.get("utm_campaign") ?? undefined,
    utmContent: params.get("utm_content") ?? undefined,
    utmTerm: params.get("utm_term") ?? undefined,
  };
}

/** Client-side: record a page view or CTA click (fire-and-forget). */
export function trackLandingEvent(
  input: Omit<LandingAnalyticsPayload, "sessionId"> & { sessionId?: string },
): void {
  if (typeof window === "undefined") return;
  if (!isTrackableMarketingPath(input.path)) return;

  const payload: LandingAnalyticsPayload = {
    ...readUtmParams(),
    ...input,
    sessionId: input.sessionId ?? getLandingAnalyticsSessionId(),
    referrer: input.referrer ?? document.referrer ?? undefined,
    locale:
      input.locale ??
      (input.path.startsWith("/es/") || input.path === "/es" ? "es" : "en"),
  };

  void fetch("/api/analytics/landing-event", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
    keepalive: true,
  }).catch(() => {
    /* non-blocking */
  });
}

export const LANDING_PAGE_CATEGORY_LABELS: Record<LandingPageCategory, string> = {
  county_lander: "County landers",
  city_lander: "City pages",
  dfw_satellite: "DFW satellite regional",
  texas_index: "Texas index",
  service_area_hub: "Service area hub",
  start_now: "Start now",
  pricing: "Pricing",
  full_service: "Full service",
  home: "Homepage",
  other_marketing: "Other marketing",
};
