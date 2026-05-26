'use client';

import { useI18n } from '@/i18n/I18nProvider';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import { useGame } from '@/domain/game/GameProvider';
import type { DiceTurnMetrics } from '@/components/DiceTurnPanel/DiceTurnPanel';
import { ActiveGameScreen } from '@/components/GameScreen/ActiveGameScreen';
import { LobbyGameScreen } from '@/components/GameScreen/LobbyGameScreen';
import { useGameActions } from '@/components/GameScreen/useGameActions';
import { useGameViewModel } from '@/components/GameScreen/useGameViewModel';
import { useLobbyTabs } from '@/components/GameScreen/useLobbyTabs';

const ConfirmGameActionModal = dynamic(() =>
  import('@/components/GameActions/ConfirmGameActionModal').then(
    (module) => module.ConfirmGameActionModal
  )
);
const GameFinishedModal = dynamic(() =>
  import('@/components/GameFinishedModal/GameFinishedModal').then(
    (module) => module.GameFinishedModal
  )
);

export function GameScreen() {
  const { state, dispatch, settingsReady } = useGame();
  const { t } = useI18n();
  const [diceTurnMetrics, setDiceTurnMetrics] = useState<DiceTurnMetrics | null>(null);
  const { activeView, avatar, currentPlayer, flowState, lobbyView, nextPlayer, summary, winner } =
    useGameViewModel(state);
  const {
    lobbyScreen,
    onLobbyTabKeyDown,
    playersTabRef,
    selectLobbyScreen,
    setLobbyScreen,
    settingsTabRef,
  } = useLobbyTabs();
  const actions = useGameActions({ dispatch, setLobbyScreen, state });

  if (flowState === 'LOBBY') {
    return (
      <LobbyGameScreen
        lobbyScreen={lobbyScreen}
        onAddPlayerFormSubmit={actions.onAddPlayerFormSubmit}
        onLobbyTabKeyDown={onLobbyTabKeyDown}
        onRemovePlayer={actions.onRemovePlayer}
        onSelectLobbyScreen={selectLobbyScreen}
        onSettingsSubmit={actions.onSettingsSubmit}
        onStartGame={actions.onStartGame}
        playersTabRef={playersTabRef}
        settingsTabRef={settingsTabRef}
        settingsReady={settingsReady}
        view={lobbyView}
      />
    );
  }

  if (flowState === 'FINISHED') {
    return (
      <main>
        <h1 className="sr-only">{t('game.title')}</h1>
        <GameFinishedModal
          onResetGame={actions.onResetGame}
          onResetPlayers={actions.onResetPlayers}
          players={summary.players}
          soundEnabled={activeView.tableFeedback}
          turns={activeView.turns}
          winner={winner}
        />
      </main>
    );
  }

  return (
    <>
      <ActiveGameScreen
        avatar={avatar}
        currentPlayer={currentPlayer}
        diceTurnMetrics={diceTurnMetrics}
        dispatch={dispatch}
        flowState={flowState}
        nextPlayer={nextPlayer}
        onAdvanceTurn={actions.onAdvanceTurn}
        onQuit={actions.onQuit}
        onRestart={actions.onRestart}
        setDiceTurnMetrics={setDiceTurnMetrics}
        state={state}
        summary={summary}
        view={activeView}
      />
      <ConfirmGameActionModal
        action={actions.confirmAction}
        onClose={actions.onCloseConfirmAction}
        onConfirm={actions.onConfirmGameAction}
      />
    </>
  );
}
