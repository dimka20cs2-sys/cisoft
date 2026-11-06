// #/minecraft — «Плюшки для Minecraft»: все программы, приложения и веб-инструменты для майна на одной странице.
// Оформление — css/minecraft.css (стиль Minecraft, дизайн от Gemini). Список программ — по id из items.js.
(function () {
  var CI = window.CI, esc = CI.esc;

  var SECTIONS = [
    { id: "pc", title: "Для ПК", sub: "Сервер, моды, бэкапы миров и игра с друзьями", block: "grass",
      ids: ["crafthost", "mod-manager", "mc-backup", "cisoft-lan", "playhub"] },
    { id: "phone", title: "Для телефона", sub: "Калькуляторы и проверка серверов в кармане", block: "diamond",
      ids: ["craftcalc", "mc-server-status"] },
  ];

  function byId(id) { return CI.ITEMS.filter(function (it) { return it.id === id; })[0]; }

  function toolCard() {
    var t = (CI.TOOLS || []).filter(function (x) { return x.id === "skin"; })[0];
    if (!t) return "";
    return '<a class="mc-tool" href="#/games/skin">' +
      '<img class="mc-tool-img" src="tools/skin/cover.png" alt="" loading="lazy">' +
      '<div class="mc-tool-body"><h3>' + esc(t.name) + '</h3><p>' + esc(t.short) + '</p>' +
      '<span class="mc-btn">Открыть в браузере</span></div></a>';
  }

  CI.renderMinecraft = function () {
    document.title = "Плюшки для Minecraft — " + (CI.SITE.name || "");
    var total = 0;
    var html = '<div class="mc-page">' +
      '<section class="mc-hero">' +
        '<div class="mc-hero-text">' +
          '<span class="mc-tag">Minecraft</span>' +
          '<h1>Плюшки для майна</h1>' +
          '<p>Всё для Minecraft от ' + esc(CI.SITE.name || "") + ' в одном месте: свой сервер, моды и сборки, бэкапы миров, ' +
          'редактор скинов, калькуляторы и игра с друзьями по сети.</p>' +
        '</div>' +
        '<div class="mc-hero-art" aria-hidden="true"></div>' +
      '</section>';

    SECTIONS.forEach(function (s) {
      var items = s.ids.map(byId).filter(Boolean);
      if (!items.length) return;
      total += items.length;
      html += '<section class="mc-sec" data-block="' + s.block + '" id="mc-' + s.id + '">' +
        '<div class="mc-sec-head"><span class="mc-block" data-block="' + s.block + '"></span>' +
        '<div><h2>' + esc(s.title) + '</h2><p>' + esc(s.sub) + '</p></div></div>' +
        '<div class="grid mc-grid">' + items.map(CI.card).join("") + '</div></section>';
    });

    var tool = toolCard();
    if (tool) {
      total++;
      html += '<section class="mc-sec" data-block="crafting" id="mc-web">' +
        '<div class="mc-sec-head"><span class="mc-block" data-block="crafting"></span>' +
        '<div><h2>Прямо в браузере</h2><p>Ничего не нужно устанавливать</p></div></div>' + tool + '</section>';
    }

    html += '<p class="mc-count">Всего плюшек: ' + total + '</p></div>';
    CI.app.innerHTML = html;
    CI.app.querySelectorAll(".mc-grid").forEach(function (g) { CI.paintStats(g); CI.reveal(g); });
  };
})();
