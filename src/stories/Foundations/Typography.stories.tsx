import type { Meta, StoryObj } from '@storybook/react-vite';
import './FoundationStories.css';

const typeSamples = [
  ['Mega', 'font-mega', 'Farkle Friend'],
  ['Heading', 'font-heading', 'Ada banks 1,650 points'],
  ['Heading 2', 'font-heading-2', 'Current player'],
  ['Sub heading', 'font-sub-heading', 'Hot dice'],
  ['Body', 'font-body', 'Select scoring dice, then bank your points or roll again.'],
  ['Button', 'font-button', 'Roll dice'],
] as const;

function TypographyStory() {
  return (
    <section className="foundation-page | gap-xl p-xl bg-canvas text-text grid">
      <header className="gap-xs grid">
        <h1 className="font-heading">Typography</h1>
        <p className="text-text-muted max-w-3xl">
          Public typography utilities backed by the generated font tokens.
        </p>
      </header>

      <div className="border-border bg-surface rounded-3xl border">
        {typeSamples.map(([label, className, sample]) => (
          <article
            key={label}
            className="gap-md border-border p-lg grid border-b last:border-b-0 lg:grid-cols-[12rem_1fr]"
          >
            <div className="gap-2xs grid content-start">
              <p className="font-heading-2">{label}</p>
              <code className="text-text-muted text-sm">.{className}</code>
            </div>
            <p className={className}>{sample}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

const meta = {
  title: 'Foundations/Typography',
  component: TypographyStory,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof TypographyStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Scale: Story = {};
