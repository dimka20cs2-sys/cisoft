/* Неоновый космос — данные: скины, улучшения, сохранение прогресса */
(function () {
  'use strict';
  const SP = window.SP;

  SP.SKINS = [
    { id: 'arrow', name: 'Стрела', color: '#4f9cff', accent: '#4ff0ff', cost: 0 },
    { id: 'phantom', name: 'Фантом', color: '#ff4fd8', accent: '#c89bff', cost: 400 },
    { id: 'ray', name: 'Скат', color: '#3ddc84', accent: '#ffd84f', cost: 800 }
  ];

  SP.UPG = [
    { id: 'dmg', name: 'Урон', desc: '+25% к урону пушек', costs: [60, 140, 260, 420, 650] },
    { id: 'rate', name: 'Скорострельность', desc: '+15% к темпу стрельбы', costs: [60, 140, 260, 420, 650] },
    { id: 'shield', name: 'Стартовый щит', desc: '+5 с щита в начале забега', costs: [100, 250, 450] },
    { id: 'life', name: 'Ещё жизнь', desc: '+1 жизнь в каждом забеге', costs: [300, 750] }
  ];

  const loaded = SP.store.get('save', null);
  const s = {
    coins: 0,
    upg: { dmg: 0, rate: 0, shield: 0, life: 0 },
    skins: [0],
    skin: 0
  };
  if (loaded && typeof loaded === 'object') {
    s.coins = Math.max(0, Math.floor(+loaded.coins || 0));
    if (loaded.upg && typeof loaded.upg === 'object') {
      SP.UPG.forEach(u => {
        s.upg[u.id] = SP.clamp(Math.floor(+loaded.upg[u.id] || 0), 0, u.costs.length);
      });
    }
    if (Array.isArray(loaded.skins)) {
      s.skins = loaded.skins.filter(i => i >= 0 && i < SP.SKINS.length);
      if (s.skins.indexOf(0) < 0) s.skins.push(0);
    }
    if (s.skins.indexOf(loaded.skin) >= 0) s.skin = loaded.skin;
  }
  SP.save = s;
  SP.best = Math.max(0, Math.floor(+SP.store.get('best', 0) || 0));

  SP.persist = function () { SP.store.set('save', SP.save); };
  SP.setBest = function (v) { SP.best = v; SP.store.set('best', v); };

  SP.upgCost = function (u) {
    const lvl = SP.save.upg[u.id];
    return lvl >= u.costs.length ? -1 : u.costs[lvl];
  };
})();
