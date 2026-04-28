"use client";

import Button from "@/components/Button/Button";
import DiceIcon from "@/components/DiceIcon/DiceIcon";
import Settings, {
  SettingsFormSchemaType,
} from "@/components/Form/Settings/Settings";
import Modal from "@/components/Modal/Modal";
import { useGame } from "@/domain/game/GameProvider";
import Link from "next/link";
import { useState } from "react";

export default function Home() {
  const { dispatch } = useGame();

  const title = "FARKLE!".split("");
  const [settingsOpen, setSettingsOpen] = useState<boolean>(false);
  const handleSettingsOpen = () => {
    setSettingsOpen(true);
  };
  const handleSettingsClose = () => {
    setSettingsOpen(false);
  };

  const onSubmit = (data: SettingsFormSchemaType) => {
    dispatch({
      type: "UPDATE_SETTINGS",
      settings: data,
    });
  };

  return (
    <>
      <div className="splash-screen h-dvh flex items-center justify-center bg-gray-800">
        <div className="flex flex-col gap-4 items-center">
          <div
            className="bg-gray-500 border-4 border-white rounded-full w-[200px] h-[200px] mb-4 p-6 rotate-12 opacity-0 animate-fade-in"
            style={{
              animationDelay: "1.45s",
            }}
          >
            <div
              className="opacity-0 animate-bounce-in"
              style={{
                animationDelay: "1.65s",
              }}
            >
              <DiceIcon count={6} />
            </div>
          </div>
          <h1 className="font-mega text-white">
            {title.map((e, i) => (
              <span
                key={i}
                className="animate-bounce-in opacity-0"
                style={{
                  animationDelay: `${i * 0.05 + 1}s`,
                }}
              >
                {e}
              </span>
            ))}
          </h1>
          <div
            className="opacity-0 animate-bounce-in flex gap-4"
            style={{
              animationDelay: "1.45s",
            }}
          >
            <Link href="/game">
              <Button as="inline" size="large" className="inline-block">
                Start Game
              </Button>
            </Link>

            <Button
              size="large"
              className="inline-block"
              onClick={handleSettingsOpen}
            >
              Settings
            </Button>
          </div>
        </div>
      </div>
      <Modal
        isOpen={settingsOpen}
        onClose={handleSettingsClose}
        ariaLabel="Settings"
      >
        <Modal.Body>
          <Settings onSubmit={onSubmit} />
        </Modal.Body>
      </Modal>
    </>
  );
}
