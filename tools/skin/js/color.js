/* Skin Studio — выбор цвета: HSV, палитра, последние цвета */
(function () {
  'use strict';
  var SS = window.SS;

  var PALETTE = ['#000000', '#3b3b42', '#6e6e78', '#a4a6ad', '#d8dade', '#ffffff',
    '#5a2e16', '#8a5a2e', '#c8906a', '#efc39b', '#f7dcc0', '#fff1d6',
    '#7d1d1d', '#c42b31', '#ff5a4f', '#ff9a3c', '#ffcc33', '#fff27a',
    '#1f5f2a', '#3f8a3a', '#6dbb45', '#3ddc84', '#2f9ca8', '#35e0ff',
    '#1c2d6b', '#34459e', '#4f9cff', '#8e5bd6', '#c45ad1', '#ff8fc7'];

  function rgb2hsv(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    var mx = Math.max(r, g, b), mn = Math.min(r, g, b), d = mx - mn, h = 0;
    if (d) {
      if (mx === r) h = ((g - b) / d) % 6; else if (mx === g) h = (b - r) / d + 2; else h = (r - g) / d + 4;
      h *= 60; if (h < 0) h += 360;
    }
    return [h, mx ? d / mx : 0, mx];
  }
  function hsv2rgb(h, s, v) {
    var c = v * s, x = c * (1 - Math.abs((h / 60) % 2 - 1)), m = v - c, r = 0, g = 0, b = 0;
    if (h < 60) { r = c; g = x; } else if (h < 120) { r = x; g = c; } else if (h < 180) { g = c; b = x; }
    else if (h < 240) { g = x; b = c; } else if (h < 300) { r = x; b = c; } else { r = c; b = x; }
    return [Math.round((r + m) * 255), Math.round((g + m) * 255), Math.round((b + m) * 255)];
  }
  function toHex(c) {
    return '#' + [c[0], c[1], c[2]].map(function (v) { return ('0' + Math.round(v).toString(16)).slice(-2); }).join('');
  }
  function parseHex(s) {
    s = String(s).trim().replace(/^#/, '');
    if (/^[0-9a-f]{3}$/i.test(s)) s = s.replace(/(.)/g, '$1$1');
    if (!/^[0-9a-f]{6}$/i.test(s)) return null;
    return SS.hex('#' + s).slice(0, 3);
  }

  var hsv = [210, 0.69, 1], cur = hsv2rgb(210, 0.69, 1), recent = [];
  var el = {};

  function drawSV() {
    var c = el.sv, ctx = c.getContext('2d'), w = c.width, h = c.height;
    ctx.fillStyle = toHex(hsv2rgb(hsv[0], 1, 1)); ctx.fillRect(0, 0, w, h);
    var g = ctx.createLinearGradient(0, 0, w, 0);
    g.addColorStop(0, '#fff'); g.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
    g = ctx.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, '#000');
    ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
    el.svDot.style.left = (hsv[1] * 100) + '%';
    el.svDot.style.top = ((1 - hsv[2]) * 100) + '%';
    el.hueDot.style.left = (hsv[0] / 360 * 100) + '%';
  }
  function drawHue() {
    var c = el.hue, ctx = c.getContext('2d'), g = ctx.createLinearGradient(0, 0, c.width, 0);
    for (var i = 0; i <= 6; i++) g.addColorStop(i / 6, toHex(hsv2rgb((i * 60) % 360, 1, 1)));
    ctx.fillStyle = g; ctx.fillRect(0, 0, c.width, c.height);
  }
  function update(fromHex) {
    drawSV();
    var h = toHex(cur);
    el.swatch.style.background = h;
    if (!fromHex) el.hex.value = h;
    var on = el.root.querySelectorAll('.sw.on');
    for (var i = 0; i < on.length; i++) on[i].classList.remove('on');
    var m = el.root.querySelector('.sw[data-c="' + h + '"]');
    if (m) m.classList.add('on');
    SS.emit('color', cur);
  }
  function swatch(h, title) {
    var b = document.createElement('button');
    b.className = 'sw'; b.type = 'button';
    b.style.background = h; b.setAttribute('data-c', h); b.title = title || h;
    b.addEventListener('click', function () { api.set(SS.hex(h)); });
    return b;
  }
  function renderRecent() {
    el.recent.innerHTML = '';
    if (!recent.length) { el.recent.innerHTML = '<span class="muted">пока пусто</span>'; return; }
    recent.forEach(function (h) { el.recent.appendChild(swatch(h)); });
  }
  function drag(target, fn) {
    target.addEventListener('pointerdown', function (e) {
      target.setPointerCapture(e.pointerId); fn(e);
      function mv(ev) { fn(ev); }
      function up() { target.removeEventListener('pointermove', mv); target.removeEventListener('pointerup', up); }
      target.addEventListener('pointermove', mv); target.addEventListener('pointerup', up);
    });
  }

  var api = SS.color = {
    get: function () { return [cur[0], cur[1], cur[2], 255]; },
    hex: function () { return toHex(cur); },
    set: function (c) {
      cur = [c[0], c[1], c[2]].map(Math.round);
      var n = rgb2hsv(cur[0], cur[1], cur[2]);
      if (n[1] === 0 || n[2] === 0) n[0] = hsv[0];
      hsv = n;
      update();
    },
    addRecent: function () {
      var h = toHex(cur);
      recent = recent.filter(function (q) { return q !== h; });
      recent.unshift(h);
      if (recent.length > 12) recent.length = 12;
      renderRecent();
      try { localStorage.setItem('cisoft-skin-recent', JSON.stringify(recent)); } catch (e) { /* нет доступа */ }
    },
    init: function (root) {
      el.root = root;
      ['sv', 'hue', 'hex', 'swatch', 'palette', 'recent'].forEach(function (k) { el[k] = root.querySelector('#c-' + k); });
      el.svDot = root.querySelector('#c-sv-dot'); el.hueDot = root.querySelector('#c-hue-dot');
      PALETTE.forEach(function (h) { el.palette.appendChild(swatch(h)); });
      try { recent = JSON.parse(localStorage.getItem('cisoft-skin-recent') || '[]').slice(0, 12); } catch (e) { recent = []; }
      renderRecent();
      drawHue();
      drag(el.sv, function (e) {
        var r = el.sv.getBoundingClientRect();
        hsv[1] = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
        hsv[2] = Math.min(1, Math.max(0, 1 - (e.clientY - r.top) / r.height));
        cur = hsv2rgb(hsv[0], hsv[1], hsv[2]); update();
      });
      drag(el.hue, function (e) {
        var r = el.hue.getBoundingClientRect();
        hsv[0] = Math.min(359.9, Math.max(0, (e.clientX - r.left) / r.width * 360));
        cur = hsv2rgb(hsv[0], hsv[1], hsv[2]); update();
      });
      el.hex.addEventListener('input', function () {
        var c = parseHex(el.hex.value);
        if (c) { cur = c; var n = rgb2hsv(c[0], c[1], c[2]); if (n[1]) hsv = n; else hsv = [hsv[0], n[1], n[2]]; update(true); }
      });
      update();
    }
  };
  SS.toHex = toHex;
})();
