import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import AddPlayer from '@/components/Form/AddPlayer/AddPlayer';

const meta: Meta<typeof AddPlayer> = {
  title: 'Components/Form/Add Player',
  component: AddPlayer,
  tags: ['autodocs'],
  args: {},
};
export default meta;

type Story = StoryObj<typeof AddPlayer>;

const onSubmit = fn();

const Template: Story = {
  render: () => (
    <main className="bg-canvas p-lg min-h-dvh">
      <AddPlayer onSubmit={onSubmit} />
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
