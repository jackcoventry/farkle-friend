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

const SettingsFormSchema = z.object({
  diceStyle: z.enum(diceStyles),
  mode: z.enum(modes),
  targetScore: z.number(),
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
          render={({ field }) => (
            <>
              <label>Point target</label>
              <input
                className={`border-1 py-4 px-5 rounded-4xl ${errors?.targetScore ? "border-red-500" : "border-gray-800"}`}
                {...field}
                placeholder="Enter your name..."
                data-valid={errors?.targetScore ? "false" : "true"}
                type="number"
                onChange={(value) => field.onChange(value.target.valueAsNumber)}
              />
            </>
          )}
        />

        <Controller
          control={control}
          name="showComboSuggestions"
          render={({ field }) => (
            <>
              <p>Show combo suggestions</p>
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
            </>
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
