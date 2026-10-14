'use strict';
// Отрисовка: небо, блоки, предметы, шахтёр, освещение, свечение
(function (M) {
  var B = M.B, DEF = M.DEF;

  function glowSprite(col) {
    var c = document.createElement('canvas'); c.width = c.height = 64;
    var g = c.getContext('2d'), gr = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    gr.addColorStop(0, col); gr.addColorStop(1, 'rgba(0,0,0,0)');
    g.fillStyle = gr; g.fillRect(0, 0, 64, 64);
    return c;
  }

  function Renderer(cv) {
    this.cv = cv;
    this.g = cv.getContext('2d');
    this.lc = document.createElement('canvas');
    this.lg = this.lc.getContext('2d');
    this.img = null;
    this.tex = M.buildTextures();
    this.glowWarm = glowSprite('rgba(255,150,50,0.35)');
    this.glowLava = glowSprite('rgba(255,90,20,0.30)');
    this.S = 40; this.dpr = 1;
  }
  var P = Renderer.prototype;

  P.resize = function (w, h, dpr) {
    this.dpr = dpr;
    this.cv.width = Math.max(1, Math.round(w * dpr));
    this.cv.height = Math.max(1, Math.round(h * dpr));
    this.S = Math.round(M.clamp(Math.min(w / 11.5, h / 10.5), 30, 54) * dpr);
  };

  P.backFor = function (y) { return y <= 4 ? this.tex.back.dirt : y > 62 ? this.tex.back.deep : this.tex.back.stone; };

  P.sky = function (g, ox, oy, S, W, time) {
    var gr = g.createLinearGradient(0, oy - 9 * S, 0, oy);
    gr.addColorStop(0, '#3f78c9'); gr.addColorStop(1, '#a8d4ff');
    g.fillStyle = gr; g.fillRect(0, 0, W, oy);
    g.fillStyle = '#fff3a0';
    var sx = ox + 23 * S, sy = oy - 4.4 * S;
    g.fillRect(Math.round(sx), Math.round(sy), Math.round(S * 1.3), Math.round(S * 1.3));
    g.fillStyle = 'rgba(255,255,255,.85)';
    for (var i = 0; i < 6; i++) {
      var cx = ((i * 9.3 + time * 0.25) % 54) - 11, cy = -3.6 - (i % 3) * 1.3, cw = 2.4 + (i % 3);
      g.fillRect(Math.round(ox + cx * S), Math.round(oy + cy * S), Math.round(cw * S), Math.round(S * 0.5));
      g.fillRect(Math.round(ox + (cx + 0.5) * S), Math.round(oy + (cy - 0.4) * S), Math.round((cw - 1) * S), Math.round(S * 0.45));
    }
  };

  P.draw = function (G, time) {
    var g = this.g, S = this.S, W = this.cv.width, H = this.cv.height, w = G.world, p = G.player, t = this.tex;
    if (!w) return;
    var sh = M.fx.offset(S);
    var ox = Math.round(W / 2 - G.cam.x * S + sh.x), oy = Math.round(H / 2 - G.cam.y * S + sh.y);
    var x0 = Math.floor(-ox / S) - 1, x1 = Math.ceil((W - ox) / S), y0 = Math.floor(-oy / S) - 1, y1 = Math.ceil((H - oy) / S);
    g.imageSmoothingEnabled = false;
    g.fillStyle = '#0b0c10'; g.fillRect(0, 0, W, H);
    if (oy > 0) this.sky(g, ox, oy, S, W, time);
    var lights = [], x, y;
    for (y = Math.max(0, y0 - 6); y <= y1 + 6; y++) {
      for (x = Math.max(0, x0 - 6); x <= Math.min(M.W - 1, x1 + 6); x++) {
        var lb = w.get(x, y);
        if (lb === B.TORCH) lights.push({ x: x + 0.5, y: y + 0.4, r: 5.5 + Math.sin(time * 9 + x * 3) * 0.15, i: 1, k: 0 });
        else if (lb === B.LAVA) lights.push({ x: x + 0.5, y: y + 0.5, r: 2.5, i: 0.75, k: 1 });
      }
    }
    var lf = Math.floor(time * 3.5);
    for (y = y0; y <= y1; y++) {
      var Y = Math.round(oy + y * S), hh = Math.round(oy + (y + 1) * S) - Y;
      for (x = x0; x <= x1; x++) {
        var X = Math.round(ox + x * S), ww = Math.round(ox + (x + 1) * S) - X;
        if (y < 0) {
          if (y === -1 && x >= 0 && x < M.W && w.get(x, 0) === B.GRASS) {
            var hf = M.hash(x, -1, 5);
            if (hf < 0.35) {
              var u = S / 16;
              g.fillStyle = '#4f9a36';
              g.fillRect(X + Math.round(u * (3 + hf * 20)), Y + hh - Math.round(u * 3), Math.round(u), Math.round(u * 3));
              if (hf < 0.12) { g.fillStyle = hf < 0.06 ? '#ff5b5b' : '#ffe14a'; g.fillRect(X + Math.round(u * (2 + hf * 20)), Y + hh - Math.round(u * 5), Math.round(u * 3), Math.round(u * 2)); }
            }
          }
          continue;
        }
        var b = w.get(x, y), d = DEF[b];
        if (!d.solid) g.drawImage(this.backFor(y), X, Y, ww, hh);
        if (d.solid) {
          g.drawImage(t.blocks[b][(M.hash(x, y, 7) * 3) | 0], X, Y, ww, hh);
          if ((b === B.DIAM || b === B.GOLD || b === B.RED) && Math.random() < 0.003) {
            M.fx.burst(x, y + 0.5, ['#ffffff', '#fffbd0'], 1, 0.2, { grav: 0, glow: true, size: 0.13, up: 0.2 });
          }
        } else if (b === B.LAVA) {
          var a = w.amount(x, y), top = (a >= 4 || w.isLava(x, y - 1)) ? 0 : Math.round(hh * (1 - a / 4) * 0.7);
          g.drawImage(t.lava[(lf + x + y) & 3], X, Y + top, ww, hh - top);
          if (!top && !w.isLava(x, y - 1) && Math.random() < 0.004) M.fx.burst(x, y, ['#ffd040', '#ff8a1a'], 1, 1, { glow: true, size: 0.1, up: 2 });
        } else if (d.item) {
          var bob = b === B.TORCH ? 0 : Math.round(Math.sin(time * 3 + x * 1.7) * S * 0.05);
          g.drawImage(t.items[b], X, Y + bob, ww, hh);
          if (b === B.TORCH && Math.random() < 0.02) M.fx.burst(x, y + 0.25, ['#ffd84a', '#ff9a1a'], 1, 0.3, { glow: true, grav: -3, size: 0.08, spread: 0.1, up: 0.6 });
        }
      }
    }
    // трещины на копаемом блоке
    if (p && p.mode === 'dig' && p.dig) {
      var st = M.clamp(Math.floor(p.dig.prog / p.dig.need * 6), 0, 5);
      var jx = (Math.random() - 0.5) * S * 0.05;
      g.drawImage(t.crack[st], Math.round(ox + p.dig.x * S + jx), Math.round(oy + p.dig.y * S), S, S);
    }
    for (var i = 0; i < w.falling.length; i++) {
      var f = w.falling[i], j = f.delay > 0 ? Math.sin(time * 70) * S * 0.05 : 0;
      g.drawImage(t.blocks[B.GRAVEL][0], Math.round(ox + f.x * S + j), Math.round(oy + f.y * S), S, S);
    }
    if (p) this.drawPlayer(g, p, ox, oy, S, time);
    M.fx.drawParts(g, ox, oy, S, false);
    if (p) lights.push({ x: p.px + 0.5, y: p.py + 0.35, r: p.lamp * (0.97 + Math.sin(time * 13) * 0.015), i: 1, k: 0 });
    this.lighting(g, x0, x1, y0, y1, ox, oy, S, lights);
    g.globalCompositeOperation = 'lighter';
    for (var k = 0; k < lights.length - (p ? 1 : 0); k++) {
      var L = lights[k], rs = L.k ? S * 2.2 : S * 2.6;
      g.drawImage(L.k ? this.glowLava : this.glowWarm, ox + L.x * S - rs, oy + L.y * S - rs, rs * 2, rs * 2);
    }
    M.fx.drawParts(g, ox, oy, S, true);
    g.globalCompositeOperation = 'source-over';
    M.fx.drawPops(g, ox, oy, S, this.dpr);
  };

  P.drawPlayer = function (g, p, ox, oy, S, time) {
    var X = Math.round(ox + p.px * S), Y = Math.round(oy + p.py * S);
    M.input.playerScreen = { x: (X + S / 2) / this.dpr, y: (Y + S / 2) / this.dpr };
    if (p.dead && p.deadT > 1.2) return;
    if (p.dead) g.globalAlpha = Math.max(0, 1 - p.deadT / 1.2);
    var hurt = p.hurtT > 0 && Math.floor(time * 20) % 2 === 0;
    g.shadowColor = 'rgba(0,0,0,.85)'; g.shadowBlur = S * 0.12;
    M.drawMiner(g, X, Y, S / 16, p.face, p.swing, p.walk, p.pickCol, hurt || p.dead);
    g.shadowBlur = 0; g.shadowColor = 'transparent';
    g.globalAlpha = 1;
  };

  P.lighting = function (g, x0, x1, y0, y1, ox, oy, S, src) {
    var RES = 2, cols = x1 - x0 + 1, rows = y1 - y0 + 1, lw = cols * RES, lh = rows * RES;
    if (this.lc.width !== lw || this.lc.height !== lh || !this.img) {
      this.lc.width = lw; this.lc.height = lh;
      this.img = this.lg.createImageData(lw, lh);
    }
    var data = this.img.data, n = src.length, k = 0;
    for (var j = 0; j < lh; j++) {
      var wy = y0 + (j + 0.5) / RES, amb = wy < 0.5 ? 1 : M.clamp(1 - (wy - 0.5) / 6.5, 0, 1);
      for (var i = 0; i < lw; i++, k += 4) {
        var wx = x0 + (i + 0.5) / RES, L = amb;
        for (var s = 0; s < n && L < 1; s++) {
          var q = src[s], dx = wx - q.x, dy = wy - q.y, d2 = dx * dx + dy * dy, r = q.r;
          if (d2 < r * r) {
            var v = (1 - Math.sqrt(d2) / r) * q.i;
            v = v * (2 - v);
            if (v > L) L = v;
          }
        }
        data[k] = 4; data[k + 1] = 5; data[k + 2] = 10;
        data[k + 3] = Math.round((1 - L) * 250);
      }
    }
    this.lg.putImageData(this.img, 0, 0);
    g.imageSmoothingEnabled = true;
    g.drawImage(this.lc, 0, 0, lw, lh, ox + x0 * S, oy + y0 * S, cols * S, rows * S);
    g.imageSmoothingEnabled = false;
  };

  M.Renderer = Renderer;
})(window.M);
