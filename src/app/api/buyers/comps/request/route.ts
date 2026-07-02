import { NextResponse } from "next/server";
import { createCompsInquiry } from "@/lib/inquiries/service";

type Body = {
  name?: string;
  email?: string;
  phone?: string;
  zip?: string;
  beds?: number;
  baths?: number;
  sqft?: number;
  consent?: boolean;
  source?: string;
};

export async function POST(req: Request) {
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

  await createCompsInquiry({
    name,
    email,
    phone: body.phone?.trim(),
    consent: true,
    source: body.source?.trim() || "comps-request",
    zip,
    beds: body.beds,
    baths: body.baths,
    sqft: body.sqft,
    userAgent: req.headers.get("user-agent") ?? undefined,
  });

  return NextResponse.json({
    ok: true,
    message: "Request received — our team will email your custom comps shortly.",
  });
}
