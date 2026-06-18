"use client";

import { useEffect } from "react";
import { GOOGLE_ADS_PURCHASE_SEND_TO } from "@/lib/google-ads-config";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

type GoogleAdsPurchaseConversionProps = {
  transactionId: string;
  value: number;
  currency?: string;
};

export function GoogleAdsPurchaseConversion({
  transactionId,
  value,
  currency = "USD",
}: GoogleAdsPurchaseConversionProps) {
  useEffect(() => {
    if (!GOOGLE_ADS_PURCHASE_SEND_TO || !transactionId || !Number.isFinite(value) || value <= 0) {
      return;
    }

    const storageKey = `google-ads-purchase:${transactionId}`;
    try {
      if (window.sessionStorage.getItem(storageKey) === "sent") return;
    } catch {
      /* ignore storage access issues */
    }

    let cancelled = false;
    let timeoutId: number | null = null;
    let attempts = 0;

    const fireConversion = () => {
      if (cancelled) return;
      const gtag = window.gtag;
      if (typeof gtag !== "function") {
        if (attempts < 20) {
          attempts += 1;
          timeoutId = window.setTimeout(fireConversion, 500);
        }
        return;
      }

      gtag("event", "conversion", {
        send_to: GOOGLE_ADS_PURCHASE_SEND_TO,
        value,
        currency,
        transaction_id: transactionId,
      });

      try {
        window.sessionStorage.setItem(storageKey, "sent");
      } catch {
        /* ignore storage access issues */
      }
    };

    fireConversion();

    return () => {
      cancelled = true;
      if (timeoutId !== null) window.clearTimeout(timeoutId);
    };
  }, [currency, transactionId, value]);

  return null;
}
