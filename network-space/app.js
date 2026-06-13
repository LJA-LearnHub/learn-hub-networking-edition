(function () {
  const D = window.NETPLUS_SUMMER;
  if (!D) return;

  const FLASH = [
    { cat: "week1", q: "What are the 7 OSI layers (bottom to top)?", a: "Physical, Data Link, Network, Transport, Session, Presentation, Application." },
    { cat: "week1", q: "Which OSI layer handles logical addressing and routing?", a: "Layer 3 — Network. Routers operate here using IP addresses." },
    { cat: "week1", q: "Star vs mesh topology — key difference?", a: "Star: all devices connect to a central switch/AP. Mesh: devices interconnect with multiple paths (high redundancy)." },
    { cat: "week2", q: "What is CIDR /24 in host terms?", a: "Subnet mask 255.255.255.0 — 256 addresses total, 254 usable hosts (minus network and broadcast)." },
    { cat: "week2", q: "Private IPv4 ranges (RFC 1918)?", a: "10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16 — not routed on the public Internet." },
    { cat: "week2", q: "TCP vs UDP — when prefer UDP?", a: "Low-latency, tolerant of loss: VoIP, live streaming, DNS queries (often)." },
    { cat: "week3", q: "Switch vs router — primary difference?", a: "Switch: Layer 2, forwards by MAC within a LAN. Router: Layer 3, forwards by IP between networks." },
    { cat: "week3", q: "What is a collision domain?", a: "Network segment where a collision can occur — hubs share one; each switch port is typically its own." },
    { cat: "week4", q: "Purpose of VLANs?", a: "Logical segmentation: limit broadcasts, improve security, organize departments without new physical switches." },
    { cat: "week4", q: "802.1Q trunk — what does it do?", a: "Tags frames with VLAN ID so multiple VLANs can cross one physical link between switches/routers." },
    { cat: "week4", q: "Why is STP used?", a: "Prevents Layer 2 loops in redundant switched topologies by blocking redundant paths." },
    { cat: "week5", q: "Static route use case?", a: "Small/stable networks, default routes to ISP, stub networks — predictable paths without routing protocol overhead." },
    { cat: "week5", q: "RIP metric?", a: "Hop count — max 15 hops (16 is unreachable)." },
    { cat: "week5", q: "OSPF type?", a: "Link-state interior gateway protocol — uses areas and SPF for best paths." },
    { cat: "week6", q: "DHCP DORA process?", a: "Discover, Offer, Request, Acknowledge — client obtains IP, mask, gateway, DNS automatically." },
    { cat: "week6", q: "DNS A record?", a: "Maps a hostname to an IPv4 address." },
    { cat: "week6", q: "PAT vs static NAT?", a: "PAT (overload): many internal hosts share one public IP using different ports. Static NAT: one-to-one fixed mapping." },
    { cat: "week7", q: "CIA triad?", a: "Confidentiality, Integrity, Availability — foundation of information security." },
    { cat: "week7", q: "Standard vs extended ACL?", a: "Standard: filter by source IP only (1–99, 1300–1999). Extended: source, destination, protocol, port (100–199, 2000–2699)." },
    { cat: "week7", q: "IDS vs IPS?", a: "IDS detects and alerts. IPS can detect and block inline." },
    { cat: "week8", q: "WPA3 improvement over WPA2?", a: "Stronger encryption (SAE), better protection against offline dictionary attacks on PSK networks." },
    { cat: "week8", q: "IaaS vs SaaS example?", a: "IaaS: rent VMs/storage (AWS EC2). SaaS: use application over browser (Microsoft 365)." },
    { cat: "week9", q: "First step when same-subnet works but Internet fails?", a: "Check default gateway, then DNS — often gateway or external DNS misconfiguration." },
    { cat: "week9", q: "ping vs traceroute?", a: "ping: reachability/latency to one host. traceroute: path and per-hop delay." },
    { cat: "week10", q: "N10-009 highest-weight domains?", a: "Networking Concepts 23% and Network Troubleshooting 21% — but study all five domains." },
  ];

  const QUIZ = [
    { topic: "OSI", q: "At which layer does a router primarily operate?", options: ["Layer 2", "Layer 3", "Layer 4", "Layer 7"], correct: 1, explanation: "Routers forward packets using IP addresses — Network layer (Layer 3)." },
    { topic: "Addressing", q: "Which is a private IPv4 address?", options: ["8.8.8.8", "172.16.50.10", "203.0.113.5", "198.51.100.1"], correct: 1, explanation: "172.16.0.0/12 is RFC 1918 private space." },
    { topic: "Subnetting", q: "How many usable hosts in a /26 network?", options: ["30", "62", "64", "126"], correct: 1, explanation: "/26 = 64 addresses minus network and broadcast = 62 usable hosts." },
    { topic: "Switching", q: "A switch reduces collision domains by:", options: ["Using IP addresses", "Creating separate collision domains per port", "Broadcasting all frames", "Replacing routers"], correct: 1, explanation: "Each switch port is typically its own collision domain in full-duplex Ethernet." },
    { topic: "VLANs", q: "IEEE 802.1Q is used for:", options: ["Wireless encryption", "VLAN tagging on trunks", "NAT overload", "DHCP discovery"], correct: 1, explanation: "802.1Q inserts a VLAN tag in Ethernet frames on trunk links." },
    { topic: "STP", q: "Spanning Tree Protocol prevents:", options: ["IP conflicts", "Layer 2 loops", "DNS failures", "DHCP exhaustion"], correct: 1, explanation: "STP blocks redundant switch paths that would cause broadcast storms." },
    { topic: "Routing", q: "OSPF is an example of a:", options: ["Distance-vector protocol", "Link-state protocol", "Path-vector protocol", "Gateway protocol"], correct: 1, explanation: "OSPF builds a link-state database and runs SPF." },
    { topic: "Services", q: "Which port does DNS typically use?", options: ["53", "67", "123", "161"], correct: 0, explanation: "DNS uses UDP/TCP port 53." },
    { topic: "NAT", q: "PAT allows:", options: ["One public IP for many internal hosts", "Only static one-to-one mappings", "IPv6-only communication", "No port translation"], correct: 0, explanation: "Port Address Translation (overload) maps many internal addresses to one public IP using different ports." },
    { topic: "Security", q: "Implicit deny in ACLs means:", options: ["All traffic allowed by default", "Only explicitly permitted traffic is allowed", "ACLs are disabled", "Logs are off"], correct: 1, explanation: "If no line matches, traffic is denied — secure default." },
    { topic: "Wireless", q: "802.11ax is also known as:", options: ["Wi-Fi 4", "Wi-Fi 5", "Wi-Fi 6", "Wi-Fi 3"], correct: 2, explanation: "802.11ax = Wi-Fi 6, supporting 2.4, 5, and 6 GHz in capable gear." },
    { topic: "Cloud", q: "Renting virtual machines from a provider is:", options: ["SaaS", "PaaS", "IaaS", "FaaS only"], correct: 2, explanation: "Infrastructure as a Service — you manage OS and above on rented VMs." },
    { topic: "Troubleshooting", q: "Duplex mismatch often causes:", options: ["Instant link down", "Errors and poor performance", "DNS failure only", "STP root change"], correct: 1, explanation: "Half vs full duplex on a link leads to collisions/errors and sluggish throughput." },
    { topic: "Tools", q: "traceroute is most useful for:", options: ["Resolving hostnames", "Showing each hop to a destination", "Listing open TCP ports", "Testing cable continuity"], correct: 1, explanation: "Traceroute maps the path through routers toward the target." },
    { topic: "Exam", q: "CompTIA Network+ exam code covered by this course:", options: ["N10-007", "N10-008", "N10-009", "SY0-701"], correct: 2, explanation: "This summer plan aligns with N10-009." },
  ];

  let flashList = FLASH.slice();
  let flashIdx = 0;
  let flashSeen = new Set();
  let flashFilter = "all";
  let quizIdx = 0;
  let quizScore = 0;
  let quizAnswered = 0;

  function esc(s) {
    const el = document.createElement("span");
    el.textContent = s;
    return el.innerHTML;
  }

  function buildSidebar() {
    const nav = document.getElementById("sidebar");
    let html = `
      <div class="nav-section-label">Getting Started</div>
      <div class="nav-item active" data-section="home"><span class="nav-icon">🏠</span> Overview <span class="progress-dot"></span></div>
      <div class="nav-item" data-section="schedule"><span class="nav-icon">📅</span> 10-Week Schedule <span class="progress-dot"></span></div>
      <div class="nav-item" data-section="domains"><span class="nav-icon">📊</span> Exam Domains <span class="progress-dot"></span></div>
      <div class="nav-section-label">Weekly Lessons</div>`;
    D.weeks.forEach((w, i) => {
      html += `<div class="nav-item" data-section="${w.id}"><span class="nav-icon">${w.icon}</span> Week ${i + 1} <span class="progress-dot"></span></div>`;
    });
    html += `
      <div class="nav-section-label">Practice & Tools</div>
      <div class="nav-item" data-section="grading"><span class="nav-icon">📝</span> Assessment <span class="progress-dot"></span></div>
      <div class="nav-item" data-section="flashcards"><span class="nav-icon">🃏</span> Flashcards <span class="progress-dot"></span></div>
      <div class="nav-item" data-section="quiz"><span class="nav-icon">✏️</span> Practice Quiz <span class="progress-dot"></span></div>
      <div class="nav-item" data-section="n10-exam-questions"><span class="nav-icon">📋</span> N10-009 Question Bank <span class="progress-dot"></span></div>
      <div class="nav-item" data-section="resources"><span class="nav-icon">📚</span> Resources <span class="progress-dot"></span></div>
      <div class="nav-item" data-section="pt-tips"><span class="nav-icon">🖥️</span> Packet Tracer Tips <span class="progress-dot"></span></div>
      <div style="padding:16px 20px 8px;border-top:1px solid var(--border);margin-top:12px;">
        <a href="../index.html" style="font-size:0.8rem;color:var(--text3);text-decoration:none;">← Back to Learn Hub</a>
      </div>`;
    nav.innerHTML = html;
    nav.querySelectorAll(".nav-item[data-section]").forEach((el) => {
      el.addEventListener("click", () => showSection(el.dataset.section));
    });
  }

  function weekCardClass(i) {
    const classes = ["", "purple", "amber", "green", "teal", "red", "pink", "purple", "amber", "green", "teal"];
    return classes[i % classes.length];
  }

  function buildHome() {
    const grid = document.getElementById("home-grid");
    grid.innerHTML = D.weeks
      .map(
        (w, i) => `
      <div class="home-card ${weekCardClass(i)}" data-goto="${w.id}">
        <div class="home-card-icon">${w.icon}</div>
        <h3>Week ${i + 1}: ${esc(w.title)}</h3>
        <p>${esc(w.tagline)}</p>
      </div>`
      )
      .join("");
    grid.querySelectorAll("[data-goto]").forEach((c) => {
      c.addEventListener("click", () => showSection(c.dataset.goto));
    });
  }

  function getLessonPack(weekNum) {
    return window["NETPLUS_LESSONS_W" + weekNum];
  }

  function initWeekLessonNav(weekId, weekNum) {
    const pack = getLessonPack(weekNum);
    const pane = document.getElementById("lesson-pane-" + weekId);
    const nav = document.getElementById("day-nav-" + weekId);
    if (!pane) return;
    if (!pack) {
      pane.innerHTML =
        '<p class="msg info">Full lesson content is still loading. Refresh the page or check that lessons/week-' +
        String(weekNum).padStart(2, "0") +
        ".js is present.</p>";
      return;
    }
    function showDay(day) {
      if (nav) {
        nav.querySelectorAll(".day-tab").forEach((t) => {
          t.classList.toggle("active", parseInt(t.dataset.day, 10) === day);
        });
      }
      const lesson = pack[String(day)];
      pane.innerHTML = lesson
        ? lesson.html
        : '<p class="msg err">Lesson content not found for this day.</p>';
    }
    if (nav) {
      nav.querySelectorAll(".day-tab").forEach((btn) => {
        btn.addEventListener("click", () => showDay(parseInt(btn.dataset.day, 10)));
      });
    }
    showDay(1);
  }

  function buildWeekSections() {
    const main = document.getElementById("main-content");
    const frag = document.createDocumentFragment();

    D.weeks.forEach((w, i) => {
      const weekNum = i + 1;
      const sec = document.createElement("section");
      sec.id = w.id;
      sec.className = "section";
      sec.innerHTML = `
        <div class="section-header">
          <div class="section-tag">// Week ${i + 1}</div>
          <h2>${esc(w.title)}</h2>
          <p>${esc(w.tagline)}</p>
        </div>
        <div class="card">
          <h3><span class="icon">📖</span> Daily lesson</h3>
          <p class="lesson-nav-hint">Select a day to open the full reading, lab steps, and review questions.</p>
          <div class="lesson-day-nav" id="day-nav-${w.id}">
            ${w.days
              .map(
                (d) =>
                  `<button type="button" class="day-tab${d.day === 1 ? " active" : ""}" data-day="${d.day}">Day ${d.day}: ${esc(d.title)}</button>`
              )
              .join("")}
          </div>
          <div class="lesson-reading-pane" id="lesson-pane-${w.id}"></div>
        </div>
        <div class="card green">
          <h3><span class="icon">🎯</span> Week objectives</h3>
          <ul>${w.objectives.map((o) => `<li>${esc(o)}</li>`).join("")}</ul>
        </div>
        <div class="three-col">
          <div class="card amber">
            <h3><span class="icon">📝</span> Mini quiz</h3>
            <p>${esc(w.assessments.quiz)}</p>
          </div>
          <div class="card purple">
            <h3><span class="icon">📋</span> ${w.id === "week10" ? "Capstone project" : "Project task"}</h3>
            <p>${esc(w.assessments.project)}</p>
          </div>
          <div class="card">
            <h3><span class="icon">🖥️</span> Packet Tracer lab</h3>
            <p>${esc(w.assessments.ptLab)}</p>
          </div>
        </div>
        ${
          w.assessments.capstoneChecklist
            ? `<div class="card green" style="margin-top:0">
            <h3><span class="icon">✅</span> Capstone requirements</h3>
            <ul>${w.assessments.capstoneChecklist.map((c) => `<li>${esc(c)}</li>`).join("")}</ul>
          </div>`
            : ""
        }`;
      frag.appendChild(sec);
    });
    main.appendChild(frag);
    D.weeks.forEach((w, i) => initWeekLessonNav(w.id, i + 1));
  }

  function buildStaticSections() {
    const main = document.getElementById("main-content");

    const schedule = document.getElementById("schedule");
    schedule.innerHTML = `
      <div class="section-header">
        <div class="section-tag">// Course map</div>
        <h2>10-week schedule</h2>
        <p>Each week: five daily lessons, mini quiz, project task, and Packet Tracer lab (weeks 1–9).</p>
      </div>
      <table class="data-table">
        <thead><tr><th>Week</th><th>Unit</th><th>Focus</th></tr></thead>
        <tbody>${D.schedule.map((r) => `<tr><td><strong>${r.week}</strong></td><td>${esc(r.title)}</td><td>${esc(r.focus)}</td></tr>`).join("")}</tbody>
      </table>`;

    const domains = document.getElementById("domains");
    domains.innerHTML = `
      <div class="section-header">
        <div class="section-tag">// N10-009</div>
        <h2>Exam domain coverage</h2>
        <p>How the summer units map to CompTIA Network+ objectives.</p>
      </div>
      <table class="data-table">
        <thead><tr><th>Domain</th><th>Weight</th><th>Weeks</th></tr></thead>
        <tbody>${D.examDomains.map((r) => `<tr><td><strong>${esc(r.domain)}</strong></td><td>${esc(r.weight)}</td><td>${esc(r.weeks)}</td></tr>`).join("")}</tbody>
      </table>`;

    const grading = document.getElementById("grading");
    grading.innerHTML = `
      <div class="section-header">
        <div class="section-tag">// Grading</div>
        <h2>Assessment summary</h2>
        <p>Total course points: <strong>500</strong></p>
      </div>
      <table class="data-table">
        <thead><tr><th>Assessment</th><th>Per item</th><th>Total</th><th>Notes</th></tr></thead>
        <tbody>${D.grading.map((r) => `<tr><td>${esc(r.item)}</td><td>${esc(r.each)}</td><td><strong>${esc(r.total)}</strong></td><td>${esc(r.notes)}</td></tr>`).join("")}</tbody>
      </table>`;

    const resources = document.getElementById("resources");
    resources.innerHTML = `
      <div class="section-header">
        <div class="section-tag">// Study aids</div>
        <h2>Recommended resources</h2>
      </div>
      <div class="card">
        <h3><span class="icon">🌐</span> Free online</h3>
        <ul>${D.resources.map((r) => `<li><a href="${esc(r.url)}" target="_blank" rel="noopener" style="color:var(--accent)">${esc(r.name)}</a> — ${esc(r.note)}</li>`).join("")}</ul>
      </div>
      <div class="card purple">
        <h3><span class="icon">📖</span> Textbooks</h3>
        <ul>${D.textbooks.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>
      </div>
      <div class="card amber">
        <h3><span class="icon">🚀</span> After this course</h3>
        <ul>${D.nextSteps.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>
      </div>
      <div class="callout" style="margin-top:20px">
        <div class="callout-icon">📄</div>
        <div class="callout-body">
          <h4>Source document</h4>
          <p>Full lesson plan: <a href="NetworkPlus_SummerLessons.md" style="color:var(--accent)">NetworkPlus_SummerLessons.md</a> (markdown copy in this folder)</p>
        </div>
      </div>
      <div class="card" id="reference-appendix-wrap" style="margin-top:20px;display:none">
        <h3><span class="icon">📋</span> Quick reference</h3>
        <div class="lesson-reading-pane reference-pane" id="reference-appendix"></div>
      </div>`;

    const refWrap = document.getElementById("reference-appendix-wrap");
    const refEl = document.getElementById("reference-appendix");
    if (refWrap && refEl && window.NETPLUS_REFERENCE_HTML) {
      refEl.innerHTML = window.NETPLUS_REFERENCE_HTML;
      refWrap.style.display = "";
    }

    const pt = document.getElementById("pt-tips");
    pt.innerHTML = `
      <div class="section-header">
        <div class="section-tag">// Labs</div>
        <h2>Packet Tracer tips</h2>
      </div>
      <div class="card">
        <ul>${D.ptTips.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>
      </div>
      <div class="callout tip">
        <div class="callout-icon">💡</div>
        <div class="callout-body">
          <h4>Required tools</h4>
          <p>${D.tools.map(esc).join(" ")}</p>
        </div>
      </div>
      <p style="margin-top:24px;font-size:0.8rem;color:var(--text3);line-height:1.6">${esc(D.disclaimer || "")}</p>`;
  }

  window.showSection = function (id) {
    document.querySelectorAll(".section").forEach((s) => s.classList.remove("active"));
    document.querySelectorAll(".nav-item").forEach((n) => n.classList.remove("active"));
    const sec = document.getElementById(id);
    if (sec) sec.classList.add("active");
    const nav = document.querySelector(`.nav-item[data-section="${id}"]`);
    if (nav) {
      nav.classList.add("active");
      const dot = nav.querySelector(".progress-dot");
      if (dot) dot.style.background = "#22d3ee";
    }
    document.getElementById("main-content").scrollTo({ top: 0, behavior: "smooth" });
    if (id === "quiz" && quizAnswered === 0) renderQuiz();
    if (id === "n10-exam-questions" && window.N10ExamUI) window.N10ExamUI.render();
  };

  function updateFlashUI() {
    if (!flashList.length) return;
    const card = flashList[flashIdx];
    document.getElementById("flash-front").textContent = card.q;
    document.getElementById("flash-back").textContent = card.a;
    document.getElementById("flash-counter").textContent = `${flashIdx + 1} / ${flashList.length}`;
    document.getElementById("flashcard").classList.remove("flipped");
    flashSeen.add(flashIdx);
    const pct = Math.round((flashSeen.size / flashList.length) * 100);
    document.getElementById("flash-progress").style.width = pct + "%";
    document.getElementById("flash-stats").textContent = `${flashSeen.size} of ${flashList.length} seen`;
  }

  window.flipCard = function () {
    document.getElementById("flashcard").classList.toggle("flipped");
  };
  window.nextFlash = function () {
    flashIdx = (flashIdx + 1) % flashList.length;
    updateFlashUI();
  };
  window.prevFlash = function () {
    flashIdx = (flashIdx - 1 + flashList.length) % flashList.length;
    updateFlashUI();
  };
  window.shuffleFlash = function () {
    flashList = flashList.sort(() => Math.random() - 0.5);
    flashIdx = 0;
    updateFlashUI();
  };
  window.resetFlash = function () {
    flashList = FLASH.filter((f) => flashFilter === "all" || f.cat === flashFilter);
    flashIdx = 0;
    flashSeen = new Set();
    updateFlashUI();
  };
  window.filterFlash = function (cat, btn) {
    flashFilter = cat;
    document.querySelectorAll("#flash-filters .filter-btn").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    resetFlash();
  };

  function renderQuiz() {
    if (quizIdx >= QUIZ.length) {
      document.getElementById("quiz-area").innerHTML = `
        <div class="quiz-score">
          <div class="score-circle" style="--pct:${Math.round((quizScore / QUIZ.length) * 100)}">
            <div class="score-inner">${quizScore}/${QUIZ.length}</div>
          </div>
          <div>
            <h3 style="margin-bottom:8px">Quiz complete</h3>
            <p style="color:var(--text2)">Review missed topics in the weekly lessons, then try again.</p>
            <button class="btn btn-primary" style="margin-top:12px" type="button" onclick="restartQuiz()">↺ Restart quiz</button>
          </div>
        </div>`;
      return;
    }
    const q = QUIZ[quizIdx];
    document.getElementById("quiz-area").innerHTML = `
      <div class="quiz-card">
        <div class="quiz-num">Question ${quizIdx + 1} of ${QUIZ.length}</div>
        <div class="quiz-question">${esc(q.q)}</div>
        <div class="options" id="quiz-options"></div>
        <div class="explanation" id="quiz-explanation"></div>
      </div>`;
    const opts = document.getElementById("quiz-options");
    const letters = ["A", "B", "C", "D"];
    q.options.forEach((opt, i) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "option";
      btn.innerHTML = `<span class="option-letter">${letters[i]}</span><span>${esc(opt)}</span>`;
      btn.addEventListener("click", () => pickQuiz(i, btn));
      opts.appendChild(btn);
    });
  }

  function pickQuiz(i, btn) {
    const q = QUIZ[quizIdx];
    document.querySelectorAll("#quiz-options .option").forEach((o) => {
      o.classList.add("disabled");
      o.style.pointerEvents = "none";
    });
    const exp = document.getElementById("quiz-explanation");
    if (i === q.correct) {
      btn.classList.add("correct-ans");
      quizScore++;
    } else {
      btn.classList.add("wrong-ans");
      document.querySelectorAll("#quiz-options .option")[q.correct].classList.add("correct-ans");
    }
    exp.innerHTML = `<strong>${i === q.correct ? "Correct." : "Not quite."}</strong> ${esc(q.explanation)} <button class="btn btn-outline btn-sm" style="margin-top:12px" type="button" id="quiz-next-btn">Next →</button>`;
    exp.classList.add("show");
    document.getElementById("quiz-next-btn").addEventListener("click", () => {
      quizIdx++;
      quizAnswered++;
      renderQuiz();
    });
  }

  window.restartQuiz = function () {
    quizIdx = 0;
    quizScore = 0;
    quizAnswered = 0;
    renderQuiz();
  };

  buildSidebar();
  buildHome();
  buildWeekSections();
  buildStaticSections();
  resetFlash();

  var hashId = (location.hash || "").replace(/^#/, "");
  if (hashId && document.getElementById(hashId)) showSection(hashId);
})();
