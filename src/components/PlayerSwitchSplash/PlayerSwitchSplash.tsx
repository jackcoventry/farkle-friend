"use client";

import { AvatarImage } from "@/components/AvatarImage/AvatarImage";
import { type Avatar } from "@/domain/game/avatars";
import Modal from "@/components/Modal/Modal";
import Splash from "@/components/Modal/Splash";
import { playGameSound } from "@/domain/game/gameAudio";
import type { Player } from "@/domain/game/gameTypes";
import { useEffect, useState } from "react";

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
    playGameSound("turnStart", soundEnabled);

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
              className={`rounded-full overflow-hidden aspect-square max-w-[200px] mx-auto my-4 p-6 flex items-center justify-center ${avatar.color}`}
            >
              <AvatarImage
                avatar={avatar}
                alt={`${currentPlayer.username}'s ${avatar.name} avatar`}
                className="splash-avatar"
              />
            </figure>
          }
          subtitle="Current score:"
          text={currentPlayer?.totalScore?.toString() || "0"}
        />
      </Modal.Body>
    </Modal>
  );
}
