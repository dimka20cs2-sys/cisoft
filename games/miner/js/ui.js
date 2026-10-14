'use strict';
// Экраны, HUD, магазин улучшений
(function (M) {
  function $(id) { return document.getElementById(id); }
  var U = M.ui = { cur: null, prev: 'start', hudCache: {} };
  var SCR = ['start', 'help', 'shop', 'pause', 'over'];

  U.show = function (name) {
    SCR.forEach(function (n) { $('scr-' + n).classList.toggle('show', n === name); });
    U.cur = name;
    if (name === 'start') U.fillStart();
    if (name === 'shop') U.renderShop();
    U.refreshTouch();
    var btn = name && document.querySelector('#scr-' + name + ' .btn.primary');
    if (btn && !M.input.touch) { try { btn.focus({ preventScroll: true }); } catch (e) { /* ignore */ } }
  };

  U.refreshTouch = function () {
    var st = M.game ? M.game.state : 'menu';
    $('touch').classList.toggle('hidden', !(st === 'play' && M.input.touch));
    $('hud').classList.toggle('hidden', !(st === 'play' || st === 'pause'));
    $('b-pause').classList.toggle('hidden', st !== 'play');
  };

  U.fillStart = function () {
    $('s-best').textContent = M.best;
    $('s-coins').textContent = M.save.coins;
  };

  function set(id, v) {
    if (U.hudCache[id] === v) return;
    U.hudCache[id] = v;
    $(id).textContent = v;
  }
  U.hud = function (p, run, score) {
    var pct = Math.max(0, Math.round(p.energy / p.max * 100));
    if (U.hudCache.pct !== pct) {
      U.hudCache.pct = pct;
      var bar = $('h-energy');
      bar.style.width = pct + '%';
      bar.className = pct <= 20 ? 'low' : pct <= 45 ? 'mid' : '';
    }
    set('h-energy-t', Math.ceil(p.energy) + ' / ' + p.max);
    set('h-depth', run.depth + ' м');
    set('h-score', score);
    set('h-torch', p.torches);
    set('t-torch', p.torches);
  };
  U.resetHud = function () { U.hudCache = {}; };

  U.banner = function (text) {
    var b = $('banner');
    b.textContent = text;
    b.classList.remove('show');
    void b.offsetWidth;
    b.classList.add('show');
  };

  U.renderShop = function () {
    $('shop-coins').textContent = M.save.coins;
    var list = $('shop-list');
    list.innerHTML = '';
    M.UPS.forEach(function (u) {
      var lvl = M.save.up[u.id], max = u.cost.length, cost = u.cost[lvl];
      var card = document.createElement('div');
      card.className = 'up';
      card.setAttribute('data-up', u.id);
      var pips = '';
      for (var i = 0; i < max; i++) pips += '<i class="' + (i < lvl ? 'on' : '') + '"></i>';
      card.innerHTML = '<h3>' + u.name + '</h3><p>' + u.desc + '</p><div class="pips">' + pips + '</div>';
      var b = document.createElement('button');
      if (lvl >= max) { b.textContent = 'Максимум'; b.disabled = true; }
      else {
        b.innerHTML = 'Купить · <span class="coin"></span>' + cost;
        if (M.save.coins >= cost) b.className = 'can';
        b.addEventListener('click', function () { U.buy(u.id); });
      }
      card.appendChild(b);
      list.appendChild(card);
    });
  };

  U.buy = function (id) {
    var u = M.UPS.filter(function (x) { return x.id === id; })[0];
    var lvl = M.save.up[id];
    if (!u || lvl >= u.cost.length) return;
    var cost = u.cost[lvl];
    if (M.save.coins < cost) { M.audio.play('deny'); return; }
    M.save.coins -= cost;
    M.save.up[id] = lvl + 1;
    M.persist();
    M.audio.play('buy');
    U.renderShop();
    var c = document.querySelector('[data-up="' + id + '"]');
    if (c) c.classList.add('flash');
  };

  var CAUSE = {
    energy: 'Энергия кончилась — шахтёр выбился из сил',
    hurt: 'Последний удар отнял все силы',
    lava: 'Шахтёр угодил в лаву',
    quit: 'Забег завершён досрочно'
  };
  U.showOver = function (r) {
    $('o-cause').textContent = CAUSE[r.cause] || '';
    $('o-score').textContent = r.score;
    $('o-record').classList.toggle('hidden', !r.record);
    $('o-best').textContent = M.best;
    $('o-ore').textContent = r.ore;
    $('o-depth').textContent = r.depth + ' м';
    $('o-coins').textContent = '+' + r.coins;
    U.prev = 'over';
    U.show('over');
  };

  document.addEventListener('click', function (e) {
    var el = e.target.closest ? e.target.closest('[data-act]') : null;
    if (!el) return;
    var act = el.getAttribute('data-act'), G = M.game;
    M.audio.unlock();
    M.audio.play('click');
    if (act === 'play') G.start();
    else if (act === 'shop' || act === 'help') { if (U.cur === 'start' || U.cur === 'over') U.prev = U.cur; U.show(act); }
    else if (act === 'back') U.show(U.prev || 'start');
    else if (act === 'resume') G.resume();
    else if (act === 'quit') G.end('quit', true);
    else if (act === 'menu') G.toMenu();
  });

  var sb = $('b-sound');
  function syncSound() { sb.classList.toggle('off', !M.audio.on); sb.setAttribute('aria-pressed', M.audio.on ? 'true' : 'false'); }
  sb.addEventListener('click', function (e) { e.stopPropagation(); M.audio.unlock(); M.audio.toggle(); syncSound(); sb.blur(); });
  syncSound();
  $('b-pause').addEventListener('click', function () { M.game.pause(); });
})(window.M);
