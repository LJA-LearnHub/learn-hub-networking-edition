/**
 * One-off audit: Tech+ lesson IDs in learn-hub-courses.js vs chunked MD + vs All_Learn-hub 626.
 */
import fs from "fs";
import path from "path";
import vm from "vm";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const assets = path.join(__dirname, "..", "assets");
const fullCourses = "g:/All_Learn-hub/Learn-Hub/learn-hub-courses.js";

function loadCourses(p) {
  const s = fs.readFileSync(p, "utf8");
  const ctx = { window: {} };
  vm.runInNewContext(s.replace(/^[^=]+=/, "window.LEARN_HUB_COURSES ="), ctx);
  return ctx.window.LEARN_HUB_COURSES;
}

function techLessonIds(courses) {
  const tech = courses.find((c) => c.id === "tech");
  return (tech && tech.lessons ? tech.lessons : []).map((L) => L.id);
}

/** Keys from chunked learn-hub-techplus-md-chNN.js */
function mdKeysFromHubsChunks() {
  const keys = new Set();
  for (let i = 1; i <= 12; i++) {
    const f = `learn-hub-techplus-md-ch${String(i).padStart(2, "0")}.js`;
    const p = path.join(assets, f);
    const s = fs.readFileSync(p, "utf8");
    const re = /"(tech-sg-\d{2}-\d{2})"/g;
    let m;
    while ((m = re.exec(s))) keys.add(m[1]);
  }
  return keys;
}

const hubCourses = loadCourses(path.join(assets, "learn-hub-courses.js"));
const hubTech = techLessonIds(hubCourses);
const chunkKeys = mdKeysFromHubsChunks();

const missingMd = hubTech.filter((id) => !chunkKeys.has(id));
const orphanMd = [...chunkKeys].filter((id) => !hubTech.includes(id)).sort();

let fullTech = [];
try {
  fullTech = techLessonIds(loadCourses(fullCourses));
} catch (e) {
  console.warn("Could not load All_Learn-hub courses:", e.message);
}

const missingVs626 = fullTech.filter((id) => !hubTech.includes(id));

console.log("Hubs courses tech lessons:", hubTech.length);
console.log("Chunk MD keys (unique tech-sg-*):", chunkKeys.size);
console.log("Course IDs without MD chunk key:", missingMd.length, missingMd.slice(0, 15));
console.log("MD keys not listed in Hubs courses:", orphanMd.length, orphanMd.slice(0, 15));
console.log("IDs in All_Learn-hub 626 tech not in Hubs courses:", missingVs626.length);
if (missingVs626.length) console.log(missingVs626.join("\n"));
