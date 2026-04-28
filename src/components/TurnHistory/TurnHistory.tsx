import type { Player, Turn } from "@/domain/game/gameTypes";
import { getPlayerNameMap, getRecentTurns } from "@/domain/game/gameSelectors";
import { formatScore } from "@/utils/formatScore";

type TurnHistoryProps = {
  players: Player[];
  turns: Turn[];
};

export function TurnHistory({ players, turns }: Readonly<TurnHistoryProps>) {
  const recentTurns = getRecentTurns(turns);
  const playerNames = getPlayerNameMap(players);

  if (recentTurns.length === 0) return null;

  return (
    <section className="rounded-lg bg-white/80 p-3">
      <h3 className="font-heading-2 mb-2">Recent turns</h3>
      <ol className="flex flex-col gap-2">
        {recentTurns.map((turn) => (
          <li key={turn.id} className="flex justify-between gap-3">
            <span className="truncate">
              {playerNames.get(turn.playerId) ?? "Player"}
            </span>
            <span className="shrink-0 text-red-600">
              {turn.score === 0 ? "Farkle" : `+${formatScore(turn.score)}`}
            </span>
          </li>
        ))}
      </ol>
    </section>
  );
}
