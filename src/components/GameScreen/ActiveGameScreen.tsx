'use client';

import { useI18n } from '@/i18n/I18nProvider';
import type { Dispatch, SetStateAction } from 'react';
import { useBreakpoint } from '@/hooks/useBreakpoint';
import type { Avatar } from '@/domain/game/avatars';
import type { GameAction } from '@/domain/game/gameReducer';
import type { GameFlowState, GameState, GameSummary, Player } from '@/domain/game/gameTypes';
import Button from '@/components/Button/Button';
import { type DiceTurnMetrics, DiceTurnPanel } from '@/components/DiceTurnPanel/DiceTurnPanel';
import Footer from '@/components/Footer/Footer';
import { GameActions } from '@/components/GameActions/GameActions';
import { GameStatusBar } from '@/components/GameScreen/GameStatusBar';
import { useActiveGameLayout } from '@/components/GameScreen/useActiveGameLayout';
import type { ActiveGameView } from '@/components/GameScreen/useGameViewModel';
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
  view: ActiveGameView;
};

type GameScreenSidebarProps = {
  currentPlayer: Player | null;
  onQuit: () => void;
  onRestart: () => void;
  summary: GameSummary;
  targetScore: number;
  turns: GameState['turns'];
};

export function GameScreenSidebar({
  summary,
  currentPlayer,
  onQuit,
  onRestart,
  targetScore,
  turns,
}: Readonly<GameScreenSidebarProps>) {
  const { t } = useI18n();
  return (
    <>
      <GameShell.SidebarMain>
        <Panel>
          <details open>
            <summary className="font-heading-2 text-text cursor-pointer">
              {t('history.scoreboard')}
            </summary>
            <div className="mt-sm">
              <PlayerList
                players={summary.players}
                activePlayerId={currentPlayer?.id}
                leadingPlayerId={summary.leadingPlayerId}
                targetScore={targetScore}
              />
            </div>
          </details>
        </Panel>

        <Panel>
          <details>
            <summary className="font-heading-2 text-text cursor-pointer">
              {t('history.turnLog')}
            </summary>
            <div className="mt-sm">
              <TurnHistory
                leadingPlayerId={summary.leadingPlayerId}
                players={summary.players}
                targetScore={targetScore}
                turns={turns}
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
  view,
}: Readonly<ActiveGameScreenProps>) {
  const { t } = useI18n();
  const { isAtLeast } = useBreakpoint();

  const {
    currentAvatar,
    isActiveTurnLayout,
    isTurnCoachOpen,
    setIsTurnCoachOpen,
    setShowSidebarModal,
    showSidebarModal,
    showTurnInfoToggle,
    turnInfoModalId,
  } = useActiveGameLayout({
    avatar,
    currentPlayer,
    flowState,
    mode: view.mode,
    pendingTurnResult: view.pendingTurnResult,
  });
  const statusBar = currentPlayer ? (
    <GameStatusBar
      currentPlayer={currentPlayer}
      diceTurnMetrics={diceTurnMetrics}
      flowState={flowState}
      mode={view.mode}
      pendingTurnResult={view.pendingTurnResult}
    />
  ) : null;

  return (
    <GameShell key="active">
      <GameShell.Sidebar isDesktop>
        <GameScreenSidebar
          summary={summary}
          currentPlayer={currentPlayer}
          onQuit={onQuit}
          onRestart={onRestart}
          targetScore={view.targetScore}
          turns={view.turns}
        />
      </GameShell.Sidebar>

      {currentPlayer && currentAvatar && flowState === 'TURN_ACTIVE' ? (
        <PlayerSwitchSplash
          key={currentPlayer.id}
          avatar={currentAvatar}
          currentPlayer={currentPlayer}
          soundEnabled={view.tableFeedback}
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
            onQuit={onQuit}
            onRestart={onRestart}
            targetScore={view.targetScore}
            turns={view.turns}
          />
        </GameShell.Sidebar>
      </SidebarModal>

      <GameShell.Body>
        <div className="gap-xs lg:gap-md flex h-full min-h-0 flex-col">
          {isActiveTurnLayout || flowState === 'TURN_RESULT' ? null : statusBar}

          <div className="flex min-h-0 flex-1">
            {currentPlayer ? (
              flowState === 'TURN_RESULT' && view.pendingTurnResult ? (
                <TurnResultPanel
                  autoAdvance={view.autoAdvanceTurns}
                  currentPlayer={currentPlayer}
                  key={`${view.pendingTurnResult.playerId}-${view.pendingTurnResult.score}-${view.pendingTurnResult.newTotal}`}
                  nextPlayer={nextPlayer}
                  result={view.pendingTurnResult}
                  onAdvanceTurn={onAdvanceTurn}
                />
              ) : view.mode === 'dice' ? (
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
              <p>{t('player.noActive')}</p>
            )}
          </div>
        </div>
      </GameShell.Body>

      <GameShell.MobileToolbar>
        <div className="gap-xs flex w-full justify-end">
          {showTurnInfoToggle ? (
            <Button
              aria-controls={turnInfoModalId}
              aria-expanded={isTurnCoachOpen}
              ariaLabel={isTurnCoachOpen ? t('actions.hideTurnInfo') : t('actions.turnInfo')}
              className="justify-center"
              size="small"
              onClick={() => setIsTurnCoachOpen((current) => !current)}
              icon="question-circle"
              iconOnly={!isAtLeast('lg')}
            >
              {isTurnCoachOpen ? t('actions.hideTurnInfo') : t('actions.turnInfo')}
            </Button>
          ) : null}
          <Button
            aria-controls="active-game-sidebar-modal"
            aria-expanded={showSidebarModal}
            ariaLabel={t('actions.gameMenu')}
            className="justify-center"
            onClick={() => setShowSidebarModal(true)}
            size="small"
            icon="three-dots-vertical"
            iconOnly={!isAtLeast('lg')}
          >
            {t('actions.gameMenu')}
          </Button>
        </div>
      </GameShell.MobileToolbar>
    </GameShell>
  );
}
