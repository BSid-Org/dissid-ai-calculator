"use client";

import { motion } from "framer-motion";

const steps = [
  {
    number: "01",
    title: "Assess",
    icon: "query_stats",
    description:
      "We analyze your operations to find the highest-ROI automation opportunities",
  },
  {
    number: "02",
    title: "Build",
    icon: "code",
    description:
      "Custom AI agents built specifically for your workflows and tools",
  },
  {
    number: "03",
    title: "Deploy",
    icon: "rocket_launch",
    description:
      "Go live in weeks, not months. We handle integration and training",
  },
];

export default function HowItWorks() {
  return (
    <div className="py-20 sm:py-28 px-4">
      <div className="max-w-5xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-sm uppercase tracking-widest text-[var(--text-muted)] font-bold mb-4">
            How It Works
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            From Assessment to <span className="gradient-text">Automation</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              className="glass-panel card-glow rounded-xl p-8 relative group"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
            >
              {/* Step number */}
              <div className="text-5xl font-extrabold text-[var(--surface-lowest)] absolute top-4 right-4 select-none">
                {step.number}
              </div>

              <div className="relative z-10">
                <div className="w-12 h-12 rounded-xl bg-[var(--surface-lowest)] flex items-center justify-center mb-5 group-hover:bg-[var(--bg-card-hover)] transition-colors">
                  <span className="material-symbols-outlined text-[var(--primary)] text-2xl">
                    {step.icon}
                  </span>
                </div>

                <h3 className="text-xl font-bold mb-3 gradient-text">
                  {step.title}
                </h3>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
