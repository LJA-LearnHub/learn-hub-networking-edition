/**
 * Applies scripts/techplus-html-polish.mjs to each learn-hub-techplus-md-ch*.js file,
 * rewrites the loader, then prints cache-bust hints.
 */
import crypto from "crypto";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { polishTechplusHtml } from "./techplus-html-polish.mjs";
import { validateTechplusSegments } from "./validate-techplus-html.mjs";
import { readMergedChapterMaps, writeChapterJsFiles, writeTechplusMdLoader } from "./techplus-chapter-io.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

const banner =
  "/* Polished by scripts/apply-techplus-html-polish.mjs — prefer npm run build:techplus from Markdown */\n";

const map = readMergedChapterMaps(root);
for (const key of Object.keys(map)) {
  map[key] = polishTechplusHtml(map[key]);
}
const vIssues = validateTechplusSegments(map);
if (vIssues.length) {
  console.error("Polish produced HTML that failed validation:");
  for (const x of vIssues) console.error(`  ${x.id}: ${x.kind}`);
  process.exit(1);
}

const chHashes = writeChapterJsFiles(root, map, banner);
const loaderPath = writeTechplusMdLoader(root, chHashes, banner);
console.log("Polished", Object.keys(map).length, "segments → chapter files +", loaderPath);

const hash = crypto.createHash("sha256").update(fs.readFileSync(loaderPath, "utf8"), "utf8").digest("hex").slice(0, 12);
const indexPath = path.join(root, "index.html");
let indexHtml = fs.readFileSync(indexPath, "utf8");
const nextIndex = indexHtml.replace(
  /(<script src="assets\/learn-hub-techplus-md\.js)(\?[^"]*)?("><\/script>)/,
  `$1?v=${hash}$3`
);
if (nextIndex !== indexHtml) {
  fs.writeFileSync(indexPath, nextIndex, "utf8");
  console.log("Updated index.html: learn-hub-techplus-md.js?v=" + hash);
} else {
  console.log("index.html already has learn-hub-techplus-md.js?v=" + hash);
}
