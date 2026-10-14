// Главная: герой, фильтры по типам, сортировка, поиск, карточки.
(function () {
  var CI = window.CI, esc = CI.esc;
  var SORTS = [["new", "Новые"], ["popular", "Популярные"], ["az", "А–Я"]];
  var state = CI.catalog = { type: "all", q: "", sort: CI.load("ci-sort", "new") };
  if (!SORTS.some(function (s) { return s[0] === state.sort; })) state.sort = "new";

  function score(it) { var s = CI.st(it.id); return (s.downloads || 0) + (s.likes || 0); }
  function byDate(a, b) { return String(b.it.date || "").localeCompare(String(a.it.date || "")) || a.i - b.i; }
  function sorted() {
    var arr = CI.ITEMS.map(function (it, i) { return { it: it, i: i }; });
    if (state.sort === "az") arr.sort(function (a, b) { return String(a.it.name).localeCompare(String(b.it.name), "ru", { sensitivity: "base" }); });
    else if (state.sort === "popular") arr.sort(function (a, b) { return score(b.it) - score(a.it) || byDate(a, b); });
    else arr.sort(byDate);
    return arr.map(function (x) { return x.it; });
  }

  CI.renderHome = function () {
    document.title = CI.SITE.name || "Каталог";
    var counts = {};
    CI.ITEMS.forEach(function (it) { counts[it.type] = (counts[it.type] || 0) + 1; });
    var chips = '<button type="button" class="chip' + (state.type === "all" ? " on" : "") + '" data-type="all">Всё<b>' + CI.ITEMS.length + "</b></button>";
    Object.keys(CI.TYPES).forEach(function (t) {
      if (counts[t]) chips += '<button type="button" class="chip' + (state.type === t ? " on" : "") + '" data-type="' + esc(t) + '">' + esc(CI.TYPES[t]) + "<b>" + counts[t] + "</b></button>";
    });
    var seg = SORTS.map(function (s) {
      return '<button type="button" data-sort="' + s[0] + '" aria-pressed="' + (state.sort === s[0]) + '"' + (state.sort === s[0] ? ' class="on"' : "") + ">" + s[1] + "</button>";
    }).join("");

    CI.app.innerHTML =
      '<section class="hero"><h1>Софт от <span>' + esc(CI.SITE.name || "Каталог") + "</span></h1>" +
      "<p>" + esc(CI.SITE.tagline || "") + "</p>" +
      '<div class="hero-total" id="hero-total">' + CI.heroLine() + "</div></section>" +
      '<div class="tools">' + chips + "</div>" +
      '<div class="tools2"><div class="seg" role="group" aria-label="Сортировка">' + seg + "</div>" +
      '<input class="search" id="search" type="search" placeholder="Поиск…  ( / )" aria-label="Поиск" value="' + esc(state.q) + '"></div>' +
      '<div id="grid"></div>';

    CI.app.querySelectorAll(".chip").forEach(function (b) {
      b.onclick = function () {
        state.type = b.dataset.type;
        CI.app.querySelectorAll(".chip").forEach(function (x) { x.classList.toggle("on", x === b); });
        renderGrid();
      };
    });
    CI.app.querySelectorAll("[data-sort]").forEach(function (b) {
      b.onclick = function () {
        state.sort = b.dataset.sort;
        CI.save("ci-sort", state.sort);
        CI.app.querySelectorAll("[data-sort]").forEach(function (x) {
          x.classList.toggle("on", x === b); x.setAttribute("aria-pressed", x === b ? "true" : "false");
        });
        renderGrid();
      };
    });
    var s = document.getElementById("search");
    s.oninput = function () { state.q = s.value; renderGrid(); };
    renderGrid();
  };

  CI.clearSearch = function () {
    var s = document.getElementById("search");
    if (!s || !s.value) return false;
    s.value = ""; state.q = ""; renderGrid();
    return true;
  };

  function renderGrid() {
    var g = document.getElementById("grid");
    if (!g) return;
    var q = state.q.trim().toLowerCase();
    var list = sorted().filter(function (it) {
      if (state.type !== "all" && it.type !== state.type) return false;
      if (!q) return true;
      return [it.name, it.short, (it.tags || []).join(" ")].join(" ").toLowerCase().indexOf(q) >= 0;
    });
    if (!list.length) { g.innerHTML = '<div class="grid"><div class="empty">Ничего не найдено</div></div>'; return; }
    if (state.type !== "all") {
      g.innerHTML = '<div class="grid">' + list.map(card).join("") + "</div>";
    } else {
      // «Всё» — блоками по группам в порядке TYPES, внутри групп — выбранная сортировка
      var html = "", types = Object.keys(CI.TYPES);
      list.forEach(function (it) { if (types.indexOf(it.type) < 0) types.push(it.type); });
      types.forEach(function (t) {
        var part = list.filter(function (it) { return it.type === t; });
        if (!part.length) return;
        html += '<section class="group"><h2 class="group-title">' + esc(CI.TYPES[t] || t) + "<span>" + part.length + "</span></h2>" +
          '<div class="grid">' + part.map(card).join("") + "</div></section>";
      });
      g.innerHTML = html;
    }
    CI.paintStats(g);
    CI.reveal(g);
  }
  CI.renderGrid = renderGrid;

  function card(it) {
    var id = esc(it.id);
    return '<article class="card">' +
      '<div class="card-head">' + CI.icon(it) + "<div>" +
        '<h3><a class="card-link" href="#/item/' + encodeURIComponent(it.id) + '">' + esc(it.name) + "</a></h3>" +
        CI.badge(it.type) + (CI.isNew(it) ? '<span class="new-tag">Новое</span>' : "") +
      "</div></div>" +
      "<p>" + esc(it.short) + "</p>" +
      '<div class="meta">' +
        (it.version ? "<span>v" + esc(it.version) + "</span>" : "") +
        (it.date ? "<span>" + CI.date(it.date) + "</span>" : "") +
        (it.size ? "<span>" + esc(it.size) + "</span>" : "") +
        '<span class="stat" title="Скачиваний">⬇ <span data-count-dl="' + id + '">0</span></span>' +
        '<button type="button" class="fav sm" data-fav="' + id + '" aria-pressed="false" aria-label="Избранное" title="В избранное"><span class="star">☆</span></button>' +
        '<button type="button" class="like sm" data-like="' + id + '" aria-pressed="false" title="Нравится">' +
          '<span class="heart">❤</span><span class="stat" data-count-like="' + id + '">0</span></button>' +
      "</div></article>";
  }

  // Плавное появление карточек при прокрутке
  var io = null;
  CI.reveal = function (root) {
    if (CI.reducedMotion() || !("IntersectionObserver" in window)) return;
    if (!io) io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var c = e.target;
        c.classList.add("in");
        io.unobserve(c);
        setTimeout(function () { c.style.transitionDelay = ""; c.classList.remove("reveal", "in"); }, 700);
      });
    }, { rootMargin: "0px 0px -30px 0px" });
    root.querySelectorAll(".card").forEach(function (c, i) {
      c.classList.add("reveal");
      c.style.transitionDelay = (i % 6) * 40 + "ms";
      io.observe(c);
    });
  };

  // Когда счётчики пришли впервые — пересортировать «Популярные»
  CI.onStats(function (first) {
    if (first && state.sort === "popular" && document.getElementById("grid")) renderGrid();
  });
})();
