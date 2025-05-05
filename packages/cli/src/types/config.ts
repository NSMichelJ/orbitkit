import { ComponentRegistryEntry } from "@orbitui/components";

export type Config = {
  tailwindConfig: string;
  componentsDir: string;
  utilsDir: string;
  components?: ComponentRegistryEntry[];
};
