# Security Concepts — Workplace Readiness Curriculum (Kali VM Track)

> Maintenance note (2026-04): Documentation and bundled lesson text received an OCR/spacing normalization pass for readability consistency. When editing new sections, follow `docs/TECHPLUS_EDITORIAL_STANDARD.md` conventions for hyphenation and split-word cleanup.

**Audience:** Learners moving from zero to job-ready security literacy (SOC analyst, IT security support, junior GRC, appsec-aware developer, cloud security associate).  
**Lab environment:** One Kali Linux virtual machine (VMware/VirtualBox/Hyper-V) on an **isolated host-only or NAT lab network**. **Never** probe or attack systems you do not own or lack **written authorization** to test.  
**Ethics:** Treat every exercise as if it were under a formal Rules of Engagement (RoE). Document scope, stop conditions, and evidence handling.

---

## How to convert this file into Learn-Hub lessons

Use one **course track** with **units** = levels (`Level 1 — Foundations` … `Level 5 — Heavy advanced`). Map each `### Lx-yy` block to one lesson object:

| Markdown pattern | Learn-Hub field |
|------------------|-----------------|
| `### L1-01: Title` | `title` (strip `L1-01:` prefix for display if you prefer) |
| `id: lh-sec-l1-01` (in HTML comment above lesson) | `id` |
| `**Unit:**` line | `unit` |
| Body HTML from Markdown | `narrative` (run through your MD→HTML pipeline like Tech+ chapters) |
| `#### Kali lab` sections | Optional `kind: "learn"` + embed in narrative; or split into separate `kind` if you add security labs workspace later |

**Quiz import:** Each level’s `## Question bank — Level N` uses `Q1`… with **Answer key** at end of that section — suitable for Tech+ style MCQ JSON or `ws-tech` check-in blocks.

**Stable IDs:** Lesson IDs `lh-sec-l1-01` … `lh-sec-l5-15` are reserved in comments below for build scripts.

---

# Level 1 — Foundations (CIA, risk language, safe computing)

**Workplace outcomes:** You can join stand-ups and tickets using correct vocabulary; you recognize phishing and unsafe data handling; you know when to escalate.

<!-- id: lh-sec-l1-01 -->
### L1-01: What “security” means at work
**Outcomes:** Define security as managed risk to information and systems, not “locks on everything.”  
**Workplace:** Security is a business function; you align controls to impact and regulation.  
**Core ideas:** Threats exploit vulnerabilities; controls reduce likelihood or impact; residual risk remains.  
**Kali lab (10 min):** Open a terminal. Run `whoami`, `id`, `uname -a`. In one paragraph, explain which account type you are using and why admin/root is risky for daily browsing.

<!-- id: lh-sec-l1-02 -->
### L1-02: Confidentiality, integrity, availability (CIA)
**Outcomes:** Name CIA; give one workplace example of each being violated.  
**Workplace:** SLAs and incident severity often map to availability; fraud to integrity; leaks to confidentiality.  
**Kali lab:** List three services: `systemctl list-units --type=service | head`. Pick one; describe how its failure hurts **A**, misconfiguration **I**, or exposure **C**.

<!-- id: lh-sec-l1-03 -->
### L1-03: Authenticity and non-repudiation
**Outcomes:** Contrast “who you are” (identity) with “proof you said it” (non-repudiation).  
**Workplace:** Email signing, audit logs, transaction records.  
**Kali lab:** Run `journalctl -b | tail -n 20`. Identify one line that supports accountability.

<!-- id: lh-sec-l1-04 -->
### L1-04: Privacy vs security
**Outcomes:** Explain that privacy is about people; security protects assets including PII.  
**Workplace:** GDPR/CCPA-style rights; data minimization.  
**Kali lab:** Create a dummy file `echo "fake PII" > ~/lab-pii.txt`; set permissions `chmod 600 ~/lab-pii.txt`; verify with `ls -l`.

<!-- id: lh-sec-l1-05 -->
### L1-05: Threat, vulnerability, exploit, control
**Outcomes:** Use each term in a sentence without mixing them up.  
**Workplace:** Vulnerability management tickets; patch SLAs.  
**Kali lab:** Run `apt-cache policy openssl | head -n 15`. Note installed vs candidate version language.

<!-- id: lh-sec-l1-06 -->
### L1-06: Risk = likelihood × impact (qualitative)
**Outcomes:** Plot a simple 3×3 risk matrix story for one asset.  
**Workplace:** Risk registers; “accept vs mitigate.”  
**Kali lab:** Write a 5-row markdown table in `~/risk-example.md`: asset, threat, vuln, control, residual risk.

<!-- id: lh-sec-l1-07 -->
### L1-07: Least privilege and separation of duties
**Outcomes:** Define both; give a finance + IT example.  
**Workplace:** SoD for payment approval; break-glass accounts.  
**Kali lab:** Run `groups`. List one group you would remove from a normal user in production.

<!-- id: lh-sec-l1-08 -->
### L1-08: Passwords and password managers
**Outcomes:** Explain length > complexity; MFA as the real control.  
**Workplace:** Enterprise IdP; banned password lists.  
**Kali lab:** Install `keepassxc` if allowed, or document why corp policy uses vault X. Hash a test string: `echo -n "lab" | sha256sum`.

<!-- id: lh-sec-l1-09 -->
### L1-09: Multi-factor authentication (MFA) patterns
**Outcomes:** List factors (knowledge, possession, inherence); recognize MFA bypass tricks at high level.  
**Workplace:** Conditional access; phishing-resistant FIDO2.  
**Kali lab:** Research (read-only) `man pam_unix` skim — note “authentication stack” idea; 3-bullet summary.

<!-- id: lh-sec-l1-10 -->
### L1-10: Phishing and social engineering basics
**Outcomes:** List red flags; know reporting path.  
**Workplace:** SOC email triage; user awareness metrics.  
**Kali lab:** Open a **local** HTML file you author with a benign “fake login” — describe 3 UX cues that differ from real SSO pages.

<!-- id: lh-sec-l1-11 -->
### L1-11: Malware families at a glance
**Outcomes:** Distinguish virus, worm, trojan, ransomware, cryptominer, spyware.  
**Workplace:** EDR alerts often use these buckets.  
**Kali lab:** `ls /usr/share/metasploit-framework/modules/payloads 2>/dev/null | head` — **do not** generate traffic; note organization of payloads as a taxonomy exercise.

<!-- id: lh-sec-l1-12 -->
### L1-12: Physical security and clean desk
**Outcomes:** Tailgating, badge cloning (concept), device locks.  
**Workplace:** Data center access; visitor logs.  
**Kali lab:** Set screen lock timeout in desktop settings; screenshot policy note (redact).

<!-- id: lh-sec-l1-13 -->
### L1-13: Backups and recovery goals (RPO/RTO)
**Outcomes:** Define RPO/RTO; 3-2-1 rule.  
**Workplace:** DR tabletop exercises.  
**Kali lab:** `tar czf ~/lab-backup.tgz ~/lab-pii.txt`; verify `tar tzf ~/lab-backup.tgz`.

<!-- id: lh-sec-l1-14 -->
### L1-14: Patching and secure configuration
**Outcomes:** Why delay windows exist; test rings.  
**Workplace:** Change management; CAB.  
**Kali lab:** `apt list --upgradable 2>/dev/null | head`; document one package and one risk of upgrading without testing.

<!-- id: lh-sec-l1-15 -->
### L1-15: Security policies you will actually read
**Outcomes:** AUP, acceptable encryption, incident reporting, data classification.  
**Workplace:** Onboarding; insider risk.  
**Kali lab:** Draft a 1-page “lab RoE” for yourself: allowed targets (your VM only), forbidden actions, logging expectations.

## Lab pack — Level 1 (Kali VM, isolated network)

1. **Identity baseline:** Document users/groups; enable lock screen; remove unnecessary services from startup list (read-only survey).  
2. **Evidence hygiene:** Create `~/cases/2026-lab-01/`; copy one log excerpt with hash: `sha256sum` the file.  
3. **Network sanity:** `ip a`, `ip r`; draw ASCII diagram host → gateway → internet (or host-only).  
4. **Update discipline:** Simulate CAB: write test plan for one security update before `apt upgrade` (or document why withheld).  
5. **Phishing response:** Write a 10-line employee-facing “report suspicious email” procedure.

## Question bank — Level 1

**Q1.** Which pillar of CIA is most directly harmed by ransomware encrypting files?  
**Q2.** Non-repudiation is primarily supported by: (a) longer passwords (b) audit trails and signatures (c) RAID.  
**Q3.** Least privilege means: (a) everyone is admin (b) minimum rights to do the job (c) maximum logging.  
**Q4.** A vulnerability is: (a) a threat actor (b) a weakness that can be exploited (c) a firewall rule.  
**Q5.** RPO measures: (a) max downtime (b) max acceptable data loss window (c) password rotation.  
**Q6.** MFA requires at least: (a) one factor (b) two independent factors (c) biometrics only.  
**Q7.** 3-2-1 backups refer partly to: (a) three admins (b) copies across media and off-site (c) three firewalls.  
**Q8.** Tailgating is a: (a) network scan (b) physical access tactic (c) SQL attack.  
**Q9.** Privacy differs from security because: (a) they are identical (b) privacy centers on personal data rights (c) privacy ignores law.  
**Q10.** Separation of duties reduces: (a) availability (b) fraud and error by collusion (c) encryption strength.  
**Q11.** A trojan’s hallmark is: (a) self-propagation without user (b) disguised malicious payload (c) only physical damage.  
**Q12.** Integrity violation example: (a) DDoS (b) unauthorized ledger edit (c) stolen laptop only if powered off.  
**Q13.** `chmod 600` on a key file helps: (a) availability (b) confidentiality on a multi-user system (c) routing.  
**Q14.** Risk treatment “accept” means: (a) ignore forever (b) documented decision to tolerate risk (c) delete asset.  
**Q15.** Incident “first response” often includes: (a) silent deletion of logs (b) preserve evidence and notify chain (c) pay ransom immediately.  
**Q16.** Patch testing rings commonly: (a) skip dev (b) dev → test → prod (c) prod only.  
**Q17.** PII examples include: (a) public weather (b) government ID numbers (c) anonymous aggregate stats.  
**Q18.** Security policy’s role: (a) replace technical controls (b) set expectations and requirements (c) block all email.  
**Q19.** A worm differs from a virus mainly by: (a) color (b) autonomous spreading (c) needing paper.  
**Q20.** Availability control example: (a) RAID + redundant power (b) posting passwords (c) disabling backups.

### Answer key — Level 1
1. **Availability** — encryption that denies access to data is primarily an availability hit (integrity of plaintext can also be argued; in workplace triage, “cannot work” is **A**).  
2–5: B / B / B / B  
6–10: B / B / B / B / B  
11–15: B / B / B / B / B  
16–20: B / B / B / B / B

---

# Level 2 — Intermediate (networks, crypto vocabulary, common attacks)

**Workplace outcomes:** You can read firewall tickets, TLS errors, and basic vuln scan output; you know OWASP names at a headline level.

<!-- id: lh-sec-l2-01 -->
### L2-01: TCP/IP model and trust boundaries
**Outcomes:** Map segments, subnets, DMZ, zero trust hint.  
**Kali lab:** `ss -tuln | head -n 30`; identify three listening ports and likely services.

<!-- id: lh-sec-l2-02 -->
### L2-02: Firewalls, ports, and allowlists
**Outcomes:** Default-deny; stateful inspection concept.  
**Kali lab:** If `ufw` present: `ufw status`; otherwise document `iptables -S 2>/dev/null | head`.

<!-- id: lh-sec-l2-03 -->
### L2-03: TLS/HTTPS — certificates, chain, hostname check
**Outcomes:** Why TLS termination matters; common misconfigurations.  
**Kali lab:** `openssl s_client -connect example.com:443 -servername example.com </dev/null 2>/dev/null | openssl x509 -noout -subject -dates` (read-only to public site).

<!-- id: lh-sec-l2-04 -->
### L2-04: DNS basics and DNS abuse (spoofing, cache poison — concept)
**Outcomes:** Describe how wrong DNS breaks trust.  
**Kali lab:** `dig +short A example.com` and `dig +short TXT _dmarc.example.com` — interpret DMARC presence.

<!-- id: lh-sec-l2-05 -->
### L2-05: VPN goals and limits (“VPN is not anonymity by default”)
**Outcomes:** Tunnel vs policy enforcement; split tunnel risks.  
**Kali lab:** Document your VM’s default route and MTU: `ip r`; `ping -c 3 1.1.1.1`.

<!-- id: lh-sec-l2-06 -->
### L2-06: Email security (SPF, DKIM, DMARC) at SOC level
**Outcomes:** What each solves; alignment failures.  
**Kali lab:** Pick **your** domain if authorized, else `example.com` headers in received email (sanitized screenshot).

<!-- id: lh-sec-l2-07 -->
### L2-07: Hashing vs encryption vs encoding
**Outcomes:** One-way vs reversible vs representation.  
**Kali lab:** `echo -n test | md5sum` vs `openssl enc -aes-256-cbc -pbkdf2 -pass pass:lab -in /etc/hosts -out ~/enc.bin` then explain which is reversible.

<!-- id: lh-sec-l2-08 -->
### L2-08: Symmetric vs asymmetric crypto
**Outcomes:** Speed, key distribution, hybrid TLS.  
**Kali lab:** `openssl pkey -in /etc/ssl/certs/ssl-cert-snakeoil.pem 2>/dev/null` (may fail) — instead `ls /etc/ssl/certs | head` and note PEM as text format.

<!-- id: lh-sec-l2-09 -->
### L2-09: Digital signatures and PKI roles (CA, RA, subscriber)
**Outcomes:** Why private keys must stay protected.  
**Kali lab:** `ls -l /etc/ssl/private 2>/dev/null` — note permissions pattern.

<!-- id: lh-sec-l2-10 -->
### L2-10: OWASP Top 10 recognition (2021)
**Outcomes:** Name 5 categories with one-line meaning.  
**Kali lab:** Offline reading of OWASP page PDF save in `~/refs/` + 10 bullet summary.

<!-- id: lh-sec-l2-11 -->
### L2-11: Injection (SQLi) concept and defense
**Outcomes:** Parameterized queries, ORM pitfalls.  
**Kali lab:** On **local** DVWA if installed with auth; **otherwise** write 2 safe vs 2 unsafe pseudo-queries in `sqli-notes.md` — no live exploitation outside scope.

<!-- id: lh-sec-l2-12 -->
### L2-12: XSS (stored/reflected/DOM) and CSP as mitigation
**Outcomes:** Explain trust of input vs output encoding.  
**Kali lab:** Minimal `index.html` echoing `location.hash` — describe attack line without hosting publicly.

<!-- id: lh-sec-l2-13 -->
### L2-13: CSRF and anti-CSRF tokens
**Outcomes:** Why state-changing POSTs need protection.  
**Kali lab:** Diagram cookie + cross-site POST flow in ASCII.

<!-- id: lh-sec-l2-14 -->
### L2-14: Authentication vs session fixation/hijacking
**Outcomes:** Rotate session on login; Secure/HttpOnly/SameSite cookies.  
**Kali lab:** `curl -I https://example.com 2>/dev/null | grep -i set-cookie` — note flags if any.

<!-- id: lh-sec-l2-15 -->
### L2-15: Security headers (HSTS, X-Frame-Options, CSP)
**Outcomes:** Map header to attack class.  
**Kali lab:** `curl -sI https://example.com | egrep -i 'strict-transport|content-security|x-frame|x-content-type'`.

## Lab pack — Level 2

1. **Passive footprinting (authorized):** On domains you own or `example.com`, collect DNS, TLS cert dates, HTTP headers; 1-page OSINT-style report (ethical).  
2. **Service inventory:** Map listeners to purpose; mark “unnecessary” candidates.  
3. **TLS inspection:** Document chain depth for one SaaS API your org uses (if permitted).  
4. **Cookie policy review:** Find SameSite defaults in framework docs you use at work.  
5. **Secure coding fix:** Rewrite one dynamic SQL into parameterized pseudocode.

## Question bank — Level 2

**Q1.** Stateful firewall primarily tracks: (a) only MAC (b) connection state (c) CPU temperature.  
**Q2.** TLS provides primarily: (a) disk compression (b) confidentiality + integrity on the wire (c) physical locks.  
**Q3.** SPF validates: (a) HTML (b) sending IP for domain (c) TLS cipher.  
**Q4.** DKIM proves: (a) message tampering detection via signing (b) password strength (c) disk free space.  
**Q5.** DMARC builds on: (a) SPF and/or DKIM alignment (b) RAID (c) BIOS passwords only.  
**Q6.** Hashing is mainly: (a) reversible (b) one-way fingerprinting (c) same as encoding.  
**Q7.** Asymmetric keys help with: (a) faster bulk disk wipe (b) key agreement/signing without shared secret (c) RAID parity.  
**Q8.** SQLi safest fix pattern: (a) more regex (b) parameterized queries (c) longer passwords only.  
**Q9.** Stored XSS executes in: (a) DNS resolver (b) victim browser context (c) printer firmware only.  
**Q10.** CSRF abuses: (a) victim’s ambient auth to forge actions (b) weak TLS (c) RAID 0.  
**Q11.** `HttpOnly` cookies mitigate: (a) XSS token theft from JS (b) SQLi (c) BGP hijacks.  
**Q12.** HSTS mitigates: (a) SSLstrip/downgrade (b) SQLi (c) weak BIOS.  
**Q13.** CSP primarily reduces: (a) XSS impact (b) disk failure (c) power outages.  
**Q14.** Default-deny firewall means: (a) allow all then block (b) block unless explicitly allowed (c) no logging.  
**Q15.** VPN primarily provides: (a) cryptographic tunnel between endpoints (b) guaranteed malware removal (c) immutable logs.  
**Q16.** DNS cache poisoning conceptually: (a) wrong answers cached (b) stronger passwords (c) TPM attestation.  
**Q17.** Hybrid TLS uses asymmetric for: (a) bulk data only (b) key exchange/signatures then symmetric session keys (c) printing.  
**Q18.** Session fixation defense includes: (a) reusing pre-auth session IDs (b) rotate session ID after successful login (c) disable HTTPS.  
**Q19.** `SameSite=Lax/Strict` reduces: (a) some cross-site cookie sends (b) disk encryption (c) RAID overhead.  
**Q20.** Encoding (e.g., Base64) provides: (a) confidentiality (b) representation, not security (c) integrity.

### Answer key — Level 2
1–5: B/B/B/A/A  
6–10: B/B/B/B/A  
11–15: A/A/A/B/A  
16–20: A/B/B/B/B  

---

# Level 3 — Advanced (assessment, logging, IAM, vuln lifecycle)

**Workplace outcomes:** You can support vulnerability management, parse scanner findings, explain IAM policies, and follow IR hygiene.

<!-- id: lh-sec-l3-01 -->
### L3-01: Vulnerability management lifecycle
**Outcomes:** Discover → prioritize → remediate → verify → report.  
**Kali lab:** Install/read `man debsecan` or run `sudo apt-get install -y debsecan` in lab VM only; `debsecan --suite bookworm 2>/dev/null | head` (suite must match).

<!-- id: lh-sec-l3-02 -->
### L3-02: CVE, CWE, CVSS v3 at a glance
**Outcomes:** Read base score metrics (AV, AC, PR, UI, S, C, I, A).  
**Kali lab:** Pick one CVE from https://nvd.nist.gov/ (offline copy OK); fill CVSS vector string meaning in your words.

<!-- id: lh-sec-l3-03 -->
### L3-03: Secure baselines and CIS benchmarks
**Outcomes:** Hardening vs functionality tradeoffs.  
**Kali lab:** Download CIS PDF summary table (if licensed) or public STIG overview; 10 control bullets for SSH.

<!-- id: lh-sec-l3-04 -->
### L3-04: SSH hardening checklist
**Outcomes:** Key-based auth, PermitRootLogin, ciphers, AllowUsers.  
**Kali lab:** `grep -E '^(PermitRootLogin|PasswordAuthentication|AllowUsers)' /etc/ssh/sshd_config` — document current values (do not lock yourself out).

<!-- id: lh-sec-l3-05 -->
### L3-05: Linux file permissions and ACLs (concept)
**Outcomes:** `rwx`, special bits high level, `getfacl` when needed.  
**Kali lab:** `touch ~/acltest && chmod 640 ~/acltest && ls -l ~/acltest`; explain group read risk on shared hosts.

<!-- id: lh-sec-l3-06 -->
### L3-06: `sudo` and privilege escalation mindset (defender view)
**Outcomes:** Why unrestricted sudo is dangerous; logging to central SIEM.  
**Kali lab:** `sudo -l` — list allowed commands; write one abuse scenario **without** executing it.

<!-- id: lh-sec-l3-07 -->
### L3-07: Syslog/journald and remote log shipping idea
**Outcomes:** Tamper-aware logging; time sync (NTP) for correlation.  
**Kali lab:** `timedatectl status`; `journalctl -u ssh --since "1 hour ago" | tail -n 15`.

<!-- id: lh-sec-l3-08 -->
### L3-08: SIEM concepts — parsing, correlation rules, noise
**Outcomes:** Detection vs prevention; false positives.  
**Kali lab:** Write three Sigma-style pseudo-rules (plaintext) for: brute force SSH, new user added, outbound connection to rare port.

<!-- id: lh-sec-l3-09 -->
### L3-09: IDS/IPS placement and TLS visibility problem
**Outcomes:** East-west vs north-south; decryption ethics/legal.  
**Kali lab:** ASCII diagram with tap, IPS inline, and TLS bump caveats.

<!-- id: lh-sec-l3-10 -->
### L3-10: MITRE ATT&CK as a common language
**Outcomes:** Tactics vs techniques; sub-techniques; procedures.  
**Kali lab:** Pick technique `T1059` (read site); map to one log source you have in lab.

<!-- id: lh-sec-l3-11 -->
### L3-11: Threat modeling STRIDE (developer collaboration)
**Outcomes:** Spoofing, Tampering, Repudiation, Information disclosure, DoS, Elevation.  
**Kali lab:** STRIDE table for “password reset” feature with one mitigation per row.

<!-- id: lh-sec-l3-12 -->
### L3-12: IAM — RBAC vs ABAC
**Outcomes:** When attributes beat static roles.  
**Kali lab:** Sketch AWS-style JSON policy allowing `s3:GetObject` only on `arn:.../prefix/${aws:PrincipalTag/team}`.

<!-- id: lh-sec-l3-13 -->
### L3-13: OAuth2 / OIDC flows (authorization code + PKCE)
**Outcomes:** Tokens, audiences, scopes; common misconfigurations.  
**Kali lab:** Sequence diagram: user, browser, IdP, client, resource server — 6 numbered steps.

<!-- id: lh-sec-l3-14 -->
### L3-14: Secrets management (vaults, rotation, no keys in git)
**Outcomes:** Short-lived credentials; break-glass.  
**Kali lab:** `git log --all --full-history -- "*.env" 2>/dev/null | head` on a dummy repo — explain blast radius.

<!-- id: lh-sec-l3-15 -->
### L3-15: Incident response phases (NIST-style)
**Outcomes:** Prepare, detect, analyze, contain, eradicate, recover, post-incident.  
**Kali lab:** Create `~/ir-playbook-mini.md` with roles: IC, tech lead, comms, legal — RACI snippet.

## Lab pack — Level 3

1. **Vuln triage simulation:** Given 5 fake CVE rows (make up), assign priority using CVSS + exploitability + asset criticality table.  
2. **SSH review:** Export sanitized `sshd -T` effective config if available; circle 5 hardening opportunities.  
3. **Log correlation:** Merge SSH logs + `auth.log` style entries; write one timeline paragraph.  
4. **ATT&CK navigator export (optional):** Build tiny layer JSON for 10 techniques relevant to your org’s stack (concept).  
5. **Secret scan:** Run `trufflehog filesystem --directory .` only on a **synthetic** repo you create with fake keys — verify detection.

## Question bank — Level 3

**Q1.** CVSS base score communicates: (a) legal liability (b) technical severity snapshot (c) stock price.  
**Q2.** CVE identifies: (a) a specific vulnerability instance (b) a standardized ID for a vuln (c) a firewall SKU.  
**Q3.** CIS benchmarks are: (a) malware (b) configuration hardening guidance (c) TLS cipher lists only.  
**Q4.** `PermitRootLogin no` primarily reduces: (a) DNS leaks (b) high-impact credential abuse (c) GPU theft.  
**Q5.** SIEM correlation aims to: (a) replace firewalls (b) detect multi-event patterns (c) encrypt disks.  
**Q6.** IDS vs IPS: (a) IPS can actively block inline (b) identical always (c) IDS only for Wi-Fi.  
**Q7.** MITRE technique vs tactic: (a) same (b) tactic is goal; technique is how (c) tactic is CVE.  
**Q8.** STRIDE “Spoofing” mitigations often include: (a) weaker TLS (b) authentication (c) deleting logs.  
**Q9.** RBAC maps permissions to: (a) job function/role (b) CPU stepping (c) DHCP lease time.  
**Q10.** PKCE mainly protects: (a) public OAuth clients in code flow (b) RAID (c) BIOS.  
**Q11.** Vault rotation reduces: (a) blast radius of leaked creds (b) need for MFA (c) RAM size.  
**Q12.** NTP importance for logs: (a) pretty fonts (b) correlation across systems (c) GPU render.  
**Q13.** `sudo -l` helps auditors see: (a) kernel modules only (b) permitted privilege commands (c) Wi-Fi SSID.  
**Q14.** Remote syslog goal: (a) slower apps (b) attacker cannot cover tracks on host only (c) replace MFA.  
**Q15.** Threat modeling timing: (a) only after breach (b) design phase and changes (c) never for APIs.  
**Q16.** ABAC can use: (a) attributes like department, clearance, resource tags (b) only usernames (c) only file size.  
**Q17.** Incident “containment” means: (a) press release only (b) limit spread/damage (c) delete all servers.  
**Q18.** TLS inspection appliances raise: (a) privacy and legal considerations (b) no issues (c) only GPU issues.  
**Q19.** CWE helps: (a) classify weakness types (b) assign stock tickers (c) replace CVSS.  
**Q20.** Principle “verify remediation” means: (a) rescan/retest after fix (b) assume fixed (c) hide tickets.

### Answer key — Level 3
1–5: B/B/B/B/B  
6–10: B/B/B/B/A  
11–15: B/B/B/B/A  
16–20: A/B/A/A/A  

---

# Level 4 — Expert (enterprise identity, cloud, detection engineering, forensics hygiene)

**Workplace outcomes:** You can discuss AD/Azure patterns, cloud IAM guardrails, detection as code, and evidence handling with IT/legal.

<!-- id: lh-sec-l4-01 -->
### L4-01: Active Directory basics for defenders
**Outcomes:** DC, Kerberos tickets concept, LDAP, GPO.  
**Kali lab:** Read-only lab: if you have authorized AD lab, enumerate **with tool policy**; else write 10-term glossary with relationships.

<!-- id: lh-sec-l4-02 -->
### L4-02: Kerberoasting / AS-REP roasting (detection angle)
**Outcomes:** What noisy events look like; service account hygiene.  
**Kali lab:** List detections: weak RC4 usage, unusual TGS requests — no offensive execution without lab DC + permission.

<!-- id: lh-sec-l4-03 -->
### L4-03: Pass-the-hash mitigations (tiering, LAPS, Protected Users)
**Outcomes:** Why credential theft is endemic on Windows estates.  
**Kali lab:** Microsoft docs summary 15 lines + your org’s equivalent controls field.

<!-- id: lh-sec-l4-04 -->
### L4-04: Azure AD / Entra ID concepts (tenant, CA policies, PIM)
**Outcomes:** Conditional Access signals; break-glass accounts monitored.  
**Kali lab:** Portal walkthrough on **personal** tenant or screenshots from training — no customer data.

<!-- id: lh-sec-l4-05 -->
### L4-05: AWS IAM policy evaluation mental model
**Outcomes:** Explicit deny wins; SCP vs identity vs resource policy (high level).  
**Kali lab:** Write a policy that **denies** `s3:*` without `aws:MultiFactorAuthPresent=true` for `DenyExceptWithMFA` pattern (pseudo-json).

<!-- id: lh-sec-l4-06 -->
### L4-06: Cloud logging — CloudTrail / Azure Activity / GCP Audit Logs
**Outcomes:** Who changed IAM when; immutability options.  
**Kali lab:** Table comparing “control plane” vs “data plane” logs for one service (S3/Azure Blob).

<!-- id: lh-sec-l4-07 -->
### L4-07: Container and Kubernetes risk surface (not full CKA)
**Outcomes:** Image trust, root in container, seccomp/AppArmor, network policies idea.  
**Kali lab:** `docker info 2>/dev/null | head` or `podman info`; note rootless mode if present.

<!-- id: lh-sec-l4-08 -->
### L4-08: Supply chain security (SBOM, SLSA, signing)
**Outcomes:** Why hashes aren’t enough; provenance.  
**Kali lab:** `syft packages dir:/usr/share/doc -o json 2>/dev/null | head` (if installed) or document manual SBOM fields.

<!-- id: lh-sec-l4-09 -->
### L4-09: Detection engineering — data quality, observability, unit tests for rules
**Outcomes:** Detection is software engineering.  
**Kali lab:** Pick one atomic test from Atomic Red Team **read-only**; write expected log field + rule pseudocode.

<!-- id: lh-sec-l4-10 -->
### L4-10: Purple teaming and tabletop exercises
**Outcomes:** Hypothesis-driven detection validation.  
**Kali lab:** 1-page scenario: ransomware via stolen VPN session — detection points + comms checklist.

<!-- id: lh-sec-l4-11 -->
### L4-11: Forensics chain of custody (hashing, write blockers, time)
**Outcomes:** Admissibility concepts; work order discipline.  
**Kali lab:** `dd if=/dev/zero of=~/dummy.img bs=1M count=5` then `sha256sum ~/dummy.img`; document who/when/where.

<!-- id: lh-sec-l4-12 -->
### L4-12: Memory and disk artifacts at high level (Volatility idea)
**Outcomes:** What RAM captures vs disk; volatility of evidence.  
**Kali lab:** Read Volatility3 docs intro; list 3 plugins and what analyst question they answer.

<!-- id: lh-sec-l4-13 -->
### L4-13: EDR behavior: telemetry, response actions, rollback limits
**Outcomes:** Kernel callbacks vs userland hooks (conceptual).  
**Kali lab:** Vendor datasheet comparison table (your org’s EDR if allowed): 5 rows.

<!-- id: lh-sec-l4-14 -->
### L4-14: Data loss prevention (DLP) and insider risk programs
**Outcomes:** Technical + HR + legal balance; proportionality.  
**Kali lab:** Policy red-team: find 3 ways DLP can misfire on developer workflows.

<!-- id: lh-sec-l4-15 -->
### L4-15: Business continuity, IR retainers, cyber insurance caveats
**Outcomes:** “Not all incidents are claims”; sublimits for BEC.  
**Kali lab:** Read one insurer security questionnaire outline; map controls to NIST CSF functions.

## Lab pack — Level 4

1. **Cloud IAM review:** Draw trust boundaries for SaaS + IdP + IaaS; mark secret flows.  
2. **Detection gap analysis:** Pick 10 ATT&CK techniques; mark “logged / alerted / tuned / gap.”  
3. **Forensics dry run:** Image USB with dummy data; maintain custody form.  
4. **Purple mini:** Developer runs benign PowerShell obfuscation in **sandbox**; analyst writes detection tweak.  
5. **BCP table top:** 90-minute agenda doc with injects (comms failure, key person unavailable).

## Question bank — Level 4

**Q1.** Kerberos TGT is roughly: (a) DHCP lease (b) proof of auth to request service tickets (c) BIOS password.  
**Q2.** LAPS primarily: (a) rotates local admin passwords (b) encrypts Wi-Fi (c) replaces TLS.  
**Q3.** Conditional Access uses signals like: (a) device compliance, location, risk (b) only password length (c) printer DPI.  
**Q4.** SCP in AWS Organizations can: (a) restrict max permissions for accounts (b) replace IAM entirely (c) fix SQLi.  
**Q5.** CloudTrail captures mainly: (a) API control-plane activity (b) every disk block write always (c) GPU fan speed.  
**Q6.** SBOM helps: (a) track software components for incident response (b) replace pentesting (c) remove MFA.  
**Q7.** Chain of custody ensures: (a) faster CPUs (b) evidence integrity and auditability (c) anonymous browsing.  
**Q8.** EDR differs from traditional AV partly by: (a) richer behavioral telemetry (b) no logs (c) only email.  
**Q9.** Purple team goal: (a) hide incidents (b) validate detections with controlled adversary behavior (c) delete backups.  
**Q10.** Insider risk programs should be: (a) covert only always (b) lawful, transparent, proportionate (c) solely technical.  
**Q11.** Write blockers protect: (a) integrity of acquired media (b) Wi-Fi speed (c) TLS handshakes.  
**Q12.** PIM / JIT admin reduces: (a) standing privileged access (b) MFA need (c) patch needs.  
**Q13.** `aws:MultiFactorAuthPresent` in Deny policies encourages: (a) MFA for sensitive APIs (b) weaker keys (c) BGP safety.  
**Q14.** Volatility-style analysis targets: (a) RAM artifacts (b) printer ink (c) DNS only.  
**Q15.** Cyber insurance does not remove: (a) need for security controls (b) accountants (c) CPUs.  
**Q16.** Kubernetes NetworkPolicy conceptually: (a) layer-3/4 segmentation for pods (b) TLS cipher suite (c) BIOS.  
**Q17.** SLSA focuses on: (a) supply chain integrity levels (b) Wi-Fi bands (c) SQL indexes.  
**Q18.** Detection engineering includes: (a) testing rules against representative data (b) ignoring false positives (c) deleting logs.  
**Q19.** GPO can enforce: (a) Windows security baselines (b) BGP attributes (c) GPU overclock only.  
**Q20.** BEC (business email compromise) primarily abuses: (a) trust in email + finance processes (b) RAID 5 (c) HDMI.

### Answer key — Level 4
1–5: B/A/A/A/A  
6–10: A/B/B/B/B  
11–15: A/A/A/A/A  
16–20: A/A/A/A/A  

---

# Level 5 — Heavy advanced (architecture, crypto attacks, hardware trust, formal assurance)

**Workplace outcomes:** You can participate in zero-trust design reviews, red-team scoping, crypto uplift projects, and high-assurance discussions without hand-waving.

<!-- id: lh-sec-l5-01 -->
### L5-01: Zero Trust Architecture (NIST SP 800-207 themes)
**Outcomes:** PDP/PEP, continuous verification, assume breach.  
**Kali lab:** ZT logical diagram for “admin access to production” with 6 controls labeled PDP/PEP.

<!-- id: lh-sec-l5-02 -->
### L5-02: Microsegmentation vs macro firewalling
**Outcomes:** Identity-based L4/L7 policy; east-west visibility.  
**Kali lab:** Compare two vendor reference architectures in bullets (no endorsement).

<!-- id: lh-sec-l5-03 -->
### L5-03: mTLS everywhere — operational costs
**Outcomes:** Cert rotation, SPIFFE/SPIRE idea.  
**Kali lab:** `openssl req -x509 -newkey rsa:2048 -keyout key.pem -out cert.pem -days 30 -nodes -subj "/CN=lab"` — **lab only**; describe rotation calendar.

<!-- id: lh-sec-l5-04 -->
### L5-04: Post-quantum cryptography (PQC) migration planning
**Outcomes:** Harvest-now-decrypt-later; hybrid schemes.  
**Kali lab:** Read NIST PQC round summary; list 3 inventory fields apps must capture (cipher suite, protocol version, cert chain).

<!-- id: lh-sec-l5-05 -->
### L5-05: Advanced TLS attacks (downgrade, Renegotiation, ROBOT — concept)
**Outcomes:** Why modern TLS configs ban old protocols.  
**Kali lab:** `nmap --script ssl-enum-ciphers -p 443 example.com` only if **permitted**; else annotate sample output explaining risk ranking.

<!-- id: lh-sec-l5-06 -->
### L5-06: Padding oracle / CBC misuse (developer-facing)
**Outcomes:** Authenticated encryption (AES-GCM, ChaCha20-Poly1305).  
**Kali lab:** Pseudocode showing encrypt-then-MAC vs AEAD; one paragraph on why MAC-then-encrypt is fragile.

<!-- id: lh-sec-l5-07 -->
### L5-07: Side channels (timing, cache) — awareness
**Outcomes:** Constant-time crypto need; Spectre/Meltdown class lessons.  
**Kali lab:** Read a CVE summary; explain attacker model (local vs remote) in 5 sentences.

<!-- id: lh-sec-l5-08 -->
### L5-08: TPM 2.0, measured boot, BitLocker/ LUKS interaction
**Outcomes:** Sealing keys to PCRs; anti-tamper chain.  
**Kali lab:** `systemd-cryptenroll --help 2>/dev/null | head` or read docs; note TPM token enrollment.

<!-- id: lh-sec-l5-09 -->
### L5-09: Confidential computing (TEEs, attestation)
**Outcomes:** Threat model: cloud provider admin vs workload.  
**Kali lab:** 10-line comparison: SGX-style vs SEV-style trust boundaries (high level).

<!-- id: lh-sec-l5-10 -->
### L5-10: Formal methods / specification — where they help
**Outcomes:** Protocol verification; limited scope wins.  
**Kali lab:** Find one published protocol verification (TLS 1.3 papers) — write 5-sentence abstract in your words.

<!-- id: lh-sec-l5-11 -->
### L5-11: Smart contract / Web3 security pitfalls (reentrancy, oracle manipulation)
**Outcomes:** Composability increases attack surface.  
**Kali lab:** Read OpenZeppelin reentrancy article; diagram call flow that is unsafe.

<!-- id: lh-sec-l5-12 -->
### L5-12: Kernel exploit mitigations (ASLR, KASLR, CET, CFI)
**Outcomes:** Depth vs performance; bypass economics.  
**Kali lab:** `cat /proc/sys/kernel/randomize_va_space` — interpret value.

<!-- id: lh-sec-l5-13 -->
### L5-13: Advanced persistent threat (APT) lifecycle and cyber kill chain
**Outcomes:** Merge kill chain with ATT&CK for reporting.  
**Kali lab:** Map one public **sanitized** IR report stages to ATT&CK tactics (citation).

<!-- id: lh-sec-l5-14 -->
### L5-14: Red team legal scope, RoE, safety checks (“stop triggers”)
**Outcomes:** Authorization boundaries; production safety.  
**Kali lab:** Write RoE appendix: prohibited techniques, evidence handling, comms tree.

<!-- id: lh-sec-l5-15 -->
### L5-15: Security metrics that are not vanity
**Outcomes:** MTTD/MTTR, coverage % of ATT&CK, vuln age SLAs, phishing sim click rate trends.  
**Kali lab:** Dashboard wireframe (ASCII) with 6 KPIs and data sources.

## Lab pack — Level 5

1. **Zero-trust design review:** Pick internal app; list 15 control gaps vs ZT principles; propose phased roadmap (people/process/tech).  
2. **Crypto inventory:** Spreadsheet of all TLS endpoints with cipher suite allowlist proposal.  
3. **PQC readiness workshop:** Agenda + stakeholder list (app owners, PKI team, network).  
4. **Attestation deep dive:** Read confidential computing vendor whitepaper; 2-page threat model “honest but curious provider.”  
5. **Red team dry run:** Tabletop legal + out-of-band comms + “customer impact” stop trigger.

## Question bank — Level 5

**Q1.** Zero Trust replaces perimeter-only trust with: (a) no encryption (b) continuous explicit verification (c) single password.  
**Q2.** mTLS primarily adds: (a) client authentication via certificates (b) GPU acceleration (c) RAID 6.  
**Q3.** PQC addresses: (a) quantum threat to asymmetric schemes (b) slow HDD (c) SMTP banners.  
**Q4.** AEAD modes aim to provide: (a) confidentiality+integrity together (b) only compression (c) only key escrow.  
**Q5.** TPM sealing ties keys to: (a) PCR measurements / platform state (b) Wi-Fi SSID only (c) DHCP pool.  
**Q6.** Confidential computing mitigates: (a) malicious cloud admin reading memory of enclave (model-dependent) (b) all phishing (c) BGP only.  
**Q7.** ASLR mainly mitigates: (a) memory corruption exploitation reliability (b) SQLi (c) weak DNS TTL.  
**Q8.** Padding oracle class attacks target: (a) bad MAC/unauthenticated decryption (b) RAID (c) MFA apps.  
**Q9.** Red team engagement requires: (a) written authorization + scope (b) dark web account (c) domain purchase only.  
**Q10.** SPIFFE helps: (a) cryptographic identity for workloads (b) printer sharing (c) BIOS passwords.  
**Q11.** Microsegmentation often leverages: (a) identity-aware L4/L7 policy (b) only physical keys (c) VGA only.  
**Q12.** “Harvest now, decrypt later” motivates: (a) early PQC migration for long-lived secrets (b) deleting TLS (c) disabling logs.  
**Q13.** Smart contract reentrancy is fundamentally: (a) unsafe external call ordering/state updates (b) SQL join (c) RAID stripe.  
**Q14.** Formal verification is strongest when: (a) scope is well-defined protocol/properties (b) applied to “all possible apps” loosely (c) replacing pentests entirely always.  
**Q15.** Measured boot helps detect: (a) firmware/bootloader tampering (b) weak Wi-Fi password only (c) printer jams.  
**Q16.** ZT PDP/PEP means: (a) policy decision/enforcement points (b) disk partitions (c) DNS TTL fields.  
**Q17.** KASLR extends ASLR to: (a) kernel memory layout randomization (b) cookies (c) SMTP.  
**Q18.** Oracle manipulation in DeFi refers to: (a) untrusted price/input feeds (b) TLS OCSP (c) TPM counters.  
**Q19.** MTTR is: (a) mean time to remediate/recover from incident (b) mean time to rotate wallpaper (c) MAC time to live.  
**Q20.** “Safety checks” in red teaming include: (a) stop triggers for customer harm (b) deleting evidence (c) disabling EDR always.

### Answer key — Level 5
1–5: B/A/A/A/A  
6–10: A/A/A/A/A  
11–15: A/A/A/A/A  
16–20: A/A/A/A/A  

---

# Capstone — End examination (all levels)

**Instructions:** Closed book unless your instructor allows NVD/MITRE docs. 60 questions, ~120 minutes. Select the best single answer unless noted.

**Section A — Foundations (L1) — Q1–12**  
1. Which is the clearest **availability** impact? (a) ransomware denies access to files until recovery (b) wrong file owner on `chmod` (c) expired TLS on an internal-only tool with no outage.  
2. Integrity example: (a) DDoS (b) altered database row (c) stolen laptop powered off.  
3. Accounting in AAA refers to: (a) finance department (b) logging/auditing of actions (c) antivirus scans.  
4. MFA bypass awareness: (a) impossible (b) push fatigue/MFA phishing exists (c) only nation-states.  
5. Least privilege: (a) grant admin to devs for speed (b) minimal rights (c) shared root passwords.  
6. RTO is: (a) max acceptable downtime (b) max data loss (c) password age.  
7. Patch ring strategy: (a) prod first always (b) progressive rollout with validation (c) never patch.  
8. Clean desk: (a) irrelevant (b) reduces sensitive data exposure (c) replaces encryption.  
9. Social engineering: (a) only email (b) any human manipulation tactic (c) only SQLi.  
10. Risk “mitigate”: (a) add controls (b) ignore (c) delete customers.  
11. PII: (a) aggregate weather trends (b) passport number (c) anonymous telemetry with no link.  
12. Incident escalation: (a) post publicly first (b) follow playbooks and legal guidance (c) pay silently always.

**Section B — Intermediate (L2) — Q13–24**  
13. TLS provides: (a) magic anonymity (b) channel security between endpoints if verified (c) disk encryption always.  
14. HSTS fights: (a) SSL stripping (b) SQLi (c) weak Wi-Fi.  
15. `SameSite` reduces: (a) some CSRF scenarios (b) TLS need (c) RAID overhead.  
16. Parameterized queries mitigate: (a) SQLi (b) BGP hijack (c) BIOS password loss.  
17. CSP reduces impact of: (a) XSS (b) RAID 0 failures (c) DHCP.  
18. DKIM proves: (a) signing integrity (b) SPF alignment only (c) GPU brand.  
19. DMARC policy `p=reject` means: (a) accept all (b) instruct receivers to reject fails (c) encrypt mail at rest only.  
20. Encoding Base64: (a) secrecy (b) not secrecy (c) integrity.  
21. Default-deny firewall: (a) allow all (b) deny unless allowed (c) log only never block.  
22. Session fixation fix: (a) reuse IDs (b) rotate session on login (c) disable cookies.  
23. VPN split tunnel risk: (a) corporate traffic bypasses security controls (b) always safer (c) removes MFA.  
24. Symmetric crypto in TLS bulk data: (a) true (b) false (c) only for DNS.

**Section C — Advanced (L3) — Q25–36**  
25. CVSS is: (a) legal severity (b) technical scoring framework (c) patch file format.  
26. CVE is: (a) weakness taxonomy (b) vuln ID (c) firewall log code.  
27. MITRE ATT&CK tactic describes: (a) why adversary goal category (b) CVE number (c) patch CAB.  
28. STRIDE repudiation mitigation examples: (a) signatures/audit trails (b) longer Wi-Fi range (c) RAID 1.  
29. `sudo` logging important for: (a) accountability (b) GPU FPS (c) DHCP speed.  
30. SIEM value: (a) correlate events (b) replace IdP (c) encrypt laptops automatically.  
31. IDS sensor placement on encrypted east-west without decryption: (a) full content always visible (b) limited visibility; design matters (c) impossible to place.  
32. IR containment: (a) announce on social first (b) isolate affected systems (c) delete logs to save disk.  
33. IAM SCP: (a) AWS org guardrail (b) Linux file ACL (c) SMTP header.  
34. Remote syslog helps: (a) attacker-only logs (b) central tamper resistance (c) remove MFA.  
35. Threat modeling best timing: (a) design (b) never (c) only post-breach PR.  
36. OAuth PKCE protects: (a) public clients in auth code flow (b) printers (c) RAID.

**Section D — Expert (L4) — Q37–48**  
37. Kerberos service tickets relate to: (a) individual services/resources (b) DHCP (c) HDMI-CEC.  
38. LAPS addresses: (a) predictable local admin passwords (b) SQL indexes (c) SMTP TLS.  
39. Conditional Access may block login if: (a) risky sign-in + non-compliant device (b) username has vowels (c) always never blocks.  
40. CloudTrail-like logs capture: (a) management events (b) every S3 object read always in all cases (c) GPU temperature.  
41. Chain of custody supports: (a) evidence credibility (b) faster Wi-Fi (c) SQL performance.  
42. EDR value: (a) behavioral telemetry + response (b) replaces policy (c) removes logging need.  
43. Purple teaming: (a) validate detections with controlled tests (b) hide malware (c) delete backups.  
44. Insider risk must consider: (a) law and proportionality (b) only tech blocks (c) ignore HR.  
45. SBOM helps during: (a) supply chain incident triage (b) monitor refresh rate (c) BGP only.  
46. PIM reduces: (a) standing admin (b) need for audits (c) encryption need totally.  
47. BEC relies on: (a) process trust in email payments (b) RAID 6 (c) GPU driver signing only.  
48. Write blocker used in: (a) disk acquisition (b) Wi-Fi pairing (c) TLS session resumption.

**Section E — Heavy advanced (L5) — Q49–60**  
49. Zero Trust core: (a) continuous verification (b) trust LAN always (c) single factor everywhere.  
50. mTLS adds: (a) mutual authentication (b) RAID (c) DHCP options only.  
51. PQC migration driver: (a) quantum threat timeline uncertainty (b) slower RAM (c) SMTP banners.  
52. AEAD provides: (a) confidentiality and integrity (b) compression only (c) key escrow by default.  
53. TPM sealing ties secrets to: (a) platform measurements (b) monitor Hz (c) DNS TTL.  
54. Confidential computing addresses threats from: (a) privileged infrastructure operators (model-dependent) (b) all phishing always (c) paper shredders.  
55. ASLR makes: (a) exploits less reliable (b) SQL faster (c) TLS unnecessary.  
56. Red team requires: (a) explicit authorization (b) any GitHub tool free use anywhere (c) dark web membership.  
57. SPIFFE relates to: (a) workload identity (b) printer drivers (c) FAT32.  
58. Microsegmentation helps: (a) east-west blast radius control (b) monitor brightness (c) HDMI-CEC.  
59. Formal methods excel with: (a) precise specifications (b) vague “secure the app” (c) marketing slogans only.  
60. Good security KPI: (a) MTTR trend down with quality preserved (b) ticket count up only (c) alerts disabled for noise.

### Capstone answer key (quick)

1–12: A,B,B,B,B,A,B,B,B,A,B,B  
13–24: B,A,A,A,A,A,B,B,B,B,A,A  
25–36: B,B,A,A,A,A,B,B,A,B,A,A  
37–48: A,A,A,A,A,A,A,B,A,A,A,A  
49–60: A,A,A,A,A,A,A,A,A,A,A,A  

---

## Instructor notes (workplace alignment)

- **SOC analyst:** Levels 1–3 heavy; drill SIEM queries and triage narratives.  
- **IT security / infrastructure:** Levels 1–4; labs on SSH, patching, IAM, logging.  
- **AppSec / developer:** Levels 2–3 + parts of 5; STRIDE, OWASP, OAuth, crypto.  
- **GRC / risk:** Levels 1, 3, 4, 5 architecture + policy mapping to frameworks (NIST CSF, ISO 27001 awareness).  
- **Cloud security associate:** Levels 2–4; emphasize logging, IAM guardrails, incident paths.  
- **Part 2 extensions (lessons 16–20):** Assign as “week 2” depth, homework reading, or honors track.  
- **Part 3 extensions (lessons 21–25):** Specialization (JWT/GraphQL/CSP, intel/STIX, CI/CD, privacy tech); pair with **Appendix G** syllabus and **Appendix I** scenarios.

**Assessment integrity:** Rotate capstone numbers/narratives each cohort; allow open-notes only for NIST/MITRE references if desired.

---

# Part 2 — Extended lessons (16–20 per level)

Use the same Learn-Hub mapping as Part 1. IDs continue `lh-sec-l*-16` … `lh-sec-l*-20`.

## Level 1 extensions

<!-- id: lh-sec-l1-16 -->
### L1-16: Security awareness metrics that are not vanity
**Outcomes:** Distinguish click rate vs reporting rate vs time-to-report; avoid punishing reporters.  
**Workplace:** Program owners report to risk committee; tie to control testing.  
**Kali lab:** Design a 4-metric dashboard in `~/awareness-kpi.md` with formulas and data sources.

<!-- id: lh-sec-l1-17 -->
### L1-17: BYOD, MDM, and mobile threat model
**Outcomes:** Containerized work profile vs full device control; lost-device wipe policy.  
**Workplace:** Regulatory constraints on personal device inspection.  
**Kali lab:** List mobile risks (jailbreak, sideload, outdated OS) — 10 bullets, no device compromise.

<!-- id: lh-sec-l1-18 -->
### L1-18: Media destruction and secure disposal
**Outcomes:** Clear vs purge vs destroy (NIST SP 800-88 concepts); chain of custody for drives.  
**Workplace:** RMA drives with sensitive data; SSD trim implications.  
**Kali lab:** `lsblk -o NAME,SIZE,TYPE,MOUNTPOINT`; document how you would **record** serials before decommission.

<!-- id: lh-sec-l1-19 -->
### L1-19: Travel security for laptops and MFA devices
**Outcomes:** Border search risks; full-disk encryption; tamper seals (awareness).  
**Workplace:** “Clean travel laptop” programs for high-risk countries.  
**Kali lab:** Check FDE status hints: `lsblk -f | head`; summarize encryption column meaning.

<!-- id: lh-sec-l1-20 -->
### L1-20: Shadow IT and acceptable use in plain language
**Outcomes:** Why unsanctioned SaaS breaks DLP and incident response.  
**Workplace:** Self-service approved catalog vs blocking alone.  
**Kali lab:** Write a one-page “sanctioned tools” list for a fictional 200-person company.

## Level 2 extensions

<!-- id: lh-sec-l2-16 -->
### L2-16: Server-side request forgery (SSRF) — defender view
**Outcomes:** Why allowlists beat blocklists for outbound fetchers; metadata cloud attacks (concept).  
**Workplace:** AppSec review checklist item for “URL fetch” features.  
**Kali lab:** Pseudocode `fetchUserSuppliedUrl(url)` with **scheme/host allowlist** and DNS rebinding note (no exploit).

<!-- id: lh-sec-l2-17 -->
### L2-17: XXE and unsafe deserialization (recognition only)
**Outcomes:** XML external entities; never deserialize untrusted objects.  
**Workplace:** Serialization bombs and gadget chains in Java/.NET/Python ecosystems.  
**Kali lab:** Find your language’s official safe XML/deserialization guidance — 5 bullet summary + URLs.

<!-- id: lh-sec-l2-18 -->
### L2-18: Path traversal and unsafe file upload handling
**Outcomes:** Canonicalize paths; store uploads outside web root; content-type vs content sniffing.  
**Workplace:** Ticket triage for “arbitrary file read” findings.  
**Kali lab:** On paper, show why `GET /download?file=....//....//etc/passwd` is blocked by basename + root jail.

<!-- id: lh-sec-l2-19 -->
### L2-19: HTTP request smuggling (awareness for architects)
**Outcomes:** Conflicting Content-Length/Transfer-Encoding parsing between front proxy and origin.  
**Workplace:** Why standardized reverse proxy configs and patch velocity matter.  
**Kali lab:** Read PortSwigger or RFC-level summary; write 6-sentence executive brief for architects.

<!-- id: lh-sec-l2-20 -->
### L2-20: WebSockets — origin checks, auth, and message framing
**Outcomes:** WS is not “just another socket”; session binding and rate limits still apply.  
**Workplace:** Real-time dashboards, chat, collaborative editors.  
**Kali lab:** `curl -i -N -H 'Connection: Upgrade' -H 'Upgrade: websocket' https://example.com 2>/dev/null | head` — explain why handshake failed without proper headers (read-only).

## Level 3 extensions

<!-- id: lh-sec-l3-16 -->
### L3-16: Vulnerability scan vs credentialed scan vs pentest vs red team
**Outcomes:** Scope, depth, business risk; what each can and cannot prove.  
**Workplace:** Contract SoW language; avoid “scan = secure.”  
**Kali lab:** Write a 1-page SoW outline for a **credentialed** internal scan with stop conditions.

<!-- id: lh-sec-l3-17 -->
### L3-17: OpenVAS/Greenbone-style workflow without firing bullets
**Outcomes:** Policy templates, false positives, authenticated checks, change windows.  
**Workplace:** VM team coordination; snapshot before intrusive plugins.  
**Kali lab:** If Greenbone installed in lab: explore UI **read-only**; export a CSV header row only and describe fields.

<!-- id: lh-sec-l3-18 -->
### L3-18: WAF value, limits, and tuning partnership with devs
**Outcomes:** Virtual patching vs root-cause fix; false positive burnout.  
**Workplace:** Block mode vs detect mode during rollout.  
**Kali lab:** List 5 attack classes a WAF helps with and 3 it often misses (logic bugs, stolen sessions…).

<!-- id: lh-sec-l3-19 -->
### L3-19: Reverse shell vs bind shell — what SOC sees
**Outcomes:** Outbound C2 vs inbound listener; beaconing jitter (concept).  
**Workplace:** Firewall egress allowlisting; proxy logs.  
**Kali lab:** `ss -tn state established | head` — explain tuple fields for anomaly hunting (no C2).

<!-- id: lh-sec-l3-20 -->
### L3-20: YARA and file classification at scale
**Outcomes:** Rules, strings, false positives; hunting vs blocking.  
**Workplace:** Threat intel feeds feeding EDR/SOAR.  
**Kali lab:** Author a benign YARA rule matching `LearnHub` in `~/rules/hello.yar`; run `yarac` if installed or document install step.

## Level 4 extensions

<!-- id: lh-sec-l4-16 -->
### L4-16: Identity protection signals (Impossible travel, unfamiliar properties)
**Outcomes:** Reduce false positives with graph and HR context.  
**Workplace:** Privacy review for location signals; union rules.  
**Kali lab:** Mock CSV of 10 sign-ins; mark 2 suspicious with reasons (velocity, ASN, device).

<!-- id: lh-sec-l4-17 -->
### L4-17: Kubernetes RBAC, service accounts, and token projection
**Outcomes:** Default SA risks; least privilege for controllers.  
**Workplace:** Namespace isolation is not security boundary alone.  
**Kali lab:** If minikube/k3s in lab: `kubectl auth can-i --list --as=system:serviceaccount:default:default` — interpret danger.

<!-- id: lh-sec-l4-18 -->
### L4-18: Serverless (Lambda/Functions) IAM blast radius
**Outcomes:** One overly broad execution role affects all invocations.  
**Workplace:** Per-function roles; environment variable leaks in console.  
**Kali lab:** Draw IAM policy JSON for read-only S3 prefix + `kms:Decrypt` for one CMK only.

<!-- id: lh-sec-l4-19 -->
### L4-19: CASB and SaaS governance (sanction vs monitor vs block)
**Outcomes:** API vs reverse-proxy modes; OAuth app consent attacks.  
**Workplace:** Google Workspace / Microsoft 365 risky OAuth apps workflow.  
**Kali lab:** Checklist of 12 SaaS settings (MFA, session length, guest access, sharing links).

<!-- id: lh-sec-l4-20 -->
### L4-20: M&A technical due diligence security checklist
**Outcomes:** AD forest trusts, legacy VPNs, undisclosed SaaS, license compliance vs security.  
**Workplace:** Day-one identity cutover risks.  
**Kali lab:** 2-page checklist template with owners (IT, Legal, Security, Finance).

## Level 5 extensions

<!-- id: lh-sec-l5-16 -->
### L5-16: HSMs, key ceremonies, and dual control
**Outcomes:** Root of trust for PKI and payment keys; split knowledge.  
**Workplace:** FIPS 140-2/3 awareness; cloud CloudHSM vs managed KMS.  
**Kali lab:** Compare table: software keys vs KMS vs HSM for 6 attributes (cost, latency, assurance…).

<!-- id: lh-sec-l5-17 -->
### L5-17: BGP hijacking and RPKI (operator-level awareness)
**Outcomes:** Route leaks vs malicious origination; ROV.  
**Workplace:** Why SaaS uptime ties to routing hygiene.  
**Kali lab:** Read MANRS or ARIN RPKI intro; 10-bullet briefing for executives.

<!-- id: lh-sec-l5-18 -->
### L5-18: Rowhammer / RAMBleed class issues (hardware-software boundary)
**Outcomes:** Why ECC matters for high-assurance; isolation limits.  
**Workplace:** Cloud shared host risk vs dedicated; browser mitigations over time.  
**Kali lab:** Summarize one CVE in plain language with attacker model (local vs remote).

<!-- id: lh-sec-l5-19 -->
### L5-19: Fuzzing for developers (AFL++, libFuzzer, sanitizers)
**Outcomes:** Coverage-guided fuzzing finds parser bugs before attackers.  
**Workplace:** CI integration with timeouts and crash triage.  
**Kali lab:** `apt-cache show afl++ 2>/dev/null | head -n 20` or document building a trivial harness for `atoi`-style parser.

<!-- id: lh-sec-l5-20 -->
### L5-20: Legal preservation and law-enforcement interaction (non-legal advice)
**Outcomes:** Know when to call counsel; preserve vs spoliation; scope documentation.  
**Workplace:** “No one investigates alone” — IR + legal + HR.  
**Kali lab:** Draft internal “first hour” bullets: who to call, what not to do (no mass delete).

---

## Supplemental question banks (Q21–30 per level)

### Level 1 — Q21–30

**Q21.** Shadow IT increases risk mainly because: (a) it is always faster (b) data leaves approved controls and visibility (c) it improves MFA.  
**Q22.** Secure disposal “destroy” intent is to: (a) hide icons (b) make recovery infeasible with reasonable resources (c) improve Wi-Fi.  
**Q23.** BYOD containerization tries to: (a) merge personal and work data freely (b) isolate work data and policies (c) remove encryption.  
**Q24.** Travel laptop programs reduce: (a) need for encryption (b) exposure of crown-jewel data at borders/theft (c) DNS TTL.  
**Q25.** Awareness “reporting rate” measures: (a) how many users fail tests only (b) users reporting suspicious messages upward (c) GPU usage.  
**Q26.** MDM can enforce: (a) patch levels and encryption policies on managed devices (b) BGP (c) SQL indexes.  
**Q27.** Acceptable use policies primarily: (a) set expected behavior and prohibitions (b) replace firewalls (c) eliminate audits.  
**Q28.** Punishing users who fail phishing sims tends to: (a) increase concealment and reduce reporting culture (b) improve TLS (c) fix SQLi.  
**Q29.** Inventory before disposal supports: (a) chain of custody and verification (b) faster games (c) weaker passwords.  
**Q30.** “Clean desk” pairs best with: (a) screen privacy filters + lock screens (b) posting passwords (c) disabling backups.

### Answer key — Level 1 Q21–30
21–30: B/B/B/B/B/A/A/A/A/A

### Level 2 — Q21–30

**Q21.** SSRF defenses often emphasize: (a) allowlisted destinations (b) longer passwords only (c) disabling TLS.  
**Q22.** XXE primarily abuses: (a) XML parsers resolving external entities (b) RAID (c) HDMI-CEC.  
**Q23.** Unsafe deserialization risks: (a) remote code execution gadgets (b) slower DNS only (c) monitor brightness.  
**Q24.** Path traversal targets: (a) file system boundaries (b) TLS handshakes (c) TPM PCRs only.  
**Q25.** Request smuggling arises from: (a) inconsistent HTTP parsing between proxies and origins (b) weak Wi-Fi (c) SHA-1 in DNS.  
**Q26.** Upload safety includes: (a) store outside web root + randomize names + scan (b) trust browser MIME only (c) chmod 777 always.  
**Q27.** WebSockets still require: (a) authentication/authorization and abuse controls (b) nothing (c) RAID 0.  
**Q28.** DNS rebinding can hurt: (a) browser-based network attackers against internal IPs (b) RAID parity (c) printer DPI.  
**Q29.** SSRF to cloud metadata services is a risk when: (a) apps fetch URLs without strict controls on cloud instances (b) users use MFA (c) HSTS enabled.  
**Q30.** Deserialization safest stance: (a) never deserialize untrusted data (b) always pickle (c) trust CDN headers only.

### Answer key — Level 2 Q21–30
21–30: A/A/A/A/A/A/A/A/A/A

### Level 3 — Q21–30

**Q21.** Credentialed scanning improves: (a) visibility into patch state from inside the OS (b) BGP (c) printer alignment.  
**Q22.** Pentest differs from vulnerability scan mainly by: (a) human chaining and business impact validation (b) always being cheaper (c) replacing SIEM.  
**Q23.** WAF “virtual patch”: (a) hot rule blocking exploit pattern while code fix ships (b) replaces SSD (c) removes MFA.  
**Q24.** Reverse shells often appear as: (a) outbound connections from victim to attacker (b) inbound only always (c) DHCP offers.  
**Q25.** YARA is used for: (a) content-based matching of files/memory strings (b) routing (c) disk partitioning.  
**Q26.** Greenbone/OpenVAS policies should be: (a) tuned to environment and maintenance windows (b) max aggressive always on prod without notice (c) disabled always.  
**Q27.** WAF false positives can cause: (a) alert fatigue and business disruption (b) stronger AES (c) automatic PQC.  
**Q28.** Outbound firewall egress control helps against: (a) post-exploitation C2 (b) SQL collation only (c) VGA theft.  
**Q29.** `yarac` compiles: (a) YARA rules to bytecode for engines (b) TLS certs (c) Dockerfile layers.  
**Q30.** Scan “authentication” typically needs: (a) least-privilege scan account and coordination (b) domain admin always (c) BIOS password.

### Answer key — Level 3 Q21–30
21–30: A/A/A/A/A/A/A/A/A/A

### Level 4 — Q21–30

**Q21.** Impossible travel detections need: (a) tuning to reduce HR false positives (b) RAID 6 (c) disabling logs.  
**Q22.** K8s default service account over-permission is risky because: (a) compromised pod may inherit broad token (b) it speeds BGP (c) it removes TLS.  
**Q23.** Per-function IAM roles in serverless reduce: (a) blast radius (b) need for logging (c) need for TLS.  
**Q24.** CASB helps with: (a) visibility and policy for SaaS usage (b) CPU overclocking (c) HDMI-CEC.  
**Q25.** Risky OAuth consent in SaaS can: (a) grant third-party apps access to mail/files (b) improve RAID (c) fix XSS.  
**Q26.** M&A security asks often include: (a) unknown trust relationships and shadow admin paths (b) monitor Hz only (c) SMTP banners only.  
**Q27.** Token projection in Kubernetes aims to: (a) short-lived scoped tokens (b) remove network policies (c) disable audit logs.  
**Q28.** SaaS guest access risks include: (a) overshared links and stale accounts (b) faster RAM (c) ASLR disable.  
**Q29.** Namespace alone is: (a) not a full security boundary without controls (b) equal to HSM (c) always sufficient.  
**Q30.** M&A day-one identity risks include: (a) duplicate UPNs and trust abuse (b) GPU brand (c) printer DPI.

### Answer key — Level 4 Q21–30
21–30: A/A/A/A/A/A/A/A/A/A

### Level 5 — Q21–30

**Q21.** HSMs are often used when: (a) high-assurance key operations and compliance drive hardware protection (b) replacing MFA apps (c) fixing XSS.  
**Q22.** RPKI ROV helps reduce: (a) bogus route origination impact (b) SQLi (c) weak USB cables.  
**Q23.** Key ceremony dual control means: (a) no single person can misuse root material alone (b) two monitors required (c) two Wi-Fi bands.  
**Q24.** Rowhammer class issues relate to: (a) repeated DRAM access patterns causing bit flips (b) SMTP (c) RAID stripe width.  
**Q25.** Fuzzing in CI should include: (a) timeouts, crash dedup, owner routing (b) unlimited prod runs (c) deleting unit tests.  
**Q26.** Legal hold means: (a) preserve relevant data per counsel instruction (b) delete faster (c) disable EDR always.  
**Q27.** Spoliation refers to: (a) improper destruction of evidence (b) VLAN tagging (c) AES-GCM nonce.  
**Q28.** MANRS promotes: (a) routing security good practices (b) MFA for printers only (c) SQL indexes.  
**Q29.** Cloud KMS vs CloudHSM tradeoff often balances: (a) ops burden vs assurance level (b) monitor refresh vs RAID (c) DHCP vs DNS only.  
**Q30.** Executive BGP briefing should emphasize: (a) business downtime and third-party dependency (b) GPU shader cores (c) cookie flags only.

### Answer key — Level 5 Q21–30
21–30: A/A/A/A/A/A/A/A/A/A

---

## Additional lab sequences (multi-hour)

**Lab sequence A — “SOC analyst day zero” (Kali + local VMs you own)**  
1. Normalize time and verify log sources (`journalctl`, file `/var/log/auth.log`).  
2. Build 10-line timeline from 5 synthetic log lines you fabricate with realistic timestamps.  
3. Write triage notes: benign vs suspicious vs malicious for each line.  
4. Escalation template: severity, affected assets, evidence hashes, open questions.

**Lab sequence B — “AppSec code review sprint”**  
1. Pick an open-source tiny web app in lab.  
2. Run dependency audit (`npm audit`, `pip-audit`, or OSV-Scanner) — document one finding’s reachability.  
3. STRIDE one feature end-to-end.  
4. Propose three fixes prioritized by exploitability and impact.

**Lab sequence C — “Cloud logging detective” (personal/sandbox tenant only)**  
1. Enable a read-only audit log export or portal view you are allowed to use.  
2. Map three activities: IAM change, login risk, resource creation.  
3. Write one detection rule pseudo-snippet per activity.

---

# Capstone — Part 2 (Q61–80)

**Q61.** A healthy security culture rewards: (a) reporting near-misses (b) hiding mistakes (c) disabling MFA for VIPs.  
**Q62.** Separation of duties for payments typically prevents: (a) single-person fraud (b) TLS (c) RAID 1.  
**Q63.** `SameSite=Strict` is stricter than `Lax` for: (a) cross-site cookie sends on navigations (b) SQL performance (c) BIOS.  
**Q64.** OAuth `state` parameter mitigates: (a) CSRF on authorization endpoint (b) SQLi (c) BGP leaks.  
**Q65.** Refresh token rotation detects: (a) token theft/replay (b) RAID degradation (c) weak VGA.  
**Q66.** Content-Type sniffing defenses include: (a) `X-Content-Type-Options: nosniff` (b) disabling HTTPS (c) chmod 777.  
**Q67.** Subresource Integrity (SRI) helps when: (a) loading scripts from CDNs (b) configuring RAID (c) SMTP STARTTLS only.  
**Q68.** `Referrer-Policy` can reduce: (a) sensitive URL leakage in Referer headers (b) SQL index size (c) TPM PCR count.  
**Q69.** `Permissions-Policy` (Feature-Policy) limits: (a) powerful browser APIs (b) disk encryption (c) BGP communities.  
**Q70.** Rate limiting and CAPTCHA address: (a) credential stuffing and automated abuse (b) RAID 5 write hole (c) DNSSEC only.  
**Q71.** `ssh-ed25519` vs RSA4096 debate in 2026 often favors: (a) modern Ed25519 for performance/security balance when supported (b) telnet (c) FTP cleartext.  
**Q72.** `Fail2ban`-style controls are: (a) reactive/shallow ban based on logs (b) replacement for secure coding (c) guaranteed APT stopper.  
**Q73.** SOAR playbooks automate: (a) enrichment + repeatable IR steps (b) BGP origination (c) BIOS updates only.  
**Q74.** MITRE D3FEND relates to: (a) defensive countermeasures mapping (b) JavaScript minification (c) HDMI version.  
**Q75.** Cyber insurance questionnaires push: (a) evidence of controls and maturity (b) removal of MFA (c) weaker passwords.  
**Q76.** “Assume breach” implies: (a) interior segmentation and detection matter (b) perimeter is perfect (c) no logging needed.  
**Q77.** Zero-day handling often prioritizes: (a) exposure analysis, temporary mitigations, vendor tracking (b) deleting SIEM (c) public exploit posting first.  
**Q78.** Bug bounty differs from pentest partly by: (a) continuous crowdsourced testing scope (b) no rules (c) replaces internal QA always.  
**Q79.** Secure SDLC “shift left” means: (a) earlier security testing and design (b) deploy Friday 5pm always (c) remove code review.  
**Q80.** Post-incident “lessons learned” should produce: (a) tracked remediation items and metrics (b) blame-only sessions (c) deleted tickets.

### Capstone Part 2 answer key

61–70: A/A/A/A/A/A/A/A/A/A  
71–80: A/A/A/A/A/A/A/A/A/A

---

## Appendix A — Glossary (compact)

| Term | Plain meaning |
|------|----------------|
| **AAA** | Authentication, authorization, accounting (audit). |
| **ABAC** | Access from attributes (department, clearance, tags). |
| **AEAD** | Authenticated encryption with associated data (confidentiality + integrity). |
| **ASLR** | Randomizes memory layout to hinder exploitation. |
| **ATT&CK** | MITRE knowledge base of adversary tactics and techniques. |
| **BEC** | Business email compromise — finance process fraud via email. |
| **C2** | Command and control channel after compromise. |
| **CASB** | Cloud access security broker — SaaS policy enforcement point. |
| **CAB** | Change advisory board — governs production changes. |
| **CIA** | Confidentiality, integrity, availability. |
| **CSP** | Content Security Policy — reduces XSS impact. |
| **CSRF** | Cross-site request forgery — forged actions using victim session. |
| **CVSS** | Common Vulnerability Scoring System — severity snapshot. |
| **CWE** | Weakness taxonomy (type of mistake). |
| **DLP** | Data loss prevention — detect/block sensitive data movement. |
| **EDR** | Endpoint detection and response — telemetry + response on hosts. |
| **FIDO2 / WebAuthn** | Phishing-resistant MFA class. |
| **IAM** | Identity and access management. |
| **IdP** | Identity provider (issues tokens, authenticates users). |
| **IR** | Incident response. |
| **JIT / PIM** | Just-in-time / privileged identity management — time-bound admin. |
| **KMS** | Key management service. |
| **mTLS** | Mutual TLS — both sides present certificates. |
| **OIDC** | OpenID Connect — identity layer on OAuth2. |
| **PEP / PDP** | Policy enforcement / decision point (Zero Trust). |
| **PII** | Personally identifiable information. |
| **PKCE** | Proof Key for Code Exchange — OAuth public client protection. |
| **RPO / RTO** | Recovery point / time objectives — data loss vs downtime budgets. |
| **RBAC** | Role-based access control. |
| **RoE** | Rules of engagement — legal/technical pentest boundaries. |
| **RPKI** | Resource Public Key Infrastructure — cryptographically signed routing origination. |
| **SCP** | Service control policy (AWS Organizations guardrail). |
| **SIEM** | Security information and event management — central correlation. |
| **SOAR** | Security orchestration, automation, response. |
| **SSRF** | Server-side request forgery — server tricked into fetching dangerous URLs. |
| **STRIDE** | Spoofing, tampering, repudiation, info disclosure, DoS, elevation. |
| **TEE** | Trusted execution environment. |
| **TLS** | Transport Layer Security — encrypts channel; verifies identity if validated. |
| **TPM** | Trusted Platform Module — hardware root for keys/measurements. |
| **WAF** | Web application firewall — HTTP-layer policy engine. |
| **XSS** | Cross-site scripting — attacker JS in victim browser context. |
| **ZT / ZTA** | Zero Trust (Architecture). |

---

## Appendix B — Kali Linux quick reference (lab-safe)

| Task | Example command | Notes |
|------|-----------------|-------|
| Who am I | `whoami` / `id` | Check privilege before risky commands. |
| Listening services | `ss -tuln` | Map attack surface of **your** VM. |
| Routes | `ip r` | Understand egress path; split tunnel awareness. |
| DNS | `dig +short A example.com` | Use domains you are allowed to query. |
| TLS peek | `openssl s_client -connect host:443 -servername host </dev/null` | Read-only to permitted hosts. |
| Recent auth | `journalctl -u ssh --since "24 hours ago"` | Tune unit name for your distro. |
| File hash | `sha256sum file` | Evidence integrity. |
| Find SUID | `find / -perm -4000 -type f 2>/dev/null \| head` | **Read-only** survey; expect noise. |
| Local vuln hints | `debsecan` | Match suite to your Debian/Kali base. |
| Packet capture | `tcpdump -i any -c 20 -n` | Only on interfaces carrying **your** lab traffic. |

**Never:** run exploit frameworks against networks without authorization; do not exfiltrate real customer data into Kali.

---

## Appendix C — NIST CSF 2.0 functions → curriculum map (sample)

| CSF function | Example lessons |
|--------------|-----------------|
| **Govern (GV)** | L1-15, L1-20, L4-20, L5-20 |
| **Identify (ID)** | L1-05, L1-06, L3-01, L3-11, L4-20 |
| **Protect (PR)** | L1-07–L1-14, L2-02–L2-03, L3-03–L3-04, L4-17–L4-19 |
| **Detect (DE)** | L3-07–L3-10, L3-19–L3-20, L4-09–L4-10, L4-16 |
| **Respond (RS)** | L3-15, L4-11, L5-20, Lab sequence A |
| **Recover (RC)** | L1-13, L4-15, Lab sequence A |

---

## Appendix D — Compliance one-liners (interview-safe)

- **GDPR:** EU-focused privacy regulation; lawful basis, data subject rights, breach notification timelines matter operationally.  
- **HIPAA (US healthcare):** PHI safeguards; BAAs with vendors; minimum necessary.  
- **PCI DSS:** Cardholder data environment controls; segmentation and scanning expectations.  
- **SOC 2:** Trust services criteria audit report; not a law but a customer assurance artifact.  
- **ISO 27001:** ISMS certification framework; risk treatment and continual improvement.

Always defer specifics to your organization’s compliance team.

---

## Appendix E — Behavioral interview hooks (STAR skeletons)

Prepare two stories each: **(1)** phishing or fraud attempt you reported or triaged, **(2)** vulnerability you prioritized against pushback, **(3)** outage or incident where you improved detection/response, **(4)** secure design tradeoff you negotiated with product.  
Each story: **S**ituation → **T**ask → **A**ction (what *you* did) → **R**esult (metric or risk reduction).

---

# Part 3 — Extended lessons (21–25 per level)

IDs: `lh-sec-l1-21` … `lh-sec-l5-25`. Use after Parts 1–2 or as specialization modules.

## Level 1 — Part 3

<!-- id: lh-sec-l1-21 -->
### L1-21: Data classification and handling labels
**Outcomes:** Public / internal / confidential / restricted; labeling in email and tickets; retention.  
**Workplace:** DLP policies map to labels; “restricted” may require encryption in transit and at rest.  
**Kali lab:** Create `~/data-class-policy.md` with 4 tiers, one handling rule each, and one wrong example to fix.

<!-- id: lh-sec-l1-22 -->
### L1-22: Security champions networks
**Outcomes:** Embedded advocates per squad; office hours; secure release gates light enough to ship.  
**Workplace:** Champions feed AppSec backlog with context product security lacks.  
**Kali lab:** Draft a 6-month champion charter: cadence, escalation path, recognition (non-monetary).

<!-- id: lh-sec-l1-23 -->
### L1-23: Third-party and vendor risk (questionnaires + evidence)
**Outcomes:** SOC 2 report review vs questionnaire theater; subprocessors; exit plan.  
**Workplace:** Procurement gates; annual re-attestation.  
**Kali lab:** Build a 15-row vendor checklist (encryption, SSO, logging, breach notice, DPA).

<!-- id: lh-sec-l1-24 -->
### L1-24: Home office and Wi-Fi hygiene
**Outcomes:** WPA3, router firmware, guest VLAN, IoT isolation; corporate device vs personal.  
**Workplace:** “Split tunnel from home” risk acceptance documentation.  
**Kali lab:** `iwconfig 2>/dev/null || nmcli dev wifi list 2>/dev/null | head` — document your **lab** Wi-Fi security mode (no neighbor SSIDs in reports).

<!-- id: lh-sec-l1-25 -->
### L1-25: Browser compartmentalization and extension risk
**Outcomes:** Separate profiles for admin vs casual; least extensions; enterprise browser policy.  
**Workplace:** Managed browsers push blocklists and update cadence.  
**Kali lab:** List installed Firefox/Chromium extensions path on Kali; mark “high privilege” if any can read all tabs.

## Level 2 — Part 3

<!-- id: lh-sec-l2-21 -->
### L2-21: JWTs — what breaks in production
**Outcomes:** `alg` confusion, weak HS256 shared secrets, missing `aud`/`iss`, clock skew, huge claims.  
**Workplace:** Prefer opaque server-side sessions or hardened JWT + JWKS rotation.  
**Kali lab:** Decode a **synthetic** JWT at https://jwt.io with a **fake** secret you invent — never paste production tokens.

<!-- id: lh-sec-l2-22 -->
### L2-22: GraphQL abuse (complexity, batching, introspection)
**Outcomes:** Depth/cost limits; disable introspection in prod; authz per field, not only per route.  
**Workplace:** Federation increases trust surface across subgraphs.  
**Kali lab:** Write a GraphQL query with nested depth 6 — explain why a cost analyzer would block it.

<!-- id: lh-sec-l2-23 -->
### L2-23: CSP reporting (`report-uri` / `report-to`)
**Outcomes:** Collect violations without blocking users during rollout; noise management.  
**Workplace:** Report-only mode before enforce.  
**Kali lab:** Draft a CSP header string with `default-src 'self'` and `report-uri` pointing to internal collector (placeholder URL).

<!-- id: lh-sec-l2-24 -->
### L2-24: Subresource Integrity (SRI) for third-party scripts
**Outcomes:** `integrity` + `crossorigin` attributes; hash rotation when vendor updates.  
**Workplace:** Supply chain: CDN compromise becomes non-executing if hash mismatches.  
**Kali lab:** Use `openssl dgst -sha384 -binary file.js | openssl base64 -A` on a tiny local `file.js` you create; build the `sha384-...` attribute value.

<!-- id: lh-sec-l2-25 -->
### L2-25: CORS — preflight, credentials, and dangerous `*`
**Outcomes:** CORS is not a security boundary for server-side protection; mis-reflected origins hurt.  
**Workplace:** Internal APIs behind gateway + auth, not “security through CORS.”  
**Kali lab:** Table: scenario → safe `Access-Control-Allow-Origin` pattern (specific origin vs `*` with credentials).

## Level 3 — Part 3

<!-- id: lh-sec-l3-21 -->
### L3-21: ATT&CK procedures vs techniques (TTP nuance)
**Outcomes:** Procedures are actor-specific implementations; detection should focus on observable behaviors.  
**Workplace:** Intelligence-driven detection engineering.  
**Kali lab:** Pick technique `T1566` (phishing); list 5 observables (email headers, attachments, user agent).

<!-- id: lh-sec-l3-22 -->
### L3-22: Threat intelligence pyramid (strategic / operational / tactical)
**Outcomes:** IOCs expire fast; TTPs and strategic reports age better.  
**Workplace:** Feed quality into SOAR; avoid blocking on stale IPs forever.  
**Kali lab:** Classify 10 indicators you invent (hash, domain, CVE narrative, country motive) into pyramid layers.

<!-- id: lh-sec-l3-23 -->
### L3-23: STIX / TAXII (interchange and sharing)
**Outcomes:** Objects, relationships, sharing communities; trust but verify.  
**Workplace:** ISAC memberships; taxii 2.1 servers for sector sharing.  
**Kali lab:** Read STIX 2.1 intro diagram; write JSON stub for `indicator` + `malware` `indicates` relationship (synthetic).

<!-- id: lh-sec-l3-24 -->
### L3-24: Osquery and fleet visibility (SQL on endpoints)
**Outcomes:** Scheduled queries for drift, persistence, suspicious binaries.  
**Workplace:** Privacy impact assessment before wide deployment.  
**Kali lab:** If `osqueryi` installed: `.tables` then `SELECT * FROM os_version;` — else document install and one compliance query idea.

<!-- id: lh-sec-l3-25 -->
### L3-25: TAP vs SPAN for network security monitoring
**Outcomes:** Inline vs out-of-band; dropped packets under load; TLS visibility limits.  
**Workplace:** Appliance sizing; lawful intercept policies.  
**Kali lab:** ASCII diagram: switch SPAN port → IDS vs inline IPS path.

## Level 4 — Part 3

<!-- id: lh-sec-l4-21 -->
### L4-21: CI/CD pipeline attackers care about (OIDC, runners, caches)
**Outcomes:** Short-lived cloud credentials via OIDC; runner isolation; poisoned cache risks.  
**Workplace:** “Build from scratch” vs reused compromised workers.  
**Kali lab:** Sketch GitHub Actions → AWS `role-to-assume` OIDC trust — 8-step sequence, no secrets in YAML.

<!-- id: lh-sec-l4-22 -->
### L4-22: Terraform / IaC security (state files, modules, drift)
**Outcomes:** Remote state encryption and locking; module pinning; policy-as-code (OPA/Sentinel/Conftest).  
**Workplace:** Blast radius of `AdministratorAccess` in CI role.  
**Kali lab:** List 5 `terraform` anti-patterns (state in git, plaintext secrets, overly wide IAM) with fixes.

<!-- id: lh-sec-l4-23 -->
### L4-23: Secrets in engineering systems (Git, tickets, wikis, CI logs)
**Outcomes:** Secret scanning on push; pre-commit hooks; rotation when leaked.  
**Workplace:** “One leaked key = assume lateral movement started.”  
**Kali lab:** Create dummy repo with fake `AWS_SECRET_ACCESS_KEY=AKIAIOSFODNN7EXAMPLE` in history; run `gitleaks detect --source . --no-git` or `trufflehog` if available — verify detection.

<!-- id: lh-sec-l4-24 -->
### L4-24: Multi-region resilience and key management
**Outcomes:** KMS multi-region keys vs replicated; data sovereignty vs DR.  
**Workplace:** RTO for crypto availability during regional outage.  
**Kali lab:** Decision matrix: single-region KMS vs multi-region for 4 app tiers.

<!-- id: lh-sec-l4-25 -->
### L4-25: Board and executive reporting (risk in business terms)
**Outcomes:** Fewer heat maps, more “top 5 loss scenarios” with controls and trend.  
**Workplace:** Tie to insurance, revenue, regulatory deadlines.  
**Kali lab:** One-slide outline: title, risk statement, control, metric, owner, date.

## Level 5 — Part 3

<!-- id: lh-sec-l5-21 -->
### L5-21: Differential privacy vs “anonymization”
**Outcomes:** Re-identification risk; epsilon budgets as governance topic.  
**Workplace:** Analytics on sensitive populations; legal review.  
**Kali lab:** Three-sentence brief for legal: why aggregate tables still re-identify.

<!-- id: lh-sec-l5-22 -->
### L5-22: Homomorphic encryption (when it is worth the cost)
**Outcomes:** Compute on ciphertext classes; latency and limited operations today.  
**Workplace:** Regulated analytics partnerships.  
**Kali lab:** Bullet list: 4 use cases where HE is plausible vs 4 where it is marketing-only today.

<!-- id: lh-sec-l5-23 -->
### L5-23: Secure multi-party computation (high-level)
**Outcomes:** Parties compute joint function without revealing inputs to each other.  
**Workplace:** Fraud detection across banks without raw data sharing (concept).  
**Kali lab:** Compare MPC vs HE in one table (trust model, performance, maturity).

<!-- id: lh-sec-l5-24 -->
### L5-24: Protocol composition failures
**Outcomes:** Secure pieces, insecure system; downgrade glue between components.  
**Workplace:** Microservices auth between internal hops.  
**Kali lab:** Story: “service A trusts mTLS from gateway; gateway trusts Internet” — draw trust failure.

<!-- id: lh-sec-l5-25 -->
### L5-25: ML supply chain and model / prompt abuse
**Outcomes:** Training data poisoning, weight tampering, prompt injection as appsec class.  
**Workplace:** Separate LLM system prompt from untrusted document content; output filtering and grounding.  
**Kali lab:** Write 6 defensive controls for an internal “chat with PDF” feature (no live LLM keys).

---

## Supplemental question banks — Part 2 (Q31–40 per level)

### Level 1 — Q31–40

**Q31.** Data “restricted” tier usually implies: (a) public blog OK (b) strongest controls and handling (c) no encryption.  
**Q32.** Vendor SOC 2 Type II mainly shows: (a) point-in-time screenshot only always (b) controls operated over a period (Type II) per auditor testing (c) PCI scope.  
**Q33.** Security champions help mainly by: (a) replacing AppSec headcount entirely (b) embedding risk context in squads (c) deleting logs.  
**Q34.** Guest Wi-Fi isolation goal: (a) merge with corporate LAN freely (b) segment untrusted devices (c) disable DHCP.  
**Q35.** Browser extensions with “read all site data” are: (a) always safe (b) high abuse potential (c) required for TLS.  
**Q36.** Third-party DPA importance: (a) legal processing terms and liability allocation (b) replaces MFA (c) fixes BGP.  
**Q37.** Retention limits help: (a) reduce exposure and cost (b) increase breach impact (c) remove need for backups.  
**Q38.** Home router firmware updates address: (a) known exploitable bugs (b) monitor refresh rate (c) SQL collation.  
**Q39.** Labeling emails “confidential” without technical controls: (a) sufficient alone always (b) awareness aid, not technical control (c) replaces encryption.  
**Q40.** Vendor exit strategy should include: (a) data export and key custody (b) deleting backups always day one (c) ignoring logs.

### Answer key — Level 1 Q31–40
31–40: B/B/B/B/B/A/A/A/B/A

### Level 2 — Q31–40

**Q31.** JWT `aud` (audience) claim helps: (a) bind token to intended relying party (b) replace TLS (c) configure RAID.  
**Q32.** GraphQL introspection in production risk: (a) aids attackers mapping schema (b) improves BGP (c) removes MFA.  
**Q33.** SRI fails when: (a) vendor file changes and hash not updated (b) HSTS enabled (c) RAID 1 healthy.  
**Q34.** CSP `default-src 'self'` is: (a) baseline restrict origins (b) disk encryption (c) MFA type.  
**Q35.** CORS with `Access-Control-Allow-Credentials: true` and `*` origin is: (a) valid and safe always (b) invalid / browser-rejected pattern (c) required for PCI.  
**Q36.** JWT in `localStorage` vs HttpOnly cookie: (a) localStorage often worse XSS token theft (b) identical always (c) always better.  
**Q37.** GraphQL field-level authz matters because: (a) one resolver may expose sensitive nested data (b) DNS only (c) BIOS.  
**Q38.** CSP report-only mode helps: (a) tune policy before blocking (b) remove TLS (c) disable cookies.  
**Q39.** `crossorigin` on SRI script tags relates to: (a) CORS checks for integrity fetch (b) RAID (c) SMTP.  
**Q40.** “CORS fixes authz” is: (a) false — server must enforce authorization (b) true always (c) only for SOAP.

### Answer key — Level 2 Q31–40
31–40: A/A/A/A/B/A/A/A/A/A

### Level 3 — Q31–40

**Q31.** STIX expresses: (a) structured threat intel objects (b) BIOS passwords (c) RAID levels.  
**Q32.** TAXII moves: (a) STIX over HTTP APIs (b) GPU firmware (c) TPM quotes only.  
**Q33.** Tactical intel often includes: (a) short-lived IOCs (b) 10-year strategy only (c) HR payroll formulas.  
**Q34.** Osquery’s value is: (a) fleet-wide SQL visibility with governance (b) replaces firewalls (c) fixes XSS.  
**Q35.** SPAN port risk: (a) dropped packets under load; not perfect copy (b) always inline block (c) encrypts disk.  
**Q36.** ATT&CK “procedure” is: (a) actor-specific way to execute technique (b) CVE number (c) TLS cipher.  
**Q37.** Intelligence without **feedback** to detection engineering often: (a) becomes shelf-ware (b) automatically stops APT (c) replaces EDR.  
**Q38.** Network TAP typical benefit: (a) full fidelity copy for tools (b) terminates TLS always (c) patches Linux kernel.  
**Q39.** Pyramid base for defenders often emphasizes: (a) durable TTP-based detections over stale IPs only (b) ignoring logs (c) deleting endpoints.  
**Q40.** Sharing STIX without validation can: (a) spread false positives or poisoned intel (b) fix SQLi (c) remove MFA.

### Answer key — Level 3 Q31–40
31–40: A/A/A/A/A/A/A/A/A/A

### Level 4 — Q31–40

**Q31.** CI OIDC to cloud reduces: (a) long-lived static keys in repos (b) need for code review (c) TLS need.  
**Q32.** Terraform state in plain git is: (a) dangerous (secrets, infra metadata leak) (b) best practice (c) required by PCI.  
**Q33.** Poisoned CI cache could: (a) inject malicious build artifacts (b) improve unit tests (c) enable RAID 6 on laptop.  
**Q34.** Policy-as-code for IaC catches: (a) risky IAM/SG rules pre-apply (b) BGP leaks (c) HDMI issues.  
**Q35.** Multi-region KMS planning ties to: (a) DR, latency, jurisdiction (b) printer DPI (c) SMTP banners only.  
**Q36.** Executive slide should avoid: (a) unexplained CVSS-only heat maps without business story (b) clear owners (c) dates.  
**Q37.** `gitleaks` / secret scanning goal: (a) detect credentials in repos and history (b) replace WAF (c) configure BIOS.  
**Q38.** Over-privileged CI role risk: (a) pipeline compromise becomes cloud admin (b) improves MFA (c) shrinks logs.  
**Q39.** IaC module pinning reduces: (a) surprise upstream supply chain changes (b) RAID 0 risk (c) DNS TTL.  
**Q40.** Board metrics should include: (a) trend and remediation SLA, not only counts (b) raw grep only (c) employee birthdays.

### Answer key — Level 4 Q31–40
31–40: A/A/A/A/A/A/A/A/A/A

### Level 5 — Q31–40

**Q31.** Differential privacy uses: (a) calibrated noise for bounded disclosure (b) RAID striping (c) static NAT only.  
**Q32.** HE today often limited by: (a) performance and operation sets (b) lack of TLS (c) SMTP.  
**Q33.** MPC trust model differs from HE partly in: (a) parties and collusion assumptions (b) monitor Hz (c) VGA.  
**Q34.** Composition failures explain: (a) secure components, insecure system glue (b) faster RAM (c) DKIM alignment.  
**Q35.** Prompt injection is primarily: (a) untrusted instructions influencing model/tool use (b) SQLi (c) RAID 5.  
**Q36.** Model weights integrity matters for: (a) supply chain of ML artifacts (b) DHCP scope (c) printer DPI.  
**Q37.** “Aggregate is safe” is: (a) often false due to re-identification (b) always true (c) PCI requirement for cards in clear.  
**Q38.** HE for regulated analytics is: (a) sometimes viable with expert architecture (b) solved for arbitrary code at line-rate everywhere (c) illegal.  
**Q39.** ML observability for abuse includes: (a) rate limits, anomaly detection on prompts/outputs (b) disabling audit logs (c) BGP only.  
**Q40.** Protocol glue attacks target: (a) assumptions between components (b) ECC RAM only (c) HDMI-CEC only.

### Answer key — Level 5 Q31–40
31–40: A/A/A/A/A/A/A/A/A/A

---

# Capstone — Part 3 (Q81–100)

**Q81.** Data classification drives: (a) control selection and handling (b) GPU clock (c) SMTP EHLO only.  
**Q82.** Vendor Type II report review should include: (a) exceptions and scope boundaries (b) ignoring caveats (c) deleting DPA.  
**Q83.** JWT validation must include: (a) signature, `exp`, `iss`, `aud` as applicable (b) color of logo (c) RAID level.  
**Q84.** GraphQL depth limits primarily mitigate: (a) DoS via expensive queries (b) BGP hijacks (c) BIOS passwords.  
**Q85.** SRI mitigates: (a) compromised CDN file substitution (b) SQLi only (c) DHCP starvation.  
**Q86.** CSP helps with: (a) XSS reduction and blast control (b) disk encryption always (c) Kerberos only.  
**Q87.** CORS is not a substitute for: (a) server-side authorization (b) TLS certificate pinning only (c) RAID 6.  
**Q88.** STIX without validation risks: (a) garbage or malicious intel propagation (b) faster CPU (c) WPA3.  
**Q89.** Osquery deployment needs: (a) privacy governance and query scope (b) no logging (c) domain admin for desktops only always.  
**Q90.** CI/CD OIDC reduces: (a) static cloud keys in repos (b) unit tests (c) MFA everywhere.  
**Q91.** Terraform state exposure is dangerous because: (a) may contain secrets and sensitive infra layout (b) improves BGP (c) required for DNS.  
**Q92.** Policy-as-code (e.g., OPA) applies checks: (a) pre-deploy on IaC plans (b) only post-breach (c) never on IAM.  
**Q93.** Executive reporting should emphasize: (a) material scenarios and remediation owners (b) raw grep (c) employee gossip.  
**Q94.** Differential privacy is about: (a) bounding individual influence on published stats (b) RAID 6 (c) DKIM.  
**Q95.** MPC allows: (a) joint compute without sharing raw inputs (under model) (b) infinite line-rate AES on laptop always (c) SMTP only.  
**Q96.** Prompt injection defenses include: (a) trust boundaries, tool allowlists, output validation (b) disabling HTTPS (c) chmod 777.  
**Q97.** HE is a silver bullet for all analytics: (a) true (b) false (c) legally banned.  
**Q98.** Network TAP vs SPAN: TAP often gives: (a) better fidelity under load than SPAN in many designs (b) always worse (c) encrypts TLS automatically.  
**Q99.** Threat intel operationalization means: (a) detection/response changes from intel (b) hoarding PDFs (c) deleting SIEM.  
**Q100.** Composition security means: (a) analyze whole system glue, not only parts (b) ignore microservices trust (c) trust LAN.

### Capstone Part 3 answer key

81–90: A/A/A/A/A/A/A/A/A/A  
91–100: A/A/A/A/A/A/B/A/A/A

---

## Appendix F — OWASP API Security (2019) at a glance

| Risk category | One-line workplace meaning |
|---------------|----------------------------|
| **API1 Broken object level authz** | Users can access others’ objects by changing IDs. |
| **API2 Broken authentication** | Weak tokens, bad MFA, credential stuffing on APIs. |
| **API3 Excessive data exposure** | Mobile “convenience” responses leak extra fields. |
| **API4 Lack of resources and rate limits** | Scraping, brute force, cost bombs. |
| **API5 Broken function level authz** | Admin endpoints hidden but not protected. |
| **API6 Mass assignment** | Client sets `role=admin` in JSON body. |
| **API7 Security misconfiguration** | Debug stacks, default accounts, verbose errors. |
| **API8 Injection** | SQL/NoSQL/OS command via parameters. |
| **API9 Improper assets management** | Shadow APIs, old `/v1` still exposed. |
| **API10 Insufficient logging and monitoring** | No trace for fraud or IR. |

**Kali lab (design):** Pick one public API doc (authorized); list three tests your team would run in staging (no customer harm).

---

## Appendix G — Sample weekly syllabus (24 weeks, 3 lessons/week)

| Week | Focus | Suggested lessons |
|------|--------|-------------------|
| 1–2 | Foundations | L1-01–L1-10 |
| 3–4 | Human + ops | L1-11–L1-20 |
| 5–6 | Governance + home | L1-21–L1-25 + Lab A start |
| 7–8 | Web + TLS | L2-01–L2-10 |
| 9–10 | App flaws | L2-11–L2-20 |
| 11–12 | Modern web | L2-21–L2-25 + Lab B |
| 13–14 | Vuln + logging | L3-01–L3-10 |
| 15–16 | Intel + NSM | L3-11–L3-25 |
| 17–18 | Enterprise ID + cloud | L4-01–L4-10 |
| 19–20 | DevSecOps + exec | L4-11–L4-25 |
| 21–22 | Architecture + crypto futures | L5-01–L5-15 |
| 23–24 | Research edge + capstone | L5-16–L5-25 + Parts 1–3 exams |

Adjust pacing for cohort; add **Lab sequence A–C** between weeks.

---

## Appendix H — Certification alignment (illustrative, not endorsements)

| Credential | This curriculum overlap (high level) |
|------------|--------------------------------------|
| **CompTIA Security+** | L1–L2 bulk; parts of L3 logging/IR. |
| **CySA+** | L3 SIEM, intel, IR; L4 SOC workflows. |
| **PenTest+** | Ethical scope in L3/L5; **only** with legal lab RoE. |
| **CASP+ / CISSP (later)** | L4–L5 architecture, risk, governance depth. |
| **CCSP** | L4 cloud logging, IAM, DR when extended with vendor labs. |

Always use official exam objectives for gaps analysis.

---

## Appendix I — Scenario pack (write-ups for triage drills)

**Scenario 1 — “Finance forwarded the CEO’s urgent wire”**  
Indicators: domain look-alike, urgency, new account number, no phone callback culture violated.  
Tasks: classify BEC vs account takeover; preserve headers; comms freeze; finance callback procedure.

**Scenario 2 — “Spike in `kubectl` exec from CI service account”**  
Indicators: non-human hours, new clusterRoleBinding, image pull from unknown registry.  
Tasks: map blast radius; revoke tokens; check pipeline YAML history; incident commander checklist.

**Scenario 3 — “Customer reports another user’s invoice in portal”**  
Indicators: IDOR pattern; missing authz on object GET.  
Tasks: hotfix pattern (feature flag off); forensic log of accessed IDs; customer notification policy consult.

**Scenario 4 — “Security tool shows self-signed TLS on internal API”**  
Indicators: missed cert rotation vs malicious MITM.  
Tasks: validate config management drift; compare cert fingerprint to vault; out-of-band verify with second path.

**Scenario 5 — “WAF blocked 90% traffic after deploy”**  
Indicators: new JSON field tripping XSS rule; false positive surge.  
Tasks: rollback vs detect-only; tune rule; postmortem on CSP vs WAF overlap.

---

## Appendix J — Grading rubric (project: “Lab network dossier”)

| Criterion | Excellent | Needs work |
|-----------|-----------|------------|
| **Scope & ethics** | Written RoE; only owned/lab targets | Ambiguous or external targets |
| **Technical accuracy** | Commands correct; concepts precise | Major misconceptions |
| **Evidence** | Hashes, timestamps, reproducible steps | Assertions only |
| **Risk communication** | Business impact + control mapping | Jargon-only |
| **Remediation** | Prioritized, feasible, owners | Generic “patch everything” |

Weight ethics and evidence highest; fail submissions that violate scope rules.

---

## Appendix K — Glossary addendum (API, DevOps, intel)

| Term | Meaning |
|------|---------|
| **IDOR** | Insecure direct object reference — missing object-level authz. |
| **OIDC federated trust** | Trust chain between IdPs and SaaS via signed tokens/metadata. |
| **OPA / Conftest** | Policy-as-code engines testing IaC JSON/YAML. |
| **OIDC in CI** | Short-lived cloud creds from pipeline identity, not static keys. |
| **STIX bundle** | Container of related intel objects for exchange. |
| **TAXII collection** | Server-side grouping of objects clients poll or push. |
| **Report-only CSP** | Sends violations without blocking render. |
| **Poisoned pipeline** | CI compromise altering artifacts or stealing secrets. |

---

*Document version: 1.2 — Part 3 (lessons 21–25), Q31–40 banks, capstone Q81–100, appendices F–K. Learn-Hub: split on `### Lx-yy` and `<!-- id: lh-sec-* -->`.*
