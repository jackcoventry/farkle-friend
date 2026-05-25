'use client';

import { useI18n } from '@/i18n/I18nProvider';
import { translateValidationMessage } from '@/i18n/validation';
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { Controller, SubmitHandler, useForm, useWatch } from 'react-hook-form';
import { AddScoreSchema, type AddScoreSchemaType } from '@/domain/game/formSchemas';
import Button from '@/components/Button/Button';
import '@/components/DiceTurnPanel/DiceTurnPanel.css';
import ScoreGenerator from '@/components/Form/ScoreGenerator/ScoreGenerator';
import Modal from '@/components/Modal/Modal';
import { TurnActionCluster } from '@/components/TurnActionCluster/TurnActionCluster';

export type { AddScoreSchemaType };
export type AddScoreFormResult = {
  message: string;
};

type AddScoreFormProps = {
  onSubmit: SubmitHandler<AddScoreSchemaType>;
};

function AddScoreForm({ onSubmit }: Readonly<AddScoreFormProps>) {
  const { t } = useI18n();
  const formId = React.useId();
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

  const [showManualEntry, setShowManualEntry] = React.useState(false);
  const [scoreGeneratorResetKey, setScoreGeneratorResetKey] = React.useState(0);
  const scoreValue = useWatch({ control, name: 'value' }) ?? 0;

  const onChange = React.useCallback(
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
          <div className="dice-turn-table__play | flex h-full items-start justify-center overflow-auto">
            <div className="dice-turn-table__play | gap-lg grid w-full text-center">
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
                className="pb-xs"
                onChange={onChange}
                resetKey={scoreGeneratorResetKey}
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
              onClick: () => setShowManualEntry(true),
            },
            {
              disabled: scoreValue === 0,
              icon: 'cancel',
              label: t('actions.reset'),
              onClick: handleResetTotal,
            },
            {
              icon: 'rocket',
              label: t('actions.submit'),
              type: 'submit',
            },
          ]}
        />
      </form>
      <Modal
        isOpen={Boolean(showManualEntry)}
        onClose={() => setShowManualEntry(false)}
        ariaLabel={t('manualScore.enterManually')}
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
              <p> {t('manualScore.enterRoundScore')}</p>
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
                      placeholder="Enter your score..."
                      data-valid={errors?.value ? 'false' : 'true'}
                      aria-invalid={fieldState.error ? 'true' : undefined}
                      aria-describedby={fieldState.error ? 'turn-score-error' : undefined}
                      type="number"
                      min={0}
                      onChange={(value) => field.onChange(value.target.valueAsNumber)}
                      value={field.value}
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

export default AddScoreForm;
