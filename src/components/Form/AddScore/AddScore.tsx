'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { DieValue, scoreSelectedDice } from '@/domain/game/dice';
import { AddScoreSchema, type AddScoreSchemaType } from '@/domain/game/formSchemas';
import Modal from '@/components/Modal/Modal';
import { TurnActionCluster } from '@/components/TurnActionCluster/TurnActionCluster';
import ScoreGenerator from '../ScoreGenerator/ScoreGenerator';

export type { AddScoreSchemaType };
export type AddScoreFormResult = {
  message: string;
};

type AddScoreFormProps = {
  onSubmit: SubmitHandler<AddScoreSchemaType>;
};

function AddScoreForm({ onSubmit }: Readonly<AddScoreFormProps>) {
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
  };

  const [showCalculator, setShowCalculator] = React.useState(false);

  const onChange = (selectedItems: DieValue[]) => {
    const score = scoreSelectedDice(selectedItems);
    setValue('value', score, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
    setShowCalculator(false);
  };

  return (
    <>
      <form
        className="dice-turn-main | grid w-full grid-rows-[minmax(0,1fr)_auto] gap-3 sm:h-[calc(50dvh-var(--spacing-7))] xl:h-[calc(100dvh-var(--spacing-7))]"
        onSubmit={handleSubmit(submitHandler)}
      >
        <div className="dice-turn-table | min-h-0 rounded-3xl border border-border p-4">
          <div className="dice-turn-table__play | flex h-full items-center justify-center overflow-hidden">
            <div className="grid w-full max-w-[680px] gap-6 text-center">
              <h2 className="text-text font-heading">
                Enter your score below or use the calculator.
              </h2>

              <Controller
                name="value"
                control={control}
                render={({ field, fieldState }) => (
                  <>
                    <label
                      htmlFor="turn-score"
                      className="sr-only"
                    >
                      Turn score
                    </label>
                    <input
                      id="turn-score"
                      className="border-0 border-b-2 border-border bg-transparent p-4 text-text font-mega w-full text-center appearance-none"
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
                        {fieldState.error.message}
                      </p>
                    ) : null}
                  </>
                )}
              />
            </div>
          </div>
        </div>

        <TurnActionCluster
          ariaLabel="Manual score actions"
          actions={[
            {
              icon: 'rocket',
              label: 'Calculator',
              onClick: () => setShowCalculator(true),
            },
            {
              icon: 'dice',
              label: 'Submit score',
              type: 'submit',
            },
          ]}
        />
      </form>
      <Modal
        isOpen={Boolean(showCalculator)}
        onClose={() => setShowCalculator(false)}
        ariaLabel="Calculate dice score"
        variant="modal"
      >
        <Modal.Body className="grid max-h-dvh h-full mx-auto justify-center bg-surface text-text p-7 rounded-2xl">
          <div className="mb-4 flex justify-end">
            <Modal.CloseButton ariaLabel="Close calculator" />
          </div>
          <ScoreGenerator onChange={onChange} />
        </Modal.Body>
      </Modal>
    </>
  );
}

export default AddScoreForm;
