"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

// Above-the-fold hero visual. The poster is the LCP element and is what gets
// statically prerendered; the autoplay loop only swaps in on desktop with motion
// allowed, so mobile stays on the static image (keeps the mobile perf win).
export default function HeroVisual() {
  const reduced = useReducedMotion();
  const [showVideo, setShowVideo] = useState(false);

  useEffect(() => {
    if (reduced) {
      setShowVideo(false);
      return;
    }
    const mq = window.matchMedia("(min-width: 768px)");
    const update = () => setShowVideo(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [reduced]);

  return (
    <div className="w-full max-w-3xl aspect-video overflow-hidden rounded-xl border border-[var(--border)] glass-panel">
      {showVideo ? (
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster="/videos/hero-poster.jpg"
          src="/videos/hero.mp4"
          aria-label="Animated diagram of an orchestrator coordinating a fleet of AI agents"
          className="w-full h-full object-cover"
        />
      ) : (
        <img
          src="/videos/hero-poster.jpg"
          width={1280}
          height={720}
          alt="An orchestrator coordinating a fleet of AI agents — the kind of system I build"
          className="w-full h-full object-cover"
        />
      )}
    </div>
  );
}
