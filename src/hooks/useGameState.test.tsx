import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';

import { useGameState } from '@/hooks/useGameState';

const STORAGE_KEY = 'farkle-friend-settings';

describe('useGameState settings persistence', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('restores valid stored settings and preferences', async () => {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        preferences: {
          motionEnabled: false,
          tableFeedback: true,
          theme: 'dark',
        },
        settings: {
          autoAdvanceTurns: true,
          diceStyle: 'medieval',
          mode: 'manual',
          targetScore: 10000,
          showComboSuggestions: true,
        },
      }),
    );

    const { result } = renderHook(() => useGameState());

    expect(result.current.state.preferences).toMatchObject({
      motionEnabled: false,
      tableFeedback: true,
      theme: 'dark',
    });
    expect(result.current.state.settings).toMatchObject({
      autoAdvanceTurns: true,
      diceStyle: 'medieval',
      mode: 'manual',
      targetScore: 10000,
      showComboSuggestions: true,
    });
  });

  it('ignores corrupt stored settings', () => {
    window.localStorage.setItem(STORAGE_KEY, '{not-json');

    const { result } = renderHook(() => useGameState());

    expect(result.current.state.preferences).toMatchObject({
      motionEnabled: true,
      tableFeedback: false,
      theme: 'system',
    });
    expect(result.current.state.settings).toMatchObject({
      autoAdvanceTurns: false,
      diceStyle: 'default',
      mode: 'dice',
      targetScore: 5000,
      showComboSuggestions: false,
    });
  });

  it('ignores invalid stored values', () => {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        preferences: {
          motionEnabled: 'nope',
          tableFeedback: true,
          theme: 'sepia',
        },
        settings: {
          targetScore: 100,
          mode: 'chaos',
        },
      }),
    );

    const { result } = renderHook(() => useGameState());

    expect(result.current.state.preferences).toMatchObject({
      motionEnabled: true,
      tableFeedback: false,
      theme: 'system',
    });
    expect(result.current.state.settings).toMatchObject({
      mode: 'dice',
      targetScore: 5000,
    });
  });

  it('persists settings and preferences after updates', async () => {
    const { result } = renderHook(() => useGameState());

    act(() => {
      result.current.dispatch({
        type: 'UPDATE_SETTINGS',
        settings: {
          autoAdvanceTurns: true,
          targetScore: 7500,
        },
      });
      result.current.dispatch({
        type: 'UPDATE_PREFERENCES',
        preferences: {
          motionEnabled: false,
          theme: 'light',
        },
      });
    });

    await waitFor(() => {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      expect(stored).not.toBeNull();
      expect(JSON.parse(stored!)).toMatchObject({
        preferences: {
          motionEnabled: false,
          theme: 'light',
        },
        settings: {
          autoAdvanceTurns: true,
          targetScore: 7500,
        },
      });
    });
  });
});
