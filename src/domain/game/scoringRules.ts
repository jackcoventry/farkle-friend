import type { DieValue } from '@/domain/game/dice';

export const scoringRules = {
  dicePerTurn: 6,
  singleOne: 100,
  singleFive: 50,
  straight: 1500,
  threePairs: 1500,
  twoTriples: 2500,
} as const;

export type ScoringRuleExample = {
  dice: DieValue[];
  points: number;
  title: string;
};

export const scoringRuleExamples = {
  singles: [
    { dice: [1], points: scoringRules.singleOne, title: 'Single 1' },
    { dice: [5], points: scoringRules.singleFive, title: 'Single 5' },
  ],
  triples: ([1, 2, 3, 4, 5, 6] as DieValue[]).map((face) => ({
    dice: [face, face, face],
    points: getMultipleScore(face, 3),
    title: `Three ${face}s`,
  })),
  multiples: [
    { dice: [4, 4, 4, 4], points: getMultipleScore(4, 4), title: 'Four 4s' },
    {
      dice: [5, 5, 5, 5, 5],
      points: getMultipleScore(5, 5),
      title: 'Five 5s',
    },
    {
      dice: [1, 1, 1, 1, 1, 1],
      points: getMultipleScore(1, 6),
      title: 'Six 1s',
    },
  ],
  specials: [
    {
      dice: [1, 2, 3, 4, 5, 6],
      points: scoringRules.straight,
      title: 'Straight',
    },
    {
      dice: [2, 2, 5, 5, 6, 6],
      points: scoringRules.threePairs,
      title: 'Three pairs',
    },
    {
      dice: [3, 3, 3, 6, 6, 6],
      points: scoringRules.twoTriples,
      title: 'Two triples',
    },
  ],
} satisfies Record<string, ScoringRuleExample[]>;

export function getMultipleScore(face: DieValue, count: number): number {
  if (count < 3) return 0;

  const tripleValue = face === 1 ? 1000 : face * 100;

  return tripleValue * (count - 2);
}
