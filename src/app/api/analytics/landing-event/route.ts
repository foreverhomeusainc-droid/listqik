import { NextResponse } from "next/server";
import { classifyLandingPath, sanitizeLandingAnalyticsPayload } from "@/lib/landing-analytics";
import { connectDb } from "@/lib/mongodb";
import { LandingPageEvent } from "@/models/LandingPageEvent";

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const payload = sanitizeLandingAnalyticsPayload(body);
  if (!payload) {
    return NextResponse.json({ ok: false, error: "Invalid payload" }, { status: 400 });
  }

  const classified = classifyLandingPath(payload.path);

  try {
    await connectDb();
    await LandingPageEvent.create({
      eventType: payload.eventType,
      eventName: payload.eventName ?? null,
      path: payload.path.split("?")[0]?.split("#")[0] ?? payload.path,
      pageCategory: classified.pageCategory,
      locale: payload.locale ?? classified.locale,
      countySlug: classified.countySlug,
      citySlug: classified.citySlug,
      sessionId: payload.sessionId ?? null,
      referrer: payload.referrer ?? null,
      utmSource: payload.utmSource ?? null,
      utmMedium: payload.utmMedium ?? null,
      utmCampaign: payload.utmCampaign ?? null,
      utmContent: payload.utmContent ?? null,
      utmTerm: payload.utmTerm ?? null,
    });
  } catch {
    return NextResponse.json({ ok: false, error: "Failed to record event" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
