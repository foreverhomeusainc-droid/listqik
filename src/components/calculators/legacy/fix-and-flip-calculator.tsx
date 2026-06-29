"use client";

import { useEffect, useMemo, useState } from "react";
import { calculateFixAndFlip } from "@/lib/calculators/legacy/fix-and-flip";
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

const SLUG = "fix-and-flip";

export function FixAndFlipCalculator({
  access: accessProp,
  memberMode = false,
}: {
  access?: CalculatorAccess | null;
  memberMode?: boolean;
}) {
  const hook = useCalculatorAccess(SLUG);
  const access = accessProp ?? hook.access;
  const address = useCalculatorAddress();
  const [purchasePrice, setPurchasePrice] = useState(180_000);
  const [repairCosts, setRepairCosts] = useState(45_000);
  const [holdingCosts, setHoldingCosts] = useState(8_500);
  const [closingCostsBuy, setClosingCostsBuy] = useState(4_200);
  const [sellingCosts, setSellingCosts] = useState(3_500);
  const [arv, setArv] = useState(295_000);
  const [ran, setRan] = useState(false);

  useEffect(() => {
    if (!hook.loading && !ran) {
      void hook.recordRun().then((ok) => {
        if (ok) setRan(true);
      });
    }
  }, [hook.loading, hook, ran]);

  const result = useMemo(
    () =>
      calculateFixAndFlip({
        purchasePrice,
        repairCosts,
        holdingCosts,
        closingCostsBuy,
        sellingCosts,
        arv,
      }),
    [purchasePrice, repairCosts, holdingCosts, closingCostsBuy, sellingCosts, arv],
  );

  const pdfInputs = {
    "Purchase price": money(purchasePrice),
    "Repair costs": money(repairCosts),
    "Holding costs": money(holdingCosts),
    ARV: money(arv),
  };
  const pdfOutputs = {
    "Profit (ListQik)": money(result.profitListQik),
    "ROI (ListQik)": pct(result.roiListQikPct),
    "ListQik savings": money(result.listQikSavings),
  };

  if (hook.blocked && !memberMode) {
    return (
      <CalculatorShell
        kicker="Deal Analyzer"
        title="Fix & Flip Profit"
        description="Daily sandbox limit reached."
      >
        <p className="text-sm text-amber-100">Create a free account for unlimited runs.</p>
      </CalculatorShell>
    );
  }

  return (
    <CalculatorShell
      kicker="Deal Analyzer"
      title="Fix & Flip Profit"
      description="Model rehab, holding, and disposition costs — then compare traditional 3% listing commission vs ListQik Subsonic."
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <CalcField label="Purchase price" value={purchasePrice} onChange={setPurchasePrice} min={0} step={5000} />
          <CalcField label="Repair costs" value={repairCosts} onChange={setRepairCosts} min={0} step={1000} />
          <CalcField label="Holding costs" value={holdingCosts} onChange={setHoldingCosts} min={0} step={500} />
          <CalcField label="Buy-side closing" value={closingCostsBuy} onChange={setClosingCostsBuy} min={0} step={250} />
          <CalcField label="Sell-side closing" value={sellingCosts} onChange={setSellingCosts} min={0} step={250} />
          <CalcField label="ARV (after repair value)" value={arv} onChange={setArv} min={0} step={5000} />
        </div>
        <div className="space-y-4">
          <ResultGrid
            rows={[
              { label: "Projected profit (ListQik)", value: money(result.profitListQik), accent: true },
              { label: "ROI (ListQik)", value: pct(result.roiListQikPct) },
              { label: "Margin (ListQik)", value: pct(result.marginListQikPct) },
              { label: "Total cash in deal", value: money(result.totalCashIn) },
              { label: "Breakeven sale price", value: money(result.breakevenSalePrice) },
              { label: "Profit (traditional 3%)", value: money(result.profitTraditional) },
            ]}
          />
          <div className="rounded-xl border border-lime-400/25 bg-lime-950/15 p-4 text-sm">
            <p className="font-semibold text-lime-100">ListQik margin protection</p>
            <p className="mt-2 text-white/75">
              Traditional agent: {money(result.traditionalCommission)} vs ListQik: {money(result.listQikFee)}
            </p>
            <p className="mt-1 text-lime-200">You defend {money(result.listQikSavings)} on this disposition.</p>
          </div>
        </div>
      </div>
      <CalculatorAddressFields {...address} />
      <CalculatorActions
        calculatorSlug={SLUG}
        access={access}
        listingKind="sale"
        price={arv}
        address={address}
        pushPayload={{ purchasePrice, repairCosts, arv, profitListQik: result.profitListQik }}
        pdfInputs={pdfInputs}
        pdfOutputs={pdfOutputs}
      />
    </CalculatorShell>
  );
}
