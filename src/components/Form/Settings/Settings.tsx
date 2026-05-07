'use client';

import { useI18n } from '@/i18n/I18nProvider';
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useGame } from '@/domain/game/GameProvider';
import { SettingsFormSchema, type SettingsFormSchemaType } from '@/domain/game/formSchemas';
import { GameMode, ThemePreference } from '@/domain/game/gameTypes';
import Button from '@/components/Button/Button';
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

function Settings({ onSubmit }: Readonly<SettingsFormProps>) {
  const { state } = useGame();
  const { t } = useI18n();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<SettingsFormSchemaType>({
    resolver: zodResolver(SettingsFormSchema),
    defaultValues: {
      autoAdvanceTurns: state.settings.autoAdvanceTurns,
      locale: state.preferences.locale,
      mode: state.settings.mode,
      motionEnabled: state.preferences.motionEnabled,
      targetScore: state.settings.targetScore,
      showComboSuggestions: state.settings.showComboSuggestions,
      tableFeedback: state.preferences.tableFeedback,
      theme: state.preferences.theme,
    },
    mode: 'onBlur',
  });

  const submitHandler = (data: {
    autoAdvanceTurns: boolean;
    locale: SettingsFormSchemaType['locale'];
    mode: GameMode;
    motionEnabled: boolean;
    targetScore: number;
    showComboSuggestions: boolean;
    tableFeedback: boolean;
    theme: ThemePreference;
  }) => {
    onSubmit(data);
    reset();
  };

  return (
    <div className="form-wrapper | border-accent border p-md rounded-4xl bg-surface self-center max-w-full">
      <form
        className="form | gap-xl flex flex-col"
        onSubmit={handleSubmit(submitHandler)}
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

        <Button
          type="submit"
          className="justify-center"
        >
          {t('settings.save')}
        </Button>
      </form>
    </div>
  );
}

export default Settings;
