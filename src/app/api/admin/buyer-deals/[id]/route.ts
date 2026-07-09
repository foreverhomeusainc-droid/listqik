import { NextResponse } from "next/server";
import { Types } from "mongoose";
import { requireAdminSession } from "@/lib/admin-api-auth";
import { deleteBuyerDealAdmin, getBuyerDealAdminById } from "@/lib/buyers/deals-service";

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const auth = await requireAdminSession();
  if (auth.error) return auth.error;

  const { id } = await ctx.params;
  if (!Types.ObjectId.isValid(id)) {
    return NextResponse.json({ ok: false, error: "Invalid deal id." }, { status: 400 });
  }

  const deal = await getBuyerDealAdminById(id);
  if (!deal) {
    return NextResponse.json({ ok: false, error: "Deal not found." }, { status: 404 });
  }

  return NextResponse.json({ ok: true, deal });
}

export async function DELETE(
  _req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const auth = await requireAdminSession();
  if (auth.error) return auth.error;

  const { id } = await ctx.params;
  if (!Types.ObjectId.isValid(id)) {
    return NextResponse.json({ ok: false, error: "Invalid deal id." }, { status: 400 });
  }

  const deleted = await deleteBuyerDealAdmin(id);
  if (!deleted) {
    return NextResponse.json({ ok: false, error: "Deal not found." }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
