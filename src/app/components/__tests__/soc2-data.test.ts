import { describe, it, expect } from "vitest";
import {
  categories,
  questions,
  questionsInScope,
  scoreReadiness,
  type Answer,
  type CategoryId,
} from "../soc2-data";

// Build an answer map applying one answer to every in-scope question.
function answerAll(
  selected: CategoryId[],
  answer: Answer,
): Record<string, Answer> {
  const map: Record<string, Answer> = {};
  for (const q of questionsInScope(selected)) map[q.id] = answer;
  return map;
}

describe("soc2-data", () => {
  describe("data integrity", () => {
    it("exports the 5 AICPA Trust Services Categories", () => {
      expect(categories).toHaveLength(5);
      const ids = categories.map((c) => c.id);
      expect(ids).toEqual([
        "security",
        "availability",
        "confidentiality",
        "processing_integrity",
        "privacy",
      ]);
    });

    it("marks only Security as mandatory", () => {
      const mandatory = categories.filter((c) => c.mandatory);
      expect(mandatory).toHaveLength(1);
      expect(mandatory[0].id).toBe("security");
    });

    it("exports 15–25 questions, each grounded in a real criterion + control", () => {
      expect(questions.length).toBeGreaterThanOrEqual(15);
      expect(questions.length).toBeLessThanOrEqual(25);
      const validCats = new Set(categories.map((c) => c.id));
      questions.forEach((q) => {
        expect(q.id).toBeTruthy();
        expect(validCats.has(q.category)).toBe(true);
        // criterion must look like a real TSC id (CC#.#, A1.#, C1.#, PI1.#, P#.#)
        expect(q.criterion).toMatch(/^(CC\d|A1|C1|PI1|P\d)/);
        expect(q.control).toBeTruthy();
        expect(q.remediation).toBeTruthy();
        expect(["high", "medium", "low"]).toContain(q.priority);
      });
    });

    it("has unique question ids", () => {
      const ids = questions.map((q) => q.id);
      expect(new Set(ids).size).toBe(ids.length);
    });

    it("always includes Security questions, several high-priority", () => {
      const sec = questions.filter((q) => q.category === "security");
      expect(sec.length).toBeGreaterThanOrEqual(8);
      expect(sec.filter((q) => q.priority === "high").length).toBeGreaterThan(0);
    });
  });

  describe("questionsInScope", () => {
    it("always includes Security even when not selected", () => {
      const scoped = questionsInScope([]);
      expect(scoped.length).toBeGreaterThan(0);
      expect(scoped.every((q) => q.category === "security")).toBe(true);
    });

    it("adds elective categories when selected", () => {
      const secOnly = questionsInScope([]).length;
      const withPrivacy = questionsInScope(["privacy"]).length;
      expect(withPrivacy).toBeGreaterThan(secOnly);
      expect(
        questionsInScope(["privacy"]).some((q) => q.category === "privacy"),
      ).toBe(true);
    });

    it("does not include unselected elective questions", () => {
      const scoped = questionsInScope(["availability"]);
      expect(scoped.some((q) => q.category === "privacy")).toBe(false);
    });
  });

  describe("scoreReadiness", () => {
    it("all-yes yields ~100% and zero gaps", () => {
      const result = scoreReadiness([], answerAll([], "yes"));
      expect(result.overall).toBe(100);
      expect(result.gaps).toHaveLength(0);
      expect(result.highGaps).toBe(0);
      expect(result.effort).toBe("low");
    });

    it("all-no yields 0% and a gap for every question", () => {
      const result = scoreReadiness([], answerAll([], "no"));
      expect(result.overall).toBe(0);
      expect(result.gaps.length).toBe(questionsInScope([]).length);
      expect(result.effort).toBe("high");
    });

    it("all-partial yields ~50%", () => {
      const result = scoreReadiness([], answerAll([], "partial"));
      // Weighted partials = exactly half of max, regardless of priority weights.
      expect(result.overall).toBe(50);
      // Every partial surfaces as a gap.
      expect(result.gaps.length).toBe(questionsInScope([]).length);
    });

    it("unanswered questions score as 'no' but are not listed as gaps", () => {
      const result = scoreReadiness([], {});
      expect(result.overall).toBe(0);
      expect(result.gaps).toHaveLength(0); // nothing answered → nothing to remediate
    });

    it("is Security-weighted: a high-priority Security gap costs more than a low one", () => {
      const base = answerAll([], "yes");
      const highId = questions.find(
        (q) => q.category === "security" && q.priority === "high",
      )!.id;
      const lowId = questions.find(
        (q) => q.category === "security" && q.priority === "low",
      )!.id;

      const missHigh = scoreReadiness([], { ...base, [highId]: "no" });
      const missLow = scoreReadiness([], { ...base, [lowId]: "no" });

      // Missing a high-priority control drops readiness more than a low one.
      expect(missHigh.overall).toBeLessThan(missLow.overall);
    });

    it("orders gaps high → low priority, 'no' before 'partial' within a tier", () => {
      // Answer everything 'no' so every question is a gap.
      const result = scoreReadiness(
        ["availability", "confidentiality", "processing_integrity", "privacy"],
        answerAll(
          ["availability", "confidentiality", "processing_integrity", "privacy"],
          "no",
        ),
      );
      const rank = { high: 0, medium: 1, low: 2 } as const;
      for (let i = 1; i < result.gaps.length; i++) {
        expect(rank[result.gaps[i].priority]).toBeGreaterThanOrEqual(
          rank[result.gaps[i - 1].priority],
        );
      }
      // First gap is a high-priority one.
      expect(result.gaps[0].priority).toBe("high");
    });

    it("ties 'no' ahead of 'partial' inside the same priority tier", () => {
      const highs = questions.filter((q) => q.priority === "high");
      // Pick two high-priority questions; mark one 'no', one 'partial'.
      const noId = highs[0].id;
      const partialId = highs[1].id;
      const result = scoreReadiness(
        ["availability", "confidentiality", "processing_integrity", "privacy"],
        { [noId]: "no", [partialId]: "partial" },
      );
      const idxNo = result.gaps.findIndex((g) => g.questionId === noId);
      const idxPartial = result.gaps.findIndex(
        (g) => g.questionId === partialId,
      );
      expect(idxNo).toBeLessThan(idxPartial);
    });

    it("reports per-category readiness only for in-scope categories", () => {
      const result = scoreReadiness(["privacy"], answerAll(["privacy"], "yes"));
      const ids = result.perCategory.map((c) => c.id);
      expect(ids).toContain("security");
      expect(ids).toContain("privacy");
      expect(ids).not.toContain("availability");
      result.perCategory.forEach((c) => {
        expect(c.readiness).toBe(100);
        expect(c.total).toBeGreaterThan(0);
      });
    });

    it("produces a medium-effort band for a mixed answer set", () => {
      const scoped = questionsInScope([]);
      const map: Record<string, Answer> = {};
      scoped.forEach((q, i) => {
        map[q.id] = i % 2 === 0 ? "yes" : "no";
      });
      const result = scoreReadiness([], map);
      expect(result.overall).toBeGreaterThan(0);
      expect(result.overall).toBeLessThan(100);
    });
  });
});
