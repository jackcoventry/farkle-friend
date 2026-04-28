import Button from "@/components/Button/Button";
import {
  AvatarId,
  avatarSet,
} from "@/components/Form/AddPlayer/AddPlayer";
import Modal from "@/components/Modal/Modal";
import Splash from "@/components/Modal/Splash";
import type { Player } from "@/domain/game/gameTypes";
import Image from "next/image";

type GameFinishedModalProps = {
  onResetGame: () => void;
  onResetPlayers: () => void;
  winner: Player | null;
};

export function GameFinishedModal({
  onResetGame,
  onResetPlayers,
  winner,
}: Readonly<GameFinishedModalProps>) {
  const avatar = avatarSet[winner?.avatar as AvatarId];

  return (
    <Modal isOpen={true} ariaLabel="Game finished" variant="splash">
      <Modal.Body>
        <Splash
          title={winner ? `${winner.username} wins!` : "Game finished"}
          image={
            <figure
              className={`splash-avatar-crown relative rounded-full w-[200px] h-[200px] mx-auto my-4 p-6 flex items-center justify-center ${avatar?.color ?? "bg-gray-500"}`}
            >
              {avatar ? (
                <Image
                  src={avatar.image}
                  alt={`${winner?.username}'s ${avatar.name} avatar`}
                  width={200}
                  height={200}
                  className="splash-avatar"
                  style={{ height: 200, width: 200 }}
                />
              ) : null}
            </figure>
          }
        >
          <Button onClick={onResetGame} className="justify-center">
            Another game?
          </Button>
          <Button onClick={onResetPlayers} className="justify-center">
            New players
          </Button>
        </Splash>
      </Modal.Body>
    </Modal>
  );
}
