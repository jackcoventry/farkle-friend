import type { Meta, StoryObj } from "@storybook/react-vite";

import Navigation from "@/components/Navigation/Navigation";
import { NavItem } from "./NavItem";
import { NavLink } from "./NavLink";

const meta: Meta<typeof Navigation> = {
  title: "Components/Navigation",
  component: Navigation,
  tags: ["autodocs"],
  args: {},
};
export default meta;

type Story = StoryObj<typeof Navigation>;

const Template: Story = {
  render: () => (
    <Navigation>
      <NavItem>
        <NavLink href="/">Home</NavLink>
      </NavItem>
      <NavItem>
        <NavLink href="/">About</NavLink>
      </NavItem>
    </Navigation>
  ),
};

export const Default = {
  ...Template,
  args: {},
};
