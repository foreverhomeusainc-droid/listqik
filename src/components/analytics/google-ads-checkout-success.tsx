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
      const url = `/api/pricing/checkout/conversion?stripeSessionId=${encodeURIComponent(stripeSessionId)}`;

      for (let attempt = 0; attempt < 8 && !cancelled; attempt += 1) {
        if (attempt > 0) {
          await new Promise((resolve) => window.setTimeout(resolve, 1500));
        }

        const res = await fetch(url, { cache: "no-store" }).catch(() => null);
        if (!res?.ok || cancelled) continue;

        const data = (await res.json().catch(() => null)) as
          | { ok?: boolean; purchase?: GoogleAdsPurchasePayload }
          | null;

        if (!data?.ok || !data.purchase || cancelled) continue;
        setPurchase(data.purchase);
        return;
      }
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
