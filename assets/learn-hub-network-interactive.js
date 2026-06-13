/**
 * Network Edition — interactive lesson widgets (match, order, categorize, pick, fill).
 */
(function () {
  "use strict";

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function getCatalog() {
    return window.LEARN_HUB_NETWORK_INTERACTIVE || { byLesson: {}, patterns: [] };
  }

  function activitiesForLesson(lessonId) {
    const cat = getCatalog();
    const id = String(lessonId || "");
    if (cat.byLesson && Array.isArray(cat.byLesson[id]) && cat.byLesson[id].length)
      return cat.byLesson[id].slice();
    const out = [];
    const patterns = cat.patterns || [];
    for (let i = 0; i < patterns.length; i++) {
      const p = patterns[i];
      if (!p || !p.re) continue;
      const re = p.re instanceof RegExp ? p.re : new RegExp(p.re);
      if (re.test(id) && Array.isArray(p.activities)) {
        p.activities.forEach(function (a) {
          out.push(Object.assign({}, a, { id: (a.id || "pat") + "-" + id }));
        });
      }
    }
    return out;
  }

  window.LH_NETWORK_ACTIVITIES_FOR_LESSON = activitiesForLesson;

  function mountInteractive(hostEl, lessonId, onProgress) {
    if (!hostEl) return;
    const activities = activitiesForLesson(lessonId);
    hostEl.innerHTML = "";
    if (!activities.length) {
      hostEl.innerHTML =
        '<p class="msg info">No interactive drills for this lesson yet. Use the reading and sidebar quiz sets.</p>';
      if (onProgress) onProgress({ total: 0, done: 0, allCorrect: true });
      return;
    }

    const state = { done: {}, total: activities.length };

    function report() {
      const doneCount = Object.keys(state.done).filter(function (k) {
        return state.done[k];
      }).length;
      const allCorrect = doneCount === state.total;
      if (onProgress) onProgress({ total: state.total, done: doneCount, allCorrect: allCorrect });
      const fill = document.getElementById("lh-net-interactive-progress-fill");
      if (fill)
        fill.style.width = state.total ? Math.round((doneCount / state.total) * 100) + "%" : "0%";
    }

    const wrap = document.createElement("div");
    wrap.className = "lh-net-interactive-root";

    const prog = document.createElement("div");
    prog.className = "lh-net-progress-bar";
    prog.innerHTML = '<div class="lh-net-progress-fill" id="lh-net-interactive-progress-fill"></div>';
    wrap.appendChild(prog);

    const intro = document.createElement("p");
    intro.className = "msg info";
    intro.style.marginBottom = "12px";
    intro.textContent =
      "Complete each activity below, then press Check. Finish all to mark this lesson’s interactives done.";
    wrap.appendChild(intro);

    activities.forEach(function (act, idx) {
      wrap.appendChild(renderActivity(act, idx, state, report));
    });

    hostEl.appendChild(wrap);
    report();
  }

  function renderActivity(act, idx, state, report) {
    const box = document.createElement("section");
    box.className = "lh-net-activity";
    box.setAttribute("data-activity-id", act.id || "a" + idx);

    const typeLabel = { match: "Matching", order: "Ordering", categorize: "Sort", pick: "Quick check", fill: "Fill-in" };
    box.innerHTML =
      '<div class="lh-net-activity-head">' +
      '<h3 class="lh-net-activity-title">' +
      escapeHtml(act.title || "Activity") +
      "</h3>" +
      '<span class="lh-net-activity-type">' +
      escapeHtml(typeLabel[act.type] || act.type) +
      "</span></div>" +
      '<p class="lh-net-activity-prompt">' +
      escapeHtml(act.prompt || "") +
      "</p>";

    const body = document.createElement("div");
    body.className = "lh-net-activity-body";
    const status = document.createElement("p");
    status.className = "lh-net-activity-status";
    status.setAttribute("aria-live", "polite");

    const actions = document.createElement("div");
    actions.className = "lh-net-activity-actions";

    const btnCheck = document.createElement("button");
    btnCheck.type = "button";
    btnCheck.className = "tool success";
    btnCheck.textContent = "Check";

    const btnReset = document.createElement("button");
    btnReset.type = "button";
    btnReset.className = "tool ghost";
    btnReset.textContent = "Reset";

    const aid = act.id || "a" + idx;

    if (act.type === "match") renderMatch(body, act);
    else if (act.type === "order") renderOrder(body, act);
    else if (act.type === "categorize") renderCategorize(body, act);
    else if (act.type === "pick") renderPick(body, act);
    else if (act.type === "fill") renderFill(body, act);

    btnCheck.addEventListener("click", function () {
      const ok = gradeActivity(act, body);
      if (ok) {
        state.done[aid] = true;
        status.textContent = "Correct — nice work.";
        status.className = "lh-net-activity-status lh-net-activity-status--ok";
        box.style.borderColor = "rgba(61, 154, 106, 0.5)";
      } else {
        state.done[aid] = false;
        status.textContent = "Not quite — review the highlighted items and try again.";
        status.className = "lh-net-activity-status lh-net-activity-status--err";
      }
      report();
    });

    btnReset.addEventListener("click", function () {
      state.done[aid] = false;
      status.textContent = "";
      status.className = "lh-net-activity-status";
      box.style.borderColor = "";
      body.innerHTML = "";
      if (act.type === "match") renderMatch(body, act);
      else if (act.type === "order") renderOrder(body, act);
      else if (act.type === "categorize") renderCategorize(body, act);
      else if (act.type === "pick") renderPick(body, act);
      else if (act.type === "fill") renderFill(body, act);
      report();
    });

    actions.appendChild(btnCheck);
    actions.appendChild(btnReset);
    actions.appendChild(status);
    box.appendChild(body);
    box.appendChild(actions);
    return box;
  }

  function renderMatch(body, act) {
    const pairs = act.pairs || [];
    const left = pairs.map(function (p) {
      return p[0];
    });
    const right = pairs
      .map(function (p) {
        return p[1];
      })
      .sort(function () {
        return Math.random() - 0.5;
      });

    body.dataset.matchPairs = JSON.stringify(pairs);
    body._matchState = { selectedLeft: null, matched: {} };

    const grid = document.createElement("div");
    grid.className = "lh-net-match-grid";

    const colL = document.createElement("div");
    colL.className = "lh-net-match-col";
    colL.innerHTML = "<h4>Column A</h4>";
    const colR = document.createElement("div");
    colR.className = "lh-net-match-col";
    colR.innerHTML = "<h4>Column B</h4>";

    left.forEach(function (text, i) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "lh-net-tile lh-net-tile-left";
      btn.textContent = text;
      btn.dataset.leftIndex = String(i);
      btn.addEventListener("click", function () {
        if (btn.disabled) return;
        body.querySelectorAll(".lh-net-tile-left").forEach(function (t) {
          t.classList.remove("lh-net-tile--selected");
        });
        btn.classList.add("lh-net-tile--selected");
        body._matchState.selectedLeft = i;
      });
      colL.appendChild(btn);
    });

    right.forEach(function (text) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "lh-net-tile lh-net-tile-right";
      btn.textContent = text;
      btn.dataset.rightText = text;
      btn.addEventListener("click", function () {
        const st = body._matchState;
        if (st.selectedLeft == null || btn.disabled) return;
        const pair = pairs[st.selectedLeft];
        const correct = pair && pair[1] === text;
        const leftBtn = colL.querySelector('[data-left-index="' + st.selectedLeft + '"]');
        if (correct) {
          st.matched[st.selectedLeft] = text;
          if (leftBtn) {
            leftBtn.disabled = true;
            leftBtn.classList.add("lh-net-tile--paired", "lh-net-tile--correct");
          }
          btn.disabled = true;
          btn.classList.add("lh-net-tile--paired", "lh-net-tile--correct");
        } else {
          if (leftBtn) leftBtn.classList.add("lh-net-tile--wrong");
          btn.classList.add("lh-net-tile--wrong");
          setTimeout(function () {
            if (leftBtn) leftBtn.classList.remove("lh-net-tile--wrong", "lh-net-tile--selected");
            btn.classList.remove("lh-net-tile--wrong");
          }, 700);
        }
        st.selectedLeft = null;
        body.querySelectorAll(".lh-net-tile-left").forEach(function (t) {
          t.classList.remove("lh-net-tile--selected");
        });
      });
      colR.appendChild(btn);
    });

    grid.appendChild(colL);
    grid.appendChild(colR);
    body.appendChild(grid);
  }

  function renderOrder(body, act) {
    const items = (act.items || []).slice().sort(function () {
      return Math.random() - 0.5;
    });
    body._orderItems = items;
    const ul = document.createElement("ul");
    ul.className = "lh-net-order-list";

    function rebuild() {
      ul.innerHTML = "";
      body._orderItems.forEach(function (label, i) {
        const li = document.createElement("li");
        li.className = "lh-net-order-item";
        const span = document.createElement("span");
        span.className = "lh-net-order-label";
        span.textContent = label;
        const btns = document.createElement("div");
        btns.className = "lh-net-order-btns";
        const up = document.createElement("button");
        up.type = "button";
        up.className = "tool ghost";
        up.textContent = "▲";
        up.disabled = i === 0;
        const down = document.createElement("button");
        down.type = "button";
        down.className = "tool ghost";
        down.textContent = "▼";
        down.disabled = i === body._orderItems.length - 1;
        up.addEventListener("click", function () {
          const arr = body._orderItems;
          const t = arr[i];
          arr[i] = arr[i - 1];
          arr[i - 1] = t;
          rebuild();
        });
        down.addEventListener("click", function () {
          const arr = body._orderItems;
          const t = arr[i];
          arr[i] = arr[i + 1];
          arr[i + 1] = t;
          rebuild();
        });
        btns.appendChild(up);
        btns.appendChild(down);
        li.appendChild(span);
        li.appendChild(btns);
        ul.appendChild(li);
      });
    }
    rebuild();
    body.appendChild(ul);
  }

  function renderCategorize(body, act) {
    const buckets = act.buckets || [];
    const items = (act.items || []).slice().sort(function () {
      return Math.random() - 0.5;
    });
    body._catItems = items.map(function (it) {
      return { label: it.label, bucket: it.bucket, placed: null };
    });
    body._selectedCat = null;

    const pool = document.createElement("div");
    pool.className = "lh-net-cat-pool";
    pool.innerHTML = "<h4 style='font-size:0.72rem;color:var(--muted);margin:0 0 8px'>Items</h4>";

    const bucketRow = document.createElement("div");
    bucketRow.className = "lh-net-buckets";

    function rebuild() {
      pool.querySelectorAll(".lh-net-tile").forEach(function (n) {
        n.remove();
      });
      body._catItems.forEach(function (it, i) {
        if (it.placed != null) return;
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "lh-net-tile";
        btn.textContent = it.label;
        btn.addEventListener("click", function () {
          body.querySelectorAll(".lh-net-cat-pool .lh-net-tile").forEach(function (t) {
            t.classList.remove("lh-net-tile--selected");
          });
          btn.classList.add("lh-net-tile--selected");
          body._selectedCat = i;
        });
        pool.appendChild(btn);
      });

      bucketRow.innerHTML = "";
      buckets.forEach(function (bname) {
        const b = document.createElement("div");
        b.className = "lh-net-bucket";
        b.innerHTML = "<h4>" + escapeHtml(bname) + "</h4>";
        body._catItems.forEach(function (it, i) {
          if (it.placed !== bname) return;
          const tag = document.createElement("button");
          tag.type = "button";
          tag.className = "lh-net-tile";
          tag.textContent = it.label;
          tag.addEventListener("click", function () {
            it.placed = null;
            rebuild();
          });
          b.appendChild(tag);
        });
        b.addEventListener("click", function () {
          if (body._selectedCat == null) return;
          body._catItems[body._selectedCat].placed = bname;
          body._selectedCat = null;
          rebuild();
        });
        bucketRow.appendChild(b);
      });
    }

    body.appendChild(pool);
    body.appendChild(bucketRow);
    rebuild();
  }

  function renderPick(body, act) {
    body._pickSelected = null;
    const grid = document.createElement("div");
    grid.className = "lh-net-pick-grid";
    (act.options || []).forEach(function (opt, i) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "lh-net-tile";
      btn.textContent = opt;
      btn.dataset.index = String(i);
      btn.addEventListener("click", function () {
        grid.querySelectorAll(".lh-net-tile").forEach(function (t) {
          t.classList.remove("lh-net-tile--selected");
        });
        btn.classList.add("lh-net-tile--selected");
        body._pickSelected = i;
      });
      grid.appendChild(btn);
    });
    body.appendChild(grid);
  }

  function renderFill(body, act) {
    body._fillValues = [];
    (act.fields || []).forEach(function (field, fi) {
      const row = document.createElement("div");
      row.className = "lh-net-fill-row";
      const lab = document.createElement("label");
      lab.textContent = field.label || "Answer";
      const sel = document.createElement("select");
      sel.className = "lh-net-fill-select";
      sel.innerHTML = '<option value="">— Select —</option>';
      (field.options || []).forEach(function (opt, oi) {
        const o = document.createElement("option");
        o.value = String(oi);
        o.textContent = opt;
        sel.appendChild(o);
      });
      sel.addEventListener("change", function () {
        body._fillValues[fi] = sel.value === "" ? null : Number(sel.value);
      });
      row.appendChild(lab);
      row.appendChild(sel);
      body.appendChild(row);
    });
  }

  function gradeActivity(act, body) {
    if (act.type === "match") {
      const pairs = act.pairs || [];
      const st = body._matchState || {};
      return Object.keys(st.matched || {}).length === pairs.length;
    }
    if (act.type === "order") {
      const expected = act.items || [];
      const current = body._orderItems || [];
      if (current.length !== expected.length) return false;
      for (let i = 0; i < expected.length; i++) {
        if (current[i] !== expected[i]) return false;
      }
      return true;
    }
    if (act.type === "categorize") {
      const items = body._catItems || [];
      for (let i = 0; i < items.length; i++) {
        if (items[i].placed !== items[i].bucket) return false;
      }
      return items.length > 0;
    }
    if (act.type === "pick") {
      return body._pickSelected === act.correct;
    }
    if (act.type === "fill") {
      const fields = act.fields || [];
      for (let fi = 0; fi < fields.length; fi++) {
        if (body._fillValues[fi] !== fields[fi].correct) return false;
      }
      return true;
    }
    return false;
  }

  window.LH_NETWORK_MOUNT_INTERACTIVE = function (hostEl, lessonId, onProgress) {
    mountInteractive(hostEl, lessonId, onProgress);
  };
})();
