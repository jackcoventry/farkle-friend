import type { GameSettings } from "@/domain/game/gameTypes";
import { formatScore } from "@/utils/formatScore";

type GameSetupSummaryProps = {
  onEditSettings?: () => void;
  settings: GameSettings;
};

export function GameSetupSummary({
  onEditSettings,
  settings,
}: Readonly<GameSetupSummaryProps>) {
  const modeLabel =
    settings.mode === "dice" ? "Dice rolling" : "Manual scoring";

  return (
    <section className="rounded-lg bg-white/80 p-3">
      <h3 className="font-heading-2 mb-2">Game setup</h3>
      <dl className="grid gap-2">
        <div className="flex justify-between gap-3">
          <dt>Mode</dt>
          <dd className="text-right text-red-700">{modeLabel}</dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt>Target</dt>
          <dd className="text-right text-red-700">
            {formatScore(settings.targetScore)}
          </dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt>Turn hand-off</dt>
          <dd className="text-right text-red-700">
            {settings.autoAdvanceTurns ? "Auto" : "Manual"}
          </dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt>Combo hints</dt>
          <dd className="text-right text-red-700">
            {settings.showComboSuggestions ? "On" : "Off"}
          </dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt>Feedback</dt>
          <dd className="text-right text-red-700">
            {settings.tableFeedback ? "On" : "Off"}
          </dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt>Animations</dt>
          <dd className="text-right text-red-700">
            {settings.motionEnabled ? "On" : "Off"}
          </dd>
        </div>
      </dl>
      {onEditSettings ? (
        <button
          type="button"
          className="mt-3 rounded-lg px-3 py-2 text-sm text-red-700 hover:bg-red-100 focus-visible:outline-2 focus-visible:outline-red-700"
          onClick={onEditSettings}
        >
          Edit settings
        </button>
      ) : null}
    </section>
  );
}
