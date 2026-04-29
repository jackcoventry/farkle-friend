"use client";

import { DiceTurnPanel } from "@/components/DiceTurnPanel/DiceTurnPanel";
import Footer from "@/components/Footer/Footer";
import AddPlayerForm, {
  AddPlayerFormSchemaType,
  AvatarId,
  avatarSet,
} from "@/components/Form/AddPlayer/AddPlayer";
import { ConfirmGameActionModal } from "@/components/GameActions/ConfirmGameActionModal";
import type { ConfirmGameAction } from "@/components/GameActions/ConfirmGameActionModal";
import { GameActions } from "@/components/GameActions/GameActions";
import { GameFinishedModal } from "@/components/GameFinishedModal/GameFinishedModal";
import { GameSetupSummary } from "@/components/GameSetupSummary/GameSetupSummary";
import GameShell from "@/components/GameShell/GameShell";
import { ManualTurn } from "@/components/ManualTurn/ManualTurn";
import PlayerList from "@/components/PlayerList/PlayerList";
import { PlayerSwitchSplash } from "@/components/PlayerSwitchSplash/PlayerSwitchSplash";
import { TurnHistory } from "@/components/TurnHistory/TurnHistory";
import { TurnResultPanel } from "@/components/TurnResultPanel/TurnResultPanel";
import { getGameSummary } from "@/domain/game/gameLogic";
import {
  getCurrentPlayer,
  getGameFlowState,
  getNextPlayer,
  getWinner,
  shouldWarnBeforeUnload,
} from "@/domain/game/gameSelectors";
import { useGame } from "@/domain/game/GameProvider";
import { useWarnBeforeUnload } from "@/hooks/useWarnBeforeUnload";
import { formatScore } from "@/utils/formatScore";
import { useState } from "react";

export function GameScreen() {
  const { state, dispatch } = useGame();
  const [confirmAction, setConfirmAction] = useState<ConfirmGameAction>(null);
  const summary = getGameSummary(state);
  const flowState = getGameFlowState(state);
  const currentPlayer = getCurrentPlayer(state, summary);
  const nextPlayer = getNextPlayer(summary, state.pendingTurnResult);
  const winner = getWinner(summary);
  const avatar = avatarSet[currentPlayer?.avatar as AvatarId];

  useWarnBeforeUnload(shouldWarnBeforeUnload(state));

  const onAddPlayerFormSubmit = (data: AddPlayerFormSchemaType) => {
    dispatch({
      type: "ADD_PLAYER",
      username: data.username,
      avatar: data.avatar,
    });
  };

  const onResetGame = () => {
    dispatch({ type: "RESET_GAME" });
    dispatch({ type: "START_GAME" });
  };

  const onResetPlayers = () => {
    dispatch({ type: "RESET_GAME" });
  };

  const onRemovePlayer = (playerId: string) => {
    dispatch({ type: "REMOVE_PLAYER", playerId });
  };

  const onConfirmGameAction = () => {
    if (confirmAction === "restart") {
      onResetGame();
    }
    if (confirmAction === "quit") {
      dispatch({ type: "RESET_GAME" });
    }
    setConfirmAction(null);
  };

  const onAdvanceTurn = () => {
    dispatch({ type: "ADVANCE_TURN" });
  };

  if (flowState === "LOBBY") {
    return (
      <GameShell>
        <GameShell.Sidebar>
          <div className="flex flex-col h-full">
            <h2 className="font-heading mb-2">Players</h2>

            {state.players.length > 0 ? (
              <div className="my-6 overflow-auto">
                <PlayerList
                  players={state.players}
                  onRemovePlayer={onRemovePlayer}
                />
              </div>
            ) : null}
            <GameSetupSummary settings={state.settings} />
            <Footer />
          </div>
        </GameShell.Sidebar>
        <GameShell.Body>
          <div className="max-w-[400px] m-auto flex h-full">
            <AddPlayerForm onSubmit={onAddPlayerFormSubmit} />
          </div>
        </GameShell.Body>
      </GameShell>
    );
  }

  if (flowState === "FINISHED") {
    return (
      <main>
        <h1 className="sr-only">Farkle Friend</h1>
        <GameFinishedModal
          onResetGame={onResetGame}
          onResetPlayers={onResetPlayers}
          players={summary.players}
          turns={state.turns}
          winner={winner}
        />
      </main>
    );
  }

  return (
    <>
      <GameShell>
        <GameShell.Sidebar>
          <div className="flex flex-col h-full">
            <h2 className="font-heading mb-2">Players</h2>
            <p className="font-body-1">
              First to {formatScore(state.settings.targetScore)} points
            </p>

            <details className="my-4 rounded-lg bg-white/60 p-2" open>
              <summary className="cursor-pointer font-heading-2">
                Scoreboard
              </summary>
              <div className="mt-3 overflow-auto">
                <PlayerList
                  players={summary.players}
                  activePlayerId={
                    state.players[state.currentPlayerIndex ?? 0].id
                  }
                  leadingPlayerId={summary.leadingPlayerId}
                  targetScore={state.settings.targetScore}
                />
              </div>
            </details>

            <details className="rounded-lg bg-white/60 p-2" open>
              <summary className="cursor-pointer font-heading-2">
                Table pulse
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

            <GameActions
              onQuit={() => setConfirmAction("quit")}
              onRestart={() => setConfirmAction("restart")}
            />

            <Footer />
          </div>
        </GameShell.Sidebar>
        <GameShell.Body>
          <div className="flex h-full min-h-0 flex-col gap-4">
            {currentPlayer ? (
              <section
                className="flex flex-wrap items-center gap-3 rounded-lg bg-white/90 px-4 py-3 text-gray-900 shadow-sm"
                aria-live="polite"
              >
                <div>
                  <p className="text-sm text-gray-700">
                    {flowState === "TURN_RESULT"
                      ? "Turn complete"
                      : "Now playing"}
                  </p>
                  <h2 className="font-heading-2">{currentPlayer.username}</h2>
                </div>
                <dl className="ml-auto flex flex-wrap gap-4 text-sm sm:text-base">
                  <div>
                    <dt className="text-gray-700">
                      {state.pendingTurnResult ? "Previous total" : "Current total"}
                    </dt>
                    <dd className="font-body-1 text-red-700">
                      {formatScore(
                        state.pendingTurnResult?.previousTotal ??
                          currentPlayer.totalScore ??
                          0
                      )}
                    </dd>
                  </div>
                  {state.pendingTurnResult ? (
                    <div>
                      <dt className="text-gray-700">Updated total</dt>
                      <dd className="font-body-1 text-red-700">
                        {formatScore(state.pendingTurnResult.newTotal)}
                      </dd>
                    </div>
                  ) : null}
                </dl>
              </section>
            ) : null}

            <div className="min-h-0 flex-1">
              {currentPlayer && avatar && !state.pendingTurnResult ? (
                <PlayerSwitchSplash
                  key={`${currentPlayer.id}-${state.currentPlayerIndex}`}
                  currentPlayer={currentPlayer}
                  avatar={avatar}
                />
              ) : null}

              {currentPlayer ? (
                flowState === "TURN_RESULT" && state.pendingTurnResult ? (
                  <TurnResultPanel
                    currentPlayer={currentPlayer}
                    nextPlayer={nextPlayer}
                    result={state.pendingTurnResult}
                    onAdvanceTurn={onAdvanceTurn}
                  />
                ) : state.settings.mode === "dice" ? (
                  <DiceTurnPanel state={state} dispatch={dispatch} />
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

      <ConfirmGameActionModal
        action={confirmAction}
        onClose={() => setConfirmAction(null)}
        onConfirm={onConfirmGameAction}
      />
    </>
  );
}
