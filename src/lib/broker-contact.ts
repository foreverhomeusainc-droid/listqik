/** Licensed brokerage contact — used on paid landers, footer, and TREC disclosures. */
export const BROKER_CONTACT = {
  brandName: "Resolution Realty Group",
  sponsoringBroker: "Central Metro Realty",
  sponsoringBrokerLicense: "588680",
  streetAddress: "508 N 2nd St",
  city: "Honey Grove",
  state: "TX",
  postalCode: "75446",
  phone: "737-249-9010",
  phoneTel: "+17372499010",
  email: "broker@centralmetro.com",
} as const;

export function brokerFullAddressLine(): string {
  const { streetAddress, city, state, postalCode } = BROKER_CONTACT;
  return `${streetAddress}, ${city}, ${state} ${postalCode}`;
}

export function brokerMapsQuery(): string {
  return encodeURIComponent(brokerFullAddressLine());
}
