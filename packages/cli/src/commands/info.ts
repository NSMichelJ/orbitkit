import { ORBIT_CONFIG_FILE_NAME } from "@/utils/constants";
import { log } from "@/utils/log";
import readConfig from "@/utils/readConfig";
import { Command } from "commander";
import fs from "fs-extra";
import path from "node:path";

export const info = new Command()
  .name("info")
  .description("Show OrbitUI project information")
  .option(
    "-w, --working-directory <path>",
    "Specify the working directory path",
    process.cwd(),
  )
  .action(async (args) => {
    const workingDirectory = path.resolve(args.workingDirectory);
    const configPath = path.join(workingDirectory, ORBIT_CONFIG_FILE_NAME);

    if (!(await fs.pathExists(configPath))) {
      log.error("OrbitUI configuration not found.");
      return;
    }

    const config = await readConfig(workingDirectory);

    if (!config) {
      log.error("Failed to read OrbitUI configuration.");
      return;
    }

    log.ln();
    log.info("OrbitUI Project Information:");
    log.blank(`Working Directory: ${workingDirectory}`);
    log.blank(`Components Directory: ${config.componentsDir || "Not set"}`);
    if (config.components && config.components.length > 0) {
      log.blank("Installed Components:");
      config.components.forEach((c: { name: string; version: string }) => {
        log.blank(`- ${c.name}@${c.version}`);
      });
    } else {
      log.blank("No components installed.");
    }
  });
