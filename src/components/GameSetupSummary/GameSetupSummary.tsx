import { formatScore } from '@/utils/formatScore';
import type { GamePreferences, GameSettings } from '@/domain/game/gameTypes';
import Button from '@/components/Button/Button';
import { Panel } from '@/components/Panel/Panel';

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
  const modeLabel = settings.mode === 'dice' ? 'Dice rolling' : 'Manual scoring';

  return (
    <Panel>
      <h3 className="font-heading-2 mb-2">Game setup</h3>
      <dl className="grid gap-xs">
        <div className="flex justify-between gap-sm">
          <dt>Mode</dt>
          <dd className="text-right score-chip">{modeLabel}</dd>
        </div>
        <div className="flex justify-between gap-sm">
          <dt>Target</dt>
          <dd className="text-right score-chip">{formatScore(settings.targetScore)}</dd>
        </div>
        <div className="flex justify-between gap-sm">
          <dt>Turn hand-off</dt>
          <dd className="text-right score-chip">{settings.autoAdvanceTurns ? 'Auto' : 'Manual'}</dd>
        </div>
        <div className="flex justify-between gap-sm">
          <dt>Combo hints</dt>
          <dd className="text-right score-chip">{settings.showComboSuggestions ? 'On' : 'Off'}</dd>
        </div>
        <div className="flex justify-between gap-sm">
          <dt>Feedback</dt>
          <dd className="text-right score-chip">{preferences.tableFeedback ? 'On' : 'Off'}</dd>
        </div>
        <div className="flex justify-between gap-sm">
          <dt>Animations</dt>
          <dd className="text-right score-chip">{preferences.motionEnabled ? 'On' : 'Off'}</dd>
        </div>
        <div className="flex justify-between gap-sm">
          <dt>Theme</dt>
          <dd className="text-right score-chip">
            {preferences.theme === 'system'
              ? 'System'
              : preferences.theme === 'light'
                ? 'Light'
                : 'Dark'}
          </dd>
        </div>
      </dl>
      {onEditSettings ? (
        <Button
          className="mt-3 ml-auto"
          onClick={onEditSettings}
          size="small"
        >
          Edit settings
        </Button>
      ) : null}
    </Panel>
  );
}
