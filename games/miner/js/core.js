'use strict';
// Общие константы, хранилище, шум, описание блоков и улучшений
window.M = window.M || {};
(function (M) {
  var PFX = 'cisoft-miner-';
  M.store = {
    get: function (k, d) {
      try { var v = localStorage.getItem(PFX + k); return v === null ? d : JSON.parse(v); } catch (e) { return d; }
    },
    set: function (k, v) {
      try { localStorage.setItem(PFX + k, JSON.stringify(v)); } catch (e) { /* хранилище недоступно */ }
    }
  };

  M.post = function (event, score) {
    try {
      if (window.parent && window.parent !== window) {
        var msg = { type: 'cisoft-game', id: 'miner', event: event };
        if (typeof score === 'number') msg.score = score;
        window.parent.postMessage(msg, '*');
      }
    } catch (e) { /* ignore */ }
  };

  M.clamp = function (v, a, b) { return v < a ? a : v > b ? b : v; };
  M.lerp = function (a, b, t) { return a + (b - a) * t; };

  M.hash = function (x, y, s) {
    var h = (Math.imul(x | 0, 374761393) + Math.imul(y | 0, 668265263) + Math.imul(s | 0, 982451653)) | 0;
    h = Math.imul(h ^ (h >>> 13), 1274126177);
    h ^= h >>> 16;
    return (h >>> 0) / 4294967296;
  };
  M.noise = function (x, y, s) {
    var xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi;
    var u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf);
    var a = M.hash(xi, yi, s), b = M.hash(xi + 1, yi, s), c = M.hash(xi, yi + 1, s), e = M.hash(xi + 1, yi + 1, s);
    return a + (b - a) * u + (c - a) * v + (a - b - c + e) * u * v;
  };

  M.W = 32; // ширина мира в блоках

  var B = M.B = {
    AIR: 0, GRASS: 1, DIRT: 2, STONE: 3, DEEP: 4, GRAVEL: 5, COAL: 6, IRON: 7, GOLD: 8, RED: 9, DIAM: 10,
    LAVA: 11, BEDROCK: 12, CHEST: 13, TORCH: 14, APPLE: 15, BREAD: 16, BUNDLE: 17
  };
  // hard — секунды копания, cost — энергия, value — монеты/очки, col — цвета осколков
  function d(o) { o.solid = !!o.solid; return o; }
  var D = M.DEF = [];
  D[B.AIR] = d({});
  D[B.GRASS] = d({ solid: 1, hard: 0.2, cost: 1, col: ['#5aa13c', '#4a8a30', '#866043'] });
  D[B.DIRT] = d({ solid: 1, hard: 0.2, cost: 1, col: ['#866043', '#6b4a30', '#9a7350'] });
  D[B.STONE] = d({ solid: 1, hard: 0.36, cost: 2, col: ['#7d7d7d', '#6a6a6a', '#929292'] });
  D[B.DEEP] = d({ solid: 1, hard: 0.55, cost: 3, col: ['#4b4b55', '#3a3a43', '#5c5c66'] });
  D[B.GRAVEL] = d({ solid: 1, hard: 0.22, cost: 1, col: ['#8a8480', '#6e6866', '#a39d98'] });
  D[B.COAL] = d({ solid: 1, hard: 0.42, cost: 2, value: 5, name: 'Уголь', col: ['#2a2a2a', '#7d7d7d', '#111'], pop: '#c9c9c9' });
  D[B.IRON] = d({ solid: 1, hard: 0.5, cost: 2, value: 12, name: 'Железо', col: ['#d8af93', '#b08468', '#7d7d7d'], pop: '#f0c8a8' });
  D[B.GOLD] = d({ solid: 1, hard: 0.58, cost: 3, value: 30, name: 'Золото', col: ['#fcee4b', '#e6b81e', '#7d7d7d'], pop: '#ffe14a' });
  D[B.RED] = d({ solid: 1, hard: 0.62, cost: 3, value: 45, name: 'Редстоун', col: ['#ff2a2a', '#a40d0d', '#7d7d7d'], pop: '#ff5b4f' });
  D[B.DIAM] = d({ solid: 1, hard: 0.75, cost: 4, value: 120, name: 'Алмаз', col: ['#6af2f8', '#2bbac4', '#4b4b55'], pop: '#7ff6ff' });
  D[B.LAVA] = d({ liquid: 1 });
  D[B.BEDROCK] = d({ solid: 1, hard: Infinity, cost: 0, col: ['#333'] });
  D[B.CHEST] = d({ solid: 1, hard: 0.3, cost: 1, col: ['#a0682a', '#6e4318', '#f2c230'] });
  D[B.TORCH] = d({ item: 1 });
  D[B.APPLE] = d({ item: 1, pick: 1 });
  D[B.BREAD] = d({ item: 1, pick: 1 });
  D[B.BUNDLE] = d({ item: 1, pick: 1 });

  M.UPS = [
    { id: 'speed', name: 'Острая кирка', desc: 'Копает на 13% быстрее за уровень', cost: [30, 80, 170, 320, 560] },
    { id: 'dur', name: 'Прочная кирка', desc: 'Меньше энергии на каждый блок', cost: [40, 100, 200, 380, 650] },
    { id: 'energy', name: 'Выносливость', desc: '+30 энергии на старте забега', cost: [35, 90, 180, 340, 600] },
    { id: 'lamp', name: 'Яркая лампа', desc: 'Свет на каске бьёт дальше', cost: [25, 70, 150, 280, 480] },
    { id: 'luck', name: 'Удача', desc: '+10% шанс двойной руды', cost: [50, 120, 240, 420, 700] },
    { id: 'torch', name: 'Запас факелов', desc: '+2 факела на старте забега', cost: [20, 50, 110, 220, 400] }
  ];

  M.loadSave = function () {
    var s = M.store.get('save', null);
    if (!s || typeof s !== 'object') s = {};
    var out = { coins: Math.max(0, Math.floor(+s.coins || 0)), up: {} };
    M.UPS.forEach(function (u) { out.up[u.id] = M.clamp(Math.floor(+(s.up && s.up[u.id]) || 0), 0, u.cost.length); });
    return out;
  };
  M.save = M.loadSave();
  M.persist = function () { M.store.set('save', M.save); };
  M.best = Math.max(0, Math.floor(+M.store.get('best', 0) || 0));

  M.stats = function () {
    var u = M.save.up;
    return {
      digMul: 1 - 0.13 * u.speed,
      costMul: 1 - 0.12 * u.dur,
      energy: 140 + 30 * u.energy,
      lamp: 3.4 + 0.9 * u.lamp,
      luck: 0.1 * u.luck,
      torches: 3 + 2 * u.torch,
      pickLevel: Math.min(u.speed, u.dur)
    };
  };
})(window.M);
