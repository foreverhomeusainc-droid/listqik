import { NextResponse } from "next/server";
import { Types } from "mongoose";
import { requireAdminSession } from "@/lib/admin-api-auth";
import { adminResendSetupEmail } from "@/lib/admin-user-setup";

export async function POST(
  _request: Request,
  context: { params: Promise<{ userId: string }> },
) {
  const auth = await requireAdminSession();
  if (auth.error) return auth.error;

  const { userId } = await context.params;
  if (!Types.ObjectId.isValid(userId)) {
    return NextResponse.json({ ok: false, error: "Invalid user id." }, { status: 400 });
  }

  const result = await adminResendSetupEmail(userId);
  if (!result.ok) {
    return NextResponse.json({ ok: false, error: result.error }, { status: result.status });
  }

  return NextResponse.json({ ok: true, emailSent: result.emailSent });
}
