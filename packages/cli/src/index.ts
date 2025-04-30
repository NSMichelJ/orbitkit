import { Command } from "commander";

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

  program.parse();
}

main();
