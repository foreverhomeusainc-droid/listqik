import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/admin-api-auth";
import { uploadAdminImageToR2 } from "@/lib/admin-image-upload";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const auth = await requireAdminSession();
  if (auth.error) return auth.error;

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Expected multipart/form-data with a `file` field." },
      { status: 400 },
    );
  }

  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ ok: false, error: "Missing `file` field." }, { status: 400 });
  }

  const result = await uploadAdminImageToR2(file, "buyer-deals/hero");
  if (!result.ok) {
    return NextResponse.json({ ok: false, error: result.error }, { status: result.status });
  }

  return NextResponse.json({ ok: true, key: result.key, publicUrl: result.publicUrl });
}
