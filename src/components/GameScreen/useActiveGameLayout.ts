'use client';

import { useMemo, useState } from 'react';
import { type Avatar, type AvatarId, avatarSet } from '@/domain/game/avatars';
import type { GameFlowState, GameState, Player } from '@/domain/game/gameTypes';

type UseActiveGameLayoutArgs = {
  avatar: Avatar | undefined;
  currentPlayer: Player | null;
  flowState: GameFlowState;
  state: GameState;
};

export function useActiveGameLayout({
  avatar,
  currentPlayer,
  flowState,
  state,
}: UseActiveGameLayoutArgs) {
  const [isTurnCoachOpen, setIsTurnCoachOpen] = useState(false);
  const [showSidebarModal, setShowSidebarModal] = useState(false);

  const currentAvatar = useMemo(
    () => avatar ?? (currentPlayer ? avatarSet[currentPlayer.avatar as AvatarId] : undefined),
    [avatar, currentPlayer]
  );
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

  return {
    currentAvatar,
    isActiveTurnLayout,
    isTurnCoachOpen,
    setIsTurnCoachOpen,
    setShowSidebarModal,
    showSidebarModal,
    showTurnInfoToggle,
    turnInfoModalId,
  };
}
