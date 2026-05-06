import type { Player, Turn } from "@/domain/game/gameTypes";
import { AvatarImage } from "@/components/AvatarImage/AvatarImage";
import { AvatarId, avatarSet } from "@/domain/game/avatars";
import {
  getBiggestTurn,
  getLastFarkle,
  getPlayerNameMap,
  getRecentTurns,
} from "@/domain/game/gameSelectors";
import { formatScore } from "@/utils/formatScore";

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
  const recentTurns = getRecentTurns(turns);
  const playerNames = getPlayerNameMap(players);
  const playersById = new Map(players.map((player) => [player.id, player]));
  const leader = players.find((player) => player.id === leadingPlayerId);
  const biggestTurn = getBiggestTurn(turns);
  const lastFarkle = getLastFarkle(turns);

  if (recentTurns.length === 0 && !leader) return null;

  return (
    <section
      className="surface-callout"
      aria-live="polite"
    >
      {leader ? (
        <dl className="mb-3 grid gap-2 border-b border-border pb-3">
          <div className="flex justify-between gap-3">
            <dt>Leader</dt>
            <dd className="truncate text-right score-chip">
              {leader.username}
            </dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt>Needs</dt>
            <dd className="text-right score-chip">
              {formatScore(Math.max(0, targetScore - (leader.totalScore ?? 0)))}
            </dd>
          </div>
          {biggestTurn ? (
            <div className="flex justify-between gap-3">
              <dt>Biggest turn</dt>
              <dd className="truncate text-right score-chip">
                {playerNames.get(biggestTurn.playerId) ?? "Player"} +
                {formatScore(biggestTurn.score)}
              </dd>
            </div>
          ) : null}
          {lastFarkle ? (
            <div className="flex justify-between gap-3">
              <dt>Last farkle</dt>
              <dd className="truncate text-right score-chip">
                {playerNames.get(lastFarkle.playerId) ?? "Player"}
              </dd>
            </div>
          ) : null}
        </dl>
      ) : null}

      {recentTurns.length > 0 ? (
        <>
          <p className="font-heading-3 mb-2">Recent events</p>
          <ol className="flex flex-col gap-2">
            {recentTurns.map((turn) => {
              const player = playersById.get(turn.playerId);
              const avatar = avatarSet[player?.avatar as AvatarId];
              const isFarkle = turn.score === 0;

              return (
                <li
                  key={turn.id}
                  className={`flex items-center justify-between gap-3 rounded-lg p-2 ${
                    isFarkle
                      ? "bg-danger-surface text-danger"
                      : "bg-surface-muted"
                  }`}
                >
                  <span className="flex min-w-0 items-center gap-2">
                    {avatar ? (
                      <span
                        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full p-1 ${avatar.color}`}
                      >
                        <AvatarImage
                          avatar={avatar}
                          alt=""
                          className="h-auto w-full"
                        />
                      </span>
                    ) : null}
                    <span className="truncate">
                      {playerNames.get(turn.playerId) ?? "Player"}{" "}
                      {isFarkle ? "farkled" : "banked"}
                    </span>
                  </span>
                  <span
                    className={`shrink-0 rounded-full px-2 py-1 text-sm ${
                      isFarkle ? "bg-danger text-danger-contrast" : "score-chip"
                    }`}
                  >
                    {isFarkle ? "Farkle" : `+${formatScore(turn.score)}`}
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
