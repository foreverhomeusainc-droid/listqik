"use client";

import { useEffect, useMemo, useState } from "react";
import { calculateWholesale } from "@/lib/calculators/legacy/wholesale";
import { CalculatorActions } from "@/components/calculators/calculator-actions";
import {
  CalcField,
  CalculatorAddressFields,
  CalculatorShell,
  money,
  pct,
  ResultGrid,
  useCalculatorAddress,
} from "@/components/calculators/calculator-shell";
import { useCalculatorAccess } from "@/components/calculators/use-calculator-access";
import type { CalculatorAccess } from "@/lib/calculators/access";

const SLUG = "wholesale";

export function WholesaleCalculator({ access: accessProp }: { access?: CalculatorAccess | null }) {
  const hook = useCalculatorAccess(SLUG);
  const access = accessProp ?? hook.access;
  const address = useCalculatorAddress();
  const [arv, setArv] = useState(260_000);
  const [repairCosts, setRepairCosts] = useState(35_000);
  const [investorMarginPct, setInvestorMarginPct] = useState(15);
  const [assignmentFee, setAssignmentFee] = useState(12_000);
  const [ran, setRan] = useState(false);

  useEffect(() => {
    if (!hook.loading && !ran && !hook.blocked && !hook.guestLimited && hook.access?.canRun) {
      void hook.recordRun().then((ok) => ok && setRan(true));
    }
  }, [hook.loading, hook.blocked, hook.guestLimited, hook.access?.canRun, hook.recordRun, ran]);

  const result = useMemo(
    () =>
      calculateWholesale({
        arv,
        repairCosts,
        investorMarginPct,
        assignmentFee,
      }),
    [arv, repairCosts, investorMarginPct, assignmentFee],
  );

  if (hook.blocked || hook.guestLimited) {
    return (
      <CalculatorShell kicker="Wholesale" title="Wholesale Deal" description="Daily limit reached.">
        <p className="text-sm text-amber-100">Sign in for unlimited runs.</p>
      </CalculatorShell>
    );
  }

  return (
    <CalculatorShell
      kicker="Wholesale"
      title="Wholesale Deal"
      description="Maximum allowable offer, assignment spread, and end-buyer profit estimate."
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <CalcField label="ARV" value={arv} onChange={setArv} step={5000} />
          <CalcField label="Repair estimate" value={repairCosts} onChange={setRepairCosts} step={1000} />
          <CalcField label="Buyer margin %" value={investorMarginPct} onChange={setInvestorMarginPct} min={5} max={30} />
          <CalcField label="Assignment fee" value={assignmentFee} onChange={setAssignmentFee} step={500} />
        </div>
        <div className="space-y-4">
          <ResultGrid
            rows={[
              { label: "Maximum allowable offer (MAO)", value: money(result.maximumAllowableOffer), accent: true },
              { label: "Wholesale spread", value: money(result.wholesaleSpread) },
              { label: "Buyer all-in estimate", value: money(result.buyerAllInEstimate) },
              { label: "Buyer profit estimate", value: money(result.buyerProfitEstimate) },
              { label: "Buyer ROI", value: pct(result.buyerRoiPct) },
            ]}
          />
        </div>
      </div>
      <CalculatorAddressFields {...address} />
      <CalculatorActions
        calculatorSlug={SLUG}
        access={access}
        listingKind="sale"
        price={arv}
        address={address}
        pdfInputs={{ ARV: money(arv), MAO: money(result.maximumAllowableOffer) }}
        pdfOutputs={{ Spread: money(result.wholesaleSpread), "Buyer ROI": pct(result.buyerRoiPct) }}
      />
    </CalculatorShell>
  );
}
