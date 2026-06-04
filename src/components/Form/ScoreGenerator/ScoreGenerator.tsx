import { useI18n } from '@/i18n/I18nProvider';
import { useEffect, useRef, useState } from 'react';
import { DieValue, scoreSelectedDiceWithUsage, sortDiceValues } from '@/domain/game/dice';
import { Button } from '@/components/Button/Button';
import { DiceIcon } from '@/components/DiceIcon/DiceIcon';
import './ScoreGenerator.css';

type ScoreGeneratorProps = {
  className?: string;
  onChange: (score: number) => void;
};

type ScoreSequenceItem = {
  dice: DieValue[];
  id: number;
  score: number;
};

export function ScoreGenerator({ className, onChange }: Readonly<ScoreGeneratorProps>) {
  const { t } = useI18n();
  const dies = Array.from({ length: 6 }, (_, i) => (i + 1) as DieValue);
  const nextSequenceIdRef = useRef(0);
  const [selectedItems, setSelectedItems] = useState<DieValue[]>([]);
  const [sequenceItems, setSequenceItems] = useState<ScoreSequenceItem[]>([]);
  const [clicked, setClicked] = useState<DieValue>();
  const [selectionAnnouncement, setSelectionAnnouncement] = useState('');
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

  useEffect(() => {
    onChange(roundTotal);
  }, [onChange, roundTotal]);

  const handleClick = (die: DieValue) => {
    const nextSelectedItems = [...selectedItems, die];
    const nextScore = scoreSelectedDiceWithUsage(nextSelectedItems).score;

    setClicked(die);
    setSelectedItems(nextSelectedItems);
    setSelectionAnnouncement(t('scoreGenerator.currentGo', { score: nextScore }));
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
    setSelectionAnnouncement('');
  };

  return (
    <div className={`gap-lg grid ${className ?? ''}`}>
      <div className="score-generator__dice-grid | gap-lg mx-auto grid w-full grid-cols-6">
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

      <div className="gap-md border-border bg-surface p-md grid rounded-2xl border text-center">
        {selectedItems.length > 0 ? (
          <div className="min-h-12">
            <ul
              className="gap-xs flex flex-wrap justify-center"
              aria-label={t('scoreGenerator.selectedDice')}
            >
              {selectedItems.map((die, index) => (
                <li
                  key={`${die}-${index}`}
                  className="w-6"
                >
                  <DiceIcon count={die} />
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        <p className="font-heading-2">{t('scoreGenerator.currentGo', { score: selectedScore })}</p>
        <p
          className="sr-only"
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          {selectionAnnouncement}
        </p>
        {selectedItems.length > 0 && !selectionIsValid ? (
          <p
            className="field-error"
            role="alert"
          >
            {t('scoreGenerator.invalidSelection')}
          </p>
        ) : null}

        <div className="gap-sm flex flex-wrap justify-center">
          <Button
            type="button"
            variant="secondary"
            disabled={selectedItems.length === 0}
            onClick={() => {
              setSelectedItems([]);
              setSelectionAnnouncement('');
            }}
            size="small"
          >
            {t('actions.clear')}
          </Button>
          <Button
            type="button"
            disabled={!selectionIsValid}
            onClick={handleAddGo}
            size="small"
          >
            {t('actions.addGo')}
          </Button>
        </div>
      </div>

      {sequenceItems.length > 0 ? (
        <div className="gap-md border-border bg-surface p-md grid rounded-2xl border">
          <ol className="gap-sm grid">
            {sequenceItems.map((item, index) => (
              <li
                key={item.id}
                className="score-generator__history-item | gap-xs border-border p-sm grid rounded-lg border sm:items-center"
              >
                <span className="font-body-2">
                  {t('scoreGenerator.goLabel', { index: index + 1 })}
                </span>
                <span
                  className="gap-2xs flex flex-wrap"
                  aria-label={`Dice for throw ${index + 1}`}
                >
                  {sortDiceValues(item.dice).map((die, dieIndex) => (
                    <span
                      key={`${item.id}-${die}-${dieIndex}`}
                      className="w-7"
                    >
                      <DiceIcon count={die} />
                    </span>
                  ))}
                </span>
                <span className="font-body-1 text-right">{item.score}</span>
              </li>
            ))}
          </ol>
          <p className="font-heading-2 text-right">
            {t('scoreGenerator.roundTotal')}: {roundTotal}
          </p>
        </div>
      ) : null}
    </div>
  );
}
