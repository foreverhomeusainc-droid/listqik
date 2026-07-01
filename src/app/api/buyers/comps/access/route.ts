import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options";
import { resolveCompsAccess } from "@/lib/buyers/comps-access";

export async function GET() {
  const session = await getServerSession(authOptions);
  const access = await resolveCompsAccess({
    userId: session?.user?.id ?? null,
    userEmail: session?.user?.email ?? null,
  });
  return NextResponse.json({ ok: true, access });
}
