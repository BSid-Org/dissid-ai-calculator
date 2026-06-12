import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import * as FramerMotion from "framer-motion";
import WhatIBuildVideo from "../WhatIBuildVideo";

vi.mock("framer-motion", () => ({
  useReducedMotion: vi.fn(() => false),
  useInView: vi.fn(() => true),
}));

describe("WhatIBuildVideo", () => {
  beforeEach(() => {
    vi.mocked(FramerMotion.useReducedMotion).mockReturnValue(false);
    vi.mocked(FramerMotion.useInView).mockReturnValue(true);
  });

  describe("reduced=false, inView=true", () => {
    beforeEach(() => {
      vi.mocked(FramerMotion.useReducedMotion).mockReturnValue(false);
      vi.mocked(FramerMotion.useInView).mockReturnValue(true);
    });

    it("renders <video> with correct src, poster, controls, playsinline; no autoplay, no loop", () => {
      const { container } = render(<WhatIBuildVideo />);
      const videos = container.querySelectorAll("video");
      expect(videos).toHaveLength(1);

      const video = videos[0] as HTMLVideoElement;
      expect(video.getAttribute("src")).toBe("/videos/what-i-build.mp4");
      expect(video.getAttribute("poster")).toBe(
        "/videos/what-i-build-poster.jpg",
      );
      expect(video.hasAttribute("controls")).toBe(true);
      // muted is a DOM property in jsdom, not reflected as an HTML attribute
      expect(video.muted).toBe(true);
      expect(
        video.hasAttribute("playsinline") || video.hasAttribute("playsInline"),
      ).toBe(true);
      // Must NOT have autoplay
      expect(
        video.hasAttribute("autoplay") || video.hasAttribute("autoPlay"),
      ).toBe(false);
      // Must NOT have loop
      expect(video.hasAttribute("loop")).toBe(false);
    });
  });

  describe("reduced=true", () => {
    beforeEach(() => {
      vi.mocked(FramerMotion.useReducedMotion).mockReturnValue(true);
    });

    it("renders poster <img> with alt text and no <video>", () => {
      const { container } = render(<WhatIBuildVideo />);
      const videos = container.querySelectorAll("video");
      expect(videos).toHaveLength(0);

      const img = screen.getByAltText("What I Build explainer");
      expect(img.getAttribute("src")).toBe("/videos/what-i-build-poster.jpg");
    });
  });

  describe("reduced=false, inView=false", () => {
    beforeEach(() => {
      vi.mocked(FramerMotion.useReducedMotion).mockReturnValue(false);
      vi.mocked(FramerMotion.useInView).mockReturnValue(false);
    });

    it("renders poster <img> with alt text and no <video>", () => {
      const { container } = render(<WhatIBuildVideo />);
      const videos = container.querySelectorAll("video");
      expect(videos).toHaveLength(0);

      const img = screen.getByAltText("What I Build explainer");
      expect(img.getAttribute("src")).toBe("/videos/what-i-build-poster.jpg");
    });
  });
});
