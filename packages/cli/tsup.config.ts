import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/*"],
  format: "cjs",
  splitting: false,
  sourcemap: true,
  clean: true,
});
