'use strict';
/* Процедурный персонаж-слайм и его шапки */
(function (J) {
  var BW = 32, BH = 28;

  function hat(ctx, kind, w, h, skin, t) {
    var top = -h;
    switch (kind) {
      case 'cap':
        ctx.fillStyle = '#ff4d4d';
        ctx.beginPath();
        ctx.arc(0, top + 3, w * 0.36, Math.PI, 0);
        ctx.fill();
        ctx.fillRect(-2, top + 1, w * 0.62, 4);
        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.arc(0, top + 3 - w * 0.36, 2.5, 0, 6.283); ctx.fill();
        break;
      case 'bow':
        ctx.fillStyle = '#ffffff';
        ctx.save(); ctx.translate(w * 0.22, top + 2);
        ctx.beginPath();
        ctx.moveTo(0, 0); ctx.lineTo(-9, -7); ctx.lineTo(-9, 6); ctx.closePath();
        ctx.moveTo(0, 0); ctx.lineTo(9, -7); ctx.lineTo(9, 6); ctx.closePath();
        ctx.fill();
        ctx.fillStyle = '#ffd1e0';
        ctx.beginPath(); ctx.arc(0, 0, 3, 0, 6.283); ctx.fill();
        ctx.restore();
        break;
      case 'sprout':
        ctx.strokeStyle = '#2f8f3a'; ctx.lineWidth = 2.2;
        ctx.beginPath(); ctx.moveTo(0, top + 1); ctx.quadraticCurveTo(1, top - 6, 0, top - 9); ctx.stroke();
        ctx.fillStyle = '#4fd35c';
        ctx.beginPath(); ctx.ellipse(-5, top - 9, 6, 3, -0.5, 0, 6.283); ctx.fill();
        ctx.beginPath(); ctx.ellipse(5, top - 10, 6, 3, 0.5, 0, 6.283); ctx.fill();
        break;
      case 'beanie':
        ctx.fillStyle = '#ff7a3d';
        ctx.beginPath(); ctx.arc(0, top + 6, w * 0.47, Math.PI, 0); ctx.fill();
        ctx.fillStyle = '#ffd25e';
        J.roundRect(ctx, -w * 0.5, top + 3, w, 6, 3); ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.arc(0, top + 6 - w * 0.47, 4, 0, 6.283); ctx.fill();
        break;
      case 'headband':
        ctx.fillStyle = '#e8343a';
        ctx.fillRect(-w / 2, top + 6, w, 5);
        ctx.save(); ctx.translate(-w / 2, top + 8);
        var s = Math.sin(t * 12) * 2;
        ctx.beginPath(); ctx.moveTo(0, -2); ctx.lineTo(-10, -5 + s); ctx.lineTo(-9, 1 + s); ctx.closePath(); ctx.fill();
        ctx.beginPath(); ctx.moveTo(0, 1); ctx.lineTo(-8, 4 - s); ctx.lineTo(-6, 8 - s); ctx.closePath(); ctx.fill();
        ctx.restore();
        break;
      case 'helmet':
        ctx.strokeStyle = 'rgba(190,230,255,0.9)'; ctx.lineWidth = 2;
        ctx.fillStyle = 'rgba(160,220,255,0.18)';
        ctx.beginPath(); ctx.ellipse(0, -h * 0.55, w * 0.68, h * 0.78, 0, 0, 6.283); ctx.fill(); ctx.stroke();
        ctx.fillStyle = 'rgba(255,255,255,0.7)';
        ctx.beginPath(); ctx.ellipse(-w * 0.32, -h * 0.95, 3, 6, 0.5, 0, 6.283); ctx.fill();
        ctx.fillStyle = '#ff5a5a';
        ctx.fillRect(-1, -h * 0.55 - h * 0.78 - 6, 2, 6);
        ctx.beginPath(); ctx.arc(0, -h * 0.55 - h * 0.78 - 7, 2.5, 0, 6.283); ctx.fill();
        break;
      case 'horns':
        ctx.fillStyle = '#ffe2a8';
        [-1, 1].forEach(function (d) {
          ctx.beginPath();
          ctx.moveTo(d * w * 0.18, top + 2);
          ctx.quadraticCurveTo(d * w * 0.42, top - 4, d * w * 0.38, top - 11);
          ctx.quadraticCurveTo(d * w * 0.34, top - 3, d * w * 0.38, top + 3);
          ctx.closePath(); ctx.fill();
        });
        break;
      case 'crown':
        ctx.fillStyle = '#ffe14d';
        ctx.strokeStyle = '#d99a00'; ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(-10, top + 2); ctx.lineTo(-11, top - 9); ctx.lineTo(-5, top - 3);
        ctx.lineTo(0, top - 12); ctx.lineTo(5, top - 3); ctx.lineTo(11, top - 9); ctx.lineTo(10, top + 2);
        ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#ff3d6e';
        ctx.beginPath(); ctx.arc(0, top - 3, 2, 0, 6.283); ctx.fill();
        break;
      default: break;
    }
  }

  function eyes(ctx, w, h, o) {
    var ey = -h * 0.58, ex = w * 0.2;
    var lx = (o.look || 0) * 2.5, ly = J.clamp(o.lookY || 0, -1, 1) * 2;
    var dark = o.skin.id === 'ninja' ? '#fff' : '#1b1d2b';
    for (var i = -1; i <= 1; i += 2) {
      var x = i * ex + lx * 0.6;
      if (o.mood === 'dead') {
        ctx.strokeStyle = dark; ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x - 3, ey - 3); ctx.lineTo(x + 3, ey + 3);
        ctx.moveTo(x + 3, ey - 3); ctx.lineTo(x - 3, ey + 3);
        ctx.stroke();
        continue;
      }
      if (o.blink) {
        ctx.strokeStyle = dark; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(x - 4, ey); ctx.lineTo(x + 4, ey); ctx.stroke();
        continue;
      }
      var er = o.mood === 'scared' ? 6 : 5.2;
      ctx.fillStyle = '#ffffff';
      ctx.beginPath(); ctx.ellipse(x, ey, er, er * 1.15, 0, 0, 6.283); ctx.fill();
      ctx.fillStyle = '#1b1d2b';
      ctx.beginPath(); ctx.arc(x + lx, ey + ly, o.mood === 'scared' ? 2 : 2.8, 0, 6.283); ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.beginPath(); ctx.arc(x + lx + 1, ey + ly - 1.2, 1, 0, 6.283); ctx.fill();
    }
    // щёчки
    ctx.fillStyle = 'rgba(255,110,140,0.45)';
    ctx.beginPath(); ctx.ellipse(-w * 0.34, -h * 0.36, 3.5, 2.2, 0, 0, 6.283); ctx.fill();
    ctx.beginPath(); ctx.ellipse(w * 0.34, -h * 0.36, 3.5, 2.2, 0, 0, 6.283); ctx.fill();
    // рот
    ctx.strokeStyle = dark; ctx.fillStyle = '#7a2238'; ctx.lineWidth = 1.6;
    var mx = lx * 0.5, my = -h * 0.33;
    if (o.mood === 'up' || o.mood === 'scared' || o.mood === 'dead') {
      ctx.beginPath(); ctx.ellipse(mx, my + 1, 2.6, 3.2, 0, 0, 6.283); ctx.fill();
    } else {
      ctx.beginPath(); ctx.arc(mx, my - 1, 3.5, 0.2, Math.PI - 0.2); ctx.stroke();
    }
  }

  // x, y — центр низа персонажа
  J.drawHero = function (ctx, x, y, o) {
    var skin = o.skin || J.SKINS[0];
    var sx = o.sx || 1, sy = o.sy || 1;
    var w = BW * sx, h = BH * sy;
    ctx.save();
    ctx.translate(x, y);
    if (o.scale) ctx.scale(o.scale, o.scale);
    if (o.rot) { ctx.translate(0, -h / 2); ctx.rotate(o.rot); ctx.translate(0, h / 2); }
    // тень-обводка
    ctx.fillStyle = J.shade(skin.body, -0.35);
    J.roundRect(ctx, -w / 2 - 1.5, -h - 1.5, w + 3, h + 3, 11);
    ctx.fill();
    var g = ctx.createLinearGradient(0, -h, 0, 0);
    g.addColorStop(0, J.shade(skin.body, 0.28));
    g.addColorStop(1, skin.body);
    ctx.fillStyle = g;
    J.roundRect(ctx, -w / 2, -h, w, h, 10);
    ctx.fill();
    // блик
    ctx.fillStyle = 'rgba(255,255,255,0.45)';
    ctx.beginPath(); ctx.ellipse(-w * 0.28, -h * 0.8, w * 0.1, h * 0.09, -0.6, 0, 6.283); ctx.fill();
    // капельки-ножки
    ctx.fillStyle = J.shade(skin.body, -0.15);
    ctx.beginPath(); ctx.ellipse(-w * 0.25, -1, w * 0.13, 2.5, 0, 0, 6.283); ctx.fill();
    ctx.beginPath(); ctx.ellipse(w * 0.25, -1, w * 0.13, 2.5, 0, 0, 6.283); ctx.fill();
    eyes(ctx, w, h, { skin: skin, look: o.look, lookY: o.lookY, blink: o.blink, mood: o.mood });
    hat(ctx, skin.hat, w, h, skin, o.t || 0);
    ctx.restore();
  };

  J.HERO_W = BW;
  J.HERO_H = BH;
})(window.J);
