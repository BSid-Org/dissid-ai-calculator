import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "tokencut — the verified semantic cache | DISSID",
  description:
    "In a regulated or customer-facing LLM app, a wrong cached answer is a trust and compliance failure — not a rounding error. Naive semantic caches serve wrong answers 9–52% of the time with no safe threshold; tokencut bounds the rate to ≤1% false-hit, measured on 5,000 labeled pairs. Reuse you can trust and prove.",
  alternates: { canonical: "https://dissid.ai/tokencut" },
  openGraph: {
    title: "tokencut — the verified semantic cache",
    description:
      "A wrong cached answer in a regulated app is a compliance failure, not a rounding error. tokencut bounds the rate — ≤1% false-hit, measured — so you can reuse and prove it.",
    url: "https://dissid.ai/tokencut",
    siteName: "DISSID",
    type: "website",
  },
};

const PILOT_MAILTO =
  "mailto:sid@dissid.ca?subject=tokencut%20pilot%20%E2%80%94%20benchmark%20on%20our%20traffic";

const stats = [
  { n: "9–52%", l: "wrong-answer rate of a naive cosine cache across its usable range", bad: true },
  { n: "~9%", l: "the floor — even at the strictest threshold, where recall collapses to 1.6%", bad: true },
  { n: "≤1%", l: "tokencut's bounded false-hit rate — a safe point cosine alone can't reach", bad: false },
];

const naiveFrontier = [
  ["0.50", "76.5%", "52.3%", "99.8%"],
  ["0.80", "41.4%", "32.6%", "76.3%"],
  ["0.90", "20.0%", "24.1%", "41.5%"],
  ["0.995", "0.7%", "9.1%", "1.6%"],
];

const tiers = [
  {
    name: "Open Source",
    price: "Free",
    free: true,
    who: "Engineers who want to self-host and verify the claims.",
    points: [
      "The two-stage verified gate, self-hosted",
      "The full public benchmark — reproduce every number",
      "Tune your own false-hit ceiling",
      "Community support",
    ],
    cta: { label: "See the benchmark ↗", href: "https://tokencut.web.app", solid: false },
  },
  {
    name: "Pilot",
    price: "Free",
    free: true,
    feature: true,
    who: "Teams in regulated / high-repeat domains de-risking the wedge.",
    points: [
      "We run the benchmark on your production traffic",
      "Your current cache's false-hit rate, measured",
      "Your frontier plot — where you hit ≤1% false-hit",
      "Shared technical briefing, no commitment",
    ],
    cta: { label: "Run it on your traffic", href: PILOT_MAILTO, solid: true },
  },
  {
    name: "Pro",
    price: "Usage-based",
    unit: "/ verified lookup",
    who: "Production teams who want it managed, not maintained.",
    points: [
      "Hosted verified cache, managed updates",
      "Pay only for lookups the verifier serves",
      "Frontier dashboard + false-hit monitoring",
      "Email support",
    ],
    cta: {
      label: "Talk to us",
      href: "mailto:sid@dissid.ca?subject=tokencut%20Pro%20%E2%80%94%20usage%20pricing",
      solid: false,
    },
  },
  {
    name: "Enterprise",
    price: "Custom",
    who: "Regulated buyers who need the ceiling contractually guaranteed.",
    points: [
      "SLA on the false-hit rate",
      "SSO, audit logging, on-prem / VPC option",
      "Compliance review + security questionnaire",
      "Priority support",
    ],
    cta: {
      label: "Talk to us",
      href: "mailto:sid@dissid.ca?subject=tokencut%20Enterprise%20%E2%80%94%20SLA%20%2B%20deployment",
      solid: false,
    },
  },
];

export default function TokencutProduct() {
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
            <span className="font-bold tracking-tight">
              token<span className="gradient-text">cut</span>
            </span>
          </div>
          <a href={PILOT_MAILTO} className="gradient-btn rounded-lg px-4 py-2 text-sm">
            Talk to us
          </a>
        </div>
      </header>

      {/* hero */}
      <section className="px-4 pt-20 pb-14 border-b border-[var(--border)]">
        <div className="max-w-3xl mx-auto">
          <p className="text-sm uppercase tracking-widest text-[var(--text-muted)] font-bold mb-4">
            A DISSID product
          </p>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-[1.08]">
            Your semantic cache{" "}
            <span className="gradient-text">returns wrong answers</span> — and nobody measures how often.
          </h1>
          <p className="mt-6 text-lg text-[var(--text-secondary)] max-w-2xl">
            In a regulated or customer-facing app, a wrong cached answer isn&apos;t a rounding error —
            it&apos;s a trust and compliance failure. tokencut is a drop-in LLM cache with a mandatory
            verifier that bounds your false-hit rate — the share of times the cache serves a wrong answer
            for a similar-but-different query — to a level you set and can prove. The first cache with a
            measurable, tunable wrong-answer ceiling: <span className="text-[var(--text-primary)] font-semibold">reuse you can trust</span>.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#pricing" className="gradient-btn rounded-lg px-5 py-3 text-sm">
              See pricing
            </a>
            <a
              href={PILOT_MAILTO}
              className="rounded-lg px-5 py-3 text-sm font-bold border border-[var(--border)] hover:border-[var(--border-active)] transition-colors"
            >
              Run the benchmark on your traffic
            </a>
          </div>
        </div>
      </section>

      {/* proof stats */}
      <section className="px-4 py-16 border-b border-[var(--border)]">
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-5">
          {stats.map((s) => (
            <div key={s.l} className="glass-panel rounded-xl p-7">
              <div
                className="text-4xl font-extrabold tracking-tight"
                style={{ color: s.bad ? "#ff6b6b" : "var(--tertiary)" }}
              >
                {s.n}
              </div>
              <div className="mt-3 text-sm text-[var(--text-muted)]">{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* measurement */}
      <section className="px-4 py-16 border-b border-[var(--border)]">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-extrabold tracking-tight">
            We measured it — on <span className="gradient-text">5,000 labeled pairs</span>.
          </h2>
          <p className="mt-4 text-sm text-[var(--text-secondary)]">
            Every LLM gateway ships semantic caching on a static cosine threshold. On 5,000 Quora
            Question Pairs (run locally, $0 API), a naive cache has no safe operating point — to catch
            most true duplicates you accept a ~43% wrong-answer rate; to push wrong answers down,
            recall collapses.
          </p>
          <div className="mt-6 glass-panel rounded-xl p-6 overflow-x-auto">
            <table className="w-full text-sm font-mono">
              <thead>
                <tr className="text-[var(--text-muted)] text-left">
                  <th className="pb-2 font-medium">cosine τ</th>
                  <th className="pb-2 font-medium text-right">cache rate</th>
                  <th className="pb-2 font-medium text-right">false-hit</th>
                  <th className="pb-2 font-medium text-right">recall</th>
                </tr>
              </thead>
              <tbody>
                {naiveFrontier.map((r) => (
                  <tr key={r[0]} className="border-t border-[var(--border)]">
                    <td className="py-2">{r[0]}</td>
                    <td className="py-2 text-right">{r[1]}</td>
                    <td className="py-2 text-right" style={{ color: "#ff6b6b" }}>{r[2]}</td>
                    <td className="py-2 text-right">{r[3]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="glass-panel rounded-xl p-6">
              <div className="text-xs font-mono text-[var(--tertiary)] tracking-widest mb-2">STAGE 1</div>
              <h3 className="font-bold mb-1">cosine pre-filter</h3>
              <p className="text-sm text-[var(--text-secondary)]">
                Fast embedding similarity narrows millions of cached entries to a short candidate
                shortlist — the cheap step every gateway already runs.
              </p>
            </div>
            <div className="glass-panel rounded-xl p-6">
              <div className="text-xs font-mono text-[var(--tertiary)] tracking-widest mb-2">STAGE 2</div>
              <h3 className="font-bold mb-1">cross-encoder verifier</h3>
              <p className="text-sm text-[var(--text-secondary)]">
                A lightweight verifier checks equivalence on the shortlist only — reaching{" "}
                <span className="text-[var(--text-primary)] font-semibold">≤1% false-hit at 22.7% recall</span>,
                a tunable ceiling no competitor exposes.
              </p>
            </div>
          </div>
          <p className="mt-6 text-xs text-[var(--text-muted)]">
            QQP is adversarial worst-case (deliberately near-duplicate hard negatives); on a real
            production stream the safe recall is typically higher. We claim only what we measured.
          </p>
        </div>
      </section>

      {/* pricing */}
      <section id="pricing" className="px-4 py-16 border-b border-[var(--border)]">
        <div className="max-w-5xl mx-auto">
          <p className="text-sm uppercase tracking-widest text-[var(--text-muted)] font-bold mb-3">
            Pricing
          </p>
          <h2 className="text-3xl font-extrabold tracking-tight">
            Open at the core. You pay for <span className="gradient-text">trusted reuse</span>, not for the gate.
          </h2>
          <p className="mt-4 text-sm text-[var(--text-secondary)] max-w-2xl">
            The verifier is open source — self-host it free, run the public benchmark, measure your own
            ceiling. You pay only when you want it run for you: a managed cache and an SLA on how often
            it can be wrong.
          </p>
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {tiers.map((t) => (
              <div
                key={t.name}
                className={`glass-panel rounded-xl p-6 flex flex-col ${
                  t.feature ? "gradient-border" : ""
                }`}
              >
                {t.feature && (
                  <span className="self-start text-[10px] font-bold tracking-widest uppercase rounded px-2 py-0.5 mb-3 gradient-btn">
                    Start here
                  </span>
                )}
                <h3 className="font-mono text-lg font-bold">{t.name}</h3>
                <div className="mt-2 text-2xl font-extrabold tracking-tight" style={t.free ? { color: "var(--tertiary)" } : undefined}>
                  {t.price}
                  {t.unit && <span className="text-xs font-normal font-mono text-[var(--text-muted)]"> {t.unit}</span>}
                </div>
                <p className="mt-2 text-xs text-[var(--text-muted)] min-h-[34px]">{t.who}</p>
                <ul className="mt-4 mb-6 space-y-2 flex-1">
                  {t.points.map((p) => (
                    <li key={p} className="text-[13px] text-[var(--text-secondary)] pl-5 relative leading-snug">
                      <span className="absolute left-0 text-[var(--tertiary)]">✓</span>
                      {p}
                    </li>
                  ))}
                </ul>
                <a
                  href={t.cta.href}
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
            Pre-revenue and design-partner-led — Pro and Enterprise are priced in conversation with our
            first cohort, not off a static rate card. The OSS gate and the pilot benchmark are, and will
            stay, free.
          </p>
        </div>
      </section>

      {/* final cta */}
      <section className="px-4 py-20 text-center">
        <div className="max-w-xl mx-auto">
          <h2 className="text-3xl font-extrabold tracking-tight">Run the benchmark on your data.</h2>
          <p className="mt-4 text-sm text-[var(--text-secondary)]">
            Design-partner pilots and seed conversations. Tell us your domain and rough query volume —
            we&apos;ll send back what a measurement on your traffic would look like.
          </p>
          <a href={PILOT_MAILTO} className="inline-block mt-7 gradient-btn rounded-lg px-6 py-3 text-sm">
            sid@dissid.ca
          </a>
        </div>
      </section>

      {/* footer */}
      <footer className="px-4 py-12 border-t border-[var(--border)]">
        <div className="max-w-5xl mx-auto text-sm text-[var(--text-muted)]">
          <span className="font-bold text-[var(--text-primary)]">
            token<span className="gradient-text">cut</span>
          </span>{" "}
          — the verified semantic cache. A DISSID Labs Inc. product · Waterloo, ON ·{" "}
          <a href="mailto:sid@dissid.ca" className="hover:text-[var(--text-primary)]">sid@dissid.ca</a>
          <p className="mt-3 text-xs font-mono">
            Benchmarks measured 2026-06-27 on 5,000 Quora Question Pairs, run locally at $0. Worst-case
            adversarial results; production workloads typically perform better. ·{" "}
            <Link href="/" className="hover:text-[var(--text-primary)]">dissid.ai</Link>
          </p>
        </div>
      </footer>
    </main>
  );
}
