'use strict';
/* Управление: клавиатура, касания, наклон */
(function (J) {
  var keyL = false, keyR = false;
  var touches = []; // [{id, side}]
  var tilt = 0, tiltHas = false, tiltListening = false;
  var handlers = {};

  function onKey(e, down) {
    var k = e.key, c = e.code;
    if (k === 'ArrowLeft' || c === 'KeyA' || k === 'a' || k === 'A' || k === 'ф' || k === 'Ф') { keyL = down; e.preventDefault(); }
    else if (k === 'ArrowRight' || c === 'KeyD' || k === 'd' || k === 'D' || k === 'в' || k === 'В') { keyR = down; e.preventDefault(); }
    else if (down && (k === 'Escape' || c === 'KeyP')) { if (handlers.pause) handlers.pause(); e.preventDefault(); }
    else if (down && (k === 'Enter' || k === ' ' || c === 'Space')) {
      if (handlers.confirm && handlers.confirm(e)) e.preventDefault();
    }
    if (down && handlers.any) handlers.any();
  }

  function sideOf(e, el) {
    var r = el.getBoundingClientRect();
    return (e.clientX - r.left) < r.width / 2 ? -1 : 1;
  }

  function onOrient(e) {
    if (typeof e.gamma !== 'number') return;
    tiltHas = true;
    var g = e.gamma;
    var ang = (screen.orientation && screen.orientation.angle) || window.orientation || 0;
    if (ang === 90) g = e.beta; else if (ang === -90 || ang === 270) g = -e.beta;
    var v = J.clamp(g / 22, -1, 1);
    tilt = Math.abs(v) < 0.08 ? 0 : v;
  }

  J.input = {
    init: function (el, h) {
      handlers = h || {};
      window.addEventListener('keydown', function (e) { onKey(e, true); });
      window.addEventListener('keyup', function (e) { onKey(e, false); });
      window.addEventListener('blur', function () { keyL = keyR = false; touches.length = 0; });
      el.addEventListener('pointerdown', function (e) {
        if (handlers.any) handlers.any();
        touches = touches.filter(function (t) { return t.id !== e.pointerId; });
        touches.push({ id: e.pointerId, side: sideOf(e, el) });
        if (e.pointerType !== 'mouse') e.preventDefault();
      });
      el.addEventListener('pointermove', function (e) {
        for (var i = 0; i < touches.length; i++) if (touches[i].id === e.pointerId) touches[i].side = sideOf(e, el);
      });
      var up = function (e) { touches = touches.filter(function (t) { return t.id !== e.pointerId; }); };
      el.addEventListener('pointerup', up);
      el.addEventListener('pointercancel', up);
      el.addEventListener('pointerleave', up);
      el.addEventListener('contextmenu', function (e) { e.preventDefault(); });
      if (J.save.tilt) this.listenTilt();
    },
    dir: function () {
      if (touches.length) return touches[touches.length - 1].side;
      var k = (keyR ? 1 : 0) - (keyL ? 1 : 0);
      if (k) return k;
      if (J.save.tilt && tiltHas) return tilt;
      return 0;
    },
    reset: function () { keyL = keyR = false; touches.length = 0; },
    tiltSupported: function () { return typeof window.DeviceOrientationEvent !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0); },
    listenTilt: function () {
      if (tiltListening) return;
      tiltListening = true;
      window.addEventListener('deviceorientation', onOrient);
    },
    // включение наклона (на iOS нужен запрос разрешения по жесту)
    enableTilt: function (cb) {
      var self = this;
      var DOE = window.DeviceOrientationEvent;
      if (DOE && typeof DOE.requestPermission === 'function') {
        DOE.requestPermission().then(function (res) {
          if (res === 'granted') { self.listenTilt(); cb(true); } else cb(false);
        }).catch(function () { cb(false); });
      } else if (DOE) { self.listenTilt(); cb(true); } else cb(false);
    }
  };
})(window.J);
