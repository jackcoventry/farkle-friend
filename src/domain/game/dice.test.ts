import { describe, expect, it } from "vitest";
import {
  scoreSelectedDice,
  scoreSelectedDiceWithUsage,
  type DieValue,
} from "./dice";

describe("dice scoring", () => {
  it("scores singles, triples, and higher multiples", () => {
    expect(scoreSelectedDice([1])).toBe(100);
    expect(scoreSelectedDice([5])).toBe(50);
    expect(scoreSelectedDice([1, 1, 1])).toBe(1000);
    expect(scoreSelectedDice([2, 2, 2])).toBe(200);
    expect(scoreSelectedDice([6, 6, 6, 6])).toBe(1200);
  });

  it("scores six-die special combinations", () => {
    expect(scoreSelectedDice([1, 2, 3, 4, 5, 6])).toBe(1500);
    expect(scoreSelectedDice([1, 1, 2, 2, 3, 3])).toBe(1500);
    expect(scoreSelectedDice([2, 2, 2, 3, 3, 3])).toBe(2500);
  });

  it("reports how many selected dice are actually used for scoring", () => {
    const result = scoreSelectedDiceWithUsage([1, 2, 3] as DieValue[]);

    expect(result).toEqual({ score: 100, usedCount: 1 });
  });
});
