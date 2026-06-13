/** HTML builders for Network+ (N10-009) lesson content */

export const N10 = {
  1: { name: "Networking Concepts", weight: "23%", focus: "Models, ports, addressing, VLANs, WAN/cloud basics" },
  2: { name: "Network Implementation", weight: "20%", focus: "Media, switching, routing, wireless, VPN, appliances" },
  3: { name: "Network Operations", weight: "19%", focus: "Monitoring, HA, QoS, docs, DR, automation" },
  4: { name: "Network Security", weight: "14%", focus: "Segmentation, ACLs, 802.1X, wireless security, attacks" },
  5: { name: "Network Troubleshooting", weight: "24%", focus: "Methodology, tools, layer-by-layer fault isolation" },
};

export const PORT_TABLE_COMMON = `
<table class="data-table"><thead><tr><th>Port</th><th>Proto</th><th>Service</th><th>Exam note</th></tr></thead><tbody>
<tr><td>20/21</td><td>TCP</td><td>FTP (data/control)</td><td>Active vs passive FTP</td></tr>
<tr><td>22</td><td>TCP</td><td>SSH</td><td>Encrypted remote admin</td></tr>
<tr><td>23</td><td>TCP</td><td>Telnet</td><td>Cleartext — avoid in production</td></tr>
<tr><td>25</td><td>TCP</td><td>SMTP</td><td>Outbound mail</td></tr>
<tr><td>53</td><td>UDP/TCP</td><td>DNS</td><td>TCP for zone transfers</td></tr>
<tr><td>67/68</td><td>UDP</td><td>DHCP</td><td>Server/client</td></tr>
<tr><td>69</td><td>UDP</td><td>TFTP</td><td>No auth — firmware loads</td></tr>
<tr><td>80</td><td>TCP</td><td>HTTP</td><td>Often redirected to 443</td></tr>
<tr><td>110</td><td>TCP</td><td>POP3</td><td>Download mail</td></tr>
<tr><td>143</td><td>TCP</td><td>IMAP</td><td>Sync mail</td></tr>
<tr><td>161/162</td><td>UDP</td><td>SNMP</td><td>Trap on 162</td></tr>
<tr><td>389</td><td>TCP/UDP</td><td>LDAP</td><td>Directory services</td></tr>
<tr><td>443</td><td>TCP</td><td>HTTPS</td><td>TLS-wrapped HTTP</td></tr>
<tr><td>3389</td><td>TCP</td><td>RDP</td><td>Remote desktop</td></tr>
</tbody></table>`;

export function examBanner(domainNum, title) {
  const d = N10[domainNum] || N10[1];
  return (
    '<div class="n10-exam-banner msg info">' +
    "<p><strong>CompTIA Network+ N10-009</strong> · Domain " +
    domainNum +
    ": " +
    d.name +
    " (~" +
    d.weight +
    " of exam)</p>" +
    "<p>Lesson focus: <strong>" +
    title +
    "</strong>. " +
    d.focus +
    "</p></div>"
  );
}

export function section(h, body) {
  return "<h3>" + h + "</h3>\n" + body + "\n";
}

export function ul(items) {
  return "<ul>\n" + items.map((i) => "<li>" + i + "</li>").join("\n") + "\n</ul>\n";
}

export function ol(items) {
  return "<ol>\n" + items.map((i) => "<li>" + i + "</li>").join("\n") + "\n</ol>\n";
}

export function table(headers, rows) {
  return (
    '<table class="data-table"><thead><tr>' +
    headers.map((h) => "<th>" + h + "</th>").join("") +
    "</tr></thead><tbody>" +
    rows.map((r) => "<tr>" + r.map((c) => "<td>" + c + "</td>").join("") + "</tr>").join("") +
    "</tbody></table>\n"
  );
}

export function examTrapsBlock(traps) {
  return (
    section(
      "Common exam traps",
      "<p>CompTIA often tests near-miss distractors. Watch for these:</p>" + ul(traps)
    )
  );
}

export function pbqBlock(scenario, tasks) {
  return (
    section(
      "Performance-based (PBQ) style scenario",
      "<p><strong>Scenario:</strong> " +
        scenario +
        "</p><p><strong>Tasks you should practice:</strong></p>" +
        ol(tasks)
    )
  );
}

export function glossaryBlock(terms) {
  return (
    section(
      "Key terms glossary",
      table(
        ["Term", "Definition", "Remember for the exam"],
        terms.map((t) => [t[0], t[1], t[2] || "—"])
      )
    )
  );
}

export function practiceBlock(questions) {
  return section("Practice questions (closed-book)", ol(questions));
}

export function toolsBlock(tools) {
  return section(
    "Tools & commands",
    table(
      ["Tool / command", "Purpose", "Typical layer"],
      tools
    )
  );
}

export function buildFullLesson(spec) {
  const {
    domain,
    title,
    intro,
    objectives,
    sections = [],
    tools = [],
    traps = [],
    pbq,
    practice = [],
    glossary = [],
    extra = "",
  } = spec;
  let html = examBanner(domain, title);
  html += section(
    "Learning objectives",
    "<p>After this lesson you should be able to:</p>" + ol(objectives)
  );
  html += section("Introduction", intro);
  for (const s of sections) {
    html += section(s.h, s.body);
  }
  if (tools.length) html += toolsBlock(tools);
  if (traps.length) html += examTrapsBlock(traps);
  if (pbq) html += pbqBlock(pbq.scenario, pbq.tasks);
  if (glossary.length) html += glossaryBlock(glossary);
  if (practice.length) html += practiceBlock(practice);
  if (extra) html += extra;
  html += section(
    "Study workflow for Network+",
    "<p>1) Read once for story · 2) Re-read and highlight terms · 3) Draw a topology · 4) Answer practice questions · 5) Complete the matching sidebar quiz · 6) Explain the topic aloud in 60 seconds.</p>"
  );
  return html;
}

export function buildSummerSupplement(spec) {
  const { title, domain, focus, deepDive, traps, pbq, practice, ports = false } = spec;
  let html =
    '<section class="lh-n10-supplement">' +
    examBanner(domain, title) +
    section("N10-009 deep dive", deepDive) +
    section("What to memorize", focus);
  if (ports) html += section("Ports & protocols refresher", PORT_TABLE_COMMON);
  if (traps.length) html += examTrapsBlock(traps);
  if (pbq) html += pbqBlock(pbq.scenario, pbq.tasks);
  if (practice.length) html += practiceBlock(practice);
  html += section(
    "Next step",
    "<p>Complete the <strong>N10-009 practice questions</strong> quiz block in the sidebar for this unit, then review any missed objectives in the domain deep-dive lessons.</p>"
  );
  html += "</section>";
  return html;
}
