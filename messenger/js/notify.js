// Уведомления: звук, Notification API, заголовок вкладки, мост для WebView2.
import { state, getPref, setPref, emit } from './state.js';
import { playMessageSound } from './sound.js';
import { chatTitle } from './chatlist.js';
import { displayName } from './users.js';

const BASE_TITLE = 'CISOFT Messenger';

// Сообщение для программы-обёртки (WebView2); в браузере просто пропускаем
export function postToHost(msg) {
  try { window.chrome?.webview?.postMessage(msg); } catch { /* нет обёртки */ }
}

let lastTotal = -1;
export function setUnreadTotal(n) {
  document.title = n > 0 ? `(${n}) ${BASE_TITLE}` : BASE_TITLE;
  if (n !== lastTotal) { lastTotal = n; postToHost({ type: 'unread', count: n }); }
}

export function notificationsSupported() { return 'Notification' in window; }
export function notificationPermission() { return notificationsSupported() ? Notification.permission : 'unsupported'; }

export async function requestDesktopNotifications() {
  if (!notificationsSupported()) return 'unsupported';
  let p = Notification.permission;
  if (p === 'default') p = await Notification.requestPermission();
  setPref('desktop', p === 'granted');
  return p;
}

function showDesktop(title, body, chatId, tag) {
  if (!getPref('desktop') || notificationPermission() !== 'granted') return;
  try {
    const n = new Notification(title, { body, tag: tag || chatId, icon: 'icons/icon-192.png', badge: 'icons/icon-192.png' });
    n.onclick = () => { window.focus(); if (chatId) emit('open-chat', chatId); n.close(); };
  } catch { /* например, на Android нужны уведомления через service worker */ }
}

export function onNewMessage(chat) {
  const lm = chat.lastMessage;
  const visibleHere = !document.hidden && state.activeChatId === chat.id;
  if (visibleHere) return;
  if (getPref('sound') && !state.inCall) playMessageSound();
  const title = chatTitle(chat);
  const body = (chat.type === 'group' && lm.type !== 'system' ? displayName(lm.senderId) + ': ' : '') + (lm.text || 'Новое сообщение');
  if (document.hidden) {
    showDesktop(title, body, chat.id);
    postToHost({ type: 'notify', title, body, chatId: chat.id });
  }
}

export function notifyIncomingCall(name, video, chatId) {
  const title = video ? 'Входящий видеозвонок' : 'Входящий аудиозвонок';
  if (document.hidden) showDesktop(title, name, chatId, 'call');
  postToHost({ type: 'call', title, body: name, chatId });
}

// Команды от программ-обёрток (Windows/Android): открыть чат по клику на уведомление
window.__cisoftOpenChat = (id) => { if (id) emit('open-chat', id); };
try {
  window.chrome?.webview?.addEventListener('message', (e) => {
    const d = e.data;
    if (d && d.type === 'openChat') window.__cisoftOpenChat(d.chatId);
  });
} catch { /* обычный браузер */ }

// Кнопка «назад» на Android: закрыть окно/просмотр, затем вернуться из чата к списку
window.addEventListener('cisoft-back', (e) => {
  if (document.querySelector('.modal, .viewer, .incoming, .call-screen')) {
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    e.preventDefault();
    return;
  }
  const back = document.querySelector('.chat-head .only-mobile');
  if (back && back.offsetParent) { back.click(); e.preventDefault(); }
});