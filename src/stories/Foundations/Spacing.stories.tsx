import type { Meta, StoryObj } from '@storybook/react-vite';
import type { CSSProperties } from 'react';
import './FoundationStories.css';

const spacingTokens = [
  ['0', '--spacing-0'],
  ['2xs', '--spacing-1'],
  ['xs', '--spacing-2'],
  ['sm', '--spacing-3'],
  ['md', '--spacing-4'],
  ['lg', '--spacing-5'],
  ['xl', '--spacing-6'],
  ['2xl', '--spacing-7'],
  ['3xl', '--spacing-8'],
  ['4xl', '--spacing-9'],
  ['5xl', '--spacing-10'],
] as const;

function SpacingStory() {
  return (
    <section className="foundation-page | gap-xl p-xl bg-canvas text-text grid">
      <header className="gap-xs grid">
        <h1 className="font-heading">Spacing</h1>
        <p className="text-text-muted max-w-3xl">
          Semantic spacing aliases used by layout utilities such as gap, padding, and margin.
        </p>
      </header>

      <div className="border-border bg-surface p-lg gap-md grid rounded-3xl border">
        {spacingTokens.map(([label, token]) => (
          <article
            key={label}
            className="gap-md grid items-center sm:grid-cols-[5rem_1fr_7rem]"
          >
            <code className="text-text-muted">.{label}</code>
            <div className="bg-surface-muted h-8">
              <div
                className="foundation-spacing-sample | bg-accent h-8"
                style={{ '--foundation-spacing-size': `var(${token})` } as CSSProperties}
              />
            </div>
            <code className="text-text-muted text-sm">{token}</code>
          </article>
        ))}
      </div>
    </section>
  );
}

const meta = {
  title: 'Foundations/Spacing',
  component: SpacingStory,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof SpacingStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Scale: Story = {};
