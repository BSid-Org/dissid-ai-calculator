import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import * as FramerMotion from "framer-motion";
import MetricCounter from "../MetricCounter";

// Framer-only props destructured out of motion mock
type MotionProps = {
  initial?: unknown;
  animate?: unknown;
  transition?: unknown;
  whileInView?: unknown;
  viewport?: unknown;
};

vi.mock("framer-motion", () => ({
  useInView: vi.fn(() => false),
  useReducedMotion: vi.fn(() => false),
  animate: vi.fn(
    (
      from: number,
      to: number,
      opts: { onUpdate?: (v: number) => void; duration?: number },
    ) => {
      // Synchronously call onUpdate with the target value
      opts?.onUpdate?.(to);
      return { stop: vi.fn() };
    },
  ),
  motion: {
    div: ({
      children,
      initial: _initial,
      animate: _animate,
      transition: _transition,
      whileInView: _whileInView,
      viewport: _viewport,
      ...props
    }: React.HTMLAttributes<HTMLDivElement> & MotionProps) => (
      <div {...props}>{children}</div>
    ),
  },
}));

describe("MetricCounter", () => {
  beforeEach(() => {
    vi.mocked(FramerMotion.useInView).mockReturnValue(false);
    vi.mocked(FramerMotion.useReducedMotion).mockReturnValue(false);
  });

  describe("not in view", () => {
    beforeEach(() => {
      vi.mocked(FramerMotion.useInView).mockReturnValue(false);
    });

    it("renders 0 when not in view", () => {
      render(<MetricCounter target={400} suffix="%" />);
      expect(screen.getByText("0%")).toBeTruthy();
    });

    it("renders prefix+0+suffix when not in view", () => {
      render(<MetricCounter target={2} prefix="$" suffix="M+/mo" />);
      expect(screen.getByText("$0M+/mo")).toBeTruthy();
    });
  });

  describe("in view + reduced motion", () => {
    beforeEach(() => {
      vi.mocked(FramerMotion.useInView).mockReturnValue(true);
      vi.mocked(FramerMotion.useReducedMotion).mockReturnValue(true);
    });

    it("jumps instantly to target when reduced motion is true", () => {
      render(<MetricCounter target={60} suffix="%" />);
      expect(screen.getByText("60%")).toBeTruthy();
    });

    it("does not call animate when reduced motion is true", () => {
      render(<MetricCounter target={400} suffix="%" />);
      expect(FramerMotion.animate).not.toHaveBeenCalled();
    });
  });

  describe("in view + motion allowed", () => {
    beforeEach(() => {
      vi.mocked(FramerMotion.useInView).mockReturnValue(true);
      vi.mocked(FramerMotion.useReducedMotion).mockReturnValue(false);
    });

    it("calls animate and renders target value", () => {
      render(<MetricCounter target={80} suffix="%" />);
      expect(FramerMotion.animate).toHaveBeenCalled();
      expect(screen.getByText("80%")).toBeTruthy();
    });

    it("renders prefix and suffix around animated count", () => {
      render(<MetricCounter target={2} prefix="$" suffix="M+/mo" />);
      expect(screen.getByText("$2M+/mo")).toBeTruthy();
    });
  });

  describe("prefix and suffix rendering", () => {
    beforeEach(() => {
      vi.mocked(FramerMotion.useInView).mockReturnValue(false);
      vi.mocked(FramerMotion.useReducedMotion).mockReturnValue(false);
    });

    it("renders only suffix when no prefix provided", () => {
      render(<MetricCounter target={400} suffix="%" />);
      expect(screen.getByText("0%")).toBeTruthy();
    });

    it("renders only prefix when no suffix provided", () => {
      render(<MetricCounter target={5} prefix="$" />);
      expect(screen.getByText("$0")).toBeTruthy();
    });

    it("renders neither prefix nor suffix when both omitted", () => {
      render(<MetricCounter target={100} />);
      expect(screen.getByText("0")).toBeTruthy();
    });
  });
});
