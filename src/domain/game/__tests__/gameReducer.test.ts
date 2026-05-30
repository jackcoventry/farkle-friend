import { describe, expect, it } from 'vitest';
import { createInitialGameState, getGameSummary } from '@/domain/game/gameLogic';
import { reducer } from '@/domain/game/gameReducer';
import { getCurrentPlayer, getGameFlowState } from '@/domain/game/gameSelectors';
import type { GameState } from '@/domain/game/gameTypes';

function createStartedGame(): GameState {
  let state = createInitialGameState();
  state = reducer(state, { type: 'ADD_PLAYER', username: 'Ada', avatar: 1 });
  state = reducer(state, { type: 'ADD_PLAYER', username: 'Grace', avatar: 2 });
  state = reducer(state, {
    type: 'UPDATE_SETTINGS',
    settings: { targetScore: 500 },
  });
  return reducer(state, { type: 'START_GAME' });
}

describe('game reducer flow', () => {
  it('records a turn result before advancing to the next player', () => {
    let state = createStartedGame();
    const ada = state.players[0];

    state = reducer(state, {
      type: 'RECORD_TURN',
      playerId: ada.id,
      score: 150,
    });

    expect(getGameFlowState(state)).toBe('TURN_RESULT');
    expect(state.currentPlayerIndex).toBe(0);
    expect(state.pendingTurnResult).toMatchObject({
      isGameWinner: false,
      newTotal: 150,
      playerId: ada.id,
      previousTotal: 0,
      score: 150,
    });

    state = reducer(state, { type: 'ADVANCE_TURN' });

    expect(getGameFlowState(state)).toBe('TURN_ACTIVE');
    expect(state.pendingTurnResult).toBeNull();
    expect(getCurrentPlayer(state, getGameSummary(state))?.username).toBe('Grace');
  });

  it('finishes immediately on a winning turn', () => {
    let state = createStartedGame();
    const ada = state.players[0];

    state = reducer(state, {
      type: 'RECORD_TURN',
      playerId: ada.id,
      score: 500,
    });

    expect(getGameFlowState(state)).toBe('FINISHED');
    expect(state.phase).toBe('FINISHED');
    expect(state.pendingTurnResult).toBeNull();
    expect(getGameSummary(state).winnerId).toBe(ada.id);
  });

  it('clears pending turn results when resetting or ending a game', () => {
    let state = createStartedGame();
    const ada = state.players[0];

    state = reducer(state, {
      type: 'RECORD_TURN',
      playerId: ada.id,
      score: 150,
    });
    expect(state.pendingTurnResult).not.toBeNull();

    expect(reducer(state, { type: 'RESET_GAME' }).pendingTurnResult).toBeNull();
    expect(reducer(state, { type: 'END_GAME' }).pendingTurnResult).toBeNull();
  });

  it('does not allow game rule settings to change after the game starts', () => {
    const state = createStartedGame();

    const nextState = reducer(state, {
      type: 'UPDATE_SETTINGS',
      settings: {
        mode: 'manual',
        targetScore: 1000,
      },
    });

    expect(nextState.settings.mode).toBe('dice');
    expect(nextState.settings.targetScore).toBe(500);
  });

  it('allows accessibility preferences to change after the game starts', () => {
    const state = createStartedGame();

    const nextState = reducer(state, {
      type: 'UPDATE_PREFERENCES',
      preferences: {
        motionEnabled: false,
        tableFeedback: true,
      },
    });

    expect(nextState.preferences.motionEnabled).toBe(false);
    expect(nextState.preferences.tableFeedback).toBe(true);
    expect(nextState.phase).toBe('IN_PROGRESS');
  });

  it('does not advance turns after a winning turn has finished the game', () => {
    let state = createStartedGame();
    const ada = state.players[0];

    state = reducer(state, {
      type: 'RECORD_TURN',
      playerId: ada.id,
      score: 500,
    });
    const nextState = reducer(state, { type: 'ADVANCE_TURN' });

    expect(nextState).toBe(state);
    expect(getGameFlowState(nextState)).toBe('FINISHED');
  });
});
