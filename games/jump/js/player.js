'use strict';
/* Игрок: физика, бонусы, отрисовка */
(function (J) {
  function Player(x, y) {
    this.x = x; this.y = y;
    this.vx = 0; this.vy = 0;
    this.sx = 1; this.sy = 1; this.sv = 0;
    this.face = 1; this.look = 0;
    this.blinkT = 2; this.blink = false;
    this.power = null; this.powerT = 0; this.powerMax = 1;
    this.shieldT = 0; this.shieldMax = 1;
    this.magnetT = 0; this.magnetMax = 1;
    this.dead = null; this.deadT = 0;
    this.rot = 0; this.scale = 1; this.hole = null;
    this.hw = 13; // полуширина для столкновений
    this.t = 0;
  }

  Player.prototype.bounce = function (v) {
    this.vy = v;
    this.sy = 0.6; this.sv = 0;
  };

  Player.prototype.givePower = function (type, dur) {
    if (type === 'jet' || type === 'prop') {
      this.power = type; this.powerT = dur; this.powerMax = dur;
    } else if (type === 'shield') {
      this.shieldT = dur; this.shieldMax = dur;
    } else if (type === 'magnet') {
      this.magnetT = dur; this.magnetMax = dur;
    }
  };

  Player.prototype.kill = function (reason, hole) {
    if (this.dead) return;
    this.dead = reason; this.deadT = 0;
    this.power = null;
    if (reason === 'hit') { this.vy = -420; this.vx *= 0.3; }
    if (reason === 'hole') { this.hole = hole; }
  };

  Player.prototype.update = function (dt, dir) {
    this.t += dt;
    if (this.dead) this.deadT += dt;
    if (this.dead === 'hole' && this.hole) {
      var dx = this.hole.x - this.x, dy = (this.hole.y + 14) - this.y;
      this.x += dx * Math.min(1, dt * 5);
      this.y += dy * Math.min(1, dt * 5);
      this.rot += dt * 14;
      this.scale = Math.max(0, this.scale - dt * 1.4);
      return;
    }
    var target = this.dead ? 0 : dir * J.MAX_VX;
    var k = Math.min(1, dt * (Math.abs(target) > Math.abs(this.vx) ? 9 : 6));
    this.vx += (target - this.vx) * k;
    if (Math.abs(dir) > 0.15) this.face = dir > 0 ? 1 : -1;
    this.look += (J.clamp(this.vx / 200, -1, 1) - this.look) * Math.min(1, dt * 10);
    this.x += this.vx * dt;
    if (this.x < 0) this.x += J.W;
    else if (this.x >= J.W) this.x -= J.W;

    if (this.power) {
      var tv = this.power === 'jet' ? -980 : -660;
      this.vy += (tv - this.vy) * Math.min(1, dt * 5);
      this.powerT -= dt;
      if (this.powerT <= 0) { this.power = null; this.vy = Math.min(this.vy, -380); }
    } else {
      this.vy = Math.min(this.vy + J.G * dt, 1500);
    }
    this.y += this.vy * dt;
    if (this.dead === 'hit') this.rot += dt * 9 * this.face;

    // упругость: сжатие → растяжение
    var tgt = 1 + J.clamp(-this.vy, -900, 1300) / 9000;
    var acc = (tgt - this.sy) * 420 - this.sv * 16;
    this.sv += acc * dt;
    this.sy = J.clamp(this.sy + this.sv * dt, 0.5, 1.5);
    this.sx = J.clamp(1 + (1 - this.sy) * 0.85, 0.75, 1.45);

    if (this.shieldT > 0) this.shieldT -= dt;
    if (this.magnetT > 0) this.magnetT -= dt;
    this.blinkT -= dt;
    if (this.blinkT <= 0) {
      this.blink = !this.blink;
      this.blinkT = this.blink ? 0.12 : J.rand(1.5, 4);
    }
  };

  function drawJet(ctx, p, x, y, t) {
    var bx = x - p.face * 15;
    ctx.save();
    for (var i = -1; i <= 1; i += 2) {
      var tx = bx + i * 5;
      // пламя
      var fl = 14 + Math.sin(t * 50 + i) * 5;
      var g = ctx.createLinearGradient(0, y - 4, 0, y - 4 + fl);
      g.addColorStop(0, '#fff6a0'); g.addColorStop(0.5, '#ff9b2e'); g.addColorStop(1, 'rgba(255,60,30,0)');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.moveTo(tx - 4, y - 4); ctx.lineTo(tx + 4, y - 4); ctx.lineTo(tx, y - 4 + fl); ctx.closePath();
      ctx.fill();
      ctx.fillStyle = '#9aa3b5';
      J.roundRect(ctx, tx - 4.5, y - 26, 9, 22, 4); ctx.fill();
      ctx.fillStyle = '#e8434a';
      J.roundRect(ctx, tx - 4.5, y - 28, 9, 6, 3); ctx.fill();
    }
    ctx.restore();
  }

  function drawProp(ctx, p, x, y, t) {
    var top = y - 28 * p.sy - 4;
    ctx.fillStyle = '#ffd23d';
    ctx.beginPath(); ctx.arc(x, top + 2, 9, Math.PI, 0); ctx.fill();
    ctx.fillStyle = '#ff4d6d';
    ctx.fillRect(x - 1.5, top - 9, 3, 9);
    var s = Math.sin(t * 40);
    ctx.fillStyle = '#4f9cff';
    ctx.beginPath(); ctx.ellipse(x, top - 9, 16 * Math.abs(s) + 2, 3, 0, 0, 6.283); ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath(); ctx.arc(x, top - 9, 2.2, 0, 6.283); ctx.fill();
  }

  Player.prototype.drawAt = function (ctx, x, y, skin) {
    var t = this.t;
    if (this.power === 'jet') drawJet(ctx, this, x, y, t);
    var mood = 'normal';
    if (this.dead) mood = 'dead';
    else if (this.vy > 650) mood = 'scared';
    else if (this.vy < -800 || this.power) mood = 'up';
    J.drawHero(ctx, x, y, {
      skin: skin, sx: this.sx, sy: this.sy, look: this.look, lookY: J.clamp(this.vy / 600, -1, 1),
      blink: this.blink && !this.dead, mood: mood, t: t, rot: this.rot, scale: this.scale
    });
    if (this.power === 'prop') drawProp(ctx, this, x, y, t);
    if (this.shieldT > 0) {
      var warn = this.shieldT < 2 && Math.floor(t * 8) % 2 === 0;
      ctx.save();
      ctx.globalAlpha = warn ? 0.25 : 0.55;
      ctx.strokeStyle = '#7fe8ff'; ctx.lineWidth = 3;
      ctx.fillStyle = 'rgba(120,220,255,0.18)';
      ctx.beginPath(); ctx.arc(x, y - 15, 26 + Math.sin(t * 6) * 1.5, 0, 6.283);
      ctx.fill(); ctx.stroke();
      ctx.globalAlpha = 0.8;
      ctx.fillStyle = '#ffffff';
      ctx.beginPath(); ctx.arc(x - 12, y - 28, 3, 0, 6.283); ctx.fill();
      ctx.restore();
    }
    if (this.magnetT > 0 && !this.dead) {
      ctx.save();
      ctx.globalAlpha = 0.25 + 0.15 * Math.sin(t * 8);
      ctx.strokeStyle = '#ff5a5a'; ctx.lineWidth = 2;
      ctx.setLineDash([4, 6]);
      ctx.beginPath(); ctx.arc(x, y - 15, 36 + (t * 30) % 14, 0, 6.283); ctx.stroke();
      ctx.restore();
    }
  };

  Player.prototype.draw = function (ctx, skin) {
    this.drawAt(ctx, this.x, this.y, skin);
    // копия у края — сквозной переход
    if (this.x < 24) this.drawAt(ctx, this.x + J.W, this.y, skin);
    else if (this.x > J.W - 24) this.drawAt(ctx, this.x - J.W, this.y, skin);
  };

  J.Player = Player;
})(window.J);
