import type { Meta, StoryObj } from '@storybook/react-vite';
import { DieValue, scoreSelectedDice } from '@/domain/game/dice';
import ScoreGenerator from './ScoreGenerator';

const meta: Meta<typeof ScoreGenerator> = {
  title: 'Components/ScoreGenerator',
  component: ScoreGenerator,
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof ScoreGenerator>;

const Template: Story = {
  render: () => {
    const onChange = (selectedItems: number[]) => {
      console.log('Selected items:', selectedItems);
      console.log('Score', scoreSelectedDice(selectedItems as DieValue[]));
    };
    return <ScoreGenerator onChange={onChange} />;
  },
};

export const Default = {
  ...Template,
  args: {},
};
