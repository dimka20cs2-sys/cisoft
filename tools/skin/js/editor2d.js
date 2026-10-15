/* Skin Studio — 2D-развёртка скина с сеткой и подписями частей */
(function () {
  'use strict';
  var SS = window.SS, U = SS.U;

  function Editor2D(canvas, skin, tools, status) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.skin = skin;
    this.tools = tools;
    this.status = status;
    this.grid = true;
    this.hover = null;
    this.ext = null;
    this.dirty = true;
    var self = this;
    ['skin', 'layer', 'model', 'mirror', 'tool'].forEach(function (n) { SS.on(n, function () { self.invalidate(); }); });
    SS.on('hover3d', function (p) { self.ext = p; self.invalidate(); });
    this.bind();
    window.addEventListener('resize', function () { self.invalidate(); });
    this.invalidate();
  }
  var E = Editor2D.prototype;

  E.invalidate = function () {
    if (this.raf) return;
    var self = this;
    this.raf = requestAnimationFrame(function () { self.raf = 0; self.draw(); });
  };

  E.fit = function () {
    var c = this.canvas, dpr = Math.min(window.devicePixelRatio || 1, 2);
    var size = Math.max(64, Math.floor(c.clientWidth * dpr / 64) * 64);
    if (c.width !== size) { c.width = c.height = size; this.pattern = null; }
    return size / 64;
  };

  E.draw = function () {
    var S = this.fit(), ctx = this.ctx, c = this.canvas, slim = this.skin.slim, layer = this.tools.layer;
    var dpr = Math.min(window.devicePixelRatio || 1, 2), regs = U.regions(slim);
    if (!this.pattern) {
      var p = document.createElement('canvas');
      p.width = p.height = Math.round(S * 2);
      var pc = p.getContext('2d');
      pc.fillStyle = '#2a2d36'; pc.fillRect(0, 0, p.width, p.height);
      pc.fillStyle = '#343844'; pc.fillRect(0, 0, S, S); pc.fillRect(S, S, S, S);
      this.pattern = ctx.createPattern(p, 'repeat');
    }
    ctx.imageSmoothingEnabled = false;
    ctx.fillStyle = '#15171d';
    ctx.fillRect(0, 0, c.width, c.height);
    ctx.fillStyle = this.pattern;
    regs.forEach(function (r) { ctx.fillRect(r.x * S, r.y * S, r.w * S, r.h * S); });
    ctx.drawImage(this.skin.canvas, 0, 0, c.width, c.height);
    ctx.fillStyle = 'rgba(14,15,20,0.66)';
    regs.forEach(function (r) { if (r.layer !== layer) ctx.fillRect(r.x * S, r.y * S, r.w * S, r.h * S); });
    var act = regs.filter(function (r) { return r.layer === layer; });
    if (this.grid && S >= 4) {
      ctx.save();
      ctx.beginPath();
      act.forEach(function (r) { ctx.rect(r.x * S, r.y * S, r.w * S, r.h * S); });
      ctx.clip();
      ctx.beginPath();
      for (var i = 0; i <= 64; i++) {
        ctx.moveTo(i * S + 0.5, 0); ctx.lineTo(i * S + 0.5, c.height);
        ctx.moveTo(0, i * S + 0.5); ctx.lineTo(c.width, i * S + 0.5);
      }
      ctx.strokeStyle = 'rgba(255,255,255,0.08)';
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.restore();
    }
    ctx.strokeStyle = 'rgba(79,156,255,0.55)';
    ctx.lineWidth = Math.max(1, dpr);
    act.forEach(function (r) { ctx.strokeRect(r.x * S + 0.5, r.y * S + 0.5, r.w * S - 1, r.h * S - 1); });
    // Подписи частей — в пустом углу развёртки каждой коробки
    var fs = Math.round(Math.max(9, Math.min(13, S * 1.55)));
    ctx.font = '600 ' + fs + 'px system-ui, Segoe UI, sans-serif';
    ctx.textBaseline = 'top';
    ['head', 'body', 'rarm', 'larm', 'rleg', 'lleg'].forEach(function (id) {
      var rr = U.findRegion(id, layer, 'right', slim), tp = U.findRegion(id, layer, 'top', slim);
      var txt = U.SHORT[id][layer - 1], x = rr.x * S + 2 * dpr, y = tp.y * S + 2 * dpr, w = ctx.measureText(txt).width;
      ctx.fillStyle = 'rgba(17,18,23,0.85)';
      ctx.fillRect(x - 2, y - 1, w + 5, fs + 3);
      ctx.fillStyle = layer === 1 ? '#8fc2ff' : '#7ff0b0';
      ctx.fillText(txt, x, y + 1);
    });
    var self = this;
    function mark(p, col, dash) {
      ctx.save();
      ctx.strokeStyle = col; ctx.lineWidth = Math.max(2, dpr * 1.5);
      if (dash) ctx.setLineDash([3 * dpr, 2 * dpr]);
      ctx.strokeRect(p[0] * S + 1, p[1] * S + 1, S - 2, S - 2);
      ctx.restore();
    }
    [this.hover, this.ext].forEach(function (h) {
      if (!h) return;
      mark([h.x, h.y], '#ffffff');
      if (self.tools.mirror) {
        var m = U.mirrorPixel(h.x, h.y, slim);
        if (m) mark(m, '#3ddc84', true);
      }
    });
  };

  E.pix = function (e) {
    var r = this.canvas.getBoundingClientRect();
    var x = Math.floor((e.clientX - r.left) / r.width * 64), y = Math.floor((e.clientY - r.top) / r.height * 64);
    return (x < 0 || y < 0 || x > 63 || y > 63) ? null : { x: x, y: y };
  };
  E.describe = function (p) {
    if (!p) return '';
    var r = U.regionAt(p.x, p.y, this.skin.slim);
    if (!r) return p.x + ', ' + p.y + ' · не используется';
    return U.NAMES[r.part][r.layer - 1] + ' · ' + U.FACE_RU[r.face] + ' · ' + p.x + ', ' + p.y;
  };

  E.bind = function () {
    var self = this, c = this.canvas, tools = this.tools, down = false;
    c.addEventListener('pointerdown', function (e) {
      if (e.button > 0) return;
      var p = self.pix(e);
      if (!p) return;
      e.preventDefault();
      var r = U.regionAt(p.x, p.y, self.skin.slim);
      if (tools.tool === 'rotate') tools.setTool('pencil');
      if (tools.tool !== 'picker') {
        if (!r) return;
        if (r.layer !== tools.layer) { tools.setLayer(r.layer); SS.toast('Переключено на слой ' + r.layer); }
      }
      c.setPointerCapture(e.pointerId);
      down = true;
      tools.begin(p.x, p.y);
    });
    c.addEventListener('pointermove', function (e) {
      var p = self.pix(e);
      self.hover = p;
      self.status.textContent = self.describe(p);
      if (down && p) tools.move(p.x, p.y);
      self.invalidate();
    });
    function up() { if (down) { down = false; tools.end(); } }
    c.addEventListener('pointerup', up);
    c.addEventListener('pointercancel', up);
    c.addEventListener('pointerleave', function () {
      self.hover = null;
      self.status.textContent = '';
      self.invalidate();
    });
  };

  SS.Editor2D = Editor2D;
})();
