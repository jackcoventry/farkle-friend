import type { Meta, StoryObj } from "@storybook/react-vite";

import GameShell from "@/components/GameShell/GameShell";

const meta: Meta<typeof GameShell> = {
  title: "Components/Game Shell",
  component: GameShell,
  tags: ["autodocs"],
  args: {},
};
export default meta;

type Story = StoryObj<typeof GameShell>;

const Template: Story = {
  render: () => (
    <GameShell>
      <GameShell.Sidebar>Sidebar</GameShell.Sidebar>
      <GameShell.Body>Body</GameShell.Body>
    </GameShell>
  ),
};

export const Default = {
  ...Template,
  args: {},
  parameters: {
    layout: "fullscreen",
  },
};
