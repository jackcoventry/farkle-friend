import type { Meta, StoryObj } from "@storybook/react-vite";

import Pill from "@/components/Pill/Pill";

const meta: Meta<typeof Pill> = {
  title: "Components/Pill",
  component: Pill,
  tags: ["autodocs"],
  argTypes: {},
};
export default meta;

type Story = StoryObj<typeof Pill>;

const Template: Story = {
  render: (args) => (
    <div
      style={{
        width: 100,
      }}
    >
      <Pill {...args}>
        <Pill.Control>
          <input id="story-pill" type="checkbox" />
        </Pill.Control>
        <Pill.Label htmlFor="story-pill">Sup</Pill.Label>
      </Pill>
    </div>
  ),
};

export const Default = {
  ...Template,
  args: {},
};
