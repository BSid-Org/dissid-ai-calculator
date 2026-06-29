import type { Metadata } from "next";
import Link from "next/link";
import Soc2Scanner from "../components/Soc2Scanner";
import Footer from "../components/Footer";
import ErrorBoundaryWrapper from "../components/ErrorBoundaryWrapper";
import { BOOKING_URL } from "../lib/booking";

export const metadata: Metadata = {
  title: "SOC 2 Readiness Scanner — Free Self-Assessment | DISSID",
  description:
    "Assess your startup's SOC 2 audit-readiness in minutes. Grounded in the AICPA Trust Services Criteria — get a scored gap report and a prioritized remediation roadmap.",
  alternates: { canonical: "https://dissid.ai/soc2-readiness" },
  openGraph: {
    title: "SOC 2 Readiness Scanner — Free Self-Assessment | DISSID",
    description:
      "Assess your startup's SOC 2 audit-readiness in minutes. Scored gap report + prioritized remediation roadmap, grounded in the AICPA Trust Services Criteria.",
    url: "https://dissid.ai/soc2-readiness",
    siteName: "DISSID",
    type: "website",
  },
};

export default function Soc2ReadinessPage() {
  return (
    <ErrorBoundaryWrapper>
      <main>
        {/* Page header — sub-routes can't use the home page's hash nav, so a
            lightweight header links back home + to a call. */}
        <header className="border-b border-[var(--border)]">
          <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
            <Link href="/" className="text-xl font-bold tracking-tighter">
              <span className="gradient-text">DISSID</span>
            </Link>
            <div className="flex items-center gap-6">
              <Link
                href="/"
                className="text-sm font-semibold text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
              >
                Home
              </Link>
              <a
                href={BOOKING_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="gradient-btn rounded-lg px-5 py-2 text-sm font-bold"
              >
                Book a Call
              </a>
            </div>
          </div>
        </header>

        <section className="pt-16 pb-4 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-[var(--primary)] mb-4">
              <span className="material-symbols-outlined text-base">
                security
              </span>
              Free SOC 2 Self-Assessment
            </span>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">
              How <span className="gradient-text">SOC 2 audit-ready</span> is
              your startup?
            </h1>
            <p className="text-[var(--text-secondary)] max-w-xl mx-auto">
              Answer ~22 questions mapped to the AICPA Trust Services Criteria.
              Get a scored readiness report, a per-category breakdown, and a
              prioritized list of the gaps to close first.
            </p>
          </div>
        </section>

        <Soc2Scanner />

        <Footer />
      </main>
    </ErrorBoundaryWrapper>
  );
}
