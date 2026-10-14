'use strict';
// Шахтёр: движение по сетке, копание, гравитация, награды и урон
(function (M) {
  var B = M.B, DEF = M.DEF;
  var PICK = ['#9aa3ad', '#c3ccd6', '#e6eef5', '#f2c230', '#6af2f8', '#b98cff'];

  function Player(x, y, st) {
    this.gx = x; this.gy = y; this.px = x; this.py = y;
    this.face = 1; this.mode = 'idle'; this.t = 0; this.moveDur = 0.15;
    this.from = null; this.to = null; this.dig = null;
    this.vy = 0; this.hang = 0; this.fallFrom = y;
    this.swing = -0.5; this.swingT = 0; this.walk = 0;
    this.st = st; this.max = st.energy; this.energy = st.energy;
    this.torches = st.torches; this.lamp = st.lamp; this.pickCol = PICK[Math.min(5, st.pickLevel)];
    this.dead = false; this.deadT = 0; this.hurtT = 0;
  }
  var P = Player.prototype;

  P.supported = function (w) { return w.solid(this.gx, this.gy + 1); };
  P.canClimb = function (w) { return this.supported(w) || w.solid(this.gx - 1, this.gy) || w.solid(this.gx + 1, this.gy); };

  P.startMove = function (x, y, dur) {
    this.mode = 'move'; this.t = 0; this.moveDur = dur;
    this.from = { x: this.gx, y: this.gy }; this.to = { x: x, y: y };
  };

  P.startDig = function (x, y, dir, w) {
    var b = w.get(x, y), d = DEF[b];
    if (d.hard === Infinity) return;
    this.mode = 'dig'; this.swingT = 0;
    this.dig = { x: x, y: y, dx: dir.x, dy: dir.y, prog: 0, need: d.hard * this.st.digMul, hard: d.hard, hits: 0 };
  };

  P.update = function (dt, G) {
    var w = G.world;
    if (this.hurtT > 0) this.hurtT -= dt;
    if (this.dead) { this.deadT += dt; return; }
    if (this.mode !== 'dig') this.swing += (-0.5 - this.swing) * Math.min(1, dt * 12);
    var dir = M.input.dir();

    if (this.mode === 'move') {
      this.t += dt / this.moveDur;
      var k = Math.min(1, this.t);
      this.px = M.lerp(this.from.x, this.to.x, k);
      this.py = M.lerp(this.from.y, this.to.y, k);
      if (this.to.x !== this.from.x) this.walk += dt * 4;
      if (this.t >= 1) {
        this.gx = this.to.x; this.gy = this.to.y; this.mode = 'idle';
        this.enter(G);
      }
      return;
    }
    if (this.mode === 'fall') {
      this.vy = Math.min(this.vy + 34 * dt, 16);
      this.py += this.vy * dt;
      for (;;) {
        if (w.solid(this.gx, this.gy + 1)) {
          if (this.py >= this.gy) { this.py = this.gy; this.mode = 'idle'; this.land(G); }
          break;
        }
        if (this.py < this.gy + 1) break;
        this.gy++;
        this.enter(G);
        if (this.dead) return;
      }
      return;
    }
    if (!this.supported(w) && this.hang <= 0) {
      this.mode = 'fall'; this.vy = 1.5; this.fallFrom = this.gy; this.dig = null;
      return;
    }
    if (this.hang > 0) this.hang -= dt;

    if (this.mode === 'dig') {
      var dg = this.dig;
      if (!dir || dir.x !== dg.dx || dir.y !== dg.dy || !w.solid(dg.x, dg.y)) { this.mode = 'idle'; this.dig = null; return; }
      dg.prog += dt;
      var period = M.clamp(dg.need / 2, 0.11, 0.2);
      this.swingT += dt;
      var ph = (this.swingT % period) / period;
      var down = dg.dy > 0 ? 0.5 : dg.dy < 0 ? -0.6 : 0;
      this.swing = (ph < 0.6 ? M.lerp(-1.2, 1.1, ph / 0.6) : M.lerp(1.1, -1.2, (ph - 0.6) / 0.4)) + down;
      var hits = Math.floor(this.swingT / period + 0.4);
      if (hits > dg.hits) {
        dg.hits = hits;
        M.audio.play('hit', { hard: dg.hard });
        M.fx.burst(dg.x - dg.dx * 0.45, dg.y + 0.5 - dg.dy * 0.45, DEF[w.get(dg.x, dg.y)].col, 3, 2, { size: 0.08 });
        M.fx.shake(0.04);
      }
      if (dg.prog >= dg.need) { this.mode = 'idle'; this.dig = null; this.breakBlock(G, dg.x, dg.y); }
      return;
    }

    if (!dir) return;
    var x = this.gx, y = this.gy;
    if (dir.x) {
      this.face = dir.x;
      if (w.solid(x + dir.x, y)) this.startDig(x + dir.x, y, dir, w);
      else this.startMove(x + dir.x, y, 0.15);
    } else if (dir.y > 0) {
      if (w.solid(x, y + 1)) this.startDig(x, y + 1, dir, w);
      else this.hang = 0;
    } else if (dir.y < 0) {
      if (w.solid(x, y - 1)) this.startDig(x, y - 1, dir, w);
      else if (this.canClimb(w)) {
        if (this.supported(w)) M.audio.play('jump');
        this.startMove(x, y - 1, 0.17);
        this.hang = 0.32;
      }
    }
  };

  P.breakBlock = function (G, x, y) {
    var w = G.world, b = w.get(x, y), d = DEF[b], st = this.st;
    w.set(x, y, B.AIR);
    w.wakeAround(x, y);
    M.fx.burst(x, y + 0.5, d.col, 14, 4);
    M.fx.shake(0.07 + d.hard * 0.12);
    M.audio.play('break', { hard: d.hard });
    this.energy -= Math.max(0.5, d.cost * st.costMul);
    if (d.value) {
      var dbl = Math.random() < st.luck, v = d.value * (dbl ? 2 : 1);
      G.run.ore += v;
      G.run.found[b] = (G.run.found[b] || 0) + (dbl ? 2 : 1);
      M.fx.pop(x, y + 0.2, '+' + v, d.pop, v >= 30);
      if (dbl) M.fx.pop(x, y - 0.4, 'x2!', '#3ddc84', true);
      M.fx.burst(x, y + 0.5, [d.pop, '#ffffff'], v >= 30 ? 16 : 8, 3, { glow: true, size: 0.09 });
      M.audio.play('ore', { value: v });
      if (b === B.DIAM) M.fx.shake(0.3);
    }
    if (b === B.CHEST) {
      var coins = 15 + Math.floor(Math.random() * 30);
      G.run.ore += coins;
      this.torches += 2;
      this.energy = Math.min(this.max, this.energy + 30);
      M.fx.pop(x, y - 0.2, 'Сундук! +' + coins, '#ffd34d', true);
      M.fx.pop(x, y + 0.5, '+30 энергии, +2 факела', '#3ddc84');
      M.fx.burst(x, y + 0.5, ['#ffd34d', '#fff6c0'], 24, 5, { glow: true });
      M.audio.play('chest');
    }
    if (this.energy <= 0) { this.energy = 0; G.end('energy'); }
  };

  P.enter = function (G) {
    var w = G.world, b = w.get(this.gx, this.gy);
    if (b === B.LAVA) { this.die(G); return; }
    if (b === B.APPLE || b === B.BREAD) {
      var n = b === B.APPLE ? 20 : 40;
      w.set(this.gx, this.gy, B.AIR);
      this.energy = Math.min(this.max, this.energy + n);
      M.fx.pop(this.gx, this.gy - 0.2, '+' + n + ' энергии', '#3ddc84');
      M.fx.burst(this.gx, this.gy + 0.5, b === B.APPLE ? ['#e8332a', '#ff9a8a'] : ['#c8913a', '#efcb7a'], 10, 3);
      M.audio.play('food');
    } else if (b === B.BUNDLE) {
      w.set(this.gx, this.gy, B.AIR);
      this.torches += 2;
      this.energy = Math.min(this.max, this.energy + 10);
      M.fx.pop(this.gx, this.gy - 0.2, '+2 факела', '#ffb020');
      M.audio.play('pickup');
    }
    if (this.from && this.to && this.to.x !== this.from.x && this.mode !== 'fall') M.audio.play('step');
    var depth = this.gy + 1;
    if (depth > G.run.depth) {
      G.run.depth = depth;
      if (depth % 25 === 0) {
        M.ui.banner(depth + ' м!  +' + depth + ' очков');
        G.run.ore += depth;
        M.audio.play('depth');
      }
    }
  };

  P.land = function (G) {
    var fallen = this.gy - this.fallFrom;
    M.fx.burst(this.gx, this.gy + 1, DEF[G.world.get(this.gx, this.gy + 1)].col || ['#888'], Math.min(12, 3 + fallen * 2), 2, { size: 0.07 });
    if (fallen >= 5) this.hurt(G, (fallen - 4) * 4);
    else if (fallen >= 2) { M.audio.play('land'); M.fx.shake(0.12); } else M.audio.play('step');
  };

  P.hurt = function (G, n) {
    if (this.dead) return;
    this.energy -= n;
    this.hurtT = 0.6;
    M.fx.shake(0.5);
    M.fx.flash();
    M.fx.pop(this.gx, this.gy - 0.3, '-' + Math.round(n), '#ff5a4f', true);
    M.audio.play('hurt');
    if (this.energy <= 0) { this.energy = 0; G.end('hurt'); }
  };

  P.die = function (G) {
    if (this.dead) return;
    this.dead = true; this.deadT = 0; this.mode = 'idle';
    M.fx.burst(this.px, this.py + 0.5, ['#ffb02e', '#ff6a00', '#ffe080', '#333'], 40, 6, { glow: true });
    M.fx.shake(0.9);
    M.fx.flash();
    M.audio.play('burn');
    G.end('lava');
  };

  P.placeTorch = function (G) {
    var w = G.world;
    if (this.dead || this.gy < 0 || this.torches <= 0 || w.get(this.gx, this.gy) !== B.AIR) { M.audio.play('deny'); return; }
    w.set(this.gx, this.gy, B.TORCH);
    this.torches--;
    M.fx.burst(this.gx, this.gy + 0.3, ['#ffd84a', '#ff9a1a', '#fff6c0'], 12, 2.5, { glow: true });
    M.audio.play('torch');
  };

  M.Player = Player;
})(window.M);
