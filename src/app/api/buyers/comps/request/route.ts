import { NextResponse } from "next/server";

type Body = {
  name?: string;
  email?: string;
  zip?: string;
  beds?: number;
  baths?: number;
  sqft?: number;
  street?: string;
  consent?: boolean;
  source?: string;
};

export async function POST(req: Request) {
  const webhookUrl = process.env.GHL_LEAD_WEBHOOK_URL?.trim();
  if (!webhookUrl) {
    return NextResponse.json({ ok: false, error: "Lead capture is not configured." }, { status: 500 });
  }

  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON." }, { status: 400 });
  }

  const name = body.name?.trim() ?? "";
  const email = body.email?.trim().toLowerCase() ?? "";
  const zip = body.zip?.trim() ?? "";
  if (name.length < 2) {
    return NextResponse.json({ ok: false, error: "Name is required." }, { status: 400 });
  }
  if (!email.includes("@")) {
    return NextResponse.json({ ok: false, error: "Valid email is required." }, { status: 400 });
  }
  if (body.consent !== true) {
    return NextResponse.json({ ok: false, error: "Consent is required." }, { status: 400 });
  }

  const propertySummary = [
    zip ? `ZIP ${zip}` : null,
    body.beds != null ? `${body.beds} bd` : null,
    body.baths != null ? `${body.baths} ba` : null,
    body.sqft != null ? `${body.sqft} sqft` : null,
    body.street?.trim() ? body.street.trim() : null,
  ]
    .filter(Boolean)
    .join(" · ");

  const message = [
    "MLS comps manual request (premium gate).",
    propertySummary ? `Property: ${propertySummary}` : null,
    "Team: please email custom comps to this lead.",
  ]
    .filter(Boolean)
    .join("\n");

  const ghlResponse = await fetch(webhookUrl, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      name,
      email,
      message,
      consent: true,
      source: body.source?.trim() || "comps-request",
      receivedAt: new Date().toISOString(),
      userAgent: req.headers.get("user-agent") ?? undefined,
    }),
  });

  if (!ghlResponse.ok) {
    const text = await ghlResponse.text().catch(() => "");
    return NextResponse.json(
      { ok: false, error: "Could not submit comps request.", details: text },
      { status: 502 },
    );
  }

  return NextResponse.json({
    ok: true,
    message: "Request received — our team will email your custom comps shortly.",
  });
}
