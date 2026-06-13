/**
 * Injects Security+–style depth (terms, narratives, exam framing) into each
 * auto-built security lesson. Consumed by build-security-from-markdown.mjs.
 */
function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Simple deterministic 0..n-1 from string */
function hashSeed(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

const TERMS = {
  foundations: [
    ["Security control categories", "Technical (firewalls, encryption), administrative (policies, training), and physical (badges, locks)—exam items often ask which category fits a scenario."],
    ["Compensating control", "Alternative control that meets intent when primary control cannot be implemented—must provide equivalent or greater assurance with documentation."],
    ["Quantitative vs qualitative risk", "Qualitative uses scales (high/medium/low); quantitative uses dollar or probability estimates—both need consistent assumptions and reviewer judgment."],
    ["Asset", "Anything of value to the organization—data, systems, people, reputation, or services—that security controls protect."],
    ["Threat", "Any circumstance or actor with the potential to cause harm by exploiting a vulnerability (malware, insider, natural disaster)."],
    ["Vulnerability", "A weakness in design, implementation, configuration, or process that could be exploited to violate a security policy."],
    ["Exploit", "A technique or code that takes advantage of a vulnerability to achieve an attacker goal (exfiltration, persistence, disruption)."],
    ["Control", "Administrative, technical, or physical safeguards that reduce likelihood or impact of a security event (prevent, detect, correct)."],
    ["Risk", "The intersection of threat, vulnerability, and impact—often assessed qualitatively (high/medium/low) or with scoring frameworks."],
    ["Residual risk", "Risk remaining after controls are applied; organizations accept, transfer, mitigate, or avoid it explicitly."],
    ["Due care", "The effort a prudent person would take to meet a duty; in security, reasonable steps to protect assets and stakeholders."],
    ["Due diligence", "Investigation and verification before decisions (vendor risk, M&A) to ensure claims about controls are credible."],
    ["Policy vs standard vs procedure", "Policy states intent; standards define mandatory requirements; procedures are step-by-step how-to for operators."],
  ],
  cia: [
    ["Confidentiality", "Assures that information is not disclosed to unauthorized subjects—encryption, access control, and data minimization support it."],
    ["Integrity", "Assures accuracy and trustworthiness—hashing, signatures, change control, and backups protect against unauthorized modification."],
    ["Availability", "Assures timely and reliable access—redundancy, patching, DDoS defenses, and DR planning keep services usable for authorized users."],
    ["Authenticity", "Verifies that users, devices, or data are genuine—cryptographic identity, attestation, and strong issuance processes matter."],
    ["Non-repudiation", "Prevents a party from credibly denying an action—digital signatures, tamper-evident logs, and time-stamping support it."],
    ["Privacy", "Protection of personal information and individual rights—overlaps with security but adds legal/regulatory obligations (GDPR-style)."],
    ["PII", "Personally identifiable information—names, government IDs, biometrics, account numbers; triggers handling, retention, and breach rules."],
    ["Data classification", "Labels (public, internal, confidential, restricted) drive storage, encryption, sharing, and disposal requirements."],
  ],
  identity: [
    ["Authentication", "Proving identity—something you know, have, or are; combine factors for MFA; never equate login with authorization alone."],
    ["Authorization", "What an authenticated subject is allowed to do—RBAC/ABAC, scopes, and server-side checks enforce least privilege."],
    ["MFA", "Multi-factor authentication—requires two or more independent factors; push fatigue and MFA phishing are real bypass paths."],
    ["FIDO2 / WebAuthn", "Phishing-resistant possession factors using asymmetric crypto and origin binding; preferred where supported."],
    ["Password policy", "Modern guidance favors long passphrases, breach-banned lists, and vaults over rotation-for-its-own-sake complexity theater."],
    ["Session management", "Server-side session IDs or tokens must rotate on privilege change, bind to channel, and expire predictably."],
    ["SSO", "Single sign-on federates trust to an IdP—misconfigured SAML/OIDC trusts are high-impact; validate metadata and signing keys."],
    ["Kerberos (concept)", "Ticket-based enterprise auth—TGT vs service tickets; golden/silver ticket classes of abuse appear in advanced IR."],
  ],
  network: [
    ["NAT (concept)", "Rewrites addresses/ports for traversal—security relevance includes logging visibility, port forwarding risks, and split tunnel implications for inspection."],
    ["DDoS", "Distributed denial of service—volumetric, protocol, or application-layer floods; mitigations include scrubbing, anycast, rate limits, and architecture elasticity."],
    ["Defense in depth", "Layered controls so one failure does not equal total failure—network, host, app, identity, and monitoring each contribute."],
    ["Firewall", "Enforces allow/deny rules on traffic—stateful inspection tracks sessions; default-deny with explicit permits is the secure baseline."],
    ["TLS", "Encrypts data in motion and authenticates endpoints when certificates and hostnames are validated; termination points affect trust boundaries."],
    ["DNS", "Name resolution is a trust anchor—DNSSEC, cache poisoning, and malicious resolutions are classic abuse paths; log resolver anomalies."],
    ["VPN", "Creates an encrypted tunnel; split tunneling can bypass corporate inspection; VPN is not anonymity or a substitute for app-layer auth."],
    ["SPF / DKIM / DMARC", "Email authenticity stack—SPF authorizes senders, DKIM signs messages, DMARC aligns policies and reporting for abuse handling."],
    ["Zero Trust (headline)", "Assume breach; verify explicitly per request using identity, device posture, and least privilege—not “trust the LAN.”"],
    ["Network segmentation", "VLANs, micro-segmentation, and east-west controls limit lateral movement after an initial foothold."],
  ],
  crypto: [
    ["Perfect forward secrecy (PFS)", "Ephemeral key exchange means past session keys are not compromised if long-term keys leak later—TLS cipher suites can offer this property."],
    ["Certificate pinning (concept)", "Client remembers expected server key material—reduces MITM from rogue CAs but complicates rotation; mostly seen in mobile/API hardening patterns."],
    ["Symmetric encryption", "Same key encrypts and decrypts—fast for bulk data (AES-GCM); key distribution is the hard problem."],
    ["Asymmetric encryption", "Key pairs for key agreement/signing—RSA/ECC; hybrid TLS uses asymmetric to establish symmetric session keys."],
    ["Hashing", "One-way fingerprint for integrity verification—SHA-256 family; not secrecy; used with HMAC for keyed integrity."],
    ["Digital signature", "Proves origin and integrity using private key to sign and public key to verify—non-repudiation when keys are well governed."],
    ["PKI", "Public Key Infrastructure—CAs, RAs, CRL/OCSP, and certificate lifecycle; mis-issuance or weak validation breaks trust chains."],
    ["Encoding (e.g., Base64)", "Transforms representation without cryptographic protection—do not confuse with encryption or integrity."],
    ["Key management", "Generation, storage, rotation, and destruction—HSM/KMS patterns reduce exposure compared to software-only secrets."],
    ["AEAD", "Authenticated encryption with associated data—confidentiality plus integrity in one primitive (e.g., AES-GCM) when used correctly."],
  ],
  appsec: [
    ["Input validation vs output encoding", "Validation rejects bad input early; encoding neutralizes dangerous characters in the right output context—both are needed across HTML, SQL, OS, and LDAP channels."],
    ["Security misconfiguration", "Default creds, debug features on in prod, verbose errors, open directory listings—hardening baselines and drift detection reduce this class."],
    ["OWASP Top 10", "High-prevalence web risks—broken access control and crypto failures often dominate; study each category with one workplace example."],
    ["Injection", "Untrusted input becomes part of a command or query—parameterized queries, input validation, and context escaping are core defenses."],
    ["XSS", "Cross-site scripting injects script in a victim context—CSP, output encoding, HttpOnly cookies, and DOM hygiene reduce blast radius."],
    ["CSRF", "Cross-site request forgery rides ambient auth—anti-CSRF tokens, SameSite cookies, and re-auth for sensitive actions help."],
    ["IDOR", "Insecure direct object reference—missing object-level authorization; test horizontal/vertical access with different accounts."],
    ["Security headers", "HSTS, CSP, X-Frame-Options/Frame-ancestors, Referrer-Policy, Permissions-Policy—reduce browser-driven attack surface."],
    ["Secure SDLC", "Requirements, threat modeling, secure design, code review, SAST/DAST, dependency scanning, and hardened deployment pipelines."],
    ["DevSecOps", "Embed security gates in CI/CD with fast feedback—policy-as-code, secret scanning, and SBOMs support supply-chain resilience."],
  ],
  vuln_ir: [
    ["CVE", "Common Vulnerabilities and Exposures identifier for a specific flaw—pairs with CVSS severity and vendor advisories for prioritization."],
    ["CVSS", "Common Vulnerability Scoring System—base metrics describe technical severity; environmental and temporal modifiers refine priority."],
    ["CWE", "Common Weakness Enumeration—taxonomy of software weakness types that help root-cause fixes beyond one CVE instance."],
    ["Vulnerability management", "Discover, prioritize, remediate, verify, and report—SLAs differ by exposure, exploitability, and asset criticality."],
    ["SIEM", "Security information and event management—centralize logs, parse fields, correlate alerts; tuning reduces false positives and fatigue."],
    ["MITRE ATT&CK", "Tactics (why) and techniques (how) adversaries operate—use for detection engineering, gap analysis, and purple team scenarios."],
    ["IR phases", "Prepare, detect, analyze, contain, eradicate, recover, and lessons learned—legal hold and evidence integrity matter throughout."],
    ["Chain of custody", "Documented handling of evidence from collection through presentation—hashing, write blockers, and access logs support admissibility."],
  ],
  cloud: [
    ["Shared responsibility model", "Cloud provider secures the platform; customer secures configuration, identities, data, and app code in their scope."],
    ["IAM least privilege", "Grant minimum API/console rights; prefer roles over long-lived keys; audit risky admin-equivalent paths regularly."],
    ["Logging & monitoring", "CloudTrail-style management events differ from data-plane logs—enable central export, immutability, and alerting."],
    ["Misconfiguration", "Top cloud incident driver—public buckets, open security groups, permissive trust policies; IaC scanning catches drift early."],
    ["Encryption at rest / in transit", "KMS/HSM-backed keys, envelope encryption, and TLS everywhere for administrative and user paths."],
    ["Container security", "Image provenance, non-root users, read-only roots, seccomp/AppArmor, and admission control for risky capabilities."],
    ["Serverless blast radius", "One broad execution role affects every invocation—scope IAM per function and watch environment variable leaks."],
    ["CASB / SaaS governance", "Visibility and policy for sanctioned vs shadow SaaS—OAuth consent attacks and guest sharing are common gaps."],
  ],
  governance: [
    ["GRC", "Governance, risk, and compliance—align security decisions with law, policy, and business appetite; audits test design and operation."],
    ["BCP / DR", "Business continuity and disaster recovery—RTO/RPO drive architecture; test restores, not just backups on paper."],
    ["Third-party risk", "Vendor access expands attack surface—DPAs, SOC reports, and continuous monitoring for critical suppliers."],
    ["Security awareness", "Training plus culture—measure reporting rates, not shame metrics; phishing simulations should reinforce reporting."],
    ["Insider threat", "Malicious or negligent insiders—monitor with proportionality, separation of duties, and HR/legal partnership."],
    ["Data retention", "Shorter retention reduces exposure and cost—legal holds override routine deletion when investigations require preservation."],
    ["Supply chain security", "SBOM, provenance signing (SLSA-style thinking), and dependency pinning reduce “update from upstream” surprises."],
    ["Metrics that matter", "Mean time to detect/remediate with quality, coverage of critical assets, and control effectiveness—not vanity ticket counts."],
  ],
  advanced: [
    ["Threat intelligence lifecycle", "Planning, collection, processing, analysis, dissemination, feedback—intel must change detections or posture or it is shelf-ware."],
    ["Attack surface", "The sum of exposure—every service, API, integration, and human workflow that can be reached by a threat; reduction beats perfect monitoring alone."],
    ["Zero Trust architecture", "Identity-centric access with continuous verification—policy enforcement points for users, devices, and workloads."],
    ["PQC", "Post-quantum cryptography migration—hybrid schemes and crypto-agility for long-lived secrets exposed to harvest-now/decrypt-later risk."],
    ["Confidential computing", "Use of hardware enclaves/TEEs to reduce exposure to privileged operators—threat model still required."],
    ["Threat modeling (STRIDE)", "Spoofing, tampering, repudiation, information disclosure, denial of service, elevation of privilege—drive controls early."],
    ["Purple teaming", "Collaborative attack/defense exercises to validate detections without surprise production harm—scope and safety first."],
    ["Purple / red / blue", "Red emulates adversaries, blue defends, purple bridges—authorization and logging are mandatory for any simulation."],
    ["Forensics basics", "Volatile vs non-volatile collection, order of volatility, hashing, and legal escalation paths before deep technical work."],
    ["Business continuity testing", "Tabletops and technical failover drills reveal gaps in comms, dependencies, and vendor SLAs."],
  ],
};

const NARRATIVE_BLOCKS = [
  "For the Security+ mindset, translate every control into <strong>who</strong> it protects, <strong>what</strong> asset is at risk, and <strong>how</strong> you would detect failure. Interview and exam items often reward practical prioritization over buzzwords—choose the mitigation that reduces realistic loss first.",
  "Controls fail in three predictable ways: <strong>misconfiguration</strong>, <strong>missing coverage</strong> (gaps between tools), and <strong>human process</strong> breakdown (exceptions, shared accounts, emergency access). When you read a scenario, ask which failure mode is most plausible before picking an answer.",
  "Defense in depth is not “more products,” it is <strong>independent mechanisms</strong>—if one layer is bypassed, another still limits movement, slows the adversary, or preserves evidence. Be ready to explain why network controls alone cannot compensate for missing app-layer authorization.",
  "Security operations value <strong>repeatable evidence</strong>: timestamps, authoritative configuration sources, and tamper-aware logs beat heroic memory after an incident. Many exam questions hinge on whether an action preserves integrity and accountability rather than whether it feels fast.",
  "Risk decisions are economic: organizations <strong>accept</strong>, <strong>mitigate</strong>, <strong>transfer</strong> (insurance, outsourcing with contracts), or <strong>avoid</strong> (stop the activity). Controls change likelihood or impact; residual risk should be explicit, not invisible.",
  "Identity is the new perimeter: credentials, tokens, and sessions are stolen more often than novel zero-days are burned. Expect Security+ items on MFA bypass awareness, phishing-resistant factors, and why <strong>authorization</strong> must be enforced server-side.",
  "Cryptography questions reward vocabulary precision: hashing vs encryption vs encoding; symmetric vs asymmetric roles in TLS; what signatures prove; and why key management is usually harder than picking an algorithm. If an answer sounds magical, it is probably wrong.",
  "Application security scenarios often test whether you know <strong>where</strong> enforcement belongs—browser controls supplement but do not replace server-side checks. SameSite cookies, CSP, and HttpOnly mitigate classes of issues; they do not fix broken object-level authorization.",
  "Vulnerability management is a lifecycle: scanners find candidates, analysts prioritize with exploitability and business context, owners remediate, and verification closes the loop. “Patch everything immediately” is rarely operational; <strong>risk-based SLAs</strong> are the adult answer.",
  "Incident response questions probe containment vs evidence preservation tension, legal escalation, and communication discipline. The exam rewards knowing when to isolate systems, when to involve counsel, and why mass log deletion is catastrophic.",
  "Cloud items assume you can articulate <strong>shared responsibility</strong>: what the provider patches vs what the customer must configure (IAM, encryption, network exposure). Misconfiguration beats novel cloud exploits in real incidents and on the exam.",
  "Governance and awareness questions tie policy to behavior: acceptable use, clean desk, travel security, and vendor due diligence. Pick answers that reduce <strong>realistic</strong> human failure modes, not answers that maximize surveillance without process support.",
  "Advanced topics still return to fundamentals: least privilege, segmentation, logging, and tested recovery. When you see Zero Trust or PQC buzzwords, map them back to concrete controls and threat models rather than treating them as magic shields.",
  "Logging questions often test whether you understand <strong>what to log</strong> (who, what, when, where, outcome), <strong>time sync</strong> for correlation, and <strong>tamper resistance</strong> for evidentiary value—not whether you can collect infinite bytes.",
  "Access control stems frequently mix <strong>role</strong> vs <strong>attribute</strong> vs <strong>rule</strong> models; pick the answer that matches the scenario’s constraints (temporary contractor, cross-department data, dynamic tags on resources).",
  "Wireless and mobility items reward knowing basics: WPA3 improvements conceptually, evil twin risks, captive portals, and why client isolation matters on guest networks—without memorizing obsolete WEP details unless explicitly historical.",
  "Physical security is still on the exam: tailgating, visitor escorts, locks, destruction of media, and environmental controls (fire, HVAC) as availability/confidentiality supports.",
  "Patching and change management appear as <strong>risk tradeoffs</strong>: emergency patches vs testing rings; compensating monitoring when patching lags; and documenting exceptions for auditors.",
  "Third-party and supply chain answers should emphasize <strong>contracts</strong>, <strong>evidence</strong>, and <strong>continuous monitoring</strong>—not “trust the SOC 2 logo” without scope review.",
  "Business continuity answers should reference <strong>RTO/RPO</strong>, <strong>workarounds</strong>, and <strong>tested restores</strong>; DR without practiced failover is wishful thinking, and exam writers know it.",
  "Data handling questions often hinge on <strong>classification</strong>, <strong>least data</strong>, and <strong>retention</strong>: collect only what you need, keep it only as long as allowed, and destroy securely when done.",
];

const EXAM_FRAMES = [
  "Expect <strong>“best”</strong> or <strong>“most appropriate”</strong> wording—eliminate absolutes (“always,” “never,” “eliminates all risk”) unless the statement is a definitional law like “encryption cannot fix broken authorization.”",
  "Scenario stems often hide <strong>two</strong> issues; the distractor is half-right. Read for the primary business harm first, then map to CIA or IR phase.",
  "When controls overlap (WAF + secure coding, EDR + backups), choose the option that addresses the <strong>root cause</strong> first, then layering as secondary.",
  "For crypto/TLS items, verify whether the question is about <strong>confidentiality</strong>, <strong>integrity</strong>, <strong>authentication</strong>, or <strong>non-repudiation</strong>—pick the property that actually matches the mechanism described.",
  "If a stem mentions <strong>compliance</strong>, choose answers that show <strong>policy + technical evidence</strong> (audit logs, access reviews), not performative paperwork alone.",
  "If a stem mentions <strong>users clicking links</strong>, combine awareness with <strong>technical controls</strong> (safe link rewriting, attachment sandboxing, MFA) rather than blaming training only.",
];

const TRAPS = [
  "Equating <strong>encoding</strong> with secrecy or integrity.",
  "Believing VPNs grant anonymity by default or replace MFA.",
  "Thinking CORS or browser policies substitute for server-side authorization.",
  "Assuming “air gap” or “encryption” alone removes need for monitoring and backups.",
  "Choosing “disable logging” or “delete evidence” in any IR scenario stem.",
  "Selecting “domain admin for scanning” as a default best practice.",
  "Confusing SPF/DKIM/DMARC purposes or DMARC alignment details.",
  "Treating CVSS as business impact score rather than technical severity snapshot.",
  "Choosing “disable antivirus” or “turn off firewall” as a troubleshooting first step.",
  "Believing <strong>obscurity</strong> (hidden URLs) is equivalent to <strong>authorization</strong>.",
];

/** Extra glossary rows — merged into global pool so stride selection rarely repeats across adjacent lessons. */
const EXTRA_TERMS = [
  ["SOC triage order", "Scope → impact → evidence → containment hypothesis; avoid fixing symptoms before you know blast radius."],
  ["Separation of duties (SoD)", "No single person can complete a sensitive transaction alone—classic finance control that also limits insider abuse."],
  ["Job rotation", "Reduces collusion and fraud risk; also surfaces “tribal knowledge” silos before an employee leaves."],
  ["Mandatory vacation", "Forces handover and review of another employee’s work—can uncover fraud or backdoors."],
  ["Need to know", "Finer than least privilege for data—access only to the minimum subset required for the current task."],
  ["Data loss prevention (DLP)", "Content-aware controls to block or alert on sensitive data movement—policy + tech, tuned to avoid blocking work."],
  ["Token replay", "Reusing a stolen token/session artifact—rotation, binding, and short TTLs reduce window."],
  ["Replay attack", "Valid data maliciously re-sent—nonces, timestamps, and session freshness mitigate."],
  ["Downgrade attack", "Forcing weaker crypto or protocols—HSTS and modern TLS config reduce browser downgrade paths."],
  ["Certificate transparency (concept)", "Public logs of issued certs help detect mis-issued certificates for your domains."],
  ["OCSP stapling (concept)", "Server sends fresh revocation info with handshake—reduces client privacy leaks and lookup failures."],
  ["CRL", "Certificate Revocation List—signed list of revoked serials; size/latency issues drove OCSP adoption."],
  ["Salt (crypto)", "Random input to a password hash to defeat rainbow tables—must be unique per password."],
  ["PBKDF2 / Argon2 (concept)", "Key derivation functions that slow brute force—work factors must track attacker economics."],
  ["Rainbow table", "Precomputed hash chains for fast password cracking—salting and modern KDFs are the defense."],
  ["Collision (hash)", "Two inputs produce same hash—breaks integrity assumptions; choose strong hash families for security use."],
  ["Block cipher vs stream", "Block operates on fixed-size chunks; stream on bits/bytes—misuse modes (e.g., ECB) create patterns."],
  ["ECB mode weakness", "Identical plaintext blocks yield identical ciphertext—leaks structure; prefer modes with IVs and authentication."],
  ["IV / nonce", "Initialization vector or number-used-once—must be unique per encryption under a key for many modes."],
  ["MAC", "Message authentication code—integrity with a secret key; differs from digital signature which uses asymmetric keys."],
  ["HMAC", "Keyed hash construction—common for API authenticity when symmetric secret is shared out-of-band."],
  ["Diffie-Hellman (concept)", "Key agreement over insecure channel—combine with authentication to prevent MITM."],
  ["MITM", "Man-in-the-middle intercepts or alters traffic—TLS with proper validation mitigates; corporate SSL inspection is its own trust zone."],
  ["Port knocking (concept)", "Obscurity-based pre-auth to open firewall—weak alone; exam may present as non-primary control."],
  ["Jump server / bastion", "Hardened administrative entry point—centralizes session recording and access policy for admins."],
  ["Proxy vs reverse proxy", "Forward proxy represents clients outbound; reverse proxy fronts servers—different trust and logging points."],
  ["WAF vs IPS", "WAF focuses on application-layer attacks; IPS often line-rate network signatures—overlap exists but priorities differ."],
  ["Full packet capture", "High fidelity evidence for investigations—storage, privacy, and legal review constraints apply."],
  ["NetFlow / IPFIX", "Flow metadata for volume and anomaly detection—lighter than PCAP but less payload visibility."],
  ["Sinkhole (DNS)", "Controlled resolution for malicious domains—intel and disruption technique with legal process considerations."],
  ["Sinkhole (routing)", "Different meaning in BGP—be careful with homonyms on exams; read the stem’s context."],
  ["BGP prefix hijack", "Unauthorized route advertisement—RPKI ROV reduces impact but does not replace monitoring."],
  ["RPO / RTO recap", "RPO = max acceptable data loss time; RTO = max acceptable outage—drive backup frequency and HA design."],
  ["Warm site / cold site", "Warm has partial hardware ready; cold is space only—cost vs recovery speed tradeoff."],
  ["MTTD / MTTR", "Mean time to detect / remediate—quality matters; gaming metrics by closing tickets inflates false success."],
  ["OODA loop (IR)", "Observe-orient-decide-act—adversary and defender both iterate; faster, accurate decisions beat hoarding data."],
  ["Diamond model", "Adversary, infrastructure, capability, victim—useful for pivoting investigations and intel fusion."],
  ["Kill chain / cyber kill chain", "Stages of intrusion—mapping controls and detections to stages clarifies coverage gaps."],
  ["IOC", "Indicator of compromise—often ephemeral (IPs, domains); pair with TTP-based detections for durability."],
  ["TTP", "Tactics, techniques, and procedures—behavioral patterns; harder to change than IOCs, better for resilient detection."],
  ["SOAR", "Security orchestration, automation, response—playbooks must have human gates for destructive actions."],
  ["UEBA", "User and entity behavior analytics—baseline deviations; tune to avoid HR/privacy backlash."],
  ["Data residency", "Legal requirement for where data lives—impacts cloud region selection and key custody."],
  ["Right to be forgotten (concept)", "Privacy request to delete data—may conflict with legal hold; counsel resolves precedence."],
];

const PERSONA_PARAGRAPHS = [
  "Auditors care about <strong>traceability</strong>: who approved an exception, when it expires, and what compensating control exists. When you answer exam questions about policy, pick the option that leaves an evidence trail, not the one that relies on informal verbal OKs.",
  "Engineers often optimize for speed; attackers optimize for <strong>cheap reuse</strong> of stolen creds and known exploits. The winning answer bridges both: ship fast with guardrails—feature flags, staged rollouts, and automated security checks in CI.",
  "Help desk scenarios test whether you know <strong>identity proofing</strong> vs <strong>account recovery</strong> abuse. The secure path verifies the human through out-of-band channels without teaching attackers how to bypass your process in the stem text.",
  "Wireless assessments should mention <strong>rogue AP</strong> discovery, client isolation, and guest segmentation—not just “use WPA2” as a slogan. Exam writers like the distinction between personal and enterprise authentication modes at a conceptual level.",
  "Mainframe and legacy integration appears as “we cannot patch.” The Security+ answer is usually <strong>compensating controls</strong>, isolation, monitoring, and a documented risk acceptance—not “ignore CVEs.”",
  "Industrial and OT adjacent questions reward knowing <strong>safety vs security</strong> tension: availability may trump confidentiality; testing must avoid breaking physical processes.",
  "Email security stems often combine SPF alignment failures with <strong>look-alike domains</strong>. The best answer addresses user training plus technical authenticity controls, not only one or the other.",
  "When logs “mysteriously stop,” think <strong>time sync failure</strong>, collector saturation, retention misconfiguration, or attacker tampering—in that diagnostic order for a fair exam narrative.",
  "Secrets in CI logs are a supply-chain class issue: the fix is <strong>redact</strong>, rotate, and add secret scanning gates—not “delete the repo history” as a first instinct unless counsel says so.",
  "Container escape questions hinge on <strong>kernel boundary</strong> and misconfigured capabilities—namespaces are helpful but not a complete trust boundary without seccomp, AppArmor, and least-privileged service accounts.",
  "Serverless cold start is not a security control; <strong>per-function IAM</strong> and least-privilege API scopes are. Watch for attractive nonsense distractors tied to performance tuning.",
  "KMS keys are not “magic secrecy dust”—<strong>who can invoke decrypt</strong> and from which contexts (VPC endpoint policies, IAM conditions) is what exams probe.",
  "BEC stems want <strong>out-of-band verification</strong> for payment changes, not “block all international email.”",
  "Ransomware stems often pair encryption with <strong>exfiltration</strong>—the correct answer may include legal/notification obligations, not only restoring from backup.",
  "Cryptojacking still appears: high CPU, unexpected mining pools, and cloud billing spikes—detection plus credential hygiene beats chasing miner signatures alone.",
  "Typosquatting and dependency confusion prey on <strong>human trust in package names</strong>; mitigations include private registries, pinning, and provenance verification.",
  "SAST finds issues early but produces false positives; <strong>triage workflows</strong> and developer feedback loops are part of a mature program, not “run tool once.”",
  "DAST exercises running apps but misses authz logic without credentials; combine with <strong>manual review</strong> for business-rule flaws.",
  "Penetration tests require <strong>written authorization</strong>, defined scope, and rules of engagement—even in internal labs for professional conduct.",
  "Tabletop exercises test <strong>comms trees</strong>, legal escalation, and customer notification templates—not only technical runbooks.",
  "Evidence bags and write blockers signal <strong>forensics awareness</strong>; touching disks before imaging is a classic wrong answer.",
  "Multicloud complexity increases <strong>identity sprawl</strong>; centralized IdP and consistent conditional access policies reduce human error.",
  "API keys in mobile apps are often extractable—prefer <strong>short-lived tokens</strong> and server-mediated access to backends.",
  "GraphQL introspection risk is about <strong>schema discovery</strong> aiding attackers—rate limits, authz on fields, and disabling introspection in prod are common answers.",
  "CSP reporting helps tune policy but can leak URLs—<strong>privacy review</strong> of report endpoints matters in regulated environments.",
  "Subresource integrity protects against <strong>CDN compromise</strong> but requires operational discipline when vendors rotate files.",
  "Certificate pinning failures during rotation teach why <strong>key continuity strategy</strong> must be planned before mobile releases.",
  "LDAP vs Active Directory questions test directory concepts at a high level—binding, searches, and secure transport (LDAPS) appear often.",
  "RADIUS is still referenced for <strong>network access control</strong> integrations; know it as a AAA component in enterprise Wi-Fi contexts.",
  "TACACS+ vs RADIUS separation of duties in device admin access—exams may contrast accounting granularity.",
  "Honeypots can generate high-signal alerts but carry <strong>legal and operational</strong> risk if touched by real users; scope carefully.",
  "Deception tech is not a replacement for <strong>baselines and patching</strong>; it augments detection when mature processes exist.",
  "Air gapped networks still need <strong>patching via sneaker-net</strong> and insider controls—physical isolation is not logical isolation.",
  "Virtualization risks include <strong>snapshot sprawl</strong> containing secrets and stale VM images drifting from hardened baselines.",
  "BIOS/UEFI passwords and secure boot reduce some pre-boot attacks but do not stop <strong>evil maid</strong> classes without additional controls.",
  "TPM-backed BitLocker keys illustrate <strong>key protection</strong> binding to platform state—recovery keys must be guarded like crown jewels.",
  "Sanitization vs wiping vs destruction: exams like knowing which media needs <strong>degaussing, shredding, or crypto erase</strong> per policy.",
  "Social engineering callbacks to <strong>pretexting</strong>, <strong>baiting</strong>, and <strong>vishing</strong>—name the subtype when the stem describes the tactic.",
  "Clean desk pairs with <strong>screen privacy</strong> and <strong>clear desk checks</strong> for regulated spaces—physical + procedural controls together.",
  "Travel security includes <strong>full-disk encryption</strong>, VPN hygiene on hotel Wi-Fi, and device never leaving sight—not “turn off MFA for convenience.”",
];

const EXAM_EXTRA = [
  "If the stem lists <strong>symptoms</strong> (latency, resets, odd DNS), separate network faults from malicious activity before choosing “block country X.”",
  "When two answers sound equally secure, prefer the one with <strong>explicit accountability</strong> (logging, ownership, review) over anonymous magic.",
  "Regulatory mentions (HIPAA-style, PCI) usually want <strong>least data</strong>, <strong>encryption</strong>, and <strong>access reviews</strong>—not “collect everything for analytics.”",
  "If the question references <strong>contractors</strong>, expect answers about temporary accounts, expiration, and scoped access—not permanent admin.",
  "For <strong>wireless</strong>, “disable SSID broadcast” is weak obscurity; stronger answers involve WPA enterprise, segmentation, and monitoring.",
  "If the scenario is <strong>after hours</strong> admin login, think break-glass procedures, alerting, and dual approval—not “always allow.”",
  "When asked for the <strong>first</strong> step, pick triage actions that preserve evidence and reduce spread—not deep malware reverse engineering.",
  "If data crosses borders, answers may touch <strong>data residency</strong> and lawful access regimes—pick the legally grounded option.",
  "For <strong>IoT</strong>, default passwords and unsegmented VLANs are common exam villains; change defaults and isolate.",
  "If “AI” appears, answers usually emphasize <strong>data governance</strong>, prompt injection class risks, and supply chain of models—not sci-fi.",
];

const TRAPS_EXTRA = [
  "Picking “encrypt everything with AES” when the problem is <strong>broken access control</strong> on the API.",
  "Choosing <strong>anonymous FTP</strong> for “convenience” in any business context stem.",
  "Believing <strong>MAC filtering</strong> is strong authentication for Wi-Fi.",
  "Selecting <strong>security through long passwords only</strong> while ignoring MFA and phishing resistance.",
  "Thinking <strong>snapshots alone</strong> satisfy backup requirements without restore testing.",
  "Assuming <strong>TLS</strong> on a site proves the site is benign—TLS only protects the channel, not intent.",
];

const FACT_SNIPPETS = [
  "AES-128 is not “half as strong” as AES-256 in practical threat models for many cases—key management quality dominates.",
  "SHA-1 is deprecated for security-sensitive signatures; prefer SHA-256 family algorithms for new designs.",
  "UDP-based protocols can be abused for amplification DDoS—patch open resolvers and monitor volumetric baselines.",
  "NIST CSF functions: Identify, Protect, Detect, Respond, Recover—useful mental scaffold for mapping controls.",
  "ISO 27001 is an ISMS standard; it emphasizes risk treatment and continual improvement, not a product checklist.",
  "PCI DSS scope reduction via segmentation is a recurring theme—if it is not in scope, it cannot drag you into assessment.",
  "FIDO2 security keys resist phishing because the origin is bound cryptographically—unlike TOTP seeds typed into a page.",
  "OAuth access tokens are not a replacement for server-side authorization checks on every sensitive action.",
  "SameSite=Lax blocks many CSRF POSTs from cross-site contexts in modern browsers—know the nuance vs Strict.",
  "HttpOnly does not stop CSRF; it reduces token theft from XSS reading document.cookie in many setups.",
  "CSP default-src does not magically fix server-side SQLi—different layer.",
  "CVSS base does not include your asset criticality—environmental metrics exist for a reason.",
  "EPSS (concept) scores exploitation probability—useful alongside CVSS for prioritization in mature programs.",
  "ATT&CK technique IDs are stable references for detection content—good for purple team reporting.",
  "Sigma rules are vendor-agnostic detection snippets—tuning required per log source fields.",
  "Windows Event ID familiarity helps in hybrid SOC scenarios—Security log categories appear in stems.",
  "Linux auth.log style entries pair with SSH brute-force detection patterns—velocity and geo anomalies.",
  "Immutable backups mitigate ransomware that tries to delete online copies—air-gapped or WORM patterns.",
  "Write blockers protect disk integrity during acquisition—first touch matters for admissibility narratives.",
  "Chain of custody forms tie who touched evidence to times and hashes—do not skip signatures on transfers.",
  "Split tunnel VPN can exfil corporate data outside inspection if misconfigured—policy and routing matter.",
  "DNS over HTTPS changes visibility for some networks—understand resolver policy and logging tradeoffs.",
  "Certificate pinning misconfigurations can brick apps—plan rotation and emergency releases.",
  "CRL/OCSP failures can cause false negatives in validation—monitor PKI health proactively.",
  "JWT alg:none historical vulnerability class—always validate algorithm and signature keys explicitly.",
  "GraphQL batching can amplify complexity attacks—depth and cost limits are first-class controls.",
  "Server-side template injection is distinct from XSS—context and sinks differ.",
  "Race conditions in web apps can undermine authorization—sequential logic tests in secure design reviews.",
  "Race conditions in file operations underpin some TOCTOU issues—exam may reference unsafe temp files.",
  "Container image signing and digest pinning reduce supply-chain surprises in Kubernetes pulls.",
  "Admission controllers can block privileged pods—policy-as-code integrates with GitOps reviews.",
  "Cloud IAM policy wildcards are a frequent blast-radius multiplier—explicit ARNs beat star patterns.",
  "S3 bucket policies and ACLs layer with IAM—effective permissions require understanding intersection.",
  "KMS key policies can deny even root in AWS when configured—explicit deny wins.",
  "Azure AD / Entra conditional access is analogous to risk-based policies—device compliance signals matter.",
  "GCP service account keys are long-lived secrets—prefer workload identity federation from CI where possible.",
  "Terraform state can hold secrets—remote secure backend and scanning are baseline hygiene.",
  "SBOM formats (CycloneDX/SPDX) help inventory components for incident response and licensing—not only security.",
  "SLSA levels describe increasing supply-chain assurance—useful vocabulary in modern governance questions.",
  "Bug bounty scope must exclude destructive testing—safe harbor language still needs legal review.",
  "Responsible disclosure timelines balance vendor patch readiness with public safety—coordinate, don’t surprise.",
];

const MISTAKE_LINES = [
  "Wrong: “We have logs, so we are secure.” → Right: Logs without <strong>tuning, retention, and review</strong> are decoration.",
  "Wrong: “MFA means impossible to phish.” → Right: Push fatigue, proxied phishing, and session theft still exist—use phishing-resistant factors where possible.",
  "Wrong: “WAF replaces secure coding.” → Right: WAF buys time; <strong>root-cause fixes</strong> remove vulnerability classes.",
  "Wrong: “Encryption fixes data quality.” → Right: Encryption protects data; it does not validate correctness or authorization.",
  "Wrong: “Block all ICMP for security.” → Right: ICMP is needed for path MTU discovery; filter thoughtfully, not blanket ban by myth.",
  "Wrong: “NAT is a security feature.” → Right: NAT complicates addressing; it is not a substitute for firewall rules and host controls.",
  "Wrong: “Disable SELinux/AppArmor because it breaks things.” → Right: Tune profiles and fix policy; disabling removes mandatory access control value.",
  "Wrong: “Share admin passwords in the vault ‘for emergencies.’” → Right: Break-glass accounts with logging, rotation, and dual control after use.",
  "Wrong: “Pen test = prove we are secure.” → Right: Pen test = <strong>point-in-time</strong> risk snapshot under defined scope; continuous improvement follows.",
  "Wrong: “SIEM bought = SOC mature.” → Right: Content engineering, runbooks, and staffing determine outcomes—not SKU count.",
  "Wrong: “Zero Trust = no firewalls.” → Right: Zero Trust changes <strong>trust assumptions</strong>; network controls remain, differently applied.",
  "Wrong: “PQC means turn off classical crypto today.” → Right: Hybrid transition and inventory of long-lived secrets guide migration.",
];

const STANDARDS_ONE_LINERS = [
  "NIST SP 800-53: control catalog often mapped for federal and regulated industries—think “what control family applies?”",
  "NIST IR 800-61 lineage informs incident handling structure—align your answers to prepare/detect/contain themes.",
  "ISO 27005: risk assessment guidance—ties likelihood/impact treatment to management decisions.",
  "CIS Controls: prioritized safeguards list—good for baseline gap conversations in interviews.",
  "CIS benchmarks: hardened configuration guidance—know they exist for OS, cloud, and mobile stacks.",
  "PCI DSS: cardholder data environment controls—segmentation and PAN minimization are recurring exam neighbors.",
  "HIPAA Security Rule: administrative, physical, technical safeguards for PHI—BAA and minimum necessary appear often.",
  "FedRAMP: standardized cloud security assessment for US government—continuous monitoring is a theme.",
  "SOC 2 Trust Services Criteria: security + availability/confidentiality/etc.—read exceptions in real reports.",
  "COBIT / ITIL touch governance and service management—sometimes appear as “process maturity” distractors vs technical fixes.",
];

const INTERVIEW_PROMPTS = [
  "Explain the difference between <strong>risk</strong>, <strong>threat</strong>, and <strong>vulnerability</strong> with one workplace example each.",
  "Walk through how TLS provides both <strong>confidentiality</strong> and <strong>integrity</strong> for a browser session—where does authentication of the server happen?",
  "Describe how you would respond to a suspected <strong>credential stuffing</strong> wave against customer logins without locking out legitimate users entirely.",
  "How does <strong>DMARC alignment</strong> reduce business email spoofing—what breaks if SPF passes but DKIM fails?",
  "What is the difference between <strong>vulnerability scan</strong>, <strong>credentialed scan</strong>, and <strong>penetration test</strong> in procurement language?",
  "How would you explain <strong>IDOR</strong> to a product manager using a concrete object example (orders, invoices, documents)?",
  "What logs would you want for detecting <strong>lateral movement</strong> in an AD environment at a high level?",
  "How do <strong>break-glass</strong> accounts stay secure while remaining usable in emergencies?",
  "What is the role of <strong>change management</strong> during an active incident—when do you still need CAB vs emergency change?",
  "How does <strong>shared responsibility</strong> change your logging strategy in IaaS vs PaaS vs SaaS?",
];

function buildAllTermsList() {
  const seen = new Set();
  const out = [];
  for (const k of Object.keys(TERMS)) {
    for (const p of TERMS[k]) {
      if (seen.has(p[0])) continue;
      seen.add(p[0]);
      out.push(p);
    }
  }
  for (const p of EXTRA_TERMS) {
    if (seen.has(p[0])) continue;
    seen.add(p[0]);
    out.push(p);
  }
  return out;
}

const ALL_TERMS_LIST = buildAllTermsList();

/**
 * Pick `count` items from `arr` with large strides so adjacent lesson ids rarely share the same sequence.
 * `keyFn` returns dedupe key (string).
 */
function pickStrided(arr, id, salt, count, keyFn) {
  const n = arr.length;
  if (!n) return [];
  if (n === 1) return count > 0 ? [arr[0]] : [];
  const seed = hashSeed(id + "|" + salt);
  const primes = [7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43];
  let stride = primes[seed % primes.length] % n;
  if (stride === 0) stride = 1 + (seed % (n - 1 || 1));
  const start = seed % n;
  const out = [];
  const used = new Set();
  let pos = start;
  let guard = 0;
  while (out.length < count && guard < n * 6) {
    const item = arr[pos % n];
    const key = keyFn(item);
    if (!used.has(key)) {
      used.add(key);
      out.push(item);
    }
    pos += stride;
    guard++;
  }
  return out;
}

function pickTerms(id, title, body, category) {
  const bias = hashSeed(category + "|" + id) % 5;
  const biased = [...ALL_TERMS_LIST];
  if (bias > 0) {
    const catPool = TERMS[category] || [];
    for (let i = catPool.length - 1; i >= 0; i--) biased.unshift(catPool[i]);
  }
  return pickStrided(
    biased,
    id,
    "terms|" + title,
    14,
    (p) => p[0]
  ).map((p) => (Array.isArray(p) ? p : ["?", "?"]));
}

function categoryForLesson(id, title, body) {
  const t = `${title} ${body}`.toLowerCase();
  if (/sql|xss|csrf|owasp|header|jwt|graphql|cookie|ssrf|deserial|upload|websocket|path travers/i.test(t)) return "appsec";
  if (/tls|dns|vpn|firewall|tcp|ip|email|spf|dkim|dmarc|segment|network|port|packet/i.test(t)) return "network";
  if (/hash|aes|rsa|ecc|pki|sign|encrypt|crypto|encoding|symmetric|asymmetric|aead|pqc/i.test(t)) return "crypto";
  if (/cve|cvss|cwe|siem|attack|ir\b|incident|forensic|vuln|log|yara|edr|ids|ips/i.test(t)) return "vuln_ir";
  if (/cloud|aws|azure|gcp|iam|kubernetes|serverless|casb|oauth|oidc|pipeline|terraform|iac/i.test(t)) return "cloud";
  if (/policy|governance|grc|vendor|awareness|insider|retention|soc 2|metric|board|legal|insurance/i.test(t)) return "governance";
  if (/zero trust|purple|red team|threat model|stride|formal|ml |quantum|bgp|hsm|rowhammer/i.test(t)) return "advanced";
  if (/mfa|password|kerberos|session|sso|auth|identity|ldap|pam/i.test(t)) return "identity";
  const lv = (id.match(/lh-sec-l(\d+)/) || [])[1];
  if (lv === "1") return "foundations";
  if (lv === "2") return "network";
  if (lv === "3") return "vuln_ir";
  if (lv === "4") return "cloud";
  return "advanced";
}

const ALL_NARRATIVE = [...NARRATIVE_BLOCKS, ...PERSONA_PARAGRAPHS];
const ALL_EXAM = [...EXAM_FRAMES, ...EXAM_EXTRA];
const ALL_TRAPS = [...TRAPS, ...TRAPS_EXTRA];

function pickNarrativeParas(id, title) {
  const paras = pickStrided(ALL_NARRATIVE, id, "narr|" + title, 10, (s) => s);
  const safeTitle = escapeHtml(title);
  return paras
    .map((p, i) => {
      const tweaked =
        i === 0 && p.includes("translate every control")
          ? p.replace("translate every control", `for “${safeTitle}”, translate every control`)
          : p;
      return `<p><strong>Depth ${i + 1} — lens on <em>${safeTitle}</em>:</strong> ${tweaked}</p>`;
    })
    .join("");
}

function examBullets(id) {
  const xs = pickStrided(ALL_EXAM, id, "exam", 5, (s) => s);
  return `<ul>${xs.map((x) => `<li>${x}</li>`).join("")}</ul>`;
}

function trapBullets(id) {
  const xs = pickStrided(ALL_TRAPS, id, "trap", 6, (s) => s);
  return `<ul>${xs.map((x) => `<li>${x}</li>`).join("")}</ul>`;
}

const LEVEL_INTRO_VARIANTS = {
  "1": [
    "Level 1 maps to Security+ <strong>foundations</strong>: risk vocabulary, CIA, control families, common attack classes, physical basics, and early IR literacy. Stems reward <strong>definitions you can apply</strong>, not memorizing obscure RFC numbers unless the question names them.",
    "At Level 1, think like an analyst who must <strong>classify</strong> an event: asset, threat, vulnerability, control, residual risk. If you can narrate those five words for any headline topic, you are aligned with how writers build scenario questions.",
    "Foundations on the exam often pair <strong>policy intent</strong> with <strong>technical examples</strong>—pick answers that show both, not policy theater without enforcement.",
    "Level 1 physical and operational items return to <strong>tailgating, visitor logs, and media destruction</strong>—do not skip them as “non-technical”; they are fair game.",
    "Expect “which control type?” questions—administrative vs technical vs physical—tied to realistic workplace moments like contractor onboarding.",
    "Level 1 IR literacy means naming <strong>phases</strong> and knowing <strong>never delete logs</strong> as a first reflex; sophistication grows in later levels.",
  ],
  "2": [
    "Level 2 tracks Security+ <strong>architecture and hybrid environments</strong>: trust boundaries, TLS/certificates, DNS/email controls, VPN caveats, and headline application flaws. Explain <em>why</em> a control exists and <em>what misconfiguration breaks</em>.",
    "Architecture questions love <strong>defense in depth</strong> with two layers that are actually independent—avoid picking redundant copies of the same failure mode.",
    "Hybrid identity and remote access scenarios appear here—know when <strong>split tunneling</strong> changes what your security tools can see.",
    "Application-layer stems sneak in early: know where <strong>authorization</strong> must be enforced even if TLS is perfect.",
    "Email authenticity (SPF/DKIM/DMARC) is a frequent multi-part stem—read whether the failure is <strong>alignment</strong>, <strong>policy</strong>, or <strong>operator error</strong>.",
    "TLS questions separate <strong>confidentiality channel</strong> from <strong>server authentication</strong>—certificate validation and hostname checks matter in the answer set.",
  ],
  "3": [
    "Level 3 aligns with Security+ <strong>operations and engineering</strong>: vuln management, logging/SIEM concepts, IAM patterns, threat modeling, and IR mechanics. Writers blend domains—patch urgency plus change window is a classic pair.",
    "Operations answers should show <strong>measurable process</strong>: SLAs, verification steps, and feedback loops—not heroic one-off fixes.",
    "Detection engineering stems want you to connect <strong>data sources</strong> to <strong>hypothesis</strong>—what log field proves the story?",
    "Vulnerability prioritization is not “CVSS only”—think <strong>exposure</strong>, <strong>exploitability</strong>, and <strong>asset value</strong> together.",
    "Threat modeling at this level stays <strong>STRIDE-shaped</strong>—name the abuse, then map a proportional control.",
    "IR stems test <strong>containment vs evidence</strong> tension—choose actions that preserve hashes and legal escalation paths.",
  ],
  "4": [
    "Level 4 mirrors Security+ <strong>enterprise and cloud</strong>: identity governance, conditional access patterns, evidence handling, purple collaboration, and vendor/SaaS risk. Show you understand <strong>scope</strong> and <strong>blast radius</strong> across accounts and tenants.",
    "Cloud answers should articulate <strong>shared responsibility</strong> boundaries without blaming the provider for customer IAM mistakes.",
    "Vendor risk items reward <strong>continuous monitoring</strong> and <strong>contractual evidence</strong>, not one-time PDF collection.",
    "Purple team references test <strong>authorization to simulate</strong> and <strong>logging of exercises</strong>—safety and auditability matter.",
    "SaaS governance (CASB-style thinking) pairs technical visibility with <strong>OAuth consent</strong> and <strong>guest sharing</strong> policy.",
    "Evidence handling in regulated orgs may invoke <strong>legal hold</strong>—do not pick answers that “clean up” data prematurely.",
  ],
  "5": [
    "Level 5 is Security+ <strong>advanced integration</strong>: Zero Trust themes, crypto agility, architecture tradeoffs, and ethical offensive work. Even advanced stems still reduce to least privilege, segmentation, logging, and tested recovery.",
    "Zero Trust answers should emphasize <strong>continuous verification</strong> and <strong>policy enforcement points</strong>, not removing all network security.",
    "Modern crypto stems may reference <strong>harvest-now/decrypt-later</strong>—think inventory of secret longevity and hybrid transitions.",
    "Advanced IR/intel questions still punish <strong>evidence destruction</strong> and <strong>unscoped testing</strong>—professional ethics are in scope.",
    "Architecture tradeoff prompts want <strong>explicit assumptions</strong>—availability vs cost vs complexity, stated cleanly.",
    "When buzzwords appear (PQC, confidential computing), translate them into <strong>concrete threats and controls</strong> before selecting an answer.",
  ],
};

function levelIntroHtml(lv, id) {
  const list = LEVEL_INTRO_VARIANTS[lv] || LEVEL_INTRO_VARIANTS["5"];
  const idx = hashSeed(id + "|lvintro") % list.length;
  return `<p>${list[idx]}</p>`;
}

function recallTable(category, id) {
  const mode = hashSeed(id + "|recall|" + category) % 5;
  const packs = [
    {
      h: ["Property", "Typical exam angle"],
      r: [
        ["Confidentiality", "Who may read? Encryption, ACLs, DLP, classification."],
        ["Integrity", "Was it modified? Hashing, signatures, change control, backups."],
        ["Availability", "Can authorized users work? HA, patching windows, DDoS defense, DR."],
        ["Authenticity / non-repudiation", "Prove source and intent—signatures, strong issuance, tamper-evident logs."],
      ],
    },
    {
      h: ["IR phase", "What you do there (exam shorthand)"],
      r: [
        ["Prepare", "Playbooks, contacts, tooling, baseline logging—before the pager fires."],
        ["Detect & analyze", "Scope, timelines, hypotheses—preserve volatile evidence early."],
        ["Contain", "Stop spread with minimal evidence damage—network isolation variants matter."],
        ["Eradicate & recover", "Remove persistence, patch root cause, restore with verification."],
        ["Lessons learned", "Metrics, control changes, and communication improvements—close the loop."],
      ],
    },
    {
      h: ["Control flavor", "When exam writers pick it"],
      r: [
        ["Preventive", "Stops incident before success—least privilege, secure defaults, MFA."],
        ["Detective", "Finds badness—SIEM rules, EDR alerts, integrity monitoring."],
        ["Corrective", "Fixes after detection—quarantine, reimage, rollback."],
        ["Deterrent", "Raises attacker cost—monitoring banners, legal warnings (not magic alone)."],
        ["Compensating", "Alternative when primary control infeasible—documented equivalence required."],
      ],
    },
    {
      h: ["Crypto concept", "Precision the exam likes"],
      r: [
        ["Hashing", "Integrity fingerprint—one-way; not secrecy; pair with keys for MACs."],
        ["Symmetric", "Bulk encryption—key distribution is the hard part."],
        ["Asymmetric", "Key agreement/signing—watch performance and key lifecycle."],
        ["Digital signature", "Integrity + origin + non-repudiation when keys are governed."],
        ["Key management", "Generation, storage, rotation, destruction—often the real vulnerability."],
      ],
    },
    {
      h: ["Cloud responsibility", "Who typically owns it"],
      r: [
        ["Patching the hypervisor", "Provider responsibility in major IaaS models—customer still patches guests."],
        ["IAM policy and keys", "Customer-owned configuration—misconfigurations dominate incidents."],
        ["Data encryption at rest", "Often customer-controlled keys/KMS policies with provider primitives."],
        ["Network exposure (SGs/NACLs)", "Customer configures; default-deny patterns are exam favorites."],
        ["Application vulnerabilities", "Customer code and dependencies—shared model does not absolve secure SDLC."],
      ],
    },
  ];
  const pick = packs[mode];
  const rows = [pick.h, ...pick.r];
  if (category === "crypto" && mode !== 3) {
    rows.push(["AEAD", "Confidentiality + integrity together—misuse of IV/nonce still breaks security."]);
  }
  if (category === "network" && mode !== 4) {
    rows.push(["Split tunnel", "User traffic may bypass corporate inspection—policy and routing implications."]);
  }
  if (category === "appsec" && mode !== 0) {
    rows.push(["Authorization", "Server-side object checks—headers and TLS do not replace this."]);
  }
  const body = rows
    .slice(1)
    .map(
      ([a, b]) =>
        `<tr><td><strong>${escapeHtml(a)}</strong></td><td>${escapeHtml(b)}</td></tr>`
    )
    .join("");
  return `<div class="lh-sec-table-wrap"><table class="lh-sec-recall"><thead><tr><th>${escapeHtml(rows[0][0])}</th><th>${escapeHtml(rows[0][1])}</th></tr></thead><tbody>${body}</tbody></table></div>`;
}

const SCENARIO_TEMPLATES = [
  (safe) =>
    `<p><strong>Workplace scenario:</strong> You are the on-call analyst reviewing an alert tied to “${safe}”. Leadership wants a <strong>60-second</strong> brief: business impact, evidence gaps, and the <strong>first</strong> containment step that preserves logs. No tool-specific jargon—prioritize scope, evidence, blast radius, then root-cause remediation under change control.</p>`,
  (safe) =>
    `<p><strong>Workplace scenario:</strong> During a tabletop, the CFO asks how “${safe}” could become a material incident. Answer with <strong>one plausible attack path</strong>, <strong>one detective control</strong> you already have, and <strong>one preventive gap</strong> you would fund next quarter.</p>`,
  (safe) =>
    `<p><strong>Workplace scenario:</strong> A vendor integration project mentions “${safe}” as out-of-scope for pen testing. Explain what <strong>residual risk</strong> remains, what <strong>compensating monitoring</strong> you would demand, and how you would <strong>document acceptance</strong>.</p>`,
  (safe) =>
    `<p><strong>Workplace scenario:</strong> Junior staff proposes a quick fix for “${safe}” that disables logging on a noisy host. Walk through why that is unacceptable and propose a <strong>tuning</strong> path that preserves <strong>integrity and retention</strong> commitments.</p>`,
  (safe) =>
    `<p><strong>Workplace scenario:</strong> Legal asks whether “${safe}” artifacts require <strong>hold</strong> before deletion. Describe how you would <strong>tag systems</strong>, <strong>freeze backups</strong> appropriately, and <strong>escalate</strong> without tipping external actors.</p>`,
  (safe) =>
    `<p><strong>Workplace scenario:</strong> An engineer wants emergency access to production to debug “${safe}” during change freeze. Outline <strong>break-glass</strong> steps: who approves, how sessions are recorded, and how credentials are rotated after.</p>`,
  (safe) =>
    `<p><strong>Workplace scenario:</strong> Marketing launches a campaign referencing “${safe}” with a new subdomain. Security review finds DNS delegated to an unknown party. Explain <strong>trust chain</strong> risks and the <strong>minimum fixes</strong> before go-live.</p>`,
  (safe) =>
    `<p><strong>Workplace scenario:</strong> Internal audit samples “${safe}” controls and finds screenshots instead of config exports. Explain why <strong>authoritative evidence</strong> matters and what you would collect instead.</p>`,
  (safe) =>
    `<p><strong>Workplace scenario:</strong> A cloud bill spike correlates with traffic about “${safe}”. Differentiate <strong>misconfiguration</strong> vs <strong>abuse</strong> in your first triage questions and what logs prove each hypothesis.</p>`,
  (safe) =>
    `<p><strong>Workplace scenario:</strong> Purple team wants to simulate abuse of “${safe}” next Friday. List <strong>safety gates</strong> (scope, rollback, monitoring) you require before authorizing the exercise.</p>`,
];

function scenarioBlock(title, category, id) {
  const safe = escapeHtml(title);
  const idx = hashSeed(id + "|scen|" + category) % SCENARIO_TEMPLATES.length;
  const stem = SCENARIO_TEMPLATES[idx](safe);
  const drills = [
    "<p><strong>Follow-up drill:</strong> Write three <strong>plausible wrong answers</strong> an exam might offer—each violating least privilege, logging integrity, or legal escalation—then pick the best remaining option in one sentence.</p>",
    "<p><strong>Follow-up drill:</strong> Draft five <strong>yes/no questions</strong> you would ask the system owner to decide whether this is containment-first or preserve-forensics-first.</p>",
    "<p><strong>Follow-up drill:</strong> List <strong>four log fields</strong> you need minimum to reconstruct a timeline; explain what each field disambiguates.</p>",
    "<p><strong>Follow-up drill:</strong> Explain the same scenario twice: once for a <strong>technical peer</strong>, once for a <strong>non-technical executive</strong>—no word overlap in the opening sentences.</p>",
  ];
  const d = drills[hashSeed(id + "|drill") % drills.length];
  return stem + d;
}

const CONTROLS_VARIANTS = [
  `<ul>
<li><strong>Prevent:</strong> least privilege, secure defaults, hardened baselines, input validation, architecture that shrinks trust zones.</li>
<li><strong>Detect:</strong> authoritative logging, correlation, integrity monitoring, tuned detections that reduce alert fatigue.</li>
<li><strong>Respond:</strong> playbooks with legal/HR hooks, containment preserving evidence, comms that avoid tipping attackers.</li>
<li><strong>Recover:</strong> tested restores, disaster runbooks, post-incident metrics that change systems—not blame individuals alone.</li>
</ul>`,
  `<ul>
<li><strong>Identify (CSF-style):</strong> asset inventory, risk framing, governance—know what you are protecting before buying tools.</li>
<li><strong>Protect:</strong> IAM, data security, protective tech—make abuse expensive and visible.</li>
<li><strong>Detect:</strong> continuous monitoring, anomaly detection—assume some bypass succeeds.</li>
<li><strong>Respond &amp; Recover:</strong> coordinated actions with communications, then verified restoration and lessons captured as tickets.</li>
</ul>`,
  `<ul>
<li><strong>People:</strong> training, hiring checks, separation of duties—human failure modes dominate real incidents.</li>
<li><strong>Process:</strong> change management, access reviews, vendor onboarding—repeatable procedures beat heroics.</li>
<li><strong>Technology:</strong> encryption, firewalls, EDR—deployed with configuration management and drift detection.</li>
<li><strong>Measurement:</strong> control effectiveness tests, purple findings, audit samples—prove controls operate, not only exist on paper.</li>
</ul>`,
];

function controlsBlockHtml(id) {
  return CONTROLS_VARIANTS[hashSeed(id + "|controls") % CONTROLS_VARIANTS.length];
}

function factBullets(id) {
  const xs = pickStrided(FACT_SNIPPETS, id, "facts", 8, (s) => s);
  return `<ul>${xs.map((x) => `<li>${x}</li>`).join("")}</ul>`;
}

function mistakeBullets(id) {
  const xs = pickStrided(MISTAKE_LINES, id, "mist", 5, (s) => s);
  return `<ul>${xs.map((x) => `<li>${x}</li>`).join("")}</ul>`;
}

function standardsBullets(id) {
  const xs = pickStrided(STANDARDS_ONE_LINERS, id, "std", 4, (s) => s);
  return `<ul>${xs.map((x) => `<li>${x}</li>`).join("")}</ul>`;
}

function interviewBullets(id) {
  const xs = pickStrided(INTERVIEW_PROMPTS, id, "iv", 4, (s) => s);
  return `<ul>${xs.map((x) => `<li>${x}</li>`).join("")}</ul>`;
}

/**
 * @param {{ id: string, unit: string, title: string, body: string }} lesson
 * @returns {string} HTML fragment (safe to append inside tech-prose div)
 */
export function enrichSecurityLessonHtml(lesson) {
  const { id, unit, title, body } = lesson;
  const category = categoryForLesson(id, title, body);
  const terms = pickTerms(id, title, body, category);
  const dl = terms.map(([t, d]) => `<dt><strong>${escapeHtml(t)}</strong></dt><dd>${escapeHtml(d)}</dd>`).join("");
  const levelMatch = id.match(/lh-sec-l(\d+)/);
  const lv = levelMatch ? levelMatch[1] : "?";
  const unitEsc = escapeHtml(unit);

  return `
<section class="lh-sec-study-pack" aria-label="Security+ expanded study notes">
<h2>Security+ prep — expanded study guide</h2>
<p class="lh-sec-lede">This block is generated to mirror <strong>CompTIA Security+ (SY0-701)</strong> study depth: definitions, exam psychology, and workplace application. It supplements the short curriculum bullets above—read both. Lesson <code>${escapeHtml(id)}</code> · ${unitEsc}. Sections below rotate per lesson so adjacent topics do not repeat the same blurbs.</p>

<h3>Where this sits in the Security+ landscape</h3>
${levelIntroHtml(lv, id)}

<h3>How this lesson shows up on the exam</h3>
<p>Security+ rewards <strong>vocabulary precision</strong> and <strong>scenario judgment</strong>. For Level ${escapeHtml(lv)} topics, expect paired questions that test whether you know the <em>definition</em>, the <em>correct control family</em>, and the <em>failure mode</em> when misapplied. Use the key terms below as a checklist: if you cannot explain a term in under 20 seconds, revisit the concept.</p>
${examBullets(id)}

<h3>Key terms (memorize and be able to contrast)</h3>
<dl class="lh-sec-dl">${dl}</dl>

<h3>Quick contrast table (recall drill)</h3>
${recallTable(category, id)}

<h3>Fact pack (high-signal trivia)</h3>
<p>Short statements you can verify in official courseware—use them to catch “sounds right” distractors.</p>
${factBullets(id)}

<h3>Wrong vs right mental models</h3>
${mistakeBullets(id)}

<h3>Standards &amp; frameworks (one-liners)</h3>
${standardsBullets(id)}

<h3>Interview-style prompts (say aloud)</h3>
${interviewBullets(id)}

<h3>Deep explanation (read slowly)</h3>
${pickNarrativeParas(id, title)}

<h3>Controls &amp; engineering habits</h3>
${controlsBlockHtml(id)}

<h3>Common exam traps</h3>
${trapBullets(id)}

<h3>Scenario practice</h3>
${scenarioBlock(title, category, id)}

<p class="msg info"><strong>Lab ethics:</strong> Treat every command as if it were under a written Rules of Engagement. No probing of systems you do not own or lack authorization to test.</p>
</section>`;
}
