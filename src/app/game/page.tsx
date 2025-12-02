"use client";

import AddPlayerForm, {
  AddPlayerFormSchemaType,
} from "@/components/Form/AddPlayer/AddPlayer";
import { useGameState } from "@/hooks/useGameState";

export default function GamePage() {
  const { state, dispatch } = useGameState();

  const onSubmit = (data: AddPlayerFormSchemaType) => {
    dispatch({ type: "ADD_PLAYER", username: data.username });
  };

  return (
    <div>
      <h1 className="p-10 font-body lg:font-heading text-sun-800 bg-sun-100">
        Current game:
      </h1>

      {state.players.length > 0 ? (
        <ul>
          {state.players.map((player) => (
            <li key={player.id}>{player.username}</li>
          ))}
        </ul>
      ) : null}
      <div></div>

      <div className="grid grid-cols-3 p-8">
        <div className="col-start-2">
          <AddPlayerForm onSubmit={onSubmit} />
        </div>
      </div>
    </div>
  );
}
