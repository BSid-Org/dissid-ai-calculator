"use client";
import { useRef } from "react";
import { useInView, useReducedMotion } from "framer-motion";

const loops = [
  {
    src: "/videos/agent-fleet.mp4",
    poster: "/videos/agent-fleet-poster.jpg",
    caption: "Agent fleet orchestration",
  },
  {
    src: "/videos/mcp-data-flow.mp4",
    poster: "/videos/mcp-data-flow-poster.jpg",
    caption: "MCP data flow",
  },
];

export default function ServiceLoops() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "200px" });
  const reduced = useReducedMotion();

  return (
    <div ref={ref} className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
      {loops.map((loop) => (
        <div
          key={loop.src}
          className="glass-panel card-glow rounded-xl overflow-hidden"
        >
          <div className="aspect-video">
            {reduced === true ? (
              <img
                src={loop.poster}
                alt=""
                aria-hidden="true"
                className="w-full h-full object-cover"
              />
            ) : !inView ? (
              <img
                src={loop.poster}
                alt=""
                aria-hidden="true"
                className="w-full h-full object-cover"
              />
            ) : (
              <video
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                poster={loop.poster}
                src={loop.src}
                aria-hidden="true"
                className="w-full h-full object-cover"
              />
            )}
          </div>
          <p className="px-4 py-3 text-sm text-[var(--text-muted)]">
            {loop.caption}
          </p>
        </div>
      ))}
    </div>
  );
}
