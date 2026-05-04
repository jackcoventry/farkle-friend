import type { GamePreferences, GameSettings } from "@/domain/game/gameTypes";
import { formatScore } from "@/utils/formatScore";
import Button from "@/components/Button/Button";
import { Panel } from "@/components/Panel/Panel";

type GameSetupSummaryProps = {
  onEditSettings?: () => void;
  preferences: GamePreferences;
  settings: GameSettings;
};

export function GameSetupSummary({
  onEditSettings,
  preferences,
  settings,
}: Readonly<GameSetupSummaryProps>) {
  const modeLabel =
    settings.mode === "dice" ? "Dice rolling" : "Manual scoring";

  return (
    <Panel>
      <h3 className="font-heading-2 mb-2">Game setup</h3>
      <dl className="grid gap-2">
        <div className="flex justify-between gap-3">
          <dt>Mode</dt>
          <dd className="text-right text-pink-300">{modeLabel}</dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt>Target</dt>
          <dd className="text-right text-pink-300">
            {formatScore(settings.targetScore)}
          </dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt>Turn hand-off</dt>
          <dd className="text-right text-pink-300">
            {settings.autoAdvanceTurns ? "Auto" : "Manual"}
          </dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt>Combo hints</dt>
          <dd className="text-right text-pink-300">
            {settings.showComboSuggestions ? "On" : "Off"}
          </dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt>Feedback</dt>
          <dd className="text-right text-pink-300">
            {preferences.tableFeedback ? "On" : "Off"}
          </dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt>Animations</dt>
          <dd className="text-right text-pink-300">
            {preferences.motionEnabled ? "On" : "Off"}
          </dd>
        </div>
      </dl>
      {onEditSettings ? (
        <Button className="mt-3 ml-auto" onClick={onEditSettings} size="small">
          Edit settings
        </Button>
      ) : null}
    </Panel>
  );
}
