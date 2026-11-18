/** Monthly EMI for a reducing-balance loan. `months` is the tenure. */
export function emi(principal: number, annualRatePercent: number, months: number): number {
  const r = annualRatePercent / 1200;
  if (r === 0) return principal / months;
  const growth = (1 + r) ** months;
  return (principal * r * growth) / (growth - 1);
}

export const inr = (n: number) => '₹' + Math.round(n).toLocaleString('en-IN');
