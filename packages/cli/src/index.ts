#!/usr/bin/env node

import { Command } from "commander";

import { add, info, init, remove } from "@/commands";
import packageJson from "package.json";

const program = new Command();

process.on("SIGINT", () => {
  console.log("\nInitialization canceled.");
  process.exit(0);
});

function main() {
  program
    .name(packageJson.name)
    .description(packageJson.description)
    .version(
      packageJson.version,
      "-v, --version",
      "Output the current version",
    );

  program.addCommand(init);
  program.addCommand(add);
  program.addCommand(remove);
  program.addCommand(info);

  program.parse();
}

main();
