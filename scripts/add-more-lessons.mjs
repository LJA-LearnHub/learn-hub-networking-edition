/**
 * One-shot: append new lessons + depth entries, then rewrite learn-hub-*.js
 * Run: node scripts/add-more-lessons.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const dir = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(dir, "..");
const assetsDir = path.join(root, "assets");

function loadCourses() {
  const t = fs.readFileSync(path.join(assetsDir, "learn-hub-courses.js"), "utf8");
  return JSON.parse(t.replace(/^[\s\S]*?=\s*/, "").replace(/;\s*$/, ""));
}

function loadDepth() {
  const t = fs.readFileSync(path.join(assetsDir, "learn-hub-depth.js"), "utf8");
  return JSON.parse(t.replace(/^[\s\S]*?=\s*/, "").replace(/;\s*$/, ""));
}

function saveCourses(courses) {
  fs.writeFileSync(
    path.join(assetsDir, "learn-hub-courses.js"),
    "window.LEARN_HUB_COURSES = " + JSON.stringify(courses) + ";\n"
  );
}

function saveDepth(D) {
  fs.writeFileSync(
    path.join(assetsDir, "learn-hub-depth.js"),
    "window.LEARN_HUB_DEPTH = " + JSON.stringify(D) + ";\n"
  );
}

const d = (id, html) => [id, html];

/** Short extended notes merged after narrative */
const newDepth = Object.fromEntries([
  d(
    "html-50",
    "<hr class=\"teach-hr\" /><h3>Go deeper</h3><p>Pair <code>aria-live=\"polite\"</code> with toasts that do not steal focus; reserve <code>assertive</code> for true emergencies.</p>"
  ),
  d(
    "html-52",
    "<hr class=\"teach-hr\" /><h3>Go deeper</h3><p>Clone <code>template.content</code> (not the template node) so event listeners are not accidentally shared across instances.</p>"
  ),
  d(
    "html-54",
    "<hr class=\"teach-hr\" /><h3>Go deeper</h3><p><code>inert</code> is ideal for modal stacks: everything behind the top dialog should be inert until dismissed.</p>"
  ),
  d(
    "html-56",
    "<hr class=\"teach-hr\" /><h3>Go deeper</h3><p>Use <code>fetchpriority=\"low\"</code> for decorative hero carousels so LCP candidates win bandwidth.</p>"
  ),
  d(
    "html-58",
    "<hr class=\"teach-hr\" /><h3>Go deeper</h3><p>Art direction with <code>picture</code> beats one giant responsive image when crop and focal point really differ by breakpoint.</p>"
  ),
  d(
    "css-50",
    "<hr class=\"teach-hr\" /><h3>Go deeper</h3><p>OKLCH makes “same lightness” palettes easier than mixing hex by hand; watch gamut on older displays.</p>"
  ),
  d(
    "css-52",
    "<hr class=\"teach-hr\" /><h3>Go deeper</h3><p>Put resets in a low layer and components above so overrides stay predictable.</p>"
  ),
  d(
    "css-54",
    "<hr class=\"teach-hr\" /><h3>Go deeper</h3><p>Subgrid shines for alignment between cards and an outer rhythm; fall back to flat grid on very old browsers.</p>"
  ),
  d(
    "css-56",
    "<hr class=\"teach-hr\" /><h3>Go deeper</h3><p>Prefer reduced-motion queries when tying visuals to scroll timelines.</p>"
  ),
  d(
    "css-58",
    "<hr class=\"teach-hr\" /><h3>Go deeper</h3><p>Combine with <code>:user-invalid</code> for a full “dirty vs valid” story without bespoke state machines.</p>"
  ),
  d(
    "js-48",
    "<hr class=\"teach-hr\" /><h3>Go deeper</h3><p><code>structuredClone</code> handles Dates and Maps; functions and DOM nodes still need custom handling.</p>"
  ),
  d(
    "js-50",
    "<hr class=\"teach-hr\" /><h3>Go deeper</h3>< p>Group related flags in one object and destructure defaults in the signature for readable option bags.</p>".replace(
      "< p>",
      "<p>"
    )
  ),
  d(
    "js-52",
    "<hr class=\"teach-hr\" /><h3>Go deeper</h3><p>Remember cleanup in <code>finally</code> or <code>using</code> (where supported) so locks and sockets do not leak.</p>"
  ),
  d(
    "js-54",
    "<hr class=\"teach-hr\" /><h3>Go deeper</h3><p>For hot paths, hoist regexes and reuse <code>TextEncoder</code> instances instead of recreating per call.</p>"
  ),
  d(
    "js-56",
    "<hr class=\"teach-hr\" /><h3>Go deeper</h3><p>Hash seeds and never log raw PII; salt API keys in examples.</p>"
  ),
  d(
    "py-51",
    "<hr class=\"teach-hr\" /><h3>Go deeper</h3><p><code>pathlib</code> avoids whole classes of Windows vs POSIX mistakes compared to string juggling.</p>"
  ),
  d(
    "py-53",
    "<hr class=\"teach-hr\" /><h3>Go deeper</h3><p>Use <code>venv</code> per project; pin dev tools in <code>requirements-dev.txt</code> separately from runtime deps.</p>"
  ),
  d(
    "py-55",
    "<hr class=\"teach-hr\" /><h3>Go deeper</h3><p>Prefer <code>raise ... from</code> when rethrowing to keep context chains in logs.</p>"
  ),
  d(
    "py-57",
    "<hr class=\"teach-hr\" /><h3>Go deeper</h3><p>For huge inputs, generators avoid materializing full lists in memory.</p>"
  ),
  d(
    "py-59",
    "<hr class=\"teach-hr\" /><h3>Go deeper</h3><p>Keep fixtures small and name them after behavior, not after internal class names.</p>"
  ),
  d(
    "sql-46",
    "<hr class=\"teach-hr\" /><h3>Go deeper</h3><p>Filter early on indexed columns before joins when the planner needs a hint.</p>"
  ),
  d(
    "sql-48",
    "<hr class=\"teach-hr\" /><h3>Go deeper</h3><p><code>FILTER</code> keeps one pass with readable predicates vs nested subqueries.</p>"
  ),
  d(
    "sql-50",
    "<hr class=\"teach-hr\" /><h3>Go deeper</h3><p>Use recursive CTEs for org charts; cap depth in data or query for safety.</p>"
  ),
  d(
    "sql-52",
    "<hr class=\"teach-hr\" /><h3>Go deeper</h3><p>Prefer covering indexes that match your selective WHERE + ORDER BY.</p>"
  ),
  d(
    "sql-54",
    "<hr class=\"teach-hr\" /><h3>Go deeper</h3><p>Document idempotent upsert keys in migrations so replays stay safe.</p>"
  ),
  d(
    "tech-21",
    "<hr class=\"teach-hr\" /><h3>Go deeper</h3><p>SLO burn rate alerts catch subtle regressions before customers hit the error budget wall.</p>"
  ),
  d(
    "tech-23",
    "<hr class=\"teach-hr\" /><h3>Go deeper</h3><p>Rotate keys on a schedule and on people change; automate distribution where possible.</p>"
  ),
]);

function pushHtml(html) {
  const L = [];
  L.push({
    unit: "Deepening HTML",
    id: "html-50",
    kind: "learn",
    title: "ARIA labels and live regions",
    narrative:
      "<h2>Why assistive tech needs hints</h2><p>Semantics from native elements get you far; custom widgets need names, roles, and state. <code>aria-label</code> names controls; <code>aria-live</code> announces dynamic updates without stealing focus.</p><h3>When to use polite vs assertive</h3><p>Use <code>polite</code> for status toasts and background saves. Reserve <code>assertive</code> for safety alerts that must interrupt.</p>",
  });
  L.push({
    unit: "Deepening HTML",
    id: "html-51",
    kind: "practice",
    title: "Practice: name the toggle",
    narrative: "<h2>Task</h2><p>Add <code>&lt;button type=\"button\" id=\"t\" aria-expanded=\"false\" aria-controls=\"p\"&gt;Show&lt;/button&gt;</code> and <code>&lt;p id=\"p\"&gt;Panel&lt;/p&gt;</code> in <code>body</code>.</p>",
    starter: { html: "<body></body>", css: "", js: "" },
    check: { type: "web", dom: [{ selector: "button#t[aria-expanded]", minCount: 1 }, { selector: "p#p", textIncludes: "Panel", minCount: 1 }] },
  });
  L.push({
    unit: "Deepening HTML",
    id: "html-52",
    kind: "learn",
    title: "Templates and document fragments",
    narrative:
      "<h2>Invisible blueprints</h2><p><code>&lt;template&gt;</code> holds inert DOM you clone at runtime — perfect for list rows and cards without string HTML.</p><h3>Cloning</h3><p>Use <code>document.importNode(template.content, true)</code> or <code>template.content.cloneNode(true)</code> then fill slots.</p>",
  });
  L.push({
    unit: "Deepening HTML",
    id: "html-53",
    kind: "practice",
    title: "Practice: keep a template",
    narrative: "<h2>Task</h2><p>Add <code>&lt;template id=\"row\"&gt;&lt;li&gt;Item&lt;/li&gt;&lt;/template&gt;</code> and <code>&lt;ul id=\"u\"&gt;&lt;/ul&gt;</code> inside <code>body</code>.</p>",
    starter: { html: "<body></body>", css: "", js: "" },
    check: { type: "web", dom: [{ selector: "template#row", minCount: 1 }, { selector: "ul#u", minCount: 1 }] },
  });
  L.push({
    unit: "Deepening HTML",
    id: "html-54",
    kind: "learn",
    title: "The inert attribute",
    narrative:
      "<h2>Freeze background UI</h2><p><code>inert</code> removes elements from tab order and pointer hit-testing while leaving them visible — ideal under modals.</p>",
  });
  L.push({
    unit: "Deepening HTML",
    id: "html-55",
    kind: "practice",
    title: "Practice: inert sidebar",
    narrative: "<h2>Task</h2><p>Add <code>&lt;aside inert&gt;&lt;p&gt;Background&lt;/p&gt;&lt;/aside&gt;</code> in <code>body</code>.</p>",
    starter: { html: "<body></body>", css: "", js: "" },
    check: { type: "web", dom: [{ selector: "aside[inert] p", textIncludes: "Background", minCount: 1 }] },
  });
  L.push({
    unit: "Deepening HTML",
    id: "html-56",
    kind: "learn",
    title: "Resource hints for images",
    narrative:
      "<h2>Budget network wisely</h2><p><code>fetchpriority=\"high\"</code> on the LCP image nudges the browser; <code>loading=\"lazy\"</code> defers offscreen work.</p>",
  });
  L.push({
    unit: "Deepening HTML",
    id: "html-57",
    kind: "practice",
    title: "Practice: flag the hero image",
    narrative: "<h2>Task</h2><p>Add <code>&lt;img alt=\"\" src=\"data:image/gif;base64,R0lGODlhAQABAAAAACw=\" width=\"1\" height=\"1\" fetchpriority=\"high\"&gt;</code> inside <code>body</code>.</p>",
    starter: { html: "<body></body>", css: "", js: "" },
    check: { type: "web", dom: [{ selector: 'img[fetchpriority="high"]', minCount: 1 }] },
  });
  L.push({
    unit: "Deepening HTML",
    id: "html-58",
    kind: "learn",
    title: "Responsive images with picture",
    narrative:
      "<h2>Art direction</h2><p><code>picture</code> lets you supply multiple sources with media queries so crops differ by breakpoint, not just resolution.</p>",
  });
  L.push({
    unit: "Deepening HTML",
    id: "html-59",
    kind: "practice",
    title: "Practice: add a picture",
    narrative: "<h2>Task</h2><p>Add <code>&lt;picture&gt;&lt;source media=\"(min-width:800px)\" srcset=\"a\"&gt;&lt;img alt=\"x\" src=\"b\"&gt;&lt;/picture&gt;</code> in <code>body</code>.</p>",
    starter: { html: "<body></body>", css: "", js: "" },
    check: { type: "web", dom: [{ selector: "picture img[alt='x']", minCount: 1 }, { selector: "picture source[media]", minCount: 1 }] },
  });
  html.lessons.push(...L);
}

function pushCss(css) {
  const L = [];
  L.push({
    unit: "Deepening CSS",
    id: "css-50",
    kind: "learn",
    title: "Color in OKLCH",
    narrative:
      "<h2>Perceptual palettes</h2><p>OKLCH separates lightness and chroma predictably compared to HSL. Great for accessible ramps that keep contrast steadier.</p>",
  });
  L.push({
    unit: "Deepening CSS",
    id: "css-51",
    kind: "practice",
    title: "Practice: paint with OKLCH",
    narrative: "<h2>Task</h2><p>Set <code>body { background: oklch(0.35 0.12 250); }</code> (any similar OKLCH triple is fine if it starts with <code>oklch(</code>).</p>",
    starter: { html: "<body>Hi</body>", css: "body{}", js: "" },
    check: { type: "web", cssIncludes: ["oklch("] },
  });
  L.push({
    unit: "Deepening CSS",
    id: "css-52",
    kind: "learn",
    title: "Cascade layers",
    narrative:
      "<h2>@layer</h2><p>Layers order entire swaths of rules without !important battles — put resets low, tokens middle, utilities high.</p>",
  });
  L.push({
    unit: "Deepening CSS",
    id: "css-53",
    kind: "practice",
    title: "Practice: declare a layer",
    narrative: "<h2>Task</h2><p>Include <code>@layer base, components;</code> somewhere in CSS.</p>",
    starter: { html: "<body></body>", css: "/* your layers */", js: "" },
    check: { type: "web", cssIncludes: ["@layer"] },
  });
  L.push({
    unit: "Deepening CSS",
    id: "css-54",
    kind: "learn",
    title: "Subgrid alignment",
    narrative:
      "<h2>Nested grids that share tracks</h2><p><code>grid-template-columns: subgrid</code> lets inner cards align to an outer parent grid without magic numbers.</p>",
  });
  L.push({
    unit: "Deepening CSS",
    id: "css-55",
    kind: "practice",
    title: "Practice: mention subgrid",
    narrative: "<h2>Task</h2><p>Add CSS containing the token <code>subgrid</code> (for example <code>grid-template-columns: subgrid;</code>).</p>",
    starter: { html: "<div class=\"g\"></div>", css: ".g{}", js: "" },
    check: { type: "web", cssIncludes: ["subgrid"] },
  });
  L.push({
    unit: "Deepening CSS",
    id: "css-56",
    kind: "learn",
    title: "Scroll-driven animation ideas",
    narrative:
      "<h2>Keyframes tied to scroll</h2><p>Modern browsers can tie animations to scroll position and view timelines — use for progress fades, not for essential motion only.</p>",
  });
  L.push({
    unit: "Deepening CSS",
    id: "css-57",
    kind: "practice",
    title: "Practice: animation-timeline",
    narrative: "<h2>Task</h2><p>Include <code>animation-timeline</code> in your CSS (value can be a placeholder such as <code>auto</code>).</p>",
    starter: { html: "<div class=\"x\"></div>", css: ".x{}", js: "" },
    check: { type: "web", cssIncludes: ["animation-timeline"] },
  });
  L.push({
    unit: "Deepening CSS",
    id: "css-58",
    kind: "learn",
    title: ":user-valid and form UX",
    narrative:
      "<h2>Validation without JS</h2><p>Pseudo-classes like <code>:user-valid</code> style fields after the user interacts, reducing scary red borders on untouched forms.</p>",
  });
  L.push({
    unit: "Deepening CSS",
    id: "css-59",
    kind: "practice",
    title: "Practice: style user-valid",
    narrative: "<h2>Task</h2><p>Add a rule using selector <code>input:user-valid</code> with any declaration.</p>",
    starter: { html: '<input id="i" />', css: "#i{}", js: "" },
    check: { type: "web", cssIncludes: [":user-valid"] },
  });
  css.lessons.push(...L);
}

function pushJs(js) {
  const L = [];
  L.push({
    unit: "Deepening JS",
    id: "js-48",
    kind: "learn",
    title: "structuredClone for deep copies",
    narrative:
      "<h2>Better than JSON round-trips</h2><p><code>structuredClone</code> deep-copies many built-in types and respects cycles — safer than spread for nested graphs.</p>",
  });
  L.push({
    unit: "Deepening JS",
    id: "js-49",
    kind: "practice",
    title: "Practice: clone an object",
    narrative: "<h2>Task</h2><p>In JS, call <code>structuredClone({a:1})</code> (any object literal is fine) so the grader sees the API in use.</p>",
    starter: { html: "<body></body>", css: "", js: "console.log('x');" },
    check: { type: "web", jsIncludes: ["structuredClone("] },
  });
  L.push({
    unit: "Deepening JS",
    id: "js-50",
    kind: "learn",
    title: "Default parameters and destructuring",
    narrative:
      "<h2>Readable function signatures</h2><p>Combine default params with object destructuring for options bags — callers pass partial objects without boilerplate.</p>",
  });
  L.push({
    unit: "Deepening JS",
    id: "js-51",
    kind: "practice",
    title: "Practice: default param",
    narrative: "<h2>Task</h2><p>Define a function with a defaulted parameter, e.g. <code>function f(x = 0){}</code>.</p>",
    starter: { html: "<body></body>", css: "", js: "// code here" },
    check: { type: "web", jsIncludes: ["= 0"] },
  });
  L.push({
    unit: "Deepening JS",
    id: "js-52",
    kind: "learn",
    title: "AbortController for cancelable work",
    narrative:
      "<h2>Stop stale results</h2><p>Pass <code>signal</code> from <code>AbortController</code> into <code>fetch</code> so rapid typing does not race older responses.</p>",
  });
  L.push({
    unit: "Deepening JS",
    id: "js-53",
    kind: "practice",
    title: "Practice: new AbortController",
    narrative: "<h2>Task</h2><p>Use <code>new AbortController()</code> in your JS.</p>",
    starter: { html: "<body></body>", css: "", js: "" },
    check: { type: "web", jsIncludes: ["AbortController("] },
  });
  L.push({
    unit: "Deepening JS",
    id: "js-54",
    kind: "learn",
    title: "TextEncoder and binary prep",
    narrative:
      "<h2>Strings to bytes</h2><p><code>TextEncoder</code> converts strings to UTF-8 bytes for crypto, hashing, and wire formats before TypedArrays.</p>",
  });
  L.push({
    unit: "Deepening JS",
    id: "js-55",
    kind: "practice",
    title: "Practice: TextEncoder",
    narrative: "<h2>Task</h2><p>Call <code>new TextEncoder()</code>.</p>",
    starter: { html: "<body></body>", css: "", js: "" },
    check: { type: "web", jsIncludes: ["TextEncoder("] },
  });
  L.push({
    unit: "Deepening JS",
    id: "js-56",
    kind: "learn",
    title: "crypto.randomUUID",
    narrative:
      "<h2>IDs without collisions</h2><p>For client-side keys, <code>crypto.randomUUID()</code> is fast and standard where Web Crypto is available.</p>",
  });
  L.push({
    unit: "Deepening JS",
    id: "js-57",
    kind: "practice",
    title: "Practice: randomUUID",
    narrative: "<h2>Task</h2><p>Reference <code>randomUUID</code> in code (e.g. <code>crypto.randomUUID()</code>).</p>",
    starter: { html: "<body></body>", css: "", js: "" },
    check: { type: "web", jsIncludes: ["randomUUID"] },
  });
  js.lessons.push(...L);
}

function pushPy(py) {
  const L = [];
  L.push({
    unit: "Deepening Python",
    id: "py-51",
    kind: "learn",
    title: "pathlib over manual strings",
    narrative:
      "<h2>Filesystem paths done right</h2><p><code>pathlib.Path</code> reads expressively, joins safely, and dodges OS-specific separators.</p>",
  });
  L.push({
    unit: "Deepening Python",
    id: "py-52",
    kind: "practice",
    title: "Practice: import pathlib",
    narrative: "<h2>Task</h2><p>Import pathlib: <code>from pathlib import Path</code> and print <code>ok</code>.</p>",
    starterPy: "from pathlib import Path\nprint(\"ok\")\n",
    check: { type: "pyStdout", equals: "ok", normalize: "trim" },
  });
  L.push({
    unit: "Deepening Python",
    id: "py-53",
    kind: "learn",
    title: "Virtual environments recap",
    narrative:
      "<h2>Isolate dependencies</h2><p>Use a venv per project; pin versions to keep CI and laptops aligned.</p>",
  });
  L.push({
    unit: "Deepening Python",
    id: "py-54",
    kind: "practice",
    title: "Practice: print venv hint",
    narrative: "<h2>Task</h2><p>Print the exact string <code>venv</code>.</p>",
    starterPy: 'print("venv")\n',
    check: { type: "pyStdout", equals: "venv", normalize: "trim" },
  });
  L.push({
    unit: "Deepening Python",
    id: "py-55",
    kind: "learn",
    title: "Exception chaining",
    narrative:
      "<h2>raise ... from</h2><p>Preserve context when translating errors so logs stay debuggable.</p>",
  });
  L.push({
    unit: "Deepening Python",
    id: "py-56",
    kind: "practice",
    title: "Practice: catch ValueError",
    narrative:
      "<h2>Task</h2><p>Run <code>try: raise ValueError('bad')\\nexcept ValueError: print('caught')</code> so stdout shows <code>caught</code>.</p>",
    starterPy: "try:\n    raise ValueError('bad')\nexcept ValueError:\n    print('caught')\n",
    check: { type: "pyStdout", equals: "caught", normalize: "trim" },
  });
  L.push({
    unit: "Deepening Python",
    id: "py-57",
    kind: "learn",
    title: "Generators for streaming",
    narrative:
      "<h2>Yield lazily</h2><p>Generators process large inputs item by item instead of building giant lists.</p>",
  });
  L.push({
    unit: "Deepening Python",
    id: "py-58",
    kind: "practice",
    title: "Practice: yield once",
    narrative: "<h2>Task</h2><p>Define <code>def g():\\n    yield 1</code> and print <code>next(g())</code> → output <code>1</code>.</p>",
    starterPy: "def g():\n    yield 1\nprint(next(g()))\n",
    check: { type: "pyStdout", equals: "1", normalize: "trim" },
  });
  L.push({
    unit: "Deepening Python",
    id: "py-59",
    kind: "learn",
    title: "pytest mindset",
    narrative:
      "<h2>Small tests, fast feedback</h2><p>Name tests after behavior; one logical assertion cluster per test keeps failures obvious.</p>",
  });
  L.push({
    unit: "Deepening Python",
    id: "py-60",
    kind: "practice",
    title: "Practice: assert True",
    narrative: "<h2>Task</h2><p><code>assert True</code> then print <code>pass</code>.</p>",
    starterPy: "assert True\nprint('pass')\n",
    check: { type: "pyStdout", equals: "pass", normalize: "trim" },
  });
  py.lessons.push(...L);
}

function pushSql(sql) {
  const L = [];
  L.push({
    unit: "Deepening SQL",
    id: "sql-46",
    kind: "learn",
    title: "Covering indexes mentally",
    narrative:
      "<h2>Index-only dreams</h2><p>If an index contains every column a query needs, the engine may skip the table heap — huge for hot read paths.</p>",
  });
  L.push({
    unit: "Deepening SQL",
    id: "sql-47",
    kind: "practice",
    title: "Practice: rows of twos",
    narrative: "<h2>Task</h2><p>Count rows where <code>n = 2</code> in table <code>t</code>.</p>",
    starterSql: "-- seed builds t\n",
    seed: "CREATE TABLE t (n INT); INSERT INTO t VALUES (1),(2),(2),(3);",
    check: {
      type: "sqlScalar",
      seed: "CREATE TABLE t (n INT); INSERT INTO t VALUES (1),(2),(2),(3);",
      sql: "SELECT COUNT(*) FROM t WHERE n = 2",
      equals: 2,
      failMsg: "Expect 2 rows with n = 2.",
    },
  });
  L.push({
    unit: "Deepening SQL",
    id: "sql-48",
    kind: "learn",
    title: "FILTER clause pattern",
    narrative:
      "<h2>Conditional aggregates</h2><p><code>COUNT(*) FILTER (WHERE ...)</code> counts subsets in one pass — clearer than nested subqueries.</p>",
  });
  L.push({
    unit: "Deepening SQL",
    id: "sql-49",
    kind: "practice",
    title: "Practice: FILTER count",
    narrative: "<h2>Task</h2><p>Return count of paid orders (status = 'paid').</p>",
    starterSql: "",
    seed: "CREATE TABLE orders (id INT, status TEXT); INSERT INTO orders VALUES (1,'paid'),(2,'open'),(3,'paid');",
    check: {
      type: "sqlScalar",
      seed: "CREATE TABLE orders (id INT, status TEXT); INSERT INTO orders VALUES (1,'paid'),(2,'open'),(3,'paid');",
      sql: "SELECT COUNT(*) FILTER (WHERE status = 'paid') AS c FROM orders",
      equals: 2,
      failMsg: "Two paid orders.",
    },
  });
  L.push({
    unit: "Deepening SQL",
    id: "sql-50",
    kind: "learn",
    title: "Recursive CTE sketch",
    narrative:
      "<h2>Trees in SQL</h2><p>Recursive CTEs walk hierarchies: anchor members seed the result; recursive members join back until nothing new appears.</p>",
  });
  L.push({
    unit: "Deepening SQL",
    id: "sql-51",
    kind: "practice",
    title: "Practice: sum depths",
    narrative: "<h2>Task</h2><p>Sum all <code>id</code> values from <code>nodes</code> (flat table: 1 + 2 + 3).</p>",
    starterSql: "",
    seed: "CREATE TABLE nodes (id INT); INSERT INTO nodes VALUES (1),(2),(3);",
    check: {
      type: "sqlScalar",
      seed: "CREATE TABLE nodes (id INT); INSERT INTO nodes VALUES (1),(2),(3);",
      sql: "SELECT SUM(id) FROM nodes",
      equals: 6,
      failMsg: "Sum should be 6.",
    },
  });
  L.push({
    unit: "Deepening SQL",
    id: "sql-52",
    kind: "learn",
    title: "Partial indexes",
    narrative:
      "<h2>Smaller, cheaper indexes</h2><p>Index only hot subsets (e.g. <code>WHERE active = 1</code>) to save space and write cost.</p>",
  });
  L.push({
    unit: "Deepening SQL",
    id: "sql-53",
    kind: "practice",
    title: "Practice: active users",
    narrative: "<h2>Task</h2><p>Count users where <code>active = 1</code>.</p>",
    starterSql: "",
    seed: "CREATE TABLE users (id INT, active INT); INSERT INTO users VALUES (1,1),(2,0),(3,1);",
    check: {
      type: "sqlScalar",
      seed: "CREATE TABLE users (id INT, active INT); INSERT INTO users VALUES (1,1),(2,0),(3,1);",
      sql: "SELECT COUNT(*) FROM users WHERE active = 1",
      equals: 2,
      failMsg: "Two active users.",
    },
  });
  L.push({
    unit: "Deepening SQL",
    id: "sql-54",
    kind: "learn",
    title: "Upserts and idempotency",
    narrative:
      "<h2>INSERT ON CONFLICT</h2><p>SQLite can upsert rows while keeping uniqueness guarantees — scripts stay re-runnable.</p>",
  });
  L.push({
    unit: "Deepening SQL",
    id: "sql-55",
    kind: "practice",
    title: "Practice: max price",
    narrative: "<h2>Task</h2><p>Select the maximum <code>price</code> in <code>items</code>.</p>",
    starterSql: "",
    seed: "CREATE TABLE items (price INT); INSERT INTO items VALUES (9),(42),(12);",
    check: {
      type: "sqlScalar",
      seed: "CREATE TABLE items (price INT); INSERT INTO items VALUES (9),(42),(12);",
      sql: "SELECT MAX(price) FROM items",
      equals: 42,
      failMsg: "Max is 42.",
    },
  });
  sql.lessons.push(...L);
}

function mkQs(items) {
  return items.map(([q, choices, correct]) => ({ q, choices, correct }));
}

function pushTech(tech) {
  const L = [];
  L.push({
    unit: "Reliability+",
    id: "tech-21",
    kind: "learn",
    title: "Error budgets and burn alerts",
    narrative:
      "<h2>SLOs you can feel</h2><p>An error budget translates uptime targets into consumable risk. Fast burn alerts mean you violate SLO early — fix before users flood support.</p>",
  });
  L.push({
    unit: "Security+",
    id: "tech-22",
    kind: "learn",
    title: "Secrets vs configuration",
    narrative:
      "<h2>What belongs in vaults</h2><p>Secrets grant access; configuration describes behavior. Never store API keys next to feature flags in plain repos.</p>",
  });
  L.push({
    unit: "Security+",
    id: "tech-23",
    kind: "learn",
    title: "Key rotation habits",
    narrative:
      "<h2>Rotate on schedule and event</h2><p>People leaving, breaches, or leaked logs should trigger rotations — automate distribution to reduce toil.</p>",
  });
  L.push({
    unit: "Platform+",
    id: "tech-24",
    kind: "learn",
    title: "Feature flags and blast radius",
    narrative:
      "<h2>Decouple release from deployment</h2><p>Flags let you ship dark, test cohorts, and kill switches — but prune stale flags or they become mystery meat.</p>",
  });
  const q11 = mkQs([
    ["Error budgets are consumed by:", ["Too many successful requests", "Failed requests that violate SLO", "Git commit count", "CSS bundle size"], 1],
    ["A kill switch via feature flag primarily:", ["Speeds up CPUs", "Limits impact of bad behavior", "Replaces monitoring", "Encrypts disks"], 1],
    ["Secrets should rotate when:", ["Never", "Only on birthdays", "People leave or keys leak", "Only if you use Windows"], 2],
    ["Partial indexes help by:", ["Indexing every row twice", "Indexing a filtered subset", "Removing PRIMARY KEY", "Disabling WAL"], 1],
    ["structuredClone is mainly for:", ["DOM nodes", "Deep copying many data types", "SQL migrations", "TLS handshakes"], 1],
  ]);
  L.push({
    unit: "Check-in K",
    id: "tech-q11",
    kind: "quiz",
    title: "Quiz: shipping safely",
    narrative: "<p>Five quick checks on flags, secrets, and reliability habits.</p>",
    questions: q11,
  });
  const q12 = mkQs([
    ["OKLCH helps with:", ["Rasterizing PDFs", "Perceptual color ramps", "Packet routing", "GPU mesh shaders"], 1],
    ["Cascade layers address:", ["Import order fights", "Z-index only", "JS minification", "HTTP caching"], 0],
    ["inert on DOM means:", ["Invisible", "Not focusable / not hit-testable", "Encrypted", "Cached forever"], 1],
    ["AbortController is for:", ["Cancelling fetch and similar tasks", "Drawing abort icons", "SQL VACUUM", "CSS reset"], 0],
    ["pathlib.Path improves:", ["String path mistakes", "DNS lookups", "Audio latency", "Printer DPI"], 0],
  ]);
  L.push({
    unit: "Check-in L",
    id: "tech-q12",
    kind: "quiz",
    title: "Quiz: web + platform literacy",
    narrative: "<p>Mix of CSS/HTML/JS hygiene and tooling.</p>",
    questions: q12,
  });
  const q13 = mkQs([
    ["Generators excel when:", ["You need infinite RAM", "You stream items lazily", "You avoid typing", "You disable exceptions"], 1],
    ["FILTER in SQL counts:", ["Only SQLite meta tables", "Subsets inside one aggregate pass", "JavaScript arrays", "HTTP headers"], 1],
    [":user-valid is for:", ["Server certificates", "Styling after user interaction", "GPU validation layers", "Docker healthchecks"], 1],
    ["randomUUID suits:", ["Client-generated correlation IDs", "Password storage", "TLS master secrets", "Filesystem ACLs"], 0],
    ["Feature flag debt smells like:", ["Too few deploys", "Hundreds of unknown toggles", "Small binaries", "Clean logs"], 1],
  ]);
  L.push({
    unit: "Check-in M",
    id: "tech-q13",
    kind: "quiz",
    title: "Quiz: depth round",
    narrative: "<p>Cross-topic review of this expansion pack.</p>",
    questions: q13,
  });
  tech.lessons.push(...L);
}

const courses = loadCourses();
const depth = loadDepth();

const htmlTrack = courses.find((c) => c.id === "html");
if (htmlTrack.lessons.some((l) => l.id === "html-50")) {
  console.error("Already expanded: html-50 exists. Abort to avoid duplicates.");
  process.exit(1);
}

const byId = Object.fromEntries(courses.map((c) => [c.id, c]));
pushHtml(byId.html);
pushCss(byId.css);
pushJs(byId.js);
pushPy(byId.py);
pushSql(byId.sql);
pushTech(byId.tech);

Object.assign(depth, newDepth);

saveCourses(courses);
saveDepth(depth);

const sum = (c) => c.lessons.length;
console.log(
  "Updated lesson counts:",
  courses.map((c) => c.id + ":" + sum(c)).join(" ")
);
