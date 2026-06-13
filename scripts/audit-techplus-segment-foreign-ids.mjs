/**
 * Flags Tech+ MD segments whose HTML mentions a different tech-sg-* lesson id than the map key
 * (common symptom of split/build mix-ups).
 *
 * Run: node scripts/audit-techplus-segment-foreign-ids.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { readMergedChapterMaps } from "./techplus-chapter-io.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

const ID_RE = /tech-sg-\d{2}-\d{2}/g;

function main() {
  const map = readMergedChapterMaps(root);
  const ids = Object.keys(map)
    .filter((k) => /^tech-sg-\d{2}-\d{2}$/.test(k))
    .sort();

  const issues = [];
  for (const id of ids) {
    const html = map[id] || "";
    const found = new Set();
    let m;
    const re = new RegExp(ID_RE.source, "g");
    while ((m = re.exec(html))) found.add(m[0]);

    const foreign = [...found].filter((x) => x !== id);
    if (foreign.length) {
      issues.push({ id, foreign, snippet: html.slice(0, 220).replace(/\s+/g, " ") });
    }
  }

  if (issues.length) {
    console.error("Segments referencing other tech-sg lesson ids:\n");
    for (const row of issues) {
      console.error(`  ${row.id} → also mentions: ${row.foreign.join(", ")}`);
    }
    process.exit(1);
  }

  console.log("OK:", ids.length, "segments — no foreign tech-sg-* id strings inside another segment's HTML.");
}

main();
