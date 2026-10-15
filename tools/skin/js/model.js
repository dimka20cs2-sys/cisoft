/* Skin Studio — геометрия модели: кубы с UV, позы, raycast */
(function () {
  'use strict';
  var SS = window.SS, U = SS.U;

  function add(a, b) { return [a[0] + b[0], a[1] + b[1], a[2] + b[2]]; }
  function sub(a, b) { return [a[0] - b[0], a[1] - b[1], a[2] - b[2]]; }
  function mul(a, k) { return [a[0] * k, a[1] * k, a[2] * k]; }
  function dot(a, b) { return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]; }
  function cross(a, b) { return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]; }
  function norm(a) { var l = Math.sqrt(dot(a, a)) || 1; return [a[0] / l, a[1] / l, a[2] / l]; }
  SS.V = { add: add, sub: sub, mul: mul, dot: dot, cross: cross, norm: norm };

  // Матрица поворота M = Rz * Ry * Rx (строки)
  function mat3(r) {
    var cx = Math.cos(r[0]), sx = Math.sin(r[0]), cy = Math.cos(r[1]), sy = Math.sin(r[1]);
    var cz = Math.cos(r[2]), sz = Math.sin(r[2]);
    return [
      [cz * cy, cz * sy * sx - sz * cx, cz * sy * cx + sz * sx],
      [sz * cy, sz * sy * sx + cz * cx, sz * sy * cx - cz * sx],
      [-sy, cy * sx, cy * cx]
    ];
  }
  function apply(M, v) { return [dot(M[0], v), dot(M[1], v), dot(M[2], v)]; }

  // Позы: углы [rx, ry, rz] для частей
  SS.pose = function (name, t) {
    var p = { head: [0, 0, 0], body: [0, 0, 0], rarm: [0, 0, 0], larm: [0, 0, 0], rleg: [0, 0, 0], lleg: [0, 0, 0] };
    var br = Math.sin(t * 1.6) * 0.03;
    if (name === 'walk') {
      var s = Math.sin(t * 5.5) * 0.65;
      p.rleg[0] = s; p.lleg[0] = -s;
      p.rarm[0] = -s * 0.9; p.larm[0] = s * 0.9;
      p.rarm[2] = -0.04; p.larm[2] = 0.04;
      p.head[1] = Math.sin(t * 2.75) * 0.12;
    } else if (name === 'wave') {
      p.rarm[2] = -2.55 + Math.sin(t * 7) * 0.32;
      p.larm[2] = 0.06 + br;
      p.head[1] = -0.18 + Math.sin(t * 1.4) * 0.08;
      p.head[2] = Math.sin(t * 3.5) * 0.05;
    } else {
      p.rarm[2] = -0.06 - br; p.larm[2] = 0.06 + br;
      p.rarm[0] = br; p.larm[0] = -br;
      p.head[1] = Math.sin(t * 0.7) * 0.15;
      p.head[0] = Math.sin(t * 0.9) * 0.05;
    }
    return p;
  };

  // Грани всех видимых коробок. Каждая грань: p0 (левый верх текстуры), eu, ev, n, rect
  SS.buildFaces = function (slim, pose, vis) {
    var out = [];
    U.partDefs(slim).forEach(function (p) {
      if (!vis[p.id]) return;
      var M = mat3(pose[p.id] || [0, 0, 0]), piv = p.pivot;
      for (var layer = 1; layer <= 2; layer++) {
        if (layer === 2 && !vis.overlay) continue;
        var inf = layer === 2 ? p.inf : 0, uv = layer === 1 ? p.uv : p.ov;
        var x0 = p.min[0] - inf, y0 = p.min[1] - inf, z0 = p.min[2] - inf;
        var x1 = p.min[0] + p.size[0] + inf, y1 = p.min[1] + p.size[1] + inf, z1 = p.min[2] + p.size[2] + inf;
        var W = x1 - x0, H = y1 - y0, D = z1 - z0;
        var R = U.faceRects(uv[0], uv[1], p.size[0], p.size[1], p.size[2]);
        var defs = {
          front: [[x0, y1, z1], [W, 0, 0], [0, -H, 0], [0, 0, 1]],
          back: [[x1, y1, z0], [-W, 0, 0], [0, -H, 0], [0, 0, -1]],
          right: [[x0, y1, z0], [0, 0, D], [0, -H, 0], [-1, 0, 0]],
          left: [[x1, y1, z1], [0, 0, -D], [0, -H, 0], [1, 0, 0]],
          top: [[x0, y1, z0], [W, 0, 0], [0, 0, D], [0, 1, 0]],
          bottom: [[x0, y0, z1], [W, 0, 0], [0, 0, -D], [0, -1, 0]]
        };
        for (var f in defs) {
          var d = defs[f];
          out.push({
            part: p.id, layer: layer, face: f, rect: R[f],
            p0: add(piv, apply(M, sub(d[0], piv))),
            eu: apply(M, d[1]), ev: apply(M, d[2]), n: apply(M, d[3])
          });
        }
      }
    });
    return out;
  };

  // Луч → ближайшая грань и пиксель. opts: layer (0 = любой), opaque, data
  SS.raycast = function (faces, o, dir, opts) {
    var best = Infinity, hit = null;
    for (var i = 0; i < faces.length; i++) {
      var f = faces[i];
      if (opts.layer && f.layer !== opts.layer) continue;
      var den = dot(f.n, dir);
      if (den > -1e-6) continue;
      var t = dot(sub(f.p0, o), f.n) / den;
      if (t <= 0 || t >= best) continue;
      var rel = sub(add(o, mul(dir, t)), f.p0);
      var s = dot(rel, f.eu) / dot(f.eu, f.eu), v = dot(rel, f.ev) / dot(f.ev, f.ev);
      if (s < 0 || s > 1 || v < 0 || v > 1) continue;
      var r = f.rect;
      var px = r[0] + Math.min(r[2] - 1, Math.floor(s * r[2]));
      var py = r[1] + Math.min(r[3] - 1, Math.floor(v * r[3]));
      if (opts.opaque && opts.data[(py * 64 + px) * 4 + 3] < 128) continue;
      best = t;
      hit = { face: f, x: px, y: py, t: t };
    }
    return hit;
  };

  // Четыре угла пикселя на грани (для подсветки)
  SS.pixelQuad = function (f, x, y) {
    var r = f.rect, c = x - r[0], w = r[2], h = r[3], row = y - r[1];
    var a = add(add(add(f.p0, mul(f.eu, c / w)), mul(f.ev, row / h)), mul(norm(f.n), 0.03));
    var du = mul(f.eu, 1 / w), dv = mul(f.ev, 1 / h);
    return [a, add(a, du), add(add(a, du), dv), add(a, dv)];
  };
})();
