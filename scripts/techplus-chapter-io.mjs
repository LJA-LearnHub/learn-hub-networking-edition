/**
 * Split Tech+ Markdown bundle into per-chapter JS files + browser loader.
 * Used by build-techplus-from-markdown.mjs, apply-techplus-html-polish.mjs, patch-techplus-bad-segments.mjs.
 */
import crypto from "crypto";
import fs from "fs";
import path from "path";
import vm from "vm";

/** @param {Record<string, string>} map */
export function splitMapByChapter(map) {
  /** @type {Record<number, Record<string, string>>} */
  const by = {};
  for (const [k, v] of Object.entries(map)) {
    const m = /^tech-sg-(\d{2})-\d{2}$/.exec(k);
    if (!m) continue;
    const ch = parseInt(m[1], 10);
    if (ch < 1 || ch > 12) continue;
    if (!by[ch]) by[ch] = {};
    by[ch][k] = v;
  }
  return by;
}

/**
 * @param {string} learnHubRoot
 * @param {Record<string, string>} map full segment map (study-guide ids only need splitting; other keys ignored)
 * @param {string} banner
 * @returns {Record<number, string>} chapter -> sha256-12 cache key
 */
export function writeChapterJsFiles(learnHubRoot, map, banner) {
  const by = splitMapByChapter(map);
  /** @type {Record<number, string>} */
  const chHashes = {};
  for (let ch = 1; ch <= 12; ch++) {
    const part = by[ch] || {};
    const fn = `learn-hub-techplus-md-ch${String(ch).padStart(2, "0")}.js`;
    const inner = `(function(){var C=${JSON.stringify(part)};Object.assign(window.LEARN_HUB_TECHPLUS_MD||(window.LEARN_HUB_TECHPLUS_MD={}),C);})();`;
    const out = banner + inner + "\n";
    const fp = path.join(learnHubRoot, "assets", fn);
    fs.writeFileSync(fp, out, "utf8");
    chHashes[ch] = crypto.createHash("sha256").update(out, "utf8").digest("hex").slice(0, 12);
  }
  return chHashes;
}

/**
 * @param {string} learnHubRoot
 * @param {Record<number, string>} chHashes
 * @param {string} banner
 */
export function writeTechplusMdLoader(learnHubRoot, chHashes, banner) {
  const hashObj = {};
  for (let ch = 1; ch <= 12; ch++) {
    hashObj[ch] = chHashes[ch] || "";
  }
  const loader =
    banner +
    "window.LEARN_HUB_TECHPLUS_MD = window.LEARN_HUB_TECHPLUS_MD || {};\n" +
    "window.__LH_TECHPLUS_CH_DONE__ = window.__LH_TECHPLUS_CH_DONE__ || {};\n" +
    "window.__LH_TECHPLUS_CH_HASH = " +
    JSON.stringify(hashObj, null, 2) +
    ";\n" +
    "window.loadLearnHubTechplusChapter = function (ch) {\n" +
    "  var n = Math.max(1, Math.min(12, parseInt(ch, 10) || 1));\n" +
    "  if (window.__LH_TECHPLUS_CH_DONE__[n]) return window.__LH_TECHPLUS_CH_DONE__[n];\n" +
    "  var h = window.__LH_TECHPLUS_CH_HASH && window.__LH_TECHPLUS_CH_HASH[n];\n" +
    '  var src = "assets/learn-hub-techplus-md-ch" + String(n).padStart(2, "0") + ".js" + (h ? "?v=" + h : "");\n' +
    "  window.__LH_TECHPLUS_CH_DONE__[n] = new Promise(function (res, rej) {\n" +
    "    var s = document.createElement(\"script\");\n" +
    "    s.src = src;\n" +
    "    s.async = true;\n" +
    "    s.onload = function () {\n" +
    "      res();\n" +
    "    };\n" +
    "    s.onerror = function () {\n" +
    '      rej(new Error("Failed to load " + src));\n' +
    "    };\n" +
    "    document.head.appendChild(s);\n" +
    "  });\n" +
    "  return window.__LH_TECHPLUS_CH_DONE__[n];\n" +
    "};\n";
  const outPath = path.join(learnHubRoot, "assets", "learn-hub-techplus-md.js");
  fs.writeFileSync(outPath, loader, "utf8");
  return outPath;
}

/**
 * Merge all chapter files into one map (for validation / polish).
 * @param {string} learnHubRoot
 * @returns {Record<string, string>}
 */
export function readMergedChapterMaps(learnHubRoot) {
  const merged = {};
  let foundChapterFile = false;
  for (let ch = 1; ch <= 12; ch++) {
    const fn = `learn-hub-techplus-md-ch${String(ch).padStart(2, "0")}.js`;
    const fp = path.join(learnHubRoot, "assets", fn);
    if (!fs.existsSync(fp)) continue;
    foundChapterFile = true;
    const s = fs.readFileSync(fp, "utf8");
    const ctx = { window: { LEARN_HUB_TECHPLUS_MD: {} }, Object };
    vm.runInNewContext(s, ctx, { filename: fn });
    const bag = ctx.window.LEARN_HUB_TECHPLUS_MD;
    if (bag && typeof bag === "object") Object.assign(merged, bag);
  }
  if (foundChapterFile) return merged;

  const monoPath = path.join(learnHubRoot, "assets", "learn-hub-techplus-md.js");
  if (!fs.existsSync(monoPath)) return merged;
  const mono = fs.readFileSync(monoPath, "utf8");
  if (/loadLearnHubTechplusChapter\s*\(/.test(mono) && /__LH_TECHPLUS_CH_HASH/.test(mono)) {
    return merged;
  }
  const ctx = { window: {} };
  vm.runInNewContext(mono, ctx, { filename: "learn-hub-techplus-md.js" });
  const bag = ctx.window.LEARN_HUB_TECHPLUS_MD;
  return bag && typeof bag === "object" ? bag : merged;
}
