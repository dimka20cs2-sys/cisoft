// #/games — браузерные игры CISOFT, #/games/<id> — игра на странице (iframe games/<id>/).
// Игры сообщают о себе через postMessage {type:'cisoft-game', id, event:'start'|'over', score}.
(function () {
  var CI = window.CI, esc = CI.esc;

  CI.GAMES = [
    {
      id: "miner", name: "Шахтёр", color: "#3ddc84",
      short: "Копай вглубь, собирай руды и не попади в лаву. Чем глубже — тем дороже алмазы.",
      how: ["Стрелки или WASD — копать и ходить", "На телефоне — кнопки на экране", "Энергия кирки кончится — забег окончен", "За монеты покупай улучшения кирки и лампы"],
      unit: "очков",
    },
    {
      id: "space", name: "Неоновый космос", color: "#ff4fd8",
      short: "Неоновый космический шутер: волны врагов, боссы каждые 5 волн и куча бонусов.",
      how: ["Корабль стреляет сам — только уворачивайся", "Мышь, палец или стрелки — движение", "Esc или P — пауза", "В ангаре — улучшения и новые корабли"],
      unit: "очков",
    },
    {
      id: "jump", name: "Прыжок в небо", color: "#4f9cff",
      short: "Прыгай всё выше: пружины, ранцы, ломающиеся платформы — от города до космоса.",
      how: ["← → или A / D — влево и вправо", "На телефоне — нажимай на левую или правую половину экрана", "Прыгай на врагов сверху", "За монеты — скины и улучшения"],
      unit: "м",
    },
  ];

  function game(id) { return CI.GAMES.filter(function (g) { return g.id === id; })[0]; }
  function best(id) { try { return +localStorage.getItem("ci-game-best-" + id) || 0; } catch (e) { return 0; } }
  function fmt(n) { return Math.round(n).toLocaleString("ru-RU"); }

  function card(g) {
    var b = best(g.id);
    return '<a class="game-card" href="#/games/' + g.id + '" style="--gc:' + g.color + '">' +
      '<span class="game-cover"><img src="games/' + g.id + '/cover.png" alt="" loading="lazy"><span class="game-play">▶ Играть</span></span>' +
      '<span class="game-info"><img class="game-icon" src="games/' + g.id + '/icon.png" alt="">' +
      '<span><b>' + esc(g.name) + "</b><small>" + esc(g.short) + "</small>" +
      (b ? '<em class="game-best">Твой рекорд: ' + fmt(b) + " " + g.unit + "</em>" : "") + "</span></span></a>";
  }

  CI.renderGames = function () {
    document.title = "Игры — " + (CI.SITE.name || "");
    CI.app.innerHTML = '<section class="page-head"><h1>Игры</h1><p>Бесплатные игры прямо в браузере — на компьютере и на телефоне. Без установки и без рекламы.</p></section>' +
      '<div class="games-grid">' + CI.GAMES.map(card).join("") + "</div>" +
      '<div id="games-top"></div>';
    if (CI.renderGamesTop) CI.renderGamesTop(document.getElementById("games-top"));
  };

  CI.renderGame = function (id) {
    var g = game(id);
    if (!g) { CI.renderGames(); return; }
    document.title = g.name + " — " + (CI.SITE.name || "");
    var src = "games/" + g.id + "/";
    CI.app.innerHTML =
      '<div class="game-page" style="--gc:' + g.color + '">' +
      '<div class="game-bar"><a class="btn btn2" href="#/games">← Все игры</a><h1>' + esc(g.name) + "</h1>" +
      '<span class="game-best" id="game-best">' + (best(g.id) ? "Рекорд: " + fmt(best(g.id)) + " " + g.unit : "") + "</span>" +
      '<button class="btn btn2" id="game-full" type="button">⛶ На весь экран</button>' +
      '<a class="btn btn2" href="' + src + '" target="_blank" rel="noopener">↗ Отдельно</a></div>' +
      '<div class="game-frame" id="game-frame"><iframe src="' + src + '" title="' + esc(g.name) + '" allow="fullscreen; autoplay; gamepad" allowfullscreen></iframe></div>' +
      '<div class="game-side"><section><h2>Как играть</h2><ul>' + g.how.map(function (h) { return "<li>" + esc(h) + "</li>"; }).join("") + "</ul></section>" +
      '<section id="game-top"></section>' +
      '<section><h2>Другие игры</h2><div class="games-mini">' + CI.GAMES.filter(function (x) { return x !== g; }).map(function (x) {
        return '<a href="#/games/' + x.id + '"><img src="games/' + x.id + '/icon.png" alt=""><span>' + esc(x.name) + "</span></a>";
      }).join("") + "</div></section></div></div>";

    var frame = document.getElementById("game-frame");
    document.getElementById("game-full").onclick = function () {
      var el = frame;
      (el.requestFullscreen || el.webkitRequestFullscreen || function () {}).call(el);
    };
    var ifr = frame.querySelector("iframe");
    ifr.addEventListener("load", function () { try { ifr.contentWindow.focus(); } catch (e) {} });
    if (CI.renderGameTop) CI.renderGameTop(g, document.getElementById("game-top"));
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
      if (el) el.textContent = "Рекорд: " + fmt(score) + " " + g.unit;
      if (was) CI.toast("Новый рекорд: " + fmt(score) + " " + g.unit + "!");
    }
    if (CI.submitGameScore) CI.submitGameScore(g, score);
  });
})();
