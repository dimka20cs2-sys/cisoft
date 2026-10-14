/* Неоновый космос — волны врагов и плавный рост сложности */
(function () {
  'use strict';
  const SP = window.SP;
  const WV = SP.waves = {
    n: 1, state: 'idle', t: 0, clock: 0, queue: [], qi: 0, isBoss: false,
    bannerT: 0, banner: '', sub: '',
    diff: { hp: 1, sp: 1, fire: 1, bs: 1 }
  };

  const COUNTS = { grunt: [4, 6], zig: [3, 5], kami: [2, 4], shooter: [1, 3], tank: [1, 1] };

  function weights(n) {
    const w = [['grunt', 5]];
    if (n >= 2) w.push(['zig', 3]);
    if (n >= 3) w.push(['shooter', 2 + Math.min(2, n * 0.15)]);
    if (n >= 4) w.push(['kami', 2 + Math.min(2, n * 0.15)]);
    if (n >= 6) w.push(['tank', 0.8 + Math.min(1.5, n * 0.08)]);
    return w;
  }

  function pickType(w) {
    let sum = 0;
    for (let i = 0; i < w.length; i++) sum += w[i][1];
    let r = Math.random() * sum;
    for (let i = 0; i < w.length; i++) { r -= w[i][1]; if (r <= 0) return w[i][0]; }
    return w[0][0];
  }

  function build(n) {
    const q = [], w = weights(n);
    const groups = 4 + Math.floor(n * 0.7);
    const gap = Math.max(0.9, 2.5 - n * 0.08);
    let T = 0.3;
    for (let g = 0; g < groups; g++) {
      let type = pickType(w);
      if (g === 0 && n >= 6 && n % 5 !== 0 && Math.random() < 0.5) type = 'tank';
      const cr = COUNTS[type];
      const cnt = SP.randi(cr[0], cr[1]) + (n >= 8 && type !== 'tank' ? 1 : 0);
      const pat = SP.pick(type === 'tank' ? ['rand'] : ['line', 'col', 'v', 'rand']);
      const margin = 40, span = SP.W - margin * 2;
      const cx = SP.rand(margin + 60, SP.W - margin - 60);
      for (let i = 0; i < cnt; i++) {
        let x, at;
        const mid = (cnt - 1) / 2;
        if (pat === 'line') { x = margin + (cnt > 1 ? i / (cnt - 1) : 0.5) * span; at = T + i * 0.06; }
        else if (pat === 'col') { x = cx; at = T + i * 0.38; }
        else if (pat === 'v') { x = SP.clamp(cx + (i - mid) * 46, margin, SP.W - margin); at = T + Math.abs(i - mid) * 0.18; }
        else { x = SP.rand(margin, SP.W - margin); at = T + i * 0.3; }
        q.push({ at: at, type: type, x: x });
      }
      T += gap + cnt * 0.12;
    }
    q.sort((a, b) => a.at - b.at);
    return q;
  }

  WV.start = function (n) {
    WV.n = n;
    const d = WV.diff;
    d.hp = 1 + (n - 1) * 0.11;
    d.sp = 1 + Math.min(0.7, (n - 1) * 0.035);
    d.fire = Math.max(0.45, 1 - (n - 1) * 0.04);
    d.bs = 1 + Math.min(0.6, (n - 1) * 0.03);
    WV.isBoss = n % 5 === 0;
    WV.queue = WV.isBoss ? [] : build(n);
    WV.qi = 0;
    WV.clock = 0;
    WV.state = 'banner';
    WV.bannerT = WV.t = 2.2;
    WV.banner = WV.isBoss ? 'БОСС' : 'ВОЛНА ' + n;
    WV.sub = WV.isBoss ? 'Волна ' + n + ' — держись!' : (n === 1 ? 'Уклоняйся и собирай монеты' : '');
    if (WV.isBoss) SP.audio.warn(); else SP.audio.wave();
  };

  WV.update = function (dt) {
    WV.bannerT = Math.max(0, WV.bannerT - dt);
    if (WV.state === 'banner') {
      WV.t -= dt;
      if (WV.t <= 1.0 && WV.isBoss && !SP.boss.active) SP.boss.start(WV.n);
      if (WV.t <= 0.6) WV.state = 'fight';
      return;
    }
    if (WV.state === 'fight') {
      WV.clock += dt;
      const q = WV.queue;
      while (WV.qi < q.length && q[WV.qi].at <= WV.clock) {
        const s = q[WV.qi++];
        SP.enemies.spawn(s.type, s.x, -30, WV.diff);
      }
      if (WV.qi >= q.length && !SP.boss.active && SP.enemies.count() === 0) {
        WV.state = 'clear';
        WV.t = 1.3;
        const bonus = 250 * WV.n;
        SP.game.addScore(bonus, false);
        SP.fx.text(SP.W / 2, SP.H * 0.42, 'ВОЛНА ПРОЙДЕНА  +' + SP.fmt(bonus), SP.COL.green, 20, 1.3);
      }
      return;
    }
    if (WV.state === 'clear') {
      WV.t -= dt;
      if (WV.t <= 0) WV.start(WV.n + 1);
    }
  };
})();
