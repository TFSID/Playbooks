import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  // Your configuration options here
  vite: {
    server: {
      host: "0.0.0.0",
      port: 4321,
    },
    plugins: [tailwindcss()],
  },

  integrations: [react()],
});