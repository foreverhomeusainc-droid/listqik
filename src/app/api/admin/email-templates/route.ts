import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options";
import { isAdminEmail } from "@/lib/admin";
import { isEmailTemplateKey } from "@/lib/email-notification-templates";
import {
  listResolvedEmailTemplates,
  resetEmailTemplateToDefault,
  saveEmailTemplateOverride,
  validateTemplatePayload,
} from "@/lib/email-template-service";

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { error: NextResponse.json({ ok: false, error: "Unauthorized." }, { status: 401 }) };
  }
  if (!isAdminEmail(session.user.email)) {
    return { error: NextResponse.json({ ok: false, error: "Forbidden." }, { status: 403 }) };
  }
  return { session };
}

export async function GET() {
  const auth = await requireAdmin();
  if ("error" in auth && auth.error) return auth.error;

  const templates = await listResolvedEmailTemplates();
  return NextResponse.json({ ok: true, templates });
}

export async function PUT(req: Request) {
  const auth = await requireAdmin();
  if ("error" in auth && auth.error) return auth.error;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON." }, { status: 400 });
  }

  try {
    const payload = validateTemplatePayload(body);
    const template = await saveEmailTemplateOverride({
      ...payload,
      updatedByEmail: auth.session?.user?.email ?? null,
    });
    return NextResponse.json({ ok: true, template });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Could not save template.";
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}

export async function DELETE(req: Request) {
  const auth = await requireAdmin();
  if ("error" in auth && auth.error) return auth.error;

  let keyParam: string | null = null;
  try {
    const url = new URL(req.url);
    keyParam = url.searchParams.get("key");
  } catch {
    keyParam = null;
  }

  if (!keyParam || !isEmailTemplateKey(keyParam)) {
    return NextResponse.json({ ok: false, error: "Unknown template key." }, { status: 400 });
  }

  const template = await resetEmailTemplateToDefault(keyParam);
  return NextResponse.json({ ok: true, template });
}
