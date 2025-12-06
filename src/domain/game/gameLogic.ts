import { generateId } from "@/utils/generateId";
import {
  GameId,
  GameState,
  GameSummary,
  Player,
  PlayerId,
  Turn,
} from "./gameTypes";

export function createInitialGameState(): GameState {
  const now = new Date().toISOString();
  const gameId: GameId = "1";

  return {
    id: gameId,
    createdAt: now,
    currentPlayerIndex: null,
    phase: "LOBBY",
    players: [],
    turns: [],
    updatedAt: now,
  };
}

// Helper function to keep the updatedAt up-to-date
function withUpdatedAt<T extends { updatedAt: string }>(state: T): T {
  return { ...state, updatedAt: new Date().toISOString() };
}

// Helper for the add player reducer action
export function addPlayer(
  state: GameState,
  username: string,
  avatar: number
): GameState {
  if (state.phase !== "LOBBY") return state;
  const trimmed = username.trim();
  if (!trimmed) return state;

  const newPlayer: Player = {
    id: generateId(),
    username: trimmed,
    avatar,
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
    currentPlayerIndex: 0,
    phase: "IN_PROGRESS",
  });
}

export function endGame(state: GameState): GameState {
  if (state.phase !== "IN_PROGRESS") return state;
  return withUpdatedAt({
    ...state,
    currentPlayerIndex: null,
    phase: "FINISHED",
  });
}

// This will reset the game but keep players
export function resetGame(state: GameState): GameState {
  return withUpdatedAt({
    ...state,
    currentPlayerIndex: null,
    phase: "LOBBY",
    turns: [],
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
  const summary = getGameSummary(nextState);

  if (summary.isTargetReached) {
    nextState.phase = "FINISHED";
    nextState.currentPlayerIndex = null;
  }

  return withUpdatedAt(nextState);
}

export function computeTotals(state: GameState): Record<PlayerId, number> {
  const totals: Record<PlayerId, number> = {};
  for (const p of state.players) {
    totals[p.id] = 0;
  }
  for (const turn of state.turns) {
    totals[turn.playerId] = (totals[turn.playerId] ?? 0) + turn.score;
  }
  return totals;
}

export function getGameSummary(state: GameState): GameSummary {
  const totals = computeTotals(state);
  const playersSummary = state.players?.map((p) => ({
    playerId: p.id,
    username: p.username,
    avatar: p.avatar,
    totalScore: totals[p.id] ?? 0,
  }));

  let leadingPlayerId: PlayerId | null = null;
  let leadingScore = -Infinity;

  for (const p of playersSummary) {
    if (p.totalScore > leadingScore) {
      leadingScore = p.totalScore;
      leadingPlayerId = p.playerId;
    }
  }

  const target = 2000; // TODO: add to global settings
  const isTargetReached = playersSummary.some((p) => p.totalScore >= target);
  const winnerId = isTargetReached ? leadingPlayerId : null;

  return {
    isTargetReached,
    leadingPlayerId,
    players: playersSummary,
    winnerId,
  };
}
