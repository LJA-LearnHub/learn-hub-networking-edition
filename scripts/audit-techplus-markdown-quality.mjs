/**
 * Static quality scan for Tech+ chapter Markdown (chapters/*.md).
 * Catches common PDF extraction defects that slip past prose reading.
 *
 * Run: node scripts/audit-techplus-markdown-quality.mjs
 * Exit 1 if any CRITICAL pattern matches; warnings print for review.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const mdDir = path.resolve(__dirname, "../chapters");

const CRITICAL = [
  { name: "FC0- U71 (space in exam code)", re: /FC0-\s+U71/ },
  { name: "Page footer Summary NNN", re: /^\s*Summary\s+\d{2,4}\s*$/m },
  { name: "Printed header NNN Chapter …", re: /^\d+\s+Chapter\s+(?:\d+\s*)+[▪■\-]/m },
  { name: "Split chapter number Chapter 1 1", re: /\bChapter\s+1\s+1\b/ },
  { name: "Technet24 watermark", re: /technet24/i },
];

const WARN = [
  { name: "Possible hyphenated word break (foo- newline bar)", re: /[a-z]{2,}-\s*\n\s*[a-z]{2,}/gi },
  { name: "PDF footer Operating System Fundamentals NNN", re: /^Operating System Fundamentals\s+\d/m },
  { name: "PDF footer Review Questions NNN (standalone)", re: /^Review Questions\s+\d/m },
  { name: "PDF footer Exam Essentials NNN (standalone)", re: /^Exam Essentials\s+\d/m },
  { name: "PDF footer Chapter N Lab NNN (standalone)", re: /^Chapter\s+\d+\s+Lab\s+\d/m },
  { name: "PDF footer Setting Up… / Using Web… (standalone)", re: /^(Setting Up a Small Wireless Network|Using Web Browsers|Managing an Operating System)\s+\d/m },
  { name: "Windows 1 1 (split eleven)", re: /\bWindows\s+1\s+1\b/ },
  { name: "zeroday (prefer zero-day)", re: /\bzeroday\b/gi },
  { name: "onetoone (prefer one-to-one)", re: /\bonetoone\b/gi },
  { name: "Webbrowsing (prefer Web browsing)", re: /\bWebbrowsing\b/gi },
  { name: "UTF- space digit", re: /UTF-\s+\d/ },
];

function scanFile(rel, text) {
  const hits = [];
  for (const { name, re } of CRITICAL) {
    if (re.test(text)) hits.push({ level: "CRITICAL", name, file: rel });
  }
  for (const { name, re } of WARN) {
    const m = text.match(re);
    if (m && m.length) hits.push({ level: "WARN", name, file: rel, count: m.length });
  }
  return hits;
}

const files = fs.readdirSync(mdDir).filter((f) => f.endsWith(".md")).sort();
let criticalCount = 0;
const all = [];

for (const f of files) {
  const p = path.join(mdDir, f);
  const text = fs.readFileSync(p, "utf8");
  const hits = scanFile(f, text);
  for (const h of hits) {
    all.push(h);
    if (h.level === "CRITICAL") criticalCount++;
  }
}

for (const h of all) {
  if (h.level === "CRITICAL") {
    console.error(`CRITICAL  ${h.file}: ${h.name}`);
  } else {
    console.warn(`WARN      ${h.file}: ${h.name}${h.count != null ? ` (${h.count})` : ""}`);
  }
}

if (criticalCount === 0) {
  console.log(`OK: ${files.length} chapter files — no critical PDF/footer patterns detected.`);
} else {
  console.error(`\nFAILED: ${criticalCount} critical issue(s). Fix chapters or run normalize-techplus-markdown.mjs where appropriate.`);
  process.exit(1);
}
