import Script from "next/script";
import {
  GOOGLE_ADS_PURCHASE_SEND_TO,
  type GoogleAdsPurchasePayload,
} from "@/lib/google-ads-config";

type GoogleAdsPurchaseConversionScriptProps = {
  purchase: GoogleAdsPurchasePayload;
};

/** Inline gtag conversion on the Stripe success redirect (visible to Tag Assistant). */
export function GoogleAdsPurchaseConversionScript({
  purchase,
}: GoogleAdsPurchaseConversionScriptProps) {
  if (!GOOGLE_ADS_PURCHASE_SEND_TO || purchase.value <= 0) return null;

  const conversionParams = JSON.stringify({
    send_to: GOOGLE_ADS_PURCHASE_SEND_TO,
    value: purchase.value,
    currency: purchase.currency,
    transaction_id: purchase.transactionId,
  });
  const storageKey = `google-ads-purchase:${purchase.transactionId}`;

  return (
    <Script id={`google-ads-purchase-${purchase.transactionId}`} strategy="afterInteractive">
      {`
        (function () {
          var storageKey = ${JSON.stringify(storageKey)};
          try {
            if (window.sessionStorage.getItem(storageKey) === "sent") return;
          } catch (e) {}
          var attempts = 0;
          function fire() {
            if (typeof window.gtag !== "function") {
              if (attempts < 30) {
                attempts += 1;
                window.setTimeout(fire, 300);
              }
              return;
            }
            window.gtag("event", "conversion", ${conversionParams});
            try {
              window.sessionStorage.setItem(storageKey, "sent");
            } catch (e) {}
          }
          fire();
        })();
      `}
    </Script>
  );
}
