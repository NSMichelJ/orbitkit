import {
  CLASS_MERGE_UTILS_NAME,
  ORBIT_CONFIG_FILE_NAME,
} from "@/utils/constants";
import { log } from "@/utils/log";
import { mergeCSS } from "@/utils/mergeCSS";
import {
  CLASS_MERGE_UTIL_TEMPLATE,
  ORBIT_CONFIG_CSS_TEMPLATE,
} from "@/utils/templates";
import writeConfig from "@/utils/writeConfig";
import chalk from "chalk";
import { Command } from "commander";

import fs from "fs-extra";
import inquirer from "inquirer";
import path from "node:path";

export const init = new Command()
  .name("init")
  .description("Prepares your Astro project for OrbitUI components")
  .action(async () => {
    try {
      if (!(await fs.pathExists("package.json"))) {
        log.error(
          "package.json not found. This command requires a valid package.json file.",
        );
        return;
      }

      if (!(await fs.pathExists("tsconfig.json"))) {
        log.error("The 'tsconfig.json' file is missing in your project");
        return;
      }

      if (!(await fs.pathExists("astro.config.mjs"))) {
        log.error("Not an Astro project (missing astro.config.mjs).");
        return;
      }

      if (await fs.pathExists(ORBIT_CONFIG_FILE_NAME)) {
        log.info("Orbit UI is already initialized in this project.");

        const { reinitialize } = await inquirer.prompt([
          {
            type: "confirm",
            name: "reinitialize",
            message: chalk.yellow("Do you want to overwrite it? "),
            default: false,
          },
        ]);

        if (!reinitialize) {
          return;
        }
      }

      const answers = await inquirer.prompt([
        {
          type: "input",
          name: "tailwindConfig",
          message: "Where is your Tailwind config file located?",
          default: "./src/styles/global.css",
          required: true,
        },
        {
          type: "input",
          name: "componentsDir",
          message: "Where should components be saved?",
          default: "./src/components/ui",
          required: true,
        },
        {
          type: "input",
          name: "utilsDir",
          message: "Where are your custom utility files?",
          default: "./src/utils",
          required: true,
        },
      ]);

      const PATH = process.cwd();

      const cssFilePath = path.join(PATH, answers.tailwindConfig);
      await initializeCSSConfig(cssFilePath);

      const componentsDirPath = path.join(PATH, answers.componentsDir);
      fs.ensureDir(componentsDirPath);

      const utilsFilePath = path.join(
        PATH,
        answers.utilsDir,
        CLASS_MERGE_UTILS_NAME,
      );
      await initializeUtils(utilsFilePath);

      await setupTsPathAliases(path.join(PATH, "tsconfig.json"));

      const { created } = writeConfig(answers);
      if (created) {
        log.ln();
        log.success("Success!");
        log.blank("OrbitUI has been successfully initialized in your project.");
      } else {
        log.error(`Could not write configuration file.`);
      }
    } catch (error) {
      console.error(error);
      log.error("Initialization failed.");
    }
  });

async function initializeCSSConfig(path: string) {
  await fs.ensureFile(path);
  const cssContent = await fs.readFile(path, {
    encoding: "utf-8",
  });

  if (!cssContent) {
    await fs.writeFile(path, ORBIT_CONFIG_CSS_TEMPLATE, {
      encoding: "utf-8",
    });
    return;
  }

  const css = mergeCSS(cssContent, ORBIT_CONFIG_CSS_TEMPLATE);
  await fs.writeFile(path, css, {
    encoding: "utf-8",
  });
}

async function initializeUtils(path: string) {
  await fs.ensureFile(path);
  await fs.writeFile(path, CLASS_MERGE_UTIL_TEMPLATE, {
    encoding: "utf-8",
  });
}

async function setupTsPathAliases(path: string) {
  const tsConfig = await fs.readJSON(path, {
    encoding: "utf-8",
  });

  tsConfig.compilerOptions = {
    ...tsConfig.compilerOptions,
    baseUrl: ".",
    paths: { "@/*": ["src/*"] },
  };

  fs.writeJSON(path, tsConfig, {
    encoding: "utf-8",
    spaces: 2,
  });
}
