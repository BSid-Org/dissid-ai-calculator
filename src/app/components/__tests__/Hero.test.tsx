import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import Hero from "../Hero";
import { BOOKING_URL, BOOKING_MAILTO } from "../../lib/booking";

type MotionProps = {
  initial?: unknown;
  animate?: unknown;
  transition?: unknown;
  whileInView?: unknown;
  viewport?: unknown;
  variants?: unknown;
  custom?: unknown;
  exit?: unknown;
};

const strip = ({
  children,
  initial: _i,
  animate: _a,
  transition: _t,
  whileInView: _w,
  viewport: _v,
  variants: _va,
  custom: _c,
  exit: _e,
  ...props
}: React.HTMLAttributes<HTMLElement> & MotionProps) => ({ children, props });

vi.mock("framer-motion", () => ({
  motion: {
    div: (p: React.HTMLAttributes<HTMLDivElement> & MotionProps) => {
      const { children, props } = strip(p);
      return <div {...props}>{children}</div>;
    },
    h1: (p: React.HTMLAttributes<HTMLHeadingElement> & MotionProps) => {
      const { children, props } = strip(p);
      return <h1 {...props}>{children}</h1>;
    },
    p: (p: React.HTMLAttributes<HTMLParagraphElement> & MotionProps) => {
      const { children, props } = strip(p);
      return <p {...props}>{children}</p>;
    },
  },
  useReducedMotion: vi.fn(() => false),
  useInView: vi.fn(() => true),
}));

// HeroVisual has its own poster/video gating + matchMedia; tested separately.
vi.mock("../HeroVisual", () => ({
  default: () => <div data-testid="hero-visual" />,
}));

describe("Hero", () => {
  it("primary CTA points to the booking URL in a new tab", () => {
    render(<Hero />);
    const cta = screen.getByRole("link", { name: /Book a Call/i });
    expect(cta.getAttribute("href")).toBe(BOOKING_URL);
    expect(cta.getAttribute("target")).toBe("_blank");
    expect(cta.getAttribute("rel")).toContain("noopener");
  });

  it("offers an email fallback", () => {
    render(<Hero />);
    const email = screen.getByRole("link", { name: /Email me directly/i });
    expect(email.getAttribute("href")).toBe(BOOKING_MAILTO);
  });

  it("renders the availability signal", () => {
    render(<Hero />);
    expect(screen.getByText(/Available for fractional/i)).toBeTruthy();
  });

  it("renders the hero visual", () => {
    render(<Hero />);
    expect(screen.getByTestId("hero-visual")).toBeTruthy();
  });
});
