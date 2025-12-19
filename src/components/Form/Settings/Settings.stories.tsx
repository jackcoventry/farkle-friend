import type { Meta, StoryObj } from "@storybook/react-vite";

import Settings from "@/components/Form/Settings/Settings";

const meta: Meta<typeof Settings> = {
  title: "Components/Form/Settings",
  component: Settings,
  tags: ["autodocs"],
  args: {},
};
export default meta;

type Story = StoryObj<typeof Settings>;

const onSubmit = () => {
  console.log("Submit!");
};

const Template: Story = {
  render: () => <Settings onSubmit={onSubmit} />,
};

export const Default = { ...Template, args: {} };
