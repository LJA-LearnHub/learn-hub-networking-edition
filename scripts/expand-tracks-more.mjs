/**
 * Appends: many SQL + Python lessons; smaller batches for HTML, CSS, JS.
 * Run: node scripts/expand-tracks-more.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const dir = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(dir, "..");
const assetsDir = path.join(root, "assets");

function loadCourses() {
  return JSON.parse(
    fs.readFileSync(path.join(assetsDir, "learn-hub-courses.js"), "utf8").replace(/^[\s\S]*?=\s*/, "").replace(/;\s*$/, "")
  );
}

function loadDepth() {
  return JSON.parse(
    fs.readFileSync(path.join(assetsDir, "learn-hub-depth.js"), "utf8").replace(/^[\s\S]*?=\s*/, "").replace(/;\s*$/, "")
  );
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

const courses = loadCourses();
const depth = loadDepth();

const htmlT = courses.find((c) => c.id === "html");
if (htmlT.lessons.some((l) => l.id === "html-61")) {
  console.error("Already applied (html-61 exists).");
  process.exit(1);
}

const newDepth = {};

function d(id, h) {
  newDepth[id] = h;
}

// --- HTML +6 (html-61 .. html-66) ---
const htmlNew = [
  {
    unit: "More semantics",
    id: "html-61",
    kind: "learn",
    title: "Figure, figcaption, and captions",
    narrative:
      "<h2>Self-describing media</h2><p><code>figure</code> groups an image, diagram, or code block with an optional <code>figcaption</code>. It is not the same as a decorative wrapper — use it when the caption carries meaning.</p><h3>Accessibility</h3><p>Screen readers can associate caption text with the figure; prefer real text over images of text for captions.</p>",
  },
  {
    unit: "More semantics",
    id: "html-62",
    kind: "practice",
    title: "Practice: figure + caption",
    narrative: "<h2>Task</h2><p>In <code>body</code>, add <code>&lt;figure&gt;&lt;img alt=\"chart\" src=\"data:image/gif;base64,R0lGODlhAQABAAAAACw=\"&gt;&lt;figcaption&gt;Q1&lt;/figcaption&gt;&lt;/figure&gt;</code>.</p>",
    starter: { html: "<body></body>", css: "", js: "" },
    check: { type: "web", dom: [{ selector: "figure figcaption", textIncludes: "Q1", minCount: 1 }, { selector: 'figure img[alt="chart"]', minCount: 1 }] },
  },
  {
    unit: "More semantics",
    id: "html-63",
    kind: "learn",
    title: "The cite element",
    narrative:
      "<h2>Attribution</h2><p><code>cite</code> marks the title of a cited work — a book, paper, or film — not the name of every person mentioned in a quote.</p>",
  },
  {
    unit: "More semantics",
    id: "html-64",
    kind: "practice",
    title: "Practice: blockquote + cite",
    narrative: "<h2>Task</h2><p>Add <code>&lt;blockquote&gt;&lt;p&gt;Hello&lt;/p&gt;&lt;cite&gt;Manual&lt;/cite&gt;&lt;/blockquote&gt;</code> in <code>body</code>.</p>",
    starter: { html: "<body></body>", css: "", js: "" },
    check: { type: "web", dom: [{ selector: "blockquote cite", textIncludes: "Manual", minCount: 1 }] },
  },
  {
    unit: "More semantics",
    id: "html-65",
    kind: "learn",
    title: "Output and preformatted text",
    narrative:
      "<h2>When whitespace matters</h2><p><code>pre</code> preserves spaces and line breaks; pair with <code>code</code> inside for literal code snippets. <code>samp</code> is for sample program output.</p>",
  },
  {
    unit: "More semantics",
    id: "html-66",
    kind: "practice",
    title: "Practice: pre and code",
    narrative: "<h2>Task</h2><p>Add <code>&lt;pre&gt;&lt;code&gt;line1\\nline2&lt;/code&gt;&lt;/pre&gt;</code> in <code>body</code> (two lines inside the code text).</p>",
    starter: { html: "<body></body>", css: "", js: "" },
    check: { type: "web", dom: [{ selector: "pre code", textIncludes: "line1", minCount: 1 }, { selector: "pre code", textIncludes: "line2", minCount: 1 }] },
  },
];
d("html-61", "<hr class=\"teach-hr\" /><h3>Tip</h3><p>Figures can wrap more than images — think tables or SVG diagrams with a shared caption.</p>");
d("html-63", "<hr class=\"teach-hr\" /><h3>Tip</h3><p>For inline quotations use <code>q</code>; reserve <code>blockquote</code> for longer excerpts.</p>");
d("html-65", "<hr class=\"teach-hr\" /><h3>Tip</h3><p>For long listings, add <code>tabindex=\"0\"</code> and overflow styles so keyboard users can scroll.</p>");

// --- CSS +6 (css-61 .. css-66) ---
const cssNew = [
  {
    unit: "More layout",
    id: "css-61",
    kind: "learn",
    title: "min(), max(), clamp() for fluid type",
    narrative:
      "<h2>Responsive without twenty breakpoints</h2><p>Fluid typography uses <code>clamp(min, preferred, max)</code> so font size scales between bounds. <code>min()</code> and <code>max()</code> help cap widths and spacing.</p>",
  },
  {
    unit: "More layout",
    id: "css-62",
    kind: "practice",
    title: "Practice: use clamp on font-size",
    narrative: "<h2>Task</h2><p>Set <code>html { font-size: clamp(14px, 2vw, 20px); }</code> (exact spacing optional).</p>",
    starter: { html: "<html><body>x</body></html>", css: "html {}", js: "" },
    check: { type: "web", cssIncludes: ["clamp(", "font-size", "14px", "20px"] },
  },
  {
    unit: "More layout",
    id: "css-63",
    kind: "learn",
    title: "is() and :where() selector lists",
    narrative:
      "<h2>DRY selectors</h2><p><code>:is(h1, h2, h3)</code> groups selectors without repeating. <code>:where()</code> has zero specificity — handy for reset layers.</p>",
  },
  {
    unit: "More layout",
    id: "css-64",
    kind: "practice",
    title: "Practice: :is() heading rule",
    narrative: "<h2>Task</h2><p>Add a rule using <code>:is(h1,h2)</code> with any declaration (e.g. <code>color: red</code>).</p>",
    starter: { html: "<h1>a</h1>", css: "", js: "" },
    check: { type: "web", cssIncludes: [":is(", "h1", "h2"] },
  },
  {
    unit: "More layout",
    id: "css-65",
    kind: "learn",
    title: "overscroll-behavior",
    narrative:
      "<h2>Scroll chaining</h2><p><code>overscroll-behavior: contain</code> stops scroll from propagating to the parent — useful for modals and nested panes.</p>",
  },
  {
    unit: "More layout",
    id: "css-66",
    kind: "practice",
    title: "Practice: overscroll-behavior",
    narrative: "<h2>Task</h2><p>Include <code>overscroll-behavior:</code> in your CSS (any value).</p>",
    starter: { html: "<div class=\"s\"></div>", css: ".s{}", js: "" },
    check: { type: "web", cssIncludes: ["overscroll-behavior"] },
  },
];
d("css-61", "<hr class=\"teach-hr\" /><h3>Tip</h3><p>Test clamp() with zoom and narrow viewports, not only one phone size.</p>");
d("css-63", "<hr class=\"teach-hr\" /><h3>Tip</h3><p>Specificity surprises often come from mixing :is() with nested selectors — check computed rules in devtools.</p>");
d("css-65", "<hr class=\"teach-hr\" /><h3>Tip</h3><p>Pair with touch-action when building custom swipe regions.</p>");

// --- JS +6 (js-59 .. js-64) ---
const jsNew = [
  {
    unit: "More runtime",
    id: "js-59",
    kind: "learn",
    title: "Intl for dates and numbers",
    narrative:
      "<h2>Locale-aware formatting</h2><p><code>Intl.DateTimeFormat</code> and <code>Intl.NumberFormat</code> format output for the user’s locale without pulling a huge library.</p>",
  },
  {
    unit: "More runtime",
    id: "js-60",
    kind: "practice",
    title: "Practice: Intl.NumberFormat",
    narrative: "<h2>Task</h2><p>Use <code>new Intl.NumberFormat()</code> in your JS (any options).</p>",
    starter: { html: "<body></body>", css: "", js: "" },
    check: { type: "web", jsIncludes: ["Intl.NumberFormat"] },
  },
  {
    unit: "More runtime",
    id: "js-61",
    kind: "learn",
    title: "Map and Set for collections",
    narrative:
      "<h2>Beyond objects and arrays</h2><p><code>Map</code> keeps key insertion order and allows any key type. <code>Set</code> stores unique values — great for deduping IDs.</p>",
  },
  {
    unit: "More runtime",
    id: "js-62",
    kind: "practice",
    title: "Practice: new Set",
    narrative: "<h2>Task</h2><p>Create <code>new Set([1,2,2])</code> and <code>console.log</code> its <code>.size</code> (should print <code>2</code>).</p>",
    starter: { html: "<body></body>", css: "", js: "" },
    check: { type: "web", jsIncludes: ["new Set", ".size"] },
  },
  {
    unit: "More runtime",
    id: "js-63",
    kind: "learn",
    title: "queueMicrotask vs setTimeout(0)",
    narrative:
      "<h2>Task ordering</h2><p>Microtasks run before the next render and before the next macrotask. <code>queueMicrotask</code> schedules work in that queue — useful for finishing state updates before paint.</p>",
  },
  {
    unit: "More runtime",
    id: "js-64",
    kind: "practice",
    title: "Practice: queueMicrotask",
    narrative: "<h2>Task</h2><p>Call <code>queueMicrotask(() =&gt; console.log('m'))</code>.</p>",
    starter: { html: "<body></body>", css: "", js: "" },
    check: { type: "web", jsIncludes: ["queueMicrotask"] },
  },
];
d("js-59", "<hr class=\"teach-hr\" /><h3>Tip</h3><p>Always pass explicit locales in tests; browsers differ in default locale.</p>");
d("js-61", "<hr class=\"teach-hr\" /><h3>Tip</h3><p>For JSON-serializable caches, plain objects still win — Maps shine for non-string keys.</p>");
d("js-63", "<hr class=\"teach-hr\" /><h3>Tip</h3><p>Overusing microtasks can starve input — batch work instead of chaining hundreds.</p>");

// --- Python +24 (py-62 .. py-85) ---
const pyNew = [
  ["learn", "py-62", "Itertools basics", "More loops", "<h2>Composable iterators</h2><p>The <code>itertools</code> module offers <code>chain</code>, <code>cycle</code>, <code>islice</code>, and more — memory-friendly pipelines over large sequences.</p>", null, null],
  ["practice", "py-63", "Practice: chain two ranges", "More loops", "<h2>Task</h2><p>Print exactly <code>1 2 3 4</code> separated by single spaces (one line).</p>", "from itertools import chain\n", { type: "pyStdout", equals: "1 2 3 4", normalize: "trim" }, "print(' '.join(map(str, chain(range(1,4), [4]))))\n"],
  ["learn", "py-64", "functools.partial", "Functional tools", "<h2>Freeze arguments</h2><p><code>functools.partial</code> builds a new callable with some arguments pre-filled — handy for callbacks and CLI wrappers.</p>", null, null],
  ["practice", "py-65", "Practice: partial add", "Functional tools", "<h2>Task</h2><p>Use <code>functools.partial</code> and print the result of calling it so stdout shows <code>8</code> (e.g. partial add with first arg 5, then call with 3).</p>", "import functools\n", { type: "pyStdout", equals: "8", normalize: "trim" }, "import functools\np = functools.partial(lambda a,b: a+b, 5)\nprint(p(3))\n"],
  ["learn", "py-66", "collections.Counter", "Collections", "<h2>Count hashables</h2><p><code>Counter</code> tallies occurrences — great for log analysis, votes, and character frequencies.</p>", null, null],
  ["practice", "py-67", "Practice: Counter most common", "Collections", "<h2>Task</h2><p>Print the single character <code>a</code> (from Counter of <code>'banana'</code> most common letter).</p>", "from collections import Counter\n", { type: "pyStdout", equals: "a", normalize: "trim" }, "from collections import Counter\nprint(Counter('banana').most_common(1)[0][0])\n"],
  ["learn", "py-68", "contextlib.suppress", "Context managers", "<h2>Quiet known errors</h2><p><code>contextlib.suppress(OSError)</code> runs a block and ignores specific exceptions — clearer than empty <code>except</code> clauses.</p>", null, null],
  ["practice", "py-69", "Practice: suppress demo", "Context managers", "<h2>Task</h2><p>Print <code>ok</code> after using <code>contextlib.suppress(ZeroDivisionError)</code> around <code>1/0</code>.</p>", "import contextlib\n", { type: "pyStdout", equals: "ok", normalize: "trim" }, "import contextlib\nwith contextlib.suppress(ZeroDivisionError):\n    1/0\nprint('ok')\n"],
  ["learn", "py-70", "Enum for states", "Types and clarity", "<h2>Named constants</h2><p><code>enum.Enum</code> models fixed states — better than magic strings scattered through the codebase.</p>", null, null],
  ["practice", "py-71", "Practice: Enum member", "Types and clarity", "<h2>Task</h2><p>Define <code>class Color(Enum): RED = 1</code> and print <code>Color.RED.name</code> → <code>RED</code>.</p>", "from enum import Enum\n", { type: "pyStdout", equals: "RED", normalize: "trim" }, "from enum import Enum\nclass Color(Enum):\n    RED = 1\nprint(Color.RED.name)\n"],
  ["learn", "py-72", "zip and strict=", "Iteration", "<h2>Parallel iteration</h2><p><code>zip(names, scores, strict=True)</code> raises if lengths differ — catches silent truncation bugs.</p>", null, null],
  ["practice", "py-73", "Practice: zip strict", "Iteration", "<h2>Task</h2><p>Print <code>ok</code> if <code>list(zip([1,2],[3,4], strict=True))</code> has length 2, else <code>no</code> (use <code>ok</code>).</p>", "", { type: "pyStdout", equals: "ok", normalize: "trim" }, "print('ok' if len(list(zip([1,2],[3,4], strict=True)))==2 else 'no')\n"],
  ["learn", "py-74", "match / case overview", "Syntax", "<h2>Structural patterns</h2><p>Python 3.10+ <code>match</code> can destructure tuples and data shapes — not a full switch, but powerful for parsers.</p>", null, null],
  ["practice", "py-75", "Practice: match literal", "Syntax", "<h2>Task</h2><p>Use <code>match</code>/<code>case</code> so printing result of matching <code>'go'</code> yields <code>1</code>.</p>", "", { type: "pyStdout", equals: "1", normalize: "trim" }, "x='go'\nmatch x:\n    case 'go':\n        print(1)\n    case _:\n        print(0)\n"],
  ["learn", "py-76", "typing.Protocol", "Typing", "<h2>Structural subtyping</h2><p><code>Protocol</code> describes capabilities (duck typing) for static checkers without inheritance.</p>", null, null],
  ["practice", "py-77", "Practice: Protocol mention", "Typing", "<h2>Task</h2><p>Include the substring <code>Protocol</code> in a comment and print <code>typed</code>.</p>", "", { type: "pyStdout", equals: "typed", normalize: "trim" }, "# Protocol duck\nprint('typed')\n"],
  ["learn", "py-78", "zipfile module", "Stdlib", "<h2>Archives in pure Python</h2><p><code>zipfile.ZipFile</code> reads and writes ZIPs — common for data bundles and build artifacts.</p>", null, null],
  ["practice", "py-79", "Practice: import zipfile", "Stdlib", "<h2>Task</h2><p><code>import zipfile</code> and print <code>zip</code>.</p>", "", { type: "pyStdout", equals: "zip", normalize: "trim" }, "import zipfile\nprint('zip')\n"],
  ["learn", "py-80", "csv module", "Data interchange", "<h2>Tables as files</h2><p><code>csv.reader</code> / <code>csv.DictReader</code> parse delimited text without hand-splitting on commas.</p>", null, null],
  ["practice", "py-81", "Practice: import csv", "Data interchange", "<h2>Task</h2><p><code>import csv</code> and print <code>csv</code>.</p>", "", { type: "pyStdout", equals: "csv", normalize: "trim" }, "import csv\nprint('csv')\n"],
  ["learn", "py-82", "hashlib for fingerprints", "Security basics", "<h2>Hashes, not passwords</h2><p><code>hashlib.sha256</code> fingerprints content. For passwords use dedicated algorithms (argon2/bcrypt), not raw SHA-256.</p>", null, null],
  ["practice", "py-83", "Practice: sha256 hex", "Security basics", "<h2>Task</h2><p>Print the hex digest of <code>b'hi'</code> using <code>hashlib.sha256</code> (64 hex chars).</p>", "import hashlib\n", { type: "pyStdout", regex: "^[0-9a-f]{64}$", flags: "" }, "import hashlib\nprint(hashlib.sha256(b'hi').hexdigest())\n"],
  ["learn", "py-84", "argparse intro", "CLI", "<h2>User-friendly flags</h2><p><code>argparse</code> builds help text and validates arguments for command-line tools.</p>", null, null],
  ["practice", "py-85", "Practice: import argparse", "CLI", "<h2>Task</h2><p><code>import argparse</code> and print <code>cli</code>.</p>", "", { type: "pyStdout", equals: "cli", normalize: "trim" }, "import argparse\nprint('cli')\n"],
];

const pyLessons = [];
for (const row of pyNew) {
  const [kind, id, title, unit, narrative, starterHint, check, starterSolved] = row;
  if (kind === "learn") {
    pyLessons.push({ unit, id, kind: "learn", title, narrative });
  } else {
    pyLessons.push({
      unit,
      id,
      kind: "practice",
      title,
      narrative,
      starterPy: starterHint != null ? starterHint : "# your code\n",
      check,
    });
    if (starterSolved) {
      pyLessons[pyLessons.length - 1].starterPy = starterSolved;
    }
  }
}

d("py-62", "<hr class=\"teach-hr\" /><h3>Tip</h3><p>Combine <code>islice</code> with infinite iterators carefully — always cap the slice.</p>");
d("py-66", "<hr class=\"teach-hr\" /><h3>Tip</h3><p><code>Counter</code> supports set-like math for multiset comparisons.</p>");
d("py-70", "<hr class=\"teach-hr\" /><h3>Tip</h3><p>StrEnum can bridge enums and string APIs in 3.11+.</p>");
d("py-74", "<hr class=\"teach-hr\" /><h3>Tip</h3><p>Start patterns simple; over-nesting match hurts readability.</p>");
d("py-78", "<hr class=\"teach-hr\" /><h3>Tip</h3><p>Watch path traversal when extracting ZIPs from untrusted sources.</p>");
d("py-82", "<hr class=\"teach-hr\" /><h3>Tip</h3><p>Use HMAC when a secret key must participate in the fingerprint.</p>");

// --- SQL +25 (sql-57 .. sql-81) ---
const sqlNew = [
  ["learn", "sql-57", "CHECK constraints", "Integrity", "<h2>Row-level rules</h2><p><code>CHECK (age >= 0)</code> rejects invalid rows at insert time — cheap validation close to the data.</p>"],
  [
    "practice",
    "sql-58",
    "Practice: count positive balances",
    "Integrity",
    "<h2>Task</h2><p>Count accounts where <code>balance &gt; 0</code>.</p>",
    "CREATE TABLE acct (id INT, balance REAL); INSERT INTO acct VALUES (1,10),(2,-3),(3,0.5);",
    { type: "sqlScalar", seed: "CREATE TABLE acct (id INT, balance REAL); INSERT INTO acct VALUES (1,10),(2,-3),(3,0.5);", sql: "SELECT COUNT(*) FROM acct WHERE balance > 0", equals: 2, failMsg: "Two positive balances." },
  ],
  ["learn", "sql-59", "UNION vs UNION ALL", "Set ops", "<h2>Combine results</h2><p><code>UNION</code> deduplicates; <code>UNION ALL</code> keeps duplicates and is faster when you know sets are disjoint.</p>"],
  [
    "practice",
    "sql-60",
    "Practice: UNION ALL rows",
    "Set ops",
    "<h2>Task</h2><p>Return all rows from combining <code>SELECT id FROM a</code> and <code>SELECT id FROM b</code> with <code>UNION ALL</code> — 4 rows.</p>",
    "CREATE TABLE a(id INT); CREATE TABLE b(id INT); INSERT INTO a VALUES (1),(2); INSERT INTO b VALUES (3),(4);",
    {
      type: "sqlSelect",
      seed: "CREATE TABLE a(id INT); CREATE TABLE b(id INT); INSERT INTO a VALUES (1),(2); INSERT INTO b VALUES (3),(4);",
      expectSql: "SELECT id FROM a UNION ALL SELECT id FROM b ORDER BY id",
      ignoreOrder: false,
      failMsg: "UNION ALL then ORDER BY id.",
    },
  ],
  ["learn", "sql-61", "EXISTS subqueries", "Subqueries", "<h2>Semi-joins</h2><p><code>WHERE EXISTS (...)</code> answers “is there any matching row?” without selecting columns from the subquery.</p>"],
  [
    "practice",
    "sql-62",
    "Practice: customers with orders",
    "Subqueries",
    "<h2>Task</h2><p>Select names of customers who have at least one order (use EXISTS).</p>",
    "CREATE TABLE cust(id INT, name TEXT); CREATE TABLE ord(id INT, cust_id INT); INSERT INTO cust VALUES (1,'Ann'),(2,'Bo'); INSERT INTO ord VALUES (1,1);",
    {
      type: "sqlSelect",
      seed: "CREATE TABLE cust(id INT, name TEXT); CREATE TABLE ord(id INT, cust_id INT); INSERT INTO cust VALUES (1,'Ann'),(2,'Bo'); INSERT INTO ord VALUES (1,1);",
      expectSql: "SELECT name FROM cust c WHERE EXISTS (SELECT 1 FROM ord o WHERE o.cust_id = c.id) ORDER BY name",
      ignoreOrder: false,
      failMsg: "EXISTS linking ord.cust_id to cust.id; order by name.",
    },
  ],
  ["learn", "sql-63", "CASE expressions", "Expressions", "<h2>SQL conditionals</h2><p>Searched <code>CASE WHEN ... THEN ... END</code> maps conditions to values inside SELECT or ORDER BY.</p>"],
  [
    "practice",
    "sql-64",
    "Practice: CASE label",
    "Expressions",
    "<h2>Task</h2><p>Select each <code>id</code> and a column <code>lbl</code> that is <code>'hi'</code> if <code>score >= 10</code> else <code>'lo'</code>.</p>",
    "CREATE TABLE g(id INT, score INT); INSERT INTO g VALUES (1,12),(2,5);",
    {
      type: "sqlSelect",
      seed: "CREATE TABLE g(id INT, score INT); INSERT INTO g VALUES (1,12),(2,5);",
      expectSql: "SELECT id, CASE WHEN score >= 10 THEN 'hi' ELSE 'lo' END AS lbl FROM g ORDER BY id",
      ignoreOrder: false,
      failMsg: "CASE WHEN score >= 10 THEN hi ELSE lo.",
    },
  ],
  ["learn", "sql-65", "Self-joins", "Joins", "<h2>Same table, two roles</h2><p>Join a table to itself with aliases — common for employee/manager or graph edges stored as rows.</p>"],
  [
    "practice",
    "sql-66",
    "Practice: pairs from edges",
    "Joins",
    "<h2>Task</h2><p>Table <code>e(a,b)</code> has (1,2) and (2,3). Select rows where <code>e1.b = e2.a</code> (path length 2) — should return middle node pairs.</p>",
    "CREATE TABLE e(a INT, b INT); INSERT INTO e VALUES (1,2),(2,3);",
    {
      type: "sqlSelect",
      seed: "CREATE TABLE e(a INT, b INT); INSERT INTO e VALUES (1,2),(2,3);",
      expectSql: "SELECT e1.a AS start_node, e2.b AS end_node FROM e e1 JOIN e e2 ON e1.b = e2.a ORDER BY start_node, end_node",
      ignoreOrder: false,
      failMsg: "Self-join on e1.b = e2.a.",
    },
  ],
  ["learn", "sql-67", "COALESCE and NULLIF", "Null handling", "<h2>Defaults and guards</h2><p><code>COALESCE(a,b)</code> returns first non-null; <code>NULLIF(x,y)</code> nulls out when equal — handy for divide-by-zero guards.</p>"],
  [
    "practice",
    "sql-68",
    "Practice: COALESCE name",
    "Null handling",
    "<h2>Task</h2><p>Select <code>COALESCE(nick, name)</code> as <code>display</code> ordered by display for table <code>u(name,nick)</code>.</p>",
    "CREATE TABLE u(name TEXT, nick TEXT); INSERT INTO u VALUES ('Ada',NULL),('Bob','B');",
    {
      type: "sqlSelect",
      seed: "CREATE TABLE u(name TEXT, nick TEXT); INSERT INTO u VALUES ('Ada',NULL),('Bob','B');",
      expectSql: "SELECT COALESCE(nick, name) AS display FROM u ORDER BY display",
      ignoreOrder: false,
      failMsg: "COALESCE(nick, name) ORDER BY display.",
    },
  ],
  ["learn", "sql-69", "strftime in SQLite", "Date/time", "<h2>SQLite date helpers</h2><p><code>strftime('%Y', col)</code> extracts parts from ISO-like date strings for grouping reports.</p>"],
  [
    "practice",
    "sql-70",
    "Practice: count by year",
    "Date/time",
    "<h2>Task</h2><p>Table <code>ev(dt TEXT)</code> has ISO dates. Count rows per year using strftime.</p>",
    "CREATE TABLE ev(dt TEXT); INSERT INTO ev VALUES ('2024-01-01'),('2024-06-01'),('2025-01-01');",
    {
      type: "sqlSelect",
      seed: "CREATE TABLE ev(dt TEXT); INSERT INTO ev VALUES ('2024-01-01'),('2024-06-01'),('2025-01-01');",
      expectSql: "SELECT strftime('%Y', dt) AS y, COUNT(*) AS c FROM ev GROUP BY y ORDER BY y",
      ignoreOrder: false,
      failMsg: "GROUP BY strftime year.",
    },
  ],
  ["learn", "sql-71", "Window ROW_NUMBER", "Analytics", "<h2>Ranking rows</h2><p><code>ROW_NUMBER() OVER (PARTITION BY grp ORDER BY x)</code> assigns 1..n inside each partition.</p>"],
  [
    "practice",
    "sql-72",
    "Practice: top score per team",
    "Analytics",
    "<h2>Task</h2><p>Table <code>sc(team TEXT, pts INT)</code>. Select rows that are the max pts per team (you may use a subquery with GROUP BY).</p>",
    "CREATE TABLE sc(team TEXT, pts INT); INSERT INTO sc VALUES ('a',5),('a',9),('b',3);",
    {
      type: "sqlSelect",
      seed: "CREATE TABLE sc(team TEXT, pts INT); INSERT INTO sc VALUES ('a',5),('a',9),('b',3);",
      expectSql: "SELECT team, pts FROM sc s WHERE pts = (SELECT MAX(pts) FROM sc t WHERE t.team = s.team) ORDER BY team, pts",
      ignoreOrder: false,
      failMsg: "Max pts per team via correlated subquery.",
    },
  ],
  ["learn", "sql-73", "Transactions mental model", "Transactions", "<h2>ACID sketch</h2><p>Transactions bundle writes; on failure, rollback restores consistency. SQLite auto-commits each statement unless you BEGIN.</p>"],
  [
    "practice",
    "sql-74",
    "Practice: sum after filter",
    "Transactions",
    "<h2>Task</h2><p>Sum <code>amt</code> where <code>kind='sale'</code>.</p>",
    "CREATE TABLE t(kind TEXT, amt INT); INSERT INTO t VALUES ('sale',10),('refund',-2),('sale',3);",
    { type: "sqlScalar", seed: "CREATE TABLE t(kind TEXT, amt INT); INSERT INTO t VALUES ('sale',10),('refund',-2),('sale',3);", sql: "SELECT SUM(amt) FROM t WHERE kind = 'sale'", equals: 13, failMsg: "13 total." },
  ],
  ["learn", "sql-75", "PRAGMA quick reference", "SQLite", "<h2>Introspection</h2><p><code>PRAGMA table_info(t)</code> lists columns; <code>PRAGMA foreign_key_list(t)</code> shows FKs — essential when reverse-engineering schemas.</p>"],
  [
    "practice",
    "sql-76",
    "Practice: table_info count",
    "SQLite",
    "<h2>Task</h2><p>How many columns does table <code>x</code> have? (table has two integer columns)</p>",
    "CREATE TABLE x(a INT, b INT);",
    { type: "sqlScalar", seed: "CREATE TABLE x(a INT, b INT);", sql: "SELECT COUNT(*) FROM pragma_table_info('x')", equals: 2, failMsg: "pragma_table_info returns 2 rows." },
  ],
  ["learn", "sql-77", "CTE readability", "Queries", "<h2>WITH clauses</h2><p>Named subqueries in <code>WITH</code> clarify multi-step reports without nested FROM hell.</p>"],
  [
    "practice",
    "sql-78",
    "Practice: CTE double",
    "Queries",
    "<h2>Task</h2><p>Use a CTE named <code>nums</code> that selects 2 as <code>n</code>, then outer select <code>n*2 AS d</code> → one row with <code>d=4</code>.</p>",
    "",
    {
      type: "sqlScalar",
      seed: "",
      sql: "WITH nums AS (SELECT 2 AS n) SELECT n * 2 AS d FROM nums",
      equals: 4,
      failMsg: "CTE nums with n=2, then d=4.",
    },
    "SELECT 1;\n",
  ],
  ["learn", "sql-79", "Anti-join pattern", "Joins", "<h2>NOT EXISTS vs LEFT JOIN ... IS NULL</h2><p>Both find rows without matches; <code>NOT EXISTS</code> is often clearer and behaves well with duplicates.</p>"],
  [
    "practice",
    "sql-80",
    "Practice: no orders customers",
    "Joins",
    "<h2>Task</h2><p>Names of customers with zero orders.</p>",
    "CREATE TABLE c(id INT, name TEXT); CREATE TABLE o(id INT, cid INT); INSERT INTO c VALUES (1,'Zed'),(2,'Yin'); INSERT INTO o VALUES (1,2);",
    {
      type: "sqlSelect",
      seed: "CREATE TABLE c(id INT, name TEXT); CREATE TABLE o(id INT, cid INT); INSERT INTO c VALUES (1,'Zed'),(2,'Yin'); INSERT INTO o VALUES (1,2);",
      expectSql: "SELECT name FROM c WHERE NOT EXISTS (SELECT 1 FROM o WHERE o.cid = c.id) ORDER BY name",
      ignoreOrder: false,
      failMsg: "NOT EXISTS for customers without orders.",
    },
  ],
  ["learn", "sql-81", "Query plan habits", "Performance", "<h2>EXPLAIN QUERY PLAN</h2><p>Read plans for full scans vs index use — verify assumptions after schema changes.</p>"],
];

const sqlLessons = [];
for (const row of sqlNew) {
  if (row[0] === "learn") {
    sqlLessons.push({ unit: row[3], id: row[1], kind: "learn", title: row[2], narrative: row[4] });
  } else {
    sqlLessons.push({
      unit: row[3],
      id: row[1],
      kind: "practice",
      title: row[2],
      narrative: row[4],
      seed: row[5] || "",
      starterSql: row[7] != null ? row[7] : "-- write SQL\n",
      check: row[6],
    });
  }
}

d("sql-57", "<hr class=\"teach-hr\" /><h3>Tip</h3><p>Pair CHECK with sensible types — TEXT dates need validation or ISO format discipline.</p>");
d("sql-61", "<hr class=\"teach-hr\" /><h3>Tip</h3><p>EXISTS often beats IN with subqueries on nullable columns.</p>");
d("sql-67", "<hr class=\"teach-hr\" /><h3>Tip</h3><p>NULLIF(den,0) before division avoids divide-by-zero in expressions.</p>");
d("sql-71", "<hr class=\"teach-hr\" /><h3>Tip</h3><p>For ties, ROW_NUMBER vs RANK vs DENSE_RANK pick different behaviors.</p>");
d("sql-75", "<hr class=\"teach-hr\" /><h3>Tip</h3><p>Automate pragma dumps in migration reviews.</p>");
d("sql-79", "<hr class=\"teach-hr\" /><h3>Tip</h3><p>Prefer NOT EXISTS when the right side can duplicate keys.</p>");

function moveCapstoneToEnd(trackId, lessonId) {
  const t = courses.find((c) => c.id === trackId);
  const i = t.lessons.findIndex((l) => l.id === lessonId);
  if (i >= 0) {
    const [cap] = t.lessons.splice(i, 1);
    t.lessons.push(cap);
  }
}

htmlT.lessons.push(...htmlNew);
courses.find((c) => c.id === "css").lessons.push(...cssNew);
courses.find((c) => c.id === "js").lessons.push(...jsNew);
courses.find((c) => c.id === "py").lessons.push(...pyLessons);
courses.find((c) => c.id === "sql").lessons.push(...sqlLessons);

moveCapstoneToEnd("html", "html-60");
moveCapstoneToEnd("css", "css-60");
moveCapstoneToEnd("js", "js-58");
moveCapstoneToEnd("py", "py-61");
moveCapstoneToEnd("sql", "sql-56");

Object.assign(depth, newDepth);

saveCourses(courses);
saveDepth(depth);

console.log(
  "Done. Counts:",
  courses.map((c) => `${c.id}:${c.lessons.length}`).join(" ")
);
