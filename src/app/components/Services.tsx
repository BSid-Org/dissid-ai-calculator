"use client";

import { motion } from "framer-motion";

const services = [
  {
    title: "Customer Support AI",
    icon: "support_agent",
    description: "24/7 intelligent response handling",
    savings: "Save $2,000-4,000/mo",
  },
  {
    title: "Document Automation",
    icon: "description",
    description: "Contracts, proposals, invoices on autopilot",
    savings: "Save $1,500-3,000/mo",
  },
  {
    title: "Lead Generation AI",
    icon: "trending_up",
    description: "Automated prospecting and qualification",
    savings: "Save $2,500-5,000/mo",
  },
  {
    title: "Custom Agent Development",
    icon: "auto_awesome",
    description: "Bespoke AI agents for unique workflows",
    savings: "Starting at $3,000",
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
            What We Build
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            AI Solutions That{" "}
            <span className="gradient-text">Pay for Themselves</span>
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
