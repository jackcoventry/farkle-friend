import type { Meta, StoryObj } from '@storybook/react-vite';
import type { CSSProperties } from 'react';
import './FoundationStories.css';

const colorTokens = [
  ['Canvas', '--color-canvas'],
  ['Surface', '--color-surface'],
  ['Raised surface', '--color-surface-raised'],
  ['Muted surface', '--color-surface-muted'],
  ['Text', '--color-text'],
  ['Muted text', '--color-text-muted'],
  ['Border', '--color-border'],
  ['Strong border', '--color-border-strong'],
  ['Accent', '--color-accent'],
  ['Accent hover', '--color-accent-hover'],
  ['Action', '--color-action'],
  ['Action hover', '--color-action-hover'],
  ['Danger', '--color-danger'],
  ['Danger surface', '--color-danger-surface'],
  ['Selected', '--color-selected'],
  ['Selected border', '--color-selected-border'],
  ['Dice pip', '--color-dice-pip'],
  ['Focus ring', '--color-focus-ring-accent'],
] as const;

function TokensStory() {
  return (
    <section className="foundation-page | gap-xl p-xl bg-canvas text-text grid">
      <header className="gap-xs grid">
        <h1 className="font-heading">Semantic colour tokens</h1>
        <p className="text-text-muted max-w-3xl">
          Runtime tokens exposed through the theme layer. Component styles should prefer these names
          over palette-specific values.
        </p>
      </header>

      <div className="gap-md grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {colorTokens.map(([label, token]) => (
          <article
            key={token}
            className="border-border bg-surface p-md gap-sm grid rounded-2xl border"
          >
            <div
              className="foundation-swatch | border-border h-16 rounded-xl border"
              style={{ '--foundation-swatch-color': `var(${token})` } as CSSProperties}
            />
            <div className="gap-2xs grid">
              <p className="font-heading-2">{label}</p>
              <code className="text-text-muted text-sm">{token}</code>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

const meta = {
  title: 'Foundations/Tokens',
  component: TokensStory,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof TokensStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Colours: Story = {};
