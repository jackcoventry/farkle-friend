"use client";

import Button from "@/components/Button/Button";
import Modal from "@/components/Modal/Modal";
import Pill from "@/components/Pill/Pill";
import { useGame } from "@/domain/game/GameProvider";
import { useState } from "react";

type GamePreferencesProps = {
  className?: string;
};

export function GamePreferences({
  className,
}: Readonly<GamePreferencesProps>) {
  const { state, dispatch } = useGame();
  const [isOpen, setIsOpen] = useState(false);

  const updatePreferences = (settings: {
    motionEnabled?: boolean;
    tableFeedback?: boolean;
  }) => {
    dispatch({
      type: "UPDATE_PREFERENCES",
      preferences: {
        motionEnabled: settings.motionEnabled ?? state.preferences.motionEnabled,
        tableFeedback: settings.tableFeedback ?? state.preferences.tableFeedback,
      },
    });
  };

  return (
    <>
      <div className={className}>
        <Button
          type="button"
          size="small"
          variant="secondary"
          onClick={() => setIsOpen(true)}
        >
          Preferences
        </Button>
      </div>
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        ariaLabel="Game preferences"
      >
        <Modal.Body>
          <div className="w-[min(420px,calc(100dvw-2rem))] rounded-lg bg-white p-4">
            <Modal.CloseButton ariaLabel="Close preferences" />
            <div className="grid gap-5">
              <h2 className="font-heading text-center">Preferences</h2>
              <fieldset className="grid gap-3">
                <legend>Sound & haptics</legend>
                <div className="flex flex-wrap gap-4">
                  <Pill>
                    <Pill.Control>
                      <input
                        type="radio"
                        checked={state.preferences.tableFeedback}
                        onChange={() => updatePreferences({ tableFeedback: true })}
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
              <fieldset className="grid gap-3">
                <legend>Animations</legend>
                <div className="flex flex-wrap gap-4">
                  <Pill>
                    <Pill.Control>
                      <input
                        type="radio"
                        checked={state.preferences.motionEnabled}
                        onChange={() => updatePreferences({ motionEnabled: true })}
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
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}
