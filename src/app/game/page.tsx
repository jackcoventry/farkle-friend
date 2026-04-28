"use client";

import Button from "@/components/Button/Button";
import { DiceTurnPanel } from "@/components/DiceTurnPanel/DiceTurnPanel";
import Footer from "@/components/Footer/Footer";
import AddPlayerForm, {
  AddPlayerFormSchemaType,
  AvatarId,
  avatarSet,
} from "@/components/Form/AddPlayer/AddPlayer";
import GameShell from "@/components/GameShell/GameShell";
import { ManualTurn } from "@/components/ManualTurn/ManualTurn";
import Modal from "@/components/Modal/Modal";
import Splash from "@/components/Modal/Splash";
import PlayerList from "@/components/PlayerList/PlayerList";
import { getGameSummary } from "@/domain/game/gameLogic";
import { useTurnController } from "@/domain/game/useTurnController";
import { useGame } from "@/domain/game/GameProvider";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function GamePage() {
  const { state, dispatch } = useGame();

  const onAddPlayerFormSubmit = (data: AddPlayerFormSchemaType) => {
    dispatch({
      type: "ADD_PLAYER",
      username: data.username,
      avatar: data.avatar,
    });
  };

  const onResetGame = () => {
    dispatch({ type: "RESET_GAME" });
    dispatch({ type: "START_GAME" });
  };

  const onResetPlayers = () => {
    dispatch({ type: "RESET_GAME" });
  };

  const onRemovePlayer = (playerId: string) => {
    dispatch({ type: "REMOVE_PLAYER", playerId });
  };

  const summary = getGameSummary(state);
  const { currentPlayer } = useTurnController(state, dispatch);
  const avatar = avatarSet[currentPlayer?.avatar as AvatarId];

  if (state.phase === "LOBBY") {
    return (
      <GameShell>
        <GameShell.Sidebar>
          <div className="flex flex-col h-full">
            <h2 className="font-heading mb-2">Players</h2>

            {state.players.length > 0 ? (
              <div className="my-6 overflow-auto">
                <PlayerList
                  players={state.players}
                  onRemovePlayer={onRemovePlayer}
                />
              </div>
            ) : null}
            <Footer />
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

    const avatar = avatarSet[winner?.avatar as AvatarId];

    return (
      <Modal isOpen={true} ariaLabel="Game finished" variant="splash">
        <Modal.Body>
          <Splash
            title={winner ? `${winner.username} wins!` : "Game finished"}
            image={
              <figure
                className={`splash-avatar-crown relative rounded-full w-[200px] h-[200px] mx-auto my-4 p-6 flex items-center justify-center ${avatar?.color ?? "bg-gray-500"}`}
              >
                {avatar ? (
                  <Image
                    src={avatar.image}
                    alt={`${winner?.username}'s ${avatar.name} avatar`}
                    width={200}
                    height={200}
                    className="splash-avatar"
                    style={{ height: 200, width: 200 }}
                  />
                ) : null}
              </figure>
            }
          >
            <Button onClick={onResetGame} className="justify-center">
              Another game?
            </Button>
            <Button onClick={onResetPlayers} className="justify-center">
              New players
            </Button>
          </Splash>
        </Modal.Body>
      </Modal>
    );
  }

  return (
    <GameShell>
      <GameShell.Sidebar>
        <div className="flex flex-col h-full">
          <h2 className="font-heading mb-2">Players</h2>
          <p>{state.settings.targetScore || "non"}</p>

          <div className="my-6 overflow-auto">
            <PlayerList
              players={summary.players}
              activePlayerId={state.players[state.currentPlayerIndex ?? 0].id}
            />
          </div>

          <Footer />
        </div>
      </GameShell.Sidebar>
      <GameShell.Body>
        {currentPlayer && avatar ? (
          <PlayerSwitchSplash
            key={`${currentPlayer.id}-${state.currentPlayerIndex}`}
            currentPlayer={currentPlayer}
            avatar={avatar}
          />
        ) : null}

        {currentPlayer ? (
          state.settings.mode === "dice" ? (
            <DiceTurnPanel state={state} dispatch={dispatch} />
          ) : (
            <ManualTurn state={state} dispatch={dispatch} />
          )
        ) : (
          <p>No active player</p>
        )}
      </GameShell.Body>
    </GameShell>
  );
}

type PlayerSwitchSplashProps = {
  avatar: (typeof avatarSet)[AvatarId];
  currentPlayer: NonNullable<ReturnType<typeof useTurnController>["currentPlayer"]>;
};

function PlayerSwitchSplash({
  avatar,
  currentPlayer,
}: Readonly<PlayerSwitchSplashProps>) {
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setIsOpen(false);
    }, 2000);

    return () => window.clearTimeout(timeout);
  }, []);

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={true}
      ariaLabel={`${currentPlayer.username}'s turn`}
      variant="splash"
    >
      <Modal.Body>
        <Splash
          title={`${currentPlayer.username}'s turn`}
          image={
            <figure
              className={`rounded-full overflow-hidden w-[200px] h-[200px] mx-auto my-4 p-6 flex items-center justify-center ${avatar.color}`}
            >
              <Image
                src={avatar.image}
                alt={`${currentPlayer.username}'s ${avatar.name} avatar`}
                width={200}
                height={200}
                className="splash-avatar"
                style={{ height: 200, width: 200 }}
              />
            </figure>
          }
          subtitle="Current score:"
          text={currentPlayer?.totalScore?.toString() || "0"}
        />
      </Modal.Body>
    </Modal>
  );
}
