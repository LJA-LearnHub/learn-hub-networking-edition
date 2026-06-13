/** Standard footer blocks appended to every generated lesson */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
let _cache;

export function loadSummerData() {
  if (_cache) return _cache;
  const raw = fs.readFileSync(path.join(__dirname, "..", "lesson-data.js"), "utf8");
  const body = raw.replace(/^[\s\S]*?NETPLUS_SUMMER\s*=\s*/, "").replace(/;\s*$/, "");
  _cache = Function('"use strict"; return (' + body + ")")();
  return _cache;
}

function esc(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

const PRACTICE_BY_WEEK = {
  1: [
    "Which OSI layer is responsible for framing and MAC addresses?",
    "What PDU is used at the transport layer?",
    "Name one difference between the Internet and an intranet.",
    "Which topology has a single point of failure at the center device?",
    "What tool in Packet Tracer shows whether a ping succeeded in simulation mode?",
  ],
  2: [
    "Map each TCP/IP layer to the corresponding OSI layer(s).",
    "Convert 11000000.10101000.00000001.00000001 to dotted decimal.",
    "Which private IPv4 range uses 10.0.0.0/8?",
    "For 192.168.1.0/26, what is the broadcast address?",
    "Why is a default gateway required for hosts on different subnets?",
  ],
  3: [
    "Which device separates collision domains? Broadcast domains?",
    "What command displays the MAC address table on a Cisco switch?",
    "How does a router differ from a switch when forwarding traffic?",
    "Compare stateful vs stateless firewall behavior.",
    "What is the purpose of a default route (0.0.0.0/0)?",
  ],
  4: [
    "What problem do VLANs solve at Layer 2?",
    "Which VLAN is the default VLAN on Cisco switches?",
    "What does an 802.1Q tag add to an Ethernet frame?",
    "Why is STP required on redundant switched topologies?",
    "Describe router-on-a-stick in one sentence.",
  ],
  5: [
    "When is static routing preferred over dynamic routing?",
    "What is the maximum hop count for RIP before a route is unreachable?",
    "What is OSPF area 0 called, and why is it special?",
    "Compare distance-vector and link-state protocols.",
    "Name two common WAN connection types used by enterprises.",
  ],
  6: [
    "What record type maps a hostname to IPv4?",
    "List the four steps of the DHCP process (DORA).",
    "How does PAT differ from static NAT?",
    "Which port does SNMP use by default?",
    "What does an IP helper-address enable on a router?",
  ],
  7: [
    "Which malware type self-replicates without user action?",
    "What do the letters in CIA triad stand for?",
    "Does a standard ACL filter inbound or outbound by default on an interface?",
    "What switch feature limits MAC addresses per port?",
    "Give one example of multi-factor authentication.",
  ],
  8: [
    "Which Wi-Fi generation is marketed as Wi-Fi 6?",
    "Why should WPA2-PSK not be used for enterprise wireless?",
    "What does SSID identify on a wireless network?",
    "Compare IaaS, PaaS, and SaaS with one example each.",
    "Name one factor that weakens wireless signal strength.",
  ],
  9: [
    "List the seven steps of the CompTIA troubleshooting methodology.",
    "A host cannot ping its default gateway. Which layer do you suspect first?",
    "What does tracert reveal that ping does not?",
    "Which tool captures packets for protocol analysis?",
    "When would you use divide-and-conquer troubleshooting?",
  ],
  10: [
    "Which exam domains cover VLANs and switching?",
    "Write the network and broadcast address for 172.16.0.0/20 from memory.",
    "Name three ports and their protocols from the reference table.",
    "What should a capstone network diagram include at minimum?",
    "After the practice exam, how will you prioritize weak domains?",
  ],
};

export function buildLessonFooter(lesson) {
  const data = loadSummerData();
  const week = data.weeks[lesson.week - 1];
  if (!week) return "";
  const dayInfo = week.days.find((d) => d.day === lesson.day) || { content: "" };
  const questions = PRACTICE_BY_WEEK[lesson.week] || PRACTICE_BY_WEEK[1];
  const qHtml = questions.map((q) => `<li>${esc(q)}</li>`).join("");

  return `
<hr class="lesson-hr"/>
<section class="lesson-footer">
<h3>Today&apos;s focus</h3>
<p>${esc(dayInfo.content)}</p>
<h3>Learning activities</h3>
<ul>
<li>Skim the lesson once, then re-read while annotating terms you cannot define from memory.</li>
<li>Draw a small diagram linking <strong>${esc(lesson.title)}</strong> to the correct OSI layer(s) and devices.</li>
<li>Answer the practice questions below closed-book, then check your notes.</li>
<li>Spend 15–20 minutes in Packet Tracer applying one idea from this lesson.</li>
</ul>
<h3>Practice questions</h3>
<ol class="lesson-practice-list">${qHtml}</ol>
<h3>Homework</h3>
<ul>
<li>Write a half-page summary of today&apos;s lesson in your own words (no copy-paste).</li>
<li>Add three flashcards: term on front, definition and example on back.</li>
<li>Connect one concept from today to this week&apos;s project or lab deliverable.</li>
</ul>
<h3>This week&apos;s assessments</h3>
<p><strong>Mini quiz:</strong> ${esc(week.assessments.quiz)}</p>
<p><strong>Project:</strong> ${esc(week.assessments.project)}</p>
<p><strong>Packet Tracer lab:</strong> ${esc(week.assessments.ptLab || "See capstone checklist for Week 10.")}</p>
</section>`;
}

export function extractReferenceAppendix(md) {
  const start = md.indexOf("# Key Port Numbers");
  const end = md.indexOf("# Conclusion");
  if (start < 0) return "";
  return md.slice(start, end > start ? end : undefined).trim();
}
