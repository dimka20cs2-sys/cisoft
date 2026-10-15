/* Skin Studio — 3D-вид: цикл отрисовки, вращение, зум, рисование по модели */
(function () {
  'use strict';
  var SS = window.SS;

  function Viewer(wrap, skin, tools) {
    this.wrap = wrap;
    this.skin = skin;
    this.tools = tools;
    this.glc = wrap.querySelector('#gl');
    this.bgc = wrap.querySelector('#bg');
    this.r = new SS.Renderer(this.glc);
    this.pose = 'stand';
    this.anim = true;
    this.auto = true;
    this.bg = 'dark';
    this.vis = { head: true, body: true, rarm: true, larm: true, rleg: true, lleg: true, overlay: true };
    this.t = 0;
    this.faces = [];
    this.hover = null;
    this.ptrs = {};
    this.mode = null;
    this.bgKey = '';
    if (!this.r.ok) { wrap.classList.add('no-gl'); return; }
    this.bind();
    var self = this, last = performance.now();
    function frame(ts) {
      var dt = Math.min(0.05, Math.max(0, (ts - last) / 1000));
      last = ts;
      self.step(dt);
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }
  var Vw = Viewer.prototype;
  Viewer.defaults = function () { return { yaw: 0.55, pitch: 0.12, dist: 64 }; };

  Vw.step = function (dt) {
    if (this.anim && this.mode !== 'paint') this.t += dt;
    if (this.auto && !this.mode) this.r.cam.yaw += dt * 0.45;
    this.r.resize();
    this.paintBg();
    this.render();
  };
  Vw.render = function (noHover) {
    this.faces = SS.buildFaces(this.skin.slim, SS.pose(this.pose, this.t), this.vis);
    var hi = null, h = this.hover;
    if (h && !noHover) {
      for (var i = 0; i < this.faces.length; i++) {
        var f = this.faces[i];
        if (f.part === h.face.part && f.layer === h.face.layer && f.face === h.face.face) { hi = SS.pixelQuad(f, h.x, h.y); break; }
      }
    }
    this.r.draw(this.faces, this.skin, hi);
  };
  Vw.paintBg = function () {
    var c = this.bgc, w = this.glc.width, h = this.glc.height, key = w + 'x' + h + this.bg;
    if (key === this.bgKey) return;
    this.bgKey = key;
    c.width = w; c.height = h;
    SS.paintBg(c.getContext('2d'), w, h, this.bg);
  };
  Vw.setBg = function (m) { this.bg = m; this.bgKey = ''; };

  // Снимок 3D: PNG-канвас нужного размера с фоном
  Vw.snapshot = function (w, h, bg) {
    var out = document.createElement('canvas');
    w = w || this.glc.width; h = h || this.glc.height;
    out.width = w; out.height = h;
    var ctx = out.getContext('2d');
    if (bg !== 'none') SS.paintBg(ctx, w, h, bg || this.bg);
    if (this.r.ok) {
      this.glc.width = w; this.glc.height = h;
      this.render(true);
      ctx.drawImage(this.glc, 0, 0);
    }
    return out;
  };

  Vw.pick = function (e) {
    var b = this.glc.getBoundingClientRect(), ray = this.r.ray(e.clientX - b.left, e.clientY - b.top);
    var pk = this.tools.tool === 'picker';
    return SS.raycast(this.faces, ray.o, ray.d, { layer: pk ? 0 : this.tools.layer, opaque: pk, data: this.skin.data });
  };
  Vw.setHover = function (h) {
    var a = this.hover, same = a && h && a.x === h.x && a.y === h.y;
    this.hover = h;
    if (!same) SS.emit('hover3d', h ? { x: h.x, y: h.y } : null);
  };
  Vw.count = function () { return Object.keys(this.ptrs).length; };
  Vw.pinchInfo = function () {
    var p = [], k;
    for (k in this.ptrs) p.push(this.ptrs[k]);
    return { d: Math.hypot(p[0].x - p[1].x, p[0].y - p[1].y) || 1, x: (p[0].x + p[1].x) / 2, y: (p[0].y + p[1].y) / 2 };
  };
  Vw.orbit = function (dx, dy) {
    var c = this.r.cam;
    c.yaw -= dx * 0.01;
    c.pitch = Math.max(-1.3, Math.min(1.35, c.pitch + dy * 0.01));
  };
  Vw.zoom = function (k) { var c = this.r.cam; c.dist = Math.max(22, Math.min(140, c.dist * k)); };

  Vw.bind = function () {
    var self = this, c = this.glc, tools = this.tools;
    c.addEventListener('contextmenu', function (e) { e.preventDefault(); });
    c.addEventListener('pointerdown', function (e) {
      e.preventDefault();
      try { c.setPointerCapture(e.pointerId); } catch (er) { /* нет */ }
      self.ptrs[e.pointerId] = { x: e.clientX, y: e.clientY };
      var n = self.count();
      if (n === 2) {
        if (self.mode === 'paint') tools.end();
        self.mode = 'pinch';
        self.pinch = self.pinchInfo();
        self.setHover(null);
        return;
      }
      if (n > 2) return;
      var hit = (e.button === 0 && tools.paints()) ? self.pick(e) : null;
      if (hit) {
        self.mode = 'paint';
        if (self.auto) { self.auto = false; SS.emit('autorotate', false); }
        self.setHover(e.pointerType === 'mouse' ? hit : null);
        tools.begin(hit.x, hit.y);
      } else self.mode = 'orbit';
    });
    c.addEventListener('pointermove', function (e) {
      var prev = self.ptrs[e.pointerId];
      if (!prev) {
        if (e.pointerType === 'mouse' && tools.paints()) self.setHover(self.pick(e));
        return;
      }
      self.ptrs[e.pointerId] = { x: e.clientX, y: e.clientY };
      if (self.mode === 'pinch' && self.count() === 2) {
        var p = self.pinchInfo();
        self.zoom(self.pinch.d / p.d);
        self.orbit(p.x - self.pinch.x, p.y - self.pinch.y);
        self.pinch = p;
      } else if (self.mode === 'orbit') {
        self.orbit(e.clientX - prev.x, e.clientY - prev.y);
      } else if (self.mode === 'paint') {
        var hit = self.pick(e);
        if (hit) { tools.move(hit.x, hit.y); if (e.pointerType === 'mouse') self.setHover(hit); }
      }
    });
    function up(e) {
      if (!self.ptrs[e.pointerId]) return;
      delete self.ptrs[e.pointerId];
      if (self.mode === 'paint') tools.end();
      var n = self.count();
      if (!n) self.mode = null;
      else if (self.mode === 'pinch') self.mode = 'orbit';
      if (e.pointerType !== 'mouse') self.setHover(null);
    }
    c.addEventListener('pointerup', up);
    c.addEventListener('pointercancel', up);
    c.addEventListener('pointerleave', function (e) { if (!self.ptrs[e.pointerId]) self.setHover(null); });
    c.addEventListener('wheel', function (e) {
      e.preventDefault();
      self.zoom(Math.exp(e.deltaY * 0.0012));
    }, { passive: false });
  };

  Vw.resetView = function () {
    var d = Viewer.defaults(), c = this.r.cam;
    c.yaw = d.yaw; c.pitch = d.pitch; c.dist = d.dist;
  };

  SS.Viewer = Viewer;
})();
