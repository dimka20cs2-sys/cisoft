// #/games — браузерные игры AkeeTech, #/games/<id> — игра на странице (iframe games/<id>/).
// Игры сообщают о себе через postMessage {type:'cisoft-game', id, event:'start'|'over', score}.
(function () {
  var CI = window.CI, esc = CI.esc, T = CI.t, N = CI.N_;

  CI.GAMES = [
    {
      id: "miner", name: N("Шахтёр"), color: "#3ddc84",
      short: N("Копай вглубь, собирай руды и не попади в лаву. Чем глубже — тем дороже алмазы."),
      how: [N("Стрелки или WASD — копать и ходить"), N("На телефоне — кнопки на экране"), N("Энергия кирки кончится — забег окончен"), N("За монеты покупай улучшения кирки и лампы")],
      unit: N("очков"),
    },
    {
      id: "space", name: N("Неоновый космос"), color: "#ff4fd8",
      short: N("Неоновый космический шутер: волны врагов, боссы каждые 5 волн и куча бонусов."),
      how: [N("Корабль стреляет сам — только уворачивайся"), N("Мышь, палец или стрелки — движение"), N("Esc или P — пауза"), N("В ангаре — улучшения и новые корабли")],
      unit: N("очков"),
    },
    {
      id: "jump", name: N("Прыжок в небо"), color: "#4f9cff",
      short: N("Прыгай всё выше: пружины, ранцы, ломающиеся платформы — от города до космоса."),
      how: [N("← → или A / D — влево и вправо"), N("На телефоне — нажимай на левую или правую половину экрана"), N("Прыгай на врагов сверху"), N("За монеты — скины и улучшения")],
      unit: N("м"),
    },
  ];

  // Веб-инструменты (без таблицы лидеров), открываются так же — в рамке на странице
  CI.TOOLS = [
    {
      id: "skin", name: "Skin Studio", color: "#3ddc84", dir: "tools/skin/", tool: true,
      short: N("Редактор скинов Minecraft с 3D-просмотром: рисуй прямо по модели, загружай скин по нику, скачивай PNG."),
      how: [N("Загрузите свой PNG, шаблон или скин по нику игрока"), N("Рисуйте на развёртке или прямо по 3D-модели"), N("Зеркало рисует сразу обе руки и ноги"), N("«Скачать PNG» — и ставьте скин в Minecraft или TLauncher")],
    },
  ];

  // Названия и описания — на языке сайта (русский оригинал хранится в _ru)
  function applyLang() {
    CI.GAMES.concat(CI.TOOLS).forEach(function (g) {
      if (!g._ru) g._ru = { name: g.name, short: g.short, how: g.how.slice(), unit: g.unit };
      g.name = T(g._ru.name); g.short = T(g._ru.short); g.unit = g._ru.unit == null ? g._ru.unit : T(g._ru.unit);
      g.how = g._ru.how.map(function (h) { return T(h); });
    });
  }
  applyLang();
  CI.onLang(applyLang);

  function game(id) { return CI.GAMES.concat(CI.TOOLS).filter(function (g) { return g.id === id; })[0]; }
  function dir(g) { return g.dir || "games/" + g.id + "/"; }
  function best(id) { try { return +localStorage.getItem("ci-game-best-" + id) || 0; } catch (e) { return 0; } }
  function fmt(n) { return Math.round(n).toLocaleString(CI.locale()); }

  function card(g) {
    var b = best(g.id);
    return '<a class="game-card" href="#/games/' + g.id + '" style="--gc:' + g.color + '">' +
      '<span class="game-cover"><img src="' + dir(g) + 'cover.png" alt="" loading="lazy"><span class="game-play">' + (g.tool ? "✎ " + T("Открыть") : "▶ " + T("Играть")) + "</span></span>" +
      '<span class="game-info"><img class="game-icon" src="' + dir(g) + 'icon.png" alt="">' +
      '<span><b>' + esc(g.name) + "</b><small>" + esc(g.short) + "</small>" +
      (b ? '<em class="game-best">' + T("Твой рекорд:") + ' ' + fmt(b) + " " + g.unit + "</em>" : "") + "</span></span></a>";
  }

  function pcGames() { return CI.ITEMS.filter(function (it) { return it.type === "pcgames"; }); }
  function pcCard(it) {
    var cover = it.screenshots && it.screenshots[0] ? it.screenshots[0].src : it.icon;
    return '<a class="game-card" href="#/item/' + esc(it.id) + '" style="--gc:#7c5cff">' +
      '<span class="game-cover"><img src="' + esc(cover) + '" alt="" loading="lazy"><span class="game-play">⬇ ' + T("Скачать") + '</span></span>' +
      '<span class="game-info"><img class="game-icon" src="' + esc(it.icon) + '" alt="">' +
      "<span><b>" + esc(it.name) + "</b><small>" + esc(it.short) + "</small>" +
      '<em class="game-best">Windows · v' + esc(it.version) + " · " + esc(it.size) + "</em></span></span></a>";
  }

  CI.renderGames = function () {
    document.title = T("Игры") + " — " + (CI.SITE.name || "");
    CI.app.innerHTML = '<section class="page-head"><h1>' + T("Игры") + '</h1><p>' + T("Игры AkeeTech для Windows и бесплатные игры прямо в браузере — на компьютере и на телефоне.") + '</p></section>' +
      '<h2 class="games-h2">' + T("Игры для ПК") + '</h2><p class="games-sub">' + T("Большие игры для Windows — скачайте и играйте. Скоро в Steam.") + '</p><div class="games-grid">' + pcGames().map(pcCard).join("") + "</div>" +
      '<h2 class="games-h2">' + T("Играть в браузере") + '</h2><div class="games-grid">' + CI.GAMES.map(card).join("") + "</div>" +
      (CI.TOOLS.length ? '<h2 class="games-h2">' + T("Инструменты для Minecraft") + '</h2><div class="games-grid">' + CI.TOOLS.map(card).join("") + "</div>" : "") +
      '<div id="games-top"></div>';
    if (CI.renderGamesTop) CI.renderGamesTop(document.getElementById("games-top"));
  };

  CI.renderGame = function (id) {
    var g = game(id);
    if (!g) { CI.renderGames(); return; }
    document.title = g.name + " — " + (CI.SITE.name || "");
    var src = dir(g), pool = g.tool ? CI.TOOLS : CI.GAMES;
    CI.app.innerHTML =
      '<div class="game-page" style="--gc:' + g.color + '">' +
      '<div class="game-bar' + (g.tool ? " is-tool" : "") + '"><a class="btn btn2" href="#/games">← ' + T("Все игры") + '</a><h1>' + esc(g.name) + "</h1>" +
      '<span class="game-best" id="game-best">' + (best(g.id) ? T("Рекорд:") + " " + fmt(best(g.id)) + " " + g.unit : "") + "</span>" +
      '<button class="btn btn2" id="game-full" type="button">⛶ ' + T("На весь экран") + '</button>' +
      '<a class="btn btn2" href="' + src + '" target="_blank" rel="noopener">↗ ' + T("Отдельно") + '</a></div>' +
      '<div class="game-frame" id="game-frame"><iframe src="' + src + '" title="' + esc(g.name) + '" allow="fullscreen; autoplay; gamepad" allowfullscreen></iframe></div>' +
      '<div class="game-side"><section><h2>' + (g.tool ? T("Как пользоваться") : T("Как играть")) + "</h2><ul>" + g.how.map(function (h) { return "<li>" + esc(h) + "</li>"; }).join("") + "</ul></section>" +
      (g.tool ? "" : '<section id="game-top"></section>') +
      '<section><h2>' + (g.tool ? T("Игры") : T("Другие игры")) + '</h2><div class="games-mini">' + CI.GAMES.filter(function (x) { return x !== g; }).map(function (x) {
        return '<a href="#/games/' + x.id + '"><img src="' + dir(x) + 'icon.png" alt=""><span>' + esc(x.name) + "</span></a>";
      }).join("") + "</div></section></div></div>";

    var frame = document.getElementById("game-frame");
    document.getElementById("game-full").onclick = function () {
      var el = frame;
      (el.requestFullscreen || el.webkitRequestFullscreen || function () {}).call(el);
    };
    var ifr = frame.querySelector("iframe");
    ifr.addEventListener("load", function () { try { ifr.contentWindow.focus(); } catch (e) {} });
    if (CI.renderGameTop && !g.tool) CI.renderGameTop(g, document.getElementById("game-top"));
  };

  // Итоги забега из iframe: локальный рекорд + (если есть) таблица лидеров
  window.addEventListener("message", function (e) {
    var d = e.data;
    if (!d || d.type !== "cisoft-game" || d.event !== "over" || !game(d.id)) return;
    var score = Math.floor(+d.score || 0);
    if (!(score > 0) || score > 1e9) return;
    var g = game(d.id), was = best(d.id);
    if (score > was) {
      try { localStorage.setItem("ci-game-best-" + d.id, String(score)); } catch (err) {}
      var el = document.getElementById("game-best");
      if (el) el.textContent = T("Рекорд:") + " " + fmt(score) + " " + g.unit;
      if (was) CI.toast(T("Новый рекорд:") + " " + fmt(score) + " " + g.unit + "!");
    }
    if (CI.submitGameScore) CI.submitGameScore(g, score);
  });
})();
