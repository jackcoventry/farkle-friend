import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Pill } from '@/components/Pill/Pill';

const meta: Meta<typeof Pill> = {
  title: 'Components/Pill',
  component: Pill,
  tags: ['autodocs'],
  argTypes: {},
};
export default meta;

type Story = StoryObj<typeof Pill>;

const Template: Story = {
  render: (args) => (
    <div className="gap-md flex flex-wrap">
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
          <input
            id="story-pill-checkbox"
            type="checkbox"
          />
        </Pill.Control>
        <Pill.Label htmlFor="story-pill-checkbox">Checkbox</Pill.Label>
      </Pill>
    </div>
  ),
};

export const Default: Story = {
  ...Template,
  args: {},
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const auto = canvas.getByRole('radio', { name: 'Auto' });
    const manual = canvas.getByRole('radio', { name: 'Manual' });
    const checkbox = canvas.getByRole('checkbox', { name: 'Checkbox' });

    await expect(auto).toBeChecked();
    await userEvent.click(manual);
    await expect(manual).toBeChecked();
    await expect(auto).not.toBeChecked();

    await userEvent.click(checkbox);
    await expect(checkbox).toBeChecked();
  },
};
