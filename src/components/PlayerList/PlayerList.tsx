'use client';

import { useI18n } from '@/i18n/I18nProvider';
import { AvatarId, avatarSet } from '@/domain/game/avatars';
import { Player } from '@/domain/game/gameTypes';
import { AvatarImage } from '@/components/AvatarImage/AvatarImage';
import './PlayerList.css';

type PlayerListProps = {
  activePlayerId?: string;
  leadingPlayerId?: string | null;
  onRemovePlayer?: (playerId: string) => void;
  players: Player[];
  targetScore?: number;
};

export function PlayerList({
  activePlayerId,
  leadingPlayerId,
  onRemovePlayer,
  players = [],
  targetScore,
}: Readonly<PlayerListProps>) {
  const { t } = useI18n();

  return (
    <ul className="player-list | gap-xs flex flex-col">
      {players.map((player) => {
        const isActive = player.id === activePlayerId;
        const isLeader = player.id === leadingPlayerId;
        const totalScore = player.totalScore ?? 0;
        const progress =
          targetScore && targetScore > 0
            ? Math.min(100, Math.round((totalScore / targetScore) * 100))
            : null;
        const classes = `flex gap-sm bg-surface-raised border border-border text-text p-md rounded-2xl ${
          isActive ? 'border-accent bg-surface-muted' : 'hover:bg-surface-muted'
        }`;
        const avatar = avatarSet[player.avatar as AvatarId];

        return (
          <li
            key={player.id}
            aria-current={isActive ? 'step' : undefined}
          >
            <div className={classes}>
              <div
                className={`player-list__avatar | p-xs flex shrink-0 items-center justify-center rounded-full border-2 ring ${avatar.swatchClassName} `}
              >
                <AvatarImage
                  avatar={avatar}
                  alt={t('player.avatarAlt', { avatar: avatar.name })}
                  className="h-auto w-full"
                />
              </div>
              <div className="gap-2xs flex min-w-0 flex-1 flex-col justify-center">
                <div className="gap-xs grid min-w-0">
                  <p
                    className="font-heading-2 truncate"
                    title={player.username}
                  >
                    {player.username}
                  </p>
                  {isActive || (isLeader && totalScore > 0) ? (
                    <div className="gap-2xs flex flex-wrap">
                      {isActive ? (
                        <span className="bg-accent px-xs py-2xs text-accent-contrast rounded-full text-xs">
                          {t('player.current')}
                        </span>
                      ) : null}
                      {isLeader && totalScore > 0 ? (
                        <span className="bg-control px-xs py-2xs text-control-text rounded-full text-xs">
                          {t('player.leader')}
                        </span>
                      ) : null}
                    </div>
                  ) : null}
                </div>
                <span className="text-text-muted block">
                  {t('common.points', { points: totalScore })}
                </span>
                {progress === null ? null : (
                  <div
                    className="bg-surface h-2 overflow-hidden rounded-full"
                    aria-label={t('player.progress', { player: player.username, progress })}
                    role="meter"
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={progress}
                  >
                    <div
                      className="player-list__progress | bg-accent h-full"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                )}
              </div>
              {onRemovePlayer ? (
                <button
                  type="button"
                  aria-label={t('actions.removePlayer', { player: player.username })}
                  className="px-sm py-xs text-text-muted hover:bg-surface focus-visible:outline-accent ml-auto cursor-pointer self-center rounded-lg text-sm focus-visible:outline-2"
                  onClick={() => onRemovePlayer(player.id)}
                >
                  {t('actions.remove')}
                </button>
              ) : null}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
