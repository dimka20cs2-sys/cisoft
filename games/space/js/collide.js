/* Неоновый космос — столкновения: пули, лазер, тараны, щит */
(function () {
  'use strict';
  const SP = window.SP;

  SP.collide = function (dt) {
    const G = SP.game, P = SP.player, B = SP.bullets, E = SP.enemies, BS = SP.boss, FX = SP.fx;
    const en = E.pool.items, pb = B.pl.items;

    // пули игрока по врагам и боссу
    for (let i = 0; i < pb.length; i++) {
      const b = pb[i];
      if (!b.alive) continue;
      let hit = false;
      for (let j = 0; j < en.length; j++) {
        const e = en[j];
        if (!e.alive || e.y < -10) continue;
        const rr = e.r + 4;
        if (SP.dist2(b.x, b.y, e.x, e.y) < rr * rr) {
          E.damage(e, b.dmg);
          hit = true;
          break;
        }
      }
      if (!hit && BS.hitTest(b.x, b.y, 4)) {
        BS.damage(b.dmg);
        hit = true;
      }
      if (hit) {
        b.alive = false;
        FX.burst(b.x, b.y - 4, b.col, 2, 120, 4, 0.2);
        SP.audio.hit();
      }
    }

    // лазер: бьёт всё в своём столбце
    if (P.laser > 0 && P.alive) {
      const dps = P.dmg * 18;
      for (let j = 0; j < en.length; j++) {
        const e = en[j];
        if (!e.alive || e.y > P.y || e.y < -10) continue;
        if (Math.abs(e.x - P.x) < e.r + 10) {
          E.damage(e, dps * dt);
          if (Math.random() < 0.3) FX.burst(e.x, e.y + e.r * 0.5, SP.COL.pink, 1, 150, 5, 0.25);
        }
      }
      if (BS.active && BS.enter <= 0 && Math.abs(BS.x - P.x) < 80 && BS.y < P.y) {
        BS.damage(dps * dt);
        if (Math.random() < 0.4) FX.burst(P.x, BS.y + 40, SP.COL.pink, 1, 160, 5, 0.25);
      }
    }

    if (!P.alive || G.state !== 'play') return;

    // вражеские пули по игроку (щит поглощает)
    const eb = B.en.items;
    const shield = P.shield > 0;
    const sr = shield ? 31 : P.r;
    for (let i = 0; i < eb.length; i++) {
      const b = eb[i];
      if (!b.alive) continue;
      const rr = b.r * 0.75 + sr;
      if (SP.dist2(b.x, b.y, P.x, P.y) < rr * rr) {
        b.alive = false;
        if (shield) {
          FX.burst(b.x, b.y, SP.COL.green, 4, 120, 4, 0.3);
          SP.audio.hit();
        } else {
          G.hurt();
          if (!P.alive) return;
        }
      }
    }

    // таран врагами
    for (let j = 0; j < en.length; j++) {
      const e = en[j];
      if (!e.alive) continue;
      const rr = e.r * 0.8 + sr;
      if (SP.dist2(e.x, e.y, P.x, P.y) < rr * rr) {
        if (shield) {
          E.damage(e, e.type === 'tank' ? 8 : 999);
          FX.shake(0.2);
        } else if (P.inv <= 0) {
          E.damage(e, e.type === 'tank' ? 6 : 999);
          G.hurt();
          if (!P.alive) return;
        }
      }
    }
    if (BS.active && BS.hitTest(P.x, P.y, sr * 0.7) && !shield) G.hurt();
  };
})();
