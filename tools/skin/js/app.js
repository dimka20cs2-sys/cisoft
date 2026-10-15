/* Skin Studio — сборка интерфейса */
(function () {
  'use strict';
  var SS = window.SS;
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function seg(root, fn) {
    $$('button', root).forEach(function (b) {
      b.addEventListener('click', function () { setSeg(root, b.getAttribute('data-v')); fn(b.getAttribute('data-v')); });
    });
  }
  function setSeg(root, v) { $$('button', root).forEach(function (b) { b.classList.toggle('on', b.getAttribute('data-v') === v); }); }

  var tt = 0;
  SS.toast = function (msg, err) {
    var t = $('#toast');
    t.textContent = msg;
    t.className = 'show' + (err ? ' err' : '');
    clearTimeout(tt);
    tt = setTimeout(function () { t.className = ''; }, err ? 4200 : 2600);
  };

  $$('[data-i]').forEach(function (el) { el.insertAdjacentHTML('afterbegin', SS.icon(el.getAttribute('data-i'))); });

  var skin = new SS.Skin(), tools = new SS.Tools(skin);
  SS.color.init($('#colors'));
  var editor = new SS.Editor2D($('#flat'), skin, tools, $('#status2d'));
  var viewer = new SS.Viewer($('#view'), skin, tools);
  SS.io.init(skin);
  SS.app = { skin: skin, tools: tools, editor: editor, viewer: viewer };

  // Инструменты
  function syncTools() {
    $$('[data-tool]').forEach(function (b) { b.classList.toggle('on', b.getAttribute('data-tool') === tools.tool); });
    $('#t-mirror').classList.toggle('on', tools.mirror);
    $('#t-layer b').textContent = tools.layer;
    $('#t-layer').classList.toggle('l2', tools.layer === 2);
    $('#t-grid').classList.toggle('on', editor.grid);
    $('#view').classList.toggle('rotate-tool', tools.tool === 'rotate');
  }
  function syncHistory() {
    $('#t-undo').disabled = !skin.undoStack.length;
    $('#t-redo').disabled = !skin.redoStack.length;
  }
  $$('[data-tool]').forEach(function (b) {
    b.addEventListener('click', function () { tools.setTool(b.getAttribute('data-tool')); });
  });
  $('#t-mirror').addEventListener('click', function () {
    tools.setMirror(!tools.mirror);
    SS.toast(tools.mirror ? 'Зеркало: левая и правая стороны рисуются вместе' : 'Зеркало выключено');
  });
  $('#t-layer').addEventListener('click', function () { tools.setLayer(tools.layer === 1 ? 2 : 1); });
  $('#t-grid').addEventListener('click', function () { editor.grid = !editor.grid; editor.invalidate(); syncTools(); });
  $('#t-undo').addEventListener('click', function () { skin.undo(); });
  $('#t-redo').addEventListener('click', function () { skin.redo(); });
  SS.on('tool', syncTools);
  SS.on('mirror', syncTools);
  SS.on('layer', function (l) {
    if (l === 2 && !viewer.vis.overlay) { viewer.vis.overlay = true; $('[data-p="overlay"]').classList.add('on'); }
    syncTools();
  });
  SS.on('history', syncHistory);
  SS.on('model', function (slim) { setSeg($('#g-model'), slim ? 'slim' : 'classic'); });

  // Шапка
  var file = $('#file');
  $('#b-open').addEventListener('click', function () { file.click(); });
  file.addEventListener('change', function () { SS.io.loadFile(file.files[0]); file.value = ''; });
  $('#f-nick').addEventListener('submit', function (e) { e.preventDefault(); SS.io.loadNick($('#i-nick').value); });
  var sel = $('#s-tpl');
  SS.templates.forEach(function (t) {
    var o = document.createElement('option');
    o.value = t.id; o.textContent = t.name + (t.slim ? ' (Alex)' : '');
    sel.appendChild(o);
  });
  sel.addEventListener('change', function () {
    if (!sel.value) return;
    var t = SS.applyTemplate(skin, sel.value, true);
    SS.toast('Шаблон «' + t.name + '» загружен');
    sel.value = '';
  });
  seg($('#g-model'), function (v) {
    skin.setSlim(v === 'slim', true);
    SS.toast(v === 'slim' ? 'Модель Alex — руки 3 пикселя' : 'Модель Steve — руки 4 пикселя');
  });
  $('#b-save').addEventListener('click', function () { SS.io.download(); });
  $('#b-help').addEventListener('click', function () {
    var d = $('#help');
    if (d.showModal) d.showModal(); else d.setAttribute('open', '');
  });

  // 3D-вид
  seg($('#g-pose'), function (v) { viewer.pose = v; if (v !== 'stand' && !viewer.anim) { viewer.anim = true; $('#c-anim').checked = true; } });
  $('#c-auto').addEventListener('change', function () { viewer.auto = this.checked; });
  $('#c-anim').addEventListener('change', function () { viewer.anim = this.checked; });
  SS.on('autorotate', function (v) { $('#c-auto').checked = v; });
  seg($('#g-bg'), function (v) { viewer.setBg(v); });
  $$('#g-parts button').forEach(function (b) {
    b.addEventListener('click', function () {
      var p = b.getAttribute('data-p');
      viewer.vis[p] = !viewer.vis[p];
      b.classList.toggle('on', viewer.vis[p]);
    });
  });
  $('#b-reset').addEventListener('click', function () { viewer.resetView(); });
  $('#b-shot').addEventListener('click', function () {
    var c = viewer.snapshot();
    SS.io.saveAs(c.toDataURL('image/png'), 'skin-3d.png');
    SS.toast('Скриншот 3D сохранён');
  });

  // Клавиатура
  var KEYS = { r: 'rotate', b: 'pencil', e: 'eraser', g: 'fill', i: 'picker', l: 'line', d: 'darken', u: 'lighten', n: 'noise' };
  document.addEventListener('keydown', function (e) {
    var tag = (e.target && e.target.tagName) || '';
    if (tag === 'INPUT' || tag === 'SELECT' || tag === 'TEXTAREA') return;
    var k = (e.key || '').toLowerCase(), code = e.code || '';
    if (e.ctrlKey || e.metaKey) {
      if (code === 'KeyZ' && e.shiftKey) { skin.redo(); e.preventDefault(); }
      else if (code === 'KeyZ') { skin.undo(); e.preventDefault(); }
      else if (code === 'KeyY') { skin.redo(); e.preventDefault(); }
      return;
    }
    if (e.altKey) return;
    if (k === 'tab') { e.preventDefault(); tools.setLayer(tools.layer === 1 ? 2 : 1); return; }
    var m = code.match(/^Key([A-Z])$/), key = m ? m[1].toLowerCase() : k;
    if (key === 'm') { tools.setMirror(!tools.mirror); return; }
    if (KEYS[key]) tools.setTool(KEYS[key]);
  });

  // Старт: черновик или шаблон
  SS.io.loadDraft().then(function (ok) {
    if (!ok) SS.applyTemplate(skin, 'miner', false);
    skin.undoStack.length = 0;
    skin.redoStack.length = 0;
    syncTools();
    syncHistory();
    document.body.classList.add('ready');
    if (window.parent && window.parent !== window) {
      document.body.classList.add('embedded');
      try { window.parent.postMessage({ type: 'cisoft-tool', id: 'skin', event: 'ready' }, '*'); } catch (e) { /* нет */ }
    }
  });
})();
