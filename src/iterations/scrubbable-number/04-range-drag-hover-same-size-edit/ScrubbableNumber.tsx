// FROZEN iteration snapshot. Don't edit; change src/components/ScrubbableNumber instead.
import { NumberField } from '@base-ui/react/number-field';
import { Popover } from '@base-ui/react/popover';
import { Select } from '@base-ui/react/select';
import * as React from 'react';
import { fromPosition, snapTo, toPosition, type Curve } from './scale';
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
  /** Keyboard step, and the drag snap unless `snap` is given. In this unit. */
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
  /** Shape of the drag track. 'log' suits ranges that span orders of magnitude. */
  curve?: Curve;
  /** Pixels of drag that cover min to max. Shift is 4× faster, Alt 10× finer. */
  dragLength?: number;
  /** Rounds a dragged value, in the base unit. Defaults to the unit's step. */
  snap?: (value: number) => number;
  /** Common values, in the base unit, offered in a popover above the token (R9). */
  presets?: number[];
  /** Short visible label for a preset, e.g. "20L". Screen readers still hear the full value. */
  presetLabel?: (value: number) => string;
  /** How long the pointer must rest on the token before the presets open. */
  presetsHoverDelay?: number;
  /** Two presses within this many ms count as a double-click (R8). */
  doubleClickMs?: number;
}

const CLOSE_DELAY = 200;

/**
 * Iteration 04. Drag anywhere on the token to scrub, double-click (or double-tap)
 * to type. Tab focuses it; arrow keys step; typing a digit or pressing Enter
 * starts editing. Editing keeps the token's exact size, so the sentence doesn't move.
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
  curve = 'linear',
  dragLength = 300,
  snap,
  presets,
  presetLabel,
  presetsHoverDelay = 400,
  doubleClickMs = 300,
}: ScrubbableNumberProps) {
  const [unitId, setUnitId] = React.useState(units[0].id);
  const unit = units.find((u) => u.id === unitId) ?? units[0];
  const [editing, setEditing] = React.useState(false);
  const [presetsOpen, setPresetsOpen] = React.useState(false);
  // What the input currently holds while editing. A hidden copy of it sizes the input.
  const [draft, setDraft] = React.useState('');

  const rootRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const valueAtEditStart = React.useRef(value);

  const display = value / unit.factor;
  const formatter = React.useMemo(
    () => new Intl.NumberFormat(locale, unit.format),
    [locale, unit.format],
  );
  const snapValue = snap ?? ((v: number) => snapTo(v, (unit.step ?? 1) * unit.factor));

  // ---- Presets popover: opens on hover intent and on drag ---------------------
  const hasPresets = Boolean(presets?.length);
  const openTimer = React.useRef<number | undefined>(undefined);
  const closeTimer = React.useRef<number | undefined>(undefined);

  function cancelHoverTimers() {
    window.clearTimeout(openTimer.current);
    window.clearTimeout(closeTimer.current);
  }
  function hoverIn(event: React.PointerEvent) {
    if (!hasPresets || editing || event.pointerType === 'touch') return;
    window.clearTimeout(closeTimer.current);
    if (presetsOpen) return;
    window.clearTimeout(openTimer.current);
    openTimer.current = window.setTimeout(() => setPresetsOpen(true), presetsHoverDelay);
  }
  function hoverOut(event: React.PointerEvent) {
    if (event.pointerType === 'touch' || drag.current.active) return;
    cancelHoverTimers();
    closeTimer.current = window.setTimeout(() => setPresetsOpen(false), CLOSE_DELAY);
  }
  React.useEffect(() => () => cancelHoverTimers(), []);

  // ---- Drag: our own mapping on an invisible track ----------------------------
  // Base UI's ScrubArea still does the pointer lock and the cursor, but its own
  // step-per-pixel increments are switched off (huge pixelSensitivity, and scrub
  // changes ignored below). We move along a track of `dragLength` pixels instead.
  const drag = React.useRef({ active: false, t: 0, distance: 0 });
  const movedSincePress = React.useRef(false);
  const latest = React.useRef({ value, min, max, curve, dragLength, snapValue, onValueChange, hasPresets });
  latest.current = { value, min, max, curve, dragLength, snapValue, onValueChange, hasPresets };

  React.useEffect(() => {
    function onMove(event: PointerEvent) {
      const d = drag.current;
      if (!d.active) return;
      const l = latest.current;
      const speed = event.shiftKey ? 4 : event.altKey ? 0.1 : 1;
      d.t = Math.min(1, Math.max(0, d.t + (event.movementX * speed) / l.dragLength));
      d.distance += Math.abs(event.movementX);
      if (d.distance > 2 && !movedSincePress.current) {
        movedSincePress.current = true;
        window.clearTimeout(openTimer.current);
        window.clearTimeout(closeTimer.current);
        if (l.hasPresets) setPresetsOpen(true);
      }
      const next = Math.min(l.max, Math.max(l.min, l.snapValue(fromPosition(d.t, l.min, l.max, l.curve))));
      if (next !== l.value) l.onValueChange(next);
    }
    function onUp() {
      drag.current.active = false;
    }
    window.addEventListener('pointermove', onMove, true);
    window.addEventListener('pointerup', onUp, true);
    return () => {
      window.removeEventListener('pointermove', onMove, true);
      window.removeEventListener('pointerup', onUp, true);
    };
  }, []);

  // ---- Double-click: detected from presses, not the dblclick event ------------
  // Base UI locks the pointer on mouse down, so native dblclick can't be trusted.
  const lastPress = React.useRef({ time: 0, x: 0, y: 0 });

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
    drag.current = { active: true, t: toPosition(value, min, max, curve), distance: 0 };
  }

  // ---- Editing ------------------------------------------------------------------
  function startEditing() {
    cancelHoverTimers();
    setPresetsOpen(false);
    valueAtEditStart.current = value;
    setDraft(formatter.format(display));
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

  // Arrow keys change the input without an input event; keep the sizing copy in step.
  React.useLayoutEffect(() => {
    const el = inputRef.current;
    if (editing && el && el.value !== draft) setDraft(el.value);
  });

  function handleInputKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (!editing) {
      // Focused but not editing (Tab, or a single click). Arrow keys still step
      // through Base UI. A digit or Enter starts editing, like a spreadsheet cell.
      if (event.key === 'Enter') {
        event.preventDefault();
        startEditing();
      } else if (/^[0-9]$/.test(event.key)) {
        valueAtEditStart.current = value;
        setDraft(event.key);
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
    if (next && (rootRef.current?.contains(next) || next.closest('[data-sn04-unit-popup]'))) {
      return;
    }
    if (editing) stopEditing();
  }

  const nearestPreset = presets?.reduce((a, b) =>
    Math.abs(b - value) < Math.abs(a - value) ? b : a,
  );
  const spokenName = unit.label ? `${label}, in ${unit.label}` : label;
  const fullLabel = (v: number) => `${prefix ?? ''}${formatter.format(v / unit.factor)}`;

  return (
    <NumberField.Root
      ref={rootRef}
      // A <span>, not Base UI's default <div>, so the token can sit inside a sentence's <p>.
      render={<span />}
      className="sn04-root"
      data-editing={editing || undefined}
      onPointerEnter={hoverIn}
      onPointerLeave={hoverOut}
      value={display}
      onValueChange={(next, details) => {
        if (next === null) return; // empty input mid-typing
        if (details.reason === 'scrub') return; // our drag track handles scrubbing
        onValueChange(next * unit.factor);
      }}
      min={min / unit.factor}
      max={max / unit.factor}
      step={unit.step ?? 1}
      smallStep={unit.smallStep}
      largeStep={unit.largeStep}
      format={unit.format}
      locale={locale}
    >
      <NumberField.ScrubArea
        className="sn04-scrub"
        pixelSensitivity={1e9}
        onPointerDown={handlePointerDown}
      >
        <span className="sn04-display" aria-hidden="true">
          {prefix && <span className="sn04-prefix">{prefix}</span>}
          <span className="sn04-digits">{formatter.format(display)}</span>
          {unit.label && <span className="sn04-unit"> {unit.label}</span>}
        </span>
        {/* Signifier on hover: the same pill you'll drag. Positioned, so nothing moves. */}
        <span className="sn04-handle" aria-hidden="true">
          <DragPill />
        </span>
        {/* Drawn in place of the locked pointer while dragging (Safari keeps its own cursor). */}
        <NumberField.ScrubAreaCursor className="sn04-cursor">
          <DragPill />
        </NumberField.ScrubAreaCursor>
      </NumberField.ScrubArea>

      <span className="sn04-editor">
        {prefix && <span className="sn04-prefix">{prefix}</span>}
        {/* The hidden copy and the input share one grid cell, so the input is exactly as
            wide as its text: the same width as the number it replaced. */}
        <span className="sn04-field">
          <span className="sn04-mirror" aria-hidden="true">
            {draft || ' '}
          </span>
          <NumberField.Input
            ref={inputRef}
            className="sn04-input"
            // Inputs default to ~20 characters wide, which would size the grid cell.
            // size={1} drops that, so the hidden copy of the text decides the width.
            size={1}
            aria-label={spokenName}
            onKeyDown={handleInputKeyDown}
            onBlur={handleInputBlur}
            onInput={(e) => setDraft(e.currentTarget.value)}
          />
        </span>
        {units.length > 1 ? (
          <>
            {' '}
            <UnitSelect
              units={units}
              value={unitId}
              onChange={(id) => {
                setUnitId(id);
                requestAnimationFrame(() => inputRef.current?.focus());
              }}
            />
          </>
        ) : (
          unit.label && <span className="sn04-unit"> {unit.label}</span>
        )}
      </span>

      {presets && (
        <Popover.Root
          open={presetsOpen}
          onOpenChange={(open, details) => {
            if (open) return;
            // A press on the token itself isn't "outside": it's the start of a drag.
            const target = details.event?.target;
            if (target instanceof Node && rootRef.current?.contains(target)) return;
            setPresetsOpen(false);
          }}
        >
          <Popover.Portal>
            <Popover.Positioner anchor={rootRef} side="top" align="start" sideOffset={6}>
              <Popover.Popup
                className="sn04-presets"
                initialFocus={false}
                finalFocus={false}
                onPointerEnter={hoverIn}
                onPointerLeave={hoverOut}
              >
                {presets.map((p) => (
                  <button
                    key={p}
                    type="button"
                    aria-label={fullLabel(p)}
                    data-current={p === nearestPreset || undefined}
                    onClick={() => {
                      onValueChange(p);
                      setPresetsOpen(false);
                    }}
                  >
                    {presetLabel ? presetLabel(p) : fullLabel(p)}
                  </button>
                ))}
              </Popover.Popup>
            </Popover.Positioner>
          </Popover.Portal>
        </Popover.Root>
      )}
    </NumberField.Root>
  );
}

function DragPill() {
  return (
    <svg width="36" height="22" viewBox="0 0 36 22" aria-hidden="true">
      <rect x="1" y="1" width="34" height="20" rx="10" fill="#111" stroke="#fff" strokeWidth="1.5" />
      <path d="M9 11h18M9 11l4-4M9 11l4 4M27 11l-4-4M27 11l-4 4" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
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
      {/* Looks like the unit word itself: no box, no chevron, so editing adds no width. */}
      <Select.Trigger className="sn04-unit-trigger" aria-label="Unit">
        <Select.Value />
      </Select.Trigger>
      <Select.Portal>
        <Select.Positioner sideOffset={4} alignItemWithTrigger={false}>
          <Select.Popup className="sn04-unit-popup" data-sn04-unit-popup="">
            {items.map((item) => (
              <Select.Item key={item.value} value={item.value} className="sn04-unit-item">
                <Select.ItemText>{item.label}</Select.ItemText>
              </Select.Item>
            ))}
          </Select.Popup>
        </Select.Positioner>
      </Select.Portal>
    </Select.Root>
  );
}
