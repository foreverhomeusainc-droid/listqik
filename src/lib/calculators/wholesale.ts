export type WholesaleInputs = {
  arv: number;
  repairCosts: number;
  investorMarginPct: number;
  assignmentFee: number;
};

export type WholesaleResults = {
  maximumAllowableOffer: number;
  wholesaleSpread: number;
  buyerAllInEstimate: number;
  buyerProfitEstimate: number;
  buyerRoiPct: number;
};

export function calculateWholesale(inputs: WholesaleInputs): WholesaleResults {
  const arv = Math.max(0, inputs.arv);
  const repairs = Math.max(0, inputs.repairCosts);
  const margin = Math.min(100, Math.max(0, inputs.investorMarginPct)) / 100;
  const assignment = Math.max(0, inputs.assignmentFee);

  const investorProfitTarget = arv * margin;
  const maximumAllowableOffer = Math.max(0, arv - repairs - investorProfitTarget - assignment);
  const wholesaleSpread = assignment;
  const buyerAllInEstimate = maximumAllowableOffer + repairs + assignment;
  const buyerProfitEstimate = Math.max(0, arv - buyerAllInEstimate);
  const buyerRoiPct = buyerAllInEstimate > 0 ? (buyerProfitEstimate / buyerAllInEstimate) * 100 : 0;

  return {
    maximumAllowableOffer,
    wholesaleSpread,
    buyerAllInEstimate,
    buyerProfitEstimate,
    buyerRoiPct,
  };
}
