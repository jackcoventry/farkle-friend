"use client";

import { useReducer } from "react";
import type { GameState } from "@/domain/game/gameTypes";
import { createInitialGameState } from "@/domain/game/gameLogic";
import { reducer } from "@/domain/game/gameReducer";

function createInitialState(): GameState {
  return createInitialGameState();
}

export function useGameState() {
  const [state, dispatch] = useReducer(reducer, undefined, createInitialState);

  return { state, dispatch };
}
