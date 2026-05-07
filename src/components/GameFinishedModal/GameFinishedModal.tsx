'use client';

import { useEffect } from 'react';
import { formatScore } from '@/utils/formatScore';
import { AvatarId, avatarSet } from '@/domain/game/avatars';
import { playGameSound } from '@/domain/game/gameAudio';
import type { Player, Turn } from '@/domain/game/gameTypes';
import { AvatarImage } from '@/components/AvatarImage/AvatarImage';
import Button from '@/components/Button/Button';
import Modal from '@/components/Modal/Modal';
import Splash from '@/components/Modal/Splash';

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
  const standings = [...players].sort((a, b) => (b.totalScore ?? 0) - (a.totalScore ?? 0));
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
    playGameSound('win', soundEnabled);
  }, [soundEnabled]);

  return (
    <Modal
      isOpen={true}
      ariaLabel="Game finished"
      variant="splash"
    >
      <Modal.Body>
        <Splash
          className="gap-sm p-4 sm:p-5"
          title={winner ? `${winner.username} wins!` : 'Game finished'}
          image={
            <figure
              className={`splash-avatar-crown relative rounded-full w-24 h-24 mx-auto my-1 p-3 flex items-center justify-center ${avatar?.color ?? 'bg-surface-muted'}`}
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
              className="grid gap-sm text-left"
            >
              <section className="rounded-lg bg-surface-muted p-3">
                <h3 className="font-heading-2 mb-2 text-center">Final standings</h3>
                <ol className="grid gap-2xs">
                  {standings.map((player, index) => (
                    <li
                      key={player.id}
                      className="flex justify-between gap-sm border-b border-border pb-2 last:border-0 last:pb-0"
                    >
                      <span className="truncate">
                        {index + 1}. {player.username}
                      </span>
                      <span className="shrink-0 text-accent">
                        {formatScore(player.totalScore ?? 0)}
                      </span>
                    </li>
                  ))}
                </ol>
              </section>
              <section className="rounded-lg bg-surface-muted p-3">
                <h3 className="font-heading-2 mb-2 text-center">Game recap</h3>
                <dl className="grid grid-cols-2 gap-xs text-sm">
                  <div>
                    <dt className="text-text">Winning margin</dt>
                    <dd className="font-body-1 text-accent">
                      {formatScore(Math.max(0, winnerScore - runnerUpScore))}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-text">Turns played</dt>
                    <dd className="font-body-1 text-accent">{turns.length}</dd>
                  </div>
                  <div>
                    <dt className="text-text">Biggest turn</dt>
                    <dd className="font-body-1 text-accent">
                      {biggestTurn
                        ? `${formatScore(biggestTurn.score)} by ${
                            biggestTurnPlayer?.username ?? 'Unknown'
                          }`
                        : '0'}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-text">Average turn</dt>
                    <dd className="font-body-1 text-accent">{formatScore(averageTurn)}</dd>
                  </div>
                  <div>
                    <dt className="text-text">Farkles</dt>
                    <dd className="font-body-1 text-accent">{farkles}</dd>
                  </div>
                </dl>
              </section>
            </div>
          ) : null}
          <Button
            onClick={onResetGame}
            className="justify-center"
            size="small"
          >
            Another game?
          </Button>
          <Button
            onClick={onResetPlayers}
            className="justify-center"
            size="small"
          >
            New players
          </Button>
        </Splash>
      </Modal.Body>
    </Modal>
  );
}
