const DEMO_KEY_ENV = "BUYERS_DEMO_ACCESS_KEY";

export function isValidBuyersDemoKey(key: string | null | undefined): boolean {
  const expected = process.env[DEMO_KEY_ENV]?.trim();
  if (!expected) return false;
  if (!key?.trim()) return false;
  return key.trim() === expected;
}

export function buyersDemoPath(key: string): string {
  return `/demo/buyer-dashboard?key=${encodeURIComponent(key)}`;
}
