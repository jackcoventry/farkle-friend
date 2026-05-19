import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { DiceTurnActions } from '@/components/DiceTurnPanel/DiceTurnActions';
import './DiceTurnPanel.css';

const meta: Meta<typeof DiceTurnActions> = {
  title: 'Components/Dice Turn Actions',
  component: DiceTurnActions,
  tags: ['autodocs'],
  args: {
    actionHintId: undefined,
    canBank: false,
    canFinish: false,
    canRoll: true,
    onBank: fn(),
    onFinish: fn(),
    onRoll: fn(),
  },
  decorators: [
    (Story) => (
      <div className="max-w-xl">
        <Story />
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof DiceTurnActions>;

export const ReadyToRoll: Story = {};

export const SelectionReady: Story = {
  args: {
    canBank: true,
    canFinish: true,
    canRoll: false,
  },
};

export const Farkled: Story = {
  args: {
    canBank: false,
    canFinish: true,
    canRoll: false,
  },
};
