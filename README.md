# Learn Hub · Network Edition

A **networking-only** fork of Learn Hub focused on **CompTIA Network+ (N10-009)**. The full multi-track hub (HTML, CSS, JS, Python, SQL, Tech+, Security+, etc.) lives in the main `learning-hub` repo — this copy is intentionally scoped to Network+ study.

## What’s included

- **Main hub** (`index.html`) — **213 reading lessons** including:
  - 10-week summer course (50 days)
  - Domain deep dives + advanced topics (75 lessons, 15 per N10-009 domain)
  - Hands-on workshops (Packet Tracer, VLAN, routing, wireless, security, CLI, scenarios)
  - **Exam cram** sprint lessons (30)
  - **PBQ mastery** labs (20)
- Each lesson includes objectives, tools, exam traps, PBQ scenarios, glossaries, and practice questions (~7,300 characters average)
- **Interactive practice** (left column on many lessons): matching, ordering, categorize/sort, fill-in, and quick-check activities with per-card **Check** buttons
- **1,100+** N10-009 practice MCQs in the sidebar quiz steps (46 sets)
- **Summer course portal** (`network-space/`) — schedules, flashcards, grading, and the browsable exam bank (sign in with username/password **Network**)

## Quick start

1. Open `index.html` in Chrome or Edge (or run `npm start` for the Electron shell).
2. Create a local account, or sign in with **Network** / **Network** to jump to the summer portal.
3. Use the sidebar to move through readings; quiz steps use the **Check-in** column on the left.

## Rebuild expanded content

After editing curriculum sources:

```bash
node scripts/build-network-edition.mjs
```

Lesson catalog definitions live in `scripts/network-edition-extra-lessons.mjs`; content HTML is generated in `scripts/network-edition-lesson-content.mjs`.

## Source

Copied from `learning-hub-main(2)/update_v1.0.7/` — the original folder is **not** modified by this edition.
