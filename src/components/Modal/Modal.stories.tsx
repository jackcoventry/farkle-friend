import React, { useState } from "react";
import Modal from "@/components/Modal/Modal";
import { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta<typeof Modal> = {
  title: "Components/Modal",
  component: Modal,
  tags: ["autodocs"],
  args: {},
};
export default meta;

type Story = StoryObj<typeof Modal>;

const Template: Story = {
  render: (props) => {
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
  },
};

export const Default = { ...Template, args: {} };
