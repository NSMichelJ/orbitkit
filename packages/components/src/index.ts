import registry from "@/registry.json";
import { fileURLToPath } from "node:url";

import path from "node:path";
import { ComponentRegistryEntry } from "./types/registry";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export function getAllComponents() {
  return registry.components as ComponentRegistryEntry[];
}

export function getComponentPath(componentName: string) {
  return path.join(__dirname, "astro", componentName);
}

export async function checkComponentsInRegistry(components: string[]) {
  const valid: string[] = [];
  const invalid: string[] = [];
  const registeredComponents = getAllComponents().map((component) =>
    component.name.toLocaleLowerCase(),
  );

  for (const component of components) {
    if (registeredComponents.includes(component.toLowerCase())) {
      valid.push(component);
    } else {
      invalid.push(component);
    }
  }

  return { valid, invalid };
}
