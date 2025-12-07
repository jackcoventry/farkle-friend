import {
  DieValue,
  getScoringInfo,
  rollDice,
  scoreSelectedDiceWithUsage,
} from "./dice";

export type ActiveTurn = {
  availableDice: number;
  currentRoll: DieValue[] | null;
  isComplete: boolean;
  isFarkled: boolean;
  playerId: string;
  tempScore: number;
};

export function startActiveTurn(playerId: string): ActiveTurn {
  return {
    availableDice: 6,
    currentRoll: null,
    isComplete: false,
    isFarkled: false,
    playerId,
    tempScore: 0,
  };
}

// Roll a dice within a player's active turn
export function rollInActiveTurn(turn: ActiveTurn): ActiveTurn {
  if (turn.isComplete) return turn;

  const dice = rollDice(turn.availableDice);
  const scoring = getScoringInfo(dice);

  if (scoring.hasNoScoringDice) {
    return {
      ...turn,
      currentRoll: dice,
      isComplete: false,
      isFarkled: true,
      tempScore: 0,
    };
  }

  return {
    ...turn,
    currentRoll: dice,
    isFarkled: false,
  };
}

export function bankDiceFromCurrentRoll(
  turn: ActiveTurn,
  heldIndices: number[]
): ActiveTurn {
  if (!turn.currentRoll || turn.isComplete) return turn;
  if (heldIndices.length === 0) return turn;

  const heldDice: DieValue[] = heldIndices
    .map((i) => turn.currentRoll![i])
    .filter((v): v is DieValue => v != null);

  if (heldDice.length === 0) return turn;

  const { score, usedCount } = scoreSelectedDiceWithUsage(heldDice);

  if (score <= 0 || usedCount === 0) {
    return turn;
  }

  const remainingDiceCount = turn.currentRoll.length - usedCount;

  let nextAvailable = remainingDiceCount;
  if (remainingDiceCount === 0) {
    nextAvailable = 6;
  }

  return {
    ...turn,
    tempScore: turn.tempScore + score,
    availableDice: nextAvailable,
    currentRoll: null,
  };
}

// WHen player finishes their turn and banks the temporary score to their overall score.
export function finishActiveTurn(turn: ActiveTurn): ActiveTurn {
  if (turn.isComplete) return turn;
  return {
    ...turn,
    isComplete: true,
  };
}
