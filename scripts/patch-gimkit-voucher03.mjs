import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
let setJson = fs.readFileSync(path.join(root, "scripts", "voucher03-set.json"), "utf8");
if (setJson.charCodeAt(0) === 0xfeff) setJson = setJson.slice(1);
const set = JSON.parse(setJson);
const setStr = JSON.stringify(set, null, 2)
  .split("\n")
  .map((line) => (line.length ? "    " + line : line))
  .join("\n");
const gPath = path.join(root, "assets", "learn-hub-gimkit-questions.js");
let g = fs.readFileSync(gPath, "utf8");
const needle = `      ]
    }
  ]
};`;
if (!g.includes(needle)) throw new Error("needle not found");
const insert = "      ]\n    },\n" + setStr + "\n  ]\n};";
g = g.replace(needle, insert);
fs.writeFileSync(gPath, g, "utf8");
console.log("patched", gPath);
