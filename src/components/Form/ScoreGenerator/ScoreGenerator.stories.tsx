import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { ScoreGenerator } from './ScoreGenerator';

const meta: Meta<typeof ScoreGenerator> = {
  title: 'Components/Form/Score Generator',
  component: ScoreGenerator,
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof ScoreGenerator>;

const Template: Story = {
  render: () => {
    const onChange = fn();
    return (
      <main className="bg-canvas p-lg min-h-dvh">
        <div className="max-w-[640px]">
          <ScoreGenerator onChange={onChange} />
        </div>
      </main>
    );
  },
};

export const Default = {
  ...Template,
  args: {},
  parameters: {
    layout: 'fullscreen',
  },
};
