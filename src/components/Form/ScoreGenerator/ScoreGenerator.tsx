import React from 'react';
import { DieValue, scoreSelectedDice } from '@/domain/game/dice';
import Button from '@/components/Button/Button';
import DiceIcon from '@/components/DiceIcon/DiceIcon';

type ScoreGeneratorProps = {
  onChange: (selectedItems: DieValue[]) => void;
};

function ScoreGenerator({ onChange }: Readonly<ScoreGeneratorProps>) {
  const dies = Array.from({ length: 6 }, (_, i) => (i + 1) as DieValue);
  const [selectedItems, setSelectedItems] = React.useState<DieValue[]>([]);
  const [clicked, setClicked] = React.useState<DieValue>();
  const selectedScore = scoreSelectedDice(selectedItems);

  const handleClick = (die: DieValue) => {
    setClicked(die);
    setSelectedItems([...selectedItems, die]);
    setTimeout(() => setClicked(undefined), 200);
  };

  const handleSubmit = () => {
    onChange(selectedItems);
    setSelectedItems([]);
  };

  return (
    <div className="grid gap-5">
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
            <p className="text-sm text-text-muted">No dice selected</p>
          )}
        </div>

        <p
          className="font-heading-2"
          aria-live="polite"
        >
          Score preview: {selectedScore}
        </p>

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
            disabled={selectedItems.length === 0}
            onClick={handleSubmit}
          >
            Save selection
          </Button>
        </div>
      </div>
    </div>
  );
}
export default ScoreGenerator;
