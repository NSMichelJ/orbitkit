import { Config } from "@/types/config";
import fs from "fs-extra";
import path from "node:path";
import { ORBIT_CONFIG_FILE_NAME } from "./constants";

export default function writeConfig(config: Config) {
  try {
    const file = path.join(process.cwd(), ORBIT_CONFIG_FILE_NAME);
    fs.outputJSON(file, config, {
      encoding: "utf-8",
      spaces: 2,
    });
    return { created: true, error: null };
  } catch (error) {
    return { created: false, error };
  }
}
