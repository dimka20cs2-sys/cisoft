/* Неоновый космос — корабль игрока */
(function () {
  'use strict';
  const SP = window.SP;

  const SHAPES = [
    [0, -24, 7, -6, 19, 8, 19, 15, 7, 11, 0, 17, -7, 11, -19, 15, -19, 8, -7, -6],
    [0, -25, 6, -8, 21, -15, 15, 6, 6, 16, 0, 10, -6, 16, -15, 6, -21, -15, -6, -8],
    [0, -21, 9, -7, 23, 6, 13, 13, 4, 10, 0, 18, -4, 10, -13, 13, -23, 6, -9, -7]
  ];

  SP.shipSprite = function (i) {
    return SP.sprite('ship' + i, 80, 80, x => {
      const s = SP.SKINS[i];
      SP.neonPoly(x, SHAPES[i], s.color, 2.6, 0.22);
      x.beginPath();
      x.ellipse(0, -5, 3.6, 7.5, 0, 0, Math.PI * 2);
      x.fillStyle = s.accent;
      x.shadowColor = s.accent;
      x.shadowBlur = 10 * SP.res;
      x.fill();
      x.shadowBlur = 0;
      x.strokeStyle = SP.hexA(s.accent, 0.8);
      x.lineWidth = 1.2;
      x.beginPath();
      x.moveTo(-13, 9); x.lineTo(-7, 3);
      x.moveTo(13, 9); x.lineTo(7, 3);
      x.stroke();
    });
  };

  const P = SP.player = {
    x: 240, y: 700, tx: 240, ty: 700, r: 8, lives: 3, inv: 0, shield: 0,
    triple: 0, magnet: 0, laser: 0, fireT: 0, dmg: 1, rate: 7, skin: 0,
    alive: true, bank: 0, px: 240, t: 0
  };

  P.reset = function () {
    const u = SP.save.upg;
    P.dmg = 1 + u.dmg * 0.25;
    P.rate = 7 * (1 + u.rate * 0.15);
    P.lives = 3 + u.life;
    P.shield = u.shield * 5;
    P.triple = P.magnet = P.laser = 0;
    P.inv = 0;
    P.x = P.tx = P.px = SP.W / 2;
    P.y = P.ty = SP.H - 150;
    P.skin = SP.save.skin;
    P.alive = true;
    P.fireT = 0.2;
    P.bank = 0;
  };

  P.update = function (dt) {
    const I = SP.input;
    P.t += dt;
    if (I.axis()) {
      const sp = 440;
      P.x += I.kx * sp * dt;
      P.y += I.ky * sp * dt;
      P.tx = P.x; P.ty = P.y;
    } else {
      const k = Math.min(1, dt * 16);
      P.x += (P.tx - P.x) * k;
      P.y += (P.ty - P.y) * k;
    }
    P.x = SP.clamp(P.x, 22, SP.W - 22);
    P.y = SP.clamp(P.y, 90, SP.H - 34);
    P.tx = SP.clamp(P.tx, 22, SP.W - 22);
    P.ty = SP.clamp(P.ty, 90, SP.H - 34);
    const vx = (P.x - P.px) / Math.max(dt, 0.001);
    P.px = P.x;
    P.bank += (SP.clamp(vx / 700, -1, 1) - P.bank) * Math.min(1, dt * 10);

    P.inv = Math.max(0, P.inv - dt);
    P.shield = Math.max(0, P.shield - dt);
    P.triple = Math.max(0, P.triple - dt);
    P.magnet = Math.max(0, P.magnet - dt);
    P.laser = Math.max(0, P.laser - dt);

    const sk = SP.SKINS[P.skin];
    if (Math.random() < 0.8) {
      SP.fx.trail(P.x + SP.rand(-3, 3), P.y + 18, sk.color, SP.rand(-15, 15), SP.rand(120, 220), SP.rand(3, 5), 0.25);
    }

    if (P.laser > 0) {
      SP.audio.laser();
      return;
    }
    P.fireT -= dt;
    if (P.fireT <= 0) {
      P.fireT += 1 / P.rate;
      if (P.fireT < 0) P.fireT = 0;
      const B = SP.bullets, c = sk.accent, d = P.dmg * 0.55;
      B.fire(P.x - 6, P.y - 16, 0, -920, d, c);
      B.fire(P.x + 6, P.y - 16, 0, -920, d, c);
      if (P.triple > 0) {
        B.fire(P.x - 12, P.y - 8, -200, -880, d * 1.4, sk.color);
        B.fire(P.x + 12, P.y - 8, 200, -880, d * 1.4, sk.color);
      }
      SP.audio.shoot();
    }
  };

  P.drawLaser = function (ctx) {
    if (P.laser <= 0) return;
    const sk = SP.SKINS[P.skin];
    const fade = Math.min(1, P.laser * 3);
    const w = (22 + Math.sin(P.t * 50) * 4) * fade;
    const top = 0, len = P.y - 22;
    ctx.globalCompositeOperation = 'lighter';
    ctx.globalAlpha = 0.85;
    ctx.drawImage(SP.glow(sk.color, true).c, P.x - w, top - 20, w * 2, len + 40);
    ctx.drawImage(SP.glow(SP.COL.pink).c, P.x - w * 0.5, top - 10, w, len + 20);
    ctx.globalAlpha = 1;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(P.x - 2 * fade, top, 4 * fade, len);
    ctx.drawImage(SP.glow(SP.COL.pink).c, P.x - 22, P.y - 44, 44, 44);
    ctx.globalCompositeOperation = 'source-over';
  };

  P.draw = function (ctx) {
    if (!P.alive) return;
    const sk = SP.SKINS[P.skin];
    P.drawLaser(ctx);
    // пламя двигателя
    ctx.globalCompositeOperation = 'lighter';
    const fl = 22 + Math.random() * 12;
    ctx.drawImage(SP.glow(sk.color).c, P.x - 9, P.y + 10, 18, fl);
    ctx.globalCompositeOperation = 'source-over';
    const blink = P.inv > 0 && Math.floor(P.inv * 12) % 2 === 0;
    if (!blink) {
      const s = SP.shipSprite(P.skin);
      ctx.save();
      ctx.translate(P.x, P.y);
      ctx.scale(1 - Math.abs(P.bank) * 0.28, 1);
      ctx.rotate(P.bank * 0.12);
      ctx.drawImage(s.c, -s.w / 2, -s.h / 2, s.w, s.h);
      ctx.restore();
    }
    if (P.shield > 0) {
      const a = P.shield < 2 ? (Math.floor(P.shield * 8) % 2 ? 0.25 : 0.8) : 0.8;
      const r = 31 + Math.sin(P.t * 6) * 1.5;
      ctx.globalCompositeOperation = 'lighter';
      ctx.globalAlpha = a * 0.35;
      ctx.drawImage(SP.glow(SP.COL.green, true).c, P.x - r * 1.3, P.y - r * 1.3, r * 2.6, r * 2.6);
      ctx.globalAlpha = a;
      ctx.strokeStyle = SP.COL.green;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(P.x, P.y, r, 0, Math.PI * 2);
      ctx.stroke();
      ctx.strokeStyle = 'rgba(255,255,255,0.6)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(P.x, P.y, r, P.t * 3, P.t * 3 + 1.4);
      ctx.stroke();
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = 'source-over';
    }
  };
})();
