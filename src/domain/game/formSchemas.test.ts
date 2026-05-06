import { describe, expect, it } from 'vitest';

import {
  AddPlayerFormSchema,
  AddScoreSchema,
  SettingsFormSchema,
} from '@/domain/game/formSchemas';

describe('game form schemas', () => {
  it('trims player names', () => {
    expect(
      AddPlayerFormSchema.parse({
        avatar: 1,
        username: '  Ada  ',
      }),
    ).toEqual({
      avatar: 1,
      username: 'Ada',
    });
  });

  it('rejects empty player names', () => {
    expect(
      AddPlayerFormSchema.safeParse({
        avatar: 1,
        username: '   ',
      }).success,
    ).toBe(false);
  });

  it('rejects negative manual scores', () => {
    expect(AddScoreSchema.safeParse({ value: -1 }).success).toBe(false);
  });

  it('validates supported game settings', () => {
    expect(
      SettingsFormSchema.safeParse({
        autoAdvanceTurns: true,
        diceStyle: 'medieval',
        mode: 'manual',
        motionEnabled: false,
        targetScore: 10000,
        showComboSuggestions: true,
        tableFeedback: true,
        theme: 'dark',
      }).success,
    ).toBe(true);
  });

  it('rejects unsupported game settings', () => {
    expect(
      SettingsFormSchema.safeParse({
        autoAdvanceTurns: true,
        diceStyle: 'wooden',
        mode: 'manual',
        motionEnabled: false,
        targetScore: 100,
        showComboSuggestions: true,
        tableFeedback: true,
        theme: 'dark',
      }).success,
    ).toBe(false);
  });
});
