# Community themes and reference numbers

Date: 2026-11-18
Status: second pass. Reddit blocks direct crawling, so r/personalfinanceindia threads were read through Firecrawl search excerpts (titles and snippets), not full pages. Earlier themes came from nearby Indian sources and are now confirmed against those excerpts.

## Themes borrowers keep raising

1. **"EMI will be comfortable, sir."** Borrowers pick a long tenure because the bank's relationship manager pitches a lower EMI. Years later they open the amortisation schedule and find the total interest. ([Butter forum](https://community.butter.money/t/opened-my-home-loan-amortisation-schedule-for-the-first-time-in-3-years-that-comfortable-30-year-tenure-is-costing-me-31-lakh/152): ₹50 lakh loan, 30 years instead of 20 to save about ₹5k a month, costing about ₹31 lakh more in interest. Quotes: "I said yes in about four seconds", "Did not enjoy what I found".)
2. **Shock at front-loading.** After years of EMIs, the principal has barely moved. (Same thread; calculator sites.)
3. **Reduce tenure or reduce EMI?** When you prepay, or when rates change, the bank asks which one. Keeping the EMI and cutting the tenure saves more interest. ([Business Standard](https://www.business-standard.com/finance/personal-finance/retain-emi-shorten-tenure-save-interest-costs-on-home-loans-125060600768_1.html))
4. **Prepay or invest?** Compare the loan rate with expected returns, the lost tax deduction, and liquidity. Opinions are split. ([Blind](https://www.teamblind.com/post/prepay-home-loan-vs-invest-india-6pda86be), [Business Standard](https://www.business-standard.com/amp/finance/personal-finance/make-part-prepayments-to-cut-home-loan-tenor-but-don-t-use-retirement-fund-123040300450_1.html))
5. **Don't prepay with your safety net.** Keep the emergency fund and retirement money untouched.
6. **Silent tenure creep.** When the repo rate rises, banks lengthen the tenure instead of raising the EMI. ([Business Standard](https://www.business-standard.com/amp/article/pf/after-rate-hike-ask-your-lender-to-increase-home-loan-emi-not-tenure-122080501277_1.html)) This is parked for V2 (floating rate simulator).
7. **Prepayment fees.** Floating-rate loans usually have no prepayment penalty; fixed-rate loans may. ([Business Standard](https://www.business-standard.com/amp/finance/personal-finance/is-there-a-charge-on-prepayment-of-home-loan-124111100803_1.html))

## From r/personalfinanceindia (search excerpts, 2026-11-18)

- **Front-loading, in borrowers' own numbers.** "I took a ₹58L home loan 2 years ago at 7.25%. So far I've paid roughly ₹8L in interest and only ₹2.5L towards principal." (Our model gives ₹8.2L and ₹2.8L, which matches.) [thread](https://www.reddit.com/r/personalfinanceindia/comments/1u2a65c/need_advice_on_home_loan_prepayment/)
- **Silent tenure creep is the community's favourite horror story.** "The interest rate has increased from 6.9% to 9.2%. Due to this the tenure of the loan was increased from 20 years to 75 years." [thread](https://www.reddit.com/r/personalfinanceindia/comments/1avcnke/home_loan_tenure_increased/); "my bank had increased it quietly and the loan tenure kept on increasing" [thread](https://www.reddit.com/r/personalfinanceindia/comments/1jmvryp/i_checked_my_home_loan_rate_after_2_years_and_i/)
- **The folk rule is both strategies together.** "increasing your emi by 5 percent every year and paying one extra installment every year" [thread](https://www.reddit.com/r/personalfinanceindia/comments/16aezil/how_to_get_rid_of_home_loan_in_23_yearspls/). A variant: pay 5% of the balance once a year to close a 20-year loan in about 12 [thread](https://www.reddit.com/r/personalfinanceindia/comments/1cxwiak/ideas_to_pay_big_home_loan_in_most_optimised_way/).
- **Rules of thumb for prepay vs invest.** "If you are still paying more than 70% of every EMI as interest, then prepaying…" [thread](https://www.reddit.com/r/personalfinanceindia/comments/1qkns5f/home_loan_prepay_12l_or_invest_it_25m/); "first 2 quarters of your loan… prepay aggressively. Last 2 quarters, prefer investing" [thread](https://www.reddit.com/r/personalfinanceindia/comments/1vvgf1i/12_lakh_extra_per_month_should_i_close_my_home/); "Prepayment gives a guaranteed return equal to the loan rate" [thread](https://www.reddit.com/r/personalfinanceindia/comments/1xbf45b/need_advice_on_buying_the_dip_vs_home_loan/).
- **Tell the bank which one you want.** "They automatically lower your EMI and increase the tenure. Make sure to call your bank and tell them explicitly to lower the tenure." [thread](https://www.reddit.com/r/personalfinanceindia/comments/1ijp5zi/the_rbis_recent_repo_rate_cut_is_great_news_for/)
- **Celebration posts.** "Paid off my 20 yr home loan in 6.5 yrs" [thread](https://www.reddit.com/r/personalfinanceindia/comments/1gspidp/paid_off_my_20_yr_home_loan_in_65_yrs/), "Closed my 30-year home loan in just 3 years" [thread](https://www.reddit.com/r/personalfinanceindia/comments/1x1hu6z/second_milestone_reached_closed_my_30year_home/), "Closed my ₹65L home loan, became debt-free at 27" [thread](https://www.reddit.com/r/personalfinanceindia/comments/1qwfjo6/closed_my_65l_home_loan_became_debtfree_at_27/).
- **Bank fine print.** Minimum prepayment amounts (HDFC: "₹1 lakh or 3 EMIs?") and tenures that don't update on their own after a prepayment (SBI).

## Current rates (November 2026)

Rates start around 7.25% (SBI and other public sector banks); private banks are about 7.45–8.5%. ([Paisabazaar](https://www.paisabazaar.com/home-loan/interest-rates/), [Mint](https://www.livemint.com/money/personal-finance/home-loan-interest-rates-for-diwali-2026-planning-to-buy-a-house-check-rates-starting-at-7-25-across-major-banks-11793814557296.html)) Suggested default: 7.5%.

## Reference numbers at 7.5% (suggested default)

₹50 lakh for 20 years: EMI ₹40,280; 77.6% of the first EMI is interest.

| Scenario | Loan closes in | Total interest | Month principal first exceeds interest |
|---|---|---|---|
| No prepayment | 20.0 years | ₹46.7 lakh | 130 (year 11) |
| One extra EMI every year | 17.0 years | ₹38.7 lakh | 106 |
| EMI raised 5% every year | 12.5 years | ₹30.7 lakh | 61 |
| Both | 11.7 years | ₹28.0 lakh | 59 |

## Earlier reference numbers (computed, monthly reducing balance)

₹50 lakh at 8.5% for 20 years. The rate is an illustration; check it against current bank rates before publishing.

| Scenario | Loan closes in | Total interest | Month principal first exceeds interest |
|---|---|---|---|
| No prepayment | 20.0 years | ₹54.1 lakh | 143 (year 12) |
| One extra EMI every year | 16.8 years | ₹43.8 lakh | 114 |
| EMI raised 5% every year | 12.2 years | ₹34.6 lakh | 68 |

- EMI: ₹43,391. Of the first EMI, 81.6% is interest.
- Year 1: ₹4.21 lakh interest, ₹1.0 lakh principal.
- Total interest is more than the amount borrowed.

## Layoffs and the "own house" mindset (added 2026-11-18)

**Layoffs, 2026.** TCS headcount fell by 23,460 in FY26 ([Economic Times](https://m.economictimes.com/tech/technology/over-93000-jobs-cut-in-tech-so-far-in-2026-as-ai-drives-cuts-at-freshworks-coinbase-others/articleshow/130879634.cms)). TeamLease projects 25,000–35,000 "silent layoffs" in Indian tech in 2026: exits through performance reviews, with no announcement ([Times of India](https://timesofindia.indiatimes.com/business/india-business/silent-layoffs-around-35000-tech-jobs-may-be-eliminated-this-year-indias-it-sector-sees-ai-shift/articleshow/132281010.cms)). Infosys says it has made no layoffs. Fresher hiring continues (TCS about 40,000 planned for FY27).

**r/PFI on layoffs and EMIs:**
- "My biggest fear isn't the EMI itself—it's what if I lose my job tomorrow?" [thread](https://www.reddit.com/r/personalfinanceindia/comments/1upn9om/anyone_else_terrified_of_taking_a_home_loan_even/)
- "With what guarantee are IT people buying home with loans?" (title) [thread](https://www.reddit.com/r/personalfinanceindia/comments/1rgzfio/with_what_guarantee_are_it_people_buying_home/)
- "I had lost my job in the month of May… I have monthly emi of 65k for my house. My savings have dried…" [thread](https://www.reddit.com/r/personalfinanceindia/comments/1eop2zv/can_i_postpone_my_house_emi_for_2_months/)
- "Home loan holders, do recent layoffs making you anxious…" [thread](https://www.reddit.com/r/personalfinanceindia/comments/1ojrvdq/home_loan_holders_do_recent_layoffs_making_you/)

**r/PFI on family pressure to own:**
- "Rent v buy sheets won't help with the parents generation." [thread](https://www.reddit.com/r/personalfinanceindia/comments/161cbdm/parents_pressuring_me_into_buying_a_house/)
- "Parents Want Me to Take a 40L Loan at 22, Feeling Pressured and Conflicted" (title) [thread](https://www.reddit.com/r/personalfinanceindia/comments/1deq5we/parents_want_me_to_take_a_40l_loan_at_22_feeling/)
- "Parents forced to buy a house and now I lost my freedom" (title) [thread](https://www.reddit.com/r/personalfinanceindia/comments/1tqs16b/parents_forced_to_buy_a_house_and_now_i_lost_my/)
- "Sadly the worst part is societal and parental pressure to buy a house" [thread](https://www.reddit.com/r/personalfinanceindia/comments/1wpr72h/gen_z_getting_humbled_by_housing_prices/)
- "Not owning a property for me is a red flag." (in a marriage discussion) [thread](https://www.reddit.com/r/personalfinanceindia/comments/1g0h8gy/need_serious_advice_please_help/)

All quotes are verbatim from search excerpts. Check each against the full thread before publishing.
