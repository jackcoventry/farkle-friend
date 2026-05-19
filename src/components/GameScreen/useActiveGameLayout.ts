'use client';

import { useMemo, useState } from 'react';
import { type Avatar, type AvatarId, avatarSet } from '@/domain/game/avatars';
import type { GameFlowState, GameMode, Player, TurnResult } from '@/domain/game/gameTypes';

type UseActiveGameLayoutArgs = {
  avatar: Avatar | undefined;
  currentPlayer: Player | null;
  flowState: GameFlowState;
  mode: GameMode;
  pendingTurnResult: TurnResult | null;
};

export function useActiveGameLayout({
  avatar,
  currentPlayer,
  flowState,
  mode,
  pendingTurnResult,
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
    (mode === 'dice' || mode === 'manual') &&
    !pendingTurnResult;
  const turnInfoModalId = mode === 'manual' ? 'manual-turn-coach-modal' : 'dice-turn-coach-modal';
  const isActiveTurnLayout =
    currentPlayer &&
    flowState === 'TURN_ACTIVE' &&
    !pendingTurnResult &&
    (mode === 'dice' || mode === 'manual');

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
