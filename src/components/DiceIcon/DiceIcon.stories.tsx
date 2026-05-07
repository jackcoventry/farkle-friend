import type { Meta, StoryObj } from '@storybook/react-vite';
import DiceIcon from '@/components/DiceIcon/DiceIcon';

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
    <div
      style={{
        width: 100,
      }}
    >
      <DiceIcon {...args} />
    </div>
  ),
};

const TemplateForGroup: Story = {
  render: (args) => (
    <div
      style={{
        display: 'flex',
        gap: 10,
        height: 100,
        width: 1000,
      }}
    >
      {args.count ? (
        <>
          {[...new Array(args.count).keys()].map((e) => (
            <DiceIcon
              key={e}
              count={e + 1}
            />
          ))}
        </>
      ) : null}
    </div>
  ),
};

export const Default = {
  ...Template,
  args: {},
};

export const Group = {
  ...TemplateForGroup,
  args: {},
};
