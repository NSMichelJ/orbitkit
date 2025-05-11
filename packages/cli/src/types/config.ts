import { ComponentRegistryEntry } from "@orbitkit/components";

export type Config = {
  tailwindConfig: string;
  componentsDir: string;
  utilsDir: string;
  components?: ComponentRegistryEntry[];
};
