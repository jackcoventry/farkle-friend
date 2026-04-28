"use client";

import Modal from "@/components/Modal/Modal";
import RichButton from "@/components/RichButton/RichButton";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import z from "zod";
import ScoreGenerator from "../ScoreGenerator/ScoreGenerator";
import { DieValue, scoreSelectedDice } from "@/domain/game/dice";

const AddScoreSchema = z.object({
  value: z.number().min(0, {
    message: `Enter a valid number, or zero if you were farkled!`,
  }),
});

export type AddScoreSchemaType = z.infer<typeof AddScoreSchema>;
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
    mode: "onChange",
  });

  const submitHandler = (data: { value: number }) => {
    onSubmit(data);
    reset();
  };

  const [showCalculator, setShowCalculator] = React.useState(false);

  const onChange = (selectedItems: DieValue[]) => {
    const score = scoreSelectedDice(selectedItems);
    setValue("value", score, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
    setShowCalculator(false);
  };

  return (
    <>
      <form
        className="turn-frame | grid gap-3 h-full"
        onSubmit={handleSubmit(submitHandler)}
      >
        <div>
          <h2 className="text-white font-heading">
            Enter your score below or use the calculator!
          </h2>
        </div>

        <div className="flex items-center">
          <Controller
            name="value"
            control={control}
            render={({ field }) => (
              <>
                <label htmlFor="turn-score" className="sr-only">
                  Turn score
                </label>
                <input
                  id="turn-score"
                  className="border-0 border-b-2 p-4 text-white font-mega w-full text-center appearance-none"
                  {...field}
                  placeholder="Enter your score..."
                  data-valid={errors?.value ? "false" : "true"}
                  type="number"
                  min={0}
                  onChange={(value) =>
                    field.onChange(value.target.valueAsNumber)
                  }
                  value={field.value}
                />
              </>
            )}
          />
        </div>

        <div className="w-full flex justify-center gap-4">
          <RichButton
            className="justify-center"
            icon="rocket"
            onClick={() => setShowCalculator(true)}
          >
            Calculator
          </RichButton>
          <RichButton type="submit" className="justify-center" icon="dice">
            Submit score
          </RichButton>
        </div>
      </form>
      <Modal
        isOpen={Boolean(showCalculator)}
        ariaLabel="Calculate dice score"
        variant="modal"
      >
        <Modal.Body className="grid max-h-dvh h-full mx-auto justify-center bg-white p-7 rounded-2xl">
          <ScoreGenerator onChange={onChange} />
        </Modal.Body>
      </Modal>
    </>
  );
}

export default AddScoreForm;
