"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { GoogleAdsPurchaseConversion } from "@/components/analytics/google-ads-purchase-conversion";
import type { GoogleAdsPurchasePayload } from "@/lib/google-ads-config";

/**
 * Fires the Google Ads Purchase conversion when Stripe redirects to
 * /pricing?checkout=success&session_id=cs_...
 */
export function GoogleAdsCheckoutSuccess() {
  const searchParams = useSearchParams();
  const checkout = searchParams.get("checkout");
  const stripeSessionId = searchParams.get("session_id")?.trim() || "";
  const [purchase, setPurchase] = useState<GoogleAdsPurchasePayload | null>(null);

  useEffect(() => {
    if (checkout !== "success" || !stripeSessionId) return;

    let cancelled = false;

    void (async () => {
      const res = await fetch(
        `/api/pricing/checkout/conversion?stripeSessionId=${encodeURIComponent(stripeSessionId)}`,
        { cache: "no-store" },
      ).catch(() => null);

      if (!res?.ok || cancelled) return;

      const data = (await res.json().catch(() => null)) as
        | { ok?: boolean; purchase?: GoogleAdsPurchasePayload }
        | null;

      if (!data?.ok || !data.purchase || cancelled) return;
      setPurchase(data.purchase);
    })();

    return () => {
      cancelled = true;
    };
  }, [checkout, stripeSessionId]);

  if (!purchase) return null;

  return (
    <GoogleAdsPurchaseConversion
      transactionId={purchase.transactionId}
      value={purchase.value}
      currency={purchase.currency}
    />
  );
}
