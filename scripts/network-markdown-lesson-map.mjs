/**
 * Maps markdown chunks to lessons by curriculum module, round-robin within each topic.
 */
import fs from "fs";
import path from "path";
import vm from "vm";
import { fileURLToPath } from "url";
import { loadMarkdownChunks } from "./network-markdown-ingest.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

/** First lesson + key intros get richer markdown slices. */
const LESSON_CHUNK_OVERRIDES = {
  "network-w01-d01": (chunks) =>
    chunks
      .filter((c) => c.source === "p1" && ["1.1", "1.2", "1.3"].includes(c.sectionId))
      .map((c) => c.key),
  "network-w01-d02": (chunks) =>
    chunks.filter((c) => c.source === "p1" && c.sectionId.startsWith("2.")).map((c) => c.key),
  "network-w01-d04": (chunks) =>
    chunks.filter((c) => c.source === "p1" && ["1.4", "1.5"].includes(c.sectionId)).map((c) => c.key),
};

const LESSON_TRIM_LIMITS = {
  "network-w01-d01": { maxChars: 16000, maxChunks: 24 },
  "network-w01-d02": { maxChars: 12000, maxChunks: 18 },
  "network-w01-d04": { maxChars: 10000, maxChunks: 14 },
};

const TOPIC_PATTERNS = {
  mod1: [/^network-w01-d0[145]$/, /^network-d1-t1[1-5]$/],
  mod2: [/^network-w01-d0[23]$/, /^network-d1-t0[12]$/, /^network-ws-osi-/, /^network-exam-01$/],
  mod3: [/^network-w02-d01$/, /^network-d1-t0[15]$/, /^network-exam-04$/],
  mod4: [
    /^network-w02-d0[2-5]$/,
    /^network-d1-t03$/,
    /^network-exam-02$/,
    /^network-pbq-05$/,
  ],
  mod5: [
    /^network-w05-/,
    /^network-d2-t0[34]$/,
    /^network-d2-t13$/,
    /^network-ws-rt-/,
    /^network-exam-09$/,
    /^network-exam-10$/,
    /^network-pbq-0[67]$/,
  ],
  mod6: [
    /^network-w04-/,
    /^network-d1-t08$/,
    /^network-d2-t0[24]$/,
    /^network-d2-t11$/,
    /^network-d2-t14$/,
    /^network-ws-vlan-/,
    /^network-ws-sw-/,
    /^network-exam-0[58]$/,
    /^network-pbq-1[123]$/,
  ],
  mod7: [
    /^network-w08-d0[135]$/,
    /^network-d2-t05$/,
    /^network-d4-t04$/,
    /^network-ws-wi-/,
    /^network-exam-1[27]$/,
    /^network-exam-27$/,
    /^network-pbq-08$/,
  ],
  mod8: [
    /^network-w06-/,
    /^network-d1-t0[67]$/,
    /^network-exam-11$/,
    /^network-exam-26$/,
    /^network-pbq-(09|10)$/,
  ],
  mod9: [/^network-w07-d0[12]$/, /^network-d4-t0[17]$/, /^network-exam-22$/],
  mod10: [
    /^network-w07-d0[345]$/,
    /^network-d2-t0[89]$/,
    /^network-d4-t0[25]$/,
    /^network-d4-t11$/,
    /^network-ws-sec-/,
    /^network-ws-acl-/,
    /^network-exam-(13|19|21)$/,
    /^network-pbq-(03|14|18)$/,
  ],
  mod11: [/^network-d1-t09$/, /^network-d2-t15$/, /^network-exam-06$/],
  mod12: [/^network-w08-d04$/, /^network-d1-t10$/, /^network-d1-t1[45]$/, /^network-d2-t0[615]$/],
  mod13: [
    /^network-w09-/,
    /^network-d5-/,
    /^network-ws-tsh-/,
    /^network-ws-sc-/,
    /^network-exam-2[458]$/,
    /^network-pbq-(04|19|20)$/,
  ],
  mod14: [
    /^network-d3-t0[123]$/,
    /^network-d3-t09$/,
    /^network-d3-t1[1-5]$/,
    /^network-ws-op-/,
    /^network-exam-1[48]$/,
    /^network-pbq-16$/,
  ],
  mod15: [
    /^network-d3-t0[456]$/,
    /^network-d2-t07$/,
    /^network-d2-t12$/,
    /^network-exam-1[56]$/,
    /^network-pbq-15$/,
  ],
  mod16: [/^network-d4-t0[368]$/, /^network-d4-t1[0-5]$/],
  mod17: [/^network-d2-t06$/, /^network-d3-t10$/, /^network-exam-03$/],
  mod18: [
    /^network-w10-/,
    /^network-exam-(29|30)$/,
    /^network-ws-ex-/,
  ],
  cisco: [
    /^network-w03-/,
    /^network-d2-t01$/,
    /^network-d2-t10$/,
    /^network-d3-t07$/,
    /^network-ws-cmd-/,
    /^network-ws-pt-/,
    /^network-exam-07$/,
    /^network-pbq-(01|02|17)$/,
  ],
  sec: [/^network-d4-t(09|10|13)$/, /^network-exam-2[03]$/],
  pt: [/^network-d4-t(07|12)$/],
};

function chunkTopic(chunk) {
  if (chunk.source === "cisco") return "cisco";
  if (chunk.source === "sec1" || chunk.source === "sec2") return "sec";
  if (chunk.source === "pt") return "pt";
  const m = String(chunk.sectionId).match(/^(\d+)\./);
  return m ? `mod${m[1]}` : "mod1";
}

function lessonsForTopic(topic, allLessons) {
  const patterns = TOPIC_PATTERNS[topic] || [];
  return allLessons.filter((id) => patterns.some((re) => re.test(id)));
}

function distributeRoundRobin(chunks, lessonIds, maxChars = 4800, maxChunks = 3) {
  const assignment = {};
  if (!lessonIds.length || !chunks.length) return assignment;

  const sizes = Object.fromEntries(lessonIds.map((id) => [id, 0]));
  let cursor = 0;

  for (const chunk of chunks) {
    let placed = false;
    for (let i = 0; i < lessonIds.length; i++) {
      const lid = lessonIds[(cursor + i) % lessonIds.length];
      const keys = assignment[lid] || (assignment[lid] = []);
      if (keys.length >= maxChunks) continue;
      if (keys.length > 0 && sizes[lid] + chunk.body.length > maxChars) continue;
      keys.push(chunk.key);
      sizes[lid] += chunk.body.length;
      cursor = (cursor + i + 1) % lessonIds.length;
      placed = true;
      break;
    }
    if (!placed) {
      const lid = lessonIds.reduce((best, id) => (sizes[id] < sizes[best] ? id : best), lessonIds[0]);
      const keys = assignment[lid] || (assignment[lid] = []);
      keys.push(chunk.key);
      sizes[lid] += chunk.body.length;
      cursor = (cursor + 1) % lessonIds.length;
    }
  }
  return assignment;
}

function loadLessonOrder() {
  const coursesPath = path.join(root, "assets", "learn-hub-courses.js");
  const ctx = { window: {} };
  vm.createContext(ctx);
  vm.runInContext(fs.readFileSync(coursesPath, "utf8"), ctx);
  const net = ctx.window.LEARN_HUB_COURSES.find((c) => c.id === "networkplus");
  return net.lessons.filter((L) => L.kind === "learn").map((L) => L.id);
}

function mergeAssignment(target, part) {
  for (const [lid, keys] of Object.entries(part)) {
    if (!target[lid]) target[lid] = [];
    target[lid].push(...keys);
  }
}

function trimAssignment(assignment, chunkMap, defaultMaxChars = 4800, defaultMaxChunks = 3) {
  const dropped = [];
  for (const [lid, keys] of Object.entries(assignment)) {
    const limits = LESSON_TRIM_LIMITS[lid] || {};
    const maxChars = limits.maxChars ?? defaultMaxChars;
    const maxChunks = limits.maxChunks ?? defaultMaxChunks;
    const kept = [];
    let size = 0;
    for (const key of keys) {
      const c = chunkMap[key];
      if (!c) continue;
      if (kept.length >= maxChunks) {
        dropped.push(key);
        continue;
      }
      if (kept.length && size + c.body.length > maxChars) {
        dropped.push(key);
        continue;
      }
      kept.push(key);
      size += c.body.length;
    }
    if (kept.length) assignment[lid] = kept;
    else delete assignment[lid];
  }
  return dropped;
}

function applyLessonOverrides(chunks, assignment) {
  const reserved = new Set();
  for (const [lessonId, picker] of Object.entries(LESSON_CHUNK_OVERRIDES)) {
    const keys = picker(chunks);
    if (!keys.length) continue;
    assignment[lessonId] = [...keys];
    keys.forEach((k) => reserved.add(k));
  }
  return reserved;
}

function buildAssignment(chunks) {
  const allLessons = loadLessonOrder();
  const chunkMap = Object.fromEntries(chunks.map((c) => [c.key, c]));
  const assignment = {};
  const reserved = applyLessonOverrides(chunks, assignment);
  trimAssignment(assignment, chunkMap);

  const pool = chunks.filter((c) => !reserved.has(c.key));
  const byTopic = {};
  for (const chunk of pool) {
    const topic = chunkTopic(chunk);
    if (!byTopic[topic]) byTopic[topic] = [];
    byTopic[topic].push(chunk);
  }

  for (const [topic, topicChunks] of Object.entries(byTopic)) {
    const lessons = lessonsForTopic(topic, allLessons);
    if (!lessons.length) continue;
    mergeAssignment(assignment, distributeRoundRobin(topicChunks, lessons));
  }

  trimAssignment(assignment, chunkMap);

  const used = new Set(Object.values(assignment).flat());
  let leftover = chunks.filter((c) => !used.has(c.key)).map((c) => c.key);
  const need = allLessons.filter((id) => !assignment[id]?.length);

  if (leftover.length && need.length) {
    const pool = leftover.map((k) => chunkMap[k]).filter(Boolean);
    mergeAssignment(assignment, distributeRoundRobin(pool, need));
    trimAssignment(assignment, chunkMap);
    used.clear();
    Object.values(assignment)
      .flat()
      .forEach((k) => used.add(k));
    leftover = chunks.filter((c) => !used.has(c.key)).map((c) => c.key);
  }

  if (leftover.length) {
    const pool = leftover.map((k) => chunkMap[k]).filter(Boolean);
    mergeAssignment(assignment, distributeRoundRobin(pool, allLessons));
    trimAssignment(assignment, chunkMap);
  }

  return assignment;
}

let _assignment = null;

function getAssignment() {
  if (!_assignment) _assignment = buildAssignment(loadMarkdownChunks());
  return _assignment;
}

export function getMarkdownKeysForLesson(lessonId) {
  return getAssignment()[lessonId] || [];
}

export function countMappedLessons() {
  return Object.keys(getAssignment()).length;
}

export function getChunkAssignmentStats() {
  const chunks = loadMarkdownChunks();
  const assignment = getAssignment();
  const counts = Object.values(assignment).map((k) => k.length);
  const lens = Object.values(assignment).map((keys) =>
    keys.reduce((sum, key) => {
      const c = chunks.find((x) => x.key === key);
      return sum + (c?.body?.length || 0);
    }, 0)
  );
  lens.sort((a, b) => b - a);
  return {
    chunks: chunks.length,
    lessonsWithMd: counts.length,
    avgChunksPerLesson: counts.length
      ? Math.round((counts.reduce((a, b) => a + b, 0) / counts.length) * 10) / 10
      : 0,
    avgMdCharsPerLesson: lens.length
      ? Math.round(lens.reduce((a, b) => a + b, 0) / lens.length)
      : 0,
    maxMdChars: lens[0] || 0,
  };
}

export function resetAssignmentCache() {
  _assignment = null;
}
