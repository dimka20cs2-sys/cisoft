/* Неоновый космос — утилиты: математика, хранилище, пулы, кэш спрайтов */
(function () {
  'use strict';
  const SP = window.SP = {};
  SP.W = 480;
  SP.H = 800;
  SP.COL = {
    blue: '#4f9cff', pink: '#ff4fd8', green: '#3ddc84', yellow: '#ffd84f',
    orange: '#ff8a3d', red: '#ff4f5e', white: '#eaf2ff', cyan: '#4ff0ff', violet: '#a46bff'
  };

  SP.rand = (a, b) => a + Math.random() * (b - a);
  SP.randi = (a, b) => Math.floor(a + Math.random() * (b - a + 1));
  SP.clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
  SP.pick = arr => arr[Math.floor(Math.random() * arr.length)];
  SP.dist2 = (ax, ay, bx, by) => { const dx = ax - bx, dy = ay - by; return dx * dx + dy * dy; };

  SP.hexA = function (hex, a) {
    const n = parseInt(hex.slice(1), 16);
    return 'rgba(' + ((n >> 16) & 255) + ',' + ((n >> 8) & 255) + ',' + (n & 255) + ',' + a + ')';
  };

  /* localStorage с префиксом и защитой от ошибок */
  const PFX = 'cisoft-space-';
  SP.store = {
    get(k, def) {
      try {
        const v = localStorage.getItem(PFX + k);
        return v === null ? def : JSON.parse(v);
      } catch (e) { return def; }
    },
    set(k, v) {
      try { localStorage.setItem(PFX + k, JSON.stringify(v)); } catch (e) { /* нет доступа */ }
    }
  };

  SP.params = (function () {
    const o = {};
    try { new URLSearchParams(location.search).forEach((v, k) => { o[k] = v; }); } catch (e) { /* ignore */ }
    return o;
  })();

  /* Пул объектов: без аллокаций в игровом цикле */
  class Pool {
    constructor(make, n, max) {
      this.make = make;
      this.max = max || n * 4;
      this.items = [];
      this.cur = 0;
      for (let i = 0; i < n; i++) this.items.push(make());
    }
    get() {
      const it = this.items, n = it.length;
      for (let k = 0; k < n; k++) {
        const i = (this.cur + k) % n;
        if (!it[i].alive) { this.cur = i + 1; it[i].alive = true; return it[i]; }
      }
      if (n < this.max) {
        const o = this.make();
        o.alive = true;
        it.push(o);
        return o;
      }
      const o = it[this.cur % n]; // пул переполнен — переиспользуем
      this.cur++;
      o.alive = true;
      return o;
    }
    clear() { for (let i = 0; i < this.items.length; i++) this.items[i].alive = false; }
    count() {
      let c = 0;
      for (let i = 0; i < this.items.length; i++) if (this.items[i].alive) c++;
      return c;
    }
  }
  SP.Pool = Pool;

  /* Кэш спрайтов: всё «дорогое» свечение рисуется один раз во внеэкранный canvas */
  SP.res = 2;
  const cache = new Map();
  SP.setRes = function (r) {
    r = Math.min(3, Math.max(1, Math.ceil(r * 2) / 2));
    if (r !== SP.res) { SP.res = r; cache.clear(); }
  };
  SP.sprite = function (key, w, h, fn) {
    let s = cache.get(key);
    if (s) return s;
    const c = document.createElement('canvas');
    c.width = Math.ceil(w * SP.res);
    c.height = Math.ceil(h * SP.res);
    const x = c.getContext('2d');
    x.scale(SP.res, SP.res);
    x.translate(w / 2, h / 2);
    fn(x);
    s = { c: c, w: w, h: h };
    cache.set(key, s);
    return s;
  };
  SP.draw = function (ctx, s, x, y, sc) {
    sc = sc || 1;
    ctx.drawImage(s.c, x - s.w * sc / 2, y - s.h * sc / 2, s.w * sc, s.h * sc);
  };

  /* Круглое свечение (с белым ядром или мягкое) */
  SP.glow = function (color, soft) {
    return SP.sprite((soft ? 'gs' : 'g') + color, 64, 64, x => {
      const g = x.createRadialGradient(0, 0, 0, 0, 0, 32);
      if (soft) {
        g.addColorStop(0, SP.hexA(color, 1));
        g.addColorStop(0.5, SP.hexA(color, 0.35));
      } else {
        g.addColorStop(0, '#ffffff');
        g.addColorStop(0.18, SP.hexA(color, 1));
        g.addColorStop(0.45, SP.hexA(color, 0.3));
      }
      g.addColorStop(1, SP.hexA(color, 0));
      x.fillStyle = g;
      x.fillRect(-32, -32, 64, 64);
    });
  };

  /* Неоновый многоугольник: полупрозрачная заливка, цветная «трубка» и светлое ядро */
  SP.neonPoly = function (x, pts, color, lw, fillA) {
    x.beginPath();
    for (let i = 0; i < pts.length; i += 2) {
      if (i === 0) x.moveTo(pts[i], pts[i + 1]); else x.lineTo(pts[i], pts[i + 1]);
    }
    x.closePath();
    x.lineJoin = 'round';
    x.fillStyle = SP.hexA(color, fillA === undefined ? 0.16 : fillA);
    x.fill();
    x.shadowColor = color;
    x.shadowBlur = 14 * SP.res;
    x.lineWidth = lw;
    x.strokeStyle = color;
    x.stroke();
    x.stroke();
    x.shadowBlur = 0;
    x.lineWidth = lw * 0.38;
    x.strokeStyle = 'rgba(255,255,255,0.75)';
    x.stroke();
  };

  SP.regPoly = function (n, r, rot) {
    const pts = [];
    rot = rot || 0;
    for (let i = 0; i < n; i++) {
      const a = rot + i / n * Math.PI * 2;
      pts.push(Math.cos(a) * r, Math.sin(a) * r);
    }
    return pts;
  };

  SP.fmt = function (n) {
    return String(Math.floor(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  };
})();
