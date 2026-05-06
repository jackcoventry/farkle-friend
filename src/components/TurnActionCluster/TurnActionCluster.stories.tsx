import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { TurnActionCluster } from '@/components/TurnActionCluster/TurnActionCluster';

const meta: Meta<typeof TurnActionCluster> = {
  title: 'Components/Turn Action Cluster',
  component: TurnActionCluster,
  tags: ['autodocs'],
  args: {
    ariaLabel: 'Story turn actions',
    actions: [
      {
        icon: 'dice',
        label: 'Roll',
        onClick: fn(),
      },
      {
        disabled: true,
        icon: 'bank',
        label: 'Bank',
        onClick: fn(),
      },
      {
        icon: 'rocket',
        label: 'End turn',
        onClick: fn(),
      },
    ],
  },
};

export default meta;

type Story = StoryObj<typeof TurnActionCluster>;

export const Default: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole('button', { name: 'Roll' }));
    await expect(args.actions[0].onClick).toHaveBeenCalled();
    await expect(canvas.getByRole('button', { name: 'Bank' })).toBeDisabled();
    await userEvent.click(canvas.getByRole('button', { name: 'End turn' }));
    await expect(args.actions[2].onClick).toHaveBeenCalled();
  },
};
