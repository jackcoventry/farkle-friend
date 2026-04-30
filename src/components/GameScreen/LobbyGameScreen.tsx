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
  const modeLabel =
    state.settings.mode === "dice" ? "Dice rolling" : "Manual scoring";

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
            settings={state.settings}
            onEditSettings={() => onSelectLobbyScreen("settings")}
          />
          <section className="mt-4 grid gap-3 rounded-lg bg-sun-50 p-4">
            <div>
              <h2 className="font-heading-2">Ready?</h2>
              <p className="text-gray-800">
                {readyToStart
                  ? `${state.players.length} players · ${modeLabel} · First to ${formatScore(
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
              onClick={() => onSelectLobbyScreen("players")}
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
              onClick={() => onSelectLobbyScreen("settings")}
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
        </div>
      </GameShell.Body>
    </GameShell>
  );
}
