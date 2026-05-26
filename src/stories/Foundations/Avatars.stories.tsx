import type { Meta, StoryObj } from '@storybook/react-vite';
import { avatarSet, avatarValues } from '@/domain/game/avatars';
import { AvatarImage } from '@/components/AvatarImage/AvatarImage';
import './FoundationStories.css';

function AvatarsStory() {
  return (
    <section className="foundation-page | gap-xl p-xl bg-canvas text-text grid">
      <header className="gap-xs grid">
        <h1 className="font-heading">Avatar swatches</h1>
        <p className="text-text-muted max-w-3xl">
          Bespoke avatar backgrounds used anywhere player avatars appear.
        </p>
      </header>

      <div className="gap-md grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
        {avatarValues.map((avatarId) => {
          const avatar = avatarSet[avatarId];

          return (
            <figure
              key={avatarId}
              className="gap-sm grid justify-items-center text-center"
            >
              <div
                className={`p-lg flex aspect-square w-full max-w-36 items-center justify-center rounded-full ${avatar.swatchClassName}`}
              >
                <AvatarImage
                  avatar={avatar}
                  alt={`${avatar.name} avatar`}
                  className="h-auto w-full"
                />
              </div>
              <figcaption className="gap-2xs grid">
                <span className="font-heading-2">{avatar.name}</span>
                <code className="text-text-muted text-xs">{avatar.swatchClassName}</code>
              </figcaption>
            </figure>
          );
        })}
      </div>
    </section>
  );
}

const meta = {
  title: 'Foundations/Avatars',
  component: AvatarsStory,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof AvatarsStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Swatches: Story = {};
