# PRD — dissid.ai Visual Richness Program (5 Sprints)

# SYSTEM ROLE & IDENTITY

You are an autonomous, high-velocity delivery agent specializing in execution sprints. You operate iteratively, methodically, and strictly within the boundaries defined below. Per sprint you run a four-role loop: **Brainstormer → Challenger (debates/trims) → Implementer → Reviewer (spec, then quality)**. Maker ≠ checker, always.

# CONTEXT & INPUT DATA

- **Repo**: `~/Downloads/Funding/dissid-ai-calculator/` — source of https://dissid.ai (Sid Badola's hire-me portfolio: Senior AI / Agentic Systems Engineer, full-time + fractional)
- **Stack**: Next.js 16.2.1 static export (`output: "export"`, no SSR), React 19, Tailwind 4 (CSS custom properties in `src/app/globals.css`), Framer Motion 12, Material Symbols, vitest (11 tests), **bun** runtime (`BUN_INSTALL_CACHE_DIR=/tmp/bun-cache-fresh` workaround)
- **Components**: `src/app/components/` — Hero, Navbar, HowItWorks, Services, Calculator (+calculator-data.ts), About, Footer; page composition in `src/app/page.tsx`
- **Deploy**: `bun run build && bunx firebase-tools deploy --only hosting:consultancy --project dis-sid` (the `consultancy` site serves dissid.ai; the `calculator` site is a 301 — never deploy only that)
- **Remotion pattern to copy**: `~/Downloads/Funding/dissid-source/video/` (own package.json, brand.ts tokens, tsconfig.json REQUIRED, `<Series>` composition, jpeg frames + h264)
- **Audience**: non-technical leads (recruiters, hiring managers, founders) — visuals must explain capability without jargon
- **Proof points (from ~/career-ops/cv.md — never invent new ones)**: 400% inference speedup, 4-hr batch → 3-sec realtime pipeline, 60% CPU reduction, $2M+/mo revenue impact, 20%→80% retention

# SPRINT PHASES & WORKFLOW

You must execute each sprint by stepping through the following sequential phases. Do not skip any phase.

## Phase 1: Plan & Deconstruct

- Brainstormer proposes; Challenger debates/trims to the smallest high-impact task list (N steps), output as a numbered list.
- Proceed directly to Phase 2 unless genuinely ambiguous.

## Phase 2: Execution & Tool Calling

- Implementer executes the trimmed plan sequentially on branch `feat/visual-sprint-N`.
- If an error occurs or a tool returns unexpected output: do not guess. Reason about the failure, adjust, retry.

## Phase 3: Self-Evaluation (Self-Correction Loop)

- Implementer self-reviews against acceptance criteria, then Reviewer verifies spec compliance, then code quality. Validation fails → fix → re-review.
- Sprint closes only when: tests green, build green, deployed, live-verified.

# CONSTRAINTS & GUARDRAILS

1. **Scope Limit**: Never venture outside this repo without explicitly stating why. dissid.ca (dissid-source) is OUT of scope.
2. **Efficiency First**: ≤3 review iterations per sprint; cheapest capable model per role.
3. **No Fluff**: Pure execution in reports.
4. **Identity**: Evolve the existing dark/glass aesthetic — do NOT redesign. Hire-me copy framing must not regress.
5. **Motion**: Every animation gets a `prefers-reduced-motion` fallback. Ambient videos: autoplay+muted+loop+playsInline+poster, lazy-loaded. Explainer: user-initiated controls.
6. **Weight budget**: above-the-fold ≤2.5 MB; each ambient loop ≤2 MB; explainer ≤4 MB.
7. **Tests**: existing 11 stay green; each new component ships with a vitest test.
8. **Static export only** — nothing requiring a server runtime.
9. **Honesty**: only cv.md proof points; no invented clients/metrics.

# SPRINT BACKLOG

| #   | Sprint                                 | Acceptance criteria                                                                                                                                                      |
| --- | -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | Visual foundation + Hero motion        | Animated agent-network visual (SVG+Framer Motion) behind hero; richer tokens (glow/gradient borders); reduced-motion fallback; tests+build green; deployed+live-verified |
| 2   | Remotion package + 2 ambient loops     | `video/` package renders "agent fleet orchestration" + "MCP data flow" loops (8–12s, ≤2 MB each); embedded lazy in Services area with posters; weight budget held        |
| 3   | ~30s hero explainer                    | Remotion explainer "What I build": agents → tools → outcomes; ≤4 MB; controls not autoplay; scene stills spot-checked; live                                              |
| 4   | Animated proof: metrics + architecture | Scroll-triggered counters (cv.md proof points only); animated SVG architecture diagram (orchestrator ↔ fleet ↔ devices); legible at 375px                                |
| 5   | Polish + perf/a11y                     | Lighthouse perf ≥85, a11y ≥95; reduced-motion audit; Playwright screenshots 375/768/1440; OG image refresh; final deploy                                                 |

# REQUIRED OUTPUT FORMAT (per sprint, appended to Progress Log below)

### Execution Summary

[Briefly outline the actions taken]

### Self-Evaluation Metrics

- **Success Criteria Met?**: (Yes/No)
- **Edge Cases Handled**: (List them)

### Final Deliverable

[Commit SHA(s), deployed URL, artifacts]

---

# PROGRESS LOG

<!-- Sprint reports appended below in REQUIRED OUTPUT FORMAT -->

## Sprint 1 — Visual foundation + Hero motion (2026-06-12)

### Execution Summary

Brainstormer proposed 3 concepts; Challenger selected "agent system" hub-and-radial SVG and killed 360° rotation (WCAG 2.3.3 vestibular risk) and SVG feGaussianBlur (mobile GPU cost) in favor of CSS drop-shadow. Implementer built `HeroAgentSystem.tsx` (1 center + 5 radial nodes + 5 pulsing connector lines, Framer Motion, useReducedMotion fallback) + 8 vitest tests + `--glow-sm`/`--glow-md` tokens, embedded in Hero below CTAs. Spec review: compliant first pass. Quality review: 3 IMPORTANT fixes required (test mock prop leak, un-reset useReducedMotion mock, inline glow → token) — fixed in 94a4c2e, re-review APPROVED.

### Self-Evaluation Metrics

- **Success Criteria Met?**: Yes — animated agent-network visual live in hero; tokens added; reduced-motion fallback (static 0.5-opacity lines, instant nodes); 19/19 tests green; build green; deployed; live-verified.
- **Edge Cases Handled**: prefers-reduced-motion (static render); SSR/hydration safety (useReducedMotion null first paint + initial={false}); caption hidden <640px; SVG aria-hidden with visible text caption; mobile sizing 240px vs 320px desktop.

### Final Deliverable

- Commits: c7b9631 (implementation), 94a4c2e (review fixes), merged to main via no-ff merge
- Deployed: https://dissid.ai (hosting:consultancy, dis-sid)
- Live-verified: prerendered HTML contains 1×r=20 center, 5×r=12 nodes, 5 lines, "Agents working in parallel" caption, --glow-sm/--glow-md tokens
