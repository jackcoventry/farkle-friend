"use client";

import Button from "@/components/Button/Button";
import AddPlayerForm, {
  AddPlayerFormSchemaType,
} from "@/components/Form/AddPlayer/AddPlayer";
import { canStartGame, getGameSummary, resetGame } from "@/domain/game/logic";
import { useGameState } from "@/hooks/useGameState";

export default function GamePage() {
  const { state, dispatch } = useGameState();

  const onAddPlayerFormSubmit = (data: AddPlayerFormSchemaType) => {
    dispatch({ type: "ADD_PLAYER", username: data.username });
  };

  const onStartGame = () => {
    dispatch({ type: "START_GAME" });
  };

  const onResetGame = () => {
    dispatch({ type: "RESET_GAME" });
    dispatch({ type: "START_GAME" });
  };

  const readyToStart = Boolean(canStartGame(state));
  const currentPlayer = state.players[state.currentPlayerIndex ?? 0];
  const summary = getGameSummary(state);

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

  if (state.phase === "FINISHED") {
    const winner =
      summary.winnerId == null
        ? null
        : summary.players.find((p) => p.playerId === summary.winnerId);

    return (
      <div>
        <div>
          <h2>GAME COMPLETE!</h2>
          <h1>{winner?.username} wins</h1>
          <h3> Total Score {winner?.totalScore}</h3>
          <Button onClick={onResetGame}>Another game with same players?</Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1>FARKLE</h1>
      <h2>Players</h2>

      {summary.players.length > 0 ? (
        <ul>
          {summary.players.map((player) => (
            <li key={player.playerId}>
              {player.username} - {player.playerId} ({player.totalScore})
            </li>
          ))}
        </ul>
      ) : null}

      <h2>Turns</h2>
      <h3>{currentPlayer?.username}'s turn</h3>
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

      <Button
        onClick={() =>
          dispatch({
            type: "RECORD_TURN",
            playerId: currentPlayer?.id,
            score: Math.floor(Math.random() * (500 - 100 + 1) + 100),
          })
        }
      >
        Add turn
      </Button>
    </div>
  );
}
