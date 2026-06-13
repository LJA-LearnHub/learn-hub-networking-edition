/** Supplemental HTML appended when baseline lesson body is under minChars */
export function getExpansion(week, day, title) {
  const key = `w${week}d${day}`;
  return EXPANSIONS[key] || genericExpansion(week, day, title);
}

function genericExpansion(week, day, title) {
  return `
<hr class="lesson-hr"/>
<div class="lesson-expand">
<h3>Study deeper</h3>
<p>Use this section with the reading above. For <strong>Week ${week}, Day ${day}</strong> (${title}), focus on how the topic appears on the Network+ N10-009 exam: know definitions, compare similar terms, and tie concepts to a troubleshooting or design scenario.</p>
<h4>Exam-style checkpoints</h4>
<ul>
<li>State the concept in one sentence without notes.</li>
<li>Give one real-world example (home, school, or business).</li>
<li>Name the tool, device, or protocol involved.</li>
<li>Describe what breaks if this is misconfigured.</li>
</ul>
<h4>Packet Tracer tie-in</h4>
<p>Open your lab file for this week and locate where this topic applies—routing table, VLAN, ACL, DHCP pool, or wireless settings. Change one setting, test with <code>ping</code> or <code>show</code> commands, then undo the change to confirm you understand cause and effect.</p>
</div>`;
}

const EXPANSIONS = {
  w3d1: expandBlock("Collision vs broadcast domains", `
<p>A <strong>collision domain</strong> is a segment where a collision could occur on shared media. Classic hubs put every port in one domain. Modern switches isolate each port (full duplex), so collisions are rare on switched Ethernet.</p>
<p>A <strong>broadcast domain</strong> is the set of devices that receive a broadcast frame (destination FF:FF:FF:FF:FF:FF). One VLAN = one broadcast domain unless routing is used between VLANs.</p>
<div class="callout-inline tip"><strong>Exam tip:</strong> "Which device reduces collision domains?" → Switch. "Which device separates broadcast domains?" → Router or VLAN.</div>
`),
  w3d2: expandBlock("Routing decisions", `
<p>Routers never forward by MAC alone across subnets—they decapsulate to Layer 3, match destination IP to routing table, then re-encapsulate on the outbound interface.</p>
<p><strong>Longest prefix match</strong> chooses the most specific route when multiple entries exist. <strong>Administrative distance</strong> breaks ties between protocol sources (connected beats static beats OSPF, etc.).</p>
`),
  w3d3: expandBlock("Perimeter security", `
<p><strong>Stateful firewalls</strong> track connection state so return traffic for permitted outbound sessions is allowed automatically. <strong>Stateless</strong> filters each packet in isolation.</p>
<p><strong>NGFW</strong> adds application awareness, IPS integration, and identity context beyond port/protocol filtering.</p>
`),
  w5d2: expandBlock("RIP fundamentals", `
<p>RIPv1 is classful and does not send subnet mask in updates. RIPv2 is classless and multicasts updates to 224.0.0.9. Maximum metric is 15 hops; 16 is unreachable.</p>
<p><strong>Split horizon</strong> stops a router from advertising a route back out the interface it learned it on. <strong>Route poisoning</strong> advertises failed routes with metric 16 to speed convergence.</p>
`),
  w5d3: expandBlock("OSPF areas", `
<p>OSPF routers in the same area share a link-state database. Area 0 (backbone) must connect to all other areas. <strong>DR/BDR</strong> on multi-access segments reduce LSA flooding.</p>
<p>Verify neighbors: <code>show ip ospf neighbor</code>. Verify routes: <code>show ip route ospf</code>.</p>
`),
  w6d1: expandBlock("DNS hierarchy", `
<p>Query flow: stub resolver → recursive resolver (ISP or 8.8.8.8) → root → TLD (.com) → authoritative for host record.</p>
<p>Record types: <strong>A</strong> (IPv4), <strong>AAAA</strong> (IPv6), <strong>CNAME</strong> (alias), <strong>MX</strong> (mail), <strong>NS</strong> (delegation), <strong>PTR</strong> (reverse).</p>
`),
  w6d2: expandBlock("DHCP DORA", `
<ol>
<li><strong>Discover</strong> — client broadcast DHCPDISCOVER</li>
<li><strong>Offer</strong> — server proposes IP, mask, gateway, DNS, lease time</li>
<li><strong>Request</strong> — client requests offered address</li>
<li><strong>Acknowledge</strong> — server confirms; client configures interface</li>
</ol>
<p><strong>DHCP relay (ip helper-address)</strong> forwards requests from remote subnets to a central DHCP server.</p>
`),
  w7d1: expandBlock("Threat landscape", `
<p><strong>Social engineering</strong> targets people: phishing, vishing, tailgating. Technical controls alone cannot fix policy gaps—training and reporting matter.</p>
<p><strong>DoS/DDoS</strong> floods bandwidth or resources. <strong>MITM</strong> intercepts sessions on untrusted networks. <strong>Spoofing</strong> falsifies IP or MAC identity.</p>
`),
  w8d1: expandBlock("Wi-Fi generations", `
<table class="data-table compact"><thead><tr><th>Standard</th><th>Marketing</th><th>Band(s)</th></tr></thead>
<tbody>
<tr><td>802.11n</td><td>Wi-Fi 4</td><td>2.4 / 5 GHz</td></tr>
<tr><td>802.11ac</td><td>Wi-Fi 5</td><td>5 GHz focus</td></tr>
<tr><td>802.11ax</td><td>Wi-Fi 6</td><td>2.4 / 5 / 6 GHz</td></tr>
</tbody></table>
<p>Channel overlap on 2.4 GHz (only 1, 6, 11 non-overlapping in US) causes co-channel interference.</p>
`),
  w9d1: expandBlock("Seven-step methodology", `
<ol>
<li>Identify the problem</li>
<li>Establish a theory of probable cause</li>
<li>Test the theory</li>
<li>Establish a plan of action</li>
<li>Implement the solution</li>
<li>Verify full system functionality</li>
<li>Document findings, actions, and outcomes</li>
</ol>
<p><strong>Divide-and-conquer:</strong> ping gateway, then DNS, then remote IP to isolate layer quickly.</p>
`),
  w10d1: expandBlock("Domain 1 & 2 review", `
<p>Flash review: OSI layer ↔ device ↔ PDU. Subnetting: write out network, broadcast, first/last host for /26 and /27 without a calculator on scratch paper.</p>
<p>Implementation: VLAN = L2 segmentation; inter-VLAN routing = router or L3 switch; trunk = 802.1Q tags.</p>
`),
};

function expandBlock(heading, inner) {
  return `
<hr class="lesson-hr"/>
<div class="lesson-expand">
<h3>Expanded notes: ${heading}</h3>
${inner}
<h4>Quick review questions</h4>
<ol>
<li>Define the main term for this lesson in your own words.</li>
<li>Which layer or device is involved?</li>
<li>What command or tool would you use to verify it?</li>
<li>What is one misconfiguration symptom?</li>
</ol>
</div>`;
}
