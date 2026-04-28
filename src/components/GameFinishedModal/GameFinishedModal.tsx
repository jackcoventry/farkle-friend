import { AvatarImage } from "@/components/AvatarImage/AvatarImage";
import Button from "@/components/Button/Button";
import {
  AvatarId,
  avatarSet,
} from "@/components/Form/AddPlayer/AddPlayer";
import Modal from "@/components/Modal/Modal";
import Splash from "@/components/Modal/Splash";
import type { Player } from "@/domain/game/gameTypes";

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
                <AvatarImage
                  avatar={avatar}
                  alt={`${winner?.username}'s ${avatar.name} avatar`}
                  className="splash-avatar"
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
