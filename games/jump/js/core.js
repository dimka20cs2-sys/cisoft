'use strict';
/* Прыжок в небо — общие константы, данные, сохранения, утилиты */
window.J = window.J || {};
(function (J) {
  J.W = 360;            // логическая ширина поля
  J.H = 640;            // логическая высота (пересчитывается при ресайзе)
  J.PX_PER_M = 10;      // пикселей в одном метре высоты
  J.G = 1500;           // гравитация
  J.JUMP_V = -720;      // обычный прыжок
  J.SPRING_V = -1180;   // пружина
  J.TRAMP_V = -1520;    // батут
  J.MAX_VX = 340;

  // ---------- утилиты ----------
  J.clamp = function (v, a, b) { return v < a ? a : v > b ? b : v; };
  J.lerp = function (a, b, t) { return a + (b - a) * t; };
  J.rand = function (a, b) { return a + Math.random() * (b - a); };
  J.randi = function (a, b) { return Math.floor(a + Math.random() * (b - a + 1)); };
  J.chance = function (p) { return Math.random() < p; };
  J.smooth = function (t) { t = J.clamp(t, 0, 1); return t * t * (3 - 2 * t); };
  J.pick = function (arr) { return arr[Math.floor(Math.random() * arr.length)]; };

  function hexToRgb(h) {
    var n = parseInt(h.slice(1), 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }
  J.hexToRgb = hexToRgb;
  J.mixColor = function (a, b, t) {
    var A = typeof a === 'string' ? hexToRgb(a) : a;
    var B = typeof b === 'string' ? hexToRgb(b) : b;
    return 'rgb(' + Math.round(J.lerp(A[0], B[0], t)) + ',' +
      Math.round(J.lerp(A[1], B[1], t)) + ',' + Math.round(J.lerp(A[2], B[2], t)) + ')';
  };
  J.shade = function (hex, k) { // k<0 темнее, k>0 светлее
    var c = hexToRgb(hex);
    var t = k < 0 ? [0, 0, 0] : [255, 255, 255];
    return J.mixColor(c, t, Math.abs(k));
  };
  J.roundRect = function (ctx, x, y, w, h, r) {
    r = Math.min(r, w / 2, h / 2);
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  };

  // ---------- хранилище ----------
  var PREFIX = 'cisoft-jump-';
  J.store = {
    get: function (k, d) {
      try {
        var v = localStorage.getItem(PREFIX + k);
        return v === null ? d : JSON.parse(v);
      } catch (e) { return d; }
    },
    set: function (k, v) {
      try { localStorage.setItem(PREFIX + k, JSON.stringify(v)); } catch (e) { /* нет доступа */ }
    }
  };

  // ---------- скины ----------
  J.SKINS = [
    { id: 'slime', name: 'Слайм', price: 0, body: '#3ddc84', hat: 'none' },
    { id: 'blue', name: 'Черника', price: 60, body: '#4f7bff', hat: 'cap' },
    { id: 'pink', name: 'Клубничка', price: 120, body: '#ff5a8a', hat: 'bow' },
    { id: 'orange', name: 'Апельсин', price: 180, body: '#ff9a2e', hat: 'sprout' },
    { id: 'mint', name: 'Мятный', price: 260, body: '#4fe3cf', hat: 'beanie' },
    { id: 'ninja', name: 'Ниндзя', price: 380, body: '#3a3d55', hat: 'headband' },
    { id: 'astro', name: 'Космонавт', price: 520, body: '#eef1ff', hat: 'helmet' },
    { id: 'imp', name: 'Чертёнок', price: 650, body: '#a65bff', hat: 'horns' },
    { id: 'king', name: 'Король', price: 850, body: '#ffc83d', hat: 'crown' }
  ];
  J.skinById = function (id) {
    for (var i = 0; i < J.SKINS.length; i++) if (J.SKINS[i].id === id) return J.SKINS[i];
    return J.SKINS[0];
  };

  // ---------- улучшения ----------
  J.UPGRADES = [
    { id: 'jet', name: 'Реактивный ранец', desc: 'Дольше летит', prices: [40, 90, 160, 260, 400] },
    { id: 'prop', name: 'Пропеллер', desc: 'Дольше крутится', prices: [40, 90, 160, 260, 400] },
    { id: 'shield', name: 'Щит', desc: 'Дольше защищает', prices: [50, 110, 190, 300, 450] },
    { id: 'magnet', name: 'Магнит монет', desc: 'Дольше и дальше тянет', prices: [50, 110, 190, 300, 450] },
    { id: 'start', name: 'Стартовый ранец', desc: 'Взлёт в начале забега', prices: [120, 260, 480] }
  ];
  J.BASE_DUR = { jet: 2.6, prop: 4.2, shield: 9, magnet: 9 };
  J.powerDur = function (type) {
    var lvl = (J.save.upg && J.save.upg[type]) || 0;
    return J.BASE_DUR[type] * (1 + 0.22 * lvl);
  };
  J.startJetDur = function () {
    var lvl = (J.save.upg && J.save.upg.start) || 0;
    return [0, 1.6, 2.6, 3.8][lvl] || 0;
  };

  // ---------- сохранение ----------
  J.loadSave = function () {
    var s = {
      coins: J.store.get('coins', 0) | 0,
      best: +J.store.get('best', 0) || 0,
      skin: J.store.get('skin', 'slime'),
      owned: J.store.get('owned', ['slime']),
      upg: J.store.get('upg', {}),
      sound: J.store.get('sound', true) !== false,
      tilt: J.store.get('tilt', false) === true,
      games: J.store.get('games', 0) | 0
    };
    if (!Array.isArray(s.owned)) s.owned = ['slime'];
    if (s.owned.indexOf('slime') < 0) s.owned.push('slime');
    if (!s.upg || typeof s.upg !== 'object') s.upg = {};
    if (s.owned.indexOf(s.skin) < 0) s.skin = 'slime';
    J.save = s;
    return s;
  };
  J.persist = function () {
    var s = J.save;
    J.store.set('coins', s.coins);
    J.store.set('best', Math.floor(s.best));
    J.store.set('skin', s.skin);
    J.store.set('owned', s.owned);
    J.store.set('upg', s.upg);
    J.store.set('sound', s.sound);
    J.store.set('tilt', s.tilt);
    J.store.set('games', s.games);
  };

  // сообщение родительской странице (сайт CISOFT)
  J.notifyParent = function (event, score) {
    try {
      if (window.parent && window.parent !== window) {
        var msg = { type: 'cisoft-game', id: 'jump', event: event };
        if (score !== undefined) msg.score = score;
        window.parent.postMessage(msg, '*');
      }
    } catch (e) { /* игнор */ }
  };

  J.params = (function () {
    var out = {};
    try {
      var q = window.location.search.replace(/^\?/, '').split('&');
      for (var i = 0; i < q.length; i++) {
        if (!q[i]) continue;
        var kv = q[i].split('=');
        out[decodeURIComponent(kv[0])] = kv.length > 1 ? decodeURIComponent(kv[1]) : '1';
      }
    } catch (e) { /* игнор */ }
    return out;
  })();

  J.loadSave();
})(window.J);
