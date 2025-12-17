import type { Meta, StoryObj } from "@storybook/react-vite";

import RulesInfo from "@/components/RulesInfo/RulesInfo";

const meta: Meta<typeof RulesInfo> = {
  title: "Components/Rules Info",
  component: RulesInfo,
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj<typeof RulesInfo>;

const Template: Story = {
  render: (args) => (
    <div>
      <RulesInfo />
    </div>
  ),
};

export const Default = {
  ...Template,
  args: {},
};
