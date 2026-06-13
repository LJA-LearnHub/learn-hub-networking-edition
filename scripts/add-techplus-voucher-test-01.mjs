import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const bundlePath = path.join(root, "assets", "learn-hub-gimkit-questions.js");

const voucherSet = {
  id: "tech-voucher-test-01",
  title: "Tech+ Voucher Test 01",
  source: "Tech+ Voucher 01 Exam Questions 20260415 _ Wayground.pdf",
  questions: [
    { q: "What do we call a computer that is designed to provide services to client computers and is built using more robust, powerful components?", choices: ["Server", "Desktop", "Workstation", "Tablet"], correct: 0 },
    { q: "The basic (and smallest) unit of computer information is the bit (binary digit). Memory and file sizes are commonly measured in multiples of bits. What is the first multiple of a bit called?", choices: ["Kbps", "Kilobyte", "Byte", "Decimal"], correct: 2 },
    { q: "Pat has purchased a new piece of design software. After installing the software, she realizes that it's not performing as expected. After an internet search, she finds out that her video card's graphics microchip needs to be updated. What is the software embedded in a microchip called?", choices: ["GUI", "Firmware", "Software", "Ladder"], correct: 1 },
    { q: "Tyler, a software developer, is creating a program written in Java to calculate loan payments. Which language type BEST describes Java?", choices: ["Compiled", "Markup", "Scripting", "Interpreted"], correct: 0 },
    { q: "Which of the following statements BEST describes a firewall?", choices: ["A firewall restricts the flow of data between hosts and networks by checking data packets to make sure they are safe.", "A firewall filters data packets between a computer and the internet.", "A firewall blocks all traffic between computers and networks.", "A firewall is a peripheral device attached to your computer that restricts the flow of data between the computer and a network."], correct: 1 },
    { q: "A programmer is developing a program that will list the order history for a customer. Which of the following data structures is the BEST one to use?", choices: ["Function", "Array", "Constant", "Variable"], correct: 1 },
    { q: "Which of the following provides a computer system with the ability to retrieve and manipulate data at a future time?", choices: ["Storage", "Processing", "Microchip", "Transistor"], correct: 0 },
    { q: "A consumer wants to add a hard drive to their computer to store video from their camera. Which of the following is the storage capacity of a modern hard disk drive (HDD) purchased from a computer store?", choices: ["4 gigabytes", "1,024 kilobytes", "8 megabytes", "3 terabytes"], correct: 3 },
    { q: "Which of the following access controls gives only backup administrators access to all servers on the network?", choices: ["Authorization", "Discretionary", "Role-based", "Mandatory"], correct: 2 },
    { q: "You are helping a client connect their new Blu-ray player to their 4K projector. Which of the following cables would you MOST likely use?", choices: ["DisplayPort", "HDMI", "Thunderbolt", "DVI"], correct: 1 },
    { q: "Which of the following is the best definition of a bit?", choices: ["A measure of computer graphics and sound", "An electrical signal in a wire", "A physical signal that becomes a digital signal", "A single 1 or 0 in a digital signal"], correct: 3 },
    { q: "Becca is working on a program that will store data. The program will need quick access to data and data persistence is not important. Where should the data be stored?", choices: ["RAM", "HDD", "In a flat file", "On a server"], correct: 0 },
    { q: "Which of the following should NOT be used as a primary key in a table?", choices: ["Employee ID", "Social Security number", "Username", "First name"], correct: 3 },
    { q: "A technician is tasked to configure a mobile device to connect securely to the company network when the device is used at offsite locations where only internet connectivity is available. Which of the following should the technician configure?", choices: ["VPN", "Hotspot", "IMAP", "Bluetooth"], correct: 0 },
    { q: "Designations at the end of file names such as .docx and .html are called _____________.", choices: ["File permissions", "File properties", "File domains", "File extensions"], correct: 3 },
    { q: "Which of the following are examples of input devices? (Select two.)", choices: ["Projectors", "Speakers", "Keyboards", "Monitors", "Touch Screens"], correct: [2, 4] },
    { q: "Which of the following is not an advantage of SSDs over HDDs?", choices: ["Small and light", "Low power consumption", "Durable", "Inexpensive"], correct: 3 },
    { q: "Lorraine, a user, connects a new mouse to a laptop, and the mouse works with no additional steps taken. Which of the following installation types does this BEST describe?", choices: ["Plug-and-play", "Web based", "Manual", "Hot-swappable"], correct: 0 },
    { q: "A systems engineer wants to encrypt a hard drive that contains critical data. Which type of data encryption can be used to protect the data on the hard drive?", choices: ["HTTPS", "WPA2 encryption", "SSL/TLS encryption", "Whole disk encryption"], correct: 3 },
    { q: "In a relational database table, columns are better known as ________________.", choices: ["Instances", "Records", "Fields", "Categories"], correct: 2 },
    { q: "Which of the following are basic architectural components of a relational database? (Select three.)", choices: ["Tables", "Fields", "Records", "Constraints", "XML"], correct: [0, 1, 2] },
    { q: "Which of the following are reasons you would use a database to manage your data? (Select two.)", choices: ["Generate data reports.", "Edit media files.", "Store data securely.", "Protect data against social engineering threats.", "Provide a productivity software solution."], correct: [0, 2] },
    { q: "Which option should you use to respond to the sender of an email but not all the recipients?", choices: ["CC", "Reply", "Forward", "Reply All"], correct: 1 },
    { q: "Hans is programming a device driver that will interact directly with hardware. The language he's using is considered the most difficult human-readable language. Which of the following languages is he utilizing?", choices: ["Compiled", "Assembly", "Letitgo", "Interpreted"], correct: 1 },
    { q: "Which of the following describes the firmware in gaming consoles, TVs, and smart cars?", choices: ["Graphical User Interface", "Device management", "Embedded OS", "Access control"], correct: 2 },
    { q: "A technician walks into the office with a UPS. What sort of threat will this device prepare a system for?", choices: ["Wiretapping", "Power outage", "Denial-of-service", "Data redundancy"], correct: 1 },
    { q: "One option that a computer has for the information gathered in data processing is to return information to the user. Which of the following BEST describes this process?", choices: ["Speaker", "Output", "Peripheral device", "Input"], correct: 1 },
    { q: "A system administrator wants to encrypt selected data on a hard drive that contains sensitive information. Which of the following data encryption types can the administrator use?", choices: ["Whole disk encryption", "File-level encryption", "HTTPS", "SSL/TLS encryption"], correct: 1 },
    { q: "What is the name of the large background area of the Windows environment that holds icons for files, folders, and applications?", choices: ["Home Screen", "Window", "Background", "Desktop"], correct: 3 },
    { q: "Alan, a programmer, needs to create an interactive web page. Which of the following programming languages types would he MOST likely use?", choices: ["Interpreted", "Compiled", "Assembly", "Query"], correct: 0 },
    { q: "After running the following pseudocode, what will the value of VARIABLE be? Set value of VARIABLE to 5. Increase the value of VARIABLE by 3. If the value of VARIABLE is odd, increase its value by 1. If the value of VARIABLE is even, increase its value by 1. If the value of VARIABLE is odd, increase its value by 1.", choices: ["8", "9", "10", "11"], correct: 2 },
    { q: "A NOT NULL __________ is a rule that prevents certain fields in a database from being left blank.", choices: ["schema", "query builder", "scalability", "constraint"], correct: 3 },
    { q: "A value that's used to identify a record from a linked table is called a ________________.", choices: ["Linked Key", "Foreign Key", "Borrowed Key", "Primary Key"], correct: 1 },
    { q: "Disk cleaners, antivirus software, backup tools, and file compressors are which kind of system software?", choices: ["Operating System", "Utility Software", "Firmware", "Device Drivers"], correct: 1 },
    { q: "Which of the following is the BEST place to find software updates?", choices: ["Cloud-based software subscription sites", "Web app sites", "Third-party websites", "Original equipment manufacturer (OEM) websites"], correct: 3 },
    { q: "Even if you perform regular backups, what must be done to ensure that you are protected against data loss?", choices: ["Configure System Maintenance to automatically defragment system hard drives every night.", "Restrict restoration privileges to system administrators.", "Regularly test restoration procedures.", "Write-protect all backup media."], correct: 2 },
    { q: "A systems engineer is maintaining a large network. A critical financial application service is down, and the issue has been escalated to the engineer. They've discovered that the network server hard disk from which the service is running has failed. Which of the following would help the systems engineer make sure that this is not an issue in the future?", choices: ["Data redundancy", "Site redundancy", "Network redundancy", "Power redundancy"], correct: 0 },
    { q: "Which of the following is the first thing you should do in the troubleshooting process when trying to identify possible causes of a problem?", choices: ["Divide and conquer to find a possible cause.", "Test your theories to verify the cause of the problem.", "Check with others to see if they can duplicate the problem.", "Check for obvious or common issues."], correct: 3 },
    { q: "Microsoft Office 365 and Google G Suite are examples of what type of internet service?", choices: ["Cloud-based collaborative applications", "Always-on applications", "Cloud storage", "Network attached storage solution"], correct: 0 },
    { q: "Which of the following database objects provides a summary of data?", choices: ["Forms", "Tables", "Reports", "Queries"], correct: 2 },
    { q: "Martin is working on a programming function that takes input and displays a message based on which input the user enters. The input is the primary colors, red, blue, or green. Which is the BEST programming construct to use?", choices: ["Variable", "If", "Constaint", "Object"], correct: 1 },
    { q: "A software developer is working on a website and has been tasked with adding interactive elements to it. Which of the following programming languages would work BEST for this task?", choices: ["JavaScript", "C++", "HTML", "CSS"], correct: 0 },
    { q: "Which of the following tools would you use to check connectivity between two computers?", choices: ["DHCP", "TCP/IP", "Tracert", "Ping"], correct: 3 },
    { q: "Besides logging computer and network events in a file, which of the following is another non-repudiation method?", choices: ["Signatures", "Single sign-on", "Hardware tokens", "Discretionary access control"], correct: 0 },
    { q: "Gloria is concerned that her online banking transactions could be intercepted if she uses public WiFi. Which of the following could she use to prevent access to her online transactions?", choices: ["Single-sign on", "Multifactor authentication", "VPN", "Mandatory Access Control (MAC)"], correct: 2 },
    { q: "Which kind of system software is preinstalled on electronic products like blenders, automobiles, and televisions?", choices: ["Device Drivers", "Firmware", "Utility Software", "Operating System"], correct: 1 },
    { q: "When Jacob first starts his computer, he hears several warning beeps and nothing else happens. Which of the following is sending out the beeps?", choices: ["Operating system (OS)", "Power-On-Self-Test", "Power Source", "Heat Sink"], correct: 1 },
    { q: "What common method do file systems use to keep track of which users can read, write, move, or delete a file or folder?", choices: ["Naming Rules", "File Sharing", "Access Control List", "File Formats"], correct: 2 },
    { q: "One of the most important components of a computer is storage. What are the two terms we use for a short-term and long-term storage location? (Select two.)", choices: ["Volatile storage", "The cloud", "Flash", "Cache", "Non-Volatile storage"], correct: [0, 4] },
    { q: "Which of the following is a firewall function?", choices: ["Protocol converting", "Encrypting", "Packet Filtering", "FTP hosting", "Packet rearranging"], correct: 2 },
    { q: "A software developer is creating a variable to hold whole numbers and will perform numeric operations on the values stored in that variable. Which of the following data types is the BEST for this purpose?", choices: ["String", "Boolean", "Integer", "Float"], correct: 2 },
    { q: "Which kind of connector do you use to connect a modem to a standard telephone line?", choices: ["F-type", "RG-58", "RJ-45", "RJ-11"], correct: 3 },
    { q: "What is the term for software that anyone can use or modify for free?", choices: ["Linux software", "Read-write software", "Open-source software", "Proprietary software"], correct: 2 },
    { q: "Which of the following Application Architecture Model tiers describes office productivity software?", choices: ["n-Tier", "One tier", "Two tier", "Three tier"], correct: 1 },
    { q: "Which of the following BEST describes computer data processing?", choices: ["Data is saved to a hard disk", "A document is scanned by the user", "A graphic image is displayed on the screen", "Data in memory is converted to information"], correct: 3 },
    { q: "Jacob is working with his team to upgrade user security on the company network. One concern is compromising several employee services and websites at the same time. Which authentication type could potentially cause this issue?", choices: ["Multifactor authentication", "Type 3 authentication", "Single sign-on", "Type 2 authentication"], correct: 2 },
    { q: "When working with an application to generate graphical reports, which of the following chart types would work BEST for data that changes over time at intervals?", choices: ["Excel table", "Line graph", "Pie chart", "Bar chart"], correct: 1 },
    { q: "What is the first step of the data analytics process?", choices: ["Generating information", "Creating a data report", "Collecting raw data", "Using statistical tools to analyze data"], correct: 2 },
    { q: "Which of the following is composed of a file's name, date created, size, attributes, and who can access it?", choices: ["Partition system", "File attributes and permissions", "Access control", "File system"], correct: 1 },
    { q: "Which of the following is not a form of biometrics?", choices: ["Retina scan", "Face recognition", "Fingerprint", "Smart card"], correct: 3 },
    { q: "Which of the following are examples of non-repudiation implementation? (Select two.)", choices: ["Single sign-on", "Mandatory access control", "Multifactor authentication", "Biometrics", "Surveillance cameras"], correct: [3, 4] },
    { q: "Which of the following best describes the Software as a Service (SaaS) model?", choices: ["A model where users install software on their local devices for one-time use.", "A licensing model where software is purchased and owned permanently.", "A cloud-based model where software is accessed via the internet and typically paid for by subscription.", "A deployment model where software is built and maintained entirely on a local server."], correct: 2 },
    { q: "Using HTML and CSS to provide visual elements to the end user would be considered part of a website's _____________.", choices: ["Frontend", "Protocols", "Backend", "Full Stack"], correct: 0 },
    { q: "A company needs a customer-facing tool that can answer common questions automatically by pulling from a linked knowledge base. Which AI technology best fits this need?", choices: ["Generative AI", "AI chatbots", "Predictive AI", "AI assistants"], correct: 1 },
    { q: "Gladys has a high-speed fiber optic internet connection in her office. What unit of measure would likely be used to describe its throughput?", choices: ["GHz per second", "Gbps", "Kbps", "TB per second"], correct: 1 },
    { q: "Which of these is an Internet of Things (IoT) device?", choices: ["Video Doorbell", "Tablet", "Workstation", "Augmented Reality headset"], correct: 0 },
    { q: "Inga wants to run both Windows and Linux on one desktop simultaneously and switch quickly. What technology enables this?", choices: ["NFC", "Virtualization", "IaaS", "Mirroring"], correct: 1 },
    { q: "Benjamin's NIC has a MAC address of 00:25:9C:4D:5A:6B. What number system is being used?", choices: ["Binary", "Decimal", "Octal", "Hexadecimal"], correct: 3 },
    { q: "All internal components in a computer connect physically to one central component:", choices: ["CPU", "Memory", "Motherboard", "SSD"], correct: 2 },
    { q: "Which of these is an example of predictive AI?", choices: ["Identifying unusual consumer spending.", "Generating a video of a crime.", "A chatbot resolving a bill.", "An assistant making a flight reservation."], correct: 0 },
    { q: "In the context of operating systems, which of these is the best definition of a service?", choices: ["A program that runs in the background", "A program the user interacts with directly.", "A program that runs only during startup.", "A program that accesses the internet."], correct: 0 },
    { q: "Arthur wants to ensure his smartphone photos are never lost. Privacy is secondary. What is the best medium?", choices: ["USB flash drive", "SD Card", "Cloud", "External HDD"], correct: 2 },
    { q: "Which of these is the best definition of social engineering?", choices: ["Stealing passwords from a database.", "Eavesdropping on connections.", "Attempting to convince a person to take actions that benefit an attacker.", "Stealing credit card info."], correct: 2 },
    { q: "Xander wants to make his Wi-Fi router as secure as possible. What can he do?", choices: ["Use 5 GHz.", "Enable WPA.", "Hide the WPA.", "Hide the SSID."], correct: 1 },
    { q: "After running the following pseudocode, what will the final value of COUNTER be? Set COUNTER to 0. FOR EACH i FROM 1 TO 3. FOR EACH j FROM 1 TO 2. Set COUNTER to COUNTER + 1. END FOR. END FOR.", choices: ["9", "5", "6", "3"], correct: 2 },
  ],
};

const raw = fs.readFileSync(bundlePath, "utf8");
const stripped = raw
  .replace(/^\/\*[\s\S]*?\*\/\s*/, "")
  .replace(/^\s*window\.LEARN_HUB_GIMKIT_QUIZZES\s*=\s*/, "")
  .replace(/;\s*$/, "");
const data = JSON.parse(stripped);

if (!data.sets || !Array.isArray(data.sets)) data.sets = [];
const existingIndex = data.sets.findIndex((set) => set && set.id === voucherSet.id);
if (existingIndex >= 0) data.sets[existingIndex] = voucherSet;
else data.sets.push(voucherSet);

const banner = "/* Auto-generated by scripts/build-gimkit-questions.mjs */\n";
fs.writeFileSync(bundlePath, banner + "window.LEARN_HUB_GIMKIT_QUIZZES = " + JSON.stringify(data, null, 2) + ";\n", "utf8");

console.log("Tech+ Voucher Test 01 added/updated with", voucherSet.questions.length, "questions.");
