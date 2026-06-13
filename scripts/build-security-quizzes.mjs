/**
 * Parses MCQ blocks from docs/SECURITY_CONCEPTS_WORKPLACE_CURRICULUM.md and
 * splices quiz lessons into the Security track (after each level + capstone).
 *
 * Run: node scripts/build-security-quizzes.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const mdPath = path.join(root, "docs", "SECURITY_CONCEPTS_WORKPLACE_CURRICULUM.md");
const coursesPath = path.join(root, "assets", "learn-hub-courses.js");

function letterToIdx(ch) {
  const c = String(ch || "")
    .trim()
    .charAt(0)
    .toUpperCase();
  if (c === "A") return 0;
  if (c === "B") return 1;
  if (c === "C") return 2;
  return null;
}

function stripMd(s) {
  return String(s)
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1");
}

function parseTripleMcq(raw) {
  let t = raw.replace(/\r\n/g, "\n").replace(/\n+/g, " ").replace(/\s+/g, " ").trim();
  t = stripMd(t).replace(/^\*+Q\d+\.\*+\s*/i, "").replace(/^Q\d+\.\s*/i, "");
  const m = t.match(/^(.+?)\s*\(([aA])\)\s*(.+?)\s*\(([bB])\)\s*(.+?)\s*\(([cC])\)\s*(.+)$/);
  if (!m) return null;
  return {
    q: m[1].trim(),
    choices: [m[3].trim(), m[5].trim(), m[7].trim()],
  };
}

function parseStarQuestionBlocks(block) {
  const out = [];
  const re = /\*\*Q(\d+)\.\*\*\s*([\s\S]*?)(?=\*\*Q\d+\.\*\*|$)/g;
  let m;
  while ((m = re.exec(block)) !== null) {
    out.push({ num: +m[1], body: m[2].trim() });
  }
  return out;
}

function parseAnswerKeyLines(answerBlock, { specialL1Q1 } = {}) {
  const map = new Map();
  const lines = answerBlock.split("\n").map((l) => l.trim()).filter(Boolean);
  for (const line of lines) {
    if (line.startsWith("###")) continue;
    const rm = line.match(/^(\d+)[–-](\d+):\s*(.+)$/);
    if (rm) {
      const a = +rm[1];
      const b = +rm[2];
      const toks = rm[3].split(/\s*[,/]\s*/).map((x) => x.trim()).filter(Boolean);
      for (let k = 0; k < toks.length && a + k <= b; k++) {
        const idx = letterToIdx(toks[k].charAt(0));
        if (idx != null) map.set(a + k, idx);
      }
      continue;
    }
    if (specialL1Q1 && /^1\.\s+/.test(line)) {
      const low = line.toLowerCase();
      let idx = 2;
      if (low.includes("confidentiality") && !low.includes("availability")) idx = 0;
      else if (low.includes("integrity") && !low.includes("availability")) idx = 1;
      else if (low.includes("availability")) idx = 2;
      map.set(1, idx);
    }
  }
  return map;
}

/**
 * @param {string} md
 * @param {string} qHeader start of question region (inclusive marker)
 * @param {string} answerHeader start of answer key (inclusive)
 * @param {string} endMarker first substring after answer region (exclusive)
 */
function extractStarBank(md, qHeader, answerHeader, endMarker, opts) {
  const iQ = md.indexOf(qHeader);
  const iA = md.indexOf(answerHeader, iQ + 1);
  const iE = md.indexOf(endMarker, iA + answerHeader.length);
  if (iQ < 0 || iA < 0 || iE < 0) {
    console.warn("Missing bank slice:", qHeader);
    return [];
  }
  const qBlock = md.slice(iQ + qHeader.length, iA).trim();
  const aBlock = md.slice(iA + answerHeader.length, iE).trim();
  const answers = parseAnswerKeyLines(aBlock, opts);
  const stars = parseStarQuestionBlocks(qBlock);
  const questions = [];
  for (const { num, body } of stars) {
    let mcq = parseTripleMcq(body);
    if (!mcq && opts?.l1Q1Fallback && num === 1) {
      mcq = {
        q: "Which pillar of CIA is most directly harmed by ransomware encrypting files?",
        choices: [
          "Confidentiality — unauthorized disclosure of information",
          "Integrity — unauthorized modification of data or systems",
          "Availability — loss of timely access to systems or data (e.g., ransomware locking files)",
        ],
      };
    }
    if (!mcq) continue;
    const correct = answers.get(num);
    if (correct == null) {
      console.warn("No answer for Q", num, qHeader.slice(0, 40));
      continue;
    }
    questions.push({ q: mcq.q, choices: mcq.choices, correct });
  }
  return questions;
}

function parseNumberedCapstone(md, capHeader, answerHeader, endMarker) {
  const hi = md.indexOf(capHeader);
  const ai = md.indexOf(answerHeader, hi);
  const ej = md.indexOf(endMarker, ai + answerHeader.length);
  if (hi < 0 || ai < 0 || ej < 0) {
    console.warn("Missing capstone slice");
    return [];
  }
  const body = md.slice(hi + capHeader.length, ai).trim();
  const aBlock = md.slice(ai + answerHeader.length, ej).trim();
  const answers = parseAnswerKeyLines(aBlock, {});
  const start = body.search(/\n1\.\s/);
  const cap = start >= 0 ? body.slice(start + 1) : body;
  const chunks = cap.split(/\n(?=\d+\.\s)/).filter((c) => /^\d+\./.test(c.trim()));
  const questions = [];
  for (const chunk of chunks) {
    const m = chunk.trim().match(/^(\d+)\.\s*([\s\S]+)/);
    if (!m) continue;
    const num = +m[1];
    const mcq = parseTripleMcq(m[2]);
    if (!mcq) continue;
    const correct = answers.get(num);
    if (correct == null) {
      console.warn("Capstone missing answer Q", num);
      continue;
    }
    questions.push({ q: mcq.q, choices: mcq.choices, correct });
  }
  return questions;
}

function main() {
  const md = fs.readFileSync(mdPath, "utf8").replace(/\r\n/g, "\n");

  const levelUnit = [
    "",
    "Level 1 — Foundations (CIA, risk language, safe computing)",
    "Level 2 — Intermediate (networks, crypto vocabulary, common attacks)",
    "Level 3 — Advanced (assessment, logging, IAM, vuln lifecycle)",
    "Level 4 — Expert (enterprise identity, cloud logging, IR evidence)",
    "Level 5 — Heavy advanced (architecture, crypto futures, purple teaming)",
  ];

  const quizzesForLevel = {};

  for (let lv = 1; lv <= 5; lv++) {
    const unit = levelUnit[lv];
    const list = [];

    const mainQ = `## Question bank — Level ${lv}`;
    const mainA = `### Answer key — Level ${lv}`;
    const nextLvl = lv < 5 ? `# Level ${lv + 1}` : "# Capstone";
    const qMain = extractStarBank(md, mainQ, mainA, nextLvl, { specialL1Q1: lv === 1, l1Q1Fallback: lv === 1 });
    if (qMain.length)
      list.push({
        unit,
        id: `sec-q-l${lv}-core`,
        kind: "quiz",
        title: `Quiz: Level ${lv} core bank (Q1–20)`,
        narrative: "",
        questions: qMain,
      });

    const sup21h = `### Level ${lv} — Q21–30`;
    const sup21a = `### Answer key — Level ${lv} Q21–30`;
    const end21 = lv < 5 ? `### Level ${lv + 1} — Q21–30` : "## Additional lab sequences";
    const q21 = extractStarBank(md, sup21h, sup21a, end21, {});
    if (q21.length)
      list.push({
        unit,
        id: `sec-q-l${lv}-s21`,
        kind: "quiz",
        title: `Quiz: Level ${lv} supplemental (Q21–30)`,
        narrative: "",
        questions: q21,
      });

    const sup31h = `### Level ${lv} — Q31–40`;
    const sup31a = `### Answer key — Level ${lv} Q31–40`;
    const end31 = lv < 5 ? `### Level ${lv + 1} — Q31–40` : "# Capstone — Part 3 (Q81–100)";
    const q31 = extractStarBank(md, sup31h, sup31a, end31, {});
    if (q31.length)
      list.push({
        unit,
        id: `sec-q-l${lv}-s31`,
        kind: "quiz",
        title: `Quiz: Level ${lv} supplemental (Q31–40)`,
        narrative: "",
        questions: q31,
      });

    quizzesForLevel[lv] = list;
  }

  const capUnit = "Capstone";
  const capAll = parseNumberedCapstone(
    md,
    "# Capstone — End examination (all levels)",
    "### Capstone answer key (quick)",
    "\n---\n\n## Instructor notes (workplace alignment)"
  );
  const capstoneQuizzes = [
    {
      unit: capUnit,
      id: "sec-q-cap-1",
      kind: "quiz",
      title: "Capstone: Q1–20",
      narrative: "",
      questions: capAll.slice(0, 20),
    },
    {
      unit: capUnit,
      id: "sec-q-cap-2",
      kind: "quiz",
      title: "Capstone: Q21–40",
      narrative: "",
      questions: capAll.slice(20, 40),
    },
    {
      unit: capUnit,
      id: "sec-q-cap-3",
      kind: "quiz",
      title: "Capstone: Q41–60",
      narrative: "",
      questions: capAll.slice(40, 60),
    },
  ].filter((x) => x.questions.length > 0);

  const p2 = extractStarBank(
    md,
    "# Capstone — Part 2 (Q61–80)",
    "### Capstone Part 2 answer key",
    "\n---\n\n## Appendix A",
    {}
  );
  if (p2.length)
    capstoneQuizzes.push({
      unit: capUnit,
      id: "sec-q-cap-p2",
      kind: "quiz",
      title: "Capstone: part 2 (Q61–80)",
      narrative: "",
      questions: p2,
    });

  const p3 = extractStarBank(
    md,
    "# Capstone — Part 3 (Q81–100)",
    "### Capstone Part 3 answer key",
    "\n---\n\n## Appendix F",
    {}
  );
  if (p3.length)
    capstoneQuizzes.push({
      unit: capUnit,
      id: "sec-q-cap-p3",
      kind: "quiz",
      title: "Capstone: part 3 (Q81–100)",
      narrative: "",
      questions: p3,
    });

  const coursesRaw = fs.readFileSync(coursesPath, "utf8");
  const m = coursesRaw.match(/^window\.LEARN_HUB_COURSES = (\[[\s\S]*\]);?\s*$/);
  if (!m) throw new Error("parse courses");
  const courses = JSON.parse(m[1]);
  const sec = courses.find((c) => c.id === "security");
  if (!sec || !Array.isArray(sec.lessons)) throw new Error("security course");

  const base = sec.lessons.filter((L) => !(L.kind === "quiz" && String(L.id || "").startsWith("sec-q-")));
  const out = [];

  /**
   * Curriculum lists each level in multiple blocks (e.g. L1-01–15, then L1-16–20, then L1-21–25).
   * Insert quizzes only once: after the lesson with the highest numeric suffix for that level.
   */
  function lastLearnLessonIdByLevel(lessons) {
    const best = new Map();
    for (const L of lessons) {
      const id = String(L.id || "");
      const m = id.match(/^lh-sec-l(\d+)-(\d+)$/);
      if (!m) continue;
      const lv = +m[1];
      const n = +m[2];
      const prev = best.get(lv);
      if (!prev || n > prev.n) best.set(lv, { id, n });
    }
    const outLv = {};
    for (let lv = 1; lv <= 5; lv++) outLv[lv] = best.get(lv)?.id || null;
    return outLv;
  }

  const lastIdForLevel = lastLearnLessonIdByLevel(base);

  for (let i = 0; i < base.length; i++) {
    out.push(base[i]);
    const id = base[i].id || "";
    for (let lv = 1; lv <= 5; lv++) {
      if (id && id === lastIdForLevel[lv]) {
        for (const q of quizzesForLevel[lv] || []) {
          if (q.questions && q.questions.length) out.push(q);
        }
      }
    }
    if (id && id === lastIdForLevel[5]) {
      for (const q of capstoneQuizzes) {
        if (q.questions && q.questions.length) out.push(q);
      }
    }
  }

  sec.lessons = out;

  const nQuiz = out.filter((L) => L.kind === "quiz").length;
  const nQ = out.filter((L) => L.kind === "quiz").reduce((n, L) => n + (L.questions?.length || 0), 0);
  console.log("Security track:", out.length, "lessons,", nQuiz, "quizzes,", nQ, "total MCQs");

  fs.writeFileSync(coursesPath, `window.LEARN_HUB_COURSES = ${JSON.stringify(courses)};\n`, "utf8");
}

main();
