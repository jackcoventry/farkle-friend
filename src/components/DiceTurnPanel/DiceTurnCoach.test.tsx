import { renderWithProviders } from '@/test/renderWithProviders';
import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { DiceTurnCoach } from './DiceTurnCoach';

const turnCopy = {
  detail: { key: 'turn.detail.chooseScoringDice' },
  selectedStatus: { key: 'turn.selected.none' },
  title: { key: 'turn.title.chooseScoringDice' },
  tone: 'default',
} as const;

describe('DiceTurnCoach', () => {
  it('announces rolled values before dice are selected', () => {
    renderWithProviders(
      <DiceTurnCoach
        actionHint={{ key: 'turn.action.selectDice' }}
        currentCombos={[]}
        currentRoll={[6, 3, 5, 5, 5, 3]}
        hasSelectedDice={false}
        selectedBreakdown={[]}
        showActionHint
        showComboSuggestions={false}
        showSelectionStatus={false}
        turnCopy={turnCopy}
      />
    );

    expect(screen.getByRole('status')).toHaveTextContent(
      'Rolled 6, 3, 5, 5, 5, 3. Tap dice to select them, or use keys 1-6.'
    );
  });

  it('announces selection guidance without repeating the roll', () => {
    renderWithProviders(
      <DiceTurnCoach
        actionHint={{ key: 'turn.action.bankSelection', values: { score: 50 } }}
        currentCombos={[]}
        currentRoll={[6, 3, 5, 5, 5, 3]}
        hasSelectedDice
        selectedBreakdown={[]}
        showActionHint
        showComboSuggestions={false}
        showSelectionStatus
        turnCopy={{
          ...turnCopy,
          selectedStatus: { key: 'turn.selected.points', values: { score: 50 } },
          title: { key: 'turn.title.bankOrKeepChoosing', values: { score: 50 } },
        }}
      />
    );

    expect(screen.getByRole('status')).toHaveTextContent(
      'Bank 50 or keep choosing. Bank 50 points from this selection, or keep selecting scoring dice.'
    );
    expect(screen.getByRole('status')).not.toHaveTextContent('Rolled');
  });
});
