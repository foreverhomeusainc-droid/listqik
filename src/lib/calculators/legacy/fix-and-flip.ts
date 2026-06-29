import {
  listQikListingFeeUsd,
  listQikSavingsUsd,
  traditionalListingCommissionUsd,
} from "@/lib/calculators/listqik-fees";

export type FixFlipInputs = {
  purchasePrice: number;
  repairCosts: number;
  holdingCosts: number;
  closingCostsBuy: number;
  sellingCosts: number;
  arv: number;
};

export type FixFlipResults = {
  totalCashIn: number;
  traditionalCommission: number;
  listQikFee: number;
  listQikSavings: number;
  netProceedsTraditional: number;
  netProceedsListQik: number;
  profitTraditional: number;
  profitListQik: number;
  roiTraditionalPct: number;
  roiListQikPct: number;
  marginTraditionalPct: number;
  marginListQikPct: number;
  breakevenSalePrice: number;
};

export function calculateFixAndFlip(inputs: FixFlipInputs): FixFlipResults {
  const purchase = Math.max(0, inputs.purchasePrice);
  const repair = Math.max(0, inputs.repairCosts);
  const holding = Math.max(0, inputs.holdingCosts);
  const buyClose = Math.max(0, inputs.closingCostsBuy);
  const sellClose = Math.max(0, inputs.sellingCosts);
  const arv = Math.max(0, inputs.arv);

  const totalCashIn = purchase + repair + holding + buyClose;
  const traditionalCommission = traditionalListingCommissionUsd(arv);
  const listQikFee = listQikListingFeeUsd(arv);
  const listQikSavings = listQikSavingsUsd(arv);

  const netProceedsTraditional = arv - traditionalCommission - sellClose;
  const netProceedsListQik = arv - listQikFee - sellClose;

  const profitTraditional = netProceedsTraditional - totalCashIn;
  const profitListQik = netProceedsListQik - totalCashIn;

  const roiTraditionalPct = totalCashIn > 0 ? (profitTraditional / totalCashIn) * 100 : 0;
  const roiListQikPct = totalCashIn > 0 ? (profitListQik / totalCashIn) * 100 : 0;
  const marginTraditionalPct = arv > 0 ? (profitTraditional / arv) * 100 : 0;
  const marginListQikPct = arv > 0 ? (profitListQik / arv) * 100 : 0;

  const breakevenSalePrice =
    totalCashIn + sellClose + traditionalCommission > 0
      ? totalCashIn + sellClose + listQikFee
      : 0;

  return {
    totalCashIn,
    traditionalCommission,
    listQikFee,
    listQikSavings,
    netProceedsTraditional,
    netProceedsListQik,
    profitTraditional,
    profitListQik,
    roiTraditionalPct,
    roiListQikPct,
    marginTraditionalPct,
    marginListQikPct,
    breakevenSalePrice,
  };
}
