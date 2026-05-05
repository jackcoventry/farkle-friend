"use client";

import Button from "@/components/Button/Button";
import { Panel } from "@/components/Panel/Panel";
import Pill from "@/components/Pill/Pill";
import { useGame } from "@/domain/game/GameProvider";
import { DiceStyle, GameMode, ThemePreference } from "@/domain/game/gameTypes";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import z from "zod";

export const diceStyles = ["default", "medieval"] as const;
export const modes = ["dice", "manual"] as const;
export const themePreferences = ["system", "light", "dark"] as const;
const targetScorePresets = [2500, 5000, 10000] as const;
const minTargetScore = 500;
const maxTargetScore = 50000;

const SettingsFormSchema = z.object({
  autoAdvanceTurns: z.boolean(),
  diceStyle: z.enum(diceStyles),
  mode: z.enum(modes),
  motionEnabled: z.boolean(),
  targetScore: z
    .number()
    .int("Target score must be a whole number.")
    .min(minTargetScore, `Target score must be at least ${minTargetScore}.`)
    .max(maxTargetScore, `Target score must be ${maxTargetScore} or less.`),
  showComboSuggestions: z.boolean(),
  tableFeedback: z.boolean(),
  theme: z.enum(themePreferences),
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
      autoAdvanceTurns: state.settings.autoAdvanceTurns,
      diceStyle: state.settings.diceStyle,
      mode: state.settings.mode,
      motionEnabled: state.preferences.motionEnabled,
      targetScore: state.settings.targetScore,
      showComboSuggestions: state.settings.showComboSuggestions,
      tableFeedback: state.preferences.tableFeedback,
      theme: state.preferences.theme,
    },
    mode: "onBlur",
  });

  const submitHandler = (data: {
    autoAdvanceTurns: boolean;
    diceStyle: DiceStyle;
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
    <div className="form-wrapper | border-accent border p-6 rounded-4xl bg-surface self-center">
      <form
        className="form | gap-6 flex flex-col"
        onSubmit={handleSubmit(submitHandler)}
      >
        <h2 className="font-heading-2 text-text">Settings</h2>
        <Controller
          control={control}
          name="autoAdvanceTurns"
          render={({ field }) => (
            <Panel>
              <fieldset className="grid gap-3">
                <legend className="contents">Turn hand-off</legend>
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
                    <Pill.Label htmlFor="autoAdvanceTurns_yes">Auto</Pill.Label>
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
                    <Pill.Label htmlFor="autoAdvanceTurns_no">
                      Manual
                    </Pill.Label>
                  </Pill>
                </div>
              </fieldset>
            </Panel>
          )}
        />

        <Controller
          name="diceStyle"
          control={control}
          render={({ field, fieldState }) => (
            <Panel>
              <fieldset
                className="grid gap-3"
                aria-invalid={!!fieldState.error || undefined}
              >
                <legend className="contents">Dice Style</legend>
                <div className="flex gap-4">
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
              </fieldset>
            </Panel>
          )}
        />

        <Controller
          name="mode"
          control={control}
          render={({ field, fieldState }) => (
            <Panel>
              <fieldset
                className="grid gap-3"
                aria-invalid={!!fieldState.error || undefined}
              >
                <legend className="contents">Mode</legend>

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
                        <Pill.Label htmlFor={id}>{option}</Pill.Label>
                      </Pill>
                    );
                  })}
                </div>
              </fieldset>
            </Panel>
          )}
        />

        <Controller
          name="targetScore"
          control={control}
          render={({ field, fieldState }) => (
            <Panel>
              <div className="grid gap-3">
                <label htmlFor="target-score">Point target</label>
                <input
                  id="target-score"
                  className="field-control"
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
                  onChange={(value) =>
                    field.onChange(value.target.valueAsNumber)
                  }
                />

                <div className="flex gap-2">
                  {targetScorePresets.map((preset) => (
                    <Button
                      key={preset}
                      type="button"
                      size="small"
                      onClick={() =>
                        setValue("targetScore", preset, {
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
                  <p id="target-score-error" className="field-error">
                    {fieldState.error.message}
                  </p>
                ) : null}
              </div>
            </Panel>
          )}
        />

        <Controller
          control={control}
          name="showComboSuggestions"
          render={({ field }) => (
            <Panel>
              <fieldset className="grid gap-3">
                <legend className="contents">Show combo suggestions</legend>
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
            </Panel>
          )}
        />

        <Controller
          control={control}
          name="tableFeedback"
          render={({ field }) => (
            <Panel>
              <fieldset className="grid gap-3">
                <legend className="contents">Sound & haptics</legend>
                <p className="text-sm">
                  Adds restrained roll, bank, and Farkle feedback when your
                  browser allows it.
                </p>
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
                    <Pill.Label htmlFor="tableFeedback_yes">On</Pill.Label>
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
                    <Pill.Label htmlFor="tableFeedback_no">Off</Pill.Label>
                  </Pill>
                </div>
              </fieldset>
            </Panel>
          )}
        />

        <Controller
          control={control}
          name="motionEnabled"
          render={({ field }) => (
            <Panel>
              <fieldset className="grid gap-3">
                <legend className="contents">Animations</legend>
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
                    <Pill.Label htmlFor="motionEnabled_yes">On</Pill.Label>
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
                    <Pill.Label htmlFor="motionEnabled_no">Off</Pill.Label>
                  </Pill>
                </div>
              </fieldset>
            </Panel>
          )}
        />

        <Controller
          control={control}
          name="theme"
          render={({ field }) => (
            <Panel>
              <fieldset className="grid gap-3">
                <legend className="contents">Theme</legend>
                <div className="flex flex-wrap gap-4">
                  {themePreferences.map((option) => {
                    const id = `theme_${option}`;
                    const label =
                      option === "system"
                        ? "System"
                        : option === "light"
                          ? "Light"
                          : "Dark";

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

        <Button type="submit" className="justify-center">
          Save
        </Button>
      </form>
    </div>
  );
}

export default Settings;
