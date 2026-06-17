"use client";
import { useRef } from "react";
import { useInView, useReducedMotion } from "framer-motion";

export default function WhatIBuildVideo() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "200px" });
  const reduced = useReducedMotion();

  return (
    <div ref={ref} className="aspect-video rounded-xl overflow-hidden">
      {reduced === true ? (
        <img
          src="/videos/what-i-build-poster.jpg"
          alt="What I Build explainer"
          className="w-full h-full object-cover"
        />
      ) : !inView ? (
        <img
          src="/videos/what-i-build-poster.jpg"
          alt="What I Build explainer"
          className="w-full h-full object-cover"
        />
      ) : (
        <video
          src="/videos/what-i-build.mp4"
          poster="/videos/what-i-build-poster.jpg"
          controls
          muted
          playsInline
          preload="none"
          className="w-full h-full"
        />
      )}
    </div>
  );
}
