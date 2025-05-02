import { readFileSync } from "fs";
import path from "path";

export function getStats() {
  const jsonPath = "../characterStats.json";
  const statsPath = path.join(__dirname, jsonPath);
  const stats = JSON.parse(readFileSync(statsPath, "utf8"));

  return stats;
}
