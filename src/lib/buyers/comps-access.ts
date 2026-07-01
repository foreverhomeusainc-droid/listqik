import { Types } from "mongoose";
import { hasAcknowledgedBuyerRep } from "@/lib/buyer-rep";
import { computeVelocityClubSnapshot } from "@/lib/loyalty/compute-loyalty-snapshot";
import type { LoyaltyTierId } from "@/lib/loyalty/tiers";

export type CompsAccess = {
  isAuthenticated: boolean;
  hasBuyerRep: boolean;
  tierId: LoyaltyTierId | null;
  canRunInstant: boolean;
};

export function tierMeetsInstantComps(tierId: LoyaltyTierId | null): boolean {
  return tierId === "syndicate" || tierId === "titan" || tierId === "mogul";
}

export async function resolveCompsAccess(input: {
  userId?: string | null;
  userEmail?: string | null;
}): Promise<CompsAccess> {
  if (!input.userId) {
    return {
      isAuthenticated: false,
      hasBuyerRep: false,
      tierId: null,
      canRunInstant: false,
    };
  }

  const hasRep = await hasAcknowledgedBuyerRep(input.userId);
  const snapshot = await computeVelocityClubSnapshot(new Types.ObjectId(input.userId), {
    userEmail: input.userEmail,
  });
  const premium = tierMeetsInstantComps(snapshot.tierId);

  return {
    isAuthenticated: true,
    hasBuyerRep: hasRep,
    tierId: snapshot.tierId,
    canRunInstant: hasRep && premium,
  };
}
