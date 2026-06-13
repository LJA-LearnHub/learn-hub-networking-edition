# CompTIA Tech+ (FC0-U71) — Complete Study Guide

> **Exam Code:** FC0-U71 | **Launch Date:** July 16, 2024  
> **Questions:** Maximum 70 (multiple-choice) | **Time:** 60 minutes  
> **Passing Score:** 650 / 900 | **No prior experience required**

---

## Table of Contents

1. [Domain 1 – IT Concepts and Terminology (17%)](#domain-1)
2. [Domain 2 – Infrastructure (24%)](#domain-2)
3. [Domain 3 – Applications and Software (18%)](#domain-3)
4. [Domain 4 – Software Development Concepts (13%)](#domain-4)
5. [Domain 5 – Data and Database Fundamentals (13%)](#domain-5)
6. [Domain 6 – Security (19%)](#domain-6)
7. [Key Acronyms Reference](#acronyms)
8. [Practice Question Bank](#practice-questions)

---

## Domain Weightings

| Domain | Title | Exam Weight |
|--------|-------|-------------|
| 1.0 | IT Concepts and Terminology | 17% |
| 2.0 | Infrastructure | 24% |
| 3.0 | Applications and Software | 18% |
| 4.0 | Software Development Concepts | 13% |
| 5.0 | Data and Database Fundamentals | 13% |
| 6.0 | Security | 19% |

---

# Domain 1 — IT Concepts and Terminology (17%) {#domain-1}

## 1.1 Explain the Basics of Computing

### The Computing Model
Every computing system performs four fundamental operations:

| Step | Function | Examples |
|------|----------|---------|
| **Input** | Accepting data from the outside world | Keyboard, mouse, microphone, scanner, webcam, touchscreen |
| **Processing** | Manipulating and transforming data | CPU executing instructions, performing calculations |
| **Output** | Presenting results to users or other systems | Monitor, printer, speakers, projector |
| **Storage** | Retaining data for later use | HDD, SSD, RAM, USB drive, cloud |

### Input Devices (Detailed)
- **Keyboard** – Most common text input device; uses scan codes sent to OS
- **Mouse** – Pointing device; tracks movement with optical or laser sensor
- **Touchscreen** – Combines input/output; capacitive (uses electrical charge) or resistive (uses pressure)
- **Scanner** – Converts physical documents to digital images (flatbed, sheet-fed, handheld)
- **Webcam** – Video input device; integrated or external via USB
- **Microphone** – Audio input; analog converted to digital via ADC
- **Barcode scanner / QR reader** – Optical input for encoded data
- **Biometric readers** – Fingerprint, retina, facial recognition for authentication
- **Gamepad/joystick** – Specialized input for gaming
- **Stylus / digitizer tablet** – Precision input for drawing/design

### Output Devices (Detailed)
- **Monitor/Display** – LCD, OLED, LED; measured in pixels, resolution, refresh rate (Hz)
  - Common resolutions: 1080p (1920×1080), 1440p, 4K (3840×2160)
- **Printer** – Inkjet (spray ink), laser (toner + heat), thermal (heat-sensitive paper), 3D
- **Speakers / Headphones** – Audio output; digital-to-analog conversion (DAC)
- **Projector** – DLP or LCD; throws image on a surface
- **Plotter** – High-precision vector-based printer for engineering/architecture

### Processing
- Handled by the **CPU (Central Processing Unit)**
- CPU fetches, decodes, and executes instructions
- Speed measured in **MHz** (megahertz) or **GHz** (gigahertz)
- Multi-core CPUs run multiple processes simultaneously

### Storage (Overview)
- **Primary storage** – RAM (volatile; data lost when power off)
- **Secondary storage** – HDD, SSD (non-volatile; data persists)
- **Tertiary/offline storage** – Tape drives, optical media

---

## 1.2 Identify Notational Systems

### Binary (Base-2)
- Uses only digits **0** and **1**
- Each digit is called a **bit**
- Computers use binary internally because transistors have two states (on/off)
- **Counting:** 0, 1, 10, 11, 100, 101, 110, 111, 1000...
- **Place values (right to left):** 1, 2, 4, 8, 16, 32, 64, 128...

**Binary → Decimal Conversion:**
- Example: `1010` = (1×8) + (0×4) + (1×2) + (0×1) = **10**
- Example: `1111` = 8+4+2+1 = **15**
- Example: `10000000` = **128**

**Decimal → Binary Conversion (Divide by 2, record remainders):**
- 13 ÷ 2 = 6 R1
- 6 ÷ 2 = 3 R0
- 3 ÷ 2 = 1 R1
- 1 ÷ 2 = 0 R1
- Read remainders bottom to top: **1101**

### Hexadecimal (Base-16)
- Uses digits **0–9** and letters **A–F** (A=10, B=11, C=12, D=13, E=14, F=15)
- **Why hex?** One hex digit = exactly 4 binary bits (a nibble); very compact
- Common uses: MAC addresses, IP addresses, HTML color codes, memory addresses
- **Prefix:** Often written as `0x` (e.g., `0xFF`) or with `#` (e.g., `#FF5733`)

**Hex → Decimal:**
- `1F` = (1×16) + (15×1) = 16 + 15 = **31**
- `FF` = (15×16) + (15×1) = 240 + 15 = **255**
- `2A` = (2×16) + (10×1) = 32 + 10 = **42**

**Decimal → Hex:**
- 255 ÷ 16 = 15 R15 → **FF**
- 100 ÷ 16 = 6 R4 → **64**

**Hex ↔ Binary (Shortcut — each hex digit = 4 bits):**
- `F` = `1111`, `A` = `1010`, `5` = `0101`
- `FA` = `1111 1010`

### Decimal (Base-10)
- Standard system; uses digits **0–9**
- Place values: ones, tens, hundreds, thousands...

### Octal (Base-8)
- Uses digits **0–7**
- Occasionally used in Unix/Linux file permissions
- Example: `chmod 755` = owner rwx (7), group r-x (5), other r-x (5)
- `7` in octal = **111** in binary; `5` = **101**

### Quick Conversion Table

| Decimal | Binary | Hex | Octal |
|---------|--------|-----|-------|
| 0 | 0000 | 0 | 0 |
| 1 | 0001 | 1 | 1 |
| 4 | 0100 | 4 | 4 |
| 8 | 1000 | 8 | 10 |
| 10 | 1010 | A | 12 |
| 15 | 1111 | F | 17 |
| 16 | 10000 | 10 | 20 |
| 255 | 11111111 | FF | 377 |

---

## 1.3 Compare and Contrast Common Units of Measure

### Storage Units

| Unit | Abbreviation | Size |
|------|-------------|------|
| Bit | b | Smallest unit; 0 or 1 |
| Nibble | — | 4 bits |
| Byte | B | 8 bits |
| Kilobyte | KB | 1,024 bytes |
| Megabyte | MB | 1,024 KB (~1 million bytes) |
| Gigabyte | GB | 1,024 MB (~1 billion bytes) |
| Terabyte | TB | 1,024 GB (~1 trillion bytes) |
| Petabyte | PB | 1,024 TB |
| Exabyte | EB | 1,024 PB |

> **Tip:** Uppercase B = Byte; lowercase b = bit. A 10 Mb/s connection transfers 10 megabits (1.25 megabytes) per second.

### Throughput / Network Speed Units

| Unit | Full Name | Usage |
|------|-----------|-------|
| bps | Bits per second | Modem/very slow connections |
| Kbps | Kilobits per second | 1,000 bps; older broadband |
| Mbps | Megabits per second | 1,000,000 bps; modern broadband |
| Gbps | Gigabits per second | 1,000,000,000 bps; fiber/enterprise |

### Processing Speed Units

| Unit | Meaning |
|------|---------|
| MHz | Megahertz; 1 million cycles/second; older CPUs, RAM bus speeds |
| GHz | Gigahertz; 1 billion cycles/second; modern CPU clock speeds |

**Context examples:**
- A modern CPU might run at **3.5 GHz** (3,500 MHz)
- DDR4 RAM might operate at **3200 MHz**
- A typical home broadband might be **100 Mbps** or **1 Gbps**
- A USB 3.0 port transfers up to **5 Gbps**

---

## 1.4 Explain the Troubleshooting Methodology

CompTIA's standard troubleshooting methodology (memorize these steps IN ORDER):

### The 7-Step Troubleshooting Process

**Step 1: Identify the Problem**
- Gather information: talk to the user, observe the issue
- Identify symptoms; ask what changed recently
- Duplicate the problem if possible
- Consider environmental and infrastructure factors

**Step 2: Research Knowledge Base / Evaluate Problems**
- Search internal documentation, vendor knowledge bases
- Check event logs, error messages
- Identify if it's a known issue with a known fix

**Step 3: Establish a Theory of Probable Cause**
- List possible causes from most likely to least likely
- Question the obvious first (Is it plugged in? Is it turned on?)
- Apply Occam's Razor — simplest explanation is often correct

**Step 4: Test the Theory to Determine Cause**
- Test your most likely theory first
- If confirmed → proceed to next step
- If not confirmed → go back to step 3 with a new theory

**Step 5: Establish a Plan of Action to Resolve the Problem**
- Determine how to fix it, and plan for potential side effects
- Consider impact on users/systems (schedule maintenance windows if needed)
- Identify if escalation is required

**Step 6: Implement the Solution or Escalate as Necessary**
- Apply the fix
- Escalate if the solution requires higher-level expertise or permissions

**Step 7: Verify Full System Functionality and Implement Preventive Measures**
- Confirm the problem is resolved and no new problems were introduced
- Document everything: what the problem was, how you found it, what fixed it
- Implement preventive measures to avoid recurrence

> **Memory aid:** **I R E T E I V** — Identify, Research, Establish theory, Test, Establish plan, Implement, Verify

---

## Key Vocabulary — Domain 1

| Term | Definition |
|------|-----------|
| **Bit** | Binary digit; smallest unit of data (0 or 1) |
| **Byte** | 8 bits |
| **Binary** | Base-2 number system using 0 and 1 |
| **Hexadecimal** | Base-16 number system (0–9, A–F) |
| **Octal** | Base-8 number system (0–7) |
| **MHz** | Megahertz; millions of cycles per second |
| **GHz** | Gigahertz; billions of cycles per second |
| **Mbps** | Megabits per second; network speed unit |
| **Throughput** | Actual data transfer rate achieved |
| **Bandwidth** | Maximum theoretical data transfer capacity |
| **Latency** | Delay in data transmission |
| **CPU** | Central Processing Unit; the "brain" of a computer |
| **Input** | Data entering a computer system |
| **Output** | Results produced by a computer system |
| **Processing** | Manipulating/transforming data |
| **Volatile storage** | Data lost when power is removed (RAM) |
| **Non-volatile storage** | Data persists without power (SSD, HDD) |

---

# Domain 2 — Infrastructure (24%) {#domain-2}

## 2.1 Explain Common Computing Devices and Their Purposes

### Desktop Computers
- Stationary; designed for a fixed location
- Components are separate (monitor, tower, peripherals)
- Highly upgradeable and typically more powerful per dollar
- Form factors: **Tower**, **All-in-One (AIO)**, **Small Form Factor (SFF)**

### Laptop Computers
- Portable; integrated display, keyboard, touchpad, battery
- Components often soldered (less upgradeable)
- Sub-categories: **Ultrabooks** (thin/light), **Gaming laptops** (powerful GPU), **Chromebooks** (cloud-centric)

### Tablets
- Touch-driven; no physical keyboard (may have optional accessory keyboard)
- OS: Android, iPadOS, Windows
- Good for media consumption, casual use

### Smartphones
- Pocket-sized computers; primary communication device
- OS: Android or iOS
- Features: GPS, camera, NFC, Bluetooth, cellular radio

### Servers
- Designed to provide services to other computers on a network
- High reliability, redundancy, large RAM and storage
- Types: **File server**, **Web server**, **Print server**, **Database server**, **Mail server**, **Application server**
- Form factors: **Tower server**, **Rack server** (1U, 2U), **Blade server**

### IoT Devices (Internet of Things)
- Everyday objects with embedded computing and network connectivity
- Examples: smart thermostats, smart locks, IP cameras, wearables, industrial sensors
- Often have limited processing power and minimal security
- Use protocols: MQTT, Zigbee, Z-Wave, Wi-Fi, Bluetooth

### Gaming Consoles
- Dedicated gaming hardware; increasingly supports streaming and general apps
- Examples: PlayStation, Xbox, Nintendo Switch
- Use specialized OS and proprietary hardware

### Wearables
- Smartwatches, fitness trackers, AR glasses
- Sync with smartphone; track health metrics

### VoIP Phones
- Internet-based phone systems; replace traditional landlines
- Use SIP (Session Initiation Protocol) or proprietary protocols

### Thin Clients
- Minimal local processing; depend on a server for computing
- Used in virtual desktop environments (VDI)

---

## 2.2 Explain the Purpose of Common Internal Computing Components

### Motherboard
- The main circuit board connecting all components
- Contains: CPU socket, RAM slots, PCIe slots, chipset, BIOS/UEFI chip, power connectors, storage interfaces
- **Form factors:** ATX (standard), Micro-ATX, Mini-ITX

### CPU (Central Processing Unit)
- Executes program instructions; performs arithmetic, logic, I/O operations
- Key specs:
  - **Clock speed:** GHz; cycles per second
  - **Cores:** Physical processing units; more cores = better multitasking
  - **Threads:** Virtual cores via hyper-threading/SMT
  - **Cache:** L1 (fastest, smallest), L2, L3 (largest, slowest)
  - **TDP:** Thermal Design Power; heat generated; determines cooling requirements
- **Architecture:** x86-64 (Intel/AMD), ARM (mobile/Apple Silicon)
- **Intel brands:** Core i3, i5, i7, i9; Xeon (server)
- **AMD brands:** Ryzen, EPYC (server)

### RAM (Random Access Memory)
- Temporary, volatile storage for active programs and data
- **Types:**
  - **DRAM** – Dynamic RAM; needs constant refresh
  - **SRAM** – Static RAM; faster but more expensive (used for cache)
  - **DDR (Double Data Rate):** DDR4, DDR5 — current standards
  - **SDRAM** – Synchronous DRAM
- **ECC RAM** – Error-Correcting Code; detects and corrects single-bit errors; used in servers
- **Channels:** Dual-channel = 2 sticks running together for better bandwidth
- Common amounts: 8 GB (basic), 16 GB (standard), 32/64 GB (workstation/gaming)

### Storage Devices

| Type | Full Name | Speed | Notes |
|------|-----------|-------|-------|
| **HDD** | Hard Disk Drive | Slow (100–200 MB/s) | Mechanical; moving parts; fragile; cheap per GB |
| **SSD** | Solid State Drive | Fast (500–600 MB/s SATA) | No moving parts; more durable; pricier |
| **NVMe SSD** | Non-Volatile Memory Express | Very fast (3,000–7,000 MB/s) | Uses PCIe interface; M.2 form factor common |
| **Optical** | CD/DVD/Blu-ray | Slow | Read/write optical discs; less common today |
| **USB Flash** | Thumb Drive | Moderate | Portable; NAND flash |

**HDD Components:**
- Platters (magnetic disks), read/write head, spindle motor, actuator arm
- RPM: 5400 (laptop/low power), 7200 (desktop), 10000/15000 (enterprise)

**SSD Types:**
- **NAND Flash** types: SLC (best), MLC, TLC, QLC (densest/cheapest)
- **Form factors:** 2.5" SATA, M.2 (2280 most common), PCIe add-in card

### GPU (Graphics Processing Unit)
- Handles rendering of images, video, animations
- **Dedicated/Discrete GPU:** Separate card with its own VRAM (e.g., NVIDIA RTX, AMD RX)
- **Integrated GPU:** Built into CPU or motherboard; shares system RAM
- Also used for AI/ML workloads and cryptocurrency mining

### NIC (Network Interface Card)
- Connects a computer to a network
- May be wired (Ethernet) or wireless (Wi-Fi)
- Each NIC has a unique **MAC address** (48-bit, written as XX:XX:XX:XX:XX:XX)
- Can be built into motherboard or a separate expansion card

### Power Supply Unit (PSU)
- Converts AC wall power to DC voltages the computer uses (+12V, +5V, +3.3V)
- Efficiency ratings: **80 PLUS** certification (Bronze, Silver, Gold, Platinum, Titanium)
- **Wattage:** Must meet or exceed the system's total power draw

### Cooling Systems
- **Air cooling:** Heatsinks + fans; CPU cooler, case fans
- **Liquid cooling (AIO):** Pump, tubing, radiator, water block; better thermal performance
- **Thermal paste:** Applied between CPU and cooler; improves heat transfer
- **Case airflow:** Positive pressure (more intake fans), negative pressure (more exhaust)

### BIOS / UEFI
- **BIOS (Basic Input/Output System):** Legacy firmware; initializes hardware at boot
- **UEFI (Unified Extensible Firmware Interface):** Modern replacement for BIOS
  - Supports larger drives (GPT partition table, no 2TB limit)
  - Faster boot times
  - Secure Boot feature prevents unauthorized OS loading
  - Mouse-enabled graphical interface
- **POST (Power-On Self-Test):** Diagnostic run at startup to check hardware

### Expansion Slots
- **PCIe (PCI Express):** Current standard for GPUs, NVMe SSDs, NICs; versions: x1, x4, x8, x16 slots
- **Legacy:** PCI (older), AGP (old GPU slot)

---

## 2.3 Compare and Contrast Storage Types

### Primary vs. Secondary vs. Tertiary

| Type | Example | Volatile? | Speed | Notes |
|------|---------|-----------|-------|-------|
| Primary | RAM | Yes | Fastest | CPU directly accesses |
| Secondary | HDD, SSD | No | Slower | Persistent; user files |
| Tertiary | Tape, optical | No | Slowest | Archival/backup |

### Local vs. Network vs. Cloud Storage

**Local Storage:**
- Physically attached to or inside the device
- Examples: internal HDD/SSD, external USB drive

**Network Attached Storage (NAS):**
- Dedicated storage device on a local network
- Multiple users can access shared files
- Uses SMB (Windows file sharing) or NFS (Linux/Unix)
- RAID configurations common for redundancy

**Storage Area Network (SAN):**
- High-speed network dedicated exclusively to storage
- Appears as a local drive to servers
- Used in enterprise environments
- Protocols: iSCSI, Fibre Channel

**Cloud Storage:**
- Stored on remote servers accessed via internet
- Examples: Google Drive, OneDrive, Dropbox, Amazon S3
- Advantages: accessible anywhere, scalable, off-site backup
- Disadvantages: requires internet, monthly cost, privacy concerns

### RAID (Redundant Array of Independent Disks)

| RAID Level | Minimum Drives | Description | Fault Tolerance |
|------------|----------------|-------------|-----------------|
| RAID 0 | 2 | Striping; data split across drives | None (one failure = total loss) |
| RAID 1 | 2 | Mirroring; exact copy | 1 drive can fail |
| RAID 5 | 3 | Striping with parity | 1 drive can fail |
| RAID 6 | 4 | Striping with double parity | 2 drives can fail |
| RAID 10 | 4 | Mirror + Stripe (RAID 1+0) | 1 from each mirror pair |

> **Key note:** RAID is NOT a backup. It provides redundancy but doesn't protect against accidental deletion, corruption, or natural disasters.

---

## 2.4 Given a Scenario, Install and Configure Common Peripheral Devices

### Types of Peripherals
- **Input:** Keyboard, mouse, scanner, webcam, microphone
- **Output:** Monitor, printer, speakers
- **I/O:** External drives, touchscreen, all-in-one printers

### Plug-and-Play (PnP)
- OS automatically detects and installs driver for most modern devices
- Some devices require manual driver installation from CD/website

### Installing a Printer
1. Connect via USB/network/Wi-Fi or Bluetooth
2. OS detects and installs driver (or install manually)
3. Set as default if desired
4. Test print
5. For network printers: install using IP address or hostname

### Monitor Setup
- Connect via HDMI, DisplayPort, DVI, or VGA
- Configure in OS: resolution, refresh rate, display arrangement (for multiple monitors)
- Calibrate color if needed

### Common Connection Issues
- Device not recognized → try different port, update driver, restart
- Driver conflict → uninstall/reinstall driver in Device Manager (Windows)

---

## 2.5 Compare and Contrast Common Types of Input/Output Device Interfaces

### Wired Interfaces

| Interface | Speed | Common Use |
|-----------|-------|-----------|
| **USB 2.0** | 480 Mbps | Keyboard, mouse, flash drives |
| **USB 3.0** (USB 3.2 Gen 1) | 5 Gbps | External drives, hubs |
| **USB 3.1** (USB 3.2 Gen 2) | 10 Gbps | Fast external drives |
| **USB 3.2 Gen 2x2** | 20 Gbps | High-performance devices |
| **USB 4 / Thunderbolt 3/4** | 40 Gbps | Docks, eGPU, high-res displays |
| **USB-C** | Connector shape; supports various standards | Universal connector |
| **HDMI** | 10+ Gbps | Monitor/TV video+audio |
| **DisplayPort** | Up to 80 Gbps (DP 2.0) | High-resolution monitors |
| **VGA** | Analog | Legacy monitors |
| **DVI** | Digital/analog | Older monitors |
| **3.5mm audio jack** | Analog | Headphones, speakers |
| **Ethernet (RJ-45)** | 1 Gbps, 10 Gbps | Network |
| **PS/2** | Legacy | Keyboard/mouse (older PCs) |

### Wireless Interfaces

| Interface | Range | Speed | Common Use |
|-----------|-------|-------|-----------|
| **Bluetooth** | ~10 m | Up to 50 Mbps (BT 5.0) | Headphones, keyboard, mouse |
| **Wi-Fi 4 (802.11n)** | ~50 m | 300 Mbps | Older wireless |
| **Wi-Fi 5 (802.11ac)** | ~50 m | 3.5 Gbps | Common home/office |
| **Wi-Fi 6 (802.11ax)** | ~50 m | 9.6 Gbps | Modern high-density |
| **Wi-Fi 6E** | ~50 m | 9.6 Gbps | Adds 6 GHz band |
| **NFC** | <4 cm | 400 Kbps | Contactless payment, pairing |
| **Infrared (IR)** | Line-of-sight | Slow | TV remotes |
| **RF (Radio Frequency)** | ~30 m | Varies | Wireless mice/keyboards |

### USB Connector Types
- **USB-A:** Standard rectangular plug (most common host-side)
- **USB-B:** Square printer-style plug
- **Mini-USB:** Smaller; older cameras/devices
- **Micro-USB:** Very common on older Android phones, accessories
- **USB-C:** Oval; reversible; modern standard; supports USB 3.x, Thunderbolt, Power Delivery

---

## 2.6 Compare and Contrast Virtualization and Cloud Technologies

### Virtualization

**What is it?** Creating software-based (virtual) versions of physical hardware.

**Hypervisor:** Software layer that creates and manages VMs
- **Type 1 (Bare-metal):** Runs directly on hardware; no host OS needed; better performance
  - Examples: VMware ESXi, Microsoft Hyper-V, Citrix XenServer
- **Type 2 (Hosted):** Runs on top of a host OS; easier to set up
  - Examples: VMware Workstation, VirtualBox, Parallels

**Virtual Machine (VM):**
- Complete software simulation of a computer
- Runs its own OS and applications
- Isolated from other VMs (snapshot capability)

**Benefits of Virtualization:**
- Server consolidation (run multiple VMs on one physical server)
- Disaster recovery (easy VM backup/restore)
- Testing environments (safe to break things)
- Reduced hardware costs
- Fast provisioning

**Containers:**
- Lightweight alternative to VMs
- Share the host OS kernel; start faster
- Examples: Docker, Kubernetes
- Less isolation than VMs but more efficient

### Cloud Computing

**Cloud Service Models:**

| Model | Full Name | You Manage | Provider Manages | Example |
|-------|-----------|-----------|-----------------|---------|
| **IaaS** | Infrastructure as a Service | OS, apps, data | Hardware, virtualization, networking | AWS EC2, Azure VMs |
| **PaaS** | Platform as a Service | Apps, data | OS, runtime, middleware, hardware | Heroku, Google App Engine |
| **SaaS** | Software as a Service | Your data (settings) | Everything | Gmail, Office 365, Salesforce |

**Cloud Deployment Models:**

| Model | Description | Example |
|-------|-------------|---------|
| **Public cloud** | Shared infrastructure; owned by provider | AWS, Azure, Google Cloud |
| **Private cloud** | Dedicated infrastructure for one org | On-premises VMware |
| **Hybrid cloud** | Mix of public and private | Enterprise with local + AWS |
| **Community cloud** | Shared by organizations with common needs | Government agencies |

**Cloud Characteristics:**
- **On-demand self-service:** Provision resources without human interaction
- **Broad network access:** Available from anywhere with internet
- **Resource pooling:** Provider shares resources among multiple customers (multi-tenancy)
- **Rapid elasticity:** Scale resources up/down quickly
- **Measured service:** Pay only for what you use

---

## 2.7 Compare and Contrast Common Internet Service Types

### Broadband Technologies

| Type | Technology | Speed | Notes |
|------|-----------|-------|-------|
| **DSL** | Digital Subscriber Line | 1–100 Mbps | Uses phone lines; ADSL, VDSL |
| **Cable** | Coaxial cable | 50–1000 Mbps | Shared with neighbors; DOCSIS standard |
| **Fiber** | Fiber optic | 100 Mbps–10 Gbps | Fastest; light-based; FTTH |
| **Satellite** | Geostationary/LEO | 25–200 Mbps | High latency (geo); rural coverage; Starlink (LEO) |
| **Fixed Wireless** | Radio towers to antenna | 25–100 Mbps | Rural alternative to cable |
| **Cellular (4G/5G)** | Mobile network | 4G: 10–100 Mbps; 5G: 100Mbps–10 Gbps | Mobile; hotspot |
| **Dial-up** | POTS (phone line analog) | 56 Kbps | Legacy; not broadband |

### Networking Fundamentals

**Networking Devices:**

| Device | Function | Layer |
|--------|----------|-------|
| **Hub** | Broadcasts all traffic to all ports; half-duplex | Layer 1 |
| **Switch** | Forwards frames based on MAC address; full-duplex | Layer 2 |
| **Router** | Routes packets between networks based on IP address | Layer 3 |
| **Access Point (AP)** | Extends wired network wirelessly | Layer 2 |
| **Modem** | Modulates/demodulates signal; converts between analog and digital | Layer 1 |
| **Firewall** | Filters traffic based on rules; protects network | Layer 3–7 |

**Network Types by Size:**

| Type | Name | Example |
|------|------|---------|
| **PAN** | Personal Area Network | Bluetooth between phone and headphones |
| **LAN** | Local Area Network | Home or office network |
| **MAN** | Metropolitan Area Network | City-wide network |
| **WAN** | Wide Area Network | The Internet; connects LANs across long distances |

### IP Addressing

**IPv4:**
- 32-bit address; written as 4 octets: `192.168.1.100`
- Each octet = 8 bits = 0–255
- About 4.3 billion addresses (nearly exhausted)

**IPv6:**
- 128-bit address; written in hexadecimal with colons: `2001:0db8:85a3::8a2e:0370:7334`
- Virtually unlimited addresses (~340 undecillion)

**Private IP Ranges (not routable on the internet):**
- `10.0.0.0` – `10.255.255.255` (Class A)
- `172.16.0.0` – `172.31.255.255` (Class B)
- `192.168.0.0` – `192.168.255.255` (Class C) ← Most common home/small office

**Special Addresses:**
- `127.0.0.1` = **Loopback** (localhost) — tests local network stack
- `169.254.x.x` = **APIPA** — auto-assigned when DHCP fails
- `255.255.255.255` = **Broadcast**

**Subnet Mask:**
- Defines which part of an IP is the network and which is the host
- Common: `255.255.255.0` (or `/24` CIDR notation)
- `/24` = 256 addresses, 254 usable

**DHCP (Dynamic Host Configuration Protocol):**
- Automatically assigns IP addresses, subnet mask, default gateway, DNS
- DHCP server (usually the router) hands out leases
- **DORA process:** Discover → Offer → Request → Acknowledge

**DNS (Domain Name System):**
- Translates human-readable domain names to IP addresses
- e.g., `google.com` → `142.250.80.46`
- **A record:** Domain → IPv4
- **AAAA record:** Domain → IPv6
- **MX record:** Mail server
- **CNAME:** Alias/redirect
- Port: **53** (UDP and TCP)

### Common Network Ports to Memorize

| Port | Protocol | Service |
|------|----------|---------|
| 20, 21 | TCP | FTP (File Transfer Protocol) — 21 control, 20 data |
| 22 | TCP | SSH (Secure Shell) |
| 23 | TCP | Telnet (unencrypted remote access) |
| 25 | TCP | SMTP (email sending) |
| 53 | UDP/TCP | DNS |
| 67, 68 | UDP | DHCP |
| 80 | TCP | HTTP |
| 110 | TCP | POP3 (email receiving) |
| 143 | TCP | IMAP (email receiving) |
| 443 | TCP | HTTPS |
| 3389 | TCP | RDP (Remote Desktop Protocol) |

---

## Key Vocabulary — Domain 2

| Term | Definition |
|------|-----------|
| **Motherboard** | Main circuit board; connects all components |
| **CPU** | Processor; executes instructions |
| **RAM** | Volatile temporary memory |
| **HDD** | Mechanical hard drive |
| **SSD** | Solid-state drive; flash memory |
| **NVMe** | High-speed storage interface over PCIe |
| **GPU** | Graphics processor |
| **NIC** | Network interface card |
| **BIOS/UEFI** | Firmware initializing hardware at boot |
| **POST** | Power-On Self-Test |
| **RAID** | Redundant Array of Independent Disks |
| **NAS** | Network Attached Storage |
| **SAN** | Storage Area Network |
| **Hypervisor** | Software managing virtual machines |
| **VM** | Virtual Machine |
| **IaaS/PaaS/SaaS** | Cloud service models |
| **DHCP** | Automatically assigns IP addresses |
| **DNS** | Translates domain names to IPs |
| **Router** | Routes packets between networks |
| **Switch** | Forwards frames within a LAN |
| **Firewall** | Filters network traffic |
| **LAN** | Local Area Network |
| **WAN** | Wide Area Network |
| **APIPA** | Auto-assigned IP when DHCP fails (169.254.x.x) |

---

# Domain 3 — Applications and Software (18%) {#domain-3}

## 3.1 Compare and Contrast Operating System Types

### What is an Operating System?
The OS is the fundamental software that:
- Manages hardware resources (CPU scheduling, memory management)
- Provides a platform for applications to run
- Presents a user interface (GUI or CLI)
- Handles file storage and I/O operations

### Major OS Categories

**Windows:**
- Developed by Microsoft
- Most widely used desktop OS (~75% market share)
- Versions: Windows 10, Windows 11, Windows Server
- Strong enterprise support; huge software ecosystem
- File system: NTFS (primary), FAT32 (legacy), exFAT (flash drives)
- Uses drive letters (C:, D:, etc.)

**macOS:**
- Developed by Apple; runs on Mac hardware
- Unix-based; known for stability and design
- Tight hardware-software integration
- File system: APFS (modern), HFS+ (legacy)
- Strong for creative professionals

**Linux:**
- Open-source; free; highly customizable
- Many **distributions (distros):** Ubuntu, Fedora, Debian, Red Hat, Kali
- Widely used in servers, cloud, embedded systems, cybersecurity
- File systems: ext4, XFS, Btrfs
- Hierarchical directory structure starting at `/` (root)
- **Package managers:** apt (Debian/Ubuntu), yum/dnf (Red Hat/Fedora), pacman (Arch)

**Chrome OS:**
- Google's cloud-centric OS; runs on Chromebooks
- Web apps + Android apps; limited offline capability
- Designed for simplicity and security

**Android:**
- Linux-based mobile OS by Google
- Most popular mobile OS worldwide
- Open-source (AOSP); manufacturers customize it

**iOS / iPadOS:**
- Apple's mobile OS
- Closed ecosystem; tight hardware control
- Known for security and consistency

### Mobile OS Comparison

| Feature | Android | iOS |
|---------|---------|-----|
| Source | Open-source (Google) | Closed (Apple) |
| Customization | High | Limited |
| App store | Google Play + sideloading | App Store only (stricter) |
| Hardware | Many manufacturers | Apple only |
| Security | Variable | Consistent; more restrictive |

### Desktop vs. Server OS
- **Desktop OS:** Optimized for interactive user experience (GUI, games, productivity)
- **Server OS:** Optimized for reliability, uptime, headless (no GUI) operation, multi-user access
  - Windows Server, Ubuntu Server, Red Hat Enterprise Linux (RHEL), CentOS/Rocky Linux

---

## 3.2 Compare and Contrast Common Application Types

### Productivity Software
- **Word processors:** Microsoft Word, Google Docs, LibreOffice Writer
- **Spreadsheets:** Microsoft Excel, Google Sheets, LibreOffice Calc
- **Presentations:** PowerPoint, Google Slides, Keynote
- **Email clients:** Outlook, Thunderbird, Apple Mail
- **PDF readers/editors:** Adobe Acrobat, Foxit, Preview (macOS)

### Collaboration Tools
- **Video conferencing:** Zoom, Microsoft Teams, Google Meet
- **Project management:** Asana, Trello, Jira, Monday.com
- **Document sharing:** SharePoint, Google Drive, Confluence

### Business Software
- **ERP (Enterprise Resource Planning):** SAP, Oracle; integrates business processes
- **CRM (Customer Relationship Management):** Salesforce, HubSpot; manages customer data
- **Accounting:** QuickBooks, Sage, FreshBooks

### Creative Software
- **Image editing:** Adobe Photoshop, GIMP
- **Vector graphics:** Adobe Illustrator, Inkscape
- **Video editing:** Adobe Premiere, DaVinci Resolve
- **3D modeling:** Blender, Maya, AutoCAD

### Utility Software
- **Antivirus/Antimalware:** Windows Defender, Malwarebytes, Norton
- **Backup software:** Acronis, Macrium Reflect, Windows Backup
- **Disk management:** GParted, Disk Management (Windows)
- **Compression:** 7-Zip, WinRAR, ZIP (built-in)
- **Diagnostic:** CPU-Z, GPU-Z, HWMonitor, Task Manager

### Web Browsers
- Chrome, Firefox, Safari, Edge, Opera
- **Extensions/plugins** add functionality
- **Browser settings:** Homepage, default search engine, privacy settings, extensions

### Licensing Models
- **Freeware:** Free to use; may have limited features
- **Shareware:** Trial version; pay for full version
- **Open Source:** Source code available; community-developed (e.g., Linux, Firefox)
- **Proprietary/Commercial:** Paid; closed source
- **Subscription:** Monthly/annual fee (SaaS model; e.g., Adobe Creative Cloud)
- **Single-user license:** One device/user
- **Volume/Site license:** Organization-wide use

---

## 3.3 Explain Methods of Application Delivery

### Local Installation
- Software installed directly on the device
- Stored on local drive; works offline
- Requires manual updates

### Web-based/Cloud Applications
- Accessed via web browser; no installation
- Always up to date; accessible anywhere
- Examples: Google Workspace, Salesforce, Office 365 (web)

### Virtualized Applications
- Run on a server; displayed on local device
- **VDI (Virtual Desktop Infrastructure):** Full virtual desktop in the cloud
- **Application streaming:** Only the app is virtualized, not the full desktop (e.g., Citrix, AWS AppStream)

### Mobile Apps
- Downloaded from app store; installed on device
- Native (platform-specific), hybrid, or web apps

---

## 3.4 Given a Scenario, Configure and Use Web Browsers

### Browser Configuration
- **Homepage:** URL loaded on launch; set in settings
- **Default search engine:** Google, Bing, DuckDuckGo; configurable
- **Privacy settings:**
  - **Cookies:** Small files storing session data and preferences
  - **Tracking prevention:** Blocks third-party trackers
  - **Private/Incognito mode:** Doesn't save history, cookies, form data (not truly anonymous)
- **Extensions:** Add-ons adding functionality (ad blockers, password managers)
- **Bookmarks/Favorites:** Saved URLs for quick access
- **Cache:** Stored web page data to speed up revisits; clear if site loads strangely
- **Autofill:** Saves and fills form data/passwords

### Browser Security Settings
- **Certificate warnings:** HTTPS certificate errors should not be bypassed
- **Pop-up blockers:** Prevent unwanted pop-up windows
- **JavaScript settings:** Enable for most sites; disable on untrusted sites
- **Content settings:** Manage permissions for camera, mic, location

### URL Structure
`https://www.example.com:443/path/page.html?query=value#section`
- **Protocol:** `https://`
- **Subdomain:** `www`
- **Domain:** `example.com`
- **Port:** `443` (default HTTPS; usually hidden)
- **Path:** `/path/page.html`
- **Query string:** `?query=value`
- **Fragment:** `#section`

---

## 3.5 Compare and Contrast General Application Concepts

### Application Installation and Removal

**Windows:**
- Install from executable (.exe), MSI installer, or Microsoft Store
- Remove via Settings → Apps → Uninstall or Control Panel

**macOS:**
- Install from .dmg (drag app to Applications folder) or App Store
- Remove by dragging to Trash (or using AppCleaner for thorough removal)

**Linux:**
- Install via package manager: `apt install packagename`, `yum install packagename`
- Or compile from source

### Updates and Patches
- **Operating system updates:** Critical for security; patches vulnerabilities
- **Application updates:** Bug fixes, new features, security patches
- **Patch Tuesday:** Microsoft releases security updates monthly on second Tuesday
- **Auto-update:** Recommended for most users; ensure security fixes applied promptly
- **Firmware updates:** BIOS/UEFI, router firmware; less frequent but important

### File Systems and File Management
- **NTFS:** Windows standard; supports permissions, encryption, large files
- **FAT32:** Legacy; max 4 GB file size; works on all OS
- **exFAT:** Extended FAT; no file size limit; great for flash drives
- **ext4:** Linux standard
- **APFS:** macOS/iOS modern file system

### Common File Extensions

| Extension | Type |
|-----------|------|
| .exe | Windows executable |
| .msi | Windows installer package |
| .dmg | macOS disk image |
| .pkg | macOS installer |
| .deb | Debian/Ubuntu package |
| .rpm | Red Hat/Fedora package |
| .zip | Compressed archive |
| .docx | Microsoft Word document |
| .xlsx | Microsoft Excel spreadsheet |
| .pdf | Portable Document Format |
| .jpg/.jpeg | Image (compressed) |
| .png | Image (lossless) |
| .mp3 | Audio (compressed) |
| .mp4 | Video |
| .bat | Windows batch script |
| .sh | Shell script (Linux/macOS) |
| .py | Python script |

---

## Key Vocabulary — Domain 3

| Term | Definition |
|------|-----------|
| **OS** | Operating System; manages hardware and provides platform for apps |
| **GUI** | Graphical User Interface |
| **CLI** | Command Line Interface |
| **NTFS** | New Technology File System (Windows) |
| **FAT32** | Legacy file system; 4 GB max file size |
| **exFAT** | Extended FAT; no file size limit |
| **Freeware** | Free software |
| **Open Source** | Software with publicly available source code |
| **SaaS** | Software as a Service |
| **VDI** | Virtual Desktop Infrastructure |
| **Browser cache** | Locally stored web page data |
| **Cookie** | Small file stored by browser from websites |
| **Extension** | Browser or app add-on |
| **Patch** | Software update fixing a bug or vulnerability |
| **Firmware** | Permanent software embedded in hardware |
| **ERP** | Enterprise Resource Planning software |
| **CRM** | Customer Relationship Management software |

---

# Domain 4 — Software Development Concepts (13%) {#domain-4}

## 4.1 Compare and Contrast Programming Language Categories

### Compiled vs. Interpreted Languages

| Category | How It Works | Examples | Pros/Cons |
|----------|-------------|----------|-----------|
| **Compiled** | Source code → machine code before execution | C, C++, Rust, Go | Faster execution; less portable |
| **Interpreted** | Code read and executed line-by-line at runtime | Python, JavaScript, Ruby | Slower; easier to develop; portable |
| **Hybrid (JIT)** | Compiled to bytecode, then interpreted | Java (JVM), C# (.NET) | Balance of speed and portability |

### High-Level vs. Low-Level Languages

| Category | Abstraction | Examples |
|----------|------------|---------|
| **Low-level** | Closer to machine code | Assembly, Machine code |
| **High-level** | Human-readable abstraction | Python, Java, JavaScript, C++ |

### Language Categories by Use

**Scripting Languages:**
- Used to automate tasks; interpreted; often used for system administration
- Examples: Python, Bash, PowerShell, Perl

**Web Development Languages:**
- **Front-end (client-side):** HTML (structure), CSS (styling), JavaScript (interactivity)
- **Back-end (server-side):** Python, PHP, Ruby, Node.js, Java, C#

**Systems Programming:**
- Direct hardware access; performance-critical
- Examples: C, C++, Rust

**Query Languages:**
- Used to query databases
- Example: **SQL (Structured Query Language)**

**Markup Languages:**
- Define structure/formatting; not truly programming languages
- Examples: HTML, XML, JSON, YAML

### Popular Languages Overview

| Language | Category | Common Uses |
|---------|---------|------------|
| **Python** | High-level, interpreted | AI/ML, scripting, web, data science |
| **JavaScript** | High-level, interpreted | Web front/back-end |
| **Java** | OOP, compiled to bytecode | Enterprise, Android |
| **C** | Low-level, compiled | OS, embedded systems |
| **C++** | OOP, compiled | Games, systems, performance apps |
| **C#** | OOP, .NET | Windows apps, games (Unity) |
| **SQL** | Query language | Databases |
| **HTML/CSS** | Markup | Web structure/styling |
| **Swift** | Compiled | iOS/macOS apps |
| **Kotlin** | JVM | Android apps |
| **PowerShell** | Scripting | Windows automation |
| **Bash** | Scripting | Linux/macOS automation |

---

## 4.2 Identify Fundamental Data Types and Their Characteristics

### Core Data Types

| Data Type | Description | Example Values |
|-----------|-------------|----------------|
| **Integer (int)** | Whole numbers; no decimal | -5, 0, 42, 1000 |
| **Float/Double** | Decimal/floating point numbers | 3.14, -0.5, 2.718 |
| **String (str)** | Sequence of characters; text | "Hello", "Tech+" |
| **Boolean (bool)** | True or False only | True, False |
| **Char** | Single character | 'A', '5', '!' |
| **Array/List** | Ordered collection of values | [1, 2, 3, 4] |
| **Object** | Complex type with properties/methods | {name: "Alice", age: 30} |
| **Null/None** | Absence of a value | null, None |

### Data Type Properties
- **Type:** Determines what kind of data is stored
- **Size:** How much memory it uses (e.g., int = 4 bytes, double = 8 bytes)
- **Mutability:** Whether the value can be changed after creation
- **Operations:** What you can do with the type (math on integers, concatenation on strings)

### Variables vs. Constants
- **Variable:** Named storage location; value can change
- **Constant:** Named storage location; value cannot change once set

---

## 4.3 Explain the Purpose and Use of Programming Concepts

### Object-Oriented Programming (OOP)
A programming paradigm based on objects (instances of classes).

**Core OOP Concepts:**
- **Class:** Blueprint/template for creating objects
- **Object:** Instance of a class
- **Attribute:** Data stored in an object (property)
- **Method:** Function belonging to an object (behavior)

**OOP Principles:**
- **Encapsulation:** Bundling data and methods; hiding internal details
- **Inheritance:** A class inherits attributes/methods from a parent class
- **Polymorphism:** Same method behaves differently for different object types
- **Abstraction:** Hiding complex implementation; exposing only what's needed

### Functions and Methods
- **Function:** Reusable block of code; takes input (parameters), returns output
- **Method:** A function that belongs to a class/object
- **Parameters/Arguments:** Values passed to functions
- **Return value:** Value a function sends back
- **Purpose:** Code reuse, modularity, readability

### Variables and Scope
- **Local variable:** Exists only within a function
- **Global variable:** Accessible throughout the program
- **Scope:** Where a variable is accessible

### Comments and Documentation
- **Comment:** Non-executed text explaining code
- `// single line comment` (C/Java/JavaScript)
- `# comment` (Python/Bash)
- `/* multi-line comment */`
- Good documentation = easier maintenance

### Libraries and APIs
- **Library:** Pre-written code you can use in your program
- **API (Application Programming Interface):** Defines how software components interact
- **SDK (Software Development Kit):** Tools for building apps for a specific platform
- Example: Using a weather API to get forecast data in your app

---

## 4.4 Identify Programming Organizational Techniques and Logic Concepts

### Control Structures

**Sequential:** Code executes line by line, top to bottom

**Conditional (Selection):**
- `if`, `else if`, `else` — branch based on a condition
- `switch/case` — match a value to multiple cases

**Loops (Iteration):**
- `for` loop — repeat a set number of times
- `while` loop — repeat while a condition is true
- `do-while` — execute at least once, then check condition

### Logic and Operators

**Comparison Operators:**
- `==` equal to
- `!=` not equal to
- `>` greater than
- `<` less than
- `>=` greater than or equal to
- `<=` less than or equal to

**Logical Operators:**
- `AND (&&)` — both conditions must be true
- `OR (||)` — at least one condition must be true
- `NOT (!)` — reverses a boolean

**Boolean Logic Truth Table:**

| A | B | A AND B | A OR B | NOT A |
|---|---|---------|--------|-------|
| T | T | T | T | F |
| T | F | F | T | F |
| F | T | F | T | T |
| F | F | F | F | T |

### Pseudocode
- Plain language description of an algorithm; not real code
- Used for planning before writing actual code
- Example:
```
BEGIN
  GET user's age
  IF age >= 18 THEN
    PRINT "You may vote"
  ELSE
    PRINT "You may not vote"
  END IF
END
```

### Flowcharts
- Visual diagram of program logic
- **Shapes:** Oval = start/end, Rectangle = process, Diamond = decision, Parallelogram = input/output

### Version Control / Source Control
- **Git:** Most popular version control system
- **Repository (repo):** Storage for code + history
- **Commit:** Save a snapshot of changes
- **Branch:** Parallel version of code for features/testing
- **Merge:** Combine branches
- **GitHub/GitLab/Bitbucket:** Remote repository hosting

### Software Development Methodologies

**Waterfall:**
- Linear, sequential phases: Requirements → Design → Implementation → Testing → Deployment → Maintenance
- Rigid; works when requirements are very clear upfront

**Agile:**
- Iterative; work in short sprints (1–4 weeks)
- Constant collaboration; adapt to changing requirements
- Frameworks: Scrum, Kanban
- **Scrum roles:** Product Owner, Scrum Master, Development Team
- **Sprint:** Short development cycle

**DevOps:**
- Combines development and operations; continuous integration/deployment
- CI/CD pipelines automate testing and deployment

---

## Key Vocabulary — Domain 4

| Term | Definition |
|------|-----------|
| **Algorithm** | Step-by-step procedure to solve a problem |
| **Variable** | Named storage location in code |
| **Function** | Reusable block of code |
| **Class** | Blueprint for objects in OOP |
| **Object** | Instance of a class |
| **Inheritance** | Class acquiring properties of another class |
| **Encapsulation** | Bundling data and methods; information hiding |
| **API** | Application Programming Interface |
| **Library** | Pre-written reusable code |
| **Git** | Distributed version control system |
| **Compiler** | Translates source code to machine code |
| **Interpreter** | Executes code line-by-line at runtime |
| **Bug** | Error in a program |
| **Debugging** | Process of finding and fixing bugs |
| **IDE** | Integrated Development Environment (e.g., VS Code) |
| **Pseudocode** | Plain language algorithm description |
| **Loop** | Repeated execution of code |
| **Boolean** | True/False data type |
| **String** | Text data type |
| **Integer** | Whole number data type |

---

# Domain 5 — Data and Database Fundamentals (13%) {#domain-5}

## 5.1 Explain the Value of Data and Information

### Data vs. Information vs. Knowledge
- **Data:** Raw, unprocessed facts and figures (e.g., "37", "0110")
- **Information:** Data processed/organized to be meaningful (e.g., "temperature is 37°C")
- **Knowledge:** Information applied with context and experience

### Types of Data
- **Structured data:** Organized in a defined format; rows/columns (databases, spreadsheets)
- **Unstructured data:** No predefined format (emails, images, video, social media posts)
- **Semi-structured data:** Has some organization but not rigid (JSON, XML, email headers)

### Why Data Has Value
- Enables informed decision-making
- Reveals trends and patterns (analytics/business intelligence)
- Powers AI and machine learning systems
- Competitive advantage for businesses
- **Data is an asset** — must be protected, managed, and governed

### Data Governance
- Policies and standards ensuring data quality, privacy, security, and compliance
- Relates to regulations: **GDPR** (Europe), **HIPAA** (US healthcare), **PCI-DSS** (payment cards)

---

## 5.2 Explain Database Concepts and the Purpose of a Database

### What is a Database?
An organized collection of structured data stored electronically and managed by a **DBMS (Database Management System)**.

### Why Use Databases?
- Store large amounts of data efficiently
- Enable fast data retrieval and querying
- Support multiple simultaneous users
- Enforce data integrity and consistency
- Provide security and access control

### Key Database Concepts

**Table:** Grid of data organized in rows and columns
- Also called a **relation** (in relational databases)

**Record/Row:** A single entry in a table (one data point)

**Field/Column:** A single category of data (attribute)

**Primary Key:**
- Unique identifier for each row in a table
- Cannot be null; cannot be duplicated
- Example: Customer_ID, Employee_ID

**Foreign Key:**
- A field in one table referencing the primary key in another table
- Establishes relationships between tables
- Enforces **referential integrity**

**Index:**
- Data structure to speed up searches on a column
- Like the index of a book; trades storage space for speed

**Schema:**
- Definition of the database structure (tables, columns, types, relationships)

### CRUD Operations
The four basic database operations:
- **C**reate — Add new records (INSERT)
- **R**ead — Query/retrieve data (SELECT)
- **U**pdate — Modify existing records (UPDATE)
- **D**elete — Remove records (DELETE)

### SQL Basics (Structured Query Language)

```sql
-- SELECT: Retrieve data
SELECT first_name, last_name FROM customers;

-- WHERE: Filter records
SELECT * FROM products WHERE price > 100;

-- INSERT: Add new record
INSERT INTO customers (name, email) VALUES ('Jane Doe', 'jane@example.com');

-- UPDATE: Modify record
UPDATE products SET price = 25.99 WHERE product_id = 5;

-- DELETE: Remove record
DELETE FROM orders WHERE order_date < '2020-01-01';

-- ORDER BY: Sort results
SELECT * FROM employees ORDER BY last_name ASC;

-- JOIN: Combine data from multiple tables
SELECT orders.order_id, customers.name
FROM orders
JOIN customers ON orders.customer_id = customers.customer_id;
```

---

## 5.3 Compare and Contrast Various Database Structures

### Relational Databases (RDBMS)
- Data organized in **tables** with defined relationships
- Uses **SQL** to query data
- **ACID compliance:** Atomicity, Consistency, Isolation, Durability
- Examples: **MySQL, PostgreSQL, Microsoft SQL Server, Oracle, SQLite**
- Best for: Structured data, complex relationships, transactions (banking, ERP)

### Non-Relational Databases (NoSQL)
- More flexible data models; designed for scale and speed
- Do NOT use traditional table/row structure

| NoSQL Type | Description | Examples | Use Cases |
|-----------|-------------|---------|-----------|
| **Document** | Stores JSON/BSON documents | MongoDB, CouchDB | Content management, catalogs |
| **Key-Value** | Simple key→value pairs | Redis, DynamoDB | Caching, sessions, shopping carts |
| **Column-family** | Wide-column storage | Cassandra, HBase | Analytics, IoT data |
| **Graph** | Nodes and edges (relationships) | Neo4j, Amazon Neptune | Social networks, fraud detection |

### Hierarchical Databases
- Data organized in a tree structure (parent-child)
- Like a file system directory structure
- Fast for navigating hierarchy; rigid structure

### Flat File Databases
- Simplest form; data in a single table/file (CSV, TXT)
- No relationships; limited for complex data

### In-Memory Databases
- Data stored in RAM for ultra-fast access
- Examples: **Redis, Memcached**
- Data may not persist unless explicitly saved

### RDBMS vs. NoSQL Comparison

| Feature | Relational (SQL) | Non-Relational (NoSQL) |
|---------|-----------------|----------------------|
| Structure | Tables, rows, columns | Documents, key-value, graph, etc. |
| Schema | Fixed, predefined | Flexible, dynamic |
| Scalability | Vertical (bigger server) | Horizontal (more servers) |
| Consistency | ACID compliant | Often eventual consistency |
| Query language | SQL | Varies (no standard) |
| Best for | Complex relationships, transactions | Big data, real-time web apps |

---

## 5.4 Explain Basic Data Backup Concepts

### Why Back Up?
- Hardware failure, ransomware, accidental deletion, natural disasters
- Business continuity; data recovery
- Compliance requirements

### Backup Types

| Type | What It Backs Up | Speed | Storage Used | Notes |
|------|-----------------|-------|-------------|-------|
| **Full backup** | All selected data | Slow | Large | Complete snapshot; baseline |
| **Incremental** | Changes since last backup (any type) | Fast | Small | Requires all incrementals + full to restore |
| **Differential** | Changes since last full backup | Medium | Medium | Only need last full + last differential to restore |

**3-2-1 Backup Rule:**
- **3** copies of data
- **2** different storage media types
- **1** copy offsite (or in the cloud)

### Backup Storage Locations
- **Local:** External drive, NAS — fast restore; at risk from same disaster
- **Offsite:** Tape in a vault, separate building — safer
- **Cloud:** Automated, scalable, accessible — depends on internet; monthly cost

### Key Metrics
- **RTO (Recovery Time Objective):** Maximum acceptable downtime; how quickly you need to recover
- **RPO (Recovery Point Objective):** Maximum acceptable data loss; how recent your backup must be
- **Retention period:** How long backups are kept before deletion

### Backup vs. Archiving
- **Backup:** Active data copy; for disaster recovery; regularly updated
- **Archive:** Long-term storage of data no longer actively used; compliance/historical records

---

## Key Vocabulary — Domain 5

| Term | Definition |
|------|-----------|
| **Database** | Organized collection of structured data |
| **DBMS** | Database Management System |
| **RDBMS** | Relational DBMS (uses tables and SQL) |
| **Table** | Grid of rows and columns storing data |
| **Primary key** | Unique identifier for a row |
| **Foreign key** | References primary key of another table |
| **SQL** | Structured Query Language |
| **CRUD** | Create, Read, Update, Delete |
| **Query** | Request for data from a database |
| **Schema** | Database structure definition |
| **Index** | Structure to speed up data retrieval |
| **NoSQL** | Non-relational database types |
| **Full backup** | Complete copy of all data |
| **Incremental backup** | Only changes since last backup |
| **Differential backup** | Changes since last full backup |
| **3-2-1 rule** | 3 copies, 2 media types, 1 offsite |
| **RTO** | Recovery Time Objective |
| **RPO** | Recovery Point Objective |
| **ACID** | Atomicity, Consistency, Isolation, Durability |
| **Structured data** | Organized in rows and columns |
| **Unstructured data** | No predefined format (images, emails) |

---

# Domain 6 — Security (19%) {#domain-6}

## 6.1 Explain Fundamental Security Concepts and Frameworks

### The CIA Triad
The three core security principles:

**Confidentiality:**
- Ensuring only authorized users can access data
- Methods: Encryption, access controls, authentication

**Integrity:**
- Ensuring data is accurate and hasn't been tampered with
- Methods: Hashing, digital signatures, checksums

**Availability:**
- Ensuring systems and data are accessible when needed
- Methods: Redundancy, backups, DDoS protection, failover

### Additional Security Concepts

**Authentication:** Verifying who someone is ("Are you who you claim to be?")
- Something you **know:** Password, PIN
- Something you **have:** Smart card, token, phone
- Something you **are:** Fingerprint, retina (biometrics)

**Authorization:** Determining what an authenticated user is allowed to do

**Non-repudiation:** Ensuring a person cannot deny having performed an action
- Achieved through: Digital signatures, audit logs

**Accounting/Auditing:** Tracking and recording user activity

**AAA Framework:** Authentication, Authorization, Accounting

### Principle of Least Privilege
- Users and systems should have only the minimum permissions needed to perform their job
- Reduces the attack surface if an account is compromised

### Defense in Depth
- Layered security approach; multiple overlapping controls
- If one layer fails, others remain
- Layers: Physical → Network → Endpoint → Application → Data

### Zero Trust Model
- "Never trust, always verify"
- Every access request is verified, even from inside the network
- Assumes breach; verify explicitly, use least privilege

### Security Frameworks and Compliance
- **NIST Cybersecurity Framework:** Identify, Protect, Detect, Respond, Recover
- **ISO 27001:** Information security management standard
- **HIPAA:** US healthcare data privacy law
- **GDPR:** European Union data protection regulation
- **PCI-DSS:** Payment Card Industry Data Security Standard
- **SOX:** Sarbanes-Oxley; financial data integrity

---

## 6.2 Explain Methods to Secure Devices and Security Best Practices

### Physical Security
- **Locks:** Cable locks for laptops; locked server rooms
- **Badge access:** Key cards to restrict building/room access
- **Mantraps/Security vestibules:** Double-door entry to prevent tailgating
- **Surveillance cameras (CCTV):** Monitor and deter physical intrusions
- **Tailgating/Piggybacking:** Following an authorized person through a secure door — prevent with training
- **Device encryption:** Full-disk encryption protects data on lost/stolen devices

### Endpoint Security
- **Antivirus / Antimalware:** Detects and removes malicious software
- **Host-based firewall:** Filters traffic on individual devices (Windows Defender Firewall)
- **EDR (Endpoint Detection and Response):** Advanced threat detection and automated response
- **Patch management:** Keep OS and apps updated to fix vulnerabilities
- **Application whitelisting/blacklisting:**
  - **Whitelist:** Only approved apps can run
  - **Blacklist:** Specific apps are blocked
- **Screen lock:** Requires authentication after inactivity
- **Remote wipe:** Remotely erase device if stolen (MDM)

### Network Security
- **Firewall:** Hardware or software filtering traffic based on rules
  - **Stateful inspection:** Tracks connection state; smarter filtering
  - **Next-Gen Firewall (NGFW):** Deep packet inspection, application awareness
- **IDS (Intrusion Detection System):** Monitors and alerts on suspicious traffic (passive)
- **IPS (Intrusion Prevention System):** Monitors and actively blocks threats (active)
- **DMZ (Demilitarized Zone):** Network segment for public-facing servers; between internet and internal network
- **VPN (Virtual Private Network):** Encrypted tunnel between client and network
  - **Site-to-site VPN:** Connects two offices securely
  - **Remote access VPN:** Individual users connect to corporate network
  - Protocols: **OpenVPN, IPsec, WireGuard, L2TP, PPTP** (outdated/insecure)
- **Network segmentation:** Divide network into zones; contain breaches
- **VLAN (Virtual LAN):** Logically separate network segments on the same physical switch

### Wireless Security
- **WEP (Wired Equivalent Privacy):** Legacy; easily cracked; **do not use**
- **WPA (Wi-Fi Protected Access):** Improved; uses TKIP; also deprecated
- **WPA2:** Current standard; uses AES encryption; use when WPA3 unavailable
- **WPA3:** Latest; stronger encryption; SAE (Simultaneous Authentication of Equals)
- **SSID hiding:** Not effective security; determined attackers can find hidden SSIDs
- **MAC address filtering:** Blocks unauthorized devices; easily spoofed; not strong security
- **Wi-Fi password complexity:** Use a long, random passphrase

---

## 6.3 Explain Password Best Practices

### Strong Password Guidelines
- **Length:** Minimum 12–16 characters; longer is better
- **Complexity:** Mix uppercase, lowercase, numbers, symbols
- **Unpredictability:** Avoid dictionary words, names, dates
- **Uniqueness:** Different password for every account
- **Passphrases:** Series of random words; long yet memorable (e.g., "PurpleSunsetTableFrog7!")

### Password Management
- **Password manager:** Software that stores and generates strong passwords (LastPass, Bitwarden, 1Password)
- **Never reuse passwords:** One breach exposes all accounts
- **Change default passwords:** On routers, IoT devices, new accounts immediately

### Multi-Factor Authentication (MFA)
- Combines two or more authentication factors
- **Factors:** Something you know + something you have + something you are
- **Common MFA methods:**
  - SMS/Text code (weakest — SIM swapping risk)
  - Authenticator app (TOTP): Google Authenticator, Authy
  - Hardware token (RSA SecurID, YubiKey)
  - Push notification
  - Biometrics
- **2FA:** Two-Factor Authentication (subset of MFA)

### Account Lockout Policies
- Lock account after X failed login attempts (e.g., 5 attempts)
- Prevents brute-force attacks
- **Lockout duration:** Time before retry is allowed or admin must unlock

### Common Password Attacks
- **Brute force:** Try every possible combination
- **Dictionary attack:** Try common words and variations
- **Credential stuffing:** Use stolen credentials from one site on another
- **Rainbow table:** Pre-computed hash lookup; countered by **salting** passwords
- **Phishing:** Trick user into revealing password

---

## 6.4 Identify Common Use Cases for Encryption

### What is Encryption?
The process of converting readable data (**plaintext**) into unreadable form (**ciphertext**) using an algorithm and a key.

### Symmetric Encryption
- **Same key** used to encrypt and decrypt
- Fast; good for large amounts of data
- Challenge: Securely sharing the key
- **Algorithms:** AES (Advanced Encryption Standard — the gold standard), DES (old/insecure), 3DES

**AES key sizes:** 128-bit, 192-bit, 256-bit (256-bit is strongest)

### Asymmetric Encryption (Public Key Cryptography)
- Uses a **key pair:** Public key (shareable) + Private key (kept secret)
- What the public key encrypts, only the private key can decrypt (and vice versa)
- Slower than symmetric; used for key exchange and digital signatures
- **Algorithms:** RSA, ECC (Elliptic Curve Cryptography), Diffie-Hellman

**How HTTPS works (hybrid):**
1. Browser connects to server; server sends public key in certificate
2. Browser verifies certificate; generates a session key
3. Browser encrypts session key with server's public key
4. Server decrypts session key with its private key
5. Subsequent communication uses fast symmetric encryption with that session key

### Hashing
- One-way function; converts data to a fixed-length **hash (digest)**
- Same input always produces the same output; different input produces completely different hash
- Cannot be reversed (theoretically)
- **Use cases:** Password storage, file integrity verification, digital signatures
- **Algorithms:** MD5 (compromised/don't use for security), SHA-1 (deprecated), **SHA-256, SHA-3** (current standards)

**Password hashing with salt:**
- A **salt** is random data added to the password before hashing
- Prevents rainbow table attacks
- Each user gets a unique salt; same password produces different hash

### Encryption Use Cases

| Use Case | Method | Example |
|----------|--------|---------|
| **Secure web traffic** | TLS/HTTPS | Online banking, shopping |
| **Email encryption** | PGP, S/MIME | Encrypting email contents |
| **File/folder encryption** | AES | BitLocker (Windows), FileVault (macOS) |
| **Full disk encryption (FDE)** | AES | BitLocker, VeraCrypt |
| **VPN tunnels** | AES + RSA | Corporate VPN |
| **Password storage** | Hashing + salting | bcrypt, Argon2 |
| **Digital signatures** | RSA, ECDSA | Software verification |
| **Wi-Fi** | WPA2/WPA3 AES | Home/office Wi-Fi |

### PKI (Public Key Infrastructure)
- System for issuing, managing, and revoking digital certificates
- **Certificate Authority (CA):** Trusted entity that issues certificates
- **Digital Certificate:** Electronic document binding a public key to an identity (name, org)
- **SSL/TLS Certificates:** Used for HTTPS
- **Certificate Revocation:** CRL (Certificate Revocation List), OCSP

---

## 6.5 Explain Common Threats and Vulnerabilities

### Types of Malware

| Malware Type | Description | Key Characteristic |
|-------------|-------------|-------------------|
| **Virus** | Self-replicating code; attaches to files | Requires user action to spread |
| **Worm** | Self-replicating; spreads without user action | Propagates across networks autonomously |
| **Trojan** | Disguised as legitimate software | No self-replication; relies on deception |
| **Ransomware** | Encrypts files; demands payment | Very destructive; backup is key defense |
| **Spyware** | Monitors user activity covertly | Keyloggers, screen capture |
| **Adware** | Displays unwanted advertisements | Often bundled with free software |
| **Rootkit** | Hides malware; gives deep system access | Very hard to detect/remove |
| **Botnet/Bot** | Infected PC controlled remotely | Used for spam, DDoS, mining |
| **Keylogger** | Records keystrokes | Captures passwords and sensitive data |
| **Fileless malware** | Lives in memory; no file on disk | Harder to detect |

### Social Engineering Attacks
Exploiting human psychology rather than technical vulnerabilities.

| Attack | Description |
|--------|-------------|
| **Phishing** | Fraudulent email appearing to be from trusted source |
| **Spear phishing** | Targeted phishing; personalized to the victim |
| **Whaling** | Spear phishing targeting executives |
| **Smishing** | Phishing via SMS text messages |
| **Vishing** | Phishing via voice call |
| **Pretexting** | Creating a fabricated scenario to extract info |
| **Baiting** | Leaving infected USB drives for people to find |
| **Tailgating/Piggybacking** | Following someone through a secure door |
| **Quid pro quo** | Offering something in exchange for information |

### Network-Based Attacks

| Attack | Description |
|--------|-------------|
| **DoS (Denial of Service)** | Overwhelm a system so it can't respond to legit requests |
| **DDoS (Distributed DoS)** | DoS from many compromised systems simultaneously |
| **Man-in-the-Middle (MitM)** | Attacker intercepts communication between two parties |
| **Packet sniffing** | Capturing network traffic to read unencrypted data |
| **Replay attack** | Capturing and retransmitting valid data packets |
| **SQL injection** | Inserting malicious SQL code into input fields |
| **Cross-Site Scripting (XSS)** | Injecting malicious scripts into web pages |
| **ARP poisoning** | Linking attacker's MAC to legitimate IP address |
| **DNS poisoning** | Corrupting DNS cache to redirect traffic |
| **Brute force** | Systematically trying all possible passwords |

### Vulnerability vs. Threat vs. Risk
- **Vulnerability:** A weakness in a system (e.g., unpatched software)
- **Threat:** A potential cause of harm (e.g., a hacker exploiting the vulnerability)
- **Risk:** The likelihood and impact of a threat exploiting a vulnerability
  - Risk = Threat × Vulnerability × Impact
- **Exploit:** A program or technique that takes advantage of a vulnerability

---

## 6.6 Identify Wireless Security Concepts

### Wireless Threats
- **Rogue access point:** Unauthorized AP connected to network; can intercept traffic
- **Evil twin:** Fake AP that mimics a legitimate one; users unknowingly connect
- **War driving:** Driving around looking for unsecured Wi-Fi networks
- **WPS attacks:** WPS (Wi-Fi Protected Setup) PIN can be brute-forced; disable WPS

### Wireless Best Practices
- Use WPA3 (or WPA2-AES if WPA3 unavailable)
- Change default router admin credentials
- Disable WPS
- Use strong, unique Wi-Fi password
- Segment guest networks from main network
- Keep router firmware updated
- Consider hiding SSID (minor barrier only)

---

## Key Vocabulary — Domain 6

| Term | Definition |
|------|-----------|
| **CIA Triad** | Confidentiality, Integrity, Availability |
| **Authentication** | Proving identity |
| **Authorization** | Determining permissions |
| **MFA** | Multi-Factor Authentication |
| **Encryption** | Converting plaintext to ciphertext |
| **AES** | Advanced Encryption Standard (symmetric) |
| **RSA** | Asymmetric encryption algorithm |
| **Hashing** | One-way conversion to fixed-length digest |
| **Salt** | Random data added to password before hashing |
| **TLS/SSL** | Transport Layer Security; secures internet traffic |
| **HTTPS** | HTTP over TLS; secure web browsing |
| **VPN** | Virtual Private Network; encrypted tunnel |
| **Firewall** | Network traffic filter |
| **IDS** | Intrusion Detection System (passive) |
| **IPS** | Intrusion Prevention System (active) |
| **Phishing** | Fraudulent email to steal credentials |
| **Ransomware** | Malware that encrypts files for ransom |
| **Malware** | Malicious software |
| **Vulnerability** | Weakness in a system |
| **Exploit** | Code/technique targeting a vulnerability |
| **Zero Trust** | Never trust, always verify |
| **Least privilege** | Minimum permissions needed |
| **DMZ** | Demilitarized Zone; network segment for public servers |
| **PKI** | Public Key Infrastructure |
| **CA** | Certificate Authority |
| **DoS / DDoS** | Denial of Service attack |
| **MitM** | Man-in-the-Middle attack |
| **Social engineering** | Manipulating humans to gain access |
| **WPA2/WPA3** | Wi-Fi security protocols |
| **Biometrics** | Authentication using physical characteristics |

---

# Key Acronyms Reference {#acronyms}

| Acronym | Full Name |
|---------|-----------|
| ACL | Access Control List |
| AES | Advanced Encryption Standard |
| APIPA | Automatic Private IP Addressing |
| API | Application Programming Interface |
| APT | Advanced Persistent Threat |
| ARP | Address Resolution Protocol |
| ATX | Advanced Technology Extended (motherboard form factor) |
| BIOS | Basic Input/Output System |
| bps | Bits per second |
| CA | Certificate Authority |
| CIA | Confidentiality, Integrity, Availability |
| CLI | Command Line Interface |
| CPU | Central Processing Unit |
| CRM | Customer Relationship Management |
| CRUD | Create, Read, Update, Delete |
| DBMS | Database Management System |
| DDR | Double Data Rate (RAM) |
| DHCP | Dynamic Host Configuration Protocol |
| DMZ | Demilitarized Zone |
| DNS | Domain Name System |
| DoS | Denial of Service |
| DDoS | Distributed Denial of Service |
| DSL | Digital Subscriber Line |
| ECC | Error-Correcting Code (RAM) or Elliptic Curve Cryptography |
| EDR | Endpoint Detection and Response |
| ERP | Enterprise Resource Planning |
| FDE | Full Disk Encryption |
| FTTH | Fiber to the Home |
| FTP | File Transfer Protocol |
| GB | Gigabyte |
| Gbps | Gigabits per second |
| GHz | Gigahertz |
| GDPR | General Data Protection Regulation |
| GPU | Graphics Processing Unit |
| GUI | Graphical User Interface |
| HDD | Hard Disk Drive |
| HIPAA | Health Insurance Portability and Accountability Act |
| HTTP | Hypertext Transfer Protocol |
| HTTPS | HTTP Secure |
| IaaS | Infrastructure as a Service |
| IDS | Intrusion Detection System |
| IMAP | Internet Message Access Protocol |
| IoT | Internet of Things |
| IP | Internet Protocol |
| IPS | Intrusion Prevention System |
| ISP | Internet Service Provider |
| IT | Information Technology |
| KB | Kilobyte |
| LAN | Local Area Network |
| MAC | Media Access Control |
| MB | Megabyte |
| Mbps | Megabits per second |
| MDM | Mobile Device Management |
| MFA | Multi-Factor Authentication |
| MHz | Megahertz |
| MitM | Man-in-the-Middle |
| MQTT | Message Queuing Telemetry Transport |
| NAS | Network Attached Storage |
| NAT | Network Address Translation |
| NFC | Near Field Communication |
| NIC | Network Interface Card |
| NIST | National Institute of Standards and Technology |
| NVMe | Non-Volatile Memory Express |
| OOP | Object-Oriented Programming |
| OS | Operating System |
| PaaS | Platform as a Service |
| PAN | Personal Area Network |
| PCI-DSS | Payment Card Industry Data Security Standard |
| PGP | Pretty Good Privacy |
| PKI | Public Key Infrastructure |
| POP3 | Post Office Protocol version 3 |
| POST | Power-On Self-Test |
| PSU | Power Supply Unit |
| RAID | Redundant Array of Independent Disks |
| RAM | Random Access Memory |
| RDBMS | Relational Database Management System |
| RF | Radio Frequency |
| RPO | Recovery Point Objective |
| RSA | Rivest–Shamir–Adleman (asymmetric algorithm) |
| RTO | Recovery Time Objective |
| SaaS | Software as a Service |
| SAN | Storage Area Network |
| SDK | Software Development Kit |
| SHA | Secure Hash Algorithm |
| SIM | Subscriber Identity Module |
| SMTP | Simple Mail Transfer Protocol |
| SQL | Structured Query Language |
| SSH | Secure Shell |
| SSID | Service Set Identifier (Wi-Fi network name) |
| SSD | Solid State Drive |
| TB | Terabyte |
| TCP | Transmission Control Protocol |
| TCP/IP | Transmission Control Protocol / Internet Protocol |
| TLS | Transport Layer Security |
| TOTP | Time-based One-Time Password |
| UDP | User Datagram Protocol |
| UEFI | Unified Extensible Firmware Interface |
| USB | Universal Serial Bus |
| VDI | Virtual Desktop Infrastructure |
| VLAN | Virtual Local Area Network |
| VM | Virtual Machine |
| VoIP | Voice over Internet Protocol |
| VPN | Virtual Private Network |
| WAN | Wide Area Network |
| WPA | Wi-Fi Protected Access |
| WPS | Wi-Fi Protected Setup |
| XSS | Cross-Site Scripting |

---

# Practice Question Bank {#practice-questions}

## Domain 1 — IT Concepts and Terminology

**Q1.** What is the binary equivalent of the decimal number 25?

A) 11001  
B) 10101  
C) 11000  
D) 10011

**Answer: A) 11001**  
*Explanation: 25 = 16+8+1 = 11001 in binary.*

---

**Q2.** A technician is documenting a server's performance. The server's network card can transfer data at 10 Gbps. How many megabits per second is this?

A) 10 Mbps  
B) 100 Mbps  
C) 1,000 Mbps  
D) 10,000 Mbps

**Answer: D) 10,000 Mbps**  
*Explanation: 1 Gbps = 1,000 Mbps; 10 Gbps = 10,000 Mbps.*

---

**Q3.** What is the hexadecimal value of the decimal number 255?

A) FE  
B) FF  
C) 100  
D) EF

**Answer: B) FF**  
*Explanation: 255 ÷ 16 = 15 remainder 15; F=15, so 255 = FF in hex.*

---

**Q4.** During the troubleshooting process, a technician establishes a theory of probable cause but testing does not confirm it. What should the technician do NEXT?

A) Escalate immediately  
B) Implement the solution anyway  
C) Establish a new theory of probable cause  
D) Document and close the ticket

**Answer: C) Establish a new theory of probable cause**  
*Explanation: If a theory is not confirmed, go back to Step 3 and form a new theory.*

---

**Q5.** Which of the following represents the CORRECT order of the CompTIA troubleshooting methodology?

A) Identify → Test theory → Establish theory → Implement plan  
B) Identify → Establish theory → Test theory → Establish plan → Implement → Verify  
C) Test → Identify → Implement → Verify  
D) Research → Identify → Implement → Test → Verify

**Answer: B) Identify → Establish theory → Test theory → Establish plan → Implement → Verify**

---

**Q6.** Which of the following is an example of an OUTPUT device?

A) Keyboard  
B) Scanner  
C) Microphone  
D) Projector

**Answer: D) Projector**  
*Explanation: Projector displays information to users — it is an output device. Keyboard, scanner, and microphone are input devices.*

---

**Q7.** A storage drive stores 500 GB of data. How many bytes is that (approximately)?

A) 500,000 bytes  
B) 500,000,000 bytes  
C) 500,000,000,000 bytes  
D) 500,000,000,000,000 bytes

**Answer: C) 500,000,000,000 bytes**  
*Explanation: 1 GB ≈ 1,000,000,000 bytes; 500 GB ≈ 500 billion bytes.*

---

## Domain 2 — Infrastructure

**Q8.** Which type of RAM is used in servers to detect and correct single-bit memory errors?

A) DDR4  
B) SDRAM  
C) ECC RAM  
D) DRAM

**Answer: C) ECC RAM**  
*Explanation: Error-Correcting Code RAM can detect and correct single-bit memory errors, making it essential for server reliability.*

---

**Q9.** A technician needs the FASTEST storage solution for a workstation. Which option should they choose?

A) 7200 RPM HDD  
B) SATA SSD  
C) NVMe M.2 SSD  
D) 5400 RPM HDD

**Answer: C) NVMe M.2 SSD**  
*Explanation: NVMe SSDs use the PCIe bus and can reach 3,000–7,000 MB/s, far outpacing SATA SSDs (~550 MB/s) and HDDs (~200 MB/s).*

---

**Q10.** What RAID level provides the best write performance with NO fault tolerance?

A) RAID 1  
B) RAID 5  
C) RAID 6  
D) RAID 0

**Answer: D) RAID 0**  
*Explanation: RAID 0 (striping) splits data across all drives for maximum speed, but provides zero fault tolerance — one drive failure destroys all data.*

---

**Q11.** Which cloud service model provides the most control over the operating system?

A) SaaS  
B) PaaS  
C) IaaS  
D) FaaS

**Answer: C) IaaS**  
*Explanation: With Infrastructure as a Service, the customer manages the OS, applications, and data. SaaS manages nothing; PaaS manages apps and data only.*

---

**Q12.** A device automatically receives an IP address of 169.254.45.10. What does this indicate?

A) The device is on the internet  
B) The DHCP server successfully assigned an address  
C) The device could not reach a DHCP server  
D) The device is using IPv6

**Answer: C) The device could not reach a DHCP server**  
*Explanation: 169.254.x.x is an APIPA address, automatically self-assigned when a device cannot communicate with a DHCP server.*

---

**Q13.** Which port does DNS use by default?

A) 80  
B) 443  
C) 53  
D) 25

**Answer: C) 53**

---

**Q14.** Which USB standard supports transfer speeds of up to 40 Gbps?

A) USB 2.0  
B) USB 3.0  
C) USB 3.1  
D) USB 4 / Thunderbolt 4

**Answer: D) USB 4 / Thunderbolt 4**

---

**Q15.** A company wants to set up a hypervisor that runs directly on bare metal server hardware without a host OS. Which type should they use?

A) Type 2 hypervisor  
B) Type 1 hypervisor  
C) Container  
D) Emulator

**Answer: B) Type 1 hypervisor**  
*Explanation: Type 1 (bare-metal) hypervisors run directly on hardware. Type 2 run on a host OS.*

---

**Q16.** What is the primary difference between a hub and a switch?

A) A hub filters traffic by IP address; a switch uses MAC addresses  
B) A hub broadcasts all traffic to all ports; a switch forwards traffic only to the intended port  
C) A hub is faster than a switch  
D) A switch operates at Layer 1; a hub at Layer 2

**Answer: B) A hub broadcasts all traffic to all ports; a switch forwards traffic only to the intended port**

---

## Domain 3 — Applications and Software

**Q17.** A user wants to install software on a Linux machine using the command line. Which command would be appropriate for an Ubuntu/Debian-based system?

A) yum install software  
B) pacman -S software  
C) apt install software  
D) brew install software

**Answer: C) apt install software**  
*Explanation: apt is the package manager for Debian-based systems like Ubuntu. yum/dnf = Red Hat/Fedora. pacman = Arch Linux. brew = macOS.*

---

**Q18.** Which file system does Windows primarily use for its system drives?

A) FAT32  
B) exFAT  
C) ext4  
D) NTFS

**Answer: D) NTFS**  
*Explanation: NTFS (New Technology File System) is the standard for Windows system drives, supporting large files, permissions, and encryption.*

---

**Q19.** A user reports that a website they visit regularly is loading incorrectly. A technician suspects old cached data. What should they do?

A) Reinstall the browser  
B) Update the OS  
C) Clear the browser cache  
D) Disable all extensions permanently

**Answer: C) Clear the browser cache**

---

**Q20.** What does "open source" software mean?

A) The software is free of charge with no restrictions  
B) The source code is publicly available for anyone to view, modify, and distribute  
C) The software has no security vulnerabilities  
D) The software was created by a government agency

**Answer: B) The source code is publicly available for anyone to view, modify, and distribute**

---

**Q21.** A user wants to try software before purchasing it. The vendor provides a free trial version with limited features. What licensing model is this?

A) Freeware  
B) Open source  
C) Shareware  
D) Subscription

**Answer: C) Shareware**

---

## Domain 4 — Software Development Concepts

**Q22.** Which programming language type executes code line by line at runtime without a separate compilation step?

A) Compiled language  
B) Assembled language  
C) Interpreted language  
D) Machine language

**Answer: C) Interpreted language**

---

**Q23.** In object-oriented programming, what is the term for a blueprint or template used to create objects?

A) Method  
B) Instance  
C) Class  
D) Function

**Answer: C) Class**

---

**Q24.** A developer is writing code to repeat a block of instructions 10 times. Which programming construct should they use?

A) Conditional statement  
B) Loop  
C) Function  
D) Class

**Answer: B) Loop**

---

**Q25.** What is a primary advantage of the Agile software development methodology over Waterfall?

A) Agile requires all requirements to be defined before development begins  
B) Agile allows teams to adapt to changing requirements through iterative development  
C) Agile eliminates the need for testing  
D) Agile is only suitable for small projects

**Answer: B) Agile allows teams to adapt to changing requirements through iterative development**

---

**Q26.** Which of the following data types would BEST store the value 3.14159?

A) Integer  
B) Boolean  
C) String  
D) Float

**Answer: D) Float**

---

**Q27.** A developer uses Git to manage their project. They want to save their current changes to the repository history. What action should they perform?

A) Push  
B) Clone  
C) Commit  
D) Branch

**Answer: C) Commit**  
*Explanation: A commit saves a snapshot of changes to the local repository history. Push sends commits to a remote repository.*

---

**Q28.** Evaluate this logic: `IF (score >= 90 AND attendance == True) THEN grade = 'A'`. A student scores 92 but has attendance = False. What is the result?

A) grade = 'A'  
B) grade = 'B'  
C) The condition is false; grade is not set to 'A'  
D) An error occurs

**Answer: C) The condition is false; grade is not set to 'A'**  
*Explanation: AND requires BOTH conditions to be true. attendance is False, so the entire condition is False.*

---

## Domain 5 — Data and Database Fundamentals

**Q29.** Which field in a database table uniquely identifies each row?

A) Foreign key  
B) Index  
C) Primary key  
D) Schema

**Answer: C) Primary key**

---

**Q30.** A company performs a full backup every Sunday. Each day Monday through Saturday, they back up only the data changed since the previous day's backup. What backup strategy are they using?

A) Full backups only  
B) Differential backup  
C) Incremental backup  
D) Mirror backup

**Answer: C) Incremental backup**  
*Explanation: Incremental = backs up changes since the LAST backup (any type). Differential = backs up changes since the last FULL backup.*

---

**Q31.** Which SQL command is used to retrieve data from a database?

A) INSERT  
B) UPDATE  
C) SELECT  
D) DELETE

**Answer: C) SELECT**

---

**Q32.** A developer is building a social network application and needs to store relationships between users (e.g., friends of friends). Which database type is BEST suited for this?

A) Relational (SQL) database  
B) Flat file database  
C) Graph database  
D) Key-value database

**Answer: C) Graph database**  
*Explanation: Graph databases excel at storing and querying complex relationships between entities, making them ideal for social networks.*

---

**Q33.** The 3-2-1 backup rule states you should have:

A) 3 copies on 2 different media in 1 location  
B) 3 copies on 2 different media with 1 copy offsite  
C) 3 different backup types with 2 on local drives and 1 in the cloud  
D) 3 full backups on 2 tapes with 1 daily backup

**Answer: B) 3 copies on 2 different media with 1 copy offsite**

---

**Q34.** Which of the following is an example of UNSTRUCTURED data?

A) A spreadsheet of employee salaries  
B) A table of customer orders in a database  
C) A collection of social media photos and videos  
D) A CSV file of inventory items

**Answer: C) A collection of social media photos and videos**

---

**Q35.** An organization's RTO is 4 hours. What does this mean?

A) Data can be lost for up to 4 hours before it must be recovered  
B) Systems must be restored within 4 hours of an outage  
C) Backups must be performed every 4 hours  
D) Data is retained for 4 hours after deletion

**Answer: B) Systems must be restored within 4 hours of an outage**  
*Explanation: RTO = Recovery TIME Objective = how quickly you must get back online. RPO = Recovery POINT Objective = how much data you can lose.*

---

## Domain 6 — Security

**Q36.** Which of the following BEST represents the CIA triad?

A) Confidentiality, Identification, Authorization  
B) Confidentiality, Integrity, Availability  
C) Compliance, Integrity, Authentication  
D) Confidentiality, Integrity, Authentication

**Answer: B) Confidentiality, Integrity, Availability**

---

**Q37.** A user receives an email appearing to be from their bank, asking them to click a link and verify their credentials. The email's link goes to a fake website. What type of attack is this?

A) Ransomware  
B) Phishing  
C) Brute force  
D) SQL injection

**Answer: B) Phishing**

---

**Q38.** Which Wi-Fi security protocol is considered the MOST secure for modern wireless networks?

A) WEP  
B) WPA  
C) WPA2  
D) WPA3

**Answer: D) WPA3**  
*Explanation: WPA3 is the latest standard, offering stronger encryption (SAE) than WPA2. WEP and WPA are both deprecated and insecure.*

---

**Q39.** An employee's laptop is stolen. The company wants to ensure data on the laptop cannot be accessed. Which security measure would be MOST effective?

A) Screen lock PIN  
B) Full disk encryption  
C) Application whitelisting  
D) Antivirus software

**Answer: B) Full disk encryption**  
*Explanation: Full disk encryption (e.g., BitLocker) makes data unreadable without the encryption key, even if the drive is removed from the laptop.*

---

**Q40.** Which encryption algorithm is the current industry standard for symmetric encryption?

A) DES  
B) 3DES  
C) AES  
D) RSA

**Answer: C) AES**  
*Explanation: AES (Advanced Encryption Standard) is the current gold standard for symmetric encryption. RSA is asymmetric. DES/3DES are outdated.*

---

**Q41.** What is the difference between an IDS and an IPS?

A) An IDS prevents attacks; an IPS only detects them  
B) An IDS detects and alerts on threats; an IPS actively blocks threats  
C) An IDS is hardware; an IPS is software  
D) An IDS monitors outbound traffic; an IPS monitors inbound traffic

**Answer: B) An IDS detects and alerts on threats; an IPS actively blocks threats**

---

**Q42.** A company's security policy states users should only have access to the resources they need to perform their job. Which principle does this describe?

A) Defense in depth  
B) Zero trust  
C) Least privilege  
D) Separation of duties

**Answer: C) Least privilege**

---

**Q43.** Which type of malware encrypts a victim's files and demands payment for the decryption key?

A) Spyware  
B) Adware  
C) Ransomware  
D) Rootkit

**Answer: C) Ransomware**

---

**Q44.** An attacker intercepts network traffic between a user and a web server, reading and potentially altering the data. What type of attack is this?

A) Phishing  
B) Denial of Service  
C) Man-in-the-Middle  
D) Brute force

**Answer: C) Man-in-the-Middle (MitM)**

---

**Q45.** Which authentication factor category does a fingerprint scan belong to?

A) Something you know  
B) Something you have  
C) Something you are  
D) Somewhere you are

**Answer: C) Something you are** *(biometric — inherence factor)*

---

**Q46.** A user is told their password has been found in a data breach and they should change it immediately. An attacker is using those stolen credentials to try logging into other websites. What attack is this?

A) Dictionary attack  
B) Brute force attack  
C) Credential stuffing  
D) Rainbow table attack

**Answer: C) Credential stuffing**  
*Explanation: Credential stuffing uses credentials stolen from one breach to attempt login on other sites, exploiting password reuse.*

---

**Q47.** Which hashing algorithm is considered MOST secure among the options below?

A) MD5  
B) SHA-1  
C) SHA-256  
D) CRC32

**Answer: C) SHA-256**  
*Explanation: MD5 and SHA-1 are considered cryptographically broken for security purposes. SHA-256 (part of SHA-2) is current standard.*

---

**Q48.** What is the purpose of adding a "salt" to a password before hashing?

A) To make the password longer  
B) To encrypt the password  
C) To prevent rainbow table attacks by making each hash unique  
D) To compress the password for storage efficiency

**Answer: C) To prevent rainbow table attacks by making each hash unique**

---

**Q49.** A company places its public-facing web servers in a network segment separated from the internal corporate network. What is this segment called?

A) VLAN  
B) DMZ  
C) VPN  
D) WAN

**Answer: B) DMZ (Demilitarized Zone)**

---

**Q50.** Which of the following attacks does NOT involve technical exploitation of a system, but instead targets human behavior?

A) SQL injection  
B) Buffer overflow  
C) DDoS  
D) Pretexting

**Answer: D) Pretexting** *(social engineering — manipulates humans, not systems)*

---

## Mixed Review Questions

**Q51.** A technician is setting up a new computer and needs to configure the system to automatically receive an IP address. Which service handles this?

A) DNS  
B) DHCP  
C) FTP  
D) NAT

**Answer: B) DHCP**

---

**Q52.** Which of the following storage connection types offers the highest data transfer speed?

A) SATA III  
B) USB 3.0  
C) NVMe PCIe  
D) Thunderbolt 1

**Answer: C) NVMe PCIe**  
*Explanation: NVMe over PCIe achieves 3,000–7,000+ MB/s. SATA III maxes at ~600 MB/s. USB 3.0 = 5 Gbps. Thunderbolt 1 = 10 Gbps but NVMe drives still typically exceed Thunderbolt 1 in sequential read.*

---

**Q53.** Which of the following is a characteristic of cloud computing that means resources can be quickly scaled up or down?

A) Broad network access  
B) Measured service  
C) Rapid elasticity  
D) Resource pooling

**Answer: C) Rapid elasticity**

---

**Q54.** A programmer declares a variable that stores only True or False. What data type is this?

A) String  
B) Integer  
C) Float  
D) Boolean

**Answer: D) Boolean**

---

**Q55.** What does the acronym SQL stand for?

A) Simple Query Logic  
B) Structured Query Language  
C) System Query Loop  
D) Standard Quick Language

**Answer: B) Structured Query Language**

---

**Q56.** A user reports their computer is very slow and they are seeing many pop-up ads even when no browser is open. Which type of malware is MOST likely responsible?

A) Ransomware  
B) Rootkit  
C) Adware  
D) Worm

**Answer: C) Adware** *(adware displays unwanted ads; slowness is common side effect)*

---

**Q57.** Which of the following BEST describes asymmetric encryption?

A) Uses the same key to encrypt and decrypt data  
B) Uses a pair of mathematically related keys: one public and one private  
C) Only encrypts data at rest, not in transit  
D) Is faster than symmetric encryption

**Answer: B) Uses a pair of mathematically related keys: one public and one private**

---

**Q58.** A RAID 5 array has 4 drives. How many drives can fail before data is lost?

A) 0  
B) 1  
C) 2  
D) 3

**Answer: B) 1**  
*Explanation: RAID 5 can tolerate the failure of exactly 1 drive. RAID 6 tolerates 2 failures.*

---

**Q59.** Which OOP concept allows a child class to use methods and attributes defined in a parent class?

A) Encapsulation  
B) Polymorphism  
C) Abstraction  
D) Inheritance

**Answer: D) Inheritance**

---

**Q60.** A database administrator wants to find all customers in the "orders" table who placed orders with a total over $500. Which SQL clause filters the results?

A) ORDER BY  
B) GROUP BY  
C) WHERE  
D) JOIN

**Answer: C) WHERE**

---

**Q61.** Which of the following is a TYPE 2 hypervisor?

A) VMware ESXi  
B) Microsoft Hyper-V (bare metal)  
C) Oracle VirtualBox  
D) Citrix XenServer

**Answer: C) Oracle VirtualBox**  
*Explanation: VirtualBox runs on top of an existing OS (Type 2). ESXi, Hyper-V Server, and XenServer are Type 1 bare-metal hypervisors.*

---

**Q62.** A user complains they cannot access a website using its domain name, but can access it using the IP address directly. Which service is MOST likely malfunctioning?

A) DHCP  
B) DNS  
C) HTTP  
D) SMTP

**Answer: B) DNS** *(DNS translates domain names to IP addresses; bypassing with IP confirms DNS is the issue)*

---

**Q63.** An employee walks into a secure server room by following an authorized employee through the door without using their own badge. What physical security threat is this?

A) Phishing  
B) Pretexting  
C) Tailgating  
D) Baiting

**Answer: C) Tailgating (Piggybacking)**

---

**Q64.** Which of the following backup strategies requires the MOST time to restore data?

A) Full backup only  
B) Differential backup  
C) Incremental backup  
D) Mirror backup

**Answer: C) Incremental backup**  
*Explanation: Incremental requires the last full backup PLUS every incremental backup made since. Differential only requires the last full + last differential.*

---

**Q65.** What does the principle of "defense in depth" mean in cybersecurity?

A) Using one very strong security control instead of many weak ones  
B) Placing all security measures at the network perimeter  
C) Using multiple layers of overlapping security controls  
D) Defending only the most critical assets

**Answer: C) Using multiple layers of overlapping security controls**

---

## Quick-Fire Answer Key

| Q | A | Q | A | Q | A | Q | A |
|---|---|---|---|---|---|---|---|
| 1 | A | 18 | D | 35 | B | 52 | C |
| 2 | D | 19 | C | 36 | B | 53 | C |
| 3 | B | 20 | B | 37 | B | 54 | D |
| 4 | C | 21 | C | 38 | D | 55 | B |
| 5 | B | 22 | C | 39 | B | 56 | C |
| 6 | D | 23 | C | 40 | C | 57 | B |
| 7 | C | 24 | B | 41 | B | 58 | B |
| 8 | C | 25 | B | 42 | C | 59 | D |
| 9 | C | 26 | D | 43 | C | 60 | C |
| 10 | D | 27 | C | 44 | C | 61 | C |
| 11 | C | 28 | C | 45 | C | 62 | B |
| 12 | C | 29 | C | 46 | C | 63 | C |
| 13 | C | 30 | C | 47 | C | 64 | C |
| 14 | D | 31 | C | 48 | C | 65 | C |
| 15 | B | 32 | C | 49 | B | | |
| 16 | B | 33 | B | 50 | D | | |
| 17 | C | 34 | C | 51 | B | | |

---

# Final Exam Tips

## Day Before the Exam
- Review the CIA Triad, troubleshooting steps, and port numbers — these appear frequently
- Review RAID levels (0, 1, 5, 6, 10)
- Know your binary, hex conversions
- Review the cloud service models (IaaS, PaaS, SaaS)
- Review common malware types and social engineering attacks

## During the Exam
- **Read every question carefully** — look for words like "BEST," "MOST," "LEAST," "EXCEPT," "NOT"
- Eliminate obviously wrong answers first
- Flag uncertain questions and return to them
- Don't leave any question blank — no penalty for guessing
- For performance-based questions, work through them systematically

## Exam Details Recap
- **Exam Code:** FC0-U71
- **Questions:** Up to 70 (multiple-choice)
- **Time:** 60 minutes
- **Passing Score:** 650 out of 900
- **Testing:** Pearson VUE (in-person or online proctored)

## High-Frequency Topics (Studied Extra)
1. **Troubleshooting methodology** — all 7 steps in order
2. **CIA Triad** — definitions and examples
3. **Binary/Hex conversions** — practice until automatic
4. **Common ports** — 22, 25, 53, 80, 443, 3389
5. **RAID levels** — especially RAID 0, 1, 5, 10
6. **Backup types** — full, incremental, differential — and which is fastest/slowest to restore
7. **Cloud models** — IaaS, PaaS, SaaS, and deployment types
8. **Malware types** — ransomware, trojan, worm, rootkit, spyware
9. **Encryption** — AES (symmetric), RSA (asymmetric), hashing
10. **Authentication factors** — know, have, are
11. **DHCP, DNS, IP addressing** — APIPA (169.254.x.x), loopback (127.0.0.1)
12. **Storage types** — HDD vs. SSD vs. NVMe and their speed differences

---

*This study guide covers all CompTIA Tech+ FC0-U71 exam objectives. Good luck on your exam!*