/* Неоновый космос — HUD на canvas: очки, комбо, волна, жизни, бонусы, полоса босса, баннеры */
(function () {
  'use strict';
  const SP = window.SP, C = SP.COL;
  const FONT = 'system-ui, "Segoe UI", Roboto, Arial, sans-serif';
  const H = SP.hud = {};

  function text(ctx, s, x, y, size, color, align, glow, weight) {
    ctx.font = (weight || 800) + ' ' + size + 'px ' + FONT;
    ctx.textAlign = align || 'left';
    ctx.textBaseline = 'middle';
    if (glow) { ctx.shadowColor = glow; ctx.shadowBlur = 12; }
    ctx.fillStyle = color;
    ctx.fillText(s, x, y);
    ctx.shadowBlur = 0;
  }

  function lifeSprite() {
    return SP.sprite('life' + SP.save.skin, 26, 26, x => {
      x.scale(0.42, 0.42);
      const s = SP.shipSprite(SP.save.skin);
      x.drawImage(s.c, -s.w / 2, -s.h / 2, s.w, s.h);
    });
  }

  H.draw = function (ctx, G) {
    const P = SP.player, WV = SP.waves, BS = SP.boss;
    // очки
    text(ctx, SP.fmt(G.shownScore), 16, 28, 26, '#ffffff', 'left', C.blue);
    // комбо
    if (G.mult > 1 || G.combo > 0) {
      const col = G.mult >= 4 ? C.yellow : G.mult >= 2 ? C.pink : C.blue;
      const pop = 1 + G.multPop * 0.5;
      text(ctx, 'x' + G.mult.toFixed(1), 16, 58, Math.round(18 * pop), col, 'left', col);
      ctx.font = '800 18px ' + FONT;
      const w = 16 + ctx.measureText('x' + G.mult.toFixed(1)).width + 10;
      ctx.fillStyle = 'rgba(255,255,255,0.12)';
      ctx.fillRect(w, 55, 60, 5);
      ctx.fillStyle = col;
      ctx.fillRect(w, 55, 60 * G.comboFrac, 5);
    }
    // монеты
    const cy = SP.H - 54;
    SP.draw(ctx, SP.coinSprite(), 24, cy, 0.8);
    text(ctx, SP.fmt(G.coins), 38, cy + 1, 16, C.yellow, 'left', null, 700);
    // волна
    text(ctx, 'ВОЛНА ' + WV.n, SP.W / 2, 26, 15, 'rgba(232,236,245,0.75)', 'center', null, 700);
    // жизни
    const ls = lifeSprite();
    for (let i = 0; i < P.lives; i++) SP.draw(ctx, ls, 22 + i * 26, SP.H - 24, 1);
    // активные бонусы
    let bx = SP.W - 14;
    const timers = [['laser', P.laser, 6], ['triple', P.triple, 12], ['magnet', P.magnet, 12], ['shield', P.shield, 10]];
    for (let i = 0; i < timers.length; i++) {
      const t = timers[i];
      if (t[1] <= 0) continue;
      const d = SP.POWERS[t[0]];
      const w = 54;
      bx -= w;
      ctx.fillStyle = 'rgba(10,12,20,0.6)';
      ctx.fillRect(bx, SP.H - 40, w - 6, 30);
      ctx.strokeStyle = d.c;
      ctx.lineWidth = 1.5;
      ctx.strokeRect(bx + 0.5, SP.H - 39.5, w - 7, 29);
      ctx.fillStyle = d.c;
      ctx.fillRect(bx + 3, SP.H - 15, (w - 12) * Math.min(1, t[1] / t[2]), 3);
      ctx.save();
      ctx.translate(bx + (w - 6) / 2, SP.H - 27);
      ctx.strokeStyle = '#ffffff';
      SP.powerIcon(ctx, t[0], 0.8);
      ctx.restore();
    }
    // босс
    if (BS.active) {
      const bw = SP.W - 150, x0 = 75, y0 = 72;
      text(ctx, BS.name, SP.W / 2, y0 - 3, 13, BS.color, 'center', BS.color, 800);
      ctx.fillStyle = 'rgba(255,255,255,0.1)';
      ctx.fillRect(x0, y0 + 8, bw, 8);
      const f = Math.max(0, BS.hp / BS.max);
      ctx.shadowColor = BS.color;
      ctx.shadowBlur = 10;
      ctx.fillStyle = f < 0.5 ? C.red : BS.color;
      ctx.fillRect(x0, y0 + 8, bw * f, 8);
      ctx.shadowBlur = 0;
      ctx.strokeStyle = 'rgba(255,255,255,0.35)';
      ctx.lineWidth = 1;
      ctx.strokeRect(x0 - 0.5, y0 + 7.5, bw + 1, 9);
    }
    // баннер волны
    if (WV.bannerT > 0 && (G.state === 'play' || G.state === 'pause')) {
      const t = WV.bannerT, a = Math.min(1, t * 2, (2.2 - t) * 4);
      const col = WV.isBoss ? C.red : C.blue;
      ctx.globalAlpha = Math.max(0, a);
      const sc = 1 + Math.max(0, (t - 1.9)) * 1.5;
      text(ctx, WV.banner, SP.W / 2, SP.H * 0.36, Math.round(46 * sc), '#ffffff', 'center', col, 900);
      if (WV.sub) text(ctx, WV.sub, SP.W / 2, SP.H * 0.36 + 42, 16, 'rgba(232,236,245,0.85)', 'center', null, 600);
      ctx.globalAlpha = 1;
    }
  };
})();
