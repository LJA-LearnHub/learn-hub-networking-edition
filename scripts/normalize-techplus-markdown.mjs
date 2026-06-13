/**
 * Cleanup for Tech+ chapter Markdown (all lessons).
 * - Removes PDF watermarks, printed page headers/footers, and common OCR splits.
 *
 * Run from Learn-Hub root: node scripts/normalize-techplus-markdown.mjs
 *
 * Writes: chapters/*.md
 * Mirrors to f:/TechPlus_Lessons/*.md when that path exists.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import {
  applyTechPlusReadabilityFixes,
  promoteTechplusChapterIntroBanner,
  stripOrphanChapterNumberAfterObjectives,
} from "./techplus-pdf-fixes.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const learnHubRoot = path.resolve(__dirname, "..");
const mdDir = path.join(learnHubRoot, "chapters");
const mirrorRoot = path.resolve("f:/TechPlus_Lessons");

const files = fs.readdirSync(mdDir).filter((f) => f.endsWith(".md")).sort();

function normalizeBody(raw) {
  let t = raw.replace(/\r\n/g, "\n");

  /** PDF chapter intro: plain lines → ## title + **exam banner** */
  t = promoteTechplusChapterIntroBanner(t);

  /** Watermark */
  t = t.replace(/^\s*(?:Technet24|technet24)\s*$/gim, "");
  t = t.replace(/\b(?:Technet24|technet24)\b/gi, "");

  /** Printed "618 Chapter 12 ■ …" headers (PDF page + chapter title) */
  t = t.replace(/^\d+\s+Chapter\s+\d+\s+[▪■\-].+$/gim, "");
  /** Split chapter digits: "566 Chapter 1 1 ■ …" */
  t = t.replace(/^\d+\s+Chapter\s+(?:\d+\s*)+\s*[▪■\-].+$/gim, "");
  /** Footer like "Chapter 1 1 Lab 609" */
  t = t.replace(/^Chapter\s+\d(?:\s+\d)+\s+Lab.*$/gim, "");
  /** "Summary 607" page footers */
  t = t.replace(/^\s*Summary\s+\d{2,4}\s*$/gim, "");
  /** Printed section + page, e.g. "Operating System Fundamentals 203" */
  t = t.replace(/^Operating System Fundamentals\s+\d{1,4}\s*$/gim, "");
  /** More PDF running footers (section title + page number, whole line only) */
  t = t.replace(/^(Review Questions|Exam Essentials)\s+\d{1,4}\s*$/gim, "");
  t = t.replace(/^Chapter\s+\d+\s+Lab\s+\d{1,4}\s*$/gim, "");
  t = t.replace(/^Setting Up a Small Wireless Network\s+\d{1,4}\s*$/gim, "");
  t = t.replace(/^Using Web Browsers\s+\d{1,4}\s*$/gim, "");
  t = t.replace(/^Managing an Operating System\s+\d{1,4}\s*$/gim, "");

  /** Running footers (page numbers); use .+ so commas inside titles match */
  t = t.replace(/^\s*(Exploring|Understanding)\s+.+\s+\d{1,4}\s*$/gim, "");

  /** Common PDF line-break / OCR splits */
  t = t.replace(/\bpur\s+poses\b/gi, "purposes");
  /** "their" / "purposes" split across lines in exam objectives */
  t = t.replace(/\btheir\s*\n\s*purposes\b/gi, "their purposes");
  t = t.replace(/Computing Devicesand\b/g, "Computing Devices and");
  t = t.replace(/\bT wenty\b/g, "Twenty");

  t = t.replace(/\n{3,}/g, "\n\n");

  /** "Chapter" + lone chapter digit after objectives (PDF artifact) */
  t = stripOrphanChapterNumberAfterObjectives(t);

  /** Note: do not promote plain-line PDF section titles to ### here — each <h3> splits the Tech+ study-guide into a new lesson in build-techplus-from-markdown.mjs. Heading-like lines are handled at HTML build time (maybeHeading) instead. */

  t = applyTechPlusReadabilityFixes(t);
  return t.trimEnd() + "\n";
}

let changed = 0;
for (const name of files) {
  const p = path.join(mdDir, name);
  const before = fs.readFileSync(p, "utf8");
  const after = normalizeBody(before);
  if (after !== before) {
    fs.writeFileSync(p, after, "utf8");
    changed++;
    console.log("updated", name);
  }
  if (fs.existsSync(mirrorRoot)) {
    const mp = path.join(mirrorRoot, name);
    if (fs.existsSync(mp)) {
      const mb = fs.readFileSync(mp, "utf8");
      const ma = normalizeBody(mb);
      if (ma !== mb) {
        fs.writeFileSync(mp, ma, "utf8");
        console.log("mirror updated", name);
      }
    }
  }
}

console.log(`normalize-techplus-markdown: ${changed} / ${files.length} chapter file(s) changed in chapters/.`);
