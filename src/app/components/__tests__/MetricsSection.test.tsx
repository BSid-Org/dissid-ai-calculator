import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import * as FramerMotion from "framer-motion";
import MetricsSection from "../MetricsSection";

// Framer-only props that must not leak onto raw DOM elements
type MotionProps = {
  initial?: unknown;
  animate?: unknown;
  transition?: unknown;
  whileInView?: unknown;
  viewport?: unknown;
  variants?: unknown;
  custom?: unknown;
};

vi.mock("framer-motion", () => ({
  motion: {
    div: ({
      children,
      initial: _initial,
      animate: _animate,
      transition: _transition,
      whileInView: _whileInView,
      viewport: _viewport,
      variants: _variants,
      custom: _custom,
      ...props
    }: React.HTMLAttributes<HTMLDivElement> & MotionProps) => (
      <div {...props}>{children}</div>
    ),
  },
  useReducedMotion: vi.fn(() => false),
  useInView: vi.fn(() => true),
  animate: vi.fn(
    (
      from: number,
      to: number,
      opts: { onUpdate?: (v: number) => void; duration?: number },
    ) => {
      opts?.onUpdate?.(to);
      return { stop: vi.fn() };
    },
  ),
}));

describe("MetricsSection", () => {
  beforeEach(() => {
    vi.mocked(FramerMotion.useReducedMotion).mockReturnValue(false);
    vi.mocked(FramerMotion.useInView).mockReturnValue(true);
  });

  it("renders all 5 metric cards", () => {
    const { container } = render(<MetricsSection />);
    // Each card is a motion.div → rendered as div with glass-panel class
    const cards = container.querySelectorAll(".glass-panel.card-glow");
    expect(cards).toHaveLength(5);
  });

  it("renders the section heading", () => {
    render(<MetricsSection />);
    expect(screen.getByText("Scale")).toBeTruthy();
    expect(
      screen.getByText(
        "Measurable impact from systems I've shipped to production",
      ),
    ).toBeTruthy();
  });

  describe("metric labels", () => {
    it("renders Inference Speedup label", () => {
      render(<MetricsSection />);
      expect(screen.getByText("Inference Speedup")).toBeTruthy();
    });

    it("renders Pipeline Latency label", () => {
      render(<MetricsSection />);
      expect(screen.getByText("Pipeline Latency")).toBeTruthy();
    });

    it("renders CPU Reduction label", () => {
      render(<MetricsSection />);
      expect(screen.getByText("CPU Reduction")).toBeTruthy();
    });

    it("renders Revenue Impact label", () => {
      render(<MetricsSection />);
      expect(screen.getByText("Revenue Impact")).toBeTruthy();
    });

    it("renders User Retention label", () => {
      render(<MetricsSection />);
      expect(screen.getByText("User Retention")).toBeTruthy();
    });
  });

  describe("metric display values", () => {
    it("renders static 4 hr → 3 sec text for Pipeline Latency", () => {
      render(<MetricsSection />);
      expect(screen.getByText("4 hr → 3 sec")).toBeTruthy();
    });

    it("renders static '20% → ' prefix for User Retention", () => {
      const { container } = render(<MetricsSection />);
      // Static prefix lives in the User Retention metric card (the 5-card band).
      // An outcome card below also mentions "20% → 80%", so scope to the band.
      const band = container.querySelector(".lg\\:grid-cols-5");
      expect(band?.textContent).toMatch(/20%/);
    });
  });

  describe("forbidden strings", () => {
    it("does NOT render '400x' (invented claim)", () => {
      render(<MetricsSection />);
      expect(screen.queryByText(/400x/)).toBeNull();
    });

    it("does NOT render '12%' (invented engagement claim)", () => {
      render(<MetricsSection />);
      expect(screen.queryByText(/12%/)).toBeNull();
    });
  });

  describe("sublabels", () => {
    it("renders 'On-device computer vision' sublabel", () => {
      render(<MetricsSection />);
      expect(screen.getByText("On-device computer vision")).toBeTruthy();
    });

    it("renders 'From overnight batch to real-time' sublabel", () => {
      render(<MetricsSection />);
      expect(
        screen.getByText("From overnight batch to real-time"),
      ).toBeTruthy();
    });

    it("renders 'Same workload, fraction of the compute' sublabel", () => {
      render(<MetricsSection />);
      expect(
        screen.getByText("Same workload, fraction of the compute"),
      ).toBeTruthy();
    });

    it("renders 'Systems serving production traffic' sublabel", () => {
      render(<MetricsSection />);
      expect(
        screen.getByText("Systems serving production traffic"),
      ).toBeTruthy();
    });

    it("renders 'After end-to-end redesign' sublabel", () => {
      render(<MetricsSection />);
      expect(screen.getByText("After end-to-end redesign")).toBeTruthy();
    });
  });

  describe("outcome case studies", () => {
    it("renders the Outcomes heading", () => {
      render(<MetricsSection />);
      expect(screen.getByText("Outcomes")).toBeTruthy();
    });

    it("renders three anonymized outcome cards", () => {
      render(<MetricsSection />);
      expect(screen.getByText(/4-hour batch/i)).toBeTruthy();
      expect(screen.getByText(/20% → 80% user retention/i)).toBeTruthy();
      expect(screen.getByText(/\$2M\+\/mo revenue impact/i)).toBeTruthy();
    });

    it("keeps the 5 metric cards distinct from the 3 outcome cards", () => {
      const { container } = render(<MetricsSection />);
      expect(container.querySelectorAll(".glass-panel.card-glow")).toHaveLength(
        5,
      );
      expect(container.querySelectorAll(".outcome-card")).toHaveLength(3);
    });

    it("fabricates no client names or testimonials", () => {
      render(<MetricsSection />);
      expect(screen.queryByText(/client/i)).toBeNull();
      expect(screen.queryByText(/testimonial/i)).toBeNull();
    });
  });
});
