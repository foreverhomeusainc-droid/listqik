"use client";

import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CalcDraftCompletePanel } from "@/components/dashboard/calc-draft-complete-panel";
import { ListingDashboard } from "@/components/dashboard/listing-dashboard";
import { VelocityClubSnapshotCard } from "@/components/dashboard/velocity-club-snapshot";
import type { VelocityClubSnapshot } from "@/lib/loyalty/compute-loyalty-snapshot";

export function DashboardHome() {
  const searchParams = useSearchParams();
  const creditRedeemed = searchParams.get("credit") === "redeemed";
  const calcDraftId = searchParams.get("calcDraft")?.trim() ?? "";
  const fromCalculator = searchParams.get("fromCalculator") === "1";
  const [snapshot, setSnapshot] = useState<VelocityClubSnapshot | null>(null);
  const [snapshotError, setSnapshotError] = useState(false);

  const loadSnapshot = useCallback(async () => {
    try {
      const res = await fetch("/api/dashboard/velocity-club", { cache: "no-store" });
      const data = (await res.json()) as { ok?: boolean; snapshot?: VelocityClubSnapshot };
      if (res.ok && data.ok && data.snapshot) {
        setSnapshot(data.snapshot);
      } else {
        setSnapshotError(true);
      }
    } catch {
      setSnapshotError(true);
    }
  }, []);

  useEffect(() => {
    void loadSnapshot();
  }, [loadSnapshot]);

  return (
    <div className="space-y-8">
      {creditRedeemed ? (
        <p className="rounded-xl border border-lime-400/30 bg-lime-950/20 px-4 py-3 text-sm text-lime-100">
          Listing credit applied — a Subsonic plan is active on your account. Start or continue your
          next listing below.
        </p>
      ) : null}
      {fromCalculator && calcDraftId ? <CalcDraftCompletePanel draftId={calcDraftId} /> : null}
      {snapshot ? (
        <VelocityClubSnapshotCard snapshot={snapshot} compact />
      ) : snapshotError ? null : (
        <p className="text-sm text-white/50">Loading investor snapshot...</p>
      )}
      <ListingDashboard />
    </div>
  );
}
