/**
 * Moves lesson narratives into learn-hub-deep.js (plus expansion blocks),
 * clears narrative in courses, adds learn-hub-playground.js starters for learn steps.
 * Run: node Learn-Hub/scripts/migrate-fcc-deep-playground.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

function parseWindowAssign(src, varName) {
  return JSON.parse(src.replace(new RegExp(`^\\s*window\\.${varName}\\s*=\\s*`), "").replace(/;\s*$/, ""));
}

function esc(s) {
  return String(s || "")
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;");
}

function expansionBlock(c, L) {
  const title = L.title || "";
  const unit = L.unit || "";
  const q = encodeURIComponent(title);
  const uq = encodeURIComponent(unit);
  let docs = "";
  if (c.id === "html" || c.id === "css" || c.id === "js") {
    docs = `<ul>
<li><a href="https://developer.mozilla.org/en-US/search?q=${q}" target="_blank" rel="noopener">MDN — search: ${esc(title)}</a></li>
<li><a href="https://developer.mozilla.org/en-US/docs/Web/HTML" target="_blank" rel="noopener">MDN HTML</a> · <a href="https://developer.mozilla.org/en-US/docs/Web/CSS" target="_blank" rel="noopener">CSS</a> · <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript" target="_blank" rel="noopener">JavaScript</a></li>
</ul>`;
  } else if (c.id === "py") {
    docs = `<ul>
<li><a href="https://docs.python.org/3/search.html?q=${q}" target="_blank" rel="noopener">Python docs search</a></li>
<li><a href="https://docs.python.org/3/tutorial/" target="_blank" rel="noopener">Official tutorial</a> · <a href="https://peps.python.org/pep-0008/" target="_blank" rel="noopener">PEP 8</a></li>
</ul>`;
  } else if (c.id === "sql") {
    docs = `<ul>
<li><a href="https://www.sqlite.org/lang.html" target="_blank" rel="noopener">SQLite SQL syntax</a></li>
<li><a href="https://www.sqlite.org/lang_select.html" target="_blank" rel="noopener">SELECT</a> · <a href="https://www.sqlite.org/lang_createtable.html" target="_blank" rel="noopener">CREATE TABLE</a></li>
</ul>`;
  } else if (c.id === "tech") {
    docs = `<ul>
<li><a href="https://www.comptia.org/en-us/certifications/tech/" target="_blank" rel="noopener">CompTIA Tech+</a> (objectives)</li>
<li>Local: <code>TechPlus/TechPlus_Study_Guide.html</code> — full guide + quizzes</li>
</ul>`;
  } else {
    docs = `<ul><li>Unit: <strong>${esc(unit)}</strong></li></ul>`;
  }

  return `
<hr class="teach-hr"/>
<h3>Self-hosted study loop (no paywall)</h3>
<ol>
<li><strong>Predict</strong> — write what you think the rule is before opening reference.</li>
<li><strong>Minimum repro</strong> — smallest code or query that still shows the idea.</li>
<li><strong>Check yourself</strong> — say aloud how this connects to the next lesson in the sidebar.</li>
<li><strong>Break it</strong> — remove one necessary piece; confirm behavior changes as expected.</li>
</ol>
<h3>Official &amp; local docs</h3>
${docs}
<h3>Unit map</h3>
<p><strong>${esc(unit)}</strong> — use the sidebar order as your syllabus; do not skip <em>practice</em> and <em>challenge</em> steps.</p>
<h3>Deeper checklist</h3>
<ul>
<li>Name the <strong>one idea</strong> this step is really about (one sentence).</li>
<li>List <strong>three facts</strong> you would put on a cheat sheet.</li>
<li>Note <strong>one bug</strong> you have seen (or can imagine) if someone ignores this step.</li>
<li>Skim the next lesson title — how does it depend on this one?</li>
</ul>`;
}

function playgroundStarter(c, L) {
  const t = (L.title || "topic").replace(/"/g, "'");
  if (c.ws === "web") {
    return {
      html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>Sandbox — ${t}</title>
</head>
<body>
  <!-- Lesson: ${t} — try ideas from the Reference panel, then Run -->
  <main>
    <h1>Playground</h1>
    <p>Edit this fragment. Use Run to preview.</p>
  </main>
</body>
</html>`,
      css: `/* ${t} — add rules here */\nbody { font-family: system-ui, sans-serif; }\n`,
      js: `// ${t} — experiment in the console; Run reloads preview\n`,
    };
  }
  if (c.ws === "py") {
    return {
      py: `# ${t}\n# Experiment here; Run executes this file.\n\nprint("sandbox ready")\n`,
    };
  }
  if (c.ws === "sql") {
    return {
      sql: `-- ${t}\n-- Explore with Run; use Check only on graded steps.\nSELECT 1 AS ok;\n`,
    };
  }
  return null;
}

const coursesSrc = fs.readFileSync(path.join(root, "assets", "learn-hub-courses.js"), "utf8");
const COURSES = parseWindowAssign(coursesSrc, "LEARN_HUB_COURSES");

const DEEP = {};
const PLAY = {};

for (const c of COURSES) {
  if (!c.lessons) continue;
  for (const L of c.lessons) {
    const base = L.narrative || "";
    if (base) DEEP[L.id] = base + expansionBlock(c, L);
    else if (c.id === "tech" && L.kind === "learn") {
      DEEP[L.id] =
        `<p class="msg info">This step uses the <strong>Tech+ study guide</strong> excerpt merged at load time (see <code>learn-hub-techplus.js</code>) plus drills below.</p>` +
        expansionBlock(c, L);
    } else DEEP[L.id] = expansionBlock(c, L);

    L.narrative = "";

    if (L.kind === "learn" && (c.ws === "web" || c.ws === "py" || c.ws === "sql")) {
      const pg = playgroundStarter(c, L);
      if (pg) PLAY[L.id] = pg;
    }
  }
}

const outCourses = "window.LEARN_HUB_COURSES = " + JSON.stringify(COURSES) + ";\n";
fs.writeFileSync(path.join(root, "assets", "learn-hub-courses.js"), outCourses, "utf8");

const deepBanner = `/* Full reference + drills — opened from the Reference panel (FCC-style). Auto-built by scripts/migrate-fcc-deep-playground.mjs */\n`;
fs.writeFileSync(
  path.join(root, "assets", "learn-hub-deep.js"),
  deepBanner + "window.LEARN_HUB_DEEP = " + JSON.stringify(DEEP, null, 2) + ";\n",
  "utf8"
);

const playBanner = `/* Sandbox starters for learn steps — workspace-first. Auto-built by scripts/migrate-fcc-deep-playground.mjs */\n`;
fs.writeFileSync(
  path.join(root, "assets", "learn-hub-playground.js"),
  playBanner + "window.LEARN_HUB_PLAYGROUND = " + JSON.stringify(PLAY) + ";\n",
  "utf8"
);

console.log("Wrote learn-hub-courses.js (narratives cleared), learn-hub-deep.js keys:", Object.keys(DEEP).length, "playground:", Object.keys(PLAY).length);
