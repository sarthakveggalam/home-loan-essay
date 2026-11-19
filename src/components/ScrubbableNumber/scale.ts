/**
 * Maps a value to a position on an invisible drag track (0 = min, 1 = max), and back.
 *
 * The drag doesn't move the value by a fixed step per pixel. Instead, dragging
 * `dragLength` pixels covers the whole range. On a 'log' curve each pixel changes
 * the value by about the same percentage, so ₹5 lakh and ₹5 crore both feel controllable.
 */
export type Curve = 'linear' | 'log';

const clamp01 = (t: number) => Math.min(1, Math.max(0, t));

export function toPosition(value: number, min: number, max: number, curve: Curve): number {
  if (curve === 'log') {
    return clamp01((Math.log(value) - Math.log(min)) / (Math.log(max) - Math.log(min)));
  }
  return clamp01((value - min) / (max - min));
}

export function fromPosition(t: number, min: number, max: number, curve: Curve): number {
  const p = clamp01(t);
  if (curve === 'log') return Math.exp(Math.log(min) + p * (Math.log(max) - Math.log(min)));
  return min + p * (max - min);
}

/** Round to the nearest multiple of `step`, without float noise (7.550000000000001 → 7.55). */
export function snapTo(value: number, step: number): number {
  return Number((Math.round(value / step) * step).toFixed(10));
}
