import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import Calculator from "../Calculator";
import { industries, painPoints, teamSizes } from "../calculator-data";
import { BOOKING_URL, BOOKING_MAILTO } from "../../lib/booking";

type MotionProps = {
  initial?: unknown;
  animate?: unknown;
  exit?: unknown;
  transition?: unknown;
  variants?: unknown;
  custom?: unknown;
  whileInView?: unknown;
  viewport?: unknown;
};

vi.mock("framer-motion", () => ({
  motion: {
    div: ({
      children,
      initial: _i,
      animate: _a,
      exit: _e,
      transition: _t,
      variants: _va,
      custom: _c,
      whileInView: _w,
      viewport: _v,
      ...props
    }: React.HTMLAttributes<HTMLDivElement> & MotionProps) => (
      <div {...props}>{children}</div>
    ),
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
  useReducedMotion: vi.fn(() => false),
  useInView: vi.fn(() => true),
}));

describe("Calculator", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    window.scrollTo = vi.fn();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  const advanceToResults = () => {
    // Step 1 — pick an industry, continue
    fireEvent.click(screen.getByText(industries[0].label));
    fireEvent.click(
      screen.getByRole("button", { name: /Continue to next step/i }),
    );
    // Step 2 — pick a pain point, continue
    fireEvent.click(screen.getByText(painPoints[0].label));
    fireEvent.click(
      screen.getByRole("button", { name: /Continue to next step/i }),
    );
    // Step 3 — pick a team size, generate
    fireEvent.click(
      screen.getAllByRole("button", { name: /Team size:.*people/i })[0],
    );
    fireEvent.click(
      screen.getByRole("button", { name: /Generate savings estimate/i }),
    );
    // The 2s loading delay
    act(() => {
      vi.advanceTimersByTime(2000);
    });
  };

  it("ends the wizard with a booking CTA pointing to the booking URL", () => {
    render(<Calculator />);
    advanceToResults();
    const cta = screen.getByRole("link", { name: /Book a call to capture/i });
    expect(cta.getAttribute("href")).toBe(BOOKING_URL);
    expect(cta.getAttribute("target")).toBe("_blank");
    expect(cta.getAttribute("rel")).toContain("noopener");
  });

  it("offers an email fallback on the results", () => {
    render(<Calculator />);
    advanceToResults();
    const email = screen.getByRole("link", { name: /Email me directly/i });
    expect(email.getAttribute("href")).toBe(BOOKING_MAILTO);
  });

  it("still renders the savings results (no calculator regression)", () => {
    render(<Calculator />);
    advanceToResults();
    // The results panel reports hours saved — proves calculation ran.
    expect(screen.getByText(/extra hours/i)).toBeTruthy();
  });
});
