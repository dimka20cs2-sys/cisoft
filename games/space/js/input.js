/* Неоновый космос — ввод: мышь (корабль следует за курсором), палец (перетаскивание), клавиатура */
(function () {
  'use strict';
  const SP = window.SP;
  const I = SP.input = { keys: {}, kx: 0, ky: 0, touchId: null, lx: 0, ly: 0, mouse: false };
  const cv = document.getElementById('cv');

  function toLogical(e) {
    const r = cv.getBoundingClientRect();
    return {
      x: (e.clientX - r.left) / r.width * SP.W,
      y: (e.clientY - r.top) / r.height * SP.H
    };
  }

  function playing() { return SP.game && SP.game.state === 'play'; }

  cv.addEventListener('pointerdown', e => {
    SP.audio.init();
    if (!playing()) return;
    const P = SP.player;
    if (e.pointerType === 'mouse') {
      const p = toLogical(e);
      P.tx = p.x; P.ty = p.y;
      I.mouse = true;
    } else {
      I.touchId = e.pointerId;
      I.lx = e.clientX; I.ly = e.clientY;
      I.mouse = false;
      try { cv.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ }
    }
    e.preventDefault();
  });

  cv.addEventListener('pointermove', e => {
    if (!playing()) return;
    const P = SP.player;
    if (e.pointerType === 'mouse') {
      const p = toLogical(e);
      P.tx = p.x; P.ty = p.y;
      I.mouse = true;
    } else if (I.touchId === e.pointerId) {
      // относительное перемещение: палец не закрывает корабль
      const r = cv.getBoundingClientRect();
      const k = SP.W / r.width * 1.35;
      P.tx += (e.clientX - I.lx) * k;
      P.ty += (e.clientY - I.ly) * k;
      I.lx = e.clientX; I.ly = e.clientY;
    }
    e.preventDefault();
  });

  function endTouch(e) {
    if (I.touchId === e.pointerId) I.touchId = null;
  }
  cv.addEventListener('pointerup', endTouch);
  cv.addEventListener('pointercancel', endTouch);
  cv.addEventListener('contextmenu', e => e.preventDefault());

  const MAP = {
    ArrowLeft: 'l', KeyA: 'l', ArrowRight: 'r', KeyD: 'r',
    ArrowUp: 'u', KeyW: 'u', ArrowDown: 'd', KeyS: 'd'
  };

  window.addEventListener('keydown', e => {
    const k = MAP[e.code];
    if (k) {
      I.keys[k] = true;
      if (playing()) e.preventDefault();
    }
    if (e.code === 'Escape' || e.code === 'KeyP') {
      if (SP.game) SP.game.togglePause();
      e.preventDefault();
    }
    if ((e.code === 'Enter' || e.code === 'Space') && SP.ui) {
      if (SP.ui.onEnter()) e.preventDefault();
    }
  });
  window.addEventListener('keyup', e => {
    const k = MAP[e.code];
    if (k) I.keys[k] = false;
  });
  window.addEventListener('blur', () => { I.keys = {}; I.touchId = null; });

  I.axis = function () {
    const K = I.keys;
    I.kx = (K.r ? 1 : 0) - (K.l ? 1 : 0);
    I.ky = (K.d ? 1 : 0) - (K.u ? 1 : 0);
    if (I.kx && I.ky) { I.kx *= 0.7071; I.ky *= 0.7071; }
    return I.kx !== 0 || I.ky !== 0;
  };
})();
