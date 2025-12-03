"use client";

import Button from "@/components/Button/Button";
import AddPlayerForm, {
  AddPlayerFormSchemaType,
} from "@/components/Form/AddPlayer/AddPlayer";
import { canStartGame } from "@/domain/game/logic";
import { useGameState } from "@/hooks/useGameState";

export default function GamePage() {
  const { state, dispatch } = useGameState();

  const onAddPlayerFormSubmit = (data: AddPlayerFormSchemaType) => {
    dispatch({ type: "ADD_PLAYER", username: data.username });
  };

  const onStartGame = () => {
    dispatch({ type: "START_GAME" });
  };

  const readyToStart = Boolean(canStartGame(state));

  if (state.phase === "LOBBY") {
    return (
      <div>
        <div>
          <h2>Players</h2>

          {state.players.length > 0 ? (
            <ul>
              {state.players.map((player) => (
                <li key={player.id}>{player.username}</li>
              ))}
            </ul>
          ) : (
            <p>You need at least two players!</p>
          )}
          <Button onClick={onStartGame} disabled={!readyToStart}>
            Start game
          </Button>
        </div>

        <div className="grid grid-cols-3 p-8">
          <div className="col-start-2">
            <AddPlayerForm onSubmit={onAddPlayerFormSubmit} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1>FARKLE</h1>
      <h2>Turns</h2>
      {state?.turns?.length > 0 ? (
        <ul>
          {state?.turns?.map((turn) => (
            <li key={turn.id}>
              {turn.createdAt} - {turn.playerId} - {turn.score}
            </li>
          ))}
        </ul>
      ) : (
        <p>No turns yet</p>
      )}
    </div>
  );
}
