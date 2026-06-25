export type InvestorPersona = "flipper" | "wholesaler" | "landlord";

export type OnboardingStepId = "welcome" | "persona" | "progress" | "fast_track_unlock";

export type OnboardingState = {
  velocityClubJoinedAt: string | null;
  investorPersona: InvestorPersona | null;
  steps: {
    welcomeComplete: boolean;
    personaComplete: boolean;
    progressSeen: boolean;
    fastTrackUnlockSeen: boolean;
  };
  accountAgeDays: number;
  activeStep: OnboardingStepId | null;
  fastTrackTrialActive: boolean;
  fastTrackTrialGrantedAt: string | null;
};

function daysSince(iso: string | Date | null | undefined): number {
  if (!iso) return 0;
  const start = new Date(iso).getTime();
  if (!Number.isFinite(start)) return 0;
  return Math.floor((Date.now() - start) / (24 * 60 * 60 * 1000));
}

export function deriveOnboardingState(input: {
  createdAt: Date | string;
  velocityClubJoinedAt?: Date | string | null;
  investorPersona?: InvestorPersona | null;
  loyaltyOnboarding?: {
    welcomeComplete?: boolean;
    personaComplete?: boolean;
    progressSeen?: boolean;
    fastTrackUnlockSeen?: boolean;
  } | null;
  fastTrackTrialActive?: boolean;
  fastTrackTrialGrantedAt?: Date | string | null;
  hasAnyListing: boolean;
  hasLiveListing: boolean;
}): OnboardingState {
  const joinedAt = input.velocityClubJoinedAt ?? input.createdAt;
  const accountAgeDays = daysSince(joinedAt);
  const steps = {
    welcomeComplete: Boolean(input.loyaltyOnboarding?.welcomeComplete),
    personaComplete: Boolean(input.investorPersona || input.loyaltyOnboarding?.personaComplete),
    progressSeen: Boolean(input.loyaltyOnboarding?.progressSeen),
    fastTrackUnlockSeen: Boolean(input.loyaltyOnboarding?.fastTrackUnlockSeen),
  };

  let activeStep: OnboardingStepId | null = null;
  if (!steps.welcomeComplete) {
    activeStep = "welcome";
  } else if (input.fastTrackTrialActive && !steps.fastTrackUnlockSeen) {
    activeStep = "fast_track_unlock";
  } else if (accountAgeDays >= 1 && !steps.personaComplete) {
    activeStep = "persona";
  } else if (accountAgeDays >= 2 && !steps.progressSeen && !input.hasAnyListing) {
    activeStep = "progress";
  }

  return {
    velocityClubJoinedAt: joinedAt ? new Date(joinedAt).toISOString() : null,
    investorPersona: input.investorPersona ?? null,
    steps,
    accountAgeDays,
    activeStep,
    fastTrackTrialActive: Boolean(input.fastTrackTrialActive),
    fastTrackTrialGrantedAt: input.fastTrackTrialGrantedAt
      ? new Date(input.fastTrackTrialGrantedAt).toISOString()
      : null,
  };
}
