import { describe, expect, it } from "vitest";
import {
  getScoreBreakdown,
  rollDice,
  scoreSelectedDice,
  scoreSelectedDiceWithUsage,
  type DieValue,
} from "./dice";

describe("dice scoring", () => {
  it("rolls dice with an injectable random source", () => {
    const values = [0, 0.16, 0.33, 0.5, 0.66, 0.83];
    let index = 0;

    expect(rollDice(6, () => values[index++])).toEqual([1, 1, 2, 4, 4, 5]);
  });

  it.each([
    [[1], 100],
    [[5], 50],
    [[1, 1, 1], 1000],
    [[2, 2, 2], 200],
    [[3, 3, 3, 3], 600],
    [[4, 4, 4, 4, 4], 1200],
    [[6, 6, 6, 6], 1200],
    [[1, 1, 1, 1, 1, 1], 4000],
  ] satisfies Array<[DieValue[], number]>)(
    "scores selected dice %j as %i",
    (dice, expected) => {
      expect(scoreSelectedDice(dice)).toBe(expected);
    },
  );

  it.each([
    [[1, 2, 3, 4, 5, 6], 1500],
    [[1, 1, 2, 2, 3, 3], 1500],
    [[2, 2, 2, 3, 3, 3], 2500],
    [[1, 1, 1, 1, 1, 1], 4000],
  ] satisfies Array<[DieValue[], number]>)(
    "scores six-die combination %j as %i",
    (dice, expected) => {
      expect(scoreSelectedDice(dice)).toBe(expected);
    },
  );

  it.each([
    [[2, 3, 4, 6], { score: 0, usedCount: 0 }],
    [[1, 2, 3], { score: 100, usedCount: 1 }],
    [[5, 2, 3], { score: 50, usedCount: 1 }],
    [[1, 5, 2, 3], { score: 150, usedCount: 2 }],
    [[2, 2, 2, 4], { score: 200, usedCount: 3 }],
  ] satisfies Array<
    [DieValue[], ReturnType<typeof scoreSelectedDiceWithUsage>]
  >)("reports score usage for %j", (dice, expected) => {
    expect(scoreSelectedDiceWithUsage(dice)).toEqual(expected);
  });

  it("explains scoring selections", () => {
    expect(getScoreBreakdown([2, 2, 2, 1])).toEqual([
      { label: "3 2s", score: 200 },
      { label: "Single 1", score: 100 },
    ]);
    expect(getScoreBreakdown([1, 2, 3, 4, 5, 6])).toEqual([
      { label: "Straight", score: 1500 },
    ]);
    expect(getScoreBreakdown([1, 2, 3] as DieValue[])).toEqual([]);
  });
});
