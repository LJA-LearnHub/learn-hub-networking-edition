/**
 * Emit assets/learn-hub-techplus-flashcards-data.js from FC0-U71 acronym table text.
 * Source rows: "ACRONYM Full name..."
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const outPath = path.join(root, "assets", "learn-hub-techplus-flashcards-data.js");

const raw = `
AI Artificial Intelligence
ARM Advanced RISC Machines
BD-ROM Blu-ray Disc Read-only Memory
BIOS Basic Input/Output System
BPS Bits Per Second
CAD Computer-aided Design
CAM Computer-aided Manufacturing
CAN Controller Area Network
CD Compact Disc
CD-ROM Compact Disc-Read-only Memory
CD-RW Compact Disc-Rewritable
CLI Command-line Interface
CPU Central Processing Unit
DaaS Desktop as a Service
DDR Double Data Rate
DHCP Dynamic Host Configuration Protocol
DIMM Dual Inline Memory Module
DNS Domain Name System
DSL Digital Subscriber Line
DVD Digital Video Disc
DVD-R Digital Video Disc-Recordable
DVD-RW Digital Video Disc-Rewritable
DVI Digital Visual Interface
EMI Electromagnetic Interference
eSATA External Serial Advanced Technology Attachment
ESD Electrostatic Discharge
EULA End User License Agreement
FTP File Transfer Protocol
FTPS FTP over TLS/SSL (secure FTP)
Gb Gigabit
GB Gigabyte
Gbps Gigabit per second
GDPR General Data Protection Regulation
GHz Gigahertz
GPS Global Positioning System
GPU Graphics Processing Unit
GUI Graphical User Interface
HDD Hard Disk Drive
HDMI High-definition Multimedia Interface
HTML Hypertext Markup Language
HTTP Hypertext Transfer Protocol
HTTPS HTTP over TLS/SSL (secure web)
IaaS Infrastructure as a Service
IDE Integrated Development Environment
IMAP Internet Mail Access Protocol
IMAPS Internet Mail Access Protocol Secure
IoT Internet of Things
IP Internet Protocol
IR Infrared
ISP Internet Service Provider
Kb Kilobit
KB Kilobyte
Kbps Kilobit per second
LAN Local Area Network
LTE Long-term Evolution
MAC Media Access Control
MAN Metropolitan Area Network
MB Megabyte
Mb Megabit
Mbps Megabit per second
MHz Megahertz
MP3 MPEG Layer-3 Audio
MP4 MPEG Layer-4 Video
NAS Network Attached Storage
NAT Network Address Translation
NFC Near Field Communications
NIC Network Interface Card
NVMe Non-volatile Memory Express
OEM Original Equipment Manufacturer
OS Operating System
PaaS Platform as a Service
PAN Personal Area Network
PB Petabyte
PC Personal Computer
PCI Peripheral Component Interconnect
PCIe Peripheral Component Interconnect Express
PHI Personal Health Information
PII Personally Identifiable Information
PIN Personal Identification Number
POP Post Office Protocol
POP3 Post Office Protocol 3
POP3S Post Office Protocol 3 Secure
PSU Power Supply Unit
RAM Random-access Memory
RISC Reduced Instruction Set Computer
RF Radio Frequency
RJ Registered Jack
RJ11 Registered Jack Function 11
RJ45 Registered Jack Function 45
ROM Read-only Memory
SaaS Software as a Service
SATA Serial Advanced Technology Attachment
SD card Secure Digital Card
SFP Small Form-factor Pluggable
SFTP Secure File Transfer Protocol
SID System Identifier
SMTP Simple Mail Transfer Protocol
SMTPS Simple Mail Transfer Protocol Secure
SNMP Simple Network Management Protocol
SSD Solid State Drive
SSH Secure Shell
SSID Service Set Identifier
SSL Secure Sockets Layer
TB Terabyte
Tbps Terabits per second
TCP Transmission Control Protocol
TCP/IP Transmission Control Protocol/Internet Protocol
UPS Uninterruptable Power Supply
URL Uniform Resource Locator
USB Universal Serial Bus
USB-A Universal Serial Bus-A
USB-C Universal Serial Bus-C
vCPU Virtual Central Processing Unit
VGA Video Graphics Array
vHDD Virtual Hard Disk Drive
vNIC Virtual Network Interface Card
VoIP Voice over Internet Protocol
VPN Virtual Private Network
VR Virtual Reality
vRAM Virtual Random-access Memory
WAN Wide Area Network
WEP Wired Equivalency Privacy
WLAN Wireless Local Area Network
WPA Wireless Protected Access
WPA2 Wireless Protected Access 2
WPA3 Wireless Protected Access 3
WPAN Wireless Personal Area Network
`;

const cards = [];
for (const line of raw.split("\n")) {
  const t = line.trim();
  if (!t) continue;
  const sp = t.indexOf(" ");
  if (sp < 1) continue;
  const term = t.slice(0, sp).trim();
  const answer = t.slice(sp + 1).trim();
  if (!term || !answer) continue;
  cards.push({ id: term.replace(/[^a-zA-Z0-9]+/g, "-").toLowerCase() + "-" + cards.length, term, answer });
}

const body =
  "/* Tech+ FC0-U71 style term deck (official acronym list). Replace or extend in source: scripts/emit-techplus-flashcards-data.mjs */\n" +
  "window.LEARN_HUB_TECHPLUS_FLASHCARDS = " +
  JSON.stringify(cards, null, 2) +
  ";\n";

fs.writeFileSync(outPath, body, "utf8");
console.log("Wrote", cards.length, "cards to", outPath);
