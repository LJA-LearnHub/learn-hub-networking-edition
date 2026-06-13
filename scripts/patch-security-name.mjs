import fs from "fs";
const p = new URL("../assets/learn-hub-courses.js", import.meta.url);
let t = fs.readFileSync(p, "utf8");
const a = '"id":"security","name":"Security"';
const b = '"id":"security","name":"Security+"';
if (!t.includes(a)) throw new Error("pattern not found");
t = t.replace(a, b);
fs.writeFileSync(p, t, "utf8");
console.log("ok");
