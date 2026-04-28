import type { GameSettings } from "@/domain/game/gameTypes";
import { formatScore } from "@/utils/formatScore";

type GameSetupSummaryProps = {
  settings: GameSettings;
};

export function GameSetupSummary({
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
          <dd className="text-right text-red-600">{modeLabel}</dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt>Target</dt>
          <dd className="text-right text-red-600">
            {formatScore(settings.targetScore)}
          </dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt>Combo hints</dt>
          <dd className="text-right text-red-600">
            {settings.showComboSuggestions ? "On" : "Off"}
          </dd>
        </div>
      </dl>
    </section>
  );
}
