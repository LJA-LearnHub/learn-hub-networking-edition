/**
 * Build full lesson HTML from detailed_network_plus_summer_curriculum_expanded.md
 * Run: node network-space/scripts/build-network-lessons.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { marked } from "../../scripts/vendor/marked.esm.mjs";
import { getExpansion } from "./lesson-expansions.mjs";
import { buildLessonFooter, extractReferenceAppendix } from "./lesson-footer.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..", "..", "..");
const MD_PATH = path.join(ROOT, "detailed_network_plus_summer_curriculum_expanded.md");
const OUT_DIR = path.join(__dirname, "..", "lessons");
const MIN_EXPAND = 6000;

marked.setOptions({ gfm: true, breaks: false });

function parseMarkdown(md) {
  const lessons = [];
  const weekRe = /^# Week (\d+) — /gm;
  const weeks = [];
  let m;
  while ((m = weekRe.exec(md)) !== null) {
    weeks.push({ num: parseInt(m[1], 10), start: m.index + m[0].length });
  }
  for (let i = 0; i < weeks.length; i++) {
    const w = weeks[i];
    const end = i + 1 < weeks.length ? weeks[i + 1].start - (`# Week ${weeks[i + 1].num} — `.length) : md.length;
    const block = md.slice(w.start, end);
    const firstNl = block.indexOf("\n");
    const weekTitle = block.slice(0, firstNl).trim();
    const weekBody = block.slice(firstNl + 1);

    const dayRe = /^#{1,2} Day (\d+) — (.+)$/gm;
    const dayMatches = [];
    let d;
    while ((d = dayRe.exec(weekBody)) !== null) {
      dayMatches.push({
        num: parseInt(d[1], 10),
        title: d[2].trim(),
        index: d.index,
        headerLen: d[0].length,
      });
    }
    for (let j = 0; j < dayMatches.length; j++) {
      const dm = dayMatches[j];
      const start = dm.index + dm.headerLen;
      const end = j + 1 < dayMatches.length ? dayMatches[j + 1].index : weekBody.length;
      let raw = weekBody.slice(start, end).trim();

      lessons.push({
        week: w.num,
        day: dm.num,
        key: `w${w.num}d${dm.num}`,
        weekTitle,
        title: dm.title,
        markdown: raw,
      });
    }
  }
  return lessons;
}

function mdToHtml(md) {
  let html = marked.parse(md);
  html = html.replace(/<pre><code class="language-(\w+)">/g, '<pre class="code-block"><code class="language-$1">');
  html = html.replace(/<pre><code>/g, '<pre class="code-block"><code>');
  html = html.replace(/<table>/g, '<table class="data-table">');
  return html;
}

function wrapLesson(lesson, bodyHtml) {
  return (
    `<article class="lesson-prose lh-lesson-body" data-week="${lesson.week}" data-day="${lesson.day}">` +
    `<header class="lesson-inline-header"><span class="lesson-badge">Week ${lesson.week} · Day ${lesson.day}</span>` +
    `<h2 class="lesson-title">${escapeHtml(lesson.title)}</h2></header>` +
    bodyHtml +
    `</article>`
  );
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function build() {
  if (!fs.existsSync(MD_PATH)) {
    console.error("Missing:", MD_PATH);
    process.exit(1);
  }
  const md = fs.readFileSync(MD_PATH, "utf8");
  const lessons = parseMarkdown(md);
  console.log("Parsed", lessons.length, "lessons");

  fs.mkdirSync(OUT_DIR, { recursive: true });

  const byWeek = {};
  for (const lesson of lessons) {
    let html = mdToHtml(lesson.markdown);
    if (lesson.markdown.length < MIN_EXPAND) {
      html += getExpansion(lesson.week, lesson.day, lesson.title);
    }
    html += buildLessonFooter(lesson);
    html = html.replace(/<\/?motion\b/g, (x) => x.replace("motion", "div"));
    const full = wrapLesson(lesson, html);

    if (!byWeek[lesson.week]) byWeek[lesson.week] = {};
    byWeek[lesson.week][lesson.day] = {
      title: lesson.title,
      html: full,
    };
  }

  for (let w = 1; w <= 10; w++) {
    const data = byWeek[w];
    if (!data) continue;
    const pad = String(w).padStart(2, "0");
    const lines = [
      `/* Auto-generated — do not edit by hand. Run build-network-lessons.mjs */`,
      `window.NETPLUS_LESSONS_W${w} = ${JSON.stringify(data, null, 0)};`,
      "",
    ];
    fs.writeFileSync(path.join(OUT_DIR, `week-${pad}.js`), lines.join("\n"), "utf8");
    console.log("Wrote week-" + pad + ".js", Object.keys(data).length, "days");
  }

  const index = {
    weeks: Object.keys(byWeek).map(Number),
    total: lessons.length,
    source: "detailed_network_plus_summer_curriculum_expanded.md",
  };
  fs.writeFileSync(
    path.join(OUT_DIR, "index.js"),
    `window.NETPLUS_LESSONS_META = ${JSON.stringify(index)};`,
    "utf8"
  );

  const refMd = extractReferenceAppendix(md);
  if (refMd) {
    const studyMd = md.slice(md.indexOf("# Recommended Study Habits"), md.indexOf("# Key Port Numbers"));
    const appendix =
      `<article class="lesson-prose reference-appendix">` +
      mdToHtml(studyMd) +
      mdToHtml(refMd) +
      `</article>`;
    fs.writeFileSync(
      path.join(OUT_DIR, "reference.js"),
      `/* Auto-generated reference appendix */\nwindow.NETPLUS_REFERENCE_HTML = ${JSON.stringify(appendix)};\n`,
      "utf8"
    );
    console.log("Wrote reference.js");
  }
}

build();
