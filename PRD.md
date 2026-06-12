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

## Sprint 2 — Remotion package + 2 ambient loops (2026-06-12)

### Execution Summary

Brainstormer proposed 10 decisions; Challenger fact-checked and struck 6 (fabricated "sources too large" submodule rationale — dissid-source commits Remotion sources inline; nonexistent useMediaQuery hook — repo uses framer-motion useReducedMotion; Loop A radial-hub narrative — literal duplicate of Sprint 1 hero SVG, replaced with swimlane dispatch board; 1080p downsized to 720p; next/dynamic + hand-rolled IntersectionObserver replaced by framer useInView). Implementer built `video/` Remotion package (React 18 isolated, 24fps, 1280×720) with AgentFleet (192f swimlane board) + MCPDataFlow (240f 3→hub→3 pipeline), rendered both ≤500 KB, embedded via `ServiceLoops.tsx` (3-state: reduced→poster, off-screen→poster, in-view→video). Reviews: spec compliant first pass; quality review found 4 blocking issues — packets bypassing the hub (dead Y-lerp), chip-4 mid-flight seam cut, block opacity pops at the loop seam, untested lazy-load state — fixed across 8217194 + b960fd3 with still-based seam verification (frame 239≈0, 191≈0), re-review APPROVED. Reviewer initially mis-flagged packet modulo wrap as a cutoff; implementer refuted with boundary stills and reviewer retracted.

### Self-Evaluation Metrics

- **Success Criteria Met?**: Yes — both loops 8s/10s, 410 KB + 491 KB (≤2 MB each); lazy in-view loading; autoplay+muted+loop+playsInline+poster; above-fold weight unchanged (videos load on scroll only); 25/25 tests; build green; deployed; live-verified.
- **Edge Cases Handled**: seamless loop invariants (MCP_FRAMES multiple of PACKET_CYCLE, last chip arrival < RESET_START — both documented in comments); reduced-motion → static poster full opacity; SSR first-paint (useReducedMotion null → poster, no hydration mismatch); aspect-video prevents layout shift on poster→video swap; jsdom muted-property quirk in tests.

### Final Deliverable

- Commits: dff8f01 (implementation), 8217194 + b960fd3 (review fixes), no-ff merged to main
- Deployed: https://dissid.ai — live assets verified byte-exact: agent-fleet.mp4 409,942 B; mcp-data-flow.mp4 491,313 B; posters 28,211 / 21,370 B; both captions in prerendered HTML
- New: `video/` Remotion package (committed inline, sources + bun.lock), `ServiceLoops.tsx`, 6 new tests (25 total)

## Sprint 3 — ~30s hero explainer (2026-06-12)

### Execution Summary

Brainstormer proposed a 5-scene script; Challenger fact-checked and struck 10 items: scene math that summed to 21s not 30s; "$2M+ saved" misstating the cv.md "revenue impact" proof point (honesty); "You run on humans. Slow. Expensive." copy that insulted the hiring-manager audience (reframed); a 360° monogram spin (violates Sprint 1 vestibular ruling); a nonexistent portrait asset; SFX-vs-silence contradiction; custom VideoPlayer (over-engineered → native controls); jsdom-impossible tests; transcript link with no transcript. Implementer built `WhatIBuild` composition (720f/30s @24fps 1280×720: Intro → AgentFleet reuse → MCPDataFlow reuse → 4 proof cards → CTA), `WhatIBuildVideo.tsx` embed (3-state, native controls, NO autoplay), page section after Calculator. Reviews: spec compliant first pass; quality review flagged a CRITICAL fleet-scene overrun (216f sequence vs 192f component → frozen final second) — implementer CONFIRMED via boundary stills (his own "second cycle" rationale was wrong), fixed by trimming fleet to 192f and extending proof cards to 96f; SceneOverlay extracted to kill duplication. Re-review APPROVED with verified Series/stagger/fade arithmetic.

### Self-Evaluation Metrics

- **Success Criteria Met?**: Yes — 30s explainer telling agents → tools → outcomes; 1.62 MB (≤4 MB); user-initiated native controls, no autoplay/loop; 6 scene stills spot-checked post-fix; 28/28 tests; build green; deployed; live-verified.
- **Edge Cases Handled**: AgentFleet clamp-past-192 behavior discovered and designed around (documented in comment); proof-card stagger keeps all 4 metrics readable ≥3.2s; reduced-motion → content poster with alt text (not aria-hidden — it's content); poster frame inside unchanged intro so timeline shift didn't invalidate it; copy honesty audit (exact cv.md phrasing only).

### Final Deliverable

- Commits: ef73362 (implementation), 6257a54 (review fixes), no-ff merged to main
- Deployed: https://dissid.ai#what-i-build — live: what-i-build.mp4 1,619,372 B, poster 12,614 B, section id + heading + subtitle in prerendered HTML
- New: WhatIBuild composition (5 scenes via Series), WhatIBuildVideo embed, 3 new tests (28 total)

## Sprint 4 — Animated proof: metrics + architecture (2026-06-12)

### Execution Summary

Brainstormer proposed metrics band + diagram; Challenger fact-checked cv.md and struck invented sublabels ("Systems I've shipped"), the factually wrong "Sub-second Pipeline" label (cv says sub-3-second), dual count-up over-engineering, a false "framer can't do pathLength in static export" claim, and the deprecated motionValue.onChange API. **Orchestrator then caught the Challenger introducing its own honesty violations** (invented "400x speedup" math, a nonexistent "12% Engagement Lift", filler "5+ Years Shipped", and dropping two real proof points) and corrected the card list to the exact five cv.md metrics before dispatch. Implementer built MetricCounter (framer `animate()` + onUpdate, useInView once, reduced-motion instant), MetricsSection (5 glass cards: 400% counter / "4 hr → 3 sec" static / 60% counter / $2M+/mo counter / 20%→80% hybrid), ArchitectureFleet (3-node SVG: Orchestrator-Mac ↔ Agent Fleet-VPS ↔ Integrations, pulsing connectors per Sprint 1 idiom, inline SVG fontSize for 375px legibility ≥10.5px). Placement: metrics after Hero; #architecture section after explainer. Reviews: spec compliant first pass; quality APPROVED first pass (2 NITs only).

### Self-Evaluation Metrics

- **Success Criteria Met?**: Yes — scroll-triggered counters animate once on view with cv.md proof points only (live forbidden-string check: 0 hits); animated architecture diagram live; SVG legible at 375px (16px labels → 12px rendered); 65/65 tests; build green; deployed; live-verified.
- **Edge Cases Handled**: useReducedMotion null first-paint (strict-equality gating, SSR renders 0 then animates); animation cleanup via controls.stop() on unmount; counter never retriggers (useInView once); desc text split to avoid circle overflow; no rotation anywhere.

### Final Deliverable

- Commit: 19cea6d, no-ff merged to main
- Deployed: https://dissid.ai — "Proof of Scale" metrics band + "How It Runs" #architecture section live-verified (all 5 labels + 3 node labels in HTML, 0 forbidden strings)
- New: MetricCounter, MetricsSection, ArchitectureFleet + 37 tests (65 total)
