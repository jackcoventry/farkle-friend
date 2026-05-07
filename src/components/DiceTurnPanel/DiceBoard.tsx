import type { DieValue } from '@/domain/game/dice';
import DiceIcon from '@/components/DiceIcon/DiceIcon';
import { Panel } from '@/components/Panel/Panel';

type DiceBoardProps = {
  currentRoll: DieValue[] | null;
  isFarkled: boolean;
  onToggleDieSelection: (index: number) => void;
  selectedIndices: number[];
};

export function DiceBoard({
  currentRoll,
  isFarkled,
  onToggleDieSelection,
  selectedIndices,
}: Readonly<DiceBoardProps>) {
  return (
    <Panel className="dice-turn-table">
      <div className="items-center h-full flex justify-center overflow-visible">
        {isFarkled ? (
          <div
            role="alert"
            className="animate-bounce-in max-w-[560px] rounded-3xl border-4 border-danger bg-danger-surface p-xl text-center text-danger-contrast shadow-lg"
          >
            <p className="font-sub-heading text-danger">Turn over</p>
            <h2 className="font-heading text-danger">You have been Farkled!</h2>
            <p className="mt-2">No scoring dice were rolled. This turn scores 0 points.</p>
          </div>
        ) : null}

        {!isFarkled && currentRoll ? (
          <div className="flex flex-wrap justify-center gap-sm sm:gap-lg">
            {currentRoll.map((value, idx) => {
              const isSelected = selectedIndices.includes(idx);
              return (
                <button
                  key={`${value}-${idx}`}
                  type="button"
                  onClick={() => onToggleDieSelection(idx)}
                  aria-pressed={isSelected}
                  aria-label={`${isSelected ? 'Deselect' : 'Select'} die ${idx + 1} showing ${value}`}
                  style={{
                    animationDelay: `${idx * 0.05}s`,
                  }}
                  className={`animate-bounce-in w-8 cursor-pointer rounded-lg p-2xs opacity-0 transition-transform hover:z-10 hover:scale-105 sm:w-[100px] ${
                    isSelected ? 'bg-selected ring-4 ring-selected-border' : 'bg-transparent'
                  }`}
                >
                  <DiceIcon
                    count={value}
                    state={isSelected ? 'active' : 'default'}
                  />
                </button>
              );
            })}
          </div>
        ) : null}

        {!isFarkled && !currentRoll ? (
          <div
            className="dice-turn-table__empty | motion-safe:animate-[spin_100s_linear_infinite] border-2 border-dashed border-border rounded-full aspect-square"
            aria-hidden="true"
          />
        ) : null}
      </div>
    </Panel>
  );
}
