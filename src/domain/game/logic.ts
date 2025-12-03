import { generateId } from "@/utils/generateId";
import { GameId, GameState, Player, PlayerId, Turn } from "./types";

export function createInitialGameState(): GameState {
  const now = new Date().toISOString();
  const gameId: GameId = "1";

  return {
    id: gameId,
    phase: "LOBBY",
    players: [],
    turns: [],
    currentPlayerIndex: null,
    createdAt: now,
    updatedAt: now,
  };
}

// Helper function to keep the updatedAt up-to-date
function withUpdatedAt<T extends { updatedAt: string }>(state: T): T {
  return { ...state, updatedAt: new Date().toISOString() };
}

// Helper for the add player reducer action
export function addPlayer(state: GameState, username: string): GameState {
  const id = generateId();
  const trimmed = username.trim();
  if (!trimmed) return state;

  const newPlayer: Player = {
    id,
    username: trimmed,
  };

  return withUpdatedAt({
    ...state,
    players: [...state.players, newPlayer],
  });
}

export function canStartGame(state: GameState): boolean {
  return state.phase === "LOBBY" && state.players.length >= 2;
}

export function startGame(state: GameState): GameState {
  if (!canStartGame(state)) return state;
  return withUpdatedAt({
    ...state,
    phase: "IN_PROGRESS",
  });
}

export function endGame(state: GameState): GameState {
  if (state.phase !== "IN_PROGRESS") return state;
  return withUpdatedAt({
    ...state,
    phase: "FINISHED",
  });
}

export function recordTurn(
  state: GameState,
  playerId: PlayerId,
  score: number
): GameState {
  // Return if a game is not in progress
  if (state.phase !== "IN_PROGRESS") return state;

  // Return if the player's id doesn't exist in the state
  if (!state.players.some((p) => p.id === playerId)) return state;

  // Return if the score in infinite
  if (!Number.isFinite(score)) return state;

  const turn: Turn = {
    id: generateId(),
    gameId: state.id,
    playerId,
    score: Math.round(score),
    turnIndex: state?.turns?.length,
    createdAt: new Date().toISOString(),
  };

  const turns = [...state.turns, turn];
  const currentIndex = state.currentPlayerIndex ?? 0;
  const nextIndex =
    state.players.length > 0 ? (currentIndex + 1) % state.players.length : null;
  const nextState: GameState = {
    ...state,
    turns,
    currentPlayerIndex: nextIndex,
  };

  // TODO: add this to settings/state
  if (score >= 1000) {
    nextState.phase = "FINISHED";
    nextState.currentPlayerIndex = null;
  }

  return withUpdatedAt(nextState);
}
