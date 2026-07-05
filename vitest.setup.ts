import { vi } from "vitest";

// jsdom does not implement scrollIntoView; Calculator.tsx calls it on step change.
// Stub it so component tests exercise the real render path without throwing.
if (!Element.prototype.scrollIntoView) {
  Element.prototype.scrollIntoView = vi.fn();
}
