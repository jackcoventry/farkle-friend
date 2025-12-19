import type { Decorator, Preview } from "@storybook/react-vite";
import { ModalStackProvider } from "../src/components/Modal/ModalStackContext";
import { GameProvider } from "../src/domain/game/GameProvider";

import "@/styles/globals.css";

const withProviderStack: Decorator = (Story) => (
  <ModalStackProvider>
    <GameProvider>
      <Story />
    </GameProvider>
  </ModalStackProvider>
);

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [withProviderStack],
};

export default preview;
