// FROZEN iteration snapshot. Don't edit; change src/components/ScrubbableNumber instead.
import { NumberField } from '@base-ui/react/number-field';
import { Select } from '@base-ui/react/select';
import * as React from 'react';
import './ScrubbableNumber.css';

/**
 * A unit the reader can show the value in. `factor` converts one of this unit
 * into the base unit the parent stores. Tenure is stored in months, so
 * years = { factor: 12 } and months = { factor: 1 }.
 */
export interface Unit {
  id: string;
  /** Shown after the digits, e.g. "years". Empty string for none. */
  label: string;
  factor: number;
  step?: number;
  largeStep?: number;
  smallStep?: number;
  format?: Intl.NumberFormatOptions;
}

export interface ScrubbableNumberProps {
  /** Accessible name, e.g. "Loan amount". The unit is appended for screen readers. */
  label: string;
  /** Value in the base unit. */
  value: number;
  onValueChange: (value: number) => void;
  /** Bounds in the base unit. */
  min: number;
  max: number;
  /** Shown before the digits, e.g. "₹". Part of the token (R2). */
  prefix?: string;
  /** One or more units. More than one shows a unit menu while editing (R6). */
  units: Unit[];
  /** Formatting locale. en-IN gives 50,00,000 (R5). */
  locale?: string;
  /** Common values, in the base unit, shown above the token (R9). */
  presets?: number[];
  /** When the presets open. 'scrub': on drag, staying open after release. 'scrub-and-click' also opens on a single click (T1). */
  presetsOn?: 'scrub' | 'scrub-and-click';
  /** Two presses within this many ms count as a double-click (R8). */
  doubleClickMs?: number;
}

/**
 * P3 from the anatomy board: drag anywhere on the token to scrub,
 * double-click (or double-tap) to type. Tab focuses it; arrow keys step;
 * typing a digit or pressing Enter starts editing.
 */
export function ScrubbableNumber({
  label,
  value,
  onValueChange,
  min,
  max,
  prefix,
  units,
  locale = 'en-IN',
  presets,
  presetsOn = 'scrub',
  doubleClickMs = 300,
}: ScrubbableNumberProps) {
  const [unitId, setUnitId] = React.useState(units[0].id);
  const unit = units.find((u) => u.id === unitId) ?? units[0];
  const [editing, setEditing] = React.useState(false);
  const [presetsOpen, setPresetsOpen] = React.useState(false);

  const rootRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const valueAtEditStart = React.useRef(value);
  // Double-click detection lives on pointerdown. Base UI locks the pointer on
  // mouse down, so native click / dblclick events can't be relied on here.
  const lastPress = React.useRef({ time: 0, x: 0, y: 0 });
  const movedSincePress = React.useRef(false);
  const clickTimer = React.useRef<number | undefined>(undefined);

  const display = value / unit.factor;
  const formatter = React.useMemo(
    () => new Intl.NumberFormat(locale, unit.format),
    [locale, unit.format],
  );

  function startEditing() {
    window.clearTimeout(clickTimer.current);
    setPresetsOpen(false);
    valueAtEditStart.current = value;
    setEditing(true);
    // Wait for the input to become visible, then select its text so typing replaces it.
    requestAnimationFrame(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    });
  }

  function stopEditing(revert = false) {
    if (revert) onValueChange(valueAtEditStart.current);
    setEditing(false);
  }

  function handlePointerDown(event: React.PointerEvent) {
    if (editing || event.button !== 0) return;
    const now = event.timeStamp;
    const last = lastPress.current;
    const isSecondPress =
      now - last.time < doubleClickMs &&
      !movedSincePress.current &&
      Math.hypot(event.clientX - last.x, event.clientY - last.y) < 6;

    if (isSecondPress) {
      // Stop Base UI from starting a scrub (and grabbing the pointer) on this press.
      event.preventDefault();
      lastPress.current = { time: 0, x: 0, y: 0 };
      startEditing();
      return;
    }

    lastPress.current = { time: now, x: event.clientX, y: event.clientY };
    movedSincePress.current = false;

    if (presets && presetsOn === 'scrub-and-click') {
      // A single click opens presets, but only once we know it wasn't the first
      // half of a double-click. This wait is the cost T1 is testing.
      window.clearTimeout(clickTimer.current);
      clickTimer.current = window.setTimeout(() => {
        if (!movedSincePress.current) setPresetsOpen(true);
      }, doubleClickMs);
    }
  }

  // Close the click-opened presets on outside press or Escape.
  React.useEffect(() => {
    if (!presetsOpen) return;
    function onDown(e: PointerEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setPresetsOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setPresetsOpen(false);
    }
    document.addEventListener('pointerdown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [presetsOpen]);

  React.useEffect(() => () => window.clearTimeout(clickTimer.current), []);

  function handleInputKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (!editing) {
      // Focused but not editing (Tab, or a single click). Arrow keys still step
      // through Base UI. A digit or Enter starts editing, like a spreadsheet cell.
      if (event.key === 'Enter') {
        event.preventDefault();
        startEditing();
      } else if (/^[0-9]$/.test(event.key)) {
        valueAtEditStart.current = value;
        setEditing(true);
        event.currentTarget.select(); // the typed digit replaces the old value
      }
      return;
    }
    if (event.key === 'Enter') stopEditing();
    if (event.key === 'Escape') stopEditing(true);
  }

  function handleInputBlur(event: React.FocusEvent<HTMLInputElement>) {
    const next = event.relatedTarget as HTMLElement | null;
    // Moving focus to the unit menu keeps us in edit mode.
    if (next && (rootRef.current?.contains(next) || next.closest('[data-sn02-unit-popup]'))) {
      return;
    }
    if (editing) stopEditing();
  }

  const nearestPreset = presets?.reduce((a, b) =>
    Math.abs(b - value) < Math.abs(a - value) ? b : a,
  );
  const spokenName = unit.label ? `${label}, in ${unit.label}` : label;

  return (
    <NumberField.Root
      ref={rootRef}
      className="sn02-root"
      data-editing={editing || undefined}
      value={display}
      onValueChange={(next, details) => {
        if (next === null) return; // empty input mid-typing
        if (details.reason === 'scrub') {
          movedSincePress.current = true;
          // Dragging opens the presets; they stay open after release so you can pick one.
          if (presets) setPresetsOpen(true);
        }
        onValueChange(next * unit.factor);
      }}
      min={min / unit.factor}
      max={max / unit.factor}
      step={unit.step ?? 1}
      smallStep={unit.smallStep}
      largeStep={unit.largeStep}
      snapOnStep
      format={unit.format}
      locale={locale}
    >
      <NumberField.ScrubArea
        className="sn02-scrub"
        pixelSensitivity={4}
        onPointerDown={handlePointerDown}
      >
        <span className="sn02-display" aria-hidden="true">
          {prefix && <span className="sn02-prefix">{prefix}</span>}
          <span className="sn02-digits">{formatter.format(display)}</span>
          {unit.label && <span className="sn02-unit"> {unit.label}</span>}
        </span>
        {/* Drawn in place of the locked pointer while dragging (not in Safari, which keeps the native cursor). */}
        <NumberField.ScrubAreaCursor className="sn02-cursor">
          <svg width="26" height="14" viewBox="0 0 26 14" aria-hidden="true">
            <path d="M1 7h24M1 7l5-5M1 7l5 5M25 7l-5-5M25 7l-5 5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </NumberField.ScrubAreaCursor>
      </NumberField.ScrubArea>

      <span className="sn02-editor">
        {prefix && <span className="sn02-prefix">{prefix}</span>}
        <NumberField.Input
          ref={inputRef}
          className="sn02-input"
          aria-label={spokenName}
          onKeyDown={handleInputKeyDown}
          onBlur={handleInputBlur}
        />
        {units.length > 1 ? (
          <UnitSelect
            units={units}
            value={unitId}
            onChange={(id) => {
              setUnitId(id);
              requestAnimationFrame(() => inputRef.current?.focus());
            }}
          />
        ) : (
          unit.label && <span className="sn02-unit"> {unit.label}</span>
        )}
      </span>
      {presets && (
        <div
          className="sn02-presets"
          data-open={presetsOpen || undefined}
          aria-hidden={!presetsOpen}
        >
          {presets.map((p) => (
            <button
              key={p}
              type="button"
              tabIndex={presetsOpen ? 0 : -1}
              data-current={p === nearestPreset || undefined}
              onClick={() => {
                onValueChange(p);
                setPresetsOpen(false);
              }}
            >
              {prefix}
              {new Intl.NumberFormat(locale, unit.format).format(p / unit.factor)}
            </button>
          ))}
        </div>
      )}
    </NumberField.Root>
  );
}

function UnitSelect({
  units,
  value,
  onChange,
}: {
  units: Unit[];
  value: string;
  onChange: (id: string) => void;
}) {
  const items = units.map((u) => ({ value: u.id, label: u.label }));
  return (
    <Select.Root items={items} value={value} onValueChange={(v) => v && onChange(v)}>
      <Select.Trigger className="sn02-unit-trigger" aria-label="Unit">
        <Select.Value />
        <Select.Icon className="sn02-unit-icon">▾</Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        <Select.Positioner sideOffset={4} alignItemWithTrigger={false}>
          <Select.Popup className="sn02-unit-popup" data-sn02-unit-popup="">
            {items.map((item) => (
              <Select.Item key={item.value} value={item.value} className="sn02-unit-item">
                <Select.ItemText>{item.label}</Select.ItemText>
              </Select.Item>
            ))}
          </Select.Popup>
        </Select.Positioner>
      </Select.Portal>
    </Select.Root>
  );
}
