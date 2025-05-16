// @ts-check
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";

import starlight from "@astrojs/starlight";

export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [
    starlight({
      title: "OrbitUI",
      customCss: ["./src/styles/starlight.css"],
      logo: {
        dark: "./src/assets/logo/orbitui-dark.png",
        light: "./src/assets/logo/OrbitUI-light.png",
        replacesTitle: true,
        alt: "OrbitUI Logo"
      },
    }),
  ],
});