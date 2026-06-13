/**
 * Long-form procedure / focus text for Kali slow curriculum (emit-kali-slow-curriculum.mjs).
 * Keep paragraphs instructional: what to run, what to expect, why it matters.
 *
 * Maintainer docs: README.md (npm run emit:kali-slow, build:kali, File manifest) and
 * docs/LEARN_HUB_COMPLETE_REFERENCE.html (scripts/ table).
 */

export function apachePhasesPreamble(subdir, exampleUrlPath) {
  return (
    `### Phase 1 — Map the server to the filesystem (15–20 min)\n\n` +
    `1. Run \`systemctl status apache2 --no-pager | head -n 20\`. In your notebook, copy the **Active:** line and note **Main PID**.\n` +
    `2. Run \`sudo apache2ctl -S 2>&1 | head -n 50\`. Find which vhost answers on **:80** and which **DocumentRoot** applies. Write one sentence: “A request to \`http://127.0.0.1${exampleUrlPath}\` should read from ___ on disk.”\n` +
    `3. Open \`/etc/apache2/sites-enabled/000-default.conf\` with \`sudo nano\` or \`sudo less\` (read-only with \`less\`). Locate \`DocumentRoot\` and \`<Directory ...>\` blocks—**do not save changes** until a lab explicitly asks.\n` +
    `4. List the lab folder: \`sudo ls -la /var/www/html/${subdir}/\`. If it is missing, create it: \`sudo mkdir -p /var/www/html/${subdir}\`.\n\n` +
    `### Phase 2 — Edit → save → reload habit (10 min)\n\n` +
    `- Use \`sudo nano /var/www/html/${subdir}/…\` for small edits. After save, **one wrong character** can break CSS or HTML—re-open the file and confirm your last line is intact.\n` +
    `- In the browser, use **hard refresh** (\`Ctrl+F5\`) when styles look “stuck.” Optionally add a **cache-bust** query on \`<link href="…?v=2">\` and explain why that works.\n\n` +
    `### Phase 3 — Core lab work (see focus below)\n\n`
  );
}

export function apachePhasesEpilogue() {
  return (
    `\n\n### Phase 4 — Verify like someone on-call (15–20 min)\n\n` +
    `1. In **Firefox or Chromium on the VM**, open your page. Open **DevTools → Network**, disable cache, reload. Confirm **200** on the document and on each CSS/JS asset you expect.\n` +
    `2. In **Console**, confirm there are **no red errors**. If there are, read the **file name and line**; fix, reload, repeat.\n` +
    `3. From the shell, run \`curl -sS -D- -o /tmp/lh-body.html http://127.0.0.1/\` **against your lab URL path** (adjust the URL). Inspect the **first few response headers** (\`Content-Type\`, \`Content-Length\`).\n` +
    `4. Tail the access log while you click: \`sudo tail -n 20 /var/log/apache2/access.log\`. Match log lines to your requests.\n\n` +
    `### Phase 5 — Lab report (10 min)\n\n` +
    `- Write: objective, files touched, **one mistake** you made and how you proved the fix, and **one security or maintenance thought** (e.g. why \`sudo\` on web root is OK in class but risky in production).\n`
  );
}

/** @param {{ subdir: string, urlPath: string, title: string, focus: string }} p */
export function fullApacheCssLikeProcedure(p) {
  return apachePhasesPreamble(p.subdir, p.urlPath) + p.focus + apachePhasesEpilogue();
}

export function pythonLabProcedure(focusMd) {
  return (
    `### Phase 1 — Isolate Python (15 min)\n\n` +
    `1. \`cd ~/labs/python\` — if the folder is missing, \`mkdir -p ~/labs/python\`.\n` +
    `2. Create or reuse a venv: \`python3 -m venv .venv && source .venv/bin/activate\`. Run \`which python\` and confirm it points inside \`.venv\`.\n` +
    `3. Run \`python -m pip install --upgrade pip\` (note \`python\` vs \`python3\` inside venv).\n\n` +
    `### Phase 2 — Project hygiene (10 min)\n\n` +
    `- Create today’s folder or branch naming pattern (for example \`lab-\` plus the output of \`date +%F\` in bash).\n` +
    `- Open \`README.txt\` in the lab folder listing: objective, commands you expect to run, rollback (delete venv? restore snapshot?).\n\n` +
    `### Phase 3 — Core lab work\n\n` +
    focusMd +
    `\n\n### Phase 4 — Evidence (15 min)\n\n` +
    `- Capture **stdout/stderr** for at least two runs (success + intentional failure path).\n` +
    `- If you added files, \`tree -L 2 ~/labs/python\` or \`ls -la\` in your report.\n\n` +
    `### Phase 5 — Retro (10 min)\n\n` +
    `- What broke if \`PATH\` contained spaces? What broke if you forgot \`source .venv/bin/activate\`?\n`
  );
}

export function sqlLabProcedure(focusMd) {
  return (
    `### Phase 1 — Session + safety (10 min)\n\n` +
    `1. Open **two** terminals: one \`sudo mariadb\` (admin), one normal shell for \`mysqldump\` / editors.\n` +
    `2. Before destructive DDL, run \`SHOW CREATE TABLE …\` or copy schema with \`mysqldump --no-data\` when appropriate.\n\n` +
    `### Phase 2 — Vocabulary (10 min)\n\n` +
    `- Classify each statement you will run as **DDL** (schema), **DML** (data), or **DCL** (permissions).\n` +
    `- Write one sentence on why \`FLUSH PRIVILEGES;\` exists after \`GRANT\`.\n\n` +
    `### Phase 3 — Execute the lab\n\n` +
    focusMd +
    `\n\n### Phase 4 — Integrity checks (15 min)\n\n` +
    `- After inserts, run \`SELECT … COUNT(*)\` sanity queries. Use \`EXPLAIN\` on at least one non-trivial \`SELECT\`.\n` +
    `- If you changed users, log out and verify **least privilege** by connecting as \`analyst\`.\n\n` +
    `### Phase 5 — Diagram + notes (10 min)\n\n` +
    `- Sketch ER diagram on paper; photograph or transcribe key entities and cardinalities.\n`
  );
}

export function secLabProcedure(focusMd) {
  return (
    `### Phase 1 — Ethics + scope (10 min)\n\n` +
    `- Write **scope** in your notebook: “I will only touch 127.0.0.1 / my VM / files I own.” Sign it with the date.\n` +
    `- If a command could touch remote systems, **stop** and re-read the man page SYNOPSIS.\n\n` +
    `### Phase 2 — Evidence discipline (10 min)\n\n` +
    `- Decide filename convention for transcripts (\`~/labs/securityplus/SEC-NN-notes.txt\`).\n` +
    `- For every tool, save **command + first 20 lines of output**.\n\n` +
    `### Phase 3 — Hands-on work\n\n` +
    focusMd +
    `\n\n### Phase 4 — Control mapping (15 min)\n\n` +
    `- For each major action, label it **prevent / detect / respond** in NIST CSF terms (high level).\n\n` +
    `### Phase 5 — Lessons learned (10 min)\n\n` +
    `- What would you automate next time? What would you **never** do on production without CAB approval?\n`
  );
}

export function techLabProcedure(focusMd) {
  return (
    `### Phase 1 — Read the manual first (10 min)\n\n` +
    `- Identify **one** man page relevant to today’s topic; read **NAME**, **SYNOPSIS**, and **DESCRIPTION** first paragraphs.\n\n` +
    `### Phase 2 — Predict outputs (10 min)\n\n` +
    `- Before each command, write your **expected** substring in the output.\n\n` +
    `### Phase 3 — Execute + capture\n\n` +
    focusMd +
    `\n\n### Phase 4 — Correlation (15 min)\n\n` +
    `- Tie at least two observations together (e.g. disk free space vs largest mount; process RSS vs available RAM).\n\n` +
    `### Phase 5 — Runbook snippet (10 min)\n\n` +
    `- Produce **three** bullet “if user reports X, run Y” steps grounded in what you actually ran.\n`
  );
}

export const CSS_LAB_FOCUS = [
  // C-01
  `**External stylesheet architecture**\n\n` +
    `- Create \`/var/www/html/css-lab/index.html\` with a minimal semantic shell (\`<!DOCTYPE html>\`, \`<html lang="en">\`, \`<head>\`, \`<body>\`).\n` +
    `- Add three \`<link rel="stylesheet" href="styles/base.css">\` (and \`layout.css\`, \`theme.css\`) in **dependency order**: variables first, layout second, theme last.\n` +
    `- In \`base.css\`, define \`:root { --fg: …; --bg: …; --space: … }\`. In \`layout.css\`, set \`body { margin:0; font-family:… }\` and a simple container. In \`theme.css\`, add headings and link colors using **only** variables from \`:root\`.\n` +
    `- **Checkpoint:** View page source in the browser and confirm **three** separate network requests for CSS (Network tab).\n`,
  // C-02
  `**Flexbox dashboard**\n\n` +
    `- Create \`flex.html\` with a \`<header>\`, \`<aside>\`, \`<main>\`, and a \`<footer>\`. Wrap main content in a \`<section>\` with **cards** (\`<article>\`).\n` +
    `- On a top-level flex container (e.g. \`body\` or \`.app\`), set \`display:flex; flex-direction:column; min-height:100vh\`. Put **sidebar + main** in a row flex: \`display:flex; flex:1; min-height:0\` on inner wrapper.\n` +
    `- Use \`gap\`, \`flex-wrap\`, and \`min-width\` on cards so the layout **reflows** under ~400px width. Use DevTools **Flexbox overlay** (grid/flex inspector) to see axes.\n` +
    `- **Checkpoint:** At three viewport widths, screenshot or describe which element wraps first and why.\n`,
  // C-03
  `**CSS Grid magazine layout**\n\n` +
    `- Create \`grid.html\` with a \`.magazine\` container: \`display:grid; grid-template-columns: repeat(12, 1fr); gap: …\`.\n` +
    `- Define \`grid-template-areas\` for **at least six regions** (hero, feature, sidebar, quote, footer, etc.) and assign \`grid-column\` / \`grid-row\` or \`grid-area\` to children.\n` +
    `- Add one \`@media (max-width: …)\` breakpoint that **changes** \`grid-template-areas\` (e.g. sidebar drops below).\n` +
    `- **Checkpoint:** Draw your grid on paper with row/column numbers, then compare to DevTools **Layout** pane for grids.\n`,
  // C-04
  `**Fluid typography with clamp()**\n\n` +
    `- In \`type.html\` (or reuse an existing page), set \`html { font-size: clamp(15px, 0.9vw + 12px, 20px); }\` and style \`h1\` with a second \`clamp()\` for \`font-size\`.\n` +
    `- Resize the window slowly: note when **line length** becomes uncomfortable; adjust \`max-width\` on \`article\` in \`ch\` units.\n` +
    `- Document in your notebook **the three numbers** in \`clamp(min, preferred, max)\` and what each controls mathematically.\n` +
    `- **Checkpoint:** At 320px and 1280px width, record computed \`font-size\` from Computed styles.\n`,
  // C-05
  `**Dark mode: prefers-color-scheme + manual override**\n\n` +
    `- Start from \`:root\` light variables. Add \`@media (prefers-color-scheme: dark)\` block that swaps variables.\n` +
    `- Add a **toggle button** that sets a class on \`<html>\` (e.g. \`html.force-light\` / \`html.force-dark\`) with CSS that **wins** over media query using slightly higher specificity or order.\n` +
    `- Persist choice in \`localStorage\` (you will wire minimal JS if needed—**prefer** a tiny inline script only for this lab, or pair with the JS track).\n` +
    `- **Checkpoint:** Toggle while OS theme is dark and light; describe precedence in one paragraph.\n`,
  // C-06
  `**Animation + reduced motion**\n\n` +
    `- Create a **badge** with a subtle pulse (\`@keyframes\`). Keep animation duration long and amplitude small (professional, not flashy).\n` +
    `- Add \`@media (prefers-reduced-motion: reduce)\` that sets \`animation: none\` (or equivalent) for animated elements.\n` +
    `- In Firefox, test **Settings → Accessibility → Reduce motion** (or OS-level setting) and confirm animation stops.\n` +
    `- **Checkpoint:** List who benefits from reduced-motion (vestibular disorders, migraine triggers, etc.) in your report.\n`,
  // C-07
  `**Pure CSS interactivity**\n\n` +
    `- Build an FAQ with \`<details><summary>…</summary>…</details>\`. Style \`summary\` with \`:focus-visible\` outline and hover state.\n` +
    `- Add a **no-JS** hover card using nested rules (border, shadow). Keep contrast AA where possible.\n` +
    `- **Checkpoint:** Tab to each summary; ensure visible focus and logical order.\n`,
  // C-08
  `**Sticky header + stacking**\n\n` +
    `- Create overlapping \`.card\` elements. Intentionally set **wrong** \`z-index\` once, observe occlusion, then fix by creating a deliberate **stacking context** (\`isolation: isolate\` on a parent or \`position: relative; z-index: 0\`).\n` +
    `- Add \`position: sticky; top: 0\` on a header inside a scrollable \`<main>\`—note **which ancestor** must not have \`overflow: hidden\` or sticky breaks.\n` +
    `- **Checkpoint:** In DevTools **3D view** (if available) or Layers panel, describe what changed after the fix.\n`,
  // C-09
  `**Print stylesheet**\n\n` +
    `- Add \`@media print\` rules: hide nav, remove background colors that waste ink, set \`body { color: #000; background: #fff }\`, widen content.\n` +
    `- Use \`break-inside: avoid\` on headings paired with following paragraphs where needed.\n` +
    `- **Checkpoint:** Print to PDF; open PDF and verify page breaks are acceptable.\n`,
  // C-10
  `**BEM-style refactor**\n\n` +
    `- Start from a deliberately messy \`messy.html\` + \`messy.css\` (create them with vague class names like \`box1\`, \`red\`).\n` +
    `- Refactor to **block__element--modifier** style names **without** changing the visual result (pixel-approximate is fine).\n` +
    `- **Checkpoint:** Side-by-side before/after screenshot or description of naming only.\n`,
  // C-11
  `**srcset / sizes with layout CSS**\n\n` +
    `- Pair with prior HTML image assets. In HTML, add \`srcset\` widths and a thoughtful \`sizes\` attribute describing layout breakpoints.\n` +
    `- In CSS, constrain the \`<img>\` with \`max-width:100%; height:auto\` and a subtle \`object-fit\` if cropping applies.\n` +
    `- **Checkpoint:** In Network, show which downloaded width you got at two viewport sizes.\n`,
  // C-12
  `**\`@layer\` cascade experiment**\n\n` +
    `- Declare \`@layer base, utilities;\` then put conflicting rules in different layers—demonstrate that **layer order** beats source order.\n` +
    `- Add one unlayered rule and explain how it interacts (spec reading: unlayered vs layered).\n` +
    `- **Checkpoint:** In DevTools Styles, show which layer name appears next to the winning rule.\n`,
];

export const JS_LAB_FOCUS = [
  `**ES modules under Apache**\n\n` +
    `- Create \`/var/www/html/js-lab/index.html\` with \`<script type="module" src="./app.js"></script>\` (note \`type="module"\`).\n` +
    `- In \`app.js\`, \`import { helper } from './utils.js'\` and call it. In \`utils.js\`, \`export function helper(){…}\`.\n` +
    `- Open DevTools **Network**: confirm \`app.js\` loads with MIME type **JavaScript** and that **utils.js** is a second request.\n` +
    `- **Checkpoint:** Change a string in \`utils.js\`, hard refresh, confirm the change—explain **caching** if it does not appear.\n`,
  `**Event delegation**\n\n` +
    `- Build a small table of “tickets.” Add **one** click listener on \`<tbody>\` (or the table) and use \`event.target.closest('button')\` to detect which row’s button fired.\n` +
    `- Add a row dynamically with \`insertRow\` and confirm **no new listeners** were required.\n` +
    `- **Checkpoint:** Explain memory and maintenance benefits in 3–5 sentences.\n`,
  `**Constraint Validation API**\n\n` +
    `- Build a form with \`required\`, \`pattern\`, and \`type="email"\`. On \`submit\`, call \`reportValidity()\` and use \`setCustomValidity\` for cross-field rules (e.g. password confirmation).\n` +
    `- Style \`:invalid\` / \`:user-invalid\` carefully so errors are visible but not screaming.\n` +
    `- **Checkpoint:** Show both a passing and failing submit in screenshots or console logs.\n`,
  `**fetch + JSON**\n\n` +
    `- Use \`fetch('https://jsonplaceholder.typicode.com/posts?_limit=6')\` (read-only). Parse JSON, render cards in the DOM.\n` +
    `- Simulate failure: temporarily break the URL and show a **friendly** in-page error with retry button.\n` +
    `- **Checkpoint:** Capture Network tab for success vs failure.\n`,
  `**async/await, Promise.all, AbortController**\n\n` +
    `- Fetch two endpoints in parallel with \`Promise.all\`. Wrap in \`try/catch\`.\n` +
    `- Implement a **timeout** using \`AbortController\` + \`setTimeout\` that aborts the request and surfaces “took too long.”\n` +
    `- **Checkpoint:** Paste the \`finally\` block you used to clear timers.\n`,
  `**localStorage flashcards**\n\n` +
    `- Model cards as an array of objects \`{ front, back, id }\`. Serialize with \`JSON.stringify\`.\n` +
    `- Implement add, edit, delete, and **Export JSON** / **Import JSON** (with \`try/catch\` on parse).\n` +
    `- **Checkpoint:** Show your exported JSON file snippet in the report.\n`,
  `**Hash router**\n\n` +
    `- Listen to \`hashchange\` and \`load\`. Parse \`location.hash\` (e.g. \`#/about\`) and swap sections with \`hidden\` or class toggles.\n` +
    `- Ensure **back/forward** updates the visible section without full reload.\n` +
    `- **Checkpoint:** List two limitations of hash routing vs History API.\n`,
  `**Web Crypto SHA-256 demo**\n\n` +
    `- Take user text, encode as \`TextEncoder\`, digest with \`crypto.subtle.digest('SHA-256', …)\`, convert ArrayBuffer to **hex**.\n` +
    `- **Never** present this as password storage—write a paragraph on why salted KDFs (Argon2/bcrypt) are required offline.\n` +
    `- **Checkpoint:** Hash the string \`test\` and compare to a known vector from docs or \`openssl dgst -sha256\`.\n`,
  `**Debounced search**\n\n` +
    `- Generate ~500 rows in memory. On \`input\`, debounce (e.g. 200ms) filtering.\n` +
    `- Log **how many** filter passes ran vs keystrokes to prove debounce works.\n` +
    `- **Checkpoint:** Describe Big-O of naive filter vs indexed approach (conceptual).\n`,
  `**Tests: Vitest/Jest or console harness**\n\n` +
    `- If Node is available, add one tiny \`*.test.js\` for a pure function. Otherwise, write \`console.assert\` checks in a \`tests.html\` page.\n` +
    `- **Checkpoint:** Paste green output or explain one failing assertion you fixed.\n`,
  `**Web Worker**\n\n` +
    `- Offload a silly CPU loop (sum 1..5e7) to \`worker.js\`; postMessage the result. Keep UI responsive (spinner or status text).\n` +
    `- **Checkpoint:** Compare time with worker vs blocking main thread (warn user briefly if blocking).\n`,
  `**Progressive enhancement**\n\n` +
    `- Build a sortable table: **without JS**, the table reads fine. With JS, add header click handlers that sort rows.\n` +
    `- Ensure sort **announces** visually which column is active (aria-sort optional stretch).\n` +
    `- **Checkpoint:** Disable JS in devtools and confirm table still usable.\n`,
];

export const PY_LAB_FOCUS = [
  `**venv + pip + requests**\n\n` +
    `1. \`cd ~/labs/python && python3 -m venv .venv && source .venv/bin/activate\` — confirm prompt shows \`(.venv)\`.\n` +
    `2. \`python -m pip install --upgrade pip\` then \`pip install requests\`.\n` +
    `3. Create \`hello_requests.py\` that GETs a **public** JSON endpoint (e.g. ipify) and prints **only** non-sensitive fields.\n` +
    `4. Run \`python -I hello_requests.py\` once to see isolated flags (\`-I\` ignores env—optional exploration).\n` +
    `- **Checkpoint:** \`pip freeze | head\` in your notes.\n`,
  `**argparse log filter**\n\n` +
    `- Scaffold \`logfmt.py\` with subcommands or flags: input path, regex pattern, optional \`--invert-match\`.\n` +
    `- Read file line-by-line (generator) instead of slurping whole file—explain memory benefit.\n` +
    `- **Checkpoint:** Run against a 10k-line synthetic log you create with a loop in shell.\n`,
  `**CSV → JSON with types**\n\n` +
    `- Create \`inventory.csv\` with a numeric column. Parse with \`csv.DictReader\`.\n` +
    `- Coerce integers safely (\`try/except ValueError\` per row); collect bad rows in a list and print a summary at end.\n` +
    `- **Checkpoint:** Output \`inventory.json\` pretty-printed.\n`,
  `**pathlib rename dry-run**\n\n` +
    `- Write \`rename_media.py\` using \`Path.glob\`. Default \`--dry-run\` prints planned renames; \`--apply\` performs them.\n` +
    `- Use \`Path.rename\` and catch \`OSError\`—log failures without crashing whole batch.\n` +
    `- **Checkpoint:** Show dry-run vs apply diff in your report.\n`,
  `**http.server vs Apache**\n\n` +
    `- Run \`python3 -m http.server 8765 --bind 127.0.0.1 --directory /var/www/html\` in one terminal.\n` +
    `- \`curl -I http://127.0.0.1:8765/\` vs \`curl -I http://127.0.0.1:80/\`. Compare **Server** and **headers**.\n` +
    `- **Checkpoint:** Explain one capability Apache gives that stdlib server does not (vhosts, TLS termination, etc.).\n`,
  `**TCP echo on loopback**\n\n` +
    `- Implement \`echo_server.py\` binding \`127.0.0.1:9090\` and \`echo_client.py\` sending one line.\n` +
    `- Use \`with conn:\` context managers; close sockets explicitly in \`finally\` if not using contexts.\n` +
    `- **Checkpoint:** Show \`ss -lntp | grep 9090\` while server runs.\n`,
  `**subprocess without shell=True**\n\n` +
    `- Call \`ping -c 1 127.0.0.1\` with argument list form. Capture \`stdout\`, \`stderr\`, \`returncode\`.\n` +
    `- Demonstrate **why** \`shell=True\` is dangerous with a user-controlled string (theory only—do not execute untrusted input).\n` +
    `- **Checkpoint:** Map return code 0 vs non-zero to success/failure in your code.\n`,
  `**Apache log counter**\n\n` +
    `- Generate synthetic \`access.log\` lines with \`for i in {1..200}; do echo "… $((i%5)) …"; done > ~/labs/python/fake.log\`.\n` +
    `- Parse and count HTTP status “codes” you embedded; output histogram dict sorted by count.\n` +
    `- **Checkpoint:** Compare your counts to \`grep -c\` sanity checks.\n`,
  `**dataclass validation**\n\n` +
    `- Define \`@dataclass\` User with fields. Write \`User.from_dict(d)\` that rejects unknown keys and missing required keys with clear exceptions.\n` +
    `- **Checkpoint:** Show one rejected dict example in notes.\n`,
  `**pytest five tests**\n\n` +
    `- Add \`tests/test_csv_tool.py\` with five tests covering happy path, bad int row, empty file, etc.\n` +
    `- Run \`pytest -q\`; paste summary line.\n` +
    `- **Checkpoint:** Explain fixture vs plain function setup.\n`,
  `**hash duplicate finder**\n\n` +
    `- Walk \`~/labs/python/tree\` (create nested duplicate files). Hash with \`hashlib.sha256\` in binary mode.\n` +
    `- Print groups of paths sharing a digest.\n` +
    `- **Checkpoint:** Note collision probability argument (SHA-256) in one sentence.\n`,
  `**requests + exponential backoff**\n\n` +
    `- Write a tiny Flask app on 127.0.0.1 that randomly returns 500 (or use a stub). Client retries with **backoff + jitter**.\n` +
    `- Cap max retries; log each attempt with timestamp.\n` +
    `- **Checkpoint:** Plot or list attempt timings in your notebook.\n`,
];

export const SQL_LAB_FOCUS = [
  `**S-01 — Database + role (DDL walkthrough)**\n\n` +
    `Run in \`sudo mariadb\` (paste one statement at a time, read responses):\n\n` +
    `\`\`\`sql\nCREATE DATABASE IF NOT EXISTS soc_training;\nCREATE USER IF NOT EXISTS 'analyst'@'localhost' IDENTIFIED BY 'replace-with-strong-password';\nGRANT SELECT, INSERT, UPDATE ON soc_training.* TO 'analyst'@'localhost';\nFLUSH PRIVILEGES;\n\`\`\`\n\n` +
    `Then **exit** root session and test: \`mariadb -u analyst -p soc_training -e "SELECT DATABASE();"\`.\n` +
    `- **Explain:** what \`GRANT … ON db.*\` means vs table-level grants.\n`,
  `**S-02 — assets + incidents tables**\n\n` +
    `\`\`\`sql\nUSE soc_training;\nCREATE TABLE assets (\n  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,\n  hostname VARCHAR(128) NOT NULL,\n  ip VARCHAR(45) NOT NULL,\n  owner VARCHAR(128) NOT NULL\n);\nCREATE TABLE incidents (\n  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,\n  title VARCHAR(255) NOT NULL,\n  opened_at DATETIME NOT NULL,\n  severity ENUM('low','med','high','crit') NOT NULL\n);\n\`\`\`\n\n` +
    `Insert **≥10** realistic rows (\`INSERT … VALUES\` multi-row is fine). Run \`SELECT COUNT(*) FROM assets;\`.\n`,
  `**S-03 — Foreign keys + cascades**\n\n` +
    `Create \`incident_findings\` with FK to \`incidents\` and \`assets\`. Test **ON DELETE RESTRICT** by trying to delete an incident that still has findings—note error code.\n` +
    `Then test **ON UPDATE CASCADE** on a child column if you modeled one (or document why not).\n`,
  `**S-04 — Join practice**\n\n` +
    `Write queries (save in \`~/labs/sql/joins.sql\`) for:\n` +
    `1) assets touched by >1 incident; 2) open incidents with zero findings. Use **both** inner join and left join styles where possible.\n` +
    `\`EXPLAIN\` one heavy join before/after you add data.\n`,
  `**S-05 — Aggregation + HAVING**\n\n` +
    `Compute average **hours between** incidents grouped by \`severity\` (use \`TIMESTAMPDIFF\` or precomputed durations in a column you add).\n` +
    `Use \`HAVING\` to filter groups with count ≥ 3.\n`,
  `**S-06 — Transactions**\n\n` +
    `\`\`\`sql\nSTART TRANSACTION;\nINSERT INTO incidents (…) VALUES (…);\nINSERT INTO incident_findings (…) VALUES (…); -- second stmt violates FK on purpose\nROLLBACK;\n\`\`\`\n\n` +
    `Repeat with a valid pair and \`COMMIT;\`. Show \`SELECT\` proof rows appear only after commit.\n`,
  `**S-07 — Index + EXPLAIN**\n\n` +
    `Pick a slow query on \`(severity, opened_at)\`. Show \`EXPLAIN\` before index; \`CREATE INDEX idx_sev_opened ON incidents (severity, opened_at);\`; show \`EXPLAIN\` after.\n` +
    `Describe **rows** / **type** changes in prose.\n`,
  `**S-08 — View + analyst user**\n\n` +
    `\`CREATE VIEW open_incidents AS SELECT …\`. Grant **only** \`SELECT\` on the view to \`analyst\` (revoke base table perms if you granted them earlier—plan this carefully in notes).\n` +
    `Login as analyst and confirm \`SELECT * FROM open_incidents;\` works while raw tables may not.\n`,
  `**S-09 — Stored procedure**\n\n` +
    `\`DELIMITER //\` style procedure \`close_incident(IN p_id INT)\` that checks status, sets \`closed_at\`, and signals error on invalid transition.\n` +
    `Call with \`CALL close_incident(1);\` and show before/after row.\n`,
  `**S-10 — Audit trigger**\n\n` +
    `Create \`audit_log\` table. \`AFTER UPDATE\` on \`incidents\` inserts old/new severity with \`NOW()\`.\n` +
    `Fire an update and \`SELECT * FROM audit_log ORDER BY id DESC LIMIT 5;\`.\n`,
  `**S-11 — mysqldump restore**\n\n` +
    `Shell: \`mysqldump soc_training > /tmp/soc.sql\` then create \`soc_training_restore\` and import.\n` +
    `Verify row counts match with \`CHECKSUM TABLE\` or \`COUNT(*)\` per table.\n`,
  `**S-12 — Python parameterized inserts**\n\n` +
    `Install \`PyMySQL\` in venv. Script inserts a row using **tuple parameters**—show the query string uses \`%s\` placeholders only.\n` +
    `Demonstrate that string concatenation with user input would be unsafe (theory + tiny safe example).\n`,
];

export const SEC_LAB_FOCUS = [
  `**STRIDE table for \`/var/www/html/site\`**\n\n` +
    `Build a six-row table (S,T,R,I,D,E) with **one realistic threat** and **one mitigation** each tied to your actual files (forms, static assets, nav links).\n` +
    `Reference OWASP or NIST language loosely—accuracy over buzzwords.\n`,
  `**Hash identification (safe)**\n\n` +
    `Use \`hashid\` (if installed) or a short Python script to **identify** algorithm family from sample strings your instructor provides.\n` +
    `Write why **rainbow tables** matter for unsalted MD5 but not for modern password hashes.\n`,
  `**OpenSSL symmetric encrypt/decrypt**\n\n` +
    `Create \`/tmp/secret.txt\`. Encrypt with \`openssl enc -aes-256-gcm\` (read \`man enc\` for Kali’s supported syntax).\n` +
    `Decrypt to a new file; \`cmp\` or \`sha256sum\` both files. Document **where the key lived** and why stdin keys are risky.\n`,
  `**openssl s_client**\n\n` +
    `\`openssl s_client -connect example.com:443 -servername example.com -brief\` — capture cipher, protocol version, certificate subject.\n` +
    `Map one line of output to “certificate transparency” or chain of trust in your notes.\n`,
  `**Host firewall**\n\n` +
    `Choose \`ufw\` **or** \`nftables\`. Default deny, allow **22/tcp** and **80/tcp** only from your lab subnet or host IP.\n` +
    `\`nmap\` from host before/after; paste diff.\n`,
  `**SSH log review**\n\n` +
    `\`sudo journalctl -u ssh -n 80 --no-pager\` or \`/var/log/auth.log\` — circle **preauth** vs **accepted** lines.\n` +
    `Write a one-page “incident note” as if you triaged automated scans.\n`,
  `**chmod / umask / ACL demo**\n\n` +
    `Create dirs under \`/tmp/lhperm\`. Show \`umask\` effect on new files. Fix a deliberate \`chmod 777\` using sane modes.\n` +
    `Optional: \`setfacl -m u:analyst:r-- file\` and \`getfacl\`.\n`,
  `**Apache hardening checklist**\n\n` +
    `Turn **Indexes** off for a test directory, add **ServerTokens Prod** (if module available), hide version banner where possible.\n` +
    `Each change: **backup file**, \`apache2ctl configtest\`, \`systemctl reload apache2\`.\n`,
  `**Wireshark TCP stream**\n\n` +
    `Capture loopback while \`curl http://127.0.0.1/\`. Follow **TCP stream**; highlight request line + Host header.\n` +
    `Explain when TLS would change what you see.\n`,
  `**Passive DNS**\n\n` +
    `\`dig +trace\` vs recursive query. Compare answers from \`8.8.8.8\` vs your local resolver if safe.\n` +
    `Document **ethical** use—no hammering authoritative servers.\n`,
  `**Pinning discussion + curl**\n\n` +
    `Essay (300–500 words): mobile vs browser pinning tradeoffs. If feasible, demo \`curl --pinnedpubkey\` against a host; otherwise dry-run with docs.\n`,
  `**IR tabletop + IOC MariaDB table**\n\n` +
    `Write phishing timeline. Create \`iocs\` table (type, value, first_seen, source). Insert three IOC rows.\n` +
    `Link (conceptually) to incidents table if you already built it.\n`,
  `**Baseline outline**\n\n` +
    `Numbered list (20+ steps) for imaging a fresh Kali: users, sudo, updates, services to disable, auditd/syslog, backup.\n` +
    `Map each group to CIS or STIG **functions** at high level.\n`,
  `**Log aggregation sketch**\n\n` +
    `Draw (ASCII) rsyslog forwarding to a collector VM. List **three correlation keys** (timestamp, host, session id).\n` +
    `Optional: \`logger\` test message and show it in \`journalctl\`.\n`,
];

export const TECH_LAB_FOCUS = [
  `**find / locate / tree**\n\n` +
    `\`man find\` first: run five different predicates (\`-name\`, \`-path\`, \`-mtime\`, \`-size\`, \`-perm\`).\n` +
    `\`sudo updatedb\` then \`locate passwd\` (read-only). \`tree -L 2 /etc/systemd\`.\n` +
    `Notebook: when **find** vs **locate** is appropriate.\n`,
  `**apt workflow**\n\n` +
    `\`apt-cache policy apache2\`, \`apt show apache2 | sed -n '1,25p'\`. Install then remove a harmless package (\`sl\` or similar).\n` +
    `Read \`/var/log/apt/history.log\` excerpt after.\n`,
  `**Users and groups**\n\n` +
    `\`sudo adduser techlab\` (interactive). \`sudo usermod -aG sudo techlab\` **or** a custom group—justify choice.\n` +
    `Compare \`su -\` vs \`sudo -i\` in your notes (environment, audit trail).\n`,
  `**df / lsblk / free**\n\n` +
    `Correlate \`df -hT\` mount points with \`lsblk -f\` **FSTYPE**.\n` +
    `Run \`stress-ng --vm 1 --timeout 5s\` if installed—or open several tabs—watch \`free -h\` sampling.\n`,
  `**jobs / fg / bg / kill**\n\n` +
    `Start \`sleep 300 &\`, list \`jobs\`, bring to foreground, suspend with \`Ctrl+Z\`, \`bg\`, then \`kill %1\`.\n` +
    `Demonstrate \`nice\` / \`renice\` on a CPU loop script.\n`,
  `**ip route / ip neigh**\n\n` +
    `\`ip -br link\` then \`ip -4 addr\`. Draw default gateway, interface, and your VM’s IP.\n` +
    `\`ip neigh show\` — explain stale vs reachable.\n`,
  `**resolv.conf / DHCP**\n\n` +
    `Cat \`/etc/resolv.conf\`. Identify whether **systemd-resolved** stub is in use (\`resolvectl status\`).\n` +
    `Renew lease (method depends on hypervisor); capture before/after \`ip -4 addr\` if it changes.\n`,
  `**SSH keys**\n\n` +
    `\`ssh-keygen -t ed25519 -f ~/.ssh/lh_lab -N ""\` then configure \`~/.ssh/config\` **Host** alias.\n` +
    `**Do not** disable password auth on a shared machine—only describe the steps for an isolated lab with snapshot.\n`,
  `**cron**\n\n` +
    `\`crontab -e\` entry: append timestamp every 5 minutes to \`~/labs/techplus/cron.log\`.\n` +
    `\`grep CRON /var/log/syslog\` or \`journalctl -u cron\` lines.\n`,
  `**systemd user or system unit**\n\n` +
    `Create a **oneshot** or simple service running \`python3 -m http.server 9999 --bind 127.0.0.1\`.\n` +
    `\`systemctl --user daemon-reload\` if user unit; else system unit with \`sudo\`. Enable, start, status, stop.\n`,
  `**Runbook: Apache won’t start**\n\n` +
    `Write ordered checks: \`systemctl status\`, \`journalctl -u apache2 -n 50\`, \`apache2ctl configtest\`, \`ss -lntp | grep :80\`.\n` +
    `Include **one** fictional symptom + resolution.\n`,
  `**tar vs rsync backup**\n\n` +
    `Time \`tar czf\` of \`~/labs\` vs \`rsync -a\` to \`/tmp/lh-backup\`.\n` +
    `Document restore commands for both.\n`,
  `**ab / hey baseline**\n\n` +
    `If \`ab\` exists: \`ab -n 200 -c 10 http://127.0.0.1/\`. Capture RPS and failed requests.\n` +
    `Relate results to VM CPU count (\`nproc\`).\n`,
  `**Hypervisor NIC modes**\n\n` +
    `Diagram NAT vs bridged vs host-only for your setup. Which IP does the host use to reach the VM web server?\n` +
    `List one troubleshooting step if host cannot ping VM gateway.\n`,
];

/** Main URL or path to correlate with Apache logs and curl checks (H-02 … H-12). */
export const HTML_LAB_URLPATHS = [
  "/semantic.html",
  "/form.html",
  "/timeline.html",
  "/media.html",
  "/event.html",
  "/a11y.html",
  "/site/index.html",
  "/this-url-should-404-lab-test",
  "/",
  "/robots.txt",
  "/index-fr.html",
];

/** Folder under `/var/www/html/` to inspect in Phase 1 (`"."` = web root). */
export const HTML_LAB_SUBDIRS = [".", ".", ".", ".", ".", ".", "site", ".", ".", ".", "."];

export const HTML_H01_FOCUS =
  `**Publish one page and prove the full path**\n\n` +
  `1. Re-open what **DocumentRoot** means: Apache maps a URL path to a directory on disk. For \`/\`, the server looks for \`index.html\` (or another DirectoryIndex) under that root.\n` +
  `2. Run the long \`echo '…html…' | sudo tee /var/www/html/index.html\` pipeline from the **Commands explained** section. Before Enter, trace data: \`echo\` writes to **stdout** → **pipe** → \`tee\` reads stdin, prints to your terminal **and** writes the file. \`sudo\` only elevates \`tee\`, not the string generation.\n` +
  `3. \`ls -l /var/www/html/index.html\` — note owner (often \`root\`), group (\`www-data\` on Debian), mode (\`644\`). Explain why Apache (running as \`www-data\`) can still **read** the file.\n` +
  `4. On the VM: \`curl -sS http://127.0.0.1/ | head -n 20\`. The \`-sS\` combo hides progress but still surfaces errors.\n` +
  `5. \`ip -br a\` — pick the address your **host** browser should use (NAT vs bridged). Open \`http://<that-ip>/\` on the host.\n` +
  `6. **Stretch:** edit the same file with \`sudo nano\` and add \`<meta name="viewport" content="width=device-width, initial-scale=1">\`. Reload; in devtools toggle device toolbar and describe what changed visually.\n` +
  `- **Checkpoint:** In one sentence: which **absolute path** on disk produced the bytes you saw in the browser?\n`;

export const HTML_LAB_FOCUS = [
  `**H-02 — Semantic skeleton**\n\n` +
    `1. On paper, label **header**, **nav**, **main** (with one **article** + one **aside**), **footer**. Draw arrows for tab order you want.\n` +
    `2. \`sudo nano /var/www/html/semantic.html\` — implement with a single \`h1\` and logical \`h2\`/\`h3\`. Avoid \`<div id="header">\` when a native element exists.\n` +
    `3. \`sudo apt install -y tidy\` then \`tidy -e /var/www/html/semantic.html\`. Fix **every error**; for each warning, decide “fix now” or “document why ignored.”\n` +
    `4. Load \`http://127.0.0.1/semantic.html\` → **View Page Source** — confirm reading order matches your sketch.\n` +
    `- **Checkpoint:** Name two assistive technologies or browser features that benefit from \`<main>\` vs a generic wrapper.\n`,
  `**H-03 — Forms GET vs POST**\n\n` +
    `1. Create \`/var/www/html/form.html\` served over \`http://\` (not \`file://\`) so DevTools Network behaves like a real site.\n` +
    `2. Build a form: \`method="get"\`, \`action="https://httpbin.org/get"\`, fields: text, email, number, checkbox. Submit and **read the address bar** — map each \`name=\` to its value.\n` +
    `3. Switch to \`method="post"\` and \`action="https://httpbin.org/post"\`. Submit again. Open **Network** → select request → compare **Query String** vs **Request payload**.\n` +
    `4. In your notebook: one paragraph on why passwords must **never** use GET; mention logs, proxies, and Referer leakage at a high level.\n` +
    `- **Checkpoint:** Paste one GET URL and describe which parts are client-controlled vs server-controlled.\n`,
  `**H-04 — Incident timeline table**\n\n` +
    `1. Invent **≥4** fictional IR events with timestamps, source system, owner.\n` +
    `2. Build \`/var/www/html/timeline.html\` with \`<caption>\`, \`<thead>\`, \`<tbody>\`, and \`scope="col"\` on column headers.\n` +
    `3. Use \`<time datetime="…">\` in at least one cell with a human-readable label inside the tag.\n` +
    `4. Optional tiny \`<style>\`: zebra rows, monospace timestamps — preview of the CSS track.\n` +
    `- **Checkpoint:** Explain how \`scope\` helps a screen reader associate \`<th>\` with body cells.\n`,
  `**H-05 — Responsive images**\n\n` +
    `1. \`sudo mkdir -p /var/www/html/assets\` and download or copy **two** JPEGs (different aspect ratios or widths).\n` +
    `2. Build \`/var/www/html/media.html\` with \`<figure>\`, \`<figcaption>\`, and \`<picture>\` containing multiple \`<source>\` plus fallback \`<img alt="…">\`.\n` +
    `3. Write \`alt\` text that describes **purpose** (why the image exists), not the filename.\n` +
    `4. Resize the browser; in Network note which asset bytes were transferred at narrow vs wide widths.\n` +
    `- **Checkpoint:** When is \`alt=""\` acceptable? Write your answer with an example from this page or “none on this page.”\n`,
  `**H-06 — JSON-LD event**\n\n` +
    `1. Human-visible block: training event title, date, location paragraph.\n` +
    `2. Add \`<script type="application/ld+json">\` with valid JSON: \`@context\`, \`@type\`, \`name\`, \`startDate\`, \`location\`.\n` +
    `3. Copy the JSON to a temp file and run \`python3 -m json.tool < file\` — fix until it parses.\n` +
    `4. If the VM is reachable from the host, try Google Rich Results Test on the URL; otherwise paste HTML into the tool.\n` +
    `- **Checkpoint:** What breaks silently if you leave a trailing comma in JSON?\n`,
  `**H-07 — Accessibility audit**\n\n` +
    `1. Build \`/var/www/html/a11y.html\`: real \`<button>\` (not \`<div onclick>\`), labeled file input, several links, one disclosure pattern.\n` +
    `2. **Unplug the mouse** — Tab / Shift+Tab through everything; fix focus traps and invisible focus.\n` +
    `3. Add \`:focus-visible\` styles in a \`<style>\` block so keyboard users see where they are.\n` +
    `4. \`sudo apt install -y lynx\` → \`lynx http://127.0.0.1/a11y.html\` — confirm linear reading order.\n` +
    `- **Checkpoint:** List one issue Lynx exposed that your graphical browser hid.\n`,
  `**H-08 — Multi-page site**\n\n` +
    `1. \`sudo mkdir -p /var/www/html/site\` — add \`index.html\` and \`about.html\`.\n` +
    `2. Use **relative** links (\`href="about.html"\`) so the folder is portable.\n` +
    `3. Duplicate a shared nav block by hand first; note the maintenance pain for your report.\n` +
    `4. Optional: research \`mod_include\` + SSI — **snapshot + backup configs** before enabling.\n` +
    `- **Checkpoint:** Why can absolute paths like \`/missing/\` break when you move the site folder?\n`,
  `**H-09 — Custom 404**\n\n` +
    `1. Create \`/var/www/html/404.html\` with a calm message and link home.\n` +
    `2. \`sudo cp /etc/apache2/sites-available/000-default.conf /etc/apache2/sites-available/lab-html.conf\` — edit a **copy**, keep the original as reference.\n` +
    `3. Add \`ErrorDocument 404 /404.html\` inside the correct \`VirtualHost\`. Run \`sudo apache2ctl configtest\` before any reload.\n` +
    `4. \`sudo apache2ctl -S\` — resolve duplicate vhost/port conflicts **in writing** before \`systemctl reload apache2\`.\n` +
    `5. Request a URL that does not exist; confirm status **404** and your HTML body.\n` +
    `- **Checkpoint:** Difference between \`reload\` and \`restart\` for Apache in one sentence.\n`,
  `**H-10 — Response headers**\n\n` +
    `1. \`sudo a2enmod headers\` then \`sudo systemctl reload apache2\`.\n` +
    `2. Add \`Header set X-Lab-Author "YourName"\` in the appropriate scope (server or directory block).\n` +
    `3. \`curl -I http://127.0.0.1/\` — find your header line and \`Server:\` line.\n` +
    `4. Read MDN **Content-Security-Policy** overview (concept only) — note how headers shift security left compared to only fixing HTML.\n` +
    `- **Checkpoint:** Why is \`curl -I\` faster than downloading the full body when iterating configs?\n`,
  `**H-11 — robots.txt + sitemap**\n\n` +
    `1. \`sudo mkdir -p /var/www/html/private\` (empty placeholder).\n` +
    `2. \`/var/www/html/robots.txt\`: \`User-agent: *\`, \`Disallow: /private/\`, allow rest; add \`Sitemap:\` line with full URL to your \`sitemap.xml\`.\n` +
    `3. \`sitemap.xml\`: list your lab URLs with \`<loc>\` — validate with \`xmllint\` if installed.\n` +
    `4. \`curl -s http://127.0.0.1/robots.txt\` and verify.\n` +
    `- **Checkpoint:** Why must secrets never rely on \`robots.txt\` alone?\n`,
  `**H-12 — Internationalization**\n\n` +
    `1. Copy a small English page to \`/var/www/html/index-fr.html\` with \`<html lang="fr">\`.\n` +
    `2. Translate headings and nav honestly (dictionary ok). Keep parallel structure so CSS can be shared later.\n` +
    `3. Add a \`<nav>\` language switcher linking EN ↔ FR.\n` +
    `4. In devtools Accessibility tree, inspect how \`lang\` is exposed.\n` +
    `- **Checkpoint:** One sentence on \`hreflang\` for multi-domain SEO (research, no implementation required).\n`,
];
