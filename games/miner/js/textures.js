'use strict';
// Процедурные пиксельные текстуры 16×16 и спрайт шахтёра
(function (M) {
  var B = M.B, T = 16;

  function mk() { var c = document.createElement('canvas'); c.width = c.height = T; return c; }
  function rng(seed) {
    var s = (seed >>> 0) || 1;
    return function () { s = (Math.imul(s, 1664525) + 1013904223) >>> 0; return s / 4294967296; };
  }
  function px(g, x, y, c) { g.fillStyle = c; g.fillRect(x, y, 1, 1); }
  function base(seed, cols, w) {
    var c = mk(), g = c.getContext('2d'), r = rng(seed);
    for (var y = 0; y < T; y++) for (var x = 0; x < T; x++) {
      var k = r(), i = 0, acc = 0;
      for (i = 0; i < cols.length - 1; i++) { acc += w ? w[i] : 1 / cols.length; if (k < acc) break; }
      px(g, x, y, cols[i]);
    }
    return c;
  }
  function blobs(c, seed, n, cols, size) {
    var g = c.getContext('2d'), r = rng(seed);
    for (var i = 0; i < n; i++) {
      var cx = 1 + Math.floor(r() * 12), cy = 1 + Math.floor(r() * 12), s = size || 2;
      for (var y = 0; y < s; y++) for (var x = 0; x < s; x++) {
        if (r() < 0.2 && x + y > 0) continue;
        px(g, cx + x, cy + y, (x === 0 && y === 0) ? cols[1] : (x + y >= s) ? cols[2] : cols[0]);
      }
    }
    return c;
  }
  function fromMap(map, pal) {
    var c = mk(), g = c.getContext('2d');
    for (var y = 0; y < map.length; y++) for (var x = 0; x < map[y].length; x++) {
      var ch = map[y][x];
      if (pal[ch]) px(g, x, y, pal[ch]);
    }
    return c;
  }
  function darken(src, a) {
    var c = mk(), g = c.getContext('2d');
    g.drawImage(src, 0, 0);
    g.fillStyle = 'rgba(8,8,14,' + a + ')';
    g.fillRect(0, 0, T, T);
    return c;
  }

  var STONE = ['#7f7f7f', '#787878', '#868686', '#6b6b6b'], STW = [0.45, 0.3, 0.18];
  var DIRT = ['#866043', '#7b573b', '#916b4b', '#694a31'], DW = [0.45, 0.3, 0.17];
  var DEEP = ['#4c4c56', '#45454f', '#55555f', '#3c3c46'];

  M.buildTextures = function () {
    var t = { blocks: [], back: {}, lava: [], crack: [] };
    function variants(id, fn) { t.blocks[id] = [0, 1, 2].map(function (v) { return fn(id * 100 + v * 17 + 3); }); }
    variants(B.DIRT, function (s) { return base(s, DIRT, DW); });
    variants(B.GRASS, function (s) {
      var c = base(s, DIRT, DW), g = c.getContext('2d'), r = rng(s + 5);
      for (var x = 0; x < T; x++) {
        var h = 3 + (r() < 0.45 ? 1 : 0) + (r() < 0.2 ? 1 : 0);
        for (var y = 0; y < h; y++) px(g, x, y, r() < 0.3 ? '#4a8a30' : y === 0 ? '#6dbb48' : '#5aa13c');
      }
      return c;
    });
    variants(B.STONE, function (s) {
      var c = base(s, STONE, STW), g = c.getContext('2d'), r = rng(s + 9);
      for (var i = 0; i < 3; i++) { var x = Math.floor(r() * 13), y = Math.floor(r() * 15); g.fillStyle = '#5e5e5e'; g.fillRect(x, y, 2 + Math.floor(r() * 3), 1); }
      return c;
    });
    variants(B.DEEP, function (s) {
      var c = base(s, DEEP, STW), g = c.getContext('2d'), r = rng(s + 4);
      for (var i = 0; i < 5; i++) { g.fillStyle = r() < 0.5 ? '#33333c' : '#62626d'; g.fillRect(Math.floor(r() * 12), Math.floor(r() * 16), 3 + Math.floor(r() * 4), 1); }
      return c;
    });
    variants(B.GRAVEL, function (s) {
      var c = base(s, ['#8a8480', '#7a7471', '#9c9590', '#6a6462']);
      return blobs(c, s + 1, 7, ['#a8a19c', '#c8c1bb', '#4f4a48'], 2);
    });
    variants(B.BEDROCK, function (s) {
      var c = base(s, ['#2b2b2b', '#4a4a4a', '#1a1a1a', '#606060']);
      return blobs(c, s + 2, 5, ['#121212', '#3a3a3a', '#000'], 3);
    });
    function oreT(id, base0, cols, n) {
      variants(id, function (s) { return blobs(base(s, base0, STW), s + 13, n, cols, 2); });
    }
    oreT(B.COAL, STONE, ['#2a2a2a', '#4a4a4a', '#111111'], 6);
    oreT(B.IRON, STONE, ['#e3a679', '#ffd9b8', '#9a6440'], 6);
    oreT(B.GOLD, STONE, ['#fcee4b', '#fffbd0', '#c99a10'], 5);
    oreT(B.RED, STONE, ['#ff1f1f', '#ff9a9a', '#8a0a0a'], 6);
    oreT(B.DIAM, DEEP, ['#5decf5', '#e6ffff', '#1a9aa4'], 5);
    variants(B.CHEST, function () {
      return fromMap([
        'dddddddddddddddd', 'dwwwwwwwwwwwwwwd', 'dwWwwwwwwwwwwWwd', 'dwwwwwwwwwwwwwwd', 'dwwwwwwwwwwwwwwd',
        'dddddddyyddddddd', 'dwwwwwwyywwwwwwd', 'dwwwwwwYYwwwwwwd', 'dwWwwwwwwwwwwWwd', 'dwwwwwwwwwwwwwwd',
        'dwwwwwwwwwwwwwwd', 'dwwwwwwwwwwwwwwd', 'dwwwwwwwwwwwwwwd', 'dwWwwwwwwwwwwWwd', 'dwwwwwwwwwwwwwwd', 'dddddddddddddddd'
      ], { d: '#4a2c10', w: '#a0682a', W: '#c58a42', y: '#f2c230', Y: '#a87a10' });
    });
    t.back.dirt = darken(t.blocks[B.DIRT][0], 0.62);
    t.back.stone = darken(t.blocks[B.STONE][1], 0.62);
    t.back.deep = darken(t.blocks[B.DEEP][0], 0.6);
    for (var f = 0; f < 4; f++) {
      var c = mk(), g = c.getContext('2d'), r = rng(77 + f), ph = f * Math.PI / 2;
      for (var y = 0; y < T; y++) for (var x = 0; x < T; x++) {
        var v = 0.5 + 0.25 * Math.sin(x * 0.7 + ph) + 0.22 * Math.sin(y * 0.8 - ph * 1.3 + x * 0.35) + (r() - 0.5) * 0.2;
        px(g, x, y, v > 0.82 ? '#ffe25a' : v > 0.6 ? '#ffa21a' : v > 0.35 ? '#f26b00' : '#c94400');
      }
      t.lava.push(c);
    }
    for (var k = 0; k < 6; k++) {
      var cc = mk(), cg = cc.getContext('2d'), cr = rng(500), steps = 6 + k * 7;
      cg.fillStyle = 'rgba(0,0,0,.75)';
      for (var i = 0; i < steps; i++) {
        var a = cr() * Math.PI * 2, len = 2 + cr() * (2 + k);
        var x0 = 8 + Math.cos(a) * cr() * (k + 2), y0 = 8 + Math.sin(a) * cr() * (k + 2);
        for (var q = 0; q < len; q++) cg.fillRect(Math.floor(x0 + Math.cos(a) * q), Math.floor(y0 + Math.sin(a) * q), 1, 1);
      }
      t.crack.push(cc);
    }
    t.items = {};
    t.items[B.TORCH] = fromMap([
      '', '', '', '.......YY.......', '......YWWY......', '......YWWY......', '.......OO.......', '.......ss.......',
      '.......ss.......', '.......ss.......', '.......ss.......', '.......ss.......', '.......SS.......', '.......SS.......', '.......SS.......'
    ], { Y: '#ffb020', W: '#fff6c0', O: '#ff7a10', s: '#7a5230', S: '#5a3a1f' });
    t.items[B.APPLE] = fromMap([
      '', '', '........b.......', '........bgg.....', '.......bggg.....', '....rrrbrrr.....', '...rhhrrrrrr....', '..rhhrrrrrrrr...',
      '..rhrrrrrrrrR...', '..rrrrrrrrrrR...', '..rrrrrrrrrRR...', '...rrrrrrrRR....', '...RrrrrrRRR....', '....RRRRRRR.....', '.....RR.RR......'
    ], { r: '#e8332a', R: '#9e1a14', h: '#ff9a8a', g: '#4fae3a', b: '#5a3a1f' });
    t.items[B.BREAD] = fromMap([
      '', '', '', '', '', '', '.....kkkkkk.....', '...kkyykkyykk...', '..kyykkyykkyyk..', '.kkkkkkkkkkkkkk.',
      '.kkkkkkkkkkkkkk.', '.dkkkkkkkkkkkkd.', '..ddkkkkkkkkdd..', '...dddddddddd...'
    ], { k: '#c8913a', y: '#efcb7a', d: '#8a5a20' });
    t.items[B.BUNDLE] = fromMap([
      '', '', '', '...Y....Y....Y..', '..YWY..YWY..YWY.', '...O....O....O..', '...s....s....s..', '...s....s....s..',
      '...rrrrrrrrrrr..', '...s....s....s..', '...s....s....s..', '...s....s....s..', '...S....S....S..', '...S....S....S..'
    ], { Y: '#ffb020', W: '#fff6c0', O: '#ff7a10', s: '#7a5230', S: '#5a3a1f', r: '#c0392b' });
    return t;
  };

  // Шахтёр: рисуется прямоугольниками в «пикселях» размера s
  M.drawMiner = function (g, x, y, s, face, swing, walk, pickCol, hurt) {
    g.save();
    g.translate(x + (face < 0 ? 16 * s : 0), y);
    g.scale(face < 0 ? -s : s, s);
    function r(c, a, b, w, h) { g.fillStyle = c; g.fillRect(a, b, w, h); }
    var lg = Math.sin(walk * Math.PI * 2) * 1.2;
    r('#2a2a2a', 5, 14 + Math.max(0, lg) * 0.6, 3, 2 - Math.max(0, lg) * 0.6);
    r('#2a2a2a', 9, 14 + Math.max(0, -lg) * 0.6, 3, 2 - Math.max(0, -lg) * 0.6);
    r('#4d3a2a', 5, 12, 7, 2.2);
    r(hurt ? '#ff7060' : '#3a6fd0', 4, 8, 9, 4.2);
    r('#2f5bb0', 4, 8, 2, 4.2);
    r('#e08a1e', 6, 8, 1, 4); r('#e08a1e', 10, 8, 1, 4);
    r('#6b4a2a', 4, 11.5, 9, 1);
    r(hurt ? '#ffb0a0' : '#e0a878', 5, 4, 7, 4);
    r('#1a1a1a', 10, 5, 1, 1.2);
    r('#6b4428', 7, 7, 5, 1);
    r('#f2c230', 4, 1, 8, 3);
    r('#c99a1a', 3, 3.5, 11, 1);
    r('#fff6b0', 11, 1.5, 2, 1.5);
    r('#ffe066', 12.5, 1.5, 0.8, 1.5);
    // рука с киркой
    g.translate(11, 9.5);
    g.rotate(swing);
    r('#7a5230', -0.5, -8, 1.2, 9.5);
    r(pickCol, -4.5, -9.2, 10, 1.6);
    r(pickCol, -5.5, -8.2, 1.6, 1.8);
    r(pickCol, 4.5, -8.2, 1.6, 1.8);
    r('rgba(255,255,255,.45)', -3.5, -9.2, 7, 0.5);
    r('#e0a878', -1, -0.6, 2.2, 2);
    g.restore();
  };
})(window.M);
