/**
 * Prints paths that belong in a GitHub source upload (Learn Hub app root).
 * Run from update_v1.0.7: node scripts/github-upload-paths.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

const roots = [
  "package.json",
  "package-lock.json",
  "main.js",
  "index.html",
  "study-secret.html",
  "network-secret.html",
  "docs/project/WHAT_TO_UPLOAD.txt",
  "assets",
  "build",
  "docs",
  "scripts",
  "study-space",
  "network-space",
  "tech-plus-exam",
];

console.log("GitHub source upload — include these paths (repo root = update_v1.0.7):\n");
let ok = true;
for (const rel of roots) {
  const p = path.join(root, rel);
  if (!fs.existsSync(p)) {
    console.error(`MISSING: ${rel}`);
    ok = false;
    continue;
  }
  const stat = fs.statSync(p);
  const tag = stat.isDirectory() ? "(dir)" : "(file)";
  console.log(`  ${rel}  ${tag}`);
}
console.log("\nIgnored by .gitignore (do not commit): node_modules/, exe-build/, *.exe, …");
process.exit(ok ? 0 : 1);
