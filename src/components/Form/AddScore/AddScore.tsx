'use client';

import { useI18n } from '@/i18n/I18nProvider';
import { translateValidationMessage } from '@/i18n/validation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useId, useState } from 'react';
import { Controller, SubmitHandler, useForm, useWatch } from 'react-hook-form';
import { AddScoreSchema, type AddScoreSchemaType } from '@/domain/game/formSchemas';
import { Button } from '@/components/Button/Button';
import '@/components/DiceTurnPanel/DiceTurnPanel.css';
import { ScoreGenerator } from '@/components/Form/ScoreGenerator/ScoreGenerator';
import { Modal } from '@/components/Modal/Modal';
import { TurnActionCluster } from '@/components/TurnActionCluster/TurnActionCluster';
import './AddScore.css';

export type { AddScoreSchemaType };
export type AddScoreFormResult = {
  message: string;
};

type AddScoreFormProps = {
  onSubmit: SubmitHandler<AddScoreSchemaType>;
  playerName: string;
};

export function AddScoreForm({ onSubmit, playerName }: Readonly<AddScoreFormProps>) {
  const { t } = useI18n();
  const formId = useId();
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<AddScoreSchemaType>({
    resolver: zodResolver(AddScoreSchema),
    defaultValues: {
      value: 0,
    },
    mode: 'onChange',
  });

  const submitHandler = (data: { value: number }) => {
    onSubmit(data);
    reset();
    setScoreGeneratorResetKey((current) => current + 1);
    setShowManualEntry(false);
  };

  const [showManualEntry, setShowManualEntry] = useState(false);
  const [scoreGeneratorResetKey, setScoreGeneratorResetKey] = useState(0);
  const scoreValue = useWatch({ control, name: 'value' }) ?? 0;

  const onChange = useCallback(
    (score: number) => {
      setValue('value', score, {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      });
    },
    [setValue]
  );

  const handleResetTotal = () => {
    setScoreGeneratorResetKey((current) => current + 1);
    setValue('value', 0, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  };

  return (
    <>
      <form
        id={formId}
        className="dice-turn-main | gap-sm grid h-full min-h-0 w-full"
        onSubmit={handleSubmit(submitHandler)}
      >
        <div className="dice-turn-table | border-border p-md min-h-0 overflow-hidden rounded-3xl border">
          <div className="manual-score-panel__scroll | mx-auto flex h-full items-start justify-center overflow-auto">
            <div className="manual-score-panel__content | gap-lg px-lg grid w-full text-center">
              <div className="gap-2xs grid">
                <h2 className="text-text font-heading">{t('manualScore.buildRoundScore')}</h2>
                <p
                  className="text-text-muted text-sm"
                  aria-live="polite"
                >
                  {t('manualScore.ready', { score: scoreValue })}
                </p>
              </div>
              <ScoreGenerator
                key={scoreGeneratorResetKey}
                className="pb-xs"
                onChange={onChange}
              />
            </div>
          </div>
        </div>

        <TurnActionCluster
          ariaLabel="Manual score actions"
          actions={[
            {
              icon: 'dice',
              label: t('actions.manual'),
              ariaLabel: t('actions.manual'),
              onClick: () => setShowManualEntry(true),
            },
            {
              disabled: scoreValue === 0,
              icon: 'cancel',
              label: t('actions.reset'),
              ariaLabel: t('actions.reset'),
              onClick: handleResetTotal,
            },
            {
              icon: 'rocket',
              label: t('actions.submit'),
              ariaLabel: t('actions.submit'),
              type: 'submit',
            },
          ]}
        />
      </form>
      <Modal
        isOpen={Boolean(showManualEntry)}
        onClose={() => setShowManualEntry(false)}
        ariaLabel={t('manualScore.enterManuallyFor', { player: playerName })}
        variant="modal"
      >
        <Modal.Panel size="narrow">
          <Modal.Header>
            <Modal.Title className="text-text font-heading">
              {t('manualScore.enterManuallyTitle')}
            </Modal.Title>
            <Modal.CloseButton ariaLabel={t('manualScore.closeManualEntry')} />
          </Modal.Header>
          <Modal.Content>
            <div className="gap-xl grid text-center">
              <p>{t('manualScore.enterRoundScoreFor', { player: playerName })}</p>
              <Controller
                name="value"
                control={control}
                render={({ field, fieldState }) => (
                  <>
                    <label
                      htmlFor="turn-score"
                      className="sr-only"
                    >
                      {t('manualScore.turnScore')}
                    </label>
                    <input
                      id="turn-score"
                      className="border-border p-md text-text font-title-1 w-full appearance-none border-0 border-b-2 bg-transparent text-center"
                      {...field}
                      placeholder={t('manualScore.scorePlaceholder')}
                      data-valid={errors?.value ? 'false' : 'true'}
                      aria-invalid={fieldState.error ? 'true' : undefined}
                      aria-describedby={fieldState.error ? 'turn-score-error' : undefined}
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      onChange={(event) => {
                        const nextValue = event.target.value;
                        if (!/^\d*$/.test(nextValue)) return;
                        field.onChange(nextValue === '' ? 0 : Number(nextValue));
                      }}
                      value={field.value === 0 ? '' : String(field.value)}
                    />
                    {fieldState.error ? (
                      <p
                        id="turn-score-error"
                        className="field-error"
                        role="alert"
                      >
                        {translateValidationMessage(t, fieldState.error.message)}
                      </p>
                    ) : null}
                  </>
                )}
              />
              <Button
                type="submit"
                form={formId}
              >
                {t('actions.submitScore')}
              </Button>
            </div>
          </Modal.Content>
        </Modal.Panel>
      </Modal>
    </>
  );
}
