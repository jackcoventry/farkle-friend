import type { Meta, StoryObj } from '@storybook/react-vite';
import Button from '@/components/Button/Button';
import GameShell from '@/components/GameShell/GameShell';
import PlayerList from '@/components/PlayerList/PlayerList';

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
        <GameShell.SidebarMain>
          <div className="gap-sm grid">
            <p className="font-heading-2">Players</p>
            <PlayerList
              activePlayerId="ada"
              leadingPlayerId="grace"
              targetScore={5000}
              players={[
                { avatar: 3, id: 'ada', totalScore: 1650, username: 'Ada' },
                { avatar: 1, id: 'grace', totalScore: 2400, username: 'Grace' },
                { avatar: 5, id: 'katherine', totalScore: 850, username: 'Katherine' },
              ]}
            />
          </div>
        </GameShell.SidebarMain>
        <GameShell.SidebarFooter>
          <Button
            type="button"
            variant="secondary"
            size="small"
            className="justify-center"
          >
            Game settings
          </Button>
        </GameShell.SidebarFooter>
      </GameShell.Sidebar>
      <GameShell.MobileToolbar>
        <Button
          type="button"
          size="small"
          variant="secondary"
          icon="bank"
        >
          Turn info
        </Button>
        <Button
          type="button"
          size="small"
          icon="dice"
        >
          Roll
        </Button>
      </GameShell.MobileToolbar>
      <GameShell.Body>
        <section className="gap-lg grid max-w-3xl">
          <div className="gap-xs grid">
            <p className="font-heading">Ada&apos;s turn</p>
            <p className="text-text-muted">Select scoring dice, then bank or roll again.</p>
          </div>
          <div className="border-border bg-surface p-xl min-h-80 rounded-3xl border" />
        </section>
      </GameShell.Body>
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
