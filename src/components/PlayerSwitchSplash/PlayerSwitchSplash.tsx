"use client";

import { AvatarId, avatarSet } from "@/components/Form/AddPlayer/AddPlayer";
import Modal from "@/components/Modal/Modal";
import Splash from "@/components/Modal/Splash";
import type { Player } from "@/domain/game/gameTypes";
import Image from "next/image";
import { useEffect, useState } from "react";

type PlayerSwitchSplashProps = {
  avatar: (typeof avatarSet)[AvatarId];
  currentPlayer: Player;
};

export function PlayerSwitchSplash({
  avatar,
  currentPlayer,
}: Readonly<PlayerSwitchSplashProps>) {
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    const timeout = globalThis.setTimeout(() => {
      setIsOpen(false);
    }, 2000);

    return () => globalThis.clearTimeout(timeout);
  }, []);

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
              className={`rounded-full overflow-hidden w-[200px] h-[200px] mx-auto my-4 p-6 flex items-center justify-center ${avatar.color}`}
            >
              <Image
                src={avatar.image}
                alt={`${currentPlayer.username}'s ${avatar.name} avatar`}
                width={200}
                height={200}
                className="splash-avatar"
                style={{ height: 200, width: 200 }}
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
