'use client';

import { useCallback, useEffect } from 'react';
import { useDiceKeyboardShortcuts } from '@/hooks/useDiceKeyboardShortcuts';
import { getScoringCombinations } from '@/domain/game/dice';
import { getDiceActionHint, getDiceTurnCopy } from '@/domain/game/diceTurnPresenter';
import { playGameSound } from '@/domain/game/gameAudio';
import { GameAction } from '@/domain/game/gameReducer';
import { GameState } from '@/domain/game/gameTypes';
import { getConfiguredDiceRandomSource } from '@/domain/game/randomSource';
import { useDiceTurnController } from '@/domain/game/useDiceTurnController';
import { useTurnController } from '@/domain/game/useTurnController';
import { DiceBoard } from '@/components/DiceTurnPanel/DiceBoard';
import { DiceTurnActions } from '@/components/DiceTurnPanel/DiceTurnActions';
import { DiceTurnCoach } from '@/components/DiceTurnPanel/DiceTurnCoach';
import { DiceTurnInfoModal } from '@/components/DiceTurnPanel/DiceTurnInfoModal';
import './DiceTurnPanel.css';

type DiceTurnPanelProps = {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
  isCoachOpenOnMobile?: boolean;
  onCloseMobileCoach?: () => void;
  onTurnMetricsChange?: (metrics: DiceTurnMetrics | null) => void;
  statusSlot?: React.ReactNode;
};

export type DiceTurnMetrics = {
  diceLeft: number;
  roundScore: number;
};

export function DiceTurnPanel({
  state,
  dispatch,
  isCoachOpenOnMobile = false,
  onCloseMobileCoach,
  onTurnMetricsChange,
  statusSlot,
}: Readonly<DiceTurnPanelProps>) {
  const { currentPlayer, commitTurnScore } = useTurnController(state, dispatch);

  const dice = useDiceTurnController({
    phase: state.phase,
    playerId: currentPlayer?.id ?? null,
    onCommitScore: commitTurnScore,
    randomSource: getConfiguredDiceRandomSource(),
  });

  const activeTurn = dice.activeTurn;
  const currentRoll = activeTurn?.currentRoll ?? null;
  const isFarkled = activeTurn?.isFarkled ?? false;
  const isHotDice =
    activeTurn?.currentRoll === null && activeTurn.availableDice === 6 && activeTurn.tempScore > 0;

  // List possible combinations for current roll
  const currentCombos =
    activeTurn?.currentRoll == null ? [] : getScoringCombinations(activeTurn.currentRoll);
  const hasSelectedDice = dice.selectedIndices.length > 0;
  const showSelectionStatus = hasSelectedDice || isFarkled;
  const showTurnCoachAndSidebar = !isFarkled;
  const turnCopy = getDiceTurnCopy({
    canRoll: dice.canRoll,
    hasSelectedDice,
    isFarkled,
    isHotDice,
    selectedHasInvalidDice: dice.selectedHasInvalidDice,
    selectedScore: dice.selectedScore,
    tempScore: activeTurn?.tempScore ?? 0,
    usesAllDice: dice.selectedUsesAllDice,
  });
  const actionHint = getDiceActionHint({
    canBank: dice.canBank,
    hasCurrentRoll: !!currentRoll,
    hasSelectedDice,
    isFarkled,
    selectedHasInvalidDice: dice.selectedHasInvalidDice,
    selectedScore: dice.selectedScore,
  });
  const showActionHint = actionHint !== null;
  const tableFeedbackEnabled = state.preferences.tableFeedback;

  const playFeedback = useCallback(
    (type: 'bank' | 'farkle' | 'roll' | 'select') => {
      playGameSound(type, tableFeedbackEnabled);
    },
    [tableFeedbackEnabled]
  );

  const handleRoll = () => {
    playFeedback('roll');
    dice.roll();
  };

  const handleBank = () => {
    playFeedback('bank');
    dice.bankSelected();
  };

  const handleFinish = () => {
    dice.finishTurn();
  };

  const handleToggleDieSelection = useCallback(
    (index: number) => {
      playFeedback('select');
      dice.toggleDieSelection(index);
    },
    [dice, playFeedback]
  );

  useEffect(() => {
    if (!isFarkled) return;

    playFeedback('farkle');
  }, [isFarkled, playFeedback]);

  useEffect(() => {
    if (!activeTurn) {
      onTurnMetricsChange?.(null);
      return;
    }

    onTurnMetricsChange?.({
      diceLeft: activeTurn.availableDice,
      roundScore: activeTurn.tempScore,
    });

    return () => onTurnMetricsChange?.(null);
  }, [activeTurn, activeTurn?.availableDice, activeTurn?.tempScore, onTurnMetricsChange]);

  useDiceKeyboardShortcuts({
    canBank: dice.canBank,
    canFinish: dice.canFinish,
    canRoll: dice.canRoll,
    currentRollLength: activeTurn?.isFarkled ? 0 : (dice.currentRoll?.length ?? 0),
    onBank: handleBank,
    onFinish: handleFinish,
    onRoll: handleRoll,
    onToggleDie: handleToggleDieSelection,
  });

  if (!currentPlayer || !activeTurn) {
    return <p>No active player</p>;
  }

  const actionHintId = showTurnCoachAndSidebar && showActionHint ? 'dice-action-hint' : undefined;
  const coachContent = (
    <DiceTurnCoach
      actionHint={actionHint}
      actionHintId={actionHintId}
      currentCombos={currentCombos}
      selectedBreakdown={dice.selectedBreakdown}
      showActionHint={showActionHint}
      showComboSuggestions={state.settings.showComboSuggestions}
      showSelectionStatus={showSelectionStatus}
      turnCopy={turnCopy}
    />
  );

  return (
    <div className="turn-frame | gap-xs lg:gap-sm grid h-full min-h-0 w-full">
      <div className="dice-turn-layout | gap-xs lg:gap-md grid h-full min-h-0 grid-cols-[1fr] grid-rows-[auto_minmax(0,1fr)] xl:grid-cols-[minmax(0,1fr)_minmax(240px,320px)] xl:grid-rows-1">
        <div className="dice-turn-board-stack | gap-xs lg:gap-sm grid h-full min-h-0 grid-rows-[minmax(300px,1fr)_auto] xl:h-[calc(100dvh-var(--spacing-7))]">
          <DiceBoard
            currentRoll={currentRoll}
            isFarkled={isFarkled}
            onToggleDieSelection={handleToggleDieSelection}
            selectedIndices={dice.selectedIndices}
          />

          <DiceTurnActions
            actionHintId={actionHintId}
            canBank={dice.canBank}
            canFinish={dice.canFinish}
            canRoll={dice.canRoll}
            onBank={handleBank}
            onFinish={handleFinish}
            onRoll={handleRoll}
            selectedScore={dice.selectedScore}
          />
        </div>

        <aside
          className="dice-turn-rail | gap-xs lg:gap-sm -order-1 grid content-start overflow-visible xl:order-2 xl:h-[calc(100dvh-var(--spacing-7))] xl:overflow-auto"
          aria-label="Turn information"
        >
          {statusSlot}
          {showTurnCoachAndSidebar ? (
            <div
              id="dice-turn-coach"
              className="dice-turn-table__coach | gap-sm hidden content-start self-start overflow-auto xl:grid"
              aria-label="Turn guidance"
            >
              {coachContent}
            </div>
          ) : null}
        </aside>
      </div>

      {showTurnCoachAndSidebar ? (
        <DiceTurnInfoModal
          isOpen={isCoachOpenOnMobile}
          onClose={onCloseMobileCoach}
        >
          {coachContent}
        </DiceTurnInfoModal>
      ) : null}
    </div>
  );
}
