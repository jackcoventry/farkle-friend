'use client';

import type { Dispatch, SetStateAction } from 'react';
import { useState } from 'react';
import { type Avatar, type AvatarId, avatarSet } from '@/domain/game/avatars';
import type { GameAction } from '@/domain/game/gameReducer';
import type { GameFlowState, GameState, GameSummary, Player } from '@/domain/game/gameTypes';
import Button from '@/components/Button/Button';
import { type DiceTurnMetrics, DiceTurnPanel } from '@/components/DiceTurnPanel/DiceTurnPanel';
import Footer from '@/components/Footer/Footer';
import { GameActions } from '@/components/GameActions/GameActions';
import { GameStatusBar } from '@/components/GameScreen/GameStatusBar';
import GameShell from '@/components/GameShell/GameShell';
import { ManualTurn } from '@/components/ManualTurn/ManualTurn';
import { Panel } from '@/components/Panel/Panel';
import PlayerList from '@/components/PlayerList/PlayerList';
import { PlayerSwitchSplash } from '@/components/PlayerSwitchSplash/PlayerSwitchSplash';
import { SidebarModal } from '@/components/SidebarModal/SidebarModal';
import { TurnHistory } from '@/components/TurnHistory/TurnHistory';
import { TurnResultPanel } from '@/components/TurnResultPanel/TurnResultPanel';

type ActiveGameScreenProps = {
  avatar: Avatar | undefined;
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

type GameScreenSidebarProps = {
  currentPlayer: Player | null;
  onQuit: () => void;
  onRestart: () => void;
  state: GameState;
  summary: GameSummary;
};

export function GameScreenSidebar({
  summary,
  currentPlayer,
  state,
  onQuit,
  onRestart,
}: Readonly<GameScreenSidebarProps>) {
  return (
    <>
      <GameShell.SidebarMain>
        <Panel>
          <details open>
            <summary className="cursor-pointer font-heading-2 text-text">Scoreboard</summary>
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
            <summary className="cursor-pointer font-heading-2 text-text">Turn log</summary>
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
        <GameActions
          onQuit={onQuit}
          onRestart={onRestart}
        />
        <Footer />
      </GameShell.SidebarFooter>
    </>
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
  const currentAvatar =
    avatar ?? (currentPlayer ? avatarSet[currentPlayer.avatar as AvatarId] : undefined);
  const showTurnInfoToggle =
    currentPlayer &&
    flowState === 'TURN_ACTIVE' &&
    (state.settings.mode === 'dice' || state.settings.mode === 'manual') &&
    !state.pendingTurnResult;
  const turnInfoModalId =
    state.settings.mode === 'manual' ? 'manual-turn-coach-modal' : 'dice-turn-coach-modal';
  const isActiveTurnLayout =
    currentPlayer &&
    flowState === 'TURN_ACTIVE' &&
    !state.pendingTurnResult &&
    (state.settings.mode === 'dice' || state.settings.mode === 'manual');
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
      <GameShell.Sidebar isDesktop>
        <GameScreenSidebar
          summary={summary}
          currentPlayer={currentPlayer}
          state={state}
          onQuit={onQuit}
          onRestart={onRestart}
        />
      </GameShell.Sidebar>

      {currentPlayer && currentAvatar && flowState === 'TURN_ACTIVE' ? (
        <PlayerSwitchSplash
          key={currentPlayer.id}
          avatar={currentAvatar}
          currentPlayer={currentPlayer}
          soundEnabled={state.preferences.tableFeedback}
        />
      ) : null}

      <SidebarModal
        id="active-game-sidebar-modal"
        isOpen={showSidebarModal}
        onClose={() => setShowSidebarModal(false)}
        ariaLabel="Game menu"
        closeLabel="Close game menu"
      >
        <GameShell.Sidebar>
          <GameScreenSidebar
            summary={summary}
            currentPlayer={currentPlayer}
            state={state}
            onQuit={onQuit}
            onRestart={onRestart}
          />
        </GameShell.Sidebar>
      </SidebarModal>

      <GameShell.Body>
        <div className="flex h-full min-h-0 flex-col gap-2 lg:gap-4">
          {isActiveTurnLayout || flowState === 'TURN_RESULT' ? null : statusBar}

          <div className="min-h-0 flex-1 flex">
            {currentPlayer ? (
              flowState === 'TURN_RESULT' && state.pendingTurnResult ? (
                <TurnResultPanel
                  autoAdvance={state.settings.autoAdvanceTurns}
                  currentPlayer={currentPlayer}
                  key={`${state.pendingTurnResult.playerId}-${state.pendingTurnResult.score}-${state.pendingTurnResult.newTotal}`}
                  nextPlayer={nextPlayer}
                  result={state.pendingTurnResult}
                  onAdvanceTurn={onAdvanceTurn}
                />
              ) : state.settings.mode === 'dice' ? (
                <DiceTurnPanel
                  dispatch={dispatch}
                  isCoachOpenOnMobile={isTurnCoachOpen}
                  onCloseMobileCoach={() => setIsTurnCoachOpen(false)}
                  onTurnMetricsChange={setDiceTurnMetrics}
                  statusSlot={statusBar}
                  state={state}
                />
              ) : (
                <ManualTurn
                  state={state}
                  dispatch={dispatch}
                  isCoachOpenOnMobile={isTurnCoachOpen}
                  onCloseMobileCoach={() => setIsTurnCoachOpen(false)}
                  statusSlot={statusBar}
                />
              )
            ) : (
              <p>No active player</p>
            )}
          </div>
        </div>
      </GameShell.Body>

      <GameShell.MobileToolbar>
        <div className={`grid w-full gap-2 ${showTurnInfoToggle ? 'grid-cols-2' : 'grid-cols-1'}`}>
          {showTurnInfoToggle ? (
            <Button
              aria-controls={turnInfoModalId}
              aria-expanded={isTurnCoachOpen}
              className="justify-center"
              size="small"
              onClick={() => setIsTurnCoachOpen((current) => !current)}
              icon="question-circle"
            >
              {isTurnCoachOpen ? 'Hide turn info' : 'Turn info'}
            </Button>
          ) : null}
          <Button
            aria-controls="active-game-sidebar-modal"
            aria-expanded={showSidebarModal}
            className="justify-center"
            onClick={() => setShowSidebarModal(true)}
            size="small"
            icon="three-dots-vertical"
          >
            Game menu
          </Button>
        </div>
      </GameShell.MobileToolbar>
    </GameShell>
  );
}
