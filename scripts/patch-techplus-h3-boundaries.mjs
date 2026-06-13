/**
 * One-time / template inserts of ### headings before known section title lines.
 * Most chapters are edited directly in chapters/*.md — this script documents batch replacements
 * for chapters 5–9; re-running may warn MISSING if ### already present.
 * After edits: npm run build:techplus && npm run verify:techplus
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const mdDir = path.join(__dirname, "..", "chapters");

/** [filename, [[oldStr, newStr], ...]] — first occurrence replaced per pair */
const PATCHES = [
  [
    "02_Peripherals_and_Connectors.md",
    [
      [
        "Installing and Configuring Audio and\n\nWhile it might be hard to believe",
        "### Installing and Configuring Audio and Video Devices\n\nWhile it might be hard to believe",
      ],
      ["\nAudio Connectors\n", "\n### Audio Connectors\n"],
      ["\nDisplay Devices and Connectors\n", "\n### Display Devices and Connectors\n"],
      ["\nVideo Connectors\n", "\n### Video Connectors\n"],
      ["\nJust How Fast Is It?\n", "\n### Just How Fast Is It?\n"],
      ["\nDisplayPort and Thunderbolt\n", "\n### DisplayPort and Thunderbolt\n"],
      ["\nAdjusting and Configuring Displays\n", "\n### Adjusting and Configuring Displays\n"],
      [
        "Understanding External Storage and\n\nIn this section, you will look at",
        "### Understanding External Storage and Communications\n\nIn this section, you will look at",
      ],
      ["\nTypes of External Storage\n", "\n### Types of External Storage\n"],
      ["\nExternal Optical Drives\n", "\n### External Optical Drives\n"],
      ["\nNetworkAttached Storage\n", "\n### Network-Attached Storage\n"],
      ["\nNetworking Devices and T ools\n", "\n### Networking Devices and Tools\n"],
      ["\nTelephone Connectors\n", "\n### Telephone Connectors\n"],
      [
        "Understanding Input, Output, and\n\nEven though artificial intelligence",
        "### Understanding Input, Output, and Power\n\nEven though artificial intelligence",
      ],
      ["\nPointing Devices\n", "\n### Pointing Devices\n"],
    ],
  ],
  [
    "03_Computing_Devices_and_the_Internet_of_Things.md",
    [
      ["\nServers\nServers come", "\n### Servers\nServers come"],
      ["\nWorkstations\nWorkstations are", "\n### Workstations\nWorkstations are"],
      ["\nIs That a Server or a Workstation?\n", "\n### Is That a Server or a Workstation?\n"],
      [
        "make that determination.\n\nThe original portable computers were hardly portable.",
        "make that determination.\n\n### Laptops and Portable Computers\n\nThe original portable computers were hardly portable.",
      ],
      ["\nLaptop Architecture\n", "\n### Laptop Architecture\n"],
    ],
  ],
  [
    "04_Operating_Systems.md",
    [
      [
        "understand where operating systems came from.\nA Brief History of Operating Systems\n",
        "understand where operating systems came from.\n\n### A Brief History of Operating Systems\n",
      ],
      ["\nStandardization\n", "\n### Standardization\n"],
    ],
  ],
  [
    "05_Software_Applications.md",
    [
      [
        "let’s begin!\nUnderstanding Application Installation\nand Management\n",
        "let’s begin!\n\n### Understanding Application Installation and Management\n",
      ],
      ["\nSoftware Compatibility\n", "\n### Software Compatibility\n"],
      ["\nSoftware Sources\n", "\n### Software Sources\n"],
      ["\nInstalling and Uninstalling Software\n", "\n### Installing and Uninstalling Software\n"],
      ["\nUpdating and Patching Software\n", "\n### Updating and Patching Software\n"],
      ["\nWord Processing Software\n", "\n### Word Processing Software\n"],
      ["\nSpreadsheet Software\n", "\n### Spreadsheet Software\n"],
      ["\nEmail Client Software\n", "\n### Email Client Software\n"],
      ["\nConferencing Software\n", "\n### Conferencing Software\n"],
      ["\nUtility Software\n", "\n### Utility Software\n"],
    ],
  ],
  [
    "06_Software_Development.md",
    [
      ["\nAssembly Language\n", "\n### Assembly Language\n"],
      ["\nCompiled Languages\n", "\n### Compiled Languages\n"],
      ["\nQuery Languages\n", "\n### Query Languages\n"],
      ["\nUnderstanding Programming Concepts\n", "\n### Understanding Programming Concepts\n"],
      ["\nProgramming Logic\n", "\n### Programming Logic\n"],
    ],
  ],
  [
    "07_Database_Fundamentals.md",
    [
      ["\nWhen to Use Databases\n", "\n### When to Use Databases\n"],
    ],
  ],
  [
    "08_Networking_Concepts_and_Technologies.md",
    [
      ["\nChoosing Internal Network Connections\n", "\n### Choosing Internal Network Connections\n"],
      ["\nWired Network Connections\n", "\n### Wired Network Connections\n"],
      ["\nWireless Network Connections\n", "\n### Wireless Network Connections\n"],
      ["\nUnderstanding LANs and WANs\n", "\n### Understanding LANs and WANs\n"],
      ["\nNetworking Protocol Basics\n", "\n### Networking Protocol Basics\n"],
    ],
  ],
  [
    "09_Cloud_Computing_and_Artificial_Intelligence.md",
    [
      [
        "fascinating to watch.\nUnderstanding Virtualization\nand Cloud Computing\n",
        "fascinating to watch.\n\n### Understanding Virtualization and Cloud Computing\n",
      ],
    ],
  ],
  [
    "10_Security_Concepts_and_Threats.md",
    [
      ["\nUnderstanding Security Fundamentals\n", "\n### Understanding Security Fundamentals\n"],
    ],
  ],
  [
    "11_Security_Best_Practices.md",
    [
      ["\nPhysical Security\n", "\n### Physical Security\n"],
    ],
  ],
  [
    "12_Data_Continuity_and_Computer_Support.md",
    [
      ["\nBackup Strategies\n", "\n### Backup Strategies\n"],
    ],
  ],
];

function main() {
  for (const [fname, pairs] of PATCHES) {
    const fp = path.join(mdDir, fname);
    if (!fs.existsSync(fp)) {
      console.warn("Skip missing", fp);
      continue;
    }
    let s = fs.readFileSync(fp, "utf8");
    let n = 0;
    for (const [a, b] of pairs) {
      if (!s.includes(a)) {
        console.warn(fname, "MISSING pattern:", a.slice(0, 60) + "…");
        continue;
      }
      const count = s.split(a).length - 1;
      if (count !== 1) console.warn(fname, "pattern count", count, a.slice(0, 40));
      s = s.replace(a, b);
      n++;
    }
    fs.writeFileSync(fp, s, "utf8");
    console.log(fname, "applied", n, "of", pairs.length);
  }
}

main();
