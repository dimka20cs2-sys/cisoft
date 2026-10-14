'use strict';
// Главный цикл, состояния игры, камера, автопауза
(function (M) {
  var cv = document.getElementById('cv');
  var R = new M.Renderer(cv);
  var G = M.game = { state: 'menu', world: null, player: null, cam: { x: M.W / 2, y: 1 }, time: 0, run: null, ending: false, endT: 0 };
  M.renderer = R;

  function resize() {
    var w = cv.clientWidth || window.innerWidth, h = cv.clientHeight || window.innerHeight;
    R.resize(w, h, Math.min(window.devicePixelRatio || 1, 3));
  }
  window.addEventListener('resize', resize);
  window.addEventListener('orientationchange', function () { setTimeout(resize, 200); });
  resize();

  function freshWorld() {
    G.world = new M.World((Math.random() * 1e9) | 0);
    G.player = new M.Player(Math.floor(M.W / 2), -1, M.stats());
    G.cam.x = G.player.px + 0.5;
    G.cam.y = G.player.py + 2;
  }

  G.score = function () { return G.run ? G.run.ore + G.run.depth * 2 : 0; };

  G.start = function () {
    M.audio.unlock();
    freshWorld();
    G.run = { ore: 0, depth: 0, found: {}, cause: '' };
    G.ending = false;
    M.fx.reset();
    M.input.clear();
    M.ui.resetHud();
    G.state = 'play';
    M.ui.show(null);
    M.ui.hud(G.player, G.run, 0);
    M.post('start');
    M.audio.play('start');
  };

  G.pause = function () {
    if (G.state !== 'play' || G.ending) return;
    G.state = 'pause';
    M.input.clear();
    M.ui.show('pause');
  };
  G.resume = function () {
    if (G.state !== 'pause') return;
    G.state = 'play';
    M.ui.show(null);
  };

  G.end = function (cause, now) {
    if (!G.run || G.ending || (G.state !== 'play' && G.state !== 'pause')) return;
    G.run.cause = cause;
    G.ending = true;
    G.endT = now ? 0 : cause === 'lava' ? 1.5 : 1.1;
    M.input.clear();
    if (now) finish();
  };

  function finish() {
    var r = G.run, score = G.score(), coins = r.ore;
    G.state = 'over';
    M.save.coins += coins;
    M.persist();
    var rec = score > M.best;
    if (rec) { M.best = score; M.store.set('best', score); }
    M.audio.play('over');
    M.post('over', score);
    M.ui.showOver({ cause: r.cause, score: score, record: rec, ore: r.ore, depth: r.depth, coins: coins });
  }

  G.toMenu = function () {
    G.state = 'menu';
    G.run = null;
    G.ending = false;
    M.fx.reset();
    freshWorld();
    M.ui.prev = 'start';
    M.ui.show('start');
  };

  G.gravelHit = function (f) {
    M.fx.burst(f.x, f.y + 0.3, M.DEF[M.B.GRAVEL].col, 18, 4);
    M.audio.play('land');
    G.player.hurt(G, 22);
  };

  M.input.onAny = function () { M.audio.unlock(); };
  M.input.onPause = function () {
    if (G.state === 'play') G.pause();
    else if (G.state === 'pause') G.resume();
  };
  M.input.onTorch = function () { if (G.state === 'play' && !G.ending) G.player.placeTorch(G); };

  // автопауза при потере фокуса
  document.addEventListener('visibilitychange', function () { if (document.hidden) G.pause(); });
  window.addEventListener('blur', function () { G.pause(); });

  function update(dt) {
    var p = G.player;
    if (!G.ending) p.update(dt, G);
    else if (p.dead) p.deadT += dt;
    G.world.update(dt, G);
    if (!p.dead && G.world.isLava(p.gx, p.gy)) p.die(G);
    M.fx.update(dt, G.world);
    M.ui.hud(p, G.run, G.score());
    if (G.ending) {
      G.endT -= dt;
      if (G.endT <= 0 && G.state === 'play') finish();
    }
  }

  function camera(dt) {
    var p = G.player, S = R.S, viewW = R.cv.width / S, tx, ty;
    if (G.state === 'menu') {
      tx = M.W / 2 + Math.sin(G.time * 0.15) * 3;
      ty = 0.4;
    } else {
      tx = p.px + 0.5;
      ty = p.py + 0.5 + (p.gy >= 0 ? 1.2 : 0.8);
    }
    if (viewW >= M.W + 2) tx = M.W / 2;
    else tx = M.clamp(tx, viewW / 2 - 1, M.W + 1 - viewW / 2);
    var k = 1 - Math.exp(-dt * 7);
    G.cam.x += (tx - G.cam.x) * k;
    G.cam.y += (ty - G.cam.y) * k;
  }

  var last = performance.now();
  function frame(now) {
    var dt = Math.min(0.05, Math.max(0, (now - last) / 1000));
    last = now;
    G.time += dt;
    try {
      if (G.state === 'play') update(dt);
      else if (G.state !== 'pause') M.fx.update(dt, G.world);
      if (G.state !== 'pause') camera(dt);
      R.draw(G, G.time);
    } catch (e) {
      if (window.console) console.error(e);
    }
    requestAnimationFrame(frame);
  }

  freshWorld();
  G.cam.x = M.W / 2; G.cam.y = 1.2;
  M.ui.show('start');
  requestAnimationFrame(frame);
})(window.M);
