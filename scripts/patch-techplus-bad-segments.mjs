/**
 * Surgical fixes for bad Tech+ segments (truncated titles, PDF runners, thin stubs).
 * Run: node scripts/patch-techplus-bad-segments.mjs
 */
import crypto from "crypto";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { readMergedChapterMaps, writeChapterJsFiles, writeTechplusMdLoader } from "./techplus-chapter-io.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const coursesPath = path.join(root, "assets", "learn-hub-courses.js");
const indexPath = path.join(root, "index.html");

function loadMap() {
  return readMergedChapterMaps(root);
}

function escHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function wrapBody(lessonId, lessonTitle, chapterTitle, innerHtml) {
  return (
    `<p class="lh-tg-source"><strong>${escHtml(lessonTitle)}</strong> · <span class="lh-tg-chapter">${escHtml(
      chapterTitle
    )}</span> · Lesson <code>${escHtml(lessonId)}</code> · CompTIA Tech+ FC0-U71. Study-guide text only—read in order with the rest of this chapter’s lessons.</p>` +
    `<hr class="teach-hr lh-md-start"/>` +
    `<div class="lh-tg-root tech-prose lh-tg-markdown lh-chapter-markdown">${innerHtml.trim()}</div>`
  );
}

/** Remove PDF running-footer paragraphs from inner HTML */
function stripExploringFooters(inner) {
  return inner.replace(/<p(\s[^>]*)?>\s*Exploring\s+[^<]+\s+\d{1,3}\s*<\/p>/gi, "");
}

/** Inner HTML inside lh-chapter-markdown div (preserve patched bodies). */
function extractChapterInner(wrapped) {
  const s = String(wrapped);
  const key = 'lh-chapter-markdown">';
  const i = s.indexOf(key);
  if (i < 0) return "";
  const start = i + key.length;
  const end = s.lastIndexOf("</div>");
  return end > start ? s.slice(start, end) : "";
}

function main() {
  const map = loadMap();

  const ch1 = "Ch 1 — Core Hardware Components";
  const ch2 = "Ch 2 — Peripherals and Connectors";

  /* tech-sg-01-12: keep intro only; steps live in 01-13 */
  map["tech-sg-01-12"] = wrapBody(
    "tech-sg-01-12",
    "Exercise 1.4 — viewing storage drive information in Windows",
    ch1,
    "<p>Exercise 1.4 shows how to view information about your storage drives in Windows. Use <strong>Continue</strong> for the step-by-step walkthrough in the next lesson.</p>"
  );

  /* tech-sg-01-13: full exercise body, cleaned */
  let inner13 = stripExploringFooters(
    `<p>EXERCISE 1.4</p>
<p>Examining Storage Drives in Windows 11</p>
<ol>
<li>Open File Explorer in Windows 11 by pressing the Windows key on your keyboard plus the E key. (In the future, I will shorten this by saying “press Windows + E.”) In the left navigation pane, click This PC. This will show the This PC desktop app. A list of the drives on your PC appears, like the one shown in Figure 1.28.</li>
<li>Examine the primary hard disk (C:). You can see a bar that shows you how much storage space it has as well as how much space is free. Figure 1.28 shows an example.</li>
<li>Right-click the primary hard disk (C:), and click Properties. A Properties dialog box opens for that drive, as shown in Figure 1.29.</li>
<li>Examine the information about the file system, used space, free space, and capacity. If free space is low (under about 10 percent), your computer could run slower than it should.</li>
<li>Click the Hardware tab. Information appears about all of the disk drives, including any connected USB storage devices and your optical drive if you have one. Here you can see the brand name and model number of each drive, like in Figure 1.30.</li>
<li>Click Cancel to close the dialog box, and close the This PC window.</li>
</ol>`
  );
  map["tech-sg-01-13"] = wrapBody(
    "tech-sg-01-13",
    "Exercise 1.4 — Examining Storage Drives in Windows 11",
    ch1,
    inner13
  );

  /**
   * Exercise 2.5 is split across 3 study-guide steps (book layout). Label parts so the sidebar
   * does not look like three unrelated “Exercise 2.5” entries.
   */
  const inner0212 = extractChapterInner(map["tech-sg-02-12"]);
  const inner0213 = extractChapterInner(map["tech-sg-02-13"]);
  map["tech-sg-02-11"] = wrapBody(
    "tech-sg-02-11",
    "Exercise 2.5 — Part 1 of 3: introduction",
    ch2,
    "<p><em>One exercise, three short lessons.</em> Exercise 2.5 walks you through a few of the convenience-related options. Note that some of these are purely aesthetic, but others are useful to some people with disabilities or who would otherwise have difficulty using the pointing device.</p><p>Use <strong>Continue</strong> for the hands-on steps, then the follow-up notes.</p>"
  );
  map["tech-sg-02-12"] = wrapBody(
    "tech-sg-02-12",
    "Exercise 2.5 — Part 2 of 3: hands-on steps",
    ch2,
    inner0212 || "<p>Missing segment body.</p>"
  );
  map["tech-sg-02-13"] = wrapBody(
    "tech-sg-02-13",
    "Exercise 2.5 — Part 3 of 3: notes (Control Panel vs Settings)",
    ch2,
    inner0213 || "<p>Missing segment body.</p>"
  );

  const banner = "/* Patched by scripts/patch-techplus-bad-segments.mjs — see script for edits */\n";
  const chHashes = writeChapterJsFiles(root, map, banner);
  const loaderPath = writeTechplusMdLoader(root, chHashes, banner);
  console.log("Wrote chapter chunks +", loaderPath);

  /* Sync titles in learn-hub-courses.js for these ids */
  const ctext = fs.readFileSync(coursesPath, "utf8");
  const cs = ctext.indexOf("[");
  const ce = ctext.lastIndexOf("]");
  const courses = JSON.parse(ctext.slice(cs, ce + 1));
  const tech = courses.find((c) => c.id === "tech");
  if (!tech || !Array.isArray(tech.lessons)) throw new Error("tech course missing");
  const titleById = {
    "tech-sg-01-12": "Exercise 1.4 — viewing storage drive information in Windows",
    "tech-sg-01-13": "Exercise 1.4 — Examining Storage Drives in Windows 11",
    "tech-sg-02-11": "Exercise 2.5 — Part 1 of 3: introduction",
    "tech-sg-02-12": "Exercise 2.5 — Part 2 of 3: hands-on steps",
    "tech-sg-02-13": "Exercise 2.5 — Part 3 of 3: notes (Control Panel vs Settings)",
  };
  for (const L of tech.lessons) {
    if (titleById[L.id]) L.title = titleById[L.id];
  }
  fs.writeFileSync(coursesPath, "window.LEARN_HUB_COURSES = " + JSON.stringify(courses) + ";\n", "utf8");
  console.log("Updated titles in", coursesPath);

  const mdShort = crypto.createHash("sha256").update(fs.readFileSync(loaderPath, "utf8")).digest("hex").slice(0, 12);
  const courseShort = crypto.createHash("sha256").update(fs.readFileSync(coursesPath, "utf8")).digest("hex").slice(0, 12);
  let indexHtml = fs.readFileSync(indexPath, "utf8");
  const nextIndex = indexHtml
    .replace(/(<script src="assets\/learn-hub-courses\.js)(\?[^"]*)?("><\/script>)/, `$1?v=${courseShort}$3`)
    .replace(/(<script src="assets\/learn-hub-techplus-md\.js)(\?[^"]*)?("><\/script>)/, `$1?v=${mdShort}$3`);
  if (nextIndex !== indexHtml) fs.writeFileSync(indexPath, nextIndex, "utf8");
  console.log("Updated index.html ?v= hashes");

  const truncatedStrong = /Note that s<\/strong>/i;
  const hits = Object.keys(map).filter((k) => truncatedStrong.test(map[k]));
  if (hits.length) console.warn("Truncated ‘Note that s’ titles remain:", hits);
  else console.log("Audit: no truncated ‘Note that s’ source titles.");
}

main();
