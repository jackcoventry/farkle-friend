import type { ActiveTurn } from "./diceTypes";

export function startActiveTurn(playerId: string): ActiveTurn {
  return {
    playerId,
    availableDice: 6,
    currentRoll: null,
    isComplete: false,
    isFarkled: false,
    tempScore: 0,
  };
}
