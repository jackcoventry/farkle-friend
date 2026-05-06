import type { Meta, StoryObj } from '@storybook/react-vite';
import { TurnResultPanel } from '@/components/TurnResultPanel/TurnResultPanel';

const currentPlayer = {
  avatar: 1,
  id: 'ada',
  username: 'Ada',
};

const nextPlayer = {
  avatar: 2,
  id: 'grace',
  username: 'Grace',
};

const meta: Meta<typeof TurnResultPanel> = {
  title: 'Components/Turn Result Panel',
  component: TurnResultPanel,
  tags: ['autodocs'],
  args: {
    currentPlayer,
    nextPlayer,
    onAdvanceTurn: () => {},
    result: {
      isGameWinner: false,
      newTotal: 1550,
      nextPlayerId: 'grace',
      playerId: 'ada',
      previousTotal: 1200,
      score: 350,
    },
  },
};
export default meta;

type Story = StoryObj<typeof TurnResultPanel>;

export const Default: Story = {};

export const AutoAdvance: Story = {
  args: {
    autoAdvance: true,
  },
};

export const Winner: Story = {
  args: {
    result: {
      isGameWinner: true,
      newTotal: 10000,
      nextPlayerId: 'grace',
      playerId: 'ada',
      previousTotal: 9600,
      score: 400,
    },
  },
};
