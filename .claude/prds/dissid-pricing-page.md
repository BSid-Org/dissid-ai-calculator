---
name: dissid-pricing-page
description: A pricing page for dissid.ai (the consultancy) that converts the Services → Book-a-Call funnel by making engagement options and investment legible — anchored on outcome/ROI and fixed-scope packages, NOT a raw hourly rate (to avoid the "stuck-in-the-middle" positioning risk on record). Grounded in the LIBRARIAN rate anchor; no number publishes unconfirmed by Sid.
status: backlog
created: 2026-06-28T14:24:46Z
---

# PRD: dissid-pricing-page

## Executive Summary

dissid.ai (the consultancy/portfolio at `~/Downloads/Funding/dissid-ai-calculator`, deployed to the
firebase `consultancy` target) has Services, a savings Calculator, and a "Book a Call" CTA — but **no
pricing page.** Buyers in the funnel hit a legibility gap: they see what Sid builds and a savings
estimate, but not what an engagement costs or how it's structured. This PRD scopes a `/pricing` route
that closes that gap and **anchors on value, not an hourly commodity rate.**

## Grounded inputs (LIBRARIAN — do not re-ask Sid)

- **Rate anchor (`dissid-validation-2026.md` L46/L52):** CAD **$150–250/hr** for AI work; day-rate model;
  ~80–100 billable days/yr solo = $120–200K gross. White-label kits = potential MRR (unvalidated).
- **ICP (`dissid-icp-2026.md`):** KW professional-services SMBs, $800K–2M ARR (CPA/law/insurance/HR/
  financial advisory) — regulated, retainer/billable-hour DNA; single decision-maker; tools <$500/mo.
- **Positioning RISK (`dissid-validation-2026.md` L56) — the design constraint:** "stuck in the middle" —
  SMBs resist consulting rates; enterprise wants Big 4. A raw hourly rate card walks straight into this.
  **Mitigation (the page's core design choice):** anchor on bounded, outcome-priced packages + the
  Calculator's ROI, so the SMB buyer sees a fixed, justified cost — not open-ended hours.

## Goal / success

Convert Services → Pricing → Book-a-Call. "Done" = a live `/pricing` page on dissid.ai that (a) presents
3 value-anchored engagement options + a custom tier, (b) ties to the Calculator's savings output, (c) ends
on the existing Book-a-Call CTA, (d) ships ZERO unconfirmed numbers.

## Recommended structure (Sid confirms numbers before publish — anti-fabrication gate)

Three value-anchored tiers, NOT an hourly rate card:

1. **Diagnostic / scoping sprint** — fixed fee, low-commitment entry. The Calculator's savings estimate
   → a concrete first project scope. (Anchor: a few days at the $150–250/hr record.)
2. **Build sprint** — fixed-scope project: one agentic automation shipped, tests-as-gate (mirrors
   `HowItWorks.tsx`). Fixed fee derived from day-rate × typical days.
3. **Fractional / retainer** — monthly ongoing (the "fractional engagements" the site already advertises;
   Hero.tsx:56, Footer.tsx:13). Monthly retainer.
4. **Custom / enterprise** → Book a Call (no public number).

## Open decisions (Sid owns — recommendation given, NOT fabricated)

- **D1 — show real numbers, "from $X", or "contact"?** Recommend **"from $X"** on packages + retainer
  ("from $X/mo"): meets the SMB buyer's bounded-cost need without locking a rigid rate card.
- **D2 — exact package fees + retainer.** Grounded anchor = $150–250/hr × typical days. Sid sets the
  published figures; nothing ships until confirmed.
- **D3 — show the hourly rate at all?** Recommend **NO** — anchor on packages/outcomes per the
  stuck-in-the-middle risk. (Hourly can deter SMBs and anchor enterprise low.)

## Requirements

- **FR1** — `/pricing` route in the Next.js static-export app; reuse the site design system (CSS-var dark
  theme, `gradient-text`/`glass-panel`/`gradient-border`, Inter) — match, don't restyle.
- **FR2** — 3 tiers + custom, value-anchored copy; each tier → a clear CTA (Book a Call / mailto).
- **FR3** — Calculator → Diagnostic link (the savings estimate becomes the first-project hook).
- **FR4** — discoverability: navbar "Pricing" link + a Services-section CTA.
- **FR5** — **anti-fabrication gate:** every published price confirmed by Sid; pre-confirm, render as
  placeholders / "from $—" so a build can proceed without inventing a number.
- **FR6** — CASL-clean: contacts = Book-a-Call (`BOOKING_URL`) + `sid@dissid.ca`; no fabricated claims.

## Non-goals

- tokencut pricing (already shipped at `/tokencut`).
- Scanner Shredder / dissid.ca (separate site).
- White-label kit MRR pricing (unvalidated per records — out of scope until validated).

## Risks

- **Stuck-in-the-middle (primary):** mitigated by value/ROI anchoring + fixed-scope packages, not hourly.
- **Publishing rates anchors low / deters:** mitigated by "from $X" + the Calculator ROI justifying spend.
- **Solo capacity:** retainer/fractional implies bounded slots; copy should signal scarcity, not unlimited.
