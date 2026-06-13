/**
 * N10-009 practice question browser (lali-style reveal) — requires n10-exam-bank.js
 */
(function () {
  var BANK = window.N10_EXAM_BANK;
  if (!BANK || !Array.isArray(BANK.questions)) return;

  var PAGE_SIZE = 25;
  var state = { page: 0, search: "" };

  function esc(t) {
    var d = document.createElement("div");
    d.textContent = t == null ? "" : String(t);
    return d.innerHTML;
  }

  function cleanStem(text) {
    return String(text || "")
      .replace(/^\*\*Topic:\*\*\s*[^\n]+?\s*/i, "")
      .replace(/\*\*Topic:\*\*\s*[^\n]+?\s*/gi, "")
      .trim();
  }

  function filtered() {
    var list = BANK.questions;
    if (state.search) {
      var s = state.search.toLowerCase();
      list = list.filter(function (q) {
        return cleanStem(q.stem).toLowerCase().indexOf(s) >= 0 || String(q.num).indexOf(s) >= 0;
      });
    }
    return list;
  }

  function renderRow(q) {
    var opts = "";
    (q.choices || []).forEach(function (text, i) {
      var L = (q.letters && q.letters[i]) || String.fromCharCode(65 + i);
      opts +=
        '<li class="mc-option" data-letter="' +
        esc(L) +
        '"><strong>' +
        esc(L) +
        ".</strong> <span>" +
        esc(text) +
        "</span></li>";
    });
    var imgs = "";
    (q.images || []).forEach(function (src) {
      imgs +=
        '<p class="exam-img"><img src="' +
        encodeURI(src).replace(/#/g, "%23") +
        '" alt="Question diagram" loading="lazy"/></p>';
    });
    return (
      '<article class="exam-row" id="q-' +
      q.num +
      '" data-num="' +
      q.num +
      '">' +
      '<div class="exam-top"><h2>Question ' +
      q.num +
      "</h2></div>" +
      '<div class="question-content">' +
      imgs +
      "<p>" +
      esc(cleanStem(q.stem)) +
      '</p><div class="mc-question" data-correct-letter="' +
      esc(q.correct || "") +
      '"><ul class="exam-options">' +
      opts +
      '</ul><button type="button">Show Answer</button></div></div></article>'
    );
  }

  function renderPager(total, pageCount) {
    if (pageCount <= 1) return "";
    var h = '<nav class="n10-pager" aria-label="Question pages">';
    if (state.page > 0) {
      h += '<button type="button" class="btn btn-ghost btn-sm" data-page="' + (state.page - 1) + '">← Prev</button>';
    }
    h += '<span class="n10-pager-label">Page ' + (state.page + 1) + " of " + pageCount + " (" + total + " questions)</span>";
    if (state.page < pageCount - 1) {
      h += '<button type="button" class="btn btn-ghost btn-sm" data-page="' + (state.page + 1) + '">Next →</button>';
    }
    h += "</nav>";
    return h;
  }

  function render() {
    var mount = document.getElementById("n10-exam-mount");
    var meta = document.getElementById("n10-exam-meta");
    if (!mount) return;
    var list = filtered();
    var pageCount = Math.max(1, Math.ceil(list.length / PAGE_SIZE));
    if (state.page >= pageCount) state.page = pageCount - 1;
    var slice = list.slice(state.page * PAGE_SIZE, state.page * PAGE_SIZE + PAGE_SIZE);
    mount.innerHTML =
      renderPager(list.length, pageCount) +
      '<div class="all-exam-wrap">' +
      slice.map(renderRow).join("") +
      "</div>" +
      renderPager(list.length, pageCount);
    if (meta) {
      meta.textContent = BANK.count + " questions · showing " + slice.length + " on this page";
    }
    mount.querySelectorAll("[data-page]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        state.page = parseInt(btn.getAttribute("data-page"), 10) || 0;
        render();
        mount.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });
  }

  function bindSearch() {
    var search = document.getElementById("n10-exam-search");
    if (search) {
      search.addEventListener("input", function () {
        state.search = search.value.trim();
        state.page = 0;
        render();
      });
    }
  }

  document.addEventListener("click", function (e) {
    var btn = e.target.closest("#n10-exam-questions .mc-question > button");
    if (!btn) return;
    var wrap = btn.closest(".mc-question");
    if (!wrap) return;
    if (wrap.classList.contains("revealed")) {
      if (btn.textContent === "Hide answer") {
        wrap.classList.remove("revealed");
        wrap.querySelectorAll(".mc-option").forEach(function (li) {
          li.classList.remove("correct", "wrong");
        });
        btn.textContent = "Show Answer";
      }
      return;
    }
    if (btn.textContent.trim() !== "Show Answer") return;
    var letter = wrap.getAttribute("data-correct-letter") || "";
    if (!letter) {
      btn.textContent = "Answer unavailable";
      return;
    }
    var correct = Object.create(null);
    for (var i = 0; i < letter.length; i++) correct[letter.charAt(i)] = true;
    wrap.classList.add("revealed");
    wrap.querySelectorAll(".mc-option").forEach(function (li) {
      var lab = li.querySelector("strong");
      var L = lab && lab.textContent.trim().charAt(0);
      if (correct[L]) li.classList.add("correct");
      else li.classList.add("wrong");
    });
    btn.textContent = "Hide answer";
  });

  window.N10ExamUI = { render: render, filtered: filtered };
  bindSearch();
  render();
})();
