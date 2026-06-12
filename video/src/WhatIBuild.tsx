import React from "react";
import { AbsoluteFill, interpolate, Series, useCurrentFrame } from "remotion";
import { AgentFleet } from "./AgentFleet";
import { MCPDataFlow } from "./MCPDataFlow";
import { brand } from "./brand";

// Total: 720 frames (30s at 24fps)
// Scene breakdown:
//   Scene 1 Intro:        144 frames (6s)   — absolute 0–143
//   Scene 2 AgentFleet:   192 frames (8s)   — absolute 144–335, exactly FLEET_FRAMES.
//                          AgentFleet does NOT wrap useCurrentFrame past 192 (it
//                          clamps in its reset state: chips/bars/checkmarks at
//                          opacity 0), so the scene must not outlive FLEET_FRAMES.
//                          The spare 24 frames went to ProofPoints — the most
//                          information-dense scene benefits from reading time.
//   Scene 3 MCPDataFlow:  240 frames (10s)  — absolute 336–575, exactly MCP_FRAMES ✓
//   Scene 4 ProofPoints:   96 frames (4s)   — absolute 576–671
//   Scene 5 Outro:         48 frames (2s)   — absolute 672–719

// ─── Scene 1: Intro ──────────────────────────────────────────────────────────

function Intro() {
  const frame = useCurrentFrame();

  // Fade in over 0–0.5s (12 frames)
  const opacity = interpolate(frame, [0, 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(135deg, #0c0e12 0%, ${brand.bg} 60%, #1a1020 100%)`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        opacity,
      }}
    >
      <div
        style={{
          fontFamily: brand.fontDisplay,
          fontSize: 48,
          fontWeight: 800,
          color: brand.ink,
          letterSpacing: -1,
          textAlign: "center",
          marginBottom: 24,
        }}
      >
        What I Build
      </div>
      <div
        style={{
          fontFamily: brand.fontBody,
          fontSize: 24,
          fontWeight: 400,
          color: brand.muted,
          textAlign: "center",
        }}
      >
        Three core capabilities:
      </div>
    </AbsoluteFill>
  );
}

// ─── Shared scene overlay ────────────────────────────────────────────────────

// Center-top caption: appears at 2s (48 frames) into its Sequence, fades in
// over 1s (24 frames). Computes its own fade from useCurrentFrame, which is
// relative to the enclosing Series.Sequence.
function SceneOverlay({ text }: { text: string }) {
  const frame = useCurrentFrame();

  const overlayOpacity = interpolate(frame, [48, 72], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        top: 32,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
        opacity: overlayOpacity,
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          fontFamily: brand.fontBody,
          fontSize: 24,
          fontWeight: 600,
          color: brand.ink,
          background: "rgba(17,19,24,0.7)",
          padding: "8px 20px",
          borderRadius: 8,
          letterSpacing: 0.3,
        }}
      >
        {text}
      </div>
    </div>
  );
}

// ─── Scene 2: AgentFleet with overlay ────────────────────────────────────────

function AgentFleetReuse() {
  return (
    <AbsoluteFill>
      <AgentFleet />
      <SceneOverlay text="Agent fleets run in parallel" />
    </AbsoluteFill>
  );
}

// ─── Scene 3: MCPDataFlow with overlay ───────────────────────────────────────

function MCPDataFlowReuse() {
  return (
    <AbsoluteFill>
      <MCPDataFlow />
      <SceneOverlay text="MCP integrations connect any tool" />
    </AbsoluteFill>
  );
}

// ─── Scene 4: ProofPoints ─────────────────────────────────────────────────────

const PROOF_CARDS = [
  { metric: "400%", label: "Inference Speed" },
  { metric: "4-hr → 3-sec", label: "Pipeline Latency" },
  { metric: "60%", label: "CPU Reduction" },
  { metric: "$2M+/mo", label: "Revenue Impact" },
];

// Stagger: 4 frames apart (cards 0–3 start at frames 0, 4, 8, 12)
// With an 8-frame fade, card 4 fully opaque at scene frame 20 = absolute 596
// (scene starts at absolute 576) — well before the frame-620 spot-check ✓
const STAGGER_FRAMES = 4;
// Each card fades in over 8 frames then stays visible
const CARD_FADE_FRAMES = 8;

function ProofPointsCards() {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill
      style={{
        background: brand.bg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 60px",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          gap: 24,
          flexWrap: "nowrap",
          width: "100%",
          justifyContent: "center",
        }}
      >
        {PROOF_CARDS.map((card, i) => {
          const startFrame = i * STAGGER_FRAMES;
          const opacity = interpolate(
            frame,
            [startFrame, startFrame + CARD_FADE_FRAMES],
            [0, 1],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          );

          return (
            <div
              key={card.label}
              style={{
                opacity,
                flex: "1 1 0",
                minWidth: 0,
                maxWidth: 240,
                background: brand.panel,
                border: `1.5px solid ${brand.line}`,
                borderRadius: 12,
                padding: "28px 20px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
              }}
            >
              <div
                style={{
                  fontFamily: brand.fontDisplay,
                  fontSize: 36,
                  fontWeight: 800,
                  color: brand.ink,
                  textAlign: "center",
                  lineHeight: 1.1,
                }}
              >
                {card.metric}
              </div>
              <div
                style={{
                  fontFamily: brand.fontBody,
                  fontSize: 12,
                  fontWeight: 600,
                  color: brand.muted,
                  textAlign: "center",
                  textTransform: "uppercase",
                  letterSpacing: 1,
                }}
              >
                {card.label}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
}

// ─── Scene 5: Outro ───────────────────────────────────────────────────────────

function Outro() {
  const frame = useCurrentFrame();

  // Fade in over 0–0.5s (12 frames)
  const opacity = interpolate(frame, [0, 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background: brand.bg,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        opacity,
      }}
    >
      <div
        style={{
          fontFamily: brand.fontDisplay,
          fontSize: 36,
          fontWeight: 700,
          color: brand.ink,
          textAlign: "center",
          marginBottom: 20,
        }}
      >
        Ready to accelerate?
      </div>
      <div
        style={{
          fontFamily: brand.fontBody,
          fontSize: 24,
          fontWeight: 600,
          background: `linear-gradient(90deg, ${brand.primary}, ${brand.secondary})`,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          textAlign: "center",
        }}
      >
        Email me →
      </div>
    </AbsoluteFill>
  );
}

// ─── Main composition ─────────────────────────────────────────────────────────

export const WhatIBuild: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: brand.bg }}>
    <Series>
      <Series.Sequence durationInFrames={144}>
        <Intro />
      </Series.Sequence>
      <Series.Sequence durationInFrames={192}>
        <AgentFleetReuse />
      </Series.Sequence>
      <Series.Sequence durationInFrames={240}>
        <MCPDataFlowReuse />
      </Series.Sequence>
      <Series.Sequence durationInFrames={96}>
        <ProofPointsCards />
      </Series.Sequence>
      <Series.Sequence durationInFrames={48}>
        <Outro />
      </Series.Sequence>
    </Series>
  </AbsoluteFill>
);
