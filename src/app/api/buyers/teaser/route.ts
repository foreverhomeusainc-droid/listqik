import { NextResponse } from "next/server";
import { listTeaserDeals } from "@/lib/buyers/deals-service";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const limit = Math.min(12, Math.max(1, Number(searchParams.get("limit") ?? 6) || 6));
  const deals = await listTeaserDeals(limit);
  return NextResponse.json({ ok: true, deals });
}
