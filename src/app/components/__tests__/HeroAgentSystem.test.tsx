import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import * as FramerMotion from "framer-motion";
import HeroAgentSystem from "../HeroAgentSystem";

// Framer-only props that must not leak onto raw DOM elements
type MotionProps = {
  initial?: unknown;
  animate?: unknown;
  transition?: unknown;
};

// Mock framer-motion to avoid animation-related issues in jsdom.
// Destructure framer-only props out so they don't reach the DOM.
vi.mock("framer-motion", () => ({
  motion: {
    div: ({
      children,
      initial: _initial,
      animate: _animate,
      transition: _transition,
      ...props
    }: React.HTMLAttributes<HTMLDivElement> & MotionProps) => (
      <div {...props}>{children}</div>
    ),
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
      ...props
    }: React.SVGProps<SVGLineElement> & MotionProps) => <line {...props} />,
  },
  useReducedMotion: vi.fn(() => false),
}));

describe("HeroAgentSystem", () => {
  beforeEach(() => {
    vi.mocked(FramerMotion.useReducedMotion).mockReturnValue(false);
  });

  it("renders without crashing", () => {
    const { container } = render(<HeroAgentSystem />);
    expect(container.firstChild).toBeTruthy();
  });

  it("renders an SVG element", () => {
    const { container } = render(<HeroAgentSystem />);
    const svg = container.querySelector("svg");
    expect(svg).toBeTruthy();
  });

  it("has 1 central node plus 5 radial nodes (6 circles total)", () => {
    const { container } = render(<HeroAgentSystem />);
    const circles = container.querySelectorAll("circle");
    expect(circles).toHaveLength(6);
  });

  it("has 5 lines connecting radial nodes to center", () => {
    const { container } = render(<HeroAgentSystem />);
    const lines = container.querySelectorAll("line");
    expect(lines).toHaveLength(5);
  });

  it("renders the caption text", () => {
    render(<HeroAgentSystem />);
    expect(screen.getByText("Agents working in parallel")).toBeTruthy();
  });

  it("SVG has aria-hidden for screen reader accessibility", () => {
    const { container } = render(<HeroAgentSystem />);
    const svg = container.querySelector("svg");
    expect(svg?.getAttribute("aria-hidden")).toBe("true");
  });

  describe("reduced motion fallback", () => {
    beforeEach(() => {
      vi.mocked(FramerMotion.useReducedMotion).mockReturnValue(true);
    });

    it("renders the same structure under reduced motion", () => {
      const { container } = render(<HeroAgentSystem />);
      expect(container.querySelectorAll("circle")).toHaveLength(6);
      expect(container.querySelectorAll("line")).toHaveLength(5);
    });

    it("lines have strokeOpacity 0.5 under reduced motion", () => {
      const { container } = render(<HeroAgentSystem />);
      const lines = container.querySelectorAll("line");
      lines.forEach((line) => {
        expect(line.getAttribute("stroke-opacity")).toBe("0.5");
      });
    });
  });
});
