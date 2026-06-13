/**
 * Network Edition — Split / Practice / Notes layout for interactive lessons.
 */
(function () {
  "use strict";

  var STORAGE_KEY = "lh-network-pane-v2";
  var VIEWS = ["both", "practice", "notes"];
  var view = "both";
  var lastFooterBase = "";

  function loadState() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        var o = JSON.parse(raw);
        if (o && VIEWS.indexOf(o.view) >= 0) {
          view = o.view;
          return;
        }
      }
      var legacy = localStorage.getItem("lh-network-pane-v1");
      if (legacy) {
        var old = JSON.parse(legacy);
        if (old && old.hideInteractive) view = "notes";
        else if (old && old.hideNotes) view = "practice";
      }
    } catch (_) {}
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ view: view }));
    } catch (_) {}
  }

  function syncSwitcher() {
    var sw = document.getElementById("lh-net-view-switch");
    if (!sw) return;
    var active = document.body.classList.contains("lh-network-interactive-mode");
    sw.hidden = !active;
    sw.querySelectorAll(".lh-net-view-btn").forEach(function (btn) {
      var v = btn.getAttribute("data-lh-net-view");
      var on = v === view;
      btn.setAttribute("aria-selected", on ? "true" : "false");
      btn.classList.toggle("lh-net-view-btn--active", on);
      btn.tabIndex = on ? 0 : -1;
    });
  }

  function updateFooterHint() {
    var hint = document.getElementById("footer-hint");
    if (!hint || !document.body.classList.contains("lh-network-interactive-mode")) return;
    if (view === "notes") {
      hint.textContent = "Notes view — switch to Split or Practice in the top bar when you want drills again.";
    } else if (view === "practice") {
      hint.textContent = "Practice view — switch to Split or Notes in the top bar to read the lesson.";
    } else if (lastFooterBase) {
      hint.textContent = lastFooterBase;
    }
  }

  function applyPaneLayout() {
    if (VIEWS.indexOf(view) < 0) view = "both";
    var interactive = document.body.classList.contains("lh-network-interactive-mode");
    var cg = document.getElementById("content-grid");

    if (interactive) {
      document.body.setAttribute("data-lh-net-view", view);
      if (cg) cg.classList.toggle("single-pane", view !== "both");
    } else {
      document.body.removeAttribute("data-lh-net-view");
    }

    syncSwitcher();
    updateFooterHint();
  }

  function setView(next) {
    if (VIEWS.indexOf(next) < 0) return;
    view = next;
    saveState();
    applyPaneLayout();
  }

  function onPaneClick(e) {
    var btn = e.target.closest(".lh-net-view-btn[data-lh-net-view]");
    if (!btn || !document.body.classList.contains("lh-network-interactive-mode")) return;
    e.preventDefault();
    setView(btn.getAttribute("data-lh-net-view"));
  }

  function onPaneKeydown(e) {
    if (!document.body.classList.contains("lh-network-interactive-mode")) return;
    var sw = document.getElementById("lh-net-view-switch");
    if (!sw || sw.hidden) return;
    var idx = VIEWS.indexOf(view);
    if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      setView(VIEWS[(idx + VIEWS.length - 1) % VIEWS.length]);
    } else if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      setView(VIEWS[(idx + 1) % VIEWS.length]);
    }
  }

  loadState();
  document.addEventListener("click", onPaneClick);
  var viewSwitch = document.getElementById("lh-net-view-switch");
  if (viewSwitch) viewSwitch.addEventListener("keydown", onPaneKeydown);

  window.LH_NETWORK_PANE = {
    apply: applyPaneLayout,
    setView: setView,
    getView: function () {
      return view;
    },
    setFooterBase: function (text) {
      lastFooterBase = text || "";
      updateFooterHint();
    },
  };

  applyPaneLayout();
})();
