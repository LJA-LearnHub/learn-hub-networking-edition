# CompTIA Tech+ (FC0-U71) Study Guide

---

## 1. Databases

### Types of Databases

| Type | Description | Best For |
|------|-------------|----------|
| **Relational (SQL)** | Data stored in structured tables with rows/columns; uses foreign keys to link tables | Structured data, financial records, inventory |
| **Non-Relational (NoSQL)** | Flexible schema; stores data as documents, key-value pairs, graphs, or wide-columns | Unstructured/semi-structured data, social media, big data |
| **Flat File** | Data stored in a single plain text or CSV file with no relationships | Simple, small datasets; spreadsheets |
| **Hierarchical** | Data organized in a tree structure (parent-child) | File systems, org charts |
| **In-Memory** | Data stored in RAM instead of disk (e.g., Redis) | Caching, real-time analytics |
| **Cloud Database** | Hosted and managed by a cloud provider (e.g., AWS RDS, Azure SQL) | Scalable, remote-access applications |

### Key Database Concepts

- **DBMS (Database Management System)** — Software used to manage databases (e.g., MySQL, PostgreSQL, MongoDB, SQLite)
- **Schema** — The structure/blueprint of a database (tables, fields, data types)
- **Query** — A request for data; SQL uses `SELECT`, `INSERT`, `UPDATE`, `DELETE`
- **Primary Key** — Uniquely identifies each record in a table
- **Foreign Key** — Links a record in one table to a record in another
- **Index** — Speeds up data retrieval at the cost of additional storage
- **ACID Properties** — Atomicity, Consistency, Isolation, Durability (ensures reliable transactions)

### Benefits & Limits

| Type | Benefits | Limits |
|------|----------|--------|
| Relational | Structured, consistent, great for complex queries | Rigid schema; harder to scale horizontally |
| NoSQL | Flexible, highly scalable, handles large volumes | Less consistent; not ideal for complex joins |
| Flat File | Simple, portable, no software needed | No relationships, poor performance at scale |
| In-Memory | Extremely fast | Volatile (data lost on power loss); expensive |

---

## 2. Programming Languages

### Categories of Languages

#### Compiled Languages
- Source code is translated **entirely** into machine code before execution by a **compiler**
- Results in a standalone executable file (`.exe`, binary)
- **Faster at runtime** because translation is done beforehand
- Errors are caught at compile time
- **Examples:** C, C++, Go, Rust

#### Interpreted / Scripting Languages
- Code is translated **line-by-line** at runtime by an **interpreter**
- No separate compilation step; easier to write and test quickly
- Generally **slower at runtime** than compiled languages
- **Examples:** Python, JavaScript, Bash, PowerShell, Ruby, PHP

#### Pseudocode
- A **plain-language description** of an algorithm or program logic
- Not an actual programming language; cannot be executed
- Used in planning, documentation, and teaching
- Bridges the gap between human thinking and actual code

### Core Programming Concepts

#### Variables & Data Types
- **Variable** — A named container for storing a value (`x = 5`)
- **Data Types:** Integer, Float, String, Boolean, Array/List, Object

#### Branching (Conditional Logic)
- Controls the **flow of execution** based on conditions
- **`if` / `else if` / `else`** — Executes different code blocks based on true/false conditions
- **`switch` / `case`** — Selects one of many code blocks to run based on a value
```
if temperature > 100:
    print("Too hot")
else:
    print("OK")
```

#### Loops (Iteration)
- Repeats a block of code multiple times
- **`for` loop** — Repeats a set number of times or over a collection
- **`while` loop** — Repeats while a condition remains true
- **`do-while`** — Executes at least once, then checks condition
```
for i in range(5):
    print(i)   # prints 0, 1, 2, 3, 4
```

#### Functions / Procedures
- A **named, reusable block of code** that performs a specific task
- Can accept **parameters** (inputs) and **return** values (outputs)
- Promotes **DRY** principle — Don't Repeat Yourself
```
function add(a, b):
    return a + b
```

#### Arrays / Lists
- A collection of multiple values stored in a single variable
- Accessed by **index** (usually starting at 0)
- `colors = ["red", "green", "blue"]` → `colors[0]` = "red"

#### Object-Oriented Programming (OOP) Concepts
- **Class** — A blueprint/template for creating objects
- **Object** — An instance of a class
- **Inheritance** — A class can inherit properties from a parent class
- **Encapsulation** — Hiding internal data; only exposing what's needed

#### Other Key Concepts
- **Comment** — Non-executed text in code for documentation (`# this is a comment`)
- **Syntax** — The rules of a programming language
- **Bug / Debugging** — An error in code; the process of finding and fixing it
- **Library / API** — Pre-written code you can use in your programs
- **Version Control** — Tracking changes to code over time (e.g., Git)

---

## 3. Computer Hardware & Software

### Hardware

| Component | Purpose | Key Notes |
|-----------|---------|-----------|
| **CPU (Processor)** | Executes instructions; the "brain" of the computer | Speed measured in GHz; cores affect multitasking |
| **RAM** | Temporary working memory for running programs | Volatile; faster = better multitasking; measured in GB |
| **ROM** | Stores permanent firmware (e.g., BIOS/UEFI) | Non-volatile; read-only |
| **Storage (HDD/SSD)** | Long-term data storage | SSD = faster, more durable; HDD = cheaper per GB |
| **GPU** | Renders graphics; also used for parallel computing | Dedicated (discrete) vs. integrated |
| **Motherboard** | Connects all components | Contains CPU socket, RAM slots, PCIe slots |
| **PSU** | Converts AC to DC power for components | Measured in watts |
| **NIC (Network Interface Card)** | Connects the computer to a network | Wired (Ethernet) or wireless (Wi-Fi) |
| **Sound Card** | Processes audio input/output | Often integrated into motherboard |
| **Monitor/Display** | Visual output device | Resolution, refresh rate, panel type matter |

### Input vs. Output Devices

- **Input:** Keyboard, mouse, scanner, microphone, webcam, touchscreen
- **Output:** Monitor, printer, speakers, projector
- **Both (I/O):** Touchscreen, USB hub, network card

### Software

| Type | Description | Examples |
|------|-------------|---------|
| **Operating System (OS)** | Manages hardware and provides platform for apps | Windows, macOS, Linux, Android |
| **Application Software** | Software designed for end-user tasks | Word, Chrome, Photoshop |
| **Utility Software** | Maintains/optimizes the system | Antivirus, disk cleaner, backup tools |
| **Firmware** | Embedded software in hardware devices | BIOS/UEFI, router firmware |
| **Middleware** | Software connecting different systems/apps | APIs, database connectors |
| **Drivers** | Allow the OS to communicate with hardware | Printer driver, GPU driver |

### BIOS vs. UEFI
- **BIOS** — Older firmware; initializes hardware on boot; 16-bit, limited to 2TB drives
- **UEFI** — Modern replacement; supports larger drives (>2TB), Secure Boot, faster POST

### Virtualization
- Running multiple **virtual machines (VMs)** on a single physical host
- **Hypervisor** — Software that manages VMs (e.g., VMware, VirtualBox, Hyper-V)
- **Type 1 (Bare-metal)** — Runs directly on hardware (VMware ESXi)
- **Type 2 (Hosted)** — Runs on top of an OS (VirtualBox)

---

## 4. Cables, Connectors & Tools

### Network Cables

| Cable Type | Description | Max Speed | Max Length |
|-----------|-------------|-----------|------------|
| **Cat5e** | Twisted pair; common in older networks | 1 Gbps | 100m |
| **Cat6** | Better shielding, less crosstalk | 10 Gbps (up to 55m) | 100m |
| **Cat6a** | Augmented Cat6; full 10 Gbps | 10 Gbps | 100m |
| **Coaxial (RG-6/RG-59)** | Cable TV, older broadband | Varies | Varies |
| **Fiber Optic** | Uses light; immune to EMI; very fast | 100+ Gbps | km range |

### Fiber Optic Types
- **Single-Mode (SMF)** — Long distance; yellow jacket; uses laser light
- **Multi-Mode (MMF)** — Short distance; orange or aqua jacket; uses LED light

### Common Connectors

| Connector | Used With |
|-----------|-----------|
| **RJ-45** | Ethernet (Cat5e/6/6a) network cables |
| **RJ-11** | Telephone/DSL cables |
| **LC / SC / ST** | Fiber optic cables |
| **BNC** | Coaxial cables |
| **USB-A / USB-B / USB-C / Micro/Mini USB** | Peripheral connections |
| **HDMI** | Audio/video output |
| **DisplayPort** | Audio/video (common on monitors/GPUs) |
| **VGA** | Older analog video |
| **DVI** | Digital/analog video (older) |
| **SATA** | Internal storage drives |
| **PCIe** | Expansion cards (GPU, NIC, SSD) |
| **Thunderbolt** | High-speed data + video (Apple/Intel) |

### Wiring Standards
- **T568A** and **T568B** — Two standards for wiring RJ-45 connectors
- **Straight-through cable** — Both ends use same standard (T568B/T568B); connects different device types (PC to switch)
- **Crossover cable** — Ends use different standards (T568A/T568B); connects same device types (PC to PC)

### Tools

| Tool | Purpose |
|------|---------|
| **Crimper** | Attaches RJ-45/RJ-11 connectors to the end of cables |
| **Cable Tester** | Verifies cable wiring is correct and functional |
| **Punch-down Tool** | Seats wires into keystone jacks and patch panels |
| **Wire Stripper** | Removes insulation from cable ends |
| **Toner & Probe (Fox & Hound)** | Traces cables through walls and panels |
| **Multimeter** | Measures voltage, current, and resistance |
| **Loopback Plug** | Tests network/serial ports for faults |
| **Cable Snips** | Cuts cables cleanly |

---

## 5. Security Concepts & Principles

### Core Security Principles

- **Least Privilege** — Users and systems are given only the minimum access needed to perform their job; reduces attack surface
- **Need to Know** — Even with access rights, users should only access info relevant to their role
- **Separation of Duties** — No single person has full control over a critical process; prevents fraud
- **Defense in Depth** — Using multiple layers of security so that if one fails, others remain
- **Zero Trust** — Never trust, always verify; no implicit trust even inside the network
- **CIA Triad:**
  - **Confidentiality** — Only authorized users can access data (encryption, access controls)
  - **Integrity** — Data is accurate and unaltered (hashing, checksums)
  - **Availability** — Systems and data are accessible when needed (redundancy, backups)

### Authentication & Access Control

- **Authentication** — Proving who you are (username + password, biometrics, MFA)
- **Authorization** — What you're allowed to do after logging in
- **MFA (Multi-Factor Authentication)** — Requires 2+ of: something you know, have, or are
- **SSO (Single Sign-On)** — One login grants access to multiple systems
- **ACL (Access Control List)** — Defines which users/systems can access a resource

### Common Threats

| Threat | Description |
|--------|-------------|
| **Malware** | Malicious software (viruses, worms, Trojans, ransomware, spyware) |
| **Phishing** | Deceptive emails/sites tricking users into giving credentials |
| **Social Engineering** | Manipulating people rather than systems |
| **Man-in-the-Middle (MitM)** | Attacker intercepts communication between two parties |
| **DoS / DDoS** | Overwhelming a system with traffic to deny service |
| **SQL Injection** | Inserting malicious SQL into an input field to manipulate a database |
| **Brute Force** | Trying all possible passwords until one works |

### Security Tools & Practices

- **Firewall** — Filters traffic based on rules; can be hardware or software
- **Antivirus/Anti-malware** — Detects and removes malicious software
- **Encryption** — Scrambles data so only authorized parties can read it (AES, RSA)
- **VPN** — Creates an encrypted tunnel over a public network
- **DMZ (Demilitarized Zone)** — A network segment between the public internet and internal network
- **Patch Management** — Keeping software/OS updated to fix known vulnerabilities

---

## 6. Storage & Speed Concepts

### Storage Types

| Type | Technology | Speed | Durability | Notes |
|------|-----------|-------|-----------|-------|
| **HDD** | Spinning magnetic disks | Slow (~100 MB/s) | Fragile (moving parts) | Cheap per GB |
| **SSD (SATA)** | Flash memory | Fast (~550 MB/s) | Very durable | Common laptop/desktop upgrade |
| **NVMe SSD (M.2/PCIe)** | Flash via PCIe lane | Very fast (3,000–7,000+ MB/s) | Very durable | Fastest consumer storage |
| **Optical (CD/DVD/Blu-ray)** | Laser-read discs | Slow | Fragile | Archival/media |
| **USB Flash Drive** | Flash memory | Moderate | Durable | Portable |
| **SD Card** | Flash memory | Moderate | Durable | Cameras, mobile devices |
| **Tape** | Magnetic tape | Very slow | Long lifespan | Cold archival backup |
| **NAS (Network Attached Storage)** | Multiple drives over network | Network-limited | RAID options | Shared storage |
| **SAN (Storage Area Network)** | High-speed block storage network | Very fast | Enterprise-grade | Data centers |

### RAID (Redundant Array of Independent Disks)

| Level | Description | Min Drives | Fault Tolerance |
|-------|-------------|------------|----------------|
| **RAID 0** | Striping only; max speed, no redundancy | 2 | None |
| **RAID 1** | Mirroring; identical copy on 2 drives | 2 | 1 drive failure |
| **RAID 5** | Striping with parity; good balance | 3 | 1 drive failure |
| **RAID 6** | Striping with double parity | 4 | 2 drive failures |
| **RAID 10** | Mirroring + Striping; fast and redundant | 4 | 1 per mirrored pair |

### Network Speed Units

- **bps** — bits per second (note: lowercase b = bits)
- **Kbps / Mbps / Gbps** — Kilobits, Megabits, Gigabits per second
- **KB / MB / GB / TB** — Kilobytes, Megabytes, Gigabytes, Terabytes (uppercase B = Bytes)
- **1 Byte = 8 bits** — Critical conversion for the exam!

### Network Speed Benchmarks

| Connection | Typical Speed |
|------------|--------------|
| Dial-up | 56 Kbps |
| DSL | 1–100 Mbps |
| Cable Broadband | 25 Mbps – 1 Gbps |
| Fiber (FTTH) | 100 Mbps – 10 Gbps |
| Wi-Fi 5 (802.11ac) | Up to 3.5 Gbps (theoretical) |
| Wi-Fi 6 (802.11ax) | Up to 9.6 Gbps (theoretical) |
| Fast Ethernet | 100 Mbps |
| Gigabit Ethernet | 1 Gbps |
| 10 Gigabit Ethernet | 10 Gbps |

---

## 7. Networking Fundamentals

### OSI Model (7 Layers)

| Layer | Name | Function | Example Protocols/Devices |
|-------|------|----------|--------------------------|
| 7 | Application | User-facing services | HTTP, FTP, DNS, SMTP |
| 6 | Presentation | Data formatting, encryption | SSL/TLS, JPEG |
| 5 | Session | Manages connections/sessions | NetBIOS, RPC |
| 4 | Transport | End-to-end delivery, error checking | TCP, UDP |
| 3 | Network | Logical addressing, routing | IP, ICMP, Router |
| 2 | Data Link | Physical addressing (MAC), framing | Ethernet, Switch |
| 1 | Physical | Raw bits over physical medium | Cables, Hubs, NIC |

> **Mnemonic:** *"All People Seem To Need Data Processing"* (top-down) or *"Please Do Not Throw Sausage Pizza Away"* (bottom-up)

### TCP vs. UDP

| | TCP | UDP |
|-|-----|-----|
| Connection | Connection-oriented (handshake) | Connectionless |
| Reliability | Guaranteed delivery | No guarantee |
| Speed | Slower | Faster |
| Use Cases | Web, email, file transfer | Streaming, VoIP, DNS, gaming |

### Key Protocols & Ports

| Protocol | Port | Purpose |
|---------|------|---------|
| HTTP | 80 | Web traffic (unencrypted) |
| HTTPS | 443 | Web traffic (encrypted) |
| FTP | 20/21 | File transfer |
| SSH | 22 | Secure remote access |
| Telnet | 23 | Remote access (unencrypted) |
| SMTP | 25 | Sending email |
| DNS | 53 | Domain name resolution |
| DHCP | 67/68 | Auto IP assignment |
| POP3 | 110 | Receiving email |
| IMAP | 143 | Receiving email (server-synced) |
| RDP | 3389 | Remote desktop |
| SNMP | 161 | Network device monitoring |

### IP Addressing

- **IPv4** — 32-bit address (e.g., 192.168.1.1); ~4.3 billion addresses
- **IPv6** — 128-bit address (e.g., 2001:0db8::1); nearly unlimited addresses
- **Private IP Ranges (not routable on internet):**
  - 10.0.0.0 – 10.255.255.255
  - 172.16.0.0 – 172.31.255.255
  - 192.168.0.0 – 192.168.255.255
- **DHCP** — Automatically assigns IP addresses to devices
- **DNS** — Translates domain names (google.com) to IP addresses
- **Subnet Mask** — Defines the network vs. host portion of an IP address
- **Default Gateway** — The IP of the router connecting the local network to the internet

### Network Devices

| Device | Function |
|--------|---------|
| **Hub** | Broadcasts data to all devices (Layer 1); outdated |
| **Switch** | Forwards data to specific device using MAC address (Layer 2) |
| **Router** | Connects different networks; uses IP addresses (Layer 3) |
| **Wireless Access Point (WAP)** | Provides wireless connectivity; connects to a wired switch |
| **Modem** | Converts ISP signal to usable network signal |
| **Firewall** | Filters traffic based on rules |
| **Proxy Server** | Acts as intermediary between users and the internet |
| **Load Balancer** | Distributes traffic across multiple servers |

### Wireless Standards

| Standard | Frequency | Max Speed |
|---------|-----------|-----------|
| 802.11b | 2.4 GHz | 11 Mbps |
| 802.11g | 2.4 GHz | 54 Mbps |
| 802.11n (Wi-Fi 4) | 2.4/5 GHz | 600 Mbps |
| 802.11ac (Wi-Fi 5) | 5 GHz | 3.5 Gbps |
| 802.11ax (Wi-Fi 6) | 2.4/5/6 GHz | 9.6 Gbps |

---

## 8. Cloud Computing

### Service Models

- **IaaS (Infrastructure as a Service)** — Rents virtualized hardware (VMs, storage, networking). You manage the OS and up. *(AWS EC2, Azure VMs)*
- **PaaS (Platform as a Service)** — Provider manages infrastructure + OS; you manage apps and data. *(Google App Engine, Heroku)*
- **SaaS (Software as a Service)** — Fully managed software over the internet. *(Gmail, Microsoft 365, Salesforce)*

### Deployment Models

- **Public Cloud** — Shared infrastructure owned by a provider (AWS, Azure, GCP)
- **Private Cloud** — Dedicated infrastructure for one organization
- **Hybrid Cloud** — Mix of public and private cloud
- **Community Cloud** — Shared by organizations with common needs

### Key Cloud Concepts
- **Scalability** — Ability to increase/decrease resources as needed
- **Elasticity** — Automatic scaling based on demand
- **High Availability (HA)** — Systems designed to minimize downtime
- **Redundancy** — Duplicate components to prevent single points of failure
- **Fault Tolerance** — System continues operating despite component failures

---

## 9. Troubleshooting Methodology

1. **Identify the problem** — Gather information, question the user, identify symptoms
2. **Establish a theory of probable cause** — Consider the obvious first (Question the obvious)
3. **Test the theory** — Confirm or deny the theory; if denied, establish a new theory
4. **Establish a plan of action** — Identify how to fix the issue with minimal impact
5. **Implement the solution** — Carry out the fix
6. **Verify full system functionality** — Confirm the fix worked and nothing else broke
7. **Document findings** — Record what was found, what was done, and the outcome

---

## 10. Professional & Soft Skills

- **Change Management** — Process of planning, testing, and documenting changes to systems
- **Documentation** — Keeping accurate records of systems, configurations, and procedures
- **Ticketing System** — Tracks IT support requests (incidents, problems, requests)
- **SLA (Service Level Agreement)** — A contract defining expected service levels and response times
- **Escalation** — Passing a complex issue to a higher-tier or specialized technician
- **Communication** — Explaining technical concepts in plain language to non-technical users
- **Professionalism** — Punctuality, respect, honesty, and maintaining confidentiality

---

## Quick Reference Cheat Sheet

| Term | Quick Definition |
|------|----------------|
| CPU | Brain of computer; executes instructions |
| RAM | Temporary fast memory; volatile |
| ROM | Permanent memory; stores firmware |
| SSD | Fast solid-state storage; no moving parts |
| HDD | Slower spinning-disk storage |
| NIC | Connects device to a network |
| BIOS/UEFI | Firmware that initializes hardware on boot |
| TCP | Reliable, connection-based protocol |
| UDP | Fast, connectionless protocol |
| DNS | Translates domain names to IPs |
| DHCP | Auto-assigns IP addresses |
| VPN | Encrypted tunnel over a network |
| MFA | Two or more authentication factors |
| CIA Triad | Confidentiality, Integrity, Availability |
| Least Privilege | Grant minimum necessary access |
| RAID | Combines drives for speed/redundancy |
| IaaS/PaaS/SaaS | Cloud service delivery models |

---

## Focus Areas (Post-Test)

### What not to worry about

- **Converting from one number format to another**
  - Keep only a light review of binary/hex conversions.
  - You should still recognize common values (for example: `10` = `1010` = `A`), but do not overinvest time in deep conversion drills.
  - If it appears, it is usually a straightforward item, not a long multi-step problem.

- **Input/output devices**
  - Expect limited coverage (often one or two questions).
  - Focus on core classification: keyboard/scanner/microphone = input; monitor/printer/speakers = output.
  - Quick scenario check: if the device captures data into the system, it is input; if it presents data from the system, it is output.

### What to worry about

- **Drivers and how/when to use drivers**
  - Know what drivers do: they let the OS communicate with hardware.
  - Be ready for scenario questions: device not recognized, wrong or outdated driver, post-update driver conflicts.
  - Understand common fixes in order: verify hardware connection, check Device Manager/status, update/reinstall/rollback driver.
  - Differentiate driver issues from firmware and operating system issues.

- **Permissions and access control basics**
  - Review least privilege, role-based access, and basic file/folder permission behavior.
  - Know authentication vs authorization:
    - authentication = who you are
    - authorization = what you can do
  - Expect practical scenarios (shared folders, user role limits, admin rights misuse).
  - Connect this to security outcomes: confidentiality and risk reduction.

- **Troubleshooting method**
  - This is high value. Memorize and apply the full methodology in order:
    1. Identify the problem
    2. Research/evaluate
    3. Establish theory
    4. Test theory
    5. Plan of action
    6. Implement or escalate
    7. Verify and document
  - Questions often test sequence logic ("what comes next?" / "what should have been done first?").
  - Practice translating scenario wording into the exact step name.

- **Deployment models basics (2.6)**
  - Focus on practical differences among IaaS, PaaS, and SaaS.
  - Be able to answer "who manages what" in each model.
  - Common exam pattern: choose the best model for a business use case (speed, control, maintenance responsibility).
  - Do not just memorize acronyms; map each model to real operational tradeoffs.

- **Internet service types (2.7)**
  - Compare DSL, cable, fiber, satellite, and cellular by speed, latency, availability, and reliability.
  - High-yield association: satellite usually has the highest latency.
  - Expect "best fit" questions for homes, rural sites, mobile users, or business branches.
  - Know where throughput vs latency matters (streaming, conferencing, gaming, VoIP).

- **Basic network concepts**
  - Prioritize DNS, DHCP, IP addressing, default gateway, router vs switch, and common port awareness.
  - Understand symptom-to-cause mapping (for example: can reach IP but not domain = likely DNS issue).
  - Know APIPA meaning (`169.254.x.x`) and what it implies about DHCP failure.
  - Be prepared for short troubleshooting scenarios, not just term definitions.

---

## Additional High-Priority Review Areas

### Network concepts

- **Core ideas to master**
  - IP addressing, subnet basics, default gateway, DNS, DHCP.
  - Device roles: modem vs router vs switch vs access point.
  - Common protocols/ports at a practical level (HTTP/HTTPS, DNS, DHCP, SSH, RDP).

- **What exam questions look like**
  - "User can reach IP address but not website name" (DNS focus).
  - "Device got 169.254.x.x" (DHCP issue).
  - "Which device should be used for X?" (router/switch/AP role mapping).

- **How to study this efficiently**
  - Build a symptom -> likely cause checklist.
  - Practice short network troubleshooting flows in order.

### Purpose/components of an OS

- **Purpose of an OS**
  - Interface between hardware and applications.
  - Resource management: CPU scheduling, memory, storage, and device I/O.
  - Security and account/session management.

- **Key components/concepts**
  - Kernel, services/processes, file system, drivers, permissions.
  - GUI vs CLI, user space vs system-level behavior (high-level understanding).

- **Common exam framing**
  - "What part of the system is responsible for X?"
  - "Why did this device/app fail after update/reboot/login change?"

### Data types and their characteristics

- **Must-know types**
  - Integer, float, string, boolean, arrays/lists, null.

- **Characteristics to know**
  - Valid values, storage intent, and basic operations.
  - When to choose one type over another in a scenario.

- **Common mistakes tested**
  - Using string where numeric type is required.
  - Confusing boolean conditions with string text values.

### Value of data and information

- **Core distinction**
  - Data = raw facts.
  - Information = processed/organized data with meaning.
  - Business value = decisions, insights, automation, compliance.

- **Exam focus**
  - Structured vs unstructured vs semi-structured data.
  - Why data governance, quality, retention, and privacy matter.
  - Business impact framing: reporting quality, risk, and outcomes.

### Database structures

- **Relational basics**
  - Tables, rows, columns, primary keys, foreign keys, schema, indexes.
  - CRUD and simple SQL reasoning.

- **Non-relational basics**
  - Document, key-value, graph, column-family (know best-fit use cases).

- **What to be ready for**
  - Pick the best structure for a scenario.
  - Identify key relationships and integrity concepts quickly.

### Security concepts/frameworks and device security best practices

- **Security concepts/frameworks**
  - CIA triad, least privilege, defense in depth, zero trust, AAA.
  - Know framework names at a practical level (NIST, ISO 27001, PCI-DSS, GDPR/HIPAA context).

- **Methods to secure devices**
  - Patching, endpoint protection, host firewall, encryption, MFA, lock policies.
  - Mobile/remote controls: MDM, remote wipe, secure configuration baselines.

- **Best-practice mindset**
  - Map each control to threat type (prevent/detect/respond/recover).
  - Choose the control that directly addresses the scenario risk.

---

*Good luck on your Tech+ exam! Focus on understanding concepts, not just memorizing — many questions test your ability to apply knowledge to a scenario.*
