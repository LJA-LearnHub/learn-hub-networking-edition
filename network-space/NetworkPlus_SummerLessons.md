# CompTIA Network+ Summer Lesson Plan
### 10-Week Introductory Course with Cisco Packet Tracer Integration

---

| 10 Weeks | 50 Lessons | 9 PT Labs | N10-009 Aligned |
|:---:|:---:|:---:|:---:|

---

## Course Overview

This 10-week summer program introduces students to core networking concepts aligned with the CompTIA Network+ N10-009 certification exam. Each week combines structured classroom lessons, conceptual mini quizzes, and hands-on Cisco Packet Tracer labs to reinforce learning through practical application.

### Course Goals

- Build foundational understanding of how networks are designed, configured, and secured
- Develop hands-on skills using Cisco Packet Tracer as a virtual lab environment
- Prepare students for further study toward the CompTIA Network+ certification
- Practice a structured troubleshooting methodology for real-world scenarios

### Required Tools & Materials

- **Cisco Packet Tracer** — free with Cisco NetAcad account at netacad.com
- **CompTIA Network+ Study Guide (N10-009)** — Professor Messer free video series recommended
- A computer capable of running Packet Tracer (Windows, Mac, or Linux)
- Lab worksheet packet (provided by instructor each week)

---

## Course Schedule at a Glance

| Week | Unit Title | Focus Area |
|------|-----------|-----------|
| Week 1 | Networking Fundamentals & the OSI Model | Laying the foundation: how networks communicate |
| Week 2 | TCP/IP & IP Addressing | The language of the Internet: protocols and addresses |
| Week 3 | Network Devices & Infrastructure | The hardware that makes networks tick |
| Week 4 | VLANs, Trunking & Switching Concepts | Segmenting traffic for security and efficiency |
| Week 5 | Routing Protocols & WAN Concepts | Getting data from here to anywhere |
| Week 6 | DNS, DHCP, NAT & Network Services | The services that keep networks running automatically |
| Week 7 | Network Security Fundamentals | Protecting data and devices from threats |
| Week 8 | Wireless Networking & Cloud Concepts | Cutting the cord and moving to the cloud |
| Week 9 | Network Troubleshooting & Tools | Finding and fixing problems like a pro |
| Week 10 | Review, Capstone Project & Exam Prep | Bringing it all together and preparing for success |

---

## Assessment Summary

| Assessment | Per Item | Total | Notes |
|-----------|---------|-------|-------|
| Weekly Mini Quizzes (x9) | 10 pts each | 90 pts | Knowledge checks every week |
| Weekly PT Labs (x9) | 20 pts each | 180 pts | Hands-on Packet Tracer skills |
| Midpoint Project (Wk 6) | 75 pts | 75 pts | Full network design document |
| Capstone PT Project (Wk 10) | 100 pts | 100 pts | Complete enterprise network build |
| Practice Exam (Wk 10) | 55 pts | 55 pts | Scored against N10-009 objectives |
| **Total** | | **500 pts** | |

---

## CompTIA Network+ N10-009 Exam Domain Coverage

| Exam Domain | Weight | Weeks Covered |
|------------|--------|--------------|
| 1.0 Networking Concepts | 23% | Weeks 1, 2, 8 |
| 2.0 Network Implementation | 19% | Weeks 3, 4, 5 |
| 3.0 Network Operations | 17% | Weeks 6, 8 |
| 4.0 Network Security | 20% | Weeks 7, 8 |
| 5.0 Network Troubleshooting | 21% | Weeks 9, 10 |

---

# Weekly Lesson Plans

---

## Week 1 — Networking Fundamentals & the OSI Model
*Laying the foundation: how networks communicate*

### Learning Objectives

- Define what a computer network is and why it's important
- Explain the OSI 7-layer model and each layer's purpose
- Differentiate between LAN, WAN, MAN, and PAN network types
- Identify common network topologies (star, mesh, bus, ring, hybrid)
- Install and navigate Cisco Packet Tracer

### Daily Lessons

| Day | Lesson Title | Content |
|-----|-------------|---------|
| Day 1 | What is Networking? | Introduction to networks, the Internet, and why networking matters. Overview of course expectations and tools (Packet Tracer setup). |
| Day 2 | OSI Model – Layers 1–3 | Physical, Data Link, and Network layers. Signal types, MAC vs IP addressing, basic frame structure. |
| Day 3 | OSI Model – Layers 4–7 | Transport, Session, Presentation, Application layers. TCP vs UDP overview, ports introduction. |
| Day 4 | Network Types & Topologies | LAN, WAN, MAN, PAN. Star, mesh, bus, ring, and hybrid topologies with real-world examples. |
| Day 5 | Packet Tracer Introduction | Hands-on orientation to Cisco Packet Tracer: placing devices, connecting cables, simulation mode. |

### Assessment & Activities

**📝 Mini Quiz**
10-question quiz covering OSI layer names, functions, and matching protocols to layers.

**🔧 Project Task**
Draw and label a home network diagram identifying at least 3 devices and which OSI layers they operate at.

**🖥️ Packet Tracer Lab**
Build a simple 3-PC star topology network. Connect devices, assign IPs, and verify connectivity using the ping command in simulation mode.

---

## Week 2 — TCP/IP & IP Addressing
*The language of the Internet: protocols and addresses*

### Learning Objectives

- Compare the TCP/IP model to the OSI model
- Explain how IP addressing works (IPv4 classes, binary conversion)
- Calculate subnet masks and understand CIDR notation
- Identify public vs private IP ranges
- Configure basic IPv4 addresses on Packet Tracer devices

### Daily Lessons

| Day | Lesson Title | Content |
|-----|-------------|---------|
| Day 1 | TCP/IP Model Deep Dive | TCP/IP layers vs OSI. How data is encapsulated/decapsulated through each layer. PDUs: bits, frames, packets, segments. |
| Day 2 | Binary & IP Addressing | Binary number system, converting decimals to binary. IPv4 structure: 4 octets, dotted decimal notation. |
| Day 3 | IP Address Classes & Subnets | Class A/B/C/D/E ranges, private vs public IP, APIPA. Subnet mask basics and slash notation (/24, /16). |
| Day 4 | Subnetting Fundamentals | Why we subnet, calculating network/broadcast/host addresses. Step-by-step subnetting practice. |
| Day 5 | IP Config Lab | Configuring static IPs on routers and hosts. Reviewing ipconfig/ifconfig output, default gateways. |

### Assessment & Activities

**📝 Mini Quiz**
Subnetting worksheet: given a network address and mask, identify network ID, broadcast, and valid host range (5 problems).

**🔧 Project Task**
Create a subnet plan for a fictional small office with 3 departments. Determine IP ranges for each department from a /24 block.

**🖥️ Packet Tracer Lab**
Configure static IPv4 addresses on a multi-PC network with a router. Test inter-VLAN communication and document IP scheme in Packet Tracer.

---

## Week 3 — Network Devices & Infrastructure
*The hardware that makes networks tick*

### Learning Objectives

- Describe the functions of hubs, switches, routers, and firewalls
- Explain how a switch builds and uses a MAC address table
- Differentiate between Layer 2 and Layer 3 switching
- Understand the role of access points and wireless controllers
- Configure basic switch settings in Packet Tracer

### Daily Lessons

| Day | Lesson Title | Content |
|-----|-------------|---------|
| Day 1 | Hubs, Bridges & Switches | Evolution from hubs to switches. Collision domains vs broadcast domains, MAC address table operation, half/full duplex. |
| Day 2 | Routers & Layer 3 | How routers make forwarding decisions, routing tables, directly connected routes. Default routes and static routing overview. |
| Day 3 | Firewalls, IDS/IPS & Load Balancers | Stateful vs stateless firewalls, perimeter security, ACL overview. IDS vs IPS differences. |
| Day 4 | Wireless Access Points & Controllers | Infrastructure vs ad-hoc mode, SSID, BSS/ESS. Wireless LAN controllers (WLC) concept, fat vs thin APs. |
| Day 5 | Switch Configuration Lab | CLI basics: hostname, banners, passwords, enable/disable ports, port security intro in Packet Tracer. |

### Assessment & Activities

**📝 Mini Quiz**
Device identification quiz: 15 scenario questions matching devices to network problems (e.g., "Which device reduces collision domains?").

**🔧 Project Task**
Design a small business network diagram showing correct device placement (switch, router, firewall, AP, servers) with written justification.

**🖥️ Packet Tracer Lab**
Build a 2-switch, 1-router topology. Configure hostnames, passwords, and enable trunk links between switches. Verify with show commands.

---

## Week 4 — VLANs, Trunking & Switching Concepts
*Segmenting traffic for security and efficiency*

### Learning Objectives

- Explain the purpose and benefits of VLANs
- Configure VLANs and assign access ports on a Cisco switch
- Describe IEEE 802.1Q trunking and its role in VLAN tagging
- Understand Spanning Tree Protocol (STP) and loop prevention
- Implement inter-VLAN routing using a router-on-a-stick setup

### Daily Lessons

| Day | Lesson Title | Content |
|-----|-------------|---------|
| Day 1 | VLAN Concepts | Why VLANs? Broadcast control, security, flexibility. Default VLAN, native VLAN, management VLAN, data VLAN distinctions. |
| Day 2 | VLAN Configuration | Creating VLANs, assigning ports as access ports, verifying VLANs with show vlan brief. Naming and documenting VLANs. |
| Day 3 | Trunking & 802.1Q | Trunk ports, encapsulation, 802.1Q tag structure. DTP (Dynamic Trunking Protocol), trunk/access port modes. |
| Day 4 | Spanning Tree Protocol | Broadcast storms and loops, STP root bridge election, port states (blocking, learning, forwarding). RSTP improvements. |
| Day 5 | Inter-VLAN Routing Lab | Router-on-a-stick: subinterfaces, 802.1Q encapsulation on router, end-to-end VLAN routing test. |

### Assessment & Activities

**📝 Mini Quiz**
20-question quiz: VLAN IDs, trunk vs access, STP port states, 802.1Q tag fields, and inter-VLAN routing method identification.

**🔧 Project Task**
Plan and document a VLAN scheme for a school with 4 VLANs (Students, Staff, Admin, IoT). Justify the design with security reasoning.

**🖥️ Packet Tracer Lab**
Multi-switch VLAN lab: create 3 VLANs, configure access and trunk ports, add a router for inter-VLAN routing. Test with ping across VLANs.

---

## Week 5 — Routing Protocols & WAN Concepts
*Getting data from here to anywhere*

### Learning Objectives

- Distinguish between static and dynamic routing
- Explain distance vector vs link-state routing protocols
- Describe RIP, OSPF, and EIGRP at a conceptual level
- Understand WAN technologies: leased lines, MPLS, broadband, SD-WAN
- Configure and verify basic static and dynamic routing in Packet Tracer

### Daily Lessons

| Day | Lesson Title | Content |
|-----|-------------|---------|
| Day 1 | Static vs Dynamic Routing | Administrative distance, static route syntax (ip route), use cases for static routing, default route (/0). |
| Day 2 | Distance Vector Protocols (RIP) | How RIP works, hop count metric, RIPv1 vs RIPv2, convergence issues, split horizon, route poisoning. |
| Day 3 | Link-State Protocols (OSPF) | OSPF concepts: link-state database, SPF algorithm, areas (backbone/non-backbone), neighbor adjacencies, DR/BDR. |
| Day 4 | WAN Technologies | Types of WAN connections: dedicated leased lines, DSL, cable, fiber, MPLS, Metro Ethernet, 4G/5G, SD-WAN overview. |
| Day 5 | Dynamic Routing Lab | Configure OSPF across a 3-router topology in Packet Tracer. Verify routes, test failover by disabling a link. |

### Assessment & Activities

**📝 Mini Quiz**
Routing protocol matching quiz + 3 routing table analysis questions. Identify best path, AD values, and protocol type from output.

**🔧 Project Task**
Research and write a 1-page comparison of MPLS vs SD-WAN for a mid-size enterprise. Include cost, scalability, and management considerations.

**🖥️ Packet Tracer Lab**
3-router OSPF lab: configure OSPF on all routers, advertise networks, verify with `show ip ospf neighbor` and `show ip route`. Test end-to-end ping.

---

## Week 6 — DNS, DHCP, NAT & Network Services
*The services that keep networks running automatically*

### Learning Objectives

- Explain how DNS resolves hostnames to IP addresses
- Describe the DHCP lease process (DORA)
- Understand how NAT/PAT translates private IPs to public IPs
- Identify the role of NTP, SNMP, Syslog, and TFTP
- Configure a DHCP server and DNS lookup in Packet Tracer

### Daily Lessons

| Day | Lesson Title | Content |
|-----|-------------|---------|
| Day 1 | DNS – Domain Name System | Hierarchical namespace, root/TLD/authoritative servers, A, AAAA, CNAME, MX, NS record types. Recursive vs iterative queries. |
| Day 2 | DHCP – Dynamic Host Config | DORA process (Discover, Offer, Request, Acknowledge), lease time, scope options (gateway, DNS, subnet). DHCP relay agents. |
| Day 3 | NAT & PAT | Why NAT exists, inside/outside local/global addresses. Static NAT, Dynamic NAT, PAT (overloading). Verifying NAT translations. |
| Day 4 | Network Management Services | NTP hierarchy and stratum levels, SNMP (versions 1/2c/3), Syslog severity levels, TFTP for config backups. |
| Day 5 | DHCP & DNS Lab | Configure a DHCP server in Packet Tracer, assign scope options, verify automatic IP assignment on clients. Add a DNS server for name resolution. |

### Assessment & Activities

**📝 Mini Quiz**
Service-to-port matching quiz (DNS 53, DHCP 67/68, NTP 123, SNMP 161, Syslog 514) + 5 scenario questions on NAT troubleshooting.

**🔧 Project Task**
⭐ **Midpoint Project:** Build a complete small office network design document (IP plan, VLAN plan, routing plan, service plan) for a fictional 30-user company.

**🖥️ Packet Tracer Lab**
Full services lab: configure DHCP, DNS, and a NAT/PAT translation on a border router. Verify that internal hosts reach an external simulated server using domain names.

---

## Week 7 — Network Security Fundamentals
*Protecting data and devices from threats*

### Learning Objectives

- Identify common network security threats (malware, DoS, MITM, phishing)
- Explain defense-in-depth and the CIA triad
- Describe AAA: Authentication, Authorization, and Accounting
- Configure basic ACLs to filter network traffic
- Understand port security and how to mitigate switch attacks

### Daily Lessons

| Day | Lesson Title | Content |
|-----|-------------|---------|
| Day 1 | Security Threats & Attack Types | Malware types (virus, worm, ransomware, trojan), phishing/spear phishing, DoS/DDoS, man-in-the-middle, replay, spoofing attacks. |
| Day 2 | Security Concepts: CIA & AAA | Confidentiality, Integrity, Availability triad. Authentication methods (MFA, certificates, biometrics), RADIUS/TACACS+ for AAA. |
| Day 3 | Access Control Lists (ACLs) | Standard vs extended ACLs, ACL logic (top-down, implicit deny), applying ACLs to interfaces (in vs out). Writing ACL statements. |
| Day 4 | Switch Security & Port Security | MAC flooding, ARP spoofing, DHCP snooping, dynamic ARP inspection. Port security: max MAC, violation modes. |
| Day 5 | ACL Configuration Lab | Configure standard and extended ACLs in Packet Tracer to permit/deny specific hosts and services. Verify filtering with ping and trace. |

### Assessment & Activities

**📝 Mini Quiz**
15-question security quiz: threat identification, ACL logic questions (what traffic is permitted/denied), AAA protocol comparison.

**🔧 Project Task**
Security audit scenario: given a network diagram, identify 5 security vulnerabilities and propose a mitigation strategy for each.

**🖥️ Packet Tracer Lab**
Apply extended ACLs to block specific ICMP and HTTP traffic between VLANs. Enable port security on access ports. Verify with `show port-security` and ACL testing.

---

## Week 8 — Wireless Networking & Cloud Concepts
*Cutting the cord and moving to the cloud*

### Learning Objectives

- Explain 802.11 wireless standards (a/b/g/n/ac/ax) and their characteristics
- Describe wireless encryption: WEP, WPA, WPA2, WPA3
- Identify wireless network threats and mitigation strategies
- Understand cloud deployment models: public, private, hybrid
- Differentiate IaaS, PaaS, and SaaS service models

### Daily Lessons

| Day | Lesson Title | Content |
|-----|-------------|---------|
| Day 1 | 802.11 Wireless Standards | Evolution of Wi-Fi: 802.11a/b/g/n/ac (Wi-Fi 5)/ax (Wi-Fi 6). Frequency bands (2.4 GHz vs 5 GHz), channels, channel overlap, MIMO. |
| Day 2 | Wireless Security | WEP vulnerabilities, WPA/WPA2 (Personal vs Enterprise), WPA3 improvements. Wireless threats: evil twin, rogue AP, deauth attacks. |
| Day 3 | Wireless Design & Troubleshooting | Site surveys, RSSI, SNR, interference sources, overlapping channels. SSID broadcasting, BSS/ESS, roaming with WLC. |
| Day 4 | Cloud Computing Concepts | NIST cloud definition, deployment models (public/private/hybrid/community). Service models (IaaS, PaaS, SaaS). Connectivity: VPN, Direct Connect. |
| Day 5 | Wireless Lab in Packet Tracer | Add an access point to an existing network, configure SSID and WPA2 security, connect wireless clients, and verify connectivity. |

### Assessment & Activities

**📝 Mini Quiz**
Wireless standard matching (standard → speed, frequency, year) + 5 cloud scenario questions (which service model applies to a given scenario).

**🔧 Project Task**
Wireless site survey plan: design a wireless layout for a 2-floor office building. Indicate AP placement, SSID names, channel assignments, and security settings.

**🖥️ Packet Tracer Lab**
Configure a home wireless router in Packet Tracer: set SSID, WPA2 passphrase, DHCP pool, and NAT. Connect multiple wireless and wired devices and verify full connectivity.

---

## Week 9 — Network Troubleshooting & Tools
*Finding and fixing problems like a pro*

### Learning Objectives

- Apply a structured troubleshooting methodology (top-down, bottom-up, divide-and-conquer)
- Use CLI tools: ping, traceroute/tracert, nslookup, netstat, ipconfig/ifconfig
- Interpret basic cable test, Wi-Fi analyzer, and protocol analyzer output
- Identify common Layer 1–3 connectivity problems and solutions
- Document network issues and resolutions professionally

### Daily Lessons

| Day | Lesson Title | Content |
|-----|-------------|---------|
| Day 1 | Troubleshooting Methodologies | CompTIA's 7-step troubleshooting process. Top-down, bottom-up, divide-and-conquer approaches. When to escalate. |
| Day 2 | Layer 1 & 2 Troubleshooting | Physical issues: cable faults, incorrect cable types, interface errors (CRC, runts, giants). Switch issues: duplex mismatch, STP problems. |
| Day 3 | Layer 3 & Above Troubleshooting | IP misconfiguration, routing issues, DNS failures. Reading routing tables, checking ARP caches. DHCP exhaustion. |
| Day 4 | CLI Tools Deep Dive | Hands-on walkthrough: ping (TTL, success rate), traceroute/tracert, nslookup/dig, netstat -an, ipconfig /all, arp -a, route print. |
| Day 5 | Capture & Analyze Lab | Use Packet Tracer simulation mode as a protocol analyzer. Capture pings, HTTP requests, and DHCP exchanges to observe frame/packet details. |

### Assessment & Activities

**📝 Mini Quiz**
Troubleshooting scenario quiz: 10 short scenarios describing symptoms. Students identify the most likely cause and recommend the first diagnostic step.

**🔧 Project Task**
Packet Tracer Broken Network: fix a pre-built broken topology with 6 deliberate errors spanning Layers 1–3. Document each fault found and the fix applied.

**🖥️ Packet Tracer Lab**
Troubleshooting lab: given a malfunctioning 4-router OSPF network with VLAN and ACL errors, diagnose and repair all faults. Use `show` and `debug` commands.

---

## Week 10 — Review, Capstone Project & Exam Prep
*Bringing it all together and preparing for success*

### Learning Objectives

- Synthesize all 10 weeks of material into a cohesive understanding
- Demonstrate ability to build, configure, and troubleshoot a complete network
- Identify personal knowledge gaps and create a targeted study strategy
- Understand the structure and format of the CompTIA Network+ N10-009 exam
- Practice with realistic exam-style questions across all domains

### Daily Lessons

| Day | Lesson Title | Content |
|-----|-------------|---------|
| Day 1 | Exam Domain Review – Domains 1 & 2 | Networking Concepts (23%) and Network Implementation (19%). Key topics, flashcard review, and Q&A session. |
| Day 2 | Exam Domain Review – Domains 3 & 4 | Network Operations (17%) and Network Security (20%). Key topics, common pitfalls, and Q&A session. |
| Day 3 | Exam Domain Review – Domain 5 & Strategy | Network Troubleshooting (21%). Test-taking tips, process of elimination, Performance-Based Question (PBQ) strategy. |
| Day 4 | Capstone Presentations | Students present their capstone Packet Tracer network project. Peer feedback and instructor evaluation. |
| Day 5 | Practice Exam & Debrief | Full 90-question timed practice exam. Detailed answer debrief, identify top 3 weak areas, personalized study plan creation. |

### Assessment & Activities

**📝 Mini Quiz**
Full 90-question timed practice exam covering all 5 CompTIA Network+ N10-009 exam domains with performance-based questions included.

**🔧 Capstone Project**
⭐ Design and build a complete enterprise branch network in Packet Tracer with VLANs, OSPF routing, DHCP, DNS, NAT, ACLs, and wireless. Submit config files + written design document.

**🖥️ Capstone Packet Tracer Lab**
The capstone network must include:
- 3 VLANs with inter-VLAN routing
- OSPF between 2 sites
- NAT/PAT on border router
- DHCP and DNS servers
- Wireless AP with WPA2 security
- ACLs blocking unauthorized traffic

---

## Recommended Resources

### Free Online Resources

- **Professor Messer** — professormesser.com — Free CompTIA Network+ (N10-009) video course
- **Cisco NetAcad** — netacad.com — Free Packet Tracer download + intro networking courses
- **ExamCompass** — examcompass.com — Free practice quizzes organized by exam domain
- **ITPro.TV / CBT Nuggets** — Video-based learning for visual learners (paid, free trials available)
- **Subnet Practice** — subnettingpractice.com — Dedicated subnetting drill tool

### Suggested Textbooks

- *CompTIA Network+ Study Guide (N10-009)* by Mike Meyers — All-in-One approach
- *CompTIA Network+ Certification All-in-One Exam Guide* by Mike Meyers (McGraw-Hill)
- *Network+ Guide to Networks* by Jill West (Cengage) — Classroom-friendly with integrated labs

### Packet Tracer Tips for Students

- Use **File > Save** regularly — Packet Tracer does not auto-save
- **Simulation mode** (Alt+Shift+S) lets you watch packets move hop-by-hop — use it every lab
- The CLI panel uses **Cisco IOS** — `?` for help, `Tab` for autocomplete, `Ctrl+Z` to exit a mode
- Save configs with `copy running-config startup-config` or they reset on reboot
- The Cisco NetAcad skills assessments use Packet Tracer — practice labs are your best exam prep

### Next Steps After This Course

- Register for **CompTIA Network+ N10-009** at comptia.org (Pearson VUE testing centers or online proctoring)
- Consider **Cisco CCNA** as a follow-on certification for deeper networking skills
- Explore **CompTIA Security+** for cybersecurity after completing Network+
- Join study communities: Reddit r/CompTIA, Discord Study Together, Anki flashcard decks

---

*This lesson plan is designed for educational purposes. CompTIA Network+ is a registered trademark of CompTIA, Inc. Cisco Packet Tracer is a trademark of Cisco Systems, Inc.*