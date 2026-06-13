import fs from "fs";
const path = new URL("../assets/learn-hub-courses.js", import.meta.url);
const s = fs.readFileSync(path, "utf8");
const start = s.indexOf("[");
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
    if (depth === 0) {
      console.log("root array ends at index", k);
      console.log("remainder:", JSON.stringify(s.slice(k + 1, k + 20)));
      break;
    }
  }
}
