/* Skin Studio — инструменты рисования (общие для 2D и 3D) */
(function () {
  'use strict';
  var SS = window.SS, U = SS.U;

  var TOOL_RU = {
    rotate: 'Вращение', pencil: 'Карандаш', eraser: 'Ластик', fill: 'Заливка', picker: 'Пипетка',
    line: 'Линия', darken: 'Затемнить', lighten: 'Осветлить', noise: 'Шум (ткань)'
  };

  function line(x0, y0, x1, y1, fn) {
    var dx = Math.abs(x1 - x0), dy = -Math.abs(y1 - y0), sx = x0 < x1 ? 1 : -1, sy = y0 < y1 ? 1 : -1, e = dx + dy;
    for (var guard = 0; guard < 300; guard++) {
      fn(x0, y0);
      if (x0 === x1 && y0 === y1) break;
      var e2 = 2 * e;
      if (e2 >= dy) { e += dy; x0 += sx; }
      if (e2 <= dx) { e += dx; y0 += sy; }
    }
  }

  function Tools(skin) {
    this.skin = skin;
    this.tool = 'pencil';
    this.prevTool = 'pencil';
    this.layer = 1;
    this.mirror = false;
    this.active = false;
  }
  var T = Tools.prototype;

  T.setTool = function (t) {
    if (t === this.tool) return;
    if (t === 'picker') this.prevTool = this.tool;
    this.tool = t;
    SS.emit('tool', t);
  };
  T.setLayer = function (l) { this.layer = l; SS.emit('layer', l); };
  T.setMirror = function (m) { this.mirror = m; SS.emit('mirror', m); };
  T.paints = function () { return this.tool !== 'rotate'; };

  // Можно ли рисовать в этом пикселе (только в развёртке активного слоя)
  T.allowed = function (x, y) {
    var r = U.regionAt(x, y, this.skin.slim);
    return !!(r && r.layer === this.layer);
  };

  T.apply = function (x, y) {
    if (!this.allowed(x, y)) return;
    var key = x + y * 64, s = this.skin, t = this.tool;
    if ((t === 'darken' || t === 'lighten' || t === 'noise') && this.touched[key]) return;
    this.touched[key] = 1;
    var c = s.get(x, y), k;
    if (t === 'eraser') s.set(x, y, [0, 0, 0, 0]);
    else if (t === 'darken') { if (c[3]) s.set(x, y, [c[0] * 0.84, c[1] * 0.84, c[2] * 0.84, c[3]]); }
    else if (t === 'lighten') {
      if (c[3]) s.set(x, y, [c[0] + (255 - c[0]) * 0.18, c[1] + (255 - c[1]) * 0.18, c[2] + (255 - c[2]) * 0.18, c[3]]);
    } else if (t === 'noise') {
      var b = SS.color.get();
      k = 1 + (Math.random() - 0.5) * 0.26;
      s.set(x, y, [b[0] * k, b[1] * k, b[2] * k, 255]);
    } else s.set(x, y, SS.color.get());
  };
  T.plot = function (x, y) {
    this.apply(x, y);
    if (this.mirror) {
      var m = U.mirrorPixel(x, y, this.skin.slim);
      if (m && (m[0] !== x || m[1] !== y)) this.apply(m[0], m[1]);
    }
  };

  // Заливка в пределах одной грани (4-связная, по точному цвету)
  T.fillAt = function (x, y) {
    var s = this.skin, r = U.regionAt(x, y, s.slim);
    if (!r || r.layer !== this.layer) return;
    var tgt = s.get(x, y), nc = SS.color.get(), self = this;
    if (tgt[0] === nc[0] && tgt[1] === nc[1] && tgt[2] === nc[2] && tgt[3] === 255) return;
    var same = function (px, py) {
      var c = s.get(px, py);
      if ((c[3] > 0) !== (tgt[3] > 0)) return false;
      if (!c[3]) return true;
      return Math.abs(c[0] - tgt[0]) + Math.abs(c[1] - tgt[1]) + Math.abs(c[2] - tgt[2]) <= 72;
    };
    var stack = [[x, y]], seen = {};
    while (stack.length) {
      var p = stack.pop(), px = p[0], py = p[1], key = px + py * 64;
      if (seen[key] || px < r.x || py < r.y || px >= r.x + r.w || py >= r.y + r.h || !same(px, py)) continue;
      seen[key] = 1;
      stack.push([px + 1, py], [px - 1, py], [px, py + 1], [px, py - 1]);
    }
    Object.keys(seen).forEach(function (k) { self.plot(k % 64, Math.floor(k / 64)); });
  };

  T.begin = function (x, y) {
    var s = this.skin;
    if (this.tool === 'rotate') return;
    if (this.tool === 'picker') {
      var c = s.get(x, y);
      if (c[3] > 0) { SS.color.set(c); SS.color.addRecent(); }
      this.setTool(this.prevTool === 'picker' ? 'pencil' : this.prevTool);
      return;
    }
    s.pushUndo();
    this.touched = {};
    this.start = [x, y];
    this.last = [x, y];
    if (this.tool === 'fill') {
      this.fillAt(x, y);
      s.commit();
      this.finish();
      return;
    }
    this.active = true;
    if (this.tool === 'line') this.base = new Uint8ClampedArray(s.data);
    this.plot(x, y);
    s.commit();
  };

  T.move = function (x, y) {
    if (!this.active || (this.last && this.last[0] === x && this.last[1] === y)) return;
    var s = this.skin, self = this;
    if (this.tool === 'line') {
      s.data.set(this.base);
      this.touched = {};
      line(this.start[0], this.start[1], x, y, function (a, b) { self.plot(a, b); });
    } else {
      var r0 = U.regionAt(this.last[0], this.last[1], s.slim), r1 = U.regionAt(x, y, s.slim);
      if (r0 && r0 === r1) line(this.last[0], this.last[1], x, y, function (a, b) { self.plot(a, b); });
      else this.plot(x, y);
    }
    this.last = [x, y];
    s.commit();
  };

  T.end = function () {
    if (!this.active) return;
    this.active = false;
    this.base = null;
    this.finish();
  };
  T.finish = function () {
    if (this.tool === 'pencil' || this.tool === 'fill' || this.tool === 'line' || this.tool === 'noise') SS.color.addRecent();
    SS.emit('stroke');
  };

  SS.Tools = Tools;
  SS.TOOL_RU = TOOL_RU;
})();
