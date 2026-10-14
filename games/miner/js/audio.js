'use strict';
// Синтез звуков через WebAudio — без файлов
(function (M) {
  var A = M.audio = { on: M.store.get('sound', true) !== false, ctx: null, master: null, noiseBuf: null, last: {} };

  A.unlock = function () {
    try {
      if (!A.ctx) {
        var AC = window.AudioContext || window.webkitAudioContext;
        if (!AC) return;
        A.ctx = new AC();
        A.master = A.ctx.createGain();
        A.master.gain.value = 0.45;
        A.master.connect(A.ctx.destination);
        var len = A.ctx.sampleRate * 1;
        A.noiseBuf = A.ctx.createBuffer(1, len, A.ctx.sampleRate);
        var ch = A.noiseBuf.getChannelData(0);
        for (var i = 0; i < len; i++) ch[i] = Math.random() * 2 - 1;
      }
      if (A.ctx.state === 'suspended') A.ctx.resume();
    } catch (e) { A.ctx = null; }
  };

  A.toggle = function () {
    A.on = !A.on;
    M.store.set('sound', A.on);
    if (A.on) { A.unlock(); A.play('click'); }
    return A.on;
  };

  function env(g, t, vol, att, dur) {
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + att);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  }

  function tone(freq, dur, type, vol, slide, delay) {
    var c = A.ctx, t = c.currentTime + (delay || 0);
    var o = c.createOscillator(), g = c.createGain();
    o.type = type || 'square';
    o.frequency.setValueAtTime(freq, t);
    if (slide) o.frequency.exponentialRampToValueAtTime(slide, t + dur);
    env(g, t, vol, 0.005, dur);
    o.connect(g); g.connect(A.master);
    o.start(t); o.stop(t + dur + 0.02);
  }

  function noise(dur, vol, freq, ftype, delay, q, slide) {
    var c = A.ctx, t = c.currentTime + (delay || 0);
    var s = c.createBufferSource(), f = c.createBiquadFilter(), g = c.createGain();
    s.buffer = A.noiseBuf;
    f.type = ftype || 'lowpass';
    f.frequency.setValueAtTime(freq, t);
    if (slide) f.frequency.exponentialRampToValueAtTime(slide, t + dur);
    f.Q.value = q || 1;
    env(g, t, vol, 0.004, dur);
    s.connect(f); f.connect(g); g.connect(A.master);
    s.start(t, Math.random() * 0.5); s.stop(t + dur + 0.02);
  }

  var SFX = {
    hit: function (o) {
      var hard = (o && o.hard) || 0.3;
      noise(0.07, 0.22, 1800 - hard * 1200 + Math.random() * 400, 'bandpass', 0, 2.5);
      tone(140 + Math.random() * 40, 0.05, 'square', 0.04);
    },
    break: function (o) {
      var hard = (o && o.hard) || 0.3;
      noise(0.18, 0.35, 900 - hard * 500, 'lowpass', 0, 1, 200);
      tone(110, 0.12, 'triangle', 0.18, 50);
    },
    ore: function (o) {
      var v = (o && o.value) || 5, base = v >= 100 ? 784 : v >= 40 ? 659 : v >= 25 ? 587 : v >= 10 ? 523 : 440;
      tone(base, 0.09, 'square', 0.09);
      tone(base * 1.26, 0.09, 'square', 0.09, 0, 0.06);
      tone(base * 1.5, 0.16, 'square', 0.09, 0, 0.12);
      if (v >= 100) { tone(base * 2, 0.3, 'triangle', 0.12, 0, 0.2); tone(base * 2.5, 0.35, 'sine', 0.08, 0, 0.28); }
    },
    food: function () {
      tone(523, 0.08, 'triangle', 0.15); tone(659, 0.08, 'triangle', 0.15, 0, 0.07); tone(1046, 0.18, 'triangle', 0.13, 0, 0.14);
    },
    torch: function () { noise(0.3, 0.2, 400, 'bandpass', 0, 0.8, 2400); tone(300, 0.15, 'sine', 0.06, 600); },
    pickup: function () { tone(880, 0.06, 'square', 0.08); tone(1320, 0.1, 'square', 0.08, 0, 0.05); },
    chest: function () {
      noise(0.15, 0.25, 600, 'lowpass');
      [523, 659, 784, 1046].forEach(function (f, i) { tone(f, 0.12, 'square', 0.08, 0, 0.05 + i * 0.07); });
    },
    hurt: function () { tone(220, 0.25, 'sawtooth', 0.18, 70); noise(0.2, 0.3, 500, 'lowpass'); },
    rumble: function () { noise(0.5, 0.25, 300, 'lowpass', 0, 1, 90); },
    land: function () { noise(0.2, 0.4, 350, 'lowpass', 0, 1, 80); tone(80, 0.15, 'sine', 0.25, 40); },
    sizzle: function () { noise(0.35, 0.12, 3000, 'highpass', 0, 0.5); },
    burn: function () { noise(0.9, 0.5, 1200, 'lowpass', 0, 1, 100); tone(300, 0.8, 'sawtooth', 0.2, 40); },
    jump: function () { tone(260, 0.08, 'square', 0.05, 420); },
    step: function () { noise(0.04, 0.08, 700, 'lowpass'); },
    depth: function () { [392, 523, 659, 784].forEach(function (f, i) { tone(f, 0.14, 'triangle', 0.12, 0, i * 0.08); }); },
    start: function () { [262, 330, 392, 523].forEach(function (f, i) { tone(f, 0.12, 'square', 0.07, 0, i * 0.07); }); },
    over: function () { [392, 330, 262, 196].forEach(function (f, i) { tone(f, 0.25, 'triangle', 0.14, 0, i * 0.16); }); },
    click: function () { tone(660, 0.04, 'square', 0.06); },
    buy: function () { tone(784, 0.07, 'square', 0.08); tone(1175, 0.15, 'square', 0.08, 0, 0.07); },
    deny: function () { tone(160, 0.15, 'square', 0.08, 120); }
  };

  A.play = function (name, opt) {
    if (!A.on || !A.ctx || A.ctx.state !== 'running') return;
    var now = A.ctx.currentTime;
    if (A.last[name] && now - A.last[name] < 0.03) return; // не спамить одинаковым звуком
    A.last[name] = now;
    try { SFX[name](opt); } catch (e) { /* ignore */ }
  };
})(window.M);
