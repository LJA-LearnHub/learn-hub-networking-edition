import {
  buildFullLesson,
  buildSummerSupplement,
  section,
  ul,
  ol,
  table,
  PORT_TABLE_COMMON,
  N10,
} from "./network-edition-render.mjs";
import {
  ADVANCED_DOMAIN_TOPICS,
  EXAM_CRAM_LESSONS,
  PBQ_MASTERY_LESSONS,
} from "./network-edition-extra-lessons.mjs";

const DOMAIN_TOPICS = {
  1: [
    "OSI and TCP/IP models",
    "Copper, fiber, and transceivers",
    "Ethernet framing and MTU",
    "IPv4 addressing and CIDR",
    "IPv6 addressing and routing basics",
    "TCP vs UDP behavior",
    "Core ports and protocols",
    "VLANs and trunking",
    "WAN links and overlays",
    "Cloud and virtual networking concepts",
  ],
  2: [
    "Switching architecture and CAM tables",
    "Routing decisions and metrics",
    "Static routes and default routes",
    "Dynamic routing with RIP and OSPF",
    "NAT and PAT implementations",
    "Wireless standards and RF behavior",
    "Wireless security and authentication",
    "VPN technologies and tunnels",
    "Network appliances and service chaining",
    "Datacenter and SDN deployment patterns",
  ],
  3: [
    "Monitoring with SNMP, NetFlow, and syslog",
    "Performance baselines and thresholds",
    "High availability and resiliency",
    "Disaster recovery and business continuity",
    "QoS marking and queuing",
    "Documentation and diagrams",
    "Change management and maintenance windows",
    "Configuration management and backups",
    "Automation, APIs, and orchestration",
    "Capacity planning and lifecycle operations",
  ],
  4: [
    "Segmentation and zero trust principles",
    "ACL logic and rule order",
    "802.1X and NAC posture checks",
    "Firewall types and policy design",
    "IDS/IPS detection strategies",
    "Wireless security modes and attacks",
    "Remote access hardening",
    "Layer 2 security controls",
    "Cryptography and PKI essentials",
    "Security monitoring and incident response",
  ],
  5: [
    "Troubleshooting methodology",
    "Physical layer fault isolation",
    "Switching and VLAN troubleshooting",
    "Routing path troubleshooting",
    "DNS and DHCP issue triage",
    "NAT and ACL troubleshooting",
    "Wireless connectivity troubleshooting",
    "Performance bottleneck analysis",
    "WAN and VPN troubleshooting",
    "Integrated capstone troubleshooting",
  ],
};

const DOMAIN_GLOSSARY = {
  1: [
    ["PDU", "Protocol data unit for a specific layer.", "Match names by layer: frame, packet, segment."],
    ["CIDR", "Classless Inter-Domain Routing prefix notation.", "Understand /24, /27, /30 boundaries quickly."],
    ["MTU", "Maximum transmission unit for a link.", "Mismatch can cause fragmentation or drops."],
    ["VLAN", "Logical Layer 2 broadcast domain.", "Access port carries one VLAN; trunk carries many."],
    ["SLAAC", "IPv6 stateless address autoconfiguration.", "Uses Router Advertisements, not DHCPv6 only."],
    ["Trunk", "Port carrying tagged traffic for multiple VLANs.", "Native VLAN handling is a frequent exam distractor."],
  ],
  2: [
    ["OSPF", "Link-state routing protocol using SPF calculations.", "Know area concepts and cost metric."],
    ["RIP", "Distance-vector protocol using hop count.", "Max 15 hops; slower convergence than OSPF."],
    ["PAT", "Port address translation for many-to-one NAT.", "Tracks sessions by source port tuples."],
    ["WPA3", "Modern wireless security with SAE handshake.", "Stronger offline attack resistance than WPA2-PSK."],
    ["IPsec", "Suite for encrypted IP communication.", "AH authenticates; ESP encrypts and authenticates."],
    ["Controller-based WLAN", "Centralized AP policy management.", "APs may be thin; controller handles control plane."],
  ],
  3: [
    ["RTO", "Recovery time objective.", "How quickly service must be restored."],
    ["RPO", "Recovery point objective.", "How much data loss is acceptable."],
    ["Syslog", "Centralized logging protocol.", "UDP 514 common; severity and facility matter."],
    ["QoS", "Quality of Service prioritization framework.", "Classification, marking, queuing, shaping/policing."],
    ["NetFlow", "Flow records for traffic analysis.", "Great for baselines and anomaly detection."],
    ["Infrastructure as Code", "Managing configs through versioned code.", "Improves repeatability and rollback options."],
  ],
  4: [
    ["ACL", "Access control list filtering statements.", "Top-down first match processing."],
    ["802.1X", "Port-based network access control.", "Supplicant, authenticator, and authentication server roles."],
    ["EAP-TLS", "Certificate-based EAP method.", "Mutual auth with strong enterprise posture."],
    ["WIDS/WIPS", "Wireless intrusion detection/prevention system.", "Detects rogue APs, evil twins, deauth attacks."],
    ["PKI", "Public key infrastructure for trust chains.", "CRL/OCSP validation is testable."],
    ["Microsegmentation", "Fine-grained east-west policy controls.", "Limits lateral movement in breaches."],
  ],
  5: [
    ["Known-good baseline", "Expected healthy performance and behavior.", "Compare current metrics to baseline first."],
    ["Packet capture", "Detailed inspection of packet headers and payload metadata.", "Use filters to avoid noise overload."],
    ["Asymmetric routing", "Forward and return paths differ.", "Can break stateful firewall sessions."],
    ["TTL", "Time to live hop counter in IP headers.", "Traceroute relies on TTL expiration."],
    ["APIPA", "Automatic private IP addressing (169.254.0.0/16).", "Indicates DHCP lease failure."],
    ["Split-horizon DNS", "Different DNS answers by client scope.", "Common in hybrid-cloud troubleshooting."],
  ],
};

const DOMAIN_TOOL_ROWS = {
  1: [
    ["ping", "Basic reachability and latency checks", "L3"],
    ["ipconfig /all", "Inspect host IP config and lease details", "L3"],
    ["tracert", "See hop-by-hop path to destination", "L3"],
    ["Wireshark", "Inspect frame and packet headers", "L2-L4"],
    ["show interface", "Read errors, duplex, speed, MTU", "L1-L2"],
  ],
  2: [
    ["show ip route", "View active routes and next hops", "L3"],
    ["show ip ospf neighbor", "Validate OSPF adjacency state", "L3"],
    ["show vlan brief", "Confirm access VLAN assignments", "L2"],
    ["show mac address-table", "Validate switching CAM learning", "L2"],
    ["show crypto session", "Verify VPN tunnel status", "L3-L4"],
  ],
  3: [
    ["show logging", "Review local and remote event logs", "L2-L7"],
    ["snmpwalk", "Poll management information base data", "L7"],
    ["show policy-map interface", "Validate QoS counters and classes", "L3-L4"],
    ["show inventory", "Track hardware lifecycle and support dates", "Operations"],
    ["curl API endpoint", "Check automation/orchestration health", "L7"],
  ],
  4: [
    ["show access-lists", "Verify ACL hit counts and order", "L3-L4"],
    ["show dot1x all", "Validate 802.1X auth state", "L2"],
    ["wlan controller logs", "Audit auth and roaming failures", "L2-L7"],
    ["openssl s_client", "Test certificate chain and TLS version", "L5-L7"],
    ["show arp inspection", "Inspect Dynamic ARP Inspection behavior", "L2"],
  ],
  5: [
    ["ping -t", "Continuous testing during a change", "L3"],
    ["tracert / pathping", "Correlate path loss and latency", "L3"],
    ["nslookup / dig", "Validate DNS server responses", "L7"],
    ["ipconfig /release /renew", "Force DHCP lease workflows", "L3-L7"],
    ["show interfaces counters", "Identify CRC, drops, and overruns", "L1-L2"],
  ],
};

const DOMAIN_TRAPS = {
  1: [
    "Confusing TCP/IP application layer with OSI Layers 5-7 terminology.",
    "Forgetting that DNS can use UDP and TCP (zone transfer over TCP).",
    "Misreading CIDR masks by counting host bits instead of network bits.",
    "Assuming VLANs are security controls by themselves instead of segmentation tools.",
    "Mixing duplex mismatch symptoms with generic bandwidth saturation signs.",
  ],
  2: [
    "Choosing RIP over OSPF in larger networks despite convergence limits.",
    "Confusing static NAT one-to-one mappings with PAT many-to-one mappings.",
    "Treating WPA2-PSK as equivalent to WPA3-SAE security guarantees.",
    "Forgetting that wireless channel overlap in 2.4 GHz causes co-channel contention.",
    "Assuming VPN encryption automatically enforces user authorization policy.",
  ],
  3: [
    "Interpreting baseline averages without accounting for peak-hour variance.",
    "Mixing RTO (time) and RPO (data loss) in DR planning questions.",
    "Assuming QoS can add bandwidth rather than prioritize existing bandwidth.",
    "Skipping documentation updates after maintenance because the change is small.",
    "Treating automation scripts as stateless without validating rollback behavior.",
  ],
  4: [
    "Writing ACL permit any statements too early and shadowing later rules.",
    "Assuming WPA3 transition mode eliminates all downgrade risks automatically.",
    "Confusing authentication (identity) with authorization (allowed actions).",
    "Believing VLAN hopping is prevented only by changing native VLAN IDs.",
    "Ignoring certificate validity and revocation checks during TLS troubleshooting.",
  ],
  5: [
    "Jumping to fixes before identifying probable cause from evidence.",
    "Stopping after symptom relief without documenting root cause and preventive action.",
    "Assuming DNS is healthy because one record resolves while others fail.",
    "Treating intermittent wireless issues as purely RF when DHCP scopes are exhausted.",
    "Overlooking asymmetric routing when stateful firewalls drop return traffic.",
  ],
};

const WEEK_THEMES = {
  1: ["OSI layering and traffic flow", "Addressing and subnet boundaries", "Ports and protocols memorization", "LAN design and VLAN segmentation", "Week 1 synthesis check"],
  2: ["Cable types and transceiver choices", "Ethernet standards and duplex", "IPv6 operation and transition", "WAN links and cloud edge", "Week 2 timed drill"],
  3: ["Switching behavior and CAM tables", "Routing logic and longest match", "Static route verification", "RIP and OSPF comparisons", "Week 3 implementation check"],
  4: ["NAT, PAT, and private addressing", "Wireless RF fundamentals", "802.11 frame exchange details", "Wireless deployment design", "Week 4 mixed practice"],
  5: ["Monitoring and telemetry sources", "Baseline metrics and alerting", "High availability and redundancy", "QoS shaping and queuing", "Week 5 operations drill"],
  6: ["Change management lifecycle", "Configuration backups and restore", "Documentation quality controls", "Automation and API fundamentals", "Week 6 reliability review"],
  7: ["Security policy architecture", "ACL logic and segmentation", "802.1X and NAC workflows", "Wireless attack detection and mitigation", "Week 7 secure operations check"],
  8: ["Troubleshooting process discipline", "Physical and switching fault checks", "Routing and path troubleshooting", "DNS and DHCP fault isolation", "Week 8 timed troubleshooting set"],
  9: ["NAT and ACL packet flow tracing", "Wireless performance triage", "WAN and VPN diagnostics", "Integrated multi-layer incidents", "Week 9 capstone readiness"],
  10: ["Cross-domain synthesis sprint", "PBQ workflow and command sequencing", "Port/protocol rapid recall", "Scenario triage under time pressure", "Final review confidence builder"],
};

const WORKSHOP_TRACKS = {
  sub: { domain: 1, title: "Subnetting Lab", emphasis: "CIDR math, host ranges, and VLSM validation" },
  osi: { domain: 1, title: "OSI Mapping Lab", emphasis: "Traffic events mapped to exact layers and PDUs" },
  vlan: { domain: 1, title: "VLAN Trunking Lab", emphasis: "802.1Q tagging, native VLAN, and isolation checks" },
  sw: { domain: 2, title: "Switching Implementation Lab", emphasis: "Port config, MAC learning, and STP stability" },
  rt: { domain: 2, title: "Routing Implementation Lab", emphasis: "Static and dynamic route verification" },
  wi: { domain: 2, title: "Wireless Deployment Lab", emphasis: "Channel planning, security mode selection, and roaming" },
  op: { domain: 3, title: "Operations Monitoring Lab", emphasis: "Telemetry baselines, syslog, and QoS counters" },
  dr: { domain: 3, title: "Resiliency and DR Lab", emphasis: "RTO/RPO alignment and failover drills" },
  sec: { domain: 4, title: "Network Security Lab", emphasis: "ACL policy, 802.1X, and wireless hardening" },
  acl: { domain: 4, title: "ACL Packet Flow Lab", emphasis: "Rule order, implicit deny, and hit count validation" },
  tsh: { domain: 5, title: "Troubleshooting Lab", emphasis: "Evidence-first methodology and layered isolation" },
  ex: { domain: 5, title: "Exam Simulation Workshop", emphasis: "PBQ execution speed and distractor elimination" },
  pt: { domain: 2, title: "Packet Tracer Lab", emphasis: "Topology build, addressing, and connectivity validation" },
  sc: { domain: 5, title: "Scenario Troubleshooting Lab", emphasis: "Symptom-to-root-cause under time pressure" },
  cmd: { domain: 5, title: "CLI Reference Lab", emphasis: "Command selection and output interpretation" },
};

function parseDomainLessonId(lessonId) {
  const match = /^network-d([1-5])-t(0[1-9]|1[0-5])$/.exec(lessonId || "");
  if (!match) return null;
  return { domain: Number(match[1]), lesson: Number(match[2]) };
}

function parseExamId(lessonId) {
  const match = /^network-exam-(0[1-9]|[12][0-9]|30)$/.exec(lessonId || "");
  if (!match) return null;
  return { exam: Number(match[1]) };
}

function parsePbqId(lessonId) {
  const match = /^network-pbq-(0[1-9]|1[0-9]|20)$/.exec(lessonId || "");
  if (!match) return null;
  return { pbq: Number(match[1]) };
}

function parseWorkshopId(lessonId) {
  const match = /^network-ws-([a-z]{2,4})-(0[1-9]|1[0-9]|2[0-9])$/.exec(lessonId || "");
  if (!match) return null;
  return { track: match[1], lesson: Number(match[2]) };
}

function parseSummerId(lessonId) {
  const match = /^network-w(0[1-9]|10)-d(0[1-5])$/.exec(lessonId || "");
  if (!match) return null;
  return { week: Number(match[1]), day: Number(match[2]) };
}

function summerDomain(week) {
  if (week <= 2) return 1;
  if (week <= 4) return 2;
  if (week <= 6) return 3;
  if (week === 7) return 4;
  if (week <= 9) return 5;
  return (week % 5) + 1;
}

function weekUsesPortTable(week) {
  return week === 2 || week === 5 || week === 6 || week === 7 || week === 9;
}

function lessonSections(domain, lessonNumber, topic) {
  const domainName = N10[domain].name;
  const lessonTag = `D${domain}.T${String(lessonNumber).padStart(2, "0")}`;
  const signalTable = table(
    ["Control point", "What to verify", "Why N10-009 tests it"],
    [
      ["Topology", "Roles, uplinks, and trust boundaries", "PBQs hide one bad assumption per diagram."],
      ["Protocol state", "Expected timers and exchanges", "Distractors swap normal and failed states."],
      ["Validation", "One output that proves the fix", "Evidence beats intuition."],
    ]
  );

  return [
    {
      h: `N10-009 objective alignment (${lessonTag})`,
      body:
        `<p><strong>${topic}</strong> belongs to Domain ${domain} (${domainName}). The exam checks both facts and judgment: what should happen, what output proves it, and what fix has the lowest risk.</p>` +
        `<p>Use a consistent method: identify layer and dependency, verify with a command, then choose the smallest corrective action.</p>` +
        ul([
          "Baseline first; compare numbers, not guesses.",
          "Map symptoms to a layer before selecting tools.",
          "Prove each answer with command output.",
          "Track DNS, DHCP, VLAN, ACL, and routing dependencies.",
        ]),
    },
    {
      h: "How the technology behaves in real networks",
      body:
        `<p>${topic} is part of a chain. One weak link (addressing, table state, policy, or service) can break user traffic even when nearby checks look healthy.</p>` +
        `<p>Memorize normal indicators first, then compare live output to that baseline. Fix the earliest broken dependency, not the loudest symptom.</p>` +
        signalTable,
    },
    {
      h: "Implementation and verification workflow",
      body:
        `<p>Use this sequence whenever you implement or repair ${topic.toLowerCase()}:</p>` +
        ol([
          "Confirm requirement and success criteria.",
          "Apply minimal scoped change with rollback point.",
          "Validate control-plane state.",
          "Validate data-plane user path.",
          "Capture evidence and update docs.",
        ]) +
        `<p>This flow matches N10-009 scoring: methodical, low risk, and evidence-based.</p>`,
    },
  ];
}

function lessonPractice(topic, domain) {
  const stem = topic.toLowerCase();
  const domainHint = N10[domain].focus;
  return [
    `Which output best proves healthy ${stem} operation?`,
    "A host pings IP but not FQDN; what do you check first?",
    `Which single mismatch most often breaks ${stem}?`,
    "What command best confirms your fix solved root cause?",
    `How does ${stem} interact with segmentation policy?`,
    "Which step prevents trial-and-error troubleshooting?",
    `What baseline metric helps catch ${stem} degradation early?`,
    "Give a five-step triage plan for an intermittent outage.",
    `Domain cue: "${domainHint}". How does it narrow choices?`,
  ];
}

function lessonGlossary(domain, topic) {
  const base = DOMAIN_GLOSSARY[domain].slice(0, 4);
  const topicLower = topic.toLowerCase();
  return [
    ...base,
    ["Control plane", "Logic used to build forwarding state.", `Know whether ${topicLower} depends on neighbor or policy control-plane data.`],
    ["Data plane", "Actual packet/frame forwarding behavior.", "Exam questions often hide data-plane symptoms behind control-plane wording."],
  ];
}

function domainTopic(domain, lessonNumber) {
  if (lessonNumber <= 10) return DOMAIN_TOPICS[domain][lessonNumber - 1];
  return ADVANCED_DOMAIN_TOPICS[domain][lessonNumber - 11];
}

function domainLessonSpec(lessonId, title, unit, domain, lessonNumber) {
  const topic = domainTopic(domain, lessonNumber);
  const displayTitle = title || `${topic} (${lessonId})`;
  const domainWeight = N10[domain].weight;

  const objectives = [
    `Explain ${topic.toLowerCase()} using N10-009 language and scope.`,
    "Identify the most exam-relevant commands and outputs for verification.",
    "Differentiate common distractors from correct root-cause reasoning.",
    "Execute a structured PBQ workflow from evidence to remediation.",
    `Connect this lesson to Domain ${domain} weighting (${domainWeight}).`,
  ];

  const intro =
    `<p><strong>${displayTitle}</strong> trains N10-009 judgment: identify the failed dependency, apply the smallest safe fix, and verify with evidence. ${unit ? `Unit context: <strong>${unit}</strong>. ` : ""}Use the same process each time: baseline, isolate, remediate, validate, document.</p>`;

  const tools = [...DOMAIN_TOOL_ROWS[domain]];

  return {
    domain,
    title: displayTitle,
    intro,
    objectives,
    sections: lessonSections(domain, lessonNumber, topic),
    tools,
    traps: DOMAIN_TRAPS[domain],
    pbq: {
      scenario:
        `A branch office reports intermittent failures tied to ${topic.toLowerCase()}. You are given topology notes, partial configs, and output from core commands. Service must be restored without creating a security regression.`,
      tasks: [
        "Identify the earliest failing dependency from the provided evidence.",
        "Select and justify two verification commands before applying changes.",
        "Apply the smallest corrective configuration that resolves the incident.",
        "Validate user impact, policy compliance, and rollback readiness.",
        "Document root cause, fix, and preventive follow-up action.",
      ],
    },
    glossary: lessonGlossary(domain, topic),
    practice: lessonPractice(topic, domain),
    extra: "",
  };
}

function workshopSpec(lessonId, title, unit, track, lessonNumber) {
  const meta = WORKSHOP_TRACKS[track] || {
    domain: 5,
    title: "Applied Network+ Lab",
    emphasis: "Cross-domain troubleshooting and verification",
  };
  const domain = meta.domain;
  const displayTitle =
    title ||
    `${meta.title} ${String(lessonNumber).padStart(2, "0")} (${lessonId})`;
  const focus = meta.emphasis;

  const objectives = [
    `Build a repeatable lab workflow for ${focus.toLowerCase()}.`,
    "Capture pre-change and post-change evidence for every step.",
    "Practice PBQ pacing: triage, implement, verify, and document.",
    `Map lab results to Domain ${domain} objectives and weighted exam priorities.`,
    "Explain why rejected answer choices are wrong, not just why one is right.",
  ];

  const intro =
    `<p>This workshop is hands-on and PBQ-focused. You will execute, verify, and justify each action. Focus: <strong>${focus}</strong>.</p>` +
    `<p>${unit ? `Unit linkage: <strong>${unit}</strong>. ` : ""}Use a lab note format: hypothesis, command, output, decision, next action.</p>`;

  const sections = [
    {
      h: "Lab topology and constraints",
      body:
        "<p>Document roles, addressing, and trust boundaries before changes. Confirm management path and rollback options first.</p>" +
        ul([
          "Record gateway and DNS dependencies before any edits.",
          "Identify one rollback point after each config chunk.",
          "Use least-privilege controls while testing connectivity.",
          "Time-box each step to maintain PBQ pacing.",
        ]),
    },
    {
      h: "Execution checklist",
      body:
        "<p>Follow this order to reduce side effects and match CompTIA scoring behavior:</p>" +
        ol([
          "Verify baseline behavior with two independent tests.",
          "Apply focused configuration aligned to the stated objective.",
          "Validate control-plane status (adjacency, auth, table state).",
          "Validate data-plane flow with representative user traffic.",
          "Capture evidence and update diagrams or runbooks.",
        ]),
    },
    {
      h: "Verification evidence matrix",
      body:
        table(
          ["Evidence type", "Example artifact", "Exam value"],
          [
            ["Configuration", "Targeted running-config excerpt", "Shows intent and exact change scope."],
            ["State output", "Neighbor/session/table status", "Proves control-plane health."],
            ["Traffic test", "Ping, trace, DNS lookup, app check", "Proves user-visible recovery."],
            ["Security check", "ACL hit counters or auth logs", "Confirms no policy regression."],
          ]
        ) +
        "<p>PBQs usually require one configuration action and one validation action. Include both.</p>",
    },
    {
      h: "Post-lab reflection for exam transfer",
      body:
        "<p>Summarize root cause in one sentence and list evidence that proved recovery. Turn it into two flashcards: symptom -> first command, output -> likely fix.</p>",
    },
  ];

  const tools = [
    ...DOMAIN_TOOL_ROWS[domain],
    ["show tech | redirect log", "Bundle diagnostics for post-lab review", "Cross-layer"],
  ];

  const traps = [
    "Skipping baseline capture and guessing from memory.",
    "Applying broad ACL or route changes without scoping the blast radius.",
    "Declaring success after one ping instead of validating full service chain.",
    "Ignoring authentication and authorization checks during remediation.",
    "Forgetting to document rollback-ready final state.",
  ];

  const glossary = [
    ["Runbook", "Step-by-step operational procedure.", "PBQ speed improves with standard runbooks."],
    ["Blast radius", "Scope of systems potentially affected by a change.", "Choose least disruptive fix first."],
    ["Validation", "Evidence that confirms expected result.", "Exam favors proof over assumptions."],
    ["Rollback", "Process to return to known-good state.", "Required for safe implementation items."],
    ["Dependency chain", "Ordered services needed for successful communication.", "Find earliest failing dependency."],
    ["False positive", "Signal that appears to indicate failure but does not.", "Cross-check with second evidence source."],
  ];

  const practice = [
    `Which first command best validates your baseline in this ${meta.title.toLowerCase()} scenario?`,
    "A change fixed one host but broke another VLAN/user group. What is your next evidence-driven action?",
    "How do you prove control-plane health separately from end-user application success?",
    "Which log or counter confirms whether security policy blocked the intended flow?",
    "When should you choose rollback over incremental fixes in timed exam conditions?",
    "What artifact best demonstrates completion quality to a reviewer or PBQ rubric?",
    "How would you adjust this lab for a high-latency WAN branch environment?",
    "Which distractor answer sounds plausible but ignores dependency order?",
  ];

  return {
    domain,
    title: displayTitle,
    intro,
    objectives,
    sections,
    tools,
    traps,
    pbq: {
      scenario: `You are assigned a live-fire lab where a partially completed configuration causes unstable behavior. Restore reliable service while preserving security controls and documenting each step.`,
      tasks: [
        "Validate baseline and identify the first incorrect assumption.",
        "Perform targeted config corrections tied to the objective.",
        "Verify both network reachability and policy compliance.",
        "Produce a concise handoff note with evidence and rollback detail.",
      ],
    },
    glossary,
    practice,
    extra: section(
      "Lab scoring rubric",
      "<p>Full credit requires correct fix, command-level validation, and safe operational handling (rollback and documentation).</p>"
    ),
  };
}

function summerTopic(week, day) {
  const weekTopics = WEEK_THEMES[week] || WEEK_THEMES[10];
  return weekTopics[day - 1] || weekTopics[0];
}

function summerDeepDiveHtml(week, day, title, topic, domain, compact) {
  const domainName = N10[domain].name;
  return (
    `<p><strong>${title || topic}</strong> reinforces Week ${week} Day ${day} with N10-009 command-level reasoning.</p>` +
    `<p>Week ${week} maps to Domain ${domain} (${domainName}). Use this flow: expected behavior -> observed behavior -> confirming command -> minimal fix.</p>` +
    (compact ? "" : `<p>Focus: <strong>${topic}</strong>. Check dependency order: addressing, forwarding state, policy, then service.</p>`) +
    ul([
      "Start with baseline outputs before changes; compare after each action.",
      "Prefer narrow, reversible changes over broad configuration rewrites.",
      "Validate control plane and data plane separately.",
      ...(compact ? [] : ["Document one prevention step for recurrence."]),
    ])
  );
}

function summerMemorizeHtml(topic, domain, compact) {
  return (
    "<p>Memorize these:</p>" +
    ul([
      `Domain ${domain} objective cues tied to ${topic.toLowerCase()}.`,
      "Default protocol behaviors and key exceptions (for example DNS UDP/TCP).",
      "One command that proves normal state and one that proves failure.",
      "Common distractors that sound right but skip process.",
      ...(compact ? [] : ["Security and operations side effects of a quick fix."]),
      "A 30-second PBQ checklist: baseline, isolate, change, verify, document.",
      ...(compact ? [] : ["Port/protocol pairings and service dependencies relevant to the scenario."]),
    ])
  );
}

function summerPractice(topic, week) {
  return [
    `What evidence-first workflow fits ${topic.toLowerCase()}?`,
    "Which dependency do you verify before changes?",
    "Which output shows root cause, not side effect?",
    "How do you verify no policy regression after the fix?",
    "Which choice is a distractor because it skips baseline?",
    `Week ${week}: connect this topic to two other domains.`,
  ];
}

function examCramSpec(lessonId, title, unit, examNumber, domain) {
  const displayTitle = title || `Exam cram ${examNumber}`;
  const domainName = N10[domain].name;
  return {
    domain,
    title: displayTitle,
    intro:
      `<p><strong>${displayTitle}</strong> is a high-intensity review built for the N10-009 clock. You will drill facts, elimination strategies, and command recall tied to <strong>Domain ${domain}: ${domainName}</strong>.</p>` +
      `<p>Work in 25-minute blocks: read objectives, close notes, answer practice questions, then review every miss with the “why not” for each distractor.</p>`,
    objectives: [
      "Recall high-yield facts without reference material.",
      "Eliminate two wrong answers before choosing the best remaining option.",
      "Map each question to an OSI layer and dependency chain.",
      "Complete timed drills at exam pacing (about 1.5 minutes per MCQ).",
      `Anchor misses to Domain ${domain} review lessons in the sidebar.`,
    ],
    sections: [
      {
        h: "What N10-009 tests in this cram block",
        body:
          `<p>This session compresses objectives that appear repeatedly on the live exam: terminology precision, protocol behavior, and “first best action” troubleshooting judgment.</p>` +
          ul([
            "Know definitions well enough to spot swapped terms (frame vs packet, NAT vs PAT).",
            "Recognize when a question is really about security, operations, or troubleshooting sub-skills.",
            "Prefer evidence-based answers over “reboot everything” options.",
            "Watch for absolute words: always, never, only — often false in real networks.",
          ]),
      },
      {
        h: "Rapid recall matrix",
        body:
          table(
            ["If the question mentions…", "Think first about…", "Verify with…"],
            [
              ["No IP address", "DHCP or static misconfig", "ipconfig /all, show dhcp binding"],
              ["IP works, name fails", "DNS or split-horizon DNS", "nslookup, dig"],
              ["One VLAN only", "Trunk, access port, or SVI", "show vlan brief, show interfaces trunk"],
              ["Intermittent CRC errors", "Cable, duplex, or bad SFP", "show interfaces counters"],
              ["Slow WAN only", "QoS, congestion, or MTU mismatch", "ping size sweep, interface queues"],
            ]
          ),
      },
      {
        h: "Timed drill protocol",
        body:
          ol([
            "Set a 20-question timer for 30 minutes (faster than live pacing to build buffer).",
            "Mark questions where you guessed — do not review until the block ends.",
            "For each miss, write: symptom, layer, command, fix.",
            "Re-drill missed categories the next day before moving on.",
          ]),
      },
      {
        h: "Night-before rules",
        body:
          ul([
            "Sleep beats cramming — memory consolidation matters for protocol details.",
            "Pack two valid IDs; know your appointment window and Pearson VUE rules.",
            "Review port list and subnetting cheat sheet once, not all night.",
            "Plan hydration and break strategy for a 90-question adaptive session.",
          ]),
      },
    ],
    tools: DOMAIN_TOOL_ROWS[domain],
    traps: DOMAIN_TRAPS[domain],
    pbq: {
      scenario:
        "You have 18 minutes left on the exam and face a multi-part PBQ: partial topology, ACL snippet, and host symptoms. Prioritize without panicking.",
      tasks: [
        "List the three most likely root causes from evidence (not guesses).",
        "Pick the single change with smallest blast radius.",
        "Name two commands that prove success or failure.",
        "State one security check after the fix.",
      ],
    },
    glossary: lessonGlossary(domain, displayTitle),
    practice: [
      ...lessonPractice(displayTitle, domain),
      "Which answer choice is wrong because it skips baseline verification?",
      "Which distractor confuses authentication with authorization?",
    ],
    extra: section("Ports refresher (high-yield)", PORT_TABLE_COMMON),
  };
}

function pbqMasterySpec(lessonId, title, unit, pbqNumber, domain) {
  const displayTitle = title || `PBQ mastery ${pbqNumber}`;
  return {
    domain,
    title: displayTitle,
    intro:
      `<p><strong>${displayTitle}</strong> simulates a performance-based question: partial config, topology diagram, and a clear success criterion. Practice typing commands, reading output, and documenting evidence as you would on exam day.</p>` +
      `<p>PBQs reward method: baseline → isolate → minimal fix → verify → document. Never skip verification.</p>`,
    objectives: [
      "Execute configuration and verification steps in correct order.",
      "Interpret command output to confirm control-plane and data-plane health.",
      "Apply least-disruptive changes with rollback noted.",
      "Finish within 20 minutes including verification.",
      "Explain why alternative fixes are weaker choices.",
    ],
    sections: [
      {
        h: "PBQ environment setup",
        body:
          ul([
            "Read the entire task list before touching the keyboard.",
            "Note addressing, VLAN IDs, interface names, and security constraints.",
            "Open a notepad for commands used and outputs observed.",
            "Identify whether the grader checks config, connectivity, or both.",
          ]),
      },
      {
        h: "Step-by-step execution template",
        body:
          ol([
            "Capture baseline: ping/traceroute/DNS from affected host.",
            "Inspect relevant tables: MAC, ARP, routing, ACL hits.",
            "Apply one logical change aligned to the task wording.",
            "Re-test the exact success criteria stated in the prompt.",
            "Save running-config or document if the platform requires it.",
          ]),
      },
      {
        h: "Grading rubric (self-check)",
        body:
          table(
            ["Criterion", "Full credit", "Partial / zero"],
            [
              ["Correct fix", "Meets all stated requirements", "Works partially or breaks another service"],
              ["Verification", "Shows command output proving success", "Assumes success without proof"],
              ["Safety", "No unnecessary exposure or ACL holes", "Overly broad permit or disabled security"],
              ["Documentation", "Clear note of change and rollback", "No record of what was changed"],
            ]
          ),
      },
      {
        h: "Common PBQ failure modes",
        body:
          ul([
            "Fixing DNS when the issue is default gateway.",
            "Creating VLANs but forgetting trunk allow lists.",
            "ACL applied inbound vs outbound on wrong interface.",
            "NAT missing overload for many internal hosts.",
            "Wireless SSID correct but security type mismatch.",
          ]),
      },
    ],
    tools: [
      ...DOMAIN_TOOL_ROWS[domain],
      ["show running-config", "Confirm intended config landed", "All layers"],
      ["copy run start", "Persist changes when required", "Operations"],
    ],
    traps: [
      "Changing multiple variables at once — cannot tell what fixed it.",
      "Using close enough addressing that still fails ACL or reverse path.",
      "Forgetting to save config on platforms that separate running and startup.",
      "Verifying only from the router, not from the user subnet.",
    ],
    pbq: {
      scenario: `Live PBQ #${pbqNumber}: ${displayTitle}. You are given a broken scenario and must restore stated functionality while keeping security policy intact.`,
      tasks: [
        "Document baseline failure symptoms in one sentence.",
        "List commands run in order with expected vs actual output.",
        "Apply the fix and capture post-change verification.",
        "Write rollback steps if the change must be undone.",
      ],
    },
    glossary: [
      ["PBQ", "Performance-based question requiring hands-on steps.", "Time-boxed; partial credit is rare."],
      ["Running config", "Active configuration in memory.", "May differ from startup until saved."],
      ["SVI", "Switched virtual interface for inter-VLAN routing.", "Needs matching VLAN and up/up state."],
      ["Implicit deny", "Default deny at end of ACL.", "Explicit permit required for traffic."],
      ["Inside/global", "NAT terms for address translation roles.", "PAT uses inside local to inside global."],
      ["Evidence chain", "Linked outputs proving diagnosis.", "Exam graders look for this sequence."],
    ],
    practice: [
      "What is the first command you run before any configuration change?",
      "How do you prove the default gateway is reachable from the host?",
      "Which show command confirms an ACL is hit on the intended interface?",
      "What output proves OSPF adjacency is full, not two-way?",
      "How do you verify DHCP lease without guessing?",
      "When do you use extended ping vs standard ping?",
      "What indicates a duplex mismatch on an interface?",
      "How do you rollback quickly if connectivity worsens?",
    ],
    extra:
      section(
        "Packet Tracer / lab transfer",
        "<p>Rebuild this PBQ in Packet Tracer or your course lab: break it on purpose, then fix using only the template above until you can complete under 20 minutes twice in a row.</p>"
      ),
  };
}

export function getFullLessonBody(lessonId, title, unit) {
  const standard = parseDomainLessonId(lessonId);
  if (standard) {
    const spec = domainLessonSpec(lessonId, title, unit, standard.domain, standard.lesson);
    return buildFullLesson(spec);
  }

  const workshop = parseWorkshopId(lessonId);
  if (workshop) {
    const spec = workshopSpec(lessonId, title, unit, workshop.track, workshop.lesson);
    return buildFullLesson(spec);
  }

  const exam = parseExamId(lessonId);
  if (exam) {
    const meta = EXAM_CRAM_LESSONS.find((e) => e.id === lessonId);
    const domain = meta?.domain ?? 5;
    const spec = examCramSpec(lessonId, title, unit, exam.exam, domain);
    return buildFullLesson(spec);
  }

  const pbq = parsePbqId(lessonId);
  if (pbq) {
    const meta = PBQ_MASTERY_LESSONS.find((p) => p.id === lessonId);
    const domain = meta?.domain ?? 5;
    const spec = pbqMasterySpec(lessonId, title, unit, pbq.pbq, domain);
    return buildFullLesson(spec);
  }

  return "";
}

export function getSummerSupplement(lessonId, title) {
  const parsed = parseSummerId(lessonId);
  if (!parsed) return "";

  const { week, day } = parsed;
  const domain = summerDomain(week);
  const topic = summerTopic(week, day);
  const resolvedTitle = title || `Week ${week} Day ${day}: ${topic}`;
  const usesPorts = weekUsesPortTable(week);

  return buildSummerSupplement({
    title: resolvedTitle,
    domain,
    focus: summerMemorizeHtml(topic, domain, usesPorts),
    deepDive: summerDeepDiveHtml(week, day, resolvedTitle, topic, domain, usesPorts),
    ports: usesPorts,
    traps: [
      "Fixing symptoms before verifying dependency order.",
      "Treating one ping as full service recovery.",
      "Ignoring policy side effects after remediation.",
      "Confusing symptom indicators with root cause.",
    ],
    pbq: {
      scenario:
        `During summer review Week ${week}, a maintenance change causes a multi-layer outage. Restore service and keep controls intact.`,
      tasks: [
        "Identify the earliest failing dependency.",
        "Run two commands that confirm your hypothesis.",
        "Apply the minimum corrective action.",
        "Verify service and no policy regression.",
      ],
    },
    practice: summerPractice(topic, week),
  });
}
