/* Skin Studio — шаблоны, нарисованные кодом (оригинальные, не копии скинов Mojang) */
(function () {
  'use strict';
  var SS = window.SS, U = SS.U;

  function hex(h) { return [parseInt(h.substr(1, 2), 16), parseInt(h.substr(3, 2), 16), parseInt(h.substr(5, 2), 16), 255]; }

  function painter(skin, seed) {
    var s = seed || 1;
    function rnd() { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; }
    function N(h, a) {
      var c = hex(h), k = 1 + (rnd() - 0.5) * (a === undefined ? 0.1 : a);
      return [c[0] * k, c[1] * k, c[2] * k, 255];
    }
    function part(id, layer, fn) {
      U.regions(skin.slim).forEach(function (r) {
        if (r.part !== id || r.layer !== layer) return;
        for (var y = 0; y < r.h; y++) for (var x = 0; x < r.w; x++) {
          var c = fn(r.face, x, y, r.w, r.h);
          if (c) skin.set(r.x + x, r.y + y, c);
        }
      });
    }
    function limbs(ids, layer, fn) { ids.forEach(function (id) { part(id, layer, fn); }); }
    return { N: N, C: hex, part: part, limbs: limbs };
  }
  var ARMS = ['rarm', 'larm'], LEGS = ['rleg', 'lleg'];
  function isBackCol(f, x, w) { return f === 'right' ? x < w / 2 - 1 : x > w / 2; }

  var T = [
    { id: 'miner', name: 'Шахтёр', slim: false, draw: function (P) {
      var N = P.N, C = P.C;
      P.part('head', 1, function (f, x, y) {
        var sk = N('#c99272', 0.08), hr = N('#4b2e1b', 0.18);
        if (f === 'top') return hr;
        if (f === 'bottom') return sk;
        if (f === 'back') return y < 6 ? hr : sk;
        if (f !== 'front') return (y < 2 || (y < 5 && isBackCol(f, x, 8))) ? hr : sk;
        if (y < 2 || (y === 2 && (x === 0 || x === 7))) return hr;
        if (y === 3 && (x === 1 || x === 2 || x === 5 || x === 6)) return N('#5a3a24', 0.1);
        if (y === 4 && (x === 1 || x === 6)) return C('#f4f4f4');
        if (y === 4 && (x === 2 || x === 5)) return C('#3557c8');
        if (y === 5 && (x === 3 || x === 4)) return N('#a86e52', 0.05);
        if (y === 6 && x >= 2 && x <= 5) return C('#7a3f2e');
        return sk;
      });
      P.part('body', 1, function (f, x, y) {
        if (f === 'front' && y === 0 && (x === 3 || x === 4)) return N('#c99272', 0.05);
        if (y === 11 && f !== 'top') return (f === 'front' && (x === 3 || x === 4)) ? C('#d4ac3f') : N('#3b2a1d', 0.1);
        return N('#2f9ca8', 0.12);
      });
      P.limbs(ARMS, 1, function (f, x, y) {
        if (f === 'top') return N('#2f9ca8', 0.12);
        if (f === 'bottom' || y > 3) return N('#c99272', 0.08);
        return y === 3 ? N('#25808a', 0.1) : N('#2f9ca8', 0.12);
      });
      P.limbs(LEGS, 1, function (f, x, y) {
        if (f === 'bottom' || (f !== 'top' && y > 9)) return N('#5b5b60', 0.12);
        return N('#34459e', 0.12);
      });
      P.part('head', 2, function (f, x, y) {
        if (f === 'bottom') return null;
        if (f === 'top') return N('#e1b12c', 0.1);
        if (f === 'front' && y < 2 && (x === 3 || x === 4)) return C(y ? '#fff6b5' : '#ffe680');
        if (y < 2) return N(y ? '#c39522' : '#e1b12c', 0.08);
        return null;
      });
    } },
    { id: 'archer', name: 'Лучница', slim: true, draw: function (P) {
      var N = P.N, C = P.C;
      P.part('head', 1, function (f, x, y) {
        var sk = N('#efc39b', 0.06), hr = N('#c2561d', 0.16);
        if (f === 'top' || f === 'back') return hr;
        if (f === 'bottom') return sk;
        if (f !== 'front') return (y < 3 || isBackCol(f, x, 8) || x === (f === 'right' ? 4 : 3)) ? hr : sk;
        if (y < 2 || x === 0 || x === 7 || (y === 2 && (x === 1 || x === 6))) return hr;
        if (y === 4 && (x === 1 || x === 6)) return C('#f6f6f6');
        if (y === 4 && (x === 2 || x === 5)) return C('#2e8f4e');
        if (y === 6 && (x === 3 || x === 4)) return C('#c46a5a');
        return sk;
      });
      P.part('body', 1, function (f, x, y) {
        if (f === 'front' && y === 0 && (x === 3 || x === 4)) return N('#efc39b', 0.05);
        if (y === 9) return N('#5a3a1e', 0.1);
        if (y > 9) return N('#6b4a2b', 0.12);
        return N('#3f8a3a', 0.14);
      });
      P.limbs(ARMS, 1, function (f, x, y) {
        if (f === 'top' || (f !== 'bottom' && y < 3)) return N('#3f8a3a', 0.14);
        return N('#efc39b', 0.06);
      });
      P.limbs(LEGS, 1, function (f, x, y) {
        if (f === 'bottom' || (f !== 'top' && y > 8)) return N('#3a2616', 0.14);
        return N('#6b4a2b', 0.12);
      });
      P.part('body', 2, function (f, x, y) {
        if (f === 'front' && x === 7 - Math.floor(y * 8 / 12)) return N('#8a5a2e', 0.08);
        if (f === 'back' && x >= 4 && x <= 6 && y < 10) return y === 0 ? C('#eeeeee') : N('#7a4f28', 0.12);
        return null;
      });
    } },
    { id: 'plain', name: 'Пустой (кожа)', slim: false, draw: function (P) {
      ['head', 'body', 'rarm', 'larm', 'rleg', 'lleg'].forEach(function (id) {
        P.part(id, 1, function (f, x, y) {
          if (id === 'head' && f === 'front' && y === 4 && (x === 2 || x === 5)) return P.C('#2b2b33');
          return P.N('#d9a37f', 0.05);
        });
      });
    } },
    { id: 'robot', name: 'Робот', slim: false, draw: function (P) {
      var N = P.N, C = P.C, M = function () { return N('#8d96a1', 0.14); }, D = function () { return N('#3b4049', 0.1); };
      P.part('head', 1, function (f, x, y) {
        if (f === 'front') {
          if (y >= 3 && y <= 4 && x >= 1 && x <= 6) return C(y === 3 ? '#9af3ff' : '#35e0ff');
          if (y === 6 && x >= 2 && x <= 5) return x % 2 ? D() : C('#5a616b');
          if (y === 7) return D();
        }
        if ((f === 'right' || f === 'left') && y === 4 && (x === 3 || x === 4)) return C('#c7cdd4');
        return M();
      });
      P.part('body', 1, function (f, x, y) {
        if (f === 'front' && y >= 2 && y <= 7 && x >= 2 && x <= 5) {
          if (y === 3 && x === 3) return C('#ff4d4d');
          if (y === 3 && x === 4) return C('#3ddc84');
          if (y === 5 && (x === 3 || x === 4)) return C('#ffcc33');
          return D();
        }
        return y === 11 ? D() : M();
      });
      P.limbs(ARMS, 1, function (f, x, y) {
        if (f === 'bottom' || y >= 10) return N('#5a616b', 0.1);
        return (y === 4 || y === 8) && f !== 'top' ? D() : M();
      });
      P.limbs(LEGS, 1, function (f, x, y) {
        if (f === 'bottom' || (f !== 'top' && y >= 10)) return N('#4a505a', 0.1);
        return y === 5 && f !== 'top' ? D() : M();
      });
      P.part('head', 2, function (f, x, y) {
        if (f === 'top' && x >= 3 && x <= 4 && y >= 3 && y <= 4) return C('#ff3b3b');
        if ((f === 'right' || f === 'left') && y === 4 && (x === 3 || x === 4)) return C('#dfe4ea');
        return null;
      });
    } },
    { id: 'ninja', name: 'Ниндзя', slim: false, draw: function (P) {
      var N = P.N, C = P.C, S = function () { return N('#1e2029', 0.2); };
      P.part('head', 1, function (f, x, y) {
        if (f === 'front' && y >= 3 && y <= 4 && x >= 1 && x <= 6) {
          if (y === 4 && (x === 2 || x === 5)) return C('#141414');
          if (y === 4 && (x === 1 || x === 6)) return C('#e8e8e8');
          return N('#d4a07a', 0.06);
        }
        return S();
      });
      P.part('body', 1, function (f, x, y) {
        if (y === 8 && f !== 'top' && f !== 'bottom') return N('#c42b31', 0.1);
        if (f === 'front' && y < 4 && (x === 3 - y || x === 4 + y)) return N('#3a3d48', 0.1);
        return S();
      });
      P.limbs(ARMS, 1, function (f, x, y) {
        if (f !== 'top' && f !== 'bottom' && y >= 9 && y <= 10) return N('#6c707c', 0.12);
        return S();
      });
      P.limbs(LEGS, 1, function (f, x, y) {
        if (f !== 'top' && f !== 'bottom' && y >= 6 && y <= 8) return N('#3a3d48', 0.12);
        if (f === 'bottom' || y >= 10) return N('#111318', 0.1);
        return S();
      });
      P.part('head', 2, function (f, x, y) {
        if (f === 'top' || f === 'bottom') return null;
        if (f === 'front' && y >= 1 && y <= 2 && (x === 3 || x === 4)) return C('#b8bec8');
        if (y >= 1 && y <= 2) return N('#c42b31', 0.1);
        if (f === 'back' && y >= 3 && y <= 6 && (x === 3 || x === 4 + (y > 4 ? 1 : 0))) return N('#a8222a', 0.1);
        return null;
      });
      P.part('body', 2, function (f, x, y) {
        if (f !== 'back') return null;
        if (x === 1 + Math.floor(y * 6 / 11)) return y < 3 ? C('#6b2a2a') : N('#aab3be', 0.06);
        return null;
      });
    } }
  ];

  SS.templates = T;
  SS.applyTemplate = function (skin, id, record) {
    var t = T.filter(function (q) { return q.id === id; })[0] || T[0];
    if (record) skin.pushUndo();
    var changed = skin.slim !== t.slim;
    skin.slim = t.slim;
    skin.clear();
    t.draw(painter(skin, 12345));
    skin.commit();
    SS.emit('model', skin.slim);
    return t;
  };
  SS.hex = hex;
})();
