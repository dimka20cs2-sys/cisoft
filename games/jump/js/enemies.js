'use strict';
/* Отрисовка врагов, линии рекорда, отметок высоты */
(function (J) {
  function glitchBody(ctx, col) {
    ctx.fillStyle = col;
    ctx.fillRect(-13, -11, 26, 20);
    ctx.fillRect(-9, -15, 18, 4);
    ctx.fillRect(-11, 9, 6, 4);
    ctx.fillRect(5, 9, 6, 4);
  }

  function drawGlitch(ctx, e, t) {
    ctx.save();
    ctx.translate(e.x, e.y);
    if (e.dead) {
      ctx.globalAlpha = Math.max(0, 1 - e.dt);
      ctx.rotate(e.dt * 6);
      ctx.scale(1, Math.max(0.2, 1 - e.dt));
    }
    var j = Math.floor(t * 12 + e.ph * 10) % 9 === 0 ? 3 : 0;
    // крылья
    var flap = Math.sin(t * 18 + e.ph) * 6;
    ctx.fillStyle = '#2b2140';
    ctx.beginPath(); ctx.moveTo(-12, -6); ctx.lineTo(-26, -12 + flap); ctx.lineTo(-22, 2 + flap * 0.5); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(12, -6); ctx.lineTo(26, -12 + flap); ctx.lineTo(22, 2 + flap * 0.5); ctx.closePath(); ctx.fill();
    // RGB-расслоение
    ctx.globalCompositeOperation = 'source-over';
    ctx.save(); ctx.translate(-2 - j, 0); ctx.globalAlpha *= 0.8; glitchBody(ctx, '#2ef6ff'); ctx.restore();
    ctx.save(); ctx.translate(2 + j, 0); ctx.globalAlpha *= 0.8; glitchBody(ctx, '#ff2ee6'); ctx.restore();
    glitchBody(ctx, '#2b2140');
    // сдвинутая полоса
    if (j) {
      ctx.fillStyle = '#4a3a6e';
      ctx.fillRect(-13 + j * 2, -2, 26, 4);
    }
    // глаза
    ctx.fillStyle = '#ff3b5c';
    ctx.fillRect(-9, -6, 6, 6);
    ctx.fillRect(3, -6, 6, 6);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(-7, -5, 2, 2);
    ctx.fillRect(5, -5, 2, 2);
    // зубки
    ctx.fillStyle = '#e6e9f2';
    for (var i = -6; i < 6; i += 4) ctx.fillRect(i, 3, 2, 3);
    ctx.restore();
  }

  function drawHole(ctx, e, t) {
    ctx.save();
    ctx.translate(e.x, e.y);
    var s = e.dead ? Math.max(0, 1 - e.dt * 1.5) : 1;
    ctx.scale(s, s);
    var g = ctx.createRadialGradient(0, 0, 4, 0, 0, 58);
    g.addColorStop(0, 'rgba(80,30,140,0.55)');
    g.addColorStop(0.5, 'rgba(120,60,200,0.2)');
    g.addColorStop(1, 'rgba(120,60,200,0)');
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.arc(0, 0, 58, 0, 6.283); ctx.fill();
    for (var i = 0; i < 3; i++) {
      ctx.save();
      ctx.rotate(t * (2 + i * 0.7) + i * 2.1);
      ctx.strokeStyle = ['#ff9b4d', '#b48cff', '#ff4dd2'][i];
      ctx.lineWidth = 3 - i * 0.6;
      ctx.beginPath(); ctx.ellipse(0, 0, 30 - i * 4, 12 - i * 2, 0, 0, 4.2); ctx.stroke();
      ctx.restore();
    }
    var c = ctx.createRadialGradient(0, 0, 2, 0, 0, 20);
    c.addColorStop(0, '#000000'); c.addColorStop(0.75, '#0a0414'); c.addColorStop(1, '#5a2aa0');
    ctx.fillStyle = c;
    ctx.beginPath(); ctx.arc(0, 0, 19, 0, 6.283); ctx.fill();
    ctx.restore();
  }

  function pill(ctx, x, y, text, bg, fg) {
    ctx.font = 'bold 12px system-ui, -apple-system, Segoe UI, Roboto, sans-serif';
    var w = ctx.measureText(text).width + 16;
    if (x === null) x = J.W - w - 8;
    ctx.fillStyle = bg;
    J.roundRect(ctx, x, y - 10, w, 20, 10); ctx.fill();
    ctx.fillStyle = fg; ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
    ctx.fillText(text, x + 8, y + 0.5);
    ctx.textBaseline = 'alphabetic';
  }

  J.drawEnemy = function (ctx, e, t) {
    if (e.type === 'glitch') drawGlitch(ctx, e, t);
    else drawHole(ctx, e, t);
  };

  // линия рекорда и отметки каждых 100 м (в мировых координатах)
  J.drawMarks = function (ctx, camY, best, t) {
    var top = camY - 20, bottom = camY + J.H + 20;
    var m0 = Math.ceil(-bottom / J.PX_PER_M / 100) * 100;
    ctx.font = 'bold 10px system-ui, -apple-system, Segoe UI, Roboto, sans-serif';
    ctx.textAlign = 'left';
    for (var m = Math.max(100, m0); m * J.PX_PER_M < -top; m += 100) {
      var y = -m * J.PX_PER_M;
      ctx.fillStyle = 'rgba(255,255,255,0.35)';
      ctx.fillRect(0, y, 10, 2);
      ctx.fillText(m + ' м', 13, y + 4);
    }
    if (best > 5) {
      var by = -best * J.PX_PER_M;
      if (by > top && by < bottom) {
        ctx.save();
        ctx.strokeStyle = '#ffe14d'; ctx.lineWidth = 2.5;
        ctx.setLineDash([10, 7]); ctx.lineDashOffset = -t * 30;
        ctx.globalAlpha = 0.9;
        ctx.beginPath(); ctx.moveTo(0, by); ctx.lineTo(J.W, by); ctx.stroke();
        ctx.restore();
        pill(ctx, null, by - 16, 'Твой рекорд · ' + Math.floor(best) + ' м', '#ffe14d', '#3a2a00');
      }
    }
  };
})(window.J);
