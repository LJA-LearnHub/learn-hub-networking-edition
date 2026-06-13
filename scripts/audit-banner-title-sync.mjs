/**
 * One-off check: embedded <strong> banner in each chunk matches learn-hub-courses.js title.
 * Run: node scripts/audit-banner-title-sync.mjs
 */
import fs from "fs";
import path from "path";
import vm from "vm";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

function loadCourses() {
  const t = fs.readFileSync(path.join(root, "assets", "learn-hub-courses.js"), "utf8");
  const ctx = { window: {} };
  vm.runInNewContext(t.replace(/^[^=]+=/, "window.LEARN_HUB_COURSES ="), ctx);
  return ctx.window.LEARN_HUB_COURSES;
}

function norm(s) {
  return String(s)
    .replace(/&amp;/g, "&")
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

const courses = loadCourses();
const tech = courses.find((c) => c.id === "tech");
const byId = new Map(tech.lessons.filter((l) => /^tech-sg-\d{2}-\d{2}$/.test(l.id)).map((l) => [l.id, l.title]));

let bad = 0;
for (let ch = 1; ch <= 12; ch++) {
  const fp = path.join(root, "assets", `learn-hub-techplus-md-ch${String(ch).padStart(2, "0")}.js`);
  if (!fs.existsSync(fp)) continue;
  const s = fs.readFileSync(fp, "utf8");
  let pos = 0;
  while (true) {
    const k = s.indexOf('"tech-sg-', pos);
    if (k < 0) break;
    const idEnd = s.indexOf('"', k + 1);
    const id = s.slice(k + 1, idEnd);
    if (!/^tech-sg-\d{2}-\d{2}$/.test(id)) {
      pos = idEnd;
      continue;
    }
    const strongStart = s.indexOf("<strong>", idEnd);
    const strongEnd = s.indexOf("</strong>", strongStart);
    const banner = norm(s.slice(strongStart + 8, strongEnd));
    const side = norm(byId.get(id) || "");
    if (banner !== side) {
      console.error("MISMATCH", id, "\n  sidebar:", side, "\n  banner: ", banner);
      bad++;
    }
    pos = strongEnd;
  }
}

if (bad) {
  console.error("Total mismatches:", bad);
  process.exit(1);
}
console.log("OK: banner <strong> matches courses.js title for every tech-sg segment.");
