import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Navbar from "../Navbar";
import { BOOKING_URL } from "../../lib/booking";

// Navbar does not import framer-motion — no mock needed.
describe("Navbar", () => {
  it('"Book a Call" CTA points to the booking URL in a new tab', () => {
    render(<Navbar />);
    const ctas = screen.getAllByRole("link", { name: /Book a Call/i });
    expect(ctas.length).toBeGreaterThan(0);
    for (const cta of ctas) {
      expect(cta.getAttribute("href")).toBe(BOOKING_URL);
      expect(cta.getAttribute("target")).toBe("_blank");
      expect(cta.getAttribute("rel")).toContain("noopener");
    }
  });

  it("keeps the section nav links", () => {
    render(<Navbar />);
    expect(screen.getByText("Services")).toBeTruthy();
    expect(screen.getByText("How It Works")).toBeTruthy();
    expect(screen.getByText("About")).toBeTruthy();
  });
});
