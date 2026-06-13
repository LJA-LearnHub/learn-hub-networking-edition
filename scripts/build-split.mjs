import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
const dir = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(dir, "..");
const assetsDir = path.join(root, "assets");
const htmlPath = path.join(root, "index.html");
const html = fs.readFileSync(htmlPath, "utf8");

function sliceBetween(open, closeTag, from) {
  const i = html.indexOf(open, from);
  if (i < 0) throw new Error("missing: " + open.slice(0, 40));
  const start = i + open.length;
  const j = html.indexOf(closeTag, start);
  if (j < 0) throw new Error("missing close after " + open.slice(0, 30));
  return { text: html.slice(start, j).trim(), after: j + closeTag.length };
}

let pos = 0;
const c1 = sliceBetween('<script type="text/plain" id="lh-b64-courses">', "</script>", 0);
const courses = JSON.parse(Buffer.from(c1.text, "base64").toString("utf8"));
const c2 = sliceBetween('<script type="text/plain" id="lh-b64-depth">', "</script>", c1.after);
const depth = JSON.parse(Buffer.from(c2.text, "base64").toString("utf8"));

const scr = html.indexOf("<script>", c2.after);
if (scr < 0) throw new Error("no main <script>");
const codeStart = scr + "<script>".length;
const codeEnd = html.lastIndexOf("</script>");
const fullCode = html.slice(codeStart, codeEnd);

const decoderEnd = fullCode.indexOf(
  '\n\n(function () {\n  var s = document.getElementById("lh-run-state");\n  if (s) s.textContent = "app JS parsing…";\n})();'
);
if (decoderEnd < 0) throw new Error("could not find app marker after b64 decoder");
const appJs =
  'document.documentElement.setAttribute("data-lh-data", "ok");\n' +
  fullCode.slice(decoderEnd + 2); // drop leading \n from \n\n before IIFE

fs.writeFileSync(path.join(assetsDir, "learn-hub-courses.js"), "window.LEARN_HUB_COURSES = " + JSON.stringify(courses) + ";\n");
fs.writeFileSync(path.join(assetsDir, "learn-hub-depth.js"), "window.LEARN_HUB_DEPTH = " + JSON.stringify(depth) + ";\n");
fs.writeFileSync(path.join(assetsDir, "learn-hub-app.js"), appJs);

const headHtml = html.slice(0, html.indexOf('<script type="text/plain" id="lh-b64-courses">'));
const tailFromBodyScripts = html.slice(codeEnd + "</script>".length);
const newHtml =
  headHtml +
  `  <script src="assets/learn-hub-courses.js"></script>
  <script src="assets/learn-hub-depth.js"></script>
  <script src="assets/learn-hub-app.js"></script>
` +
  tailFromBodyScripts;

fs.writeFileSync(htmlPath + ".bak", html);
fs.writeFileSync(htmlPath, newHtml);

console.log(
  "wrote learn-hub-courses.js",
  fs.statSync(path.join(assetsDir, "learn-hub-courses.js")).size,
  "learn-hub-depth.js",
  fs.statSync(path.join(assetsDir, "learn-hub-depth.js")).size,
  "learn-hub-app.js",
  fs.statSync(path.join(assetsDir, "learn-hub-app.js")).size,
  "index.html",
  newHtml.length
);
