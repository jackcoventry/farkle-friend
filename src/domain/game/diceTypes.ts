export type DieValue = 1 | 2 | 3 | 4 | 5 | 6; // Farkle uses 6-side dice

export type DiceRoll = {
  dice: DieValue[];
};

export type ActiveTurn = {
  playerId: string;
  availableDice: number;
  currentRoll: DiceRoll | null;
  isComplete: boolean;
  isFarkled: boolean;
  tempScore: number;
};
