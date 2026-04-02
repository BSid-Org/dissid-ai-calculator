"use client";

import { motion } from "framer-motion";

export default function Hero() {
  const handleScroll = () => {
    document
      .getElementById("calculator")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-4">
      {/* Animated gradient background */}
      <div className="absolute inset-0 -z-10">
        <motion.div
          className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full opacity-20 blur-[120px]"
          style={{ background: "var(--primary)" }}
          animate={{
            x: [0, 60, -40, 0],
            y: [0, -40, 60, 0],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full opacity-15 blur-[120px]"
          style={{ background: "var(--secondary)" }}
          animate={{
            x: [0, -50, 30, 0],
            y: [0, 50, -30, 0],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full opacity-10 blur-[100px]"
          style={{ background: "var(--tertiary)" }}
          animate={{
            scale: [1, 1.3, 1],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <p className="text-sm uppercase tracking-widest text-[var(--text-muted)] font-bold mb-6">
            AI Automation for Small Businesses
          </p>
        </motion.div>

        <motion.h1
          className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight leading-tight mb-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
        >
          <span className="gradient-text">AI Agents</span> That Run Your{" "}
          <br className="hidden sm:block" />
          Business While You Sleep
        </motion.h1>

        <motion.p
          className="text-lg sm:text-xl text-[var(--text-secondary)] max-w-2xl mx-auto mb-10"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
        >
          We build custom AI automation that cuts operational costs by 40-70%
          for small businesses in Kitchener-Waterloo and beyond.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.45, ease: "easeOut" }}
        >
          <button
            onClick={handleScroll}
            className="gradient-btn rounded-xl px-8 py-4 text-base font-bold flex items-center gap-2"
          >
            See Your Savings
            <span className="material-symbols-outlined text-lg">
              arrow_forward
            </span>
          </button>
          <a
            href="mailto:siddhant@dissid.ca?subject=Free%20AI%20Assessment"
            className="rounded-xl border border-[var(--border)] px-8 py-4 text-base font-semibold text-[var(--text-secondary)] hover:bg-[var(--bg-card-hover)] hover:border-[var(--border-active)] transition-all"
          >
            Book Free Assessment
          </a>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <span className="material-symbols-outlined text-[var(--text-muted)] text-2xl">
          expand_more
        </span>
      </motion.div>
    </section>
  );
}
