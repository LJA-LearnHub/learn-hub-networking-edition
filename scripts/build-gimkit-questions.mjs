import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(SCRIPT_DIR, "..");
const HUB_ROOT = path.resolve(PROJECT_ROOT, "..");
const GIMKIT_DIR = path.join(HUB_ROOT, "TechPlus_Lessons", "GimKit");
const OUT_FILE = path.join(PROJECT_ROOT, "assets", "learn-hub-gimkit-questions.js");

function read(p) {
  return fs.readFileSync(p, "utf8").replace(/\r\n/g, "\n");
}

function normalize(s) {
  return String(s || "").replace(/\s+/g, " ").trim();
}

function parseMultiChoiceSets(md) {
  const sets = [];
  const blocks = md.split(/\n##\s+/).slice(1);
  for (const blockRaw of blocks) {
    const block = "## " + blockRaw;
    const h = block.match(/^##\s+([^\n]+)/);
    if (!h) continue;
    const title = normalize(h[1]);
    if (!/^Set\s+\d+/i.test(title)) continue;
    const body = block.slice(h[0].length);
    const questions = [];
    const qParts = body.split(/\n(?=\d+\.\s+)/).map((x) => x.trim()).filter(Boolean);
    for (const qPart of qParts) {
      const qm = qPart.match(/^(\d+)\.\s+([\s\S]*?)(?=\n\s*A\.\s+|\n\*\*Answer:|$)/);
      if (!qm) continue;
      const qText = normalize(qm[2]);
      const choices = [];
      const choiceRe = /^\s*([A-D])\.\s+(.+)$/gim;
      let cm;
      while ((cm = choiceRe.exec(qPart)) !== null) {
        choices.push({ key: cm[1].toUpperCase(), text: normalize(cm[2]) });
      }
      const am = qPart.match(/\*\*Answer:\s*([A-D])\*\*/i);
      if (!qText || choices.length < 2 || !am) continue;
      const answerKey = am[1].toUpperCase();
      const correct = choices.findIndex((c) => c.key === answerKey);
      if (correct < 0) continue;
      questions.push({
        q: qText,
        choices: choices.map((c) => c.text),
        correct,
      });
    }
    if (questions.length) {
      sets.push({
        id: "gk-" + title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
        title: "GimKit " + title,
        source: "techplus_mcq_4_sets_full.md",
        questions,
      });
    }
  }
  return sets;
}

function rotateChoices(answer, distractors, seed) {
  const base = [answer].concat(distractors.slice(0, 3));
  const shift = seed % base.length;
  const choices = base.slice(shift).concat(base.slice(0, shift));
  const correct = choices.findIndex((x) => x === answer);
  return { choices, correct };
}

function parseScreenshotSets(md) {
  const sets = [];
  const blocks = md.split(/\n##\s+/).slice(1);
  for (let bi = 0; bi < blocks.length; bi++) {
    const block = "## " + blocks[bi];
    const h = block.match(/^##\s+([^\n]+)/);
    if (!h) continue;
    const title = normalize(h[1]);
    const body = block.slice(h[0].length);
    const qa = [];
    const qRe = /(^|\n)(\d+)\.\s+([\s\S]*?)\n\s+\*\*Answer:\*\*\s+([^\n]+)/g;
    let m;
    while ((m = qRe.exec(body)) !== null) {
      qa.push({ q: normalize(m[3]), answer: normalize(m[4]) });
    }
    if (!qa.length) continue;
    const pool = Array.from(new Set(qa.map((x) => x.answer))).filter(Boolean);
    const questions = qa.map((item, i) => {
      const distractors = pool.filter((a) => a !== item.answer);
      while (distractors.length < 3) distractors.push("None of the above");
      const picked = [];
      for (let k = 0; k < distractors.length && picked.length < 3; k++) {
        const idx = (i + k * 7) % distractors.length;
        const v = distractors[idx];
        if (!picked.includes(v)) picked.push(v);
      }
      while (picked.length < 3) picked.push("None of the above");
      const shaped = rotateChoices(item.answer, picked, i + bi);
      return {
        q: item.q,
        choices: shaped.choices,
        correct: shaped.correct,
      };
    });
    sets.push({
      id: "gk-" + title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
      title: "GimKit " + title,
      source: "gimkit_questions_from_screenshots.md",
      questions,
    });
  }
  return sets;
}

function buildLargeSets(rawSets) {
  const all = [];
  const seen = new Set();
  for (const s of rawSets) {
    const src = s && s.source ? s.source : "gimkit";
    const qs = (s && s.questions) || [];
    for (const q of qs) {
      const key = normalize(q.q || "").toLowerCase();
      if (!key || seen.has(key)) continue;
      seen.add(key);
      all.push({
        q: q.q,
        choices: q.choices,
        correct: q.correct,
        _source: src,
      });
    }
  }

  const total = all.length;
  if (!total) return [];
  let setCount = Math.ceil(total / 75);
  while (setCount > 1 && Math.floor(total / setCount) < 70) setCount--;
  const base = Math.floor(total / setCount);
  let rem = total % setCount;
  const out = [];
  let at = 0;
  for (let i = 0; i < setCount; i++) {
    const size = base + (rem > 0 ? 1 : 0);
    if (rem > 0) rem--;
    const part = all.slice(at, at + size).map(({ q, choices, correct }) => ({ q, choices, correct }));
    at += size;
    out.push({
      id: "gk-large-" + String(i + 1).padStart(2, "0"),
      title: "GimKit Questions Set " + (i + 1),
      source: "GimKit markdown imports",
      questions: part,
    });
  }
  return out;
}

function main() {
  const fileA = path.join(GIMKIT_DIR, "techplus_mcq_4_sets_full.md");
  const fileB = path.join(GIMKIT_DIR, "gimkit_questions_from_screenshots.md");
  if (!fs.existsSync(fileA) || !fs.existsSync(fileB)) {
    throw new Error("Missing GimKit markdown source files in " + GIMKIT_DIR);
  }
  const parsed = parseMultiChoiceSets(read(fileA)).concat(parseScreenshotSets(read(fileB)));
  const originalSets = parsed.map((s) => ({
    id: s.id,
    title: s.title,
    source: s.source,
    questions: (s.questions || []).slice(),
  }));
  const largeSets = buildLargeSets(parsed);
  const sets = originalSets.concat(largeSets);
  const payload = {
    generatedAt: new Date().toISOString(),
    sourceDir: GIMKIT_DIR,
    sets,
  };
  const out =
    "/* Auto-generated by scripts/build-gimkit-questions.mjs */\n" +
    "window.LEARN_HUB_GIMKIT_QUIZZES = " +
    JSON.stringify(payload) +
    ";\n";
  fs.writeFileSync(OUT_FILE, out, "utf8");
  const qTotal = sets.reduce((n, s) => n + ((s && s.questions && s.questions.length) || 0), 0);
  console.log(
    "Wrote",
    OUT_FILE,
    "with",
    sets.length,
    "sets total (",
    originalSets.length,
    "original +",
    largeSets.length,
    "large ) and",
    qTotal,
    "questions"
  );
}

main();
