"use client";

import { motion, useReducedMotion } from "framer-motion";
import MetricCounter from "./MetricCounter";

// Anonymized outcome cards — every number is from real shipped work (CV-verified).
// No client names, no testimonials.
const outcomes = [
  {
    headline: "4-hour batch → 3-second response",
    context:
      "Re-architected an overnight data pipeline to run in real time for a system serving live production traffic.",
  },
  {
    headline: "20% → 80% user retention",
    context:
      "Led an end-to-end product redesign that quadrupled how many users stuck around.",
  },
  {
    headline: "$2M+/mo revenue impact",
    context:
      "Built and shipped systems whose measured output drove seven-figure monthly revenue.",
  },
];

// Framer-only animation props type for motion.div usage
type CardMotionProps = {
  initial?: object | boolean;
  whileInView?: object;
  viewport?: object;
  transition?: object;
};

export default function MetricsSection() {
  // prefersReducedMotion may be null on first render — treat null as false
  const prefersReducedMotion = useReducedMotion();

  // Stagger config per card
  const cardVariants = {
    hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 30 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        delay: i * 0.08,
      },
    }),
  };

  return (
    <section id="metrics" className="py-20 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Section heading */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3">
            Proof of <span className="gradient-text">Scale</span>
          </h2>
          <p className="text-[var(--text-muted)] max-w-lg mx-auto">
            Measurable impact from systems I&apos;ve shipped to production
          </p>
        </motion.div>

        {/* 5-card grid: 1 col → 2 col (sm) → 5 col (lg) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
          {/* Card 1: 400% Inference Speedup */}
          <motion.div
            className="glass-panel card-glow rounded-xl p-6 text-center"
            custom={0}
            initial={prefersReducedMotion ? false : "hidden"}
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={cardVariants}
          >
            <div className="text-3xl sm:text-4xl font-extrabold text-[var(--primary)] mb-2">
              <MetricCounter target={400} suffix="%" />
            </div>
            <p className="font-semibold text-sm mb-1">Inference Speedup</p>
            <p className="text-xs text-[var(--text-muted)]">
              On-device computer vision
            </p>
          </motion.div>

          {/* Card 2: 4 hr → 3 sec — STATIC, no counter */}
          <motion.div
            className="glass-panel card-glow rounded-xl p-6 text-center"
            custom={1}
            initial={prefersReducedMotion ? false : "hidden"}
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={cardVariants}
          >
            <div className="text-2xl sm:text-3xl font-extrabold text-[var(--primary)] mb-2 whitespace-nowrap">
              4 hr → 3 sec
            </div>
            <p className="font-semibold text-sm mb-1">Pipeline Latency</p>
            <p className="text-xs text-[var(--text-muted)]">
              From overnight batch to real-time
            </p>
          </motion.div>

          {/* Card 3: 60% CPU Reduction */}
          <motion.div
            className="glass-panel card-glow rounded-xl p-6 text-center"
            custom={2}
            initial={prefersReducedMotion ? false : "hidden"}
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={cardVariants}
          >
            <div className="text-3xl sm:text-4xl font-extrabold text-[var(--primary)] mb-2">
              <MetricCounter target={60} suffix="%" />
            </div>
            <p className="font-semibold text-sm mb-1">CPU Reduction</p>
            <p className="text-xs text-[var(--text-muted)]">
              Same workload, fraction of the compute
            </p>
          </motion.div>

          {/* Card 4: $2M+/mo Revenue Impact */}
          <motion.div
            className="glass-panel card-glow rounded-xl p-6 text-center"
            custom={3}
            initial={prefersReducedMotion ? false : "hidden"}
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={cardVariants}
          >
            <div className="text-3xl sm:text-4xl font-extrabold text-[var(--primary)] mb-2">
              <MetricCounter target={2} prefix="$" suffix="M+/mo" />
            </div>
            <p className="font-semibold text-sm mb-1">Revenue Impact</p>
            <p className="text-xs text-[var(--text-muted)]">
              Systems serving production traffic
            </p>
          </motion.div>

          {/* Card 5: 20% → 80% User Retention — hybrid: static prefix + counter */}
          <motion.div
            className="glass-panel card-glow rounded-xl p-6 text-center"
            custom={4}
            initial={prefersReducedMotion ? false : "hidden"}
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={cardVariants}
          >
            <div className="text-3xl sm:text-4xl font-extrabold text-[var(--primary)] mb-2 inline-flex items-baseline gap-0">
              <span className="whitespace-nowrap">20% →&nbsp;</span>
              <MetricCounter target={80} suffix="%" />
            </div>
            <p className="font-semibold text-sm mb-1">User Retention</p>
            <p className="text-xs text-[var(--text-muted)]">
              After end-to-end redesign
            </p>
          </motion.div>
        </div>

        {/* Outcome case studies — anonymized, every number traces to real work */}
        <motion.div
          className="text-center mt-20 mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
        >
          <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-3">
            Selected <span className="gradient-text">Outcomes</span>
          </h3>
          <p className="text-[var(--text-muted)] max-w-lg mx-auto">
            What that scale looked like in production
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {outcomes.map((o, i) => (
            <motion.div
              key={o.headline}
              className="outcome-card glass-panel rounded-xl p-6"
              custom={i}
              initial={prefersReducedMotion ? false : "hidden"}
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              variants={cardVariants}
            >
              <p className="text-xl font-extrabold text-[var(--primary)] mb-3">
                {o.headline}
              </p>
              <p className="text-sm text-[var(--text-secondary)]">
                {o.context}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
