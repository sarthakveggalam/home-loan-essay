# Product brief: home loan reactive essay

Date: 2026-11-18
Status: shaping. Prose, components and Paper designs are not agreed yet.

## Goal

A self-contained reactive essay that shows design engineering craft (typography, tactile micro-interactions, fluid data visualisation) while staying small enough to ship.

The essay makes one point: home loan interest is heavily front-loaded, and small, consistent prepayments shorten a long loan a lot.

## Audience and locale

Indian home buyers. Indian interest rates, rupee amounts with lakh/crore grouping (`en-IN`).

## V1 scope

- **Scrubbable numbers in the text.** Drag or type: loan amount, interest rate (%), tenure (years).
- **Live outputs in the text.** Monthly EMI, total interest paid, principal-to-interest ratio.
- **One synchronised chart.** Principal vs interest over the life of the loan, with smooth transitions and a clear crossover point (the month principal starts to outweigh interest).
- **Prepayment.** Both strategies are in scope: one extra EMI each year, and raising the EMI by 5% each year. How the essay presents them is decided during design.
- **Polish.** Fixed-width digits (`tabular-nums`) and no layout shift while scrubbing; tactile scrub cursor and active states; sensible min/max/step; editorial typography and generous whitespace; reduced-motion support.

## Definition of done (V1)

- [ ] 3–5 tight paragraphs of reactive prose, written and wired up.
- [ ] Scrubbable inputs, chart and prepayment control work smoothly without layout jank.
- [ ] Deployed to a live public URL.
- [ ] A 15-second screen recording for portfolio/social.

## Parked for later

Floating rate simulator; "how much corpus?" essay; rent vs buy explorer; custom lump-sum prepayments; tax implications; shareable state in the URL.

## Process

Agree what the essay should make a reader understand, then draft the prose. Components come from the prose. Each component is designed in Paper (all states), built and tested in Storybook, then composed into the published essay. Work is tracked in Linear; Done requires the owner's acceptance.

Linear project: https://linear.app/meatigo/project/home-loan-essay-2337af57bffa (Side projects team, `SID`).
