import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Footer from "../Footer";
import { BOOKING_URL, BOOKING_MAILTO } from "../../lib/booking";

// Footer does not import framer-motion — no mock needed.
describe("Footer", () => {
  it('"Book a Call" CTA points to the booking URL in a new tab', () => {
    render(<Footer />);
    const cta = screen.getByRole("link", { name: /Book a Call/i });
    expect(cta.getAttribute("href")).toBe(BOOKING_URL);
    expect(cta.getAttribute("target")).toBe("_blank");
    expect(cta.getAttribute("rel")).toContain("noopener");
  });

  it("offers an email fallback", () => {
    render(<Footer />);
    const email = screen.getByRole("link", { name: /Email me directly/i });
    expect(email.getAttribute("href")).toBe(BOOKING_MAILTO);
  });
});
