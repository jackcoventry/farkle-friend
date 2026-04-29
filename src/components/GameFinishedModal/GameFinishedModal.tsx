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
  players: Player[];
  winner: Player | null;
};

export function GameFinishedModal({
  onResetGame,
  onResetPlayers,
  players,
  winner,
}: Readonly<GameFinishedModalProps>) {
  const avatar = avatarSet[winner?.avatar as AvatarId];
  const standings = [...players].sort(
    (a, b) => (b.totalScore ?? 0) - (a.totalScore ?? 0)
  );

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
          {standings.length > 0 ? (
            <section className="rounded-lg bg-gray-100 p-4 text-left">
              <h3 className="font-heading-2 mb-2 text-center">
                Final standings
              </h3>
              <ol className="grid gap-2">
                {standings.map((player) => (
                  <li
                    key={player.id}
                    className="flex justify-between gap-3 border-b border-sun-200 pb-2 last:border-0 last:pb-0"
                  >
                    <span className="truncate">{player.username}</span>
                    <span className="shrink-0 text-red-700">
                      {player.totalScore ?? 0}
                    </span>
                  </li>
                ))}
              </ol>
            </section>
          ) : null}
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
