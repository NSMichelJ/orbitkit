/**
 * NOTE: This CSS merging implementation is experimental and prone to errors.
 * Contributions to improve  reliability and error handling are actively welcomed.
 *
 * Merges two CSS strings, combining @import, @plugin, @custom-variant, @theme, @layer, and other rules.
 * Handles deduplication and merges theme variables and CSS rules.
 *
 * @param css1 - The first CSS string.
 * @param css2 - The second CSS string.
 * @returns The merged CSS string.
 */
export function mergeCSS(css1: string, css2: string): string {
  /**
   * Structure for parsed CSS sections.
   */
  interface CSSParseResult {
    imports: string[];
    plugins: string[];
    customVariants: string[];
    themes: Record<string, string>;
    layers: string[];
    others: string[];
  }

  /**
   * Parses a CSS rule into selector and declarations.
   * @param rule - CSS rule as string.
   * @returns Selector and declarations object, or null if not matched.
   */
  function parseRule(
    rule: string,
  ): { selector: string; declarations: Record<string, string> } | null {
    const match = rule.match(/([^{]+)\{([^}]+)}/);
    if (!match) return null;
    const selector = match[1].trim();
    const declarationsStr = match[2].trim();
    const declarations: Record<string, string> = {};
    declarationsStr.split(";").forEach((decl) => {
      const [prop, value] = decl
        .split(":")
        .map((s) => s.trim())
        .filter(Boolean);
      if (prop && value) declarations[prop] = value;
    });
    return { selector, declarations };
  }

  /**
   * Parses a CSS string into its main sections.
   * Extracts @import, @plugin, @custom-variant, @theme, @layer, and other rules.
   * @param css - CSS string to parse.
   * @returns Parsed CSS sections.
   */
  function parseCSS(css: string): CSSParseResult {
    const imports = new Set<string>();
    const plugins = new Set<string>();
    const customVariants = new Set<string>();
    const themes: Record<string, string> = {};
    const layers: string[] = [];
    const others: string[] = [];

    // Extract @import
    let match;
    const importRegex = /@import\s+([^;]+);/g;
    while ((match = importRegex.exec(css)) !== null) imports.add(match[0]);

    // Extract @plugin
    const pluginRegex = /@plugin\s+([^;]+);/g;
    while ((match = pluginRegex.exec(css)) !== null) plugins.add(match[0]);

    // Extract @custom-variant
    const customVariantRegex = /@custom-variant\s+([^;]+);/g;
    while ((match = customVariantRegex.exec(css)) !== null)
      customVariants.add(match[0]);

    // Extract @theme
    const themeRegex = /@theme\s*\{([\s\S]*?)\}/g;
    while ((match = themeRegex.exec(css)) !== null) {
      const vars = match[1]
        .trim()
        .split(";")
        .filter((v) => v.trim());
      vars.forEach((v) => {
        const [prop, value] = v.split(":").map((p) => p.trim());
        if (prop && value) themes[prop] = value;
      });
    }

    // Extract @layer (as complete blocks)
    const layerRegex = /(@layer\s+[\w-]+\s*\{(?:[^{}]*|\{[^{}]*\})*\})/g;
    while ((match = layerRegex.exec(css)) !== null) {
      layers.push(match[0].trim());
    }

    // Process remaining rules
    const remaining = css
      .replace(importRegex, "")
      .replace(pluginRegex, "")
      .replace(customVariantRegex, "")
      .replace(themeRegex, "")
      .replace(layerRegex, "")
      .trim();

    const otherRules = remaining
      .split("}")
      .map((r) => r.trim() + "}\n\n")
      .filter((r) => r && !r.startsWith("@"));

    others.push(...otherRules);

    return {
      imports: Array.from(imports),
      plugins: Array.from(plugins),
      customVariants: Array.from(customVariants),
      themes,
      layers,
      others,
    };
  }

  // Parse both CSS inputs
  const css1Parsed = parseCSS(css1);
  const css2Parsed = parseCSS(css2);

  // Merge sections, removing duplicates
  const mergedImports = Array.from(
    new Set([...css1Parsed.imports, ...css2Parsed.imports]),
  );

  const mergedPlugins = Array.from(
    new Set([...css1Parsed.plugins, ...css2Parsed.plugins]),
  );

  const mergedCustomVariants = Array.from(
    new Set([...css1Parsed.customVariants, ...css2Parsed.customVariants]),
  );

  // Merge theme variables (css2 overrides css1)
  const mergedThemes: Record<string, string> = {
    ...css1Parsed.themes,
    ...css2Parsed.themes,
  };

  // Merge @layer blocks, avoiding duplicates
  const mergedLayers: string[] = [];
  const existingLayers = new Set<string>();

  // Process layers from the first CSS
  css1Parsed.layers.forEach((layer) => {
    const trimmedLayer = layer.trim();
    if (!existingLayers.has(trimmedLayer)) {
      existingLayers.add(trimmedLayer);
      mergedLayers.push(trimmedLayer);
    }
  });

  // Process layers from the second CSS
  css2Parsed.layers.forEach((layer) => {
    const trimmedLayer = layer.trim();
    if (!existingLayers.has(trimmedLayer)) {
      existingLayers.add(trimmedLayer);
      mergedLayers.push(trimmedLayer);
    }
  });

  // Merge other CSS rules by selector, css2 overrides css1
  const mergedOthers: Record<string, Record<string, string>> = {};
  [...css1Parsed.others, ...css2Parsed.others].forEach((ruleStr) => {
    const parsed = parseRule(ruleStr);
    if (parsed) {
      mergedOthers[parsed.selector] = {
        ...mergedOthers[parsed.selector],
        ...parsed.declarations,
      };
    }
  });

  // Build the final CSS string
  let result = "";

  // Add @import
  mergedImports.forEach((i) => (result += `${i}\n\n`));

  // Add @plugin
  mergedPlugins.forEach((p) => (result += `${p}\n\n`));

  // Add @custom-variant
  mergedCustomVariants.forEach((cv) => (result += `${cv}\n\n`));

  // Add @theme
  if (Object.keys(mergedThemes).length > 0) {
    result += "@theme {\n";
    Object.entries(mergedThemes).forEach(
      ([k, v]) => (result += `  ${k}: ${v};\n`),
    );
    result += "}\n\n";
  }

  // Add @layer (unique blocks)
  mergedLayers.forEach((layer) => (result += `${layer}\n\n`));

  // Add other rules
  Object.entries(mergedOthers).forEach(([sel, decls]) => {
    result += `${sel} {\n`;
    Object.entries(decls).forEach(([p, v]) => (result += `  ${p}: ${v};\n`));
    result += "}\n\n";
  });

  return result.trim();
}
