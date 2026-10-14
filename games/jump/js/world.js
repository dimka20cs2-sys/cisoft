'use strict';
/* Мир: генерация платформ, бонусов, монет и врагов */
(function (J) {
  var ITEM_TYPES = ['jet', 'prop', 'prop', 'shield', 'magnet', 'magnet'];

  function World(startY) {
    this.platforms = [];
    this.items = [];
    this.coins = [];
    this.enemies = [];
    this.t = 0;
    this.coinsGot = 0;
    this.stomps = 0;
    this.itemCd = 6;
    this.enemyCd = 4;
    this.nextY = startY;
    if (startY >= -1) {
      this.platforms.push({ type: 'ground', x: J.W / 2, y: 0, w: J.W + 60, h: 80 });
    } else {
      this.platforms.push(this.mkPlat('normal', J.W / 2, startY, 80));
    }
  }

  World.prototype.mkPlat = function (type, x, y, w) {
    return {
      type: type, x: x, y: y, w: w, h: 14, baseX: x,
      range: 0, spd: 0, ph: Math.random() * 6.28,
      t: 0, broken: false, fall: 0, fvy: 0, gone: false,
      fade: 1, touched: false, spring: null, squash: 0
    };
  };

  function freeX(w, avoid) {
    var x = 0;
    for (var tries = 0; tries < 8; tries++) {
      x = J.rand(w / 2 + 4, J.W - w / 2 - 4);
      var ok = true;
      for (var i = 0; i < avoid.length; i++) {
        if (Math.abs(avoid[i] - x) < w + 14) { ok = false; break; }
      }
      if (ok) break;
    }
    return x;
  }

  World.prototype.addCoins = function (p) {
    var n = J.randi(3, 5), y0 = p.y - 34;
    if (J.chance(0.5)) { // ряд над платформой
      var sp = 22, x0 = J.clamp(p.x, 12 + sp * (n - 1) / 2, J.W - 12 - sp * (n - 1) / 2);
      for (var i = 0; i < n; i++) this.coins.push(mkCoin(x0 + (i - (n - 1) / 2) * sp, y0));
    } else { // дуга
      for (var k = 0; k < n; k++) {
        var a = Math.PI * (k / (n - 1));
        var cx = J.clamp(p.x - Math.cos(a) * 40, 12, J.W - 12);
        this.coins.push(mkCoin(cx, y0 - Math.sin(a) * 34));
      }
    }
  };

  function mkCoin(x, y) { return { x: x, y: y, ph: Math.random() * 6.28, taken: false, vx: 0, vy: 0, pull: false }; }

  World.prototype.step = function () {
    var prevY = this.nextY;
    var h = -prevY / J.PX_PER_M;
    var d = J.clamp(h / 2600, 0, 1);
    var gap = Math.min(J.rand(J.lerp(46, 100, d), J.lerp(70, 142, d)), 150);
    var y = prevY - gap;
    var r = Math.random();
    var pMove = h > 30 ? J.lerp(0.12, 0.4, d) : 0;
    var pCloud = h > 350 ? 0.12 : 0;
    var pTramp = h > 40 ? 0.03 : 0;
    var type = 'normal', w = J.lerp(74, 58, d);
    if (r < pMove) { type = 'moving'; w = 60; }
    else if (r < pMove + pCloud) { type = 'cloud'; w = 72; }
    else if (r < pMove + pCloud + pTramp) { type = 'tramp'; w = 70; }
    var x = J.rand(w / 2 + 4, J.W - w / 2 - 4);
    var p = this.mkPlat(type, x, y, w);
    if (type === 'moving') {
      p.range = J.rand(40, J.W / 2 - w / 2 - 6);
      p.baseX = J.clamp(x, p.range + w / 2 + 4, J.W - p.range - w / 2 - 4);
      p.spd = J.rand(0.8, 1.4 + d * 1.2);
    }
    if (type === 'cloud') { p.baseX = x; p.range = 14; p.spd = 0.5; }
    this.platforms.push(p);

    // пружина или бонус
    this.itemCd--;
    if (type === 'normal' && h > 25 && J.chance(0.075)) {
      p.spring = { ox: J.rand(-w / 2 + 10, w / 2 - 10), t: 0 };
    } else if ((type === 'normal' || type === 'moving') && h > 50 && this.itemCd <= 0 && J.chance(0.05)) {
      this.items.push({ type: J.pick(ITEM_TYPES), plat: p, ox: J.rand(-w / 4, w / 4), x: x, y: y, t: 0 });
      this.itemCd = 10;
    } else if (J.chance(0.38)) {
      this.addCoins(p);
    }

    // доп. платформы между прошлой и новой
    var midY = prevY - gap * J.rand(0.38, 0.62);
    if (gap > 50 && h > 15 && J.chance(J.lerp(0.26, 0.45, d))) {
      this.platforms.push(this.mkPlat('break', freeX(62, [x]), midY, 62));
    } else if (h > 150 && gap > 55 && J.chance(0.2)) {
      var v = this.mkPlat('vanish', freeX(62, [x]), midY, 62);
      v.ph = Math.random() * 3;
      this.platforms.push(v);
    } else if (gap > 70 && J.chance(0.1)) {
      var e = this.mkPlat('normal', freeX(60, [x]), midY, 60);
      this.platforms.push(e);
    }

    // враги и опасности
    this.enemyCd--;
    if (h > 150 && this.enemyCd <= 0 && gap > 70 && J.chance(J.lerp(0.06, 0.13, d))) {
      var ey = prevY - gap * 0.5;
      if (h > 800 && J.chance(0.35)) {
        var hx = x < J.W / 2 ? J.rand(J.W * 0.62, J.W - 40) : J.rand(40, J.W * 0.38);
        this.enemies.push({ type: 'hole', x: hx, y: ey, r: 22, t: 0, dead: false, dt: 0 });
      } else {
        var range = J.rand(30, 110);
        var bx = J.rand(20 + range, J.W - 20 - range);
        this.enemies.push({ type: 'glitch', x: bx, y: ey, baseX: bx, baseY: ey, range: range,
          spd: J.rand(1, 2.2), ph: Math.random() * 6.28, r: 16, t: 0, dead: false, dt: 0, vy: 0 });
      }
      this.enemyCd = J.randi(4, 8);
    }
    this.nextY = y;
  };

  World.prototype.generate = function (limitY) {
    var guard = 0;
    while (this.nextY > limitY && guard++ < 200) this.step();
  };

  World.prototype.cleanup = function (bottomY) {
    function keep(o) { return o.y < bottomY && !o.gone; }
    this.platforms = this.platforms.filter(function (p) { return p.type === 'ground' ? p.y < bottomY + 100 : keep(p); });
    this.items = this.items.filter(function (i) { return i.y < bottomY && !i.taken; });
    this.coins = this.coins.filter(function (c) { return c.y < bottomY && !c.taken; });
    this.enemies = this.enemies.filter(function (e) { return e.y < bottomY + 60 && !e.gone; });
  };

  J.World = World;
})(window.J);
