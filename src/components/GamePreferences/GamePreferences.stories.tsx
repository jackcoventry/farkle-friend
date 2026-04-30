import type { Meta, StoryObj } from "@storybook/react-vite";

import { GamePreferences } from "@/components/GamePreferences/GamePreferences";
import { GameProvider } from "@/domain/game/GameProvider";

const meta: Meta<typeof GamePreferences> = {
  title: "Components/Game Preferences",
  component: GamePreferences,
  decorators: [
    (Story) => (
      <GameProvider>
        <Story />
      </GameProvider>
    ),
  ],
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj<typeof GamePreferences>;

export const Default: Story = {
  args: {
    className: "flex",
  },
};
