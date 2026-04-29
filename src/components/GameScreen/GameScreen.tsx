"use client";

import DiceIcon from "@/components/DiceIcon/DiceIcon";
import Button from "@/components/Button/Button";
import {
  DiceTurnPanel,
  type DiceTurnMetrics,
} from "@/components/DiceTurnPanel/DiceTurnPanel";
import Footer from "@/components/Footer/Footer";
import AddPlayerForm, {
  AddPlayerFormSchemaType,
  AvatarId,
  avatarSet,
} from "@/components/Form/AddPlayer/AddPlayer";
import Settings, {
  SettingsFormSchemaType,
} from "@/components/Form/Settings/Settings";
import { ConfirmGameActionModal } from "@/components/GameActions/ConfirmGameActionModal";
import type { ConfirmGameAction } from "@/components/GameActions/ConfirmGameActionModal";
import { GameActions } from "@/components/GameActions/GameActions";
import { GameFinishedModal } from "@/components/GameFinishedModal/GameFinishedModal";
import { GamePreferences } from "@/components/GamePreferences/GamePreferences";
import { GameSetupSummary } from "@/components/GameSetupSummary/GameSetupSummary";
import GameShell from "@/components/GameShell/GameShell";
import { ManualTurn } from "@/components/ManualTurn/ManualTurn";
import PlayerList from "@/components/PlayerList/PlayerList";
import { PlayerSwitchSplash } from "@/components/PlayerSwitchSplash/PlayerSwitchSplash";
import { TurnHistory } from "@/components/TurnHistory/TurnHistory";
import { TurnResultPanel } from "@/components/TurnResultPanel/TurnResultPanel";
import { canStartGame, getGameSummary } from "@/domain/game/gameLogic";
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
import { useRef, useState } from "react";
import type { KeyboardEvent } from "react";

export function GameScreen() {
  const { state, dispatch } = useGame();
  const [confirmAction, setConfirmAction] = useState<ConfirmGameAction>(null);
  const [lobbyScreen, setLobbyScreen] = useState<"players" | "settings">(
    "players",
  );
  const [diceTurnMetrics, setDiceTurnMetrics] =
    useState<DiceTurnMetrics | null>(null);
  const playersTabRef = useRef<HTMLButtonElement | null>(null);
  const settingsTabRef = useRef<HTMLButtonElement | null>(null);
  const summary = getGameSummary(state);
  const flowState = getGameFlowState(state);
  const currentPlayer = getCurrentPlayer(state, summary);
  const nextPlayer = getNextPlayer(summary, state.pendingTurnResult);
  const winner = getWinner(summary);
  const avatar = avatarSet[currentPlayer?.avatar as AvatarId];
  const readyToStart = Boolean(canStartGame(state));
  const lobbyModeLabel =
    state.settings.mode === "dice" ? "Dice rolling" : "Manual scoring";

  useWarnBeforeUnload(shouldWarnBeforeUnload(state));

  const onAddPlayerFormSubmit = (data: AddPlayerFormSchemaType) => {
    dispatch({
      type: "ADD_PLAYER",
      username: data.username,
      avatar: data.avatar,
    });
  };

  const onSettingsSubmit = (data: SettingsFormSchemaType) => {
    dispatch({
      type: "UPDATE_SETTINGS",
      settings: data,
    });
    setLobbyScreen("players");
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

  const onStartGame = () => {
    dispatch({ type: "START_GAME" });
  };

  const selectLobbyScreen = (screen: "players" | "settings") => {
    setLobbyScreen(screen);
    const tab = screen === "players" ? playersTabRef : settingsTabRef;
    window.requestAnimationFrame(() => tab.current?.focus());
  };

  const onLobbyTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    const nextScreen = lobbyScreen === "players" ? "settings" : "players";

    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault();
      selectLobbyScreen(nextScreen);
    }

    if (event.key === "Home") {
      event.preventDefault();
      selectLobbyScreen("players");
    }

    if (event.key === "End") {
      event.preventDefault();
      selectLobbyScreen("settings");
    }
  };

  if (flowState === "LOBBY") {
    return (
      <>
        <GameShell key="lobby">
          <GameShell.Sidebar>
            <div className="flex flex-col h-full">
              {state.players.length > 0 ? (
                <div className="my-6 overflow-auto">
                  <PlayerList
                    players={state.players}
                    onRemovePlayer={onRemovePlayer}
                  />
                </div>
              ) : (
                <section className="my-6 rounded-lg bg-white/70 p-4">
                  <h2 className="font-heading-2">No players yet</h2>
                  <p className="mt-1 text-gray-800">
                    Add at least two players, then start the game from the setup
                    panel.
                  </p>
                </section>
              )}
              <GameSetupSummary
                settings={state.settings}
                onEditSettings={() => setLobbyScreen("settings")}
              />
              <section className="mt-4 grid gap-3 rounded-lg bg-sun-50 p-4">
                <div>
                  <h2 className="font-heading-2">Ready?</h2>
                  <p className="text-gray-800">
                    {readyToStart
                      ? `${state.players.length} players · ${lobbyModeLabel} · First to ${formatScore(
                          state.settings.targetScore,
                        )}`
                      : "Add at least two players to start."}
                  </p>
                </div>
                <Button
                  type="button"
                  onClick={onStartGame}
                  className="w-full justify-center"
                  disabled={!readyToStart}
                >
                  Start game
                </Button>
                <GamePreferences className="flex" />
              </section>
              <Footer />
            </div>
          </GameShell.Sidebar>
          <GameShell.Body>
            <div className="mx-auto flex h-full w-full max-w-[520px] flex-col justify-start gap-4 overflow-auto py-4">
              <div
                className="grid grid-cols-2 gap-2 rounded-lg bg-white/90 p-2"
                role="tablist"
                aria-label="Game setup"
              >
                <button
                  ref={playersTabRef}
                  type="button"
                  role="tab"
                  aria-selected={lobbyScreen === "players"}
                  aria-controls="players-panel"
                  id="players-tab"
                  tabIndex={lobbyScreen === "players" ? 0 : -1}
                  className={`rounded-lg px-4 py-3 font-button ${
                    lobbyScreen === "players"
                      ? "bg-red-700 text-white"
                      : "bg-white text-gray-900"
                  }`}
                  onClick={() => setLobbyScreen("players")}
                  onKeyDown={onLobbyTabKeyDown}
                >
                  Players
                </button>
                <button
                  ref={settingsTabRef}
                  type="button"
                  role="tab"
                  aria-selected={lobbyScreen === "settings"}
                  aria-controls="settings-panel"
                  id="settings-tab"
                  tabIndex={lobbyScreen === "settings" ? 0 : -1}
                  className={`rounded-lg px-4 py-3 font-button ${
                    lobbyScreen === "settings"
                      ? "bg-red-700 text-white"
                      : "bg-white text-gray-900"
                  }`}
                  onClick={() => setLobbyScreen("settings")}
                  onKeyDown={onLobbyTabKeyDown}
                >
                  Settings
                </button>
              </div>

              {lobbyScreen === "players" ? (
                <div
                  aria-labelledby="players-tab"
                  id="players-panel"
                  role="tabpanel"
                >
                  <AddPlayerForm
                    onSubmit={onAddPlayerFormSubmit}
                  />
                </div>
              ) : (
                <div
                  aria-labelledby="settings-tab"
                  id="settings-panel"
                  role="tabpanel"
                >
                  <Settings onSubmit={onSettingsSubmit} />
                </div>
              )}
            </div>
          </GameShell.Body>
        </GameShell>
      </>
    );
  }

  if (flowState === "FINISHED") {
    return (
      <>
        <main>
          <h1 className="sr-only">Farkle Friend</h1>
          <GameFinishedModal
            onResetGame={onResetGame}
            onResetPlayers={onResetPlayers}
            players={summary.players}
            soundEnabled={state.settings.tableFeedback}
            turns={state.turns}
            winner={winner}
          />
        </main>
      </>
    );
  }

  return (
    <>
      <GameShell key="active">
        <GameShell.Sidebar>
          <div className="flex flex-col h-full">
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
                      {state.pendingTurnResult
                        ? "Previous total"
                        : "Current total"}
                    </dt>
                    <dd className="font-body-1 text-red-700">
                      {formatScore(
                        state.pendingTurnResult?.previousTotal ??
                          currentPlayer.totalScore ??
                          0,
                      )}
                    </dd>
                  </div>
                  {state.settings.mode === "dice" &&
                  flowState === "TURN_ACTIVE" &&
                  diceTurnMetrics ? (
                    <>
                      <div>
                        <dt className="text-gray-700">Round score</dt>
                        <dd className="font-body-1 text-red-700">
                          {formatScore(diceTurnMetrics.roundScore)}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-gray-700">Dice left</dt>
                        <dd className="flex items-center gap-2 font-body-1 text-red-700">
                          <span>{diceTurnMetrics.diceLeft}</span>
                          <span
                            aria-hidden="true"
                            className="hidden gap-1 sm:flex"
                          >
                            {[
                              ...new Array(diceTurnMetrics.diceLeft).keys(),
                            ].map((index) => (
                              <DiceIcon
                                key={index}
                                count={index + 1}
                                className="w-[28px]"
                              />
                            ))}
                          </span>
                        </dd>
                      </div>
                    </>
                  ) : null}
                  {state.pendingTurnResult ? (
                    <div>
                      <dt className="text-gray-700">Updated total</dt>
                      <dd className="font-body-1 text-red-700">
                        {formatScore(state.pendingTurnResult.newTotal)}
                      </dd>
                    </div>
                  ) : null}
                </dl>
                <GamePreferences className="w-full sm:w-auto" />
              </section>
            ) : null}

            <div className="min-h-0 flex-1">
              {currentPlayer && avatar && !state.pendingTurnResult ? (
                <PlayerSwitchSplash
                  key={`${currentPlayer.id}-${state.currentPlayerIndex}`}
                  currentPlayer={currentPlayer}
                  avatar={avatar}
                  soundEnabled={state.settings.tableFeedback}
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

      <ConfirmGameActionModal
        action={confirmAction}
        onClose={() => setConfirmAction(null)}
        onConfirm={onConfirmGameAction}
      />
    </>
  );
}
