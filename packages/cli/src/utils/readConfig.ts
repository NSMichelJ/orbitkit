import { Config } from "@/types/config";
import fs from "fs-extra";
import path from "node:path";
import { ORBIT_CONFIG_FILE_NAME } from "./constants";

export default async function readConfig() {
  try {
    const file = path.join(process.cwd(), ORBIT_CONFIG_FILE_NAME);
    if (!(await fs.pathExists(file))) {
      return null;
    }
    const config = await fs.readJSON(file, { encoding: "utf-8" });
    return config as Config;
  } catch {
    return null;
  }
}
