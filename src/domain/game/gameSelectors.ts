import type {
  GameFlowState,
  GameState,
  GameSummary,
  Player,
  PlayerId,
  Turn,
  TurnResult,
} from "@/domain/game/gameTypes";

export function getGameFlowState(state: GameState): GameFlowState {
  if (state.phase === "LOBBY") return "LOBBY";
  if (state.phase === "FINISHED") return "FINISHED";
  if (state.pendingTurnResult) return "TURN_RESULT";
  return "TURN_ACTIVE";
}

export function getCurrentPlayer(
  state: GameState,
  summary: GameSummary
): Player | null {
  if (state.currentPlayerIndex == null) return null;
  return summary.players[state.currentPlayerIndex] ?? null;
}

export function getNextPlayer(
  summary: GameSummary,
  result: TurnResult | null
): Player | null {
  if (!result?.nextPlayerId) return null;
  return summary.players.find((player) => player.id === result.nextPlayerId) ?? null;
}

export function getWinner(summary: GameSummary): Player | null {
  if (summary.winnerId == null) return null;
  return summary.players.find((player) => player.id === summary.winnerId) ?? null;
}

export function getRecentTurns(turns: Turn[], limit = 5): Turn[] {
  return turns.slice(-limit).reverse();
}

export function getPlayerNameMap(players: Player[]): Map<PlayerId, string> {
  return new Map(players.map((player) => [player.id, player.username]));
}

export function shouldWarnBeforeUnload(state: GameState): boolean {
  return state.phase === "IN_PROGRESS" && state.players.length > 0;
}
