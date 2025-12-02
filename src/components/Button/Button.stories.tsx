import type { Meta, StoryObj } from "@storybook/react-vite";

import Button from "@/components/Button/Button";

const meta: Meta<typeof Button> = {
  title: "Components/Button",
  component: Button,
  tags: ["autodocs"],
  args: {},
};
export default meta;

type Story = StoryObj<typeof Button>;

const Template: Story = {
  render: () => <Button>Click here</Button>,
};

export const Default = { ...Template, args: {} };
