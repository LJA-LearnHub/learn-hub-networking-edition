/**
 * Parse Markdown Networking/*.md into small chunks (### subsections) for inline lessons.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { marked } from "./vendor/marked.esm.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const MD_ROOT = path.resolve(__dirname, "..", "..", "Markdown Networking");

const SOURCE_FILES = [
  { file: "part1.md", prefix: "p1" },
  { file: "part2.md", prefix: "p2" },
  { file: "part3.md", prefix: "p3" },
  { file: "deep_cisco.md", prefix: "cisco" },
  { file: "sec_pentest_part1.md", prefix: "sec1" },
  { file: "sec_pentest_part2.md", prefix: "sec2" },
  { file: "pentest_deep.md", prefix: "pt" },
];

marked.setOptions({ gfm: true, breaks: false });

/** Split numbered curriculum (## 1.1) and specialty ids (## A5., ## S2.4, ## PT1.1) */
function parseSectionBlocks(content, sourcePrefix) {
  const blocks = [];
  const lines = content.split(/\r?\n/);
  let current = null;
  let buf = [];

  function flush() {
    if (!current) return;
    const body = buf.join("\n").trim();
    if (body) blocks.push({ ...current, body });
    buf = [];
  }

  for (const line of lines) {
    const num = line.match(/^## (\d+\.\d+)\s+(.+)$/);
    const cisco = line.match(/^## (A\d+)\.\s+(.+)$/i);
    const sec = line.match(/^## (S\d+\.\d+)\s+(.+)$/i);
    const pt = line.match(/^## (PT\d+\.\d+)\s+(.+)$/i);

    if (num || cisco || sec || pt) {
      flush();
      const id = num ? num[1] : cisco ? cisco[1].toUpperCase() : sec ? sec[1].toUpperCase() : pt[1].toUpperCase();
      const title = (num || cisco || sec || pt)[2].trim();
      current = { source: sourcePrefix, sectionId: id, sectionTitle: title };
      buf = [line];
      continue;
    }
    if (current) buf.push(line);
  }
  flush();
  return blocks;
}

/** Split a ## block into ### chunks; one chunk if no ### headings. */
function splitBlockIntoChunks(block) {
  const lines = block.body.split(/\r?\n/);
  const chunks = [];
  let current = null;
  let buf = [];

  function flush() {
    if (!buf.length) return;
    const body = buf.join("\n").trim();
    if (!body) return;
    chunks.push({
      source: block.source,
      sectionId: block.sectionId,
      sectionTitle: block.sectionTitle,
      chunkTitle: current || block.sectionTitle,
      body,
    });
    buf = [];
  }

  for (const line of lines) {
    const h3 = line.match(/^###\s+(.+)$/);
    if (h3) {
      flush();
      current = h3[1].trim();
      buf = [line];
      continue;
    }
    buf.push(line);
  }
  flush();

  if (!chunks.length && block.body.trim()) {
    chunks.push({
      source: block.source,
      sectionId: block.sectionId,
      sectionTitle: block.sectionTitle,
      chunkTitle: block.sectionTitle,
      body: block.body,
    });
  }
  return chunks;
}

/** Keep lesson-sized bites (~2–4k chars) when a section has no ### splits. */
function splitBySize(chunk, maxLen = 1500) {
  if (chunk.body.length <= maxLen) return [chunk];
  const out = [];
  let buf = "";
  const blocks = chunk.body.split(/\n\n+/);
  for (const block of blocks) {
    const next = buf ? buf + "\n\n" + block : block;
    if (next.length > maxLen && buf) {
      out.push({ ...chunk, body: buf.trim() });
      buf = block;
    } else {
      buf = next;
    }
  }
  if (buf.trim()) out.push({ ...chunk, body: buf.trim() });
  return out.length ? out : [chunk];
}

function postProcessHtml(html) {
  return String(html || "")
    .replace(/<h1\b/gi, "<h3")
    .replace(/<\/h1>/gi, "</h3>")
    .replace(/<h2\b/gi, "<h3")
    .replace(/<\/h2>/gi, "</h3>");
}

function stripRedundantSectionHeading(md, sectionTitle) {
  const lines = md.split(/\r?\n/);
  if (!lines.length) return md;
  const first = lines[0];
  const h2 = first.match(/^##\s+[\dA-Z.]+\s+(.+)$/i);
  if (h2 && h2[1].trim().toLowerCase() === String(sectionTitle || "").trim().toLowerCase()) {
    return lines.slice(1).join("\n").trim();
  }
  return md;
}

export function loadMarkdownChunks() {
  const chunks = [];
  let index = 0;
  for (const { file, prefix } of SOURCE_FILES) {
    const full = path.join(MD_ROOT, file);
    if (!fs.existsSync(full)) {
      console.warn("Markdown source missing:", full);
      continue;
    }
    const content = fs.readFileSync(full, "utf8");
    for (const block of parseSectionBlocks(content, prefix)) {
      for (const chunk of splitBlockIntoChunks(block)) {
        for (const piece of splitBySize(chunk)) {
          const key = `${prefix}:${piece.sectionId}#${index}`;
          chunks.push({
            key,
            order: index++,
            ...piece,
          });
        }
      }
    }
  }
  return chunks;
}

export function chunksToMap(chunks) {
  const map = {};
  for (const c of chunks) map[c.key] = c;
  return map;
}

export function chunksToInlineHtml(chunkMap, keys) {
  if (!keys?.length) return "";
  const parts = [];
  for (const key of keys) {
    const chunk = chunkMap[key];
    if (!chunk?.body) continue;
    let md = stripRedundantSectionHeading(chunk.body, chunk.sectionTitle);
    if (md) parts.push(md);
  }
  if (!parts.length) return "";
  const raw = marked.parse(parts.join("\n\n"), { async: false });
  return postProcessHtml(typeof raw === "string" ? raw : "");
}

/** @deprecated use loadMarkdownChunks */
export function loadMarkdownSections() {
  const chunks = loadMarkdownChunks();
  const sections = {};
  for (const c of chunks) {
    const secKey = `${c.source}:${c.sectionId}`;
    if (!sections[secKey]) sections[secKey] = { source: c.source, body: "" };
    sections[secKey].body += (sections[secKey].body ? "\n\n" : "") + c.body;
  }
  return sections;
}
