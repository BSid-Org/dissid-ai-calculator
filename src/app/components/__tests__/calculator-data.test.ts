import { describe, it, expect } from "vitest";
import {
  industries,
  painPoints,
  teamSizes,
  calculateResults,
} from "../calculator-data";

describe("calculator-data", () => {
  describe("data integrity", () => {
    it("exports 8 industries", () => {
      expect(industries).toHaveLength(8);
      industries.forEach((ind) => {
        expect(ind.id).toBeTruthy();
        expect(ind.label).toBeTruthy();
        expect(ind.icon).toBeTruthy();
      });
    });

    it("exports 8 pain points with valid costs", () => {
      expect(painPoints).toHaveLength(8);
      painPoints.forEach((pp) => {
        expect(pp.hourlyCost).toBeGreaterThan(0);
        expect(pp.replacementPct).toBeGreaterThan(0);
        expect(pp.replacementPct).toBeLessThanOrEqual(1);
        expect(pp.aiCostPerMonth).toBeGreaterThan(0);
      });
    });

    it("exports 5 team sizes with valid multipliers", () => {
      expect(teamSizes).toHaveLength(5);
      teamSizes.forEach((ts) => {
        expect(ts.multiplier).toBeGreaterThanOrEqual(1);
      });
    });
  });

  describe("calculateResults", () => {
    it("returns zero savings for empty selection", () => {
      const result = calculateResults([], "solo", 20);
      expect(result.totalMonthlySavings).toBe(0);
      expect(result.totalHoursSaved).toBe(0);
      expect(result.totalAiCost).toBe(0);
      expect(result.roi).toBe(0);
      expect(result.breakdown).toHaveLength(0);
    });

    it("calculates savings for single pain point", () => {
      const result = calculateResults(["support"], "solo", 20);
      expect(result.totalMonthlySavings).toBeGreaterThan(0);
      expect(result.totalHoursSaved).toBeGreaterThan(0);
      expect(result.breakdown).toHaveLength(1);
      expect(result.breakdown[0].id).toBe("support");
    });

    it("calculates savings for multiple pain points", () => {
      const result = calculateResults(
        ["support", "scheduling", "content"],
        "small",
        30,
      );
      expect(result.breakdown).toHaveLength(3);
      expect(result.totalMonthlySavings).toBeGreaterThan(0);
      expect(result.annualSavings).toBe(result.totalMonthlySavings * 12);
    });

    it("increases savings with larger team size", () => {
      const soloResult = calculateResults(["dataentry"], "solo", 20);
      const largeResult = calculateResults(["dataentry"], "large", 20);
      expect(largeResult.totalMonthlySavings).toBeGreaterThan(
        soloResult.totalMonthlySavings,
      );
    });

    it("increases savings with more hours", () => {
      const lowHours = calculateResults(["leadgen"], "solo", 10);
      const highHours = calculateResults(["leadgen"], "solo", 40);
      expect(highHours.totalMonthlySavings).toBeGreaterThan(
        lowHours.totalMonthlySavings,
      );
    });

    it("handles invalid team size by defaulting to first", () => {
      const result = calculateResults(["support"], "invalid-team", 20);
      expect(result.totalMonthlySavings).toBeGreaterThan(0);
    });

    it("calculates positive ROI for reasonable inputs", () => {
      const result = calculateResults(["support", "scheduling"], "growing", 30);
      expect(result.roi).toBeGreaterThan(0);
    });

    it("never returns negative savings in breakdown", () => {
      const result = calculateResults(
        painPoints.map((p) => p.id).slice(0, 3),
        "solo",
        5,
      );
      result.breakdown.forEach((item) => {
        expect(item.savings).toBeGreaterThanOrEqual(0);
      });
    });
  });
});
