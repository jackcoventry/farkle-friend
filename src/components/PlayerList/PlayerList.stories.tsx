import type { Meta, StoryObj } from "@storybook/react-vite";

import PlayerList from "@/components/PlayerList/PlayerList";

const meta: Meta<typeof PlayerList> = {
  title: "Components/Player List",
  component: PlayerList,
  tags: ["autodocs"],
  args: {
    players: [],
  },
};
export default meta;

type Story = StoryObj<typeof PlayerList>;

function data(showScores: boolean = false) {
  return [
    {
      playerId: "1",
      username: "Wallace",
      avatar: 3,
      ...(showScores
        ? {
            totalScore: 300,
          }
        : null),
    },
    {
      playerId: "2",
      username: "Gromit",
      avatar: 1,
      ...(showScores
        ? {
            totalScore: 1000,
          }
        : null),
    },
  ];
}

const players = data();
const playersWithScores = data(true);

console.log(playersWithScores);

const Template: Story = {
  render: (args) => <PlayerList {...args} />,
};

export const Default = {
  ...Template,
  args: {
    players,
  },
  parameters: {
    layout: "fullscreen",
  },
};

export const WithScores = {
  ...Template,
  args: {
    players: playersWithScores,
  },
  parameters: {
    layout: "fullscreen",
  },
};

export const WithScoresAndActive = {
  ...Template,
  args: {
    players: playersWithScores,
    activePlayerId: "1",
  },
  parameters: {
    layout: "fullscreen",
  },
};
