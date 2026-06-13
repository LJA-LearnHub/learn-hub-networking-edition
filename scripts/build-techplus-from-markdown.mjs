/**
 * Converts bundled Markdown under chapters/ to assets/learn-hub-techplus-md.js (and optional chapter chunks).
 * Run: node scripts/build-techplus-from-markdown.mjs
 *
 * Source files live inside this repo so Learn Hub needs no external drive paths at runtime.
 */
import crypto from "crypto";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { marked } from "marked";
import { polishTechplusHtml } from "./techplus-html-polish.mjs";
import { writeChapterJsFiles, writeTechplusMdLoader } from "./techplus-chapter-io.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const learnHubRoot = path.resolve(__dirname, "..");
const mdDir = path.join(learnHubRoot, "chapters");
const coursesPath = path.join(learnHubRoot, "assets", "learn-hub-courses.js");

/** PDF sometimes splits “TABLE” across lines as “T” + “ABLE 8.1 …”. */
function joinBrokenTableCaptions(s) {
  return s.replace(/\nT\s*\n\s*ABLE(\s+\d+\.\d+)/gi, "\nTABLE$1");
}

function isPdfTableBlockBoundary(trimmed) {
  if (!trimmed) return false;
  return (
    /^\d+\s+Chapter\s+\d+/i.test(trimmed) ||
    /^Exploring\s+.+\d+\s*$/i.test(trimmed) ||
    /^FIGURE\s/i.test(trimmed) ||
    /^Figure\s+\d/i.test(trimmed) ||
    /^Source:/i.test(trimmed) ||
    /^#{1,6}\s/.test(trimmed) ||
    /^---+\s*$/.test(trimmed) ||
    /^EXERCISE\s/i.test(trimmed) ||
    /^Review Questions/i.test(trimmed) ||
    /^\(a\)\s*\(b\)/i.test(trimmed)
  );
}

/**
 * Next line after a blank is clearly body prose (not a PDF table row).
 * Keep this conservative — only common sentence starters, min length.
 */
function proseLineEndsPdfTable(trimmed) {
  if (trimmed.length < 16) return false;
  return /^(The |This |These |That |There |When |For |It |They |So |Here |Most |Each |Your |If |As |I |I'm |I'|You |We |A |An |Inside |Outside |Connecting |Hard |Speed |Never |Additionally |Finally |Typically |Generally |Remember |Let's |You might|Most people|Tech\+ |Although |Because |Before |After |During |With |Without |In view|Some |One |Not all|Sometimes|Make certain|If you |When a |Regardless|Never open|In Windows|After just|While most|Windows ignores|read the MIME|Simple text|Spreadsheet |Word processing|Productivity |The file |The historical|Here’s|Here's|I will|I’ll|You’re|You're|Radio frequency)/i.test(
    trimmed
  );
}

/**
 * Strip TABLE/ABLE caption lines and following pseudo-rows (PDF tables are not real Markdown tables).
 * Also strip orphan “How many Equals Example” blocks (split table continuations).
 */
function stripPdfTableBlockLines(text) {
  const lines = text.split("\n");
  const out = [];
  let i = 0;
  while (i < lines.length) {
    const raw = lines[i];
    const t = raw.trim();
    const isCaption = /^(?:TABLE|ABLE)\s+[\d.\s]+/i.test(t) || /^ABLE\s+\d/i.test(t);
    const isHowMany = /^How many\s+Equals\s+Example/i.test(t);

    if (isCaption || isHowMany) {
      i++;
      while (i < lines.length) {
        const cur = lines[i].trim();
        if (isPdfTableBlockBoundary(cur)) break;

        if (cur === "") {
          let j = i + 1;
          while (j < lines.length && lines[j].trim() === "") j++;
          const nt = (lines[j] || "").trim();
          if (nt === "") {
            i++;
            continue;
          }
          if (isPdfTableBlockBoundary(nt)) {
            i = j;
            break;
          }
          if (proseLineEndsPdfTable(nt)) break;
          if (/^#{1,3}\s/.test(nt)) break;
          const rawNext = lines[j] || "";
          if (/^\s*[✓✔■△▶]/.test(rawNext) || /^-\s/.test(rawNext.trim())) break;
          i++;
          continue;
        }

        if (cur.length > 88 && /[.!?]["']?\s*$/.test(cur) && proseLineEndsPdfTable(cur)) break;

        i++;
      }
      continue;
    }

    out.push(raw);
    i++;
  }
  return out.join("\n");
}

function collapseMdWhitespace(t) {
  t = t.replace(/[ \t\f\v]{2,}/g, " ");
  t = t.replace(/[ \t]+\./g, ".");
  t = t.replace(/[ \t]+,/g, ",");
  t = t.replace(/\n{3,}/g, "\n\n");
  return t;
}

/** Remove sentences that point at book tables we do not ship as HTML tables. */
function stripInlineTableReferences(s) {
  let t = s.replace(/\r\n/g, "\n");
  /** Whole line is only a “Table …” lead-in (common in PDF extract). */
  t = t.replace(/^\s*Table\s+\d+\.\d+\s+[^\n]+$/gim, "");
  const inline = [
    /\bTable\s+\d+\.\d+\s+provides\b[^.!?\n]*[.!?]/gi,
    /\bTable\s+\d+\.\d+\s+has\s+some\b[^.!?\n]*[.!?]/gi,
    /\bTable\s+\d+\.\d+\s+summarizes\b[^.!?\n]*[.!?]/gi,
    /\bTable\s+\d+\.\d+\s+summarize\b[^.!?\n]*[.!?]/gi,
    /\bTable\s+\d+\.\d+\s+shows\b[^.!?\n]*[.!?]/gi,
    /\bTable\s+\d+\.\d+\s+lists\b[^.!?\n]*[.!?]/gi,
    /\bTable\s+\d+\.\d+\s+list\b[^.!?\n]*[.!?]/gi,
    /\bTable\s+\d+\.\d+\s+gives\b[^.!?\n]*[.!?]/gi,
    /\bTable\s+\d+\.\d+\s+outlines\b[^.!?\n]*[.!?]/gi,
    /\bTable\s+\d+\.\d+\s+illustrates\b[^.!?\n]*[.!?]/gi,
    /\bSee\s+Table\s+\d+\.\d+[^.!?\n]*[.!?]/gi,
    /\bsee\s+Table\s+\d+\.\d+[^.!?\n]*[.!?]/gi,
    /\bIn\s+Table\s+\d+\.\d+[^.!?\n]*[.!?]/gi,
    /\bFrom\s+Table\s+\d+\.\d+[^.!?\n]*[.!?]/gi,
    /\bBased on\s+Table\s+\d+\.\d+[^.!?\n]*[.!?]/gi,
    /\bBefore getting to\s+Table\s+\d+\.\d+[^.!?\n]*[.!?]/gi,
    /,\s*Table\s+\d+\.\d+\s+lists[^.!?\n]*[.!?]/gi,
    /\bUnderstand that[^.!?\n]{0,160}Table\s+\d+\.\d+[^.!?\n]*[.!?]/gi,
    /\bit may be helpful to review\s+Table\s+\d+\.\d+[^.!?\n]*[.!?]/gi,
    /\breview\s+Table\s+\d+\.\d+\s+a few times[^.!?\n]*[.!?]/gi,
    /\bThe file extensions in\s+Table\s+\d+\.\d+[^.!?\n]*[.!?]/gi,
    /\bThe maximum data rates and distances shown in\s+Table\s+\d+\.\d+[^.!?\n]*[.!?]/gi,
    /\bYou can see in\s+Table\s+\d+\.\d+[^.!?\n]*[.!?]/gi,
    /\bFortunately, you don't need to memorize them all\.\s*Table\s+\d+\.\d+[^.!?\n]*[.!?]/gi,
    /\bFortunately, you don’t need to memorize them all\.\s*Table\s+\d+\.\d+[^.!?\n]*[.!?]/gi,
    /\bas shown in\s+Table\s+\d+\.\d+[^.!?\n]*[.!?]/gi,
    /\bshown in\s+Table\s+\d+\.\d+[^.!?\n]*[.!?]/gi,
    /\bper\s+Table\s+\d+\.\d+[^.!?\n]*[.!?]/gi,
    /\bon their computer\.\s*See\s+Table\s+\d+\.\d+[^.!?\n]*[.!?]/gi,
    /\bTable\s+\d+\.\d+\s+shows you\s+a\b[^.!?\n]*[.!?]/gi,
    /\bTable\s+\d+\.\d+\s+compares\b[^.!?\n]*[.!?]/gi,
    /\bTable\s+\d+\.\d+\s+highlights\b[^.!?\n]*[.!?]/gi,
    /\bTable\s+\d+\.\d+\s+illustrates\b[^.!?\n]*[.!?]/gi,
    /\bTable\s+\d+\.\d+\s+shows the\b[^.!?\n]*[.!?]/gi,
    /\bshown in\s+Table\s+\d+\.\d+\.\s*/gi,
    /\bin Table\s+\d+\.\d+, and\b[^.!?\n]*[.!?]/gi,
  ];
  for (const re of inline) t = t.replace(re, " ");
  return collapseMdWhitespace(t);
}

/** Remove book figure captions, screen-callout lines, and inline “see Figure …” style text. */
function stripFigureAndScreenArtifacts(s) {
  let t = s.replace(/\r\n/g, "\n");
  /** Curly apostrophes in the PDF text break regex patterns written with ASCII `'`. */
  t = t.replace(/\u2019/g, "'").replace(/\u2018/g, "'").replace(/\u201c|\u201d/g, '"');
  /** OCR split like “Figure 7.1 1” → “Figure 7.11” for consistent stripping. */
  t = t.replace(/\b(Figure|FIGURE)\s+(\d+)\.\s+(\d+)\b/gi, "$1 $2.$3");
  /** “Figure 1 1.5” (chapter 11 / fig 5) → “Figure 11.5” */
  t = t.replace(/\b(Figure|FIGURE)\s+(\d+)\s+(\d+)\.(\d+)\b/gi, "$1 $2$3.$4");

  t = t.replace(/^\s*FIGURE\s+\d+\.\d+\s*.+$/gim, "");
  t = t.replace(/^\s*Figure\s+\d+\.\d+\s*\.?\s*$/gim, "");
  t = t.replace(/^\d+\s+Chapter\s+\d+\s+[▪■\-]\s*.+$/gim, "");
  /** PDF running footer: "Exploring … Memory 23" between wrapped sentences */
  t = t.replace(/^\s*Exploring\s+.+\s+\d{1,3}\s*$/gim, "");
  t = t.replace(/^\s*Chapter\s*$/gim, "");
  t = t.replace(/^\s*(?:Technet24|technet24)\s*$/gim, "");
  t = t.replace(/^\s*EXERCISE\s+[\d.]+\s*\(continued\)\s*$/gim, "");
  t = t.replace(/\s*EXERCISE\s+[\d.]+\s*\(continued\)\s*/gi, " ");

  const inline = [
    /\s*\(\s*see\s+Figure\s+\d+\.\d+[A-Za-z]?\s*\)/gi,
    /\s*\(\s*as shown in Figure\s+\d+\.\d+[A-Za-z]?\s*\)/gi,
    /\s*\(\s*Figure\s+\d+\.\d+[A-Za-z]?\s*\)/gi,
    /,\s*as shown in Figure\s+\d+\.\d+[A-Za-z]?/gi,
    /,\s*shown in Figure\s+\d+\.\d+[A-Za-z]?/gi,
    /\s+as shown in Figure\s+\d+\.\d+[A-Za-z]?/gi,
    /\s+shown in Figure\s+\d+\.\d+[A-Za-z]?/gi,
    /\bsee Figure\s+\d+\.\d+[A-Za-z]?\b/gi,
    /\s+like the one shown in Figure\s+\d+\.\d+[A-Za-z]?/gi,
    /\s+similar to (?:the one in )?Figure\s+\d+\.\d+[A-Za-z]?/gi,
    /Take a look at Figure\s+\d+\.\d+[A-Za-z]?\s*;?\s*/gi,
    /\bFigure\s+\d+\.\d+[A-Za-z]?\s+shows?\s+(?:you\s+)?(?:that\s+)?/gi,
    /\bIn Figure\s+\d+\.\d+[A-Za-z]?,\s*/gi,
    /\bOn the next screen\s*\(Figure\s+\d+\.\d+[A-Za-z]?\)\s*,?\s*/gi,
    /\bIn the next window that appears\s*\(Figure\s+\d+\.\d+[A-Za-z]?\)\s*,?\s*/gi,
    /\bwill (?:open|look) (?:similar to|like) Figure\s+\d+\.\d+[A-Za-z]?\b\.?/gi,
    /\b(?:the|a) (?:screen|window|dialog(?: box)?),?\s+shown in Figure\s+\d+\.\d+[A-Za-z]?\b/gi,
    /\b(?:the|a) (?:screen|window) (?:in|like) Figure\s+\d+\.\d+[A-Za-z]?\b/gi,
    /\bhighlighted in Figure\s+\d+\.\d+[A-Za-z]?\b\.?/gi,
    /\bas highlighted in Figure\s+\d+\.\d+[A-Za-z]?\b/gi,
    /\bfrom Figure\s+\d+\.\d+[A-Za-z]?\b/gi,
    /\bFigure\s+\d+\.\d+[A-Za-z]?\s+later in this section[^.]*\./gi,
    /\bFigure\s+\d+\.\d+[A-Za-z]?\s+you can see that[^.]*\./gi,
    /\brefer to Figure\s+\d+\.\d+[A-Za-z]?\b/gi,
    /\bper Figure\s+\d+\.\d+[A-Za-z]?\b/gi,
    /\bin Figure\s+\d+\.\d+[A-Za-z]?\s+there are\b/gi,
    /\bFigure\s+\d+\.\d+[A-Za-z]?\s+illustrates\b/gi,
    /\s+shown in Figure\s+\d+\.\d+[A-Za-z]?\s+and Figure\s+\d+\.\d+[A-Za-z]?\.\s*/gi,
    /\bwere shown in Figure\s+\d+\.\d+[A-Za-z]?\s+and Figure\s+\d+\.\d+[A-Za-z]?\.\s*/gi,
    /\bFigure\s+\d+\.\d+[A-Za-z]?\s+shows[^.!?]*[.!?]/gi,
    /\bFigure\s+\d+\.\d+[A-Za-z]?\s+gives you[^.!?]*[.!?]/gi,
    /\bIf you look back at Figure\s+\d+\.\d+[A-Za-z]?, you will see[^.!?]*[.!?]\s*/gi,
    /\bI offer you Figure\s+\d+\.\d+[A-Za-z]?, showing[^.!?]*[.!?]\s*/gi,
    /\s+like in Figure\s+\d+\.\d+[A-Za-z]?\.\s*/gi,
    /\bYou can see it in Figure\s+\d+\.\d+[A-Za-z]?\.\s*/gi,
    /\bIf you look at Figure\s+\d+\.\d+[A-Za-z]?,[^.!?]*[.!?]/gi,
    /\bIf you look at Figure\s+\d+\.\d+[A-Za-z]?, you’ll see that[^.!?]*[.!?]/gi,
    /\bthe one in Figure\s+\d+\.\d+[A-Za-z]?\s+does\)[,.]?/gi,
    /\([^)]{0,400}Figure\s+\d+\.\d+[A-Za-z]?[^)]{0,400}\)/gi,
    /\(shown[^)]{0,200}Figure\s+\d+\.\d+[A-Za-z]?[^)]{0,200}\),?/gi,
    /\s+in Figure\s+\d+\.\d+[A-Za-z]?\s+attach[^.!?]*[.!?]/gi,
    /\s+and Figure\s+\d+\.\d+[A-Za-z]?\.\s*/gi,
    /;\s*Figure\s+\d+\.\d+[A-Za-z]?\s+shows[^.!?]*[.!?]\s*/gi,
    /\bLooking at Figure\s+\d+\.\d+[A-Za-z]?, you might think[^.!?]*[.!?]/gi,
    /\bLooking at Figure\s+\d+\.\d+[A-Za-z]?, you can see that[^.!?]*[.!?]/gi,
    /\bThe example in Figure\s+\d+\.\d+[A-Za-z]? is pretty basic\.\s*/gi,
    /\bsuch as the one in Figure\s+\d+\.\d+[A-Za-z]?\.(?:\s*)/gi,
    /\bas shown in Figure\s+\d+\.\d+[A-Za-z]?\.\s*/gi,
    /\bas illustrated in Figure\s+\d+\.\d+[A-Za-z]?\.\s*/gi,
    /\bYou can see in Figure\s+\d+\.\d+[A-Za-z]? that[^.!?]*[.!?]/gi,
    /\bYou can see that the one in Figure\s+\d+\.\d+[A-Za-z]? has[^.!?]*[.!?]/gi,
    /\bone in Figure\s+\d+\.\d+[A-Za-z]?\. Here[^.!?]*[.!?]/gi,
    /\bFirst, take a look at a simple NAS device in Figure\s+\d+\.\d+[A-Za-z]?\.?\s*/gi,
    /\bAnd as a bonus, the keyboard in Figure\s+\d+\.\d+[A-Za-z]? is vintage[^.!?]*[.!?]/gi,
    /\blike the one in Figure\s+\d+\.\d+[A-Za-z]?\.\s*/gi,
    /\bat the bottom of Figure\s+\d+\.\d+[A-Za-z]?\.[^.!?]*[.!?]/gi,
    /\bNotice on Figure\s+\d+\.\d+[A-Za-z]? that[^.!?]*[.!?]/gi,
    /\babove the cartridges in Figure\s+\d+\.\d+[A-Za-z]?\.\s*/gi,
    /\blike the one in Figure\s+\d+\.\d+[A-Za-z]?\.\s*/gi,
    /\bto the printer management window like the one in Figure\s+\d+\.\d+[A-Za-z]?\.\s*/gi,
    /\bLet’s take a look at the options in Figure\s+\d+\.\d+[A-Za-z]? from the top down:\s*/gi,
    /\bThe docking station in Figure\s+\d+\.\d+[A-Za-z]? has the following ports:[^.!?]*[.!?]/gi,
    /\(you can see that it’s done so in Figure\s+\d+\.\d+[A-Za-z]?\)/gi,
    /\s+for iOS and Figure\s+\d+\.\d+[A-Za-z]?\s+for Android/gi,
    /\bsimilar to what’s shown in Figure\s+\d+\.\d+[A-Za-z]?\.\s*/gi,
    /\bas shown in\s+at the bottom of Figure\s+\d+\.\d+[A-Za-z]?[^.!?]*[.!?]/gi,
    /\bwill look a lot like Figure\s+\d+\.\d+[A-Za-z]?\.\s*/gi,
    /\byou’ll get a window like the one in Figure\s+\d+\.\d+[A-Za-z]?\.\s*/gi,
    /\bit’s at the top of Figure\s+\d+\.\d+[A-Za-z]?\.\s*/gi,
    /\(like the one at the top of Figure\s+\d+\.\d+[A-Za-z]?\)/gi,
    /\bwhich is in the upper- right corner of Figure\s+\d+\.\d+[A-Za-z]?\.\s*/gi,
    /\bRemember the menu you see in Figure\s+\d+\.\d+[A-Za-z]? because[^.!?]*[.!?]/gi,
    /\bshown in the bottom pane of Figure\s+\d+\.\d+[A-Za-z]?\.\s*/gi,
    /\bIt should look like Figure\s+\d+\.\d+[A-Za-z]?\.\s*/gi,
    /\blike what you see in Figure\s+\d+\.\d+[A-Za-z]?\.\s*/gi,
    /\bThe website names in Figure\s+\d+\.\d+[A-Za-z]? make[^.!?]*[.!?]/gi,
    /\blike the F8 key in Figure\s+\d+\.\d+[A-Za-z]?\.\s*/gi,
    /\b\(Y ou should have a window similar to the one in Figure\s+\d+\.\d+[A-Za-z]?\.\)/gi,
    /\bas shown in Figure\s+\d+\.\d+[A-Za-z]?\.\s*/gi,
    /\bAnd as a bonus, the keyboard in Figure\s+\d+\.\d+[A-Za-z]? is vintage[^.!?]*[.!?]/gi,
    /\bthe Search box, which is in the upper-\s*right corner of Figure\s+\d+\.\d+[A-Za-z]?\.\s*/gi,
    /\blike the one in Figure\s+\d+\.\d+[A-Za-z]?\s+where you can[^.!?]*[.!?]/gi,
    /\bYou'll see in Figure\s+\d+\.\d+[A-Za-z]?\s+that[^.!?]*[.!?]/gi,
    /\bas in Figure\s+\d+\.\d+[A-Za-z]?\.\s*/gi,
    /\blike Figure\s+\d+\.\d+[A-Za-z]?\.\s*/gi,
    /\bsomething like Figure\s+\d+\.\d+[A-Za-z]?\.\s*/gi,
    /\bis illustrated in Figure\s+\d+\.\d+[A-Za-z]?\.\s*/gi,
    /\bNotice in Figure\s+\d+\.\d+[A-Za-z]?\s+that[^.!?]*[.!?]/gi,
    /\bwill look something like Figure\s+\d+\.\d+[A-Za-z]?\.\s*/gi,
    /\bThe network depicted in Figure\s+\d+\.\d+[A-Za-z]?[^.!?]*[.!?]/gi,
    /\blike you saw in Figure\s+\d+\.\d+[A-Za-z]?\.\s*/gi,
    /\bIf you look back at Figure\s+\d+\.\d+[A-Za-z]?, you can see[^.!?]*[.!?]/gi,
    /\blogo in Figure\s+\d+\.\d+[A-Za-z]?\.\s*/gi,
    /\bwill see a screen similar to the one shown in Figure\s+\d+\.\d+[A-Za-z]?\.\s*This screen[^.!?]*[.!?]/gi,
    /\blike the one shown in Figure\s+\d+\.\d+[A-Za-z]?\.\s*Notice[^.!?]*[.!?]/gi,
    /\blike you see in Figure\s+\d+\.\d+[A-Za-z]?\.\s*/gi,
    /\bIn the example shown in Figure\s+\d+\.\d+[A-Za-z]?,[^.!?]*[.!?]/gi,
    /\bthat you saw in Figure\s+\d+\.\d+[A-Za-z]?\.\s*/gi,
    /\bfrom the site when asked to create a BBQ company logo in Figure\s+\d+\.\d+[A-Za-z]?\.\s*/gi,
  ];
  for (const re of inline) t = t.replace(re, " ");

  t = t.replace(/\bfor iOS and Figure\s+\d+\.\d+[A-Za-z]?\s+for Android/gi, "for iOS and Android");
  t = t.replace(/(^|\n)\s*one in Figure\s+\d+\.\d+[A-Za-z]?\. Here[^.!?]*[.!?]/gi, "$1");
  t = t.replace(/(^|\n)\s*in Figure\s+\d+\.\d+[A-Za-z]?\. There[^.!?]*[.!?]/gi, "$1");

  let prevFigurePass = "";
  while (prevFigurePass !== t) {
    prevFigurePass = t;
    t = t.replace(/\s+FIGURE\s+\d+\.\d+\s+[^\n]+/gi, " ");
  }

  t = t.replace(/\s*\(\s*Figure\s+\d+\.\d+[A-Za-z]?\s*\)\s*\./gi, ".");
  /** Collapse horizontal whitespace only — \s{2,} would erase newlines and break Markdown. */
  t = t.replace(/[ \t\f\v]{2,}/g, " ");
  t = t.replace(/[ \t]+\./g, ".");
  t = t.replace(/[ \t]+,/g, ",");
  t = t.replace(/\([ \t]+/g, "(");
  t = t.replace(/[ \t]+\)/g, ")");
  t = t.replace(/\n{3,}/g, "\n\n");
  return t;
}

/**
 * Standalone book section labels (must not be merged into the previous paragraph by reflow).
 * Mirrors scripts/format-techplus-markdown.mjs heuristics.
 */
function isRepoSectionTitleLine(trimmed) {
  const s = trimmed.trim();
  if (s.length < 4 || s.length > 88) return false;
  if (/^[#>`|0-9]/.test(s)) return false;
  if (/[.;!?'"()]/.test(s)) return false;
  if (/\d/.test(s)) return false;
  if (/^Exploring\s+[A-Z]/.test(s)) return true;
  if (s.includes(",")) return false;
  if (
    /^(The|A|An|In|For|When|If|As|I'|I |It |We |You |Your |They |This |These |That |There |Here |On |At |By |To |With |After |Before |While |Because |However |Also |So |But |And |Or |Not |All |Some |Many |Most |Each |One |Two |Another |Other |Such |Same |Different |New |Old |Perhaps |Maybe |Even |Only |Just |Like |Unlike |During |Unless |Until |Since |From |Into |Over |Under |Above |Below |Between |Among |Within |Without |Against |Through |Although |Though |Whether |Either |Neither |Both |Few |Several |Various |Certain |More |Less |Very |Quite |Rather |Pretty |Fairly |Once |Often |Never |Always |Usually |Sometimes |Generally |Specifically |Typically |Normally |Commonly |Recently |Currently |Finally |First |Second |Third |Next |Last |Early |Late )\s/i.test(
      s
    )
  )
    return false;
  return /^[A-Z][a-z]+(?:\s+[A-Z][a-z]+){0,4}$/.test(s);
}

/**
 * Join hard-wrapped prose lines into Markdown paragraphs; split long blocks at sentences.
 */
function reflowProseBlocks(text) {
  const lines = text.split("\n");
  const result = [];
  let buf = [];

  function lineKind(trimmed, rawLine) {
    if (!trimmed) return "blank";
    if (/^#{1,6}\s/.test(trimmed)) return "struct";
    if (/^[-*+]\s/.test(trimmed)) return "struct";
    if (/^>\s/.test(trimmed)) return "struct";
    if (/^\|.+\|\s*$/.test(trimmed)) return "struct";
    if (/^---+(\s*)$/.test(trimmed)) return "struct";
    if (/^\d+\.\s/.test(trimmed)) return "struct";
    if (/^Source:/i.test(trimmed)) return "struct";
    if (/^FIGURE\s/i.test(trimmed)) return "struct";
    if (/^(?:TABLE|ABLE)\s/i.test(trimmed)) return "struct";
    if (/^EXERCISE\s/i.test(trimmed)) return "struct";
    if (/^Review Questions/i.test(trimmed)) return "struct";
    if (/^Technet24$/i.test(trimmed)) return "struct";
    if (/^\s*[✓✔■△▶]/.test(rawLine)) return "struct";
    if (isRepoSectionTitleLine(trimmed)) return "struct";
    return "prose";
  }

  function flush() {
    if (!buf.length) return;
    const merged = buf.join(" ").replace(/\s+/g, " ").trim();
    buf = [];
    if (!merged) return;
    const maxChunk = 400;
    if (merged.length <= maxChunk) {
      result.push(merged);
      return;
    }
    const parts = merged.split(/(?<=[.!?]["”]?\)?)\s+(?=[A-Z(0-9"“'])/);
    let cur = "";
    for (const p of parts) {
      const seg = p.trim();
      if (!seg) continue;
      const next = cur ? cur + " " + seg : seg;
      if (next.length > maxChunk && cur) {
        result.push(cur.trim());
        cur = seg;
      } else cur = next;
    }
    if (cur) result.push(cur.trim());
  }

  for (const line of lines) {
    const trimmed = line.trim();
    const k = lineKind(trimmed, line);
    if (k === "blank") {
      flush();
      result.push("");
      continue;
    }
    if (k === "struct") {
      flush();
      result.push(line);
      continue;
    }
    buf.push(trimmed);
  }
  flush();
  return result.join("\n\n").replace(/\n{3,}/g, "\n\n").trim() + "\n";
}

/**
 * Merge exam-objective / bullet lines when the PDF wrapped one item across lines.
 * Always insert a space between the buffer and the next line. Gluing short words
 * (e.g. “…connectors” + “In the following…”) produced “connectorsIn”; “…of” + “a” → “ofa”.
 */
function mergeSplitObjectiveLines(text) {
  const lines = text.split("\n");
  const out = [];
  let i = 0;
  while (i < lines.length) {
    const raw = lines[i];
    const trimmed = raw.trim();
    if (/^[✓✔■△▶]/.test(trimmed)) {
      let buf = raw.replace(/\s+$/, "");
      i++;
      while (i < lines.length) {
        const r = lines[i];
        const t = r.trim();
        if (t === "") break;
        if (/^[✓✔■△▶]/.test(t)) break;
        /**
         * Nested sub-bullets under an objective (indented `- item`) — do not merge into the ✓ line.
         */
        if (/^\s{2,}-\s/.test(r)) break;
        /**
         * PDF line-wrap continues the same bullet with a lowercase (or non-letter) start.
         * A new line that begins with a capital letter is almost always a new paragraph
         * (e.g. “■ … connectors” then “In the following sections…”) — do not absorb it into the list item.
         */
        if (t.length > 0) {
          const c0 = t[0];
          /**
           * New sentence after a capital letter — stop merging into the PDF bullet.
           * Do NOT use /^as\s+/i here: it matches “As standards…”, gluing the next paragraph
           * into the ■ list item (Exercise/Bluetooth merged into one giant <li>).
           * Lowercase “as a second example” continues on the next line without a capital start.
           */
          if (
            /[A-Z]/.test(c0) &&
            !/^and\s+/i.test(t) &&
            !/^or\s+/i.test(t)
          ) {
            break;
          }
        }
        if (/^\d+\.\s/.test(t)) break;
        if (/^(FIGURE|TABLE|ABLE|EXERCISE|Review Questions)\b/i.test(t)) break;
        if (/^\d+\s+Chapter\s+\d+/i.test(t)) break;
        const b = buf.replace(/\s+$/, "");
        buf = b + " " + t;
        i++;
      }
      out.push(buf);
    } else {
      out.push(raw);
      i++;
    }
  }
  return out.join("\n");
}

/**
 * Join PDF-wrapped section banners so maybeHeading emits one ### title (not a truncated h3 + orphan “and …” paragraph).
 * Example: "Exploring Motherboards, Processors," / "and Memory" → "Exploring Motherboards, Processors, and Memory"
 */
function joinExploringBannerLines(text) {
  const lines = text.split("\n");
  const out = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();
    if (
      /^Exploring\s+/i.test(trimmed) &&
      /,$/.test(trimmed) &&
      i + 1 < lines.length
    ) {
      const nextLine = lines[i + 1];
      const nextTrim = nextLine.trim();
      if (/^and\s+/i.test(nextTrim)) {
        const merged = trimmed.replace(/,\s*$/, "") + ", " + nextTrim;
        const lead = line.match(/^\s*/)[0];
        out.push(lead + merged);
        i++;
        continue;
      }
    }
    out.push(line);
  }
  return out.join("\n");
}

/** Join https:// when the PDF put a newline before the hostname (e.g. … at https://\nhomeoffice.absolute.com. In …). */
function joinHttpNewlineContinuations(text) {
  let t = text;
  let prev;
  do {
    prev = t;
    t = t.replace(
      /(https?:\/\/)\s*\n\s*([a-zA-Z0-9][a-zA-Z0-9.-]*\.[a-zA-Z]{2,}(?:\.[a-zA-Z]{2,})?)(\.\s+)([A-Z][^\n]*)/gm,
      (_, proto, domain, dotSp, rest) => proto + domain + dotSp + rest
    );
  } while (prev !== t);
  return t;
}

/**
 * Collapse whitespace/newlines inside a URL that the PDF wrapped across lines, stopping at “/spec tells”.
 * Prevents continuation fragments like “- g” from becoming Markdown list bullets.
 */
function collapseUrlBeforeSpecTells(text) {
  let t = text;
  let prev;
  do {
    prev = t;
    t = t.replace(
      /(https?:\/\/[\s\S]+?)\/spec\s+tells\s+/gi,
      (_, urlRaw) => urlRaw.replace(/\s+/g, "") + "/spec tells "
    );
  } while (prev !== t);
  return t;
}

/** Fix common PDF space/hyphen glitches after reflow (lines were joined with spaces). */
function repairPdfSpuriousSpaces(text) {
  let t = text;
  const reps = [
    [/\bmo\s+therboard\b/gi, "motherboard"],
    [/\bZ790-\s*E\b/g, "Z790-E"],
    [/\bZ690-\s*E\b/g, "Z690-E"],
    [/\bbrand-\s*na\s+me\b/gi, "brand-name"],
    [/\bStrix\s+Z790-\s*E\b/g, "Strix Z790-E"],
    [/\bROG\s+Strix\s+Z790-\s*E\b/g, "ROG Strix Z790-E"],
    [/\bASUS\s+ROG\s+Strix\s+Z790-\s*E\b/g, "ASUS ROG Strix Z790-E"],
    [/\bmo\s+vie\b/gi, "movie"],
    [/\bconver\s+sions\b/gi, "conversions"],
    [/\b1,00\s+0\s+kilobytes\b/g, "1,000 kilobytes"],
    [/\bT ypes\b/g, "Types"],
    [/\bT ype\b/g, "Type"],
    [/\bstor age\b/gi, "storage"],
    [/\bnetwor king\b/gi, "networking"],
    [/\battac hed\b/gi, "attached"],
    [/\bpr ogramming\b/gi, "programming"],
    [/\bhigher\s+-\s+end\b/gi, "higher-end"],
    [/\bhigher\s+-\s+level\b/gi, "higher-level"],
    [/\bfiber\s+-\s+optic\b/gi, "fiber-optic"],
    [/\bpeer\s+-\s+to\s+-\s+peer\b/gi, "peer-to-peer"],
    [/\bhigher\s+-\s+wattage\b/gi, "higher-wattage"],
    [/\bUTF-\s*16\s+or\s+UTF\s*-\s*32\b/gi, "UTF-16 or UTF-32"],
    [/\bit-\s*training\.apple\.com/gi, "it-training.apple.com"],
    [/\bhigh-\s*le\s+vel\b/gi, "high-level"],
    [/\bhypervi\s+-\s*sor\b/gi, "hypervisor"],
    [/\bchec\s+k\b/gi, "check"],
    [/\bc\s+hecked\b/gi, "checked"],
    [/\bc\s+hoose\b/gi, "choose"],
    [/\bt\s+ext1\.txt\b/gi, "text1.txt"],
    [/\bsubobjec\s*-\s*tive\b/gi, "subobjective"],
    [/\b802\.1\s+1([0-9a-z])/gi, "802.11$1"],
    [/802\.1\s+1(?=\s|<|\.|,|\)|"|'|$)/gi, "802.11"],
    [/\bmuc\s+h\b/gi, "much"],
    [/\bconnecti\s+vity\b/gi, "connectivity"],
    [/\bnetw\s+ork\b/gi, "network"],
    [/\bscenar\s+io\b/gi, "scenario"],
    [/\bCon\s+versely\b/g, "Conversely"],
    [/\bWindows 1 1\b/g, "Windows 11"],
    [/\bWindows 3\.1 1\b/g, "Windows 3.11"],
    [/\bRJ1 1\b/g, "RJ11"],
    [/\b201 1\b/g, "2011"],
    [/Figure 7 \.1 1/g, "Figure 7.11"],
    [/Figure 12\.1 1/g, "Figure 12.11"],
    [/Figure 2\.1 1([^0-9]|$)/g, "Figure 2.11$1"],
    [/\bChapter 1 1\b/g, "Chapter 11"],
    [/\bFigure 1 1\./g, "Figure 11."],
    [/Figure 11\.1 1\b/g, "Figure 11.11"],
    [/\bclosed-\s*so\s+urce\b/gi, "closed-source"],
    [/\blow-\s*le\s+vel\b/gi, "low-level"],
    [/\bnot-\s*so\s+-\s*ni\s+ce\b/gi, "not-so-nice"],
    [/\bP\s+rogram\b/g, "Program"],
    [/\bOperating S\s+ystem\b/g, "Operating system"],
    [/\bL\s+ock Screen\b/g, "Lock Screen"],
    [/\bP\s+eripheral\b/gi, "Peripheral"],
    [/\bdrop-\s*do\s*wn\b/gi, "drop-down"],
  ];
  for (const [re, to] of reps) t = t.replace(re, to);
  return t;
}

/** Join mid-word PDF wraps in body prose: consonant-ended line + vowel-led fragment (≤5 letters). */
function joinProseWordSplits(text) {
  const lines = text.split("\n");
  const isStruct = (line) => {
    const s = line.trim();
    if (!s) return false;
    if (/^[✓✔■△▶]/.test(s)) return true;
    if (/^#{1,6}\s/.test(s)) return true;
    if (/^[-*+]\s/.test(s)) return true;
    if (/^>\s/.test(s)) return true;
    if (/^\|.+\|\s*$/.test(s)) return true;
    if (/^---+\s*$/.test(s)) return true;
    if (/^\d+\.\s/.test(s)) return true;
    if (/^EXERCISE\s/i.test(s)) return true;
    if (/^Review Questions\b/i.test(s)) return true;
    /**
     * PDF page footers and figure captions must never be glued to the next prose line.
     * Otherwise a line like “22 Chapter 1 ■ …” (ends in a consonant) merges with
     * “Audio Ports The…” (treats “Audio” as a vowel-led fragment) and the whole line is
     * later stripped— leaving “microphone. Long gone…” as a bogus new paragraph.
     */
    if (/^\d+\s+Chapter\s+\d+/i.test(s)) return true;
    if (/^FIGURE\s/i.test(s)) return true;
    if (/^Source:/i.test(s)) return true;
    if (/^(?:TABLE|ABLE)\s/i.test(s)) return true;
    if (/^Technet24$/i.test(s)) return true;
    if (/^Exploring\s+.+\s+\d{1,3}\s*$/i.test(s)) return true;
    return false;
  };
  const stopFrags = new Set(
    (
      "into onto also each else even ever away unto iron idea edge open only once ones outer every easy early either other under about after again below could first found great having might never often place right shall small sound still their there these thing think three water where which while world would write being using during before within without it is if in or at an as be do no so up us we he of to by on am an us we or ox ex um id and arm off of"
    ).split(/\s+/)
  );
  const out = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (isStruct(line)) {
      out.push(line);
      i++;
      continue;
    }
    let cur = line;
    i++;
    while (i < lines.length) {
      if (lines[i].trim() === "") break;
      const nRaw = lines[i];
      if (isStruct(nRaw)) break;
      const t = cur.replace(/\s+$/, "");
      if (!/[bcdfghjklmnpqrstvwxyz]$/i.test(t)) break;
      const nt = nRaw.trim();
      const m = nt.match(/^([a-z]{2,5})\b(.*)$/i);
      if (!m) break;
      const frag = m[1];
      const rest = m[2] || "";
      if (frag.length < 2 || frag.length > 5) break;
      if (!/^[aeiouy]/i.test(frag)) break;
      if (stopFrags.has(frag.toLowerCase())) break;
      cur = t + frag + rest;
      i++;
    }
    out.push(cur);
  }
  return out.join("\n");
}

/**
 * Fix PDF-extracted Markdown so marked produces readable HTML:
 * - Join hyphenated line breaks (com-\nponents → components).
 * - Turn ✓ / ■ lines into real Markdown list items (otherwise one giant <p>).
 * - Promote isolated title-case lines before a new sentence to ### headings.
 */
/**
 * PDF often puts the hyphen on its own line: "bot" newline "-" newline "tom".
 * Map known recombinations; unknown triplets are left unchanged.
 */
function joinHyphenOnOwnLine(s) {
  const map = {
    bottom: "bottom",
    journalistic: "journalistic",
    fingerprint: "fingerprint",
    proprietary: "proprietary",
    userfriendly: "user-friendly",
  };
  return s.replace(/([a-z]{2,})\s*\n\s*-\s*\n\s*([a-z]{2,})/gi, (full, a, b) => {
    const k = (a + b).toLowerCase().replace(/[^a-z]/g, "");
    return Object.prototype.hasOwnProperty.call(map, k) ? map[k] : full;
  });
}

function normalizeReviewQuestionMarkdown(s) {
  const lines = String(s || "").split("\n");
  const out = [];
  let inReview = false;

  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i];
    const t = raw.trim();
    const n = (lines[i + 1] || "").trim();

    if (/^Review Questions$/i.test(t)) {
      inReview = true;
      out.push("Review Questions");
      continue;
    }
    if (inReview && /^###\s+/.test(t)) inReview = false;
    if (!inReview) {
      out.push(raw);
      continue;
    }

    if (/^\d{1,2}$/.test(t) && /^-\.\s+/.test(n)) {
      out.push(`${t}. ${n.replace(/^-\.\s+/, "")}`);
      i++;
      continue;
    }
    if (/^[A-D]$/i.test(t) && /^-\.\s+/.test(n)) {
      out.push(`   - ${t.toUpperCase()}. ${n.replace(/^-\.\s+/, "")}`);
      i++;
      continue;
    }
    if (/^\d{1,2}\.\s+/.test(t)) {
      const splitChoiceAt = t.search(/\s+[A-D]\.\s+/);
      if (splitChoiceAt > 0) {
        const qPart = t.slice(0, splitChoiceAt).trim();
        const cPart = t.slice(splitChoiceAt).trim();
        if (out.length && out[out.length - 1] !== "") out.push("");
        out.push(qPart);
        out.push(`   - ${cPart}`);
        continue;
      }
      if (out.length && out[out.length - 1] !== "") out.push("");
      out.push(t);
      continue;
    }
    if (/^[A-D]\.\s+/i.test(t)) {
      const qSplit = t.match(/^(.*?)(\s+\d{1,2}\.\s+.+)$/);
      if (qSplit) {
        out.push(`   - ${qSplit[1].trim()}`);
        out.push("");
        out.push(qSplit[2].trim());
        continue;
      }
      out.push(`   - ${t}`);
      continue;
    }
    if (/^You can find the answers in Appendix\b/i.test(t)) {
      out.push(t);
      out.push("");
      continue;
    }
    if (!t) {
      out.push("");
      continue;
    }

    const lastIdx = out.length - 1;
    if (lastIdx >= 0 && /^\s*-\s+[A-D]\./.test(out[lastIdx])) {
      out[lastIdx] = `${out[lastIdx]} ${t}`.replace(/\s+/g, " ").trim();
      continue;
    }
    if (lastIdx >= 0 && /^\d{1,2}\./.test(out[lastIdx])) {
      out[lastIdx] = `${out[lastIdx]} ${t}`.replace(/\s+/g, " ").trim();
      continue;
    }
    out.push(t);
  }

  return out.join("\n");
}

function preprocessMarkdown(raw) {
  let s = raw.replace(/\r\n/g, "\n");
  s = joinHyphenOnOwnLine(s);
  /** Join hyphenated line breaks before figure stripping — otherwise “shows … bot-\ntom” breaks sentence regexes. */
  s = s.replace(/([A-Za-z])-\n([a-z])/g, "$1$2");
  s = s.replace(/([A-Za-z0-9])-\s*\n([a-z])/g, "$1$2");
  s = joinHttpNewlineContinuations(s);
  s = collapseUrlBeforeSpecTells(s);
  s = joinExploringBannerLines(s);
  s = mergeSplitObjectiveLines(s);
  s = joinProseWordSplits(s);
  s = joinBrokenTableCaptions(s);
  s = stripPdfTableBlockLines(s);
  s = stripFigureAndScreenArtifacts(s);
  s = stripInlineTableReferences(s);
  s = normalizeReviewQuestionMarkdown(s);

  const lines = s.split("\n");
  const out = [];

  function isObjectiveLine(trimmed) {
    return /^[✓✔△▶]/.test(trimmed) || /^■/.test(trimmed);
  }

  function maybeHeading(line, nextLine) {
    const t = line.trim();
    const n = (nextLine || "").trim();
    if (!t || !n) return line;
    if (isObjectiveLine(t)) return line;
    if (/^#{1,6}\s|^>\s|^\|.+\|$|^[-*]\s|^\d+\.\s/.test(t)) return line;
    /**
     * Book subsection banners like "Exploring Motherboards, Processors, and Memory".
     * Skip PDF footers: "Exploring Power and Cooling 53" (trailing page number).
     */
    if (/^Exploring\s+.+/i.test(t) && t.length <= 88 && !/[.!?]/.test(t) && !/\s+\d+$/.test(t)) {
      return "### " + t;
    }
    if (t.length > 56) return line;
    if (/[.!?:;]/.test(t)) return line;
    const words = t.split(/\s+/).filter(Boolean).map((w) => w.replace(/,$/, ""));
    if (words.length < 1 || words.length > 8) return line;
    const titleWord = /^[A-Z][a-z]{1,24}$|^[A-Z]{2,6}$/;
    /**
     * Single-word labels: Motherboards, Processors (min length avoids false positives).
     * Do not treat “Mirroring” / “Casting” style inline definitions as headings when the next
     * line is “In some …” (PDF line breaks inside a sentence).
     */
    if (words.length === 1) {
      if (t.length < 5) return line;
      if (!titleWord.test(words[0])) return line;
      /** “THE FOLLOWING COMPTIA…” matches /^The/i and falsely promotes “Components”. */
      if (/^THE FOLLOWING\b/i.test(n)) return line;
      if (/^In\s/i.test(n)) return line;
      if (
        !/^(The |This |These |That |There |When |For |It |They |So |Here |One |Most |Each |Your |If |As |After |Before |A |An |Another |Some |Many |All |Both |Such |What |How |Why |Just |While |Although |Because |During |Without |Within |Under |Over )/i.test(
          n
        )
      )
        return line;
    } else {
      if (t.length < 10) return line;
      if (!words.every((w) => titleWord.test(w))) return line;
      if (
        !/^(The |In |This |These |When |For |It |They |So |Here |One |Most |Each |Your |If |As |After |Before |Just |A |An )/.test(n)
      )
        return line;
    }
    return "### " + t;
  }

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    const trimmed = line.trim();
    const next = lines[i + 1];

    if (isObjectiveLine(trimmed)) {
      const prev = out[out.length - 1];
      const prevIsItem = prev !== undefined && /^- /.test(prev.trim());
      if (prev !== undefined && prev !== "" && prev.trim() !== "" && !prevIsItem) {
        out.push("");
      }
      out.push("- " + trimmed);
      continue;
    }

    line = maybeHeading(line, next);
    out.push(line);
  }

  s = reflowProseBlocks(out.join("\n"));
  s = stripInlineTableReferences(s);
  s = repairPdfSpuriousSpaces(s);
  return s;
}

/**
 * PDF bullets (■, ✓, …) are kept in Markdown so lists parse; strip them from HTML so <ul><li>
 * only shows the native list marker.
 */
function stripLeadingPdfListMarker(s) {
  let t = String(s).replace(/\s+/g, " ").trim();
  let prev = "";
  while (prev !== t) {
    prev = t;
    t = t.replace(/^[\s\u00a0]*(?:[✓✔△▶]|■|▪)+\s*/u, "").trim();
  }
  return t;
}

/**
 * Marked emits a flat <ul> for exam objectives; nest plain sub-bullets under each "N.M …" objective line.
 */
function nestExamObjectiveSubbullets(html) {
  const stripObjectiveText = (inner) =>
    inner
      .replace(/<p>\s*/gi, "")
      .replace(/\s*<\/p>/gi, "")
      .replace(/<[^>]+>/g, "")
      .replace(/\s+/g, " ")
      .trim();

  return html.replace(/<ul class="lh-exam-objectives">([\s\S]*?)<\/ul>/gi, (_, inner) => {
    const lis = [];
    const re = /<li(?:\s[^>]*)?>([\s\S]*?)<\/li>/gi;
    let m;
    while ((m = re.exec(inner)) !== null) lis.push(m[1]);

    const out = [];
    let i = 0;
    while (i < lis.length) {
      const t = stripObjectiveText(lis[i]);
      if (/^\d+\.\d+/.test(t)) {
        const subs = [];
        let j = i + 1;
        while (j < lis.length && !/^\d+\.\d+/.test(stripObjectiveText(lis[j]))) {
          subs.push(lis[j]);
          j++;
        }
        if (subs.length > 0) {
          out.push(
            `<li>${lis[i]}<ul class="lh-exam-objectives-sub">${subs.map((s) => `<li>${s}</li>`).join("")}</ul></li>`
          );
          i = j;
          continue;
        }
      }
      out.push(`<li>${lis[i]}</li>`);
      i++;
    }
    return `<ul class="lh-exam-objectives">${out.join("")}</ul>`;
  });
}

function normalizeReviewQuestionLines(raw) {
  let s = String(raw || "");
  s = s.replace(/<br\s*\/?>/gi, "\n");
  s = s.replace(/<\/p>/gi, "\n");
  s = s.replace(/<li[^>]*>/gi, "\n");
  s = s.replace(/<\/li>/gi, "\n");
  s = s.replace(/<[^>]+>/g, " ");
  s = s
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"');
  s = s.replace(/\s+([A-D])\.\s/g, "\n$1. ");
  s = s.replace(/\s+(\d{1,2})\.\s/g, "\n$1. ");
  s = s.replace(/\r/g, "");

  const lines = s
    .split("\n")
    .map((line) => line.replace(/\s+/g, " ").trim())
    .filter(Boolean)
    .map((line) =>
      line
        .replace(/^([A-D])\s*-\.\s*/i, "$1. ")
        .replace(/^([A-D])\s*$/i, "$1.")
        .replace(/^(\d{1,2})\s*-\.\s*/, "$1. ")
        .replace(/^(\d{1,2})\s*$/, "$1.")
        .replace(/^\.\s+/, "")
    );
  return lines;
}

function formatReviewQuestionsHtml(blockHtml) {
  const lines = normalizeReviewQuestionLines(blockHtml);
  const questions = [];
  let intro = "";
  let cur = null;

  for (const line of lines) {
    if (!intro && /^You can find the answers in Appendix\b/i.test(line)) {
      intro = line;
      continue;
    }
    const qMatch = line.match(/^(\d{1,2})\.\s*(.+)$/);
    if (qMatch) {
      if (cur) questions.push(cur);
      cur = { n: qMatch[1], q: qMatch[2], choices: [] };
      continue;
    }
    const cMatch = line.match(/^([A-D])\.\s*(.+)$/i);
    if (cMatch && cur) {
      cur.choices.push({ key: cMatch[1].toUpperCase(), text: cMatch[2] });
      continue;
    }
    if (cur) {
      if (cur.choices.length) {
        const last = cur.choices[cur.choices.length - 1];
        last.text = (last.text + " " + line).replace(/\s+/g, " ").trim();
      } else {
        cur.q = (cur.q + " " + line).replace(/\s+/g, " ").trim();
      }
    }
  }
  if (cur) questions.push(cur);
  if (questions.length < 1) return null;

  const introHtml = intro ? `<p class="lh-review-intro">${escHtml(intro)}</p>` : "";
  const items = questions
    .map((q) => {
      const choices = q.choices.length
        ? `<ul class="lh-review-choices">${q.choices
            .map((c) => `<li><strong>${escHtml(c.key)}.</strong> ${escHtml(c.text)}</li>`)
            .join("")}</ul>`
        : "";
      return `<li><p>${escHtml(q.q)}</p>${choices}</li>`;
    })
    .join("");

  return (
    `<section class="lh-review-questions" aria-label="Chapter review questions">` +
    `<h3>Review Questions</h3>` +
    introHtml +
    `<ol>${items}</ol>` +
    `<section class="lh-extra-review-questions" aria-label="Additional review questions">` +
    `<h4>Additional Review Questions</h4>` +
    `<p class="lh-review-intro">Reserved for extra question sets you add later.</p>` +
    `</section>` +
    `</section>`
  );
}

function normalizeReviewQuestionSections(html) {
  let replaced = false;
  const next = String(html).replace(
    /<p>\s*Review Questions\s*<\/p>([\s\S]*?)(?=(?:<h[1-6]\b)|(?:<\/div>\s*$))/gi,
    (_, tail) => {
      const formatted = formatReviewQuestionsHtml(tail);
      if (!formatted) return `<p>Review Questions</p>${tail}`;
      replaced = true;
      return formatted;
    }
  );
  if (replaced || !/<p>\s*Review Questions\s*<\/p>/i.test(next)) return next;
  return next.replace(
    /(<p>\s*Review Questions\s*<\/p>)/i,
    `$1<section class="lh-extra-review-questions" aria-label="Additional review questions"><h4>Additional Review Questions</h4><p class="lh-review-intro">Reserved for extra question sets you add later.</p></section>`
  );
}

function postprocessChapterHtml(html) {
  let h = html.trim();
  h = h.replace(
    /<p>(Source:\s*CompTIA Tech\+[^<]{0,220})<\/p>/i,
    '<p class="lh-md-meta">$1</p>'
  );
  /** Standalone PDF section runners (“Exploring … 43”) that leak as empty paragraphs */
  h = h.replace(/<p(\s[^>]*)?>\s*Exploring\s+[^<]+\s+\d{1,3}\s*<\/p>/gi, "");
  /** Mid-word line breaks leaked into HTML (<br> between letters) */
  let prevBr = "";
  while (prevBr !== h) {
    prevBr = h;
    h = h.replace(/([a-z])<br\s*\/?>\s*([a-z])/gi, "$1$2");
  }
  /** marked “loose” lists wrap each <li> in <p> — strips when inner is plain text only */
  h = h.replace(/<li>\s*<p>([^<]*)<\/p>\s*<\/li>/g, (_, inner) => "<li>" + stripLeadingPdfListMarker(inner) + "</li>");
  /** Collapse stray newlines inside simple list items (PDF column breaks) */
  h = h.replace(/<li>([^<]+)<\/li>/g, (_, inner) => "<li>" + stripLeadingPdfListMarker(inner) + "</li>");
  /**
   * Exam-objective kicker is often several <p> lines (chapter title + “THE FOLLOWING…”).
   * Wrap all <p> blocks from <hr> through the last preamble paragraph before the objectives <ul>.
   */
  h = h.replace(
    /<hr>\s*((?:<p>[\s\S]*?<\/p>\s*)+)(?=\s*<ul>)/i,
    (_, blocks) => {
      if (!/THE FOLLOWING COMPTIA/i.test(blocks) || !/CHAPTER:/i.test(blocks)) return "<hr>\n" + blocks;
      const inner = blocks.replace(/>\s*\n\s*</g, "><").trim();
      return `<hr>\n<div class="lh-md-objectives-banner">${inner}</div>\n`;
    }
  );
  h = h.replace(/<div class="lh-md-objectives-banner">([\s\S]*?)<\/div>/, (_, inner) => {
    return `<div class="lh-md-objectives-banner">${inner.trim()}</div>`;
  });
  /**
   * Marked often emits <hr><h2>…</h2><p><strong>THE FOLLOWING…</strong></p><ul> — the banner
   * regex above may not wrap; still tag the exam objectives <ul> for layout + nesting pass.
   */
  h = h.replace(
    /(<p><strong>THE FOLLOWING COMPTIA TECH\+[^<]*<\/strong><\/p>)\s*\n*<ul>/gi,
    '$1\n<ul class="lh-exam-objectives">'
  );
  h = nestExamObjectiveSubbullets(h);
  h = h.replace(/\bOBJECTIVESARE\b/gi, "OBJECTIVES ARE");
  /** Common PDF/OCR spacing glitches in this corpus */
  h = h.replace(/\bint ernal\b/gi, "internal");
  h = h.replace(/\bcontr ast\b/g, "contrast");
  h = h.replace(/\bnon-\s+volatile\b/gi, "non-volatile");
  h = h.replace(/\bNon-\s+volatile\b/g, "Non-volatile");
  h = h.replace(/\bReadonly memory \(R\s*<br\s*\/?>\s*OM\)/gi, "Read-only memory (ROM)");
  h = h.replace(/\bReadonly memory\b/gi, "Read-only memory");
  h = h.replace(/\bReadonly\b/g, "Read-only");
  h = h.replace(/\bSolidstate\b/gi, "Solid-state");
  h = h.replace(/\bmo\s+therboard\b/gi, "motherboard");
  h = h.replace(/\bZ790-\s*E\b/g, "Z790-E");
  h = h.replace(/\bZ690-\s*E\b/g, "Z690-E");
  h = h.replace(/\bbrand-\s*na\s+me\b/gi, "brand-name");
  h = h.replace(/\bROG\s+Strix\s+Z790-\s*E\b/g, "ROG Strix Z790-E");
  h = h.replace(/\bASUS\s+ROG\s+Strix\s+Z790-\s*E\b/g, "ASUS ROG Strix Z790-E");
  h = h.replace(/\bmo\s+vie\b/gi, "movie");
  h = h.replace(/\bconver\s+sions\b/gi, "conversions");
  h = h.replace(/\b1,00\s+0\s+kilobytes\b/g, "1,000 kilobytes");
  h = h.replace(/\bT ypes\b/g, "Types");
  h = h.replace(/\bT ype\b/g, "Type");
  h = h.replace(/\bstor age\b/gi, "storage");
  h = h.replace(/\bnetwor king\b/gi, "networking");
  h = h.replace(/\battac hed\b/gi, "attached");
  h = h.replace(/\bpr ogramming\b/gi, "programming");
  h = h.replace(/\bhigher\s+-\s+end\b/gi, "higher-end");
  h = h.replace(/\bhigher\s+-\s+level\b/gi, "higher-level");
  h = h.replace(/\bfiber\s+-\s+optic\b/gi, "fiber-optic");
  h = h.replace(/\bpeer\s+-\s+to\s+-\s+peer\b/gi, "peer-to-peer");
  h = h.replace(/\bhigher\s+-\s+wattage\b/gi, "higher-wattage");
  h = h.replace(/\bUTF-\s*16\s+or\s+UTF\s*-\s*32\b/gi, "UTF-16 or UTF-32");
  h = h.replace(/it-\s*training\.apple\.com/gi, "it-training.apple.com");
  h = h.replace(/\bhigh-\s*le\s+vel\b/gi, "high-level");
  h = h.replace(/\bhypervi\s+-\s*sor\b/gi, "hypervisor");
  h = h.replace(/\bchec\s+k\b/gi, "check");
  h = h.replace(/\bc\s+hecked\b/gi, "checked");
  h = h.replace(/\bc\s+hoose\b/gi, "choose");
  h = h.replace(/\bt\s+ext1\.txt\b/gi, "text1.txt");
  h = h.replace(/\bsubobjec\s*-\s*tive\b/gi, "subobjective");
  h = h.replace(/\b802\.1\s+1([0-9a-z])/gi, "802.11$1");
  h = h.replace(/802\.1\s+1(?=\s|<|\.|,|\)|"|'|$)/gi, "802.11");
  h = h.replace(/\bmuc\s+h\b/gi, "much");
  h = h.replace(/\bconnecti\s+vity\b/gi, "connectivity");
  h = h.replace(/\bnetw\s+ork\b/gi, "network");
  h = h.replace(/\bscenar\s+io\b/gi, "scenario");
  h = h.replace(/\bCon\s+versely\b/g, "Conversely");
  h = h.replace(/\bWindows 1 1\b/g, "Windows 11");
  h = h.replace(/\bWindows 3\.1 1\b/g, "Windows 3.11");
  h = h.replace(/\bRJ1 1\b/g, "RJ11");
  h = h.replace(/\b201 1\b/g, "2011");
  h = h.replace(/Figure 7 \.1 1/g, "Figure 7.11");
  h = h.replace(/Figure 12\.1 1/g, "Figure 12.11");
  h = h.replace(/Figure 2\.1 1([^0-9]|$)/g, "Figure 2.11$1");
  h = h.replace(/\bChapter 1 1\b/g, "Chapter 11");
  h = h.replace(/\bFigure 1 1\./g, "Figure 11.");
  h = h.replace(/Figure 11\.1 1\b/g, "Figure 11.11");
  h = h.replace(/\bclosed-\s*so\s+urce\b/gi, "closed-source");
  h = h.replace(/\blow-\s*le\s+vel\b/gi, "low-level");
  h = h.replace(/\bnot-\s*so\s+-\s*ni\s+ce\b/gi, "not-so-nice");
  h = h.replace(/\bP\s+rogram\b/g, "Program");
  h = h.replace(/\bOperating S\s+ystem\b/g, "Operating system");
  h = h.replace(/\bL\s+ock Screen\b/g, "Lock Screen");
  h = h.replace(/\bdrop-\s*do\s*wn\b/gi, "drop-down");
  h = h.replace(/\bT erminology\b/g, "Terminology");
  h = h.replace(/\buninterruptable\b/gi, "uninterruptible");
  h = h.replace(/\bA CLs\b/g, "ACLs");
  h = h.replace(/bir th/g, "birth");
  h = h.replace(/\bw as\b/g, "was");
  h = h.replace(/bac kup/g, "backup");
  h = h.replace(/bac k\b/g, "back");
  h = h.replace(/softw are/g, "software");
  h = h.replace(/Reco very/g, "Recovery");
  h = h.replace(/Star tup/g, "Startup");
  h = h.replace(/ dri ve\b/g, " drive");
  h = h.replace(/dri ves/g, "drives");
  h = h.replace(/S ervice/g, "Service");
  h = h.replace(/L ock/g, "Lock");
  h = h.replace(/Windows 1 1/g, "Windows 11");
  h = h.replace(/Pri vacy/g, "Privacy");
  h = h.replace(/SmartS creen/g, "SmartScreen");
  h = h.replace(/Craiyon AI ar t/g, "Craiyon AI art");
  h = h.replace(/Predicti ve/g, "Predictive");
  h = h.replace(/Hyper -\s*V/g, "Hyper-V");
  h = h.replace(/av-\s*c\s+omparatives/gi, "av-comparatives");
  h = h.replace(/—\s{2,}/g, "— ");
  h = h.replace(/FC0-\s*U71/gi, "FC0-U71");
  h = h.replace(/Microsof\s+t\b/gi, "Microsoft");
  h = h.replace(/\bsc\s+hema\b/gi, "schema");
  h = h.replace(/\bCustomer\s+s\b/g, "Customers");
  h = h.replace(/\bwhic\s+h\b/g, "which");
  h = h.replace(/\bT\s+ables\b/gi, "Tables");
  h = h.replace(/\bT\s+able\b/g, "Table");
  h = h.replace(/\bY\s+ou\b/g, "You");
  h = h.replace(/\bV\s+iew\b/g, "View");
  /** Any figure captions that survived Markdown (e.g. bold inline) */
  h = h.replace(/<p>\s*FIGURE\s+\d+\.\d+[^<]*<\/p>/gi, "");
  h = h.replace(/<p>\s*Figure\s+\d+\.\d+[^<]{0,400}<\/p>/gi, "");
  /** Same figure-number OCR fixes after marked (HTML may still say “Figure 1 1.5”). */
  h = h.replace(/\b(Figure|FIGURE)\s+(\d+)\.\s+(\d+)\b/gi, "$1 $2.$3");
  h = h.replace(/\b(Figure|FIGURE)\s+(\d+)\s+(\d+)\.(\d+)\b/gi, "$1 $2$3.$4");
  /** Inline FIGURE / callouts inside paragraphs (marked escapes ’ as &#39;) */
  let hfPrev = "";
  while (hfPrev !== h) {
    hfPrev = h;
    h = h.replace(/\s*FIGURE\s+\d+\.\d+\s+[^<]{3,400}/gi, " ");
  }
  const htmlFigurePhrases = [
    /\bas shown in Figure\s+\d+\.\d+[A-Za-z]?\.\s*/gi,
    /(?:what&#39;s|what\u2019s|what's)\s+shown in Figure\s+\d+\.\d+[A-Za-z]?\.\s*/gi,
    /(?:it&#39;s|it\u2019s|it's)\s+at the top of Figure\s+\d+\.\d+[A-Za-z]?\.\s*/gi,
    /which is in the upper-\s*right corner of Figure\s+\d+\.\d+[A-Za-z]?\.\s*/gi,
    /\bscreen similar to the one in Figure\s+\d+\.\d+[A-Za-z]?\. Here[^<]+?\.\s*/gi,
    /\bone in Figure\s+\d+\.\d+[A-Za-z]?\. Here[^<]+?\.\s*/gi,
    /\babove the cartridges in Figure\s+\d+\.\d+[A-Za-z]?\.\s*/gi,
    /\bthat you saw in Figure\s+\d+\.\d+[A-Za-z]?\.\s*/gi,
    /\bwill see a screen similar to the one shown in Figure\s+\d+\.\d+[A-Za-z]?\.\s*This screen[^<]+?\.\s*/gi,
    /\blike the one shown in Figure\s+\d+\.\d+[A-Za-z]?\.\s*Notice[^<]+?\.\s*/gi,
    /\blik\s+e you see in Figure\s+\d+\.\d+[A-Za-z]?\.\s*/gi,
    />\s*e you see in Figure\s+\d+\.\d+[A-Za-z]?\.\s*/gi,
    /\bIn the example shown in Figure\s+\d+\.\d+[A-Za-z]?, \s*/gi,
    /\bFigure\s+\d+\.\d+[A-Za-z]?\s+shows,\s*[^<]+?\.\s*/gi,
    /\bas shown in Figure\s+\d+\.\d+[A-Za-z]?\.\s*/gi,
    /\bas highlighted in Figure\s+\d+\.\d+[A-Za-z]?\.[^<]*?\.\s*/gi,
    /\b\(Figure\s+\d+\.\d+[A-Za-z]?\)\.\s*/gi,
    /(\n|^)\s*in Figure\s+\d+\.\d+[A-Za-z]?\.\s*/gi,
  ];
  for (const re of htmlFigurePhrases) h = h.replace(re, " ");
  h = h.replace(/<p>in Figure\s+\d+\.\d+[A-Za-z]?\.<\/p>\s*/gi, "");
  h = h.replace(/<p>\d+\s+Chapter\s+\d+\s+[▪■][^<]*<\/p>\s*/gi, "");
  h = h.replace(/<p>\s*<\/p>\n?/g, "");
  /** Any ■/▪/PDF markers that survived marked (loose lists, wrapped <li>, tables) */
  h = h.replace(/[■▪]/gu, "");
  h = normalizeReviewQuestionSections(h);
  h = polishTechplusHtml(h);
  return h;
}

/** First `###` line in source (chapter opener after objectives). */
function firstMdH3Heading(md) {
  for (const line of md.split("\n")) {
    const t = line.trim();
    if (t.startsWith("### ") && !t.startsWith("####")) return t.slice(4).trim();
  }
  return null;
}

const CHAPTER_FILES = [
  ["tech-sg-01", "01_Core_Hardware_Components.md", "Ch 1 — Core Hardware Components"],
  ["tech-sg-02", "02_Peripherals_and_Connectors.md", "Ch 2 — Peripherals and Connectors"],
  ["tech-sg-03", "03_Computing_Devices_and_the_Internet_of_Things.md", "Ch 3 — Computing Devices and IoT"],
  ["tech-sg-04", "04_Operating_Systems.md", "Ch 4 — Operating Systems"],
  ["tech-sg-05", "05_Software_Applications.md", "Ch 5 — Software Applications"],
  ["tech-sg-06", "06_Software_Development.md", "Ch 6 — Software Development"],
  ["tech-sg-07", "07_Database_Fundamentals.md", "Ch 7 — Database Fundamentals"],
  ["tech-sg-08", "08_Networking_Concepts_and_Technologies.md", "Ch 8 — Networking Concepts and Technologies"],
  ["tech-sg-09", "09_Cloud_Computing_and_Artificial_Intelligence.md", "Ch 9 — Cloud Computing and AI"],
  ["tech-sg-10", "10_Security_Concepts_and_Threats.md", "Ch 10 — Security Concepts and Threats"],
  ["tech-sg-11", "11_Security_Best_Practices.md", "Ch 11 — Security Best Practices"],
  ["tech-sg-12", "12_Data_Continuity_and_Computer_Support.md", "Ch 12 — Data Continuity and Computer Support"],
];

function markdownToHtml(md) {
  /**
   * Use the marked library here — on Windows, `execSync(..., { input })` does not reliably
   * pipe stdin to `npx marked`, so the CLI was parsing the wrong bytes and produced garbage HTML.
   * GFM on, hard breaks off (same as `marked --gfm` without `--breaks`).
   */
  const html = marked.parse(md, { gfm: true, breaks: false, async: false });
  if (typeof html !== "string") {
    throw new Error("marked.parse returned non-string; async markdown path not supported in this build");
  }
  return html;
}

function escHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function stripTags(html) {
  return String(html)
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Avoid “Topic (continued) (continued)” when oversize splits stack. */
function canonicalSectionTitle(t) {
  if (!t || typeof t !== "string") return null;
  let s = t.trim().replace(/\s+/g, " ");
  for (;;) {
    let next = s.replace(/\s+\(continued\)\s*$/i, "").trim();
    next = next.replace(/\s+[—–]\s*continued\s*$/i, "").trim();
    if (next === s) break;
    s = next;
  }
  return s.length > 0 ? s : null;
}

const MAX_SEGMENT_HTML = 16500;
const MIN_SEGMENT_HTML = 80;
const MIN_MARKER_GAP = 48;
/** Sidebar / source-line titles: word-safe cap (avoid mid-word truncation). */
const TITLE_SOFT_MAX = 200;

function truncateAtWord(s, max) {
  const t = String(s).trim();
  if (t.length <= max) return t;
  const slice = t.slice(0, max);
  const sp = slice.lastIndexOf(" ");
  return sp > Math.floor(max * 0.55) ? slice.slice(0, sp) + "…" : slice.trim() + "…";
}

/** Prefer one full sentence; otherwise cap at word boundary. */
function formatLessonTitleLine(s, hardCap = TITLE_SOFT_MAX) {
  const t = String(s).replace(/\s+/g, " ").trim();
  if (!t) return "";
  const one = t.match(/^.{12,}?[.!?](?=\s|$)/);
  const use = one ? one[0].trim() : t;
  return use.length <= hardCap ? use : truncateAtWord(use, hardCap);
}

/** Shorter nav labels: drop textbook-style h3 prefixes when the rest is still clear. */
function polishLessonTitle(s) {
  let t = String(s).replace(/\s+/g, " ").trim();
  if (!t) return t;
  for (const re of [/^Exploring\s+/i, /^Understanding\s+/i]) {
    const m = t.match(re);
    if (m && t.length - m[0].length >= 12) {
      t = t.slice(m[0].length).trim();
      break;
    }
  }
  return t;
}

function titleFromHeadingHtml(h3Inner) {
  const plain = stripTags(h3Inner);
  return plain.length > 2 ? polishLessonTitle(formatLessonTitleLine(plain)) : "";
}

/**
 * Parse EXERCISE N.M heading from chunk (handles split </p><p> title lines).
 * Do not use [^<]{0,140} — it cuts titles mid-sentence.
 */
function parseExerciseHeadingFromChunk(htmlTrim) {
  const pos = htmlTrim.search(/<p(?:\s[^>]*)?>\s*EXERCISE\s+\d+\.\d+/i);
  if (pos < 0) return null;
  const tail = htmlTrim.slice(pos);
  let m = tail.match(
    /^<p(?:\s[^>]*)?>\s*EXERCISE\s+(\d+\.\d+)\s*<\/p>\s*(?:<p(?:\s[^>]*)?>\s*([^<]+)\s*<\/p>|(<h3[^>]*>[\s\S]*?<\/h3>))/i
  );
  if (m) {
    const subtitle = stripTags(m[2] || m[3] || "")
      .replace(/\s+/g, " ")
      .trim();
    return { num: m[1], subtitle };
  }
  m = tail.match(/^<p(?:\s[^>]*)?>\s*EXERCISE\s+(\d+\.\d+)\s+([^<]*)<\/p>/i);
  if (m) {
    const subtitle = stripTags(m[2])
      .replace(/\s+/g, " ")
      .trim();
    return { num: m[1], subtitle };
  }
  return null;
}

/** Split points: major headings, hands-on exercises, review sections. */
function findHtmlSplitMarkers(inner) {
  const markers = [];
  /**
   * Omit "Review Questions 63" style PDF footers — only real section headers.
   * EXERCISE: allow optional attributes on <p>.
   */
  const patterns = [
    /<h3\b/gi,
    /<p(?:\s[^>]*)?>\s*EXERCISE\s+\d+\.\d+/gi,
    /<p(?:\s[^>]*)?>\s*Review Questions(?!\s+\d)/gi,
  ];
  for (const re of patterns) {
    re.lastIndex = 0;
    let m;
    while ((m = re.exec(inner))) {
      markers.push(m.index);
    }
  }
  markers.sort((a, b) => a - b);
  const deduped = [];
  for (const i of markers) {
    const last = deduped[deduped.length - 1];
    if (last !== undefined && i - last < MIN_MARKER_GAP) continue;
    deduped.push(i);
  }
  return deduped;
}

function sliceHtmlByMarkers(inner, markers) {
  const chunks = [];
  for (let k = 0; k <= markers.length; k++) {
    const start = k === 0 ? 0 : markers[k - 1];
    const end = k === markers.length ? inner.length : markers[k];
    const slice = inner.slice(start, end).trim();
    if (slice.length >= MIN_SEGMENT_HTML) chunks.push(slice);
  }
  return chunks;
}

/** Keep lessons from growing past MAX_SEGMENT_HTML (paragraph-safe). */
function splitOversizeHtmlChunks(chunks, maxLen) {
  const out = [];
  for (const ch of chunks) {
    if (ch.length <= maxLen) {
      out.push(ch);
      continue;
    }
    let rest = ch;
    const h1Close = rest.indexOf("</h1>");
    const guard = h1Close >= 0 ? h1Close + 5 : 0;
    while (rest.length > maxLen) {
      let cut = rest.lastIndexOf("</p>", maxLen);
      if (cut < guard + 400) {
        cut = rest.indexOf("</p>", maxLen);
      }
      if (cut <= 0 || cut < guard) {
        out.push(rest);
        break;
      }
      out.push(rest.slice(0, cut + 4).trim());
      rest = rest.slice(cut + 4).trim();
    }
    if (rest) out.push(rest);
  }
  return out;
}

function mergeTinyHtmlChunks(chunks, minLen) {
  const out = [];
  for (const ch of chunks) {
    if (ch.length < minLen && out.length) {
      /** Do not absorb a new ### section into the previous segment (breaks lesson titles). */
      if (/^\s*<h3\b/i.test(ch)) {
        out.push(ch);
      } else {
        out[out.length - 1] = out[out.length - 1] + ch;
      }
    } else {
      out.push(ch);
    }
  }
  return out.filter(
    (c) => c.length >= MIN_SEGMENT_HTML || /^\s*<h3\b/i.test(c.trim())
  );
}

function segmentLessonTitle(html, chapterTitle, index, inheritSectionTitle) {
  if (index === 0) return "Chapter overview & objectives";
  const htmlTrim = String(html).trim();
  const leadH3 = htmlTrim.match(/^<h3[^>]*>([\s\S]*?)<\/h3>/i);
  if (leadH3) {
    const t = titleFromHeadingHtml(leadH3[1]);
    if (t) return t;
  }
  const exParsed = parseExerciseHeadingFromChunk(htmlTrim);
  if (exParsed) {
    const sub = polishLessonTitle(formatLessonTitleLine(exParsed.subtitle, 170));
    if (sub) return `Exercise ${exParsed.num} — ${sub}`;
    return `Exercise ${exParsed.num}`;
  }
  const exIntro = htmlTrim.match(/^<p(?:\s[^>]*)?>\s*(Exercise\s+\d+\.\d+\s+[^<]+)\s*<\/p>/i);
  if (exIntro) {
    const t = polishLessonTitle(formatLessonTitleLine(stripTags(exIntro[1]), TITLE_SOFT_MAX));
    if (t.length > 2) return t;
  }
  if (/^<p(?:\s[^>]*)?>\s*Review Questions\b/i.test(htmlTrim)) return "Chapter review questions";
  if (inheritSectionTitle && inheritSectionTitle.length > 2) {
    const base = formatLessonTitleLine(inheritSectionTitle, 170);
    const cont = `${base} — continued`;
    return cont.length <= TITLE_SOFT_MAX + 14
      ? cont
      : truncateAtWord(base, TITLE_SOFT_MAX - 14) + " — continued";
  }
  /** Prose-only slices before the first ### (or broken inherit chain): use first heading in HTML. */
  const anywhere = htmlTrim.match(/<h3[^>]*>([\s\S]*?)<\/h3>/i);
  if (anywhere) {
    const t = titleFromHeadingHtml(anywhere[1]);
    if (t) return t;
  }
  return chapterTitle + " — Continued (" + (index + 1) + ")";
}

/** Study-guide segment HTML — no file paths; bundled in learn-hub-techplus-md.js */
function wrapBody(lessonId, lessonTitle, chapterTitle, innerHtml) {
  return (
    `<p class="lh-tg-source"><strong>${escHtml(lessonTitle)}</strong> · <span class="lh-tg-chapter">${escHtml(
      chapterTitle
    )}</span> · Lesson <code>${escHtml(lessonId)}</code> · CompTIA Tech+ FC0-U71. Study-guide text only—read in order with the rest of this chapter’s lessons.</p>` +
    `<hr class="teach-hr lh-md-start"/>` +
    `<div class="lh-tg-root tech-prose lh-tg-markdown lh-chapter-markdown">${innerHtml.trim()}</div>`
  );
}

function main() {
  if (!fs.existsSync(mdDir)) {
    console.error("Missing markdown folder:", mdDir);
    process.exit(1);
  }

  const map = {};
  const courseSgLessons = [];

  for (const [baseId, fname, chapterTitle] of CHAPTER_FILES) {
    const fp = path.join(mdDir, fname);
    if (!fs.existsSync(fp)) {
      console.error("Missing:", fp);
      process.exit(1);
    }
    console.log("Parsing", fname, "…");
    const raw = fs.readFileSync(fp, "utf8");
    let innerHtml;
    try {
      const md = preprocessMarkdown(raw);
      innerHtml = postprocessChapterHtml(markdownToHtml(md)).trim();
    } catch (e) {
      console.warn("marked CLI failed, fallback minimal parse:", e.message);
      innerHtml =
        "<pre class=\"lh-md-fallback\">" +
        raw.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;") +
        "</pre>";
    }

    const markers = findHtmlSplitMarkers(innerHtml);
    let chunks = sliceHtmlByMarkers(innerHtml, markers);
    chunks = splitOversizeHtmlChunks(chunks, MAX_SEGMENT_HTML);
    chunks = mergeTinyHtmlChunks(chunks, 120);

    let sectionInherit = null;
    for (let i = 0; i < chunks.length; i++) {
      const seg = String(i + 1).padStart(2, "0");
      const lessonId = baseId + "-" + seg;
      const chunkHtml = chunks[i];
      const htmlTrim = chunkHtml.trim();
      let lessonTitle = segmentLessonTitle(chunkHtml, chapterTitle, i, sectionInherit);
      /**
       * Orphan slices (e.g. list HTML) with no heading: inherit last ### from the previous chunk
       * or the previous lesson title when merge/split boundaries skip a lead <h3>.
       */
      const dashNorm = (s) =>
        String(s)
          .replace(/\u2013|\u2014|\u2015/g, "—")
          .replace(/\s+/g, " ")
          .trim();
      /** Match the final “— Continued (n)” suffix (chapter titles also contain “—”). */
      const gMatch = lessonTitle.match(/^(.+) — Continued \((\d+)\)\s*$/);
      const genericContinued =
        gMatch &&
        Number(gMatch[2]) === i + 1 &&
        dashNorm(gMatch[1]) === dashNorm(chapterTitle);
      if (genericContinued && i > 0) {
        let base = null;
        const prevHtml = chunks[i - 1];
        const allH3 = prevHtml.match(/<h3\b[^>]*>[\s\S]*?<\/h3>/gi);
        if (allH3?.length) {
          const mm = allH3[allH3.length - 1].match(/<h3[^>]*>([\s\S]*?)<\/h3>/i);
          if (mm) {
            const t = titleFromHeadingHtml(mm[1]);
            base = canonicalSectionTitle(t);
          }
        }
        if (!base) {
          const prevTitle = courseSgLessons[i - 1]?.title;
          if (
            prevTitle &&
            !/^Chapter overview\b/i.test(prevTitle) &&
            !/^Overview\b/i.test(prevTitle)
          ) {
            base = canonicalSectionTitle(prevTitle);
          }
        }
        if (!base && i === 1) {
          const fromMd = firstMdH3Heading(raw);
          if (fromMd) base = canonicalSectionTitle(polishLessonTitle(formatLessonTitleLine(fromMd)));
        }
        if (base) {
          const cont = `${base} — continued`;
          lessonTitle =
            cont.length > TITLE_SOFT_MAX + 14
              ? truncateAtWord(base, TITLE_SOFT_MAX - 14) + " — continued"
              : cont;
          sectionInherit = base;
        }
      }

      const leadH3 = htmlTrim.match(/^<h3[^>]*>([\s\S]*?)<\/h3>/i);
      if (leadH3) {
        const t = titleFromHeadingHtml(leadH3[1]);
        sectionInherit = canonicalSectionTitle(t);
      } else if (/^<p(?:\s[^>]*)?>\s*EXERCISE\b/i.test(htmlTrim)) {
        sectionInherit = canonicalSectionTitle(lessonTitle);
      } else if (/^<p(?:\s[^>]*)?>\s*Review Questions\b/i.test(htmlTrim)) {
        sectionInherit = "Chapter review questions";
      } else {
        const anyH3 = htmlTrim.match(/<h3[^>]*>([\s\S]*?)<\/h3>/i);
        if (anyH3) {
          const t = titleFromHeadingHtml(anyH3[1]);
          sectionInherit = canonicalSectionTitle(t);
        }
      }

      map[lessonId] = wrapBody(lessonId, lessonTitle, chapterTitle, chunkHtml);
      courseSgLessons.push({
        unit: chapterTitle,
        id: lessonId,
        kind: "learn",
        title: lessonTitle,
        narrative: "",
      });
    }
    console.log("  →", chunks.length, "lessons", baseId + "-01 … " + baseId + "-" + String(chunks.length).padStart(2, "0"));
  }

  const banner =
    "/* Auto-generated by scripts/build-techplus-from-markdown.mjs — edit chapters/*.md then re-run */\n";
  const chHashes = writeChapterJsFiles(learnHubRoot, map, banner);
  const loaderPath = writeTechplusMdLoader(learnHubRoot, chHashes, banner);
  console.log(
    "Wrote",
    loaderPath,
    "+ 12 chapter chunk files,",
    Object.keys(map).length,
    "segment entries total"
  );

  const courseText = fs.readFileSync(coursesPath, "utf8");
  const start = courseText.indexOf("[");
  const end = courseText.lastIndexOf("]");
  if (start < 0 || end < 0) {
    console.error("Could not parse learn-hub-courses.js wrapper");
    process.exit(1);
  }
  const courses = JSON.parse(courseText.slice(start, end + 1));
  const tech = courses.find((c) => c.id === "tech");
  if (!tech || !Array.isArray(tech.lessons)) {
    console.error("tech course not found");
    process.exit(1);
  }

  const kept = tech.lessons.filter(
    (l) => !/^tech-sg-\d{2}$/.test(l.id) && !/^tech-sg-\d{2}-\d{2}$/.test(l.id)
  );
  tech.lessons = [...courseSgLessons, ...kept];
  fs.writeFileSync(coursesPath, "window.LEARN_HUB_COURSES = " + JSON.stringify(courses) + ";\n", "utf8");
  console.log("Updated tech track:", courseSgLessons.length, "study-guide lessons +", kept.length, "other steps.");

  const indexPath = path.join(learnHubRoot, "index.html");
  const mdShort = crypto.createHash("sha256").update(fs.readFileSync(loaderPath, "utf8")).digest("hex").slice(0, 12);
  const courseShort = crypto.createHash("sha256").update(fs.readFileSync(coursesPath, "utf8")).digest("hex").slice(0, 12);
  let indexHtml = fs.readFileSync(indexPath, "utf8");
  const nextIndex = indexHtml
    .replace(/(<script src="assets\/learn-hub-courses\.js)(\?[^"]*)?("><\/script>)/, `$1?v=${courseShort}$3`)
    .replace(/(<script src="assets\/learn-hub-techplus-md\.js)(\?[^"]*)?("><\/script>)/, `$1?v=${mdShort}$3`);
  if (nextIndex !== indexHtml) {
    fs.writeFileSync(indexPath, nextIndex, "utf8");
    console.log("Updated index.html script ?v= hashes for courses + techplus-md (cache bust).");
  }
}

main();
