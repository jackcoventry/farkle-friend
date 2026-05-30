import type { Meta, StoryObj } from '@storybook/react-vite';
import { PlayerList } from '@/components/PlayerList/PlayerList';

const meta: Meta<typeof PlayerList> = {
  title: 'Components/Player List',
  component: PlayerList,
  tags: ['autodocs'],
  args: {
    players: [],
  },
};
export default meta;

type Story = StoryObj<typeof PlayerList>;

function data(showScores: boolean = false) {
  return [
    {
      id: '1',
      username: 'Ada',
      avatar: 3,
      ...(showScores
        ? {
            totalScore: 1650,
          }
        : null),
    },
    {
      id: '2',
      username: 'Grace',
      avatar: 1,
      ...(showScores
        ? {
            totalScore: 2400,
          }
        : null),
    },
    {
      id: '3',
      username: 'Katherine',
      avatar: 5,
      ...(showScores
        ? {
            totalScore: 850,
          }
        : null),
    },
  ];
}

const players = data();
const playersWithScores = data(true);

const Template: Story = {
  render: (args) => (
    <div className="bg-canvas p-lg max-w-xl">
      <PlayerList {...args} />
    </div>
  ),
};

export const Lobby = {
  ...Template,
  args: {
    players,
  },
  parameters: {
    layout: 'fullscreen',
  },
};

export const Scoreboard = {
  ...Template,
  args: {
    players: playersWithScores,
    leadingPlayerId: '2',
    targetScore: 5000,
  },
  parameters: {
    layout: 'fullscreen',
  },
};

export const ActiveTurn = {
  ...Template,
  args: {
    players: playersWithScores,
    activePlayerId: '1',
    leadingPlayerId: '2',
    targetScore: 5000,
  },
  parameters: {
    layout: 'fullscreen',
  },
};
