import type { Meta, StoryObj } from '@storybook/react-vite';
import { ScrubbableNumber as V01 } from './01-p3-first-build/ScrubbableNumber';
import { ScrubbableNumber as V02 } from './02-drag-cursor-pickable-values/ScrubbableNumber';
import { ScrubbableNumber as V03 } from './03-visible-drag-handle/ScrubbableNumber';
import { Sentence } from './Sentence';

/**
 * Every iteration of the scrubbable number, frozen as it was, in the same
 * essay sentence. Open **Docs** to try them all on one page.
 *
 * The write-up for each lives in `docs/case-study/iteration-log.md`.
 * The live component is under **Essay/ScrubbableNumber**.
 *
 * Older iterations keep their bugs on purpose: each is frozen exactly as it was.
 * Each one lists its known issues, so you know what to expect before you drag.
 */
const meta: Meta = {
  title: 'Iterations/Scrubbable number',
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
};
export default meta;
type Story = StoryObj;

/**
 * **Tried:** P3 from the anatomy board (R5–R9). Drag anywhere on a number to scrub,
 * double-click to type. Tab and arrow keys step; a digit or Enter starts editing; Esc reverts.
 * Common amounts appear above the token while dragging.
 *
 * **Learned:** Base UI locks the pointer on press, so the native double-click can't be trusted.
 * Two presses close in time and position count as a double-click instead.
 *
 * **Try:** drag the amount and look for the pointer; try to pick one of the common amounts.
 *
 * **Known issues, kept on purpose:** no drag handle; the pointer vanishes while dragging
 * (fixed in 02, made visible in 03). The common amounts can't be picked (fixed in 02).
 */
export const V01_P3FirstBuild: Story = {
  name: '01 · P3 first build',
  render: () => <Sentence Component={V01} />,
};

/**
 * **Feedback on 01:** the pointer vanished while dragging, and the common amounts
 * only showed the range; you couldn't pick one.
 *
 * **Decided (R10):** a ↔ cursor drawn with ScrubAreaCursor while the pointer is locked
 * (Safari keeps its native cursor). The common amounts open on drag and stay open after
 * release, so you can pick one. You can't click mid-drag, because the pointer belongs to the drag.
 *
 * **Try:** drag the amount, let go, then click ₹75,00,000.
 *
 * **Known issue, kept on purpose:** the drag handle is a thin black arrow, the size of the text,
 * drawn on top of the digits, so it's nearly invisible (fixed in 03).
 */
export const V02_DragCursorPickableValues: Story = {
  name: '02 · Drag cursor, pickable values',
  render: () => <Sentence Component={V02} />,
};

/**
 * **Feedback on 02:** "As I'm dragging, I don't see the drag handle."
 *
 * **Learned:** the cursor was there, but it was a thin black arrow, text-sized, drawn on top of
 * black digits, so it disappeared. It was also pushed off-centre by an extra CSS offset; Base UI
 * already centres it.
 *
 * **Decided:** the cursor is now a dark pill with white arrows that reads as a handle on any
 * text. The root renders as a span, so the token is valid HTML inside a sentence.
 *
 * **Try:** drag the amount in Chrome or Firefox. Safari shows its own ↔ cursor instead.
 */
export const V03_VisibleDragHandle: Story = {
  name: '03 · Visible drag handle',
  render: () => <Sentence Component={V03} />,
};
