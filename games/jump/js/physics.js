'use strict';
/* Мир: движение объектов и столкновения с игроком */
(function (J) {
  var W = J.World.prototype;

  W.update = function (dt, player) {
    this.t += dt;
    var t = this.t;
    for (var i = 0; i < this.platforms.length; i++) {
      var p = this.platforms[i];
      p.t += dt;
      if (p.squash > 0) p.squash = Math.max(0, p.squash - dt * 3);
      if (p.spring && p.spring.t > 0) p.spring.t = Math.max(0, p.spring.t - dt * 3);
      if (p.type === 'moving' && !p.broken) {
        p.x = p.baseX + Math.sin(t * p.spd + p.ph) * p.range;
      } else if (p.type === 'cloud') {
        p.x = p.baseX + Math.sin(t * p.spd + p.ph) * p.range;
        if (p.touched) { p.fade -= dt * 1.4; if (p.fade <= 0) p.gone = true; }
      } else if (p.type === 'break' && p.broken) {
        p.fvy += J.G * dt; p.y += p.fvy * dt; p.fall += dt;
        if (p.fall > 1.5) p.gone = true;
      } else if (p.type === 'vanish') {
        // цикл: видна 1.8с, гаснет 0.4с, нет 1.1с, появляется 0.4с
        var c = (t + p.ph) % 3.7;
        p.fade = c < 1.8 ? 1 : c < 2.2 ? 1 - (c - 1.8) / 0.4 : c < 3.3 ? 0 : (c - 3.3) / 0.4;
      }
    }
    for (var k = 0; k < this.items.length; k++) {
      var it = this.items[k];
      it.t += dt;
      it.x = it.plat.x + it.ox; it.y = it.plat.y;
      if (it.plat.broken || it.plat.gone) it.taken = true;
    }
    var mag = player && player.magnetT > 0 && !player.dead;
    var magR = 150 + ((J.save.upg.magnet || 0) * 15);
    for (var c2 = 0; c2 < this.coins.length; c2++) {
      var co = this.coins[c2];
      co.ph += dt * 5;
      if (mag) {
        var dx = player.x - co.x, dy = (player.y - 14) - co.y;
        var dist = Math.sqrt(dx * dx + dy * dy);
        if (co.pull || dist < magR) {
          co.pull = true;
          var sp = 520 + (co.pullT = (co.pullT || 0) + dt) * 900;
          co.x += dx / (dist + 0.01) * Math.min(dist, sp * dt);
          co.y += dy / (dist + 0.01) * Math.min(dist, sp * dt);
        }
      }
    }
    for (var e = 0; e < this.enemies.length; e++) {
      var en = this.enemies[e];
      en.t += dt;
      if (en.dead) {
        en.dt += dt;
        if (en.type === 'glitch') { en.vy += J.G * dt; en.y += en.vy * dt; }
        if (en.dt > 1.2) en.gone = true;
        continue;
      }
      if (en.type === 'glitch') {
        en.x = en.baseX + Math.sin(en.t * en.spd + en.ph) * en.range;
        en.y = en.baseY + Math.sin(en.t * 3 + en.ph) * 6;
      }
    }
  };

  function landOn(world, player, p) {
    var hx = player.x;
    player.y = p.y;
    switch (p.type) {
      case 'break':
        p.broken = true; p.fvy = 60;
        J.fx.burst(p.x, p.y + 6, 14, ['#c98a4b', '#9b6230', '#e3b27a'], { w: p.w / 2, speed: 120, size: 6 });
        J.fx.shake(3);
        J.sfx.play('crack');
        return false; // не отталкивает
      case 'tramp':
        player.bounce(J.TRAMP_V); p.squash = 1;
        J.fx.burst(hx, p.y, 12, ['#ff5a5a', '#ffffff', '#ffd23d'], { speed: 220, angle: -Math.PI / 2, spread: 1.1, shape: 'star' });
        J.fx.shake(4);
        J.sfx.play('tramp');
        return true;
      case 'cloud':
        player.bounce(J.JUMP_V * 0.96);
        p.touched = true;
        J.fx.burst(hx, p.y + 4, 10, '#ffffff', { speed: 90, size: 7, shape: 'circle', g: -40 });
        J.sfx.play('cloud');
        return true;
      default:
        if (p.spring && Math.abs(hx - (p.x + p.spring.ox)) < 14 + player.hw * 0.5) {
          player.bounce(J.SPRING_V); p.spring.t = 1;
          J.fx.burst(hx, p.y - 10, 10, ['#ffe14d', '#ffffff'], { speed: 200, angle: -Math.PI / 2, spread: 0.9, shape: 'star' });
          J.fx.shake(2.5);
          J.sfx.play('spring');
          return true;
        }
        player.bounce(J.JUMP_V); p.squash = 0.6;
        if (p.type === 'vanish') J.fx.burst(hx, p.y + 4, 6, '#c9a6ff', { speed: 80 });
        else J.fx.burst(hx, p.y, 6, 'rgba(255,255,255,0.85)', { speed: 70, angle: -Math.PI / 2, spread: 1.4, g: 100 });
        J.sfx.play('jump');
        return true;
    }
  }

  // prevY — низ игрока до шага
  W.collide = function (player, prevY, dt) {
    if (player.dead) return;
    var i;
    if (player.vy > 0 && !player.power) {
      for (i = 0; i < this.platforms.length; i++) {
        var p = this.platforms[i];
        if (p.broken || p.gone) continue;
        if (p.type === 'vanish' && p.fade < 0.5) continue;
        if (p.type === 'cloud' && p.touched) continue;
        if (prevY <= p.y + 2 && player.y >= p.y && Math.abs(player.x - p.x) < p.w / 2 + player.hw - 3) {
          if (landOn(this, player, p)) break;
        }
      }
    }
    var px = player.x, py = player.y - 14;
    for (i = 0; i < this.items.length; i++) {
      var it = this.items[i];
      if (it.taken) continue;
      var dx = it.x - px, dy = (it.y - 14) - py;
      if (dx * dx + dy * dy < 26 * 26) {
        it.taken = true;
        player.givePower(it.type, J.powerDur(it.type));
        var names = { jet: 'Ранец!', prop: 'Пропеллер!', shield: 'Щит!', magnet: 'Магнит!' };
        J.fx.text(it.x, it.y - 34, names[it.type], '#fff36b');
        J.fx.burst(it.x, it.y - 14, 18, ['#fff36b', '#7fe8ff', '#ffffff'], { speed: 200, shape: 'star', g: 0 });
        J.sfx.play('power');
      }
    }
    for (i = 0; i < this.coins.length; i++) {
      var co = this.coins[i];
      if (co.taken) continue;
      var cx = co.x - px, cy = co.y - py;
      if (cx * cx + cy * cy < 22 * 22) {
        co.taken = true;
        this.coinsGot++;
        J.fx.burst(co.x, co.y, 6, ['#ffe14d', '#fff7c2'], { speed: 90, shape: 'star', g: 0, life: 0.4 });
        J.sfx.play('coin');
      }
    }
    for (i = 0; i < this.enemies.length; i++) {
      var en = this.enemies[i];
      if (en.dead) continue;
      var ex = en.x - px, ey = en.y - py;
      var d2 = ex * ex + ey * ey;
      if (en.type === 'hole') {
        var pullR = 120;
        if (d2 < pullR * pullR && !player.power) {
          var dd = Math.sqrt(d2) + 0.01, f = (1 - dd / pullR) * 1400;
          player.vx += ex / dd * f * dt;
          player.vy += ey / dd * f * dt;
        }
        if (d2 < 20 * 20) {
          if (player.power) { continue; }
          if (player.shieldT > 0) {
            player.shieldT = 0; en.dead = true; player.bounce(J.JUMP_V);
            J.fx.burst(en.x, en.y, 24, ['#b48cff', '#7fe8ff', '#ffffff'], { speed: 260, g: 0 });
            J.fx.shake(6); J.sfx.play('shield');
          } else {
            player.kill('hole', en);
            J.fx.shake(5); J.sfx.play('hole');
          }
        }
        continue;
      }
      var rr = en.r + 12;
      if (d2 < rr * rr) {
        var fromTop = player.vy > 0 && player.y < en.y + 6;
        if (fromTop || player.power || player.shieldT > 0) {
          en.dead = true; en.vy = -200;
          this.stomps++;
          if (fromTop) { player.bounce(J.JUMP_V * 1.08); player.y = Math.min(player.y, en.y - en.r); }
          else if (!player.power) { player.shieldT = 0; player.bounce(J.JUMP_V); J.sfx.play('shield'); }
          this.coinsGot += 3;
          J.fx.text(en.x, en.y - 24, '+3', '#ffe14d');
          J.fx.burst(en.x, en.y, 22, ['#ff3df0', '#3dfcff', '#ffffff', '#1b1d2b'], { speed: 240 });
          J.fx.shake(5);
          J.sfx.play('stomp');
        } else {
          player.kill('hit');
          J.fx.burst(px, py, 16, ['#ffffff', '#ff5a5a'], { speed: 200, shape: 'star' });
          J.fx.shake(9);
          J.sfx.play('hit');
        }
      }
    }
  };
})(window.J);
