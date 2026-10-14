/* Неоновый космос — главный цикл, состояния, столкновения, очки */
(function () {
  'use strict';
  const SP = window.SP, C = SP.COL;
  const FX = SP.fx, P = SP.player, B = SP.bullets, E = SP.enemies, BS = SP.boss;
  const WV = SP.waves, PU = SP.pickups, A = SP.audio;
  const cv = document.getElementById('cv'), ctx = cv.getContext('2d');
  const wrap = document.getElementById('wrap');

  const G = SP.game = {
    state: 'menu', score: 0, shownScore: 0, combo: 0, mult: 1, multPop: 0, comboT: 0, comboFrac: 0,
    coins: 0, kills: 0, scale: 1, dpr: 1, dyingT: 0, god: SP.params.god === '1',
    startWave: Math.max(1, Math.min(50, parseInt(SP.params.wave, 10) || 1))
  };

  function post(ev, score) {
    try {
      if (window.parent && window.parent !== window) {
        const m = { type: 'cisoft-game', id: 'space', event: ev };
        if (score !== undefined) m.score = score;
        window.parent.postMessage(m, '*');
      }
    } catch (e) { /* ignore */ }
  }

  function resize() {
    const vw = window.innerWidth || 480, vh = window.innerHeight || 800;
    const w = Math.min(vw, Math.round(vh * 0.62)), h = vh;
    G.dpr = Math.min(3, window.devicePixelRatio || 1);
    G.scale = w / 480;
    SP.W = 480;
    SP.H = Math.max(640, Math.round(h / G.scale));
    wrap.style.width = w + 'px';
    wrap.style.height = h + 'px';
    wrap.style.setProperty('--u', SP.clamp(G.scale, 0.85, 1.25).toFixed(3));
    cv.style.width = w + 'px';
    cv.style.height = h + 'px';
    cv.width = Math.round(w * G.dpr);
    cv.height = Math.round(h * G.dpr);
    SP.setRes(G.scale * G.dpr);
    FX.initStars();
  }

  G.start = function () {
    A.init();
    B.clear(); E.clear(); BS.clear(); PU.clear(); FX.clear();
    G.score = G.shownScore = 0;
    G.combo = 0; G.mult = 1; G.comboT = 0; G.comboFrac = 0; G.coins = 0; G.kills = 0;
    P.reset();
    WV.start(G.startWave);
    G.state = 'play';
    wrap.classList.add('playing');
    SP.ui.show(null);
    post('start');
  };

  G.togglePause = function () {
    if (G.state === 'play') G.pause();
    else if (G.state === 'pause') G.resume();
  };
  G.pause = function () {
    if (G.state !== 'play') return;
    G.state = 'pause';
    wrap.classList.remove('playing');
    SP.ui.show('pause');
  };
  G.resume = function () {
    if (G.state !== 'pause') return;
    G.state = 'play';
    wrap.classList.add('playing');
    SP.ui.show(null);
    last = 0;
  };
  G.toMenu = function () {
    G.state = 'menu';
    wrap.classList.remove('playing');
    B.clear(); E.clear(); BS.clear(); PU.clear();
    SP.ui.show('start');
  };

  G.addScore = function (v, useMult) {
    G.score += Math.round(useMult === false ? v : v * G.mult);
  };

  function setMult() {
    const m = Math.min(5, 1 + Math.floor(G.combo / 8) * 0.5);
    if (m > G.mult) {
      G.multPop = 1;
      FX.text(P.x, P.y - 50, 'КОМБО x' + m.toFixed(1), m >= 4 ? C.yellow : C.pink, 20, 1);
    }
    G.mult = m;
  }

  G.onKill = function (e) {
    const d = e.d, big = e.type === 'tank';
    G.kills++;
    G.combo++;
    G.comboT = 4;
    setMult();
    const pts = Math.round(d.score * G.mult);
    G.score += pts;
    FX.text(e.x, e.y - 10, '+' + pts, d.color, big ? 20 : 15, 0.8);
    FX.burst(e.x, e.y, d.color, big ? 40 : 18, big ? 320 : 240, big ? 8 : 6, big ? 0.9 : 0.6);
    FX.burst(e.x, e.y, '#ffffff', big ? 10 : 5, 160, 4, 0.3);
    FX.ring(e.x, e.y, d.color, big ? 80 : 44, big ? 0.5 : 0.35, big ? 4 : 3);
    FX.shake(big ? 0.35 : 0.12);
    A.boom(big);
    if (Math.random() < d.coin) PU.coins(e.x, e.y, d.coins);
    if (Math.random() < (big ? 0.35 : 0.055)) PU.power(e.x, e.y);
  };

  G.onBossKill = function () {
    const pts = 5000 * BS.k;
    G.score += Math.round(pts * G.mult);
    FX.text(BS.x, BS.y, 'БОСС ПОВЕРЖЕН  +' + SP.fmt(pts * G.mult), BS.color, 22, 1.8);
    for (let i = 0; i < 6; i++) {
      FX.burst(BS.x + SP.rand(-70, 70), BS.y + SP.rand(-40, 40), i % 2 ? BS.color : '#ffffff', 26, 420, 9, 1.2);
    }
    FX.ring(BS.x, BS.y, BS.color, 260, 0.9, 6);
    FX.ring(BS.x, BS.y, '#ffffff', 160, 0.6, 3);
    FX.shake(1);
    FX.flash('#ffffff', 0.7);
    A.boom(true);
    PU.coins(BS.x, BS.y, 22 + BS.k * 6);
    PU.power(BS.x - 40, BS.y, 'shield');
    PU.power(BS.x + 40, BS.y);
    B.clearEnemy(true);
  };

  G.collect = function (p) {
    if (p.kind === 'coin') {
      G.coins += p.val;
      FX.burst(p.x, p.y, C.yellow, 4, 90, 4, 0.25);
      A.coin();
      return;
    }
    const d = SP.POWERS[p.kind];
    A.power();
    FX.text(P.x, P.y - 46, d.name, d.c, 18, 1.1);
    FX.ring(P.x, P.y, d.c, 60, 0.4, 3);
    if (p.kind === 'triple') P.triple = 12;
    else if (p.kind === 'shield') P.shield = Math.max(P.shield, 10);
    else if (p.kind === 'magnet') P.magnet = 12;
    else if (p.kind === 'laser') P.laser = 6;
    else G.bomb();
  };

  G.bomb = function () {
    FX.flash('#ffffff', 0.75);
    FX.shake(0.9);
    FX.ring(P.x, P.y, C.red, SP.H, 0.8, 8);
    FX.ring(P.x, P.y, '#ffffff', SP.H * 0.7, 0.6, 3);
    A.bomb();
    B.clearEnemy(true);
    const it = E.pool.items;
    for (let i = 0; i < it.length; i++) if (it[i].alive) E.damage(it[i], 60);
    if (BS.active) BS.damage(BS.max * 0.08);
  };

  G.hurt = function () {
    if (P.inv > 0 || G.state !== 'play' || G.god) return;
    P.lives--;
    G.combo = 0; G.mult = 1; G.comboT = 0;
    FX.shake(0.8);
    FX.flash(C.red, 0.4);
    FX.burst(P.x, P.y, SP.SKINS[P.skin].color, 30, 300, 7, 0.8);
    A.hurt();
    B.clearEnemy(true);
    if (P.lives <= 0) {
      P.alive = false;
      FX.burst(P.x, P.y, '#ffffff', 40, 420, 9, 1.2);
      FX.ring(P.x, P.y, SP.SKINS[P.skin].color, 180, 0.9, 6);
      A.boom(true);
      G.state = 'dying';
      G.dyingT = 1.6;
      wrap.classList.remove('playing');
    } else {
      P.inv = 2.2;
      FX.text(P.x, P.y - 40, 'ОСТАЛОСЬ ЖИЗНЕЙ: ' + P.lives, C.red, 16, 1);
    }
  };

  function finish() {
    G.state = 'over';
    const newBest = G.score > SP.best;
    if (newBest) SP.setBest(G.score);
    SP.save.coins += G.coins;
    SP.persist();
    A.over();
    SP.ui.showOver({ score: G.score, wave: WV.n, best: SP.best, newBest: newBest, coins: G.coins, kills: G.kills });
    post('over', G.score);
  }

  function update(dt) {
    const active = G.state === 'play' || G.state === 'dying';
    FX.updateBg(dt, G.state === 'pause' ? 0 : active ? (BS.active ? 1.4 : 1) : 0.45);
    if (active) {
      if (G.state === 'play') { P.update(dt); WV.update(dt); }
      E.update(dt); BS.update(dt); B.update(dt); PU.update(dt);
      SP.collide(dt);
      G.comboFrac = G.mult >= 5 ? 1 : (G.combo % 8) / 8;
      G.multPop = Math.max(0, G.multPop - dt * 3);
      G.shownScore += (G.score - G.shownScore) * Math.min(1, dt * 12);
      if (G.score - G.shownScore < 1) G.shownScore = G.score;
      if (G.state === 'dying') { G.dyingT -= dt; if (G.dyingT <= 0) finish(); }
    }
    if (G.state !== 'pause') FX.update(dt);
  }

  function draw() {
    const k = G.scale * G.dpr;
    ctx.setTransform(k, 0, 0, k, 0, 0);
    FX.drawBg(ctx, G.state === 'play' || G.state === 'dying' ? (BS.active ? 1.4 : 1) : 0.45);
    if (G.state !== 'menu') {
      ctx.save();
      ctx.translate(FX.ox, FX.oy);
      PU.draw(ctx); E.draw(ctx); BS.draw(ctx); B.draw(ctx); P.draw(ctx);
      FX.draw(ctx); FX.drawTexts(ctx);
      ctx.restore();
      SP.hud.draw(ctx, G);
    } else {
      FX.draw(ctx);
    }
    FX.drawFlash(ctx);
  }

  let last = 0;
  function frame(ts) {
    requestAnimationFrame(frame);
    const dt = last ? Math.min(0.033, (ts - last) / 1000) : 0.016;
    last = ts;
    update(dt);
    draw();
  }

  window.addEventListener('resize', resize);
  document.addEventListener('visibilitychange', () => { if (document.hidden) G.pause(); });
  window.addEventListener('blur', () => G.pause());
  resize();
  SP.ui.show('start');
  requestAnimationFrame(frame);
})();
