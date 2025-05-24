import {
  createSystem,
  defineConfig,
  defaultConfig,
} from "@chakra-ui/react";

const customConfig = defineConfig({
  theme: {
    tokens: {
      fonts: {
        heading: { value: "'Inter Variable', sans-serif" },
        body: { value: "'Inter Variable', sans-serif" },
      },
    },
  },
});

export const system = createSystem(defaultConfig, customConfig);
