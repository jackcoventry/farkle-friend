'use client';

import { useI18n } from '@/i18n/I18nProvider';
import { formatScore } from '@/utils/formatScore';
import type { GamePreferences, GameSettings } from '@/domain/game/gameTypes';
import { Button } from '@/components/Button/Button';
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
  const { t } = useI18n();
  const modeLabel = settings.mode === 'dice' ? t('setup.diceRolling') : t('setup.manualScoring');

  return (
    <Panel>
      <h3 className="font-heading-2 mb-xs">{t('setup.gameSetup')}</h3>
      <dl className="gap-xs grid">
        <div className="gap-sm flex justify-between">
          <dt>{t('settings.mode')}</dt>
          <dd className="text-accent text-right">{modeLabel}</dd>
        </div>
        <div className="gap-sm flex justify-between">
          <dt>{t('setup.target')}</dt>
          <dd className="text-accent text-right">{formatScore(settings.targetScore)}</dd>
        </div>
        <div className="gap-sm flex justify-between">
          <dt>{t('settings.turnHandOff')}</dt>
          <dd className="text-accent text-right">
            {settings.autoAdvanceTurns ? t('settings.auto') : t('common.manual')}
          </dd>
        </div>
        <div className="gap-sm flex justify-between">
          <dt>{t('setup.comboHints')}</dt>
          <dd className="text-accent text-right">
            {settings.showComboSuggestions ? t('common.on') : t('common.off')}
          </dd>
        </div>
        <div className="gap-sm flex justify-between">
          <dt>{t('setup.feedback')}</dt>
          <dd className="text-accent text-right">
            {preferences.tableFeedback ? t('common.on') : t('common.off')}
          </dd>
        </div>
        <div className="gap-sm flex justify-between">
          <dt>{t('preferences.animations')}</dt>
          <dd className="text-accent text-right">
            {preferences.motionEnabled ? t('common.on') : t('common.off')}
          </dd>
        </div>
        <div className="gap-sm flex justify-between">
          <dt>{t('common.theme')}</dt>
          <dd className="text-accent text-right">
            {preferences.theme === 'system'
              ? t('common.system')
              : preferences.theme === 'light'
                ? t('common.light')
                : t('common.dark')}
          </dd>
        </div>
      </dl>
      {onEditSettings ? (
        <Button
          className="mt-sm ml-auto"
          onClick={onEditSettings}
          size="small"
        >
          {t('actions.editSettings')}
        </Button>
      ) : null}
    </Panel>
  );
}
