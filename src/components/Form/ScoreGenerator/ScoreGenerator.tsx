import React from 'react';
import {
  DieValue,
  scoreSelectedDiceWithUsage,
} from '@/domain/game/dice';
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
    <div className={`grid gap-5${className ? ` ${className}` : ''}`}>
      <div className="grid grid-cols-3 gap-5 mx-auto h-[200px] w-[300px]">
        {dies.map((die) => {
          const classes = `enabled:hover:opacity-50 enabled:hover:scale-110 enabled:cursor-pointer transition-transform disabled:grayscale-50 disabled:cursor-not-allowed ${die === clicked ? 'enabled:hover:scale-120 ' : ''}`;
          return (
            <button
              key={die}
              type="button"
              onClick={() => handleClick(die)}
              disabled={selectedItems.length >= 6}
              className={classes}
              aria-label={`Add die showing ${die}`}
            >
              <DiceIcon
                count={die}
                className="w-full"
              />
            </button>
          );
        })}
      </div>

      <div className="grid gap-4 rounded-2xl border border-border bg-surface p-4 text-center">
        <div className="min-h-12">
          {selectedItems.length > 0 ? (
            <ul
              className="flex flex-wrap justify-center gap-2"
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
            <p className="text-sm text-text-muted">Choose scoring dice for this go</p>
          )}
        </div>

        <p
          className="font-heading-2"
          aria-live="polite"
        >
          Current go: {selectedScore}
        </p>
        {selectedItems.length > 0 && !selectionIsValid ? (
          <p className="field-error" role="alert">
            Only add dice that are part of the scoring combination.
          </p>
        ) : null}

        <div className="flex flex-wrap justify-center gap-3">
          <Button
            type="button"
            variant="secondary"
            disabled={selectedItems.length === 0}
            onClick={() => setSelectedItems([])}
          >
            Clear
          </Button>
          <Button
            type="button"
            disabled={!selectionIsValid}
            onClick={handleAddGo}
          >
            Add go
          </Button>
        </div>
      </div>

      <div className="grid gap-4 rounded-2xl border border-border bg-surface p-4">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <h2 className="font-heading-2">Round total</h2>
          <p className="font-heading-2" aria-live="polite">
            {roundTotal}
          </p>
        </div>

        {sequenceItems.length > 0 ? (
          <ol className="grid gap-3">
            {sequenceItems.map((item, index) => (
              <li
                key={item.id}
                className="grid gap-2 rounded-lg border border-border p-3 sm:grid-cols-[auto_1fr_auto] sm:items-center"
              >
                <span className="font-body-1">Go {index + 1}</span>
                <span className="flex flex-wrap gap-1" aria-label={`Dice for go ${index + 1}`}>
                  {item.dice.map((die, dieIndex) => (
                    <span key={`${item.id}-${die}-${dieIndex}`} className="w-6">
                      <DiceIcon count={die} />
                    </span>
                  ))}
                </span>
                <span className="font-body-1">{item.score}</span>
              </li>
            ))}
          </ol>
        ) : (
          <p className="text-sm text-text-muted">Added goes will appear here.</p>
        )}

      </div>
    </div>
  );
}
export default ScoreGenerator;
