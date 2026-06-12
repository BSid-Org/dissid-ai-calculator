import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { brand } from "./brand";

export const FLEET_FRAMES = 192; // 8s at 24fps

const LANES = [
  { label: "Data", color: brand.primary },
  { label: "Code", color: brand.secondary },
  { label: "Search", color: brand.tertiary },
  { label: "Review", color: brand.green },
];

const CHIPS = [
  { label: "Data", laneIdx: 0 },
  { label: "Code", laneIdx: 1 },
  { label: "Search", laneIdx: 2 },
  { label: "Review", laneIdx: 3 },
  { label: "Data", laneIdx: 0 },
];

// Each chip dispatch staggered: chip i launches at frame i*24.
// INVARIANT: the LAST chip must land (and its checkmark finish fading in)
// before RESET_START so nothing is mid-flight at the loop seam:
// last dispatch = (CHIPS.length - 1) * 24 = 96; arrival = 96 + 64 = 160;
// checkmark fade-in ends at 164 < RESET_START (168).
const CHIP_DISPATCH_FRAME = 24;
// Travel duration in frames
const TRAVEL_FRAMES = 64;
// Fade-out / reset: last 24 frames (frames 168-191)
const RESET_START = 168;
const RESET_END = 192;

function easeInOut(t: number): number {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

interface ChipProps {
  label: string;
  color: string;
  dispatchFrame: number;
  frame: number;
  laneY: number;
  boardLeft: number;
  boardRight: number;
  doneX: number;
}

function Chip({
  label,
  color,
  dispatchFrame,
  frame,
  laneY,
  boardLeft,
  boardRight,
  doneX,
}: ChipProps) {
  const localFrame = frame - dispatchFrame;

  // Before dispatch: show in queue (left edge)
  const queueOpacity = interpolate(
    frame,
    [dispatchFrame - 4, dispatchFrame],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  // After dispatch: traveling
  const travelProgress = interpolate(localFrame, [0, TRAVEL_FRAMES], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const easedProgress = easeInOut(travelProgress);
  const chipX = boardLeft + easedProgress * (boardRight - boardLeft);

  const travelOpacity = interpolate(
    localFrame,
    [-4, 0, TRAVEL_FRAMES - 4, TRAVEL_FRAMES],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  // Done checkmark appears after travel
  const doneOpacity = interpolate(
    localFrame,
    [TRAVEL_FRAMES - 4, TRAVEL_FRAMES + 4],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  // Reset fade: done chips fade out in last 24 frames
  const resetFade = interpolate(frame, [RESET_START, RESET_END - 4], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const chipSize = 36;
  const chipW = 72;

  return (
    <>
      {/* Queue placeholder: visible before dispatch */}
      {frame < dispatchFrame && (
        <div
          style={{
            position: "absolute",
            left: boardLeft - chipW - 16,
            top: laneY - chipSize / 2,
            width: chipW,
            height: chipSize,
            borderRadius: 8,
            background: `${color}22`,
            border: `1.5px solid ${color}88`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: queueOpacity,
            fontFamily: brand.fontBody,
            fontSize: 13,
            fontWeight: 700,
            color,
          }}
        >
          {label}
        </div>
      )}

      {/* Traveling chip */}
      {localFrame >= 0 && localFrame <= TRAVEL_FRAMES && (
        <div
          style={{
            position: "absolute",
            left: chipX - chipW / 2,
            top: laneY - chipSize / 2,
            width: chipW,
            height: chipSize,
            borderRadius: 8,
            background: `${color}33`,
            border: `2px solid ${color}`,
            boxShadow: `0 0 12px ${color}88`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            // resetFade is a safety net: travel completes before
            // RESET_START by the dispatch-timing invariant above.
            opacity: travelOpacity * resetFade,
            fontFamily: brand.fontBody,
            fontSize: 13,
            fontWeight: 700,
            color,
          }}
        >
          {label}
        </div>
      )}

      {/* Done checkmark */}
      {localFrame > TRAVEL_FRAMES - 4 && (
        <div
          style={{
            position: "absolute",
            left: doneX - 20,
            top: laneY - 20,
            width: 40,
            height: 40,
            borderRadius: "50%",
            background: `${color}22`,
            border: `2px solid ${color}`,
            boxShadow: `0 0 16px ${color}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: doneOpacity * resetFade,
            fontSize: 20,
            color,
          }}
        >
          ✓
        </div>
      )}
    </>
  );
}

interface ProgressBarProps {
  color: string;
  laneY: number;
  barLeft: number;
  barRight: number;
  dispatchFrame: number;
  frame: number;
}

function ProgressBar({
  color,
  laneY,
  barLeft,
  barRight,
  dispatchFrame,
  frame,
}: ProgressBarProps) {
  const localFrame = frame - dispatchFrame;
  const progress = interpolate(localFrame, [0, TRAVEL_FRAMES], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const barWidth = (barRight - barLeft) * progress;

  // Reset: bar fades out
  const resetFade = interpolate(frame, [RESET_START, RESET_END - 4], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const opacity = localFrame >= 0 ? resetFade : 0;

  return (
    <div
      style={{
        position: "absolute",
        left: barLeft,
        top: laneY + 22,
        width: barRight - barLeft,
        height: 4,
        borderRadius: 2,
        background: `${color}22`,
        opacity,
      }}
    >
      <div
        style={{
          width: barWidth,
          height: "100%",
          borderRadius: 2,
          background: color,
          boxShadow: `0 0 8px ${color}`,
        }}
      />
    </div>
  );
}

export const AgentFleet: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const padLeft = 160;
  const padRight = 80;
  const boardLeft = padLeft + 120; // dispatcher bar right edge
  const boardRight = width - padRight - 100; // done column left edge
  const doneX = width - padRight - 50;

  const laneCount = LANES.length;
  const laneSpacing = height / (laneCount + 1);

  // Orchestrator bar pulse
  const orchPulse = interpolate(
    (frame % 24) / 24,
    [0, 0.5, 1],
    [0.7, 1.0, 0.7],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  // Queue relight: in the last 24 frames, fade queue items back in
  const queueRelight = interpolate(
    frame,
    [RESET_START + 8, RESET_END - 2],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <AbsoluteFill style={{ background: brand.bg, overflow: "hidden" }}>
      {/* Lane tracks */}
      {LANES.map((lane, i) => {
        const laneY = laneSpacing * (i + 1);
        return (
          <div key={lane.label + i}>
            {/* Lane horizontal track line */}
            <div
              style={{
                position: "absolute",
                left: boardLeft,
                top: laneY,
                width: boardRight - boardLeft,
                height: 1,
                background: `${lane.color}20`,
              }}
            />
            {/* Lane label */}
            <div
              style={{
                position: "absolute",
                left: boardLeft + 4,
                top: laneY - 28,
                fontFamily: brand.fontBody,
                fontSize: 11,
                fontWeight: 600,
                color: lane.color,
                opacity: 0.5,
                letterSpacing: 1,
                textTransform: "uppercase",
              }}
            >
              {lane.label} agent
            </div>
          </div>
        );
      })}

      {/* Orchestrator bar */}
      <div
        style={{
          position: "absolute",
          left: padLeft,
          top: laneSpacing - 20,
          width: 8,
          height: laneSpacing * laneCount + 40,
          borderRadius: 4,
          background: `linear-gradient(180deg, ${brand.primary}88, ${brand.secondary}88)`,
          boxShadow: `0 0 ${16 * orchPulse}px ${brand.primary}88`,
          opacity: orchPulse,
        }}
      />

      {/* "Orchestrator" label */}
      <div
        style={{
          position: "absolute",
          left: padLeft - 8,
          top: laneSpacing * (laneCount / 2 + 0.5) - 8,
          fontFamily: brand.fontBody,
          fontSize: 11,
          fontWeight: 700,
          color: brand.primary,
          opacity: 0.7,
          letterSpacing: 1,
          transform: "rotate(-90deg) translateX(-50%)",
          transformOrigin: "top left",
          whiteSpace: "nowrap",
        }}
      >
        ORCHESTRATOR
      </div>

      {/* "Done" column header */}
      <div
        style={{
          position: "absolute",
          left: doneX - 30,
          top: laneSpacing - 40,
          fontFamily: brand.fontBody,
          fontSize: 11,
          fontWeight: 700,
          color: brand.green,
          opacity: 0.6,
          letterSpacing: 1,
          textTransform: "uppercase",
        }}
      >
        Done
      </div>

      {/* Chips */}
      {CHIPS.map((chip, i) => {
        const dispatchFrame = i * CHIP_DISPATCH_FRAME;
        const lane = LANES[chip.laneIdx];
        const laneY = laneSpacing * (chip.laneIdx + 1);
        return (
          <Chip
            key={i}
            label={chip.label}
            color={lane.color}
            dispatchFrame={dispatchFrame}
            frame={frame}
            laneY={laneY}
            boardLeft={boardLeft}
            boardRight={boardRight}
            doneX={doneX}
          />
        );
      })}

      {/* Progress bars */}
      {CHIPS.map((chip, i) => {
        const dispatchFrame = i * CHIP_DISPATCH_FRAME;
        const lane = LANES[chip.laneIdx];
        const laneY = laneSpacing * (chip.laneIdx + 1);
        return (
          <ProgressBar
            key={i}
            color={lane.color}
            laneY={laneY}
            barLeft={boardLeft}
            barRight={boardRight}
            dispatchFrame={dispatchFrame}
            frame={frame}
          />
        );
      })}

      {/* Queue relight: show queued chips in last 24 frames to prep for loop */}
      {CHIPS.map((chip, i) => {
        const lane = LANES[chip.laneIdx];
        const laneY = laneSpacing * (chip.laneIdx + 1);
        const chipW = 72;
        const chipSize = 36;
        return (
          <div
            key={`relight-${i}`}
            style={{
              position: "absolute",
              left: boardLeft - chipW - 16,
              top: laneY - chipSize / 2,
              width: chipW,
              height: chipSize,
              borderRadius: 8,
              background: `${lane.color}22`,
              border: `1.5px solid ${lane.color}88`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              opacity: queueRelight,
              fontFamily: brand.fontBody,
              fontSize: 13,
              fontWeight: 700,
              color: lane.color,
            }}
          >
            {chip.label}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
