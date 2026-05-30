import type { Meta, StoryObj } from '@storybook/react-vite';
import { type KeyboardEvent, useRef, useState } from 'react';
import { expect, userEvent, within } from 'storybook/test';
import { Button } from '@/components/Button/Button';

function SetupTabsStory() {
  const [selected, setSelected] = useState<'players' | 'settings'>('players');
  const playersTabRef = useRef<HTMLButtonElement | null>(null);
  const settingsTabRef = useRef<HTMLButtonElement | null>(null);

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;

    event.preventDefault();
    const next = selected === 'players' ? 'settings' : 'players';
    setSelected(next);
    requestAnimationFrame(() => {
      const tab = next === 'players' ? playersTabRef : settingsTabRef;
      tab.current?.focus();
    });
  };

  return (
    <div className="gap-md grid max-w-md">
      <div
        className="gap-xs grid grid-cols-2"
        role="tablist"
        aria-label="Game setup"
      >
        <Button
          ref={playersTabRef}
          type="button"
          role="tab"
          aria-selected={selected === 'players'}
          aria-controls="story-players-panel"
          id="story-players-tab"
          tabIndex={selected === 'players' ? 0 : -1}
          onClick={() => setSelected('players')}
          onKeyDown={handleKeyDown}
          variant={selected === 'players' ? 'primary' : 'secondary'}
          size="small"
          icon="person-circle"
        >
          Players
        </Button>
        <Button
          ref={settingsTabRef}
          type="button"
          role="tab"
          aria-selected={selected === 'settings'}
          aria-controls="story-settings-panel"
          id="story-settings-tab"
          tabIndex={selected === 'settings' ? 0 : -1}
          onClick={() => setSelected('settings')}
          onKeyDown={handleKeyDown}
          variant={selected === 'settings' ? 'primary' : 'secondary'}
          size="small"
          icon="person-circle"
        >
          Settings
        </Button>
      </div>

      {selected === 'players' ? (
        <section
          aria-labelledby="story-players-tab"
          id="story-players-panel"
          role="tabpanel"
        >
          Players panel
        </section>
      ) : (
        <section
          aria-labelledby="story-settings-tab"
          id="story-settings-panel"
          role="tabpanel"
        >
          Settings panel
        </section>
      )}
    </div>
  );
}

const meta: Meta<typeof SetupTabsStory> = {
  title: 'Components/Setup Tabs',
  component: SetupTabsStory,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof SetupTabsStory>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const players = canvas.getByRole('tab', { name: 'Players' });
    const settings = canvas.getByRole('tab', { name: 'Settings' });

    await expect(players).toHaveAttribute('aria-selected', 'true');
    await userEvent.click(settings);
    await expect(settings).toHaveAttribute('aria-selected', 'true');
    await expect(canvas.getByRole('tabpanel', { name: 'Settings' })).toBeVisible();

    settings.focus();
    await userEvent.keyboard('{ArrowLeft}');
    await expect(players).toHaveFocus();
    await expect(players).toHaveAttribute('aria-selected', 'true');
  },
};
