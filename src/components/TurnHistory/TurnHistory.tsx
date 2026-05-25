'use client';

import { useI18n } from '@/i18n/I18nProvider';
import { formatScore } from '@/utils/formatScore';
import { AvatarId, avatarSet } from '@/domain/game/avatars';
import {
  getBiggestTurn,
  getLastFarkle,
  getPlayerNameMap,
  getRecentTurns,
} from '@/domain/game/gameSelectors';
import type { Player, Turn } from '@/domain/game/gameTypes';
import { AvatarImage } from '@/components/AvatarImage/AvatarImage';

type TurnHistoryProps = {
  leadingPlayerId?: string | null;
  players: Player[];
  targetScore: number;
  turns: Turn[];
};

export function TurnHistory({
  leadingPlayerId,
  players,
  targetScore,
  turns,
}: Readonly<TurnHistoryProps>) {
  const { t } = useI18n();
  const recentTurns = getRecentTurns(turns);
  const playerNames = getPlayerNameMap(players);
  const playersById = new Map(players.map((player) => [player.id, player]));
  const leader = players.find((player) => player.id === leadingPlayerId);
  const biggestTurn = getBiggestTurn(turns);
  const lastFarkle = getLastFarkle(turns);

  if (recentTurns.length === 0 && !leader) return null;

  return (
    <section
      className="surface-callout | bg-surface-muted border-border text-text p-md rounded-xl border"
      aria-live="polite"
    >
      {leader ? (
        <dl className="gap-xs border-border mb-sm pb-sm grid border-b">
          <div className="gap-sm flex justify-between">
            <dt>{t('history.leader')}</dt>
            <dd className="text-accent truncate text-right">{leader.username}</dd>
          </div>
          <div className="gap-sm flex justify-between">
            <dt>{t('history.needs')}</dt>
            <dd className="text-accent text-right">
              {formatScore(Math.max(0, targetScore - (leader.totalScore ?? 0)))}
            </dd>
          </div>
          {biggestTurn ? (
            <div className="gap-sm flex justify-between">
              <dt>{t('history.biggestTurn')}</dt>
              <dd className="text-accent truncate text-right">
                {playerNames.get(biggestTurn.playerId) ?? t('common.player')} +
                {formatScore(biggestTurn.score)}
              </dd>
            </div>
          ) : null}
          {lastFarkle ? (
            <div className="gap-sm flex justify-between">
              <dt>{t('history.lastFarkle')}</dt>
              <dd className="text-accent truncate text-right">
                {playerNames.get(lastFarkle.playerId) ?? t('common.player')}
              </dd>
            </div>
          ) : null}
        </dl>
      ) : null}

      {recentTurns.length > 0 ? (
        <>
          <p className="font-heading-3 mb-xs">{t('history.recentEvents')}</p>
          <ol className="gap-xs flex flex-col">
            {recentTurns.map((turn) => {
              const player = playersById.get(turn.playerId);
              const avatar = avatarSet[player?.avatar as AvatarId];
              const isFarkle = turn.score === 0;

              return (
                <li
                  key={turn.id}
                  className={`gap-sm p-xs flex items-center justify-between rounded-lg ${
                    isFarkle ? 'bg-danger-surface text-danger' : 'bg-surface-muted'
                  }`}
                >
                  <span className="gap-xs flex min-w-0 items-center">
                    {avatar ? (
                      <span
                        className={`p-2xs flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${avatar.color}`}
                      >
                        <AvatarImage
                          avatar={avatar}
                          alt=""
                          className="h-auto w-full"
                        />
                      </span>
                    ) : null}
                    <span className="truncate">
                      {playerNames.get(turn.playerId) ?? t('common.player')}{' '}
                      {isFarkle ? t('history.farkled') : t('history.banked')}
                    </span>
                  </span>
                  <span
                    className={`px-xs py-2xs shrink-0 rounded-full text-sm ${
                      isFarkle ? 'bg-danger text-danger-contrast' : 'text-accent'
                    }`}
                  >
                    {isFarkle ? t('common.farkle') : `+${formatScore(turn.score)}`}
                  </span>
                </li>
              );
            })}
          </ol>
        </>
      ) : null}
    </section>
  );
}
