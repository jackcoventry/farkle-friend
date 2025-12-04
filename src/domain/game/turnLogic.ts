import { DieValue, getScoringInfo, rollDice, scoreSelectedDice } from "./dice";

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
      isComplete: true,
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
  heldIndices: number[],
  turn: ActiveTurn
): ActiveTurn {
  if (!turn.currentRoll || turn.isComplete || heldIndices?.length === 0) {
    return turn;
  }

  const heldDice: DieValue[] = heldIndices
    .map((index) => turn.currentRoll![index])
    .filter((value): value is DieValue => value !== null);

  const score = scoreSelectedDice(heldDice);
  if (score <= 0) return turn;

  const remainingDice = turn.currentRoll.length - heldDice.length;
  // Gets next available dice count
  const nextAvailable = remainingDice === 0 ? 6 : remainingDice;

  return {
    ...turn,
    availableDice: nextAvailable,
    currentRoll: null,
    tempScore: turn.tempScore + score,
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
