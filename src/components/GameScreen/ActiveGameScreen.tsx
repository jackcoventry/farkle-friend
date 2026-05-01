"use client";

import {
  DiceTurnPanel,
  type DiceTurnMetrics,
} from "@/components/DiceTurnPanel/DiceTurnPanel";
import Footer from "@/components/Footer/Footer";
import { GameActions } from "@/components/GameActions/GameActions";
import { GameStatusBar } from "@/components/GameScreen/GameStatusBar";
import GameShell from "@/components/GameShell/GameShell";
import { ManualTurn } from "@/components/ManualTurn/ManualTurn";
import PlayerList from "@/components/PlayerList/PlayerList";
import { PlayerSwitchSplash } from "@/components/PlayerSwitchSplash/PlayerSwitchSplash";
import { TurnHistory } from "@/components/TurnHistory/TurnHistory";
import { TurnResultPanel } from "@/components/TurnResultPanel/TurnResultPanel";
import type {
  AvatarId,
  avatarSet,
} from "@/components/Form/AddPlayer/AddPlayer";
import type { GameAction } from "@/domain/game/gameReducer";
import type {
  GameFlowState,
  GameState,
  GameSummary,
  Player,
} from "@/domain/game/gameTypes";
import type { Dispatch, SetStateAction } from "react";
import { useState } from "react";

type ActiveGameScreenProps = {
  avatar: (typeof avatarSet)[AvatarId] | undefined;
  currentPlayer: Player | null;
  diceTurnMetrics: DiceTurnMetrics | null;
  dispatch: Dispatch<GameAction>;
  flowState: GameFlowState;
  nextPlayer: Player | null;
  onAdvanceTurn: () => void;
  onQuit: () => void;
  onRestart: () => void;
  setDiceTurnMetrics: Dispatch<SetStateAction<DiceTurnMetrics | null>>;
  state: GameState;
  summary: GameSummary;
};

export function ActiveGameScreen({
  avatar,
  currentPlayer,
  diceTurnMetrics,
  dispatch,
  flowState,
  nextPlayer,
  onAdvanceTurn,
  onQuit,
  onRestart,
  setDiceTurnMetrics,
  state,
  summary,
}: Readonly<ActiveGameScreenProps>) {
  const [isTurnCoachOpen, setIsTurnCoachOpen] = useState(false);
  const showTurnInfoToggle =
    currentPlayer &&
    flowState === "TURN_ACTIVE" &&
    state.settings.mode === "dice" &&
    !state.pendingTurnResult;

  return (
    <GameShell key="active">
      <GameShell.Sidebar>
        <GameShell.SidebarMain>
          <details
            className="my-4 rounded-2xl bg-gray-600 border border-pink-200 p-4"
            open
          >
            <summary className="cursor-pointer font-heading-2 text-white">
              Scoreboard
            </summary>
            <div className="mt-3">
              <PlayerList
                players={summary.players}
                activePlayerId={currentPlayer?.id}
                leadingPlayerId={summary.leadingPlayerId}
                targetScore={state.settings.targetScore}
              />
            </div>
          </details>

          <details
            className="my-4 rounded-2xl bg-gray-600 border border-pink-200 p-4"
            open
          >
            <summary className="cursor-pointer font-heading-2 text-white">
              Turn log
            </summary>
            <div className="mt-3">
              <TurnHistory
                leadingPlayerId={summary.leadingPlayerId}
                players={summary.players}
                targetScore={state.settings.targetScore}
                turns={state.turns}
              />
            </div>
          </details>
        </GameShell.SidebarMain>

        <GameShell.SidebarFooter>
          <GameActions onQuit={onQuit} onRestart={onRestart} />
          <Footer />
        </GameShell.SidebarFooter>
      </GameShell.Sidebar>
      {showTurnInfoToggle ? (
        <GameShell.MobileToolbar>
          <button
            type="button"
            className="rounded-lg bg-white px-4 py-2 text-gray-900"
            aria-controls="dice-turn-coach-modal"
            aria-expanded={isTurnCoachOpen}
            onClick={() => setIsTurnCoachOpen((current) => !current)}
          >
            {isTurnCoachOpen ? "Hide turn info" : "Turn info"}
          </button>
        </GameShell.MobileToolbar>
      ) : null}
      <GameShell.Body>
        <div className="flex h-full min-h-0 flex-col gap-4">
          {currentPlayer ? (
            <GameStatusBar
              currentPlayer={currentPlayer}
              diceTurnMetrics={diceTurnMetrics}
              flowState={flowState}
              state={state}
            />
          ) : null}

          <div className="min-h-0 flex-1">
            {currentPlayer && avatar && !state.pendingTurnResult ? (
              <PlayerSwitchSplash
                key={`${currentPlayer.id}-${state.currentPlayerIndex}`}
                currentPlayer={currentPlayer}
                avatar={avatar}
                soundEnabled={state.preferences.tableFeedback}
              />
            ) : null}

            {currentPlayer ? (
              flowState === "TURN_RESULT" && state.pendingTurnResult ? (
                <TurnResultPanel
                  autoAdvance={state.settings.autoAdvanceTurns}
                  currentPlayer={currentPlayer}
                  key={`${state.pendingTurnResult.playerId}-${state.pendingTurnResult.score}-${state.pendingTurnResult.newTotal}`}
                  nextPlayer={nextPlayer}
                  result={state.pendingTurnResult}
                  onAdvanceTurn={onAdvanceTurn}
                />
              ) : state.settings.mode === "dice" ? (
                <DiceTurnPanel
                  dispatch={dispatch}
                  isCoachOpenOnMobile={isTurnCoachOpen}
                  onCloseMobileCoach={() => setIsTurnCoachOpen(false)}
                  onTurnMetricsChange={setDiceTurnMetrics}
                  state={state}
                />
              ) : (
                <ManualTurn state={state} dispatch={dispatch} />
              )
            ) : (
              <p>No active player</p>
            )}
          </div>
        </div>
      </GameShell.Body>
    </GameShell>
  );
}
