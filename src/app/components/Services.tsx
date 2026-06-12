"use client";

import { motion } from "framer-motion";

const services = [
  {
    title: "Agentic Fleets & MCP Servers",
    icon: "auto_awesome",
    description:
      "Multi-agent orchestration, MCP integrations, task routing across LLM providers",
    savings: "Claude Code · OpenAI · self-hosted",
  },
  {
    title: "AI Hardware",
    icon: "memory",
    description:
      "DISSID scanner-shredder: scan-before-shred device, provisional patent, manufacturing SOW",
    savings: "Founder · dissid.ca",
  },
  {
    title: "Voice & Computer Vision",
    icon: "support_agent",
    description:
      "Voice pipelines (TTS/STT, wake-word), on-device CV with 400% inference speedups",
    savings: "Production-deployed",
  },
  {
    title: "LLMOps & Cost Engineering",
    icon: "trending_up",
    description:
      "Provider routing, token-budget systems, observability — real systems, measured savings",
    savings: "Kafka · FastAPI · Firebase",
  },
];

export default function Services() {
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
            What I Build
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Production AI Systems,{" "}
            <span className="gradient-text">Not Demos</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {services.map((service, i) => (
            <motion.div
              key={service.title}
              className="glass-panel card-glow rounded-xl p-8 group hover:scale-[1.02] transition-all duration-200"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <div className="flex items-start gap-5">
                <div className="w-12 h-12 rounded-xl bg-[var(--surface-lowest)] flex items-center justify-center shrink-0 group-hover:bg-[var(--bg-card-hover)] transition-colors">
                  <span className="material-symbols-outlined text-[var(--primary)] text-2xl">
                    {service.icon}
                  </span>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold mb-1">{service.title}</h3>
                  <p className="text-sm text-[var(--text-secondary)] mb-3">
                    {service.description}
                  </p>
                  <span className="inline-block text-sm font-bold gradient-text">
                    {service.savings}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
