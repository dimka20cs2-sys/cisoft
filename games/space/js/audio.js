/* Неоновый космос — синтез звуков через WebAudio */
(function () {
  'use strict';
  const SP = window.SP;
  let ac = null, master = null, noiseBuf = null;
  const last = {};
  const A = SP.audio = { on: SP.store.get('sound', true) !== false };
  const VOL = 0.45;

  A.init = function () {
    if (ac) {
      if (ac.state === 'suspended') ac.resume().catch(() => {});
      return;
    }
    try {
      const C = window.AudioContext || window.webkitAudioContext;
      if (!C) return;
      ac = new C();
      master = ac.createGain();
      master.gain.value = A.on ? VOL : 0;
      const comp = ac.createDynamicsCompressor();
      master.connect(comp);
      comp.connect(ac.destination);
      const len = Math.floor(ac.sampleRate * 1);
      noiseBuf = ac.createBuffer(1, len, ac.sampleRate);
      const d = noiseBuf.getChannelData(0);
      for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    } catch (e) { ac = null; }
  };

  A.toggle = function () {
    A.on = !A.on;
    SP.store.set('sound', A.on);
    if (ac && master) master.gain.setTargetAtTime(A.on ? VOL : 0, ac.currentTime, 0.02);
    return A.on;
  };

  function ok(name, gap) {
    if (!ac || !A.on || ac.state !== 'running') return false;
    const t = ac.currentTime;
    if (last[name] !== undefined && t - last[name] < gap) return false;
    last[name] = t;
    return true;
  }

  function tone(type, f0, f1, dur, vol, delay) {
    const t = ac.currentTime + (delay || 0);
    const o = ac.createOscillator(), g = ac.createGain();
    o.type = type;
    o.frequency.setValueAtTime(f0, t);
    if (f1) o.frequency.exponentialRampToValueAtTime(f1, t + dur);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + 0.005);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g);
    g.connect(master);
    o.start(t);
    o.stop(t + dur + 0.03);
  }

  function noise(dur, vol, f0, f1, delay) {
    const t = ac.currentTime + (delay || 0);
    const src = ac.createBufferSource(), f = ac.createBiquadFilter(), g = ac.createGain();
    src.buffer = noiseBuf;
    f.type = 'lowpass';
    f.frequency.setValueAtTime(f0, t);
    f.frequency.exponentialRampToValueAtTime(f1 || 80, t + dur);
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    src.connect(f);
    f.connect(g);
    g.connect(master);
    src.start(t);
    src.stop(t + dur + 0.03);
  }

  A.shoot = function () { if (ok('shoot', 0.09)) tone('square', 920, 380, 0.07, 0.025); };
  A.laser = function () { if (ok('laser', 0.12)) tone('sawtooth', 220 + Math.random() * 40, 180, 0.13, 0.03); };
  A.eshot = function () { if (ok('eshot', 0.08)) tone('triangle', 520, 260, 0.1, 0.05); };
  A.hit = function () { if (ok('hit', 0.04)) tone('triangle', 320, 160, 0.05, 0.06); };
  A.boom = function (big) {
    if (!ok(big ? 'boomB' : 'boom', 0.05)) return;
    noise(big ? 1.0 : 0.35, big ? 0.6 : 0.28, big ? 1600 : 2600, 60);
    tone('sine', big ? 110 : 170, 35, big ? 0.9 : 0.3, big ? 0.5 : 0.22);
  };
  A.coin = function () {
    if (!ok('coin', 0.05)) return;
    tone('square', 1320, null, 0.05, 0.035);
    tone('square', 1980, null, 0.09, 0.035, 0.05);
  };
  A.power = function () {
    if (!ok('power', 0.1)) return;
    [523, 659, 784, 1047].forEach((f, i) => tone('triangle', f, null, 0.12, 0.09, i * 0.06));
  };
  A.hurt = function () {
    if (!ok('hurt', 0.2)) return;
    noise(0.5, 0.45, 3000, 100);
    tone('sawtooth', 300, 60, 0.5, 0.16);
  };
  A.bomb = function () {
    if (!ok('bomb', 0.3)) return;
    noise(1.4, 0.7, 4000, 50);
    tone('sine', 90, 30, 1.2, 0.6);
    tone('sawtooth', 1200, 100, 0.6, 0.08);
  };
  A.warn = function () {
    if (!ok('warn', 1)) return;
    for (let i = 0; i < 3; i++) {
      tone('sawtooth', 440, 330, 0.28, 0.07, i * 0.36);
      tone('square', 220, 165, 0.28, 0.04, i * 0.36);
    }
  };
  A.wave = function () {
    if (!ok('wave', 0.5)) return;
    tone('triangle', 659, null, 0.15, 0.08);
    tone('triangle', 988, null, 0.25, 0.08, 0.12);
  };
  A.over = function () {
    if (!ok('over', 1)) return;
    [392, 330, 262, 196].forEach((f, i) => tone('triangle', f, f * 0.98, 0.3, 0.1, i * 0.18));
  };
  A.click = function () { if (ok('click', 0.05)) tone('square', 660, 880, 0.05, 0.04); };
  A.buy = function () {
    if (!ok('buy', 0.1)) return;
    tone('square', 880, null, 0.06, 0.05);
    tone('square', 1320, null, 0.12, 0.05, 0.07);
  };
})();
