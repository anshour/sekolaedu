import { createSystem, defineConfig, defaultConfig } from "@chakra-ui/react";
import { slotRecipes } from "./slot-recipes";

const customConfig = defineConfig({
  theme: {
    tokens: {
      fonts: {
        heading: { value: "'Inter Variable', sans-serif" },
        body: { value: "'Inter Variable', sans-serif" },
      },
    },
    slotRecipes,
  },
});

export const system = createSystem(defaultConfig, customConfig);
