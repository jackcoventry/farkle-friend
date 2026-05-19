'use client';

import type { KeyboardEvent, RefObject } from 'react';
import { useRef, useState } from 'react';
import Button from '@/components/Button/Button';
import Footer from '@/components/Footer/Footer';
import AddPlayerForm, { type AddPlayerFormSchemaType } from '@/components/Form/AddPlayer/AddPlayer';
import Settings, { type SettingsFormSchemaType } from '@/components/Form/Settings/Settings';
import type { LobbyGameView } from '@/components/GameScreen/useGameViewModel';
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
  view: LobbyGameView;
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
  view,
}: Readonly<LobbyGameScreenProps>) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sidebarTriggerRef = useRef<HTMLButtonElement | null>(null);
  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };
  const startGameButton = (
    <Button
      type="button"
      onClick={onStartGame}
      className="w-full justify-center"
      disabled={!view.readyToStart}
    >
      Start game
    </Button>
  );

  return (
    <GameShell key="lobby">
      <GameShell.Sidebar isDesktop>
        <GameShell.SidebarMain>
          {view.players.length > 0 ? (
            <PlayerList
              players={view.players}
              onRemovePlayer={onRemovePlayer}
            />
          ) : (
            <Panel>
              <h2 className="font-heading-2">No players yet</h2>
              <p className="text-text-muted mt-2xs">
                Add at least two players, then start the game from the setup panel.
              </p>
            </Panel>
          )}
          <GameSetupSummary
            preferences={view.preferences}
            settings={view.settings}
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
        onClose={closeSidebar}
        ariaLabel="Game setup summary"
        closeLabel="Close setup summary"
        returnFocusRef={sidebarTriggerRef}
      >
        <GameShell.Sidebar>
          <GameShell.SidebarMain>
            {view.players.length > 0 ? (
              <PlayerList
                players={view.players}
                onRemovePlayer={onRemovePlayer}
              />
            ) : (
              <Panel>
                <h2 className="font-heading-2">No players yet</h2>
                <p className="text-text-muted mt-2xs">
                  Add at least two players, then start the game from the setup panel.
                </p>
              </Panel>
            )}
            <GameSetupSummary
              preferences={view.preferences}
              settings={view.settings}
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
              {view.players.length ? <span className="ml-xs">({view.players.length})</span> : null}
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
          ref={sidebarTriggerRef}
          size="small"
        >
          Setup summary
        </Button>
      </GameShell.MobileToolbar>
    </GameShell>
  );
}
