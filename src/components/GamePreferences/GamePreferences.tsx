"use client";

import Button from "@/components/Button/Button";
import Modal from "@/components/Modal/Modal";
import Pill from "@/components/Pill/Pill";
import { useGame } from "@/domain/game/GameProvider";
import type { ThemePreference } from "@/domain/game/gameTypes";
import { useState } from "react";

type GamePreferencesProps = {
  className?: string;
};

export function GamePreferences({ className }: Readonly<GamePreferencesProps>) {
  const { state, dispatch } = useGame();
  const [isOpen, setIsOpen] = useState(false);

  const updatePreferences = (settings: {
    motionEnabled?: boolean;
    tableFeedback?: boolean;
    theme?: ThemePreference;
  }) => {
    dispatch({
      type: "UPDATE_PREFERENCES",
      preferences: {
        motionEnabled:
          settings.motionEnabled ?? state.preferences.motionEnabled,
        tableFeedback:
          settings.tableFeedback ?? state.preferences.tableFeedback,
        theme: settings.theme ?? state.preferences.theme,
      },
    });
  };

  return (
    <>
      <Button
        type="button"
        size="small"
        variant="primary"
        onClick={() => setIsOpen(true)}
        icon="three-dots-vertical"
        iconOnly
        ariaLabel="Preferences"
        className={className}
      >
        Preferences
      </Button>
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        ariaLabel="Game preferences"
      >
        <Modal.Body className="modal-panel modal-panel--narrow">
          <div className="modal-panel__header">
            <Modal.CloseButton ariaLabel="Close preferences" />
          </div>
          <div className="modal-panel__content">
            <div className="grid gap-6">
              <h2 className="font-heading text-center">Preferences</h2>
              <fieldset className="preference-fieldset | grid gap-3 rounded-2xl border border-border bg-surface-muted p-4">
                <legend className="contents">Sound & haptics</legend>
                <div className="flex flex-wrap gap-3">
                  <Pill>
                    <Pill.Control>
                      <input
                        type="radio"
                        checked={state.preferences.tableFeedback}
                        onChange={() =>
                          updatePreferences({ tableFeedback: true })
                        }
                        name="preferenceSound"
                        id="preferenceSound_on"
                      />
                    </Pill.Control>
                    <Pill.Label htmlFor="preferenceSound_on">On</Pill.Label>
                  </Pill>
                  <Pill>
                    <Pill.Control>
                      <input
                        type="radio"
                        checked={!state.preferences.tableFeedback}
                        onChange={() =>
                          updatePreferences({ tableFeedback: false })
                        }
                        name="preferenceSound"
                        id="preferenceSound_off"
                      />
                    </Pill.Control>
                    <Pill.Label htmlFor="preferenceSound_off">Off</Pill.Label>
                  </Pill>
                </div>
              </fieldset>
              <fieldset className="preference-fieldset | grid gap-3 rounded-2xl border border-border bg-surface-muted p-4">
                <legend className="contents">Animations</legend>
                <div className="flex flex-wrap gap-3">
                  <Pill>
                    <Pill.Control>
                      <input
                        type="radio"
                        checked={state.preferences.motionEnabled}
                        onChange={() =>
                          updatePreferences({ motionEnabled: true })
                        }
                        name="preferenceMotion"
                        id="preferenceMotion_on"
                      />
                    </Pill.Control>
                    <Pill.Label htmlFor="preferenceMotion_on">On</Pill.Label>
                  </Pill>
                  <Pill>
                    <Pill.Control>
                      <input
                        type="radio"
                        checked={!state.preferences.motionEnabled}
                        onChange={() =>
                          updatePreferences({ motionEnabled: false })
                        }
                        name="preferenceMotion"
                        id="preferenceMotion_off"
                      />
                    </Pill.Control>
                    <Pill.Label htmlFor="preferenceMotion_off">Off</Pill.Label>
                  </Pill>
                </div>
              </fieldset>
              <fieldset className="preference-fieldset | grid gap-3 rounded-2xl border border-border bg-surface-muted p-4">
                <legend className="contents">Theme</legend>
                <div className="flex flex-wrap gap-3">
                  {(["system", "light", "dark"] as const).map((option) => {
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
                            checked={state.preferences.theme === option}
                            onChange={() => updatePreferences({ theme: option })}
                            name="preferenceTheme"
                            id={`preferenceTheme_${option}`}
                          />
                        </Pill.Control>
                        <Pill.Label htmlFor={`preferenceTheme_${option}`}>
                          {label}
                        </Pill.Label>
                      </Pill>
                    );
                  })}
                </div>
              </fieldset>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}
