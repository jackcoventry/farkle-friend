import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { AddPlayerForm } from '@/components/Form/AddPlayer/AddPlayer';

const meta: Meta<typeof AddPlayerForm> = {
  title: 'Components/Form/Add Player',
  component: AddPlayerForm,
  tags: ['autodocs'],
  args: {},
};
export default meta;

type Story = StoryObj<typeof AddPlayerForm>;

const onSubmit = fn();

const Template: Story = {
  render: () => (
    <main className="bg-canvas p-lg min-h-dvh">
      <AddPlayerForm onSubmit={onSubmit} />
    </main>
  ),
};

export const Default = {
  ...Template,
  args: {},
  parameters: {
    layout: 'fullscreen',
  },
};
