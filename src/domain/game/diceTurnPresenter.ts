type DiceTurnCopyArgs = {
  canRoll: boolean;
  hasSelectedDice: boolean;
  isFarkled: boolean;
  isHotDice: boolean;
  selectedHasInvalidDice: boolean;
  selectedScore: number;
  tempScore: number;
  usesAllDice: boolean;
};

export type DiceTurnCopy = {
  detail: string;
  selectedStatus: string;
  title: string;
  tone: 'default' | 'danger' | 'success' | 'warning';
};

type DiceActionHintArgs = {
  canBank: boolean;
  hasCurrentRoll: boolean;
  hasSelectedDice: boolean;
  isFarkled: boolean;
  selectedHasInvalidDice: boolean;
  selectedScore: number;
};

export function getDiceTurnCopy({
  canRoll,
  hasSelectedDice,
  isFarkled,
  isHotDice,
  selectedHasInvalidDice,
  selectedScore,
  tempScore,
  usesAllDice,
}: DiceTurnCopyArgs): DiceTurnCopy {
  if (isFarkled) {
    return {
      detail: 'No scoring dice were rolled. This turn scores 0 points.',
      selectedStatus: 'Farkle. End the turn to score 0.',
      title: 'This turn scores 0',
      tone: 'danger',
    };
  }

  const selectedStatus = getSelectedStatus({
    hasSelectedDice,
    selectedHasInvalidDice,
    selectedScore,
  });

  if (isHotDice) {
    return {
      detail: 'All dice scored. Roll all six again or end your turn.',
      selectedStatus,
      title: 'Hot dice!',
      tone: 'success',
    };
  }

  if (hasSelectedDice && selectedScore > 0 && usesAllDice) {
    return {
      detail: 'Bank this selection, then decide whether to roll again.',
      selectedStatus,
      title: `Bank ${selectedScore} or keep choosing`,
      tone: 'default',
    };
  }

  if (hasSelectedDice) {
    return {
      detail: 'Every selected die must be part of a scoring combination.',
      selectedStatus,
      title: 'Choose only scoring dice',
      tone: 'warning',
    };
  }

  if (canRoll && tempScore > 0) {
    return {
      detail: 'You can end the turn with your current score or roll again.',
      selectedStatus,
      title: 'Bank your turn or roll again',
      tone: 'default',
    };
  }

  if (canRoll) {
    return {
      detail: 'Roll all available dice to begin.',
      selectedStatus,
      title: 'Ready to roll',
      tone: 'default',
    };
  }

  return {
    detail: 'Select dice that score, then bank them.',
    selectedStatus,
    title: 'Choose scoring dice',
    tone: 'default',
  };
}

export function getDiceActionHint({
  canBank,
  hasCurrentRoll,
  hasSelectedDice,
  isFarkled,
  selectedHasInvalidDice,
  selectedScore,
}: DiceActionHintArgs): string | null {
  if (isFarkled) return 'End the turn to score 0 and move to the next player.';
  if (canBank && selectedScore > 0) {
    return `Bank ${selectedScore} points from this selection, or keep selecting scoring dice.`;
  }
  if (selectedHasInvalidDice) {
    return 'Deselect any dice that do not score before banking this selection.';
  }
  if (hasSelectedDice) return 'Selected dice do not score yet.';
  if (hasCurrentRoll) return 'Tap dice to select them, or use keys 1-6.';
  return null;
}

function getSelectedStatus({
  hasSelectedDice,
  selectedHasInvalidDice,
  selectedScore,
}: Pick<DiceTurnCopyArgs, 'hasSelectedDice' | 'selectedHasInvalidDice' | 'selectedScore'>): string {
  if (hasSelectedDice && selectedHasInvalidDice) {
    return 'Selection includes dice that do not score.';
  }

  if (hasSelectedDice && selectedScore > 0) {
    return `${selectedScore} points selected.`;
  }

  if (hasSelectedDice) return 'Selected dice do not score.';

  return 'No dice selected.';
}
