/**
 * Network Edition build — expands all lessons for CompTIA Network+ N10-009.
 * Run from repo root: node scripts/build-network-edition.mjs
 */
import fs from "fs";
import path from "path";
import vm from "vm";
import { fileURLToPath } from "url";
import { getFullLessonBody } from "./network-edition-lesson-content.mjs";
import {
  ADVANCED_DOMAIN_TITLES,
  EXAM_CRAM_LESSONS,
  PBQ_MASTERY_LESSONS,
  EXTRA_WORKSHOP_LESSONS,
} from "./network-edition-extra-lessons.mjs";
import { examBanner } from "./network-edition-render.mjs";
import {
  loadMarkdownChunks,
  chunksToMap,
  chunksToInlineHtml,
} from "./network-markdown-ingest.mjs";
import {
  getMarkdownKeysForLesson,
  getChunkAssignmentStats,
  resetAssignmentCache,
} from "./network-markdown-lesson-map.mjs";
import { HTN_CHAPTERS, HTN_UNIT, buildLessonToChaptersMap } from "./network-howtonetwork-chapters.mjs";
import {
  loadHowToNetworkChapters,
  howToNetworkSupplementBlock,
  howToNetworkIndexIntro,
  getHowToNetworkRoot,
} from "./network-howtonetwork-ingest.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const assets = path.join(root, "assets");
const SOURCE_ROOT = path.resolve(root, "..", "learning-hub-main(2)", "update_v1.0.7");
const SOURCE_MD = path.join(SOURCE_ROOT, "assets", "learn-hub-network-md.js");
const SOURCE_QUESTIONS = path.join(SOURCE_ROOT, "assets", "learn-hub-network-questions.js");

const STUDY_WORKFLOW =
  '<h3>Study workflow for Network+</h3>' +
  "<p>1) Read once for story · 2) Re-read and highlight terms · 3) Draw a topology · " +
  "4) Answer practice questions · 5) Complete the matching sidebar quiz · " +
  "6) Explain the topic aloud in 60 seconds.</p>";

function loadWindowScript(filePath, exportName) {
  const ctx = { window: {} };
  vm.createContext(ctx);
  vm.runInContext(fs.readFileSync(filePath, "utf8"), ctx);
  return ctx.window[exportName];
}

function proseWrap(inner, badge, title) {
  return (
    '<hr class="teach-hr lh-md-start"/>' +
    '<div class="lh-tg-root tech-prose lh-tg-markdown lh-chapter-markdown">' +
    '<article class="lesson-prose lh-lesson-body">' +
    (badge
      ? '<header class="lesson-inline-header"><span class="lesson-badge">' +
        badge +
        '</span><h2 class="lesson-title">' +
        title +
        "</h2></header>"
      : "") +
    inner +
    "</article></div>"
  );
}

function stripOldSupplements(html) {
  return String(html || "")
    .replace(/<section class="lh-network-expansion"[\s\S]*?<\/section>/gi, "")
    .replace(/<section class="lh-n10-supplement"[\s\S]*?<\/section>/gi, "")
    .replace(/<section class="lh-network-md-deep-dive"[\s\S]*?<\/section>/gi, "")
    .replace(/<section class="lh-htn-supplement[\s\S]*?<\/section>/gi, "")
    .replace(/<hr class="lesson-hr lh-htn-hr"\/?>/gi, "");
}

function appendHowToNetworkSupplements(inner, lessonId, htnByLessonId, lessonToChapters) {
  const chapters = lessonToChapters.get(lessonId);
  if (!chapters?.length) return inner;
  let out = inner;
  for (const ch of chapters) {
    const loaded = htnByLessonId[ch.lessonId];
    if (!loaded?.html) continue;
    out += howToNetworkSupplementBlock(loaded);
  }
  return out;
}

function inferDomain(lessonId) {
  const dm = lessonId.match(/network-d([1-5])/);
  if (dm) return +dm[1];
  const em = lessonId.match(/network-exam-(\d+)/);
  if (em) {
    const n = +em[1];
    if (n <= 6) return 1;
    if (n <= 13) return 2;
    if (n <= 18) return 3;
    if (n <= 23) return 4;
    return 5;
  }
  if (/network-ws-sec|network-ws-acl/.test(lessonId)) return 4;
  if (/network-ws-tsh|network-pbq/.test(lessonId)) return 5;
  if (/network-ws-op/.test(lessonId)) return 3;
  if (/network-ws-rt|network-ws-sw|network-ws-vlan|network-ws-wi|network-ws-pt/.test(lessonId)) return 2;
  const w = lessonId.match(/network-w(\d{2})/);
  if (w) {
    const week = +w[1];
    if (week <= 2) return 1;
    if (week <= 5) return 2;
    if (week === 6) return 1;
    if (week === 7) return 4;
    if (week === 8) return 2;
    if (week === 9) return 5;
    return 1;
  }
  return 1;
}

function isSummerLesson(id) {
  return /^network-w\d{2}-d\d{2}$/.test(id);
}

function loadSummerBaseHtml() {
  const out = {};
  for (let week = 1; week <= 10; week++) {
    const file = path.join(
      root,
      "network-space",
      "lessons",
      "week-" + String(week).padStart(2, "0") + ".js"
    );
    if (!fs.existsSync(file)) continue;
    const varName = "NETPLUS_LESSONS_W" + week;
    const ctx = { window: {} };
    vm.createContext(ctx);
    vm.runInContext(fs.readFileSync(file, "utf8"), ctx);
    const lessons = ctx.window[varName];
    if (!lessons) continue;
    for (const [day, data] of Object.entries(lessons)) {
      const id =
        "network-w" + String(week).padStart(2, "0") + "-d" + String(day).padStart(2, "0");
      if (data?.html) out[id] = stripOldSupplements(data.html);
    }
  }
  return out;
}

function extractSummerArticleBody(html) {
  const article = String(html || "").match(/<article[^>]*>([\s\S]*)<\/article>/i);
  if (!article) return "";
  return article[1]
    .replace(/<header class="lesson-inline-header">[\s\S]*?<\/header>/i, "")
    .trim();
}

function markdownBodyForLesson(lessonId, chunkMap) {
  const keys = getMarkdownKeysForLesson(lessonId);
  return chunksToInlineHtml(chunkMap, keys);
}

function buildLessonInner(lessonId, title, unit, chunkMap, summerBase) {
  const mdHtml = markdownBodyForLesson(lessonId, chunkMap);

  if (isSummerLesson(lessonId)) {
    const summerHtml = summerBase?.[lessonId] ? extractSummerArticleBody(summerBase[lessonId]) : "";
    if (summerHtml && mdHtml) {
      return summerHtml + '\n<hr class="lesson-hr"/>\n' + mdHtml;
    }
    if (summerHtml) return summerHtml;
    if (mdHtml) return mdHtml;
  } else if (mdHtml) {
    return examBanner(inferDomain(lessonId), title) + mdHtml + STUDY_WORKFLOW;
  }

  const generated = getFullLessonBody(lessonId, title, unit);
  if (generated) return generated;
  return (
    '<p class="msg info">Lesson content is loading. Re-run <code>npm run build:network-edition</code> if this persists.</p>'
  );
}

function writeCourses(courses) {
  fs.writeFileSync(
    path.join(assets, "learn-hub-courses.js"),
    `window.LEARN_HUB_COURSES = ${JSON.stringify(courses)};\n`,
    "utf8"
  );
}

function writeNetworkMd(md) {
  const lines = [
    "/* Network Edition — N10-009 expanded curriculum (generated) */",
    "(function () {",
    "  window.LEARN_HUB_NETWORK_MD = window.LEARN_HUB_NETWORK_MD || {};",
    "  var C = " + JSON.stringify(md) + ";",
    "  for (var k in C) {",
    "    if (Object.prototype.hasOwnProperty.call(C, k)) {",
    "      window.LEARN_HUB_NETWORK_MD[k] = C[k];",
    "    }",
    "  }",
    "})();",
    "",
  ];
  fs.writeFileSync(path.join(assets, "learn-hub-network-md.js"), lines.join("\n"), "utf8");
  const lens = Object.values(md).map((h) => h.length);
  const avg = Math.round(lens.reduce((a, b) => a + b, 0) / lens.length);
  console.log(
    "Wrote learn-hub-network-md.js —",
    Object.keys(md).length,
    "lessons · avg",
    avg,
    "chars · min",
    Math.min(...lens),
    "· max",
    Math.max(...lens)
  );
}

const DOMAIN_UNITS = [
  { unit: "Domain 1 — Networking Concepts", prefix: "network-d1" },
  { unit: "Domain 2 — Network Implementation", prefix: "network-d2" },
  { unit: "Domain 3 — Network Operations", prefix: "network-d3" },
  { unit: "Domain 4 — Network Security", prefix: "network-d4" },
  { unit: "Domain 5 — Network Troubleshooting", prefix: "network-d5" },
];

const DOMAIN_TITLES = {
  "network-d1": [
    "OSI & TCP/IP models compared",
    "Ethernet, frames, and collisions",
    "IPv4 addressing, CIDR, and VLSM",
    "IPv6 addressing and transition",
    "Ports, sockets, and well-known services",
    "DHCP, DNS, and NTP fundamentals",
    "NAT, PAT, and private addressing",
    "VLANs, trunking, and 802.1Q",
    "WAN technologies and leased lines",
    "Cloud connectivity models (IaaS/PaaS/SaaS)",
    ...ADVANCED_DOMAIN_TITLES["network-d1"],
  ],
  "network-d2": [
    "Copper vs fiber media and connectors",
    "Switching, MAC tables, and STP/RSTP",
    "Routing concepts and static routes",
    "Dynamic routing overview (OSPF, BGP)",
    "Wireless standards, channels, and security",
    "SDN, controllers, and overlay networks",
    "Load balancers and high availability",
    "VPN types: site-to-site and remote access",
    "Network appliances: firewall, IDS/IPS, proxy",
    "Documentation: diagrams and IP plans",
    ...ADVANCED_DOMAIN_TITLES["network-d2"],
  ],
  "network-d3": [
    "SNMP, Syslog, and NetFlow basics",
    "Monitoring, baselines, and thresholds",
    "Change management and configuration backups",
    "High availability: VRRP/HSRP concepts",
    "QoS: marking, queuing, and shaping",
    "Bandwidth management and caching",
    "Remote access: SSH, out-of-band management",
    "Disaster recovery and cold/warm/hot sites",
    "Policies, procedures, and SLAs",
    "Automation with APIs and templates",
    ...ADVANCED_DOMAIN_TITLES["network-d3"],
  ],
  "network-d4": [
    "Defense in depth and segmentation",
    "ACLs, firewall rules, and zones",
    "802.1X, NAC, and port security",
    "Wireless security: WPA3, rogue APs",
    "VPN encryption and tunnel protocols",
    "Hardening switches, routers, and APs",
    "Common attacks: MITM, DoS, VLAN hopping",
    "Physical security and cable plant",
    "Certificates, PKI, and TLS on the wire",
    "Incident response for network events",
    ...ADVANCED_DOMAIN_TITLES["network-d4"],
  ],
  "network-d5": [
    "Structured troubleshooting methodology",
    "Cable and physical layer faults",
    "Switching loops and spanning tree issues",
    "Routing and default gateway problems",
    "DNS and name resolution failures",
    "DHCP scope and lease issues",
    "Wireless interference and roaming",
    "Performance: latency, jitter, packet loss",
    "Security-related connectivity blocks",
    "Capturing and reading packet traces",
    ...ADVANCED_DOMAIN_TITLES["network-d5"],
  ],
};

function summerBadge(lessonId, title) {
  const m = lessonId.match(/network-w(\d{2})-d(\d{2})/);
  if (!m) return title;
  return "Week " + (+m[1]) + " · Day " + (+m[2]);
}

function addLesson(lessons, md, entry, chunkMap, summerBase, htnByLessonId, lessonToChapters) {
  const { unit, id, title } = entry;
  lessons.push({ unit, id, kind: "learn", title, narrative: "" });
  const badge = isSummerLesson(id) ? summerBadge(id, title) : unit;
  let inner = buildLessonInner(id, title, unit, chunkMap, summerBase);
  inner = appendHowToNetworkSupplements(inner, id, htnByLessonId, lessonToChapters);
  md[id] = proseWrap(inner, badge, title);
}

function buildHowToNetworkLessons(htnByLessonId) {
  const lessons = [];
  const md = {};

  lessons.push({
    unit: HTN_UNIT,
    id: "network-htn-00",
    kind: "learn",
    title: "Guide overview & offline index",
    narrative: "",
  });
  md["network-htn-00"] = proseWrap(
    howToNetworkIndexIntro(),
    HTN_UNIT,
    "Guide overview & offline index"
  );

  for (const ch of HTN_CHAPTERS) {
    const loaded = htnByLessonId[ch.lessonId];
    lessons.push({
      unit: HTN_UNIT,
      id: ch.lessonId,
      kind: "learn",
      title: ch.title,
      narrative: "",
    });
    md[ch.lessonId] = proseWrap(
      (loaded?.html || "") +
        `<p class="lh-htn-footer-links"><a href="../howtonetwork/${encodeURI(ch.file).replace(/#/g, "%23")}" target="_blank" rel="noopener">Open original saved page</a> · <a href="../howtonetwork/index.html" target="_blank" rel="noopener">Guide index</a></p>`,
      HTN_UNIT,
      ch.title
    );
  }

  return { lessons, md };
}

function buildExtendedLessons(chunkMap, summerBase, htnByLessonId, lessonToChapters) {
  const lessons = [];
  const md = {};

  for (const block of DOMAIN_UNITS) {
    const titles = DOMAIN_TITLES[block.prefix];
    for (let i = 0; i < 15; i++) {
      const num = String(i + 1).padStart(2, "0");
      addLesson(
        lessons,
        md,
        {
          unit: block.unit,
          id: block.prefix + "-t" + num,
          title: titles[i],
        },
        chunkMap,
        summerBase,
        htnByLessonId,
        lessonToChapters
      );
    }
  }

  const seenWorkshop = new Set();
  for (const L of EXTRA_WORKSHOP_LESSONS) {
    if (seenWorkshop.has(L.id)) continue;
    seenWorkshop.add(L.id);
    addLesson(lessons, md, L, chunkMap, summerBase, htnByLessonId, lessonToChapters);
  }

  for (const L of EXAM_CRAM_LESSONS) {
    addLesson(lessons, md, L, chunkMap, summerBase, htnByLessonId, lessonToChapters);
  }

  for (const L of PBQ_MASTERY_LESSONS) {
    addLesson(lessons, md, L, chunkMap, summerBase, htnByLessonId, lessonToChapters);
  }

  return { lessons, md };
}

function main() {
  resetAssignmentCache();

  const courses = loadWindowScript(path.join(assets, "learn-hub-courses.js"), "LEARN_HUB_COURSES");
  const net = courses.find((c) => c.id === "networkplus");
  if (!net) throw new Error("networkplus course missing");

  const summerBase = loadSummerBaseHtml();
  console.log("Summer base lessons loaded:", Object.keys(summerBase).length);

  const chunks = loadMarkdownChunks();
  const chunkMap = chunksToMap(chunks);
  const stats = getChunkAssignmentStats();
  console.log(
    "Markdown chunks:",
    stats.chunks,
    "· lessons with content:",
    stats.lessonsWithMd,
    "· avg chunks/lesson:",
    stats.avgChunksPerLesson
  );

  const htnRoot = getHowToNetworkRoot();
  if (!fs.existsSync(htnRoot)) {
    console.warn("howtonetwork folder not found at", htnRoot, "— HTN lessons will show placeholders.");
  } else {
    console.log("HowToNetwork source:", htnRoot);
  }
  const htnByLessonId = loadHowToNetworkChapters();
  const lessonToChapters = buildLessonToChaptersMap();
  console.log(
    "HowToNetwork chapters loaded:",
    Object.keys(htnByLessonId).length,
    "· curriculum lessons enriched:",
    lessonToChapters.size
  );

  const { lessons: extraLessons, md: mergedMd } = buildExtendedLessons(
    chunkMap,
    summerBase,
    htnByLessonId,
    lessonToChapters
  );

  const summerLessons = net.lessons.filter((L) => /^network-w\d{2}-d\d{2}$/.test(L.id));
  for (const L of summerLessons) {
    const badge = summerBadge(L.id, L.title || L.id);
    let inner = buildLessonInner(L.id, L.title || L.id, L.unit || "", chunkMap, summerBase);
    inner = appendHowToNetworkSupplements(inner, L.id, htnByLessonId, lessonToChapters);
    mergedMd[L.id] = proseWrap(inner, badge, L.title || L.id);
  }

  const { lessons: htnLessons, md: htnMd } = buildHowToNetworkLessons(htnByLessonId);
  Object.assign(mergedMd, htnMd);

  net.lessons = [...summerLessons, ...extraLessons, ...htnLessons];
  writeCourses([{ ...net, name: "Network+", id: "networkplus", ws: "tech" }]);
  writeNetworkMd(mergedMd);

  const quizzesPath = path.join(assets, "learn-hub-network-questions.js");
  const quizSource = fs.existsSync(SOURCE_QUESTIONS) ? SOURCE_QUESTIONS : quizzesPath;
  let quizzes = loadWindowScript(quizSource, "LEARN_HUB_NETWORK_QUIZZES");
  if (fs.existsSync(quizzesPath)) {
    const cur = loadWindowScript(quizzesPath, "LEARN_HUB_NETWORK_QUIZZES");
    if (Array.isArray(cur.sets) && cur.sets.length > (quizzes.sets?.length || 0)) quizzes = cur;
  }
  fs.writeFileSync(
    quizzesPath,
    "/* Network Edition — N10-009 question bank */\nwindow.LEARN_HUB_NETWORK_QUIZZES = " +
      JSON.stringify(quizzes) +
      ";\n",
    "utf8"
  );
  console.log("Reading lessons:", net.lessons.length);
  console.log("(App adds", quizzes.sets?.length, "quiz sets ·", quizzes.totalParsed, "MCQs to sidebar)");
}

main();
