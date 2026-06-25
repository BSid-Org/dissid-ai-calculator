import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Footer from "../Footer";
import { BOOKING_URL } from "../../lib/booking";

// Footer does not import framer-motion — no mock needed.
describe("Footer", () => {
  it('"Book a Call" CTA points to the booking URL in a new tab', () => {
    render(<Footer />);
    const cta = screen.getByRole("link", { name: /Book a Call/i });
    expect(cta.getAttribute("href")).toBe(BOOKING_URL);
    expect(cta.getAttribute("target")).toBe("_blank");
    expect(cta.getAttribute("rel")).toContain("noopener");
  });

  it('offers a "Send me a message" path to the contact form', () => {
    render(<Footer />);
    // The mailto fallback was replaced by a button that scrolls to the
    // in-page contact form (the form is the secondary "send a message" path).
    const msg = screen.getByRole("button", { name: /Send me a message/i });
    expect(msg).toBeTruthy();
  });
});
