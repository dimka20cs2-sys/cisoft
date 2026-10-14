'use strict';
/* Звуки: синтез WebAudio, без файлов */
(function (J) {
  var ctx = null, master = null, noiseBuf = null;
  var engine = null;

  function ensure() {
    if (ctx) return ctx;
    var AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    try {
      ctx = new AC();
      master = ctx.createGain();
      master.gain.value = 0.32;
      master.connect(ctx.destination);
      noiseBuf = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
      var d = noiseBuf.getChannelData(0);
      for (var i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    } catch (e) { ctx = null; }
    return ctx;
  }

  function tone(f1, f2, dur, type, vol, delay) {
    var t = ctx.currentTime + (delay || 0);
    var o = ctx.createOscillator();
    var g = ctx.createGain();
    o.type = type || 'sine';
    o.frequency.setValueAtTime(f1, t);
    if (f2 && f2 !== f1) o.frequency.exponentialRampToValueAtTime(f2, t + dur);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol || 0.3, t + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(master);
    o.start(t); o.stop(t + dur + 0.02);
  }

  function noise(dur, vol, freq, q, delay) {
    var t = ctx.currentTime + (delay || 0);
    var s = ctx.createBufferSource();
    s.buffer = noiseBuf;
    var f = ctx.createBiquadFilter();
    f.type = 'bandpass';
    f.frequency.value = freq || 1000;
    f.Q.value = q || 1;
    var g = ctx.createGain();
    g.gain.setValueAtTime(vol || 0.3, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    s.connect(f); f.connect(g); g.connect(master);
    s.start(t, Math.random() * 0.5); s.stop(t + dur + 0.02);
  }

  var SOUNDS = {
    jump: function () { tone(330, 620, 0.13, 'sine', 0.22); },
    spring: function () { tone(220, 900, 0.28, 'triangle', 0.25); tone(440, 1300, 0.2, 'sine', 0.1, 0.05); },
    tramp: function () { tone(160, 700, 0.4, 'triangle', 0.28); tone(320, 1000, 0.35, 'sine', 0.12, 0.08); },
    cloud: function () { noise(0.25, 0.12, 900, 0.7); tone(500, 700, 0.15, 'sine', 0.1); },
    coin: function () { tone(988, 988, 0.07, 'square', 0.08); tone(1319, 1319, 0.14, 'square', 0.08, 0.06); },
    crack: function () { noise(0.22, 0.35, 600, 0.8); tone(180, 70, 0.2, 'sawtooth', 0.08); },
    power: function () {
      tone(523, 523, 0.1, 'square', 0.08); tone(659, 659, 0.1, 'square', 0.08, 0.08);
      tone(784, 784, 0.1, 'square', 0.08, 0.16); tone(1047, 1047, 0.2, 'square', 0.08, 0.24);
    },
    stomp: function () { tone(500, 120, 0.18, 'square', 0.16); noise(0.12, 0.2, 2000, 1); },
    shield: function () { tone(880, 220, 0.35, 'sawtooth', 0.12); noise(0.3, 0.2, 3000, 0.5); },
    hit: function () { tone(400, 60, 0.5, 'sawtooth', 0.2); noise(0.35, 0.3, 400, 0.6); },
    hole: function () { tone(300, 40, 0.9, 'sine', 0.3); },
    fall: function () { tone(700, 120, 0.8, 'triangle', 0.18); },
    over: function () {
      tone(392, 392, 0.18, 'triangle', 0.18); tone(330, 330, 0.18, 'triangle', 0.18, 0.18);
      tone(262, 196, 0.45, 'triangle', 0.18, 0.36);
    },
    record: function () {
      [523, 659, 784, 1047, 1319].forEach(function (f, i) { tone(f, f, 0.16, 'square', 0.07, i * 0.09); });
    },
    click: function () { tone(660, 880, 0.05, 'square', 0.06); },
    buy: function () { tone(784, 784, 0.08, 'square', 0.08); tone(1175, 1175, 0.18, 'square', 0.08, 0.07); },
    deny: function () { tone(200, 150, 0.18, 'square', 0.1); }
  };

  function stopEngine() {
    if (!engine) return;
    try {
      var t = ctx.currentTime;
      engine.g.gain.cancelScheduledValues(t);
      engine.g.gain.setTargetAtTime(0.0001, t, 0.05);
      engine.src.stop(t + 0.3);
      if (engine.osc) engine.osc.stop(t + 0.3);
    } catch (e) { /* уже остановлен */ }
    engine = null;
  }

  J.sfx = {
    unlock: function () {
      if (!ensure()) return;
      if (ctx.state === 'suspended') { try { ctx.resume(); } catch (e) { /* игнор */ } }
    },
    play: function (name) {
      if (!J.save.sound || !ctx || ctx.state !== 'running') return;
      var fn = SOUNDS[name];
      if (fn) { try { fn(); } catch (e) { /* игнор */ } }
    },
    // непрерывный звук ранца/пропеллера: kind = 'jet' | 'prop' | null
    engine: function (kind) {
      if (!kind || !J.save.sound || !ctx || ctx.state !== 'running') { stopEngine(); return; }
      if (engine && engine.kind === kind) return;
      stopEngine();
      try {
        var src = ctx.createBufferSource();
        src.buffer = noiseBuf; src.loop = true;
        var f = ctx.createBiquadFilter();
        f.type = kind === 'jet' ? 'lowpass' : 'bandpass';
        f.frequency.value = kind === 'jet' ? 700 : 300;
        var g = ctx.createGain();
        g.gain.value = 0.0001;
        g.gain.setTargetAtTime(kind === 'jet' ? 0.22 : 0.12, ctx.currentTime, 0.05);
        src.connect(f); f.connect(g); g.connect(master);
        var osc = null;
        if (kind === 'prop') { // «тарахтение» винта
          osc = ctx.createOscillator();
          osc.frequency.value = 22;
          var lg = ctx.createGain(); lg.gain.value = 0.1;
          osc.connect(lg); lg.connect(g.gain); osc.start();
        }
        src.start();
        engine = { kind: kind, src: src, g: g, osc: osc };
      } catch (e) { engine = null; }
    },
    setEnabled: function (on) {
      J.save.sound = !!on;
      if (!on) stopEngine();
      J.persist();
    }
  };
})(window.J);
