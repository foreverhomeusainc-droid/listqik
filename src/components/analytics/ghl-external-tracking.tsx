import Script from "next/script";

const GHL_TRACKING_ID = process.env.NEXT_PUBLIC_GHL_TRACKING_ID?.trim();

/** GoHighLevel external site tracking — marketing pages only (see site layouts). */
export function GhlExternalTracking() {
  if (!GHL_TRACKING_ID) return null;

  return (
    <Script
      src="https://link.msgsndr.com/js/external-tracking.js"
      data-tracking-id={GHL_TRACKING_ID}
      strategy="afterInteractive"
    />
  );
}
