import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const coursesPath = path.join(root, "assets", "learn-hub-courses.js");
const deepPath = path.join(root, "assets", "learn-hub-deep.js");

function parseWindowAssign(src, varName) {
  return JSON.parse(
    src
      .replace(new RegExp(`^\\s*window\\.${varName}\\s*=\\s*`), "")
      .replace(/;\s*$/, "")
  );
}

function toLessonId(courseId, idx) {
  return `${courseId}-fccr-${String(idx).padStart(2, "0")}`;
}

const TRACK_TOPICS = {
  html: [
    "Basic HTML Review",
    "Semantic HTML Review",
    "HTML Tables and Forms Review",
    "HTML Accessibility Review",
    "HTML Review",
    "Computer Basics Review",
  ],
  css: [
    "CSS Fundamentals Review",
    "Lists, Links, Background and Borders Review",
    "Design Fundamentals Review",
    "CSS Relative and Absolute Units Review",
    "CSS Pseudo-classes Review",
    "CSS Colors Review",
    "Styling Forms Review",
    "CSS Layouts and Effects Review",
    "CSS Flexbox Review",
    "CSS Typography Review",
    "CSS Accessibility Review",
    "CSS Positioning Review",
    "CSS Attribute Selectors Review",
    "Responsive Web Design Review",
    "CSS Variables Review",
    "CSS Grid Review",
    "CSS Animations Review",
    "CSS Review",
  ],
  js: [
    "JavaScript Variables and Data Types Review",
    "JavaScript Strings Review",
    "JavaScript Math Review",
    "JavaScript Comparisons and Conditionals Review",
    "JavaScript Functions Review",
    "JavaScript Arrays Review",
    "JavaScript Objects Review",
    "JavaScript Loops Review",
    "JavaScript Fundamentals Review",
    "JavaScript Higher Order Functions Review",
    "DOM Manipulation and Click Events with JavaScript Review",
    "JavaScript and Accessibility Review",
    "Debugging JavaScript Review",
    "JavaScript Regular Expressions Review",
    "Form Validation with JavaScript Review",
    "JavaScript Dates Review",
    "JavaScript Audio and Video Review",
    "JavaScript Maps and Sets Review",
    "Local Storage and CRUD Review",
    "JavaScript Classes Review",
    "Recursion Review",
    "Data Structures Review",
    "Searching and Sorting Algorithms Review",
    "Review Graphs and Trees",
    "Dynamic Programming Review",
    "JavaScript Functional Programming Review",
    "Asynchronous JavaScript Review",
    "JavaScript Review",
    "React Basics Review",
    "React State and Hooks Review",
    "React Forms, Data Fetching and Routing Review",
    "Web Performance Review",
    "Testing Review",
    "CSS Libraries and Frameworks Review",
    "Typescript Review",
    "Front-End Libraries Review",
    "NodeJs Intro Review",
    "Node.js Core Modules Review",
    "NPM Review",
  ],
  py: [
    "Python Basics Review",
    "Loops and Sequences Review",
    "Dictionaries and Sets Review",
    "Error Handling Review",
    "Classes and Objects Review",
    "Object Oriented Programming Review",
    "Data Structures Review",
    "Searching and Sorting Algorithms Review",
    "Graphs and Trees Review",
    "Dynamic Programming Review",
    "Python Review",
  ],
  sql: [
    "Bash Commands Review",
    "SQL and PostgreSQL Review",
    "Bash Scripting Review",
    "Bash and SQL Review",
    "Git Review",
    "Relational Databases Review",
  ],
};

const coursesSrc = fs.readFileSync(coursesPath, "utf8");
const courses = parseWindowAssign(coursesSrc, "LEARN_HUB_COURSES");
const deepSrc = fs.readFileSync(deepPath, "utf8");
const deep = parseWindowAssign(deepSrc, "LEARN_HUB_DEEP");

let addedTotal = 0;

for (const course of courses) {
  const topics = TRACK_TOPICS[course.id];
  if (!topics || !Array.isArray(course.lessons)) continue;

  const existingIds = new Set(course.lessons.map((l) => l.id));
  const existingTitles = new Set(course.lessons.map((l) => l.title));
  let trackAdded = 0;

  for (const topic of topics) {
    if (existingTitles.has(topic)) continue;

    const nextIndex = trackAdded + 1;
    let lessonId = toLessonId(course.id, nextIndex);
    while (existingIds.has(lessonId)) {
      lessonId = toLessonId(course.id, Number(lessonId.slice(-2)) + 1);
    }

    const lesson = {
      unit: "freeCodeCamp Review Pages",
      id: lessonId,
      kind: "learn",
      title: topic,
      narrative: "",
    };

    course.lessons.push(lesson);
    existingIds.add(lessonId);
    existingTitles.add(topic);
    trackAdded += 1;
    addedTotal += 1;

    deep[lessonId] = `<p class="msg info"><strong>freeCodeCamp review import:</strong> This lesson was merged from Naomi's freeCodeCamp Review PDF topic list.</p>
<h3>${topic}</h3>
<p>Use this as a guided review checkpoint for the corresponding module. Read through your notes, recreate a quick example from memory, and then practice in the workspace before continuing.</p>
<ul>
  <li>Summarize the core concepts in 3-5 bullet points.</li>
  <li>Build one small example that demonstrates the topic.</li>
  <li>Write one common mistake and how to avoid it.</li>
</ul>
<p><em>Source:</em> <code>fcc-review-pages.pdf</code> (added on merge).</p>`;
  }
}

fs.writeFileSync(
  coursesPath,
  `window.LEARN_HUB_COURSES = ${JSON.stringify(courses)};\n`,
  "utf8"
);

fs.writeFileSync(
  deepPath,
  `window.LEARN_HUB_DEEP = ${JSON.stringify(deep, null, 2)};\n`,
  "utf8"
);

console.log(`Added ${addedTotal} review lessons across existing tracks.`);
