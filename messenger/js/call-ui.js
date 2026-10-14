// Экран звонка: видео, таймер, кнопки управления.
import { on } from './state.js';
import { el, avatar } from './dom.js';
import { icon } from './icons.js';
import { fmtDuration } from './util.js';
import { cachedUser, watchUser } from './users.js';
import { listCameras } from './rtc-media.js';

let ui = null; // { root, session, ... }

function ctrl(name, label, onclick, cls = '') {
  const btn = el('button', { class: 'call-btn ' + cls, type: 'button', title: label, 'aria-label': label, onclick }, icon(name, 24));
  const cap = el('span', { text: label });
  return { wrap: el('div', { class: 'call-btn-wrap' }, btn, cap), btn, cap };
}

function build(session) {
  const remote = el('video', { class: 'remote', autoplay: true, playsInline: true });
  remote.setAttribute('playsinline', '');
  const local = el('video', { class: 'local', autoplay: true, playsInline: true, muted: true });
  local.muted = true; local.setAttribute('playsinline', '');
  const avaSlot = el('div');
  const name = el('div', { class: 'call-name' });
  const status = el('div', { class: 'call-status' });
  const note = el('div', { class: 'call-note' });
  const remoteOff = el('div', { class: 'remote-off', hidden: true, text: 'Собеседник выключил камеру' });
  const mic = ctrl('mic', 'Микрофон', () => session.toggleMic());
  const cam = ctrl('video', 'Камера', () => session.toggleCamera());
  const flip = ctrl('switchCam', 'Сменить камеру', () => session.switchCamera());
  const hang = ctrl('phone', 'Завершить', () => session.hangup(), 'hangup');
  const root = el('div', { class: 'call-screen', role: 'dialog', 'aria-label': 'Звонок' },
    remote, local,
    el('div', { class: 'call-center' }, avaSlot, name, status, note),
    remoteOff,
    el('div', { class: 'call-controls' }, mic.wrap, cam.wrap, flip.wrap, hang.wrap));
  document.body.append(root);
  remote.srcObject = session.remoteStream;
  remote.play().catch(() => {});
  ui = { root, session, remote, local, avaSlot, name, status, note, remoteOff, mic, cam, flip, cams: 0, avaKey: '' };
  ui.timer = setInterval(() => render(session), 1000);
  listCameras().then((c) => { if (ui) { ui.cams = c.length; render(session); } });
  watchUser(session.peerUid);
}

function render(session) {
  if (!ui || ui.session !== session) {
    if (ui) teardown();
    if (session.ended) return;
    build(session);
  }
  const u = cachedUser(session.peerUid) || { uid: session.peerUid, name: 'Собеседник' };
  const avaKey = u.name + (u.avatar?.length || 0);
  if (ui.avaKey !== avaKey) { ui.avaKey = avaKey; ui.avaSlot.replaceChildren(avatar(u, 120)); }
  ui.name.textContent = u.name;

  let st;
  if (session.ended) st = 'Звонок завершён';
  else if (session.status === 'ringing') st = session.role === 'caller' ? (session.video ? 'Видеовызов…' : 'Вызов…') : 'Соединение…';
  else if (session.status === 'connecting') st = 'Соединение…';
  else st = fmtDuration((Date.now() - session.connectedAt) / 1000);
  ui.status.textContent = st;
  ui.note.textContent = session.note || '';

  const showRemoteVideo = session.remoteVideo && session.status === 'active';
  ui.root.classList.toggle('has-video', showRemoteVideo);
  ui.root.classList.toggle('ringing', session.status === 'ringing');
  ui.remote.style.visibility = showRemoteVideo ? 'visible' : 'hidden';
  ui.remoteOff.hidden = !(session.video && session.status === 'active' && !session.remoteVideo);

  if (ui.remote.srcObject !== session.remoteStream) ui.remote.srcObject = session.remoteStream;
  if (ui.remote.paused) ui.remote.play().catch(() => {});
  const ls = session.localStream;
  const hasLocalVideo = !!ls?.getVideoTracks().length && session.camOn;
  ui.local.hidden = !hasLocalVideo;
  if (hasLocalVideo && ui.local.srcObject !== ls) { ui.local.srcObject = ls; ui.local.play().catch(() => {}); }
  // Смена камеры пересоздаёт трек — обновим превью
  const lt = ls?.getVideoTracks()[0];
  if (hasLocalVideo && ui.localTrack !== lt) { ui.localTrack = lt; ui.local.srcObject = new MediaStream([lt]); ui.local.play().catch(() => {}); }

  setBtn(ui.mic, session.micOn ? 'mic' : 'micOff', session.micOn ? 'Микрофон' : 'Микрофон выкл.', !session.micOn);
  setBtn(ui.cam, session.camOn ? 'video' : 'videoOff', session.camOn ? 'Камера' : 'Включить видео', !session.camOn);
  ui.flip.wrap.hidden = !(session.camOn && ui.cams > 1);

  if (session.ended) {
    clearInterval(ui.timer);
    const r = ui.root;
    ui.root.querySelectorAll('button').forEach((b) => { b.disabled = true; });
    setTimeout(() => { if (ui?.root === r) teardown(); else r.remove(); }, 1200);
  }
}

function setBtn(c, iconName, label, off) {
  if (c.iconName !== iconName) { c.iconName = iconName; c.btn.replaceChildren(icon(iconName, 24)); }
  c.btn.classList.toggle('off', off);
  c.btn.title = label; c.btn.setAttribute('aria-label', label);
  c.cap.textContent = label;
}

function teardown() {
  if (!ui) return;
  clearInterval(ui.timer);
  ui.remote.srcObject = null; ui.local.srcObject = null;
  ui.root.remove();
  ui = null;
}

on('call-update', (s) => render(s));
on('user', () => { if (ui && !ui.session.ended) render(ui.session); });
