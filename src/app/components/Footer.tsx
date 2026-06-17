"use client";

import { BOOKING_URL, BOOKING_MAILTO } from "../lib/booking";

export default function Footer() {
  return (
    <footer className="py-20 sm:py-28 px-4">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
          Let&apos;s <span className="gradient-text">Build</span> Something
        </h2>
        <p className="text-[var(--text-secondary)] max-w-lg mx-auto mb-8">
          Open to full-time roles and fractional engagements — agentic systems,
          AI platforms, and hardware.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-4">
          <a
            href={BOOKING_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="gradient-btn rounded-xl px-8 py-4 text-base font-bold flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-lg">event</span>
            Book a Call
          </a>
        </div>

        <p className="text-sm text-[var(--text-muted)] mb-6">
          Prefer email?{" "}
          <a
            href={BOOKING_MAILTO}
            className="text-[var(--primary)] hover:underline font-semibold"
          >
            Email me directly
          </a>
        </p>

        <p className="text-sm text-[var(--text-muted)] mb-12">
          Or{" "}
          <button
            onClick={() =>
              document
                .getElementById("calculator")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            className="text-[var(--primary)] hover:underline font-semibold"
          >
            try the ROI calculator above
          </button>{" "}
          — a live demo of the kind of tools I ship
        </p>

        <div className="border-t border-[var(--border)] pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[var(--text-muted)]">
          <span>&copy; 2026 DISSID. All rights reserved.</span>
          <div className="flex items-center gap-6">
            <a
              href="https://dissid.ai"
              className="hover:text-[var(--text-primary)] transition-colors font-semibold"
            >
              dissid.ai
            </a>
            <a
              href="https://dissid.ca"
              className="hover:text-[var(--text-primary)] transition-colors font-semibold"
            >
              dissid.ca
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
