/* Неоновый космос — пули игрока и врагов (пулы) */
(function () {
  'use strict';
  const SP = window.SP;
  const mk = () => ({ alive: false, x: 0, y: 0, vx: 0, vy: 0, dmg: 1, col: '#fff', r: 5 });
  const B = SP.bullets = {
    pl: new SP.Pool(mk, 160, 400),
    en: new SP.Pool(mk, 200, 600)
  };

  B.fire = function (x, y, vx, vy, dmg, col) {
    const b = B.pl.get();
    b.x = x; b.y = y; b.vx = vx; b.vy = vy; b.dmg = dmg; b.col = col; b.r = 4;
  };

  B.enemy = function (x, y, vx, vy, col, r) {
    const b = B.en.get();
    b.x = x; b.y = y; b.vx = vx; b.vy = vy; b.col = col || SP.COL.orange; b.r = r || 5;
  };

  /* Выстрел по игроку с разбросом: n пуль веером */
  B.aimed = function (x, y, speed, col, n, spread, r) {
    const P = SP.player;
    const a0 = Math.atan2(P.y - y, P.x - x);
    n = n || 1;
    for (let i = 0; i < n; i++) {
      const a = a0 + (n > 1 ? (i / (n - 1) - 0.5) * spread : 0);
      B.enemy(x, y, Math.cos(a) * speed, Math.sin(a) * speed, col, r);
    }
  };

  function move(pool, dt) {
    const it = pool.items;
    for (let i = 0; i < it.length; i++) {
      const b = it[i];
      if (!b.alive) continue;
      b.x += b.vx * dt;
      b.y += b.vy * dt;
      if (b.y < -30 || b.y > SP.H + 30 || b.x < -30 || b.x > SP.W + 30) b.alive = false;
    }
  }

  B.update = function (dt) {
    move(B.pl, dt);
    move(B.en, dt);
  };

  B.draw = function (ctx) {
    ctx.globalCompositeOperation = 'lighter';
    let it = B.pl.items;
    for (let i = 0; i < it.length; i++) {
      const b = it[i];
      if (!b.alive) continue;
      ctx.drawImage(SP.glow(b.col).c, b.x - 7, b.y - 17, 14, 34);
    }
    it = B.en.items;
    for (let i = 0; i < it.length; i++) {
      const b = it[i];
      if (!b.alive) continue;
      const s = b.r * 3.2;
      ctx.drawImage(SP.glow(b.col).c, b.x - s, b.y - s, s * 2, s * 2);
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = '#ffffff';
    it = B.pl.items;
    for (let i = 0; i < it.length; i++) {
      const b = it[i];
      if (b.alive) ctx.fillRect(b.x - 1, b.y - 8, 2, 14);
    }
    // ядро вражеских пуль — светлый круг для читаемости
    ctx.beginPath();
    it = B.en.items;
    for (let i = 0; i < it.length; i++) {
      const b = it[i];
      if (!b.alive) continue;
      ctx.moveTo(b.x + b.r * 0.6, b.y);
      ctx.arc(b.x, b.y, b.r * 0.6, 0, Math.PI * 2);
    }
    ctx.fill();
  };

  /* Убрать вражеские пули (бомба, получение урона) */
  B.clearEnemy = function (fx) {
    const it = B.en.items;
    for (let i = 0; i < it.length; i++) {
      const b = it[i];
      if (!b.alive) continue;
      b.alive = false;
      if (fx && Math.random() < 0.5) SP.fx.burst(b.x, b.y, b.col, 2, 80, 4, 0.3);
    }
  };

  B.clear = function () { B.pl.clear(); B.en.clear(); };
})();
