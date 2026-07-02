import { NextResponse } from "next/server";
import type { BuyerRepresentationIntake } from "@/lib/buyers/representation-intake";
import { createListingInquiry } from "@/lib/inquiries/service";
import type { ListingContext } from "@/lib/inquiries/types";

type Body = {
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
  consent?: boolean;
  source?: string;
  listing?: ListingContext;
  buyerRepresentation?: BuyerRepresentationIntake;
  utm?: Record<string, string | undefined>;
  company?: string;
};

function validBuyerRep(rep: BuyerRepresentationIntake | undefined): rep is BuyerRepresentationIntake {
  if (!rep) return false;
  return (
    rep.fullName.trim().length >= 2 &&
    rep.phone.trim().length >= 7 &&
    rep.email.includes("@") &&
    rep.city.trim().length > 0 &&
    /^\d{5}(-\d{4})?$/.test(rep.zip.trim()) &&
    rep.mailingAddress.trim().length >= 5 &&
    (rep.propertyType === "buy" || rep.propertyType === "lease") &&
    rep.representationStart.trim().length > 0 &&
    rep.representationDuration.trim().length > 0
  );
}

export async function POST(req: Request) {
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON." }, { status: 400 });
  }

  if (body.company) {
    return NextResponse.json({ ok: true });
  }

  if (!validBuyerRep(body.buyerRepresentation)) {
    return NextResponse.json(
      { ok: false, error: "Complete Buyer Representation details are required." },
      { status: 400 },
    );
  }

  const rep = body.buyerRepresentation;
  if (body.consent !== true) {
    return NextResponse.json({ ok: false, error: "Consent is required." }, { status: 400 });
  }

  const inquiry = await createListingInquiry({
    name: rep.fullName,
    email: rep.email,
    phone: rep.phone,
    message: body.message,
    consent: true,
    source: body.source,
    listing: body.listing,
    buyerRepresentation: rep,
    utm: body.utm,
    userAgent: req.headers.get("user-agent") ?? undefined,
  });

  return NextResponse.json({ ok: true, inquiryId: inquiry.id });
}
