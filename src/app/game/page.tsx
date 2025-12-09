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
          <div className="h-full">
            <h2 className="font-heading mb-2">Players</h2>

            {state.players.length > 0 ? (
              <div className="my-6 overflow-auto">
                <PlayerList players={state.players} />
              </div>
            ) : null}

            {state.players.length === 0 ? (
              <p className="font-body">
                You need at least two players to play!
              </p>
            ) : (
              <Button onClick={onStartGame} className="w-full justify-center">
                Start game
              </Button>
            )}
          </div>
        </GameShell.Sidebar>
        <GameShell.Body>
          <div className="max-w-[400px] m-auto flex h-full">
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
          <h2 className="font-heading mb-2">Players</h2>

          <div className="my-6 overflow-auto">
            <PlayerList
              players={summary.players}
              activePlayerId={state.players[state.currentPlayerIndex ?? 0].id}
            />
          </div>
        </div>
      </GameShell.Sidebar>
      <GameShell.Body>
        {/* <ManualTurn state={state} dispatch={dispatch} /> */}
        <DiceTurnPanel state={state} dispatch={dispatch} />
      </GameShell.Body>
    </GameShell>
  );
}
