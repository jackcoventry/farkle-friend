import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Settings } from '@/components/Form/Settings/Settings';

const meta: Meta<typeof Settings> = {
  title: 'Components/Form/Settings',
  component: Settings,
  tags: ['autodocs'],
  args: {},
};
export default meta;

type Story = StoryObj<typeof Settings>;

const onSubmit = fn();

const Template: Story = {
  render: () => (
    <main className="bg-canvas p-lg min-h-dvh">
      <Settings onSubmit={onSubmit} />
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
