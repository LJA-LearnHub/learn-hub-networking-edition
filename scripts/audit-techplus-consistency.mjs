/**
 * Verifies Tech+ study-guide segments match their chapter IDs and stay aligned with learn-hub-courses.js.
 * Run: node scripts/audit-techplus-consistency.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { readMergedChapterMaps } from "./techplus-chapter-io.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

/** Must match CHAPTER_FILES in scripts/build-techplus-from-markdown.mjs (base id + chapter title). */
const CHAPTER_FILES = [
  ["tech-sg-01", "Ch 1 — Core Hardware Components"],
  ["tech-sg-02", "Ch 2 — Peripherals and Connectors"],
  ["tech-sg-03", "Ch 3 — Computing Devices and IoT"],
  ["tech-sg-04", "Ch 4 — Operating Systems"],
  ["tech-sg-05", "Ch 5 — Software Applications"],
  ["tech-sg-06", "Ch 6 — Software Development"],
  ["tech-sg-07", "Ch 7 — Database Fundamentals"],
  ["tech-sg-08", "Ch 8 — Networking Concepts and Technologies"],
  ["tech-sg-09", "Ch 9 — Cloud Computing and AI"],
  ["tech-sg-10", "Ch 10 — Security Concepts and Threats"],
  ["tech-sg-11", "Ch 11 — Security Best Practices"],
  ["tech-sg-12", "Ch 12 — Data Continuity and Computer Support"],
];

function loadTechplusMap() {
  return readMergedChapterMaps(root);
}

function loadCourses() {
  const p = path.join(root, "assets", "learn-hub-courses.js");
  const t = fs.readFileSync(p, "utf8");
  const start = t.indexOf("[");
  const end = t.lastIndexOf("]");
  return JSON.parse(t.slice(start, end + 1));
}

function chapterKeyFromLessonId(id) {
  const m = String(id).match(/^tech-sg-(\d{2})-\d{2}$/);
  return m ? `tech-sg-${m[1]}` : null;
}

function compareIds(a, b) {
  const pa = a.split("-").map((x) => (/^\d+$/.test(x) ? Number(x, 10) : x));
  const pb = b.split("-").map((x) => (/^\d+$/.test(x) ? Number(x, 10) : x));
  for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
    const va = pa[i] ?? "";
    const vb = pb[i] ?? "";
    if (va < vb) return -1;
    if (va > vb) return 1;
  }
  return 0;
}

function main() {
  const baseToChapter = new Map(CHAPTER_FILES.map((row) => [row[0], row[1]]));

  const map = loadTechplusMap();
  const ids = Object.keys(map)
    .filter((k) => /^tech-sg-\d{2}-\d{2}$/.test(k))
    .sort(compareIds);

  const errors = [];

  for (const id of ids) {
    const base = chapterKeyFromLessonId(id);
    if (!base || !baseToChapter.has(base)) {
      errors.push(`${id}: unknown chapter prefix`);
      continue;
    }
    const expected = baseToChapter.get(base);
    const html = map[id];
    const chMatch = html.match(/<span class="lh-tg-chapter">([^<]*)<\/span>/);
    if (!chMatch) {
      errors.push(`${id}: missing lh-tg-chapter span`);
      continue;
    }
    const found = chMatch[1].trim();
    if (found !== expected) {
      errors.push(`${id}: chapter label mismatch — expected "${expected}", found "${found}"`);
    }
    const codeMatch = html.match(/<code>(tech-sg-\d{2}-\d{2})<\/code>/);
    if (!codeMatch || codeMatch[1] !== id) {
      errors.push(`${id}: lesson <code> id in banner does not match key`);
    }
  }

  const courses = loadCourses();
  const tech = courses.find((c) => c.id === "tech");
  if (!tech?.lessons) {
    errors.push("tech course missing or has no lessons");
  } else {
    const sgFromCourse = tech.lessons.map((l) => l.id).filter((id) => /^tech-sg-\d{2}-\d{2}$/.test(id));
    if (sgFromCourse.length !== ids.length) {
      errors.push(
        `study-guide lesson count mismatch: courses.js has ${sgFromCourse.length}, techplus-md has ${ids.length}`
      );
    }
    const sortedCourse = [...sgFromCourse].sort(compareIds);
    for (let i = 0; i < Math.max(sortedCourse.length, ids.length); i++) {
      if (sortedCourse[i] !== ids[i]) {
        errors.push(
          `ID set/order mismatch at ${i}: sorted courses "${sortedCourse[i] ?? "∅"}" vs md "${ids[i] ?? "∅"}"`
        );
        break;
      }
    }
    for (let i = 0; i < Math.min(sgFromCourse.length, ids.length); i++) {
      if (sgFromCourse[i] !== ids[i]) {
        errors.push(
          `courses.js study-guide rows must stay in build order (chapter 1…12, lesson 01…NN). First diff at index ${i}: "${sgFromCourse[i]}" vs "${ids[i]}". Re-run npm run build:techplus.`
        );
        break;
      }
    }
  }

  if (errors.length) {
    console.error("Tech+ consistency audit failed:\n");
    for (const e of errors) console.error("  •", e);
    process.exit(1);
  }

  console.log(
    "OK:",
    ids.length,
    "study-guide segments — chapter labels match CHAPTER_FILES, banner lesson codes match keys, courses.js study-guide IDs and order match."
  );
}

main();
