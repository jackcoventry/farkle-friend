import type { MessageKey, MessageValues } from '@/i18n/messages';

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
  detail: DiceTurnText;
  selectedStatus: DiceTurnText;
  title: DiceTurnText;
  tone: 'default' | 'danger' | 'success' | 'warning';
};

export type DiceTurnText = {
  key: MessageKey;
  values?: MessageValues;
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
      detail: { key: 'turn.detail.farkle' },
      selectedStatus: { key: 'turn.selectedStatus.farkle' },
      title: { key: 'turn.title.farkle' },
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
      detail: { key: 'turn.detail.hotDice' },
      selectedStatus,
      title: { key: 'turn.title.hotDice' },
      tone: 'success',
    };
  }

  if (hasSelectedDice && selectedScore > 0 && usesAllDice) {
    return {
      detail: { key: 'turn.detail.bankSelection' },
      selectedStatus,
      title: { key: 'turn.title.bankOrKeepChoosing', values: { score: selectedScore } },
      tone: 'default',
    };
  }

  if (hasSelectedDice) {
    return {
      detail: { key: 'turn.detail.invalidSelection' },
      selectedStatus,
      title: { key: 'turn.title.chooseOnlyScoringDice' },
      tone: 'warning',
    };
  }

  if (canRoll && tempScore > 0) {
    return {
      detail: { key: 'turn.detail.bankOrRoll' },
      selectedStatus,
      title: { key: 'turn.title.bankOrRoll' },
      tone: 'default',
    };
  }

  if (canRoll) {
    return {
      detail: { key: 'turn.detail.readyToRoll' },
      selectedStatus,
      title: { key: 'turn.title.readyToRoll' },
      tone: 'default',
    };
  }

  return {
    detail: { key: 'turn.detail.chooseScoringDice' },
    selectedStatus,
    title: { key: 'turn.title.chooseScoringDice' },
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
}: DiceActionHintArgs): DiceTurnText | null {
  if (isFarkled) return { key: 'turn.action.endFarkle' };
  if (canBank && selectedScore > 0) {
    return { key: 'turn.action.bankSelection', values: { score: selectedScore } };
  }
  if (selectedHasInvalidDice) {
    return { key: 'turn.action.deselectInvalid' };
  }
  if (hasSelectedDice) return { key: 'turn.action.selectedNoScore' };
  if (hasCurrentRoll) return { key: 'turn.action.selectDice' };
  return null;
}

function getSelectedStatus({
  hasSelectedDice,
  selectedHasInvalidDice,
  selectedScore,
}: Pick<DiceTurnCopyArgs, 'hasSelectedDice' | 'selectedHasInvalidDice' | 'selectedScore'>): DiceTurnText {
  if (hasSelectedDice && selectedHasInvalidDice) {
    return { key: 'turn.selected.invalid' };
  }

  if (hasSelectedDice && selectedScore > 0) {
    return { key: 'turn.selected.points', values: { score: selectedScore } };
  }

  if (hasSelectedDice) return { key: 'turn.selected.noScore' };

  return { key: 'turn.selected.none' };
}
