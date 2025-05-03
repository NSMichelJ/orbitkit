export interface ComponentRegistryEntry {
  name: string;
  version: string;
}

export interface ComponentRegistry {
  components: ComponentRegistryEntry[];
}
