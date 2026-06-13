/**
 * Prints a Markdown table of line / byte / character counts for Learn-Hub files.
 * Run from repo root: node scripts/print-learn-hub-manifest.mjs
 * Use to refresh the "File manifest" section in README.md after intentional edits.
 * Includes Tech+ sources, Security/Kali bundles + builders, Kali curriculum emit helpers, and docs/KALI_HANDS_ON_LAB_CURRICULUM.md.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

const FILES = [
  "README.md",
  "index.html",
  "assets/learn-hub-tokens.css",
  "assets/learn-hub-layout.css",
  "assets/learn-hub-teach.css",
  "assets/learn-hub-app.js",
  "assets/learn-hub-courses.js",
  "assets/learn-hub-deep.js",
  "assets/learn-hub-depth.js",
  "assets/learn-hub-playground.js",
  "assets/learn-hub-techplus.js",
  "assets/learn-hub-techplus-md.js",
  "assets/learn-hub-security-md.js",
  "assets/learn-hub-kali-md.js",
  "docs/KALI_HANDS_ON_LAB_CURRICULUM.md",
  "scripts/learn-hub-paths.mjs",
  "scripts/techplus-chapter-io.mjs",
  "chapters/01_Core_Hardware_Components.md",
  "chapters/02_Peripherals_and_Connectors.md",
  "chapters/03_Computing_Devices_and_the_Internet_of_Things.md",
  "chapters/04_Operating_Systems.md",
  "chapters/05_Software_Applications.md",
  "chapters/06_Software_Development.md",
  "chapters/07_Database_Fundamentals.md",
  "chapters/08_Networking_Concepts_and_Technologies.md",
  "chapters/09_Cloud_Computing_and_Artificial_Intelligence.md",
  "chapters/10_Security_Concepts_and_Threats.md",
  "chapters/11_Security_Best_Practices.md",
  "chapters/12_Data_Continuity_and_Computer_Support.md",
  "scripts/add-more-lessons.mjs",
  "scripts/build-split.mjs",
  "scripts/expand-capstone-and-quiz-bank.mjs",
  "scripts/expand-tracks-more.mjs",
  "scripts/build-techplus-from-markdown.mjs",
  "scripts/build-techplus-import.mjs",
  "scripts/apply-techplus-html-polish.mjs",
  "scripts/techplus-html-polish.mjs",
  "scripts/validate-techplus-html.mjs",
  "scripts/fold-depth-into-courses.mjs",
  "scripts/migrate-fcc-deep-playground.mjs",
  "scripts/print-learn-hub-manifest.mjs",
  "scripts/audit-techplus-consistency.mjs",
  "scripts/audit-techplus-segment-foreign-ids.mjs",
  "scripts/compare-tech-curriculum.mjs",
  "scripts/fix-techplus-source-banner-titles.mjs",
  "scripts/restore-techplus-md-from-reference.mjs",
  "scripts/build-security-from-markdown.mjs",
  "scripts/build-kali-from-markdown.mjs",
  "scripts/emit-kali-slow-curriculum.mjs",
  "scripts/kali-lab-rich-procedures.mjs",
];

function stats(rel) {
  const fp = path.join(root, rel);
  const buf = fs.readFileSync(fp);
  const text = buf.toString("utf8");
  const lines = text.split(/\r\n|\r|\n/).length;
  const bytes = buf.length;
  const chars = [...text].length;
  return { rel: rel.replace(/\\/g, "/"), lines, bytes, chars };
}

const rows = FILES.map((f) => stats(f));
const sumLines = rows.reduce((a, r) => a + r.lines, 0);
const sumBytes = rows.reduce((a, r) => a + r.bytes, 0);
const sumChars = rows.reduce((a, r) => a + r.chars, 0);
const today = new Date().toISOString().slice(0, 10);

let out = "";
out += "| File | Lines | UTF-8 bytes | Unicode scalar values* |\n";
out += "|------|------:|-------------:|-------------------------:|\n";
for (const r of rows) {
  out += `| \`${r.rel}\` | ${r.lines.toLocaleString("en-US")} | ${r.bytes.toLocaleString("en-US")} | ${r.chars.toLocaleString("en-US")} |\n`;
}
out += `| **Total (listed files)** | **${sumLines.toLocaleString("en-US")}** | **${sumBytes.toLocaleString("en-US")}** | **${sumChars.toLocaleString("en-US")}** |\n`;
out += "\n";
out += `*Recorded with \`scripts/print-learn-hub-manifest.mjs\` on ${today} (UTC date).*\n`;
process.stdout.write(out);
