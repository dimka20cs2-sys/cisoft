// #/ — главная (лендинг): герой, цифры, популярное, разделы. Остальные блоки — js/home-blocks.js.
(function () {
  var CI = window.CI, esc = CI.esc;
  var H = CI.home = {};
  var FIXED = ["video-editor", "cisoft-lan", "cisoft-vpn", "mod-manager", "pc-monitor", "screen-recorder"];
  var EMOJI = { pro: "⭐", system: "🖥️", admin: "🛠️", games: "⛏️", social: "💬", vpn: "🛡️", media: "🎬", android: "🤖", modpack: "📦", config: "⚙️", other: "✨" };

  H.it = function (id) { return CI.byId(id) || { id: id, name: id, short: "" }; };
  H.head = function (title, sub, link, linkText) {
    return '<div class="h-head"><div><h2>' + title + "</h2>" + (sub ? "<p>" + sub + "</p>" : "") + "</div>" +
      (link ? '<a class="h-more" href="' + link + '">' + linkText + " →</a>" : "") + "</div>";
  };
  H.counts = function () {
    var c = {};
    CI.ITEMS.forEach(function (it) { c[it.type] = (c[it.type] || 0) + 1; });
    return c;
  };

  function hero() {
    var ico = function (id, cls) { var it = H.it(id); return it.icon ? '<img class="h-float ' + cls + '" src="' + esc(it.icon) + '" alt="">' : ""; };
    var newest = CI.byId("video-editor");
    return '<section class="h-hero"><div class="h-bg" aria-hidden="true"></div>' +
      '<div class="h-hero-text"><span class="h-eyebrow"><i></i>Бесплатно · без рекламы · на русском</span>' +
      '<h1><span class="h-grad">' + esc(CI.SITE.name || "CISOFT") + "</span> — полезные программы для Windows, Android и Minecraft</h1>" +
      "<p>Небольшие быстрые программы без рекламы и сбора данных. Pro-версии — только по желанию. А ещё свой мессенджер и игры прямо в браузере.</p>" +
      '<div class="h-cta"><a class="h-btn" href="#/catalog">Смотреть программы</a><a class="h-btn h-btn2" href="#/games">▶ Играть в браузере</a></div>' +
      "</div>" +
      '<div class="h-collage" aria-hidden="true">' +
        '<div class="h-shot"><div class="h-dots"><i></i><i></i><i></i><span>' + esc(H.it("video-editor").name) + "</span></div>" +
        '<img src="img/video-editor/main.png" alt=""></div>' +
        ico("cisoft-lan", "f1") + ico("pc-monitor", "f2") + ico("mod-manager", "f3") + ico("messenger", "f4") +
        (newest ? '<a class="h-new" href="#/item/' + encodeURIComponent(newest.id) + '" tabindex="-1"><b>Новое</b>' + esc(newest.name) + (newest.version ? " " + esc(newest.version.replace(/\.0$/, "")) : "") + "</a>" : "") +
      "</div></section>";
  }

  function dlTile() {
    if (!CI.statsOk || !CI.totalDownloads()) return '<b>$0</b><span>за бесплатные версии</span>';
    var d = CI.totalDownloads();
    return "<b>" + CI.num(d) + "</b><span>" + CI.plural(d, "скачивание", "скачивания", "скачиваний") + "</span>";
  }
  function numbers() {
    var n = CI.ITEMS.length, g = (CI.GAMES || []).length, t = Object.keys(H.counts()).length;
    return '<section class="h-nums">' +
      "<div><b>" + n + "</b><span>" + CI.plural(n, "программа", "программы", "программ") + "</span></div>" +
      "<div><b>" + g + "</b><span>" + CI.plural(g, "игра", "игры", "игр") + " в браузере</span></div>" +
      "<div><b>" + t + "</b><span>" + CI.plural(t, "раздел", "раздела", "разделов") + "</span></div>" +
      '<div id="h-dl">' + dlTile() + "</div></section>";
  }

  function popularList() {
    var top = [];
    if (CI.statsOk) top = CI.ITEMS.filter(function (it) { return CI.st(it.id).downloads > 0; })
      .sort(function (a, b) { return CI.st(b.id).downloads - CI.st(a.id).downloads; }).slice(0, 6);
    FIXED.forEach(function (id) { var it = CI.byId(id); if (it && top.length < 6 && top.indexOf(it) < 0) top.push(it); });
    return top;
  }
  function popular() {
    return '<section class="h-sec">' + H.head("Популярное", "Программы, которые выбирают чаще всего", "#/catalog?sort=popular", "Весь каталог") +
      '<div class="grid h-grid" id="h-pop">' + popularList().map(CI.card).join("") + "</div></section>";
  }

  function types() {
    var c = H.counts(), keys = Object.keys(CI.TYPES).filter(function (t) { return c[t]; });
    return '<section class="h-sec">' + H.head("Разделы", "Выберите, что нужно — откроется каталог с фильтром") + '<div class="h-types">' +
      keys.map(function (t) {
        var icons = CI.ITEMS.filter(function (it) { return it.type === t && it.icon; }).slice(0, 3);
        return '<a class="h-type t-' + esc(t) + '" href="#/catalog?type=' + encodeURIComponent(t) + '"><span class="h-emoji">' + (EMOJI[t] || "📁") + "</span>" +
          "<b>" + esc(CI.TYPES[t]) + "</b><small>" + c[t] + " " + CI.plural(c[t], "программа", "программы", "программ") + "</small>" +
          '<span class="h-stack">' + icons.map(function (it) { return '<img src="' + esc(it.icon) + '" alt="">'; }).join("") + "</span></a>";
      }).join("") + "</div></section>";
  }

  CI.renderHome = function () {
    document.title = "CISOFT — программы для Windows, Android и Minecraft";
    var B = CI.homeBlocks || {}, part = function (fn) { return fn ? fn() : ""; };
    CI.app.innerHTML = '<div class="home">' + hero() + numbers() + popular() + types() +
      part(B.showcases) + part(B.pro) + part(B.why) + part(B.updates) + part(B.faq) + part(B.cta) + "</div>";
    var pop = document.getElementById("h-pop");
    CI.paintStats(pop);
    CI.reveal(pop);
  };

  // Пришли счётчики: обновить плитку скачиваний и (в первый раз) список популярного
  CI.onStats(function (first) {
    var dl = document.getElementById("h-dl");
    if (dl) dl.innerHTML = dlTile();
    var pop = document.getElementById("h-pop");
    if (first && pop) { pop.innerHTML = popularList().map(CI.card).join(""); CI.paintStats(pop); }
  });
})();
