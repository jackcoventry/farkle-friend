"use client";

import { GameAction } from "@/domain/game/gameReducer";
import { GameState, GameSummary } from "@/domain/game/gameTypes";
import { playGameSound } from "@/domain/game/gameAudio";
import { getScoringCombinations } from "@/domain/game/dice";
import DiceIcon from "@/components/DiceIcon/DiceIcon";
import Modal from "@/components/Modal/Modal";
import { TurnActionCluster } from "@/components/TurnActionCluster/TurnActionCluster";
import { useTurnController } from "@/domain/game/useTurnController";
import { useDiceTurnController } from "@/domain/game/useDiceTurnController";
import { getDiceTurnCopy } from "@/domain/game/diceTurnPresenter";
import { useCallback, useEffect } from "react";
import "./DiceTurnPanel.css";
import { GameScreenSidebar } from "../GameScreen/ActiveGameScreen";
import { Panel } from "../Panel/Panel";

type DiceTurnPanelProps = {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
  isCoachOpenOnMobile?: boolean;
  isSidebarOpenOnMobile?: boolean;
  onCloseMobileCoach?: () => void;
  onCloseMobileSidebar?: () => void;
  onTurnMetricsChange?: (metrics: DiceTurnMetrics | null) => void;
  statusSlot?: React.ReactNode;
  sidebarSummary?: GameSummary;
  sidebarOnQuit?: () => void;
  sidebarOnRestart?: () => void;
};

export type DiceTurnMetrics = {
  diceLeft: number;
  roundScore: number;
};

export function DiceTurnPanel({
  state,
  dispatch,
  isCoachOpenOnMobile = false,
  isSidebarOpenOnMobile = false,
  onCloseMobileCoach,
  onCloseMobileSidebar,
  onTurnMetricsChange,
  statusSlot,
  sidebarSummary,
  sidebarOnQuit,
  sidebarOnRestart,
}: Readonly<DiceTurnPanelProps>) {
  const { currentPlayer, commitTurnScore } = useTurnController(state, dispatch);

  const dice = useDiceTurnController({
    phase: state.phase,
    playerId: currentPlayer?.id ?? null,
    onCommitScore: commitTurnScore,
  });

  const activeTurn = dice.activeTurn;
  const currentRoll = activeTurn?.currentRoll ?? null;
  const isFarkled = activeTurn?.isFarkled ?? false;
  const isHotDice =
    activeTurn?.currentRoll === null &&
    activeTurn.availableDice === 6 &&
    activeTurn.tempScore > 0;

  // List possible combinations for current roll
  const currentCombos =
    activeTurn?.currentRoll == null
      ? []
      : getScoringCombinations(activeTurn.currentRoll);
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
    (type: "bank" | "farkle" | "roll" | "select") => {
      playGameSound(type, tableFeedbackEnabled);
    },
    [tableFeedbackEnabled],
  );

  const handleRoll = () => {
    playFeedback("roll");
    dice.roll();
  };

  const handleBank = () => {
    playFeedback("bank");
    dice.bankSelected();
  };

  const handleFinish = () => {
    dice.finishTurn();
  };

  const handleToggleDieSelection = useCallback(
    (index: number) => {
      playFeedback("select");
      dice.toggleDieSelection(index);
    },
    [dice, playFeedback],
  );

  useEffect(() => {
    if (!isFarkled) return;

    playFeedback("farkle");
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
  }, [
    activeTurn,
    activeTurn?.availableDice,
    activeTurn?.tempScore,
    onTurnMetricsChange,
  ]);

  useDiceKeyboardShortcuts({
    canBank: dice.canBank,
    canFinish: dice.canFinish,
    canRoll: dice.canRoll,
    currentRollLength: activeTurn?.isFarkled
      ? 0
      : (dice.currentRoll?.length ?? 0),
    onBank: handleBank,
    onFinish: handleFinish,
    onRoll: handleRoll,
    onToggleDie: handleToggleDieSelection,
  });

  if (!currentPlayer || !activeTurn) {
    return <p>No active player</p>;
  }

  const actionHintId =
    showTurnCoachAndSidebar && showActionHint ? "dice-action-hint" : undefined;
  const coachContent = (
    <>
      <Panel
        className="dice-turn-table__coach-panel | gap-4 flex flex-wrap"
        aria-label="Turn status"
        aria-live="polite"
        role="status"
      >
        <div className="min-w-0 flex flex-col gap-2">
          <p className="font-heading-2">{turnCopy.title}</p>
          <p className="text-sm">{turnCopy.detail}</p>
        </div>
        {showSelectionStatus ? (
          <div className="rounded-lg bg-accent px-3 py-2 text-sm text-accent-contrast">
            <span className="font-body-1">Selection</span>{" "}
            <span>{turnCopy.selectedStatus}</span>
          </div>
        ) : null}
        {dice.selectedBreakdown.length > 0 ? (
          <ul className="flex flex-wrap gap-4 text-sm">
            {dice.selectedBreakdown.map((item) => (
              <li
                key={`${item.label}-${item.score}`}
                className="rounded-full bg-control px-3 py-1 text-control-text"
              >
                {item.label} = {item.score}
              </li>
            ))}
          </ul>
        ) : null}
        {showActionHint ? (
          <p id="dice-action-hint" className="text-sm font-body-1">
            {actionHint}
          </p>
        ) : null}
      </Panel>

      {state.settings.showComboSuggestions && currentCombos.length > 0 ? (
        <Panel
          className="dice-turn-table__coach-panel"
          aria-label="Scoring combinations"
        >
          <p className="font-body-1">Possible scoring dice</p>
          <ul className="mt-2 grid gap-1 text-sm">
            {currentCombos.slice(0, 5).map((combo, index) => (
              <li key={index} className="grid w-full grid-cols-2">
                <span className="flex gap-1">
                  {combo.dice.map((e) => (
                    <DiceIcon key={e} count={e} className="w-6" />
                  ))}
                </span>
                <span className="text-right text-accent">
                  {combo.score} pts
                </span>
              </li>
            ))}
          </ul>
        </Panel>
      ) : null}
    </>
  );

  return (
    <div className="turn-frame | grid gap-3 h-full w-full">
      <div className="xl:grid-cols-[minmax(0,1fr)_minmax(240px,320px)] grid-cols-[1fr] grid gap-4 content-start">
        <div className="grid-rows-[minmax(0,1fr)_auto] grid gap-3 sm:h-[calc(50dvh-var(--spacing-7))] xl:h-[calc(100dvh-var(--spacing-7))]">
          <Panel className="dice-turn-table">
            <div className="items-center h-full flex justify-center overflow-hidden">
              {isFarkled ? (
                <div
                  role="alert"
                  className="animate-bounce-in max-w-[560px] rounded-3xl border-4 border-danger bg-danger-surface p-6 text-center text-danger-contrast shadow-lg"
                >
                  <p className="font-sub-heading text-danger">Turn over</p>
                  <h2 className="font-heading text-danger">
                    You have been Farkled!
                  </h2>
                  <p className="mt-2">
                    No scoring dice were rolled. This turn scores 0 points.
                  </p>
                </div>
              ) : null}

              {!isFarkled && currentRoll ? (
                <div className="flex flex-wrap justify-center gap-4 sm:gap-5">
                  {currentRoll.map((value, idx) => {
                    const isSelected = dice.selectedIndices.includes(idx);
                    return (
                      <button
                        key={`${value}-${idx}`}
                        type="button"
                        onClick={() => handleToggleDieSelection(idx)}
                        disabled={activeTurn.isFarkled}
                        aria-pressed={isSelected}
                        aria-label={`${isSelected ? "Deselect" : "Select"} die ${
                          idx + 1
                        } showing ${value}`}
                        style={{
                          animationDelay: `${idx * 0.05}s`,
                        }}
                        className={`animate-bounce-in w-[72px] cursor-pointer rounded-lg p-1 opacity-0 transition-transform hover:z-10 hover:scale-105 sm:w-[100px] ${
                          isSelected
                            ? "bg-selected ring-4 ring-selected-border"
                            : "bg-transparent"
                        }`}
                      >
                        <DiceIcon
                          count={value}
                          state={isSelected ? "active" : "default"}
                        />
                      </button>
                    );
                  })}
                </div>
              ) : null}

              {!isFarkled && !currentRoll ? (
                <div
                  className="dice-turn-table__empty | motion-safe:animate-[spin_100s_linear_infinite] border-2 border-dashed border-border rounded-full aspect-square"
                  aria-hidden="true"
                />
              ) : null}
            </div>
          </Panel>

          <TurnActionCluster
            actions={[
              {
                ariaDescribedBy: actionHintId,
                ariaLabel: "Roll dice",
                disabled: !dice.canRoll,
                icon: "dice",
                label: "Roll",
                onClick: handleRoll,
              },
              {
                ariaDescribedBy: actionHintId,
                disabled: !dice.canBank,
                icon: "bank",
                label:
                  dice.selectedScore > 0
                    ? `Bank ${dice.selectedScore}`
                    : "Bank",
                onClick: handleBank,
              },
              {
                ariaDescribedBy: actionHintId,
                disabled: !dice.canFinish,
                icon: "rocket",
                label: isFarkled ? "Score 0" : "End turn",
                onClick: handleFinish,
              },
            ]}
          />
        </div>

        <aside
          className="dice-turn-rail | -order-1 xl:order-2 content-start grid gap-3 overflow-auto xl:h-[calc(100dvh-var(--spacing-7))]"
          aria-label="Turn information"
        >
          {statusSlot}
          {showTurnCoachAndSidebar ? (
            <div
              id="dice-turn-coach"
              className="dice-turn-table__coach | content-start self-start hidden xl:grid gap-3 overflow-auto"
              aria-label="Turn guidance"
            >
              {coachContent}
            </div>
          ) : null}
        </aside>
      </div>

      {showTurnCoachAndSidebar ? (
        <>
          <Modal
            id="dice-turn-coach-modal"
            isOpen={isCoachOpenOnMobile}
            onClose={onCloseMobileCoach}
            ariaLabel="Turn information"
          >
            <Modal.Body>
              <div className="dice-turn-coach-modal">
                <Modal.CloseButton ariaLabel="Close turn information" />
                <div className="dice-turn-table__coach | flex flex-col gap-4">
                  {coachContent}
                </div>
              </div>
            </Modal.Body>
          </Modal>

          {sidebarSummary && sidebarOnQuit && sidebarOnRestart ? (
            <Modal
              isOpen={isSidebarOpenOnMobile}
              onClose={onCloseMobileSidebar}
              variant="modal"
            >
              <Modal.Body>
                <GameScreenSidebar
                  summary={sidebarSummary}
                  currentPlayer={currentPlayer}
                  state={state}
                  onQuit={sidebarOnQuit}
                  onRestart={sidebarOnRestart}
                  isDesktop={false}
                />
              </Modal.Body>
            </Modal>
          ) : null}
        </>
      ) : null}
    </div>
  );
}

type DiceActionHintArgs = {
  canBank: boolean;
  hasCurrentRoll: boolean;
  hasSelectedDice: boolean;
  isFarkled: boolean;
  selectedHasInvalidDice: boolean;
  selectedScore: number;
};

function getDiceActionHint({
  canBank,
  hasCurrentRoll,
  hasSelectedDice,
  isFarkled,
  selectedHasInvalidDice,
  selectedScore,
}: DiceActionHintArgs): string | null {
  if (isFarkled) return "End the turn to score 0 and move to the next player.";
  if (canBank && selectedScore > 0) {
    return `Bank ${selectedScore} points from this selection, or keep selecting scoring dice.`;
  }
  if (selectedHasInvalidDice) {
    return "Deselect any dice that do not score before banking this selection.";
  }
  if (hasSelectedDice) return "Selected dice do not score yet.";
  if (hasCurrentRoll) return "Tap dice to select them, or use keys 1-6.";
  return null;
}

type DiceKeyboardShortcutsArgs = {
  canBank: boolean;
  canFinish: boolean;
  canRoll: boolean;
  currentRollLength: number;
  onBank: () => void;
  onFinish: () => void;
  onRoll: () => void;
  onToggleDie: (index: number) => void;
};

function useDiceKeyboardShortcuts({
  canBank,
  canFinish,
  canRoll,
  currentRollLength,
  onBank,
  onFinish,
  onRoll,
  onToggleDie,
}: DiceKeyboardShortcutsArgs) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (shouldIgnoreShortcut(event)) return;

      const key = event.key.toLowerCase();
      const dieNumber = Number(key);

      if (Number.isInteger(dieNumber) && dieNumber >= 1 && dieNumber <= 6) {
        if (dieNumber <= currentRollLength) {
          event.preventDefault();
          onToggleDie(dieNumber - 1);
        }
        return;
      }

      if (key === "r" && canRoll) {
        event.preventDefault();
        onRoll();
        return;
      }

      if (key === "b" && canBank) {
        event.preventDefault();
        onBank();
        return;
      }

      if (event.key === "Enter" && canFinish) {
        event.preventDefault();
        onFinish();
      }
    };

    globalThis.addEventListener("keydown", handleKeyDown);

    return () => globalThis.removeEventListener("keydown", handleKeyDown);
  }, [
    canBank,
    canFinish,
    canRoll,
    currentRollLength,
    onBank,
    onFinish,
    onRoll,
    onToggleDie,
  ]);
}

function shouldIgnoreShortcut(event: KeyboardEvent): boolean {
  if (event.altKey || event.ctrlKey || event.metaKey) return true;

  const target = event.target;
  if (!(target instanceof HTMLElement)) return false;

  return (
    target.isContentEditable ||
    target.matches("input, textarea, select, button, a")
  );
}
