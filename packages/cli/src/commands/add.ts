import { ORBIT_CONFIG_FILE_NAME } from "@/utils/constants";
import { log } from "@/utils/log";
import { Command } from "commander";
import fs from "fs-extra";

import { highlighted } from "@/utils/highlighted";
import readConfig from "@/utils/readConfig";
import writeConfig from "@/utils/writeConfig";
import {
  checkComponentsInRegistry,
  ComponentRegistryEntry,
  getAllComponents,
  getComponentPath,
} from "@orbitkit/components";
import inquirer from "inquirer";
import path from "node:path";
import ora from "ora";
import { runInit } from "./init";

export const add = new Command()
  .name("add")
  .description("Add Orbit components to your project")
  .argument("[components...]", "The components to add")
  .option("-a, --all", "Add all available Orbit components", false)
  .option(
    "-w, --working-directory <path>",
    "Specify the working directory path",
    process.cwd(),
  )
  .action(async (components: string[], args) => {
    const workingDirectory = path.resolve(args.workingDirectory);

    if (
      !(await fs.pathExists(
        path.join(workingDirectory, ORBIT_CONFIG_FILE_NAME),
      ))
    ) {
      log.error("Orbit configuration not found.");

      const { initialize } = await inquirer.prompt([
        {
          type: "confirm",
          name: "initialize",
          message: "initialize the project?",
          default: true,
        },
      ]);

      if (initialize) {
        await runInit({
          force: false,
          workingDirectory: workingDirectory,
        });
      } else {
        log.blank(
          "Please run " +
            highlighted.info("orbitkit init") +
            " to initialize the project.",
        );
        return;
      }
    }

    const componentsToInstall: ComponentRegistryEntry[] =
      await promptForComponents({ components, ...args });

    if (!componentsToInstall.length) {
      return;
    }

    log.ln();
    log.info("The following components will be added to your project:");
    for (const componentToInstall of componentsToInstall) {
      log.blank(`- ${componentToInstall.name}@${componentToInstall.version}`);
    }

    const config = await readConfig(workingDirectory);
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
      const componentsDir = path.join(
        workingDirectory,
        componentsDirConfig,
        name,
      );

      spinner.text = `Adding ${componentToInstall.name}@${componentToInstall.version}...`;
      try {
        await fs.copy(componentPath, componentsDir);
        config.components = config.components || [];

        config.components.push({
          name: name,
          version: version,
        });
        await writeConfig(workingDirectory, config);
      } catch {
        log.error(`Error adding component ${componentToInstall}`);
      }
    }
    spinner.stop();
  });

async function promptForComponents(opts: { components: string[]; all: true }) {
  if (opts.all) {
    log.info("Adding all available Orbit components...");
    return getAllComponents();
  }

  if (!opts.components.length) {
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

    return selectedComponents;
  }

  const { valid: validComponents, invalid: invalidComponents } =
    await checkComponentsInRegistry(opts.components);

  if (invalidComponents.length) {
    log.warn("The following components were not found:");
    for (const invalidComponent of invalidComponents) {
      log.blank(`- ${invalidComponent}`);
    }
  }

  return validComponents;
}
