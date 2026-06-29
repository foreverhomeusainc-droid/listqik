import { NextResponse } from "next/server";
import { upsertMlsBuyerDeals } from "@/lib/buyers/deals-service";

type Body = {
  deals?: Array<Record<string, unknown>>;
};

export async function POST(req: Request) {
  const secret = process.env.MLS_BUYER_DEALS_WEBHOOK_SECRET?.trim();
  const header = req.headers.get("x-webhook-secret")?.trim();
  if (!secret || header !== secret) {
    return NextResponse.json({ ok: false, error: "Unauthorized." }, { status: 401 });
  }

  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON." }, { status: 400 });
  }

  const deals = Array.isArray(body.deals) ? body.deals : [];
  if (deals.length === 0) {
    return NextResponse.json({ ok: false, error: "No deals provided." }, { status: 400 });
  }

  const result = await upsertMlsBuyerDeals(deals);
  return NextResponse.json({ ok: true, ...result });
}
