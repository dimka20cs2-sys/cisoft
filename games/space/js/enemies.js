/* Неоновый космос — враги: простые, зигзаг, стрелки, камикадзе, танки */
(function () {
  'use strict';
  const SP = window.SP, C = SP.COL;

  const T = SP.ETYPES = {
    grunt: { hp: 2, r: 17, score: 100, color: C.blue, coin: 0.45, coins: 1,
      shape: [0, 18, 17, -6, 9, -15, 0, -6, -9, -15, -17, -6] },
    zig: { hp: 2.5, r: 16, score: 150, color: C.pink, coin: 0.55, coins: 1,
      shape: [0, -18, 17, 0, 0, 18, -17, 0] },
    shooter: { hp: 5, r: 19, score: 250, color: C.yellow, coin: 0.8, coins: 1,
      shape: SP.regPoly(6, 19, Math.PI / 6) },
    kami: { hp: 1.5, r: 14, score: 200, color: C.red, coin: 0.5, coins: 1,
      shape: [0, 20, 8, -4, 15, -16, 0, -9, -15, -16, -8, -4] },
    tank: { hp: 22, r: 30, score: 600, color: C.green, coin: 1, coins: 4,
      shape: SP.regPoly(8, 30, Math.PI / 8) }
  };

  function sprite(type) {
    const d = T[type], sz = d.r * 2 + 34;
    return SP.sprite('en_' + type, sz, sz, x => {
      SP.neonPoly(x, d.shape, d.color, 2.4, 0.18);
      x.shadowColor = d.color;
      x.shadowBlur = 8 * SP.res;
      x.strokeStyle = d.color;
      x.fillStyle = d.color;
      x.lineWidth = 1.6;
      if (type === 'zig') {
        x.beginPath(); x.moveTo(0, -8); x.lineTo(8, 0); x.lineTo(0, 8); x.lineTo(-8, 0); x.closePath(); x.stroke();
      } else if (type === 'shooter') {
        x.beginPath(); x.arc(0, 0, 7, 0, Math.PI * 2); x.stroke();
        x.beginPath(); x.arc(0, 2, 3, 0, Math.PI * 2); x.fill();
      } else if (type === 'tank') {
        x.beginPath();
        const p = SP.regPoly(8, 18, Math.PI / 8);
        for (let i = 0; i < p.length; i += 2) { if (i) x.lineTo(p[i], p[i + 1]); else x.moveTo(p[i], p[i + 1]); }
        x.closePath(); x.stroke();
        x.beginPath(); x.moveTo(-30, 0); x.lineTo(-18, 0); x.moveTo(30, 0); x.lineTo(18, 0);
        x.moveTo(0, 18); x.lineTo(0, 30); x.stroke();
        x.beginPath(); x.arc(0, 0, 5, 0, Math.PI * 2); x.fill();
      } else if (type === 'grunt') {
        x.beginPath(); x.arc(0, 3, 3, 0, Math.PI * 2); x.fill();
      } else if (type === 'kami') {
        x.beginPath(); x.moveTo(0, 12); x.lineTo(0, -2); x.stroke();
      }
    });
  }

  const pool = new SP.Pool(() => ({
    alive: false, type: 'grunt', d: null, x: 0, y: 0, x0: 0, vx: 0, vy: 0, hp: 1, max: 1,
    t: 0, ph: 0, ty: 0, st: 0, cd: 0, fire: 2, hitT: 0, r: 16, rot: 0, sp: 100
  }), 40, 120);
  const E = SP.enemies = { pool: pool };

  E.spawn = function (type, x, y, diff) {
    const e = pool.get(), d = T[type];
    e.type = type; e.d = d; e.r = d.r;
    e.x = e.x0 = x; e.y = y; e.vx = 0; e.vy = 0;
    e.hp = e.max = d.hp * diff.hp;
    e.t = 0; e.ph = Math.random() * 6.28; e.st = 0; e.hitT = 0; e.rot = 0;
    e.sp = (type === 'grunt' ? 115 : type === 'zig' ? 95 : 80) * diff.sp;
    e.ty = type === 'tank' ? SP.rand(120, 220) : SP.rand(90, Math.min(320, SP.H * 0.35));
    e.fire = (type === 'tank' ? 2.6 : 2.2) * diff.fire;
    e.cd = e.fire * SP.rand(0.5, 1);
    e.bs = diff.bs;
    return e;
  };

  function upd(e, dt) {
    const P = SP.player, B = SP.bullets;
    e.t += dt;
    e.hitT = Math.max(0, e.hitT - dt);
    switch (e.type) {
      case 'grunt':
        e.y += e.sp * dt;
        e.x = e.x0 + Math.sin(e.t * 2 + e.ph) * 24;
        break;
      case 'zig':
        e.y += e.sp * dt;
        e.x = SP.clamp(e.x0 + Math.sin(e.t * 2.6 + e.ph) * 110, 20, SP.W - 20);
        break;
      case 'shooter':
        if (e.y < e.ty) e.y += Math.max(45, (e.ty - e.y) * 2.5) * dt;
        else { e.y += 7 * dt; e.x = SP.clamp(e.x0 + Math.sin(e.t * 0.9 + e.ph) * 80, 22, SP.W - 22); }
        e.cd -= dt;
        if (e.cd <= 0 && e.y > 30) {
          e.cd = e.fire * SP.rand(0.8, 1.2);
          B.aimed(e.x, e.y + 12, 230 * e.bs, C.yellow, 1, 0, 5);
          SP.audio.eshot();
        }
        break;
      case 'kami':
        if (e.st === 0) {
          e.y += Math.max(60, (e.ty - e.y) * 3) * dt;
          if (e.y >= e.ty - 2) { e.st = 1; e.cd = 0.7; }
        } else if (e.st === 1) {
          e.cd -= dt;
          e.x += Math.sin(e.t * 40) * 0.6;
          e.rot = Math.atan2(P.y - e.y, P.x - e.x) - Math.PI / 2;
          if (e.cd <= 0) {
            e.st = 2;
            const a = Math.atan2(P.y - e.y, P.x - e.x), v = 470 * e.bs;
            e.vx = Math.cos(a) * v; e.vy = Math.sin(a) * v;
          }
        } else {
          e.x += e.vx * dt; e.y += e.vy * dt;
          if (Math.random() < 0.6) SP.fx.trail(e.x, e.y, C.red, -e.vx * 0.2, -e.vy * 0.2, 4, 0.3);
        }
        break;
      case 'tank':
        if (e.y < e.ty) e.y += 55 * dt; else e.y += 10 * dt;
        e.x = SP.clamp(e.x0 + Math.sin(e.t * 0.5 + e.ph) * 40, 34, SP.W - 34);
        e.cd -= dt;
        if (e.cd <= 0 && e.y > 30) {
          e.cd = e.fire * SP.rand(0.85, 1.15);
          const n = SP.waves.n >= 10 ? 5 : 3;
          for (let i = 0; i < n; i++) {
            const a = Math.PI / 2 + (i / (n - 1) - 0.5) * 0.7;
            B.enemy(e.x, e.y + 24, Math.cos(a) * 190 * e.bs, Math.sin(a) * 190 * e.bs, C.green, 6);
          }
          SP.audio.eshot();
        }
        break;
    }
    if (e.y > SP.H + 50 || e.y < -200 || e.x < -80 || e.x > SP.W + 80) e.alive = false;
  }

  E.update = function (dt) {
    const it = pool.items;
    for (let i = 0; i < it.length; i++) if (it[i].alive) upd(it[i], dt);
  };

  /* Нанести урон; возвращает true, если враг уничтожен */
  E.damage = function (e, dmg) {
    if (!e.alive) return false;
    e.hp -= dmg;
    e.hitT = 0.08;
    if (e.hp <= 0) {
      e.alive = false;
      SP.game.onKill(e);
      return true;
    }
    return false;
  };

  E.draw = function (ctx) {
    const it = pool.items;
    for (let i = 0; i < it.length; i++) {
      const e = it[i];
      if (!e.alive) continue;
      const s = sprite(e.type);
      ctx.save();
      ctx.translate(e.x, e.y);
      if (e.rot) ctx.rotate(e.rot);
      const charge = (e.type === 'kami' && e.st === 1) || (e.type !== 'kami' && e.cd < 0.35 && e.cd > 0 && (e.type === 'shooter' || e.type === 'tank'));
      if (charge) {
        ctx.globalCompositeOperation = 'lighter';
        ctx.globalAlpha = 0.5 + Math.sin(e.t * 30) * 0.3;
        const g = e.r * 2.4;
        ctx.drawImage(SP.glow(e.d.color, true).c, -g, -g, g * 2, g * 2);
        ctx.globalAlpha = 1;
        ctx.globalCompositeOperation = 'source-over';
      }
      ctx.drawImage(s.c, -s.w / 2, -s.h / 2, s.w, s.h);
      if (e.hitT > 0) {
        ctx.globalCompositeOperation = 'lighter';
        ctx.drawImage(s.c, -s.w / 2, -s.h / 2, s.w, s.h);
        ctx.globalCompositeOperation = 'source-over';
      }
      ctx.restore();
      if (e.type === 'tank' && e.hp < e.max) {
        ctx.fillStyle = 'rgba(255,255,255,0.15)';
        ctx.fillRect(e.x - 24, e.y - 42, 48, 4);
        ctx.fillStyle = C.green;
        ctx.fillRect(e.x - 24, e.y - 42, 48 * Math.max(0, e.hp / e.max), 4);
      }
    }
  };

  E.count = function () { return pool.count(); };
  E.clear = function () { pool.clear(); };
})();
