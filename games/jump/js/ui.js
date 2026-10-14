'use strict';
/* Интерфейс: экраны, HUD, магазин */
(function (J) {
  function $(id) { return document.getElementById(id); }
  var screens = ['menu', 'help', 'pause', 'over', 'shop'];
  var backTo = 'menu', cur = 'menu', tab = 'skins';
  var lastH = -1, lastC = -1;
  var SND_ON = '<svg viewBox="0 0 24 24" width="20" height="20"><path d="M4 9h4l5-4v14l-5-4H4z" fill="currentColor"/><path d="M16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/></svg>';
  var SND_OFF = '<svg viewBox="0 0 24 24" width="20" height="20"><path d="M4 9h4l5-4v14l-5-4H4z" fill="currentColor"/><path d="M16 9l5 6M21 9l-5 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';

  function hiDpiCanvas(w, h) {
    var c = document.createElement('canvas');
    var d = Math.min(window.devicePixelRatio || 1, 3);
    c.width = Math.round(w * d); c.height = Math.round(h * d);
    var ctx = c.getContext('2d');
    ctx.scale(d, d);
    return { c: c, ctx: ctx };
  }

  function coinHtml(n) { return '<i class="coin"></i>' + n; }

  var UI = J.ui = {
    current: function () { return cur; },
    show: function (name) {
      cur = name;
      screens.forEach(function (s) { $('scr-' + s).classList.toggle('hidden', s !== name); });
      $('hud').classList.toggle('hidden', name !== null && name !== 'pause');
      if (name === 'menu') UI.refreshMenu();
      if (name === 'shop') UI.renderShop();
      var focusEl = { menu: 'btn-play', pause: 'btn-resume', over: 'btn-again' }[name];
      if (focusEl && !(navigator.maxTouchPoints > 0)) { try { $(focusEl).focus({ preventScroll: true }); } catch (e) { /* игнор */ } }
    },
    refreshMenu: function () {
      $('menu-best').textContent = Math.floor(J.save.best) + ' м';
      $('menu-coins').textContent = J.save.coins;
      UI.refreshSound();
      var tb = $('btn-tilt');
      if (J.input.tiltSupported()) {
        tb.classList.remove('hidden');
        tb.textContent = 'Наклон: ' + (J.save.tilt ? 'вкл' : 'выкл');
        tb.classList.toggle('on', J.save.tilt);
      }
    },
    refreshSound: function () {
      $('btn-sound').textContent = 'Звук: ' + (J.save.sound ? 'вкл' : 'выкл');
      $('btn-sound').classList.toggle('on', J.save.sound);
      $('hud-sound').innerHTML = J.save.sound ? SND_ON : SND_OFF;
      $('hud-sound').setAttribute('aria-label', J.save.sound ? 'Выключить звук' : 'Включить звук');
    },
    hud: function (h, c) {
      if (h !== lastH) { $('hud-h').textContent = h; lastH = h; }
      if (c !== lastC) { $('hud-c').textContent = c; lastC = c; }
    },
    touchHint: function () {
      var el = $('touch-hint');
      if (!('ontouchstart' in window || navigator.maxTouchPoints > 0) || J.save.tilt) return;
      el.classList.remove('hidden');
      el.style.animation = 'none'; void el.offsetWidth; el.style.animation = '';
      clearTimeout(UI._th);
      UI._th = setTimeout(function () { el.classList.add('hidden'); }, 3600);
    },
    pauseInfo: function (h) { $('pause-info').textContent = 'Высота: ' + h + ' м'; },
    showOver: function (o) {
      $('over-title').textContent = o.record ? 'Новый рекорд!' : 'Игра окончена';
      $('over-title').classList.toggle('record', o.record);
      $('over-h').textContent = o.h;
      $('over-c').textContent = o.coins;
      $('over-best').textContent = Math.floor(J.save.best) + ' м';
      $('over-total').textContent = J.save.coins;
      backTo = 'over';
      UI.show('over');
    },
    renderShop: function () {
      $('shop-coins').textContent = J.save.coins;
      var list = $('shop-list');
      list.innerHTML = '';
      list.classList.toggle('upg', tab === 'upg');
      document.querySelectorAll('.tab').forEach(function (b) { b.classList.toggle('on', b.getAttribute('data-tab') === tab); });
      if (tab === 'skins') J.SKINS.forEach(function (s) { list.appendChild(skinCard(s)); });
      else J.UPGRADES.forEach(function (u) { list.appendChild(upgRow(u)); });
    }
  };

  function skinCard(s) {
    var owned = J.save.owned.indexOf(s.id) >= 0;
    var b = document.createElement('button');
    b.className = 'card' + (J.save.skin === s.id ? ' sel' : '') + (owned ? '' : ' locked');
    var cv = hiDpiCanvas(72, 64);
    J.drawHero(cv.ctx, 36, 58, { skin: s, scale: 1.3, look: 0.3, mood: 'normal', t: 0.3 });
    b.appendChild(cv.c);
    var nm = document.createElement('div'); nm.className = 'nm'; nm.textContent = s.name;
    var pr = document.createElement('div');
    pr.className = 'pr' + (owned ? ' ok' : '');
    if (J.save.skin === s.id) pr.textContent = 'Выбран';
    else if (owned) pr.textContent = 'Есть';
    else pr.innerHTML = coinHtml(s.price);
    b.appendChild(nm); b.appendChild(pr);
    b.addEventListener('click', function () {
      if (owned) { J.save.skin = s.id; J.sfx.play('click'); }
      else if (J.save.coins >= s.price) {
        J.save.coins -= s.price; J.save.owned.push(s.id); J.save.skin = s.id; J.sfx.play('buy');
      } else { J.sfx.play('deny'); b.classList.remove('shake'); void b.offsetWidth; b.classList.add('shake'); return; }
      J.persist(); UI.renderShop();
    });
    return b;
  }

  function upgRow(u) {
    var lvl = J.save.upg[u.id] || 0, max = u.prices.length;
    var row = document.createElement('div'); row.className = 'up';
    var cv = hiDpiCanvas(40, 40);
    var type = u.id === 'start' ? 'jet' : u.id;
    J.draw.item(cv.ctx, { type: type, x: 20, y: 38, t: 0 }, 0.4);
    row.appendChild(cv.c);
    var tx = document.createElement('div'); tx.className = 'tx';
    var info = u.id === 'start' ? (lvl ? 'Сейчас: ' + J.startJetDur().toFixed(1) + ' с' : 'Нет')
      : 'Сейчас: ' + J.powerDur(u.id).toFixed(1) + ' с';
    tx.innerHTML = '<div class="nm"></div><div class="ds"></div><div class="pips"></div>';
    tx.querySelector('.nm').textContent = u.name;
    tx.querySelector('.ds').textContent = u.desc + ' · ' + info;
    var pips = tx.querySelector('.pips');
    for (var i = 0; i < max; i++) { var p = document.createElement('i'); if (i < lvl) p.className = 'on'; pips.appendChild(p); }
    row.appendChild(tx);
    var buy = document.createElement('button'); buy.className = 'buy';
    if (lvl >= max) { buy.textContent = 'Макс.'; buy.classList.add('max'); buy.disabled = true; }
    else {
      var price = u.prices[lvl];
      buy.innerHTML = coinHtml(price);
      buy.setAttribute('aria-label', 'Купить за ' + price);
      if (J.save.coins < price) buy.disabled = true;
      buy.addEventListener('click', function () {
        if (J.save.coins < price) { J.sfx.play('deny'); return; }
        J.save.coins -= price; J.save.upg[u.id] = lvl + 1;
        J.persist(); J.sfx.play('buy'); UI.renderShop();
      });
    }
    row.appendChild(buy);
    return row;
  }

  UI.init = function (game) {
    function on(id, fn) {
      $(id).addEventListener('click', function (e) { J.sfx.unlock(); J.sfx.play('click'); fn(e); });
    }
    on('btn-play', function () { game.start(); });
    on('btn-again', function () { game.start(); });
    on('btn-restart', function () { game.start(); });
    on('btn-resume', function () { game.resume(); });
    on('btn-menu', function () { game.toMenu(); });
    on('btn-over-menu', function () { game.toMenu(); });
    on('btn-help', function () { backTo = 'menu'; UI.show('help'); });
    on('btn-shop', function () { backTo = 'menu'; UI.show('shop'); });
    on('btn-over-shop', function () { backTo = 'over'; UI.show('shop'); });
    on('hud-pause', function () { game.pause(); });
    var toggleSound = function () { J.sfx.setEnabled(!J.save.sound); UI.refreshSound(); if (J.save.sound) { J.sfx.unlock(); J.sfx.play('click'); } };
    $('btn-sound').addEventListener('click', toggleSound);
    $('hud-sound').addEventListener('click', function (e) { toggleSound(); e.currentTarget.blur(); });
    on('btn-tilt', function () {
      if (J.save.tilt) { J.save.tilt = false; J.persist(); UI.refreshMenu(); return; }
      J.input.enableTilt(function (ok) { J.save.tilt = ok; J.persist(); UI.refreshMenu(); });
    });
    document.querySelectorAll('[data-back]').forEach(function (b) {
      b.addEventListener('click', function () {
        J.sfx.play('click');
        UI.show(backTo);
        if (backTo === 'over') { $('over-best').textContent = Math.floor(J.save.best) + ' м'; $('over-total').textContent = J.save.coins; }
      });
    });
    document.querySelectorAll('.tab').forEach(function (b) {
      b.addEventListener('click', function () { tab = b.getAttribute('data-tab'); J.sfx.play('click'); UI.renderShop(); });
    });
    UI.refreshSound();
  };
})(window.J);
