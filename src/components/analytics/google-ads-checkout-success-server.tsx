import { GoogleAdsPurchaseConversionScript } from "@/components/analytics/google-ads-purchase-conversion-script";
import { resolveGoogleAdsPurchaseFromStripeSession } from "@/lib/google-ads-purchase-resolve";

type GoogleAdsCheckoutSuccessServerProps = {
  checkout?: string;
  stripeSessionId?: string;
};

/**
 * Server-rendered Purchase conversion for Stripe redirect URLs:
 * /pricing?checkout=success&session_id=cs_...
 */
export async function GoogleAdsCheckoutSuccessServer({
  checkout,
  stripeSessionId,
}: GoogleAdsCheckoutSuccessServerProps) {
  if (checkout !== "success" || !stripeSessionId?.startsWith("cs_")) {
    return null;
  }

  const purchase = await resolveGoogleAdsPurchaseFromStripeSession(stripeSessionId).catch(
    () => null,
  );
  if (!purchase) return null;

  return <GoogleAdsPurchaseConversionScript purchase={purchase} />;
}
