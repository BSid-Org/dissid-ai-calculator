import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import * as FramerMotion from "framer-motion";
import HeroVisual from "../HeroVisual";

vi.mock("framer-motion", () => ({
  useReducedMotion: vi.fn(() => false),
}));

function mockMatchMedia(matches: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
}

describe("HeroVisual", () => {
  beforeEach(() => {
    vi.mocked(FramerMotion.useReducedMotion).mockReturnValue(false);
  });

  describe("reduced motion", () => {
    beforeEach(() => {
      vi.mocked(FramerMotion.useReducedMotion).mockReturnValue(true);
      mockMatchMedia(true);
    });

    it("shows the poster image and no video", () => {
      const { container } = render(<HeroVisual />);
      expect(container.querySelectorAll("video")).toHaveLength(0);
      const img = screen.getByRole("img", { name: /orchestrator/i });
      expect(img.getAttribute("src")).toBe("/videos/hero-poster.jpg");
    });
  });

  describe("desktop, motion allowed", () => {
    beforeEach(() => {
      vi.mocked(FramerMotion.useReducedMotion).mockReturnValue(false);
      mockMatchMedia(true);
    });

    it("swaps in the autoplay loop video", () => {
      const { container } = render(<HeroVisual />);
      const videos = container.querySelectorAll("video");
      expect(videos).toHaveLength(1);
      const video = videos[0] as HTMLVideoElement;
      expect(video.getAttribute("src")).toBe("/videos/hero.mp4");
      expect(video.getAttribute("poster")).toBe("/videos/hero-poster.jpg");
      expect(
        video.hasAttribute("autoplay") || video.hasAttribute("autoPlay"),
      ).toBe(true);
      expect(video.hasAttribute("loop")).toBe(true);
      expect(video.muted).toBe(true);
      expect(
        video.hasAttribute("playsinline") || video.hasAttribute("playsInline"),
      ).toBe(true);
    });
  });

  describe("mobile (no desktop media match)", () => {
    beforeEach(() => {
      vi.mocked(FramerMotion.useReducedMotion).mockReturnValue(false);
      mockMatchMedia(false);
    });

    it("keeps the poster image and no video", () => {
      const { container } = render(<HeroVisual />);
      expect(container.querySelectorAll("video")).toHaveLength(0);
      expect(
        screen.getByRole("img", { name: /orchestrator/i }).getAttribute("src"),
      ).toBe("/videos/hero-poster.jpg");
    });
  });
});
