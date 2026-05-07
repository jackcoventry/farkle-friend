'use client';

import type { KeyboardEvent, RefObject } from 'react';
import { useState } from 'react';
import { canStartGame } from '@/domain/game/gameLogic';
import type { GameState } from '@/domain/game/gameTypes';
import Button from '@/components/Button/Button';
import Footer from '@/components/Footer/Footer';
import AddPlayerForm, { type AddPlayerFormSchemaType } from '@/components/Form/AddPlayer/AddPlayer';
import Settings, { type SettingsFormSchemaType } from '@/components/Form/Settings/Settings';
import { GameSetupSummary } from '@/components/GameSetupSummary/GameSetupSummary';
import GameShell from '@/components/GameShell/GameShell';
import { Panel } from '@/components/Panel/Panel';
import PlayerList from '@/components/PlayerList/PlayerList';
import { SidebarModal } from '@/components/SidebarModal/SidebarModal';

type LobbyScreen = 'players' | 'settings';

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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const readyToStart = canStartGame(state);
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
      <GameShell.Sidebar isDesktop>
        <GameShell.SidebarMain>
          {state.players.length > 0 ? (
            <PlayerList
              players={state.players}
              onRemovePlayer={onRemovePlayer}
            />
          ) : (
            <Panel>
              <h2 className="font-heading-2">No players yet</h2>
              <p className="text-text-muted mt-1">
                Add at least two players, then start the game from the setup panel.
              </p>
            </Panel>
          )}
          <GameSetupSummary
            preferences={state.preferences}
            settings={state.settings}
            onEditSettings={() => onSelectLobbyScreen('settings')}
          />
        </GameShell.SidebarMain>
        <GameShell.SidebarFooter>
          <Footer />
        </GameShell.SidebarFooter>
      </GameShell.Sidebar>

      <SidebarModal
        id="lobby-sidebar-modal"
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        ariaLabel="Game setup summary"
        closeLabel="Close setup summary"
      >
        <GameShell.Sidebar>
          <GameShell.SidebarMain>
            {state.players.length > 0 ? (
              <PlayerList
                players={state.players}
                onRemovePlayer={onRemovePlayer}
              />
            ) : (
              <Panel>
                <h2 className="font-heading-2">No players yet</h2>
                <p className="text-text-muted mt-1">
                  Add at least two players, then start the game from the setup panel.
                </p>
              </Panel>
            )}
            <GameSetupSummary
              preferences={state.preferences}
              settings={state.settings}
              onEditSettings={() => {
                setIsSidebarOpen(false);
                onSelectLobbyScreen('settings');
              }}
            />
          </GameShell.SidebarMain>
          <GameShell.SidebarFooter>
            <Footer />
          </GameShell.SidebarFooter>
        </GameShell.Sidebar>
      </SidebarModal>

      <GameShell.Body>
        <div className="gap-xl p-md mx-auto flex h-full w-full max-w-[520px] flex-col justify-start overflow-auto">
          <Panel className="lobby-start-panel | gap-lg grid">
            <h2 className="font-heading-2 text-text">Ready?</h2>
            {startGameButton}
          </Panel>
          <div
            className="gap-xs grid grid-cols-2"
            role="tablist"
            aria-label="Game setup"
          >
            <Button
              ref={playersTabRef}
              type="button"
              role="tab"
              aria-selected={lobbyScreen === 'players'}
              aria-controls="players-panel"
              id="players-tab"
              tabIndex={lobbyScreen === 'players' ? 0 : -1}
              onClick={() => onSelectLobbyScreen('players')}
              onKeyDown={onLobbyTabKeyDown}
              variant={lobbyScreen === 'players' ? 'primary' : 'secondary'}
              size="small"
              icon="person-circle"
            >
              Players
              {state.players.length ? <span className="ml-2">({state.players.length})</span> : null}
            </Button>
            <Button
              ref={settingsTabRef}
              type="button"
              role="tab"
              aria-selected={lobbyScreen === 'settings'}
              aria-controls="settings-panel"
              id="settings-tab"
              tabIndex={lobbyScreen === 'settings' ? 0 : -1}
              onClick={() => onSelectLobbyScreen('settings')}
              onKeyDown={onLobbyTabKeyDown}
              variant={lobbyScreen === 'settings' ? 'primary' : 'secondary'}
              size="small"
              icon="gear"
            >
              Settings
            </Button>
          </div>

          {lobbyScreen === 'players' ? (
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

      <GameShell.MobileToolbar>
        <Button
          aria-controls="lobby-sidebar-modal"
          aria-expanded={isSidebarOpen}
          icon="three-dots-vertical"
          onClick={() => setIsSidebarOpen(true)}
          size="small"
        >
          Setup summary
        </Button>
      </GameShell.MobileToolbar>
    </GameShell>
  );
}
