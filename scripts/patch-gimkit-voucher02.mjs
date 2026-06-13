import fs from "fs";
const root = "c:/Users/logan/Downloads/learning-hub-main(2)/update_v1.0.4";
let setJson = fs.readFileSync(`${root}/scripts/voucher02-set.json`, "utf8");
if (setJson.charCodeAt(0) === 0xfeff) setJson = setJson.slice(1);
const set = JSON.parse(setJson);
const setStr = JSON.stringify(set, null, 2)
  .split("\n")
  .map((line) => (line.length ? "    " + line : line))
  .join("\n");
const gPath = `${root}/assets/learn-hub-gimkit-questions.js`;
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
