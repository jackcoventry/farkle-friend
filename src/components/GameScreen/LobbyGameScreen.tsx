"use client";

import Button from "@/components/Button/Button";
import Footer from "@/components/Footer/Footer";
import AddPlayerForm, {
  type AddPlayerFormSchemaType,
} from "@/components/Form/AddPlayer/AddPlayer";
import Settings, {
  type SettingsFormSchemaType,
} from "@/components/Form/Settings/Settings";
import { GamePreferences } from "@/components/GamePreferences/GamePreferences";
import { GameSetupSummary } from "@/components/GameSetupSummary/GameSetupSummary";
import GameShell from "@/components/GameShell/GameShell";
import PlayerList from "@/components/PlayerList/PlayerList";
import { canStartGame } from "@/domain/game/gameLogic";
import type { GameState } from "@/domain/game/gameTypes";
import { formatScore } from "@/utils/formatScore";
import type { KeyboardEvent, RefObject } from "react";

type LobbyScreen = "players" | "settings";

type LobbyGameScreenProps = {
  lobbyScreen: LobbyScreen;
  onAddPlayerFormSubmit: (data: AddPlayerFormSchemaType) => void;
  onLobbyTabKeyDown: (event: KeyboardEvent<HTMLButtonElement>) => void;
  onRemovePlayer: (playerId: string) => void;
  onSelectLobbyScreen: (screen: LobbyScreen) => void;
  onSettingsSubmit: (data: SettingsFormSchemaType) => void;
  onStartGame: () => void;
  playersTabRef: RefObject<HTMLButtonElement | null>;
  settingsTabRef: RefObject<HTMLButtonElement | null>;
  state: GameState;
};

export function LobbyGameScreen({
  lobbyScreen,
  onAddPlayerFormSubmit,
  onLobbyTabKeyDown,
  onRemovePlayer,
  onSelectLobbyScreen,
  onSettingsSubmit,
  onStartGame,
  playersTabRef,
  settingsTabRef,
  state,
}: Readonly<LobbyGameScreenProps>) {
  const readyToStart = canStartGame(state);
  const playersNeeded = Math.max(0, 2 - state.players.length);
  const modeLabel =
    state.settings.mode === "dice" ? "Dice rolling" : "Manual scoring";
  const startPanelMessage = readyToStart
    ? `${state.players.length} players · ${modeLabel} · First to ${formatScore(
        state.settings.targetScore,
      )}`
    : playersNeeded === 1
      ? "Add 1 more player to start."
      : "Add at least two players to start.";
  const startGameButton = (
    <Button
      type="button"
      onClick={onStartGame}
      className="w-full justify-center"
      disabled={!readyToStart}
    >
      Start game
    </Button>
  );

  return (
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
            preferences={state.preferences}
            settings={state.settings}
            onEditSettings={() => onSelectLobbyScreen("settings")}
          />
          <Footer />
        </div>
      </GameShell.Sidebar>
      <GameShell.Body>
        <div className="mx-auto flex h-full w-full max-w-[520px] flex-col justify-start gap-4 overflow-auto py-4">
          <div
            className="grid grid-cols-2 gap-2"
            role="tablist"
            aria-label="Game setup"
          >
            <Button
              ref={playersTabRef}
              type="button"
              role="tab"
              aria-selected={lobbyScreen === "players"}
              aria-controls="players-panel"
              id="players-tab"
              tabIndex={lobbyScreen === "players" ? 0 : -1}
              onClick={() => onSelectLobbyScreen("players")}
              onKeyDown={onLobbyTabKeyDown}
              variant={lobbyScreen === "players" ? "primary" : "secondary"}
              size="small"
              icon="person-circle"
            >
              Players
            </Button>
            <Button
              ref={settingsTabRef}
              type="button"
              role="tab"
              aria-selected={lobbyScreen === "settings"}
              aria-controls="settings-panel"
              id="settings-tab"
              tabIndex={lobbyScreen === "settings" ? 0 : -1}
              onClick={() => onSelectLobbyScreen("settings")}
              onKeyDown={onLobbyTabKeyDown}
              variant={lobbyScreen === "settings" ? "primary" : "secondary"}
              size="small"
              icon="person-circle"
            >
              Settings
            </Button>
          </div>

          {lobbyScreen === "players" ? (
            <div
              aria-labelledby="players-tab"
              id="players-panel"
              role="tabpanel"
            >
              <AddPlayerForm onSubmit={onAddPlayerFormSubmit} />
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

          <section className="lobby-start-panel grid gap-3 rounded-lg bg-white/90 p-4 text-gray-900 shadow-sm">
            <div>
              <h2 className="font-heading-2">Ready?</h2>
              <p className="text-gray-800">{startPanelMessage}</p>
            </div>
            {startGameButton}
          </section>
        </div>
      </GameShell.Body>
    </GameShell>
  );
}
