'use strict';
/* Фон: город → небо → закат → космос, плавные переходы по высоте */
(function (J) {
  var KEYS = [
    [0, '#5cb8ff', '#d2f0ff'],
    [500, '#3b8fff', '#a6dcff'],
    [1300, '#4a63d9', '#94c8ff'],
    [1850, '#7a4fb8', '#ffa070'],
    [2500, '#3b2470', '#ff6f86'],
    [3200, '#120f36', '#3a2370'],
    [4500, '#050512', '#18133d']
  ];

  function skyColors(h) {
    if (h <= KEYS[0][0]) return [KEYS[0][1], KEYS[0][2]];
    for (var i = 0; i < KEYS.length - 1; i++) {
      var a = KEYS[i], b = KEYS[i + 1];
      if (h < b[0]) {
        var t = J.smooth((h - a[0]) / (b[0] - a[0]));
        return [J.mixColor(a[1], b[1], t), J.mixColor(a[2], b[2], t)];
      }
    }
    var l = KEYS[KEYS.length - 1];
    return [l[1], l[2]];
  }

  // детерминированный генератор для декораций
  function rng(seed) {
    return function () {
      seed = (seed * 1664525 + 1013904223) >>> 0;
      return seed / 4294967296;
    };
  }

  var layers = null, stars = [], clouds = [], planets = [];
  function build() {
    var r = rng(12345);
    layers = [];
    var defs = [
      { k: 0.35, minH: 90, maxH: 230, color: '#8db6e6', win: 'rgba(255,255,255,0.35)' },
      { k: 0.6, minH: 60, maxH: 170, color: '#5577b0', win: 'rgba(255,236,150,0.85)' }
    ];
    defs.forEach(function (d) {
      var bs = [], x = -10;
      while (x < J.W + 10) {
        var w = 28 + r() * 36;
        bs.push({ x: x, w: w, h: d.minH + r() * (d.maxH - d.minH), roof: r(), seed: Math.floor(r() * 1e6) });
        x += w + 2 + r() * 6;
      }
      layers.push({ def: d, b: bs });
    });
    for (var i = 0; i < 140; i++) {
      stars.push({ x: r() * J.W, y: r(), s: 0.5 + r() * 1.6, tw: r() * 6.28, sp: 1 + r() * 3 });
    }
    for (var c = 0; c < 9; c++) {
      clouds.push({ x: r() * (J.W + 160) - 80, y: r(), s: 0.6 + r() * 0.9, sp: 6 + r() * 14 });
    }
    planets.push({ x: 0.2, y: 0.25, r: 34, c1: '#ff8a5c', c2: '#b8406a', ring: true });
    planets.push({ x: 0.82, y: 0.7, r: 20, c1: '#7fe0ff', c2: '#3a5bd0', ring: false });
  }

  function drawCity(ctx, camY, alpha) {
    if (alpha <= 0.01) return;
    var H = J.H;
    var groundScreen = -camY;
    ctx.save();
    ctx.globalAlpha = alpha;
    for (var li = 0; li < layers.length; li++) {
      var L = layers[li];
      var base = (H - 40) + (groundScreen - (H - 70)) * L.def.k;
      if (base - 260 > H) continue;
      for (var i = 0; i < L.b.length; i++) {
        var b = L.b[i];
        var top = base - b.h;
        ctx.fillStyle = L.def.color;
        ctx.fillRect(b.x, top, b.w, b.h + 400);
        if (b.roof > 0.7) { // антенна
          ctx.fillRect(b.x + b.w / 2 - 1, top - 14, 2, 14);
        } else if (b.roof < 0.25) { // ступенька
          ctx.fillRect(b.x + 5, top - 8, b.w - 10, 8);
        }
        ctx.fillStyle = L.def.win;
        var r = rng(b.seed);
        for (var wy = top + 10; wy < base - 8; wy += 14) {
          for (var wx = b.x + 5; wx < b.x + b.w - 8; wx += 10) {
            if (r() < 0.55) ctx.fillRect(wx, wy, 5, 7);
          }
        }
      }
    }
    ctx.restore();
  }

  function cloudShape(ctx, x, y, s) {
    ctx.beginPath();
    ctx.arc(x, y, 18 * s, 0, 6.283);
    ctx.arc(x + 20 * s, y - 8 * s, 22 * s, 0, 6.283);
    ctx.arc(x + 44 * s, y, 17 * s, 0, 6.283);
    ctx.rect(x, y, 44 * s, 14 * s);
    ctx.fill();
  }

  function drawClouds(ctx, camY, t, alpha, tint) {
    if (alpha <= 0.01) return;
    var H = J.H, span = H + 240;
    ctx.save();
    ctx.globalAlpha = alpha * 0.75;
    ctx.fillStyle = J.mixColor('#ffffff', '#ffc4d8', tint || 0);
    for (var i = 0; i < clouds.length; i++) {
      var c = clouds[i];
      var y = ((c.y * span - camY * 0.3 * c.s) % span + span) % span - 120;
      var x = ((c.x + t * c.sp) % (J.W + 160) + J.W + 160) % (J.W + 160) - 80;
      cloudShape(ctx, x, y, c.s);
    }
    ctx.restore();
  }

  function drawSun(ctx, h, alpha) {
    if (alpha <= 0.01) return;
    var p = J.clamp((h - 1500) / 1300, 0, 1);
    var x = J.W * 0.7, y = J.H * (0.42 + 0.35 * p), r = 46;
    ctx.save();
    ctx.globalAlpha = alpha;
    var g = ctx.createRadialGradient(x, y, r * 0.5, x, y, r * 3.2);
    g.addColorStop(0, 'rgba(255,220,140,0.75)');
    g.addColorStop(1, 'rgba(255,140,90,0)');
    ctx.fillStyle = g;
    ctx.fillRect(x - r * 3.2, y - r * 3.2, r * 6.4, r * 6.4);
    var g2 = ctx.createLinearGradient(0, y - r, 0, y + r);
    g2.addColorStop(0, '#fff3b0');
    g2.addColorStop(1, '#ff8a4c');
    ctx.fillStyle = g2;
    ctx.beginPath(); ctx.arc(x, y, r, 0, 6.283); ctx.fill();
    ctx.restore();
  }

  function drawStars(ctx, camY, t, alpha) {
    if (alpha <= 0.01) return;
    var span = J.H + 40;
    ctx.save();
    ctx.fillStyle = '#ffffff';
    for (var i = 0; i < stars.length; i++) {
      var s = stars[i];
      var y = ((s.y * span - camY * 0.06) % span + span) % span - 20;
      ctx.globalAlpha = alpha * (0.55 + 0.45 * Math.sin(t * s.sp + s.tw));
      ctx.fillRect(s.x, y, s.s, s.s);
    }
    ctx.restore();
  }

  function drawPlanets(ctx, camY, alpha) {
    if (alpha <= 0.01) return;
    var span = J.H + 500;
    ctx.save();
    ctx.globalAlpha = alpha;
    for (var i = 0; i < planets.length; i++) {
      var p = planets[i];
      var x = p.x * J.W;
      var y = ((p.y * span - camY * 0.025) % span + span) % span - 120;
      var g = ctx.createLinearGradient(x - p.r, y - p.r, x + p.r, y + p.r);
      g.addColorStop(0, p.c1); g.addColorStop(1, p.c2);
      ctx.strokeStyle = 'rgba(255,220,180,0.75)';
      ctx.lineWidth = 4;
      if (p.ring) { // задняя половина кольца
        ctx.beginPath(); ctx.ellipse(x, y, p.r * 1.7, p.r * 0.45, -0.35, Math.PI, Math.PI * 2); ctx.stroke();
      }
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(x, y, p.r, 0, 6.283); ctx.fill();
      ctx.fillStyle = 'rgba(0,0,0,0.18)'; // тень
      ctx.save();
      ctx.beginPath(); ctx.arc(x, y, p.r, 0, 6.283); ctx.clip();
      ctx.beginPath(); ctx.rect(x - p.r, y - p.r, p.r * 2, p.r * 2);
      ctx.arc(x - p.r * 0.22, y - p.r * 0.18, p.r * 0.95, 0, 6.283);
      ctx.fill('evenodd');
      ctx.restore();
      if (p.ring) { // передняя половина
        ctx.beginPath(); ctx.ellipse(x, y, p.r * 1.7, p.r * 0.45, -0.35, 0, Math.PI); ctx.stroke();
      }
    }
    ctx.restore();
  }

  J.bg = {
    zoneName: function (h) {
      if (h < 400) return 'Город';
      if (h < 1650) return 'Небо';
      if (h < 2900) return 'Закат';
      return 'Космос';
    },
    draw: function (ctx, camY, t) {
      if (!layers) build();
      var h = Math.max(0, -(camY + J.H * 0.5) / J.PX_PER_M);
      var c = skyColors(h);
      var g = ctx.createLinearGradient(0, 0, 0, J.H);
      g.addColorStop(0, c[0]); g.addColorStop(1, c[1]);
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, J.W, J.H);
      var starsW = J.smooth((h - 2300) / 900);
      var sunW = J.smooth((h - 1450) / 400) * (1 - J.smooth((h - 2750) / 450));
      var cloudW = (0.55 + 0.45 * J.smooth((h - 150) / 400)) * (1 - J.smooth((h - 2300) / 700));
      drawStars(ctx, camY, t, starsW);
      drawPlanets(ctx, camY, J.smooth((h - 3000) / 700));
      drawSun(ctx, h, sunW);
      drawCity(ctx, camY, 1);
      drawClouds(ctx, camY, t, cloudW, sunW);
    }
  };
})(window.J);
