/**
 * Reflow Tech+ chapter Markdown: join PDF line breaks, split on sentence boundaries,
 * wrap to a readable width, and apply light OCR cleanup. Preserves structural lines so
 * the study-guide lesson split count stays stable.
 *
 * Run: node scripts/format-techplus-markdown.mjs
 * Then: node scripts/build-techplus-from-markdown.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const learnHubRoot = path.resolve(__dirname, "..");
const mdDir = path.join(learnHubRoot, "chapters");

const WRAP = 92;

function isAllCapsBanner(s) {
  const t = s.trim();
  if (t.length < 10) return false;
  const letters = t.replace(/[^a-zA-Z]/g, "");
  if (letters.length < 8) return false;
  const lower = t.match(/[a-z]/g);
  return !lower || lower.length <= 2;
}

function isStructuralLine(raw) {
  const s = raw.trim();
  if (!s) return true;
  if (s.startsWith("#")) return true;
  if (s === "---") return true;
  if (isAllCapsBanner(s)) return true;
  if (/^Source:/i.test(s)) return true;
  if (/^\s*[✓✔■△▶]/.test(raw)) return true;
  if (/^FIGURE\s/i.test(s)) return true;
  if (/^TABLE\s/i.test(s)) return true;
  if (/^EXERCISE\s/i.test(s)) return true;
  if (/^Review Questions/i.test(s)) return true;
  if (/^Technet24$/i.test(s)) return true;
  if (/^\d+\s+Chapter\s+\d+/i.test(s)) return true;
  if (/^\d+\s+Chapter\s+\d+\s*[■▪]/i.test(s)) return true;
  if (/^Chapter\s+\d+\s+Lab\b/i.test(s)) return true;
  if (/^Chapter\s+\d+$/i.test(s)) return true;
  if (/^Answers\b/i.test(s)) return true;
  if (/^\d+\.\s/.test(s)) return true;
  if (/^[a-z]\)\s/.test(s)) return true;
  if (/^\([a-z]\)\s/.test(s)) return true;
  if (/^\|.+\|\s*$/.test(s)) return true;
  if (/^>{1}\s/.test(s)) return true;
  if (/^Exploring .+\s+\d+$/.test(s) && !s.includes("?")) return true;
  return false;
}

/**
 * Undo “Motherboards The motherboard” style glue inside a merged paragraph (PDF + prior runs).
 */
function explodeGluedTitles(text) {
  let t = text;
  /** ". Title The " / ". Title A " … */
  t = t.replace(
    /\.(\s+)([A-Z][a-z]{2,30})\s+(?=(?:The|A|An|In|For|When|If|As|It|I|We|You|They|This|These|That|There|On|At|By|To|With|Without|After|Before|While|Although|Because|However|Moreover|Finally|Perhaps|Also|Even|So|But|And|Or|Not|All|Some|Many|Most|Each|Every|Both|Several|Few|One|Two|Three|Another|Other|Such|Same|Different|New|Long|Short|High|Low|First|Second|Third|Next|Last|Early|Late|Internal|External|Local|Remote|Public|Private|Primary|Secondary|Binary|Basic|Advanced|Simple|Complex|General|Specific|Common|Special|Standard|Custom|Physical|Logical|Virtual|Digital|Analog|Wireless|Wired|Portable|Desktop|Mobile|Personal|Corporate|Enterprise|Small|Large|Main|Sub|Non|Pre|Post|Anti|Multi|Single|Dual|Triple|Quad|Full|Half|Open|Closed|True|False|Active|Passive|Direct|Indirect|Fast|Slow|Safe|Unsafe|Secure|Insecure|Free|Paid|Empty|Full)\s)/g,
    ".$1\n\n$2\n\n"
  );
  /** “Form Factors Motherboards are” */
  t = t.replace(/\.(\s+)(Form Factors)\s+(Motherboards)\s+(?=(?:are|is|were|was)\b)/gi, ".$1\n\n$2\n\n$3\n\n");
  return t;
}

function wrapParagraph(text, width) {
  const words = text.split(/\s+/).filter(Boolean);
  if (!words.length) return "";
  const out = [];
  let cur = "";
  for (const w of words) {
    if (w.length >= width) {
      if (cur) {
        out.push(cur);
        cur = "";
      }
      out.push(w);
      continue;
    }
    if (!cur) cur = w;
    else if (cur.length + 1 + w.length <= width) cur += " " + w;
    else {
      out.push(cur);
      cur = w;
    }
  }
  if (cur) out.push(cur);
  return out.join("\n");
}

/**
 * Study-guide PDFs often emit `### Chapter title` before the exam objectives block. That becomes
 * the first `<h3>` in HTML, so objectives land in the wrong lesson. Strip the `###`, keep the
 * kicker as plain lines, and re-insert `### Full title` after the first Technet24 (objectives end).
 */
function relocateObjectiveAreaHeadings(md) {
  const re =
    /^---\s*\r?\n### ([^\r\n]+)\r?\n(?:(?!THE FOLLOWING COMPTIA)([^\r\n]+)\r?\n)?THE FOLLOWING COMPTIA/ms;
  const m = md.match(re);
  if (!m) return md;
  const h1 = m[1].trim();
  let line2 = (m[2] || "").trim();
  if (/^THE FOLLOWING/i.test(line2)) line2 = "";
  const newBlock =
    "---\n" +
    h1 +
    (line2 ? "\n" + line2 : "") +
    "\nTHE FOLLOWING COMPTIA";
  let out = md.slice(0, m.index) + newBlock + md.slice(m.index + m[0].length);
  const fullTitle = line2 ? `${h1} ${line2}`.replace(/\s+/g, " ").trim() : h1;
  let injected = false;
  out = out.replace(/\nTechnet24\s*\n(\s*\n)/, (match, sp) => {
    if (injected) return match;
    injected = true;
    return `\nTechnet24\n${sp}### ${fullTitle}\n\n`;
  });
  if (!injected) {
    console.warn("relocateObjectiveAreaHeadings: no Technet24 anchor; left front matter unchanged");
    return md;
  }
  return out;
}

function applyGlobalCleanups(s) {
  let t = s.replace(/\r\n/g, "\n");
  t = t.replace(/\u2019/g, "'").replace(/\u2018/g, "'").replace(/\u201c|\u201d/g, '"');
  t = t.replace(/\u2014/g, "—");
  t = t.replace(/([A-Za-z])-\n([a-z])/g, "$1$2");
  t = t.replace(/([A-Za-z0-9])-\s*\n([a-z])/g, "$1$2");
  const reps = [
    [/OBJECTIVESARE\b/gi, "OBJECTIVES ARE"],
    [/FC0-\s*U71/gi, "FC0-U71"],
    [/\bT erminology\b/g, "Terminology"],
    [/\bint ernal\b/gi, "internal"],
    [/\bcontr ast\b/g, "contrast"],
    [/\bWindows 1 1\b/g, "Windows 11"],
    [/\bChapter 1 1\b/g, "Chapter 11"],
    [/\bFigure 1 1\./g, "Figure 11."],
    [/Figure 11\.1 1\b/g, "Figure 11.11"],
    [/\bRJ1 1\b/g, "RJ11"],
    [/\b201 1\b/g, "2011"],
    [/Figure 7 \.1 1/g, "Figure 7.11"],
    [/Figure 12\.1 1/g, "Figure 12.11"],
    [/Figure 2\.1 1([^0-9]|$)/g, "Figure 2.11$1"],
  ];
  for (const [re, to] of reps) t = t.replace(re, to);
  return t;
}

function stripOrphanChapterMarkers(lines) {
  const out = [];
  for (let i = 0; i < lines.length; i++) {
    const t = lines[i].trim();
    const n = lines[i + 1]?.trim() ?? "";
    const n2 = lines[i + 2]?.trim() ?? "";
    if (t === "Chapter" && n === "1" && n2 === "") {
      i += 2;
      continue;
    }
    if (t === "Chapter" && /^\d+$/.test(n) && n2 === "") {
      i += 2;
      continue;
    }
    out.push(lines[i]);
  }
  return out;
}

/** Book-style section label on one line (Motherboards, Exploring Motherboards, …). */
function isShortStandAloneTitle(t) {
  const s = t.trim();
  if (s.length < 4 || s.length > 88) return false;
  if (/[.;!?'"()]/.test(s)) return false;
  if (/\d/.test(s)) return false;
  /** Chapter openers like “Exploring Storage …” (no trailing period). */
  if (/^Exploring\s+[A-Z]/.test(s)) return true;
  if (s.includes(",")) return false;
  return /^[A-Z][a-z]+(?:\s+[A-Z][a-z]+){0,4}$/.test(s);
}

/**
 * Start a new paragraph before `next` if `prevJoined` ended a sentence and `next` looks
 * like a new thought or section — but keep lines that clearly continue (The, When, In, …).
 */
function shouldBreakParagraph(prevJoined, nextTrimmed) {
  if (!prevJoined) return false;
  const ps = prevJoined.replace(/\s+/g, " ").trim();
  if (!/[.!?]['"]?$/.test(ps)) return false;
  if (/\b(e\.g\.|i\.e\.|etc\.|vs\.|Mr\.|Ms\.|Dr\.|Jr\.|Sr\.|Fig\.)\s*$/i.test(ps)) return false;
  if (/\s[A-Z]\.$/.test(ps)) return false;

  const t = nextTrimmed;
  if (!/^[A-Z("']/.test(t)) return false;

  const continues = /^(The|A|An|In|For|When|If|As|I'|I |We |You |It |This |These |But |And |Or |So |That |There |They |He |She |Here |Also |Even |Perhaps |Of |On |At |By |To |With |Without |After |Before |During |While |Although |Because |However |Moreover |Finally |Then |Next |First |Second |Third |Another |Other |Some |Many |Most |Each |Every |Both |Such |One |Two |Three |Several |Few |More |Less |Very |Too |So |Not |No |Yes |All |Any |Same |Different |New |Old |Long |Short )/i;
  if (continues.test(t) && t.length < 72) return false;

  if (t.length >= 18) return true;
  if (isShortStandAloneTitle(t)) return true;
  return false;
}

function formatMarkdownSource(raw) {
  let text = relocateObjectiveAreaHeadings(raw);
  text = applyGlobalCleanups(text);
  let lines = text.split("\n");
  lines = stripOrphanChapterMarkers(lines);

  const out = [];
  let buf = [];

  function flushBuf() {
    if (!buf.length) return;
    let merged = buf.join(" ").replace(/\s+/g, " ").trim();
    buf = [];
    if (!merged) return;
    merged = explodeGluedTitles(merged);
    for (const chunk of merged.split(/\n\n+/)) {
      const c = chunk.trim();
      if (c) out.push(wrapParagraph(c, WRAP));
    }
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    if (!trimmed) {
      flushBuf();
      if (out.length && out[out.length - 1] !== "") out.push("");
      continue;
    }

    if (isStructuralLine(line)) {
      flushBuf();
      out.push(trimmed);
      continue;
    }

    /**
     * Keep book section labels (Motherboards, Form Factors, …) on their own “paragraph” so
     * build-techplus-from-markdown maybeHeading() can still promote them to ### and lesson
     * splits stay stable.
     */
    if (isShortStandAloneTitle(trimmed)) {
      flushBuf();
      out.push(wrapParagraph(trimmed, WRAP));
      continue;
    }

    const curJoined = buf.join(" ");
    if (buf.length && shouldBreakParagraph(curJoined, trimmed)) {
      flushBuf();
    }
    buf.push(trimmed);
  }
  flushBuf();

  let s = out.join("\n").replace(/\n{4,}/g, "\n\n\n");
  s = s.replace(/\n{3,}/g, "\n\n");
  return s.trim() + "\n";
}

function main() {
  const files = fs.readdirSync(mdDir).filter((f) => f.endsWith(".md")).sort();
  for (const f of files) {
    const fp = path.join(mdDir, f);
    const raw = fs.readFileSync(fp, "utf8");
    const next = formatMarkdownSource(raw);
    fs.writeFileSync(fp, next, "utf8");
    console.log("Formatted", f, "→", next.length, "chars");
  }
}

main();
