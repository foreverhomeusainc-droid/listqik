import {
  sendVelocityClubDay2Email,
  sendVelocityClubDay3Email,
} from "@/lib/transactional-email";

export async function dispatchVelocityClubOnboardingEmail(input: {
  kind: "day2" | "day3";
  to: string;
  fullName?: string;
  dashboardUrl: string;
}): Promise<{ sent: boolean; error?: string }> {
  if (input.kind === "day2") {
    return sendVelocityClubDay2Email({
      to: input.to,
      fullName: input.fullName,
      dashboardUrl: input.dashboardUrl,
    });
  }
  return sendVelocityClubDay3Email({
    to: input.to,
    fullName: input.fullName,
    dashboardUrl: input.dashboardUrl,
  });
}
