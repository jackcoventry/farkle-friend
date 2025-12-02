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

  return (
    <div>
      <h1 className="p-10 font-body lg:font-heading text-sun-800 bg-sun-100">
        Current game phase: {state.phase}
      </h1>

      <div>
        {readyToStart ? (
          <Button onClick={onStartGame}>Start game</Button>
        ) : (
          <p>Need more players</p>
        )}
      </div>

      {state.players.length > 0 ? (
        <>
          <h2>Players</h2>
          <ul>
            {state.players.map((player) => (
              <li key={player.id}>{player.username}</li>
            ))}
          </ul>
        </>
      ) : null}
      <div></div>

      <div className="grid grid-cols-3 p-8">
        <div className="col-start-2">
          <AddPlayerForm onSubmit={onAddPlayerFormSubmit} />
        </div>
      </div>
    </div>
  );
}
