import { defineConfig } from "tsup";

import fs from "fs-extra";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm"],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  async onSuccess() {
    await fs.copy("./src/astro", "dist/astro");
  },
});
