import { getScoringInfo, rollDice } from "./dice";
import type { ActiveTurn, DiceRoll } from "./diceTypes";

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

// WHen player finishes their turn and banks the temporary score to their overall score.
export function finishActiveTurn(turn: ActiveTurn): ActiveTurn {
  if (turn.isComplete) return turn;
  return {
    ...turn,
    isComplete: true,
  };
}

// Roll a dice within a player's active turn
export function rollInActiveTurn(turn: ActiveTurn): ActiveTurn {
  if (turn.isComplete) return turn;

  const dice = rollDice(turn.availableDice);
  const currentRoll: DiceRoll = { dice };
  const scoringInfo = getScoringInfo(dice);

  if (scoringInfo.hasNoScoringDice) {
    // TODO: implement
    return {
      ...turn,
      currentRoll,
      isComplete: true,
      isFarkled: true,
      tempScore: 0,
    };
  }

  return {
    ...turn,
    currentRoll,
    isFarkled: false,
  };
}
