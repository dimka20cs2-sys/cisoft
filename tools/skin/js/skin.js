/* Skin Studio — модель данных скина 64×64, раскладка UV, история */
(function () {
  'use strict';
  var SS = window.SS = window.SS || {};
  var handlers = {};
  SS.on = function (n, f) { (handlers[n] = handlers[n] || []).push(f); };
  SS.emit = function (n, a) { (handlers[n] || []).forEach(function (f) { f(a); }); };

  var FACES = ['top', 'bottom', 'right', 'front', 'left', 'back'];
  var FACE_RU = { top: 'верх', bottom: 'низ', right: 'правый бок', front: 'перед', left: 'левый бок', back: 'спина' };
  var NAMES = {
    head: ['Голова', 'Шапка'], body: ['Тело', 'Куртка'],
    rarm: ['Правая рука', 'Правый рукав'], larm: ['Левая рука', 'Левый рукав'],
    rleg: ['Правая нога', 'Правая штанина'], lleg: ['Левая нога', 'Левая штанина']
  };
  var SHORT = {
    head: ['Голова', 'Шапка'], body: ['Тело', 'Куртка'],
    rarm: ['Рука П', 'Рукав П'], larm: ['Рука Л', 'Рукав Л'],
    rleg: ['Нога П', 'Штан. П'], lleg: ['Нога Л', 'Штан. Л']
  };

  // Развёртка коробки: [x, y, w, h] для каждой грани
  function faceRects(u, v, w, h, d) {
    return {
      top: [u + d, v, w, d], bottom: [u + d + w, v, w, d],
      right: [u, v + d, d, h], front: [u + d, v + d, w, h],
      left: [u + d + w, v + d, d, h], back: [u + d + w + d, v + d, w, h]
    };
  }

  function partDefs(slim) {
    var a = slim ? 3 : 4;
    return [
      { id: 'head', uv: [0, 0], ov: [32, 0], size: [8, 8, 8], min: [-4, 24, -4], pivot: [0, 24, 0], inf: 0.5 },
      { id: 'body', uv: [16, 16], ov: [16, 32], size: [8, 12, 4], min: [-4, 12, -2], pivot: [0, 24, 0], inf: 0.25 },
      { id: 'rarm', uv: [40, 16], ov: [40, 32], size: [a, 12, 4], min: [-4 - a, 12, -2], pivot: [-4 - a / 2, 22, 0], inf: 0.25 },
      { id: 'larm', uv: [32, 48], ov: [48, 48], size: [a, 12, 4], min: [4, 12, -2], pivot: [4 + a / 2, 22, 0], inf: 0.25 },
      { id: 'rleg', uv: [0, 16], ov: [0, 32], size: [4, 12, 4], min: [-4, 0, -2], pivot: [-2, 12, 0], inf: 0.25 },
      { id: 'lleg', uv: [16, 48], ov: [0, 48], size: [4, 12, 4], min: [0, 0, -2], pivot: [2, 12, 0], inf: 0.25 }
    ];
  }

  var cache = {};
  function regions(slim) {
    var k = slim ? 1 : 0;
    if (cache[k]) return cache[k];
    var list = [];
    partDefs(slim).forEach(function (p) {
      [1, 2].forEach(function (layer) {
        var uv = layer === 1 ? p.uv : p.ov;
        var r = faceRects(uv[0], uv[1], p.size[0], p.size[1], p.size[2]);
        FACES.forEach(function (f) {
          list.push({ part: p.id, layer: layer, face: f, x: r[f][0], y: r[f][1], w: r[f][2], h: r[f][3] });
        });
      });
    });
    return (cache[k] = list);
  }
  function regionAt(x, y, slim) {
    var l = regions(slim);
    for (var i = 0; i < l.length; i++) {
      var r = l[i];
      if (x >= r.x && y >= r.y && x < r.x + r.w && y < r.y + r.h) return r;
    }
    return null;
  }
  function findRegion(part, layer, face, slim) {
    var l = regions(slim);
    for (var i = 0; i < l.length; i++) {
      var r = l[i];
      if (r.part === part && r.layer === layer && r.face === face) return r;
    }
    return null;
  }
  var MP = { head: 'head', body: 'body', rarm: 'larm', larm: 'rarm', rleg: 'lleg', lleg: 'rleg' };
  var MF = { right: 'left', left: 'right', front: 'front', back: 'back', top: 'top', bottom: 'bottom' };
  // Зеркальный пиксель (отражение по оси X модели)
  function mirrorPixel(x, y, slim) {
    var r = regionAt(x, y, slim);
    if (!r) return null;
    var m = findRegion(MP[r.part], r.layer, MF[r.face], slim);
    if (!m) return null;
    return [m.x + (r.w - 1 - (x - r.x)), m.y + (y - r.y)];
  }

  SS.U = {
    FACES: FACES, FACE_RU: FACE_RU, NAMES: NAMES, SHORT: SHORT, faceRects: faceRects,
    partDefs: partDefs, regions: regions, regionAt: regionAt, findRegion: findRegion, mirrorPixel: mirrorPixel
  };

  function Skin() {
    this.data = new Uint8ClampedArray(64 * 64 * 4);
    this.slim = false;
    this.canvas = document.createElement('canvas');
    this.canvas.width = this.canvas.height = 64;
    this.ctx = this.canvas.getContext('2d');
    this.undoStack = [];
    this.redoStack = [];
    this.version = 0;
  }
  var P = Skin.prototype;
  P.get = function (x, y) {
    var i = (y * 64 + x) * 4, d = this.data;
    return [d[i], d[i + 1], d[i + 2], d[i + 3]];
  };
  P.set = function (x, y, c) {
    if (x < 0 || y < 0 || x > 63 || y > 63) return;
    var i = (y * 64 + x) * 4, d = this.data;
    d[i] = c[0]; d[i + 1] = c[1]; d[i + 2] = c[2]; d[i + 3] = c[3] === undefined ? 255 : c[3];
  };
  P.commit = function () {
    this.ctx.putImageData(new ImageData(new Uint8ClampedArray(this.data), 64, 64), 0, 0);
    this.version++;
    SS.emit('skin', this);
  };
  P.snapshot = function () { return { data: new Uint8ClampedArray(this.data), slim: this.slim }; };
  P.pushUndo = function () {
    this.undoStack.push(this.snapshot());
    if (this.undoStack.length > 120) this.undoStack.shift();
    this.redoStack.length = 0;
    SS.emit('history');
  };
  P.restore = function (s) {
    var changed = this.slim !== s.slim;
    this.data.set(s.data);
    this.slim = s.slim;
    this.commit();
    if (changed) SS.emit('model', this.slim);
  };
  P.undo = function () {
    if (!this.undoStack.length) return false;
    this.redoStack.push(this.snapshot());
    this.restore(this.undoStack.pop());
    SS.emit('history');
    return true;
  };
  P.redo = function () {
    if (!this.redoStack.length) return false;
    this.undoStack.push(this.snapshot());
    this.restore(this.redoStack.pop());
    SS.emit('history');
    return true;
  };
  P.setSlim = function (v, record) {
    if (this.slim === v) return;
    if (record) this.pushUndo();
    this.slim = v;
    this.commit();
    SS.emit('model', v);
  };
  P.clear = function () { this.data.fill(0); };

  // Тонкие руки (Alex): у них пусты столбцы 54–55 (строки 20–31) и 50–51 (строки 16–19)
  P.detectSlim = function () {
    var x, y;
    for (y = 20; y < 32; y++) for (x = 54; x < 56; x++) if (this.data[(y * 64 + x) * 4 + 3] > 0) return false;
    for (y = 16; y < 20; y++) for (x = 50; x < 52; x++) if (this.data[(y * 64 + x) * 4 + 3] > 0) return false;
    return true;
  };

  // Старый формат 64×32: левые конечности = зеркало правых
  P.convertLegacy = function () {
    var self = this;
    regions(false).forEach(function (r) {
      if (r.layer !== 1 || (r.part !== 'rarm' && r.part !== 'rleg')) return;
      for (var y = r.y; y < r.y + r.h; y++) for (var x = r.x; x < r.x + r.w; x++) {
        var m = mirrorPixel(x, y, false);
        if (m) self.set(m[0], m[1], self.get(x, y));
      }
    });
  };

  // Загрузка из Image/Canvas. Возвращает 'legacy' для 64×32
  P.loadImage = function (img, record) {
    var w = img.naturalWidth || img.width, h = img.naturalHeight || img.height;
    if (!w || !h || (w !== h && w !== h * 2)) throw new Error('Нужен PNG 64×64 или 64×32');
    var legacy = w === h * 2, hh = legacy ? 32 : 64;
    var c = document.createElement('canvas');
    c.width = 64; c.height = hh;
    var ctx = c.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(img, 0, 0, 64, hh);
    var src = ctx.getImageData(0, 0, 64, hh).data;
    if (record) this.pushUndo();
    this.data.fill(0);
    this.data.set(src, 0);
    if (legacy) this.convertLegacy();
    var slim = legacy ? false : this.detectSlim();
    this.slim = slim;
    this.commit();
    SS.emit('model', slim);
    return legacy ? 'legacy' : 'ok';
  };

  SS.Skin = Skin;
})();
