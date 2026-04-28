"use client";

import Button from "@/components/Button/Button";
import Pill from "@/components/Pill/Pill";
import { useGame } from "@/domain/game/GameProvider";
import { DiceStyle, GameMode } from "@/domain/game/gameTypes";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import z from "zod";

export const diceStyles = ["default", "medieval"] as const;
export const modes = ["dice", "manual"] as const;
const targetScorePresets = [5000, 10000, 20000] as const;
const minTargetScore = 500;
const maxTargetScore = 50000;

const SettingsFormSchema = z.object({
  diceStyle: z.enum(diceStyles),
  mode: z.enum(modes),
  targetScore: z
    .number()
    .int("Target score must be a whole number.")
    .min(minTargetScore, `Target score must be at least ${minTargetScore}.`)
    .max(maxTargetScore, `Target score must be ${maxTargetScore} or less.`),
  showComboSuggestions: z.boolean(),
});

export type SettingsFormSchemaType = z.infer<typeof SettingsFormSchema>;
export type SettingsFormResult = {
  message: string;
};

type SettingsFormProps = {
  onSubmit: SubmitHandler<SettingsFormSchemaType>;
};

function Settings({ onSubmit }: Readonly<SettingsFormProps>) {
  const { state } = useGame();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<SettingsFormSchemaType>({
    resolver: zodResolver(SettingsFormSchema),
    defaultValues: {
      diceStyle: state.settings.diceStyle,
      mode: state.settings.mode,
      targetScore: state.settings.targetScore,
      showComboSuggestions: state.settings.showComboSuggestions,
    },
    mode: "onBlur",
  });

  const submitHandler = (data: {
    diceStyle: DiceStyle;
    mode: GameMode;
    targetScore: number;
    showComboSuggestions: boolean;
  }) => {
    onSubmit(data);
    reset();
  };

  return (
    <div className="form-wrapper | border-sun-300 border-1 p-6 rounded-lg bg-white self-center">
      <form
        className="form | gap-6 flex flex-col"
        onSubmit={handleSubmit(submitHandler)}
      >
        <h2 className="font-heading text-center">Settings</h2>
        <Controller
          name="diceStyle"
          control={control}
          render={({ field, fieldState }) => (
            <fieldset aria-invalid={!!fieldState.error || undefined}>
              <legend className="mb-4">Dice Style</legend>

              <div className="gap-4 grid grid-cols-3">
                {diceStyles.map((option) => {
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
                      <Pill.Label htmlFor={id}>{option}</Pill.Label>
                    </Pill>
                  );
                })}
              </div>

              {fieldState.error && <p>{fieldState.error.message}</p>}
            </fieldset>
          )}
        />

        <Controller
          name="mode"
          control={control}
          render={({ field, fieldState }) => (
            <fieldset aria-invalid={!!fieldState.error || undefined}>
              <legend className="mb-4">Mode</legend>

              <div className="gap-4 grid grid-cols-3">
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
                      <Pill.Label htmlFor={id}>{option}</Pill.Label>
                    </Pill>
                  );
                })}
              </div>

              {fieldState.error && <p>{fieldState.error.message}</p>}
            </fieldset>
          )}
        />

        <Controller
          name="targetScore"
          control={control}
          render={({ field, fieldState }) => (
            <div className="grid gap-3">
              <label htmlFor="target-score">Point target</label>
              <input
                id="target-score"
                className={`border-1 py-4 px-5 rounded-4xl ${errors?.targetScore ? "border-red-500" : "border-gray-800"}`}
                {...field}
                placeholder="Enter target score..."
                data-valid={errors?.targetScore ? "false" : "true"}
                aria-invalid={fieldState.error ? "true" : undefined}
                aria-describedby={
                  fieldState.error ? "target-score-error" : undefined
                }
                type="number"
                min={minTargetScore}
                max={maxTargetScore}
                step={50}
                onChange={(value) => field.onChange(value.target.valueAsNumber)}
              />

              <div className="flex flex-wrap gap-2">
                {targetScorePresets.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    className="rounded-lg border border-gray-800 px-3 py-2 hover:bg-gray-100"
                    onClick={() =>
                      setValue("targetScore", preset, {
                        shouldDirty: true,
                        shouldTouch: true,
                        shouldValidate: true,
                      })
                    }
                  >
                    {preset.toLocaleString()}
                  </button>
                ))}
              </div>

              {fieldState.error ? (
                <p id="target-score-error" className="text-red-700">
                  {fieldState.error.message}
                </p>
              ) : null}
            </div>
          )}
        />

        <Controller
          control={control}
          name="showComboSuggestions"
          render={({ field }) => (
            <fieldset className="grid gap-3">
              <legend>Show combo suggestions</legend>
              <div className="flex flex-wrap gap-4">
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
                  <Pill.Label htmlFor="showCombo_yes">Yes</Pill.Label>
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
                  <Pill.Label htmlFor="showCombo_no">No</Pill.Label>
                </Pill>
              </div>
            </fieldset>
          )}
        />

        <Button type="submit" className="justify-center">
          Save
        </Button>
      </form>
    </div>
  );
}

export default Settings;
