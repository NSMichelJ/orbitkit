import registry from "@/registry.json";
import { fileURLToPath } from "node:url";

import path from "node:path";
import { ComponentRegistryEntry } from "./types/registry";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export function getAllComponents() {
  const availableComponents = registry.components as ComponentRegistryEntry[];
  return availableComponents.sort((a, b) => a.name.localeCompare(b.name));
}

export function getComponentPath(componentName: string) {
  return path.join(__dirname, "astro", componentName);
}

export async function checkComponentsInRegistry(components: string[]) {
  const valid: ComponentRegistryEntry[] = [];
  const invalid: string[] = [];
  const allComponents = getAllComponents();

  for (const component of components) {
    const found = allComponents.find(
      (c) => c.name.toLowerCase() === component.toLowerCase(),
    );
    if (found) {
      valid.push(found);
    } else {
      invalid.push(component);
    }
  }

  return { valid, invalid };
}

export { type ComponentRegistryEntry } from "@/types/registry";
