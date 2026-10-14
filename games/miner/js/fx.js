'use strict';
// Частицы, всплывающие надписи, тряска экрана, вспышка урона
(function (M) {
  var F = M.fx = { parts: [], pops: [], trauma: 0 };

  F.reset = function () { F.parts.length = 0; F.pops.length = 0; F.trauma = 0; };

  F.burst = function (x, y, cols, n, spd, opt) {
    opt = opt || {};
    for (var i = 0; i < n; i++) {
      if (F.parts.length > 600) F.parts.shift();
      F.parts.push({
        x: x + 0.5 + (Math.random() - 0.5) * (opt.spread || 0.7),
        y: y + (Math.random() - 0.5) * (opt.spread || 0.7),
        vx: (Math.random() - 0.5) * spd * 2,
        vy: -Math.random() * spd - (opt.up || 0.5),
        life: 0.4 + Math.random() * 0.6,
        c: cols[Math.floor(Math.random() * cols.length)],
        s: (opt.size || 0.11) * (0.6 + Math.random() * 0.8),
        g: opt.grav === undefined ? 22 : opt.grav,
        glow: !!opt.glow
      });
    }
  };

  F.pop = function (x, y, text, col, big) {
    F.pops.push({ x: x + 0.5, y: y, text: text, col: col || '#fff', life: 1.2, max: 1.2, big: !!big });
  };

  F.shake = function (a) { F.trauma = Math.min(1, F.trauma + a); };

  F.flash = function () {
    var el = document.getElementById('flash');
    if (!el) return;
    el.classList.add('on');
    setTimeout(function () { el.classList.remove('on'); }, 60);
  };

  F.update = function (dt, world) {
    F.trauma = Math.max(0, F.trauma - dt * 1.6);
    for (var i = F.parts.length - 1; i >= 0; i--) {
      var p = F.parts[i];
      p.life -= dt;
      if (p.life <= 0) { F.parts.splice(i, 1); continue; }
      p.vy += p.g * dt;
      var nx = p.x + p.vx * dt, ny = p.y + p.vy * dt;
      if (world && p.g > 0 && world.solid(Math.floor(nx), Math.floor(ny))) {
        if (world.solid(Math.floor(p.x), Math.floor(ny))) { p.vy *= -0.35; p.vx *= 0.7; ny = p.y; }
        if (world.solid(Math.floor(nx), Math.floor(p.y))) { p.vx *= -0.4; nx = p.x; }
      }
      p.x = nx; p.y = ny;
    }
    for (var j = F.pops.length - 1; j >= 0; j--) {
      var q = F.pops[j];
      q.life -= dt;
      q.y -= dt * (0.6 + q.life * 0.8);
      if (q.life <= 0) F.pops.splice(j, 1);
    }
  };

  F.offset = function (S) {
    var m = F.trauma * F.trauma * S * 0.35;
    return { x: (Math.random() * 2 - 1) * m, y: (Math.random() * 2 - 1) * m };
  };

  F.drawParts = function (g, ox, oy, S, glowPass) {
    for (var i = 0; i < F.parts.length; i++) {
      var p = F.parts[i];
      if (p.glow !== glowPass) continue;
      var sz = Math.max(1, p.s * S * Math.min(1, p.life * 2.5));
      g.fillStyle = p.c;
      g.fillRect(Math.round(ox + p.x * S - sz / 2), Math.round(oy + p.y * S - sz / 2), Math.ceil(sz), Math.ceil(sz));
    }
  };

  F.drawPops = function (g, ox, oy, S, dpr) {
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    for (var i = 0; i < F.pops.length; i++) {
      var q = F.pops[i], t = q.life / q.max;
      var grow = t > 0.85 ? 1 + (t - 0.85) * 4 : 1;
      var size = Math.round((q.big ? 26 : 18) * dpr * grow);
      g.globalAlpha = Math.min(1, t * 3);
      g.font = '800 ' + size + 'px "Segoe UI", system-ui, sans-serif';
      var x = ox + q.x * S, y = oy + q.y * S;
      g.lineWidth = Math.max(2, 4 * dpr);
      g.strokeStyle = 'rgba(0,0,0,.85)';
      g.strokeText(q.text, x, y);
      g.fillStyle = q.col;
      g.fillText(q.text, x, y);
    }
    g.globalAlpha = 1;
  };
})(window.M);
