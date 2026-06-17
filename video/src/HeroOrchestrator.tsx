import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { brand } from "./brand";

// 6s @ 24fps. Seamless loop — all motion is periodic over HERO_FRAMES:
//   - the node ring completes exactly one rotation (angle 0 -> 2π)
//   - packets complete exactly HERO_FRAMES / PACKET_CYCLE whole cycles
//   - the drifting particle field wraps exactly once
export const HERO_FRAMES = 144;

const PACKET_CYCLE = 48; // 144 / 48 = 3 whole cycles -> matches at the seam
const HALF = PACKET_CYCLE / 2; // out (hub->node) then back (node->hub)

// Orchestrated agent ring — denser, branded representation of an agent fleet.
const NODES = [
  { label: "Data", color: brand.primary },
  { label: "Code", color: brand.secondary },
  { label: "Search", color: brand.tertiary },
  { label: "Vision", color: brand.primary },
  { label: "LLMOps", color: brand.secondary },
  { label: "Voice", color: brand.tertiary },
];
const N = NODES.length;

function easeInOut(t: number): number {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

// Deterministic ambient particle field (no Math.random — render must be
// frame-deterministic). Positions seeded from the index.
const PARTICLES = Array.from({ length: 36 }, (_, i) => {
  const a = Math.sin(i * 12.9898) * 43758.5453;
  const b = Math.sin(i * 78.233) * 12543.137;
  const fx = a - Math.floor(a);
  const fy = b - Math.floor(b);
  return {
    x: fx,
    y: fy,
    size: 1 + (i % 3),
    speed: 0.4 + ((i % 5) / 5) * 0.8,
    color:
      i % 3 === 0
        ? brand.primary
        : i % 3 === 1
          ? brand.secondary
          : brand.tertiary,
  };
});

export const HeroOrchestrator: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const cx = width / 2;
  const cy = height / 2;
  const radius = 232;

  // One full, seamless rotation across the whole clip.
  const rot = (frame / HERO_FRAMES) * Math.PI * 2;

  // Per-node geometry (rotating ring)
  const nodes = NODES.map((node, i) => {
    const angle = rot + (i / N) * Math.PI * 2 - Math.PI / 2;
    const x = cx + Math.cos(angle) * radius;
    const y = cy + Math.sin(angle) * radius;
    const offset = i * (PACKET_CYCLE / N); // stagger packet dispatch
    const cf =
      (((frame - offset) % PACKET_CYCLE) + PACKET_CYCLE) % PACKET_CYCLE;
    return { ...node, x, y, angle, cf };
  });

  // Hub glow swells gently as packets return (sum of staggered arrivals).
  const hubReturn = nodes.reduce((acc, n) => {
    const p = interpolate(n.cf, [PACKET_CYCLE - 6, PACKET_CYCLE], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    const q = interpolate(n.cf, [0, 6], [1, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    return acc + Math.max(p, q);
  }, 0);
  const hubGlow = 34 + Math.min(hubReturn, 2) * 22;
  const hubScale = 1 + Math.min(hubReturn, 2) * 0.04;

  return (
    <AbsoluteFill style={{ background: brand.bg, overflow: "hidden" }}>
      {/* Radial vignette so the center reads as the focal point */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 50% 50%, ${brand.primary}10 0%, transparent 55%)`,
        }}
      />

      {/* Faint dot grid */}
      <svg
        style={{ position: "absolute", width: "100%", height: "100%" }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id="grid"
            width="44"
            height="44"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="1" cy="1" r="1" fill={brand.line} fillOpacity="0.35" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />

        {/* Orbit ring */}
        <circle
          cx={cx}
          cy={cy}
          r={radius}
          fill="none"
          stroke={brand.line}
          strokeOpacity={0.4}
          strokeWidth={1}
          strokeDasharray="3 7"
        />

        {/* Filaments hub -> node */}
        {nodes.map((n, i) => (
          <line
            key={`fil-${i}`}
            x1={cx}
            y1={cy}
            x2={n.x}
            y2={n.y}
            stroke={n.color}
            strokeWidth={1.25}
            strokeOpacity={0.22}
            strokeDasharray="5 5"
          />
        ))}
      </svg>

      {/* Drifting particles (wraps once over the clip) */}
      {PARTICLES.map((p, i) => {
        const y =
          ((p.y - (((frame / HERO_FRAMES) * p.speed) % 1) + 1) % 1) * height;
        const x = p.x * width;
        return (
          <div
            key={`pt-${i}`}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: p.size,
              height: p.size,
              borderRadius: "50%",
              background: p.color,
              opacity: 0.22,
            }}
          />
        );
      })}

      {/* Packets travelling hub <-> node along each filament */}
      {nodes.map((n, i) => {
        const out = n.cf < HALF;
        const t = out ? n.cf / HALF : (n.cf - HALF) / HALF;
        const e = easeInOut(t);
        const f = out ? e : 1 - e; // 0 at hub, 1 at node
        const px = cx + (n.x - cx) * f;
        const py = cy + (n.y - cy) * f;
        return (
          <div
            key={`pkt-${i}`}
            style={{
              position: "absolute",
              left: px - 5,
              top: py - 5,
              width: 10,
              height: 10,
              borderRadius: "50%",
              background: n.color,
              boxShadow: `0 0 10px ${n.color}, 0 0 20px ${n.color}99`,
            }}
          />
        );
      })}

      {/* Agent nodes */}
      {nodes.map((n, i) => {
        // glow pulse as the dispatched packet arrives (cf ~ HALF)
        const arrive = interpolate(
          n.cf,
          [HALF - 6, HALF, HALF + 8],
          [0, 1, 0],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
        );
        const glow = 8 + arrive * 16;
        return (
          <div
            key={`node-${i}`}
            style={{
              position: "absolute",
              left: n.x - 46,
              top: n.y - 17,
              width: 92,
              height: 34,
              borderRadius: 9,
              background: `${n.color}1a`,
              border: `1.5px solid ${n.color}aa`,
              boxShadow: `0 0 ${glow}px ${n.color}66`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: brand.fontBody,
              fontSize: 12,
              fontWeight: 700,
              color: n.color,
              letterSpacing: 0.4,
            }}
          >
            {n.label}
          </div>
        );
      })}

      {/* Orchestrator hub */}
      <div
        style={{
          position: "absolute",
          left: cx - 64,
          top: cy - 40,
          width: 128,
          height: 80,
          transform: `scale(${hubScale})`,
          borderRadius: 16,
          background: `linear-gradient(135deg, ${brand.primary}3a, ${brand.secondary}3a)`,
          border: `2px solid ${brand.primary}dd`,
          boxShadow: `0 0 ${hubGlow}px ${brand.primary}88`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: brand.fontBody,
          color: brand.ink,
        }}
      >
        <div style={{ fontSize: 15, fontWeight: 800, letterSpacing: 0.5 }}>
          ORCHESTRATOR
        </div>
        <div
          style={{
            fontSize: 10,
            fontWeight: 600,
            color: brand.dim,
            letterSpacing: 1.5,
            textTransform: "uppercase",
            marginTop: 2,
          }}
        >
          agent fleet
        </div>
      </div>
    </AbsoluteFill>
  );
};
