import { useI18n } from '@/i18n/I18nProvider';
import React from 'react';
import { DieValue, scoreSelectedDiceWithUsage, sortDiceValues } from '@/domain/game/dice';
import Button from '@/components/Button/Button';
import DiceIcon from '@/components/DiceIcon/DiceIcon';

type ScoreGeneratorProps = {
  className?: string;
  onChange: (score: number) => void;
  resetKey?: number;
};

type ScoreSequenceItem = {
  dice: DieValue[];
  id: number;
  score: number;
};

function ScoreGenerator({ className, onChange, resetKey = 0 }: Readonly<ScoreGeneratorProps>) {
  const { t } = useI18n();
  const dies = Array.from({ length: 6 }, (_, i) => (i + 1) as DieValue);
  const nextSequenceIdRef = React.useRef(0);
  const [selectedItems, setSelectedItems] = React.useState<DieValue[]>([]);
  const [sequenceItems, setSequenceItems] = React.useState<ScoreSequenceItem[]>([]);
  const [clicked, setClicked] = React.useState<DieValue>();
  const selectedScoring =
    selectedItems.length > 0
      ? scoreSelectedDiceWithUsage(selectedItems)
      : { score: 0, usedCount: 0 };
  const selectedScore = selectedScoring.score;
  const selectionIsValid =
    selectedItems.length > 0 &&
    selectedScore > 0 &&
    selectedScoring.usedCount === selectedItems.length;
  const roundTotal = sequenceItems.reduce((total, item) => total + item.score, 0);

  React.useEffect(() => {
    onChange(roundTotal);
  }, [onChange, roundTotal]);

  React.useEffect(() => {
    setSequenceItems([]);
    setSelectedItems([]);
  }, [resetKey]);

  const handleClick = (die: DieValue) => {
    setClicked(die);
    setSelectedItems([...selectedItems, die]);
    setTimeout(() => setClicked(undefined), 200);
  };

  const handleAddGo = () => {
    if (!selectionIsValid) return;

    setSequenceItems((current) => [
      ...current,
      {
        dice: selectedItems,
        id: nextSequenceIdRef.current++,
        score: selectedScore,
      },
    ]);
    setSelectedItems([]);
  };

  return (
    <div className={`grid gap-lg ${className ? ` ${className}` : ''}`}>
      <div className="grid grid-cols-3 gap-lg mx-auto h-[200px] w-[300px]">
        {dies.map((die) => {
          const classes = `enabled:hover:opacity-50 enabled:hover:scale-110 enabled:cursor-pointer transition-transform disabled:grayscale-50 disabled:cursor-not-allowed ${die === clicked ? 'enabled:hover:scale-120 ' : ''}`;
          return (
            <button
              key={die}
              type="button"
              onClick={() => handleClick(die)}
              disabled={selectedItems.length >= 6}
              className={classes}
              aria-label={t('scoreGenerator.addDie', { value: die })}
            >
              <DiceIcon
                count={die}
                className="w-full"
              />
            </button>
          );
        })}
      </div>

      <div className="grid gap-md rounded-2xl border border-border bg-surface p-4 text-center">
        <div className="min-h-12">
          {selectedItems.length > 0 ? (
            <ul
              className="flex flex-wrap justify-center gap-xs"
              aria-label="Selected dice"
            >
              {selectedItems.map((die, index) => (
                <li
                  key={`${die}-${index}`}
                  className="w-7"
                >
                  <DiceIcon count={die} />
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-text-muted">{t('scoreGenerator.chooseScoringDice')}</p>
          )}
        </div>

        <p
          className="font-heading-2"
          aria-live="polite"
        >
          {t('scoreGenerator.currentGo', { score: selectedScore })}
        </p>
        {selectedItems.length > 0 && !selectionIsValid ? (
          <p
            className="field-error"
            role="alert"
          >
            {t('scoreGenerator.invalidSelection')}
          </p>
        ) : null}

        <div className="flex flex-wrap justify-center gap-sm">
          <Button
            type="button"
            variant="secondary"
            disabled={selectedItems.length === 0}
            onClick={() => setSelectedItems([])}
          >
            {t('actions.clear')}
          </Button>
          <Button
            type="button"
            disabled={!selectionIsValid}
            onClick={handleAddGo}
          >
            {t('actions.addGo')}
          </Button>
        </div>
      </div>

      <div className="grid gap-md rounded-2xl border border-border bg-surface p-4">
        <div className="flex flex-wrap items-baseline justify-between gap-sm">
          <h2 className="font-heading-2">{t('scoreGenerator.roundTotal')}</h2>
          <p
            className="font-heading-2"
            aria-live="polite"
          >
            {roundTotal}
          </p>
        </div>

        {sequenceItems.length > 0 ? (
          <ol className="grid gap-sm">
            {sequenceItems.map((item, index) => (
              <li
                key={item.id}
                className="grid gap-xs rounded-lg border border-border p-3 sm:grid-cols-[auto_1fr_auto] sm:items-center"
              >
                <span className="font-body-1">
                  {t('scoreGenerator.goLabel', { index: index + 1 })}
                </span>
                <span
                  className="flex flex-wrap gap-2xs"
                  aria-label={`Dice for go ${index + 1}`}
                >
                  {sortDiceValues(item.dice).map((die, dieIndex) => (
                    <span
                      key={`${item.id}-${die}-${dieIndex}`}
                      className="w-6"
                    >
                      <DiceIcon count={die} />
                    </span>
                  ))}
                </span>
                <span className="font-body-1">{item.score}</span>
              </li>
            ))}
          </ol>
        ) : (
          <p className="text-sm text-text-muted">{t('scoreGenerator.addedGoesEmpty')}</p>
        )}
      </div>
    </div>
  );
}
export default ScoreGenerator;
