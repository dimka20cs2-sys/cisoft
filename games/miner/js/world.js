'use strict';
// Мир: генерация по строкам, лава, падающий гравий
(function (M) {
  var B = M.B, DEF = M.DEF, W = M.W;

  function World(seed) {
    this.seed = seed;
    this.rows = [];
    this.amt = [];
    this.wake = new Set();
    this.wakeT = 0;
    this.falling = [];
  }
  var P = World.prototype;

  P.cave = function (x, y) {
    if (y < 7 || x < 0 || x >= W) return false;
    var s = this.seed;
    var n = M.noise(x / 7, y / 4.5, s + 1) * 0.62 + M.noise(x / 3, y / 2.5, s + 2) * 0.38;
    return n > 0.665 - Math.min(0.06, y / 1500);
  };

  P.gen = function (x, y) {
    var s = this.seed, h = M.hash(x, y, s + 9);
    if (y === 0) return B.GRASS;
    if (this.cave(x, y)) {
      var floor = !this.cave(x, y + 1);
      if (y > 30 && floor && M.noise(x / 5, y / 5, s + 5) > 0.58 - Math.min(0.1, (y - 30) / 600)) return B.LAVA;
      if (floor) {
        var r = M.hash(x, y, s + 41);
        if (r < 0.05) return B.TORCH;
        if (r < 0.11) return B.APPLE;
        if (r < 0.14) return B.BREAD;
        if (r < 0.165) return B.BUNDLE;
      }
      return B.AIR;
    }
    var dirtTo = 3 + Math.floor(M.noise(x / 5, 0.5, s + 3) * 4);
    if (y < dirtTo) return B.DIRT;
    if (y > 45 && M.noise(x / 2.6, y / 2.6, s + 31) > 0.9 - Math.min(0.05, (y - 45) / 1500)) return B.LAVA;
    if (y > 12 && h < 0.005) return B.CHEST;
    if (y > 5 && !this.cave(x, y + 1) && M.noise(x / 3.5, y / 2.5, s + 6) > 0.79) return B.GRAVEL;
    var dd = y - 60;
    if (dd >= 0 && M.noise(x / 6, y / 6, s + 51) > 0.62 && M.noise(x / 2, y / 2, s + 50) > 0.915 - Math.min(0.03, dd / 1500)) return B.DIAM;
    if (y >= 38 && M.noise(x / 6, y / 6, s + 41) > 0.5 && M.noise(x / 2.2, y / 2.2, s + 40) > 0.89 - Math.min(0.03, (y - 38) / 2000)) return B.RED;
    if (y >= 22 && M.noise(x / 6, y / 6, s + 32) > 0.45 && M.noise(x / 2.2, y / 2.2, s + 30) > 0.88) return B.GOLD;
    if (y >= 8 && M.noise(x / 2.4, y / 2.4, s + 20) > 0.85) return B.IRON;
    if (y >= 2 && M.noise(x / 2.6, y / 2.6, s + 10) > (y < 40 ? 0.8 : 0.84)) return B.COAL;
    return y > 60 + M.noise(x / 4, 0.5, s + 8) * 8 ? B.DEEP : B.STONE;
  };

  P.row = function (y) {
    var r = this.rows[y];
    if (!r) {
      r = this.rows[y] = new Uint8Array(W);
      var a = this.amt[y] = new Uint8Array(W);
      for (var x = 0; x < W; x++) {
        r[x] = this.gen(x, y);
        if (r[x] === B.LAVA) a[x] = 4;
      }
    }
    return r;
  };
  P.get = function (x, y) {
    if (x < 0 || x >= W) return B.BEDROCK;
    if (y < 0) return B.AIR;
    return this.row(y)[x];
  };
  P.amount = function (x, y) {
    if (x < 0 || x >= W || y < 0) return 0;
    this.row(y);
    return this.amt[y][x];
  };
  P.set = function (x, y, b, amt) {
    if (x < 0 || x >= W || y < 0) return;
    this.row(y)[x] = b;
    this.amt[y][x] = b === B.LAVA ? (amt || 4) : 0;
  };
  P.solid = function (x, y) { return DEF[this.get(x, y)].solid; };
  P.isLava = function (x, y) { return this.get(x, y) === B.LAVA; };
  P.wakeAt = function (x, y) { if (x >= 0 && x < W && y >= 0) this.wake.add(y * W + x); };
  P.wakeAround = function (x, y) {
    this.wakeAt(x, y); this.wakeAt(x - 1, y); this.wakeAt(x + 1, y); this.wakeAt(x, y - 1); this.wakeAt(x, y + 1);
  };

  function canFlow(b) { return !DEF[b].solid && b !== B.LAVA; }

  P.step = function (x, y, g) {
    var b = this.get(x, y);
    if (b === B.GRAVEL) {
      var below = this.get(x, y + 1);
      if (!DEF[below].solid) {
        this.set(x, y, B.AIR);
        this.falling.push({ x: x, y: y, vy: 0, delay: 0.38 });
        this.wakeAt(x, y - 1);
        if (g) M.audio.play('rumble');
      }
    } else if (b === B.LAVA) {
      var a = this.amt[y][x], flowed = false;
      if (canFlow(this.get(x, y + 1))) {
        this.set(x, y + 1, B.LAVA, 3);
        this.wakeAround(x, y + 1);
        flowed = true;
      } else if (a > 1) {
        for (var dx = -1; dx <= 1; dx += 2) {
          if (canFlow(this.get(x + dx, y))) {
            this.set(x + dx, y, B.LAVA, a - 1);
            this.wakeAround(x + dx, y);
            flowed = true;
          }
        }
      }
      if (flowed && g) {
        M.audio.play('sizzle');
        M.fx.burst(x, y + 0.5, ['#ffb02e', '#ff6a00', '#ffe080'], 4, 3);
      }
    }
  };

  P.update = function (dt, g) {
    this.wakeT -= dt;
    if (this.wakeT <= 0 && this.wake.size) {
      this.wakeT = 0.14;
      var list = Array.from(this.wake);
      this.wake.clear();
      for (var i = 0; i < list.length; i++) {
        var k = list[i], x = k % W;
        this.step(x, (k - x) / W, g);
      }
    }
    var p = g && g.player;
    for (var j = this.falling.length - 1; j >= 0; j--) {
      var f = this.falling[j];
      if (f.delay > 0) { f.delay -= dt; continue; }
      var oy = f.y;
      f.vy = Math.min(f.vy + 32 * dt, 18);
      f.y += f.vy * dt;
      if (p && !p.dead && Math.abs(p.px - f.x) < 0.75 && Math.abs(p.py - f.y) < 0.85) {
        this.falling.splice(j, 1);
        g.gravelHit(f);
        continue;
      }
      for (var c = Math.floor(oy); c <= Math.floor(f.y); c++) {
        var under = this.get(f.x, c + 1);
        if (DEF[under].solid || under === B.LAVA) {
          this.falling.splice(j, 1);
          if (under === B.LAVA) {
            M.fx.burst(f.x, c + 1, ['#ffb02e', '#888', '#ff6a00'], 10, 4);
            M.audio.play('sizzle');
          } else {
            this.set(f.x, c, B.GRAVEL);
            this.wakeAround(f.x, c);
            M.fx.burst(f.x, c + 0.9, DEF[B.GRAVEL].col, 8, 3);
            M.fx.shake(0.18);
            M.audio.play('land');
          }
          break;
        }
      }
    }
  };

  M.World = World;
})(window.M);
