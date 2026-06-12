"use client";

import { motion } from "framer-motion";

const skills = [
  "Python",
  "TypeScript",
  "Go",
  "MCP Integrations",
  "Voice AI",
  "Computer Vision",
];

const certifications = [
  { label: "AWS", icon: "cloud" },
  { label: "Azure", icon: "cloud" },
  { label: "GCP", icon: "cloud" },
];

export default function About() {
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
            About
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Built by an <span className="gradient-text">Engineer</span>, Not a
            Salesperson
          </h2>
        </motion.div>

        <motion.div
          className="glass-panel rounded-xl p-8 sm:p-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8 sm:gap-12">
            {/* Photo placeholder */}
            <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] flex items-center justify-center shrink-0">
              <span className="text-3xl sm:text-4xl font-extrabold text-[var(--bg-dark)]">
                SB
              </span>
            </div>

            <div className="flex-1 text-center sm:text-left">
              <h3 className="text-2xl font-bold mb-1">Sid Badola</h3>
              <p className="text-[var(--text-muted)] text-sm font-semibold mb-4">
                7+ years building production AI systems
              </p>

              <p className="text-[var(--text-secondary)] text-sm leading-relaxed mb-6">
                Based in Kitchener-Waterloo. I ship production systems
                end-to-end — agent fleets, MCP servers, voice and vision
                pipelines, and AI hardware. Founder of{" "}
                <a
                  href="https://dissid.ca"
                  className="text-[var(--primary)] hover:underline font-semibold"
                >
                  DISSID
                </a>{" "}
                (scan-before-shred device, provisional patent, raising seed).
              </p>

              {/* Skills */}
              <div className="flex flex-wrap justify-center sm:justify-start gap-2 mb-6">
                {skills.map((skill) => (
                  <span
                    key={skill}
                    className="text-xs px-3 py-1.5 rounded-full border border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--primary)] hover:text-[var(--primary)] transition-colors"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              {/* Certifications */}
              <div className="flex items-center justify-center sm:justify-start gap-4">
                {certifications.map((cert) => (
                  <div
                    key={cert.label}
                    className="flex items-center gap-1.5 text-xs text-[var(--text-muted)]"
                  >
                    <span className="material-symbols-outlined text-base text-[var(--primary)]">
                      {cert.icon}
                    </span>
                    <span className="font-semibold">
                      {cert.label} Certified
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
