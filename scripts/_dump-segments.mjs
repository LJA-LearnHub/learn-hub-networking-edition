import { readMergedChapterMaps } from "./techplus-chapter-io.mjs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const o = readMergedChapterMaps(root);
for (const id of ["tech-sg-02-05", "tech-sg-04-09", "tech-sg-06-05", "tech-sg-06-06", "tech-sg-07-08"]) {
  const s = o[id] || "";
  const i = s.indexOf("lh-tg-root");
  console.log("\n========", id, "len", s.length, "========");
  console.log(s.slice(Math.max(0, i), i + 3500));
}
