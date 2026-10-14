'use strict';
/* Отрисовка платформ, бонусов, монет, врагов */
(function (J) {
  var STYLE = {
    normal: ['#7ff07a', '#2fae4a', '#1f7a35'],
    moving: ['#8fd8ff', '#3a9cf0', '#2468b5'],
    break: ['#e6b07a', '#b9783f', '#7d4c22'],
    vanish: ['#e7d2ff', '#a678ff', '#6b46c9']
  };

  function plank(ctx, p, col) {
    var x = p.x - p.w / 2, y = p.y + p.squash * 3;
    ctx.fillStyle = col[2];
    J.roundRect(ctx, x, y + 2, p.w, p.h, 7); ctx.fill();
    var g = ctx.createLinearGradient(0, y, 0, y + p.h);
    g.addColorStop(0, col[0]); g.addColorStop(1, col[1]);
    ctx.fillStyle = g;
    J.roundRect(ctx, x, y, p.w, p.h - 1, 7); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    J.roundRect(ctx, x + 6, y + 2.5, p.w - 12, 3, 1.5); ctx.fill();
  }

  function drawPlatform(ctx, p, t) {
    switch (p.type) {
      case 'ground': {
        var gy = p.y;
        ctx.fillStyle = '#3fbf5a';
        ctx.fillRect(-10, gy, J.W + 20, 400);
        ctx.fillStyle = '#5fdc6e';
        for (var gx = -10; gx < J.W + 10; gx += 18) {
          ctx.beginPath(); ctx.arc(gx + 9, gy + 2, 11, Math.PI, 0); ctx.fill();
        }
        ctx.fillStyle = '#8a5a34';
        ctx.fillRect(-10, gy + 22, J.W + 20, 400);
        ctx.fillStyle = '#6f4527';
        for (var sx = 8; sx < J.W; sx += 40) ctx.fillRect(sx, gy + 40 + (sx % 3) * 9, 14, 6);
        return;
      }
      case 'normal':
      case 'moving':
        plank(ctx, p, STYLE[p.type]);
        if (p.type === 'moving') {
          ctx.fillStyle = 'rgba(255,255,255,0.85)';
          var cy = p.y + 8;
          ctx.beginPath(); ctx.moveTo(p.x - p.w / 2 + 6, cy); ctx.lineTo(p.x - p.w / 2 + 11, cy - 3.5); ctx.lineTo(p.x - p.w / 2 + 11, cy + 3.5); ctx.fill();
          ctx.beginPath(); ctx.moveTo(p.x + p.w / 2 - 6, cy); ctx.lineTo(p.x + p.w / 2 - 11, cy - 3.5); ctx.lineTo(p.x + p.w / 2 - 11, cy + 3.5); ctx.fill();
        }
        if (p.spring) drawSpring(ctx, p.x + p.spring.ox, p.y, p.spring.t);
        return;
      case 'break':
        if (p.broken) {
          var a = Math.min(1, p.fall * 1.5);
          ctx.save(); ctx.globalAlpha = 1 - a * 0.6;
          for (var s = -1; s <= 1; s += 2) {
            ctx.save();
            ctx.translate(p.x + s * (p.w / 4 + p.fall * 25), p.y + 7);
            ctx.rotate(s * p.fall * 2);
            ctx.fillStyle = STYLE.break[1];
            J.roundRect(ctx, -p.w / 4, -6, p.w / 2 - 2, 12, 5); ctx.fill();
            ctx.restore();
          }
          ctx.restore();
          return;
        }
        plank(ctx, p, STYLE.break);
        ctx.strokeStyle = STYLE.break[2]; ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(p.x - 4, p.y + 1); ctx.lineTo(p.x + 2, p.y + 6); ctx.lineTo(p.x - 3, p.y + 12);
        ctx.moveTo(p.x - p.w / 2 + 12, p.y + 3); ctx.lineTo(p.x - p.w / 2 + 17, p.y + 9);
        ctx.moveTo(p.x + p.w / 2 - 14, p.y + 2); ctx.lineTo(p.x + p.w / 2 - 18, p.y + 10);
        ctx.stroke();
        return;
      case 'vanish':
        if (p.fade <= 0.02) {
          ctx.save(); ctx.globalAlpha = 0.35; ctx.strokeStyle = '#d9c2ff'; ctx.setLineDash([4, 4]); ctx.lineWidth = 1.5;
          J.roundRect(ctx, p.x - p.w / 2, p.y, p.w, p.h - 1, 7); ctx.stroke(); ctx.restore();
          return;
        }
        ctx.save();
        ctx.globalAlpha = p.fade < 1 ? p.fade * (0.6 + 0.4 * Math.sin(t * 40)) : 0.92;
        plank(ctx, p, STYLE.vanish);
        ctx.restore();
        return;
      case 'cloud': {
        ctx.save();
        ctx.globalAlpha = Math.max(0, p.fade);
        var sc = 0.6 + 0.4 * Math.max(0, p.fade);
        ctx.translate(p.x, p.y + 6); ctx.scale(sc, sc);
        ctx.fillStyle = '#d6e6ff';
        cloudPuffs(ctx, p.w, 3);
        ctx.fillStyle = '#ffffff';
        cloudPuffs(ctx, p.w, 0);
        ctx.restore();
        return;
      }
      case 'tramp': {
        var x = p.x - p.w / 2, y = p.y, sq = Math.sin(p.squash * Math.PI) * 6 * p.squash;
        ctx.strokeStyle = '#3a3d55'; ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(x + 8, y + 4); ctx.lineTo(x + 4, y + 18);
        ctx.moveTo(x + p.w - 8, y + 4); ctx.lineTo(x + p.w - 4, y + 18);
        ctx.stroke();
        ctx.fillStyle = '#ff4d5e';
        ctx.beginPath();
        ctx.moveTo(x, y); ctx.quadraticCurveTo(p.x, y + 8 + sq * 2, x + p.w, y);
        ctx.lineTo(x + p.w, y + 5); ctx.quadraticCurveTo(p.x, y + 12 + sq * 2, x, y + 5);
        ctx.closePath(); ctx.fill();
        ctx.fillStyle = '#ffffff';
        for (var i = 1; i < 5; i++) ctx.fillRect(x + i * p.w / 5 - 3, y + 1 + (i === 2 || i === 3 ? 1 + sq : 0.5), 6, 3);
        ctx.fillStyle = '#ffd23d';
        J.roundRect(ctx, x - 3, y - 2, 8, 8, 3); ctx.fill();
        J.roundRect(ctx, x + p.w - 5, y - 2, 8, 8, 3); ctx.fill();
        return;
      }
    }
  }

  function cloudPuffs(ctx, w, off) {
    ctx.beginPath();
    ctx.arc(-w * 0.3, off, 11, 0, 6.283);
    ctx.arc(-w * 0.05, off - 5, 14, 0, 6.283);
    ctx.arc(w * 0.25, off - 1, 12, 0, 6.283);
    ctx.rect(-w * 0.42, off, w * 0.8, 9);
    ctx.fill();
  }

  function drawSpring(ctx, x, y, t) {
    var hgt = 10 + t * 8;
    ctx.strokeStyle = '#c9ced9'; ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(x - 5, y);
    for (var i = 1; i <= 4; i++) ctx.lineTo(x + (i % 2 ? 5 : -5), y - hgt * i / 4);
    ctx.stroke();
    ctx.fillStyle = '#ffd23d';
    J.roundRect(ctx, x - 8, y - hgt - 4, 16, 5, 2.5); ctx.fill();
  }

  function drawItem(ctx, it, t) {
    var x = it.x, y = it.y - 18 + Math.sin(it.t * 4) * 3;
    var glow = ctx.createRadialGradient(x, y, 2, x, y, 22);
    glow.addColorStop(0, 'rgba(255,255,200,0.75)'); glow.addColorStop(1, 'rgba(255,255,200,0)');
    ctx.fillStyle = glow;
    ctx.beginPath(); ctx.arc(x, y, 22, 0, 6.283); ctx.fill();
    if (it.type === 'jet') {
      ctx.fillStyle = '#9aa3b5';
      J.roundRect(ctx, x - 10, y - 10, 9, 20, 4); ctx.fill();
      J.roundRect(ctx, x + 1, y - 10, 9, 20, 4); ctx.fill();
      ctx.fillStyle = '#e8434a';
      J.roundRect(ctx, x - 10, y - 12, 9, 6, 3); ctx.fill();
      J.roundRect(ctx, x + 1, y - 12, 9, 6, 3); ctx.fill();
      ctx.fillStyle = '#ffb23d';
      ctx.beginPath(); ctx.moveTo(x - 9, y + 10); ctx.lineTo(x - 2, y + 10); ctx.lineTo(x - 5.5, y + 16); ctx.fill();
      ctx.beginPath(); ctx.moveTo(x + 2, y + 10); ctx.lineTo(x + 9, y + 10); ctx.lineTo(x + 5.5, y + 16); ctx.fill();
    } else if (it.type === 'prop') {
      ctx.fillStyle = '#ffd23d';
      ctx.beginPath(); ctx.arc(x, y + 6, 11, Math.PI, 0); ctx.fill();
      ctx.fillStyle = '#ff4d6d'; ctx.fillRect(x - 1.5, y - 8, 3, 10);
      var s = Math.sin(t * 30);
      ctx.fillStyle = '#4f9cff';
      ctx.beginPath(); ctx.ellipse(x, y - 8, 15 * Math.abs(s) + 2, 3, 0, 0, 6.283); ctx.fill();
    } else if (it.type === 'shield') {
      ctx.fillStyle = 'rgba(127,232,255,0.35)'; ctx.strokeStyle = '#7fe8ff'; ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.arc(x, y, 12, 0, 6.283); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#ffffff';
      ctx.beginPath(); ctx.moveTo(x, y - 7); ctx.lineTo(x + 6, y - 4); ctx.lineTo(x + 5, y + 3);
      ctx.lineTo(x, y + 7); ctx.lineTo(x - 5, y + 3); ctx.lineTo(x - 6, y - 4); ctx.closePath(); ctx.fill();
    } else if (it.type === 'magnet') {
      ctx.lineWidth = 7; ctx.strokeStyle = '#ff4d4d'; ctx.lineCap = 'butt';
      ctx.beginPath(); ctx.arc(x, y - 1, 8, Math.PI, 0, false); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(x - 8, y - 1); ctx.lineTo(x - 8, y + 6); ctx.moveTo(x + 8, y - 1); ctx.lineTo(x + 8, y + 6); ctx.stroke();
      ctx.fillStyle = '#e6e9f2';
      ctx.fillRect(x - 11.5, y + 6, 7, 5); ctx.fillRect(x + 4.5, y + 6, 7, 5);
    }
  }

  function drawCoin(ctx, c) {
    var sx = Math.abs(Math.cos(c.ph));
    ctx.fillStyle = '#d99a00';
    ctx.beginPath(); ctx.ellipse(c.x, c.y + 1, 8 * sx + 1, 8, 0, 0, 6.283); ctx.fill();
    ctx.fillStyle = '#ffd83d';
    ctx.beginPath(); ctx.ellipse(c.x, c.y, 7 * sx + 1, 7.5, 0, 0, 6.283); ctx.fill();
    if (sx > 0.4) {
      ctx.fillStyle = '#fff3a8';
      ctx.fillRect(c.x - 1.2 * sx, c.y - 4, 2.4 * sx, 8);
    }
  }

  J.draw = {
    platform: drawPlatform, item: drawItem, coin: drawCoin, spring: drawSpring
  };
})(window.J);
