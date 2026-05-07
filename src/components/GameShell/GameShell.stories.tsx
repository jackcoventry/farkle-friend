import type { Meta, StoryObj } from '@storybook/react-vite';
import GameShell from '@/components/GameShell/GameShell';

const meta: Meta<typeof GameShell> = {
  title: 'Components/Game Shell',
  component: GameShell,
  tags: ['autodocs'],
  args: {},
};
export default meta;

type Story = StoryObj<typeof GameShell>;

const Template: Story = {
  render: (args) => (
    <GameShell {...args}>
      <GameShell.Sidebar>
        <GameShell.SidebarMain>Sidebar</GameShell.SidebarMain>
        <GameShell.SidebarFooter>Footer</GameShell.SidebarFooter>
      </GameShell.Sidebar>
      <GameShell.MobileToolbar>
        <button
          type="button"
          className="rounded-lg bg-white px-md py-xs"
        >
          Turn info
        </button>
      </GameShell.MobileToolbar>
      <GameShell.Body>Body</GameShell.Body>
    </GameShell>
  ),
};

export const Default = {
  ...Template,
  args: {
    sidebarCloseLabel: 'Close sidebar',
    sidebarOpenLabel: 'Open sidebar',
  },
  parameters: {
    layout: 'fullscreen',
  },
};
