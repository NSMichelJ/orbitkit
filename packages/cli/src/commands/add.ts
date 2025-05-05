import { ORBIT_CONFIG_FILE_NAME } from "@/utils/constants";
import { highlighted } from "@/utils/highlighted";
import { log } from "@/utils/log";
import { Command } from "commander";
import fs from "fs-extra";

import readConfig from "@/utils/readConfig";
import writeConfig from "@/utils/writeConfig";
import {
  checkComponentsInRegistry,
  ComponentRegistryEntry,
  getAllComponents,
  getComponentPath,
} from "@orbitui/components";
import inquirer from "inquirer";
import path from "node:path";
import ora from "ora";

export const add = new Command()
  .name("add")
  .description("Add OrbitUI components to your project")
  .argument("[components...]", "The components to add")
  .action(async (components: string[]) => {
    if (!(await fs.pathExists(ORBIT_CONFIG_FILE_NAME))) {
      log.error("Orbit UI configuration not found.");
      log.blank(
        "Please run " +
          highlighted.info("orbitui init") +
          " to initialize the project.",
      );
    }

    const PATH = process.cwd();
    const componentsToInstall: ComponentRegistryEntry[] = [];

    if (!components.length) {
      const availableComponents = getAllComponents().map((component) => ({
        name: component.name,
        value: component,
      }));

      const { selectedComponents } = await inquirer.prompt([
        {
          type: "checkbox",
          message: "Which components would you like to add?",
          name: "selectedComponents",
          choices: availableComponents,
        },
      ]);

      if (!selectedComponents.length) {
        log.warn("You did not select any components to add.");
        return;
      }

      componentsToInstall.push(...selectedComponents);
    }

    const { valid: validComponents, invalid: invalidComponents } =
      await checkComponentsInRegistry(components);

    if (invalidComponents.length) {
      log.warn("The following components were not found:");
      for (const invalidComponent of invalidComponents) {
        log.blank(`- ${invalidComponent}`);
      }
    }

    componentsToInstall.push(...validComponents);
    if (!componentsToInstall.length) {
      return;
    }

    log.ln();
    log.info("The following components will be added to your project:");
    for (const componentToInstall of componentsToInstall) {
      log.blank(`- ${componentToInstall.name}@${componentToInstall.version}`);
    }

    const config = await readConfig();
    if (!config?.componentsDir) {
      return;
    }
    const componentsDirConfig = config.componentsDir;

    const spinner = ora("Adding component...").start();
    for (const componentToInstall of componentsToInstall) {
      const { name, version } = componentToInstall;

      if (config.components?.find((c) => c.name === name)) {
        continue;
      }

      const componentPath = getComponentPath(name);
      const componentsDir = path.join(PATH, componentsDirConfig, name);

      spinner.text = `Adding ${componentToInstall.name}@${componentToInstall.version}...`;
      try {
        await fs.copy(componentPath, componentsDir);
        config.components = config.components || [];

        config.components.push({
          name: name,
          version: version,
        });
        await writeConfig(config);
      } catch {
        log.error(`Error adding component ${componentToInstall}`);
      }
    }
    spinner.stop();
  });
