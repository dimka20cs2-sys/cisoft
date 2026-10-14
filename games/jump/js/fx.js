'use strict';
/* Частицы, всплывающие надписи, тряска экрана */
(function (J) {
  var parts = [], texts = [];
  var shakeAmt = 0;

  J.fx = {
    reset: function () { parts.length = 0; texts.length = 0; shakeAmt = 0; },
    burst: function (x, y, n, color, o) {
      o = o || {};
      var sp = o.speed || 160;
      for (var i = 0; i < n; i++) {
        if (parts.length > 400) parts.shift();
        var a = o.angle !== undefined ? o.angle + J.rand(-o.spread, o.spread) : J.rand(0, 6.283);
        var v = J.rand(sp * 0.35, sp);
        parts.push({
          x: x + J.rand(-(o.w || 0), o.w || 0), y: y,
          vx: Math.cos(a) * v, vy: Math.sin(a) * v,
          life: 0, max: J.rand(0.35, o.life || 0.7),
          size: J.rand(2, o.size || 4),
          color: Array.isArray(color) ? J.pick(color) : color,
          g: o.g !== undefined ? o.g : 500,
          shape: o.shape || 'sq',
          rot: J.rand(0, 6.28), vr: J.rand(-8, 8)
        });
      }
    },
    text: function (x, y, str, color) {
      texts.push({ x: x, y: y, s: str, c: color || '#fff', life: 0 });
    },
    shake: function (a) { shakeAmt = Math.max(shakeAmt, a); },
    shakeOffset: function () {
      if (shakeAmt < 0.2) return [0, 0];
      return [J.rand(-shakeAmt, shakeAmt), J.rand(-shakeAmt, shakeAmt)];
    },
    update: function (dt) {
      shakeAmt *= Math.pow(0.0015, dt);
      for (var i = parts.length - 1; i >= 0; i--) {
        var p = parts[i];
        p.life += dt;
        if (p.life >= p.max) { parts.splice(i, 1); continue; }
        p.vy += p.g * dt;
        p.vx *= Math.pow(0.3, dt);
        p.x += p.vx * dt; p.y += p.vy * dt;
        p.rot += p.vr * dt;
      }
      for (var k = texts.length - 1; k >= 0; k--) {
        var t = texts[k];
        t.life += dt; t.y -= 40 * dt;
        if (t.life > 0.9) texts.splice(k, 1);
      }
    },
    draw: function (ctx) {
      for (var i = 0; i < parts.length; i++) {
        var p = parts[i];
        var a = 1 - p.life / p.max;
        ctx.globalAlpha = a;
        ctx.fillStyle = p.color;
        var s = p.size * (0.5 + a * 0.5);
        if (p.shape === 'circle') {
          ctx.beginPath(); ctx.arc(p.x, p.y, s, 0, 6.283); ctx.fill();
        } else if (p.shape === 'star') {
          ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot);
          ctx.fillRect(-s, -s * 0.3, s * 2, s * 0.6);
          ctx.fillRect(-s * 0.3, -s, s * 0.6, s * 2);
          ctx.restore();
        } else {
          ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot);
          ctx.fillRect(-s / 2, -s / 2, s, s);
          ctx.restore();
        }
      }
      ctx.globalAlpha = 1;
      ctx.textAlign = 'center';
      ctx.font = 'bold 15px system-ui, -apple-system, Segoe UI, Roboto, sans-serif';
      for (var k = 0; k < texts.length; k++) {
        var t = texts[k];
        ctx.globalAlpha = 1 - Math.max(0, t.life - 0.5) / 0.4;
        ctx.lineWidth = 3; ctx.strokeStyle = 'rgba(0,0,0,0.45)';
        ctx.strokeText(t.s, t.x, t.y);
        ctx.fillStyle = t.c;
        ctx.fillText(t.s, t.x, t.y);
      }
      ctx.globalAlpha = 1;
    }
  };
})(window.J);
