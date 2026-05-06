import icons from '@/design-tokens/icons.json';
import type { Meta, StoryObj } from '@storybook/react-vite';
import Button from '@/components/Button/Button';
import type { ButtonProps } from '@/components/Button/Button';

const meta: Meta<ButtonProps> = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    as: {
      options: ['button', 'inline', 'a'],
      control: { type: 'radio' },
    },
    size: {
      options: ['small', 'default', 'large'],
      control: { type: 'radio' },
    },
    variant: {
      options: ['primary', 'secondary'],
      control: { type: 'radio' },
    },
    iconPosition: {
      options: ['left', 'right', 'top'],
      control: { type: 'radio' },
    },
    icon: {
      options: icons.icons,
      control: { type: 'select' },
    },
  },
};
export default meta;

type Story = StoryObj<typeof Button>;

const Template: Story = {
  render: (args) => <Button {...args}>Click here</Button>,
};

export const Default = {
  ...Template,
  args: {
    as: 'button',
  },
};

export const Secondary = {
  ...Template,
  args: {
    as: 'button',
    variant: 'secondary',
  },
};
