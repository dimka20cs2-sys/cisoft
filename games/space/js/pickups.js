/* Неоновый космос — монеты и бонусы */
(function () {
  'use strict';
  const SP = window.SP, C = SP.COL;

  SP.POWERS = {
    triple: { c: C.blue, name: 'ТРОЙНОЙ ВЫСТРЕЛ', short: 'Тройной' },
    shield: { c: C.green, name: 'ЩИТ', short: 'Щит' },
    magnet: { c: C.yellow, name: 'МАГНИТ', short: 'Магнит' },
    bomb: { c: C.red, name: 'БОМБА!', short: 'Бомба' },
    laser: { c: C.pink, name: 'ЛАЗЕР', short: 'Лазер' }
  };
  const KINDS = Object.keys(SP.POWERS);

  /* Иконки бонусов рисуются линиями — без шрифтов */
  SP.powerIcon = function (x, t, s) {
    x.lineWidth = 2;
    x.lineCap = 'round';
    x.beginPath();
    if (t === 'triple') {
      x.moveTo(0, 6 * s); x.lineTo(0, -7 * s);
      x.moveTo(-2 * s, 6 * s); x.lineTo(-6 * s, -6 * s);
      x.moveTo(2 * s, 6 * s); x.lineTo(6 * s, -6 * s);
    } else if (t === 'shield') {
      x.moveTo(0, -7 * s); x.lineTo(6 * s, -4 * s); x.lineTo(5 * s, 3 * s);
      x.lineTo(0, 7 * s); x.lineTo(-5 * s, 3 * s); x.lineTo(-6 * s, -4 * s); x.closePath();
    } else if (t === 'magnet') {
      x.arc(0, -1 * s, 5 * s, Math.PI, 0);
      x.moveTo(5 * s, -1 * s); x.lineTo(5 * s, 6 * s);
      x.moveTo(-5 * s, -1 * s); x.lineTo(-5 * s, 6 * s);
    } else if (t === 'bomb') {
      x.arc(0, 1.5 * s, 5 * s, 0, Math.PI * 2);
      x.moveTo(3 * s, -3 * s); x.lineTo(6 * s, -7 * s);
    } else if (t === 'laser') {
      x.moveTo(-2 * s, -7 * s); x.lineTo(-2 * s, 7 * s);
      x.moveTo(2 * s, -7 * s); x.lineTo(2 * s, 7 * s);
      x.moveTo(-6 * s, -2 * s); x.lineTo(-4 * s, 0);
      x.moveTo(6 * s, -2 * s); x.lineTo(4 * s, 0);
    }
    x.stroke();
  };

  function powSprite(t) {
    const d = SP.POWERS[t];
    return SP.sprite('pw_' + t, 56, 56, x => {
      SP.neonPoly(x, SP.regPoly(6, 16, Math.PI / 6), d.c, 2.2, 0.25);
      x.strokeStyle = '#ffffff';
      x.shadowColor = d.c;
      x.shadowBlur = 6 * SP.res;
      SP.powerIcon(x, t, 1);
    });
  }

  function coinSprite() {
    return SP.sprite('coin', 30, 30, x => {
      x.shadowColor = C.yellow;
      x.shadowBlur = 8 * SP.res;
      x.fillStyle = SP.hexA(C.yellow, 0.35);
      x.strokeStyle = C.yellow;
      x.lineWidth = 2;
      x.beginPath(); x.arc(0, 0, 7, 0, Math.PI * 2); x.fill(); x.stroke();
      x.shadowBlur = 0;
      x.strokeStyle = '#fff6c8';
      x.lineWidth = 1.2;
      x.beginPath(); x.moveTo(0, -3.5); x.lineTo(0, 3.5); x.stroke();
    });
  }

  SP.coinSprite = coinSprite;
  const pool = new SP.Pool(() => ({ alive: false, kind: 'coin', x: 0, y: 0, vx: 0, vy: 0, t: 0, val: 1 }), 60, 200);
  const PU = SP.pickups = { pool: pool };

  PU.coins = function (x, y, n, val) {
    for (let i = 0; i < n; i++) {
      const p = pool.get();
      p.kind = 'coin'; p.val = val || 1;
      p.x = x + SP.rand(-8, 8); p.y = y + SP.rand(-8, 8);
      p.vx = SP.rand(-90, 90); p.vy = SP.rand(-160, -40);
      p.t = Math.random() * 6;
    }
  };

  PU.power = function (x, y, kind) {
    const p = pool.get();
    p.kind = kind || SP.pick(KINDS);
    p.x = SP.clamp(x, 30, SP.W - 30); p.y = y; p.vx = 0; p.vy = 70; p.t = 0;
  };

  PU.update = function (dt) {
    const P = SP.player, it = pool.items;
    for (let i = 0; i < it.length; i++) {
      const p = it[i];
      if (!p.alive) continue;
      p.t += dt;
      if (p.kind === 'coin') {
        const d2 = SP.dist2(p.x, p.y, P.x, P.y);
        if (P.alive && (P.magnet > 0 || d2 < 90 * 90)) {
          const d = Math.sqrt(d2) || 1, v = P.magnet > 0 ? 620 : 420;
          p.vx += ((P.x - p.x) / d * v - p.vx) * Math.min(1, dt * 8);
          p.vy += ((P.y - p.y) / d * v - p.vy) * Math.min(1, dt * 8);
        } else {
          p.vx *= Math.max(0, 1 - dt * 2);
          p.vy = Math.min(140, p.vy + 260 * dt);
        }
      } else {
        p.vy = 75;
        p.vx = Math.sin(p.t * 2.5) * 30;
      }
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      if (p.y > SP.H + 30) { p.alive = false; continue; }
      if (P.alive && SP.dist2(p.x, p.y, P.x, P.y) < (p.kind === 'coin' ? 26 * 26 : 32 * 32)) {
        p.alive = false;
        SP.game.collect(p);
      }
    }
  };

  PU.draw = function (ctx) {
    const it = pool.items;
    const cs = coinSprite();
    for (let i = 0; i < it.length; i++) {
      const p = it[i];
      if (!p.alive) continue;
      if (p.kind === 'coin') {
        const sx = Math.max(0.25, Math.abs(Math.cos(p.t * 5)));
        ctx.drawImage(cs.c, p.x - cs.w * sx / 2, p.y - cs.h / 2, cs.w * sx, cs.h);
      } else {
        const s = powSprite(p.kind), d = SP.POWERS[p.kind];
        ctx.globalCompositeOperation = 'lighter';
        ctx.globalAlpha = 0.35 + Math.sin(p.t * 6) * 0.15;
        SP.draw(ctx, SP.glow(d.c, true), p.x, p.y, 1.3);
        ctx.globalAlpha = 1;
        ctx.globalCompositeOperation = 'source-over';
        SP.draw(ctx, s, p.x, p.y, 1 + Math.sin(p.t * 6) * 0.06);
      }
    }
  };

  PU.clear = function () { pool.clear(); };
})();
