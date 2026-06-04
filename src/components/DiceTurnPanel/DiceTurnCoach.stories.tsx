import type { Meta, StoryObj } from '@storybook/react-vite';
import type { DieValue, ScoreBreakdownItem, ScoringCombo } from '@/domain/game/dice';
import type { DiceTurnCopy, DiceTurnText } from '@/domain/game/diceTurnPresenter';
import { DiceTurnCoach } from '@/components/DiceTurnPanel/DiceTurnCoach';
import { DiceTurnInfoModal } from '@/components/DiceTurnPanel/DiceTurnInfoModal';
import { ModalStackProvider } from '@/components/Modal/ModalStackContext';
import './DiceTurnPanel.css';

type CoachStoryArgs = {
  actionHint: DiceTurnText | null;
  currentCombos: ScoringCombo[];
  currentRoll: DieValue[] | null;
  hasSelectedDice: boolean;
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
    <div className="dice-turn-table__coach gap-lg flex max-w-sm flex-col">
      <DiceTurnCoach {...args} />
    </div>
  );
}

const meta: Meta<typeof CoachStory> = {
  title: 'Components/Dice Turn Coach',
  component: CoachStory,
  tags: ['autodocs'],
  args: {
    actionHint: { key: 'turn.action.selectDice' },
    currentCombos: [
      { dice: [1], indices: [0], score: 100 },
      { dice: [5], indices: [3], score: 50 },
      { dice: [1, 5], indices: [0, 3], score: 150 },
    ],
    currentRoll: [1, 2, 3, 4, 5, 6],
    hasSelectedDice: false,
    isModalOpen: false,
    selectedBreakdown: [],
    showActionHint: true,
    showComboSuggestions: true,
    showSelectionStatus: false,
    turnCopy: {
      detail: { key: 'turn.detail.chooseScoringDice' },
      selectedStatus: { key: 'turn.selected.none' },
      title: { key: 'turn.title.chooseScoringDice' },
      tone: 'default',
    },
  },
};

export default meta;

type Story = StoryObj<typeof CoachStory>;

export const Default: Story = {};

export const InvalidSelection: Story = {
  args: {
    actionHint: { key: 'turn.action.deselectInvalid' },
    hasSelectedDice: true,
    showSelectionStatus: true,
    turnCopy: {
      detail: { key: 'turn.detail.invalidSelection' },
      selectedStatus: { key: 'turn.selected.invalid' },
      title: { key: 'turn.title.chooseOnlyScoringDice' },
      tone: 'warning',
    },
  },
};

export const HotDice: Story = {
  args: {
    actionHint: { key: 'turn.detail.hotDice' },
    currentRoll: null,
    selectedBreakdown: [{ label: 'Straight', score: 1500 }],
    showSelectionStatus: true,
    turnCopy: {
      detail: { key: 'turn.detail.hotDice' },
      selectedStatus: { key: 'turn.selected.points', values: { score: 1500 } },
      title: { key: 'turn.title.hotDice' },
      tone: 'success',
    },
  },
};

export const Farkle: Story = {
  args: {
    actionHint: { key: 'turn.action.endFarkle' },
    currentCombos: [],
    currentRoll: [2, 2, 3, 3, 4, 6],
    showComboSuggestions: false,
    showSelectionStatus: true,
    turnCopy: {
      detail: { key: 'turn.detail.farkle' },
      selectedStatus: { key: 'turn.selectedStatus.farkle' },
      title: { key: 'turn.title.farkle' },
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
