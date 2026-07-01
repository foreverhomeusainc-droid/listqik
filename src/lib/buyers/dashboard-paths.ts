/** Dashboard routes that skip the seller Listing User Agreement gate. */
export const BUYER_ONLY_DASHBOARD_PREFIXES = [
  "/dashboard/buyers",
  "/dashboard/calculators",
] as const;

export function isBuyerOnlyDashboardPath(pathname: string): boolean {
  return BUYER_ONLY_DASHBOARD_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}
