import React, { useState } from "react";
import Modal from "@/components/Modal/Modal";
import { Meta, StoryObj } from "@storybook/react-vite";
import Splash from "@/components/Modal/Splash";
import Button from "@/components/Button/Button";
import { AvatarId, avatarSet } from "@/components/Form/AddPlayer/AddPlayer";
import Image from "next/image";

const meta: Meta<typeof Modal> = {
  title: "Components/Modal",
  component: Modal,
  tags: ["autodocs"],
  argTypes: {
    theme: {
      options: ["default", "warning", "success"],
      control: { type: "radio" },
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
        ariaLabel="My simple modal"
      >
        <Modal.Header>
          <Modal.Title>My simple modal</Modal.Title>
          <Modal.CloseButton />
        </Modal.Header>

        <Modal.Body>
          <p>Hello from the modal</p>
        </Modal.Body>

        <Modal.Footer>
          <p>Footer!</p>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

function NextPlayerModalStory() {
  const [open, setOpen] = useState(false);

  const player = {
    id: "asdfasdf",
    username: "Wallace",
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
                className={`rounded-full overflow-hidden aspect-square max-w-[200px] mx-auto my-4 p-6 flex items-center justify-center ${avatar.color}`}
              >
                <Image
                  src={avatar.image}
                  alt={`${player.username}'s ${avatar.name} avatar`}
                  width={200}
                  height={200}
                  className="splash-avatar"
                />
              </figure>
            }
            subtitle="Current score:"
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
    id: "asdfasdf",
    username: "Wallace",
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
                className={`splash-avatar-crown relative rounded-full w-[200px] h-[200px] mx-auto my-4 p-6 flex items-center justify-center ${avatar.color}`}
              >
                <Image
                  src={avatar.image}
                  alt={`${player.username}'s ${avatar.name} avatar`}
                  width={200}
                  height={200}
                  className="splash-avatar"
                />
              </figure>
            }
          >
            <Button onClick={() => {}} className="justify-center">
              Another game?
            </Button>
            <Button as="a" href="/game" className="justify-center">
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
            image={<div className="font-mega mt-6">X</div>}
          >
            <Button onClick={() => {}} className="justify-center">
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

export const Default = { ...Template, args: {} };

export const NextPlayer = { ...NextPlayerTemplate, args: {} };

export const Winner = { ...WinnerTemplate, args: {} };

export const Farkled = { ...FarkledTemplate, args: {} };
