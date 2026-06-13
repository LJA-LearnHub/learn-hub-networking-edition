/**
 * Sanity checks for Tech+ segment HTML (tag safety + obvious PDF glitches).
 * Validates merged content from learn-hub-techplus-md-ch*.js chapter files + loader (no segments).
 * Run: node scripts/validate-techplus-html.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { readMergedChapterMaps } from "./techplus-chapter-io.mjs";

function stripPres(html) {
  return html.replace(/<pre[\s\S]*?<\/pre>/gi, "");
}

/** @returns {{ id: string, kind: string }[]} */
export function validateTechplusSegments(o) {
  const issues = [];
  for (const [id, html] of Object.entries(o)) {
    if (typeof html !== "string") continue;

    const bare = stripPres(html);

    if (/<body[\s>]/i.test(bare)) {
      issues.push({ id, kind: "raw <body> (likely to break the host page); keep sample markup inside <pre><code> only" });
    }
    if (/<\/body>/i.test(bare)) {
      issues.push({ id, kind: "raw </body> outside <pre>" });
    }
    if (/<html\s+[^>]*>/i.test(bare) || /<\/html>/i.test(bare)) {
      issues.push({ id, kind: "raw <html> element outside escaped / pre-wrapped sample" });
    }
    if (/<script[\s>]/i.test(bare)) {
      issues.push({ id, kind: "raw <script> in segment (escape or move to <pre><code>)" });
    }
    if (/<header[\s>]/i.test(bare) || /<\/header>/i.test(bare)) {
      issues.push({ id, kind: "raw <header> outside sample code block" });
    }

    if (/<li>[^<]+<\/p>/i.test(html)) {
      issues.push({ id, kind: "<li> closed with </p> (invalid list / PDF line-break corruption)" });
    }
    if (/<p\s+<\/p>/i.test(html)) {
      issues.push({ id, kind: "broken empty <p> (e.g. <p </p>)" });
    }
  }
  return issues;
}

function loadSegmentsFromRepo() {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const root = path.resolve(__dirname, "..");
  return readMergedChapterMaps(root);
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  const o = loadSegmentsFromRepo();
  const issues = validateTechplusSegments(o);

  if (issues.length) {
    console.error("Validation failed:", issues.length, "issue(s)\n");
    for (const x of issues) console.error(`  ${x.id}: ${x.kind}`);
    process.exit(1);
  }

  console.log("OK:", Object.keys(o).length, "Tech+ segments — no raw document tags outside <pre>, no obvious <li>/</p> corruption.");
}
