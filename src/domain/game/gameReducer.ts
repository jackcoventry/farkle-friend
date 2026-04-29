import {
  addPlayer,
  advanceTurn,
  endGame,
  removePlayer,
  recordTurn,
  resetGame,
  startGame,
} from "./gameLogic";
import { GameSettings, GameState, PlayerId } from "./gameTypes";

export type GameAction =
  | { type: "ADD_PLAYER"; username: string; avatar: number }
  | { type: "REMOVE_PLAYER"; playerId: PlayerId }
  | { type: "START_GAME" }
  | { type: "ADVANCE_TURN" }
  | { type: "END_GAME" }
  | { type: "RESET_GAME" }
  | { type: "RECORD_TURN"; playerId: PlayerId; score: number }
  | {
      type: "UPDATE_PREFERENCES";
      settings: Pick<GameSettings, "motionEnabled" | "tableFeedback">;
    }
  | { type: "UPDATE_SETTINGS"; settings: Partial<GameSettings> };

export function reducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "ADD_PLAYER":
      return addPlayer(state, action.username, action.avatar);
    case "REMOVE_PLAYER":
      return removePlayer(state, action.playerId);
    case "START_GAME":
      return startGame(state);
    case "ADVANCE_TURN":
      return advanceTurn(state);
    case "END_GAME":
      return endGame(state);
    case "RESET_GAME":
      return resetGame(state);
    case "RECORD_TURN":
      return recordTurn(state, action.playerId, action.score);
    case "UPDATE_PREFERENCES":
      return {
        ...state,
        settings: {
          ...state.settings,
          ...action.settings,
        },
      };
    case "UPDATE_SETTINGS": {
      if (state.phase !== "LOBBY") return state; // settings should be locked once game started
      return {
        ...state,
        settings: {
          ...state.settings,
          ...action.settings,
        },
      };
    }
    default:
      return state;
  }
}
