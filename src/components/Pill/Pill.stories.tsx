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
        display: "flex",
        flexWrap: "wrap",
        gap: "1rem",
      }}
    >
      <Pill {...args}>
        <Pill.Control>
          <input
            defaultChecked
            id="story-pill-radio"
            name="story-pill"
            type="radio"
          />
        </Pill.Control>
        <Pill.Label htmlFor="story-pill-radio">Auto</Pill.Label>
      </Pill>
      <Pill {...args}>
        <Pill.Control>
          <input
            id="story-pill-radio-manual"
            name="story-pill"
            type="radio"
          />
        </Pill.Control>
        <Pill.Label htmlFor="story-pill-radio-manual">Manual</Pill.Label>
      </Pill>
      <Pill {...args}>
        <Pill.Control>
          <input id="story-pill-checkbox" type="checkbox" />
        </Pill.Control>
        <Pill.Label htmlFor="story-pill-checkbox">Checkbox</Pill.Label>
      </Pill>
    </div>
  ),
};

export const Default = {
  ...Template,
  args: {},
};
