import type { Meta, StoryObj } from '@storybook/react-vite';
import { DiceIcon } from '@/components/DiceIcon/DiceIcon';

const meta: Meta<typeof DiceIcon> = {
  title: 'Components/Dice Icon',
  component: DiceIcon,
  tags: ['autodocs'],
  argTypes: {
    count: {
      options: [1, 2, 3, 4, 5, 6],
      control: { type: 'radio' },
    },
  },
};
export default meta;

type Story = StoryObj<typeof DiceIcon>;

const Template: Story = {
  render: (args) => (
    <div className="w-24">
      <DiceIcon {...args} />
    </div>
  ),
};

const TemplateForGroup: Story = {
  render: () => (
    <div className="gap-md grid max-w-3xl grid-cols-3 sm:grid-cols-6">
      {[1, 2, 3, 4, 5, 6].map((count) => (
        <DiceIcon
          key={count}
          count={count}
        />
      ))}
    </div>
  ),
};

export const Playground: Story = {
  ...Template,
  args: {
    count: 1,
  },
};

export const Set: Story = {
  ...TemplateForGroup,
};

export const States: Story = {
  render: () => (
    <div className="gap-lg grid max-w-lg grid-cols-3 text-center">
      {[
        ['default', undefined],
        ['active', 'active'],
        ['disabled', 'disabled'],
      ].map(([label, state]) => (
        <figure
          key={label}
          className="gap-xs grid"
        >
          <DiceIcon
            count={5}
            state={state as 'active' | 'disabled' | undefined}
          />
          <figcaption className="text-text-muted text-sm">{label}</figcaption>
        </figure>
      ))}
    </div>
  ),
};
