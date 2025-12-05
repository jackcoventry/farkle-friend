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
  usedCount: number;
};

function analyzeDice(dice: DieValue[]): DiceAnalysis {
  const counts = [0, 0, 0, 0, 0, 0, 0];

  for (const d of dice) {
    counts[d] += 1;
  }

  const work = [...counts];
  let score = 0;
  let usedCount = 0;

  if (dice.length === 6) {
    const isStraight =
      work[1] === 1 &&
      work[2] === 1 &&
      work[3] === 1 &&
      work[4] === 1 &&
      work[5] === 1 &&
      work[6] === 1;

    if (isStraight) {
      return { counts, score: 1500, usedCount: 6 };
    }

    const pairCount = work.filter((c) => c === 2).length;
    if (pairCount === 3) {
      return { counts, score: 1500, usedCount: 6 };
    }

    const tripleFaces = work.filter((c) => c === 3).length;
    if (tripleFaces === 2) {
      return { counts, score: 2500, usedCount: 6 };
    }
  }

  for (let face = 1 as DieValue; face <= 6; face++) {
    const count = work[face];
    if (count >= 3) {
      const base = face === 1 ? 1000 : face * 100;
      const multiplier = count - 2;
      score += base * multiplier;
      usedCount += count;
      work[face] = 0;
    }
  }

  if (work[1] > 0) {
    score += work[1] * 100;
    usedCount += work[1];
    work[1] = 0;
  }

  if (work[5] > 0) {
    score += work[5] * 50;
    usedCount += work[5];
    work[5] = 0;
  }

  return { counts, score, usedCount };
}

export function scoreSelectedDice(dice: DieValue[]): number {
  return analyzeDice(dice).score;
}

export function scoreSelectedDiceWithUsage(dice: DieValue[]): {
  score: number;
  usedCount: number;
} {
  const { score, usedCount } = analyzeDice(dice);
  return { score, usedCount };
}

export function getScoringInfo(dice: DieValue[]) {
  const { counts, score } = analyzeDice(dice);

  return {
    counts,
    hasScoringDice: score > 0,
    hasNoScoringDice: score === 0,
  };
}
