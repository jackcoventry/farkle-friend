import icons from '@/design-tokens/icons.json';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
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
      options: ['left', 'right'],
      control: { type: 'radio' },
    },
    icon: {
      options: [undefined, ...icons.icons],
      control: { type: 'select' },
      labels: {
        undefined: 'None',
      },
    },
  },
};
export default meta;

type Story = StoryObj<typeof Button>;

const Template: Story = {
  render: (args) => <Button {...args}>Roll dice</Button>,
};

export const Playground: Story = {
  ...Template,
  args: {
    as: 'button',
    icon: 'arrow-right',
    onClick: fn(),
  },
};

export const Variants: Story = {
  render: () => (
    <div className="gap-md flex flex-wrap items-center">
      <Button
        type="button"
        icon="arrow-right"
        onClick={fn()}
      >
        Roll dice
      </Button>
      <Button
        type="button"
        variant="secondary"
        icon="bag"
        onClick={fn()}
      >
        Bank points
      </Button>
      <Button
        type="button"
        disabled
        icon="clock"
      >
        End turn
      </Button>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="gap-md flex flex-wrap items-center">
      <Button
        type="button"
        size="small"
        variant="secondary"
        onClick={fn()}
      >
        Small
      </Button>
      <Button
        type="button"
        onClick={fn()}
      >
        Default
      </Button>
      <Button
        type="button"
        size="large"
        icon="arrow-right"
        onClick={fn()}
      >
        Large
      </Button>
    </div>
  ),
};

export const IconButtons: Story = {
  render: () => (
    <div className="gap-md flex flex-wrap items-center">
      <Button
        type="button"
        icon="arrow-right"
        iconOnly
        ariaLabel="Roll dice"
        onClick={fn()}
      />
      <Button
        type="button"
        icon="bag"
        iconOnly
        ariaLabel="Bank score"
        variant="secondary"
        onClick={fn()}
      />
      <Button
        as="a"
        href="/game"
        icon="arrow-right"
      >
        New game
      </Button>
    </div>
  ),
};
