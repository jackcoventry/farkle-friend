import type { Decorator, Preview } from "@storybook/react-vite";
import { ModalStackProvider } from "../src/components/Modal/ModalStackContext";

import "@/styles/globals.css";

const withModalStack: Decorator = (Story) => (
  <ModalStackProvider>
    <Story />
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
  decorators: [withModalStack],
};

export default preview;
