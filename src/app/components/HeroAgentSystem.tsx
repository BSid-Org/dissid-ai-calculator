"use client";

import { motion, useReducedMotion } from "framer-motion";

// 5 radial nodes at 0°, 72°, 144°, 216°, 288° on a 120px radius
// Center is at (160, 160) within a 320×320 viewBox
const CENTER = { x: 160, y: 160 };
const RADIUS = 120;

const nodes = Array.from({ length: 5 }, (_, i) => {
  const angleDeg = i * 72;
  const angleRad = (angleDeg * Math.PI) / 180;
  return {
    id: i,
    x: CENTER.x + RADIUS * Math.cos(angleRad),
    y: CENTER.y + RADIUS * Math.sin(angleRad),
  };
});

export default function HeroAgentSystem() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="flex flex-col items-center gap-3">
      {/* SVG sized ~320px desktop, ~240px mobile via width/height classes */}
      <svg
        aria-hidden="true"
        viewBox="0 0 320 320"
        className="w-60 h-60 sm:w-80 sm:h-80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Lines from center to each radial node */}
        {nodes.map((node, i) => (
          <motion.line
            key={`line-${node.id}`}
            x1={CENTER.x}
            y1={CENTER.y}
            x2={node.x}
            y2={node.y}
            stroke="var(--primary)"
            strokeOpacity={prefersReducedMotion ? 0.5 : undefined}
            strokeWidth={1.5}
            initial={prefersReducedMotion ? false : { opacity: 0.2 }}
            animate={prefersReducedMotion ? {} : { opacity: [0.2, 1, 0.2] }}
            transition={
              prefersReducedMotion
                ? undefined
                : {
                    duration: 2.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: i * 0.2,
                  }
            }
          />
        ))}

        {/* Radial nodes */}
        {nodes.map((node, i) => (
          <motion.circle
            key={`node-${node.id}`}
            cx={node.x}
            cy={node.y}
            r={12}
            fill="var(--primary)"
            style={{
              filter: "var(--glow-sm)",
            }}
            initial={prefersReducedMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={
              prefersReducedMotion
                ? { duration: 0 }
                : {
                    duration: 0.6,
                    delay: i * 0.1,
                    ease: "easeOut",
                  }
            }
          />
        ))}

        {/* Central node */}
        <motion.circle
          cx={CENTER.x}
          cy={CENTER.y}
          r={20}
          fill="var(--primary)"
          style={{
            filter: "var(--glow-md)",
          }}
          initial={prefersReducedMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={
            prefersReducedMotion
              ? { duration: 0 }
              : { duration: 0.6, ease: "easeOut" }
          }
        />
      </svg>

      {/* Semantic caption — hidden below 640px */}
      <p
        className="hidden sm:block text-xs"
        style={{ color: "var(--text-muted)" }}
      >
        Agents working in parallel
      </p>
    </div>
  );
}
