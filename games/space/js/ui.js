/* Неоновый космос — экраны меню, паузы, итога и ангар */
(function () {
  'use strict';
  const SP = window.SP;
  const $ = id => document.getElementById(id);
  const U = SP.ui = { cur: 'start' };
  const SCREENS = ['start', 'help', 'hangar', 'pause', 'over'];
  let backTo = 'start';

  U.show = function (name) {
    U.cur = name;
    SCREENS.forEach(s => $('scr-' + s).classList.toggle('hidden', s !== name));
    $('hudBtns').classList.toggle('hidden', name !== null);
    if (name === 'start') U.refreshStart();
    if (name === 'hangar') U.renderHangar();
    if (document.activeElement && document.activeElement.blur) document.activeElement.blur();
  };

  U.refreshStart = function () {
    $('sBest').textContent = SP.fmt(SP.best);
    $('sCoins').textContent = SP.fmt(SP.save.coins);
  };

  function soundIcon() {
    const on = SP.audio.on;
    const svg = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
      '<path d="M4 9h4l5-4v14l-5-4H4z"/>' +
      (on ? '<path d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12"/>' : '<path d="M17 9l5 6M22 9l-5 6"/>') + '</svg>';
    document.querySelectorAll('.snd-ico').forEach(el => { el.innerHTML = svg; });
    document.querySelectorAll('.snd-lbl').forEach(el => { el.textContent = on ? 'Звук: вкл' : 'Звук: выкл'; });
    $('btnSound').setAttribute('aria-label', on ? 'Выключить звук' : 'Включить звук');
  }

  U.renderHangar = function () {
    const s = SP.save;
    $('hCoins').textContent = SP.fmt(s.coins);
    let h = '';
    SP.UPG.forEach(u => {
      const lvl = s.upg[u.id], cost = SP.upgCost(u);
      let pips = '';
      for (let i = 0; i < u.costs.length; i++) pips += '<i class="' + (i < lvl ? 'on' : '') + '"></i>';
      const btn = cost < 0 ? '<button class="buy" disabled>Макс.</button>' :
        '<button class="buy" data-upg="' + u.id + '"' + (s.coins < cost ? ' disabled' : '') + '><span class="cn"></span>' + SP.fmt(cost) + '</button>';
      h += '<div class="upg"><div class="ut"><b>' + u.name + '</b><small>' + u.desc + '</small><div class="pips">' + pips + '</div></div>' + btn + '</div>';
    });
    $('upgList').innerHTML = h;
    let k = '';
    SP.SKINS.forEach((sk, i) => {
      const owned = s.skins.indexOf(i) >= 0, sel = s.skin === i;
      let lbl;
      if (sel) lbl = 'Выбран';
      else if (owned) lbl = 'Выбрать';
      else lbl = '<span class="cn"></span>' + SP.fmt(sk.cost);
      k += '<button class="skin' + (sel ? ' sel' : '') + '" data-skin="' + i + '"' +
        (!owned && s.coins < sk.cost ? ' data-poor="1"' : '') + ' style="--c:' + sk.color + '">' +
        '<canvas width="128" height="128" data-prev="' + i + '"></canvas><b>' + sk.name + '</b><span class="st">' + lbl + '</span></button>';
    });
    $('skinList').innerHTML = k;
    document.querySelectorAll('canvas[data-prev]').forEach(c => {
      const x = c.getContext('2d'), sp = SP.shipSprite(+c.dataset.prev);
      x.clearRect(0, 0, 128, 128);
      x.drawImage(sp.c, 4, 4, 120, 120);
    });
  };

  function buyUpg(id) {
    const u = SP.UPG.filter(q => q.id === id)[0];
    const cost = SP.upgCost(u);
    if (cost < 0 || SP.save.coins < cost) return;
    SP.save.coins -= cost;
    SP.save.upg[id]++;
    SP.persist();
    SP.audio.buy();
    U.renderHangar();
  }

  function pickSkin(i) {
    const s = SP.save, sk = SP.SKINS[i];
    if (s.skins.indexOf(i) < 0) {
      if (s.coins < sk.cost) { SP.audio.click(); return; }
      s.coins -= sk.cost;
      s.skins.push(i);
      SP.audio.buy();
    } else SP.audio.click();
    s.skin = i;
    SP.persist();
    U.renderHangar();
  }

  U.showOver = function (d) {
    $('oScore').textContent = SP.fmt(d.score);
    $('oWave').textContent = d.wave;
    $('oBest').textContent = SP.fmt(d.best);
    $('oCoins').textContent = '+' + SP.fmt(d.coins);
    $('oKills').textContent = d.kills;
    $('oNew').classList.toggle('hidden', !d.newBest);
    U.show('over');
  };

  U.onEnter = function () {
    const ae = document.activeElement;
    if (ae && ae.tagName === 'BUTTON') return false; // кнопка в фокусе сработает сама
    if (U.cur === 'start' || U.cur === 'over') { SP.game.start(); return true; }
    if (U.cur === 'pause') { SP.game.resume(); return true; }
    return false;
  };

  document.addEventListener('click', e => {
    const t = e.target.closest('[data-act],[data-upg],[data-skin]');
    if (!t) return;
    SP.audio.init();
    if (t.dataset.upg) { buyUpg(t.dataset.upg); return; }
    if (t.dataset.skin !== undefined) { pickSkin(+t.dataset.skin); return; }
    const a = t.dataset.act;
    if (a !== 'play' && a !== 'again') SP.audio.click();
    if (a === 'play' || a === 'again') SP.game.start();
    else if (a === 'hangar') { backTo = U.cur === 'over' ? 'over' : 'start'; U.show('hangar'); }
    else if (a === 'help') U.show('help');
    else if (a === 'back') U.show(U.cur === 'hangar' ? backTo : 'start');
    else if (a === 'resume') SP.game.resume();
    else if (a === 'menu') SP.game.toMenu();
    else if (a === 'pause') SP.game.pause();
    else if (a === 'sound') { SP.audio.toggle(); soundIcon(); }
  });

  soundIcon();
})();
