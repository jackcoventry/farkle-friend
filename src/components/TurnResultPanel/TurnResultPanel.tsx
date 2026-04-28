import Button from "@/components/Button/Button";
import type { Player, TurnResult } from "@/domain/game/gameTypes";
import { formatScore } from "@/utils/formatScore";

type TurnResultPanelProps = {
  currentPlayer: Player;
  nextPlayer?: Player | null;
  onAdvanceTurn: () => void;
  result: TurnResult;
};

export function TurnResultPanel({
  currentPlayer,
  nextPlayer,
  onAdvanceTurn,
  result,
}: Readonly<TurnResultPanelProps>) {
  const actionText = result.isGameWinner ? "Show winner" : "Next player";

  return (
    <section className="m-auto flex w-full max-w-[560px] flex-col gap-5 rounded-lg bg-white p-6 text-center shadow-lg">
      <div>
        <p className="font-sub-heading text-red-600">Turn complete</p>
        <h2 className="font-heading">{currentPlayer.username}</h2>
      </div>
      <dl className="grid gap-3 text-left sm:grid-cols-3">
        <div className="rounded-lg bg-gray-100 p-4">
          <dt className="font-body-1 text-gray-700">Turn score</dt>
          <dd className="font-heading-2 text-red-600">
            {formatScore(result.score)}
          </dd>
        </div>
        <div className="rounded-lg bg-gray-100 p-4">
          <dt className="font-body-1 text-gray-700">Previous total</dt>
          <dd className="font-heading-2">
            {formatScore(result.previousTotal)}
          </dd>
        </div>
        <div className="rounded-lg bg-gray-100 p-4">
          <dt className="font-body-1 text-gray-700">New total</dt>
          <dd className="font-heading-2">{formatScore(result.newTotal)}</dd>
        </div>
      </dl>
      <p className="font-sub-heading">
        {result.isGameWinner
          ? `${currentPlayer.username} reached the target score.`
          : `Next up: ${nextPlayer?.username ?? "next player"}.`}
      </p>
      <Button onClick={onAdvanceTurn} className="justify-center" size="large">
        {actionText}
      </Button>
    </section>
  );
}
