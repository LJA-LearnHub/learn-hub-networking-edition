import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const p = path.join(__dirname, "..", "assets", "learn-hub-techplus-md-ch01.js");
const s = fs.readFileSync(p, "utf8");

let pos = 0;
while (true) {
  const k = s.indexOf('"tech-sg-01-', pos);
  if (k < 0) break;
  const idEnd = s.indexOf('"', k + 1);
  const id = s.slice(k + 1, idEnd);
  const strongStart = s.indexOf("<strong>", idEnd);
  const strongEnd = s.indexOf("</strong>", strongStart);
  if (strongStart < 0 || strongEnd < 0) break;
  const title = s
    .slice(strongStart + 8, strongEnd)
    .replace(/&amp;/g, "&")
    .replace(/&#39;/g, "'");
  console.log(id + "\t" + title);
  pos = strongEnd;
}
