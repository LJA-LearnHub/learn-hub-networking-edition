/**
 * Merges learn-hub-depth.js into learn narratives after stripping repeated
 * scaffolding, clears Tech+ learn intros (techplus.js supplies content),
 * writes learn-hub-courses.js and empties learn-hub-depth.js.
 *
 * Run: node Learn-Hub/scripts/fold-depth-into-courses.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

function parseWindowAssign(src, varName) {
  const re = new RegExp(`^\\s*window\\.${varName}\\s*=\\s*`);
  const m = src.replace(re, "").replace(/;\s*$/, "");
  return JSON.parse(m);
}

function stripDepthNoise(s) {
  if (!s) return "";
  let t = s.replace(/^\s*<hr class="teach-hr" \/>\s*/i, "");
  const reps = [
    [/<h3>Extended study guide[^<]*<\/h3>\s*<p>This lesson sits[\s\S]*?<\/p>/gi, ""],
    [/<h3>Extended lab briefing[^<]*<\/h3>\s*<p>[\s\S]*?<\/p>/gi, ""],
    [/<h3>Extended mini-lab guide[^<]*<\/h3>\s*<p>[\s\S]*?<\/p>/gi, ""],
    [/<h3>Before you type<\/h3>\s*<ol>[\s\S]*?<\/ol>/gi, ""],
    [/<h3>Recommended order of operations<\/h3>\s*<ol>[\s\S]*?<\/ol>/gi, ""],
    [/<h3>Workflow: how to absorb the reading<\/h3>\s*<ol>[\s\S]*?<\/ol>/gi, ""],
    [
      /<h3>While you work<\/h3>\s*(<p>Extra focus for this slot:[^<]*<\/p>)?\s*<ul>[\s\S]*?<\/ul>/gi,
      "$1",
    ],
    [/<h3>Self-check \(answer without scrolling up\)<\/h3>\s*<ol>[\s\S]*?<\/ol>/gi, ""],
    [/<h3>Notebook prompt<\/h3>\s*<p>[\s\S]*?<\/p>/gi, ""],
    [/<h3>If you only remember three things<\/h3>\s*<ul>[\s\S]*?<\/ul>/gi, ""],
    [/<h3>Stretch prompts[^<]*<\/h3>\s*<ul>[\s\S]*?<\/ul>/gi, ""],
    [/<h3>After you pass<\/h3>\s*<p>[\s\S]*?<\/p>/gi, ""],
    [/<div class="callout">[\s\S]*?<\/div>/gi, ""],
  ];
  for (const [re, rep] of reps) t = t.replace(re, rep);
  return t.trim();
}

const coursesSrc = fs.readFileSync(path.join(root, "assets", "learn-hub-courses.js"), "utf8");
const depthSrc = fs.readFileSync(path.join(root, "assets", "learn-hub-depth.js"), "utf8");

const COURSES = parseWindowAssign(coursesSrc, "LEARN_HUB_COURSES");
const DEPTH = parseWindowAssign(depthSrc, "LEARN_HUB_DEPTH");

for (const c of COURSES) {
  if (!c.lessons) continue;
  for (const L of c.lessons) {
    const base = L.narrative || "";
    const raw = DEPTH[L.id];
    const add = stripDepthNoise(raw || "");
    if (add) L.narrative = base + '<hr class="teach-hr"/>' + add;
    else L.narrative = base;
    if (c.id === "tech" && L.kind === "learn") L.narrative = "";
  }
}

const outCourses = "window.LEARN_HUB_COURSES = " + JSON.stringify(COURSES) + ";\n";
fs.writeFileSync(path.join(root, "assets", "learn-hub-courses.js"), outCourses, "utf8");

const outDepth =
  "/* Folded into learn-hub-courses.js — scaffold removed. Regenerate via fold-depth-into-courses.mjs if you restore depth data. */\nwindow.LEARN_HUB_DEPTH = {};\n";
fs.writeFileSync(path.join(root, "assets", "learn-hub-depth.js"), outDepth, "utf8");

let withAdd = 0;
let totalLessons = 0;
for (const c of COURSES) {
  if (!c.lessons) continue;
  for (const L of c.lessons) {
    totalLessons++;
    if ((L.narrative || "").includes("teach-hr")) withAdd++;
  }
}
console.log("Wrote learn-hub-courses.js; depth cleared. Lessons with folded addenda:", withAdd, "/", totalLessons);
