'use client';

import { useI18n } from '@/i18n/I18nProvider';
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
  const { t } = useI18n();
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
      ariaLabel={t('game.finishedLabel')}
      variant="splash"
    >
      <Modal.Body>
        <Splash
          className="gap-sm p-md sm:p-lg"
          title={winner ? t('game.winnerTitle', { player: winner.username }) : t('game.finished')}
          image={
            <figure
              className={`splash-avatar-crown my-2xs p-sm relative mx-auto flex h-24 w-24 items-center justify-center rounded-full ${avatar?.swatchClassName ?? 'avatar-swatch--fallback'}`}
            >
              {avatar ? (
                <AvatarImage
                  avatar={avatar}
                  alt={t('player.avatarAlt', { avatar: avatar.name })}
                  className="h-full w-full"
                />
              ) : null}
            </figure>
          }
        >
          {standings.length > 0 ? (
            <div
              aria-label={t('game.recapLabel')}
              className="gap-sm grid text-left"
            >
              <section className="bg-surface-muted p-sm rounded-lg">
                <h3 className="font-heading-2 mb-xs text-center">{t('game.finalStandings')}</h3>
                <ol className="gap-2xs grid">
                  {standings.map((player, index) => (
                    <li
                      key={player.id}
                      className="gap-sm border-border pb-xs flex justify-between border-b last:border-0 last:pb-0"
                    >
                      <span className="truncate">
                        {index + 1}. {player.username}
                      </span>
                      <span className="text-accent shrink-0">
                        {formatScore(player.totalScore ?? 0)}
                      </span>
                    </li>
                  ))}
                </ol>
              </section>
              <section className="bg-surface-muted p-sm rounded-lg">
                <h3 className="font-heading-2 mb-xs text-center">{t('game.gameRecap')}</h3>
                <dl className="gap-xs grid grid-cols-2 text-sm">
                  <div>
                    <dt className="text-text">{t('game.winningMargin')}</dt>
                    <dd className="font-body-1 text-accent">
                      {formatScore(Math.max(0, winnerScore - runnerUpScore))}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-text">{t('game.turnsPlayed')}</dt>
                    <dd className="font-body-1 text-accent">{turns.length}</dd>
                  </div>
                  <div>
                    <dt className="text-text">{t('game.biggestTurn')}</dt>
                    <dd className="font-body-1 text-accent">
                      {biggestTurn
                        ? t('game.biggestTurnBy', {
                            score: formatScore(biggestTurn.score),
                            player: biggestTurnPlayer?.username ?? t('common.unknown'),
                          })
                        : '0'}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-text">{t('game.averageTurn')}</dt>
                    <dd className="font-body-1 text-accent">{formatScore(averageTurn)}</dd>
                  </div>
                  <div>
                    <dt className="text-text">{t('game.farkles')}</dt>
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
            {t('actions.playAgain')}
          </Button>
          <Button
            onClick={onResetPlayers}
            className="justify-center"
            size="small"
          >
            {t('actions.newPlayers')}
          </Button>
        </Splash>
      </Modal.Body>
    </Modal>
  );
}
