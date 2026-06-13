/**
 * Canonical locations after layout: assets/ (runtime JS+CSS), chapters/ (Tech+ Markdown sources).
 */
import path from "path";
import { fileURLToPath } from "url";

/** Learn-Hub repo root when this module lives in scripts/. */
export function getLearnHubRoot() {
  return path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
}

export function assetsDir(root = getLearnHubRoot()) {
  return path.join(root, "assets");
}

export function chaptersDir(root = getLearnHubRoot()) {
  return path.join(root, "chapters");
}
