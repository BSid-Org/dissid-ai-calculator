import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import Services from "../Services";

type MotionProps = {
  initial?: unknown;
  whileInView?: unknown;
  viewport?: unknown;
  transition?: unknown;
};

vi.mock("framer-motion", () => ({
  motion: {
    div: ({
      children,
      initial: _i,
      whileInView: _w,
      viewport: _v,
      transition: _t,
      ...props
    }: React.HTMLAttributes<HTMLDivElement> & MotionProps) => (
      <div {...props}>{children}</div>
    ),
  },
  useReducedMotion: vi.fn(() => false),
  useInView: vi.fn(() => true),
}));

// ServiceLoops renders its own videos; not under test here.
vi.mock("../ServiceLoops", () => ({ default: () => null }));

describe("Services", () => {
  it("renders exactly 3 service cards (AI Hardware removed)", () => {
    const { container } = render(<Services />);
    const cards = container.querySelectorAll(".glass-panel.card-glow");
    expect(cards).toHaveLength(3);
  });

  it("does not advertise the hardware product as a service", () => {
    render(<Services />);
    expect(screen.queryByText(/AI Hardware/i)).toBeNull();
    expect(screen.queryByText(/scanner-shredder/i)).toBeNull();
  });

  it("shows plain-language subtext under each service", () => {
    render(<Services />);
    expect(screen.getByText(/multi-step work for you/i)).toBeTruthy();
    expect(screen.getByText(/fast, reliable, and cheap to run/i)).toBeTruthy();
    expect(screen.getByText(/on-device image understanding/i)).toBeTruthy();
  });
});
