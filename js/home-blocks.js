// Главная: витрины (Video Editor, игра с друзьями, Minecraft, игры, мессенджер). Данные — из ITEMS и CI.GAMES.
(function () {
  var CI = window.CI, esc = CI.esc, H = CI.home;
  var B = CI.homeBlocks = CI.homeBlocks || {};
  var link = function (id) { return "#/item/" + encodeURIComponent(id); };
  var li = function (arr) { return '<ul class="h-checks">' + arr.map(function (x) { return "<li>" + x + "</li>"; }).join("") + "</ul>"; };

  function mini(it, href) {
    return '<a class="h-mini" href="' + (href || link(it.id)) + '">' + CI.icon(it) +
      "<span><b>" + esc(it.name) + "</b><small>" + esc(it.short) + "</small></span></a>";
  }

  function editor() {
    var it = H.it("video-editor");
    return '<section class="h-show">' +
      '<div class="h-show-text"><span class="h-tag">' + esc(it.name) + (it.version ? " " + esc(it.version.replace(/\.0$/, "")) : "") + "</span>" +
      "<h2>Монтаж как в Premiere</h2><p>Панели и таймлайн как у профессионального редактора — но понятно с первого запуска. Перетащите видео в окно и монтируйте.</p>" +
      li(["Многодорожечный таймлайн, лезвие и умная привязка", "Титры с анимацией, переходы и цветокоррекция", "Вертикальное видео для Shorts, TikTok и Reels"]) +
      '<div class="h-cta"><a class="h-btn" href="' + link(it.id) + '">Подробнее и скачать</a></div></div>' +
      '<a class="h-show-img" href="' + link(it.id) + '" tabindex="-1" aria-hidden="true"><img src="img/video-editor/main.png" alt="" loading="lazy"></a></section>';
  }

  function friends() {
    return '<section class="h-show h-rev">' +
      '<div class="h-show-text"><span class="h-tag">Сеть</span><h2>Играй с друзьями</h2>' +
      "<p>Своя локальная сеть через интернет: Minecraft и LAN-игры видят друг друга, как дома за одним роутером. А для обхода блокировок — VPN в один клик.</p>" +
      '<div class="h-minis">' + mini(H.it("cisoft-lan")) + mini(H.it("cisoft-vpn")) + "</div></div>" +
      '<a class="h-show-img" href="' + link("cisoft-lan") + '" tabindex="-1" aria-hidden="true"><img src="img/cisoft-lan/main.png" alt="" loading="lazy"></a></section>';
  }

  function minecraft() {
    var skin = (CI.TOOLS || []).filter(function (t) { return t.id === "skin"; })[0];
    var list = [mini(H.it("mc-backup")), mini(H.it("mod-manager"))];
    if (skin) list.push(mini({ id: "skin", name: skin.name, short: skin.short, icon: (skin.dir || "") + "icon.png" }, "#/games/skin"));
    list.push(mini(H.it("mc-server-status")));
    return '<section class="h-sec h-mc">' + H.head("Для Minecraft", "Бэкапы миров, моды, скины и статус серверов", "#/catalog?type=games", "Всё для игр") +
      '<div class="h-mc-grid">' + list.join("") + "</div></section>";
  }

  function games() {
    var g = CI.GAMES || [];
    if (!g.length) return "";
    return '<section class="h-sec">' + H.head("Игры в браузере", "Без установки и рекламы — на компьютере и телефоне", "#/games", "Все игры") +
      '<div class="h-games">' + g.slice(0, 3).map(function (x) {
        return '<a class="h-game" href="#/games/' + esc(x.id) + '" style="--gc:' + esc(x.color) + '"><span class="h-cover"><img src="games/' + esc(x.id) + '/cover.png" alt="" loading="lazy"><em>▶ Играть</em></span>' +
          "<b>" + esc(x.name) + "</b><small>" + esc(x.short) + "</small></a>";
      }).join("") + "</div></section>";
  }

  function messenger() {
    var it = H.it("messenger");
    return '<section class="h-show h-msgr">' +
      '<div class="h-show-text"><span class="h-tag">Общение</span><h2>Мессенджер ' + esc(CI.SITE.name || "") + "</h2><p>" + esc(it.short) + "</p>" +
      li(["Работает прямо на сайте — ничего не нужно ставить", "Один аккаунт в браузере, на Windows и Android", "Видео- и аудиозвонки, группы до 50 человек"]) +
      '<div class="h-cta"><a class="h-btn" href="#/messenger">Открыть мессенджер</a><a class="h-btn h-btn2" href="' + link("messenger") + '">Скачать приложение</a></div></div>' +
      '<a class="h-show-img" href="#/messenger" tabindex="-1" aria-hidden="true"><img src="img/messenger/desktop.png" alt="" loading="lazy"></a></section>';
  }

  B.showcases = function () { return editor() + friends() + minecraft() + games() + messenger(); };
})();
