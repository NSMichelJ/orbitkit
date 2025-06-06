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
      title: "OrbitUI Component Library",
      favicon: "/favicon.png",
      description:
        "A modular, customizable component library to accelerate your Astro projects with pre-built components powered by Tailwind CSS.",
      customCss: ["./src/styles/starlight.css"],
      logo: {
        dark: "./src/assets/logo/orbitui_dark.png",
        light: "./src/assets/logo/orbitui_light.png",
        replacesTitle: true,
        alt: "OrbitUI Logo",
      },
      social: [
        {
          icon: "github",
          label: "GitHub",
          href: "https://github.com/nsmichelj/orbitui",
        },
        {
          icon: "discord",
          label: "Discord",
          href: "https://discord.gg/JZHt3dNeJm",
        },
      ],
      editLink: {
        baseUrl: "https://github.com/nsmichelj/orbitui/edit/main/apps/docs/",
      },
      components: {
        Pagination: "./src/components/overrides/pagination/Pagination.astro",
      },
      head: [
        {
          tag: "meta",
          attrs: {
            property: "og:image",
            content: "/hero.png",
          },
        },
        {
          tag: "meta",
          attrs: {
            property: "og:image:alt",
            content:
              "Orbit UI Accessible, Customizable, & Lightweight component library",
          },
        },
      ],
    }),
  ],
});
