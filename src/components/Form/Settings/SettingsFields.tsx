import { useI18n } from '@/i18n/I18nProvider';
import { localeLabels } from '@/i18n/locales';
import { translateValidationMessage } from '@/i18n/validation';
import type { ReactNode, Ref } from 'react';
import { type Control, Controller, type FieldErrors, type UseFormSetValue } from 'react-hook-form';
import {
  type SettingsFormSchemaType,
  localePreferences,
  maxTargetScore,
  minTargetScore,
  modes,
  targetScorePresets,
  themePreferences,
} from '@/domain/game/formSchemas';
import Button from '@/components/Button/Button';
import { Panel } from '@/components/Panel/Panel';
import Pill from '@/components/Pill/Pill';

type SettingsFieldProps = {
  control: Control<SettingsFormSchemaType>;
};

type TargetScoreFieldProps = SettingsFieldProps & {
  errors: FieldErrors<SettingsFormSchemaType>;
  setValue: UseFormSetValue<SettingsFormSchemaType>;
};

type RadioPillOption<T extends string | boolean> = {
  id: string;
  label: ReactNode;
  labelClassName?: string;
  value: T;
};

type RadioPillGroupProps<T extends string | boolean> = {
  className?: string;
  inputRef?: Ref<HTMLInputElement>;
  name: string;
  onBlur?: () => void;
  onChange: (value: T) => void;
  options: RadioPillOption<T>[];
  value: T;
};

function RadioPillGroup<T extends string | boolean>({
  className = 'flex flex-wrap gap-4',
  inputRef,
  name,
  onBlur,
  onChange,
  options,
  value,
}: Readonly<RadioPillGroupProps<T>>) {
  return (
    <div className={className}>
      {options.map((option) => (
        <Pill key={option.id}>
          <Pill.Control>
            <input
              type="radio"
              value={String(option.value)}
              name={name}
              id={option.id}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
              onBlur={onBlur}
              ref={inputRef}
            />
          </Pill.Control>
          <Pill.Label
            htmlFor={option.id}
            className={option.labelClassName}
          >
            {option.label}
          </Pill.Label>
        </Pill>
      ))}
    </div>
  );
}

export function TurnHandOffField({ control }: Readonly<SettingsFieldProps>) {
  const { t } = useI18n();

  return (
    <Controller
      control={control}
      name="autoAdvanceTurns"
      render={({ field }) => (
        <Panel>
          <fieldset className="grid gap-3">
            <legend className="contents">{t('settings.turnHandOff')}</legend>
            <RadioPillGroup
              name={field.name}
              value={field.value}
              onChange={field.onChange}
              options={[
                { id: 'autoAdvanceTurns_yes', label: t('settings.auto'), value: true },
                { id: 'autoAdvanceTurns_no', label: t('common.manual'), value: false },
              ]}
            />
          </fieldset>
        </Panel>
      )}
    />
  );
}

export function LanguageField({ control }: Readonly<SettingsFieldProps>) {
  const { t } = useI18n();

  return (
    <Controller
      control={control}
      name="locale"
      render={({ field }) => (
        <Panel>
          <fieldset className="grid gap-3">
            <legend className="contents">{t('preferences.language')}</legend>
            <RadioPillGroup
              name={field.name}
              value={field.value}
              onChange={field.onChange}
              options={localePreferences.map((option) => ({
                id: `settingsLocale_${option}`,
                label: localeLabels[option],
                value: option,
              }))}
            />
          </fieldset>
        </Panel>
      )}
    />
  );
}

export function ModeField({ control }: Readonly<SettingsFieldProps>) {
  const { t } = useI18n();

  return (
    <Controller
      name="mode"
      control={control}
      render={({ field, fieldState }) => (
        <Panel>
          <fieldset
            className="grid gap-3"
            aria-invalid={!!fieldState.error || undefined}
          >
            <legend className="contents">{t('settings.mode')}</legend>

            <RadioPillGroup
              name={field.name}
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              inputRef={field.ref}
              options={modes.map((option) => ({
                id: `${option}_${field.name}`,
                label: option,
                labelClassName: 'capitalize',
                value: option,
              }))}
            />
          </fieldset>
        </Panel>
      )}
    />
  );
}

export function TargetScoreField({ control, errors, setValue }: Readonly<TargetScoreFieldProps>) {
  const { t } = useI18n();

  return (
    <Controller
      name="targetScore"
      control={control}
      render={({ field, fieldState }) => (
        <Panel>
          <div className="grid gap-3">
            <label htmlFor="target-score">{t('settings.pointTarget')}</label>
            <input
              id="target-score"
              className="field-control"
              {...field}
              placeholder={t('settings.targetPlaceholder')}
              data-valid={errors?.targetScore ? 'false' : 'true'}
              aria-invalid={fieldState.error ? 'true' : undefined}
              aria-describedby={fieldState.error ? 'target-score-error' : undefined}
              type="number"
              min={minTargetScore}
              max={maxTargetScore}
              step={50}
              onChange={(value) => field.onChange(value.target.valueAsNumber)}
            />

            <div className="grid grid-cols-[repeat(auto-fit,minmax(7rem,1fr))] gap-2">
              {targetScorePresets.map((preset) => (
                <Button
                  key={preset}
                  type="button"
                  size="small"
                  className="justify-center"
                  onClick={() =>
                    setValue('targetScore', preset, {
                      shouldDirty: true,
                      shouldTouch: true,
                      shouldValidate: true,
                    })
                  }
                >
                  {preset.toLocaleString()}
                </Button>
              ))}
            </div>

            {fieldState.error ? (
              <p
                id="target-score-error"
                className="field-error"
                role="alert"
              >
                {translateValidationMessage(t, fieldState.error.message)}
              </p>
            ) : null}
          </div>
        </Panel>
      )}
    />
  );
}

export function ComboSuggestionsField({ control }: Readonly<SettingsFieldProps>) {
  const { t } = useI18n();

  return (
    <Controller
      control={control}
      name="showComboSuggestions"
      render={({ field }) => (
        <Panel>
          <fieldset className="grid gap-3">
            <legend className="contents">{t('settings.showComboSuggestions')}</legend>
            <RadioPillGroup
              name={field.name}
              value={field.value}
              onChange={field.onChange}
              options={[
                { id: 'showCombo_yes', label: t('common.yes'), value: true },
                { id: 'showCombo_no', label: t('common.no'), value: false },
              ]}
            />
          </fieldset>
        </Panel>
      )}
    />
  );
}

export function SoundFeedbackField({ control }: Readonly<SettingsFieldProps>) {
  const { t } = useI18n();

  return (
    <Controller
      control={control}
      name="tableFeedback"
      render={({ field }) => (
        <Panel>
          <fieldset className="grid gap-3">
            <legend className="contents">{t('preferences.sound')}</legend>
            <p className="text-sm">{t('settings.soundDescription')}</p>
            <RadioPillGroup
              name={field.name}
              value={field.value}
              onChange={field.onChange}
              options={[
                { id: 'tableFeedback_yes', label: t('common.on'), value: true },
                { id: 'tableFeedback_no', label: t('common.off'), value: false },
              ]}
            />
          </fieldset>
        </Panel>
      )}
    />
  );
}

export function MotionField({ control }: Readonly<SettingsFieldProps>) {
  const { t } = useI18n();

  return (
    <Controller
      control={control}
      name="motionEnabled"
      render={({ field }) => (
        <Panel>
          <fieldset className="grid gap-3">
            <legend className="contents">{t('settings.animations')}</legend>
            <RadioPillGroup
              name={field.name}
              value={field.value}
              onChange={field.onChange}
              options={[
                { id: 'motionEnabled_yes', label: t('common.on'), value: true },
                { id: 'motionEnabled_no', label: t('common.off'), value: false },
              ]}
            />
          </fieldset>
        </Panel>
      )}
    />
  );
}

export function ThemeField({ control }: Readonly<SettingsFieldProps>) {
  const { t } = useI18n();

  return (
    <Controller
      control={control}
      name="theme"
      render={({ field }) => (
        <Panel>
          <fieldset className="grid gap-3">
            <legend className="contents">{t('common.theme')}</legend>
            <RadioPillGroup
              name={field.name}
              value={field.value}
              onChange={field.onChange}
              options={themePreferences.map((option) => ({
                id: `theme_${option}`,
                label:
                  option === 'system'
                    ? t('common.system')
                    : option === 'light'
                      ? t('common.light')
                      : t('common.dark'),
                value: option,
              }))}
            />
          </fieldset>
        </Panel>
      )}
    />
  );
}
