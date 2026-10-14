'use strict';
// Ввод: клавиатура, экранные кнопки, удержание пальца/мыши на поле
(function (M) {
  var DIRS = { L: { x: -1, y: 0 }, R: { x: 1, y: 0 }, U: { x: 0, y: -1 }, D: { x: 0, y: 1 } };
  var KEYS = {
    ArrowLeft: 'L', KeyA: 'L', ArrowRight: 'R', KeyD: 'R', ArrowUp: 'U', KeyW: 'U', ArrowDown: 'D', KeyS: 'D'
  };
  var I = M.input = { stack: [], ptr: null, playerScreen: null, onPause: null, onTorch: null, onAny: null, touch: false };

  function push(d) { rm(d); I.stack.push(d); }
  function rm(d) { var i = I.stack.indexOf(d); if (i >= 0) I.stack.splice(i, 1); }

  I.dir = function () {
    if (I.stack.length) return DIRS[I.stack[I.stack.length - 1]];
    if (I.ptr) return DIRS[I.ptr.d] || null;
    return null;
  };
  I.clear = function () {
    I.stack.length = 0; I.ptr = null;
    var on = document.querySelectorAll('.tb.on');
    for (var i = 0; i < on.length; i++) on[i].classList.remove('on');
  };

  window.addEventListener('keydown', function (e) {
    if (I.onAny) I.onAny();
    var code = e.code || e.key;
    var d = KEYS[code];
    if (d || code === 'Space') e.preventDefault();
    if (e.repeat) return;
    if (d) { push(d); return; }
    if (code === 'Space' || code === 'Escape' || code === 'KeyP') { if (I.onPause) I.onPause(); return; }
    if (code === 'KeyF' || code === 'KeyE' || code === 'KeyT') { if (I.onTorch) I.onTorch(); }
  });
  window.addEventListener('keyup', function (e) {
    var d = KEYS[e.code || e.key];
    if (d) rm(d);
  });
  window.addEventListener('blur', function () { I.clear(); });

  function showTouch() {
    if (I.touch) return;
    I.touch = true;
    document.body.classList.add('touch');
    if (M.ui) M.ui.refreshTouch();
  }
  if (('ontouchstart' in window) || navigator.maxTouchPoints > 0 ||
      (window.matchMedia && window.matchMedia('(pointer: coarse)').matches)) {
    I.touch = true;
    document.body.classList.add('touch');
  }

  // экранные кнопки
  var btns = document.querySelectorAll('[data-dir]');
  Array.prototype.forEach.call(btns, function (b) {
    var d = b.getAttribute('data-dir');
    function down(e) {
      e.preventDefault();
      if (I.onAny) I.onAny();
      try { b.setPointerCapture(e.pointerId); } catch (x) { /* ignore */ }
      b.classList.add('on'); push(d);
    }
    function up() { b.classList.remove('on'); rm(d); }
    b.addEventListener('pointerdown', down);
    b.addEventListener('pointerup', up);
    b.addEventListener('pointercancel', up);
    b.addEventListener('lostpointercapture', up);
    b.addEventListener('contextmenu', function (e) { e.preventDefault(); });
  });
  var tb = document.getElementById('b-torch');
  tb.addEventListener('pointerdown', function (e) {
    e.preventDefault();
    tb.classList.add('on');
    setTimeout(function () { tb.classList.remove('on'); }, 120);
    if (I.onTorch) I.onTorch();
  });

  // удержание на поле — направление от шахтёра к пальцу
  var cv = document.getElementById('cv');
  function ptrDir(e) {
    var ps = I.playerScreen;
    if (!ps) return null;
    var r = cv.getBoundingClientRect();
    var dx = e.clientX - r.left - ps.x, dy = e.clientY - r.top - ps.y;
    if (Math.abs(dx) < 14 && Math.abs(dy) < 14) return null;
    return Math.abs(dx) > Math.abs(dy) ? (dx < 0 ? 'L' : 'R') : (dy < 0 ? 'U' : 'D');
  }
  cv.addEventListener('pointerdown', function (e) {
    if (e.pointerType === 'touch') showTouch();
    if (I.onAny) I.onAny();
    try { cv.setPointerCapture(e.pointerId); } catch (x) { /* ignore */ }
    I.ptr = { id: e.pointerId, d: ptrDir(e) };
  });
  cv.addEventListener('pointermove', function (e) {
    if (I.ptr && I.ptr.id === e.pointerId) I.ptr.d = ptrDir(e);
  });
  function ptrUp(e) { if (I.ptr && I.ptr.id === e.pointerId) I.ptr = null; }
  cv.addEventListener('pointerup', ptrUp);
  cv.addEventListener('pointercancel', ptrUp);
  cv.addEventListener('contextmenu', function (e) { e.preventDefault(); });
  window.addEventListener('touchstart', showTouch, { passive: true });
})(window.M);
