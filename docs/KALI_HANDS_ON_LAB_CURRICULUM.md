<!-- id: labs-kali-intro -->
<!-- unit: Start — how to use this curriculum -->

# Kali Linux Hands-On Lab Curriculum

> Maintenance note (2026-04): This source and generated lesson bundles were rechecked for OCR split-word and spacing artifacts. Keep command examples exact and preserve the slow, verification-first pacing language when revising labs.

**Audience:** Learners who want **deep**, practical experience across web fundamentals, scripting, databases, and certification-aligned security topics.

**Pedagogy (read once):** This path is intentionally **slow**. Each sidebar lesson is **one lab** (or one setup chapter). Do **not** rush. For each lab: read the **Background** and **Commands explained** sections *before* typing anything. Expect **45–120+ minutes** per lab depending on depth—some may spill across two sessions. Keep a **lab notebook** (what you ran, what happened, what confused you, what you verified).

**Environment:** Every lab assumes a **Kali Linux virtual machine** (VMware, VirtualBox, or Hyper-V). Take a **VM snapshot** before labs that change services, firewalls, or SSH—especially in the Security+ section.

**Conventions:**

- `$` in prose means “normal user shell”; use `sudo` only when the lab says to.
- Replace placeholders (`yourname`, IPs, hostnames) with your own values.
- After each lab, write a short **lab report**: objective, commands run (or key outputs), verification evidence, one **“what I’d automate next time”** note.

---

<!-- id: labs-kali-setup -->
<!-- unit: Start — prepare your VM once -->

## Global setup (do once per VM)

**Suggested pace:** 90–150 minutes (includes downloads and reboot if needed). You may split across two sessions after a clean snapshot.

**Outcomes:** A Kali VM with updated packages, a personal lab workspace, **Apache2** serving `/var/www/html`, **MariaDB** installed and hardened with `mysql_secure_installation`, and **Python 3** with venv/pip ready.

### Why this block matters

You will reuse Apache and MariaDB in many later labs. Installing them once—**carefully**—saves repeated context switching and avoids subtle “it worked yesterday” configuration drift.

### 1. Update package index and installed packages

**Command:**

```bash
sudo apt update && sudo apt full-upgrade -y
```

- **What it does:** `apt update` refreshes the local **package index** (metadata about what versions exist on your configured mirrors). `apt full-upgrade` installs newer versions and may remove obsolete packages to satisfy dependencies.
- **Why we use it here:** Kali is a rolling distribution; starting from a known-good updated state reduces “mystery errors” caused by stale libraries or half-installed security updates.


**Procedure:** Run the command once; wait for it to finish. If the kernel was upgraded, **reboot** when prompted (`sudo reboot`) and continue after the VM is back.

### 2. Create a workspace tree

**Command:**

```bash
mkdir -p ~/labs/{html,css,js,python,sql,securityplus,techplus}
```

- **What it does:** `mkdir -p` creates directories and **does not error** if they already exist. Braces expand to multiple folder names under `~/labs/`.
- **Why we use it here:** Keeps your experiments out of `/root` and out of package-managed paths. You can back up `~/labs` as a single unit.


### 3. Install and enable Apache2

**Command:**

```bash
sudo apt install -y apache2
```

- **What it does:** `apt install` downloads and installs the **apache2** package (the HTTP server). `-y` auto-confirms prompts.
- **Why we use it here:** Apache will serve your HTML/CSS/JS labs from `/var/www/html` by default on Debian-based systems.


**Command:**

```bash
sudo systemctl enable apache2
```

- **What it does:** `systemctl enable` registers the service so it **starts on boot**.
- **Why we use it here:** After reboots, your web root is still served without remembering to start Apache manually.


**Command:**

```bash
sudo systemctl start apache2
```

- **What it does:** `systemctl start` runs the service **now**.
- **Why we use it here:** Enabling does not always start immediately on all images; starting explicitly confirms the daemon is up.


**Verify:** `curl -I http://127.0.0.1/` should return HTTP `200` or `403` (depending on default index). `systemctl status apache2` should show **active (running)**.

### 4. Install MariaDB (MySQL-compatible server)

**Command:**

```bash
sudo apt install -y mariadb-server mariadb-client
```

- **What it does:** Installs the **database server** (`mariadb-server`) and **client tools** (`mariadb-client`) used to connect and administer databases.
- **Why we use it here:** Kali commonly ships MariaDB; SQL labs assume this stack.


**Command:**

```bash
sudo systemctl enable mariadb && sudo systemctl start mariadb
```

- **What it does:** Same **enable + start** pattern as Apache for the database daemon.
- **Why we use it here:** Ensures `mariadb` is running before you create databases.


**Command:**

```bash
sudo mysql_secure_installation
```

- **What it does:** An **interactive hardening script**: sets root auth plugin choices, can remove anonymous users, disallow remote root login, remove test database, reload privileges.
- **Why we use it here:** Default installs are learner-friendly but not production-hardened; this closes common gaps **on your lab VM**.


Follow the prompts conservatively for a **lab VM** (you still want local `sudo mariadb` admin access). Write down any **non-default** choices in your lab notes.

### 5. Python tooling

**Command:**

```bash
sudo apt install -y python3 python3-venv python3-pip
```

- **What it does:** Installs the interpreter (`python3`), the **venv** module for isolated environments, and **pip** for packages.
- **Why we use it here:** Later Python labs assume you can create `.venv` and install packages without touching system Python.


### 6. Optional quality-of-life tools

**Command:**

```bash
sudo apt install -y git curl tmux
```

- **What it does:** Common utilities: **git** (version control), **curl** (HTTP from CLI), **tmux** (terminal multiplexing).
- **Why we use it here:** Not strictly required for every lab but used constantly in real admin work.


**Final verification checklist**

- [ ] `apache2` active; `http://127.0.0.1/` responds from the VM.
- [ ] `mariadb` active; `sudo mariadb -e "SELECT 1"` returns a row.
- [ ] `python3 --version` and `python3 -m venv -h` work.
- [ ] Snapshot taken (recommended) with a label like **post-global-setup**.

---

<!-- id: labs-kali-h-01 -->
<!-- unit: Part 1 — HTML (Apache2 on Kali) -->

### Lab H-01 — “Hello, Apache”

**Suggested pace:** 45–75 minutes

**Goal:** Prove you control what the browser loads from your VM’s HTTP server.

#### Why this lab exists

Before learning markup patterns, you should trust the path from **file on disk → URL → browser**. That path is easy to break with permissions, wrong paths, or wrong IP—this lab makes it concrete.

#### Background

On Debian-based systems (including Kali), **Apache** often uses **`/var/www/html`** as the default **DocumentRoot**: files there map to URLs on port 80. Configuration lives under **`/etc/apache2/`**; logs under **`/var/log/apache2/`**. Editing files as root in the web root is normal for class labs; in production you would use deployment users, permissions, and CI instead.

You will publish a single `index.html` using a shell pipeline. This is not how production sites are deployed, but it is an excellent mental model for “the server reads a file and sends bytes over HTTP.”

#### Commands explained (read before you type)

**Command:**

```bash
echo '<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><title>Lab H-01</title></head><body><h1>Hello from Kali</h1></body></html>' | sudo tee /var/www/html/index.html
```

- **What it does:** `echo` prints a string. The `|` **pipe** sends that output as **stdin** to `tee`. `tee` writes stdin to **stdout and** to the given file. `sudo` runs `tee` with **root** privileges so it can write under `/var/www/html/`.
- **Why we use it here:** You avoid opening an editor for a one-line sanity check. If this works, Apache can read the file world-readable from DocumentRoot.

**Command:**

```bash
ip -br a
```

- **What it does:** `ip` is the modern replacement for `ifconfig`. `-br` is **brief** human output; `a` shows **all addresses**.
- **Why we use it here:** Your host machine needs the VM’s **correct IP** (often bridged or NAT). Wrong interface = wrong IP = browser cannot connect.

#### Procedure (go slowly)

### Phase 1 — Map the server to the filesystem (15–20 min)

1. Run `systemctl status apache2 --no-pager | head -n 20`. In your notebook, copy the **Active:** line and note **Main PID**.
2. Run `sudo apache2ctl -S 2>&1 | head -n 50`. Find which vhost answers on **:80** and which **DocumentRoot** applies. Write one sentence: “A request to `http://127.0.0.1/` should read from ___ on disk.”
3. Open `/etc/apache2/sites-enabled/000-default.conf` with `sudo nano` or `sudo less` (read-only with `less`). Locate `DocumentRoot` and `<Directory ...>` blocks—**do not save changes** until a lab explicitly asks.
4. List the lab folder: `sudo ls -la /var/www/html/./`. If it is missing, create it: `sudo mkdir -p /var/www/html/.`.

### Phase 2 — Edit → save → reload habit (10 min)

- Use `sudo nano /var/www/html/./…` for small edits. After save, **one wrong character** can break CSS or HTML—re-open the file and confirm your last line is intact.
- In the browser, use **hard refresh** (`Ctrl+F5`) when styles look “stuck.” Optionally add a **cache-bust** query on `<link href="…?v=2">` and explain why that works.

### Phase 3 — Core lab work (see focus below)

**Publish one page and prove the full path**

1. Re-open what **DocumentRoot** means: Apache maps a URL path to a directory on disk. For `/`, the server looks for `index.html` (or another DirectoryIndex) under that root.
2. Run the long `echo '…html…' | sudo tee /var/www/html/index.html` pipeline from the **Commands explained** section. Before Enter, trace data: `echo` writes to **stdout** → **pipe** → `tee` reads stdin, prints to your terminal **and** writes the file. `sudo` only elevates `tee`, not the string generation.
3. `ls -l /var/www/html/index.html` — note owner (often `root`), group (`www-data` on Debian), mode (`644`). Explain why Apache (running as `www-data`) can still **read** the file.
4. On the VM: `curl -sS http://127.0.0.1/ | head -n 20`. The `-sS` combo hides progress but still surfaces errors.
5. `ip -br a` — pick the address your **host** browser should use (NAT vs bridged). Open `http://<that-ip>/` on the host.
6. **Stretch:** edit the same file with `sudo nano` and add `<meta name="viewport" content="width=device-width, initial-scale=1">`. Reload; in devtools toggle device toolbar and describe what changed visually.
- **Checkpoint:** In one sentence: which **absolute path** on disk produced the bytes you saw in the browser?


### Phase 4 — Verify like someone on-call (15–20 min)

1. In **Firefox or Chromium on the VM**, open your page. Open **DevTools → Network**, disable cache, reload. Confirm **200** on the document and on each CSS/JS asset you expect.
2. In **Console**, confirm there are **no red errors**. If there are, read the **file name and line**; fix, reload, repeat.
3. From the shell, run `curl -sS -D- -o /tmp/lh-body.html http://127.0.0.1/` **against your lab URL path** (adjust the URL). Inspect the **first few response headers** (`Content-Type`, `Content-Length`).
4. Tail the access log while you click: `sudo tail -n 20 /var/log/apache2/access.log`. Match log lines to your requests.

### Phase 5 — Lab report (10 min)

- Write: objective, files touched, **one mistake** you made and how you proved the fix, and **one security or maintenance thought** (e.g. why `sudo` on web root is OK in class but risky in production).


#### Verify

- Host browser shows **Hello from Kali**.
- `curl` from the VM shows the same HTML source.
- You can explain aloud: **which file** Apache served for `/`.

#### Common mistakes

- **403 Forbidden:** often permissions or missing `index.html`.
- **Connection refused:** Apache not running or firewall blocking (later labs).
- **Wrong page:** you edited a different path than DocumentRoot.

#### Going further

Read Apache’s default site config (`/etc/apache2/sites-enabled/`) and find the `DocumentRoot` directive—map it to a folder listing in your notes.

---

<!-- id: labs-kali-h-02 -->
<!-- unit: Part 1 — HTML (Apache2 on Kali) -->

### Lab H-02 — Semantic page skeleton

**Suggested pace:** 60–90 minutes

**Goal:** Build a newsletter-style page using semantic regions instead of anonymous `<div>` soup.

#### Why this lab exists

This HTML track lab builds real files under Apache—mirroring how static sites are served before frameworks.

#### Background

On Debian-based systems (including Kali), **Apache** often uses **`/var/www/html`** as the default **DocumentRoot**: files there map to URLs on port 80. Configuration lives under **`/etc/apache2/`**; logs under **`/var/log/apache2/`**. Editing files as root in the web root is normal for class labs; in production you would use deployment users, permissions, and CI instead.

**Semantics** help accessibility tools and search engines understand *role* (navigation vs main content vs aside). Screen readers expose landmarks; keyboard users jump between landmarks in many browsers.

#### Commands explained (read before you type)

**Command:**

```bash
sudo nano /var/www/html/semantic.html
```

- **What it does:** `nano` is a simple terminal editor. `sudo` lets you write under `/var/www/html/`.
- **Why we use it here:** You need a multi-line HTML file; pipelines are awkward here.

**Command:**

```bash
sudo apt install -y tidy && tidy -e /var/www/html/semantic.html
```

- **What it does:** `tidy` can **parse** HTML and report errors/warnings. `-e` shows errors only.
- **Why we use it here:** Catches unclosed tags and malformed trees early—before you debug “why does my layout look wrong?”

#### Procedure (go slowly)

### Phase 1 — Map the server to the filesystem (15–20 min)

1. Run `systemctl status apache2 --no-pager | head -n 20`. In your notebook, copy the **Active:** line and note **Main PID**.
2. Run `sudo apache2ctl -S 2>&1 | head -n 50`. Find which vhost answers on **:80** and which **DocumentRoot** applies. Write one sentence: “A request to `http://127.0.0.1/semantic.html` should read from ___ on disk.”
3. Open `/etc/apache2/sites-enabled/000-default.conf` with `sudo nano` or `sudo less` (read-only with `less`). Locate `DocumentRoot` and `<Directory ...>` blocks—**do not save changes** until a lab explicitly asks.
4. List the lab folder: `sudo ls -la /var/www/html/./`. If it is missing, create it: `sudo mkdir -p /var/www/html/.`.

### Phase 2 — Edit → save → reload habit (10 min)

- Use `sudo nano /var/www/html/./…` for small edits. After save, **one wrong character** can break CSS or HTML—re-open the file and confirm your last line is intact.
- In the browser, use **hard refresh** (`Ctrl+F5`) when styles look “stuck.” Optionally add a **cache-bust** query on `<link href="…?v=2">` and explain why that works.

### Phase 3 — Core lab work (see focus below)

**H-02 — Semantic skeleton**

1. On paper, label **header**, **nav**, **main** (with one **article** + one **aside**), **footer**. Draw arrows for tab order you want.
2. `sudo nano /var/www/html/semantic.html` — implement with a single `h1` and logical `h2`/`h3`. Avoid `<div id="header">` when a native element exists.
3. `sudo apt install -y tidy` then `tidy -e /var/www/html/semantic.html`. Fix **every error**; for each warning, decide “fix now” or “document why ignored.”
4. Load `http://127.0.0.1/semantic.html` → **View Page Source** — confirm reading order matches your sketch.
- **Checkpoint:** Name two assistive technologies or browser features that benefit from `<main>` vs a generic wrapper.


### Phase 4 — Verify like someone on-call (15–20 min)

1. In **Firefox or Chromium on the VM**, open your page. Open **DevTools → Network**, disable cache, reload. Confirm **200** on the document and on each CSS/JS asset you expect.
2. In **Console**, confirm there are **no red errors**. If there are, read the **file name and line**; fix, reload, repeat.
3. From the shell, run `curl -sS -D- -o /tmp/lh-body.html http://127.0.0.1/` **against your lab URL path** (adjust the URL). Inspect the **first few response headers** (`Content-Type`, `Content-Length`).
4. Tail the access log while you click: `sudo tail -n 20 /var/log/apache2/access.log`. Match log lines to your requests.

### Phase 5 — Lab report (10 min)

- Write: objective, files touched, **one mistake** you made and how you proved the fix, and **one security or maintenance thought** (e.g. why `sudo` on web root is OK in class but risky in production).


#### Verify

Landmarks exist; no stray content outside `body`; `tidy` reports no errors.

#### Common mistakes

Using `<div id="header">` instead of `<header>` misses native semantics—use real elements.

---

<!-- id: labs-kali-h-03 -->
<!-- unit: Part 1 — HTML (Apache2 on Kali) -->

### Lab H-03 — Forms that POST to a dummy endpoint

**Suggested pace:** 60–90 minutes

**Goal:** See how `method` and `action` change browser behavior using a safe public echo service.

#### Why this lab exists

This HTML track lab builds real files under Apache—mirroring how static sites are served before frameworks.

#### Background

HTML forms are how browsers **submit structured data**. `method="get"` encodes fields in the **URL query string**; `method="post"` typically sends a **body**. **httpbin.org** reflects requests for learning—do not send secrets there.

#### Procedure (go slowly)

### Phase 1 — Map the server to the filesystem (15–20 min)

1. Run `systemctl status apache2 --no-pager | head -n 20`. In your notebook, copy the **Active:** line and note **Main PID**.
2. Run `sudo apache2ctl -S 2>&1 | head -n 50`. Find which vhost answers on **:80** and which **DocumentRoot** applies. Write one sentence: “A request to `http://127.0.0.1/form.html` should read from ___ on disk.”
3. Open `/etc/apache2/sites-enabled/000-default.conf` with `sudo nano` or `sudo less` (read-only with `less`). Locate `DocumentRoot` and `<Directory ...>` blocks—**do not save changes** until a lab explicitly asks.
4. List the lab folder: `sudo ls -la /var/www/html/./`. If it is missing, create it: `sudo mkdir -p /var/www/html/.`.

### Phase 2 — Edit → save → reload habit (10 min)

- Use `sudo nano /var/www/html/./…` for small edits. After save, **one wrong character** can break CSS or HTML—re-open the file and confirm your last line is intact.
- In the browser, use **hard refresh** (`Ctrl+F5`) when styles look “stuck.” Optionally add a **cache-bust** query on `<link href="…?v=2">` and explain why that works.

### Phase 3 — Core lab work (see focus below)

**H-03 — Forms GET vs POST**

1. Create `/var/www/html/form.html` served over `http://` (not `file://`) so DevTools Network behaves like a real site.
2. Build a form: `method="get"`, `action="https://httpbin.org/get"`, fields: text, email, number, checkbox. Submit and **read the address bar** — map each `name=` to its value.
3. Switch to `method="post"` and `action="https://httpbin.org/post"`. Submit again. Open **Network** → select request → compare **Query String** vs **Request payload**.
4. In your notebook: one paragraph on why passwords must **never** use GET; mention logs, proxies, and Referer leakage at a high level.
- **Checkpoint:** Paste one GET URL and describe which parts are client-controlled vs server-controlled.


### Phase 4 — Verify like someone on-call (15–20 min)

1. In **Firefox or Chromium on the VM**, open your page. Open **DevTools → Network**, disable cache, reload. Confirm **200** on the document and on each CSS/JS asset you expect.
2. In **Console**, confirm there are **no red errors**. If there are, read the **file name and line**; fix, reload, repeat.
3. From the shell, run `curl -sS -D- -o /tmp/lh-body.html http://127.0.0.1/` **against your lab URL path** (adjust the URL). Inspect the **first few response headers** (`Content-Type`, `Content-Length`).
4. Tail the access log while you click: `sudo tail -n 20 /var/log/apache2/access.log`. Match log lines to your requests.

### Phase 5 — Lab report (10 min)

- Write: objective, files touched, **one mistake** you made and how you proved the fix, and **one security or maintenance thought** (e.g. why `sudo` on web root is OK in class but risky in production).


#### Verify

You can point to a Network panel entry showing POST body fields.

#### Common mistakes

Mixed content or blocked requests if you served the page over HTTPS with mismatched policies—use simple HTTP on localhost if confused.

---

<!-- id: labs-kali-h-04 -->
<!-- unit: Part 1 — HTML (Apache2 on Kali) -->

### Lab H-04 — Tables for incident timelines

**Suggested pace:** 60–90 minutes

**Goal:** Model time-ordered events in an accessible `<table>`.

#### Why this lab exists

This HTML track lab builds real files under Apache—mirroring how static sites are served before frameworks.

#### Background

Tables are for **tabular data**, not general layout. **`<caption>`**, **`<thead>`**, **`<tbody>`**, and **`scope`** make relationships explicit for assistive tech.

#### Procedure (go slowly)

### Phase 1 — Map the server to the filesystem (15–20 min)

1. Run `systemctl status apache2 --no-pager | head -n 20`. In your notebook, copy the **Active:** line and note **Main PID**.
2. Run `sudo apache2ctl -S 2>&1 | head -n 50`. Find which vhost answers on **:80** and which **DocumentRoot** applies. Write one sentence: “A request to `http://127.0.0.1/timeline.html` should read from ___ on disk.”
3. Open `/etc/apache2/sites-enabled/000-default.conf` with `sudo nano` or `sudo less` (read-only with `less`). Locate `DocumentRoot` and `<Directory ...>` blocks—**do not save changes** until a lab explicitly asks.
4. List the lab folder: `sudo ls -la /var/www/html/./`. If it is missing, create it: `sudo mkdir -p /var/www/html/.`.

### Phase 2 — Edit → save → reload habit (10 min)

- Use `sudo nano /var/www/html/./…` for small edits. After save, **one wrong character** can break CSS or HTML—re-open the file and confirm your last line is intact.
- In the browser, use **hard refresh** (`Ctrl+F5`) when styles look “stuck.” Optionally add a **cache-bust** query on `<link href="…?v=2">` and explain why that works.

### Phase 3 — Core lab work (see focus below)

**H-04 — Incident timeline table**

1. Invent **≥4** fictional IR events with timestamps, source system, owner.
2. Build `/var/www/html/timeline.html` with `<caption>`, `<thead>`, `<tbody>`, and `scope="col"` on column headers.
3. Use `<time datetime="…">` in at least one cell with a human-readable label inside the tag.
4. Optional tiny `<style>`: zebra rows, monospace timestamps — preview of the CSS track.
- **Checkpoint:** Explain how `scope` helps a screen reader associate `<th>` with body cells.


### Phase 4 — Verify like someone on-call (15–20 min)

1. In **Firefox or Chromium on the VM**, open your page. Open **DevTools → Network**, disable cache, reload. Confirm **200** on the document and on each CSS/JS asset you expect.
2. In **Console**, confirm there are **no red errors**. If there are, read the **file name and line**; fix, reload, repeat.
3. From the shell, run `curl -sS -D- -o /tmp/lh-body.html http://127.0.0.1/` **against your lab URL path** (adjust the URL). Inspect the **first few response headers** (`Content-Type`, `Content-Length`).
4. Tail the access log while you click: `sudo tail -n 20 /var/log/apache2/access.log`. Match log lines to your requests.

### Phase 5 — Lab report (10 min)

- Write: objective, files touched, **one mistake** you made and how you proved the fix, and **one security or maintenance thought** (e.g. why `sudo` on web root is OK in class but risky in production).


#### Verify

Table reads correctly with headers associated to columns.

#### Common mistakes

Missing `scope` on `th` can confuse screen readers on complex tables—start simple and validate.

---

<!-- id: labs-kali-h-05 -->
<!-- unit: Part 1 — HTML (Apache2 on Kali) -->

### Lab H-05 — Multimedia and fallbacks

**Suggested pace:** 60–90 minutes

**Goal:** Serve responsive images with `<picture>` and meaningful `alt` text.

#### Why this lab exists

This HTML track lab builds real files under Apache—mirroring how static sites are served before frameworks.

#### Background

Different browsers and widths benefit from different **formats** (WebP vs JPEG) and **resolutions**. `<picture>` lets the browser pick a **source** while keeping a fallback `<img>`.

#### Commands explained (read before you type)

**Command:**

```bash
sudo mkdir -p /var/www/html/assets && cd /var/www/html/assets && wget -O sample.jpg 'https://picsum.photos/800/600.jpg'
```

- **What it does:** `mkdir -p` ensures folders exist. `wget` downloads a remote file to a local name.
- **Why we use it here:** Gives you a legal-to-use placeholder image for experiments (respect picsum rate limits; for offline labs, copy a small local JPG instead).

#### Procedure (go slowly)

### Phase 1 — Map the server to the filesystem (15–20 min)

1. Run `systemctl status apache2 --no-pager | head -n 20`. In your notebook, copy the **Active:** line and note **Main PID**.
2. Run `sudo apache2ctl -S 2>&1 | head -n 50`. Find which vhost answers on **:80** and which **DocumentRoot** applies. Write one sentence: “A request to `http://127.0.0.1/media.html` should read from ___ on disk.”
3. Open `/etc/apache2/sites-enabled/000-default.conf` with `sudo nano` or `sudo less` (read-only with `less`). Locate `DocumentRoot` and `<Directory ...>` blocks—**do not save changes** until a lab explicitly asks.
4. List the lab folder: `sudo ls -la /var/www/html/./`. If it is missing, create it: `sudo mkdir -p /var/www/html/.`.

### Phase 2 — Edit → save → reload habit (10 min)

- Use `sudo nano /var/www/html/./…` for small edits. After save, **one wrong character** can break CSS or HTML—re-open the file and confirm your last line is intact.
- In the browser, use **hard refresh** (`Ctrl+F5`) when styles look “stuck.” Optionally add a **cache-bust** query on `<link href="…?v=2">` and explain why that works.

### Phase 3 — Core lab work (see focus below)

**H-05 — Responsive images**

1. `sudo mkdir -p /var/www/html/assets` and download or copy **two** JPEGs (different aspect ratios or widths).
2. Build `/var/www/html/media.html` with `<figure>`, `<figcaption>`, and `<picture>` containing multiple `<source>` plus fallback `<img alt="…">`.
3. Write `alt` text that describes **purpose** (why the image exists), not the filename.
4. Resize the browser; in Network note which asset bytes were transferred at narrow vs wide widths.
- **Checkpoint:** When is `alt=""` acceptable? Write your answer with an example from this page or “none on this page.”


### Phase 4 — Verify like someone on-call (15–20 min)

1. In **Firefox or Chromium on the VM**, open your page. Open **DevTools → Network**, disable cache, reload. Confirm **200** on the document and on each CSS/JS asset you expect.
2. In **Console**, confirm there are **no red errors**. If there are, read the **file name and line**; fix, reload, repeat.
3. From the shell, run `curl -sS -D- -o /tmp/lh-body.html http://127.0.0.1/` **against your lab URL path** (adjust the URL). Inspect the **first few response headers** (`Content-Type`, `Content-Length`).
4. Tail the access log while you click: `sudo tail -n 20 /var/log/apache2/access.log`. Match log lines to your requests.

### Phase 5 — Lab report (10 min)

- Write: objective, files touched, **one mistake** you made and how you proved the fix, and **one security or maintenance thought** (e.g. why `sudo` on web root is OK in class but risky in production).


#### Verify

Image displays; `alt` describes purpose not filename; `<figcaption>` adds context.

#### Common mistakes

Empty `alt` is only appropriate for decorative images—don’t use empty `alt` on informative images.

---

<!-- id: labs-kali-h-06 -->
<!-- unit: Part 1 — HTML (Apache2 on Kali) -->

### Lab H-06 — Microdata or JSON-LD

**Suggested pace:** 60–90 minutes

**Goal:** Publish structured data machines can parse (training event example).

#### Why this lab exists

This HTML track lab builds real files under Apache—mirroring how static sites are served before frameworks.

#### Background

Search engines and tools consume **JSON-LD** in `<script type="application/ld+json">`. It does not change visual layout but improves discoverability and rich results **when eligible**.

#### Procedure (go slowly)

### Phase 1 — Map the server to the filesystem (15–20 min)

1. Run `systemctl status apache2 --no-pager | head -n 20`. In your notebook, copy the **Active:** line and note **Main PID**.
2. Run `sudo apache2ctl -S 2>&1 | head -n 50`. Find which vhost answers on **:80** and which **DocumentRoot** applies. Write one sentence: “A request to `http://127.0.0.1/event.html` should read from ___ on disk.”
3. Open `/etc/apache2/sites-enabled/000-default.conf` with `sudo nano` or `sudo less` (read-only with `less`). Locate `DocumentRoot` and `<Directory ...>` blocks—**do not save changes** until a lab explicitly asks.
4. List the lab folder: `sudo ls -la /var/www/html/./`. If it is missing, create it: `sudo mkdir -p /var/www/html/.`.

### Phase 2 — Edit → save → reload habit (10 min)

- Use `sudo nano /var/www/html/./…` for small edits. After save, **one wrong character** can break CSS or HTML—re-open the file and confirm your last line is intact.
- In the browser, use **hard refresh** (`Ctrl+F5`) when styles look “stuck.” Optionally add a **cache-bust** query on `<link href="…?v=2">` and explain why that works.

### Phase 3 — Core lab work (see focus below)

**H-06 — JSON-LD event**

1. Human-visible block: training event title, date, location paragraph.
2. Add `<script type="application/ld+json">` with valid JSON: `@context`, `@type`, `name`, `startDate`, `location`.
3. Copy the JSON to a temp file and run `python3 -m json.tool < file` — fix until it parses.
4. If the VM is reachable from the host, try Google Rich Results Test on the URL; otherwise paste HTML into the tool.
- **Checkpoint:** What breaks silently if you leave a trailing comma in JSON?


### Phase 4 — Verify like someone on-call (15–20 min)

1. In **Firefox or Chromium on the VM**, open your page. Open **DevTools → Network**, disable cache, reload. Confirm **200** on the document and on each CSS/JS asset you expect.
2. In **Console**, confirm there are **no red errors**. If there are, read the **file name and line**; fix, reload, repeat.
3. From the shell, run `curl -sS -D- -o /tmp/lh-body.html http://127.0.0.1/` **against your lab URL path** (adjust the URL). Inspect the **first few response headers** (`Content-Type`, `Content-Length`).
4. Tail the access log while you click: `sudo tail -n 20 /var/log/apache2/access.log`. Match log lines to your requests.

### Phase 5 — Lab report (10 min)

- Write: objective, files touched, **one mistake** you made and how you proved the fix, and **one security or maintenance thought** (e.g. why `sudo` on web root is OK in class but risky in production).


#### Verify

JSON-LD parses; page still validates as HTML.

#### Common mistakes

Invalid JSON silently fails rich parsing—always syntax-check.

---

<!-- id: labs-kali-h-07 -->
<!-- unit: Part 1 — HTML (Apache2 on Kali) -->

### Lab H-07 — Accessibility audit

**Suggested pace:** 60–90 minutes

**Goal:** Experience keyboard-only navigation and linearize content with a text browser.

#### Why this lab exists

This HTML track lab builds real files under Apache—mirroring how static sites are served before frameworks.

#### Background

Accessibility is **testable**: keyboard order, visible focus, name/label association, and source order all matter. **Lynx** approximates a linear reading order.

#### Commands explained (read before you type)

**Command:**

```bash
sudo apt install -y lynx
```

- **What it does:** Installs the **Lynx** text-mode browser.
- **Why we use it here:** Surfaces problems with tabindex abuse and missing labels.

**Command:**

```bash
lynx http://127.0.0.1/a11y.html
```

- **What it does:** Opens your page without CSS/JS rendering as a graphical browser would.
- **Why we use it here:** If Lynx order is nonsense, your DOM order may be wrong.

#### Procedure (go slowly)

### Phase 1 — Map the server to the filesystem (15–20 min)

1. Run `systemctl status apache2 --no-pager | head -n 20`. In your notebook, copy the **Active:** line and note **Main PID**.
2. Run `sudo apache2ctl -S 2>&1 | head -n 50`. Find which vhost answers on **:80** and which **DocumentRoot** applies. Write one sentence: “A request to `http://127.0.0.1/a11y.html` should read from ___ on disk.”
3. Open `/etc/apache2/sites-enabled/000-default.conf` with `sudo nano` or `sudo less` (read-only with `less`). Locate `DocumentRoot` and `<Directory ...>` blocks—**do not save changes** until a lab explicitly asks.
4. List the lab folder: `sudo ls -la /var/www/html/./`. If it is missing, create it: `sudo mkdir -p /var/www/html/.`.

### Phase 2 — Edit → save → reload habit (10 min)

- Use `sudo nano /var/www/html/./…` for small edits. After save, **one wrong character** can break CSS or HTML—re-open the file and confirm your last line is intact.
- In the browser, use **hard refresh** (`Ctrl+F5`) when styles look “stuck.” Optionally add a **cache-bust** query on `<link href="…?v=2">` and explain why that works.

### Phase 3 — Core lab work (see focus below)

**H-07 — Accessibility audit**

1. Build `/var/www/html/a11y.html`: real `<button>` (not `<div onclick>`), labeled file input, several links, one disclosure pattern.
2. **Unplug the mouse** — Tab / Shift+Tab through everything; fix focus traps and invisible focus.
3. Add `:focus-visible` styles in a `<style>` block so keyboard users see where they are.
4. `sudo apt install -y lynx` → `lynx http://127.0.0.1/a11y.html` — confirm linear reading order.
- **Checkpoint:** List one issue Lynx exposed that your graphical browser hid.


### Phase 4 — Verify like someone on-call (15–20 min)

1. In **Firefox or Chromium on the VM**, open your page. Open **DevTools → Network**, disable cache, reload. Confirm **200** on the document and on each CSS/JS asset you expect.
2. In **Console**, confirm there are **no red errors**. If there are, read the **file name and line**; fix, reload, repeat.
3. From the shell, run `curl -sS -D- -o /tmp/lh-body.html http://127.0.0.1/` **against your lab URL path** (adjust the URL). Inspect the **first few response headers** (`Content-Type`, `Content-Length`).
4. Tail the access log while you click: `sudo tail -n 20 /var/log/apache2/access.log`. Match log lines to your requests.

### Phase 5 — Lab report (10 min)

- Write: objective, files touched, **one mistake** you made and how you proved the fix, and **one security or maintenance thought** (e.g. why `sudo` on web root is OK in class but risky in production).


#### Verify

Full keyboard path; focus never disappears; Lynx order is logical.

#### Common mistakes

`div` buttons without `role`/`tabindex`/`keydown` handlers break keyboard parity—use real `<button>`.

---

<!-- id: labs-kali-h-08 -->
<!-- unit: Part 1 — HTML (Apache2 on Kali) -->

### Lab H-08 — Apache includes or multi-page site

**Suggested pace:** 60–90 minutes

**Goal:** Organize multiple HTML pages under one folder with shared navigation.

#### Why this lab exists

This HTML track lab builds real files under Apache—mirroring how static sites are served before frameworks.

#### Background

Small sites are still **information architecture**: predictable URLs, repeated nav, relative links. SSI (`mod_include`) can deduplicate headers—optional here.

#### Commands explained (read before you type)

**Command:**

```bash
sudo mkdir -p /var/www/html/site
```

- **What it does:** Creates a subdirectory served at `/site/`.
- **Why we use it here:** Keeps experiments out of the web root clutter.

#### Procedure (go slowly)

### Phase 1 — Map the server to the filesystem (15–20 min)

1. Run `systemctl status apache2 --no-pager | head -n 20`. In your notebook, copy the **Active:** line and note **Main PID**.
2. Run `sudo apache2ctl -S 2>&1 | head -n 50`. Find which vhost answers on **:80** and which **DocumentRoot** applies. Write one sentence: “A request to `http://127.0.0.1/site/index.html` should read from ___ on disk.”
3. Open `/etc/apache2/sites-enabled/000-default.conf` with `sudo nano` or `sudo less` (read-only with `less`). Locate `DocumentRoot` and `<Directory ...>` blocks—**do not save changes** until a lab explicitly asks.
4. List the lab folder: `sudo ls -la /var/www/html/site/`. If it is missing, create it: `sudo mkdir -p /var/www/html/site`.

### Phase 2 — Edit → save → reload habit (10 min)

- Use `sudo nano /var/www/html/site/…` for small edits. After save, **one wrong character** can break CSS or HTML—re-open the file and confirm your last line is intact.
- In the browser, use **hard refresh** (`Ctrl+F5`) when styles look “stuck.” Optionally add a **cache-bust** query on `<link href="…?v=2">` and explain why that works.

### Phase 3 — Core lab work (see focus below)

**H-08 — Multi-page site**

1. `sudo mkdir -p /var/www/html/site` — add `index.html` and `about.html`.
2. Use **relative** links (`href="about.html"`) so the folder is portable.
3. Duplicate a shared nav block by hand first; note the maintenance pain for your report.
4. Optional: research `mod_include` + SSI — **snapshot + backup configs** before enabling.
- **Checkpoint:** Why can absolute paths like `/missing/` break when you move the site folder?


### Phase 4 — Verify like someone on-call (15–20 min)

1. In **Firefox or Chromium on the VM**, open your page. Open **DevTools → Network**, disable cache, reload. Confirm **200** on the document and on each CSS/JS asset you expect.
2. In **Console**, confirm there are **no red errors**. If there are, read the **file name and line**; fix, reload, repeat.
3. From the shell, run `curl -sS -D- -o /tmp/lh-body.html http://127.0.0.1/` **against your lab URL path** (adjust the URL). Inspect the **first few response headers** (`Content-Type`, `Content-Length`).
4. Tail the access log while you click: `sudo tail -n 20 /var/log/apache2/access.log`. Match log lines to your requests.

### Phase 5 — Lab report (10 min)

- Write: objective, files touched, **one mistake** you made and how you proved the fix, and **one security or maintenance thought** (e.g. why `sudo` on web root is OK in class but risky in production).


#### Verify

Both pages reachable; nav works in both directions.

#### Common mistakes

Absolute paths like `/missing/` break when you move folders—prefer relative during learning.

---

<!-- id: labs-kali-h-09 -->
<!-- unit: Part 1 — HTML (Apache2 on Kali) -->

### Lab H-09 — Error pages and custom 404

**Suggested pace:** 60–90 minutes

**Goal:** Safely introduce VirtualHost and `ErrorDocument` patterns.

#### Why this lab exists

This HTML track lab builds real files under Apache—mirroring how static sites are served before frameworks.

#### Background

**Virtual hosts** let Apache map hostnames/paths to different roots. `ErrorDocument` maps HTTP errors to custom pages—great for learner UX and IR-themed storytelling.

#### Commands explained (read before you type)

**Command:**

```bash
sudo cp /etc/apache2/sites-available/000-default.conf /etc/apache2/sites-available/lab-html.conf
```

- **What it does:** Copies a known template site file.
- **Why we use it here:** Never edit only memory—keep a rollback path (`sudo cp` backup).

**Command:**

```bash
sudo apache2ctl configtest
```

- **What it does:** Parses Apache configs and reports **Syntax OK** or errors.
- **Why we use it here:** Prevents taking down the server with a typo.

**Command:**

```bash
sudo systemctl reload apache2
```

- **What it does:** `reload` asks Apache to **re-read configuration** with minimal downtime.
- **Why we use it here:** Safer than restart when only configs changed.

#### Procedure (go slowly)

### Phase 1 — Map the server to the filesystem (15–20 min)

1. Run `systemctl status apache2 --no-pager | head -n 20`. In your notebook, copy the **Active:** line and note **Main PID**.
2. Run `sudo apache2ctl -S 2>&1 | head -n 50`. Find which vhost answers on **:80** and which **DocumentRoot** applies. Write one sentence: “A request to `http://127.0.0.1/this-url-should-404-lab-test` should read from ___ on disk.”
3. Open `/etc/apache2/sites-enabled/000-default.conf` with `sudo nano` or `sudo less` (read-only with `less`). Locate `DocumentRoot` and `<Directory ...>` blocks—**do not save changes** until a lab explicitly asks.
4. List the lab folder: `sudo ls -la /var/www/html/./`. If it is missing, create it: `sudo mkdir -p /var/www/html/.`.

### Phase 2 — Edit → save → reload habit (10 min)

- Use `sudo nano /var/www/html/./…` for small edits. After save, **one wrong character** can break CSS or HTML—re-open the file and confirm your last line is intact.
- In the browser, use **hard refresh** (`Ctrl+F5`) when styles look “stuck.” Optionally add a **cache-bust** query on `<link href="…?v=2">` and explain why that works.

### Phase 3 — Core lab work (see focus below)

**H-09 — Custom 404**

1. Create `/var/www/html/404.html` with a calm message and link home.
2. `sudo cp /etc/apache2/sites-available/000-default.conf /etc/apache2/sites-available/lab-html.conf` — edit a **copy**, keep the original as reference.
3. Add `ErrorDocument 404 /404.html` inside the correct `VirtualHost`. Run `sudo apache2ctl configtest` before any reload.
4. `sudo apache2ctl -S` — resolve duplicate vhost/port conflicts **in writing** before `systemctl reload apache2`.
5. Request a URL that does not exist; confirm status **404** and your HTML body.
- **Checkpoint:** Difference between `reload` and `restart` for Apache in one sentence.


### Phase 4 — Verify like someone on-call (15–20 min)

1. In **Firefox or Chromium on the VM**, open your page. Open **DevTools → Network**, disable cache, reload. Confirm **200** on the document and on each CSS/JS asset you expect.
2. In **Console**, confirm there are **no red errors**. If there are, read the **file name and line**; fix, reload, repeat.
3. From the shell, run `curl -sS -D- -o /tmp/lh-body.html http://127.0.0.1/` **against your lab URL path** (adjust the URL). Inspect the **first few response headers** (`Content-Type`, `Content-Length`).
4. Tail the access log while you click: `sudo tail -n 20 /var/log/apache2/access.log`. Match log lines to your requests.

### Phase 5 — Lab report (10 min)

- Write: objective, files touched, **one mistake** you made and how you proved the fix, and **one security or maintenance thought** (e.g. why `sudo` on web root is OK in class but risky in production).


#### Verify

404 shows your page; Apache still serves normal routes.

#### Common mistakes

Multiple default vhosts fighting for port 80—read `apache2ctl -S` output carefully.

---

<!-- id: labs-kali-h-10 -->
<!-- unit: Part 1 — HTML (Apache2 on Kali) -->

### Lab H-10 — Security headers (intro level)

**Suggested pace:** 60–90 minutes

**Goal:** Set a custom response header and observe it with `curl`.

#### Why this lab exists

This HTML track lab builds real files under Apache—mirroring how static sites are served before frameworks.

#### Background

HTTP **headers** carry metadata: caching, security policy hints, server identifiers. `mod_headers` lets Apache add or remove headers consistently.

#### Commands explained (read before you type)

**Command:**

```bash
sudo a2enmod headers && sudo systemctl reload apache2
```

- **What it does:** `a2enmod` enables an Apache module symlink; `reload` applies.
- **Why we use it here:** `Header` directives only work when `mod_headers` is loaded.

**Command:**

```bash
curl -I http://127.0.0.1/
```

- **What it does:** `curl -I` fetches **headers only** (HEAD request behavior for this check).
- **Why we use it here:** Fast loop: change config → reload → curl.

#### Procedure (go slowly)

### Phase 1 — Map the server to the filesystem (15–20 min)

1. Run `systemctl status apache2 --no-pager | head -n 20`. In your notebook, copy the **Active:** line and note **Main PID**.
2. Run `sudo apache2ctl -S 2>&1 | head -n 50`. Find which vhost answers on **:80** and which **DocumentRoot** applies. Write one sentence: “A request to `http://127.0.0.1/` should read from ___ on disk.”
3. Open `/etc/apache2/sites-enabled/000-default.conf` with `sudo nano` or `sudo less` (read-only with `less`). Locate `DocumentRoot` and `<Directory ...>` blocks—**do not save changes** until a lab explicitly asks.
4. List the lab folder: `sudo ls -la /var/www/html/./`. If it is missing, create it: `sudo mkdir -p /var/www/html/.`.

### Phase 2 — Edit → save → reload habit (10 min)

- Use `sudo nano /var/www/html/./…` for small edits. After save, **one wrong character** can break CSS or HTML—re-open the file and confirm your last line is intact.
- In the browser, use **hard refresh** (`Ctrl+F5`) when styles look “stuck.” Optionally add a **cache-bust** query on `<link href="…?v=2">` and explain why that works.

### Phase 3 — Core lab work (see focus below)

**H-10 — Response headers**

1. `sudo a2enmod headers` then `sudo systemctl reload apache2`.
2. Add `Header set X-Lab-Author "YourName"` in the appropriate scope (server or directory block).
3. `curl -I http://127.0.0.1/` — find your header line and `Server:` line.
4. Read MDN **Content-Security-Policy** overview (concept only) — note how headers shift security left compared to only fixing HTML.
- **Checkpoint:** Why is `curl -I` faster than downloading the full body when iterating configs?


### Phase 4 — Verify like someone on-call (15–20 min)

1. In **Firefox or Chromium on the VM**, open your page. Open **DevTools → Network**, disable cache, reload. Confirm **200** on the document and on each CSS/JS asset you expect.
2. In **Console**, confirm there are **no red errors**. If there are, read the **file name and line**; fix, reload, repeat.
3. From the shell, run `curl -sS -D- -o /tmp/lh-body.html http://127.0.0.1/` **against your lab URL path** (adjust the URL). Inspect the **first few response headers** (`Content-Type`, `Content-Length`).
4. Tail the access log while you click: `sudo tail -n 20 /var/log/apache2/access.log`. Match log lines to your requests.

### Phase 5 — Lab report (10 min)

- Write: objective, files touched, **one mistake** you made and how you proved the fix, and **one security or maintenance thought** (e.g. why `sudo` on web root is OK in class but risky in production).


#### Verify

Custom header visible; no Apache syntax errors.

#### Going further

Read Mozilla’s MDN pages on **Content-Security-Policy** (concept only)—no need to enable CSP on day one.

---

<!-- id: labs-kali-h-11 -->
<!-- unit: Part 1 — HTML (Apache2 on Kali) -->

### Lab H-11 — `robots.txt` and `sitemap.xml`

**Suggested pace:** 60–90 minutes

**Goal:** Publish crawler hints and a sitemap for your static pages.

#### Why this lab exists

This HTML track lab builds real files under Apache—mirroring how static sites are served before frameworks.

#### Background

**robots.txt** is a voluntary convention: polite crawlers read it before aggressive crawling. **Sitemaps** help discovery of URLs you care about.

#### Procedure (go slowly)

### Phase 1 — Map the server to the filesystem (15–20 min)

1. Run `systemctl status apache2 --no-pager | head -n 20`. In your notebook, copy the **Active:** line and note **Main PID**.
2. Run `sudo apache2ctl -S 2>&1 | head -n 50`. Find which vhost answers on **:80** and which **DocumentRoot** applies. Write one sentence: “A request to `http://127.0.0.1/robots.txt` should read from ___ on disk.”
3. Open `/etc/apache2/sites-enabled/000-default.conf` with `sudo nano` or `sudo less` (read-only with `less`). Locate `DocumentRoot` and `<Directory ...>` blocks—**do not save changes** until a lab explicitly asks.
4. List the lab folder: `sudo ls -la /var/www/html/./`. If it is missing, create it: `sudo mkdir -p /var/www/html/.`.

### Phase 2 — Edit → save → reload habit (10 min)

- Use `sudo nano /var/www/html/./…` for small edits. After save, **one wrong character** can break CSS or HTML—re-open the file and confirm your last line is intact.
- In the browser, use **hard refresh** (`Ctrl+F5`) when styles look “stuck.” Optionally add a **cache-bust** query on `<link href="…?v=2">` and explain why that works.

### Phase 3 — Core lab work (see focus below)

**H-11 — robots.txt + sitemap**

1. `sudo mkdir -p /var/www/html/private` (empty placeholder).
2. `/var/www/html/robots.txt`: `User-agent: *`, `Disallow: /private/`, allow rest; add `Sitemap:` line with full URL to your `sitemap.xml`.
3. `sitemap.xml`: list your lab URLs with `<loc>` — validate with `xmllint` if installed.
4. `curl -s http://127.0.0.1/robots.txt` and verify.
- **Checkpoint:** Why must secrets never rely on `robots.txt` alone?


### Phase 4 — Verify like someone on-call (15–20 min)

1. In **Firefox or Chromium on the VM**, open your page. Open **DevTools → Network**, disable cache, reload. Confirm **200** on the document and on each CSS/JS asset you expect.
2. In **Console**, confirm there are **no red errors**. If there are, read the **file name and line**; fix, reload, repeat.
3. From the shell, run `curl -sS -D- -o /tmp/lh-body.html http://127.0.0.1/` **against your lab URL path** (adjust the URL). Inspect the **first few response headers** (`Content-Type`, `Content-Length`).
4. Tail the access log while you click: `sudo tail -n 20 /var/log/apache2/access.log`. Match log lines to your requests.

### Phase 5 — Lab report (10 min)

- Write: objective, files touched, **one mistake** you made and how you proved the fix, and **one security or maintenance thought** (e.g. why `sudo` on web root is OK in class but risky in production).


#### Verify

`curl http://127.0.0.1/robots.txt` shows expected rules.

#### Common mistakes

robots.txt is **not access control**—sensitive data must not live under the web root.

---

<!-- id: labs-kali-h-12 -->
<!-- unit: Part 1 — HTML (Apache2 on Kali) -->

### Lab H-12 — Internationalization basics

**Suggested pace:** 60–90 minutes

**Goal:** Use `lang` attributes and parallel pages for EN/FR (or any pair you know).

#### Why this lab exists

This HTML track lab builds real files under Apache—mirroring how static sites are served before frameworks.

#### Background

Declaring language helps **screen readers** pick pronunciation rules and helps search engines categorize content.

#### Procedure (go slowly)

### Phase 1 — Map the server to the filesystem (15–20 min)

1. Run `systemctl status apache2 --no-pager | head -n 20`. In your notebook, copy the **Active:** line and note **Main PID**.
2. Run `sudo apache2ctl -S 2>&1 | head -n 50`. Find which vhost answers on **:80** and which **DocumentRoot** applies. Write one sentence: “A request to `http://127.0.0.1/index-fr.html` should read from ___ on disk.”
3. Open `/etc/apache2/sites-enabled/000-default.conf` with `sudo nano` or `sudo less` (read-only with `less`). Locate `DocumentRoot` and `<Directory ...>` blocks—**do not save changes** until a lab explicitly asks.
4. List the lab folder: `sudo ls -la /var/www/html/./`. If it is missing, create it: `sudo mkdir -p /var/www/html/.`.

### Phase 2 — Edit → save → reload habit (10 min)

- Use `sudo nano /var/www/html/./…` for small edits. After save, **one wrong character** can break CSS or HTML—re-open the file and confirm your last line is intact.
- In the browser, use **hard refresh** (`Ctrl+F5`) when styles look “stuck.” Optionally add a **cache-bust** query on `<link href="…?v=2">` and explain why that works.

### Phase 3 — Core lab work (see focus below)

**H-12 — Internationalization**

1. Copy a small English page to `/var/www/html/index-fr.html` with `<html lang="fr">`.
2. Translate headings and nav honestly (dictionary ok). Keep parallel structure so CSS can be shared later.
3. Add a `<nav>` language switcher linking EN ↔ FR.
4. In devtools Accessibility tree, inspect how `lang` is exposed.
- **Checkpoint:** One sentence on `hreflang` for multi-domain SEO (research, no implementation required).


### Phase 4 — Verify like someone on-call (15–20 min)

1. In **Firefox or Chromium on the VM**, open your page. Open **DevTools → Network**, disable cache, reload. Confirm **200** on the document and on each CSS/JS asset you expect.
2. In **Console**, confirm there are **no red errors**. If there are, read the **file name and line**; fix, reload, repeat.
3. From the shell, run `curl -sS -D- -o /tmp/lh-body.html http://127.0.0.1/` **against your lab URL path** (adjust the URL). Inspect the **first few response headers** (`Content-Type`, `Content-Length`).
4. Tail the access log while you click: `sudo tail -n 20 /var/log/apache2/access.log`. Match log lines to your requests.

### Phase 5 — Lab report (10 min)

- Write: objective, files touched, **one mistake** you made and how you proved the fix, and **one security or maintenance thought** (e.g. why `sudo` on web root is OK in class but risky in production).


#### Verify

Both pages validate; language switcher visible.

#### Going further

Research `hreflang` for multi-language SEO (concept).

---

<!-- id: labs-kali-c-01 -->
<!-- unit: Part 2 — CSS (Apache2 on Kali) -->

### Lab C-01 — External stylesheet architecture

**Suggested pace:** 60–95 minutes

**Goal:** Split CSS into base/layout/theme and link from HTML.

#### Why this lab exists

CSS in browser devtools is fast—but **Apache-backed files** train deployment thinking: paths, cache busting during edits, and real multi-file projects.

#### Background

On Debian-based systems (including Kali), **Apache** often uses **`/var/www/html`** as the default **DocumentRoot**: files there map to URLs on port 80. Configuration lives under **`/etc/apache2/`**; logs under **`/var/log/apache2/`**. Editing files as root in the web root is normal for class labs; in production you would use deployment users, permissions, and CI instead.

All CSS labs assume files under **`/var/www/html/css-lab/`**. Create that folder once: `sudo mkdir -p /var/www/html/css-lab/styles`. Use `sudo nano` or sync from `~/labs/css` if you prefer editing in your home directory then copying—**document your workflow** in notes.

#### Commands explained (read before you type)

**Command:**

```bash
sudo mkdir -p /var/www/html/css-lab/styles
```

- **What it does:** Ensures lab directory tree exists.
- **Why we use it here:** Avoids permission errors mid-lab.

#### Procedure (go slowly)

### Phase 1 — Map the server to the filesystem (15–20 min)

1. Run `systemctl status apache2 --no-pager | head -n 20`. In your notebook, copy the **Active:** line and note **Main PID**.
2. Run `sudo apache2ctl -S 2>&1 | head -n 50`. Find which vhost answers on **:80** and which **DocumentRoot** applies. Write one sentence: “A request to `http://127.0.0.1/css-lab/index.html` should read from ___ on disk.”
3. Open `/etc/apache2/sites-enabled/000-default.conf` with `sudo nano` or `sudo less` (read-only with `less`). Locate `DocumentRoot` and `<Directory ...>` blocks—**do not save changes** until a lab explicitly asks.
4. List the lab folder: `sudo ls -la /var/www/html/css-lab/`. If it is missing, create it: `sudo mkdir -p /var/www/html/css-lab`.

### Phase 2 — Edit → save → reload habit (10 min)

- Use `sudo nano /var/www/html/css-lab/…` for small edits. After save, **one wrong character** can break CSS or HTML—re-open the file and confirm your last line is intact.
- In the browser, use **hard refresh** (`Ctrl+F5`) when styles look “stuck.” Optionally add a **cache-bust** query on `<link href="…?v=2">` and explain why that works.

### Phase 3 — Core lab work (see focus below)

**External stylesheet architecture**

- Create `/var/www/html/css-lab/index.html` with a minimal semantic shell (`<!DOCTYPE html>`, `<html lang="en">`, `<head>`, `<body>`).
- Add three `<link rel="stylesheet" href="styles/base.css">` (and `layout.css`, `theme.css`) in **dependency order**: variables first, layout second, theme last.
- In `base.css`, define `:root { --fg: …; --bg: …; --space: … }`. In `layout.css`, set `body { margin:0; font-family:… }` and a simple container. In `theme.css`, add headings and link colors using **only** variables from `:root`.
- **Checkpoint:** View page source in the browser and confirm **three** separate network requests for CSS (Network tab).


### Phase 4 — Verify like someone on-call (15–20 min)

1. In **Firefox or Chromium on the VM**, open your page. Open **DevTools → Network**, disable cache, reload. Confirm **200** on the document and on each CSS/JS asset you expect.
2. In **Console**, confirm there are **no red errors**. If there are, read the **file name and line**; fix, reload, repeat.
3. From the shell, run `curl -sS -D- -o /tmp/lh-body.html http://127.0.0.1/` **against your lab URL path** (adjust the URL). Inspect the **first few response headers** (`Content-Type`, `Content-Length`).
4. Tail the access log while you click: `sudo tail -n 20 /var/log/apache2/access.log`. Match log lines to your requests.

### Phase 5 — Lab report (10 min)

- Write: objective, files touched, **one mistake** you made and how you proved the fix, and **one security or maintenance thought** (e.g. why `sudo` on web root is OK in class but risky in production).


#### Verify

Visual result matches the lab goal; you can explain **which file** controlled each major aspect.

#### Common mistakes

Editing the wrong CSS file path in `<link href>`—always verify with Network tab (200 on CSS).

#### Going further

Introduce a `?v=1` query on your stylesheet link when cache fights you—explain tradeoffs.

---

<!-- id: labs-kali-c-02 -->
<!-- unit: Part 2 — CSS (Apache2 on Kali) -->

### Lab C-02 — Flexbox dashboard mockup

**Suggested pace:** 60–95 minutes

**Goal:** Build a SOC-style dashboard using flexbox only.

#### Why this lab exists

CSS in browser devtools is fast—but **Apache-backed files** train deployment thinking: paths, cache busting during edits, and real multi-file projects.

#### Background

On Debian-based systems (including Kali), **Apache** often uses **`/var/www/html`** as the default **DocumentRoot**: files there map to URLs on port 80. Configuration lives under **`/etc/apache2/`**; logs under **`/var/log/apache2/`**. Editing files as root in the web root is normal for class labs; in production you would use deployment users, permissions, and CI instead.

All CSS labs assume files under **`/var/www/html/css-lab/`**. Create that folder once: `sudo mkdir -p /var/www/html/css-lab/styles`. Use `sudo nano` or sync from `~/labs/css` if you prefer editing in your home directory then copying—**document your workflow** in notes.

#### Commands explained (read before you type)

**Command:**

```bash
sudo mkdir -p /var/www/html/css-lab/styles
```

- **What it does:** Ensures lab directory tree exists.
- **Why we use it here:** Avoids permission errors mid-lab.

#### Procedure (go slowly)

### Phase 1 — Map the server to the filesystem (15–20 min)

1. Run `systemctl status apache2 --no-pager | head -n 20`. In your notebook, copy the **Active:** line and note **Main PID**.
2. Run `sudo apache2ctl -S 2>&1 | head -n 50`. Find which vhost answers on **:80** and which **DocumentRoot** applies. Write one sentence: “A request to `http://127.0.0.1/css-lab/index.html` should read from ___ on disk.”
3. Open `/etc/apache2/sites-enabled/000-default.conf` with `sudo nano` or `sudo less` (read-only with `less`). Locate `DocumentRoot` and `<Directory ...>` blocks—**do not save changes** until a lab explicitly asks.
4. List the lab folder: `sudo ls -la /var/www/html/css-lab/`. If it is missing, create it: `sudo mkdir -p /var/www/html/css-lab`.

### Phase 2 — Edit → save → reload habit (10 min)

- Use `sudo nano /var/www/html/css-lab/…` for small edits. After save, **one wrong character** can break CSS or HTML—re-open the file and confirm your last line is intact.
- In the browser, use **hard refresh** (`Ctrl+F5`) when styles look “stuck.” Optionally add a **cache-bust** query on `<link href="…?v=2">` and explain why that works.

### Phase 3 — Core lab work (see focus below)

**Flexbox dashboard**

- Create `flex.html` with a `<header>`, `<aside>`, `<main>`, and a `<footer>`. Wrap main content in a `<section>` with **cards** (`<article>`).
- On a top-level flex container (e.g. `body` or `.app`), set `display:flex; flex-direction:column; min-height:100vh`. Put **sidebar + main** in a row flex: `display:flex; flex:1; min-height:0` on inner wrapper.
- Use `gap`, `flex-wrap`, and `min-width` on cards so the layout **reflows** under ~400px width. Use DevTools **Flexbox overlay** (grid/flex inspector) to see axes.
- **Checkpoint:** At three viewport widths, screenshot or describe which element wraps first and why.


### Phase 4 — Verify like someone on-call (15–20 min)

1. In **Firefox or Chromium on the VM**, open your page. Open **DevTools → Network**, disable cache, reload. Confirm **200** on the document and on each CSS/JS asset you expect.
2. In **Console**, confirm there are **no red errors**. If there are, read the **file name and line**; fix, reload, repeat.
3. From the shell, run `curl -sS -D- -o /tmp/lh-body.html http://127.0.0.1/` **against your lab URL path** (adjust the URL). Inspect the **first few response headers** (`Content-Type`, `Content-Length`).
4. Tail the access log while you click: `sudo tail -n 20 /var/log/apache2/access.log`. Match log lines to your requests.

### Phase 5 — Lab report (10 min)

- Write: objective, files touched, **one mistake** you made and how you proved the fix, and **one security or maintenance thought** (e.g. why `sudo` on web root is OK in class but risky in production).


#### Verify

Visual result matches the lab goal; you can explain **which file** controlled each major aspect.

#### Common mistakes

Editing the wrong CSS file path in `<link href>`—always verify with Network tab (200 on CSS).

#### Going further

Introduce a `?v=1` query on your stylesheet link when cache fights you—explain tradeoffs.

---

<!-- id: labs-kali-c-03 -->
<!-- unit: Part 2 — CSS (Apache2 on Kali) -->

### Lab C-03 — CSS Grid magazine layout

**Suggested pace:** 60–95 minutes

**Goal:** Use named grid areas and responsive breakpoints.

#### Why this lab exists

CSS in browser devtools is fast—but **Apache-backed files** train deployment thinking: paths, cache busting during edits, and real multi-file projects.

#### Background

On Debian-based systems (including Kali), **Apache** often uses **`/var/www/html`** as the default **DocumentRoot**: files there map to URLs on port 80. Configuration lives under **`/etc/apache2/`**; logs under **`/var/log/apache2/`**. Editing files as root in the web root is normal for class labs; in production you would use deployment users, permissions, and CI instead.

All CSS labs assume files under **`/var/www/html/css-lab/`**. Create that folder once: `sudo mkdir -p /var/www/html/css-lab/styles`. Use `sudo nano` or sync from `~/labs/css` if you prefer editing in your home directory then copying—**document your workflow** in notes.

#### Commands explained (read before you type)

**Command:**

```bash
sudo mkdir -p /var/www/html/css-lab/styles
```

- **What it does:** Ensures lab directory tree exists.
- **Why we use it here:** Avoids permission errors mid-lab.

#### Procedure (go slowly)

### Phase 1 — Map the server to the filesystem (15–20 min)

1. Run `systemctl status apache2 --no-pager | head -n 20`. In your notebook, copy the **Active:** line and note **Main PID**.
2. Run `sudo apache2ctl -S 2>&1 | head -n 50`. Find which vhost answers on **:80** and which **DocumentRoot** applies. Write one sentence: “A request to `http://127.0.0.1/css-lab/index.html` should read from ___ on disk.”
3. Open `/etc/apache2/sites-enabled/000-default.conf` with `sudo nano` or `sudo less` (read-only with `less`). Locate `DocumentRoot` and `<Directory ...>` blocks—**do not save changes** until a lab explicitly asks.
4. List the lab folder: `sudo ls -la /var/www/html/css-lab/`. If it is missing, create it: `sudo mkdir -p /var/www/html/css-lab`.

### Phase 2 — Edit → save → reload habit (10 min)

- Use `sudo nano /var/www/html/css-lab/…` for small edits. After save, **one wrong character** can break CSS or HTML—re-open the file and confirm your last line is intact.
- In the browser, use **hard refresh** (`Ctrl+F5`) when styles look “stuck.” Optionally add a **cache-bust** query on `<link href="…?v=2">` and explain why that works.

### Phase 3 — Core lab work (see focus below)

**CSS Grid magazine layout**

- Create `grid.html` with a `.magazine` container: `display:grid; grid-template-columns: repeat(12, 1fr); gap: …`.
- Define `grid-template-areas` for **at least six regions** (hero, feature, sidebar, quote, footer, etc.) and assign `grid-column` / `grid-row` or `grid-area` to children.
- Add one `@media (max-width: …)` breakpoint that **changes** `grid-template-areas` (e.g. sidebar drops below).
- **Checkpoint:** Draw your grid on paper with row/column numbers, then compare to DevTools **Layout** pane for grids.


### Phase 4 — Verify like someone on-call (15–20 min)

1. In **Firefox or Chromium on the VM**, open your page. Open **DevTools → Network**, disable cache, reload. Confirm **200** on the document and on each CSS/JS asset you expect.
2. In **Console**, confirm there are **no red errors**. If there are, read the **file name and line**; fix, reload, repeat.
3. From the shell, run `curl -sS -D- -o /tmp/lh-body.html http://127.0.0.1/` **against your lab URL path** (adjust the URL). Inspect the **first few response headers** (`Content-Type`, `Content-Length`).
4. Tail the access log while you click: `sudo tail -n 20 /var/log/apache2/access.log`. Match log lines to your requests.

### Phase 5 — Lab report (10 min)

- Write: objective, files touched, **one mistake** you made and how you proved the fix, and **one security or maintenance thought** (e.g. why `sudo` on web root is OK in class but risky in production).


#### Verify

Visual result matches the lab goal; you can explain **which file** controlled each major aspect.

#### Common mistakes

Editing the wrong CSS file path in `<link href>`—always verify with Network tab (200 on CSS).

#### Going further

Introduce a `?v=1` query on your stylesheet link when cache fights you—explain tradeoffs.

---

<!-- id: labs-kali-c-04 -->
<!-- unit: Part 2 — CSS (Apache2 on Kali) -->

### Lab C-04 — Fluid typography

**Suggested pace:** 60–95 minutes

**Goal:** Scale type smoothly with clamp().

#### Why this lab exists

CSS in browser devtools is fast—but **Apache-backed files** train deployment thinking: paths, cache busting during edits, and real multi-file projects.

#### Background

On Debian-based systems (including Kali), **Apache** often uses **`/var/www/html`** as the default **DocumentRoot**: files there map to URLs on port 80. Configuration lives under **`/etc/apache2/`**; logs under **`/var/log/apache2/`**. Editing files as root in the web root is normal for class labs; in production you would use deployment users, permissions, and CI instead.

All CSS labs assume files under **`/var/www/html/css-lab/`**. Create that folder once: `sudo mkdir -p /var/www/html/css-lab/styles`. Use `sudo nano` or sync from `~/labs/css` if you prefer editing in your home directory then copying—**document your workflow** in notes.

#### Commands explained (read before you type)

**Command:**

```bash
sudo mkdir -p /var/www/html/css-lab/styles
```

- **What it does:** Ensures lab directory tree exists.
- **Why we use it here:** Avoids permission errors mid-lab.

#### Procedure (go slowly)

### Phase 1 — Map the server to the filesystem (15–20 min)

1. Run `systemctl status apache2 --no-pager | head -n 20`. In your notebook, copy the **Active:** line and note **Main PID**.
2. Run `sudo apache2ctl -S 2>&1 | head -n 50`. Find which vhost answers on **:80** and which **DocumentRoot** applies. Write one sentence: “A request to `http://127.0.0.1/css-lab/index.html` should read from ___ on disk.”
3. Open `/etc/apache2/sites-enabled/000-default.conf` with `sudo nano` or `sudo less` (read-only with `less`). Locate `DocumentRoot` and `<Directory ...>` blocks—**do not save changes** until a lab explicitly asks.
4. List the lab folder: `sudo ls -la /var/www/html/css-lab/`. If it is missing, create it: `sudo mkdir -p /var/www/html/css-lab`.

### Phase 2 — Edit → save → reload habit (10 min)

- Use `sudo nano /var/www/html/css-lab/…` for small edits. After save, **one wrong character** can break CSS or HTML—re-open the file and confirm your last line is intact.
- In the browser, use **hard refresh** (`Ctrl+F5`) when styles look “stuck.” Optionally add a **cache-bust** query on `<link href="…?v=2">` and explain why that works.

### Phase 3 — Core lab work (see focus below)

**Fluid typography with clamp()**

- In `type.html` (or reuse an existing page), set `html { font-size: clamp(15px, 0.9vw + 12px, 20px); }` and style `h1` with a second `clamp()` for `font-size`.
- Resize the window slowly: note when **line length** becomes uncomfortable; adjust `max-width` on `article` in `ch` units.
- Document in your notebook **the three numbers** in `clamp(min, preferred, max)` and what each controls mathematically.
- **Checkpoint:** At 320px and 1280px width, record computed `font-size` from Computed styles.


### Phase 4 — Verify like someone on-call (15–20 min)

1. In **Firefox or Chromium on the VM**, open your page. Open **DevTools → Network**, disable cache, reload. Confirm **200** on the document and on each CSS/JS asset you expect.
2. In **Console**, confirm there are **no red errors**. If there are, read the **file name and line**; fix, reload, repeat.
3. From the shell, run `curl -sS -D- -o /tmp/lh-body.html http://127.0.0.1/` **against your lab URL path** (adjust the URL). Inspect the **first few response headers** (`Content-Type`, `Content-Length`).
4. Tail the access log while you click: `sudo tail -n 20 /var/log/apache2/access.log`. Match log lines to your requests.

### Phase 5 — Lab report (10 min)

- Write: objective, files touched, **one mistake** you made and how you proved the fix, and **one security or maintenance thought** (e.g. why `sudo` on web root is OK in class but risky in production).


#### Verify

Visual result matches the lab goal; you can explain **which file** controlled each major aspect.

#### Common mistakes

Editing the wrong CSS file path in `<link href>`—always verify with Network tab (200 on CSS).

#### Going further

Introduce a `?v=1` query on your stylesheet link when cache fights you—explain tradeoffs.

---

<!-- id: labs-kali-c-05 -->
<!-- unit: Part 2 — CSS (Apache2 on Kali) -->

### Lab C-05 — Dark mode toggle (prefers + manual)

**Suggested pace:** 60–95 minutes

**Goal:** Respect system theme and allow manual override with persistence.

#### Why this lab exists

CSS in browser devtools is fast—but **Apache-backed files** train deployment thinking: paths, cache busting during edits, and real multi-file projects.

#### Background

On Debian-based systems (including Kali), **Apache** often uses **`/var/www/html`** as the default **DocumentRoot**: files there map to URLs on port 80. Configuration lives under **`/etc/apache2/`**; logs under **`/var/log/apache2/`**. Editing files as root in the web root is normal for class labs; in production you would use deployment users, permissions, and CI instead.

All CSS labs assume files under **`/var/www/html/css-lab/`**. Create that folder once: `sudo mkdir -p /var/www/html/css-lab/styles`. Use `sudo nano` or sync from `~/labs/css` if you prefer editing in your home directory then copying—**document your workflow** in notes.

#### Commands explained (read before you type)

**Command:**

```bash
sudo mkdir -p /var/www/html/css-lab/styles
```

- **What it does:** Ensures lab directory tree exists.
- **Why we use it here:** Avoids permission errors mid-lab.

#### Procedure (go slowly)

### Phase 1 — Map the server to the filesystem (15–20 min)

1. Run `systemctl status apache2 --no-pager | head -n 20`. In your notebook, copy the **Active:** line and note **Main PID**.
2. Run `sudo apache2ctl -S 2>&1 | head -n 50`. Find which vhost answers on **:80** and which **DocumentRoot** applies. Write one sentence: “A request to `http://127.0.0.1/css-lab/index.html` should read from ___ on disk.”
3. Open `/etc/apache2/sites-enabled/000-default.conf` with `sudo nano` or `sudo less` (read-only with `less`). Locate `DocumentRoot` and `<Directory ...>` blocks—**do not save changes** until a lab explicitly asks.
4. List the lab folder: `sudo ls -la /var/www/html/css-lab/`. If it is missing, create it: `sudo mkdir -p /var/www/html/css-lab`.

### Phase 2 — Edit → save → reload habit (10 min)

- Use `sudo nano /var/www/html/css-lab/…` for small edits. After save, **one wrong character** can break CSS or HTML—re-open the file and confirm your last line is intact.
- In the browser, use **hard refresh** (`Ctrl+F5`) when styles look “stuck.” Optionally add a **cache-bust** query on `<link href="…?v=2">` and explain why that works.

### Phase 3 — Core lab work (see focus below)

**Dark mode: prefers-color-scheme + manual override**

- Start from `:root` light variables. Add `@media (prefers-color-scheme: dark)` block that swaps variables.
- Add a **toggle button** that sets a class on `<html>` (e.g. `html.force-light` / `html.force-dark`) with CSS that **wins** over media query using slightly higher specificity or order.
- Persist choice in `localStorage` (you will wire minimal JS if needed—**prefer** a tiny inline script only for this lab, or pair with the JS track).
- **Checkpoint:** Toggle while OS theme is dark and light; describe precedence in one paragraph.


### Phase 4 — Verify like someone on-call (15–20 min)

1. In **Firefox or Chromium on the VM**, open your page. Open **DevTools → Network**, disable cache, reload. Confirm **200** on the document and on each CSS/JS asset you expect.
2. In **Console**, confirm there are **no red errors**. If there are, read the **file name and line**; fix, reload, repeat.
3. From the shell, run `curl -sS -D- -o /tmp/lh-body.html http://127.0.0.1/` **against your lab URL path** (adjust the URL). Inspect the **first few response headers** (`Content-Type`, `Content-Length`).
4. Tail the access log while you click: `sudo tail -n 20 /var/log/apache2/access.log`. Match log lines to your requests.

### Phase 5 — Lab report (10 min)

- Write: objective, files touched, **one mistake** you made and how you proved the fix, and **one security or maintenance thought** (e.g. why `sudo` on web root is OK in class but risky in production).


#### Verify

Visual result matches the lab goal; you can explain **which file** controlled each major aspect.

#### Common mistakes

Editing the wrong CSS file path in `<link href>`—always verify with Network tab (200 on CSS).

#### Going further

Introduce a `?v=1` query on your stylesheet link when cache fights you—explain tradeoffs.

---

<!-- id: labs-kali-c-06 -->
<!-- unit: Part 2 — CSS (Apache2 on Kali) -->

### Lab C-06 — Animations and reduced motion

**Suggested pace:** 60–95 minutes

**Goal:** Animate respectfully with reduced-motion fallback.

#### Why this lab exists

CSS in browser devtools is fast—but **Apache-backed files** train deployment thinking: paths, cache busting during edits, and real multi-file projects.

#### Background

On Debian-based systems (including Kali), **Apache** often uses **`/var/www/html`** as the default **DocumentRoot**: files there map to URLs on port 80. Configuration lives under **`/etc/apache2/`**; logs under **`/var/log/apache2/`**. Editing files as root in the web root is normal for class labs; in production you would use deployment users, permissions, and CI instead.

All CSS labs assume files under **`/var/www/html/css-lab/`**. Create that folder once: `sudo mkdir -p /var/www/html/css-lab/styles`. Use `sudo nano` or sync from `~/labs/css` if you prefer editing in your home directory then copying—**document your workflow** in notes.

#### Commands explained (read before you type)

**Command:**

```bash
sudo mkdir -p /var/www/html/css-lab/styles
```

- **What it does:** Ensures lab directory tree exists.
- **Why we use it here:** Avoids permission errors mid-lab.

#### Procedure (go slowly)

### Phase 1 — Map the server to the filesystem (15–20 min)

1. Run `systemctl status apache2 --no-pager | head -n 20`. In your notebook, copy the **Active:** line and note **Main PID**.
2. Run `sudo apache2ctl -S 2>&1 | head -n 50`. Find which vhost answers on **:80** and which **DocumentRoot** applies. Write one sentence: “A request to `http://127.0.0.1/css-lab/index.html` should read from ___ on disk.”
3. Open `/etc/apache2/sites-enabled/000-default.conf` with `sudo nano` or `sudo less` (read-only with `less`). Locate `DocumentRoot` and `<Directory ...>` blocks—**do not save changes** until a lab explicitly asks.
4. List the lab folder: `sudo ls -la /var/www/html/css-lab/`. If it is missing, create it: `sudo mkdir -p /var/www/html/css-lab`.

### Phase 2 — Edit → save → reload habit (10 min)

- Use `sudo nano /var/www/html/css-lab/…` for small edits. After save, **one wrong character** can break CSS or HTML—re-open the file and confirm your last line is intact.
- In the browser, use **hard refresh** (`Ctrl+F5`) when styles look “stuck.” Optionally add a **cache-bust** query on `<link href="…?v=2">` and explain why that works.

### Phase 3 — Core lab work (see focus below)

**Animation + reduced motion**

- Create a **badge** with a subtle pulse (`@keyframes`). Keep animation duration long and amplitude small (professional, not flashy).
- Add `@media (prefers-reduced-motion: reduce)` that sets `animation: none` (or equivalent) for animated elements.
- In Firefox, test **Settings → Accessibility → Reduce motion** (or OS-level setting) and confirm animation stops.
- **Checkpoint:** List who benefits from reduced-motion (vestibular disorders, migraine triggers, etc.) in your report.


### Phase 4 — Verify like someone on-call (15–20 min)

1. In **Firefox or Chromium on the VM**, open your page. Open **DevTools → Network**, disable cache, reload. Confirm **200** on the document and on each CSS/JS asset you expect.
2. In **Console**, confirm there are **no red errors**. If there are, read the **file name and line**; fix, reload, repeat.
3. From the shell, run `curl -sS -D- -o /tmp/lh-body.html http://127.0.0.1/` **against your lab URL path** (adjust the URL). Inspect the **first few response headers** (`Content-Type`, `Content-Length`).
4. Tail the access log while you click: `sudo tail -n 20 /var/log/apache2/access.log`. Match log lines to your requests.

### Phase 5 — Lab report (10 min)

- Write: objective, files touched, **one mistake** you made and how you proved the fix, and **one security or maintenance thought** (e.g. why `sudo` on web root is OK in class but risky in production).


#### Verify

Visual result matches the lab goal; you can explain **which file** controlled each major aspect.

#### Common mistakes

Editing the wrong CSS file path in `<link href>`—always verify with Network tab (200 on CSS).

#### Going further

Introduce a `?v=1` query on your stylesheet link when cache fights you—explain tradeoffs.

---

<!-- id: labs-kali-c-07 -->
<!-- unit: Part 2 — CSS (Apache2 on Kali) -->

### Lab C-07 — Pure CSS interactive components

**Suggested pace:** 60–95 minutes

**Goal:** Style interactive patterns without JavaScript.

#### Why this lab exists

CSS in browser devtools is fast—but **Apache-backed files** train deployment thinking: paths, cache busting during edits, and real multi-file projects.

#### Background

On Debian-based systems (including Kali), **Apache** often uses **`/var/www/html`** as the default **DocumentRoot**: files there map to URLs on port 80. Configuration lives under **`/etc/apache2/`**; logs under **`/var/log/apache2/`**. Editing files as root in the web root is normal for class labs; in production you would use deployment users, permissions, and CI instead.

All CSS labs assume files under **`/var/www/html/css-lab/`**. Create that folder once: `sudo mkdir -p /var/www/html/css-lab/styles`. Use `sudo nano` or sync from `~/labs/css` if you prefer editing in your home directory then copying—**document your workflow** in notes.

#### Commands explained (read before you type)

**Command:**

```bash
sudo mkdir -p /var/www/html/css-lab/styles
```

- **What it does:** Ensures lab directory tree exists.
- **Why we use it here:** Avoids permission errors mid-lab.

#### Procedure (go slowly)

### Phase 1 — Map the server to the filesystem (15–20 min)

1. Run `systemctl status apache2 --no-pager | head -n 20`. In your notebook, copy the **Active:** line and note **Main PID**.
2. Run `sudo apache2ctl -S 2>&1 | head -n 50`. Find which vhost answers on **:80** and which **DocumentRoot** applies. Write one sentence: “A request to `http://127.0.0.1/css-lab/index.html` should read from ___ on disk.”
3. Open `/etc/apache2/sites-enabled/000-default.conf` with `sudo nano` or `sudo less` (read-only with `less`). Locate `DocumentRoot` and `<Directory ...>` blocks—**do not save changes** until a lab explicitly asks.
4. List the lab folder: `sudo ls -la /var/www/html/css-lab/`. If it is missing, create it: `sudo mkdir -p /var/www/html/css-lab`.

### Phase 2 — Edit → save → reload habit (10 min)

- Use `sudo nano /var/www/html/css-lab/…` for small edits. After save, **one wrong character** can break CSS or HTML—re-open the file and confirm your last line is intact.
- In the browser, use **hard refresh** (`Ctrl+F5`) when styles look “stuck.” Optionally add a **cache-bust** query on `<link href="…?v=2">` and explain why that works.

### Phase 3 — Core lab work (see focus below)

**Pure CSS interactivity**

- Build an FAQ with `<details><summary>…</summary>…</details>`. Style `summary` with `:focus-visible` outline and hover state.
- Add a **no-JS** hover card using nested rules (border, shadow). Keep contrast AA where possible.
- **Checkpoint:** Tab to each summary; ensure visible focus and logical order.


### Phase 4 — Verify like someone on-call (15–20 min)

1. In **Firefox or Chromium on the VM**, open your page. Open **DevTools → Network**, disable cache, reload. Confirm **200** on the document and on each CSS/JS asset you expect.
2. In **Console**, confirm there are **no red errors**. If there are, read the **file name and line**; fix, reload, repeat.
3. From the shell, run `curl -sS -D- -o /tmp/lh-body.html http://127.0.0.1/` **against your lab URL path** (adjust the URL). Inspect the **first few response headers** (`Content-Type`, `Content-Length`).
4. Tail the access log while you click: `sudo tail -n 20 /var/log/apache2/access.log`. Match log lines to your requests.

### Phase 5 — Lab report (10 min)

- Write: objective, files touched, **one mistake** you made and how you proved the fix, and **one security or maintenance thought** (e.g. why `sudo` on web root is OK in class but risky in production).


#### Verify

Visual result matches the lab goal; you can explain **which file** controlled each major aspect.

#### Common mistakes

Editing the wrong CSS file path in `<link href>`—always verify with Network tab (200 on CSS).

#### Going further

Introduce a `?v=1` query on your stylesheet link when cache fights you—explain tradeoffs.

---

<!-- id: labs-kali-c-08 -->
<!-- unit: Part 2 — CSS (Apache2 on Kali) -->

### Lab C-08 — Positioning and stacking contexts

**Suggested pace:** 60–95 minutes

**Goal:** Use sticky positioning and debug stacking contexts.

#### Why this lab exists

CSS in browser devtools is fast—but **Apache-backed files** train deployment thinking: paths, cache busting during edits, and real multi-file projects.

#### Background

On Debian-based systems (including Kali), **Apache** often uses **`/var/www/html`** as the default **DocumentRoot**: files there map to URLs on port 80. Configuration lives under **`/etc/apache2/`**; logs under **`/var/log/apache2/`**. Editing files as root in the web root is normal for class labs; in production you would use deployment users, permissions, and CI instead.

All CSS labs assume files under **`/var/www/html/css-lab/`**. Create that folder once: `sudo mkdir -p /var/www/html/css-lab/styles`. Use `sudo nano` or sync from `~/labs/css` if you prefer editing in your home directory then copying—**document your workflow** in notes.

#### Commands explained (read before you type)

**Command:**

```bash
sudo mkdir -p /var/www/html/css-lab/styles
```

- **What it does:** Ensures lab directory tree exists.
- **Why we use it here:** Avoids permission errors mid-lab.

#### Procedure (go slowly)

### Phase 1 — Map the server to the filesystem (15–20 min)

1. Run `systemctl status apache2 --no-pager | head -n 20`. In your notebook, copy the **Active:** line and note **Main PID**.
2. Run `sudo apache2ctl -S 2>&1 | head -n 50`. Find which vhost answers on **:80** and which **DocumentRoot** applies. Write one sentence: “A request to `http://127.0.0.1/css-lab/index.html` should read from ___ on disk.”
3. Open `/etc/apache2/sites-enabled/000-default.conf` with `sudo nano` or `sudo less` (read-only with `less`). Locate `DocumentRoot` and `<Directory ...>` blocks—**do not save changes** until a lab explicitly asks.
4. List the lab folder: `sudo ls -la /var/www/html/css-lab/`. If it is missing, create it: `sudo mkdir -p /var/www/html/css-lab`.

### Phase 2 — Edit → save → reload habit (10 min)

- Use `sudo nano /var/www/html/css-lab/…` for small edits. After save, **one wrong character** can break CSS or HTML—re-open the file and confirm your last line is intact.
- In the browser, use **hard refresh** (`Ctrl+F5`) when styles look “stuck.” Optionally add a **cache-bust** query on `<link href="…?v=2">` and explain why that works.

### Phase 3 — Core lab work (see focus below)

**Sticky header + stacking**

- Create overlapping `.card` elements. Intentionally set **wrong** `z-index` once, observe occlusion, then fix by creating a deliberate **stacking context** (`isolation: isolate` on a parent or `position: relative; z-index: 0`).
- Add `position: sticky; top: 0` on a header inside a scrollable `<main>`—note **which ancestor** must not have `overflow: hidden` or sticky breaks.
- **Checkpoint:** In DevTools **3D view** (if available) or Layers panel, describe what changed after the fix.


### Phase 4 — Verify like someone on-call (15–20 min)

1. In **Firefox or Chromium on the VM**, open your page. Open **DevTools → Network**, disable cache, reload. Confirm **200** on the document and on each CSS/JS asset you expect.
2. In **Console**, confirm there are **no red errors**. If there are, read the **file name and line**; fix, reload, repeat.
3. From the shell, run `curl -sS -D- -o /tmp/lh-body.html http://127.0.0.1/` **against your lab URL path** (adjust the URL). Inspect the **first few response headers** (`Content-Type`, `Content-Length`).
4. Tail the access log while you click: `sudo tail -n 20 /var/log/apache2/access.log`. Match log lines to your requests.

### Phase 5 — Lab report (10 min)

- Write: objective, files touched, **one mistake** you made and how you proved the fix, and **one security or maintenance thought** (e.g. why `sudo` on web root is OK in class but risky in production).


#### Verify

Visual result matches the lab goal; you can explain **which file** controlled each major aspect.

#### Common mistakes

Editing the wrong CSS file path in `<link href>`—always verify with Network tab (200 on CSS).

#### Going further

Introduce a `?v=1` query on your stylesheet link when cache fights you—explain tradeoffs.

---

<!-- id: labs-kali-c-09 -->
<!-- unit: Part 2 — CSS (Apache2 on Kali) -->

### Lab C-09 — Print stylesheet

**Suggested pace:** 60–95 minutes

**Goal:** Craft a print-specific stylesheet.

#### Why this lab exists

CSS in browser devtools is fast—but **Apache-backed files** train deployment thinking: paths, cache busting during edits, and real multi-file projects.

#### Background

On Debian-based systems (including Kali), **Apache** often uses **`/var/www/html`** as the default **DocumentRoot**: files there map to URLs on port 80. Configuration lives under **`/etc/apache2/`**; logs under **`/var/log/apache2/`**. Editing files as root in the web root is normal for class labs; in production you would use deployment users, permissions, and CI instead.

All CSS labs assume files under **`/var/www/html/css-lab/`**. Create that folder once: `sudo mkdir -p /var/www/html/css-lab/styles`. Use `sudo nano` or sync from `~/labs/css` if you prefer editing in your home directory then copying—**document your workflow** in notes.

#### Commands explained (read before you type)

**Command:**

```bash
sudo mkdir -p /var/www/html/css-lab/styles
```

- **What it does:** Ensures lab directory tree exists.
- **Why we use it here:** Avoids permission errors mid-lab.

#### Procedure (go slowly)

### Phase 1 — Map the server to the filesystem (15–20 min)

1. Run `systemctl status apache2 --no-pager | head -n 20`. In your notebook, copy the **Active:** line and note **Main PID**.
2. Run `sudo apache2ctl -S 2>&1 | head -n 50`. Find which vhost answers on **:80** and which **DocumentRoot** applies. Write one sentence: “A request to `http://127.0.0.1/css-lab/index.html` should read from ___ on disk.”
3. Open `/etc/apache2/sites-enabled/000-default.conf` with `sudo nano` or `sudo less` (read-only with `less`). Locate `DocumentRoot` and `<Directory ...>` blocks—**do not save changes** until a lab explicitly asks.
4. List the lab folder: `sudo ls -la /var/www/html/css-lab/`. If it is missing, create it: `sudo mkdir -p /var/www/html/css-lab`.

### Phase 2 — Edit → save → reload habit (10 min)

- Use `sudo nano /var/www/html/css-lab/…` for small edits. After save, **one wrong character** can break CSS or HTML—re-open the file and confirm your last line is intact.
- In the browser, use **hard refresh** (`Ctrl+F5`) when styles look “stuck.” Optionally add a **cache-bust** query on `<link href="…?v=2">` and explain why that works.

### Phase 3 — Core lab work (see focus below)

**Print stylesheet**

- Add `@media print` rules: hide nav, remove background colors that waste ink, set `body { color: #000; background: #fff }`, widen content.
- Use `break-inside: avoid` on headings paired with following paragraphs where needed.
- **Checkpoint:** Print to PDF; open PDF and verify page breaks are acceptable.


### Phase 4 — Verify like someone on-call (15–20 min)

1. In **Firefox or Chromium on the VM**, open your page. Open **DevTools → Network**, disable cache, reload. Confirm **200** on the document and on each CSS/JS asset you expect.
2. In **Console**, confirm there are **no red errors**. If there are, read the **file name and line**; fix, reload, repeat.
3. From the shell, run `curl -sS -D- -o /tmp/lh-body.html http://127.0.0.1/` **against your lab URL path** (adjust the URL). Inspect the **first few response headers** (`Content-Type`, `Content-Length`).
4. Tail the access log while you click: `sudo tail -n 20 /var/log/apache2/access.log`. Match log lines to your requests.

### Phase 5 — Lab report (10 min)

- Write: objective, files touched, **one mistake** you made and how you proved the fix, and **one security or maintenance thought** (e.g. why `sudo` on web root is OK in class but risky in production).


#### Verify

Visual result matches the lab goal; you can explain **which file** controlled each major aspect.

#### Common mistakes

Editing the wrong CSS file path in `<link href>`—always verify with Network tab (200 on CSS).

#### Going further

Introduce a `?v=1` query on your stylesheet link when cache fights you—explain tradeoffs.

---

<!-- id: labs-kali-c-10 -->
<!-- unit: Part 2 — CSS (Apache2 on Kali) -->

### Lab C-10 — BEM-style naming refactor

**Suggested pace:** 60–95 minutes

**Goal:** Refactor messy class names to BEM-like clarity without visual change.

#### Why this lab exists

CSS in browser devtools is fast—but **Apache-backed files** train deployment thinking: paths, cache busting during edits, and real multi-file projects.

#### Background

On Debian-based systems (including Kali), **Apache** often uses **`/var/www/html`** as the default **DocumentRoot**: files there map to URLs on port 80. Configuration lives under **`/etc/apache2/`**; logs under **`/var/log/apache2/`**. Editing files as root in the web root is normal for class labs; in production you would use deployment users, permissions, and CI instead.

All CSS labs assume files under **`/var/www/html/css-lab/`**. Create that folder once: `sudo mkdir -p /var/www/html/css-lab/styles`. Use `sudo nano` or sync from `~/labs/css` if you prefer editing in your home directory then copying—**document your workflow** in notes.

#### Commands explained (read before you type)

**Command:**

```bash
sudo mkdir -p /var/www/html/css-lab/styles
```

- **What it does:** Ensures lab directory tree exists.
- **Why we use it here:** Avoids permission errors mid-lab.

#### Procedure (go slowly)

### Phase 1 — Map the server to the filesystem (15–20 min)

1. Run `systemctl status apache2 --no-pager | head -n 20`. In your notebook, copy the **Active:** line and note **Main PID**.
2. Run `sudo apache2ctl -S 2>&1 | head -n 50`. Find which vhost answers on **:80** and which **DocumentRoot** applies. Write one sentence: “A request to `http://127.0.0.1/css-lab/index.html` should read from ___ on disk.”
3. Open `/etc/apache2/sites-enabled/000-default.conf` with `sudo nano` or `sudo less` (read-only with `less`). Locate `DocumentRoot` and `<Directory ...>` blocks—**do not save changes** until a lab explicitly asks.
4. List the lab folder: `sudo ls -la /var/www/html/css-lab/`. If it is missing, create it: `sudo mkdir -p /var/www/html/css-lab`.

### Phase 2 — Edit → save → reload habit (10 min)

- Use `sudo nano /var/www/html/css-lab/…` for small edits. After save, **one wrong character** can break CSS or HTML—re-open the file and confirm your last line is intact.
- In the browser, use **hard refresh** (`Ctrl+F5`) when styles look “stuck.” Optionally add a **cache-bust** query on `<link href="…?v=2">` and explain why that works.

### Phase 3 — Core lab work (see focus below)

**BEM-style refactor**

- Start from a deliberately messy `messy.html` + `messy.css` (create them with vague class names like `box1`, `red`).
- Refactor to **block__element--modifier** style names **without** changing the visual result (pixel-approximate is fine).
- **Checkpoint:** Side-by-side before/after screenshot or description of naming only.


### Phase 4 — Verify like someone on-call (15–20 min)

1. In **Firefox or Chromium on the VM**, open your page. Open **DevTools → Network**, disable cache, reload. Confirm **200** on the document and on each CSS/JS asset you expect.
2. In **Console**, confirm there are **no red errors**. If there are, read the **file name and line**; fix, reload, repeat.
3. From the shell, run `curl -sS -D- -o /tmp/lh-body.html http://127.0.0.1/` **against your lab URL path** (adjust the URL). Inspect the **first few response headers** (`Content-Type`, `Content-Length`).
4. Tail the access log while you click: `sudo tail -n 20 /var/log/apache2/access.log`. Match log lines to your requests.

### Phase 5 — Lab report (10 min)

- Write: objective, files touched, **one mistake** you made and how you proved the fix, and **one security or maintenance thought** (e.g. why `sudo` on web root is OK in class but risky in production).


#### Verify

Visual result matches the lab goal; you can explain **which file** controlled each major aspect.

#### Common mistakes

Editing the wrong CSS file path in `<link href>`—always verify with Network tab (200 on CSS).

#### Going further

Introduce a `?v=1` query on your stylesheet link when cache fights you—explain tradeoffs.

---

<!-- id: labs-kali-c-11 -->
<!-- unit: Part 2 — CSS (Apache2 on Kali) -->

### Lab C-11 — Responsive images with `srcset` / sizes

**Suggested pace:** 60–95 minutes

**Goal:** Pair HTML responsive images with CSS that supports layout.

#### Why this lab exists

CSS in browser devtools is fast—but **Apache-backed files** train deployment thinking: paths, cache busting during edits, and real multi-file projects.

#### Background

On Debian-based systems (including Kali), **Apache** often uses **`/var/www/html`** as the default **DocumentRoot**: files there map to URLs on port 80. Configuration lives under **`/etc/apache2/`**; logs under **`/var/log/apache2/`**. Editing files as root in the web root is normal for class labs; in production you would use deployment users, permissions, and CI instead.

All CSS labs assume files under **`/var/www/html/css-lab/`**. Create that folder once: `sudo mkdir -p /var/www/html/css-lab/styles`. Use `sudo nano` or sync from `~/labs/css` if you prefer editing in your home directory then copying—**document your workflow** in notes.

#### Commands explained (read before you type)

**Command:**

```bash
sudo mkdir -p /var/www/html/css-lab/styles
```

- **What it does:** Ensures lab directory tree exists.
- **Why we use it here:** Avoids permission errors mid-lab.

#### Procedure (go slowly)

### Phase 1 — Map the server to the filesystem (15–20 min)

1. Run `systemctl status apache2 --no-pager | head -n 20`. In your notebook, copy the **Active:** line and note **Main PID**.
2. Run `sudo apache2ctl -S 2>&1 | head -n 50`. Find which vhost answers on **:80** and which **DocumentRoot** applies. Write one sentence: “A request to `http://127.0.0.1/css-lab/index.html` should read from ___ on disk.”
3. Open `/etc/apache2/sites-enabled/000-default.conf` with `sudo nano` or `sudo less` (read-only with `less`). Locate `DocumentRoot` and `<Directory ...>` blocks—**do not save changes** until a lab explicitly asks.
4. List the lab folder: `sudo ls -la /var/www/html/css-lab/`. If it is missing, create it: `sudo mkdir -p /var/www/html/css-lab`.

### Phase 2 — Edit → save → reload habit (10 min)

- Use `sudo nano /var/www/html/css-lab/…` for small edits. After save, **one wrong character** can break CSS or HTML—re-open the file and confirm your last line is intact.
- In the browser, use **hard refresh** (`Ctrl+F5`) when styles look “stuck.” Optionally add a **cache-bust** query on `<link href="…?v=2">` and explain why that works.

### Phase 3 — Core lab work (see focus below)

**srcset / sizes with layout CSS**

- Pair with prior HTML image assets. In HTML, add `srcset` widths and a thoughtful `sizes` attribute describing layout breakpoints.
- In CSS, constrain the `<img>` with `max-width:100%; height:auto` and a subtle `object-fit` if cropping applies.
- **Checkpoint:** In Network, show which downloaded width you got at two viewport sizes.


### Phase 4 — Verify like someone on-call (15–20 min)

1. In **Firefox or Chromium on the VM**, open your page. Open **DevTools → Network**, disable cache, reload. Confirm **200** on the document and on each CSS/JS asset you expect.
2. In **Console**, confirm there are **no red errors**. If there are, read the **file name and line**; fix, reload, repeat.
3. From the shell, run `curl -sS -D- -o /tmp/lh-body.html http://127.0.0.1/` **against your lab URL path** (adjust the URL). Inspect the **first few response headers** (`Content-Type`, `Content-Length`).
4. Tail the access log while you click: `sudo tail -n 20 /var/log/apache2/access.log`. Match log lines to your requests.

### Phase 5 — Lab report (10 min)

- Write: objective, files touched, **one mistake** you made and how you proved the fix, and **one security or maintenance thought** (e.g. why `sudo` on web root is OK in class but risky in production).


#### Verify

Visual result matches the lab goal; you can explain **which file** controlled each major aspect.

#### Common mistakes

Editing the wrong CSS file path in `<link href>`—always verify with Network tab (200 on CSS).

#### Going further

Introduce a `?v=1` query on your stylesheet link when cache fights you—explain tradeoffs.

---

<!-- id: labs-kali-c-12 -->
<!-- unit: Part 2 — CSS (Apache2 on Kali) -->

### Lab C-12 — CSS layers (`@layer`) experiment

**Suggested pace:** 60–95 minutes

**Goal:** Demonstrate cascade control with @layer.

#### Why this lab exists

CSS in browser devtools is fast—but **Apache-backed files** train deployment thinking: paths, cache busting during edits, and real multi-file projects.

#### Background

On Debian-based systems (including Kali), **Apache** often uses **`/var/www/html`** as the default **DocumentRoot**: files there map to URLs on port 80. Configuration lives under **`/etc/apache2/`**; logs under **`/var/log/apache2/`**. Editing files as root in the web root is normal for class labs; in production you would use deployment users, permissions, and CI instead.

All CSS labs assume files under **`/var/www/html/css-lab/`**. Create that folder once: `sudo mkdir -p /var/www/html/css-lab/styles`. Use `sudo nano` or sync from `~/labs/css` if you prefer editing in your home directory then copying—**document your workflow** in notes.

#### Commands explained (read before you type)

**Command:**

```bash
sudo mkdir -p /var/www/html/css-lab/styles
```

- **What it does:** Ensures lab directory tree exists.
- **Why we use it here:** Avoids permission errors mid-lab.

#### Procedure (go slowly)

### Phase 1 — Map the server to the filesystem (15–20 min)

1. Run `systemctl status apache2 --no-pager | head -n 20`. In your notebook, copy the **Active:** line and note **Main PID**.
2. Run `sudo apache2ctl -S 2>&1 | head -n 50`. Find which vhost answers on **:80** and which **DocumentRoot** applies. Write one sentence: “A request to `http://127.0.0.1/css-lab/index.html` should read from ___ on disk.”
3. Open `/etc/apache2/sites-enabled/000-default.conf` with `sudo nano` or `sudo less` (read-only with `less`). Locate `DocumentRoot` and `<Directory ...>` blocks—**do not save changes** until a lab explicitly asks.
4. List the lab folder: `sudo ls -la /var/www/html/css-lab/`. If it is missing, create it: `sudo mkdir -p /var/www/html/css-lab`.

### Phase 2 — Edit → save → reload habit (10 min)

- Use `sudo nano /var/www/html/css-lab/…` for small edits. After save, **one wrong character** can break CSS or HTML—re-open the file and confirm your last line is intact.
- In the browser, use **hard refresh** (`Ctrl+F5`) when styles look “stuck.” Optionally add a **cache-bust** query on `<link href="…?v=2">` and explain why that works.

### Phase 3 — Core lab work (see focus below)

**`@layer` cascade experiment**

- Declare `@layer base, utilities;` then put conflicting rules in different layers—demonstrate that **layer order** beats source order.
- Add one unlayered rule and explain how it interacts (spec reading: unlayered vs layered).
- **Checkpoint:** In DevTools Styles, show which layer name appears next to the winning rule.


### Phase 4 — Verify like someone on-call (15–20 min)

1. In **Firefox or Chromium on the VM**, open your page. Open **DevTools → Network**, disable cache, reload. Confirm **200** on the document and on each CSS/JS asset you expect.
2. In **Console**, confirm there are **no red errors**. If there are, read the **file name and line**; fix, reload, repeat.
3. From the shell, run `curl -sS -D- -o /tmp/lh-body.html http://127.0.0.1/` **against your lab URL path** (adjust the URL). Inspect the **first few response headers** (`Content-Type`, `Content-Length`).
4. Tail the access log while you click: `sudo tail -n 20 /var/log/apache2/access.log`. Match log lines to your requests.

### Phase 5 — Lab report (10 min)

- Write: objective, files touched, **one mistake** you made and how you proved the fix, and **one security or maintenance thought** (e.g. why `sudo` on web root is OK in class but risky in production).


#### Verify

Visual result matches the lab goal; you can explain **which file** controlled each major aspect.

#### Common mistakes

Editing the wrong CSS file path in `<link href>`—always verify with Network tab (200 on CSS).

#### Going further

Introduce a `?v=1` query on your stylesheet link when cache fights you—explain tradeoffs.

---

<!-- id: labs-kali-j-01 -->
<!-- unit: Part 3 — JavaScript (Apache2 on Kali) -->

### Lab J-01 — Strict mode and modules

**Suggested pace:** 70–110 minutes

**Goal:** Use ES modules with `import`/`export` behind Apache.

#### Why this lab exists

Browser JS labs on a real server highlight **module paths**, **MIME types**, and caching—issues you rarely see in a single-file playground.

#### Background

On Debian-based systems (including Kali), **Apache** often uses **`/var/www/html`** as the default **DocumentRoot**: files there map to URLs on port 80. Configuration lives under **`/etc/apache2/`**; logs under **`/var/log/apache2/`**. Editing files as root in the web root is normal for class labs; in production you would use deployment users, permissions, and CI instead.

JavaScript runs in the browser under **origin rules** (scheme/host/port). Serving from `http://127.0.0.1` keeps examples predictable. Use **DevTools Console** for errors—read stack traces slowly.

#### Procedure (go slowly)

### Phase 1 — Map the server to the filesystem (15–20 min)

1. Run `systemctl status apache2 --no-pager | head -n 20`. In your notebook, copy the **Active:** line and note **Main PID**.
2. Run `sudo apache2ctl -S 2>&1 | head -n 50`. Find which vhost answers on **:80** and which **DocumentRoot** applies. Write one sentence: “A request to `http://127.0.0.1/js-lab/index.html` should read from ___ on disk.”
3. Open `/etc/apache2/sites-enabled/000-default.conf` with `sudo nano` or `sudo less` (read-only with `less`). Locate `DocumentRoot` and `<Directory ...>` blocks—**do not save changes** until a lab explicitly asks.
4. List the lab folder: `sudo ls -la /var/www/html/js-lab/`. If it is missing, create it: `sudo mkdir -p /var/www/html/js-lab`.

### Phase 2 — Edit → save → reload habit (10 min)

- Use `sudo nano /var/www/html/js-lab/…` for small edits. After save, **one wrong character** can break CSS or HTML—re-open the file and confirm your last line is intact.
- In the browser, use **hard refresh** (`Ctrl+F5`) when styles look “stuck.” Optionally add a **cache-bust** query on `<link href="…?v=2">` and explain why that works.

### Phase 3 — Core lab work (see focus below)

**ES modules under Apache**

- Create `/var/www/html/js-lab/index.html` with `<script type="module" src="./app.js"></script>` (note `type="module"`).
- In `app.js`, `import { helper } from './utils.js'` and call it. In `utils.js`, `export function helper(){…}`.
- Open DevTools **Network**: confirm `app.js` loads with MIME type **JavaScript** and that **utils.js** is a second request.
- **Checkpoint:** Change a string in `utils.js`, hard refresh, confirm the change—explain **caching** if it does not appear.


### Phase 4 — Verify like someone on-call (15–20 min)

1. In **Firefox or Chromium on the VM**, open your page. Open **DevTools → Network**, disable cache, reload. Confirm **200** on the document and on each CSS/JS asset you expect.
2. In **Console**, confirm there are **no red errors**. If there are, read the **file name and line**; fix, reload, repeat.
3. From the shell, run `curl -sS -D- -o /tmp/lh-body.html http://127.0.0.1/` **against your lab URL path** (adjust the URL). Inspect the **first few response headers** (`Content-Type`, `Content-Length`).
4. Tail the access log while you click: `sudo tail -n 20 /var/log/apache2/access.log`. Match log lines to your requests.

### Phase 5 — Lab report (10 min)

- Write: objective, files touched, **one mistake** you made and how you proved the fix, and **one security or maintenance thought** (e.g. why `sudo` on web root is OK in class but risky in production).


#### Verify

Behavior matches goal; console clean; you can narrate the **data flow**.

#### Common mistakes

MIME/type errors for `.js` modules—ensure Apache serves JavaScript as `application/javascript` (default on Kali).

#### Going further

Try splitting modules further and observe caching headers (conceptual).

---

<!-- id: labs-kali-j-02 -->
<!-- unit: Part 3 — JavaScript (Apache2 on Kali) -->

### Lab J-02 — DOM events and delegation

**Suggested pace:** 70–110 minutes

**Goal:** Handle dynamic rows with event delegation.

#### Why this lab exists

Browser JS labs on a real server highlight **module paths**, **MIME types**, and caching—issues you rarely see in a single-file playground.

#### Background

On Debian-based systems (including Kali), **Apache** often uses **`/var/www/html`** as the default **DocumentRoot**: files there map to URLs on port 80. Configuration lives under **`/etc/apache2/`**; logs under **`/var/log/apache2/`**. Editing files as root in the web root is normal for class labs; in production you would use deployment users, permissions, and CI instead.

JavaScript runs in the browser under **origin rules** (scheme/host/port). Serving from `http://127.0.0.1` keeps examples predictable. Use **DevTools Console** for errors—read stack traces slowly.

#### Procedure (go slowly)

### Phase 1 — Map the server to the filesystem (15–20 min)

1. Run `systemctl status apache2 --no-pager | head -n 20`. In your notebook, copy the **Active:** line and note **Main PID**.
2. Run `sudo apache2ctl -S 2>&1 | head -n 50`. Find which vhost answers on **:80** and which **DocumentRoot** applies. Write one sentence: “A request to `http://127.0.0.1/js-lab/index.html` should read from ___ on disk.”
3. Open `/etc/apache2/sites-enabled/000-default.conf` with `sudo nano` or `sudo less` (read-only with `less`). Locate `DocumentRoot` and `<Directory ...>` blocks—**do not save changes** until a lab explicitly asks.
4. List the lab folder: `sudo ls -la /var/www/html/js-lab/`. If it is missing, create it: `sudo mkdir -p /var/www/html/js-lab`.

### Phase 2 — Edit → save → reload habit (10 min)

- Use `sudo nano /var/www/html/js-lab/…` for small edits. After save, **one wrong character** can break CSS or HTML—re-open the file and confirm your last line is intact.
- In the browser, use **hard refresh** (`Ctrl+F5`) when styles look “stuck.” Optionally add a **cache-bust** query on `<link href="…?v=2">` and explain why that works.

### Phase 3 — Core lab work (see focus below)

**Event delegation**

- Build a small table of “tickets.” Add **one** click listener on `<tbody>` (or the table) and use `event.target.closest('button')` to detect which row’s button fired.
- Add a row dynamically with `insertRow` and confirm **no new listeners** were required.
- **Checkpoint:** Explain memory and maintenance benefits in 3–5 sentences.


### Phase 4 — Verify like someone on-call (15–20 min)

1. In **Firefox or Chromium on the VM**, open your page. Open **DevTools → Network**, disable cache, reload. Confirm **200** on the document and on each CSS/JS asset you expect.
2. In **Console**, confirm there are **no red errors**. If there are, read the **file name and line**; fix, reload, repeat.
3. From the shell, run `curl -sS -D- -o /tmp/lh-body.html http://127.0.0.1/` **against your lab URL path** (adjust the URL). Inspect the **first few response headers** (`Content-Type`, `Content-Length`).
4. Tail the access log while you click: `sudo tail -n 20 /var/log/apache2/access.log`. Match log lines to your requests.

### Phase 5 — Lab report (10 min)

- Write: objective, files touched, **one mistake** you made and how you proved the fix, and **one security or maintenance thought** (e.g. why `sudo` on web root is OK in class but risky in production).


#### Verify

Behavior matches goal; console clean; you can narrate the **data flow**.

#### Common mistakes

MIME/type errors for `.js` modules—ensure Apache serves JavaScript as `application/javascript` (default on Kali).

#### Going further

Try splitting modules further and observe caching headers (conceptual).

---

<!-- id: labs-kali-j-03 -->
<!-- unit: Part 3 — JavaScript (Apache2 on Kali) -->

### Lab J-03 — Form validation (client-side)

**Suggested pace:** 70–110 minutes

**Goal:** Use the Constraint Validation API with custom messages.

#### Why this lab exists

Browser JS labs on a real server highlight **module paths**, **MIME types**, and caching—issues you rarely see in a single-file playground.

#### Background

On Debian-based systems (including Kali), **Apache** often uses **`/var/www/html`** as the default **DocumentRoot**: files there map to URLs on port 80. Configuration lives under **`/etc/apache2/`**; logs under **`/var/log/apache2/`**. Editing files as root in the web root is normal for class labs; in production you would use deployment users, permissions, and CI instead.

JavaScript runs in the browser under **origin rules** (scheme/host/port). Serving from `http://127.0.0.1` keeps examples predictable. Use **DevTools Console** for errors—read stack traces slowly.

#### Procedure (go slowly)

### Phase 1 — Map the server to the filesystem (15–20 min)

1. Run `systemctl status apache2 --no-pager | head -n 20`. In your notebook, copy the **Active:** line and note **Main PID**.
2. Run `sudo apache2ctl -S 2>&1 | head -n 50`. Find which vhost answers on **:80** and which **DocumentRoot** applies. Write one sentence: “A request to `http://127.0.0.1/js-lab/index.html` should read from ___ on disk.”
3. Open `/etc/apache2/sites-enabled/000-default.conf` with `sudo nano` or `sudo less` (read-only with `less`). Locate `DocumentRoot` and `<Directory ...>` blocks—**do not save changes** until a lab explicitly asks.
4. List the lab folder: `sudo ls -la /var/www/html/js-lab/`. If it is missing, create it: `sudo mkdir -p /var/www/html/js-lab`.

### Phase 2 — Edit → save → reload habit (10 min)

- Use `sudo nano /var/www/html/js-lab/…` for small edits. After save, **one wrong character** can break CSS or HTML—re-open the file and confirm your last line is intact.
- In the browser, use **hard refresh** (`Ctrl+F5`) when styles look “stuck.” Optionally add a **cache-bust** query on `<link href="…?v=2">` and explain why that works.

### Phase 3 — Core lab work (see focus below)

**Constraint Validation API**

- Build a form with `required`, `pattern`, and `type="email"`. On `submit`, call `reportValidity()` and use `setCustomValidity` for cross-field rules (e.g. password confirmation).
- Style `:invalid` / `:user-invalid` carefully so errors are visible but not screaming.
- **Checkpoint:** Show both a passing and failing submit in screenshots or console logs.


### Phase 4 — Verify like someone on-call (15–20 min)

1. In **Firefox or Chromium on the VM**, open your page. Open **DevTools → Network**, disable cache, reload. Confirm **200** on the document and on each CSS/JS asset you expect.
2. In **Console**, confirm there are **no red errors**. If there are, read the **file name and line**; fix, reload, repeat.
3. From the shell, run `curl -sS -D- -o /tmp/lh-body.html http://127.0.0.1/` **against your lab URL path** (adjust the URL). Inspect the **first few response headers** (`Content-Type`, `Content-Length`).
4. Tail the access log while you click: `sudo tail -n 20 /var/log/apache2/access.log`. Match log lines to your requests.

### Phase 5 — Lab report (10 min)

- Write: objective, files touched, **one mistake** you made and how you proved the fix, and **one security or maintenance thought** (e.g. why `sudo` on web root is OK in class but risky in production).


#### Verify

Behavior matches goal; console clean; you can narrate the **data flow**.

#### Common mistakes

MIME/type errors for `.js` modules—ensure Apache serves JavaScript as `application/javascript` (default on Kali).

#### Going further

Try splitting modules further and observe caching headers (conceptual).

---

<!-- id: labs-kali-j-04 -->
<!-- unit: Part 3 — JavaScript (Apache2 on Kali) -->

### Lab J-04 — Fetch + JSON

**Suggested pace:** 70–110 minutes

**Goal:** Fetch remote JSON and render cards with error UI.

#### Why this lab exists

Browser JS labs on a real server highlight **module paths**, **MIME types**, and caching—issues you rarely see in a single-file playground.

#### Background

On Debian-based systems (including Kali), **Apache** often uses **`/var/www/html`** as the default **DocumentRoot**: files there map to URLs on port 80. Configuration lives under **`/etc/apache2/`**; logs under **`/var/log/apache2/`**. Editing files as root in the web root is normal for class labs; in production you would use deployment users, permissions, and CI instead.

JavaScript runs in the browser under **origin rules** (scheme/host/port). Serving from `http://127.0.0.1` keeps examples predictable. Use **DevTools Console** for errors—read stack traces slowly.

#### Procedure (go slowly)

### Phase 1 — Map the server to the filesystem (15–20 min)

1. Run `systemctl status apache2 --no-pager | head -n 20`. In your notebook, copy the **Active:** line and note **Main PID**.
2. Run `sudo apache2ctl -S 2>&1 | head -n 50`. Find which vhost answers on **:80** and which **DocumentRoot** applies. Write one sentence: “A request to `http://127.0.0.1/js-lab/index.html` should read from ___ on disk.”
3. Open `/etc/apache2/sites-enabled/000-default.conf` with `sudo nano` or `sudo less` (read-only with `less`). Locate `DocumentRoot` and `<Directory ...>` blocks—**do not save changes** until a lab explicitly asks.
4. List the lab folder: `sudo ls -la /var/www/html/js-lab/`. If it is missing, create it: `sudo mkdir -p /var/www/html/js-lab`.

### Phase 2 — Edit → save → reload habit (10 min)

- Use `sudo nano /var/www/html/js-lab/…` for small edits. After save, **one wrong character** can break CSS or HTML—re-open the file and confirm your last line is intact.
- In the browser, use **hard refresh** (`Ctrl+F5`) when styles look “stuck.” Optionally add a **cache-bust** query on `<link href="…?v=2">` and explain why that works.

### Phase 3 — Core lab work (see focus below)

**fetch + JSON**

- Use `fetch('https://jsonplaceholder.typicode.com/posts?_limit=6')` (read-only). Parse JSON, render cards in the DOM.
- Simulate failure: temporarily break the URL and show a **friendly** in-page error with retry button.
- **Checkpoint:** Capture Network tab for success vs failure.


### Phase 4 — Verify like someone on-call (15–20 min)

1. In **Firefox or Chromium on the VM**, open your page. Open **DevTools → Network**, disable cache, reload. Confirm **200** on the document and on each CSS/JS asset you expect.
2. In **Console**, confirm there are **no red errors**. If there are, read the **file name and line**; fix, reload, repeat.
3. From the shell, run `curl -sS -D- -o /tmp/lh-body.html http://127.0.0.1/` **against your lab URL path** (adjust the URL). Inspect the **first few response headers** (`Content-Type`, `Content-Length`).
4. Tail the access log while you click: `sudo tail -n 20 /var/log/apache2/access.log`. Match log lines to your requests.

### Phase 5 — Lab report (10 min)

- Write: objective, files touched, **one mistake** you made and how you proved the fix, and **one security or maintenance thought** (e.g. why `sudo` on web root is OK in class but risky in production).


#### Verify

Behavior matches goal; console clean; you can narrate the **data flow**.

#### Common mistakes

MIME/type errors for `.js` modules—ensure Apache serves JavaScript as `application/javascript` (default on Kali).

#### Going further

Try splitting modules further and observe caching headers (conceptual).

---

<!-- id: labs-kali-j-05 -->
<!-- unit: Part 3 — JavaScript (Apache2 on Kali) -->

### Lab J-05 — Async patterns

**Suggested pace:** 70–110 minutes

**Goal:** Combine async/await, Promise.all, and AbortController timeout.

#### Why this lab exists

Browser JS labs on a real server highlight **module paths**, **MIME types**, and caching—issues you rarely see in a single-file playground.

#### Background

On Debian-based systems (including Kali), **Apache** often uses **`/var/www/html`** as the default **DocumentRoot**: files there map to URLs on port 80. Configuration lives under **`/etc/apache2/`**; logs under **`/var/log/apache2/`**. Editing files as root in the web root is normal for class labs; in production you would use deployment users, permissions, and CI instead.

JavaScript runs in the browser under **origin rules** (scheme/host/port). Serving from `http://127.0.0.1` keeps examples predictable. Use **DevTools Console** for errors—read stack traces slowly.

#### Procedure (go slowly)

### Phase 1 — Map the server to the filesystem (15–20 min)

1. Run `systemctl status apache2 --no-pager | head -n 20`. In your notebook, copy the **Active:** line and note **Main PID**.
2. Run `sudo apache2ctl -S 2>&1 | head -n 50`. Find which vhost answers on **:80** and which **DocumentRoot** applies. Write one sentence: “A request to `http://127.0.0.1/js-lab/index.html` should read from ___ on disk.”
3. Open `/etc/apache2/sites-enabled/000-default.conf` with `sudo nano` or `sudo less` (read-only with `less`). Locate `DocumentRoot` and `<Directory ...>` blocks—**do not save changes** until a lab explicitly asks.
4. List the lab folder: `sudo ls -la /var/www/html/js-lab/`. If it is missing, create it: `sudo mkdir -p /var/www/html/js-lab`.

### Phase 2 — Edit → save → reload habit (10 min)

- Use `sudo nano /var/www/html/js-lab/…` for small edits. After save, **one wrong character** can break CSS or HTML—re-open the file and confirm your last line is intact.
- In the browser, use **hard refresh** (`Ctrl+F5`) when styles look “stuck.” Optionally add a **cache-bust** query on `<link href="…?v=2">` and explain why that works.

### Phase 3 — Core lab work (see focus below)

**async/await, Promise.all, AbortController**

- Fetch two endpoints in parallel with `Promise.all`. Wrap in `try/catch`.
- Implement a **timeout** using `AbortController` + `setTimeout` that aborts the request and surfaces “took too long.”
- **Checkpoint:** Paste the `finally` block you used to clear timers.


### Phase 4 — Verify like someone on-call (15–20 min)

1. In **Firefox or Chromium on the VM**, open your page. Open **DevTools → Network**, disable cache, reload. Confirm **200** on the document and on each CSS/JS asset you expect.
2. In **Console**, confirm there are **no red errors**. If there are, read the **file name and line**; fix, reload, repeat.
3. From the shell, run `curl -sS -D- -o /tmp/lh-body.html http://127.0.0.1/` **against your lab URL path** (adjust the URL). Inspect the **first few response headers** (`Content-Type`, `Content-Length`).
4. Tail the access log while you click: `sudo tail -n 20 /var/log/apache2/access.log`. Match log lines to your requests.

### Phase 5 — Lab report (10 min)

- Write: objective, files touched, **one mistake** you made and how you proved the fix, and **one security or maintenance thought** (e.g. why `sudo` on web root is OK in class but risky in production).


#### Verify

Behavior matches goal; console clean; you can narrate the **data flow**.

#### Common mistakes

MIME/type errors for `.js` modules—ensure Apache serves JavaScript as `application/javascript` (default on Kali).

#### Going further

Try splitting modules further and observe caching headers (conceptual).

---

<!-- id: labs-kali-j-06 -->
<!-- unit: Part 3 — JavaScript (Apache2 on Kali) -->

### Lab J-06 — Local storage “study flashcards”

**Suggested pace:** 70–110 minutes

**Goal:** Persist flashcards in localStorage with import/export.

#### Why this lab exists

Browser JS labs on a real server highlight **module paths**, **MIME types**, and caching—issues you rarely see in a single-file playground.

#### Background

On Debian-based systems (including Kali), **Apache** often uses **`/var/www/html`** as the default **DocumentRoot**: files there map to URLs on port 80. Configuration lives under **`/etc/apache2/`**; logs under **`/var/log/apache2/`**. Editing files as root in the web root is normal for class labs; in production you would use deployment users, permissions, and CI instead.

JavaScript runs in the browser under **origin rules** (scheme/host/port). Serving from `http://127.0.0.1` keeps examples predictable. Use **DevTools Console** for errors—read stack traces slowly.

#### Procedure (go slowly)

### Phase 1 — Map the server to the filesystem (15–20 min)

1. Run `systemctl status apache2 --no-pager | head -n 20`. In your notebook, copy the **Active:** line and note **Main PID**.
2. Run `sudo apache2ctl -S 2>&1 | head -n 50`. Find which vhost answers on **:80** and which **DocumentRoot** applies. Write one sentence: “A request to `http://127.0.0.1/js-lab/index.html` should read from ___ on disk.”
3. Open `/etc/apache2/sites-enabled/000-default.conf` with `sudo nano` or `sudo less` (read-only with `less`). Locate `DocumentRoot` and `<Directory ...>` blocks—**do not save changes** until a lab explicitly asks.
4. List the lab folder: `sudo ls -la /var/www/html/js-lab/`. If it is missing, create it: `sudo mkdir -p /var/www/html/js-lab`.

### Phase 2 — Edit → save → reload habit (10 min)

- Use `sudo nano /var/www/html/js-lab/…` for small edits. After save, **one wrong character** can break CSS or HTML—re-open the file and confirm your last line is intact.
- In the browser, use **hard refresh** (`Ctrl+F5`) when styles look “stuck.” Optionally add a **cache-bust** query on `<link href="…?v=2">` and explain why that works.

### Phase 3 — Core lab work (see focus below)

**localStorage flashcards**

- Model cards as an array of objects `{ front, back, id }`. Serialize with `JSON.stringify`.
- Implement add, edit, delete, and **Export JSON** / **Import JSON** (with `try/catch` on parse).
- **Checkpoint:** Show your exported JSON file snippet in the report.


### Phase 4 — Verify like someone on-call (15–20 min)

1. In **Firefox or Chromium on the VM**, open your page. Open **DevTools → Network**, disable cache, reload. Confirm **200** on the document and on each CSS/JS asset you expect.
2. In **Console**, confirm there are **no red errors**. If there are, read the **file name and line**; fix, reload, repeat.
3. From the shell, run `curl -sS -D- -o /tmp/lh-body.html http://127.0.0.1/` **against your lab URL path** (adjust the URL). Inspect the **first few response headers** (`Content-Type`, `Content-Length`).
4. Tail the access log while you click: `sudo tail -n 20 /var/log/apache2/access.log`. Match log lines to your requests.

### Phase 5 — Lab report (10 min)

- Write: objective, files touched, **one mistake** you made and how you proved the fix, and **one security or maintenance thought** (e.g. why `sudo` on web root is OK in class but risky in production).


#### Verify

Behavior matches goal; console clean; you can narrate the **data flow**.

#### Common mistakes

MIME/type errors for `.js` modules—ensure Apache serves JavaScript as `application/javascript` (default on Kali).

#### Going further

Try splitting modules further and observe caching headers (conceptual).

---

<!-- id: labs-kali-j-07 -->
<!-- unit: Part 3 — JavaScript (Apache2 on Kali) -->

### Lab J-07 — Simple router (hash-based)

**Suggested pace:** 70–110 minutes

**Goal:** Build hash routing with back/forward behavior.

#### Why this lab exists

Browser JS labs on a real server highlight **module paths**, **MIME types**, and caching—issues you rarely see in a single-file playground.

#### Background

On Debian-based systems (including Kali), **Apache** often uses **`/var/www/html`** as the default **DocumentRoot**: files there map to URLs on port 80. Configuration lives under **`/etc/apache2/`**; logs under **`/var/log/apache2/`**. Editing files as root in the web root is normal for class labs; in production you would use deployment users, permissions, and CI instead.

JavaScript runs in the browser under **origin rules** (scheme/host/port). Serving from `http://127.0.0.1` keeps examples predictable. Use **DevTools Console** for errors—read stack traces slowly.

#### Procedure (go slowly)

### Phase 1 — Map the server to the filesystem (15–20 min)

1. Run `systemctl status apache2 --no-pager | head -n 20`. In your notebook, copy the **Active:** line and note **Main PID**.
2. Run `sudo apache2ctl -S 2>&1 | head -n 50`. Find which vhost answers on **:80** and which **DocumentRoot** applies. Write one sentence: “A request to `http://127.0.0.1/js-lab/index.html` should read from ___ on disk.”
3. Open `/etc/apache2/sites-enabled/000-default.conf` with `sudo nano` or `sudo less` (read-only with `less`). Locate `DocumentRoot` and `<Directory ...>` blocks—**do not save changes** until a lab explicitly asks.
4. List the lab folder: `sudo ls -la /var/www/html/js-lab/`. If it is missing, create it: `sudo mkdir -p /var/www/html/js-lab`.

### Phase 2 — Edit → save → reload habit (10 min)

- Use `sudo nano /var/www/html/js-lab/…` for small edits. After save, **one wrong character** can break CSS or HTML—re-open the file and confirm your last line is intact.
- In the browser, use **hard refresh** (`Ctrl+F5`) when styles look “stuck.” Optionally add a **cache-bust** query on `<link href="…?v=2">` and explain why that works.

### Phase 3 — Core lab work (see focus below)

**Hash router**

- Listen to `hashchange` and `load`. Parse `location.hash` (e.g. `#/about`) and swap sections with `hidden` or class toggles.
- Ensure **back/forward** updates the visible section without full reload.
- **Checkpoint:** List two limitations of hash routing vs History API.


### Phase 4 — Verify like someone on-call (15–20 min)

1. In **Firefox or Chromium on the VM**, open your page. Open **DevTools → Network**, disable cache, reload. Confirm **200** on the document and on each CSS/JS asset you expect.
2. In **Console**, confirm there are **no red errors**. If there are, read the **file name and line**; fix, reload, repeat.
3. From the shell, run `curl -sS -D- -o /tmp/lh-body.html http://127.0.0.1/` **against your lab URL path** (adjust the URL). Inspect the **first few response headers** (`Content-Type`, `Content-Length`).
4. Tail the access log while you click: `sudo tail -n 20 /var/log/apache2/access.log`. Match log lines to your requests.

### Phase 5 — Lab report (10 min)

- Write: objective, files touched, **one mistake** you made and how you proved the fix, and **one security or maintenance thought** (e.g. why `sudo` on web root is OK in class but risky in production).


#### Verify

Behavior matches goal; console clean; you can narrate the **data flow**.

#### Common mistakes

MIME/type errors for `.js` modules—ensure Apache serves JavaScript as `application/javascript` (default on Kali).

#### Going further

Try splitting modules further and observe caching headers (conceptual).

---

<!-- id: labs-kali-j-08 -->
<!-- unit: Part 3 — JavaScript (Apache2 on Kali) -->

### Lab J-08 — Web Crypto (non-sensitive demo)

**Suggested pace:** 70–110 minutes

**Goal:** Compute SHA-256 of a string in the browser—conceptual only.

#### Why this lab exists

Browser JS labs on a real server highlight **module paths**, **MIME types**, and caching—issues you rarely see in a single-file playground.

#### Background

On Debian-based systems (including Kali), **Apache** often uses **`/var/www/html`** as the default **DocumentRoot**: files there map to URLs on port 80. Configuration lives under **`/etc/apache2/`**; logs under **`/var/log/apache2/`**. Editing files as root in the web root is normal for class labs; in production you would use deployment users, permissions, and CI instead.

JavaScript runs in the browser under **origin rules** (scheme/host/port). Serving from `http://127.0.0.1` keeps examples predictable. Use **DevTools Console** for errors—read stack traces slowly.

#### Procedure (go slowly)

### Phase 1 — Map the server to the filesystem (15–20 min)

1. Run `systemctl status apache2 --no-pager | head -n 20`. In your notebook, copy the **Active:** line and note **Main PID**.
2. Run `sudo apache2ctl -S 2>&1 | head -n 50`. Find which vhost answers on **:80** and which **DocumentRoot** applies. Write one sentence: “A request to `http://127.0.0.1/js-lab/index.html` should read from ___ on disk.”
3. Open `/etc/apache2/sites-enabled/000-default.conf` with `sudo nano` or `sudo less` (read-only with `less`). Locate `DocumentRoot` and `<Directory ...>` blocks—**do not save changes** until a lab explicitly asks.
4. List the lab folder: `sudo ls -la /var/www/html/js-lab/`. If it is missing, create it: `sudo mkdir -p /var/www/html/js-lab`.

### Phase 2 — Edit → save → reload habit (10 min)

- Use `sudo nano /var/www/html/js-lab/…` for small edits. After save, **one wrong character** can break CSS or HTML—re-open the file and confirm your last line is intact.
- In the browser, use **hard refresh** (`Ctrl+F5`) when styles look “stuck.” Optionally add a **cache-bust** query on `<link href="…?v=2">` and explain why that works.

### Phase 3 — Core lab work (see focus below)

**Web Crypto SHA-256 demo**

- Take user text, encode as `TextEncoder`, digest with `crypto.subtle.digest('SHA-256', …)`, convert ArrayBuffer to **hex**.
- **Never** present this as password storage—write a paragraph on why salted KDFs (Argon2/bcrypt) are required offline.
- **Checkpoint:** Hash the string `test` and compare to a known vector from docs or `openssl dgst -sha256`.


### Phase 4 — Verify like someone on-call (15–20 min)

1. In **Firefox or Chromium on the VM**, open your page. Open **DevTools → Network**, disable cache, reload. Confirm **200** on the document and on each CSS/JS asset you expect.
2. In **Console**, confirm there are **no red errors**. If there are, read the **file name and line**; fix, reload, repeat.
3. From the shell, run `curl -sS -D- -o /tmp/lh-body.html http://127.0.0.1/` **against your lab URL path** (adjust the URL). Inspect the **first few response headers** (`Content-Type`, `Content-Length`).
4. Tail the access log while you click: `sudo tail -n 20 /var/log/apache2/access.log`. Match log lines to your requests.

### Phase 5 — Lab report (10 min)

- Write: objective, files touched, **one mistake** you made and how you proved the fix, and **one security or maintenance thought** (e.g. why `sudo` on web root is OK in class but risky in production).


#### Verify

Behavior matches goal; console clean; you can narrate the **data flow**.

#### Common mistakes

MIME/type errors for `.js` modules—ensure Apache serves JavaScript as `application/javascript` (default on Kali).

#### Going further

Try splitting modules further and observe caching headers (conceptual).

---

<!-- id: labs-kali-j-09 -->
<!-- unit: Part 3 — JavaScript (Apache2 on Kali) -->

### Lab J-09 — Performance: debounce search

**Suggested pace:** 70–110 minutes

**Goal:** Debounce rapid input against a large in-memory list.

#### Why this lab exists

Browser JS labs on a real server highlight **module paths**, **MIME types**, and caching—issues you rarely see in a single-file playground.

#### Background

On Debian-based systems (including Kali), **Apache** often uses **`/var/www/html`** as the default **DocumentRoot**: files there map to URLs on port 80. Configuration lives under **`/etc/apache2/`**; logs under **`/var/log/apache2/`**. Editing files as root in the web root is normal for class labs; in production you would use deployment users, permissions, and CI instead.

JavaScript runs in the browser under **origin rules** (scheme/host/port). Serving from `http://127.0.0.1` keeps examples predictable. Use **DevTools Console** for errors—read stack traces slowly.

#### Procedure (go slowly)

### Phase 1 — Map the server to the filesystem (15–20 min)

1. Run `systemctl status apache2 --no-pager | head -n 20`. In your notebook, copy the **Active:** line and note **Main PID**.
2. Run `sudo apache2ctl -S 2>&1 | head -n 50`. Find which vhost answers on **:80** and which **DocumentRoot** applies. Write one sentence: “A request to `http://127.0.0.1/js-lab/index.html` should read from ___ on disk.”
3. Open `/etc/apache2/sites-enabled/000-default.conf` with `sudo nano` or `sudo less` (read-only with `less`). Locate `DocumentRoot` and `<Directory ...>` blocks—**do not save changes** until a lab explicitly asks.
4. List the lab folder: `sudo ls -la /var/www/html/js-lab/`. If it is missing, create it: `sudo mkdir -p /var/www/html/js-lab`.

### Phase 2 — Edit → save → reload habit (10 min)

- Use `sudo nano /var/www/html/js-lab/…` for small edits. After save, **one wrong character** can break CSS or HTML—re-open the file and confirm your last line is intact.
- In the browser, use **hard refresh** (`Ctrl+F5`) when styles look “stuck.” Optionally add a **cache-bust** query on `<link href="…?v=2">` and explain why that works.

### Phase 3 — Core lab work (see focus below)

**Debounced search**

- Generate ~500 rows in memory. On `input`, debounce (e.g. 200ms) filtering.
- Log **how many** filter passes ran vs keystrokes to prove debounce works.
- **Checkpoint:** Describe Big-O of naive filter vs indexed approach (conceptual).


### Phase 4 — Verify like someone on-call (15–20 min)

1. In **Firefox or Chromium on the VM**, open your page. Open **DevTools → Network**, disable cache, reload. Confirm **200** on the document and on each CSS/JS asset you expect.
2. In **Console**, confirm there are **no red errors**. If there are, read the **file name and line**; fix, reload, repeat.
3. From the shell, run `curl -sS -D- -o /tmp/lh-body.html http://127.0.0.1/` **against your lab URL path** (adjust the URL). Inspect the **first few response headers** (`Content-Type`, `Content-Length`).
4. Tail the access log while you click: `sudo tail -n 20 /var/log/apache2/access.log`. Match log lines to your requests.

### Phase 5 — Lab report (10 min)

- Write: objective, files touched, **one mistake** you made and how you proved the fix, and **one security or maintenance thought** (e.g. why `sudo` on web root is OK in class but risky in production).


#### Verify

Behavior matches goal; console clean; you can narrate the **data flow**.

#### Common mistakes

MIME/type errors for `.js` modules—ensure Apache serves JavaScript as `application/javascript` (default on Kali).

#### Going further

Try splitting modules further and observe caching headers (conceptual).

---

<!-- id: labs-kali-j-10 -->
<!-- unit: Part 3 — JavaScript (Apache2 on Kali) -->

### Lab J-10 — Unit tests (optional Node) or console harness

**Suggested pace:** 70–110 minutes

**Goal:** Add automated or manual tests for pure functions.

#### Why this lab exists

Browser JS labs on a real server highlight **module paths**, **MIME types**, and caching—issues you rarely see in a single-file playground.

#### Background

On Debian-based systems (including Kali), **Apache** often uses **`/var/www/html`** as the default **DocumentRoot**: files there map to URLs on port 80. Configuration lives under **`/etc/apache2/`**; logs under **`/var/log/apache2/`**. Editing files as root in the web root is normal for class labs; in production you would use deployment users, permissions, and CI instead.

JavaScript runs in the browser under **origin rules** (scheme/host/port). Serving from `http://127.0.0.1` keeps examples predictable. Use **DevTools Console** for errors—read stack traces slowly.

#### Procedure (go slowly)

### Phase 1 — Map the server to the filesystem (15–20 min)

1. Run `systemctl status apache2 --no-pager | head -n 20`. In your notebook, copy the **Active:** line and note **Main PID**.
2. Run `sudo apache2ctl -S 2>&1 | head -n 50`. Find which vhost answers on **:80** and which **DocumentRoot** applies. Write one sentence: “A request to `http://127.0.0.1/js-lab/index.html` should read from ___ on disk.”
3. Open `/etc/apache2/sites-enabled/000-default.conf` with `sudo nano` or `sudo less` (read-only with `less`). Locate `DocumentRoot` and `<Directory ...>` blocks—**do not save changes** until a lab explicitly asks.
4. List the lab folder: `sudo ls -la /var/www/html/js-lab/`. If it is missing, create it: `sudo mkdir -p /var/www/html/js-lab`.

### Phase 2 — Edit → save → reload habit (10 min)

- Use `sudo nano /var/www/html/js-lab/…` for small edits. After save, **one wrong character** can break CSS or HTML—re-open the file and confirm your last line is intact.
- In the browser, use **hard refresh** (`Ctrl+F5`) when styles look “stuck.” Optionally add a **cache-bust** query on `<link href="…?v=2">` and explain why that works.

### Phase 3 — Core lab work (see focus below)

**Tests: Vitest/Jest or console harness**

- If Node is available, add one tiny `*.test.js` for a pure function. Otherwise, write `console.assert` checks in a `tests.html` page.
- **Checkpoint:** Paste green output or explain one failing assertion you fixed.


### Phase 4 — Verify like someone on-call (15–20 min)

1. In **Firefox or Chromium on the VM**, open your page. Open **DevTools → Network**, disable cache, reload. Confirm **200** on the document and on each CSS/JS asset you expect.
2. In **Console**, confirm there are **no red errors**. If there are, read the **file name and line**; fix, reload, repeat.
3. From the shell, run `curl -sS -D- -o /tmp/lh-body.html http://127.0.0.1/` **against your lab URL path** (adjust the URL). Inspect the **first few response headers** (`Content-Type`, `Content-Length`).
4. Tail the access log while you click: `sudo tail -n 20 /var/log/apache2/access.log`. Match log lines to your requests.

### Phase 5 — Lab report (10 min)

- Write: objective, files touched, **one mistake** you made and how you proved the fix, and **one security or maintenance thought** (e.g. why `sudo` on web root is OK in class but risky in production).


#### Verify

Behavior matches goal; console clean; you can narrate the **data flow**.

#### Common mistakes

MIME/type errors for `.js` modules—ensure Apache serves JavaScript as `application/javascript` (default on Kali).

#### Going further

Try splitting modules further and observe caching headers (conceptual).

---

<!-- id: labs-kali-j-11 -->
<!-- unit: Part 3 — JavaScript (Apache2 on Kali) -->

### Lab J-11 — Web Workers

**Suggested pace:** 70–110 minutes

**Goal:** Move heavy work off the main thread.

#### Why this lab exists

Browser JS labs on a real server highlight **module paths**, **MIME types**, and caching—issues you rarely see in a single-file playground.

#### Background

On Debian-based systems (including Kali), **Apache** often uses **`/var/www/html`** as the default **DocumentRoot**: files there map to URLs on port 80. Configuration lives under **`/etc/apache2/`**; logs under **`/var/log/apache2/`**. Editing files as root in the web root is normal for class labs; in production you would use deployment users, permissions, and CI instead.

JavaScript runs in the browser under **origin rules** (scheme/host/port). Serving from `http://127.0.0.1` keeps examples predictable. Use **DevTools Console** for errors—read stack traces slowly.

#### Procedure (go slowly)

### Phase 1 — Map the server to the filesystem (15–20 min)

1. Run `systemctl status apache2 --no-pager | head -n 20`. In your notebook, copy the **Active:** line and note **Main PID**.
2. Run `sudo apache2ctl -S 2>&1 | head -n 50`. Find which vhost answers on **:80** and which **DocumentRoot** applies. Write one sentence: “A request to `http://127.0.0.1/js-lab/index.html` should read from ___ on disk.”
3. Open `/etc/apache2/sites-enabled/000-default.conf` with `sudo nano` or `sudo less` (read-only with `less`). Locate `DocumentRoot` and `<Directory ...>` blocks—**do not save changes** until a lab explicitly asks.
4. List the lab folder: `sudo ls -la /var/www/html/js-lab/`. If it is missing, create it: `sudo mkdir -p /var/www/html/js-lab`.

### Phase 2 — Edit → save → reload habit (10 min)

- Use `sudo nano /var/www/html/js-lab/…` for small edits. After save, **one wrong character** can break CSS or HTML—re-open the file and confirm your last line is intact.
- In the browser, use **hard refresh** (`Ctrl+F5`) when styles look “stuck.” Optionally add a **cache-bust** query on `<link href="…?v=2">` and explain why that works.

### Phase 3 — Core lab work (see focus below)

**Web Worker**

- Offload a silly CPU loop (sum 1..5e7) to `worker.js`; postMessage the result. Keep UI responsive (spinner or status text).
- **Checkpoint:** Compare time with worker vs blocking main thread (warn user briefly if blocking).


### Phase 4 — Verify like someone on-call (15–20 min)

1. In **Firefox or Chromium on the VM**, open your page. Open **DevTools → Network**, disable cache, reload. Confirm **200** on the document and on each CSS/JS asset you expect.
2. In **Console**, confirm there are **no red errors**. If there are, read the **file name and line**; fix, reload, repeat.
3. From the shell, run `curl -sS -D- -o /tmp/lh-body.html http://127.0.0.1/` **against your lab URL path** (adjust the URL). Inspect the **first few response headers** (`Content-Type`, `Content-Length`).
4. Tail the access log while you click: `sudo tail -n 20 /var/log/apache2/access.log`. Match log lines to your requests.

### Phase 5 — Lab report (10 min)

- Write: objective, files touched, **one mistake** you made and how you proved the fix, and **one security or maintenance thought** (e.g. why `sudo` on web root is OK in class but risky in production).


#### Verify

Behavior matches goal; console clean; you can narrate the **data flow**.

#### Common mistakes

MIME/type errors for `.js` modules—ensure Apache serves JavaScript as `application/javascript` (default on Kali).

#### Going further

Try splitting modules further and observe caching headers (conceptual).

---

<!-- id: labs-kali-j-12 -->
<!-- unit: Part 3 — JavaScript (Apache2 on Kali) -->

### Lab J-12 — Progressive enhancement

**Suggested pace:** 70–110 minutes

**Goal:** Keep HTML usable without JS; enhance with sorting.

#### Why this lab exists

Browser JS labs on a real server highlight **module paths**, **MIME types**, and caching—issues you rarely see in a single-file playground.

#### Background

On Debian-based systems (including Kali), **Apache** often uses **`/var/www/html`** as the default **DocumentRoot**: files there map to URLs on port 80. Configuration lives under **`/etc/apache2/`**; logs under **`/var/log/apache2/`**. Editing files as root in the web root is normal for class labs; in production you would use deployment users, permissions, and CI instead.

JavaScript runs in the browser under **origin rules** (scheme/host/port). Serving from `http://127.0.0.1` keeps examples predictable. Use **DevTools Console** for errors—read stack traces slowly.

#### Procedure (go slowly)

### Phase 1 — Map the server to the filesystem (15–20 min)

1. Run `systemctl status apache2 --no-pager | head -n 20`. In your notebook, copy the **Active:** line and note **Main PID**.
2. Run `sudo apache2ctl -S 2>&1 | head -n 50`. Find which vhost answers on **:80** and which **DocumentRoot** applies. Write one sentence: “A request to `http://127.0.0.1/js-lab/index.html` should read from ___ on disk.”
3. Open `/etc/apache2/sites-enabled/000-default.conf` with `sudo nano` or `sudo less` (read-only with `less`). Locate `DocumentRoot` and `<Directory ...>` blocks—**do not save changes** until a lab explicitly asks.
4. List the lab folder: `sudo ls -la /var/www/html/js-lab/`. If it is missing, create it: `sudo mkdir -p /var/www/html/js-lab`.

### Phase 2 — Edit → save → reload habit (10 min)

- Use `sudo nano /var/www/html/js-lab/…` for small edits. After save, **one wrong character** can break CSS or HTML—re-open the file and confirm your last line is intact.
- In the browser, use **hard refresh** (`Ctrl+F5`) when styles look “stuck.” Optionally add a **cache-bust** query on `<link href="…?v=2">` and explain why that works.

### Phase 3 — Core lab work (see focus below)

**Progressive enhancement**

- Build a sortable table: **without JS**, the table reads fine. With JS, add header click handlers that sort rows.
- Ensure sort **announces** visually which column is active (aria-sort optional stretch).
- **Checkpoint:** Disable JS in devtools and confirm table still usable.


### Phase 4 — Verify like someone on-call (15–20 min)

1. In **Firefox or Chromium on the VM**, open your page. Open **DevTools → Network**, disable cache, reload. Confirm **200** on the document and on each CSS/JS asset you expect.
2. In **Console**, confirm there are **no red errors**. If there are, read the **file name and line**; fix, reload, repeat.
3. From the shell, run `curl -sS -D- -o /tmp/lh-body.html http://127.0.0.1/` **against your lab URL path** (adjust the URL). Inspect the **first few response headers** (`Content-Type`, `Content-Length`).
4. Tail the access log while you click: `sudo tail -n 20 /var/log/apache2/access.log`. Match log lines to your requests.

### Phase 5 — Lab report (10 min)

- Write: objective, files touched, **one mistake** you made and how you proved the fix, and **one security or maintenance thought** (e.g. why `sudo` on web root is OK in class but risky in production).


#### Verify

Behavior matches goal; console clean; you can narrate the **data flow**.

#### Common mistakes

MIME/type errors for `.js` modules—ensure Apache serves JavaScript as `application/javascript` (default on Kali).

#### Going further

Try splitting modules further and observe caching headers (conceptual).

---

<!-- id: labs-kali-p-01 -->
<!-- unit: Part 4 — Python (on Kali) -->

### Lab P-01 — Virtual environments and pip

**Suggested pace:** 75–120 minutes

**Goal:** Create a venv and call a safe public HTTP API with requests.

#### Why this lab exists

Python on Kali is how automators glue systems together—**read docs**, **type code**, **run tests**, not copy-paste alone.

#### Background

Use **`~/labs/python/`** for sources. Always activate your venv (`source .venv/bin/activate`) before `pip install`. Prefer **absolute imports within small projects** for clarity.

#### Commands explained (read before you type)

**Command:**

```bash
cd ~/labs/python && python3 -m venv .venv && source .venv/bin/activate
```

- **What it does:** `python3 -m venv` creates an isolated interpreter + site-packages. `source` applies env vars in the current shell.
- **Why we use it here:** Avoids polluting system Python—critical habit.

#### Procedure (go slowly)

### Phase 1 — Isolate Python (15 min)

1. `cd ~/labs/python` — if the folder is missing, `mkdir -p ~/labs/python`.
2. Create or reuse a venv: `python3 -m venv .venv && source .venv/bin/activate`. Run `which python` and confirm it points inside `.venv`.
3. Run `python -m pip install --upgrade pip` (note `python` vs `python3` inside venv).

### Phase 2 — Project hygiene (10 min)

- Create today’s folder or branch naming pattern (for example `lab-` plus the output of `date +%F` in bash).
- Open `README.txt` in the lab folder listing: objective, commands you expect to run, rollback (delete venv? restore snapshot?).

### Phase 3 — Core lab work

**venv + pip + requests**

1. `cd ~/labs/python && python3 -m venv .venv && source .venv/bin/activate` — confirm prompt shows `(.venv)`.
2. `python -m pip install --upgrade pip` then `pip install requests`.
3. Create `hello_requests.py` that GETs a **public** JSON endpoint (e.g. ipify) and prints **only** non-sensitive fields.
4. Run `python -I hello_requests.py` once to see isolated flags (`-I` ignores env—optional exploration).
- **Checkpoint:** `pip freeze | head` in your notes.


### Phase 4 — Evidence (15 min)

- Capture **stdout/stderr** for at least two runs (success + intentional failure path).
- If you added files, `tree -L 2 ~/labs/python` or `ls -la` in your report.

### Phase 5 — Retro (10 min)

- What broke if `PATH` contained spaces? What broke if you forgot `source .venv/bin/activate`?


#### Verify

Acceptance checklist satisfied; you can explain **each import** you used.

#### Common mistakes

Forgetting to activate venv → packages install globally or commands fail mysteriously.

#### Going further

Add `ruff` or `black` later for style—optional.

---

<!-- id: labs-kali-p-02 -->
<!-- unit: Part 4 — Python (on Kali) -->

### Lab P-02 — argparse CLI tool

**Suggested pace:** 75–120 minutes

**Goal:** Build a small CLI that filters log lines.

#### Why this lab exists

Python on Kali is how automators glue systems together—**read docs**, **type code**, **run tests**, not copy-paste alone.

#### Background

Use **`~/labs/python/`** for sources. Always activate your venv (`source .venv/bin/activate`) before `pip install`. Prefer **absolute imports within small projects** for clarity.

#### Commands explained (read before you type)

**Command:**

```bash
cd ~/labs/python && python3 -m venv .venv && source .venv/bin/activate
```

- **What it does:** `python3 -m venv` creates an isolated interpreter + site-packages. `source` applies env vars in the current shell.
- **Why we use it here:** Avoids polluting system Python—critical habit.

#### Procedure (go slowly)

### Phase 1 — Isolate Python (15 min)

1. `cd ~/labs/python` — if the folder is missing, `mkdir -p ~/labs/python`.
2. Create or reuse a venv: `python3 -m venv .venv && source .venv/bin/activate`. Run `which python` and confirm it points inside `.venv`.
3. Run `python -m pip install --upgrade pip` (note `python` vs `python3` inside venv).

### Phase 2 — Project hygiene (10 min)

- Create today’s folder or branch naming pattern (for example `lab-` plus the output of `date +%F` in bash).
- Open `README.txt` in the lab folder listing: objective, commands you expect to run, rollback (delete venv? restore snapshot?).

### Phase 3 — Core lab work

**argparse log filter**

- Scaffold `logfmt.py` with subcommands or flags: input path, regex pattern, optional `--invert-match`.
- Read file line-by-line (generator) instead of slurping whole file—explain memory benefit.
- **Checkpoint:** Run against a 10k-line synthetic log you create with a loop in shell.


### Phase 4 — Evidence (15 min)

- Capture **stdout/stderr** for at least two runs (success + intentional failure path).
- If you added files, `tree -L 2 ~/labs/python` or `ls -la` in your report.

### Phase 5 — Retro (10 min)

- What broke if `PATH` contained spaces? What broke if you forgot `source .venv/bin/activate`?


#### Verify

Acceptance checklist satisfied; you can explain **each import** you used.

#### Common mistakes

Forgetting to activate venv → packages install globally or commands fail mysteriously.

#### Going further

Add `ruff` or `black` later for style—optional.

---

<!-- id: labs-kali-p-03 -->
<!-- unit: Part 4 — Python (on Kali) -->

### Lab P-03 — CSV / JSON conversion

**Suggested pace:** 75–120 minutes

**Goal:** Convert CSV rows to typed JSON objects.

#### Why this lab exists

Python on Kali is how automators glue systems together—**read docs**, **type code**, **run tests**, not copy-paste alone.

#### Background

Use **`~/labs/python/`** for sources. Always activate your venv (`source .venv/bin/activate`) before `pip install`. Prefer **absolute imports within small projects** for clarity.

#### Commands explained (read before you type)

**Command:**

```bash
cd ~/labs/python && python3 -m venv .venv && source .venv/bin/activate
```

- **What it does:** `python3 -m venv` creates an isolated interpreter + site-packages. `source` applies env vars in the current shell.
- **Why we use it here:** Avoids polluting system Python—critical habit.

#### Procedure (go slowly)

### Phase 1 — Isolate Python (15 min)

1. `cd ~/labs/python` — if the folder is missing, `mkdir -p ~/labs/python`.
2. Create or reuse a venv: `python3 -m venv .venv && source .venv/bin/activate`. Run `which python` and confirm it points inside `.venv`.
3. Run `python -m pip install --upgrade pip` (note `python` vs `python3` inside venv).

### Phase 2 — Project hygiene (10 min)

- Create today’s folder or branch naming pattern (for example `lab-` plus the output of `date +%F` in bash).
- Open `README.txt` in the lab folder listing: objective, commands you expect to run, rollback (delete venv? restore snapshot?).

### Phase 3 — Core lab work

**CSV → JSON with types**

- Create `inventory.csv` with a numeric column. Parse with `csv.DictReader`.
- Coerce integers safely (`try/except ValueError` per row); collect bad rows in a list and print a summary at end.
- **Checkpoint:** Output `inventory.json` pretty-printed.


### Phase 4 — Evidence (15 min)

- Capture **stdout/stderr** for at least two runs (success + intentional failure path).
- If you added files, `tree -L 2 ~/labs/python` or `ls -la` in your report.

### Phase 5 — Retro (10 min)

- What broke if `PATH` contained spaces? What broke if you forgot `source .venv/bin/activate`?


#### Verify

Acceptance checklist satisfied; you can explain **each import** you used.

#### Common mistakes

Forgetting to activate venv → packages install globally or commands fail mysteriously.

#### Going further

Add `ruff` or `black` later for style—optional.

---

<!-- id: labs-kali-p-04 -->
<!-- unit: Part 4 — Python (on Kali) -->

### Lab P-04 — pathlib batch rename (dry-run)

**Suggested pace:** 75–120 minutes

**Goal:** Rename files with dry-run default and explicit --apply.

#### Why this lab exists

Python on Kali is how automators glue systems together—**read docs**, **type code**, **run tests**, not copy-paste alone.

#### Background

Use **`~/labs/python/`** for sources. Always activate your venv (`source .venv/bin/activate`) before `pip install`. Prefer **absolute imports within small projects** for clarity.

#### Commands explained (read before you type)

**Command:**

```bash
cd ~/labs/python && python3 -m venv .venv && source .venv/bin/activate
```

- **What it does:** `python3 -m venv` creates an isolated interpreter + site-packages. `source` applies env vars in the current shell.
- **Why we use it here:** Avoids polluting system Python—critical habit.

#### Procedure (go slowly)

### Phase 1 — Isolate Python (15 min)

1. `cd ~/labs/python` — if the folder is missing, `mkdir -p ~/labs/python`.
2. Create or reuse a venv: `python3 -m venv .venv && source .venv/bin/activate`. Run `which python` and confirm it points inside `.venv`.
3. Run `python -m pip install --upgrade pip` (note `python` vs `python3` inside venv).

### Phase 2 — Project hygiene (10 min)

- Create today’s folder or branch naming pattern (for example `lab-` plus the output of `date +%F` in bash).
- Open `README.txt` in the lab folder listing: objective, commands you expect to run, rollback (delete venv? restore snapshot?).

### Phase 3 — Core lab work

**pathlib rename dry-run**

- Write `rename_media.py` using `Path.glob`. Default `--dry-run` prints planned renames; `--apply` performs them.
- Use `Path.rename` and catch `OSError`—log failures without crashing whole batch.
- **Checkpoint:** Show dry-run vs apply diff in your report.


### Phase 4 — Evidence (15 min)

- Capture **stdout/stderr** for at least two runs (success + intentional failure path).
- If you added files, `tree -L 2 ~/labs/python` or `ls -la` in your report.

### Phase 5 — Retro (10 min)

- What broke if `PATH` contained spaces? What broke if you forgot `source .venv/bin/activate`?


#### Verify

Acceptance checklist satisfied; you can explain **each import** you used.

#### Common mistakes

Forgetting to activate venv → packages install globally or commands fail mysteriously.

#### Going further

Add `ruff` or `black` later for style—optional.

---

<!-- id: labs-kali-p-05 -->
<!-- unit: Part 4 — Python (on Kali) -->

### Lab P-05 — HTTP server (stdlib) vs Apache

**Suggested pace:** 75–120 minutes

**Goal:** Compare Python’s http.server headers to Apache.

#### Why this lab exists

Python on Kali is how automators glue systems together—**read docs**, **type code**, **run tests**, not copy-paste alone.

#### Background

Use **`~/labs/python/`** for sources. Always activate your venv (`source .venv/bin/activate`) before `pip install`. Prefer **absolute imports within small projects** for clarity.

#### Commands explained (read before you type)

**Command:**

```bash
cd ~/labs/python && python3 -m venv .venv && source .venv/bin/activate
```

- **What it does:** `python3 -m venv` creates an isolated interpreter + site-packages. `source` applies env vars in the current shell.
- **Why we use it here:** Avoids polluting system Python—critical habit.

#### Procedure (go slowly)

### Phase 1 — Isolate Python (15 min)

1. `cd ~/labs/python` — if the folder is missing, `mkdir -p ~/labs/python`.
2. Create or reuse a venv: `python3 -m venv .venv && source .venv/bin/activate`. Run `which python` and confirm it points inside `.venv`.
3. Run `python -m pip install --upgrade pip` (note `python` vs `python3` inside venv).

### Phase 2 — Project hygiene (10 min)

- Create today’s folder or branch naming pattern (for example `lab-` plus the output of `date +%F` in bash).
- Open `README.txt` in the lab folder listing: objective, commands you expect to run, rollback (delete venv? restore snapshot?).

### Phase 3 — Core lab work

**http.server vs Apache**

- Run `python3 -m http.server 8765 --bind 127.0.0.1 --directory /var/www/html` in one terminal.
- `curl -I http://127.0.0.1:8765/` vs `curl -I http://127.0.0.1:80/`. Compare **Server** and **headers**.
- **Checkpoint:** Explain one capability Apache gives that stdlib server does not (vhosts, TLS termination, etc.).


### Phase 4 — Evidence (15 min)

- Capture **stdout/stderr** for at least two runs (success + intentional failure path).
- If you added files, `tree -L 2 ~/labs/python` or `ls -la` in your report.

### Phase 5 — Retro (10 min)

- What broke if `PATH` contained spaces? What broke if you forgot `source .venv/bin/activate`?


#### Verify

Acceptance checklist satisfied; you can explain **each import** you used.

#### Common mistakes

Forgetting to activate venv → packages install globally or commands fail mysteriously.

#### Going further

Add `ruff` or `black` later for style—optional.

---

<!-- id: labs-kali-p-06 -->
<!-- unit: Part 4 — Python (on Kali) -->

### Lab P-06 — Socket programming intro

**Suggested pace:** 75–120 minutes

**Goal:** TCP echo on loopback only.

#### Why this lab exists

Python on Kali is how automators glue systems together—**read docs**, **type code**, **run tests**, not copy-paste alone.

#### Background

Use **`~/labs/python/`** for sources. Always activate your venv (`source .venv/bin/activate`) before `pip install`. Prefer **absolute imports within small projects** for clarity.

#### Commands explained (read before you type)

**Command:**

```bash
cd ~/labs/python && python3 -m venv .venv && source .venv/bin/activate
```

- **What it does:** `python3 -m venv` creates an isolated interpreter + site-packages. `source` applies env vars in the current shell.
- **Why we use it here:** Avoids polluting system Python—critical habit.

#### Procedure (go slowly)

### Phase 1 — Isolate Python (15 min)

1. `cd ~/labs/python` — if the folder is missing, `mkdir -p ~/labs/python`.
2. Create or reuse a venv: `python3 -m venv .venv && source .venv/bin/activate`. Run `which python` and confirm it points inside `.venv`.
3. Run `python -m pip install --upgrade pip` (note `python` vs `python3` inside venv).

### Phase 2 — Project hygiene (10 min)

- Create today’s folder or branch naming pattern (for example `lab-` plus the output of `date +%F` in bash).
- Open `README.txt` in the lab folder listing: objective, commands you expect to run, rollback (delete venv? restore snapshot?).

### Phase 3 — Core lab work

**TCP echo on loopback**

- Implement `echo_server.py` binding `127.0.0.1:9090` and `echo_client.py` sending one line.
- Use `with conn:` context managers; close sockets explicitly in `finally` if not using contexts.
- **Checkpoint:** Show `ss -lntp | grep 9090` while server runs.


### Phase 4 — Evidence (15 min)

- Capture **stdout/stderr** for at least two runs (success + intentional failure path).
- If you added files, `tree -L 2 ~/labs/python` or `ls -la` in your report.

### Phase 5 — Retro (10 min)

- What broke if `PATH` contained spaces? What broke if you forgot `source .venv/bin/activate`?


#### Verify

Acceptance checklist satisfied; you can explain **each import** you used.

#### Common mistakes

Forgetting to activate venv → packages install globally or commands fail mysteriously.

#### Going further

Add `ruff` or `black` later for style—optional.

---

<!-- id: labs-kali-p-07 -->
<!-- unit: Part 4 — Python (on Kali) -->

### Lab P-07 — subprocess safety

**Suggested pace:** 75–120 minutes

**Goal:** Run ping via subprocess without shell injection.

#### Why this lab exists

Python on Kali is how automators glue systems together—**read docs**, **type code**, **run tests**, not copy-paste alone.

#### Background

Use **`~/labs/python/`** for sources. Always activate your venv (`source .venv/bin/activate`) before `pip install`. Prefer **absolute imports within small projects** for clarity.

#### Commands explained (read before you type)

**Command:**

```bash
cd ~/labs/python && python3 -m venv .venv && source .venv/bin/activate
```

- **What it does:** `python3 -m venv` creates an isolated interpreter + site-packages. `source` applies env vars in the current shell.
- **Why we use it here:** Avoids polluting system Python—critical habit.

#### Procedure (go slowly)

### Phase 1 — Isolate Python (15 min)

1. `cd ~/labs/python` — if the folder is missing, `mkdir -p ~/labs/python`.
2. Create or reuse a venv: `python3 -m venv .venv && source .venv/bin/activate`. Run `which python` and confirm it points inside `.venv`.
3. Run `python -m pip install --upgrade pip` (note `python` vs `python3` inside venv).

### Phase 2 — Project hygiene (10 min)

- Create today’s folder or branch naming pattern (for example `lab-` plus the output of `date +%F` in bash).
- Open `README.txt` in the lab folder listing: objective, commands you expect to run, rollback (delete venv? restore snapshot?).

### Phase 3 — Core lab work

**subprocess without shell=True**

- Call `ping -c 1 127.0.0.1` with argument list form. Capture `stdout`, `stderr`, `returncode`.
- Demonstrate **why** `shell=True` is dangerous with a user-controlled string (theory only—do not execute untrusted input).
- **Checkpoint:** Map return code 0 vs non-zero to success/failure in your code.


### Phase 4 — Evidence (15 min)

- Capture **stdout/stderr** for at least two runs (success + intentional failure path).
- If you added files, `tree -L 2 ~/labs/python` or `ls -la` in your report.

### Phase 5 — Retro (10 min)

- What broke if `PATH` contained spaces? What broke if you forgot `source .venv/bin/activate`?


#### Verify

Acceptance checklist satisfied; you can explain **each import** you used.

#### Common mistakes

Forgetting to activate venv → packages install globally or commands fail mysteriously.

#### Going further

Add `ruff` or `black` later for style—optional.

---

<!-- id: labs-kali-p-08 -->
<!-- unit: Part 4 — Python (on Kali) -->

### Lab P-08 — Simple log parser

**Suggested pace:** 75–120 minutes

**Goal:** Aggregate status codes from synthetic access logs.

#### Why this lab exists

Python on Kali is how automators glue systems together—**read docs**, **type code**, **run tests**, not copy-paste alone.

#### Background

Use **`~/labs/python/`** for sources. Always activate your venv (`source .venv/bin/activate`) before `pip install`. Prefer **absolute imports within small projects** for clarity.

#### Commands explained (read before you type)

**Command:**

```bash
cd ~/labs/python && python3 -m venv .venv && source .venv/bin/activate
```

- **What it does:** `python3 -m venv` creates an isolated interpreter + site-packages. `source` applies env vars in the current shell.
- **Why we use it here:** Avoids polluting system Python—critical habit.

#### Procedure (go slowly)

### Phase 1 — Isolate Python (15 min)

1. `cd ~/labs/python` — if the folder is missing, `mkdir -p ~/labs/python`.
2. Create or reuse a venv: `python3 -m venv .venv && source .venv/bin/activate`. Run `which python` and confirm it points inside `.venv`.
3. Run `python -m pip install --upgrade pip` (note `python` vs `python3` inside venv).

### Phase 2 — Project hygiene (10 min)

- Create today’s folder or branch naming pattern (for example `lab-` plus the output of `date +%F` in bash).
- Open `README.txt` in the lab folder listing: objective, commands you expect to run, rollback (delete venv? restore snapshot?).

### Phase 3 — Core lab work

**Apache log counter**

- Generate synthetic `access.log` lines with `for i in {1..200}; do echo "… $((i%5)) …"; done > ~/labs/python/fake.log`.
- Parse and count HTTP status “codes” you embedded; output histogram dict sorted by count.
- **Checkpoint:** Compare your counts to `grep -c` sanity checks.


### Phase 4 — Evidence (15 min)

- Capture **stdout/stderr** for at least two runs (success + intentional failure path).
- If you added files, `tree -L 2 ~/labs/python` or `ls -la` in your report.

### Phase 5 — Retro (10 min)

- What broke if `PATH` contained spaces? What broke if you forgot `source .venv/bin/activate`?


#### Verify

Acceptance checklist satisfied; you can explain **each import** you used.

#### Common mistakes

Forgetting to activate venv → packages install globally or commands fail mysteriously.

#### Going further

Add `ruff` or `black` later for style—optional.

---

<!-- id: labs-kali-p-09 -->
<!-- unit: Part 4 — Python (on Kali) -->

### Lab P-09 — dataclasses and dict validation

**Suggested pace:** 75–120 minutes

**Goal:** Model records safely before use.

#### Why this lab exists

Python on Kali is how automators glue systems together—**read docs**, **type code**, **run tests**, not copy-paste alone.

#### Background

Use **`~/labs/python/`** for sources. Always activate your venv (`source .venv/bin/activate`) before `pip install`. Prefer **absolute imports within small projects** for clarity.

#### Commands explained (read before you type)

**Command:**

```bash
cd ~/labs/python && python3 -m venv .venv && source .venv/bin/activate
```

- **What it does:** `python3 -m venv` creates an isolated interpreter + site-packages. `source` applies env vars in the current shell.
- **Why we use it here:** Avoids polluting system Python—critical habit.

#### Procedure (go slowly)

### Phase 1 — Isolate Python (15 min)

1. `cd ~/labs/python` — if the folder is missing, `mkdir -p ~/labs/python`.
2. Create or reuse a venv: `python3 -m venv .venv && source .venv/bin/activate`. Run `which python` and confirm it points inside `.venv`.
3. Run `python -m pip install --upgrade pip` (note `python` vs `python3` inside venv).

### Phase 2 — Project hygiene (10 min)

- Create today’s folder or branch naming pattern (for example `lab-` plus the output of `date +%F` in bash).
- Open `README.txt` in the lab folder listing: objective, commands you expect to run, rollback (delete venv? restore snapshot?).

### Phase 3 — Core lab work

**dataclass validation**

- Define `@dataclass` User with fields. Write `User.from_dict(d)` that rejects unknown keys and missing required keys with clear exceptions.
- **Checkpoint:** Show one rejected dict example in notes.


### Phase 4 — Evidence (15 min)

- Capture **stdout/stderr** for at least two runs (success + intentional failure path).
- If you added files, `tree -L 2 ~/labs/python` or `ls -la` in your report.

### Phase 5 — Retro (10 min)

- What broke if `PATH` contained spaces? What broke if you forgot `source .venv/bin/activate`?


#### Verify

Acceptance checklist satisfied; you can explain **each import** you used.

#### Common mistakes

Forgetting to activate venv → packages install globally or commands fail mysteriously.

#### Going further

Add `ruff` or `black` later for style—optional.

---

<!-- id: labs-kali-p-10 -->
<!-- unit: Part 4 — Python (on Kali) -->

### Lab P-10 — pytest basics

**Suggested pace:** 75–120 minutes

**Goal:** Write five meaningful tests.

#### Why this lab exists

Python on Kali is how automators glue systems together—**read docs**, **type code**, **run tests**, not copy-paste alone.

#### Background

Use **`~/labs/python/`** for sources. Always activate your venv (`source .venv/bin/activate`) before `pip install`. Prefer **absolute imports within small projects** for clarity.

#### Commands explained (read before you type)

**Command:**

```bash
cd ~/labs/python && python3 -m venv .venv && source .venv/bin/activate
```

- **What it does:** `python3 -m venv` creates an isolated interpreter + site-packages. `source` applies env vars in the current shell.
- **Why we use it here:** Avoids polluting system Python—critical habit.

#### Procedure (go slowly)

### Phase 1 — Isolate Python (15 min)

1. `cd ~/labs/python` — if the folder is missing, `mkdir -p ~/labs/python`.
2. Create or reuse a venv: `python3 -m venv .venv && source .venv/bin/activate`. Run `which python` and confirm it points inside `.venv`.
3. Run `python -m pip install --upgrade pip` (note `python` vs `python3` inside venv).

### Phase 2 — Project hygiene (10 min)

- Create today’s folder or branch naming pattern (for example `lab-` plus the output of `date +%F` in bash).
- Open `README.txt` in the lab folder listing: objective, commands you expect to run, rollback (delete venv? restore snapshot?).

### Phase 3 — Core lab work

**pytest five tests**

- Add `tests/test_csv_tool.py` with five tests covering happy path, bad int row, empty file, etc.
- Run `pytest -q`; paste summary line.
- **Checkpoint:** Explain fixture vs plain function setup.


### Phase 4 — Evidence (15 min)

- Capture **stdout/stderr** for at least two runs (success + intentional failure path).
- If you added files, `tree -L 2 ~/labs/python` or `ls -la` in your report.

### Phase 5 — Retro (10 min)

- What broke if `PATH` contained spaces? What broke if you forgot `source .venv/bin/activate`?


#### Verify

Acceptance checklist satisfied; you can explain **each import** you used.

#### Common mistakes

Forgetting to activate venv → packages install globally or commands fail mysteriously.

#### Going further

Add `ruff` or `black` later for style—optional.

---

<!-- id: labs-kali-p-11 -->
<!-- unit: Part 4 — Python (on Kali) -->

### Lab P-11 — File hashing duplicate finder

**Suggested pace:** 75–120 minutes

**Goal:** Find duplicate files by hash.

#### Why this lab exists

Python on Kali is how automators glue systems together—**read docs**, **type code**, **run tests**, not copy-paste alone.

#### Background

Use **`~/labs/python/`** for sources. Always activate your venv (`source .venv/bin/activate`) before `pip install`. Prefer **absolute imports within small projects** for clarity.

#### Commands explained (read before you type)

**Command:**

```bash
cd ~/labs/python && python3 -m venv .venv && source .venv/bin/activate
```

- **What it does:** `python3 -m venv` creates an isolated interpreter + site-packages. `source` applies env vars in the current shell.
- **Why we use it here:** Avoids polluting system Python—critical habit.

#### Procedure (go slowly)

### Phase 1 — Isolate Python (15 min)

1. `cd ~/labs/python` — if the folder is missing, `mkdir -p ~/labs/python`.
2. Create or reuse a venv: `python3 -m venv .venv && source .venv/bin/activate`. Run `which python` and confirm it points inside `.venv`.
3. Run `python -m pip install --upgrade pip` (note `python` vs `python3` inside venv).

### Phase 2 — Project hygiene (10 min)

- Create today’s folder or branch naming pattern (for example `lab-` plus the output of `date +%F` in bash).
- Open `README.txt` in the lab folder listing: objective, commands you expect to run, rollback (delete venv? restore snapshot?).

### Phase 3 — Core lab work

**hash duplicate finder**

- Walk `~/labs/python/tree` (create nested duplicate files). Hash with `hashlib.sha256` in binary mode.
- Print groups of paths sharing a digest.
- **Checkpoint:** Note collision probability argument (SHA-256) in one sentence.


### Phase 4 — Evidence (15 min)

- Capture **stdout/stderr** for at least two runs (success + intentional failure path).
- If you added files, `tree -L 2 ~/labs/python` or `ls -la` in your report.

### Phase 5 — Retro (10 min)

- What broke if `PATH` contained spaces? What broke if you forgot `source .venv/bin/activate`?


#### Verify

Acceptance checklist satisfied; you can explain **each import** you used.

#### Common mistakes

Forgetting to activate venv → packages install globally or commands fail mysteriously.

#### Going further

Add `ruff` or `black` later for style—optional.

---

<!-- id: labs-kali-p-12 -->
<!-- unit: Part 4 — Python (on Kali) -->

### Lab P-12 — Tiny API client with retries

**Suggested pace:** 75–120 minutes

**Goal:** Retry flaky HTTP with backoff.

#### Why this lab exists

Python on Kali is how automators glue systems together—**read docs**, **type code**, **run tests**, not copy-paste alone.

#### Background

Use **`~/labs/python/`** for sources. Always activate your venv (`source .venv/bin/activate`) before `pip install`. Prefer **absolute imports within small projects** for clarity.

#### Commands explained (read before you type)

**Command:**

```bash
cd ~/labs/python && python3 -m venv .venv && source .venv/bin/activate
```

- **What it does:** `python3 -m venv` creates an isolated interpreter + site-packages. `source` applies env vars in the current shell.
- **Why we use it here:** Avoids polluting system Python—critical habit.

#### Procedure (go slowly)

### Phase 1 — Isolate Python (15 min)

1. `cd ~/labs/python` — if the folder is missing, `mkdir -p ~/labs/python`.
2. Create or reuse a venv: `python3 -m venv .venv && source .venv/bin/activate`. Run `which python` and confirm it points inside `.venv`.
3. Run `python -m pip install --upgrade pip` (note `python` vs `python3` inside venv).

### Phase 2 — Project hygiene (10 min)

- Create today’s folder or branch naming pattern (for example `lab-` plus the output of `date +%F` in bash).
- Open `README.txt` in the lab folder listing: objective, commands you expect to run, rollback (delete venv? restore snapshot?).

### Phase 3 — Core lab work

**requests + exponential backoff**

- Write a tiny Flask app on 127.0.0.1 that randomly returns 500 (or use a stub). Client retries with **backoff + jitter**.
- Cap max retries; log each attempt with timestamp.
- **Checkpoint:** Plot or list attempt timings in your notebook.


### Phase 4 — Evidence (15 min)

- Capture **stdout/stderr** for at least two runs (success + intentional failure path).
- If you added files, `tree -L 2 ~/labs/python` or `ls -la` in your report.

### Phase 5 — Retro (10 min)

- What broke if `PATH` contained spaces? What broke if you forgot `source .venv/bin/activate`?


#### Verify

Acceptance checklist satisfied; you can explain **each import** you used.

#### Common mistakes

Forgetting to activate venv → packages install globally or commands fail mysteriously.

#### Going further

Add `ruff` or `black` later for style—optional.

---

<!-- id: labs-kali-s-01 -->
<!-- unit: Part 5 — SQL / MariaDB (on Kali) -->

### Lab S-01 — Create database and role

**Suggested pace:** 70–110 minutes

**Goal:** Execute the relational modeling and SQL skills for this step—see procedure.

#### Why this lab exists

Databases reward **slow thinking**: schema first, constraints second, queries third.

#### Background

**MariaDB** speaks the same client protocol as MySQL for most learner tasks. The **`mariadb`** client connects to the server; **`sudo mariadb`** typically opens a local **root** administrative session on fresh installs. Always prefer **parameterized** queries in application code (covered in a later lab).

#### Commands explained (read before you type)

**Command:**

```bash
sudo mariadb
```

- **What it does:** Opens the MariaDB client as the privileged local admin (typical Kali install).
- **Why we use it here:** You need DDL privileges to create databases and users.

#### Procedure (go slowly)

### Phase 1 — Session + safety (10 min)

1. Open **two** terminals: one `sudo mariadb` (admin), one normal shell for `mysqldump` / editors.
2. Before destructive DDL, run `SHOW CREATE TABLE …` or copy schema with `mysqldump --no-data` when appropriate.

### Phase 2 — Vocabulary (10 min)

- Classify each statement you will run as **DDL** (schema), **DML** (data), or **DCL** (permissions).
- Write one sentence on why `FLUSH PRIVILEGES;` exists after `GRANT`.

### Phase 3 — Execute the lab

**S-01 — Database + role (DDL walkthrough)**

Run in `sudo mariadb` (paste one statement at a time, read responses):

```sql
CREATE DATABASE IF NOT EXISTS soc_training;
CREATE USER IF NOT EXISTS 'analyst'@'localhost' IDENTIFIED BY 'replace-with-strong-password';
GRANT SELECT, INSERT, UPDATE ON soc_training.* TO 'analyst'@'localhost';
FLUSH PRIVILEGES;
```

Then **exit** root session and test: `mariadb -u analyst -p soc_training -e "SELECT DATABASE();"`.
- **Explain:** what `GRANT … ON db.*` means vs table-level grants.


### Phase 4 — Integrity checks (15 min)

- After inserts, run `SELECT … COUNT(*)` sanity queries. Use `EXPLAIN` on at least one non-trivial `SELECT`.
- If you changed users, log out and verify **least privilege** by connecting as `analyst`.

### Phase 5 — Diagram + notes (10 min)

- Sketch ER diagram on paper; photograph or transcribe key entities and cardinalities.


#### Verify

Schema and queries match lab intent; you can draw the **ER diagram** on paper.

#### Common mistakes

Mixing quoting for user@host; forgetting `FLUSH PRIVILEGES` after GRANT changes in some workflows.

#### Going further

Read MariaDB explain JSON output once (`EXPLAIN FORMAT=JSON`).

---

<!-- id: labs-kali-s-02 -->
<!-- unit: Part 5 — SQL / MariaDB (on Kali) -->

### Lab S-02 — Incidents and assets (1NF)

**Suggested pace:** 70–110 minutes

**Goal:** Execute the relational modeling and SQL skills for this step—see procedure.

#### Why this lab exists

Databases reward **slow thinking**: schema first, constraints second, queries third.

#### Background

**MariaDB** speaks the same client protocol as MySQL for most learner tasks. The **`mariadb`** client connects to the server; **`sudo mariadb`** typically opens a local **root** administrative session on fresh installs. Always prefer **parameterized** queries in application code (covered in a later lab).

#### Commands explained (read before you type)

**Command:**

```bash
sudo mariadb
```

- **What it does:** Opens the MariaDB client as the privileged local admin (typical Kali install).
- **Why we use it here:** You need DDL privileges to create databases and users.

#### Procedure (go slowly)

### Phase 1 — Session + safety (10 min)

1. Open **two** terminals: one `sudo mariadb` (admin), one normal shell for `mysqldump` / editors.
2. Before destructive DDL, run `SHOW CREATE TABLE …` or copy schema with `mysqldump --no-data` when appropriate.

### Phase 2 — Vocabulary (10 min)

- Classify each statement you will run as **DDL** (schema), **DML** (data), or **DCL** (permissions).
- Write one sentence on why `FLUSH PRIVILEGES;` exists after `GRANT`.

### Phase 3 — Execute the lab

**S-02 — assets + incidents tables**

```sql
USE soc_training;
CREATE TABLE assets (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  hostname VARCHAR(128) NOT NULL,
  ip VARCHAR(45) NOT NULL,
  owner VARCHAR(128) NOT NULL
);
CREATE TABLE incidents (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  opened_at DATETIME NOT NULL,
  severity ENUM('low','med','high','crit') NOT NULL
);
```

Insert **≥10** realistic rows (`INSERT … VALUES` multi-row is fine). Run `SELECT COUNT(*) FROM assets;`.


### Phase 4 — Integrity checks (15 min)

- After inserts, run `SELECT … COUNT(*)` sanity queries. Use `EXPLAIN` on at least one non-trivial `SELECT`.
- If you changed users, log out and verify **least privilege** by connecting as `analyst`.

### Phase 5 — Diagram + notes (10 min)

- Sketch ER diagram on paper; photograph or transcribe key entities and cardinalities.


#### Verify

Schema and queries match lab intent; you can draw the **ER diagram** on paper.

#### Common mistakes

Mixing quoting for user@host; forgetting `FLUSH PRIVILEGES` after GRANT changes in some workflows.

#### Going further

Read MariaDB explain JSON output once (`EXPLAIN FORMAT=JSON`).

---

<!-- id: labs-kali-s-03 -->
<!-- unit: Part 5 — SQL / MariaDB (on Kali) -->

### Lab S-03 — Foreign keys and cascades

**Suggested pace:** 70–110 minutes

**Goal:** Execute the relational modeling and SQL skills for this step—see procedure.

#### Why this lab exists

Databases reward **slow thinking**: schema first, constraints second, queries third.

#### Background

**MariaDB** speaks the same client protocol as MySQL for most learner tasks. The **`mariadb`** client connects to the server; **`sudo mariadb`** typically opens a local **root** administrative session on fresh installs. Always prefer **parameterized** queries in application code (covered in a later lab).

#### Commands explained (read before you type)

**Command:**

```bash
sudo mariadb
```

- **What it does:** Opens the MariaDB client as the privileged local admin (typical Kali install).
- **Why we use it here:** You need DDL privileges to create databases and users.

#### Procedure (go slowly)

### Phase 1 — Session + safety (10 min)

1. Open **two** terminals: one `sudo mariadb` (admin), one normal shell for `mysqldump` / editors.
2. Before destructive DDL, run `SHOW CREATE TABLE …` or copy schema with `mysqldump --no-data` when appropriate.

### Phase 2 — Vocabulary (10 min)

- Classify each statement you will run as **DDL** (schema), **DML** (data), or **DCL** (permissions).
- Write one sentence on why `FLUSH PRIVILEGES;` exists after `GRANT`.

### Phase 3 — Execute the lab

**S-03 — Foreign keys + cascades**

Create `incident_findings` with FK to `incidents` and `assets`. Test **ON DELETE RESTRICT** by trying to delete an incident that still has findings—note error code.
Then test **ON UPDATE CASCADE** on a child column if you modeled one (or document why not).


### Phase 4 — Integrity checks (15 min)

- After inserts, run `SELECT … COUNT(*)` sanity queries. Use `EXPLAIN` on at least one non-trivial `SELECT`.
- If you changed users, log out and verify **least privilege** by connecting as `analyst`.

### Phase 5 — Diagram + notes (10 min)

- Sketch ER diagram on paper; photograph or transcribe key entities and cardinalities.


#### Verify

Schema and queries match lab intent; you can draw the **ER diagram** on paper.

#### Common mistakes

Mixing quoting for user@host; forgetting `FLUSH PRIVILEGES` after GRANT changes in some workflows.

#### Going further

Read MariaDB explain JSON output once (`EXPLAIN FORMAT=JSON`).

---

<!-- id: labs-kali-s-04 -->
<!-- unit: Part 5 — SQL / MariaDB (on Kali) -->

### Lab S-04 — Join practice

**Suggested pace:** 70–110 minutes

**Goal:** Execute the relational modeling and SQL skills for this step—see procedure.

#### Why this lab exists

Databases reward **slow thinking**: schema first, constraints second, queries third.

#### Background

**MariaDB** speaks the same client protocol as MySQL for most learner tasks. The **`mariadb`** client connects to the server; **`sudo mariadb`** typically opens a local **root** administrative session on fresh installs. Always prefer **parameterized** queries in application code (covered in a later lab).

#### Commands explained (read before you type)

**Command:**

```bash
sudo mariadb
```

- **What it does:** Opens the MariaDB client as the privileged local admin (typical Kali install).
- **Why we use it here:** You need DDL privileges to create databases and users.

#### Procedure (go slowly)

### Phase 1 — Session + safety (10 min)

1. Open **two** terminals: one `sudo mariadb` (admin), one normal shell for `mysqldump` / editors.
2. Before destructive DDL, run `SHOW CREATE TABLE …` or copy schema with `mysqldump --no-data` when appropriate.

### Phase 2 — Vocabulary (10 min)

- Classify each statement you will run as **DDL** (schema), **DML** (data), or **DCL** (permissions).
- Write one sentence on why `FLUSH PRIVILEGES;` exists after `GRANT`.

### Phase 3 — Execute the lab

**S-04 — Join practice**

Write queries (save in `~/labs/sql/joins.sql`) for:
1) assets touched by >1 incident; 2) open incidents with zero findings. Use **both** inner join and left join styles where possible.
`EXPLAIN` one heavy join before/after you add data.


### Phase 4 — Integrity checks (15 min)

- After inserts, run `SELECT … COUNT(*)` sanity queries. Use `EXPLAIN` on at least one non-trivial `SELECT`.
- If you changed users, log out and verify **least privilege** by connecting as `analyst`.

### Phase 5 — Diagram + notes (10 min)

- Sketch ER diagram on paper; photograph or transcribe key entities and cardinalities.


#### Verify

Schema and queries match lab intent; you can draw the **ER diagram** on paper.

#### Common mistakes

Mixing quoting for user@host; forgetting `FLUSH PRIVILEGES` after GRANT changes in some workflows.

#### Going further

Read MariaDB explain JSON output once (`EXPLAIN FORMAT=JSON`).

---

<!-- id: labs-kali-s-05 -->
<!-- unit: Part 5 — SQL / MariaDB (on Kali) -->

### Lab S-05 — Aggregation and HAVING

**Suggested pace:** 70–110 minutes

**Goal:** Execute the relational modeling and SQL skills for this step—see procedure.

#### Why this lab exists

Databases reward **slow thinking**: schema first, constraints second, queries third.

#### Background

**MariaDB** speaks the same client protocol as MySQL for most learner tasks. The **`mariadb`** client connects to the server; **`sudo mariadb`** typically opens a local **root** administrative session on fresh installs. Always prefer **parameterized** queries in application code (covered in a later lab).

#### Commands explained (read before you type)

**Command:**

```bash
sudo mariadb
```

- **What it does:** Opens the MariaDB client as the privileged local admin (typical Kali install).
- **Why we use it here:** You need DDL privileges to create databases and users.

#### Procedure (go slowly)

### Phase 1 — Session + safety (10 min)

1. Open **two** terminals: one `sudo mariadb` (admin), one normal shell for `mysqldump` / editors.
2. Before destructive DDL, run `SHOW CREATE TABLE …` or copy schema with `mysqldump --no-data` when appropriate.

### Phase 2 — Vocabulary (10 min)

- Classify each statement you will run as **DDL** (schema), **DML** (data), or **DCL** (permissions).
- Write one sentence on why `FLUSH PRIVILEGES;` exists after `GRANT`.

### Phase 3 — Execute the lab

**S-05 — Aggregation + HAVING**

Compute average **hours between** incidents grouped by `severity` (use `TIMESTAMPDIFF` or precomputed durations in a column you add).
Use `HAVING` to filter groups with count ≥ 3.


### Phase 4 — Integrity checks (15 min)

- After inserts, run `SELECT … COUNT(*)` sanity queries. Use `EXPLAIN` on at least one non-trivial `SELECT`.
- If you changed users, log out and verify **least privilege** by connecting as `analyst`.

### Phase 5 — Diagram + notes (10 min)

- Sketch ER diagram on paper; photograph or transcribe key entities and cardinalities.


#### Verify

Schema and queries match lab intent; you can draw the **ER diagram** on paper.

#### Common mistakes

Mixing quoting for user@host; forgetting `FLUSH PRIVILEGES` after GRANT changes in some workflows.

#### Going further

Read MariaDB explain JSON output once (`EXPLAIN FORMAT=JSON`).

---

<!-- id: labs-kali-s-06 -->
<!-- unit: Part 5 — SQL / MariaDB (on Kali) -->

### Lab S-06 — Transactions

**Suggested pace:** 70–110 minutes

**Goal:** Execute the relational modeling and SQL skills for this step—see procedure.

#### Why this lab exists

Databases reward **slow thinking**: schema first, constraints second, queries third.

#### Background

**MariaDB** speaks the same client protocol as MySQL for most learner tasks. The **`mariadb`** client connects to the server; **`sudo mariadb`** typically opens a local **root** administrative session on fresh installs. Always prefer **parameterized** queries in application code (covered in a later lab).

#### Commands explained (read before you type)

**Command:**

```bash
sudo mariadb
```

- **What it does:** Opens the MariaDB client as the privileged local admin (typical Kali install).
- **Why we use it here:** You need DDL privileges to create databases and users.

#### Procedure (go slowly)

### Phase 1 — Session + safety (10 min)

1. Open **two** terminals: one `sudo mariadb` (admin), one normal shell for `mysqldump` / editors.
2. Before destructive DDL, run `SHOW CREATE TABLE …` or copy schema with `mysqldump --no-data` when appropriate.

### Phase 2 — Vocabulary (10 min)

- Classify each statement you will run as **DDL** (schema), **DML** (data), or **DCL** (permissions).
- Write one sentence on why `FLUSH PRIVILEGES;` exists after `GRANT`.

### Phase 3 — Execute the lab

**S-06 — Transactions**

```sql
START TRANSACTION;
INSERT INTO incidents (…) VALUES (…);
INSERT INTO incident_findings (…) VALUES (…); -- second stmt violates FK on purpose
ROLLBACK;
```

Repeat with a valid pair and `COMMIT;`. Show `SELECT` proof rows appear only after commit.


### Phase 4 — Integrity checks (15 min)

- After inserts, run `SELECT … COUNT(*)` sanity queries. Use `EXPLAIN` on at least one non-trivial `SELECT`.
- If you changed users, log out and verify **least privilege** by connecting as `analyst`.

### Phase 5 — Diagram + notes (10 min)

- Sketch ER diagram on paper; photograph or transcribe key entities and cardinalities.


#### Verify

Schema and queries match lab intent; you can draw the **ER diagram** on paper.

#### Common mistakes

Mixing quoting for user@host; forgetting `FLUSH PRIVILEGES` after GRANT changes in some workflows.

#### Going further

Read MariaDB explain JSON output once (`EXPLAIN FORMAT=JSON`).

---

<!-- id: labs-kali-s-07 -->
<!-- unit: Part 5 — SQL / MariaDB (on Kali) -->

### Lab S-07 — Indexes and EXPLAIN

**Suggested pace:** 70–110 minutes

**Goal:** Execute the relational modeling and SQL skills for this step—see procedure.

#### Why this lab exists

Databases reward **slow thinking**: schema first, constraints second, queries third.

#### Background

**MariaDB** speaks the same client protocol as MySQL for most learner tasks. The **`mariadb`** client connects to the server; **`sudo mariadb`** typically opens a local **root** administrative session on fresh installs. Always prefer **parameterized** queries in application code (covered in a later lab).

#### Commands explained (read before you type)

**Command:**

```bash
sudo mariadb
```

- **What it does:** Opens the MariaDB client as the privileged local admin (typical Kali install).
- **Why we use it here:** You need DDL privileges to create databases and users.

#### Procedure (go slowly)

### Phase 1 — Session + safety (10 min)

1. Open **two** terminals: one `sudo mariadb` (admin), one normal shell for `mysqldump` / editors.
2. Before destructive DDL, run `SHOW CREATE TABLE …` or copy schema with `mysqldump --no-data` when appropriate.

### Phase 2 — Vocabulary (10 min)

- Classify each statement you will run as **DDL** (schema), **DML** (data), or **DCL** (permissions).
- Write one sentence on why `FLUSH PRIVILEGES;` exists after `GRANT`.

### Phase 3 — Execute the lab

**S-07 — Index + EXPLAIN**

Pick a slow query on `(severity, opened_at)`. Show `EXPLAIN` before index; `CREATE INDEX idx_sev_opened ON incidents (severity, opened_at);`; show `EXPLAIN` after.
Describe **rows** / **type** changes in prose.


### Phase 4 — Integrity checks (15 min)

- After inserts, run `SELECT … COUNT(*)` sanity queries. Use `EXPLAIN` on at least one non-trivial `SELECT`.
- If you changed users, log out and verify **least privilege** by connecting as `analyst`.

### Phase 5 — Diagram + notes (10 min)

- Sketch ER diagram on paper; photograph or transcribe key entities and cardinalities.


#### Verify

Schema and queries match lab intent; you can draw the **ER diagram** on paper.

#### Common mistakes

Mixing quoting for user@host; forgetting `FLUSH PRIVILEGES` after GRANT changes in some workflows.

#### Going further

Read MariaDB explain JSON output once (`EXPLAIN FORMAT=JSON`).

---

<!-- id: labs-kali-s-08 -->
<!-- unit: Part 5 — SQL / MariaDB (on Kali) -->

### Lab S-08 — Views for analysts

**Suggested pace:** 70–110 minutes

**Goal:** Execute the relational modeling and SQL skills for this step—see procedure.

#### Why this lab exists

Databases reward **slow thinking**: schema first, constraints second, queries third.

#### Background

**MariaDB** speaks the same client protocol as MySQL for most learner tasks. The **`mariadb`** client connects to the server; **`sudo mariadb`** typically opens a local **root** administrative session on fresh installs. Always prefer **parameterized** queries in application code (covered in a later lab).

#### Commands explained (read before you type)

**Command:**

```bash
sudo mariadb
```

- **What it does:** Opens the MariaDB client as the privileged local admin (typical Kali install).
- **Why we use it here:** You need DDL privileges to create databases and users.

#### Procedure (go slowly)

### Phase 1 — Session + safety (10 min)

1. Open **two** terminals: one `sudo mariadb` (admin), one normal shell for `mysqldump` / editors.
2. Before destructive DDL, run `SHOW CREATE TABLE …` or copy schema with `mysqldump --no-data` when appropriate.

### Phase 2 — Vocabulary (10 min)

- Classify each statement you will run as **DDL** (schema), **DML** (data), or **DCL** (permissions).
- Write one sentence on why `FLUSH PRIVILEGES;` exists after `GRANT`.

### Phase 3 — Execute the lab

**S-08 — View + analyst user**

`CREATE VIEW open_incidents AS SELECT …`. Grant **only** `SELECT` on the view to `analyst` (revoke base table perms if you granted them earlier—plan this carefully in notes).
Login as analyst and confirm `SELECT * FROM open_incidents;` works while raw tables may not.


### Phase 4 — Integrity checks (15 min)

- After inserts, run `SELECT … COUNT(*)` sanity queries. Use `EXPLAIN` on at least one non-trivial `SELECT`.
- If you changed users, log out and verify **least privilege** by connecting as `analyst`.

### Phase 5 — Diagram + notes (10 min)

- Sketch ER diagram on paper; photograph or transcribe key entities and cardinalities.


#### Verify

Schema and queries match lab intent; you can draw the **ER diagram** on paper.

#### Common mistakes

Mixing quoting for user@host; forgetting `FLUSH PRIVILEGES` after GRANT changes in some workflows.

#### Going further

Read MariaDB explain JSON output once (`EXPLAIN FORMAT=JSON`).

---

<!-- id: labs-kali-s-09 -->
<!-- unit: Part 5 — SQL / MariaDB (on Kali) -->

### Lab S-09 — Stored procedure (safe)

**Suggested pace:** 70–110 minutes

**Goal:** Execute the relational modeling and SQL skills for this step—see procedure.

#### Why this lab exists

Databases reward **slow thinking**: schema first, constraints second, queries third.

#### Background

**MariaDB** speaks the same client protocol as MySQL for most learner tasks. The **`mariadb`** client connects to the server; **`sudo mariadb`** typically opens a local **root** administrative session on fresh installs. Always prefer **parameterized** queries in application code (covered in a later lab).

#### Commands explained (read before you type)

**Command:**

```bash
sudo mariadb
```

- **What it does:** Opens the MariaDB client as the privileged local admin (typical Kali install).
- **Why we use it here:** You need DDL privileges to create databases and users.

#### Procedure (go slowly)

### Phase 1 — Session + safety (10 min)

1. Open **two** terminals: one `sudo mariadb` (admin), one normal shell for `mysqldump` / editors.
2. Before destructive DDL, run `SHOW CREATE TABLE …` or copy schema with `mysqldump --no-data` when appropriate.

### Phase 2 — Vocabulary (10 min)

- Classify each statement you will run as **DDL** (schema), **DML** (data), or **DCL** (permissions).
- Write one sentence on why `FLUSH PRIVILEGES;` exists after `GRANT`.

### Phase 3 — Execute the lab

**S-09 — Stored procedure**

`DELIMITER //` style procedure `close_incident(IN p_id INT)` that checks status, sets `closed_at`, and signals error on invalid transition.
Call with `CALL close_incident(1);` and show before/after row.


### Phase 4 — Integrity checks (15 min)

- After inserts, run `SELECT … COUNT(*)` sanity queries. Use `EXPLAIN` on at least one non-trivial `SELECT`.
- If you changed users, log out and verify **least privilege** by connecting as `analyst`.

### Phase 5 — Diagram + notes (10 min)

- Sketch ER diagram on paper; photograph or transcribe key entities and cardinalities.


#### Verify

Schema and queries match lab intent; you can draw the **ER diagram** on paper.

#### Common mistakes

Mixing quoting for user@host; forgetting `FLUSH PRIVILEGES` after GRANT changes in some workflows.

#### Going further

Read MariaDB explain JSON output once (`EXPLAIN FORMAT=JSON`).

---

<!-- id: labs-kali-s-10 -->
<!-- unit: Part 5 — SQL / MariaDB (on Kali) -->

### Lab S-10 — Triggers audit log

**Suggested pace:** 70–110 minutes

**Goal:** Execute the relational modeling and SQL skills for this step—see procedure.

#### Why this lab exists

Databases reward **slow thinking**: schema first, constraints second, queries third.

#### Background

**MariaDB** speaks the same client protocol as MySQL for most learner tasks. The **`mariadb`** client connects to the server; **`sudo mariadb`** typically opens a local **root** administrative session on fresh installs. Always prefer **parameterized** queries in application code (covered in a later lab).

#### Commands explained (read before you type)

**Command:**

```bash
sudo mariadb
```

- **What it does:** Opens the MariaDB client as the privileged local admin (typical Kali install).
- **Why we use it here:** You need DDL privileges to create databases and users.

#### Procedure (go slowly)

### Phase 1 — Session + safety (10 min)

1. Open **two** terminals: one `sudo mariadb` (admin), one normal shell for `mysqldump` / editors.
2. Before destructive DDL, run `SHOW CREATE TABLE …` or copy schema with `mysqldump --no-data` when appropriate.

### Phase 2 — Vocabulary (10 min)

- Classify each statement you will run as **DDL** (schema), **DML** (data), or **DCL** (permissions).
- Write one sentence on why `FLUSH PRIVILEGES;` exists after `GRANT`.

### Phase 3 — Execute the lab

**S-10 — Audit trigger**

Create `audit_log` table. `AFTER UPDATE` on `incidents` inserts old/new severity with `NOW()`.
Fire an update and `SELECT * FROM audit_log ORDER BY id DESC LIMIT 5;`.


### Phase 4 — Integrity checks (15 min)

- After inserts, run `SELECT … COUNT(*)` sanity queries. Use `EXPLAIN` on at least one non-trivial `SELECT`.
- If you changed users, log out and verify **least privilege** by connecting as `analyst`.

### Phase 5 — Diagram + notes (10 min)

- Sketch ER diagram on paper; photograph or transcribe key entities and cardinalities.


#### Verify

Schema and queries match lab intent; you can draw the **ER diagram** on paper.

#### Common mistakes

Mixing quoting for user@host; forgetting `FLUSH PRIVILEGES` after GRANT changes in some workflows.

#### Going further

Read MariaDB explain JSON output once (`EXPLAIN FORMAT=JSON`).

---

<!-- id: labs-kali-s-11 -->
<!-- unit: Part 5 — SQL / MariaDB (on Kali) -->

### Lab S-11 — Backup and restore

**Suggested pace:** 70–110 minutes

**Goal:** Execute the relational modeling and SQL skills for this step—see procedure.

#### Why this lab exists

Databases reward **slow thinking**: schema first, constraints second, queries third.

#### Background

**MariaDB** speaks the same client protocol as MySQL for most learner tasks. The **`mariadb`** client connects to the server; **`sudo mariadb`** typically opens a local **root** administrative session on fresh installs. Always prefer **parameterized** queries in application code (covered in a later lab).

#### Commands explained (read before you type)

**Command:**

```bash
sudo mariadb
```

- **What it does:** Opens the MariaDB client as the privileged local admin (typical Kali install).
- **Why we use it here:** You need DDL privileges to create databases and users.

#### Procedure (go slowly)

### Phase 1 — Session + safety (10 min)

1. Open **two** terminals: one `sudo mariadb` (admin), one normal shell for `mysqldump` / editors.
2. Before destructive DDL, run `SHOW CREATE TABLE …` or copy schema with `mysqldump --no-data` when appropriate.

### Phase 2 — Vocabulary (10 min)

- Classify each statement you will run as **DDL** (schema), **DML** (data), or **DCL** (permissions).
- Write one sentence on why `FLUSH PRIVILEGES;` exists after `GRANT`.

### Phase 3 — Execute the lab

**S-11 — mysqldump restore**

Shell: `mysqldump soc_training > /tmp/soc.sql` then create `soc_training_restore` and import.
Verify row counts match with `CHECKSUM TABLE` or `COUNT(*)` per table.


### Phase 4 — Integrity checks (15 min)

- After inserts, run `SELECT … COUNT(*)` sanity queries. Use `EXPLAIN` on at least one non-trivial `SELECT`.
- If you changed users, log out and verify **least privilege** by connecting as `analyst`.

### Phase 5 — Diagram + notes (10 min)

- Sketch ER diagram on paper; photograph or transcribe key entities and cardinalities.


#### Verify

Schema and queries match lab intent; you can draw the **ER diagram** on paper.

#### Common mistakes

Mixing quoting for user@host; forgetting `FLUSH PRIVILEGES` after GRANT changes in some workflows.

#### Going further

Read MariaDB explain JSON output once (`EXPLAIN FORMAT=JSON`).

---

<!-- id: labs-kali-s-12 -->
<!-- unit: Part 5 — SQL / MariaDB (on Kali) -->

### Lab S-12 — Parameterized queries from Python

**Suggested pace:** 70–110 minutes

**Goal:** Execute the relational modeling and SQL skills for this step—see procedure.

#### Why this lab exists

Databases reward **slow thinking**: schema first, constraints second, queries third.

#### Background

**MariaDB** speaks the same client protocol as MySQL for most learner tasks. The **`mariadb`** client connects to the server; **`sudo mariadb`** typically opens a local **root** administrative session on fresh installs. Always prefer **parameterized** queries in application code (covered in a later lab).

#### Commands explained (read before you type)

**Command:**

```bash
sudo mariadb
```

- **What it does:** Opens the MariaDB client as the privileged local admin (typical Kali install).
- **Why we use it here:** You need DDL privileges to create databases and users.

#### Procedure (go slowly)

### Phase 1 — Session + safety (10 min)

1. Open **two** terminals: one `sudo mariadb` (admin), one normal shell for `mysqldump` / editors.
2. Before destructive DDL, run `SHOW CREATE TABLE …` or copy schema with `mysqldump --no-data` when appropriate.

### Phase 2 — Vocabulary (10 min)

- Classify each statement you will run as **DDL** (schema), **DML** (data), or **DCL** (permissions).
- Write one sentence on why `FLUSH PRIVILEGES;` exists after `GRANT`.

### Phase 3 — Execute the lab

**S-12 — Python parameterized inserts**

Install `PyMySQL` in venv. Script inserts a row using **tuple parameters**—show the query string uses `%s` placeholders only.
Demonstrate that string concatenation with user input would be unsafe (theory + tiny safe example).


### Phase 4 — Integrity checks (15 min)

- After inserts, run `SELECT … COUNT(*)` sanity queries. Use `EXPLAIN` on at least one non-trivial `SELECT`.
- If you changed users, log out and verify **least privilege** by connecting as `analyst`.

### Phase 5 — Diagram + notes (10 min)

- Sketch ER diagram on paper; photograph or transcribe key entities and cardinalities.


#### Verify

Schema and queries match lab intent; you can draw the **ER diagram** on paper.

#### Common mistakes

Mixing quoting for user@host; forgetting `FLUSH PRIVILEGES` after GRANT changes in some workflows.

#### Going further

Read MariaDB explain JSON output once (`EXPLAIN FORMAT=JSON`).

---

<!-- id: labs-kali-sec-01 -->
<!-- unit: Part 6 — Security+ aligned (on Kali) -->

### Lab SEC-01 — Threat modeling STRIDE on a fake web app

**Suggested pace:** 75–130 minutes

**Goal:** Build Security+ aligned instincts: evidence, least privilege, and safe lab boundaries.

#### Why this lab exists

**Ethics first:** only targets you own or have **written authorization** to test. These labs default to **localhost** and learning exercises.

#### Background

Security work is **evidence-based**. When a command could affect remote systems, **stop** and validate scope. Prefer snapshots before firewall or SSH changes.

#### Procedure (go slowly)

### Phase 1 — Ethics + scope (10 min)

- Write **scope** in your notebook: “I will only touch 127.0.0.1 / my VM / files I own.” Sign it with the date.
- If a command could touch remote systems, **stop** and re-read the man page SYNOPSIS.

### Phase 2 — Evidence discipline (10 min)

- Decide filename convention for transcripts (`~/labs/securityplus/SEC-NN-notes.txt`).
- For every tool, save **command + first 20 lines of output**.

### Phase 3 — Hands-on work

**STRIDE table for `/var/www/html/site`**

Build a six-row table (S,T,R,I,D,E) with **one realistic threat** and **one mitigation** each tied to your actual files (forms, static assets, nav links).
Reference OWASP or NIST language loosely—accuracy over buzzwords.


### Phase 4 — Control mapping (15 min)

- For each major action, label it **prevent / detect / respond** in NIST CSF terms (high level).

### Phase 5 — Lessons learned (10 min)

- What would you automate next time? What would you **never** do on production without CAB approval?


#### Verify

Artifacts in notes: commands, outputs, and a short risk statement.

#### Common mistakes

Running scanners against networks you do not own—**illegal** and out of scope.

#### Going further

Map this lab to a Security+ objective domain in your own words.

---

<!-- id: labs-kali-sec-02 -->
<!-- unit: Part 6 — Security+ aligned (on Kali) -->

### Lab SEC-02 — Hashing and password storage concepts

**Suggested pace:** 75–130 minutes

**Goal:** Build Security+ aligned instincts: evidence, least privilege, and safe lab boundaries.

#### Why this lab exists

**Ethics first:** only targets you own or have **written authorization** to test. These labs default to **localhost** and learning exercises.

#### Background

Security work is **evidence-based**. When a command could affect remote systems, **stop** and validate scope. Prefer snapshots before firewall or SSH changes.

#### Procedure (go slowly)

### Phase 1 — Ethics + scope (10 min)

- Write **scope** in your notebook: “I will only touch 127.0.0.1 / my VM / files I own.” Sign it with the date.
- If a command could touch remote systems, **stop** and re-read the man page SYNOPSIS.

### Phase 2 — Evidence discipline (10 min)

- Decide filename convention for transcripts (`~/labs/securityplus/SEC-NN-notes.txt`).
- For every tool, save **command + first 20 lines of output**.

### Phase 3 — Hands-on work

**Hash identification (safe)**

Use `hashid` (if installed) or a short Python script to **identify** algorithm family from sample strings your instructor provides.
Write why **rainbow tables** matter for unsalted MD5 but not for modern password hashes.


### Phase 4 — Control mapping (15 min)

- For each major action, label it **prevent / detect / respond** in NIST CSF terms (high level).

### Phase 5 — Lessons learned (10 min)

- What would you automate next time? What would you **never** do on production without CAB approval?


#### Verify

Artifacts in notes: commands, outputs, and a short risk statement.

#### Common mistakes

Running scanners against networks you do not own—**illegal** and out of scope.

#### Going further

Map this lab to a Security+ objective domain in your own words.

---

<!-- id: labs-kali-sec-03 -->
<!-- unit: Part 6 — Security+ aligned (on Kali) -->

### Lab SEC-03 — Symmetric encryption with OpenSSL

**Suggested pace:** 75–130 minutes

**Goal:** Build Security+ aligned instincts: evidence, least privilege, and safe lab boundaries.

#### Why this lab exists

**Ethics first:** only targets you own or have **written authorization** to test. These labs default to **localhost** and learning exercises.

#### Background

Security work is **evidence-based**. When a command could affect remote systems, **stop** and validate scope. Prefer snapshots before firewall or SSH changes.

#### Procedure (go slowly)

### Phase 1 — Ethics + scope (10 min)

- Write **scope** in your notebook: “I will only touch 127.0.0.1 / my VM / files I own.” Sign it with the date.
- If a command could touch remote systems, **stop** and re-read the man page SYNOPSIS.

### Phase 2 — Evidence discipline (10 min)

- Decide filename convention for transcripts (`~/labs/securityplus/SEC-NN-notes.txt`).
- For every tool, save **command + first 20 lines of output**.

### Phase 3 — Hands-on work

**OpenSSL symmetric encrypt/decrypt**

Create `/tmp/secret.txt`. Encrypt with `openssl enc -aes-256-gcm` (read `man enc` for Kali’s supported syntax).
Decrypt to a new file; `cmp` or `sha256sum` both files. Document **where the key lived** and why stdin keys are risky.


### Phase 4 — Control mapping (15 min)

- For each major action, label it **prevent / detect / respond** in NIST CSF terms (high level).

### Phase 5 — Lessons learned (10 min)

- What would you automate next time? What would you **never** do on production without CAB approval?


#### Verify

Artifacts in notes: commands, outputs, and a short risk statement.

#### Common mistakes

Running scanners against networks you do not own—**illegal** and out of scope.

#### Going further

Map this lab to a Security+ objective domain in your own words.

---

<!-- id: labs-kali-sec-04 -->
<!-- unit: Part 6 — Security+ aligned (on Kali) -->

### Lab SEC-04 — TLS inspection with openssl s_client

**Suggested pace:** 75–130 minutes

**Goal:** Build Security+ aligned instincts: evidence, least privilege, and safe lab boundaries.

#### Why this lab exists

**Ethics first:** only targets you own or have **written authorization** to test. These labs default to **localhost** and learning exercises.

#### Background

Security work is **evidence-based**. When a command could affect remote systems, **stop** and validate scope. Prefer snapshots before firewall or SSH changes.

#### Procedure (go slowly)

### Phase 1 — Ethics + scope (10 min)

- Write **scope** in your notebook: “I will only touch 127.0.0.1 / my VM / files I own.” Sign it with the date.
- If a command could touch remote systems, **stop** and re-read the man page SYNOPSIS.

### Phase 2 — Evidence discipline (10 min)

- Decide filename convention for transcripts (`~/labs/securityplus/SEC-NN-notes.txt`).
- For every tool, save **command + first 20 lines of output**.

### Phase 3 — Hands-on work

**openssl s_client**

`openssl s_client -connect example.com:443 -servername example.com -brief` — capture cipher, protocol version, certificate subject.
Map one line of output to “certificate transparency” or chain of trust in your notes.


### Phase 4 — Control mapping (15 min)

- For each major action, label it **prevent / detect / respond** in NIST CSF terms (high level).

### Phase 5 — Lessons learned (10 min)

- What would you automate next time? What would you **never** do on production without CAB approval?


#### Verify

Artifacts in notes: commands, outputs, and a short risk statement.

#### Common mistakes

Running scanners against networks you do not own—**illegal** and out of scope.

#### Going further

Map this lab to a Security+ objective domain in your own words.

---

<!-- id: labs-kali-sec-05 -->
<!-- unit: Part 6 — Security+ aligned (on Kali) -->

### Lab SEC-05 — Firewall basics (nftables or ufw)

**Suggested pace:** 75–130 minutes

**Goal:** Build Security+ aligned instincts: evidence, least privilege, and safe lab boundaries.

#### Why this lab exists

**Ethics first:** only targets you own or have **written authorization** to test. These labs default to **localhost** and learning exercises.

#### Background

Security work is **evidence-based**. When a command could affect remote systems, **stop** and validate scope. Prefer snapshots before firewall or SSH changes.

#### Procedure (go slowly)

### Phase 1 — Ethics + scope (10 min)

- Write **scope** in your notebook: “I will only touch 127.0.0.1 / my VM / files I own.” Sign it with the date.
- If a command could touch remote systems, **stop** and re-read the man page SYNOPSIS.

### Phase 2 — Evidence discipline (10 min)

- Decide filename convention for transcripts (`~/labs/securityplus/SEC-NN-notes.txt`).
- For every tool, save **command + first 20 lines of output**.

### Phase 3 — Hands-on work

**Host firewall**

Choose `ufw` **or** `nftables`. Default deny, allow **22/tcp** and **80/tcp** only from your lab subnet or host IP.
`nmap` from host before/after; paste diff.


### Phase 4 — Control mapping (15 min)

- For each major action, label it **prevent / detect / respond** in NIST CSF terms (high level).

### Phase 5 — Lessons learned (10 min)

- What would you automate next time? What would you **never** do on production without CAB approval?


#### Verify

Artifacts in notes: commands, outputs, and a short risk statement.

#### Common mistakes

Running scanners against networks you do not own—**illegal** and out of scope.

#### Going further

Map this lab to a Security+ objective domain in your own words.

---

<!-- id: labs-kali-sec-06 -->
<!-- unit: Part 6 — Security+ aligned (on Kali) -->

### Lab SEC-06 — fail2ban-style log review

**Suggested pace:** 75–130 minutes

**Goal:** Build Security+ aligned instincts: evidence, least privilege, and safe lab boundaries.

#### Why this lab exists

**Ethics first:** only targets you own or have **written authorization** to test. These labs default to **localhost** and learning exercises.

#### Background

Security work is **evidence-based**. When a command could affect remote systems, **stop** and validate scope. Prefer snapshots before firewall or SSH changes.

#### Procedure (go slowly)

### Phase 1 — Ethics + scope (10 min)

- Write **scope** in your notebook: “I will only touch 127.0.0.1 / my VM / files I own.” Sign it with the date.
- If a command could touch remote systems, **stop** and re-read the man page SYNOPSIS.

### Phase 2 — Evidence discipline (10 min)

- Decide filename convention for transcripts (`~/labs/securityplus/SEC-NN-notes.txt`).
- For every tool, save **command + first 20 lines of output**.

### Phase 3 — Hands-on work

**SSH log review**

`sudo journalctl -u ssh -n 80 --no-pager` or `/var/log/auth.log` — circle **preauth** vs **accepted** lines.
Write a one-page “incident note” as if you triaged automated scans.


### Phase 4 — Control mapping (15 min)

- For each major action, label it **prevent / detect / respond** in NIST CSF terms (high level).

### Phase 5 — Lessons learned (10 min)

- What would you automate next time? What would you **never** do on production without CAB approval?


#### Verify

Artifacts in notes: commands, outputs, and a short risk statement.

#### Common mistakes

Running scanners against networks you do not own—**illegal** and out of scope.

#### Going further

Map this lab to a Security+ objective domain in your own words.

---

<!-- id: labs-kali-sec-07 -->
<!-- unit: Part 6 — Security+ aligned (on Kali) -->

### Lab SEC-07 — File permissions and ACLs

**Suggested pace:** 75–130 minutes

**Goal:** Build Security+ aligned instincts: evidence, least privilege, and safe lab boundaries.

#### Why this lab exists

**Ethics first:** only targets you own or have **written authorization** to test. These labs default to **localhost** and learning exercises.

#### Background

Security work is **evidence-based**. When a command could affect remote systems, **stop** and validate scope. Prefer snapshots before firewall or SSH changes.

#### Procedure (go slowly)

### Phase 1 — Ethics + scope (10 min)

- Write **scope** in your notebook: “I will only touch 127.0.0.1 / my VM / files I own.” Sign it with the date.
- If a command could touch remote systems, **stop** and re-read the man page SYNOPSIS.

### Phase 2 — Evidence discipline (10 min)

- Decide filename convention for transcripts (`~/labs/securityplus/SEC-NN-notes.txt`).
- For every tool, save **command + first 20 lines of output**.

### Phase 3 — Hands-on work

**chmod / umask / ACL demo**

Create dirs under `/tmp/lhperm`. Show `umask` effect on new files. Fix a deliberate `chmod 777` using sane modes.
Optional: `setfacl -m u:analyst:r-- file` and `getfacl`.


### Phase 4 — Control mapping (15 min)

- For each major action, label it **prevent / detect / respond** in NIST CSF terms (high level).

### Phase 5 — Lessons learned (10 min)

- What would you automate next time? What would you **never** do on production without CAB approval?


#### Verify

Artifacts in notes: commands, outputs, and a short risk statement.

#### Common mistakes

Running scanners against networks you do not own—**illegal** and out of scope.

#### Going further

Map this lab to a Security+ objective domain in your own words.

---

<!-- id: labs-kali-sec-08 -->
<!-- unit: Part 6 — Security+ aligned (on Kali) -->

### Lab SEC-08 — Apache service hardening checklist

**Suggested pace:** 75–130 minutes

**Goal:** Build Security+ aligned instincts: evidence, least privilege, and safe lab boundaries.

#### Why this lab exists

**Ethics first:** only targets you own or have **written authorization** to test. These labs default to **localhost** and learning exercises.

#### Background

Security work is **evidence-based**. When a command could affect remote systems, **stop** and validate scope. Prefer snapshots before firewall or SSH changes.

#### Procedure (go slowly)

### Phase 1 — Ethics + scope (10 min)

- Write **scope** in your notebook: “I will only touch 127.0.0.1 / my VM / files I own.” Sign it with the date.
- If a command could touch remote systems, **stop** and re-read the man page SYNOPSIS.

### Phase 2 — Evidence discipline (10 min)

- Decide filename convention for transcripts (`~/labs/securityplus/SEC-NN-notes.txt`).
- For every tool, save **command + first 20 lines of output**.

### Phase 3 — Hands-on work

**Apache hardening checklist**

Turn **Indexes** off for a test directory, add **ServerTokens Prod** (if module available), hide version banner where possible.
Each change: **backup file**, `apache2ctl configtest`, `systemctl reload apache2`.


### Phase 4 — Control mapping (15 min)

- For each major action, label it **prevent / detect / respond** in NIST CSF terms (high level).

### Phase 5 — Lessons learned (10 min)

- What would you automate next time? What would you **never** do on production without CAB approval?


#### Verify

Artifacts in notes: commands, outputs, and a short risk statement.

#### Common mistakes

Running scanners against networks you do not own—**illegal** and out of scope.

#### Going further

Map this lab to a Security+ objective domain in your own words.

---

<!-- id: labs-kali-sec-09 -->
<!-- unit: Part 6 — Security+ aligned (on Kali) -->

### Lab SEC-09 — Wireshark: follow a TCP stream

**Suggested pace:** 75–130 minutes

**Goal:** Build Security+ aligned instincts: evidence, least privilege, and safe lab boundaries.

#### Why this lab exists

**Ethics first:** only targets you own or have **written authorization** to test. These labs default to **localhost** and learning exercises.

#### Background

Security work is **evidence-based**. When a command could affect remote systems, **stop** and validate scope. Prefer snapshots before firewall or SSH changes.

#### Procedure (go slowly)

### Phase 1 — Ethics + scope (10 min)

- Write **scope** in your notebook: “I will only touch 127.0.0.1 / my VM / files I own.” Sign it with the date.
- If a command could touch remote systems, **stop** and re-read the man page SYNOPSIS.

### Phase 2 — Evidence discipline (10 min)

- Decide filename convention for transcripts (`~/labs/securityplus/SEC-NN-notes.txt`).
- For every tool, save **command + first 20 lines of output**.

### Phase 3 — Hands-on work

**Wireshark TCP stream**

Capture loopback while `curl http://127.0.0.1/`. Follow **TCP stream**; highlight request line + Host header.
Explain when TLS would change what you see.


### Phase 4 — Control mapping (15 min)

- For each major action, label it **prevent / detect / respond** in NIST CSF terms (high level).

### Phase 5 — Lessons learned (10 min)

- What would you automate next time? What would you **never** do on production without CAB approval?


#### Verify

Artifacts in notes: commands, outputs, and a short risk statement.

#### Common mistakes

Running scanners against networks you do not own—**illegal** and out of scope.

#### Going further

Map this lab to a Security+ objective domain in your own words.

---

<!-- id: labs-kali-sec-10 -->
<!-- unit: Part 6 — Security+ aligned (on Kali) -->

### Lab SEC-10 — DNS recon (passive)

**Suggested pace:** 75–130 minutes

**Goal:** Build Security+ aligned instincts: evidence, least privilege, and safe lab boundaries.

#### Why this lab exists

**Ethics first:** only targets you own or have **written authorization** to test. These labs default to **localhost** and learning exercises.

#### Background

Security work is **evidence-based**. When a command could affect remote systems, **stop** and validate scope. Prefer snapshots before firewall or SSH changes.

#### Procedure (go slowly)

### Phase 1 — Ethics + scope (10 min)

- Write **scope** in your notebook: “I will only touch 127.0.0.1 / my VM / files I own.” Sign it with the date.
- If a command could touch remote systems, **stop** and re-read the man page SYNOPSIS.

### Phase 2 — Evidence discipline (10 min)

- Decide filename convention for transcripts (`~/labs/securityplus/SEC-NN-notes.txt`).
- For every tool, save **command + first 20 lines of output**.

### Phase 3 — Hands-on work

**Passive DNS**

`dig +trace` vs recursive query. Compare answers from `8.8.8.8` vs your local resolver if safe.
Document **ethical** use—no hammering authoritative servers.


### Phase 4 — Control mapping (15 min)

- For each major action, label it **prevent / detect / respond** in NIST CSF terms (high level).

### Phase 5 — Lessons learned (10 min)

- What would you automate next time? What would you **never** do on production without CAB approval?


#### Verify

Artifacts in notes: commands, outputs, and a short risk statement.

#### Common mistakes

Running scanners against networks you do not own—**illegal** and out of scope.

#### Going further

Map this lab to a Security+ objective domain in your own words.

---

<!-- id: labs-kali-sec-11 -->
<!-- unit: Part 6 — Security+ aligned (on Kali) -->

### Lab SEC-11 — Certificate pinning concepts

**Suggested pace:** 75–130 minutes

**Goal:** Build Security+ aligned instincts: evidence, least privilege, and safe lab boundaries.

#### Why this lab exists

**Ethics first:** only targets you own or have **written authorization** to test. These labs default to **localhost** and learning exercises.

#### Background

Security work is **evidence-based**. When a command could affect remote systems, **stop** and validate scope. Prefer snapshots before firewall or SSH changes.

#### Procedure (go slowly)

### Phase 1 — Ethics + scope (10 min)

- Write **scope** in your notebook: “I will only touch 127.0.0.1 / my VM / files I own.” Sign it with the date.
- If a command could touch remote systems, **stop** and re-read the man page SYNOPSIS.

### Phase 2 — Evidence discipline (10 min)

- Decide filename convention for transcripts (`~/labs/securityplus/SEC-NN-notes.txt`).
- For every tool, save **command + first 20 lines of output**.

### Phase 3 — Hands-on work

**Pinning discussion + curl**

Essay (300–500 words): mobile vs browser pinning tradeoffs. If feasible, demo `curl --pinnedpubkey` against a host; otherwise dry-run with docs.


### Phase 4 — Control mapping (15 min)

- For each major action, label it **prevent / detect / respond** in NIST CSF terms (high level).

### Phase 5 — Lessons learned (10 min)

- What would you automate next time? What would you **never** do on production without CAB approval?


#### Verify

Artifacts in notes: commands, outputs, and a short risk statement.

#### Common mistakes

Running scanners against networks you do not own—**illegal** and out of scope.

#### Going further

Map this lab to a Security+ objective domain in your own words.

---

<!-- id: labs-kali-sec-12 -->
<!-- unit: Part 6 — Security+ aligned (on Kali) -->

### Lab SEC-12 — Incident response tabletop + IOC table

**Suggested pace:** 75–130 minutes

**Goal:** Build Security+ aligned instincts: evidence, least privilege, and safe lab boundaries.

#### Why this lab exists

**Ethics first:** only targets you own or have **written authorization** to test. These labs default to **localhost** and learning exercises.

#### Background

Security work is **evidence-based**. When a command could affect remote systems, **stop** and validate scope. Prefer snapshots before firewall or SSH changes.

#### Procedure (go slowly)

### Phase 1 — Ethics + scope (10 min)

- Write **scope** in your notebook: “I will only touch 127.0.0.1 / my VM / files I own.” Sign it with the date.
- If a command could touch remote systems, **stop** and re-read the man page SYNOPSIS.

### Phase 2 — Evidence discipline (10 min)

- Decide filename convention for transcripts (`~/labs/securityplus/SEC-NN-notes.txt`).
- For every tool, save **command + first 20 lines of output**.

### Phase 3 — Hands-on work

**IR tabletop + IOC MariaDB table**

Write phishing timeline. Create `iocs` table (type, value, first_seen, source). Insert three IOC rows.
Link (conceptually) to incidents table if you already built it.


### Phase 4 — Control mapping (15 min)

- For each major action, label it **prevent / detect / respond** in NIST CSF terms (high level).

### Phase 5 — Lessons learned (10 min)

- What would you automate next time? What would you **never** do on production without CAB approval?


#### Verify

Artifacts in notes: commands, outputs, and a short risk statement.

#### Common mistakes

Running scanners against networks you do not own—**illegal** and out of scope.

#### Going further

Map this lab to a Security+ objective domain in your own words.

---

<!-- id: labs-kali-sec-13 -->
<!-- unit: Part 6 — Security+ aligned (on Kali) -->

### Lab SEC-13 — Secure baselines (Ansible-style outline)

**Suggested pace:** 75–130 minutes

**Goal:** Build Security+ aligned instincts: evidence, least privilege, and safe lab boundaries.

#### Why this lab exists

**Ethics first:** only targets you own or have **written authorization** to test. These labs default to **localhost** and learning exercises.

#### Background

Security work is **evidence-based**. When a command could affect remote systems, **stop** and validate scope. Prefer snapshots before firewall or SSH changes.

#### Procedure (go slowly)

### Phase 1 — Ethics + scope (10 min)

- Write **scope** in your notebook: “I will only touch 127.0.0.1 / my VM / files I own.” Sign it with the date.
- If a command could touch remote systems, **stop** and re-read the man page SYNOPSIS.

### Phase 2 — Evidence discipline (10 min)

- Decide filename convention for transcripts (`~/labs/securityplus/SEC-NN-notes.txt`).
- For every tool, save **command + first 20 lines of output**.

### Phase 3 — Hands-on work

**Baseline outline**

Numbered list (20+ steps) for imaging a fresh Kali: users, sudo, updates, services to disable, auditd/syslog, backup.
Map each group to CIS or STIG **functions** at high level.


### Phase 4 — Control mapping (15 min)

- For each major action, label it **prevent / detect / respond** in NIST CSF terms (high level).

### Phase 5 — Lessons learned (10 min)

- What would you automate next time? What would you **never** do on production without CAB approval?


#### Verify

Artifacts in notes: commands, outputs, and a short risk statement.

#### Common mistakes

Running scanners against networks you do not own—**illegal** and out of scope.

#### Going further

Map this lab to a Security+ objective domain in your own words.

---

<!-- id: labs-kali-sec-14 -->
<!-- unit: Part 6 — Security+ aligned (on Kali) -->

### Lab SEC-14 — Log aggregation design

**Suggested pace:** 75–130 minutes

**Goal:** Build Security+ aligned instincts: evidence, least privilege, and safe lab boundaries.

#### Why this lab exists

**Ethics first:** only targets you own or have **written authorization** to test. These labs default to **localhost** and learning exercises.

#### Background

Security work is **evidence-based**. When a command could affect remote systems, **stop** and validate scope. Prefer snapshots before firewall or SSH changes.

#### Procedure (go slowly)

### Phase 1 — Ethics + scope (10 min)

- Write **scope** in your notebook: “I will only touch 127.0.0.1 / my VM / files I own.” Sign it with the date.
- If a command could touch remote systems, **stop** and re-read the man page SYNOPSIS.

### Phase 2 — Evidence discipline (10 min)

- Decide filename convention for transcripts (`~/labs/securityplus/SEC-NN-notes.txt`).
- For every tool, save **command + first 20 lines of output**.

### Phase 3 — Hands-on work

**Log aggregation sketch**

Draw (ASCII) rsyslog forwarding to a collector VM. List **three correlation keys** (timestamp, host, session id).
Optional: `logger` test message and show it in `journalctl`.


### Phase 4 — Control mapping (15 min)

- For each major action, label it **prevent / detect / respond** in NIST CSF terms (high level).

### Phase 5 — Lessons learned (10 min)

- What would you automate next time? What would you **never** do on production without CAB approval?


#### Verify

Artifacts in notes: commands, outputs, and a short risk statement.

#### Common mistakes

Running scanners against networks you do not own—**illegal** and out of scope.

#### Going further

Map this lab to a Security+ objective domain in your own words.

---

<!-- id: labs-kali-t-01 -->
<!-- unit: Part 7 — Tech+ / IT fundamentals (on Kali) -->

### Lab T-01 — Filesystem treasure hunt

**Suggested pace:** 60–95 minutes

**Goal:** Strengthen Linux administration fundamentals that underpin every other lab.

#### Why this lab exists

Slow OS fluency pays compounding returns: when web or DB labs fail, you will **know where to look**.

#### Background

Treat the shell as a **precision instrument**: read man pages (`man systemd.service`), use `--help`, and prefer non-destructive probes (`ls`, `stat`, `ss -lntp`) before changes.

#### Procedure (go slowly)

### Phase 1 — Read the manual first (10 min)

- Identify **one** man page relevant to today’s topic; read **NAME**, **SYNOPSIS**, and **DESCRIPTION** first paragraphs.

### Phase 2 — Predict outputs (10 min)

- Before each command, write your **expected** substring in the output.

### Phase 3 — Execute + capture

**find / locate / tree**

`man find` first: run five different predicates (`-name`, `-path`, `-mtime`, `-size`, `-perm`).
`sudo updatedb` then `locate passwd` (read-only). `tree -L 2 /etc/systemd`.
Notebook: when **find** vs **locate** is appropriate.


### Phase 4 — Correlation (15 min)

- Tie at least two observations together (e.g. disk free space vs largest mount; process RSS vs available RAM).

### Phase 5 — Runbook snippet (10 min)

- Produce **three** bullet “if user reports X, run Y” steps grounded in what you actually ran.


#### Verify

You can explain **one diagram** in prose: what changed on disk or network and why it matters.

#### Common mistakes

Editing `/etc` without backup—always `sudo cp` first.

#### Going further

Link this lab to a Tech+ chapter you studied in the main track.

---

<!-- id: labs-kali-t-02 -->
<!-- unit: Part 7 — Tech+ / IT fundamentals (on Kali) -->

### Lab T-02 — Package management mastery

**Suggested pace:** 60–95 minutes

**Goal:** Strengthen Linux administration fundamentals that underpin every other lab.

#### Why this lab exists

Slow OS fluency pays compounding returns: when web or DB labs fail, you will **know where to look**.

#### Background

Treat the shell as a **precision instrument**: read man pages (`man systemd.service`), use `--help`, and prefer non-destructive probes (`ls`, `stat`, `ss -lntp`) before changes.

#### Procedure (go slowly)

### Phase 1 — Read the manual first (10 min)

- Identify **one** man page relevant to today’s topic; read **NAME**, **SYNOPSIS**, and **DESCRIPTION** first paragraphs.

### Phase 2 — Predict outputs (10 min)

- Before each command, write your **expected** substring in the output.

### Phase 3 — Execute + capture

**apt workflow**

`apt-cache policy apache2`, `apt show apache2 | sed -n '1,25p'`. Install then remove a harmless package (`sl` or similar).
Read `/var/log/apt/history.log` excerpt after.


### Phase 4 — Correlation (15 min)

- Tie at least two observations together (e.g. disk free space vs largest mount; process RSS vs available RAM).

### Phase 5 — Runbook snippet (10 min)

- Produce **three** bullet “if user reports X, run Y” steps grounded in what you actually ran.


#### Verify

You can explain **one diagram** in prose: what changed on disk or network and why it matters.

#### Common mistakes

Editing `/etc` without backup—always `sudo cp` first.

#### Going further

Link this lab to a Tech+ chapter you studied in the main track.

---

<!-- id: labs-kali-t-03 -->
<!-- unit: Part 7 — Tech+ / IT fundamentals (on Kali) -->

### Lab T-03 — Users and groups

**Suggested pace:** 60–95 minutes

**Goal:** Strengthen Linux administration fundamentals that underpin every other lab.

#### Why this lab exists

Slow OS fluency pays compounding returns: when web or DB labs fail, you will **know where to look**.

#### Background

Treat the shell as a **precision instrument**: read man pages (`man systemd.service`), use `--help`, and prefer non-destructive probes (`ls`, `stat`, `ss -lntp`) before changes.

#### Procedure (go slowly)

### Phase 1 — Read the manual first (10 min)

- Identify **one** man page relevant to today’s topic; read **NAME**, **SYNOPSIS**, and **DESCRIPTION** first paragraphs.

### Phase 2 — Predict outputs (10 min)

- Before each command, write your **expected** substring in the output.

### Phase 3 — Execute + capture

**Users and groups**

`sudo adduser techlab` (interactive). `sudo usermod -aG sudo techlab` **or** a custom group—justify choice.
Compare `su -` vs `sudo -i` in your notes (environment, audit trail).


### Phase 4 — Correlation (15 min)

- Tie at least two observations together (e.g. disk free space vs largest mount; process RSS vs available RAM).

### Phase 5 — Runbook snippet (10 min)

- Produce **three** bullet “if user reports X, run Y” steps grounded in what you actually ran.


#### Verify

You can explain **one diagram** in prose: what changed on disk or network and why it matters.

#### Common mistakes

Editing `/etc` without backup—always `sudo cp` first.

#### Going further

Link this lab to a Tech+ chapter you studied in the main track.

---

<!-- id: labs-kali-t-04 -->
<!-- unit: Part 7 — Tech+ / IT fundamentals (on Kali) -->

### Lab T-04 — Disk and memory (user level)

**Suggested pace:** 60–95 minutes

**Goal:** Strengthen Linux administration fundamentals that underpin every other lab.

#### Why this lab exists

Slow OS fluency pays compounding returns: when web or DB labs fail, you will **know where to look**.

#### Background

Treat the shell as a **precision instrument**: read man pages (`man systemd.service`), use `--help`, and prefer non-destructive probes (`ls`, `stat`, `ss -lntp`) before changes.

#### Procedure (go slowly)

### Phase 1 — Read the manual first (10 min)

- Identify **one** man page relevant to today’s topic; read **NAME**, **SYNOPSIS**, and **DESCRIPTION** first paragraphs.

### Phase 2 — Predict outputs (10 min)

- Before each command, write your **expected** substring in the output.

### Phase 3 — Execute + capture

**df / lsblk / free**

Correlate `df -hT` mount points with `lsblk -f` **FSTYPE**.
Run `stress-ng --vm 1 --timeout 5s` if installed—or open several tabs—watch `free -h` sampling.


### Phase 4 — Correlation (15 min)

- Tie at least two observations together (e.g. disk free space vs largest mount; process RSS vs available RAM).

### Phase 5 — Runbook snippet (10 min)

- Produce **three** bullet “if user reports X, run Y” steps grounded in what you actually ran.


#### Verify

You can explain **one diagram** in prose: what changed on disk or network and why it matters.

#### Common mistakes

Editing `/etc` without backup—always `sudo cp` first.

#### Going further

Link this lab to a Tech+ chapter you studied in the main track.

---

<!-- id: labs-kali-t-05 -->
<!-- unit: Part 7 — Tech+ / IT fundamentals (on Kali) -->

### Lab T-05 — Process lifecycle

**Suggested pace:** 60–95 minutes

**Goal:** Strengthen Linux administration fundamentals that underpin every other lab.

#### Why this lab exists

Slow OS fluency pays compounding returns: when web or DB labs fail, you will **know where to look**.

#### Background

Treat the shell as a **precision instrument**: read man pages (`man systemd.service`), use `--help`, and prefer non-destructive probes (`ls`, `stat`, `ss -lntp`) before changes.

#### Procedure (go slowly)

### Phase 1 — Read the manual first (10 min)

- Identify **one** man page relevant to today’s topic; read **NAME**, **SYNOPSIS**, and **DESCRIPTION** first paragraphs.

### Phase 2 — Predict outputs (10 min)

- Before each command, write your **expected** substring in the output.

### Phase 3 — Execute + capture

**jobs / fg / bg / kill**

Start `sleep 300 &`, list `jobs`, bring to foreground, suspend with `Ctrl+Z`, `bg`, then `kill %1`.
Demonstrate `nice` / `renice` on a CPU loop script.


### Phase 4 — Correlation (15 min)

- Tie at least two observations together (e.g. disk free space vs largest mount; process RSS vs available RAM).

### Phase 5 — Runbook snippet (10 min)

- Produce **three** bullet “if user reports X, run Y” steps grounded in what you actually ran.


#### Verify

You can explain **one diagram** in prose: what changed on disk or network and why it matters.

#### Common mistakes

Editing `/etc` without backup—always `sudo cp` first.

#### Going further

Link this lab to a Tech+ chapter you studied in the main track.

---

<!-- id: labs-kali-t-06 -->
<!-- unit: Part 7 — Tech+ / IT fundamentals (on Kali) -->

### Lab T-06 — Networking I: interfaces and routes

**Suggested pace:** 60–95 minutes

**Goal:** Strengthen Linux administration fundamentals that underpin every other lab.

#### Why this lab exists

Slow OS fluency pays compounding returns: when web or DB labs fail, you will **know where to look**.

#### Background

Treat the shell as a **precision instrument**: read man pages (`man systemd.service`), use `--help`, and prefer non-destructive probes (`ls`, `stat`, `ss -lntp`) before changes.

#### Procedure (go slowly)

### Phase 1 — Read the manual first (10 min)

- Identify **one** man page relevant to today’s topic; read **NAME**, **SYNOPSIS**, and **DESCRIPTION** first paragraphs.

### Phase 2 — Predict outputs (10 min)

- Before each command, write your **expected** substring in the output.

### Phase 3 — Execute + capture

**ip route / ip neigh**

`ip -br link` then `ip -4 addr`. Draw default gateway, interface, and your VM’s IP.
`ip neigh show` — explain stale vs reachable.


### Phase 4 — Correlation (15 min)

- Tie at least two observations together (e.g. disk free space vs largest mount; process RSS vs available RAM).

### Phase 5 — Runbook snippet (10 min)

- Produce **three** bullet “if user reports X, run Y” steps grounded in what you actually ran.


#### Verify

You can explain **one diagram** in prose: what changed on disk or network and why it matters.

#### Common mistakes

Editing `/etc` without backup—always `sudo cp` first.

#### Going further

Link this lab to a Tech+ chapter you studied in the main track.

---

<!-- id: labs-kali-t-07 -->
<!-- unit: Part 7 — Tech+ / IT fundamentals (on Kali) -->

### Lab T-07 — Networking II: DNS and DHCP

**Suggested pace:** 60–95 minutes

**Goal:** Strengthen Linux administration fundamentals that underpin every other lab.

#### Why this lab exists

Slow OS fluency pays compounding returns: when web or DB labs fail, you will **know where to look**.

#### Background

Treat the shell as a **precision instrument**: read man pages (`man systemd.service`), use `--help`, and prefer non-destructive probes (`ls`, `stat`, `ss -lntp`) before changes.

#### Procedure (go slowly)

### Phase 1 — Read the manual first (10 min)

- Identify **one** man page relevant to today’s topic; read **NAME**, **SYNOPSIS**, and **DESCRIPTION** first paragraphs.

### Phase 2 — Predict outputs (10 min)

- Before each command, write your **expected** substring in the output.

### Phase 3 — Execute + capture

**resolv.conf / DHCP**

Cat `/etc/resolv.conf`. Identify whether **systemd-resolved** stub is in use (`resolvectl status`).
Renew lease (method depends on hypervisor); capture before/after `ip -4 addr` if it changes.


### Phase 4 — Correlation (15 min)

- Tie at least two observations together (e.g. disk free space vs largest mount; process RSS vs available RAM).

### Phase 5 — Runbook snippet (10 min)

- Produce **three** bullet “if user reports X, run Y” steps grounded in what you actually ran.


#### Verify

You can explain **one diagram** in prose: what changed on disk or network and why it matters.

#### Common mistakes

Editing `/etc` without backup—always `sudo cp` first.

#### Going further

Link this lab to a Tech+ chapter you studied in the main track.

---

<!-- id: labs-kali-t-08 -->
<!-- unit: Part 7 — Tech+ / IT fundamentals (on Kali) -->

### Lab T-08 — SSH keys and config

**Suggested pace:** 60–95 minutes

**Goal:** Strengthen Linux administration fundamentals that underpin every other lab.

#### Why this lab exists

Slow OS fluency pays compounding returns: when web or DB labs fail, you will **know where to look**.

#### Background

Treat the shell as a **precision instrument**: read man pages (`man systemd.service`), use `--help`, and prefer non-destructive probes (`ls`, `stat`, `ss -lntp`) before changes.

#### Procedure (go slowly)

### Phase 1 — Read the manual first (10 min)

- Identify **one** man page relevant to today’s topic; read **NAME**, **SYNOPSIS**, and **DESCRIPTION** first paragraphs.

### Phase 2 — Predict outputs (10 min)

- Before each command, write your **expected** substring in the output.

### Phase 3 — Execute + capture

**SSH keys**

`ssh-keygen -t ed25519 -f ~/.ssh/lh_lab -N ""` then configure `~/.ssh/config` **Host** alias.
**Do not** disable password auth on a shared machine—only describe the steps for an isolated lab with snapshot.


### Phase 4 — Correlation (15 min)

- Tie at least two observations together (e.g. disk free space vs largest mount; process RSS vs available RAM).

### Phase 5 — Runbook snippet (10 min)

- Produce **three** bullet “if user reports X, run Y” steps grounded in what you actually ran.


#### Verify

You can explain **one diagram** in prose: what changed on disk or network and why it matters.

#### Common mistakes

Editing `/etc` without backup—always `sudo cp` first.

#### Going further

Link this lab to a Tech+ chapter you studied in the main track.

---

<!-- id: labs-kali-t-09 -->
<!-- unit: Part 7 — Tech+ / IT fundamentals (on Kali) -->

### Lab T-09 — Cron and timers

**Suggested pace:** 60–95 minutes

**Goal:** Strengthen Linux administration fundamentals that underpin every other lab.

#### Why this lab exists

Slow OS fluency pays compounding returns: when web or DB labs fail, you will **know where to look**.

#### Background

Treat the shell as a **precision instrument**: read man pages (`man systemd.service`), use `--help`, and prefer non-destructive probes (`ls`, `stat`, `ss -lntp`) before changes.

#### Procedure (go slowly)

### Phase 1 — Read the manual first (10 min)

- Identify **one** man page relevant to today’s topic; read **NAME**, **SYNOPSIS**, and **DESCRIPTION** first paragraphs.

### Phase 2 — Predict outputs (10 min)

- Before each command, write your **expected** substring in the output.

### Phase 3 — Execute + capture

**cron**

`crontab -e` entry: append timestamp every 5 minutes to `~/labs/techplus/cron.log`.
`grep CRON /var/log/syslog` or `journalctl -u cron` lines.


### Phase 4 — Correlation (15 min)

- Tie at least two observations together (e.g. disk free space vs largest mount; process RSS vs available RAM).

### Phase 5 — Runbook snippet (10 min)

- Produce **three** bullet “if user reports X, run Y” steps grounded in what you actually ran.


#### Verify

You can explain **one diagram** in prose: what changed on disk or network and why it matters.

#### Common mistakes

Editing `/etc` without backup—always `sudo cp` first.

#### Going further

Link this lab to a Tech+ chapter you studied in the main track.

---

<!-- id: labs-kali-t-10 -->
<!-- unit: Part 7 — Tech+ / IT fundamentals (on Kali) -->

### Lab T-10 — systemd unit for a personal script

**Suggested pace:** 60–95 minutes

**Goal:** Strengthen Linux administration fundamentals that underpin every other lab.

#### Why this lab exists

Slow OS fluency pays compounding returns: when web or DB labs fail, you will **know where to look**.

#### Background

Treat the shell as a **precision instrument**: read man pages (`man systemd.service`), use `--help`, and prefer non-destructive probes (`ls`, `stat`, `ss -lntp`) before changes.

#### Procedure (go slowly)

### Phase 1 — Read the manual first (10 min)

- Identify **one** man page relevant to today’s topic; read **NAME**, **SYNOPSIS**, and **DESCRIPTION** first paragraphs.

### Phase 2 — Predict outputs (10 min)

- Before each command, write your **expected** substring in the output.

### Phase 3 — Execute + capture

**systemd user or system unit**

Create a **oneshot** or simple service running `python3 -m http.server 9999 --bind 127.0.0.1`.
`systemctl --user daemon-reload` if user unit; else system unit with `sudo`. Enable, start, status, stop.


### Phase 4 — Correlation (15 min)

- Tie at least two observations together (e.g. disk free space vs largest mount; process RSS vs available RAM).

### Phase 5 — Runbook snippet (10 min)

- Produce **three** bullet “if user reports X, run Y” steps grounded in what you actually ran.


#### Verify

You can explain **one diagram** in prose: what changed on disk or network and why it matters.

#### Common mistakes

Editing `/etc` without backup—always `sudo cp` first.

#### Going further

Link this lab to a Tech+ chapter you studied in the main track.

---

<!-- id: labs-kali-t-11 -->
<!-- unit: Part 7 — Tech+ / IT fundamentals (on Kali) -->

### Lab T-11 — Documentation: runbook

**Suggested pace:** 60–95 minutes

**Goal:** Strengthen Linux administration fundamentals that underpin every other lab.

#### Why this lab exists

Slow OS fluency pays compounding returns: when web or DB labs fail, you will **know where to look**.

#### Background

Treat the shell as a **precision instrument**: read man pages (`man systemd.service`), use `--help`, and prefer non-destructive probes (`ls`, `stat`, `ss -lntp`) before changes.

#### Procedure (go slowly)

### Phase 1 — Read the manual first (10 min)

- Identify **one** man page relevant to today’s topic; read **NAME**, **SYNOPSIS**, and **DESCRIPTION** first paragraphs.

### Phase 2 — Predict outputs (10 min)

- Before each command, write your **expected** substring in the output.

### Phase 3 — Execute + capture

**Runbook: Apache won’t start**

Write ordered checks: `systemctl status`, `journalctl -u apache2 -n 50`, `apache2ctl configtest`, `ss -lntp | grep :80`.
Include **one** fictional symptom + resolution.


### Phase 4 — Correlation (15 min)

- Tie at least two observations together (e.g. disk free space vs largest mount; process RSS vs available RAM).

### Phase 5 — Runbook snippet (10 min)

- Produce **three** bullet “if user reports X, run Y” steps grounded in what you actually ran.


#### Verify

You can explain **one diagram** in prose: what changed on disk or network and why it matters.

#### Common mistakes

Editing `/etc` without backup—always `sudo cp` first.

#### Going further

Link this lab to a Tech+ chapter you studied in the main track.

---

<!-- id: labs-kali-t-12 -->
<!-- unit: Part 7 — Tech+ / IT fundamentals (on Kali) -->

### Lab T-12 — Backup strategy comparison

**Suggested pace:** 60–95 minutes

**Goal:** Strengthen Linux administration fundamentals that underpin every other lab.

#### Why this lab exists

Slow OS fluency pays compounding returns: when web or DB labs fail, you will **know where to look**.

#### Background

Treat the shell as a **precision instrument**: read man pages (`man systemd.service`), use `--help`, and prefer non-destructive probes (`ls`, `stat`, `ss -lntp`) before changes.

#### Procedure (go slowly)

### Phase 1 — Read the manual first (10 min)

- Identify **one** man page relevant to today’s topic; read **NAME**, **SYNOPSIS**, and **DESCRIPTION** first paragraphs.

### Phase 2 — Predict outputs (10 min)

- Before each command, write your **expected** substring in the output.

### Phase 3 — Execute + capture

**tar vs rsync backup**

Time `tar czf` of `~/labs` vs `rsync -a` to `/tmp/lh-backup`.
Document restore commands for both.


### Phase 4 — Correlation (15 min)

- Tie at least two observations together (e.g. disk free space vs largest mount; process RSS vs available RAM).

### Phase 5 — Runbook snippet (10 min)

- Produce **three** bullet “if user reports X, run Y” steps grounded in what you actually ran.


#### Verify

You can explain **one diagram** in prose: what changed on disk or network and why it matters.

#### Common mistakes

Editing `/etc` without backup—always `sudo cp` first.

#### Going further

Link this lab to a Tech+ chapter you studied in the main track.

---

<!-- id: labs-kali-t-13 -->
<!-- unit: Part 7 — Tech+ / IT fundamentals (on Kali) -->

### Lab T-13 — Performance baseline

**Suggested pace:** 60–95 minutes

**Goal:** Strengthen Linux administration fundamentals that underpin every other lab.

#### Why this lab exists

Slow OS fluency pays compounding returns: when web or DB labs fail, you will **know where to look**.

#### Background

Treat the shell as a **precision instrument**: read man pages (`man systemd.service`), use `--help`, and prefer non-destructive probes (`ls`, `stat`, `ss -lntp`) before changes.

#### Procedure (go slowly)

### Phase 1 — Read the manual first (10 min)

- Identify **one** man page relevant to today’s topic; read **NAME**, **SYNOPSIS**, and **DESCRIPTION** first paragraphs.

### Phase 2 — Predict outputs (10 min)

- Before each command, write your **expected** substring in the output.

### Phase 3 — Execute + capture

**ab / hey baseline**

If `ab` exists: `ab -n 200 -c 10 http://127.0.0.1/`. Capture RPS and failed requests.
Relate results to VM CPU count (`nproc`).


### Phase 4 — Correlation (15 min)

- Tie at least two observations together (e.g. disk free space vs largest mount; process RSS vs available RAM).

### Phase 5 — Runbook snippet (10 min)

- Produce **three** bullet “if user reports X, run Y” steps grounded in what you actually ran.


#### Verify

You can explain **one diagram** in prose: what changed on disk or network and why it matters.

#### Common mistakes

Editing `/etc` without backup—always `sudo cp` first.

#### Going further

Link this lab to a Tech+ chapter you studied in the main track.

---

<!-- id: labs-kali-t-14 -->
<!-- unit: Part 7 — Tech+ / IT fundamentals (on Kali) -->

### Lab T-14 — Hypervisor literacy

**Suggested pace:** 60–95 minutes

**Goal:** Strengthen Linux administration fundamentals that underpin every other lab.

#### Why this lab exists

Slow OS fluency pays compounding returns: when web or DB labs fail, you will **know where to look**.

#### Background

Treat the shell as a **precision instrument**: read man pages (`man systemd.service`), use `--help`, and prefer non-destructive probes (`ls`, `stat`, `ss -lntp`) before changes.

#### Procedure (go slowly)

### Phase 1 — Read the manual first (10 min)

- Identify **one** man page relevant to today’s topic; read **NAME**, **SYNOPSIS**, and **DESCRIPTION** first paragraphs.

### Phase 2 — Predict outputs (10 min)

- Before each command, write your **expected** substring in the output.

### Phase 3 — Execute + capture

**Hypervisor NIC modes**

Diagram NAT vs bridged vs host-only for your setup. Which IP does the host use to reach the VM web server?
List one troubleshooting step if host cannot ping VM gateway.


### Phase 4 — Correlation (15 min)

- Tie at least two observations together (e.g. disk free space vs largest mount; process RSS vs available RAM).

### Phase 5 — Runbook snippet (10 min)

- Produce **three** bullet “if user reports X, run Y” steps grounded in what you actually ran.


#### Verify

You can explain **one diagram** in prose: what changed on disk or network and why it matters.

#### Common mistakes

Editing `/etc` without backup—always `sudo cp` first.

#### Going further

Link this lab to a Tech+ chapter you studied in the main track.

---

<!-- id: labs-kali-appendix-ref -->
<!-- unit: Reference — command sheets -->

## Appendix A — Apache quick reference (Kali)

**Pace:** 30–45 minutes to walk through each command with `man` or `--help`.

**Command:**

```bash
sudo systemctl status apache2
```

- **What it does:** Shows **state**, recent log lines, and whether the unit is enabled.
- **Why we use it here:** First triage when “the website is down.”

**Command:**

```bash
sudo systemctl restart apache2
```

- **What it does:** Hard **restart** of the daemon (drops connections).
- **Why we use it here:** Use when module loads require full restart vs `reload`.

**Command:**

```bash
sudo apache2ctl -S
```

- **What it does:** Dumps **virtual host configuration** mapping.
- **Why we use it here:** Reveals duplicate vhosts and unexpected `ServerName` matches.

**Command:**

```bash
sudo tail -f /var/log/apache2/access.log
```

- **What it does:** `tail -f` streams new lines as requests arrive.
- **Why we use it here:** Correlate browser clicks with server-side evidence.


---

<!-- id: labs-kali-appendix-pace-capstone -->
<!-- unit: Reference — pacing & capstone -->

## Pacing, capstone, and wrap-up

## Appendix B — MariaDB quick reference (Kali)

```bash
sudo mariadb
SHOW DATABASES;
USE soc_training;
SHOW TABLES;
```

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

1. Apache2 hosts HTML/CSS/JS under `/var/www/html/soc-portal/`.
2. MariaDB stores `courses`, `labs_completed`, `notes`.
3. Python `import_labs.py` reads JSON metadata and **parameterized** SQL upserts rows.
4. Write a **hardening memo** (headers, firewall, SSH policy) and a **Tech+ runbook** for operations.

---

**End of curriculum.** Extend labs with your own fictional org stories—narrative context makes the same commands stick longer.
