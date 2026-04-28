import { describe, expect, it } from "vitest";
import { reducer } from "@/domain/game/gameReducer";
import {
  getCurrentPlayer,
  getGameFlowState,
} from "@/domain/game/gameSelectors";
import { getGameSummary } from "@/domain/game/gameLogic";
import type { GameState } from "@/domain/game/gameTypes";
import { createInitialGameState } from "@/domain/game/gameLogic";

function createStartedGame(): GameState {
  let state = createInitialGameState();
  state = reducer(state, { type: "ADD_PLAYER", username: "Ada", avatar: 1 });
  state = reducer(state, { type: "ADD_PLAYER", username: "Grace", avatar: 2 });
  state = reducer(state, {
    type: "UPDATE_SETTINGS",
    settings: { targetScore: 500 },
  });
  return reducer(state, { type: "START_GAME" });
}

describe("game reducer flow", () => {
  it("records a turn result before advancing to the next player", () => {
    let state = createStartedGame();
    const ada = state.players[0];

    state = reducer(state, {
      type: "RECORD_TURN",
      playerId: ada.id,
      score: 150,
    });

    expect(getGameFlowState(state)).toBe("TURN_RESULT");
    expect(state.currentPlayerIndex).toBe(0);
    expect(state.pendingTurnResult).toMatchObject({
      isGameWinner: false,
      newTotal: 150,
      playerId: ada.id,
      previousTotal: 0,
      score: 150,
    });

    state = reducer(state, { type: "ADVANCE_TURN" });

    expect(getGameFlowState(state)).toBe("TURN_ACTIVE");
    expect(state.pendingTurnResult).toBeNull();
    expect(getCurrentPlayer(state, getGameSummary(state))?.username).toBe(
      "Grace"
    );
  });

  it("waits for confirmation before showing the winner", () => {
    let state = createStartedGame();
    const ada = state.players[0];

    state = reducer(state, {
      type: "RECORD_TURN",
      playerId: ada.id,
      score: 500,
    });

    expect(getGameFlowState(state)).toBe("TURN_RESULT");
    expect(state.phase).toBe("IN_PROGRESS");
    expect(state.pendingTurnResult?.isGameWinner).toBe(true);

    state = reducer(state, { type: "ADVANCE_TURN" });

    expect(getGameFlowState(state)).toBe("FINISHED");
    expect(state.phase).toBe("FINISHED");
    expect(getGameSummary(state).winnerId).toBe(ada.id);
  });

  it("clears pending turn results when resetting or ending a game", () => {
    let state = createStartedGame();
    const ada = state.players[0];

    state = reducer(state, {
      type: "RECORD_TURN",
      playerId: ada.id,
      score: 150,
    });
    expect(state.pendingTurnResult).not.toBeNull();

    expect(reducer(state, { type: "RESET_GAME" }).pendingTurnResult).toBeNull();
    expect(reducer(state, { type: "END_GAME" }).pendingTurnResult).toBeNull();
  });
});
