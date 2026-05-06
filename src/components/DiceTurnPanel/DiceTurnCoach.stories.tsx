import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ScoreBreakdownItem, ScoringCombo } from '@/domain/game/dice';
import type { DiceTurnCopy } from '@/domain/game/diceTurnPresenter';
import { DiceTurnCoach } from '@/components/DiceTurnPanel/DiceTurnCoach';
import { DiceTurnInfoModal } from '@/components/DiceTurnPanel/DiceTurnInfoModal';
import { ModalStackProvider } from '@/components/Modal/ModalStackContext';
import './DiceTurnPanel.css';

type CoachStoryArgs = {
  actionHint: string | null;
  currentCombos: ScoringCombo[];
  isModalOpen: boolean;
  selectedBreakdown: ScoreBreakdownItem[];
  showActionHint: boolean;
  showComboSuggestions: boolean;
  showSelectionStatus: boolean;
  turnCopy: DiceTurnCopy;
};

function CoachStory({ isModalOpen, ...args }: Readonly<CoachStoryArgs>) {
  if (isModalOpen) {
    return (
      <ModalStackProvider>
        <DiceTurnInfoModal
          isOpen
          onClose={() => {}}
        >
          <DiceTurnCoach {...args} />
        </DiceTurnInfoModal>
      </ModalStackProvider>
    );
  }

  return (
    <div className="dice-turn-table__coach max-w-sm">
      <DiceTurnCoach {...args} />
    </div>
  );
}

const meta: Meta<typeof CoachStory> = {
  title: 'Components/Dice Turn Coach',
  component: CoachStory,
  tags: ['autodocs'],
  args: {
    actionHint: 'Tap dice to select them, or use keys 1-6.',
    currentCombos: [
      { dice: [1], indices: [0], score: 100 },
      { dice: [5], indices: [3], score: 50 },
      { dice: [1, 5], indices: [0, 3], score: 150 },
    ],
    isModalOpen: false,
    selectedBreakdown: [],
    showActionHint: true,
    showComboSuggestions: true,
    showSelectionStatus: false,
    turnCopy: {
      detail: 'Select dice that score, then bank them.',
      selectedStatus: 'No dice selected.',
      title: 'Choose scoring dice',
      tone: 'default',
    },
  },
};

export default meta;

type Story = StoryObj<typeof CoachStory>;

export const Default: Story = {};

export const InvalidSelection: Story = {
  args: {
    actionHint: 'Deselect any dice that do not score before banking this selection.',
    showSelectionStatus: true,
    turnCopy: {
      detail: 'Every selected die must be part of a scoring combination.',
      selectedStatus: 'Selection includes dice that do not score.',
      title: 'Choose only scoring dice',
      tone: 'warning',
    },
  },
};

export const HotDice: Story = {
  args: {
    actionHint: 'Roll all six again, or end the turn with your current score.',
    selectedBreakdown: [{ label: 'Straight', score: 1500 }],
    showSelectionStatus: true,
    turnCopy: {
      detail: 'All dice scored. Roll all six again or end your turn.',
      selectedStatus: '1500 points selected.',
      title: 'Hot dice!',
      tone: 'success',
    },
  },
};

export const Farkle: Story = {
  args: {
    actionHint: 'End the turn to score 0 and move to the next player.',
    currentCombos: [],
    showComboSuggestions: false,
    showSelectionStatus: true,
    turnCopy: {
      detail: 'No scoring dice were rolled. This turn scores 0 points.',
      selectedStatus: 'Farkle. End the turn to score 0.',
      title: 'This turn scores 0',
      tone: 'danger',
    },
  },
};

export const MobileCoachModal: Story = {
  args: {
    isModalOpen: true,
  },
  parameters: {
    layout: 'fullscreen',
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};
