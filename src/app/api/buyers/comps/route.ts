import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { Types } from "mongoose";
import { authOptions } from "@/lib/auth-options";
import { resolveCompsAccess } from "@/lib/buyers/comps-access";
import { runComps } from "@/lib/buyers/comps";
import { compsPoolForZip } from "@/lib/buyers/deals-service";

type Body = {
  beds?: number;
  baths?: number;
  sqft?: number;
  zip?: string;
  dealId?: string;
};

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const access = await resolveCompsAccess({
    userId: session?.user?.id ?? null,
    userEmail: session?.user?.email ?? null,
  });

  if (!access.canRunInstant) {
    return NextResponse.json(
      {
        ok: false,
        error: "Premium feature. Sign in with a Syndicate+ Velocity Club account, or request free manual comps.",
        code: "comps_premium_required",
        access,
        loginUrl: `/login?callbackUrl=${encodeURIComponent("/buyers")}`,
      },
      { status: 403 },
    );
  }

  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON." }, { status: 400 });
  }

  const beds = typeof body.beds === "number" ? body.beds : 3;
  const baths = typeof body.baths === "number" ? body.baths : 2;
  const sqft = typeof body.sqft === "number" ? body.sqft : 1500;
  const zip = body.zip?.trim() ?? "";
  if (!/^\d{5}$/.test(zip)) {
    return NextResponse.json({ ok: false, error: "A valid 5-digit ZIP is required." }, { status: 400 });
  }

  const excludeId =
    body.dealId && Types.ObjectId.isValid(body.dealId) ? new Types.ObjectId(body.dealId) : undefined;
  const pool = await compsPoolForZip(zip, excludeId?.toString());

  const comparables = pool.map((row) => ({
    id: String(row._id),
    label: `${row.street || row.city} · ${row.zip}`,
    price: (row.soldPrice ?? row.listPrice) as number,
    sqft: row.sqft as number,
    beds: (row.beds ?? 3) as number,
    baths: (row.baths ?? 2) as number,
    soldDate: row.soldDate ? new Date(row.soldDate).toISOString().slice(0, 10) : null,
    distanceMiles: null,
  }));

  const result = runComps({ beds, baths, sqft, zip }, comparables);

  return NextResponse.json({
    ok: true,
    subject: { beds, baths, sqft, zip },
    result,
    comparables,
  });
}
