import * as z from 'zod/mini';

export const MINIMUM_USERNAME_LENGTH = 1;
export const modes = ['dice', 'manual'] as const;
export const localePreferences = ['en', 'es'] as const;
export const themePreferences = ['system', 'light', 'dark'] as const;
export const targetScorePresets = [2500, 5000, 10000] as const;
export const minTargetScore = 500;
export const maxTargetScore = 50000;

export const AddPlayerFormSchema = z.object({
  username: z.string().check(
    z.trim(),
    z.minLength(MINIMUM_USERNAME_LENGTH, {
      error: 'validation.usernameRequired',
    })
  ),
  avatar: z.number('validation.avatarRequired'),
});

export const AddScoreSchema = z.object({
  value: z.number().check(
    z.minimum(0, {
      error: 'validation.scoreNonNegative',
    })
  ),
});

export const SettingsFormSchema = z.object({
  autoAdvanceTurns: z.boolean(),
  locale: z.enum(localePreferences),
  mode: z.enum(modes),
  motionEnabled: z.boolean(),
  targetScore: z
    .number()
    .check(
      z.int('validation.targetScoreInteger'),
      z.minimum(minTargetScore, 'validation.targetScoreMin'),
      z.maximum(maxTargetScore, 'validation.targetScoreMax')
    ),
  showComboSuggestions: z.boolean(),
  tableFeedback: z.boolean(),
  theme: z.enum(themePreferences),
});

export type AddPlayerFormSchemaType = z.infer<typeof AddPlayerFormSchema>;
export type AddScoreSchemaType = z.infer<typeof AddScoreSchema>;
export type SettingsFormSchemaType = z.infer<typeof SettingsFormSchema>;
