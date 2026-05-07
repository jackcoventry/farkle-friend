import { useI18n } from '@/i18n/I18nProvider';
import { sortDiceValues, type ScoreBreakdownItem, type ScoringCombo } from '@/domain/game/dice';
import type { DiceTurnCopy, DiceTurnText } from '@/domain/game/diceTurnPresenter';
import DiceIcon from '@/components/DiceIcon/DiceIcon';
import { Panel } from '@/components/Panel/Panel';

type DiceTurnCoachProps = {
  actionHint: DiceTurnText | null;
  actionHintId?: string;
  currentCombos: ScoringCombo[];
  selectedBreakdown: ScoreBreakdownItem[];
  showActionHint: boolean;
  showComboSuggestions: boolean;
  showSelectionStatus: boolean;
  turnCopy: DiceTurnCopy;
};

export function DiceTurnCoach({
  actionHint,
  actionHintId,
  currentCombos,
  selectedBreakdown,
  showActionHint,
  showComboSuggestions,
  showSelectionStatus,
  turnCopy,
}: Readonly<DiceTurnCoachProps>) {
  const { t } = useI18n();
  const title = t(turnCopy.title.key, turnCopy.title.values);
  const detail = t(turnCopy.detail.key, turnCopy.detail.values);
  const selectedStatus = t(turnCopy.selectedStatus.key, turnCopy.selectedStatus.values);
  const translatedActionHint = actionHint ? t(actionHint.key, actionHint.values) : null;

  return (
    <>
      <Panel
        className="dice-turn-table__coach-panel | gap-4 flex flex-wrap"
        aria-label="Turn status"
      >
        <p
          className="sr-only"
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          {translatedActionHint ? `${title}. ${translatedActionHint}` : title}
        </p>
        <div className="min-w-0 flex flex-col gap-2">
          <p className="font-heading-2">{title}</p>
          <p className="text-sm">{detail}</p>
        </div>
        {showSelectionStatus ? (
          <div className="rounded-lg bg-accent px-3 py-2 text-sm text-accent-contrast">
            <span className="font-body-1">{t('turn.selection')}</span> <span>{selectedStatus}</span>
          </div>
        ) : null}
        {selectedBreakdown.length > 0 ? (
          <ul className="flex flex-wrap gap-4 text-sm">
            {selectedBreakdown.map((item) => (
              <li
                key={`${item.label}-${item.score}`}
                className="rounded-full bg-control px-3 py-1 text-control-text"
              >
                {item.label} = {item.score}
              </li>
            ))}
          </ul>
        ) : null}
        {showActionHint ? (
          <p
            id={actionHintId}
            className="text-sm font-body-1"
          >
            {translatedActionHint}
          </p>
        ) : null}
      </Panel>

      {showComboSuggestions && currentCombos.length > 0 ? (
        <Panel
          className="dice-turn-table__coach-panel"
          aria-label="Scoring combinations"
        >
          <p className="font-body-1">{t('turn.comboSuggestions')}</p>
          <ul className="mt-2 grid gap-1 text-sm">
            {currentCombos.slice(0, 5).map((combo, index) => (
              <li
                key={index}
                className="grid w-full grid-cols-2"
              >
                <span className="flex gap-1">
                  {sortDiceValues(combo.dice).map((die, dieIndex) => (
                    <DiceIcon
                      key={`${die}-${dieIndex}`}
                      count={die}
                      className="w-6"
                    />
                  ))}
                </span>
                <span className="text-right text-accent">
                  {t('turn.pts', { score: combo.score })}
                </span>
              </li>
            ))}
          </ul>
        </Panel>
      ) : null}
    </>
  );
}
