import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, act, waitFor } from "@testing-library/react";
import Soc2Scanner from "../Soc2Scanner";
import { questionsInScope } from "../soc2-data";
import { CONTACT_ENDPOINT } from "../../lib/booking";

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

// Answer every Security (default-scope) question with the given answer label.
function answerAllSecurity(label: "Yes" | "Partial" | "No") {
  const scoped = questionsInScope([]);
  scoped.forEach((q) => {
    const group = screen.getByRole("group", { name: q.control });
    const btn = group.querySelector<HTMLButtonElement>(
      `button[aria-label="${q.control}: ${label}"]`,
    );
    if (btn) fireEvent.click(btn);
  });
}

function advanceToResults(label: "Yes" | "Partial" | "No" = "Yes") {
  // Step 1 — Security is mandatory, just continue.
  fireEvent.click(
    screen.getByRole("button", { name: /Continue to assessment/i }),
  );
  // Step 2 — answer everything, then score.
  answerAllSecurity(label);
  fireEvent.click(screen.getByRole("button", { name: /Score my readiness/i }));
  act(() => {
    vi.advanceTimersByTime(1500);
  });
}

describe("Soc2Scanner", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    window.scrollTo = vi.fn();
  });
  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("renders step 1 with the scope question and Security required", () => {
    render(<Soc2Scanner />);
    expect(
      screen.getByText(/Which Trust Services Categories are in scope/i),
    ).toBeTruthy();
    // The mandatory Security badge reads "Required".
    expect(screen.getAllByText(/Required/i).length).toBeGreaterThan(0);
  });

  it("advances from scope to the assessment step", () => {
    render(<Soc2Scanner />);
    fireEvent.click(
      screen.getByRole("button", { name: /Continue to assessment/i }),
    );
    expect(screen.getByText(/Assess your controls/i)).toBeTruthy();
  });

  it("keeps the score button disabled until every question is answered", () => {
    render(<Soc2Scanner />);
    fireEvent.click(
      screen.getByRole("button", { name: /Continue to assessment/i }),
    );
    const scoreBtn = screen.getByRole("button", {
      name: /Score my readiness/i,
    }) as HTMLButtonElement;
    expect(scoreBtn.disabled).toBe(true);
  });

  it("shows results with overall readiness and a per-category breakdown", () => {
    render(<Soc2Scanner />);
    advanceToResults("Yes");
    expect(screen.getByText(/Estimated SOC 2 Readiness/i)).toBeTruthy();
    // The big overall % is an <h2> heading (per-category bars also show %s).
    const overall = screen.getByRole("heading", { name: "100%" });
    expect(overall).toBeTruthy();
    expect(screen.getByText(/Per-category readiness/i)).toBeTruthy();
  });

  it("lists prioritized gaps when controls are not met", () => {
    render(<Soc2Scanner />);
    advanceToResults("No");
    expect(screen.getByText(/Prioritized gaps/i)).toBeTruthy();
    // 0% overall when everything is 'no'.
    expect(screen.getByRole("heading", { name: "0%" })).toBeTruthy();
    // At least one high-priority Security remediation appears.
    expect(screen.getByText(/high-priority/i)).toBeTruthy();
  });

  it("includes the disclaimer that this is not a SOC 2 audit", () => {
    render(<Soc2Scanner />);
    advanceToResults("Yes");
    expect(
      screen.getByText(/NOT a SOC 2 audit/i),
    ).toBeTruthy();
  });

  it("drives the primary CTA to the Readiness Sprint booking link", () => {
    render(<Soc2Scanner />);
    advanceToResults("Yes");
    const cta = screen.getByRole("link", {
      name: /Start my 5-day Readiness Sprint/i,
    });
    expect(cta.getAttribute("href")).toBe(
      "https://calendly.com/siddhantbadola5/30min",
    );
  });

  describe("email capture", () => {
    it("rejects an invalid email and does not POST", async () => {
      const fetchMock = vi.fn();
      vi.stubGlobal("fetch", fetchMock);
      render(<Soc2Scanner />);
      advanceToResults("Yes");

      const input = screen.getByPlaceholderText(/you@startup.com/i);
      // "founder@startup" passes the browser's native type=email check but
      // fails our stricter regex (no TLD) — exercises the JS validation layer.
      fireEvent.change(input, { target: { value: "founder@startup" } });
      const form = input.closest("form")!;
      fireEvent.submit(form);
      expect(screen.getByText(/valid email address/i)).toBeTruthy();
      expect(fetchMock).not.toHaveBeenCalled();
    });

    it("POSTs the lead to the contact Cloud Function on a valid email", async () => {
      const fetchMock = vi
        .fn()
        .mockResolvedValue({ ok: true, status: 200 } as Response);
      vi.stubGlobal("fetch", fetchMock);

      render(<Soc2Scanner />);
      advanceToResults("Yes"); // fake-timer driven, reaches results

      const input = screen.getByPlaceholderText(/you@startup.com/i);
      fireEvent.change(input, { target: { value: "founder@startup.com" } });
      await act(async () => {
        fireEvent.click(
          screen.getByRole("button", { name: /Email me the roadmap/i }),
        );
        // Flush the fetch promise chain under fake timers.
        await vi.runAllTimersAsync();
      });

      expect(fetchMock).toHaveBeenCalledTimes(1);
      const [url, opts] = fetchMock.mock.calls[0];
      expect(url).toBe(CONTACT_ENDPOINT);
      expect(opts.method).toBe("POST");
      const body = JSON.parse(opts.body);
      expect(body.email).toBe("founder@startup.com");
      expect(body.message).toMatch(/SOC 2 readiness/i);
      expect(screen.getByText(/Roadmap on its way/i)).toBeTruthy();
    });
  });
});
