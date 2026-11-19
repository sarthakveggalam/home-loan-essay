import { snapTo } from '../components/ScrubbableNumber/scale';

/** Short Indian amount for tight spaces: 20L, 1Cr, 1.5Cr. */
export function shortInr(rupees: number): string {
  if (rupees >= 1_00_00_000) return `${+(rupees / 1_00_00_000).toFixed(2)}Cr`;
  return `${+(rupees / 1_00_000).toFixed(1)}L`;
}

/** Round amounts while dragging: ₹1 lakh below ₹1 crore, ₹5 lakh above. */
export function snapAmount(rupees: number): number {
  return snapTo(rupees, rupees >= 1_00_00_000 ? 5_00_000 : 1_00_000);
}
