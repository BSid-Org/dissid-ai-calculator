import type { Metadata } from "next";
import Link from "next/link";
import { BOOKING_URL, BOOKING_MAILTO } from "../lib/booking";

export const metadata: Metadata = {
  title: "Pricing — ship a production AI agent in 5 days | DISSID",
  description:
    "Fixed-price AI agent builds. One scoped production agent in 5 working days — $5,000, pay on delivery. If it misses the scope we agreed, you don't pay. Continue as a fractional retainer at $5K/mo.",
  alternates: { canonical: "https://dissid.ai/pricing" },
  openGraph: {
    title: "Pricing — ship a production AI agent in 5 days | DISSID",
    description:
      "One scoped production AI agent in 5 working days — fixed $5,000, pay on delivery. Fractional retainer $5K/mo.",
    url: "https://dissid.ai/pricing",
    siteName: "DISSID",
    type: "website",
  },
};

const tiers = [
  {
    name: "Scoping call",
    price: "Free",
    free: true,
    cadence: "30 minutes",
    who: "Not sure what to build first? Start here.",
    points: [
      "30-minute scoping call",
      "We define a fixed scope + written success criteria",
      "You leave knowing exactly what a sprint would ship",
      "Zero commitment",
    ],
    cta: { label: "Book a scoping call", href: BOOKING_URL, solid: false },
  },
  {
    name: "Agent Sprint",
    price: "$5,000",
    cadence: "fixed · 5 working days · pay on delivery",
    feature: true,
    who: "Teams who want an agentic feature in prod but can't pull an engineer off the roadmap.",
    points: [
      "One scoped AI agent or automation — designed, built, deployed to your stack",
      "Shipped in 5 working days, with a daily check-in",
      "Demo + handoff at the end",
      "Pay on delivery — if it misses the scope we agreed, you don't pay",
    ],
    cta: { label: "Book a scoping call", href: BOOKING_URL, solid: true },
  },
  {
    name: "Fractional retainer",
    price: "$5,000",
    unit: "/ mo",
    cadence: "~1 day / week",
    who: "Keep shipping agentic features without a full-time hire.",
    points: [
      "~1 day per week, ongoing",
      "Continue from a sprint, or start here",
      "Prioritized roadmap of agents + automations",
      "Remote, your timezone · invoice monthly",
    ],
    cta: { label: "Talk about a retainer", href: BOOKING_URL, solid: false },
  },
  {
    name: "Custom",
    price: "Let's talk",
    cadence: "larger or multi-agent builds",
    who: "Bigger scope, multiple agents, or a longer engagement.",
    points: [
      "Multi-agent systems / orchestration (OpenClaw in prod)",
      "Bespoke scope + timeline",
      "Fixed-price milestones where possible",
      "Independent contractor engagement",
    ],
    cta: { label: "Get in touch", href: BOOKING_MAILTO, solid: false },
  },
];

const proof = [
  { n: "5 days", l: "from scoping call to a shipped, deployed agent" },
  { n: "400%", l: "inference speed-up on a prior on-device ML pipeline (−60% CPU)" },
  { n: "$0 risk", l: "pay on delivery — miss the agreed scope, you don't pay" },
];

const steps = [
  ["30-min scope", "We agree the exact scope + success criteria, in writing."],
  ["5-day build", "I build it in your stack, with a daily check-in so there are no surprises."],
  ["Demo + handoff", "Working agent, deployed. Optionally continue as a fractional retainer."],
];

export default function Pricing() {
  return (
    <main className="min-h-screen bg-[var(--bg-dark)] text-[var(--text-primary)]">
      {/* header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-[rgba(17,19,24,0.7)] border-b border-[var(--border)]">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
              ← DISSID
            </Link>
            <span className="text-[var(--border)]">/</span>
            <span className="font-bold tracking-tight">Pricing</span>
          </div>
          <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" className="gradient-btn rounded-lg px-4 py-2 text-sm">
            Book a call
          </a>
        </div>
      </header>

      {/* hero */}
      <section className="px-4 pt-20 pb-14 border-b border-[var(--border)]">
        <div className="max-w-3xl mx-auto">
          <p className="text-sm uppercase tracking-widest text-[var(--text-muted)] font-bold mb-4">
            Pricing
          </p>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-[1.08]">
            Ship one production AI agent in{" "}
            <span className="gradient-text">5 days</span>. Pay on delivery.
          </h1>
          <p className="mt-6 text-lg text-[var(--text-secondary)] max-w-2xl">
            Fixed price, fixed scope, no open-ended hourly. One scoped agent or automation —
            designed, built, and deployed to your stack in a week. If it doesn&apos;t do what we
            scoped, you don&apos;t pay.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" className="gradient-btn rounded-lg px-5 py-3 text-sm">
              Book a scoping call
            </a>
            <a
              href="#how"
              className="rounded-lg px-5 py-3 text-sm font-bold border border-[var(--border)] hover:border-[var(--border-active)] transition-colors"
            >
              How it works
            </a>
          </div>
        </div>
      </section>

      {/* proof */}
      <section className="px-4 py-16 border-b border-[var(--border)]">
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-5">
          {proof.map((p) => (
            <div key={p.l} className="glass-panel rounded-xl p-7">
              <div className="text-4xl font-extrabold tracking-tight gradient-text">{p.n}</div>
              <div className="mt-3 text-sm text-[var(--text-muted)]">{p.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* tiers */}
      <section id="pricing" className="px-4 py-16 border-b border-[var(--border)]">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-extrabold tracking-tight">
            Simple, <span className="gradient-text">fixed-price</span> engagements.
          </h2>
          <p className="mt-4 text-sm text-[var(--text-secondary)] max-w-2xl">
            Start with a free scoping call. Most teams begin with a sprint and continue on a retainer.
          </p>
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {tiers.map((t) => (
              <div
                key={t.name}
                className={`glass-panel rounded-xl p-6 flex flex-col ${t.feature ? "gradient-border" : ""}`}
              >
                {t.feature && (
                  <span className="self-start text-[10px] font-bold tracking-widest uppercase rounded px-2 py-0.5 mb-3 gradient-btn">
                    Most popular
                  </span>
                )}
                <h3 className="font-mono text-lg font-bold">{t.name}</h3>
                <div
                  className="mt-2 text-2xl font-extrabold tracking-tight"
                  style={t.free ? { color: "var(--tertiary)" } : undefined}
                >
                  {t.price}
                  {t.unit && <span className="text-xs font-normal font-mono text-[var(--text-muted)]"> {t.unit}</span>}
                </div>
                <p className="mt-1 text-[11px] font-mono text-[var(--text-muted)]">{t.cadence}</p>
                <p className="mt-3 text-xs text-[var(--text-muted)] min-h-[48px]">{t.who}</p>
                <ul className="mt-3 mb-6 space-y-2 flex-1">
                  {t.points.map((p) => (
                    <li key={p} className="text-[13px] text-[var(--text-secondary)] pl-5 relative leading-snug">
                      <span className="absolute left-0 text-[var(--tertiary)]">✓</span>
                      {p}
                    </li>
                  ))}
                </ul>
                <a
                  href={t.cta.href}
                  target={t.cta.href.startsWith("http") ? "_blank" : undefined}
                  rel={t.cta.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className={`mt-auto text-center rounded-lg px-3 py-2.5 text-sm font-bold transition-colors ${
                    t.cta.solid
                      ? "gradient-btn"
                      : "border border-[var(--border)] hover:border-[var(--border-active)]"
                  }`}
                >
                  {t.cta.label}
                </a>
              </div>
            ))}
          </div>
          <p className="mt-6 text-xs text-[var(--text-muted)] text-center">
            Independent contractor · remote, your timezone · invoice on delivery (sprint) or monthly
            (retainer). Not sure if your idea fits a 5-day sprint? The scoping call is free — let&apos;s find out.
          </p>
        </div>
      </section>

      {/* how it works */}
      <section id="how" className="px-4 py-16 border-b border-[var(--border)]">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-extrabold tracking-tight">How a sprint works</h2>
          <div className="mt-8 space-y-4">
            {steps.map(([t, d], i) => (
              <div key={t} className="glass-panel rounded-xl p-6 flex gap-5 items-start">
                <div className="text-2xl font-extrabold gradient-text font-mono shrink-0 w-8">{i + 1}</div>
                <div>
                  <h3 className="font-bold">{t}</h3>
                  <p className="text-sm text-[var(--text-secondary)] mt-1">{d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* final cta */}
      <section className="px-4 py-20 text-center">
        <div className="max-w-xl mx-auto">
          <h2 className="text-3xl font-extrabold tracking-tight">One sprint slot is open.</h2>
          <p className="mt-4 text-sm text-[var(--text-secondary)]">
            Book a 20–30 minute scoping call. We&apos;ll define exactly what gets shipped — and you decide
            from there.
          </p>
          <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" className="inline-block mt-7 gradient-btn rounded-lg px-6 py-3 text-sm">
            Book a scoping call
          </a>
        </div>
      </section>

      {/* footer */}
      <footer className="px-4 py-12 border-t border-[var(--border)]">
        <div className="max-w-5xl mx-auto text-sm text-[var(--text-muted)]">
          <span className="gradient-text font-bold">DISSID</span> — production AI agents, shipped fast.
          Siddhant Badola · Waterloo, ON ·{" "}
          <Link href="/" className="hover:text-[var(--text-primary)]">dissid.ai</Link>
          <p className="mt-3 text-xs">
            Independent contractor engagements. Fixed-price sprints, pay on delivery. ·{" "}
            <Link href="/tokencut" className="hover:text-[var(--text-primary)]">tokencut</Link>
          </p>
        </div>
      </footer>
    </main>
  );
}
