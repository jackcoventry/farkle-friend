"use client";

import React, { createContext, useContext } from "react";
import { useGameState } from "@/hooks/useGameState";
import type { GameState } from "@/domain/game/gameTypes";
import type { GameAction } from "@/domain/game/gameReducer";

type GameContextValue = {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
};

const GameContext = createContext<GameContextValue | null>(null);

export function GameProvider({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const value = useGameState();
  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGame must be used within <GameProvider />");
  return ctx;
}
