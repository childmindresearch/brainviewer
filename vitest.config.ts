/// <reference types="vitest" />
import { defineConfig } from "vite";

export default defineConfig({
  test: {
    browser: {
      name: "chromium",
      provider: "playwright",
    },
    environment: "jsdom",
    environmentOptions: {
      jsdom: {
        resources: "usable",
      },
    },
  },
});
