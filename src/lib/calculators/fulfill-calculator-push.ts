import type { Types } from "mongoose";
import { calculatorBySlug } from "@/lib/calculators/types";
import { redeemOneListingCredit } from "@/lib/loyalty/fulfill-credit-bundle";
import { sumUnusedCredits } from "@/lib/loyalty/compute-loyalty-snapshot";
import {
  hasValidCoreListingAddress,
  normalizeListingAddressPart,
} from "@/lib/listing-address";
import { getEffectivePlanAccessForUser } from "@/lib/plan-access";
import { CalculatorDealDraft } from "@/models/CalculatorDealDraft";
import { Listing } from "@/models/Listing";

export type CalculatorPushInput = {
  calculatorSlug: string;
  listingKind?: "sale" | "rental";
  street?: string;
  unit?: string;
  city?: string;
  state?: string;
  zip?: string;
  price?: number | null;
  propertyType?: string;
  payload?: Record<string, unknown>;
};

function listingPropertyType(raw?: string): "SINGLE_FAMILY" | "CONDOMINIUM" {
  const t = (raw ?? "").toLowerCase();
  if (t.includes("condo")) return "CONDOMINIUM";
  return "SINGLE_FAMILY";
}

function buildIntroDescription(calculatorName: string, payload?: Record<string, unknown>): string {
  const parts = [`Draft listing from ${calculatorName} analysis.`];
  if (payload && Object.keys(payload).length > 0) {
    parts.push(`Deal snapshot: ${JSON.stringify(payload)}`);
  }
  return parts.join(" ").slice(0, 2000);
}

async function ensureActivePlan(userId: Types.ObjectId): Promise<boolean> {
  let plan = await getEffectivePlanAccessForUser(userId);
  if (plan.entitlements.hasActivePlan) return true;

  const unused = await sumUnusedCredits(userId);
  if (unused <= 0) return false;

  const redeem = await redeemOneListingCredit(userId);
  if (!redeem.ok) return false;

  plan = await getEffectivePlanAccessForUser(userId);
  return plan.entitlements.hasActivePlan;
}

export async function createListingFromCalculatorDraft(
  userId: Types.ObjectId,
  draftId: Types.ObjectId,
  addressOverride?: {
    street?: string;
    unit?: string;
    city?: string;
    state?: string;
    zip?: string;
  },
): Promise<
  | { ok: true; listingId: string; redirectUrl: string }
  | { ok: false; error: string; needsAddress?: boolean }
> {
  const draft = await CalculatorDealDraft.findOne({ _id: draftId, userId }).lean();
  if (!draft) {
    return { ok: false, error: "Calculator draft not found." };
  }
  if (draft.consumedAt) {
    return { ok: false, error: "This calculator draft was already used." };
  }

  const hasPlan = await ensureActivePlan(userId);
  if (!hasPlan) {
    return { ok: false, error: "No active listing plan. Complete checkout or redeem a Velocity credit first." };
  }

  const plan = await getEffectivePlanAccessForUser(userId);
  const street = normalizeListingAddressPart(addressOverride?.street ?? draft.street);
  const city = normalizeListingAddressPart(addressOverride?.city ?? draft.city);
  const state = normalizeListingAddressPart(addressOverride?.state ?? draft.state) ?? "Texas";
  const zip = normalizeListingAddressPart(addressOverride?.zip ?? draft.zip);
  const unit = normalizeListingAddressPart(addressOverride?.unit ?? draft.unit);

  if (!hasValidCoreListingAddress({ street, city, state, zip })) {
    return { ok: false, error: "A complete property address is required.", needsAddress: true };
  }

  const calc = calculatorBySlug(draft.calculatorId);
  const calculatorName = calc?.name ?? draft.calculatorId;
  const price =
    typeof draft.price === "number" && draft.price > 0 ? Math.round(draft.price) : 0;
  const listingKind = draft.listingKind === "rental" ? "rental" : "sale";

  const listing = await Listing.create({
    userId,
    street,
    unit,
    city,
    state,
    zip,
    propertyType: listingPropertyType(draft.propertyType),
    listingKind,
    tenantOccupied: listingKind === "rental",
    status: "INCOMPLETE",
    planLabel: plan.planName ?? "Subsonic",
    price,
    description: buildIntroDescription(calculatorName, draft.payload as Record<string, unknown> | undefined),
    orderedOn: new Date(),
  });

  await CalculatorDealDraft.updateOne({ _id: draft._id }, { $set: { consumedAt: new Date() } });

  return {
    ok: true,
    listingId: String(listing._id),
    redirectUrl: `/dashboard/listings/${String(listing._id)}/setup`,
  };
}

export async function fulfillCalculatorPush(
  userId: Types.ObjectId,
  input: CalculatorPushInput,
): Promise<{
  draftId: string;
  redirectUrl: string;
  listingCreated: boolean;
  listingId?: string;
  creditRedeemed?: boolean;
}> {
  const calc = calculatorBySlug(input.calculatorSlug);
  if (!calc) {
    throw new Error("Unknown calculator.");
  }

  const listingKind = input.listingKind === "rental" ? "rental" : "sale";

  const draft = await CalculatorDealDraft.create({
    userId,
    calculatorId: calc.id,
    listingKind,
    street: input.street?.trim() ?? "",
    unit: input.unit?.trim() ?? "",
    city: input.city?.trim() ?? "",
    state: input.state?.trim() || "Texas",
    zip: input.zip?.trim() ?? "",
    price: typeof input.price === "number" && input.price > 0 ? input.price : null,
    propertyType: input.propertyType?.trim() || "SINGLE_FAMILY",
    payload: input.payload ?? {},
  });

  const draftId = String(draft._id);
  const hadPlanBefore = (await getEffectivePlanAccessForUser(userId)).entitlements.hasActivePlan;
  const hadCredits = (await sumUnusedCredits(userId)) > 0;
  const hasPlan = await ensureActivePlan(userId);
  const creditRedeemed = !hadPlanBefore && hasPlan && hadCredits;

  if (!hasPlan) {
    return {
      draftId,
      redirectUrl: `/pricing?calcDraft=${draftId}`,
      listingCreated: false,
    };
  }

  const street = normalizeListingAddressPart(input.street);
  const city = normalizeListingAddressPart(input.city);
  const state = normalizeListingAddressPart(input.state) ?? "Texas";
  const zip = normalizeListingAddressPart(input.zip);

  if (!hasValidCoreListingAddress({ street, city, state, zip })) {
    const query = new URLSearchParams({ calcDraft: draftId, fromCalculator: "1" });
    if (creditRedeemed) query.set("credit", "redeemed");
    return {
      draftId,
      redirectUrl: `/dashboard?${query.toString()}`,
      listingCreated: false,
      creditRedeemed,
    };
  }

  const result = await createListingFromCalculatorDraft(userId, draft._id);
  if (!result.ok) {
    const query = new URLSearchParams({ calcDraft: draftId, fromCalculator: "1" });
    if (creditRedeemed) query.set("credit", "redeemed");
    return {
      draftId,
      redirectUrl: `/dashboard?${query.toString()}`,
      listingCreated: false,
      creditRedeemed,
    };
  }

  return {
    draftId,
    redirectUrl: result.redirectUrl,
    listingCreated: true,
    listingId: result.listingId,
    creditRedeemed,
  };
}
