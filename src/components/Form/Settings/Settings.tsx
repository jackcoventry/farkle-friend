'use client';

import { useI18n } from '@/i18n/I18nProvider';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useMemo, useRef } from 'react';
import { SubmitHandler, useForm, useWatch } from 'react-hook-form';
import { useGame } from '@/domain/game/GameProvider';
import { SettingsFormSchema, type SettingsFormSchemaType } from '@/domain/game/formSchemas';
import {
  ComboSuggestionsField,
  LanguageField,
  ModeField,
  MotionField,
  SoundFeedbackField,
  TargetScoreField,
  ThemeField,
  TurnHandOffField,
} from './SettingsFields';

export type { SettingsFormSchemaType };
export type SettingsFormResult = {
  message: string;
};

type SettingsFormProps = {
  onSubmit: SubmitHandler<SettingsFormSchemaType>;
};

export function Settings({ onSubmit }: Readonly<SettingsFormProps>) {
  const { state } = useGame();
  const { t } = useI18n();
  const defaultValues = useMemo<SettingsFormSchemaType>(
    () => ({
      autoAdvanceTurns: state.settings.autoAdvanceTurns,
      locale: state.preferences.locale,
      mode: state.settings.mode,
      motionEnabled: state.preferences.motionEnabled,
      targetScore: state.settings.targetScore,
      showComboSuggestions: state.settings.showComboSuggestions,
      tableFeedback: state.preferences.tableFeedback,
      theme: state.preferences.theme,
    }),
    [
      state.preferences.locale,
      state.preferences.motionEnabled,
      state.preferences.tableFeedback,
      state.preferences.theme,
      state.settings.autoAdvanceTurns,
      state.settings.mode,
      state.settings.showComboSuggestions,
      state.settings.targetScore,
    ]
  );

  const {
    control,
    formState: { errors },
    setValue,
  } = useForm<SettingsFormSchemaType>({
    resolver: zodResolver(SettingsFormSchema),
    defaultValues,
    mode: 'onChange',
  });

  const watchedSettings = useWatch({ control });
  const lastSavedSettingsRef = useRef(JSON.stringify(defaultValues));

  useEffect(() => {
    const result = SettingsFormSchema.safeParse(watchedSettings);
    if (!result.success) return;

    const serializedSettings = JSON.stringify(result.data);
    if (serializedSettings === lastSavedSettingsRef.current) return;

    lastSavedSettingsRef.current = serializedSettings;
    onSubmit(result.data);
  }, [onSubmit, watchedSettings]);

  return (
    <div className="form-wrapper | border-accent p-md bg-surface max-w-full self-center rounded-4xl border">
      <form
        className="form | gap-xl flex flex-col"
        onSubmit={(event) => event.preventDefault()}
      >
        <h2 className="font-heading-2 text-text">{t('settings.title')}</h2>
        <TurnHandOffField control={control} />
        <LanguageField control={control} />
        <ModeField control={control} />
        <TargetScoreField
          control={control}
          errors={errors}
          setValue={setValue}
        />
        <ComboSuggestionsField control={control} />
        <SoundFeedbackField control={control} />
        <MotionField control={control} />
        <ThemeField control={control} />
      </form>
    </div>
  );
}
