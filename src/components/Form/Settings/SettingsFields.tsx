import { useI18n } from '@/i18n/I18nProvider';
import { localeLabels } from '@/i18n/locales';
import { translateValidationMessage } from '@/i18n/validation';
import { type Control, Controller, type FieldErrors, type UseFormSetValue } from 'react-hook-form';
import {
  type SettingsFormSchemaType,
  diceStyles,
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
            <div className="flex gap-4">
              <Pill>
                <Pill.Control>
                  <input
                    type="radio"
                    checked={field.value === true}
                    onChange={() => field.onChange(true)}
                    name="autoAdvanceTurns"
                    id="autoAdvanceTurns_yes"
                  />
                </Pill.Control>
                <Pill.Label htmlFor="autoAdvanceTurns_yes">{t('settings.auto')}</Pill.Label>
              </Pill>

              <Pill>
                <Pill.Control>
                  <input
                    type="radio"
                    checked={field.value === false}
                    onChange={() => field.onChange(false)}
                    name="autoAdvanceTurns"
                    id="autoAdvanceTurns_no"
                  />
                </Pill.Control>
                <Pill.Label htmlFor="autoAdvanceTurns_no">{t('common.manual')}</Pill.Label>
              </Pill>
            </div>
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
            <div className="flex flex-wrap gap-4">
              {localePreferences.map((option) => (
                <Pill key={option}>
                  <Pill.Control>
                    <input
                      type="radio"
                      checked={field.value === option}
                      onChange={() => field.onChange(option)}
                      name={field.name}
                      id={`settingsLocale_${option}`}
                    />
                  </Pill.Control>
                  <Pill.Label htmlFor={`settingsLocale_${option}`}>
                    {localeLabels[option]}
                  </Pill.Label>
                </Pill>
              ))}
            </div>
          </fieldset>
        </Panel>
      )}
    />
  );
}

export function DiceStyleField({ control }: Readonly<SettingsFieldProps>) {
  const { t } = useI18n();

  return (
    <Controller
      name="diceStyle"
      control={control}
      render={({ field, fieldState }) => (
        <Panel>
          <fieldset
            className="grid gap-3"
            aria-invalid={!!fieldState.error || undefined}
          >
            <legend className="contents">{t('settings.diceStyle')}</legend>
            <div className="flex gap-4">
              {diceStyles.map((option) => {
                const id = `${option}_${field.name}`;
                const labelKey =
                  option === 'default'
                    ? 'settings.diceStyle.default'
                    : 'settings.diceStyle.medieval';
                return (
                  <Pill key={option}>
                    <Pill.Control>
                      <input
                        type="radio"
                        value={option}
                        name={field.name}
                        id={id}
                        checked={field.value === option}
                        onChange={() => field.onChange(option)}
                        onBlur={field.onBlur}
                        ref={field.ref}
                      />
                    </Pill.Control>
                    <Pill.Label htmlFor={id}>{t(labelKey)}</Pill.Label>
                  </Pill>
                );
              })}
            </div>
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

            <div className="gap-4 flex">
              {modes.map((option) => {
                const id = `${option}_${field.name}`;

                return (
                  <Pill key={option}>
                    <Pill.Control>
                      <input
                        type="radio"
                        value={option}
                        name={field.name}
                        id={id}
                        checked={field.value === option}
                        onChange={() => field.onChange(option)}
                        onBlur={field.onBlur}
                        ref={field.ref}
                      />
                    </Pill.Control>
                    <Pill.Label
                      htmlFor={id}
                      className="capitalize"
                    >
                      {option}
                    </Pill.Label>
                  </Pill>
                );
              })}
            </div>
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
            <div className="flex gap-4">
              <Pill>
                <Pill.Control>
                  <input
                    type="radio"
                    checked={field.value === true}
                    onChange={() => field.onChange(true)}
                    name="showCombo"
                    id="showCombo_yes"
                  />
                </Pill.Control>
                <Pill.Label htmlFor="showCombo_yes">{t('common.yes')}</Pill.Label>
              </Pill>

              <Pill>
                <Pill.Control>
                  <input
                    type="radio"
                    checked={field.value === false}
                    onChange={() => field.onChange(false)}
                    name="showCombo"
                    id="showCombo_no"
                  />
                </Pill.Control>
                <Pill.Label htmlFor="showCombo_no">{t('common.no')}</Pill.Label>
              </Pill>
            </div>
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
            <div className="flex gap-4">
              <Pill>
                <Pill.Control>
                  <input
                    type="radio"
                    checked={field.value === true}
                    onChange={() => field.onChange(true)}
                    name="tableFeedback"
                    id="tableFeedback_yes"
                  />
                </Pill.Control>
                <Pill.Label htmlFor="tableFeedback_yes">{t('common.on')}</Pill.Label>
              </Pill>

              <Pill>
                <Pill.Control>
                  <input
                    type="radio"
                    checked={field.value === false}
                    onChange={() => field.onChange(false)}
                    name="tableFeedback"
                    id="tableFeedback_no"
                  />
                </Pill.Control>
                <Pill.Label htmlFor="tableFeedback_no">{t('common.off')}</Pill.Label>
              </Pill>
            </div>
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
            <div className="flex gap-4">
              <Pill>
                <Pill.Control>
                  <input
                    type="radio"
                    checked={field.value === true}
                    onChange={() => field.onChange(true)}
                    name="motionEnabled"
                    id="motionEnabled_yes"
                  />
                </Pill.Control>
                <Pill.Label htmlFor="motionEnabled_yes">{t('common.on')}</Pill.Label>
              </Pill>

              <Pill>
                <Pill.Control>
                  <input
                    type="radio"
                    checked={field.value === false}
                    onChange={() => field.onChange(false)}
                    name="motionEnabled"
                    id="motionEnabled_no"
                  />
                </Pill.Control>
                <Pill.Label htmlFor="motionEnabled_no">{t('common.off')}</Pill.Label>
              </Pill>
            </div>
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
            <div className="flex flex-wrap gap-4">
              {themePreferences.map((option) => {
                const id = `theme_${option}`;
                const label =
                  option === 'system'
                    ? t('common.system')
                    : option === 'light'
                      ? t('common.light')
                      : t('common.dark');

                return (
                  <Pill key={option}>
                    <Pill.Control>
                      <input
                        type="radio"
                        checked={field.value === option}
                        onChange={() => field.onChange(option)}
                        name={field.name}
                        id={id}
                      />
                    </Pill.Control>
                    <Pill.Label htmlFor={id}>{label}</Pill.Label>
                  </Pill>
                );
              })}
            </div>
          </fieldset>
        </Panel>
      )}
    />
  );
}
