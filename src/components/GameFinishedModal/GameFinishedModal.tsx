import { AvatarImage } from "@/components/AvatarImage/AvatarImage";
import Button from "@/components/Button/Button";
import {
  AvatarId,
  avatarSet,
} from "@/components/Form/AddPlayer/AddPlayer";
import Modal from "@/components/Modal/Modal";
import Splash from "@/components/Modal/Splash";
import { gameSounds } from "@/domain/game/gameAudio";
import type { Player, Turn } from "@/domain/game/gameTypes";
import { formatScore } from "@/utils/formatScore";
import { useEffect } from "react";

type GameFinishedModalProps = {
  onResetGame: () => void;
  onResetPlayers: () => void;
  players: Player[];
  soundEnabled?: boolean;
  turns: Turn[];
  winner: Player | null;
};

export function GameFinishedModal({
  onResetGame,
  onResetPlayers,
  players,
  soundEnabled = false,
  turns,
  winner,
}: Readonly<GameFinishedModalProps>) {
  const avatar = avatarSet[winner?.avatar as AvatarId];
  const standings = [...players].sort(
    (a, b) => (b.totalScore ?? 0) - (a.totalScore ?? 0)
  );
  const biggestTurn = turns.reduce<Turn | null>((biggest, turn) => {
    if (!biggest || turn.score > biggest.score) return turn;
    return biggest;
  }, null);
  const biggestTurnPlayer = biggestTurn
    ? players.find((player) => player.id === biggestTurn.playerId)
    : null;
  const winnerScore = standings[0]?.totalScore ?? 0;
  const runnerUpScore = standings[1]?.totalScore ?? 0;
  const totalPoints = turns.reduce((total, turn) => total + turn.score, 0);
  const averageTurn = turns.length > 0 ? Math.round(totalPoints / turns.length) : 0;
  const farkles = turns.filter((turn) => turn.score === 0).length;

  useEffect(() => {
    const sound = gameSounds.win;
    if (!soundEnabled || !sound) return;

    const audio = new Audio(sound.src);
    audio.volume = sound.volume ?? 0.7;
    void audio.play().catch(() => undefined);
  }, [soundEnabled]);

  return (
    <Modal isOpen={true} ariaLabel="Game finished" variant="splash">
      <Modal.Body>
        <Splash
          title={winner ? `${winner.username} wins!` : "Game finished"}
          image={
            <figure
              className={`splash-avatar-crown relative rounded-full w-[128px] h-[128px] mx-auto my-2 p-4 flex items-center justify-center ${avatar?.color ?? "bg-gray-500"}`}
            >
              {avatar ? (
                <AvatarImage
                  avatar={avatar}
                  alt={`${winner?.username}'s ${avatar.name} avatar`}
                  className="h-full w-full"
                />
              ) : null}
            </figure>
          }
        >
          {standings.length > 0 ? (
            <div
              aria-label="Final standings and game recap"
              className="grid max-h-[30dvh] gap-3 overflow-auto pr-1 text-left"
              tabIndex={0}
            >
              <section className="rounded-lg bg-gray-100 p-4">
                <h3 className="font-heading-2 mb-2 text-center">
                  Final standings
                </h3>
                <ol className="grid gap-2">
                  {standings.map((player, index) => (
                    <li
                      key={player.id}
                      className="flex justify-between gap-3 border-b border-sun-200 pb-2 last:border-0 last:pb-0"
                    >
                      <span className="truncate">
                        {index + 1}. {player.username}
                      </span>
                      <span className="shrink-0 text-red-700">
                        {formatScore(player.totalScore ?? 0)}
                      </span>
                    </li>
                  ))}
                </ol>
              </section>
              <section className="rounded-lg bg-gray-100 p-4">
                <h3 className="font-heading-2 mb-2 text-center">Game recap</h3>
                <dl className="grid grid-cols-2 gap-3 text-sm sm:text-base">
                  <div>
                    <dt className="text-gray-700">Winning margin</dt>
                    <dd className="font-body-1 text-red-700">
                      {formatScore(Math.max(0, winnerScore - runnerUpScore))}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-gray-700">Turns played</dt>
                    <dd className="font-body-1 text-red-700">{turns.length}</dd>
                  </div>
                  <div>
                    <dt className="text-gray-700">Biggest turn</dt>
                    <dd className="font-body-1 text-red-700">
                      {biggestTurn
                        ? `${formatScore(biggestTurn.score)} by ${
                            biggestTurnPlayer?.username ?? "Unknown"
                          }`
                        : "0"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-gray-700">Average turn</dt>
                    <dd className="font-body-1 text-red-700">
                      {formatScore(averageTurn)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-gray-700">Farkles</dt>
                    <dd className="font-body-1 text-red-700">{farkles}</dd>
                  </div>
                </dl>
              </section>
            </div>
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
