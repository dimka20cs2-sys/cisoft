(function () {
  var SITE = window.SITE || {}, TYPES = window.TYPES || {}, ITEMS = window.ITEMS || [];
  var app = document.getElementById("app");
  var state = { type: "all", q: "" };

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function date(d) {
    if (!d) return "";
    var p = String(d).split("-");
    return p.length === 3 ? p[2] + "." + p[1] + "." + p[0] : d;
  }
  function icon(it, big) {
    var cls = "icon" + (big ? " big" : "");
    if (it.icon) return '<img class="' + cls + '" src="' + esc(it.icon) + '" alt="">';
    return '<div class="' + cls + ' ph">' + esc((it.name || "?").charAt(0).toUpperCase()) + "</div>";
  }
  function badge(type) {
    return '<span class="badge ' + esc(type) + '">' + esc(TYPES[type] || type || "") + "</span>";
  }
  function sorted() {
    return ITEMS.slice().sort(function (a, b) { return String(b.date || "").localeCompare(String(a.date || "")); });
  }

  // ── шапка/подвал ──
  document.title = SITE.name || "Каталог";
  document.getElementById("site-name").textContent = SITE.name || "";
  document.getElementById("logo").textContent = (SITE.name || "?").replace(/[^A-Za-zА-Яа-я0-9]/g, "").slice(0, 2).toUpperCase();
  document.getElementById("copy").textContent = "© " + new Date().getFullYear() + " " + (SITE.author || SITE.name || "");
  if (SITE.contact) {
    var cl = document.getElementById("contact-link");
    cl.href = SITE.contact;
    cl.hidden = false;
  }

  // ── главная ──
  function renderHome() {
    document.title = SITE.name || "Каталог";
    var counts = {};
    ITEMS.forEach(function (it) { counts[it.type] = (counts[it.type] || 0) + 1; });
    var chips = '<button class="chip' + (state.type === "all" ? " on" : "") + '" data-type="all">Всё<b>' + ITEMS.length + "</b></button>";
    Object.keys(TYPES).forEach(function (t) {
      if (counts[t]) chips += '<button class="chip' + (state.type === t ? " on" : "") + '" data-type="' + esc(t) + '">' + esc(TYPES[t]) + "<b>" + counts[t] + "</b></button>";
    });

    app.innerHTML =
      '<section class="hero"><h1>' + heroTitle() + "</h1><p>" + esc(SITE.tagline || "") + "</p></section>" +
      '<div class="tools">' + chips + '<input class="search" type="search" placeholder="Поиск…" value="' + esc(state.q) + '"></div>' +
      '<div class="grid" id="grid"></div>';

    app.querySelectorAll(".chip").forEach(function (b) {
      b.onclick = function () { state.type = b.dataset.type; renderHome(); };
    });
    var s = app.querySelector(".search");
    s.oninput = function () { state.q = s.value; renderGrid(); };
    renderGrid();
  }

  function heroTitle() {
    var n = esc(SITE.name || "Каталог");
    return "Софт от <span>" + n + "</span>";
  }

  function renderGrid() {
    var q = state.q.trim().toLowerCase();
    var list = sorted().filter(function (it) {
      if (state.type !== "all" && it.type !== state.type) return false;
      if (!q) return true;
      return [it.name, it.short, (it.tags || []).join(" ")].join(" ").toLowerCase().indexOf(q) >= 0;
    });
    var g = document.getElementById("grid");
    if (!list.length) { g.innerHTML = '<div class="empty">Ничего не найдено</div>'; return; }
    g.innerHTML = list.map(function (it) {
      return '<a class="card" href="#/item/' + encodeURIComponent(it.id) + '">' +
        '<div class="card-head">' + icon(it) + "<div><h3>" + esc(it.name) + "</h3>" + badge(it.type) + "</div></div>" +
        "<p>" + esc(it.short) + "</p>" +
        '<div class="meta">' +
          (it.version ? "<span>v" + esc(it.version) + "</span>" : "") +
          (it.date ? "<span>" + date(it.date) + "</span>" : "") +
          (it.size ? "<span>" + esc(it.size) + "</span>" : "") +
        "</div></a>";
    }).join("");
  }

  // ── страница публикации ──
  function renderItem(id) {
    var it = ITEMS.filter(function (x) { return x.id === id; })[0];
    if (!it) { app.innerHTML = '<a class="back" href="#/">← Каталог</a><div class="empty">Публикация не найдена</div>'; return; }
    document.title = it.name + " — " + (SITE.name || "");

    var href = it.file || it.link || "#";
    var dlAttr = it.file ? ' download' : ' target="_blank" rel="noopener"';
    var shots = it.screenshots || [];

    var html =
      '<a class="back" href="#/">← Каталог</a>' +
      '<div class="item-head">' + icon(it, true) +
        "<div>" + badge(it.type) + "<h1>" + esc(it.name) + "</h1><p>" + esc(it.short) + "</p></div></div>" +
      '<div class="layout"><div>';

    if (shots.length) {
      html += '<div class="shots"><div class="main" id="shot-main"><img id="shot-img" src="' + esc(shots[0].src) + '" alt=""></div>' +
        '<div class="caption" id="shot-cap">' + esc(shots[0].caption || "") + "</div>";
      if (shots.length > 1) {
        html += '<div class="thumbs">' + shots.map(function (s, i) {
          return '<button class="' + (i === 0 ? "on" : "") + '" data-i="' + i + '"><img src="' + esc(s.src) + '" alt=""></button>';
        }).join("") + "</div>";
      }
      html += "</div>";
    }

    if (it.description && it.description.length) {
      html += '<div class="section"><h2>Описание</h2>' + [].concat(it.description).map(function (p) { return "<p>" + esc(p) + "</p>"; }).join("") + "</div>";
    }
    if (it.features && it.features.length) {
      html += '<div class="section"><h2>Возможности</h2><div class="features">' + it.features.map(function (f) {
        return '<div class="feature"><b>' + esc(f.title) + "</b><span>" + esc(f.text) + "</span></div>";
      }).join("") + "</div></div>";
    }
    if (it.notes && it.notes.length) {
      html += '<div class="section"><h2>Важно</h2>' + it.notes.map(function (n) { return '<div class="note">' + esc(n) + "</div>"; }).join("") + "</div>";
    }
    if (it.changelog && it.changelog.length) {
      html += '<div class="section"><h2>Что нового</h2>' + it.changelog.map(function (c) {
        return '<div class="log"><b>v' + esc(c.version) + "</b><small>" + date(c.date) + "</small><ul>" +
          (c.changes || []).map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ul></div>";
      }).join("") + "</div>";
    }

    html += '</div><aside class="side"><div class="dl">' +
      '<a class="btn" href="' + esc(href) + '"' + dlAttr + ">⬇ Скачать" + (it.size ? " · " + esc(it.size) : "") + "</a><dl>" +
      (it.version ? "<dt>Версия</dt><dd>" + esc(it.version) + "</dd>" : "") +
      (it.date ? "<dt>Обновлено</dt><dd>" + date(it.date) + "</dd>" : "") +
      (it.size ? "<dt>Размер</dt><dd>" + esc(it.size) + "</dd>" : "") +
      "<dt>Тип</dt><dd>" + esc(TYPES[it.type] || it.type || "") + "</dd></dl>";
    if (it.requirements && it.requirements.length) {
      html += "<h4>Требования</h4><ul>" + it.requirements.map(function (r) { return "<li>" + esc(r) + "</li>"; }).join("") + "</ul>";
    }
    if (it.tags && it.tags.length) {
      html += '<div class="tags">' + it.tags.map(function (t) { return '<span class="tag">' + esc(t) + "</span>"; }).join("") + "</div>";
    }
    html += "</div></aside></div>";
    app.innerHTML = html;

    var cur = 0;
    app.querySelectorAll(".thumbs button").forEach(function (b) {
      b.onclick = function () {
        cur = +b.dataset.i;
        document.getElementById("shot-img").src = shots[cur].src;
        document.getElementById("shot-cap").textContent = shots[cur].caption || "";
        app.querySelectorAll(".thumbs button").forEach(function (x) { x.classList.toggle("on", x === b); });
      };
    });
    var main = document.getElementById("shot-main");
    if (main) main.onclick = function () { openLightbox(shots[cur].src); };
  }

  function openLightbox(src) {
    var lb = document.createElement("div");
    lb.className = "lightbox";
    lb.innerHTML = '<img src="' + esc(src) + '" alt="">';
    function close() { lb.remove(); document.removeEventListener("keydown", onKey); }
    function onKey(e) { if (e.key === "Escape") close(); }
    lb.onclick = close;
    document.addEventListener("keydown", onKey);
    document.body.appendChild(lb);
  }

  // ── маршрутизация: #/ — каталог, #/item/<id> — публикация ──
  function route() {
    var m = location.hash.match(/^#\/item\/(.+)$/);
    if (m) renderItem(decodeURIComponent(m[1])); else renderHome();
    window.scrollTo(0, 0);
  }
  window.addEventListener("hashchange", route);
  route();
})();
