# Tech+ chapter review checklist

Use this for each `chapters/*.md` file before sign-off. Check boxes as you go.

## Automated (required)

- [ ] `node scripts/normalize-techplus-markdown.mjs` (no errors)
- [ ] `npm run build:techplus`
- [ ] `npm run verify:techplus`
- [ ] `npm run audit:techplus-md` — **CRITICAL** findings must be zero. **WARN** (“Possible hyphenated word break”) is common in long chapters until each passage is hand-checked; grep the file for the pattern or fix opportunistically when editing nearby text.
- [ ] If study-plan or voucher messaging changed: verify copy in `assets/learn-hub-app.js`, `assets/learn-hub-voucher01-plan.js`, and `assets/learn-hub-tech-weighted-cram.js` still agrees (especially the "practice / unofficial" wording for 100–900 estimate).

## PDF / OCR defects

- [ ] No words split mid-token across lines (`… vul-` + newline + `nerability`)
- [ ] No orphan lines that are only 1–3 letters (`f`, `n`, `la`, `sp`) unless part of a code block
- [ ] No `Chapter 1 1` or `Summary 123` page headers in body text
- [ ] Exam banner shows `FC0-U71` (not `FC0- U71`)
- [ ] Tables render as Markdown tables, not jagged pseudo-columns

## Consistency

- [ ] Hyphenation matches `TECHPLUS_EDITORIAL_STANDARD.md` where applicable
- [ ] `UTF-8` / `UTF-16` / `ASCII` — no internal spaces
- [ ] OpenSSL (or other) commands are syntactically valid if shown as examples
- [ ] No OCR split compounds remain in edited sections (`first-party`, `left-hand`, `OS-native`, `on-site`, `in-depth`, etc.)

## Pedagogy

- [ ] Learning objectives at top align with section content
- [ ] Acronyms expanded on first meaningful use per chapter (or assumed as prior knowledge if consistent with book)
- [ ] Figures: either image + caption or integrated prose (no caption-only orphans)

## Final read

- [ ] One full pass reading on screen (or printed) for tone and clarity
- [ ] Spot-check 2–3 random lessons in the built Hub UI

---

**Sign-off**

| Chapter file | Reviewer | Date |
|--------------|----------|------|
| | | |
