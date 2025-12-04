export type DieValue = 1 | 2 | 3 | 4 | 5 | 6; // Farkle uses 6-side dice

export function rollDice(count: number = 6): DieValue[] {
  return Array.from(
    { length: count },
    () => (Math.floor(Math.random() * 6) + 1) as DieValue
  );
}

type DiceAnalysis = {
  counts: number[];
  score: number;
};

function analyseDice(dice: DieValue[]): DiceAnalysis {
  const counts = [0, 0, 0, 0, 0, 0, 0]; // Temporarily not zero indexed so it doesn't confuse my feeble brain

  dice.forEach((d) => {
    counts[d] += 1;
  });

  let score = 0;

  // TODO: iterate over dice values to calc score
  return { counts, score };
}

//
export function scoreSelectedDice(dice: DieValue[]): number {
  const { score } = analyseDice(dice);
  return score;
}

export function getScoringInfo(dice: DieValue[]) {
  const { counts, score } = analyseDice(dice);
  const hasScoringDice = score > 0;
  return {
    counts,
    hasNoScoringDice: !hasScoringDice,
    hasScoringDice,
  };
}
