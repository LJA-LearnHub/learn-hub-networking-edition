/**
 * Restores assets/learn-hub-courses.js from backup/learn-hub-courses.js
 * and appends the Network+ track if missing.
 * Run from repo root: node scripts/restore-courses-and-add-networkplus.mjs
 */
import fs from "fs";
import path from "path";
import vm from "vm";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const backupPath = path.resolve(root, "..", "backup", "learn-hub-courses.js");
const destPath = path.join(root, "assets", "learn-hub-courses.js");

function loadCourses(filePath) {
  const s = fs.readFileSync(filePath, "utf8");
  const ctx = { window: {} };
  vm.createContext(ctx);
  vm.runInContext(s, ctx);
  const C = ctx.window.LEARN_HUB_COURSES;
  if (!Array.isArray(C)) throw new Error("Not an array: " + filePath);
  return C;
}

const networkCourse = {
  id: "networkplus",
  name: "Network+",
  ws: "tech",
  lessons: [
    {
      unit: "Domain 1: Networking Concepts",
      id: "network-l01-01",
      kind: "learn",
      title: "Network models and protocols",
      narrative: "",
    },
    {
      unit: "Domain 1: Networking Concepts",
      id: "network-l01-02",
      kind: "learn",
      title: "Ports, addressing, and segmentation",
      narrative: "",
    },
    {
      unit: "Domain 2: Network Implementations",
      id: "network-l02-01",
      kind: "learn",
      title: "Switching, routing, and wireless design",
      narrative: "",
    },
    {
      unit: "Domain 3: Network Operations",
      id: "network-l03-01",
      kind: "learn",
      title: "Monitoring, documentation, and resiliency",
      narrative: "",
    },
    {
      unit: "Domain 4: Network Security",
      id: "network-l04-01",
      kind: "learn",
      title: "Network hardening and access control",
      narrative: "",
    },
    {
      unit: "Domain 5: Troubleshooting",
      id: "network-l05-01",
      kind: "learn",
      title: "Troubleshooting methodology and tool usage",
      narrative: "",
    },
  ],
};

if (!fs.existsSync(backupPath)) {
  console.error("Missing backup:", backupPath);
  process.exit(1);
}

const courses = loadCourses(backupPath);
const existingIds = new Set(courses.map((c) => c.id));
if (existingIds.has("networkplus")) {
  console.log("networkplus already present; writing backup-only restore.");
} else {
  courses.push(networkCourse);
}

fs.writeFileSync(destPath, "window.LEARN_HUB_COURSES = " + JSON.stringify(courses) + ";\n", "utf8");
console.log("Wrote", destPath, "courses:", courses.length);
