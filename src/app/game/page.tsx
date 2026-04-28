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
import type {
  Player,
  PlayerId,
  Turn,
  TurnResult,
} from "@/domain/game/gameTypes";
import Image from "next/image";
import { useEffect, useState } from "react";

type ConfirmAction = "quit" | "restart" | null;

export default function GamePage() {
  const { state, dispatch } = useGame();
  const [confirmAction, setConfirmAction] = useState<ConfirmAction>(null);

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

  const onConfirmGameAction = () => {
    if (confirmAction === "restart") {
      onResetGame();
    }
    if (confirmAction === "quit") {
      dispatch({ type: "RESET_GAME" });
    }
    setConfirmAction(null);
  };

  const onAdvanceTurn = () => {
    dispatch({ type: "ADVANCE_TURN" });
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
    <>
      <GameShell>
        <GameShell.Sidebar>
          <div className="flex flex-col h-full">
            <h2 className="font-heading mb-2">Players</h2>
            <p className="font-body-1">
              First to {formatScore(state.settings.targetScore)} points
            </p>

            <div className="my-6 overflow-auto">
              <PlayerList
                players={summary.players}
                activePlayerId={state.players[state.currentPlayerIndex ?? 0].id}
                leadingPlayerId={summary.leadingPlayerId}
                targetScore={state.settings.targetScore}
              />
            </div>

            <TurnHistory players={summary.players} turns={state.turns} />

            <div className="mt-4 flex flex-col gap-2">
              <Button
                onClick={() => setConfirmAction("restart")}
                className="justify-center"
                size="small"
              >
                Restart game
              </Button>
              <Button
                onClick={() => setConfirmAction("quit")}
                className="justify-center"
                size="small"
              >
                Quit to setup
              </Button>
            </div>

            <Footer />
          </div>
        </GameShell.Sidebar>
        <GameShell.Body>
          {currentPlayer && avatar && !state.pendingTurnResult ? (
            <PlayerSwitchSplash
              key={`${currentPlayer.id}-${state.currentPlayerIndex}`}
              currentPlayer={currentPlayer}
              avatar={avatar}
            />
          ) : null}

          {currentPlayer ? (
            state.pendingTurnResult ? (
              <TurnResultPanel
                currentPlayer={currentPlayer}
                nextPlayer={summary.players.find(
                  (player) => player.id === state.pendingTurnResult?.nextPlayerId
                )}
                result={state.pendingTurnResult}
                onAdvanceTurn={onAdvanceTurn}
              />
            ) : state.settings.mode === "dice" ? (
              <DiceTurnPanel state={state} dispatch={dispatch} />
            ) : (
              <ManualTurn state={state} dispatch={dispatch} />
            )
          ) : (
            <p>No active player</p>
          )}
        </GameShell.Body>
      </GameShell>

      <ConfirmGameActionModal
        action={confirmAction}
        onClose={() => setConfirmAction(null)}
        onConfirm={onConfirmGameAction}
      />
    </>
  );
}

function formatScore(score: number): string {
  return new Intl.NumberFormat("en-GB").format(score);
}

type TurnResultPanelProps = {
  currentPlayer: Player;
  nextPlayer?: Player;
  onAdvanceTurn: () => void;
  result: TurnResult;
};

function TurnResultPanel({
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

type TurnHistoryProps = {
  players: Player[];
  turns: Turn[];
};

function TurnHistory({ players, turns }: Readonly<TurnHistoryProps>) {
  const recentTurns = turns.slice(-5).reverse();
  const playerNames = new Map<PlayerId, string>(
    players.map((player) => [player.id, player.username])
  );

  if (recentTurns.length === 0) return null;

  return (
    <section className="rounded-lg bg-white/80 p-3">
      <h3 className="font-heading-2 mb-2">Recent turns</h3>
      <ol className="flex flex-col gap-2">
        {recentTurns.map((turn) => (
          <li key={turn.id} className="flex justify-between gap-3">
            <span className="truncate">
              {playerNames.get(turn.playerId) ?? "Player"}
            </span>
            <span className="shrink-0 text-red-600">
              {turn.score === 0 ? "Farkle" : `+${formatScore(turn.score)}`}
            </span>
          </li>
        ))}
      </ol>
    </section>
  );
}

type ConfirmGameActionModalProps = {
  action: ConfirmAction;
  onClose: () => void;
  onConfirm: () => void;
};

function ConfirmGameActionModal({
  action,
  onClose,
  onConfirm,
}: Readonly<ConfirmGameActionModalProps>) {
  if (!action) return null;

  const isRestart = action === "restart";

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      ariaLabel={isRestart ? "Restart game" : "Quit game"}
      variant="modal"
      theme="warning"
    >
      <Modal.Body className="rounded-lg bg-white p-6 shadow-lg">
        <div className="flex max-w-[460px] flex-col gap-4 text-center">
          <h2 className="font-heading">
            {isRestart ? "Restart this game?" : "Quit this game?"}
          </h2>
          <p>
            Current scores and turn progress will be lost. Players and settings
            will be kept.
          </p>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button onClick={onClose} className="justify-center sm:flex-1">
              Keep playing
            </Button>
            <Button onClick={onConfirm} className="justify-center sm:flex-1">
              {isRestart ? "Restart game" : "Quit to setup"}
            </Button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
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
