import { describe, expect, it } from "vitest";
import {
  addPlayer,
  createInitialGameState,
  getGameSummary,
  recordTurn,
  startGame,
} from "./gameLogic";

describe("game logic", () => {
  it("creates a complete initial game state", () => {
    const state = createInitialGameState();

    expect(state.phase).toBe("LOBBY");
    expect(state.settings).toMatchObject({
      diceStyle: "default",
      mode: "dice",
      showComboSuggestions: false,
      targetScore: 10000,
    });
  });

  it("records turns, advances players, and finishes when target is reached", () => {
    let state = createInitialGameState();
    state = addPlayer(state, "Ada", 1);
    state = addPlayer(state, "Grace", 2);
    state = {
      ...state,
      settings: { ...state.settings, targetScore: 500 },
    };
    state = startGame(state);

    const ada = state.players[0];
    const grace = state.players[1];

    state = recordTurn(state, ada.id, 450);
    expect(state.phase).toBe("IN_PROGRESS");
    expect(state.currentPlayerIndex).toBe(1);

    state = recordTurn(state, grace.id, 500);
    expect(state.phase).toBe("FINISHED");
    expect(state.currentPlayerIndex).toBeNull();

    const summary = getGameSummary(state);
    expect(summary.winnerId).toBe(grace.id);
  });

  it("rejects invalid turn scores", () => {
    let state = createInitialGameState();
    state = addPlayer(state, "Ada", 1);
    state = addPlayer(state, "Grace", 2);
    state = startGame(state);

    const next = recordTurn(state, state.players[0].id, -1);

    expect(next).toBe(state);
  });
});
