'use strict';
/* Главный цикл, состояния игры, камера, рендер */
(function (J) {
  var gameEl = document.getElementById('game');
  var cv = document.getElementById('cv');
  var ctx = cv.getContext('2d');
  var dpr = 1, scale = 1;

  var G = J.game = {
    state: 'menu', world: null, player: null, camY: 0, maxH: 0, startH: 0,
    t: 0, dieT: 0, best0: 0
  };
  window.__jump = G; // для автотестов

  function resize() {
    var vw = window.innerWidth, vh = window.innerHeight;
    var gw, gh;
    if (vw / vh > 9 / 16) { gh = vh; gw = Math.round(vh * 9 / 16); } else { gw = vw; gh = vh; }
    gameEl.style.width = gw + 'px';
    gameEl.style.height = gh + 'px';
    scale = gw / J.W;
    var oldH = J.H;
    J.H = gh / scale;
    if (G.player && G.state === 'menu') G.camY += oldH - J.H;
    dpr = Math.min(window.devicePixelRatio || 1, 3);
    cv.width = Math.round(gw * dpr);
    cv.height = Math.round(gh * dpr);
  }

  function newRun() {
    var h = Math.max(0, +J.params.h || 0);
    G.startH = h;
    var startY = -h * J.PX_PER_M;
    G.world = new J.World(startY);
    G.player = new J.Player(J.W / 2, startY);
    G.camY = startY - J.H + 110;
    G.maxH = h;
    G.dieT = 0;
    G.best0 = J.save.best;
    J.fx.reset();
    G.world.generate(G.camY - J.H);
  }

  G.start = function () {
    J.sfx.unlock();
    newRun();
    var sj = J.startJetDur();
    if (sj > 0) G.player.givePower('jet', sj);
    G.state = 'play';
    J.input.reset();
    J.ui.show(null);
    J.ui.touchHint();
    J.save.games++;
    J.persist();
    J.notifyParent('start');
  };
  G.pause = function () {
    if (G.state !== 'play') return;
    G.state = 'pause';
    J.sfx.engine(null);
    J.ui.pauseInfo(Math.floor(G.maxH));
    J.ui.show('pause');
  };
  G.resume = function () {
    if (G.state !== 'pause') return;
    G.state = 'play';
    J.input.reset();
    J.ui.show(null);
    last = performance.now();
  };
  G.toMenu = function () {
    J.sfx.engine(null);
    G.state = 'menu';
    newRun();
    J.ui.show('menu');
  };
  function gameOver() {
    G.state = 'over';
    J.sfx.engine(null);
    var h = Math.floor(G.maxH);
    var coins = G.world.coinsGot;
    var record = h > Math.floor(G.best0) && h > 0;
    if (h > J.save.best) J.save.best = h;
    J.save.coins += coins;
    J.persist();
    J.sfx.play(record ? 'record' : 'over');
    J.notifyParent('over', h);
    setTimeout(function () {
      if (G.state === 'over') J.ui.showOver({ h: h, coins: coins, record: record });
    }, 350);
  }

  function update(dt) {
    var p = G.player, w = G.world;
    var playing = G.state === 'play';
    var dir = playing ? J.input.dir() : 0;
    var steps = Math.ceil(dt / (1 / 120));
    var h = dt / steps;
    for (var i = 0; i < steps; i++) {
      var prevY = p.y;
      p.update(h, dir);
      w.collide(p, prevY, h);
    }
    w.update(dt, p);
    J.fx.update(dt);

    // камера идёт только вверх
    if (!p.dead) {
      var target = p.y - J.H * 0.45;
      if (target < G.camY) G.camY += (target - G.camY) * Math.min(1, dt * 14);
      if (p.y - G.camY < 40) G.camY = p.y - 40;
      G.maxH = Math.max(G.maxH, -p.y / J.PX_PER_M);
    }
    if (playing) {
      J.sfx.engine(p.power);
      w.generate(G.camY - J.H * 0.7);
      w.cleanup(G.camY + J.H + 160);
      if (!p.dead && p.y > G.camY + J.H + 30) {
        p.kill('fall');
        J.sfx.play('fall');
      }
      if (p.dead) {
        G.dieT += dt;
        if ((p.dead === 'fall' || p.dead === 'hit') && G.dieT < 0.45) {
          // камера чуть провожает падение
          var tgt = p.y - J.H * 0.55;
          if (tgt > G.camY) G.camY += (tgt - G.camY) * Math.min(1, dt * 4);
        }
        var done = p.dead === 'hole' ? G.dieT > 1.0 : (p.y > G.camY + J.H + 40 && G.dieT > 0.6);
        if (done || G.dieT > 3) gameOver();
      }
      J.ui.hud(Math.floor(G.maxH), w.coinsGot);
    }
  }

  function powerBars(ctx) {
    var p = G.player, bars = [];
    if (p.power) bars.push([p.power === 'jet' ? 'Ранец' : 'Пропеллер', p.powerT / p.powerMax, '#ffb23d']);
    if (p.shieldT > 0) bars.push(['Щит', p.shieldT / p.shieldMax, '#7fe8ff']);
    if (p.magnetT > 0) bars.push(['Магнит', p.magnetT / p.magnetMax, '#ff5a5a']);
    var y = 90;
    ctx.font = 'bold 11px system-ui, -apple-system, Segoe UI, Roboto, sans-serif';
    ctx.textAlign = 'left';
    for (var i = 0; i < bars.length; i++) {
      var b = bars[i];
      ctx.fillStyle = 'rgba(17,18,23,0.55)';
      J.roundRect(ctx, 12, y, 110, 24, 8); ctx.fill();
      ctx.fillStyle = b[2];
      J.roundRect(ctx, 18, y + 16, 98 * J.clamp(b[1], 0, 1), 4, 2); ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.fillText(b[0], 18, y + 12);
      y += 28;
    }
  }

  function render() {
    var T = G.t;
    ctx.setTransform(scale * dpr, 0, 0, scale * dpr, 0, 0);
    J.bg.draw(ctx, G.camY, T);
    var sh = J.fx.shakeOffset();
    ctx.save();
    ctx.translate(sh[0], sh[1] - G.camY);
    var top = G.camY - 60, bot = G.camY + J.H + 60, w = G.world, i;
    J.drawMarks(ctx, G.camY, G.best0, T);
    for (i = 0; i < w.platforms.length; i++) {
      var pl = w.platforms[i];
      if (pl.y > top && pl.y < bot + (pl.type === 'ground' ? 400 : 0)) J.draw.platform(ctx, pl, T);
    }
    for (i = 0; i < w.coins.length; i++) if (!w.coins[i].taken && w.coins[i].y > top && w.coins[i].y < bot) J.draw.coin(ctx, w.coins[i]);
    for (i = 0; i < w.items.length; i++) if (!w.items[i].taken && w.items[i].y > top && w.items[i].y < bot) J.draw.item(ctx, w.items[i], T);
    for (i = 0; i < w.enemies.length; i++) if (w.enemies[i].y > top - 40 && w.enemies[i].y < bot) J.drawEnemy(ctx, w.enemies[i], T);
    G.player.draw(ctx, J.skinById(J.save.skin));
    J.fx.draw(ctx);
    ctx.restore();
    if (G.state === 'play' || G.state === 'pause') powerBars(ctx);
  }

  var last = performance.now();
  function frame(now) {
    var dt = Math.min(0.05, Math.max(0, (now - last) / 1000));
    last = now;
    if (G.state !== 'pause') {
      G.t += dt;
      update(dt);
    }
    render();
    requestAnimationFrame(frame);
  }

  function autoPause() { if (G.state === 'play') G.pause(); }
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) { autoPause(); J.sfx.engine(null); }
  });
  window.addEventListener('blur', autoPause);

  window.addEventListener('resize', resize);
  resize();
  J.input.init(cv, {
    pause: function () {
      if (G.state === 'play') G.pause();
      else if (G.state === 'pause') G.resume();
    },
    confirm: function (e) {
      if (e.target && e.target.tagName === 'BUTTON') return false;
      var s = J.ui.current();
      if (s === 'menu' || (s === 'over' && G.state === 'over')) { J.sfx.unlock(); G.start(); return true; }
      return false;
    },
    any: function () { J.sfx.unlock(); }
  });
  J.ui.init(G);
  newRun();
  J.ui.show('menu');
  requestAnimationFrame(frame);
})(window.J);
