"use client";

import { motion } from "framer-motion";
import HeroAgentSystem from "./HeroAgentSystem";
import { BOOKING_URL, BOOKING_MAILTO } from "../lib/booking";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-4">
      {/* Animated gradient background — CSS keyframes (compositor, off main thread).
          Disabled under prefers-reduced-motion via globals.css. */}
      <div className="absolute inset-0 -z-10" aria-hidden="true">
        <div
          className="hero-blob hero-blob-1"
          style={{ background: "var(--primary)" }}
        />
        <div
          className="hero-blob hero-blob-2"
          style={{ background: "var(--secondary)" }}
        />
        <div
          className="hero-blob hero-blob-3"
          style={{ background: "var(--tertiary)" }}
        />
      </div>

      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <p className="text-sm uppercase tracking-widest text-[var(--text-muted)] font-bold mb-6">
            Siddhant Badola · Kitchener-Waterloo
          </p>
        </motion.div>

        <motion.h1
          className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight leading-tight mb-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
        >
          Senior <span className="gradient-text">AI / Agentic Systems</span>{" "}
          <br className="hidden sm:block" />
          Engineer
        </motion.h1>

        <motion.p
          className="text-lg sm:text-xl text-[var(--text-secondary)] max-w-2xl mx-auto mb-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
        >
          I build production agent fleets, MCP integrations, and AI systems that
          ship. Open to full-time and fractional engagements.
        </motion.p>

        {/* Availability signal — static, no animation */}
        <motion.div
          className="mb-10 flex justify-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.38, ease: "easeOut" }}
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface-lowest)] px-4 py-1.5 text-sm font-semibold text-[var(--text-secondary)]">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75 motion-safe:animate-ping" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-400" />
            </span>
            Available for fractional &amp; contract work now
          </span>
        </motion.div>

        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.45, ease: "easeOut" }}
        >
          <a
            href={BOOKING_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="gradient-btn rounded-xl px-8 py-4 text-base font-bold flex items-center gap-2"
          >
            Book a Call
            <span className="material-symbols-outlined text-lg">
              arrow_forward
            </span>
          </a>
          <a
            href="https://github.com/sidhunt"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl border border-[var(--border)] px-8 py-4 text-base font-semibold text-[var(--text-secondary)] hover:bg-[var(--bg-card-hover)] hover:border-[var(--border-active)] transition-all"
          >
            GitHub
          </a>
          <a
            href="https://linkedin.com/in/sbadola5"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl border border-[var(--border)] px-8 py-4 text-base font-semibold text-[var(--text-secondary)] hover:bg-[var(--bg-card-hover)] hover:border-[var(--border-active)] transition-all"
          >
            LinkedIn
          </a>
        </motion.div>

        <motion.p
          className="mt-4 text-sm text-[var(--text-muted)]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.55, ease: "easeOut" }}
        >
          Prefer email?{" "}
          <a
            href={BOOKING_MAILTO}
            className="text-[var(--primary)] hover:underline font-semibold"
          >
            Email me directly
          </a>
        </motion.p>

        {/* Agent system visual */}
        <motion.div
          className="mt-10 flex justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6, ease: "easeOut" }}
        >
          <HeroAgentSystem />
        </motion.div>
      </div>

      {/* Scroll indicator — CSS bounce, reduced-motion safe via globals.css */}
      <div className="hero-scroll-indicator absolute bottom-8 left-1/2 -translate-x-1/2">
        <span className="material-symbols-outlined text-[var(--text-muted)] text-2xl">
          expand_more
        </span>
      </div>
    </section>
  );
}
