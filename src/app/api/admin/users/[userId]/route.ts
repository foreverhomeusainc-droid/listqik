import { NextResponse } from "next/server";
import { Types } from "mongoose";
import { requireAdminSession } from "@/lib/admin-api-auth";
import { connectDb } from "@/lib/mongodb";
import { User } from "@/models/User";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ userId: string }> },
) {
  const auth = await requireAdminSession();
  if (auth.error) return auth.error;

  const { userId } = await context.params;
  if (!Types.ObjectId.isValid(userId)) {
    return NextResponse.json({ ok: false, error: "Invalid user id." }, { status: 400 });
  }

  let body: { name?: string; phone?: string | null };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON body." }, { status: 400 });
  }

  const updates: { name?: string; phone?: string } = {};
  if (typeof body.name === "string") {
    const name = body.name.trim();
    if (!name) {
      return NextResponse.json({ ok: false, error: "Name cannot be empty." }, { status: 400 });
    }
    updates.name = name;
  }
  if (body.phone !== undefined) {
    updates.phone = typeof body.phone === "string" ? body.phone.trim() : "";
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ ok: false, error: "No valid fields to update." }, { status: 400 });
  }

  await connectDb();
  const user = await User.findByIdAndUpdate(userId, { $set: updates }, { new: true }).lean();
  if (!user) {
    return NextResponse.json({ ok: false, error: "User not found." }, { status: 404 });
  }

  return NextResponse.json({
    ok: true,
    user: {
      id: String(user._id),
      name: user.name,
      email: user.email,
      phone: user.phone ?? "",
    },
  });
}
