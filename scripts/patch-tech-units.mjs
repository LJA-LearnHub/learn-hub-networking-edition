import fs from "fs";
import { fileURLToPath } from "url";

const root = fileURLToPath(new URL("..", import.meta.url));
const path = `${root}/assets/learn-hub-courses.js`;

function sliceRootJsonArray(s) {
  const start = s.indexOf("[");
  if (start < 0) throw new Error("No [ in courses file");
  let depth = 0;
  let inStr = false;
  let esc = false;
  for (let k = start; k < s.length; k++) {
    const ch = s[k];
    if (inStr) {
      if (esc) {
        esc = false;
        continue;
      }
      if (ch === "\\") {
        esc = true;
        continue;
      }
      if (ch === '"') {
        inStr = false;
        continue;
      }
      continue;
    }
    if (ch === '"') {
      inStr = true;
      continue;
    }
    if (ch === "[") depth++;
    else if (ch === "]") {
      depth--;
      if (depth === 0) return { start, end: k + 1 };
    }
  }
  throw new Error("Unclosed JSON array");
}

let s = fs.readFileSync(path, "utf8");
const prefix = "window.LEARN_HUB_COURSES = ";
if (!s.startsWith(prefix)) throw new Error("Unexpected courses file prefix");

const { start, end } = sliceRootJsonArray(s);
const j = JSON.parse(s.slice(start, end));
const tech = j.find((c) => c.id === "tech");
if (!tech) throw new Error("No tech course");
const map = {
  "Ch 1 — Core Hardware Components": "Objective domain 1 — Core hardware & components",
  "Ch 2 — Peripherals and Connectors": "Objective domain 2 — Peripherals & connectors",
  "Ch 3 — Computing Devices and IoT": "Objective domain 3 — Computing devices & IoT",
  "Ch 4 — Operating Systems": "Objective domain 4 — Operating systems",
  "Ch 5 — Software Applications": "Objective domain 5 — Software applications",
  "Ch 6 — Software Development": "Objective domain 6 — Software development",
  "Ch 7 — Database Fundamentals": "Objective domain 7 — Database fundamentals",
  "Ch 8 — Networking Concepts and Technologies": "Objective domain 8 — Networking concepts & technologies",
  "Ch 9 — Cloud Computing and AI": "Objective domain 9 — Cloud computing & AI",
  "Ch 10 — Security Concepts and Threats": "Objective domain 10 — Security concepts & threats",
  "Ch 11 — Security Best Practices": "Objective domain 11 — Security best practices",
  "Ch 12 — Data Continuity and Computer Support": "Objective domain 12 — Data continuity & computer support",
  "Question bank": "Quick practice — Question bank (10–20 or full sets)",
};
let n = 0;
for (const L of tech.lessons) {
  if (map[L.unit]) {
    L.unit = map[L.unit];
    n++;
  }
}
console.log("Patched unit strings on", n, "Tech+ lessons");
const out = prefix + JSON.stringify(j) + ";\n";
fs.writeFileSync(path, out);
const s2 = fs.readFileSync(path, "utf8");
const { start: s2s, end: s2e } = sliceRootJsonArray(s2);
JSON.parse(s2.slice(s2s, s2e));
console.log("Verified JSON parse. File length", s2.length);
