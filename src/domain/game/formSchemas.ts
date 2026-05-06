import * as z from 'zod/mini';

export const MINIMUM_USERNAME_LENGTH = 1;
export const diceStyles = ['default', 'medieval'] as const;
export const modes = ['dice', 'manual'] as const;
export const themePreferences = ['system', 'light', 'dark'] as const;
export const targetScorePresets = [2500, 5000, 10000] as const;
export const minTargetScore = 500;
export const maxTargetScore = 50000;

export const AddPlayerFormSchema = z.object({
  username: z.string().check(
    z.trim(),
    z.minLength(MINIMUM_USERNAME_LENGTH, {
      error: `Name must be at least ${MINIMUM_USERNAME_LENGTH} characters!`,
    }),
  ),
  avatar: z.number('Pick something!'),
});

export const AddScoreSchema = z.object({
  value: z.number().check(
    z.minimum(0, {
      error: 'Enter a valid number, or zero if you were farkled!',
    }),
  ),
});

export const SettingsFormSchema = z.object({
  autoAdvanceTurns: z.boolean(),
  diceStyle: z.enum(diceStyles),
  mode: z.enum(modes),
  motionEnabled: z.boolean(),
  targetScore: z.number().check(
    z.int('Target score must be a whole number.'),
    z.minimum(minTargetScore, `Target score must be at least ${minTargetScore}.`),
    z.maximum(maxTargetScore, `Target score must be ${maxTargetScore} or less.`),
  ),
  showComboSuggestions: z.boolean(),
  tableFeedback: z.boolean(),
  theme: z.enum(themePreferences),
});

export type AddPlayerFormSchemaType = z.infer<typeof AddPlayerFormSchema>;
export type AddScoreSchemaType = z.infer<typeof AddScoreSchema>;
export type SettingsFormSchemaType = z.infer<typeof SettingsFormSchema>;
