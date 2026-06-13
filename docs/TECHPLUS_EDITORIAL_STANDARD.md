# Tech+ study guide — editorial standard (district / government–ready)

This document defines how `chapters/*.md` should read and how terminology is handled. It applies to the CompTIA Tech+ (FC0-U71) track built into Learn-Hub.

## Current scope (2026-04)

- Applies to source chapter Markdown and generated Tech+ lesson bundles consumed by Questions mode and Study-plan rows.
- Includes consistency for weighted-score language shown to learners (practice estimate wording must stay explicit and non-official).
- OCR cleanup policy now explicitly includes split compounds from PDF imports (`first-party`, `left-hand`, `OS-native`, `on-site`, etc.).

## Voice and tone

- Use **clear, neutral, instructional English**. Prefer active voice for procedures (“Select…”, “Open…”) and passive where the actor is unimportant (“Data is encrypted…”).
- **Address the learner** consistently: second person (“you”) for steps; avoid shifting to “we” mid-paragraph unless the author is clearly including the reader in a shared task.
- **Avoid slang** except where the source material uses a fixed industry phrase. Do not use filler (“obviously”, “just”, “pretty much”) in new or heavily edited passages; legacy text may retain light informal phrasing until revised.

## Exam and product names

- **Exam:** CompTIA Tech+ **FC0-U71** (no space: not `FC0- U71`).
- **Section banner:** Preserve the canonical line: `THE FOLLOWING COMPTIA TECH+ FC0-U71 EXAM OBJECTIVES ARE COVERED IN THIS CHAPTER:` (all caps as in the study guide).
- **Vendor marks:** Use official capitalization (Windows, macOS, iOS, Android, Linux, OpenSSL). Do not add trademark symbols unless required by a formal publication policy.

## Hyphenation and compounds (preferred forms)

Use these unless the exam objective wording requires another form:

| Use | Avoid |
|-----|--------|
| zero-day | zeroday, zero day (as adjective before noun) |
| one-to-one | onetoone |
| high-speed | high- split across lines |
| Web browsing | Webbrowsing |
| up-to-date | up- to- date |
| non-critical, non-profit, co-workers | spaced or broken variants |
| UTF-8, UTF-16, UTF-32 | UTF- 8, UTF- 16 |
| line-of-sight | lineof - s ight |
| binary-to-decimal | binaryto - de cimal |
| user-friendly | user- split across lines |
| first-party / third-party | firstparty, fir st- party |
| left-hand / right-hand | lef t- hand, righ t- hand |
| OS-native | OS- na tive |
| built-in | builtin (when adjective form is intended) |

## Numbers and units

- Use **consistent number style** within a section (either spell out one through nine or use digits; match surrounding chapter style).
- Metric first with imperial in parentheses where both appear: `100 meters (328 feet)`.
- **Base notation:** `base-2`, `base-10`, `base-16`, `base-8` (no space after the hyphen).

## Code and commands

- **Shell examples must be valid** for the stated tool. OpenSSL examples use the `openssl enc` subcommand with explicit cipher, e.g. `openssl enc -aes-256-cbc -salt -in … -out …`.
- Use fenced code blocks with a language tag where appropriate (`bash`, `powershell`, etc.).
- Avoid copying PDF line breaks inside commands (no spaces between flags like `-salt` and `-in`).

## Tables and figures

- Prefer **Markdown tables** for comparative data (characteristics, standards, speeds). Include a short **table title** in bold (`**Table 8.2** …`).
- If a figure is not available, **do not** leave orphan captions (“at the top left…”). Either fold the idea into running text or remove the caption.

## Lists (exam objectives)

- Keep each objective **one logical line**; join hyphenated objective text broken across lines (e.g. “General Data Protection Regulations [GDPR]” on one line).
- Sub-bullets under an objective stay as `-` items; do not merge unrelated objectives.

## Apostrophes and punctuation

- Use straight ASCII apostrophe `'` in source for consistency and tooling.
- **Em dashes:** use `—` without extra spaces around it, or use ` - ` consistently per section—do not mix `—  ` (double space after em dash).

## Accessibility and inclusive language

- Prefer neutral terms for roles (“administrator”, “technician”, “learner”).
- Avoid unnecessary idioms that may confuse non-native readers unless they are exam vocabulary.

## Citations and dates

- Primary source line stays in the chapter header: `Source: CompTIA Tech+ (FC0-U71) Study Guide PDF — …`
- When adding external references, use **HTTPS URLs** and verify they resolve. Prefer official or vendor documentation over forums.

## Change process

1. Edit `chapters/<Chapter>.md`.
2. Run `node scripts/normalize-techplus-markdown.mjs` (strips printed PDF footers such as **Review Questions NNN**, **Exam Essentials NNN**, **Chapter N Lab NNN**, **Using Web Browsers NNN**, **Managing an Operating System NNN**, **Setting Up a Small Wireless Network NNN**, plus earlier patterns like **Summary NNN** and **Operating System Fundamentals NNN**).
3. Run `npm run build:techplus` and `npm run verify:techplus`.
4. Run `npm run audit:techplus-md` (or `npm run qa:techplus` for normalize + build + verify + audit in one step).
5. Spot-check the lesson in the browser (hard refresh; `index.html` updates `?v=` on build).

See `TECHPLUS_CHAPTER_REVIEW_CHECKLIST.md` for a repeatable review pass.
