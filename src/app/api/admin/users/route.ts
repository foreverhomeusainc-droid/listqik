import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/admin-api-auth";
import { adminInviteUser } from "@/lib/admin-user-setup";

export async function POST(request: Request) {
  const auth = await requireAdminSession();
  if (auth.error) return auth.error;

  let body: { email?: string; name?: string; phone?: string; sendEmail?: boolean };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON body." }, { status: 400 });
  }

  const result = await adminInviteUser({
    email: body.email ?? "",
    name: body.name ?? "",
    phone: body.phone,
    sendEmail: body.sendEmail !== false,
  });

  if (!result.ok) {
    return NextResponse.json({ ok: false, error: result.error }, { status: result.status });
  }

  return NextResponse.json({
    ok: true,
    userId: result.userId,
    created: result.created,
    emailSent: result.emailSent,
    emailError: result.emailError,
  });
}
