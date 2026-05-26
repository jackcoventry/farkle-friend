'use client';

import { useI18n } from '@/i18n/I18nProvider';
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
  const { t } = useI18n();

  return (
    <Panel className="dice-turn-table">
      <div className="dice-turn-board-viewport | flex h-full items-center justify-center">
        {isFarkled ? (
          <div
            role="alert"
            className="dice-turn-table__farkle-alert | animate-bounce-in border-danger bg-danger-surface p-xl text-danger-contrast rounded-3xl border-4 text-center shadow-lg"
          >
            <p className="font-sub-heading text-danger">{t('turn.farkledStatus')}</p>
            <h2 className="font-heading text-danger">{t('turn.farkledTitle')}</h2>
            <p className="mt-xs">{t('turn.detail.farkle')}</p>
          </div>
        ) : null}

        {!isFarkled && currentRoll ? (
          <div className="dice-turn-dice-grid | gap-sm sm:gap-lg flex flex-wrap justify-center">
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
                  className={`dice-turn-die-button | animate-bounce-in p-2xs cursor-pointer rounded-lg opacity-0 transition-transform hover:z-10 hover:scale-105 ${
                    isSelected ? 'bg-selected ring-selected-border ring-4' : 'bg-transparent'
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
            className="dice-turn-table__empty | border-border aspect-square rounded-full border-2 border-dashed"
            aria-hidden="true"
          />
        ) : null}
      </div>
    </Panel>
  );
}
