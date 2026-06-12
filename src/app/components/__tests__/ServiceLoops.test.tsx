import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import * as FramerMotion from "framer-motion";
import ServiceLoops from "../ServiceLoops";

// Framer-only props that must not leak onto raw DOM elements
type MotionProps = {
  initial?: unknown;
  animate?: unknown;
  transition?: unknown;
  whileInView?: unknown;
  viewport?: unknown;
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
      ...props
    }: React.HTMLAttributes<HTMLDivElement> & MotionProps) => (
      <div {...props}>{children}</div>
    ),
  },
  useReducedMotion: vi.fn(() => false),
  useInView: vi.fn(() => true),
}));

describe("ServiceLoops", () => {
  beforeEach(() => {
    vi.mocked(FramerMotion.useReducedMotion).mockReturnValue(false);
    vi.mocked(FramerMotion.useInView).mockReturnValue(true);
  });

  describe("reduced motion: true", () => {
    beforeEach(() => {
      vi.mocked(FramerMotion.useReducedMotion).mockReturnValue(true);
    });

    it("renders no <video> element", () => {
      const { container } = render(<ServiceLoops />);
      const videos = container.querySelectorAll("video");
      expect(videos).toHaveLength(0);
    });

    it("renders both poster <img> elements", () => {
      const { container } = render(<ServiceLoops />);
      const imgs = container.querySelectorAll("img");
      expect(imgs).toHaveLength(2);
      expect(imgs[0].getAttribute("src")).toBe(
        "/videos/agent-fleet-poster.jpg",
      );
      expect(imgs[1].getAttribute("src")).toBe(
        "/videos/mcp-data-flow-poster.jpg",
      );
    });
  });

  describe("reduced motion: false, inView: false", () => {
    beforeEach(() => {
      vi.mocked(FramerMotion.useReducedMotion).mockReturnValue(false);
      vi.mocked(FramerMotion.useInView).mockReturnValue(false);
    });

    it("renders no <video> element", () => {
      const { container } = render(<ServiceLoops />);
      const videos = container.querySelectorAll("video");
      expect(videos).toHaveLength(0);
    });

    it("renders both poster <img> placeholders", () => {
      const { container } = render(<ServiceLoops />);
      const imgs = container.querySelectorAll("img");
      expect(imgs).toHaveLength(2);
      expect(imgs[0].getAttribute("src")).toBe(
        "/videos/agent-fleet-poster.jpg",
      );
      expect(imgs[1].getAttribute("src")).toBe(
        "/videos/mcp-data-flow-poster.jpg",
      );
    });
  });

  describe("reduced motion: false, inView: true", () => {
    beforeEach(() => {
      vi.mocked(FramerMotion.useReducedMotion).mockReturnValue(false);
      vi.mocked(FramerMotion.useInView).mockReturnValue(true);
    });

    it("renders both captions", () => {
      render(<ServiceLoops />);
      expect(screen.getByText("Agent fleet orchestration")).toBeTruthy();
      expect(screen.getByText("MCP data flow")).toBeTruthy();
    });

    it("renders <video> elements with correct attributes", () => {
      const { container } = render(<ServiceLoops />);
      const videos = container.querySelectorAll("video");
      expect(videos).toHaveLength(2);

      const fleet = videos[0] as HTMLVideoElement;
      // autoPlay becomes the "autoplay" attribute in the DOM
      expect(
        fleet.hasAttribute("autoplay") || fleet.hasAttribute("autoPlay"),
      ).toBe(true);
      // muted is a DOM property in jsdom, not reflected as an HTML attribute
      expect(fleet.muted).toBe(true);
      expect(fleet.hasAttribute("loop")).toBe(true);
      // playsInline is lowercased to "playsinline" in the DOM
      expect(
        fleet.hasAttribute("playsinline") || fleet.hasAttribute("playsInline"),
      ).toBe(true);
      expect(fleet.getAttribute("poster")).toBe(
        "/videos/agent-fleet-poster.jpg",
      );
      expect(fleet.getAttribute("src")).toBe("/videos/agent-fleet.mp4");

      const mcp = videos[1] as HTMLVideoElement;
      expect(mcp.getAttribute("poster")).toBe(
        "/videos/mcp-data-flow-poster.jpg",
      );
      expect(mcp.getAttribute("src")).toBe("/videos/mcp-data-flow.mp4");
    });
  });
});
