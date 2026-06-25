export function monthlyPrincipalAndInterest(loanAmount: number, annualRatePct: number, termYears: number): number {
  const principal = Math.max(0, loanAmount);
  const months = Math.max(1, Math.round(termYears * 12));
  const monthlyRate = annualRatePct / 100 / 12;
  if (monthlyRate <= 0) return principal / months;
  const factor = Math.pow(1 + monthlyRate, months);
  return (principal * monthlyRate * factor) / (factor - 1);
}

export type AmortizationRow = {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
};

export function buildAmortizationSchedule(
  loanAmount: number,
  annualRatePct: number,
  termYears: number,
  maxRows = 360,
): AmortizationRow[] {
  const payment = monthlyPrincipalAndInterest(loanAmount, annualRatePct, termYears);
  const monthlyRate = annualRatePct / 100 / 12;
  let balance = Math.max(0, loanAmount);
  const rows: AmortizationRow[] = [];
  const limit = Math.min(maxRows, Math.max(1, Math.round(termYears * 12)));

  for (let month = 1; month <= limit && balance > 0.01; month += 1) {
    const interest = balance * monthlyRate;
    const principal = Math.min(balance, payment - interest);
    balance = Math.max(0, balance - principal);
    rows.push({
      month,
      payment,
      principal,
      interest,
      balance,
    });
  }
  return rows;
}
