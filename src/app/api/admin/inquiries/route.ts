import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/admin-api-auth";
import { listSiteInquiries, updateSiteInquiryStatus } from "@/lib/inquiries/service";
import type { SiteInquiryKind, SiteInquiryStatus } from "@/lib/inquiries/types";

export async function GET(req: Request) {
  const auth = await requireAdminSession();
  if (auth.error) return auth.error;

  const kind = new URL(req.url).searchParams.get("kind") as SiteInquiryKind | null;
  const inquiries = await listSiteInquiries(
    kind === "listing-request" || kind === "comps-request" ? kind : undefined,
  );
  return NextResponse.json({ ok: true, inquiries });
}

export async function PATCH(req: Request) {
  const auth = await requireAdminSession();
  if (auth.error) return auth.error;

  let body: { id?: string; status?: SiteInquiryStatus };
  try {
    body = (await req.json()) as typeof body;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON." }, { status: 400 });
  }

  if (!body.id?.trim()) {
    return NextResponse.json({ ok: false, error: "Inquiry id required." }, { status: 400 });
  }
  if (body.status !== "new" && body.status !== "contacted" && body.status !== "closed") {
    return NextResponse.json({ ok: false, error: "Invalid status." }, { status: 400 });
  }

  const inquiry = await updateSiteInquiryStatus(body.id, body.status);
  if (!inquiry) {
    return NextResponse.json({ ok: false, error: "Inquiry not found." }, { status: 404 });
  }

  return NextResponse.json({ ok: true, inquiry });
}
