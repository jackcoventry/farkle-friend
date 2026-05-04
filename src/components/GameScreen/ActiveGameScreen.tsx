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
import Button from "@/components/Button/Button";
import { Panel } from "@/components/Panel/Panel";

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

export function GameScreenSidebar({
  summary,
  currentPlayer,
  state,
  onQuit,
  onRestart,
  isDesktop,
}) {
  return (
    <GameShell.Sidebar isDesktop={isDesktop}>
      <GameShell.SidebarMain>
        <Panel>
          <details open>
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
        </Panel>

        <Panel>
          <details>
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
        </Panel>
      </GameShell.SidebarMain>

      <GameShell.SidebarFooter>
        <GameActions onQuit={onQuit} onRestart={onRestart} />
        <Footer />
      </GameShell.SidebarFooter>
    </GameShell.Sidebar>
  );
}

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
  const [showSidebarModal, setShowSidebarModal] = useState(false);
  const showTurnInfoToggle =
    currentPlayer &&
    flowState === "TURN_ACTIVE" &&
    state.settings.mode === "dice" &&
    !state.pendingTurnResult;
  const isActiveDiceTurn = Boolean(showTurnInfoToggle);
  const statusBar = currentPlayer ? (
    <GameStatusBar
      currentPlayer={currentPlayer}
      diceTurnMetrics={diceTurnMetrics}
      flowState={flowState}
      state={state}
    />
  ) : null;

  return (
    <GameShell key="active">
      <GameScreenSidebar
        summary={summary}
        currentPlayer={currentPlayer}
        state={state}
        onQuit={onQuit}
        onRestart={onRestart}
        isDesktop={true}
      />

      <GameShell.Body>
        <div className="flex h-full min-h-0 flex-col gap-4">
          {isActiveDiceTurn ? null : statusBar}

          <div className="min-h-0 flex-1 flex">
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
                  isSidebarOpenOnMobile={showSidebarModal}
                  onCloseMobileCoach={() => setIsTurnCoachOpen(false)}
                  onCloseMobileSidebar={() => setShowSidebarModal(false)}
                  onTurnMetricsChange={setDiceTurnMetrics}
                  statusSlot={statusBar}
                  state={state}
                  sidebarSummary={summary}
                  sidebarOnQuit={onQuit}
                  sidebarOnRestart={onRestart}
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

      {showTurnInfoToggle ? (
        <GameShell.MobileToolbar>
          <Button
            aria-controls="dice-turn-coach-modal"
            aria-expanded={isTurnCoachOpen}
            size="small"
            onClick={() => setIsTurnCoachOpen((current) => !current)}
            icon="arrow-left"
            iconOnly
          >
            {isTurnCoachOpen ? "Hide turn info" : "Turn info"}
          </Button>
          <Button
            aria-controls="dice-turn-sidebar-modal"
            aria-expanded={showSidebarModal}
            onClick={() => setShowSidebarModal((current) => !current)}
            size="small"
            icon="three-dots-vertical"
            iconOnly
          >
            {showSidebarModal ? "Hide sidebar" : "Show sidebar??"}
          </Button>
        </GameShell.MobileToolbar>
      ) : null}
    </GameShell>
  );
}
