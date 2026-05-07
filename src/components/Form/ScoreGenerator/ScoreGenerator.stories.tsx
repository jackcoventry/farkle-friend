import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
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
    const onChange = fn();
    return <ScoreGenerator onChange={onChange} />;
  },
};

export const Default = {
  ...Template,
  args: {},
};
