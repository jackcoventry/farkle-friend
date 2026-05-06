import type { Meta, StoryObj } from '@storybook/react-vite';
import { GameProvider } from '@/domain/game/GameProvider';
import { createInitialGameState } from '@/domain/game/gameLogic';
import { GameStatusBar } from '@/components/GameScreen/GameStatusBar';

const state = {
  ...createInitialGameState(),
  currentPlayerIndex: 0,
  phase: 'IN_PROGRESS' as const,
  players: [
    {
      avatar: 1,
      id: 'ada',
      totalScore: 1200,
      username: 'Ada',
    },
  ],
};

const meta: Meta<typeof GameStatusBar> = {
  title: 'Components/Game Status Bar',
  component: GameStatusBar,
  decorators: [
    (Story) => (
      <GameProvider>
        <div className="bg-gray-800 p-6">
          <Story />
        </div>
      </GameProvider>
    ),
  ],
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof GameStatusBar>;

export const ActiveDiceTurn: Story = {
  args: {
    currentPlayer: state.players[0],
    diceTurnMetrics: {
      diceLeft: 4,
      roundScore: 350,
    },
    flowState: 'TURN_ACTIVE',
    state,
  },
};

export const TurnResult: Story = {
  args: {
    currentPlayer: state.players[0],
    diceTurnMetrics: null,
    flowState: 'TURN_RESULT',
    state: {
      ...state,
      pendingTurnResult: {
        isGameWinner: false,
        newTotal: 1550,
        nextPlayerId: 'grace',
        playerId: 'ada',
        previousTotal: 1200,
        score: 350,
      },
    },
  },
};
