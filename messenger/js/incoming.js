// Входящие звонки: слушаем calls where calleeId == я && status == 'ringing'.
import { db } from './fb.js';
import { collection, query, where, onSnapshot, doc, runTransaction, serverTimestamp } from './fs.js';
import { state } from './state.js';
import { el, avatar } from './dom.js';
import { icon } from './icons.js';
import { toMs, serverNow } from './util.js';
import { watchUser, cachedUser } from './users.js';
import { acceptCall, TERMINAL } from './calls.js';
import { sendCallMessage } from './send.js';
import { startRingtone, stopTones } from './sound.js';
import { notifyIncomingCall, postToHost } from './notify.js';

let unsub = null;
const shown = new Map(); // callId → { root, timer }
const handled = new Set();
const gone = new Set();

// Завершить звонок без открытой сессии (отклонить / пропущен) + сообщение в чат
async function closeCall(id, d, status) {
  let wrote = false;
  try {
    wrote = await runTransaction(db, async (tx) => {
      const s = await tx.get(doc(db, 'calls', id));
      if (!s.exists() || TERMINAL.includes(s.data().status)) return false;
      tx.update(s.ref, { status, endedAt: serverTimestamp(), endedBy: state.uid, duration: 0 });
      return true;
    });
  } catch (e) { console.warn(e); }
  if (wrote) {
    sendCallMessage(d.chatId, id, { callerId: d.callerId, calleeId: d.calleeId, video: !!d.video, status, duration: 0 }).catch(() => {});
  }
}

export function startIncoming() {
  stopIncoming();
  const q = query(collection(db, 'calls'), where('calleeId', '==', state.uid), where('status', '==', 'ringing'));
  unsub = onSnapshot(q, (snap) => {
    for (const ch of snap.docChanges()) {
      const id = ch.doc.id;
      if (ch.type === 'removed') { gone.add(id); hide(id); continue; }
      if (ch.type !== 'added' || handled.has(id)) continue;
      handled.add(id);
      const d = ch.doc.data({ serverTimestamps: 'estimate' });
      const age = serverNow() - (toMs(d.createdAt) || serverNow());
      if (age > 45000) { closeCall(id, d, 'missed'); continue; }       // звонивший пропал
      if (state.inCall) { closeCall(id, d, 'missed'); continue; }      // заняты другим звонком
      show(id, d, Math.max(5000, 42000 - age));
    }
  }, (e) => console.error('incoming', e));
}

export function stopIncoming() {
  unsub?.(); unsub = null;
  for (const id of [...shown.keys()]) hide(id);
}

async function show(id, d, ttl) {
  await watchUser(d.callerId);
  if (!unsub || gone.has(id)) return; // звонок уже отменили, пока грузили профиль
  const u = cachedUser(d.callerId) || { uid: d.callerId, name: 'Собеседник' };
  const kind = d.video ? 'Входящий видеозвонок' : 'Входящий аудиозвонок';
  const root = el('div', { class: 'incoming', role: 'alertdialog', 'aria-label': kind + ': ' + u.name },
    el('div', { class: 'inc-top' }, avatar(u, 56),
      el('div', {}, el('div', { class: 'inc-name', text: u.name }), el('div', { class: 'inc-kind', text: kind }))),
    el('div', { class: 'inc-actions' },
      el('button', { class: 'inc-btn decline', type: 'button', onclick: () => { hide(id); closeCall(id, d, 'declined'); } },
        icon('phone', 18), 'Отклонить'),
      el('button', { class: 'inc-btn accept', type: 'button', onclick: () => { hide(id); acceptCall(id, d); } },
        icon(d.video ? 'video' : 'phone', 18), 'Принять')));
  document.body.append(root);
  const timer = setTimeout(() => { hide(id); closeCall(id, d, 'missed'); }, ttl);
  shown.set(id, { root, timer });
  startRingtone();
  notifyIncomingCall(u.name, d.video, d.chatId);
  root.querySelector('.accept')?.focus();
}

function hide(id) {
  const s = shown.get(id);
  if (!s) return;
  clearTimeout(s.timer);
  s.root.remove();
  shown.delete(id);
  if (!shown.size) { stopTones(); postToHost({ type: 'call-ended' }); }
}
