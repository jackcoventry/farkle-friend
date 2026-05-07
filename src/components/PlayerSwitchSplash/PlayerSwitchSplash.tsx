'use client';

import { useEffect, useState } from 'react';
import { type Avatar } from '@/domain/game/avatars';
import { playGameSound } from '@/domain/game/gameAudio';
import type { Player } from '@/domain/game/gameTypes';
import { AvatarImage } from '@/components/AvatarImage/AvatarImage';
import Modal from '@/components/Modal/Modal';
import Splash from '@/components/Modal/Splash';

type PlayerSwitchSplashProps = {
  avatar: Avatar;
  currentPlayer: Player;
  soundEnabled?: boolean;
};

export function PlayerSwitchSplash({
  avatar,
  currentPlayer,
  soundEnabled = false,
}: Readonly<PlayerSwitchSplashProps>) {
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    playGameSound('turnStart', soundEnabled);

    const timeout = globalThis.setTimeout(() => {
      setIsOpen(false);
    }, 2000);

    return () => globalThis.clearTimeout(timeout);
  }, [currentPlayer.id, soundEnabled]);

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={true}
      ariaLabel={`${currentPlayer.username}'s turn`}
      variant="splash"
    >
      <Modal.Body>
        <Splash
          title={`${currentPlayer.username}'s turn`}
          image={
            <figure
              className={`p-xl my-md mx-auto flex aspect-square max-w-[200px] items-center justify-center overflow-hidden rounded-full ${avatar.color}`}
            >
              <AvatarImage
                avatar={avatar}
                alt={`${currentPlayer.username}'s ${avatar.name} avatar`}
                className="splash-avatar | h-[200px] w-[200px]"
              />
            </figure>
          }
          text={currentPlayer?.totalScore?.toString() || '0'}
        />
      </Modal.Body>
    </Modal>
  );
}
