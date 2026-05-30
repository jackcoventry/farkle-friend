'use client';

import { useI18n } from '@/i18n/I18nProvider';
import type { KeyboardEvent, RefObject } from 'react';
import { useRef, useState, useSyncExternalStore } from 'react';
import { useBreakpoint } from '@/hooks/useBreakpoint';
import { Button } from '@/components/Button/Button';
import { Footer } from '@/components/Footer/Footer';
import { AddPlayerForm, type AddPlayerFormSchemaType } from '@/components/Form/AddPlayer/AddPlayer';
import { Settings, type SettingsFormSchemaType } from '@/components/Form/Settings/Settings';
import type { LobbyGameView } from '@/components/GameScreen/useGameViewModel';
import { GameSetupSummary } from '@/components/GameSetupSummary/GameSetupSummary';
import { GameShell } from '@/components/GameShell/GameShell';
import { Panel } from '@/components/Panel/Panel';
import { PlayerList } from '@/components/PlayerList/PlayerList';
import { SidebarModal } from '@/components/SidebarModal/SidebarModal';
import './LobbyGameScreen.css';

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
  settingsReady: boolean;
  view: LobbyGameView;
};

const subscribeToHydration = () => () => undefined;
const getClientHydrationSnapshot = () => true;
const getServerHydrationSnapshot = () => false;

function GameSetupSummarySkeleton() {
  return (
    <Panel
      aria-hidden="true"
      className="gap-md grid"
    >
      <div className="bg-surface-muted h-5 w-32 rounded-full" />
      <div className="gap-sm grid">
        <div className="bg-surface-muted h-4 w-full rounded-full" />
        <div className="bg-surface-muted h-4 w-10/12 rounded-full" />
        <div className="bg-surface-muted h-4 w-8/12 rounded-full" />
      </div>
    </Panel>
  );
}

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
  settingsReady,
  view,
}: Readonly<LobbyGameScreenProps>) {
  const { t } = useI18n();
  const { isAtLeast } = useBreakpoint();

  const hasHydrated = useSyncExternalStore(
    subscribeToHydration,
    getClientHydrationSnapshot,
    getServerHydrationSnapshot
  );
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sidebarTriggerRef = useRef<HTMLButtonElement | null>(null);
  const startDisabled = hasHydrated ? !settingsReady || !view.readyToStart : false;

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };
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
              <h2 className="font-heading-2">{t('setup.noPlayersTitle')}</h2>
              <p className="text-text-muted mt-2xs">{t('setup.noPlayersDescription')}</p>
            </Panel>
          )}
          {settingsReady ? (
            <GameSetupSummary
              preferences={view.preferences}
              settings={view.settings}
              onEditSettings={() => onSelectLobbyScreen('settings')}
            />
          ) : (
            <GameSetupSummarySkeleton />
          )}
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
                <h2 className="font-heading-2">{t('setup.noPlayersTitle')}</h2>
                <p className="text-text-muted mt-2xs">{t('setup.noPlayersDescription')}</p>
              </Panel>
            )}
            {settingsReady ? (
              <GameSetupSummary
                preferences={view.preferences}
                settings={view.settings}
                onEditSettings={() => {
                  setIsSidebarOpen(false);
                  onSelectLobbyScreen('settings');
                }}
              />
            ) : (
              <GameSetupSummarySkeleton />
            )}
          </GameShell.SidebarMain>
          <GameShell.SidebarFooter>
            <Footer />
          </GameShell.SidebarFooter>
        </GameShell.Sidebar>
      </SidebarModal>

      <GameShell.Body>
        <div className="lobby-game-screen__main | gap-md xl:gap-xl p-md mx-auto flex h-full w-full flex-col justify-start overflow-auto">
          <div
            className="gap-xs grid grid-cols-2"
            role="tablist"
            aria-label={t('setup.gameSetup')}
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
              variant={lobbyScreen === 'players' ? 'primary' : 'tertiary'}
              size="small"
              icon="person-circle"
            >
              {t('setup.players')}
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
              variant={lobbyScreen === 'settings' ? 'primary' : 'tertiary'}
              size="small"
              icon="gear"
            >
              {t('settings.title')}
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
          <Panel className="lobby-start-panel | gap-lg hidden lg:grid">
            <div className="flex justify-between">
              <h2 className="font-heading-2 text-text">{t('setup.ready')}</h2>

              <span className="gap-xs inline-flex items-center">
                <svg
                  aria-hidden="true"
                  className="icon"
                  width="1.25em"
                  height="1.25em"
                  fill="currentColor"
                >
                  <use xlinkHref={`/icons/icons.svg#person-circle`} />
                </svg>
                <span>{view.players.length}</span>
              </span>
            </div>

            <Button
              type="button"
              onClick={() => {
                if (!settingsReady || !view.readyToStart) return;

                onStartGame();
              }}
              className="w-full justify-center"
              disabled={startDisabled}
              variant="primary"
            >
              {t('actions.start')}
            </Button>
          </Panel>
        </div>
      </GameShell.Body>

      <GameShell.MobileToolbar>
        <div className="gap-sm flex w-full justify-end">
          <span className="gap-xs inline-flex items-center lg:hidden">
            <svg
              aria-hidden="true"
              className="icon"
              width="1.25em"
              height="1.25em"
              fill="currentColor"
            >
              <use xlinkHref={`/icons/icons.svg#person-circle`} />
            </svg>
            <span>{view.players.length}</span>
          </span>

          <Button
            type="button"
            onClick={() => {
              if (!settingsReady || !view.readyToStart) return;

              onStartGame();
            }}
            className="w-full justify-center lg:hidden"
            disabled={startDisabled}
            variant="primary"
            size="small"
          >
            {t('actions.start')}
          </Button>

          <Button
            aria-controls="lobby-sidebar-modal"
            aria-expanded={isSidebarOpen}
            ariaLabel={t('setup.summary')}
            icon="three-dots-vertical"
            iconOnly={!isAtLeast('lg')}
            onClick={() => setIsSidebarOpen(true)}
            ref={sidebarTriggerRef}
            size="small"
            variant="secondary"
          >
            {t('setup.summary')}
          </Button>
        </div>
      </GameShell.MobileToolbar>
    </GameShell>
  );
}
