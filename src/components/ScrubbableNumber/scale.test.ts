import { describe, expect, it } from 'vitest';
import { shortInr, snapAmount } from '../../lib/format';
import { fromPosition, snapTo, toPosition } from './scale';

const MIN = 5_00_000;
const MAX = 5_00_00_000;
const DRAG = 300;

describe('drag track', () => {
  it('round-trips a value through position and back', () => {
    for (const curve of ['linear', 'log'] as const) {
      const t = toPosition(50_00_000, MIN, MAX, curve);
      expect(fromPosition(t, MIN, MAX, curve)).toBeCloseTo(50_00_000, 2);
    }
  });

  it('clamps outside the range', () => {
    expect(toPosition(1, MIN, MAX, 'log')).toBe(0);
    expect(fromPosition(2, MIN, MAX, 'linear')).toBe(MAX);
  });

  it('on a log curve, one pixel is a similar share of the value at both ends', () => {
    const changePerPx = (v: number) => {
      const t = toPosition(v, MIN, MAX, 'log');
      return fromPosition(t + 1 / DRAG, MIN, MAX, 'log') / v - 1;
    };
    expect(changePerPx(10_00_000)).toBeCloseTo(changePerPx(2_00_00_000), 10);
    // About 1.5% per pixel over a 300 px track for a 100× range.
    expect(changePerPx(50_00_000)).toBeCloseTo(0.0155, 3);
  });

  it('a linear curve needs about 1.5 px per 0.05 step for a 5–15% rate', () => {
    const pxPerStep = 0.05 / ((15 - 5) / DRAG);
    expect(pxPerStep).toBeCloseTo(1.5, 5);
  });
});

describe('snapping', () => {
  it('removes float noise', () => {
    expect(snapTo(7.549999, 0.05)).toBe(7.55);
  });

  it('snaps amounts to ₹1 lakh below ₹1 crore and ₹5 lakh above', () => {
    expect(snapAmount(50_40_000)).toBe(50_00_000);
    expect(snapAmount(50_60_000)).toBe(51_00_000);
    expect(snapAmount(1_23_00_000)).toBe(1_25_00_000);
  });
});

describe('short labels', () => {
  it('uses L below a crore and Cr above', () => {
    expect(shortInr(20_00_000)).toBe('20L');
    expect(shortInr(1_00_00_000)).toBe('1Cr');
    expect(shortInr(1_50_00_000)).toBe('1.5Cr');
  });
});
