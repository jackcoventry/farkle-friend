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
  const counts = [0, 0, 0, 0, 0, 0, 0];

  for (const d of dice) {
    counts[d] += 1;
  }

  const work = [...counts];
  let score = 0;

  if (dice.length === 6) {
    const isStraight =
      work[1] === 1 &&
      work[2] === 1 &&
      work[3] === 1 &&
      work[4] === 1 &&
      work[5] === 1 &&
      work[6] === 1;

    if (isStraight) {
      return { counts, score: 1500 };
    }

    const pairCount = work.filter((c) => c === 2).length;
    if (pairCount === 3) {
      // Three distinct pairs
      return { counts, score: 1500 };
    }

    const tripleFaces = work.filter((c) => c === 3).length;
    if (tripleFaces === 2) {
      // Two different triples
      return { counts, score: 2500 };
    }
  }

  for (let face = 1 as DieValue; face <= 6; face++) {
    const count = work[face];
    if (count >= 3) {
      const base = face === 1 ? 1000 : face * 100;
      const multiplier = count - 2;
      score += base * multiplier;
      work[face] = 0;
    }
  }

  // only 1s and 5s score
  if (work[1] > 0) {
    score += work[1] * 100;
    work[1] = 0;
  }

  if (work[5] > 0) {
    score += work[5] * 50;
    work[5] = 0;
  }

  return { counts, score };
}

export function scoreSelectedDice(dice: DieValue[]): number {
  const { score } = analyseDice(dice);
  return score;
}

export function getScoringInfo(dice: DieValue[]) {
  const { counts, score } = analyseDice(dice);

  return {
    counts,
    hasNoScoringDice: score === 0,
    hasScoringDice: score > 0,
  };
}
