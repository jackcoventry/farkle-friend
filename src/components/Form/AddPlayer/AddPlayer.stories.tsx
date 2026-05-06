import type { Meta, StoryObj } from '@storybook/react-vite';
import AddPlayer from '@/components/Form/AddPlayer/AddPlayer';

const meta: Meta<typeof AddPlayer> = {
  title: 'Components/Form/Add Player',
  component: AddPlayer,
  tags: ['autodocs'],
  args: {},
};
export default meta;

type Story = StoryObj<typeof AddPlayer>;

const onSubmit = () => {
  console.log('Submit!');
};

const Template: Story = {
  render: () => <AddPlayer onSubmit={onSubmit} />,
};

export const Default = { ...Template, args: {} };
