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
  .option("-o, --overwrite", "Overwrite existing components.", false)
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

    const config = await readConfig(workingDirectory);
    if (!config?.componentsDir) {
      log.error("Components directory not configured.");
      return;
    }

    const componentsToInstall: ComponentRegistryEntry[] =
      await promptForComponents({ components, ...args });

    if (!componentsToInstall.length) {
      return;
    }

    config.components = config.components || [];

    const ignoredComponents: ComponentRegistryEntry[] = [];

    const filteredComponentsToInstall = componentsToInstall.filter(
      (componentToInstall) => {
        const exists = config.components?.some(
          (c) => c.name === componentToInstall.name,
        );
        if (exists && !args.overwrite) {
          ignoredComponents.push(componentToInstall);
          return false;
        }
        return true;
      },
    );

    if (!filteredComponentsToInstall.length) {
      if (ignoredComponents.length) {
        log.ln();
        log.warn(
          "The following components are already installed. Use --overwrite to overwrite:",
        );
        ignoredComponents.forEach((c) => log.blank(`- ${c.name}@${c.version}`));
      }
      return;
    }

    log.ln();
    log.info("The following components will be added to your project:");
    filteredComponentsToInstall.forEach((componentToInstall) => {
      log.blank(`- ${componentToInstall.name}@${componentToInstall.version}`);
    });

    const componentsDirConfig = config.componentsDir;
    const spinner = ora("Adding component...").start();

    for (const componentToInstall of filteredComponentsToInstall) {
      const { name, version } = componentToInstall;
      const componentIndex = config.components.findIndex(
        (c) => c.name === name,
      );
      const componentPath = getComponentPath(name);
      const componentsDir = path.join(
        workingDirectory,
        componentsDirConfig,
        name,
      );
      spinner.text = `Adding ${name}@${version}...`;
      try {
        await fs.copy(componentPath, componentsDir, { overwrite: true });
        if (componentIndex !== -1) {
          config.components[componentIndex] = { name, version };
        } else {
          config.components.push({ name, version });
        }
      } catch {
        log.error(`Error adding component ${name}`);
      }
    }
    await writeConfig(workingDirectory, config);
    spinner.stop();

    if (ignoredComponents.length) {
      log.ln();
      log.warn(
        "The following components are already installed. Use --overwrite to overwrite:",
      );
      ignoredComponents.forEach((c) => log.blank(`- ${c.name}@${c.version}`));
    }
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
