import type { Types } from "mongoose";
import { computeVelocityClubSnapshot } from "@/lib/loyalty/compute-loyalty-snapshot";
import { tierForEffectiveCount } from "@/lib/loyalty/tiers";

export async function shouldApplyFastTrackPriority(input: {
  userId: Types.ObjectId;
  fastTrackTrialActive: boolean;
}): Promise<boolean> {
  if (input.fastTrackTrialActive) return true;
  const snapshot = await computeVelocityClubSnapshot(input.userId, {
    fastTrackTrialActive: input.fastTrackTrialActive,
  });
  return snapshot.fastTrackEligible;
}

export async function resolveListingPriorityLevel(input: {
  userId: Types.ObjectId;
  fastTrackTrialActive: boolean;
}): Promise<0 | 1> {
  const eligible = await shouldApplyFastTrackPriority(input);
  return eligible ? 1 : 0;
}

export function tierMeetsFastTrack(effectiveCount: number): boolean {
  return tierForEffectiveCount(effectiveCount).fastTrackQueue;
}
