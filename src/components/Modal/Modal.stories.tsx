import { Meta, StoryObj } from '@storybook/react-vite';
import Image from 'next/image';
import React, { useState } from 'react';
import { expect, userEvent, within } from 'storybook/test';
import { AvatarId, avatarSet } from '@/domain/game/avatars';
import Button from '@/components/Button/Button';
import Modal from '@/components/Modal/Modal';
import Splash from '@/components/Modal/Splash';

const meta: Meta<typeof Modal> = {
  title: 'Components/Modal',
  component: Modal,
  tags: ['autodocs'],
  argTypes: {
    theme: {
      options: ['default', 'warning', 'success'],
      control: { type: 'radio' },
    },
  },
};
export default meta;

type Story = StoryObj<typeof Modal>;

function DefaultModalStory() {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button onClick={() => setOpen(true)}>Open modal</button>
      <Modal
        isOpen={open}
        onClose={() => setOpen(false)}
      >
        <Modal.Panel>
          <Modal.Header>
            <Modal.Title>My simple modal</Modal.Title>
            <Modal.CloseButton ariaLabel="Close modal" />
          </Modal.Header>
          <Modal.Content>
            <p>Hello from the modal</p>
          </Modal.Content>
        </Modal.Panel>
      </Modal>
    </div>
  );
}

function NextPlayerModalStory() {
  const [open, setOpen] = useState(false);

  const player = {
    id: 'asdfasdf',
    username: 'Wallace',
    avatar: 1,
    totalScore: 1000,
  };
  const avatar = avatarSet[player.avatar as AvatarId];

  return (
    <div>
      <button onClick={() => setOpen(true)}>Open modal</button>
      <Modal
        isOpen={open}
        onClose={() => setOpen(false)}
        ariaLabel="My simple modal"
        variant="splash"
        theme="default"
      >
        <Modal.Body>
          <Splash
            title={`${player.username}'s turn`}
            image={
              <figure
                className={`p-xl my-md mx-auto flex aspect-square max-w-[200px] items-center justify-center overflow-hidden rounded-full ${avatar.color}`}
              >
                <Image
                  src={avatar.image}
                  alt={`${player.username}'s ${avatar.name} avatar`}
                  width={200}
                  height={200}
                  className="splash-avatar | h-[200px] w-[200px]"
                />
              </figure>
            }
            text={player.totalScore.toString()}
          />
        </Modal.Body>
      </Modal>
    </div>
  );
}

function WinnerModalStory() {
  const [open, setOpen] = useState(false);

  const player = {
    id: 'asdfasdf',
    username: 'Wallace',
    avatar: 1,
    totalScore: 1000,
  };
  const avatar = avatarSet[player.avatar as AvatarId];

  return (
    <div>
      <button onClick={() => setOpen(true)}>Open modal</button>
      <Modal
        isOpen={open}
        onClose={() => setOpen(false)}
        ariaLabel="My simple modal"
        variant="splash"
        theme="success"
      >
        <Modal.Body>
          <Splash
            title={`${player.username} wins!`}
            image={
              <figure
                className={`splash-avatar-crown p-xl my-md relative mx-auto flex h-[200px] w-[200px] items-center justify-center rounded-full ${avatar.color}`}
              >
                <Image
                  src={avatar.image}
                  alt={`${player.username}'s ${avatar.name} avatar`}
                  width={200}
                  height={200}
                  className="splash-avatar | h-[200px] w-[200px]"
                />
              </figure>
            }
          >
            <Button
              onClick={() => {}}
              className="justify-center"
            >
              Another game?
            </Button>
            <Button
              as="a"
              href="/game"
              className="justify-center"
            >
              New players
            </Button>
          </Splash>
        </Modal.Body>
      </Modal>
    </div>
  );
}

function FarkledModalStory() {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button onClick={() => setOpen(true)}>Open modal</button>
      <Modal
        isOpen={open}
        onClose={() => setOpen(false)}
        ariaLabel="My simple modal"
        variant="splash"
        theme="warning"
      >
        <Modal.Body>
          <Splash
            title="You've been farkled!"
            image={<div className="font-mega mt-xl">X</div>}
          >
            <Button
              onClick={() => {}}
              className="justify-center"
            >
              End turn
            </Button>
          </Splash>
        </Modal.Body>
      </Modal>
    </div>
  );
}

const Template: Story = {
  render: () => <DefaultModalStory />,
};

const NextPlayerTemplate: Story = {
  render: () => <NextPlayerModalStory />,
};

const WinnerTemplate: Story = {
  render: () => <WinnerModalStory />,
};

const FarkledTemplate: Story = {
  render: () => <FarkledModalStory />,
};

export const Default: Story = {
  ...Template,
  args: {},
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole('button', { name: 'Open modal' }));
    const dialog = await within(document.body).findByRole('dialog', {
      name: 'My simple modal',
    });
    await expect(dialog).toBeVisible();

    await userEvent.keyboard('{Escape}');
    await expect(
      within(document.body).queryByRole('dialog', { name: 'My simple modal' })
    ).not.toBeInTheDocument();
  },
};

export const NextPlayer = { ...NextPlayerTemplate, args: {} };

export const Winner = { ...WinnerTemplate, args: {} };

export const Farkled = { ...FarkledTemplate, args: {} };
