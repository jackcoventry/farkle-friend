"use client";

import type { GameState } from "@/domain/game/gameTypes";
import type { GameAction } from "@/domain/game/gameReducer";
import { useTurnController } from "@/domain/game/useTurnController";
import AddScoreForm, {
  AddScoreSchemaType,
} from "@/components/Form/AddScore/AddScore";

type ManualTurnProps = {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
};

export function ManualTurn({ state, dispatch }: Readonly<ManualTurnProps>) {
  const { currentPlayer, isInProgress, commitTurnScore } = useTurnController(
    state,
    dispatch
  );

  if (!isInProgress || !currentPlayer) {
    return <p>No active player</p>;
  }

  const onAddScoreFormSubmit = (data: AddScoreSchemaType) => {
    const parsedScore = Number.isFinite(data.value) ? Number(data.value) : 0;

    const canSubmit =
      isInProgress &&
      !!currentPlayer &&
      parsedScore != null &&
      Number.isInteger(parsedScore) &&
      parsedScore >= 0;

    if (!canSubmit) return;

    commitTurnScore(currentPlayer.id, parsedScore);
  };

  const handleFarkle = () => {
    if (!currentPlayer) return;
    commitTurnScore(currentPlayer.id, 0);
  };

  return (
    <div>
      <h1>Enter score for {currentPlayer.username}</h1>
      <p>Turn #{state.turns.length + 1}</p>
      <AddScoreForm onSubmit={onAddScoreFormSubmit} onFarkle={handleFarkle} />
    </div>
  );
}
