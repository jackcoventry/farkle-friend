import { describe, expect, it } from 'vitest';
import { AddPlayerFormSchema, AddScoreSchema, SettingsFormSchema } from '@/domain/game/formSchemas';

describe('game form schemas', () => {
  it('trims player names', () => {
    expect(
      AddPlayerFormSchema.parse({
        avatar: 1,
        username: '  Ada  ',
      })
    ).toEqual({
      avatar: 1,
      username: 'Ada',
    });
  });

  it('rejects empty player names', () => {
    const result = AddPlayerFormSchema.safeParse({
      avatar: 1,
      username: '   ',
    });

    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.message).toBe('validation.usernameRequired');
  });

  it('rejects negative manual scores', () => {
    const result = AddScoreSchema.safeParse({ value: -1 });

    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.message).toBe('validation.scoreNonNegative');
  });

  it('validates supported game settings', () => {
    expect(
      SettingsFormSchema.safeParse({
        autoAdvanceTurns: true,
        locale: 'es',
        mode: 'manual',
        motionEnabled: false,
        targetScore: 10000,
        showComboSuggestions: true,
        tableFeedback: true,
        theme: 'dark',
      }).success
    ).toBe(true);
  });

  it('rejects unsupported game settings', () => {
    expect(
      SettingsFormSchema.safeParse({
        autoAdvanceTurns: true,
        locale: 'es',
        mode: 'manual',
        motionEnabled: false,
        targetScore: 100,
        showComboSuggestions: true,
        tableFeedback: true,
        theme: 'dark',
      }).success
    ).toBe(false);
  });
});
