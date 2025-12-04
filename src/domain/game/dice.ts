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

  // Count any triple combo's
  for (let face = 1 as DieValue; face <= 6; face++) {
    if (counts[face] >= 3) {
      const tripleScore = face === 1 ? 1000 : face * 100;
      score += tripleScore;
      counts[face] -= 3;
    }
  }

  // Counts single 1's and 5's
  score += counts[1] * 100;
  score += counts[5] * 50;

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
