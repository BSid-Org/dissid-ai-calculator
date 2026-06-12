"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion, animate } from "framer-motion";

interface MetricCounterProps {
  target: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  className?: string;
}

export default function MetricCounter({
  target,
  prefix = "",
  suffix = "",
  duration = 1.6,
  className,
}: MetricCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  // useReducedMotion() may return null on first render — treat null as false
  const prefersReducedMotion = useReducedMotion();
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;

    if (prefersReducedMotion === true) {
      // Reduced motion: jump instantly
      setCount(target);
      return;
    }

    // Motion OK (false or null treated as false — null means "not yet resolved,
    // assume motion allowed" which is consistent with SSR showing 0)
    const controls = animate(0, target, {
      duration,
      onUpdate: (v) => setCount(Math.round(v)),
    });

    return () => controls.stop();
  }, [inView, prefersReducedMotion, target, duration]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}
