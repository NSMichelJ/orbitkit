import { Config } from "@/types/config";
import { ORBIT_CONFIG_FILE_NAME } from "@/utils/constants";
import { log } from "@/utils/log";
import readConfig from "@/utils/readConfig";
import writeConfig from "@/utils/writeConfig";
import { ComponentRegistryEntry } from "@orbitkit/components";
import { Command } from "commander";
import fs from "fs-extra";
import inquirer from "inquirer";
import path from "node:path";
import ora from "ora";

export const remove = new Command()
  .name("remove")
  .description("Remove Orbit components from your project")
  .argument("[components...]", "The components to remove")
  .option("-a, --all", "Remove available OrbitUI components", false)
  .option(
    "-w, --working-directory <path>",
    "Specify the working directory path",
    process.cwd(),
  )
  .action(async (components: string[], args) => {
    const workingDirectory = path.resolve(args.workingDirectory);
    const configPath = path.join(workingDirectory, ORBIT_CONFIG_FILE_NAME);

    if (!(await fs.pathExists(configPath))) {
      log.error("OrbitUI configuration not found.");
      return;
    }

    const config = await readConfig(workingDirectory);

    if (!config?.componentsDir) {
      log.error("Components directory not configured.");
      return;
    }

    const componentsToRemove: ComponentRegistryEntry[] | null =
      await getComponentsToRemove({
        components,
        all: args.all,
        config,
      });

    if (!componentsToRemove) {
      return;
    }

    const removed: ComponentRegistryEntry[] = [];
    const namesToRemove = new Set(componentsToRemove.map((c) => c.name));
    config.components = config.components || [];

    // Remove the selected components from the filesystem
    const spinner = ora("Removing component...").start();
    for (const componentToRemove of componentsToRemove) {
      const { name } = componentToRemove;
      const componentDir = path.join(
        workingDirectory,
        config.componentsDir,
        name,
      );
      try {
        await fs.remove(componentDir);
        removed.push(componentToRemove);
      } catch {
        log.error(`Error removing component ${name}`);
      }
    }

    // Remove the selected components from the config and update the config file
    config.components = config.components.filter(
      (c: { name: string }) => !namesToRemove.has(c.name),
    );
    await writeConfig(workingDirectory, config);
    spinner.stop();

    if (removed.length) {
      log.ln();
      log.info("Removed components:");
      removed.forEach((c) => log.blank(`- ${c.name}@${c.version}`));
    }
  });

async function getComponentsToRemove(opts: {
  components: string[];
  all: boolean;
  config: Config;
}): Promise<ComponentRegistryEntry[] | null> {
  const { components, all, config } = opts;

  if (!config.components || config.components.length === 0) {
    log.warn("No components are currently installed.");
    return null;
  }

  if (all) {
    return config.components;
  }

  if (!components.length) {
    const choices = config.components.map((c: ComponentRegistryEntry) => ({
      name: c.name,
      value: c,
    }));

    const { selected } = await inquirer.prompt([
      {
        type: "checkbox",
        message: "Which components would you like to remove?",
        name: "selected",
        choices,
      },
    ]);

    if (!selected.length) {
      log.warn("You did not select any components to remove.");
      return null;
    }
    return selected;
  }

  const found: ComponentRegistryEntry[] = [];
  const notFound: string[] = [];

  for (const name of components) {
    const match = config.components.find(
      (c) => c.name.toLowerCase() === name.toLowerCase(),
    );
    if (match) {
      found.push(match);
    } else {
      notFound.push(name);
    }
  }

  if (notFound.length) {
    log.warn("The following components were not found:");
    notFound.forEach((n) => log.blank(`- ${n}`));
  }

  if (!found.length) {
    log.ln();
    log.warn("No matching components found to remove.");
    return null;
  }

  return found;
}
