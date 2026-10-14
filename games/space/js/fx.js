/* Неоновый космос — эффекты: звёздный фон, частицы, кольца, всплывающий текст, тряска, вспышки */
(function () {
  'use strict';
  const SP = window.SP;
  const FX = SP.fx = { trauma: 0, ox: 0, oy: 0, flashA: 0, flashC: '#ffffff' };

  const parts = new SP.Pool(() => ({ alive: false, x: 0, y: 0, vx: 0, vy: 0, life: 0, max: 1, size: 4, color: '#fff', drag: 0 }), 500, 900);
  const rings = new SP.Pool(() => ({ alive: false, x: 0, y: 0, r: 0, max: 60, life: 0, dur: 0.4, color: '#fff', w: 3 }), 20, 60);
  const texts = new SP.Pool(() => ({ alive: false, x: 0, y: 0, s: '', color: '#fff', size: 18, life: 0, max: 1 }), 24, 60);
  let stars = [], nebs = [], bgGrad = null, bgH = 0;

  FX.initStars = function () {
    stars = [];
    for (let i = 0; i < 130; i++) {
      stars.push({ x: Math.random() * SP.W, y: Math.random() * SP.H, z: Math.random(), tw: Math.random() * 6 });
    }
    stars.sort((a, b) => a.z - b.z);
    if (!nebs.length) {
      nebs = [
        { x: SP.W * 0.2, y: SP.H * 0.25, r: 300, c: SP.COL.blue, a: 0.11 },
        { x: SP.W * 0.85, y: SP.H * 0.65, r: 280, c: SP.COL.pink, a: 0.09 },
        { x: SP.W * 0.4, y: -SP.H * 0.2, r: 240, c: SP.COL.green, a: 0.06 }
      ];
    }
    bgGrad = null;
  };

  FX.updateBg = function (dt, sp) {
    for (let i = 0; i < stars.length; i++) {
      const s = stars[i];
      s.y += (12 + s.z * s.z * 170) * sp * dt;
      s.tw += dt * 3;
      if (s.y > SP.H + 4) { s.y = -4; s.x = Math.random() * SP.W; }
    }
    for (let i = 0; i < nebs.length; i++) {
      const n = nebs[i];
      n.y += 7 * sp * dt;
      if (n.y - n.r > SP.H) { n.y = -n.r; n.x = Math.random() * SP.W; }
    }
  };

  FX.drawBg = function (ctx, sp) {
    if (!bgGrad || bgH !== SP.H) {
      bgGrad = ctx.createLinearGradient(0, 0, 0, SP.H);
      bgGrad.addColorStop(0, '#07080e');
      bgGrad.addColorStop(1, '#111217');
      bgH = SP.H;
    }
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, SP.W, SP.H);
    ctx.globalCompositeOperation = 'lighter';
    for (let i = 0; i < nebs.length; i++) {
      const n = nebs[i];
      ctx.globalAlpha = n.a;
      SP.draw(ctx, SP.glow(n.c, true), n.x, n.y, n.r / 32);
    }
    ctx.globalCompositeOperation = 'source-over';
    const streak = 1 + (sp || 1) * 1.1;
    for (let i = 0; i < stars.length; i++) {
      const s = stars[i];
      const sz = 0.6 + s.z * 1.7;
      ctx.globalAlpha = (0.2 + s.z * 0.7) * (0.75 + 0.25 * Math.sin(s.tw));
      ctx.fillStyle = s.z > 0.92 ? '#bcd6ff' : s.z > 0.8 ? '#ffd0f5' : '#dfe6ff';
      ctx.fillRect(s.x, s.y, sz, sz * (s.z > 0.8 ? streak : 1));
    }
    ctx.globalAlpha = 1;
  };

  FX.burst = function (x, y, color, n, speed, size, life) {
    for (let i = 0; i < n; i++) {
      const p = parts.get();
      const a = Math.random() * Math.PI * 2, v = speed * (0.25 + Math.random() * 0.85);
      p.x = x; p.y = y;
      p.vx = Math.cos(a) * v; p.vy = Math.sin(a) * v;
      p.max = p.life = (life || 0.6) * (0.5 + Math.random() * 0.7);
      p.size = (size || 5) * (0.6 + Math.random() * 0.8);
      p.color = color;
      p.drag = 2.5;
    }
  };

  FX.trail = function (x, y, color, vx, vy, size, life) {
    const p = parts.get();
    p.x = x; p.y = y; p.vx = vx; p.vy = vy;
    p.max = p.life = life;
    p.size = size; p.color = color; p.drag = 1;
  };

  FX.ring = function (x, y, color, maxR, dur, w) {
    const r = rings.get();
    r.x = x; r.y = y; r.r = 0; r.max = maxR; r.dur = r.life = dur || 0.4; r.color = color; r.w = w || 3;
  };

  FX.text = function (x, y, s, color, size, life) {
    const t = texts.get();
    t.size = size || 18;
    const hw = Math.min(SP.W / 2, String(s).length * t.size * 0.34 + 6);
    t.x = SP.clamp(x, hw, SP.W - hw); t.y = y; t.s = s; t.color = color || '#fff';
    t.max = t.life = life || 0.9;
  };

  FX.shake = function (a) { FX.trauma = Math.min(1, FX.trauma + a); };
  FX.flash = function (c, a) { FX.flashC = c; FX.flashA = Math.max(FX.flashA, a); };

  FX.update = function (dt) {
    FX.trauma = Math.max(0, FX.trauma - dt * 1.5);
    const t2 = FX.trauma * FX.trauma * 18;
    FX.ox = (Math.random() * 2 - 1) * t2;
    FX.oy = (Math.random() * 2 - 1) * t2;
    FX.flashA = Math.max(0, FX.flashA - dt * 2.2);
    const it = parts.items;
    for (let i = 0; i < it.length; i++) {
      const p = it[i];
      if (!p.alive) continue;
      p.life -= dt;
      if (p.life <= 0) { p.alive = false; continue; }
      const k = Math.max(0, 1 - p.drag * dt);
      p.vx *= k; p.vy *= k;
      p.x += p.vx * dt; p.y += p.vy * dt;
    }
    const ri = rings.items;
    for (let i = 0; i < ri.length; i++) {
      const r = ri[i];
      if (!r.alive) continue;
      r.life -= dt;
      if (r.life <= 0) { r.alive = false; continue; }
      const k = 1 - r.life / r.dur;
      r.r = r.max * (1 - (1 - k) * (1 - k));
    }
    const ti = texts.items;
    for (let i = 0; i < ti.length; i++) {
      const t = ti[i];
      if (!t.alive) continue;
      t.life -= dt;
      t.y -= 38 * dt;
      if (t.life <= 0) t.alive = false;
    }
  };

  FX.draw = function (ctx) {
    ctx.globalCompositeOperation = 'lighter';
    const it = parts.items;
    for (let i = 0; i < it.length; i++) {
      const p = it[i];
      if (!p.alive) continue;
      const a = p.life / p.max;
      const s = p.size * (0.35 + 0.65 * a);
      ctx.globalAlpha = a;
      ctx.drawImage(SP.glow(p.color).c, p.x - s, p.y - s, s * 2, s * 2);
    }
    const ri = rings.items;
    for (let i = 0; i < ri.length; i++) {
      const r = ri[i];
      if (!r.alive) continue;
      ctx.globalAlpha = r.life / r.dur;
      ctx.strokeStyle = r.color;
      ctx.lineWidth = r.w * (0.4 + r.life / r.dur);
      ctx.beginPath();
      ctx.arc(r.x, r.y, r.r, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
  };

  FX.drawTexts = function (ctx) {
    const ti = texts.items;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.lineWidth = 4;
    ctx.strokeStyle = 'rgba(5,6,10,0.75)';
    for (let i = 0; i < ti.length; i++) {
      const t = ti[i];
      if (!t.alive) continue;
      const k = t.life / t.max;
      ctx.globalAlpha = Math.min(1, k * 2.5);
      const pop = k > 0.85 ? 1 + (k - 0.85) * 3 : 1;
      ctx.font = '800 ' + Math.round(t.size * pop) + 'px system-ui, "Segoe UI", Roboto, Arial, sans-serif';
      ctx.strokeText(t.s, t.x, t.y);
      ctx.fillStyle = t.color;
      ctx.fillText(t.s, t.x, t.y);
    }
    ctx.globalAlpha = 1;
  };

  FX.drawFlash = function (ctx) {
    if (FX.flashA <= 0.01) return;
    ctx.globalAlpha = FX.flashA;
    ctx.fillStyle = FX.flashC;
    ctx.fillRect(0, 0, SP.W, SP.H);
    ctx.globalAlpha = 1;
  };

  FX.clear = function () {
    parts.clear(); rings.clear(); texts.clear();
    FX.trauma = 0; FX.flashA = 0;
  };
})();
