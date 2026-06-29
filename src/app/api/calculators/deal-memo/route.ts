import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { Types } from "mongoose";
import { authOptions } from "@/lib/auth-options";
import { resolveCalculatorAccess, fingerprintFromRequest } from "@/lib/calculators/access";
import { buildDealMemoPdf } from "@/lib/calculators/deal-memo-pdf";
import { resolveLegacyCalculator } from "@/lib/calculators/types";
import { connectDb } from "@/lib/mongodb";
import { LOYALTY_TIERS } from "@/lib/loyalty/tiers";
import { User } from "@/models/User";

type Body = {
  calculatorSlug?: string;
  inputs?: Record<string, string | number>;
  outputs?: Record<string, string | number>;
};

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ ok: false, error: "Sign in to export deal memos." }, { status: 401 });
  }

  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON." }, { status: 400 });
  }

  const slug = body.calculatorSlug?.trim() ?? "";
  const calc = resolveLegacyCalculator(slug);
  if (!calc) {
    return NextResponse.json({ ok: false, error: "Unknown calculator." }, { status: 400 });
  }

  await connectDb();
  const userId = new Types.ObjectId(session.user.id);
  const user = await User.findById(userId).select("name email").lean();
  const access = await resolveCalculatorAccess({
    calculatorId: calc.id,
    userId,
    userEmail: user?.email ?? session.user.email,
    fingerprintHash: fingerprintFromRequest(req),
  });

  if (!access.canExportPdf) {
    return NextResponse.json(
      {
        ok: false,
        error: "Deal Memo PDF export requires Volume Velocity Syndicate tier or higher.",
        access,
      },
      { status: 403 },
    );
  }

  const tierDisplayName =
    access.tierId != null
      ? (LOYALTY_TIERS.find((t) => t.id === access.tierId)?.name ?? access.tierId)
      : undefined;

  const pdfBytes = await buildDealMemoPdf({
    calculatorName: calc.name,
    calculatorId: calc.id,
    memberName: user?.name ?? session.user.name ?? undefined,
    tierName: tierDisplayName,
    inputs: body.inputs ?? {},
    outputs: body.outputs ?? {},
  });

  return new NextResponse(Buffer.from(pdfBytes), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="listqik-deal-memo-${slug}.pdf"`,
    },
  });
}
