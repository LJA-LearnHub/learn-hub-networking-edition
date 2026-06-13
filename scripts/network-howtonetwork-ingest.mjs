/**
 * Extract readable HTML from saved howtonetwork.com pages for Learn Hub lessons.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { HTN_CHAPTERS, HTN_GUIDE_INDEX } from "./network-howtonetwork-chapters.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const HTN_ROOT = path.resolve(__dirname, "..", "..", "howtonetwork");

function encodeFileHref(filename) {
  return encodeURI(filename).replace(/#/g, "%23");
}

function extractMainHtml(raw, file) {
  const quiz = raw.match(/<div id="watupro_quiz"[^>]*>([\s\S]*?)<\/div>\s*<(?:div id="watupro|footer)/i);
  if (quiz) return quiz[1];

  const entry = raw.match(/<div class="entry-content"[^>]*itemprop="text"[^>]*>([\s\S]*?)<\/div>\s*<\/article>/i);
  if (entry) return entry[1];

  const entry2 = raw.match(/<div class="entry-content"[^>]*>([\s\S]*?)<\/div>\s*<(?:footer|\/article)/i);
  return entry2 ? entry2[1] : "";
}

function cleanExtractedHtml(html, sourceFile) {
  let out = html;
  const filesDir = encodeURI(sourceFile.replace(/\.htm$/i, "_files/"));
  const filesDirPlain = sourceFile.replace(/\.htm$/i, "_files/");

  out = out.replace(/<p>\s*<a[^>]*name="Back to book index[^"]*"[^>]*>[\s\S]*?<\/a>\s*<\/p>/gi, "");
  out = out.replace(/<form[\s\S]*?<\/form>/gi, "");
  out = out.replace(/<script[\s\S]*?<\/script>/gi, "");
  out = out.replace(/<input[^>]*>/gi, "");
  out = out.replace(/<noscript[\s\S]*?<\/noscript>/gi, "");

  if (!out.includes(`../howtonetwork/${filesDir}`)) {
    out = out.split(filesDir).join(`../howtonetwork/${filesDir}`);
    out = out.split(filesDirPlain).join(`../howtonetwork/${encodeURI(filesDirPlain)}`);
  }

  out = out.replace(/_shared\/wp-content\//g, "../howtonetwork/_shared/wp-content/");
  out = out.replace(/href="([^"]+\.htm)"/gi, (full, href) => {
    if (href.startsWith("http") || href.startsWith("../howtonetwork/")) return full;
    return `href="../howtonetwork/${encodeFileHref(href.replace(/^\.\//, ""))}"`;
  });

  out = out.replace(/\sdata-lazy-src(?:set|sizes)?="[^"]*"/gi, "");
  out = out.replace(/\sdata-ll-status="[^"]*"/gi, "");
  out = out.replace(/\sclass="[^"]*lazyload[^"]*"/gi, "");

  return out.trim();
}

export function loadHowToNetworkChapters() {
  const chapters = {};
  for (const ch of HTN_CHAPTERS) {
    const filePath = path.join(HTN_ROOT, ch.file);
    if (!fs.existsSync(filePath)) {
      console.warn("Missing howtonetwork file:", ch.file);
      chapters[ch.lessonId] = {
        ...ch,
        html: `<p class="msg err">Chapter file not found: <code>${ch.file}</code>. Place the <code>howtonetwork</code> folder next to LearnHub-Network-Edition on your Desktop.</p>`,
      };
      continue;
    }
    const raw = fs.readFileSync(filePath, "utf8");
    const extracted = cleanExtractedHtml(extractMainHtml(raw, ch.file), ch.file);
    chapters[ch.lessonId] = { ...ch, html: extracted };
  }
  return chapters;
}

export function howToNetworkSupplementBlock(chapter, { compact = false } = {}) {
  const offlineHref = `../howtonetwork/${encodeFileHref(chapter.file)}`;
  const openInGuide = `<a href="${HTN_GUIDE_INDEX}" target="_blank" rel="noopener">HowToNetwork guide index</a>`;
  const openChapter = `<a href="${offlineHref}" target="_blank" rel="noopener">open formatted chapter</a>`;
  const jumpLesson =
    `<button type="button" class="tool ghost lh-htn-open-lesson" data-lesson-id="${chapter.lessonId}">Open in sidebar: ${chapter.title}</button>`;

  if (compact) {
    return (
      `<section class="lh-htn-supplement lh-htn-supplement--compact">` +
      `<p class="msg info"><strong>HowToNetwork reading:</strong> ${chapter.title} · ${jumpLesson} · ${openChapter} · ${openInGuide}</p>` +
      `</section>`
    );
  }

  return (
    `<hr class="lesson-hr lh-htn-hr"/>` +
    `<section class="lh-htn-supplement">` +
    `<header class="lh-htn-supplement-head">` +
    `<span class="lesson-badge">HowToNetwork · Paul Browning</span>` +
    `<h3 class="lh-htn-supplement-title">${chapter.title}</h3>` +
    `<p class="lh-htn-supplement-links">${jumpLesson} · ${openChapter} · ${openInGuide}</p>` +
    `</header>` +
    `<div class="lh-htn-body tech-prose">${chapter.html}</div>` +
    `</section>`
  );
}

export function howToNetworkIndexIntro() {
  const links = HTN_CHAPTERS.map(
    (ch) =>
      `<li><button type="button" class="lh-htn-open-lesson linklike" data-lesson-id="${ch.lessonId}">${ch.title}</button></li>`
  ).join("\n");

  return (
    `<div class="n10-exam-banner msg info">` +
    `<p><strong>HowToNetwork free Network+ guide</strong> — full Paul Browning chapters are in this track unit and woven into related summer/domain lessons.</p>` +
    `<p><a class="tool primary" href="${HTN_GUIDE_INDEX}" target="_blank" rel="noopener">Open offline guide index</a> ` +
    `<span class="lh-htn-meta">(sibling <code>howtonetwork/index.html</code> folder)</span></p>` +
    `</div>` +
    `<h3>All chapters in Learn Hub</h3>` +
    `<ul class="lh-htn-chapter-list">${links}</ul>` +
    `<h3>Study workflow</h3>` +
    `<p>Read the matching summer or domain lesson first, then the HowToNetwork chapter for textbook-style depth. Use the offline index when you want the original page layout or practice exams.</p>`
  );
}

export function getHowToNetworkRoot() {
  return HTN_ROOT;
}
