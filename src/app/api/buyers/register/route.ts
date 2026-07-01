import { NextResponse } from "next/server";
import { adminInviteUser } from "@/lib/admin-user-setup";

export async function POST(req: Request) {
  let body: { email?: string; name?: string; phone?: string };
  try {
    body = (await req.json()) as typeof body;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON." }, { status: 400 });
  }

  const email = body.email?.trim().toLowerCase() ?? "";
  const name = body.name?.trim() ?? "";
  const phone = body.phone?.trim();

  if (!email || !name) {
    return NextResponse.json({ ok: false, error: "Name and email are required." }, { status: 400 });
  }

  const result = await adminInviteUser({
    email,
    name,
    phone,
    sendEmail: true,
  });

  if (!result.ok) {
    return NextResponse.json({ ok: false, error: result.error }, { status: result.status });
  }

  return NextResponse.json({
    ok: true,
    created: result.created,
    emailSent: result.emailSent,
    message: result.emailSent
      ? "Check your email for a setup link to activate your buyer account."
      : "Account created. Contact concierge@listqik.com if you did not receive a setup email.",
  });
}
