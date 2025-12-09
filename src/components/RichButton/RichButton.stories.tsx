import type { Meta, StoryObj } from "@storybook/react-vite";
import RichButton from "@/components/RichButton/RichButton";

const meta: Meta<typeof RichButton> = {
  title: "Components/Rich Button",
  component: RichButton,
  tags: ["autodocs"],
  argTypes: {
    icon: {
      options: ["dice", "rocket", "bank"],
      control: { type: "radio" },
    },
  },
};
export default meta;

type Story = StoryObj<typeof RichButton>;

const Template: Story = {
  render: (args) => <RichButton {...args}>Click here</RichButton>,
};

export const Default = {
  ...Template,
  args: {},
};
