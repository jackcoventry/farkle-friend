import { describe, expect, it } from "vitest";
import {
  bankDiceFromCurrentRoll,
  rollInActiveTurn,
  startActiveTurn,
  type ActiveTurn,
} from "./turnLogic";

describe("turn logic", () => {
  it("rolls an active turn with an injectable random source", () => {
    const values = [0, 0.2, 0.4];
    let index = 0;
    const turn: ActiveTurn = {
      ...startActiveTurn("player-1"),
      availableDice: 3,
    };

    expect(rollInActiveTurn(turn, () => values[index++]).currentRoll).toEqual([
      1, 2, 3,
    ]);
  });

  it("banks a valid scoring selection and updates available dice", () => {
    const turn: ActiveTurn = {
      ...startActiveTurn("player-1"),
      currentRoll: [1, 2, 3, 4, 5, 6],
    };

    const next = bankDiceFromCurrentRoll(turn, [0, 4]);

    expect(next.tempScore).toBe(150);
    expect(next.availableDice).toBe(4);
    expect(next.currentRoll).toBeNull();
  });

  it("rejects selections that include non-scoring dice", () => {
    const turn: ActiveTurn = {
      ...startActiveTurn("player-1"),
      currentRoll: [1, 2, 3, 4, 2, 3],
    };

    expect(bankDiceFromCurrentRoll(turn, [0, 1, 2])).toBe(turn);
  });

  it("resets to six available dice after all rolled dice score", () => {
    const turn: ActiveTurn = {
      ...startActiveTurn("player-1"),
      currentRoll: [1, 1, 1],
    };

    const next = bankDiceFromCurrentRoll(turn, [0, 1, 2]);

    expect(next.tempScore).toBe(1000);
    expect(next.availableDice).toBe(6);
  });
});
