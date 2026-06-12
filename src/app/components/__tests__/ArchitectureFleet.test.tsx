import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import * as FramerMotion from "framer-motion";
import ArchitectureFleet from "../ArchitectureFleet";

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
    circle: ({
      initial: _initial,
      animate: _animate,
      transition: _transition,
      ...props
    }: React.SVGProps<SVGCircleElement> & MotionProps) => <circle {...props} />,
    line: ({
      initial: _initial,
      animate: _animate,
      transition: _transition,
      strokeOpacity,
      ...props
    }: React.SVGProps<SVGLineElement> &
      MotionProps & { strokeOpacity?: number | string }) => (
      <line strokeOpacity={strokeOpacity} {...props} />
    ),
    g: ({
      children,
      initial: _initial,
      animate: _animate,
      transition: _transition,
      ...props
    }: React.SVGProps<SVGGElement> & MotionProps) => (
      <g {...props}>{children}</g>
    ),
  },
  useReducedMotion: vi.fn(() => false),
  useInView: vi.fn(() => true),
}));

describe("ArchitectureFleet", () => {
  beforeEach(() => {
    vi.mocked(FramerMotion.useReducedMotion).mockReturnValue(false);
    vi.mocked(FramerMotion.useInView).mockReturnValue(true);
  });

  it("renders an SVG element", () => {
    const { container } = render(<ArchitectureFleet />);
    const svg = container.querySelector("svg");
    expect(svg).toBeTruthy();
  });

  it("svg has role='img'", () => {
    const { container } = render(<ArchitectureFleet />);
    const svg = container.querySelector("svg");
    expect(svg?.getAttribute("role")).toBe("img");
  });

  it("svg has correct aria-label", () => {
    const { container } = render(<ArchitectureFleet />);
    const svg = container.querySelector("svg");
    expect(svg?.getAttribute("aria-label")).toBe(
      "System architecture: Mac orchestrator controls an agent fleet on a VPS, which drives integrations like email, calendar, and devices",
    );
  });

  it("renders exactly 3 circles (one per node)", () => {
    const { container } = render(<ArchitectureFleet />);
    const circles = container.querySelectorAll("circle");
    expect(circles).toHaveLength(3);
  });

  it("renders exactly 2 connector lines", () => {
    const { container } = render(<ArchitectureFleet />);
    const lines = container.querySelectorAll("line");
    expect(lines).toHaveLength(2);
  });

  describe("node labels", () => {
    it("renders Orchestrator label", () => {
      render(<ArchitectureFleet />);
      expect(screen.getByText("Orchestrator")).toBeTruthy();
    });

    it("renders Agent Fleet label", () => {
      render(<ArchitectureFleet />);
      expect(screen.getByText("Agent Fleet")).toBeTruthy();
    });

    it("renders Integrations label", () => {
      render(<ArchitectureFleet />);
      expect(screen.getByText("Integrations")).toBeTruthy();
    });
  });

  it("renders the visible caption below the SVG", () => {
    render(<ArchitectureFleet />);
    expect(
      screen.getByText(
        "One orchestrator, a fleet of agents, your tools — running around the clock.",
      ),
    ).toBeTruthy();
  });

  describe("reduced motion", () => {
    beforeEach(() => {
      vi.mocked(FramerMotion.useReducedMotion).mockReturnValue(true);
    });

    it("connector lines have static strokeOpacity of 0.5", () => {
      const { container } = render(<ArchitectureFleet />);
      const lines = container.querySelectorAll("line");
      lines.forEach((line) => {
        expect(line.getAttribute("stroke-opacity")).toBe("0.5");
      });
    });

    it("still renders 3 circles under reduced motion", () => {
      const { container } = render(<ArchitectureFleet />);
      expect(container.querySelectorAll("circle")).toHaveLength(3);
    });

    it("still renders 2 lines under reduced motion", () => {
      const { container } = render(<ArchitectureFleet />);
      expect(container.querySelectorAll("line")).toHaveLength(2);
    });
  });
});
