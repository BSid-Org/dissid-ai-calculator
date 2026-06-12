"use client";

import { motion, useReducedMotion, useInView } from "framer-motion";
import { useRef } from "react";

// viewBox: 500 × 180
// Node centers at x=80, x=250, x=420 — all y=80
// Circle r=40, so circles span y=40 to y=120
// Connector lines from right edge of left circle to left edge of right circle:
//   line 1: x1=120, x2=210 (gap between node1 and node2)
//   line 2: x1=290, x2=380 (gap between node2 and node3)
//
// Text scale at 375px viewport: 375/500 = 0.75×
//   Label fontSize=16 → 12px rendered (legible)
//   Desc  fontSize=14 → 10.5px rendered (borderline — acceptable for muted secondary text)
//   For node3 desc ("Email · Calendar · Devices") which is longer, we split to two lines.
//
// Desc text is placed below the label at y+20 (label at cy, desc at cy+18)

const nodes = [
  {
    cx: 80,
    cy: 80,
    label: "Orchestrator",
    desc: "Mac",
  },
  {
    cx: 250,
    cy: 80,
    label: "Agent Fleet",
    desc: "VPS",
  },
  {
    cx: 420,
    cy: 80,
    label: "Integrations",
    // Split into two lines to avoid overflow in the r=40 area
    desc: "Email · Calendar",
    desc2: "· Devices",
  },
];

const connectors = [
  { x1: 120, y1: 80, x2: 210, y2: 80 },
  { x1: 290, y1: 80, x2: 380, y2: 80 },
];

export default function ArchitectureFleet() {
  const svgRef = useRef<SVGSVGElement>(null);
  const inView = useInView(svgRef, { once: true, margin: "-50px" });
  // may be null on first render — treat null as false (motion allowed)
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      <svg
        ref={svgRef}
        role="img"
        aria-label="System architecture: Mac orchestrator controls an agent fleet on a VPS, which drives integrations like email, calendar, and devices"
        viewBox="0 0 500 180"
        className="w-full max-w-2xl h-auto"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Connector lines — pulse animation or static */}
        {connectors.map((conn, i) => (
          <motion.line
            key={`connector-${i}`}
            x1={conn.x1}
            y1={conn.y1}
            x2={conn.x2}
            y2={conn.y2}
            stroke="var(--primary)"
            strokeWidth={2}
            strokeOpacity={prefersReducedMotion === true ? 0.5 : undefined}
            initial={prefersReducedMotion === true ? false : { opacity: 0.3 }}
            animate={
              prefersReducedMotion === true ? {} : { opacity: [0.3, 1, 0.3] }
            }
            transition={
              prefersReducedMotion === true
                ? undefined
                : {
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: i * 0.3,
                  }
            }
          />
        ))}

        {/* Node circles — staggered fade-in on inView */}
        {nodes.map((node, i) => (
          <motion.circle
            key={`circle-${i}`}
            cx={node.cx}
            cy={node.cy}
            r={40}
            fill="var(--bg-card)"
            stroke="var(--primary)"
            strokeWidth={2}
            style={{ filter: "var(--glow-sm)" }}
            initial={prefersReducedMotion === true ? false : { opacity: 0 }}
            animate={
              inView || prefersReducedMotion === true
                ? { opacity: 1 }
                : { opacity: 0 }
            }
            transition={
              prefersReducedMotion === true
                ? { duration: 0 }
                : {
                    duration: 0.5,
                    delay: i * 0.15,
                    ease: "easeOut",
                  }
            }
          />
        ))}

        {/* Node labels and descriptions — inline SVG text (no Tailwind text-* on SVG) */}
        {nodes.map((node, i) => (
          <motion.g
            key={`label-${i}`}
            initial={prefersReducedMotion === true ? false : { opacity: 0 }}
            animate={
              inView || prefersReducedMotion === true
                ? { opacity: 1 }
                : { opacity: 0 }
            }
            transition={
              prefersReducedMotion === true
                ? { duration: 0 }
                : {
                    duration: 0.5,
                    delay: i * 0.15 + 0.1,
                    ease: "easeOut",
                  }
            }
          >
            {/* Label — fontSize 16, bold */}
            <text
              x={node.cx}
              y={node.desc2 ? node.cy - 10 : node.cy - 4}
              textAnchor="middle"
              dominantBaseline="middle"
              style={{
                fontSize: 16,
                fontWeight: 700,
                fill: "var(--text-primary)",
              }}
            >
              {node.label}
            </text>
            {/* Desc line 1 — fontSize 14 (→ ~10.5px at 375px, acceptable for muted secondary) */}
            <text
              x={node.cx}
              y={node.desc2 ? node.cy + 10 : node.cy + 14}
              textAnchor="middle"
              dominantBaseline="middle"
              style={{
                fontSize: 14,
                fill: "var(--text-muted)",
              }}
            >
              {node.desc}
            </text>
            {/* Desc line 2 (node3 only) */}
            {"desc2" in node && node.desc2 && (
              <text
                x={node.cx}
                y={node.cy + 26}
                textAnchor="middle"
                dominantBaseline="middle"
                style={{
                  fontSize: 14,
                  fill: "var(--text-muted)",
                }}
              >
                {node.desc2}
              </text>
            )}
          </motion.g>
        ))}
      </svg>

      {/* Visible caption below SVG */}
      <p className="text-sm text-center" style={{ color: "var(--text-muted)" }}>
        One orchestrator, a fleet of agents, your tools — running around the
        clock.
      </p>
    </div>
  );
}
