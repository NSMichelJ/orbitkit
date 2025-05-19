import { Config } from "@/types/config";
import fs from "fs-extra";
import path from "node:path";
import { ORBIT_CONFIG_FILE_NAME } from "./constants";

export default async function writeConfig(
  workingDirectory: string,
  config: Config,
) {
  try {
    const file = path.join(workingDirectory, ORBIT_CONFIG_FILE_NAME);
    await fs.outputJSON(file, config, {
      encoding: "utf-8",
      spaces: 2,
    });
    return { created: true, error: null };
  } catch (error) {
    return { created: false, error };
  }
}
