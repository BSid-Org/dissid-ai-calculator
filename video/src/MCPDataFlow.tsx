import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { brand } from "./brand";

export const MCP_FRAMES = 240; // 10s at 24fps

// 3 inputs → hub → 3 outputs
const INPUTS = [
  { label: "API", color: brand.primary, y: 0.2 },
  { label: "Database", color: brand.secondary, y: 0.5 },
  { label: "Cache", color: brand.tertiary, y: 0.8 },
];

const OUTPUTS = [
  { label: "Decision", color: brand.primary, y: 0.2 },
  { label: "Artifact", color: brand.secondary, y: 0.5 },
  { label: "State", color: brand.tertiary, y: 0.8 },
];

// Packet timing: each input sends a packet every 80 frames, staggered.
// INVARIANT: MCP_FRAMES must be an exact multiple of PACKET_CYCLE so the
// packet position modulo wraps continuously across the loop boundary
// (frame MCP_FRAMES-1 -> frame 0) — packets mid-transit at the seam
// resume at the matching position instead of vanishing.
const PACKET_CYCLE = 80;
const PACKET_TRAVEL = 36; // frames to cross half the screen
// Phase 1: input → hub (0..PACKET_TRAVEL frames within cycle)
// Phase 2: hub → output (PACKET_TRAVEL..PACKET_TRAVEL*2 frames within cycle)

// Reset: last 20 frames — outputs fade, inputs relight
const RESET_START = 220;
const RESET_END = 240;

function easeInOut(t: number): number {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

interface PacketProps {
  color: string;
  startX: number;
  hubX: number;
  endX: number;
  pathY: number;
  cycleOffset: number;
  frame: number;
  outputY: number;
}

function Packet({
  color,
  startX,
  hubX,
  endX,
  pathY,
  cycleOffset,
  frame,
  outputY,
}: PacketProps) {
  // Local frame within cycle
  const cycleFrame =
    (((frame - cycleOffset) % PACKET_CYCLE) + PACKET_CYCLE) % PACKET_CYCLE;

  // Phase 1: input → hub
  const phase1Progress = interpolate(cycleFrame, [0, PACKET_TRAVEL], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const phase1Eased = easeInOut(phase1Progress);

  // Phase 2: hub → output
  const phase2Progress = interpolate(
    cycleFrame,
    [PACKET_TRAVEL, PACKET_TRAVEL * 2],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const phase2Eased = easeInOut(phase2Progress);

  const inPhase1 = cycleFrame < PACKET_TRAVEL;
  const inPhase2 =
    cycleFrame >= PACKET_TRAVEL && cycleFrame < PACKET_TRAVEL * 2;

  const packetX = inPhase1
    ? startX + phase1Eased * (hubX - startX)
    : hubX + phase2Eased * (endX - hubX);

  const packetY = inPhase2 ? pathY + phase2Eased * (outputY - pathY) : pathY;

  const visible = inPhase1 || inPhase2;
  const opacity = visible ? 1 : 0;

  return (
    <div
      style={{
        position: "absolute",
        left: packetX - 6,
        top: packetY - 6,
        width: 12,
        height: 12,
        borderRadius: "50%",
        background: color,
        boxShadow: `0 0 10px ${color}, 0 0 20px ${color}88`,
        opacity,
      }}
    />
  );
}

interface BlockProps {
  x: number;
  y: number;
  label: string;
  color: string;
  isHub?: boolean;
  pulse?: number;
}

function Block({ x, y, label, color, isHub = false, pulse = 0 }: BlockProps) {
  const w = isHub ? 120 : 100;
  const h = isHub ? 56 : 44;
  const glow = isHub ? 20 + pulse * 16 : 8 + pulse * 8;

  return (
    <div
      style={{
        position: "absolute",
        left: x - w / 2,
        top: y - h / 2,
        width: w,
        height: h,
        borderRadius: isHub ? 12 : 8,
        background: isHub
          ? `linear-gradient(135deg, ${brand.primary}33, ${brand.secondary}33)`
          : `${color}18`,
        border: `${isHub ? 2 : 1.5}px solid ${color}${isHub ? "cc" : "88"}`,
        boxShadow: `0 0 ${glow}px ${color}${isHub ? "88" : "44"}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: brand.fontBody,
        fontSize: isHub ? 13 : 11,
        fontWeight: 700,
        color: isHub ? brand.ink : color,
        letterSpacing: 0.5,
        textTransform: isHub ? "uppercase" : "none",
      }}
    >
      {label}
    </div>
  );
}

export const MCPDataFlow: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const inputX = 160;
  const hubX = width / 2;
  const outputX = width - 160;

  // Hub pulse from arriving packets
  const hubPulse = interpolate((frame % 24) / 24, [0, 0.5, 1], [0, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Output pulse on packet arrival
  const outputPulse = (idx: number) => {
    const offset = idx * Math.floor(PACKET_CYCLE / 3);
    const cycleFrame =
      (((frame - offset - PACKET_TRAVEL) % PACKET_CYCLE) + PACKET_CYCLE) %
      PACKET_CYCLE;
    return interpolate(cycleFrame, [0, 6, 12], [0, 1, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  };

  // Seamless loop: block opacities must match at frame 0 and the final
  // frame. Outputs are dark at BOTH ends (fade in at the start, fade out
  // during the reset); inputs are fully lit at BOTH ends (settle to a
  // working dim state, then relight during the reset).
  const outputFade = interpolate(
    frame,
    [0, 16, RESET_START, RESET_END - 4],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const inputOpacity = interpolate(
    frame,
    [0, 16, RESET_START + 6, RESET_END - 2],
    [1, 0.7, 0.7, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  // Filament path colors — draw lines from inputs to hub and hub to outputs
  const filamentOpacity = 0.25;

  return (
    <AbsoluteFill style={{ background: brand.bg, overflow: "hidden" }}>
      {/* SVG layer for filament paths */}
      <svg
        style={{ position: "absolute", width: "100%", height: "100%" }}
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Input → Hub paths */}
        {INPUTS.map((inp, i) => {
          const y = inp.y * height;
          const hubY = height / 2;
          return (
            <line
              key={`in-path-${i}`}
              x1={inputX + 50}
              y1={y}
              x2={hubX - 60}
              y2={hubY}
              stroke={inp.color}
              strokeWidth={1.5}
              strokeOpacity={filamentOpacity}
              strokeDasharray="6 4"
            />
          );
        })}
        {/* Hub → Output paths */}
        {OUTPUTS.map((out, i) => {
          const y = out.y * height;
          const hubY = height / 2;
          return (
            <line
              key={`out-path-${i}`}
              x1={hubX + 60}
              y1={hubY}
              x2={outputX - 50}
              y2={y}
              stroke={out.color}
              strokeWidth={1.5}
              strokeOpacity={filamentOpacity}
              strokeDasharray="6 4"
            />
          );
        })}
      </svg>

      {/* Input blocks */}
      {INPUTS.map((inp, i) => (
        <div key={`in-${i}`} style={{ opacity: inputOpacity }}>
          <Block
            x={inputX}
            y={inp.y * height}
            label={inp.label}
            color={inp.color}
          />
        </div>
      ))}

      {/* Hub */}
      <Block
        x={hubX}
        y={height / 2}
        label="MCP Hub"
        color={brand.primary}
        isHub
        pulse={hubPulse}
      />

      {/* Output blocks */}
      {OUTPUTS.map((out, i) => (
        <div key={`out-${i}`} style={{ opacity: outputFade }}>
          <Block
            x={outputX}
            y={out.y * height}
            label={out.label}
            color={out.color}
            pulse={outputPulse(i)}
          />
        </div>
      ))}

      {/* Packets: input → hub */}
      {INPUTS.map((inp, i) => (
        <Packet
          key={`pkt-in-${i}`}
          color={inp.color}
          startX={inputX + 50}
          hubX={hubX}
          endX={outputX - 50}
          pathY={inp.y * height}
          outputY={OUTPUTS[i].y * height}
          cycleOffset={i * Math.floor(PACKET_CYCLE / 3)}
          frame={frame}
        />
      ))}

      {/* Labels */}
      <div
        style={{
          position: "absolute",
          left: inputX - 60,
          top: 20,
          fontFamily: brand.fontBody,
          fontSize: 11,
          fontWeight: 700,
          color: brand.muted,
          letterSpacing: 1.5,
          textTransform: "uppercase",
        }}
      >
        Inputs
      </div>
      <div
        style={{
          position: "absolute",
          left: outputX - 30,
          top: 20,
          fontFamily: brand.fontBody,
          fontSize: 11,
          fontWeight: 700,
          color: brand.muted,
          letterSpacing: 1.5,
          textTransform: "uppercase",
        }}
      >
        Outputs
      </div>
    </AbsoluteFill>
  );
};
