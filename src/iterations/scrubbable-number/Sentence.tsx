import * as React from 'react';
import { emi, inr } from '../../lib/loan';

// Props every iteration of ScrubbableNumber accepts. Kept loose on purpose so
// old snapshots keep compiling as the live component's API moves on.
type AnyScrubbableNumber = React.ComponentType<{
  label: string;
  value: number;
  onValueChange: (v: number) => void;
  min: number;
  max: number;
  prefix?: string;
  units: { id: string; label: string; factor: number; step?: number; largeStep?: number; smallStep?: number; format?: Intl.NumberFormatOptions }[];
  presets?: number[];
  presetsOn?: 'scrub' | 'scrub-and-click';
}>;

export const rupees = [
  { id: 'inr', label: '', factor: 1, step: 1_00_000, largeStep: 10_00_000, smallStep: 10_000, format: { maximumFractionDigits: 0 } },
];
export const percent = [
  { id: 'pct', label: '%', factor: 1, step: 0.05, largeStep: 0.5, smallStep: 0.01, format: { minimumFractionDigits: 2, maximumFractionDigits: 2 } },
];
export const tenure = [
  { id: 'years', label: 'years', factor: 12, step: 1, largeStep: 5, format: { maximumFractionDigits: 1 } },
  { id: 'months', label: 'months', factor: 1, step: 1, largeStep: 12, format: { maximumFractionDigits: 0 } },
];
export const amountPresets = [20_00_000, 30_00_000, 50_00_000, 75_00_000, 1_00_00_000, 1_50_00_000];

/** Beat 1 of the essay, rendered with whichever iteration you pass in. */
export function Sentence({ Component }: { Component: AnyScrubbableNumber }) {
  const [amount, setAmount] = React.useState(50_00_000);
  const [rate, setRate] = React.useState(7.5);
  const [months, setMonths] = React.useState(240);
  return (
    <p style={{ fontSize: 24, lineHeight: 1.6, maxWidth: '36em', paddingTop: 48 }}>
      Say you’re borrowing{' '}
      <Component label="Loan amount" prefix="₹" units={rupees} min={5_00_000} max={5_00_00_000}
        value={amount} onValueChange={setAmount} presets={amountPresets} />{' '}
      at{' '}
      <Component label="Interest rate" units={percent} min={5} max={15} value={rate} onValueChange={setRate} />{' '}
      for{' '}
      <Component label="Tenure" units={tenure} min={12} max={360} value={months}
        onValueChange={(m) => setMonths(Math.round(m))} />
      . Your EMI is <strong>{inr(emi(amount, rate, months))}</strong> a month.
    </p>
  );
}
