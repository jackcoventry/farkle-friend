"use client";

import { GameAction } from "@/domain/game/gameReducer";
import { GameState } from "@/domain/game/gameTypes";
import AddScoreForm, {
  AddScoreSchemaType,
} from "@/components/Form/AddScore/AddScore";

type ManualTurnProps = {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
};

export function ManualTurn({ state, dispatch }: Readonly<ManualTurnProps>) {
  const currentIndex = state.currentPlayerIndex ?? 0;
  const currentPlayer = state.players[currentIndex] ?? null;

  const onAddScoreFormSubmit = (data: AddScoreSchemaType) => {
    dispatch({
      type: "RECORD_TURN",
      playerId: currentPlayer.id,
      score: data.value,
    });
  };

  return (
    <div>
      <h1>Enter score for {currentPlayer.username}</h1>
      <p>Turn #{state.turns.length + 1}</p>
      <AddScoreForm onSubmit={onAddScoreFormSubmit} />
    </div>
  );
}
