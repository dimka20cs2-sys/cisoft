// Звуки, сгенерированные WebAudio (без файлов).
let ctx = null;
function ac() {
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  if (ctx.state === 'suspended') ctx.resume().catch(() => {});
  return ctx;
}
// Браузеры разрешают звук только после действия пользователя — «разблокируем» при первом клике.
['pointerdown', 'keydown'].forEach((ev) => window.addEventListener(ev, () => ac(), { once: true, capture: true }));

function tone(freq, start, dur, vol = 0.15, type = 'sine') {
  const c = ac(); if (!c) return;
  const o = c.createOscillator(), g = c.createGain();
  o.type = type; o.frequency.value = freq;
  const t0 = c.currentTime + start;
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(vol, t0 + 0.02);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  o.connect(g).connect(c.destination);
  o.start(t0); o.stop(t0 + dur + 0.05);
}

let lastMsgSound = 0;
export function playMessageSound() {
  if (Date.now() - lastMsgSound < 1200) return; // не «строчим» при пачке сообщений
  lastMsgSound = Date.now();
  tone(880, 0, 0.12, 0.12);
  tone(1320, 0.1, 0.18, 0.1);
}

let ringTimer = null;
function ringOnce() {
  [659, 784, 988, 784].forEach((f, i) => tone(f, i * 0.16, 0.22, 0.16, 'triangle'));
  [659, 784, 988, 784].forEach((f, i) => tone(f, 0.9 + i * 0.16, 0.22, 0.16, 'triangle'));
}
export function startRingtone() {
  stopTones();
  ringOnce();
  ringTimer = setInterval(ringOnce, 2600);
}

// Гудки для звонящего: 425 Гц, 1 с звук / 3 с тишина
export function startRingback() {
  stopTones();
  const beep = () => tone(425, 0, 1.0, 0.08);
  beep();
  ringTimer = setInterval(beep, 4000);
}

export function stopTones() { clearInterval(ringTimer); ringTimer = null; }

export function playHangup() {
  tone(480, 0, 0.18, 0.1); tone(380, 0.22, 0.25, 0.1);
}
