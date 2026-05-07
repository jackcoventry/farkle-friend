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
      <h3 className="font-heading-2 mb-xs">Game setup</h3>
      <dl className="gap-xs grid">
        <div className="gap-sm flex justify-between">
          <dt>Mode</dt>
          <dd className="score-chip text-right">{modeLabel}</dd>
        </div>
        <div className="gap-sm flex justify-between">
          <dt>Target</dt>
          <dd className="score-chip text-right">{formatScore(settings.targetScore)}</dd>
        </div>
        <div className="gap-sm flex justify-between">
          <dt>Turn hand-off</dt>
          <dd className="score-chip text-right">{settings.autoAdvanceTurns ? 'Auto' : 'Manual'}</dd>
        </div>
        <div className="gap-sm flex justify-between">
          <dt>Combo hints</dt>
          <dd className="score-chip text-right">{settings.showComboSuggestions ? 'On' : 'Off'}</dd>
        </div>
        <div className="gap-sm flex justify-between">
          <dt>Feedback</dt>
          <dd className="score-chip text-right">{preferences.tableFeedback ? 'On' : 'Off'}</dd>
        </div>
        <div className="gap-sm flex justify-between">
          <dt>Animations</dt>
          <dd className="score-chip text-right">{preferences.motionEnabled ? 'On' : 'Off'}</dd>
        </div>
        <div className="gap-sm flex justify-between">
          <dt>Theme</dt>
          <dd className="score-chip text-right">
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
          className="mt-sm ml-auto"
          onClick={onEditSettings}
          size="small"
        >
          Edit settings
        </Button>
      ) : null}
    </Panel>
  );
}
