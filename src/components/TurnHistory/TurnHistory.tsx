import type { Player, Turn } from "@/domain/game/gameTypes";
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
  const leader = players.find((player) => player.id === leadingPlayerId);
  const biggestTurn = getBiggestTurn(turns);
  const lastFarkle = getLastFarkle(turns);

  if (recentTurns.length === 0 && !leader) return null;

  return (
    <section className="rounded-lg bg-white/80 p-3" aria-live="polite">
      <h3 className="font-heading-2 mb-2">Table pulse</h3>

      {leader ? (
        <dl className="mb-3 grid gap-2 border-b border-sun-200 pb-3">
          <div className="flex justify-between gap-3">
            <dt>Leader</dt>
            <dd className="truncate text-right text-red-700">
              {leader.username}
            </dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt>Needs</dt>
            <dd className="text-right text-red-700">
              {formatScore(Math.max(0, targetScore - (leader.totalScore ?? 0)))}
            </dd>
          </div>
          {biggestTurn ? (
            <div className="flex justify-between gap-3">
              <dt>Biggest turn</dt>
              <dd className="truncate text-right text-red-700">
                {playerNames.get(biggestTurn.playerId) ?? "Player"} +{formatScore(biggestTurn.score)}
              </dd>
            </div>
          ) : null}
          {lastFarkle ? (
            <div className="flex justify-between gap-3">
              <dt>Last farkle</dt>
              <dd className="truncate text-right text-red-700">
                {playerNames.get(lastFarkle.playerId) ?? "Player"}
              </dd>
            </div>
          ) : null}
        </dl>
      ) : null}

      {recentTurns.length > 0 ? (
        <>
          <h4 className="font-heading-2 mb-2">Recent turns</h4>
          <ol className="flex flex-col gap-2">
            {recentTurns.map((turn) => (
              <li key={turn.id} className="flex justify-between gap-3">
                <span className="truncate">
                  {playerNames.get(turn.playerId) ?? "Player"}
                </span>
                <span className="shrink-0 text-red-700">
                  {turn.score === 0 ? "Farkle" : `+${formatScore(turn.score)}`}
                </span>
              </li>
            ))}
          </ol>
        </>
      ) : null}
    </section>
  );
}
