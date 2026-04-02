"use client";

export default function Footer() {
  return (
    <footer className="py-20 sm:py-28 px-4">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
          Ready to <span className="gradient-text">Automate</span> Your
          Business?
        </h2>
        <p className="text-[var(--text-secondary)] max-w-lg mx-auto mb-8">
          Book a free 15-minute assessment and find out how much AI automation
          could save your business.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
          <a
            href="mailto:siddhant@dissid.ca?subject=Free%2015-Min%20AI%20Assessment"
            className="gradient-btn rounded-xl px-8 py-4 text-base font-bold flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-lg">
              calendar_month
            </span>
            Book a Free 15-Min Assessment
          </a>
        </div>

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
            try our calculator above
          </button>{" "}
          to see your potential savings
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
              dissid.ca — Scanner Shredder
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
