"use client";

import Button from "@/components/Button/Button";
import { DiceTurnPanel } from "@/components/DiceTurnPanel/DiceTurnPanel";
import AddPlayerForm, {
  AddPlayerFormSchemaType,
} from "@/components/Form/AddPlayer/AddPlayer";
import GameShell from "@/components/GameShell/GameShell";
import { ManualTurn } from "@/components/ManualTurn/ManualTurn";
import PlayerList from "@/components/PlayerList/PlayerList";
import { canStartGame, getGameSummary } from "@/domain/game/gameLogic";
import { useGameState } from "@/hooks/useGameState";

export default function GamePage() {
  const { state, dispatch } = useGameState();

  const onAddPlayerFormSubmit = (data: AddPlayerFormSchemaType) => {
    dispatch({
      type: "ADD_PLAYER",
      username: data.username,
      avatar: data.avatar,
    });
  };

  const onStartGame = () => {
    dispatch({ type: "START_GAME" });
  };

  const onResetGame = () => {
    dispatch({ type: "RESET_GAME" });
    dispatch({ type: "START_GAME" });
  };

  const readyToStart = Boolean(canStartGame(state));
  const summary = getGameSummary(state);

  if (state.phase === "LOBBY") {
    return (
      <GameShell>
        <GameShell.Sidebar>
          <div>
            <h2>Players</h2>

            <PlayerList players={state.players} />

            {state.players.length === 0 ? (
              <p>You need at least two players!</p>
            ) : null}
            <Button onClick={onStartGame} disabled={!readyToStart}>
              Start game
            </Button>
          </div>
        </GameShell.Sidebar>
        <GameShell.Body>
          <div>
            <AddPlayerForm onSubmit={onAddPlayerFormSubmit} />
          </div>
        </GameShell.Body>
      </GameShell>
    );
  }

  if (state.phase === "FINISHED") {
    const winner =
      summary.winnerId == null
        ? null
        : summary.players.find((p) => p.id === summary.winnerId);

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
    <GameShell>
      <GameShell.Sidebar>
        <div>
          <h2>Players</h2>

          <PlayerList
            players={summary.players}
            activePlayerId={state.players[state.currentPlayerIndex ?? 0].id}
          />
        </div>
      </GameShell.Sidebar>
      <GameShell.Body>
        <div>
          {/* <ManualTurn state={state} dispatch={dispatch} /> */}
          <DiceTurnPanel state={state} dispatch={dispatch} />
        </div>
      </GameShell.Body>
    </GameShell>
  );
}
