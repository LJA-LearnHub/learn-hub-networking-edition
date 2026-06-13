/**
 * Generates docs/KALI_HANDS_ON_LAB_CURRICULUM.md with one <!-- id: ... --> block per
 * Learn-Hub lesson (slow pace: background + command explanations + verification).
 *
 * Run: node scripts/emit-kali-slow-curriculum.mjs
 * Then: npm run build:kali
 *
 * After the first generation, you may edit the Markdown directly; re-run this
 * script only when you want to regenerate from the embedded tables below.
 *
 * Long-form phased **Procedure** bodies live in `kali-lab-rich-procedures.mjs`
 * (imported here): Apache phases, per-track focus arrays, Python/SQL/Security/Tech wrappers.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  fullApacheCssLikeProcedure,
  pythonLabProcedure,
  sqlLabProcedure,
  secLabProcedure,
  techLabProcedure,
  CSS_LAB_FOCUS,
  JS_LAB_FOCUS,
  PY_LAB_FOCUS,
  SQL_LAB_FOCUS,
  SEC_LAB_FOCUS,
  TECH_LAB_FOCUS,
  HTML_H01_FOCUS,
  HTML_LAB_FOCUS,
  HTML_LAB_URLPATHS,
  HTML_LAB_SUBDIRS,
} from "./kali-lab-rich-procedures.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const outPath = path.join(root, "docs", "KALI_HANDS_ON_LAB_CURRICULUM.md");

function esc(s) {
  return String(s).replace(/\r\n/g, "\n");
}

function cmdBlock(cmd, what, why) {
  return (
    `**Command:**\n\n\`\`\`bash\n${cmd}\n\`\`\`\n\n` +
    `- **What it does:** ${what}\n` +
    `- **Why we use it here:** ${why}\n`
  );
}

function lessonHeader(id, unit) {
  return `<!-- id: ${id} -->\n<!-- unit: ${unit} -->\n\n`;
}

function slowLesson({ id, unit, code, title, goal, pace, outcomes, why, background, commands, procedure, verify, pitfalls, further }) {
  let s = lessonHeader(id, unit);
  s += `### Lab ${code} — ${title}\n\n`;
  s += `**Suggested pace:** ${pace}\n\n`;
  s += `**Goal:** ${goal}\n\n`;
  if (outcomes) s += `**Outcomes:** ${outcomes}\n\n`;
  s += `#### Why this lab exists\n\n${why}\n\n`;
  s += `#### Background\n\n${background}\n\n`;
  if (commands && commands.length) {
    s += `#### Commands explained (read before you type)\n\n`;
    for (const c of commands) s += cmdBlock(c.cmd, c.what, c.why) + "\n";
  }
  s += `#### Procedure (go slowly)\n\n${procedure}\n\n`;
  s += `#### Verify\n\n${verify}\n\n`;
  if (pitfalls) s += `#### Common mistakes\n\n${pitfalls}\n\n`;
  if (further) s += `#### Going further\n\n${further}\n\n`;
  s += `---\n\n`;
  return s;
}

const INTRO = `<!-- id: labs-kali-intro -->
<!-- unit: Start — how to use this curriculum -->

# Kali Linux Hands-On Lab Curriculum

**Audience:** Learners who want **deep**, practical experience across web fundamentals, scripting, databases, and certification-aligned security topics.

**Pedagogy (read once):** This path is intentionally **slow**. Each sidebar lesson is **one lab** (or one setup chapter). Do **not** rush. For each lab: read the **Background** and **Commands explained** sections *before* typing anything. Expect **45–120+ minutes** per lab depending on depth—some may spill across two sessions. Keep a **lab notebook** (what you ran, what happened, what confused you, what you verified).

**Environment:** Every lab assumes a **Kali Linux virtual machine** (VMware, VirtualBox, or Hyper-V). Take a **VM snapshot** before labs that change services, firewalls, or SSH—especially in the Security+ section.

**Conventions:**

- \`$\` in prose means “normal user shell”; use \`sudo\` only when the lab says to.
- Replace placeholders (\`yourname\`, IPs, hostnames) with your own values.
- After each lab, write a short **lab report**: objective, commands run (or key outputs), verification evidence, one **“what I’d automate next time”** note.

---

`;

const SETUP = `<!-- id: labs-kali-setup -->
<!-- unit: Start — prepare your VM once -->

## Global setup (do once per VM)

**Suggested pace:** 90–150 minutes (includes downloads and reboot if needed). You may split across two sessions after a clean snapshot.

**Outcomes:** A Kali VM with updated packages, a personal lab workspace, **Apache2** serving \`/var/www/html\`, **MariaDB** installed and hardened with \`mysql_secure_installation\`, and **Python 3** with venv/pip ready.

### Why this block matters

You will reuse Apache and MariaDB in many later labs. Installing them once—**carefully**—saves repeated context switching and avoids subtle “it worked yesterday” configuration drift.

### 1. Update package index and installed packages

${cmdBlock(
  "sudo apt update && sudo apt full-upgrade -y",
  "`apt update` refreshes the local **package index** (metadata about what versions exist on your configured mirrors). `apt full-upgrade` installs newer versions and may remove obsolete packages to satisfy dependencies.",
  "Kali is a rolling distribution; starting from a known-good updated state reduces “mystery errors” caused by stale libraries or half-installed security updates."
)}

**Procedure:** Run the command once; wait for it to finish. If the kernel was upgraded, **reboot** when prompted (\`sudo reboot\`) and continue after the VM is back.

### 2. Create a workspace tree

${cmdBlock(
  "mkdir -p ~/labs/{html,css,js,python,sql,securityplus,techplus}",
  "`mkdir -p` creates directories and **does not error** if they already exist. Braces expand to multiple folder names under \`~/labs/\`.",
  "Keeps your experiments out of \`/root\` and out of package-managed paths. You can back up \`~/labs\` as a single unit."
)}

### 3. Install and enable Apache2

${cmdBlock(
  "sudo apt install -y apache2",
  "`apt install` downloads and installs the **apache2** package (the HTTP server). `-y` auto-confirms prompts.",
  "Apache will serve your HTML/CSS/JS labs from \`/var/www/html\` by default on Debian-based systems."
)}

${cmdBlock(
  "sudo systemctl enable apache2",
  "`systemctl enable` registers the service so it **starts on boot**.",
  "After reboots, your web root is still served without remembering to start Apache manually."
)}

${cmdBlock(
  "sudo systemctl start apache2",
  "`systemctl start` runs the service **now**.",
  "Enabling does not always start immediately on all images; starting explicitly confirms the daemon is up."
)}

**Verify:** \`curl -I http://127.0.0.1/\` should return HTTP \`200\` or \`403\` (depending on default index). \`systemctl status apache2\` should show **active (running)**.

### 4. Install MariaDB (MySQL-compatible server)

${cmdBlock(
  "sudo apt install -y mariadb-server mariadb-client",
  "Installs the **database server** (\`mariadb-server\`) and **client tools** (\`mariadb-client\`) used to connect and administer databases.",
  "Kali commonly ships MariaDB; SQL labs assume this stack."
)}

${cmdBlock(
  "sudo systemctl enable mariadb && sudo systemctl start mariadb",
  "Same **enable + start** pattern as Apache for the database daemon.",
  "Ensures \`mariadb\` is running before you create databases."
)}

${cmdBlock(
  "sudo mysql_secure_installation",
  "An **interactive hardening script**: sets root auth plugin choices, can remove anonymous users, disallow remote root login, remove test database, reload privileges.",
  "Default installs are learner-friendly but not production-hardened; this closes common gaps **on your lab VM**."
)}

Follow the prompts conservatively for a **lab VM** (you still want local \`sudo mariadb\` admin access). Write down any **non-default** choices in your lab notes.

### 5. Python tooling

${cmdBlock(
  "sudo apt install -y python3 python3-venv python3-pip",
  "Installs the interpreter (\`python3\`), the **venv** module for isolated environments, and **pip** for packages.",
  "Later Python labs assume you can create \`.venv\` and install packages without touching system Python."
)}

### 6. Optional quality-of-life tools

${cmdBlock(
  "sudo apt install -y git curl tmux",
  "Common utilities: **git** (version control), **curl** (HTTP from CLI), **tmux** (terminal multiplexing).",
  "Not strictly required for every lab but used constantly in real admin work."
)}

**Final verification checklist**

- [ ] \`apache2\` active; \`http://127.0.0.1/\` responds from the VM.
- [ ] \`mariadb\` active; \`sudo mariadb -e \"SELECT 1\"\` returns a row.
- [ ] \`python3 --version\` and \`python3 -m venv -h\` work.
- [ ] Snapshot taken (recommended) with a label like **post-global-setup**.

---

`;

/** @param {{track:string, n:number, title:string, goal:string, pace?:string, bg:string, cmds:any[], proc:string, ver:string, pit?:string, fur?:string}} o */
function numberedLab(o) {
  const pad = String(o.n).padStart(2, "0");
  const idMap = { html: "h", css: "c", js: "j", py: "p", sql: "s", sec: "sec", tech: "t" };
  const prefix = idMap[o.track];
  const id =
    o.track === "sec"
      ? `labs-kali-sec-${pad}`
      : o.track === "tech"
        ? `labs-kali-t-${pad}`
        : `labs-kali-${prefix}-${pad}`;
  const code =
    o.track === "html"
      ? `H-${pad}`
      : o.track === "css"
        ? `C-${pad}`
        : o.track === "js"
          ? `J-${pad}`
          : o.track === "py"
            ? `P-${pad}`
            : o.track === "sql"
              ? `S-${pad}`
              : o.track === "sec"
                ? `SEC-${pad}`
                : `T-${pad}`;
  const unit =
    o.track === "html"
      ? "Part 1 — HTML (Apache2 on Kali)"
      : o.track === "css"
        ? "Part 2 — CSS (Apache2 on Kali)"
        : o.track === "js"
          ? "Part 3 — JavaScript (Apache2 on Kali)"
          : o.track === "py"
            ? "Part 4 — Python (on Kali)"
            : o.track === "sql"
              ? "Part 5 — SQL / MariaDB (on Kali)"
              : o.track === "sec"
                ? "Part 6 — Security+ aligned (on Kali)"
                : "Part 7 — Tech+ / IT fundamentals (on Kali)";
  return slowLesson({
    id,
    unit,
    code,
    title: o.title,
    goal: o.goal,
    pace: o.pace || "60–90 minutes",
    outcomes: o.outcomes || null,
    why: o.why,
    background: o.bg,
    commands: o.cmds,
    procedure: o.proc,
    verify: o.ver,
    pitfalls: o.pit || null,
    further: o.fur || null,
  });
}

// --- Shared boilerplate helpers ---
const APACHE_BG =
  "On Debian-based systems (including Kali), **Apache** often uses **\`/var/www/html\`** as the default **DocumentRoot**: files there map to URLs on port 80. Configuration lives under **\`/etc/apache2/\`**; logs under **\`/var/log/apache2/\`**. Editing files as root in the web root is normal for class labs; in production you would use deployment users, permissions, and CI instead.";

const MARIA_BG =
  "**MariaDB** speaks the same client protocol as MySQL for most learner tasks. The **\`mariadb\`** client connects to the server; **\`sudo mariadb\`** typically opens a local **root** administrative session on fresh installs. Always prefer **parameterized** queries in application code (covered in a later lab).";

function emitHtmlLabs() {
  const labs = [];
  labs.push(
    numberedLab({
      track: "html",
      n: 1,
      title: "“Hello, Apache”",
      goal: "Prove you control what the browser loads from your VM’s HTTP server.",
      pace: "45–75 minutes",
      why: "Before learning markup patterns, you should trust the path from **file on disk → URL → browser**. That path is easy to break with permissions, wrong paths, or wrong IP—this lab makes it concrete.",
      bg: `${APACHE_BG}\n\nYou will publish a single \`index.html\` using a shell pipeline. This is not how production sites are deployed, but it is an excellent mental model for “the server reads a file and sends bytes over HTTP.”`,
      cmds: [
        {
          cmd: `echo '<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><title>Lab H-01</title></head><body><h1>Hello from Kali</h1></body></html>' | sudo tee /var/www/html/index.html`,
          what: "`echo` prints a string. The `|` **pipe** sends that output as **stdin** to `tee`. `tee` writes stdin to **stdout and** to the given file. `sudo` runs `tee` with **root** privileges so it can write under `/var/www/html/`.",
          why: "You avoid opening an editor for a one-line sanity check. If this works, Apache can read the file world-readable from DocumentRoot.",
        },
        {
          cmd: "ip -br a",
          what: "`ip` is the modern replacement for `ifconfig`. `-br` is **brief** human output; `a` shows **all addresses**.",
          why: "Your host machine needs the VM’s **correct IP** (often bridged or NAT). Wrong interface = wrong IP = browser cannot connect.",
        },
      ],
      proc: fullApacheCssLikeProcedure({
        subdir: ".",
        urlPath: "/",
        focus: HTML_H01_FOCUS,
      }),
      ver:
        "- Host browser shows **Hello from Kali**.\n- `curl` from the VM shows the same HTML source.\n- You can explain aloud: **which file** Apache served for `/`.",
      pit:
        "- **403 Forbidden:** often permissions or missing `index.html`.\n- **Connection refused:** Apache not running or firewall blocking (later labs).\n- **Wrong page:** you edited a different path than DocumentRoot.",
      fur: "Read Apache’s default site config (`/etc/apache2/sites-enabled/`) and find the `DocumentRoot` directive—map it to a folder listing in your notes.",
    })
  );
  // H-02 … H-12: still one lesson each, rich but slightly shorter per lab
  const hRest = [
    {
      n: 2,
      title: "Semantic page skeleton",
      goal: "Build a newsletter-style page using semantic regions instead of anonymous `<div>` soup.",
      bg: `${APACHE_BG}\n\n**Semantics** help accessibility tools and search engines understand *role* (navigation vs main content vs aside). Screen readers expose landmarks; keyboard users jump between landmarks in many browsers.`,
      cmds: [
        {
          cmd: "sudo nano /var/www/html/semantic.html",
          what: "`nano` is a simple terminal editor. `sudo` lets you write under `/var/www/html/`.",
          why: "You need a multi-line HTML file; pipelines are awkward here.",
        },
        {
          cmd: "sudo apt install -y tidy && tidy -e /var/www/html/semantic.html",
          what: "`tidy` can **parse** HTML and report errors/warnings. `-e` shows errors only.",
          why: "Catches unclosed tags and malformed trees early—before you debug “why does my layout look wrong?”",
        },
      ],
      proc:
        "1. Sketch on paper: **header**, **nav**, **main** with one **article** and one **aside**, **footer**.\n\n" +
        "2. Implement in `semantic.html` with meaningful headings (`h1` once, logical `h2`/`h3`).\n\n" +
        "3. Run `tidy -e` and fix every error until clean (warnings are learning opportunities—note them).\n\n" +
        "4. Load `http://127.0.0.1/semantic.html` and use **View Source** to confirm structure reads top-to-bottom as a document.",
      ver: "Landmarks exist; no stray content outside `body`; `tidy` reports no errors.",
      pit: "Using `<div id=\"header\">` instead of `<header>` misses native semantics—use real elements.",
    },
    {
      n: 3,
      title: "Forms that POST to a dummy endpoint",
      goal: "See how `method` and `action` change browser behavior using a safe public echo service.",
      bg: "HTML forms are how browsers **submit structured data**. `method=\"get\"` encodes fields in the **URL query string**; `method=\"post\"` typically sends a **body**. **httpbin.org** reflects requests for learning—do not send secrets there.",
      cmds: [],
      proc:
        "1. Create `/var/www/html/form.html` with a form `method=\"get\"` `action=\"https://httpbin.org/get\"` and fields: text, email, number, checkbox.\n\n" +
        "2. Submit and **read the address bar**—identify each field’s name/value.\n\n" +
        "3. Switch to `method=\"post\"` `action=\"https://httpbin.org/post\"`. Submit again.\n\n" +
        "4. Open **DevTools → Network**; select the request; compare **Query String** vs **Form Data**.\n\n" +
        "5. In your notes, write one paragraph comparing GET vs POST for **passwords** (why GET is wrong).",
      ver: "You can point to a Network panel entry showing POST body fields.",
      pit: "Mixed content or blocked requests if you served the page over HTTPS with mismatched policies—use simple HTTP on localhost if confused.",
    },
    {
      n: 4,
      title: "Tables for incident timelines",
      goal: "Model time-ordered events in an accessible `<table>`.",
      bg: "Tables are for **tabular data**, not general layout. **`<caption>`**, **`<thead>`**, **`<tbody>`**, and **`scope`** make relationships explicit for assistive tech.",
      cmds: [],
      proc:
        "1. Draft 4+ fictional incident events with timestamps.\n\n" +
        "2. Build `/var/www/html/timeline.html` with caption, header row, body rows.\n\n" +
        "3. Use `<time datetime=\"ISO-8601\">` in at least one cell for machine-readable time.\n\n" +
        "4. Optional: add a tiny `<style>` block for readability (preview for CSS track).",
      ver: "Table reads correctly with headers associated to columns.",
      pit: "Missing `scope` on `th` can confuse screen readers on complex tables—start simple and validate.",
    },
    {
      n: 5,
      title: "Multimedia and fallbacks",
      goal: "Serve responsive images with `<picture>` and meaningful `alt` text.",
      bg: "Different browsers and widths benefit from different **formats** (WebP vs JPEG) and **resolutions**. `<picture>` lets the browser pick a **source** while keeping a fallback `<img>`.",
      cmds: [
        { cmd: "sudo mkdir -p /var/www/html/assets && cd /var/www/html/assets && wget -O sample.jpg 'https://picsum.photos/800/600.jpg'", what: "`mkdir -p` ensures folders exist. `wget` downloads a remote file to a local name.", why: "Gives you a legal-to-use placeholder image for experiments (respect picsum rate limits; for offline labs, copy a small local JPG instead)." },
      ],
      proc:
        "1. Place **two** images in `/var/www/html/assets/`.\n\n" +
        "2. Build `/var/www/html/media.html` with `<figure>` / `<figcaption>` and `<picture>` with multiple `<source>` plus `<img alt=\"…\">`.\n\n" +
        "3. (Optional) Install ImageMagick and generate a WebP variant; otherwise use two JPEG widths.\n\n" +
        "4. Resize the browser and watch **Network** to see which asset loads.",
      ver: "Image displays; `alt` describes purpose not filename; `<figcaption>` adds context.",
      pit: "Empty `alt` is only appropriate for decorative images—don’t use empty `alt` on informative images.",
    },
    {
      n: 6,
      title: "Microdata or JSON-LD",
      goal: "Publish structured data machines can parse (training event example).",
      bg: "Search engines and tools consume **JSON-LD** in `<script type=\"application/ld+json\">`. It does not change visual layout but improves discoverability and rich results **when eligible**.",
      cmds: [],
      proc:
        "1. Create `/var/www/html/event.html` with a visible human-readable event section.\n\n" +
        "2. Add JSON-LD describing `@type`, `name`, `startDate`, `location`.\n\n" +
        "3. Validate JSON (no trailing commas) with `python3 -m json.tool` on a copied snippet, or an IDE linter.\n\n" +
        "4. If your VM is reachable from the host, try Google’s Rich Results Test; otherwise paste HTML.",
      ver: "JSON-LD parses; page still validates as HTML.",
      pit: "Invalid JSON silently fails rich parsing—always syntax-check.",
    },
    {
      n: 7,
      title: "Accessibility audit",
      goal: "Experience keyboard-only navigation and linearize content with a text browser.",
      bg: "Accessibility is **testable**: keyboard order, visible focus, name/label association, and source order all matter. **Lynx** approximates a linear reading order.",
      cmds: [
        { cmd: "sudo apt install -y lynx", what: "Installs the **Lynx** text-mode browser.", why: "Surfaces problems with tabindex abuse and missing labels." },
        { cmd: "lynx http://127.0.0.1/a11y.html", what: "Opens your page without CSS/JS rendering as a graphical browser would.", why: "If Lynx order is nonsense, your DOM order may be wrong." },
      ],
      proc:
        "1. Build `/var/www/html/a11y.html` with links, labeled file input, and a disclosure or `hidden` panel toggled by a **button**.\n\n" +
        "2. Unplug the mouse: **Tab / Shift+Tab** through all controls; fix traps.\n\n" +
        "3. Ensure `:focus-visible` styles are visible (add CSS in a `<style>` block).\n\n" +
        "4. Run Lynx and confirm reading order matches intent.",
      ver: "Full keyboard path; focus never disappears; Lynx order is logical.",
      pit: "`div` buttons without `role`/`tabindex`/`keydown` handlers break keyboard parity—use real `<button>`.",
    },
    {
      n: 8,
      title: "Apache includes or multi-page site",
      goal: "Organize multiple HTML pages under one folder with shared navigation.",
      bg: "Small sites are still **information architecture**: predictable URLs, repeated nav, relative links. SSI (`mod_include`) can deduplicate headers—optional here.",
      cmds: [{ cmd: "sudo mkdir -p /var/www/html/site", what: "Creates a subdirectory served at `/site/`.", why: "Keeps experiments out of the web root clutter." }],
      proc:
        "1. Add `/var/www/html/site/index.html` and `about.html`.\n\n" +
        "2. Use **relative** links between them (`href=\"about.html\"`).\n\n" +
        "3. Extract a shared nav block (copy/paste first).\n\n" +
        "4. Optional advanced path: enable SSI after backing up configs; document every directive you change.",
      ver: "Both pages reachable; nav works in both directions.",
      pit: "Absolute paths like `/missing/` break when you move folders—prefer relative during learning.",
    },
    {
      n: 9,
      title: "Error pages and custom 404",
      goal: "Safely introduce VirtualHost and `ErrorDocument` patterns.",
      bg: "**Virtual hosts** let Apache map hostnames/paths to different roots. `ErrorDocument` maps HTTP errors to custom pages—great for learner UX and IR-themed storytelling.",
      cmds: [
        { cmd: "sudo cp /etc/apache2/sites-available/000-default.conf /etc/apache2/sites-available/lab-html.conf", what: "Copies a known template site file.", why: "Never edit only memory—keep a rollback path (`sudo cp` backup)." },
        { cmd: "sudo apache2ctl configtest", what: "Parses Apache configs and reports **Syntax OK** or errors.", why: "Prevents taking down the server with a typo." },
        { cmd: "sudo systemctl reload apache2", what: "`reload` asks Apache to **re-read configuration** with minimal downtime.", why: "Safer than restart when only configs changed." },
      ],
      proc:
        "1. Create `/var/www/html/404.html` with a helpful message and link home.\n\n" +
        "2. Copy default vhost to `lab-html.conf`; add `ErrorDocument 404 /404.html` inside the correct `VirtualHost`.\n\n" +
        "3. `a2ensite lab-html.conf` if needed; **disable duplicates** that conflict (document what you disabled).\n\n" +
        "4. `configtest` then `reload`.\n\n" +
        "5. Request a nonexistent URL and confirm your custom page.",
      ver: "404 shows your page; Apache still serves normal routes.",
      pit: "Multiple default vhosts fighting for port 80—read `apache2ctl -S` output carefully.",
    },
    {
      n: 10,
      title: "Security headers (intro level)",
      goal: "Set a custom response header and observe it with `curl`.",
      bg: "HTTP **headers** carry metadata: caching, security policy hints, server identifiers. `mod_headers` lets Apache add or remove headers consistently.",
      cmds: [
        { cmd: "sudo a2enmod headers && sudo systemctl reload apache2", what: "`a2enmod` enables an Apache module symlink; `reload` applies.", why: "`Header` directives only work when `mod_headers` is loaded." },
        { cmd: "curl -I http://127.0.0.1/", what: "`curl -I` fetches **headers only** (HEAD request behavior for this check).", why: "Fast loop: change config → reload → curl." },
      ],
      proc:
        "1. Enable `headers` module.\n\n" +
        "2. Add `Header set X-Lab-Author \"YourName\"` in the correct config scope (server or directory).\n\n" +
        "3. `configtest` + `reload`.\n\n" +
        "4. Verify with `curl -I` and identify your header line.",
      ver: "Custom header visible; no Apache syntax errors.",
      fur: "Read Mozilla’s MDN pages on **Content-Security-Policy** (concept only)—no need to enable CSP on day one.",
    },
    {
      n: 11,
      title: "`robots.txt` and `sitemap.xml`",
      goal: "Publish crawler hints and a sitemap for your static pages.",
      bg: "**robots.txt** is a voluntary convention: polite crawlers read it before aggressive crawling. **Sitemaps** help discovery of URLs you care about.",
      cmds: [],
      proc:
        "1. Create `/var/www/html/private/` (empty) and disallow it in `robots.txt` while allowing everything else.\n\n" +
        "2. Add `sitemap.xml` listing your lab pages.\n\n" +
        "3. Validate XML (`xmllint` if installed).",
      ver: "`curl http://127.0.0.1/robots.txt` shows expected rules.",
      pit: "robots.txt is **not access control**—sensitive data must not live under the web root.",
    },
    {
      n: 12,
      title: "Internationalization basics",
      goal: "Use `lang` attributes and parallel pages for EN/FR (or any pair you know).",
      bg: "Declaring language helps **screen readers** pick pronunciation rules and helps search engines categorize content.",
      cmds: [],
      proc:
        "1. Duplicate a small page as `index-fr.html` with `lang=\"fr\"` on `<html>`.\n\n" +
        "2. Translate headings and nav labels honestly (dictionary ok).\n\n" +
        "3. Add `<nav>` language switcher links between EN/FR.",
      ver: "Both pages validate; language switcher visible.",
      fur: "Research `hreflang` for multi-language SEO (concept).",
    },
  ];
  for (let idx = 0; idx < hRest.length; idx++) {
    const L = hRest[idx];
    labs.push(
      numberedLab({
        track: "html",
        n: L.n,
        title: L.title,
        goal: L.goal,
        bg: L.bg,
        cmds: L.cmds,
        proc: fullApacheCssLikeProcedure({
          subdir: HTML_LAB_SUBDIRS[idx],
          urlPath: HTML_LAB_URLPATHS[idx],
          focus: HTML_LAB_FOCUS[idx],
        }),
        ver: L.ver,
        pit: L.pit,
        fur: L.fur,
        why: "This HTML track lab builds real files under Apache—mirroring how static sites are served before frameworks.",
      })
    );
  }
  return labs.join("");
}

function emitCssLabs() {
  const base = `${APACHE_BG}\n\nAll CSS labs assume files under **\`/var/www/html/css-lab/\`**. Create that folder once: \`sudo mkdir -p /var/www/html/css-lab/styles\`. Use \`sudo nano\` or sync from \`~/labs/css\` if you prefer editing in your home directory then copying—**document your workflow** in notes.`;
  const titles = [
    "External stylesheet architecture",
    "Flexbox dashboard mockup",
    "CSS Grid magazine layout",
    "Fluid typography",
    "Dark mode toggle (prefers + manual)",
    "Animations and reduced motion",
    "Pure CSS interactive components",
    "Positioning and stacking contexts",
    "Print stylesheet",
    "BEM-style naming refactor",
    "Responsive images with `srcset` / sizes",
    "CSS layers (`@layer`) experiment",
  ];
  const goals = [
    "Split CSS into base/layout/theme and link from HTML.",
    "Build a SOC-style dashboard using flexbox only.",
    "Use named grid areas and responsive breakpoints.",
    "Scale type smoothly with clamp().",
    "Respect system theme and allow manual override with persistence.",
    "Animate respectfully with reduced-motion fallback.",
    "Style interactive patterns without JavaScript.",
    "Use sticky positioning and debug stacking contexts.",
    "Craft a print-specific stylesheet.",
    "Refactor messy class names to BEM-like clarity without visual change.",
    "Pair HTML responsive images with CSS that supports layout.",
    "Demonstrate cascade control with @layer.",
  ];
  let out = "";
  for (let i = 0; i < 12; i++) {
    const n = i + 1;
    out += numberedLab({
      track: "css",
      n,
      title: titles[i],
      goal: goals[i],
      pace: "60–95 minutes",
      why: "CSS in browser devtools is fast—but **Apache-backed files** train deployment thinking: paths, cache busting during edits, and real multi-file projects.",
      bg: base,
      cmds: [
        {
          cmd: "sudo mkdir -p /var/www/html/css-lab/styles",
          what: "Ensures lab directory tree exists.",
          why: "Avoids permission errors mid-lab.",
        },
      ],
      proc: fullApacheCssLikeProcedure({
        subdir: "css-lab",
        urlPath: "/css-lab/index.html",
        focus: CSS_LAB_FOCUS[i],
      }),
      ver: "Visual result matches the lab goal; you can explain **which file** controlled each major aspect.",
      pit: "Editing the wrong CSS file path in `<link href>`—always verify with Network tab (200 on CSS).",
      fur: "Introduce a `?v=1` query on your stylesheet link when cache fights you—explain tradeoffs.",
    });
  }
  return out;
}

function emitJsLabs() {
  const base = `${APACHE_BG}\n\nJavaScript runs in the browser under **origin rules** (scheme/host/port). Serving from ` + "`http://127.0.0.1`" + ` keeps examples predictable. Use **DevTools Console** for errors—read stack traces slowly.`;
  const titles = [
    "Strict mode and modules",
    "DOM events and delegation",
    "Form validation (client-side)",
    "Fetch + JSON",
    "Async patterns",
    "Local storage “study flashcards”",
    "Simple router (hash-based)",
    "Web Crypto (non-sensitive demo)",
    "Performance: debounce search",
    "Unit tests (optional Node) or console harness",
    "Web Workers",
    "Progressive enhancement",
  ];
  const goals = [
    "Use ES modules with `import`/`export` behind Apache.",
    "Handle dynamic rows with event delegation.",
    "Use the Constraint Validation API with custom messages.",
    "Fetch remote JSON and render cards with error UI.",
    "Combine async/await, Promise.all, and AbortController timeout.",
    "Persist flashcards in localStorage with import/export.",
    "Build hash routing with back/forward behavior.",
    "Compute SHA-256 of a string in the browser—conceptual only.",
    "Debounce rapid input against a large in-memory list.",
    "Add automated or manual tests for pure functions.",
    "Move heavy work off the main thread.",
    "Keep HTML usable without JS; enhance with sorting.",
  ];
  let out = "";
  for (let i = 0; i < 12; i++) {
    out += numberedLab({
      track: "js",
      n: i + 1,
      title: titles[i],
      goal: goals[i],
      pace: "70–110 minutes",
      why: "Browser JS labs on a real server highlight **module paths**, **MIME types**, and caching—issues you rarely see in a single-file playground.",
      bg: base,
      cmds: [],
      proc: fullApacheCssLikeProcedure({
        subdir: "js-lab",
        urlPath: "/js-lab/index.html",
        focus: JS_LAB_FOCUS[i],
      }),
      ver: "Behavior matches goal; console clean; you can narrate the **data flow**.",
      pit: "MIME/type errors for `.js` modules—ensure Apache serves JavaScript as `application/javascript` (default on Kali).",
      fur: "Try splitting modules further and observe caching headers (conceptual).",
    });
  }
  return out;
}

function emitPyLabs() {
  let out = "";
  const titles = [
    "Virtual environments and pip",
    "argparse CLI tool",
    "CSV / JSON conversion",
    "pathlib batch rename (dry-run)",
    "HTTP server (stdlib) vs Apache",
    "Socket programming intro",
    "subprocess safety",
    "Simple log parser",
    "dataclasses and dict validation",
    "pytest basics",
    "File hashing duplicate finder",
    "Tiny API client with retries",
  ];
  const goals = titles.map((_, i) =>
    [
      "Create a venv and call a safe public HTTP API with requests.",
      "Build a small CLI that filters log lines.",
      "Convert CSV rows to typed JSON objects.",
      "Rename files with dry-run default and explicit --apply.",
      "Compare Python’s http.server headers to Apache.",
      "TCP echo on loopback only.",
      "Run ping via subprocess without shell injection.",
      "Aggregate status codes from synthetic access logs.",
      "Model records safely before use.",
      "Write five meaningful tests.",
      "Find duplicate files by hash.",
      "Retry flaky HTTP with backoff.",
    ][i]
  );
  for (let i = 0; i < 12; i++) {
    out += numberedLab({
      track: "py",
      n: i + 1,
      title: titles[i],
      goal: goals[i],
      pace: "75–120 minutes",
      why: "Python on Kali is how automators glue systems together—**read docs**, **type code**, **run tests**, not copy-paste alone.",
      bg: "Use **\`~/labs/python/\`** for sources. Always activate your venv (`source .venv/bin/activate`) before `pip install`. Prefer **absolute imports within small projects** for clarity.",
      cmds: [
        {
          cmd: "cd ~/labs/python && python3 -m venv .venv && source .venv/bin/activate",
          what: "`python3 -m venv` creates an isolated interpreter + site-packages. `source` applies env vars in the current shell.",
          why: "Avoids polluting system Python—critical habit.",
        },
      ],
      proc: pythonLabProcedure(PY_LAB_FOCUS[i]),
      ver: "Acceptance checklist satisfied; you can explain **each import** you used.",
      pit: "Forgetting to activate venv → packages install globally or commands fail mysteriously.",
      fur: "Add `ruff` or `black` later for style—optional.",
    });
  }
  return out;
}

function emitSqlLabs() {
  let out = "";
  const titles = [
    "Create database and role",
    "Incidents and assets (1NF)",
    "Foreign keys and cascades",
    "Join practice",
    "Aggregation and HAVING",
    "Transactions",
    "Indexes and EXPLAIN",
    "Views for analysts",
    "Stored procedure (safe)",
    "Triggers audit log",
    "Backup and restore",
    "Parameterized queries from Python",
  ];
  for (let i = 0; i < 12; i++) {
    out += numberedLab({
      track: "sql",
      n: i + 1,
      title: titles[i],
      goal: "Execute the relational modeling and SQL skills for this step—see procedure.",
      pace: "70–110 minutes",
      why: "Databases reward **slow thinking**: schema first, constraints second, queries third.",
      bg: MARIA_BG,
      cmds: [
        {
          cmd: "sudo mariadb",
          what: "Opens the MariaDB client as the privileged local admin (typical Kali install).",
          why: "You need DDL privileges to create databases and users.",
        },
      ],
      proc: sqlLabProcedure(SQL_LAB_FOCUS[i]),
      ver: "Schema and queries match lab intent; you can draw the **ER diagram** on paper.",
      pit: "Mixing quoting for user@host; forgetting `FLUSH PRIVILEGES` after GRANT changes in some workflows.",
      fur: "Read MariaDB explain JSON output once (`EXPLAIN FORMAT=JSON`).",
    });
  }
  return out;
}

function emitSecLabs() {
  let out = "";
  const titles = [
    "Threat modeling STRIDE on a fake web app",
    "Hashing and password storage concepts",
    "Symmetric encryption with OpenSSL",
    "TLS inspection with openssl s_client",
    "Firewall basics (nftables or ufw)",
    "fail2ban-style log review",
    "File permissions and ACLs",
    "Apache service hardening checklist",
    "Wireshark: follow a TCP stream",
    "DNS recon (passive)",
    "Certificate pinning concepts",
    "Incident response tabletop + IOC table",
    "Secure baselines (Ansible-style outline)",
    "Log aggregation design",
  ];
  for (let i = 0; i < 14; i++) {
    out += numberedLab({
      track: "sec",
      n: i + 1,
      title: titles[i],
      goal: "Build Security+ aligned instincts: evidence, least privilege, and safe lab boundaries.",
      pace: "75–130 minutes",
      why: "**Ethics first:** only targets you own or have **written authorization** to test. These labs default to **localhost** and learning exercises.",
      bg: "Security work is **evidence-based**. When a command could affect remote systems, **stop** and validate scope. Prefer snapshots before firewall or SSH changes.",
      cmds: [],
      proc: secLabProcedure(SEC_LAB_FOCUS[i]),
      ver: "Artifacts in notes: commands, outputs, and a short risk statement.",
      pit: "Running scanners against networks you do not own—**illegal** and out of scope.",
      fur: "Map this lab to a Security+ objective domain in your own words.",
    });
  }
  return out;
}

function emitTechLabs() {
  let out = "";
  const titles = [
    "Filesystem treasure hunt",
    "Package management mastery",
    "Users and groups",
    "Disk and memory (user level)",
    "Process lifecycle",
    "Networking I: interfaces and routes",
    "Networking II: DNS and DHCP",
    "SSH keys and config",
    "Cron and timers",
    "systemd unit for a personal script",
    "Documentation: runbook",
    "Backup strategy comparison",
    "Performance baseline",
    "Hypervisor literacy",
  ];
  for (let i = 0; i < 14; i++) {
    out += numberedLab({
      track: "tech",
      n: i + 1,
      title: titles[i],
      goal: "Strengthen Linux administration fundamentals that underpin every other lab.",
      pace: "60–95 minutes",
      why: "Slow OS fluency pays compounding returns: when web or DB labs fail, you will **know where to look**.",
      bg: "Treat the shell as a **precision instrument**: read man pages (`man systemd.service`), use `--help`, and prefer non-destructive probes (`ls`, `stat`, `ss -lntp`) before changes.",
      cmds: [],
      proc: techLabProcedure(TECH_LAB_FOCUS[i]),
      ver: "You can explain **one diagram** in prose: what changed on disk or network and why it matters.",
      pit: "Editing `/etc` without backup—always `sudo cp` first.",
      fur: "Link this lab to a Tech+ chapter you studied in the main track.",
    });
  }
  return out;
}

const APPENDIX = `<!-- id: labs-kali-appendix-ref -->
<!-- unit: Reference — command sheets -->

## Appendix A — Apache quick reference (Kali)

**Pace:** 30–45 minutes to walk through each command with \`man\` or \`--help\`.

${cmdBlock(
  "sudo systemctl status apache2",
  "Shows **state**, recent log lines, and whether the unit is enabled.",
  "First triage when “the website is down.”"
)}
${cmdBlock(
  "sudo systemctl restart apache2",
  "Hard **restart** of the daemon (drops connections).",
  "Use when module loads require full restart vs `reload`."
)}
${cmdBlock("sudo apache2ctl -S", "Dumps **virtual host configuration** mapping.", "Reveals duplicate vhosts and unexpected `ServerName` matches.")}
${cmdBlock(
  "sudo tail -f /var/log/apache2/access.log",
  "`tail -f` streams new lines as requests arrive.",
  "Correlate browser clicks with server-side evidence."
)}

---

<!-- id: labs-kali-appendix-pace-capstone -->
<!-- unit: Reference — pacing & capstone -->

## Pacing, capstone, and wrap-up

## Appendix B — MariaDB quick reference (Kali)

\`\`\`bash
sudo mariadb
SHOW DATABASES;
USE soc_training;
SHOW TABLES;
\`\`\`

**What this block does:** connects as admin, lists databases, selects a schema, lists tables—your “am I in the right place?” ritual.

## Appendix C — Suggested **slow** weekly pace

Treat each **numbered lab** as roughly **one session** (some may stretch). Eight months is safer than eight weeks if you are doing all command explorations and notes.

| Month | Focus |
|------:|-------|
| 1 | Global setup + HTML H-01–H-06 |
| 2 | HTML H-07–H-12 + CSS C-01–C-04 |
| 3 | CSS C-05–C-12 |
| 4 | JavaScript J-01–J-06 |
| 5 | JavaScript J-07–J-12 |
| 6 | Python P-01–P-06 |
| 7 | Python P-07–P-12 |
| 8 | SQL S-01–S-06 |
| 9 | SQL S-07–S-12 |
| 10 | Security+ SEC-01–SEC-07 |
| 11 | Security+ SEC-08–SEC-14 |
| 12 | Tech+ T-01–T-07 |
| 13 | Tech+ T-08–T-14 |
| 14 | Capstone + review notebooks |

## Capstone (optional, combines topics)

**Pace:** 8–20 hours across multiple days.

Build **“SOC Training Portal”** on Kali:

1. Apache2 hosts HTML/CSS/JS under \`/var/www/html/soc-portal/\`.
2. MariaDB stores \`courses\`, \`labs_completed\`, \`notes\`.
3. Python \`import_labs.py\` reads JSON metadata and **parameterized** SQL upserts rows.
4. Write a **hardening memo** (headers, firewall, SSH policy) and a **Tech+ runbook** for operations.

---

**End of curriculum.** Extend labs with your own fictional org stories—narrative context makes the same commands stick longer.

`;

const body =
  INTRO +
  SETUP +
  emitHtmlLabs() +
  emitCssLabs() +
  emitJsLabs() +
  emitPyLabs() +
  emitSqlLabs() +
  emitSecLabs() +
  emitTechLabs() +
  APPENDIX;

fs.writeFileSync(outPath, body, "utf8");
console.log("Wrote", path.relative(root, outPath), "(" + body.length + " chars)");
