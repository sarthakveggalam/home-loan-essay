import type { Meta, StoryObj } from '@storybook/react-vite';
import * as React from 'react';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { shortInr, snapAmount } from '../../lib/format';
import { emi, inr } from '../../lib/loan';
import { ScrubbableNumber, type ScrubbableNumberProps, type Unit } from './ScrubbableNumber';

const rupees: Unit[] = [
  { id: 'inr', label: '', factor: 1, step: 1_00_000, largeStep: 10_00_000, smallStep: 10_000, format: { maximumFractionDigits: 0 } },
];
const percent: Unit[] = [
  { id: 'pct', label: '%', factor: 1, step: 0.05, largeStep: 0.5, smallStep: 0.01, format: { minimumFractionDigits: 2, maximumFractionDigits: 2 } },
];
// Tenure is stored in months.
const tenure: Unit[] = [
  { id: 'years', label: 'years', factor: 12, step: 1, largeStep: 5, format: { maximumFractionDigits: 1 } },
  { id: 'months', label: 'months', factor: 1, step: 1, largeStep: 12, format: { maximumFractionDigits: 0 } },
];
const amountPresets = [20_00_000, 30_00_000, 50_00_000, 75_00_000, 1_00_00_000, 1_50_00_000];

/** The amount's settings: a log track, ₹1L / ₹5L snapping, short preset labels. */
const amountProps = {
  label: 'Loan amount',
  prefix: '₹',
  units: rupees,
  min: 5_00_000,
  max: 5_00_00_000,
  curve: 'log' as const,
  snap: snapAmount,
  presets: amountPresets,
  presetLabel: shortInr,
};

/** Holds the value so each story is interactive. */
function Controlled(props: Omit<ScrubbableNumberProps, 'value' | 'onValueChange'> & { initial: number }) {
  const { initial, ...rest } = props;
  const [value, setValue] = React.useState(initial);
  return (
    <p style={{ fontSize: 24, lineHeight: 1.6, paddingTop: 48 }}>
      <ScrubbableNumber {...rest} value={value} onValueChange={setValue} />{' '}
      <output data-testid="raw" style={{ fontSize: 12, opacity: 0.6 }}>
        (stored: {value})
      </output>
    </p>
  );
}

/** Where the token and the text after it sit, to prove editing moves nothing. */
function layoutOf(canvasElement: HTMLElement) {
  const root = canvasElement.querySelector('.sn-root')!.getBoundingClientRect();
  const after = canvasElement.querySelector('[data-testid="raw"]')!.getBoundingClientRect();
  return { width: root.width, height: root.height, afterX: after.x, afterY: after.y };
}
async function expectSameLayout(canvasElement: HTMLElement, before: ReturnType<typeof layoutOf>) {
  const now = layoutOf(canvasElement);
  await expect(Math.abs(now.width - before.width)).toBeLessThanOrEqual(1);
  await expect(Math.abs(now.height - before.height)).toBeLessThanOrEqual(1);
  await expect(Math.abs(now.afterX - before.afterX)).toBeLessThanOrEqual(1);
  await expect(Math.abs(now.afterY - before.afterY)).toBeLessThanOrEqual(1);
}

const meta: Meta<typeof ScrubbableNumber> = {
  title: 'Essay/ScrubbableNumber',
  component: ScrubbableNumber,
  parameters: { layout: 'padded' },
};
export default meta;
type Story = StoryObj<typeof meta>;

/** The real context: beat 1 of the essay, with a live EMI. */
export const InTheSentence: StoryObj<{ presetsHoverDelay: number }> = {
  args: { presetsHoverDelay: 400 },
  argTypes: {
    presetsHoverDelay: {
      name: 'Presets open after hovering (ms)',
      control: { type: 'inline-radio' },
      options: [0, 400],
    },
  },
  render: ({ presetsHoverDelay }) => {
    const [amount, setAmount] = React.useState(50_00_000);
    const [rate, setRate] = React.useState(7.5);
    const [months, setMonths] = React.useState(240);
    return (
      <p style={{ fontSize: 24, lineHeight: 1.6, maxWidth: '36em', paddingTop: 48 }}>
        Say you’re borrowing{' '}
        <ScrubbableNumber {...amountProps} presetsHoverDelay={presetsHoverDelay} value={amount} onValueChange={setAmount} />{' '}
        at{' '}
        <ScrubbableNumber label="Interest rate" units={percent} min={5} max={15} value={rate} onValueChange={setRate} />{' '}
        for{' '}
        <ScrubbableNumber label="Tenure" units={tenure} min={12} max={360}
          value={months} onValueChange={(m) => setMonths(Math.round(m))} />
        . Your EMI is <strong>{inr(emi(amount, rate, months))}</strong> a month.
      </p>
    );
  },
};

export const Amount: Story = {
  render: () => <Controlled {...amountProps} initial={50_00_000} />,
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('textbox', { name: 'Loan amount' });
    const raw = canvas.getByTestId('raw');

    await step('Tab focuses it; arrow keys step by ₹1 lakh', async () => {
      await userEvent.tab();
      await expect(input).toHaveFocus();
      await userEvent.keyboard('{ArrowUp}');
      await expect(raw).toHaveTextContent('stored: 5100000');
    });

    await step('Typing a digit starts editing and replaces the value', async () => {
      await userEvent.keyboard('2500000{Enter}');
      await expect(raw).toHaveTextContent('stored: 2500000');
    });

    await step('Escape while editing reverts', async () => {
      await userEvent.keyboard('{Enter}');
      await userEvent.keyboard('9{Escape}');
      await expect(raw).toHaveTextContent('stored: 2500000');
    });
  },
};

/** Double-click to edit: the token keeps its exact size, so the sentence doesn't move. */
export const EditingKeepsSize: Story = {
  render: () => <Controlled {...amountProps} initial={50_00_000} />,
  play: async ({ canvasElement }) => {
    const before = layoutOf(canvasElement);
    await userEvent.dblClick(canvasElement.querySelector('.sn-scrub')!);
    await waitFor(() => expect(canvasElement.querySelector('[data-editing]')).not.toBeNull());
    await expectSameLayout(canvasElement, before);
  },
};

export const Tenure: Story = {
  render: () => <Controlled label="Tenure" units={tenure} min={12} max={360} initial={240} />,
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const before = layoutOf(canvasElement);

    await step('Double-click opens the editor without moving anything', async () => {
      await userEvent.dblClick(canvasElement.querySelector('.sn-scrub')!);
      await waitFor(() => expect(canvasElement.querySelector('[data-editing]')).not.toBeNull());
      await expect(canvas.getByRole('textbox', { name: 'Tenure, in years' })).toHaveFocus();
      await expectSameLayout(canvasElement, before);
    });

    await step('Switching to months keeps the same tenure', async () => {
      await userEvent.click(canvas.getByRole('combobox', { name: 'Unit' }));
      await userEvent.click(await within(document.body).findByRole('option', { name: 'months' }));
      await waitFor(() => expect(canvas.getByRole('textbox', { name: 'Tenure, in months' })).toHaveValue('240'));
      await expect(canvas.getByTestId('raw')).toHaveTextContent('stored: 240');
    });
  },
};

/** Hover the amount: after a short rest, common values appear above it. */
export const PresetsOnHover: Story = {
  render: () => <Controlled {...amountProps} initial={50_00_000} />,
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const body = within(document.body);
    const token = canvasElement.querySelector('.sn-scrub')!;

    await step('Passing over briefly does nothing', async () => {
      await userEvent.hover(token);
      await userEvent.unhover(token);
      await new Promise((r) => setTimeout(r, 500));
      await expect(body.queryByRole('button', { name: '₹75,00,000' })).toBeNull();
    });

    await step('Resting opens short labels, read out in full', async () => {
      await userEvent.hover(token);
      const option = await body.findByRole('button', { name: '₹75,00,000' }, { timeout: 1000 });
      await expect(option).toHaveTextContent('75L');
    });

    await step('Picking one sets it and closes the popover', async () => {
      await userEvent.click(body.getByRole('button', { name: '₹75,00,000' }));
      await expect(canvas.getByTestId('raw')).toHaveTextContent('stored: 7500000');
      await waitFor(() => expect(body.queryByRole('button', { name: '₹75,00,000' })).toBeNull());
    });
  },
};
