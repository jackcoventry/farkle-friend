import type { Meta, StoryObj } from "@storybook/react-vite";

import NextPlayerSplash from "@/components/NextPlayerSplash/NextPlayerSplash";

const meta: Meta<typeof NextPlayerSplash> = {
  title: "Components/Next Player Splash",
  component: NextPlayerSplash,
  tags: ["autodocs"],
  args: {
    player: {
      id: "asdfasdf",
      username: "Wallace",
      avatar: 1,
      totalScore: 1000,
    },
  },
};
export default meta;

type Story = StoryObj<typeof NextPlayerSplash>;

const Template: Story = {
  render: (args) => (
    <div>
      <NextPlayerSplash {...args} />
    </div>
  ),
};

export const Default = {
  ...Template,
  args: {},
};
