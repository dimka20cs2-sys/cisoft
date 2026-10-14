/* Неоновый космос — босс каждой 5-й волны: паттерны пуль, две фазы */
(function () {
  'use strict';
  const SP = window.SP, C = SP.COL;
  const NAMES = ['ГИДРА', 'ЦЕРБЕР', 'ЛЕВИАФАН', 'ХИМЕРА', 'КРАКЕН', 'ФЕНИКС'];
  const COLORS = [C.pink, C.violet, C.orange, C.cyan, C.red, C.yellow];
  const SHAPE = [0, 56, 28, 40, 66, 50, 88, 12, 62, -26, 32, -44, 0, -34, -32, -44, -62, -26, -88, 12, -66, 50, -28, 40];
  const INNER = [0, 34, 22, 22, 40, 24, 50, 4, 30, -14, 0, -10, -30, -14, -50, 4, -40, 24, -22, 22];

  const BS = SP.boss = {
    active: false, x: 0, y: -150, hp: 1, max: 1, t: 0, k: 1, pat: 0, patT: 0,
    shotT: 0, ang: 0, hitT: 0, name: '', color: C.pink, enter: 0, burst: 0, spawnT: 0
  };

  function sprite() {
    return SP.sprite('boss' + BS.color, 210, 150, x => {
      SP.neonPoly(x, SHAPE, BS.color, 3, 0.16);
      SP.neonPoly(x, INNER, BS.color, 1.6, 0.08);
      x.shadowColor = BS.color;
      x.shadowBlur = 8 * SP.res;
      x.strokeStyle = BS.color;
      x.lineWidth = 1.5;
      x.beginPath();
      x.moveTo(-88, 12); x.lineTo(-50, 4);
      x.moveTo(88, 12); x.lineTo(50, 4);
      x.moveTo(-66, 50); x.lineTo(-40, 24);
      x.moveTo(66, 50); x.lineTo(40, 24);
      x.stroke();
    });
  }

  BS.start = function (wave) {
    const k = Math.max(1, Math.round(wave / 5));
    BS.k = k;
    BS.active = true;
    BS.max = BS.hp = 160 * (1 + (k - 1) * 0.8);
    BS.x = SP.W / 2; BS.y = -120;
    BS.t = 0; BS.pat = 0; BS.patT = 3; BS.shotT = 0; BS.ang = 0; BS.hitT = 0;
    BS.enter = 2.2; BS.burst = 0; BS.spawnT = 6;
    BS.name = NAMES[(k - 1) % NAMES.length];
    BS.color = COLORS[(k - 1) % COLORS.length];
  };

  function ring(n, speed, off, col) {
    for (let i = 0; i < n; i++) {
      const a = off + i / n * Math.PI * 2;
      SP.bullets.enemy(BS.x, BS.y + 20, Math.cos(a) * speed, Math.sin(a) * speed, col, 6);
    }
  }

  BS.update = function (dt) {
    if (!BS.active) return;
    BS.t += dt;
    BS.hitT = Math.max(0, BS.hitT - dt);
    const rage = BS.hp < BS.max * 0.5;
    const spd = (rage ? 1.35 : 1) * (1 + (BS.k - 1) * 0.12);
    if (BS.enter > 0) {
      BS.enter -= dt;
      BS.y += (150 - BS.y) * Math.min(1, dt * 2.2);
      return;
    }
    BS.x = SP.W / 2 + Math.sin(BS.t * 0.55) * (SP.W / 2 - 100);
    BS.y = 150 + Math.sin(BS.t * 1.1) * 18;

    BS.patT -= dt;
    if (BS.patT <= 0) {
      BS.pat = (BS.pat + 1) % 3;
      BS.patT = 3.6;
      BS.shotT = 0.5;
      BS.burst = 0;
    }
    BS.shotT -= dt * spd;
    if (BS.shotT <= 0) {
      if (BS.pat === 0) {
        // кольцо пуль
        ring(14 + BS.k * 2, 150 * spd, BS.ang, BS.color);
        BS.ang += 0.22;
        BS.shotT = 1.0;
        SP.audio.eshot();
      } else if (BS.pat === 1) {
        // прицельный веер очередями
        SP.bullets.aimed(BS.x - 40, BS.y + 40, 250 * spd, C.orange, 5, 0.75, 5);
        SP.bullets.aimed(BS.x + 40, BS.y + 40, 250 * spd, C.orange, 5, 0.75, 5);
        BS.burst++;
        BS.shotT = BS.burst % 3 === 0 ? 0.9 : 0.22;
        SP.audio.eshot();
      } else {
        // спираль
        BS.ang += 0.32;
        for (let j = 0; j < 2; j++) {
          const a = BS.ang + j * Math.PI;
          SP.bullets.enemy(BS.x, BS.y + 20, Math.cos(a) * 170 * spd, Math.sin(a) * 170 * spd, C.cyan, 5);
        }
        BS.shotT = 0.085;
      }
    }
    if (rage) {
      BS.spawnT -= dt;
      if (BS.spawnT <= 0) {
        BS.spawnT = 4.5;
        SP.enemies.spawn('kami', SP.rand(40, SP.W - 40), -30, SP.waves.diff);
        SP.enemies.spawn('kami', SP.rand(40, SP.W - 40), -60, SP.waves.diff);
      }
    }
  };

  /* Попадание по хитбоксу из трёх окружностей */
  BS.hitTest = function (x, y, r) {
    if (!BS.active || BS.enter > 0) return false;
    if (SP.dist2(x, y, BS.x, BS.y) < (46 + r) * (46 + r)) return true;
    if (SP.dist2(x, y, BS.x - 62, BS.y + 10) < (28 + r) * (28 + r)) return true;
    return SP.dist2(x, y, BS.x + 62, BS.y + 10) < (28 + r) * (28 + r);
  };

  BS.damage = function (d) {
    if (!BS.active || BS.enter > 0) return;
    BS.hp -= d;
    BS.hitT = 0.06;
    if (BS.hp <= 0) {
      BS.hp = 0;
      BS.active = false;
      SP.game.onBossKill();
    }
  };

  BS.draw = function (ctx) {
    if (!BS.active) return;
    const s = sprite();
    const pulse = 0.6 + Math.sin(BS.t * 6) * 0.25;
    ctx.globalCompositeOperation = 'lighter';
    ctx.globalAlpha = 0.25;
    SP.draw(ctx, SP.glow(BS.color, true), BS.x, BS.y, 4.2);
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
    ctx.drawImage(s.c, BS.x - s.w / 2, BS.y - s.h / 2, s.w, s.h);
    ctx.globalCompositeOperation = 'lighter';
    if (BS.hitT > 0) ctx.drawImage(s.c, BS.x - s.w / 2, BS.y - s.h / 2, s.w, s.h);
    ctx.globalAlpha = pulse;
    const rage = BS.hp < BS.max * 0.5;
    SP.draw(ctx, SP.glow(rage ? C.red : BS.color), BS.x, BS.y + 4, rage ? 1.2 : 0.95);
    SP.draw(ctx, SP.glow(BS.color), BS.x - 40, BS.y + 34, 0.4);
    SP.draw(ctx, SP.glow(BS.color), BS.x + 40, BS.y + 34, 0.4);
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
  };

  BS.clear = function () { BS.active = false; };
})();
