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
        alt: "OrbitUI Logo",
      },
      social: [
        {
          icon: "github",
          label: "GitHub",
          href: "https://github.com/nsmichelj/orbitui",
        },
      ],
      editLink: {
        baseUrl: "https://github.com/nsmichelj/orbitui/edit/main/apps/docs/",
      },
      components: {
        Pagination: "./src/components/overrides/pagination/Pagination.astro",
      },
    }),
  ],
});