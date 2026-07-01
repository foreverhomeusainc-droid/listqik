export type BuyerRepresentationIntake = {
  fullName: string;
  phone: string;
  email: string;
  city: string;
  zip: string;
  mailingAddress: string;
  propertyType: "buy" | "lease";
  representationStart: string;
  representationDuration: string;
};

export const REPRESENTATION_DURATION_OPTIONS = [
  { value: "30-days", label: "30 days" },
  { value: "90-days", label: "90 days" },
  { value: "6-months", label: "6 months" },
  { value: "12-months", label: "12 months" },
  { value: "custom", label: "Other (specify in notes)" },
] as const;

export function formatBuyerRepresentationForCrm(
  intake: BuyerRepresentationIntake,
  listingLabel?: string,
): string {
  const propertyType = intake.propertyType === "buy" ? "Buy" : "Lease";
  const duration =
    REPRESENTATION_DURATION_OPTIONS.find((o) => o.value === intake.representationDuration)?.label ??
    intake.representationDuration;

  return [
    "— Buyer Representation intake —",
    listingLabel ? `Listing: ${listingLabel}` : null,
    `Name: ${intake.fullName}`,
    `Phone: ${intake.phone}`,
    `Email: ${intake.email}`,
    `Target market: ${intake.city}, ${intake.zip}`,
    `Mailing address: ${intake.mailingAddress}`,
    `Property type: ${propertyType}`,
    `Representation begins: ${intake.representationStart}`,
    `Representation term: ${duration}`,
  ]
    .filter(Boolean)
    .join("\n");
}
