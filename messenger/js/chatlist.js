// Список чатов слева: подписка, сортировка, непрочитанные, индикаторы.
import { db } from './fb.js';
import { collection, query, where, onSnapshot } from './fs.js';
import { state, emit, on } from './state.js';
import { el, clear, avatar } from './dom.js';
import { icon } from './icons.js';
import { toMs, shortTime, isOnline, serverNow } from './util.js';
import { watchUser, cachedUser, displayName } from './users.js';
import { onNewMessage, setUnreadTotal } from './notify.js';

let unsub = null;
let firstLoad = true;
let filterText = '';
const lastSeenMsgIds = new Map();

export function partnerOf(chat) {
  return chat?.type === 'direct' ? (chat.members || []).find((u) => u !== state.uid) || state.uid : null;
}
export function chatTitle(chat) {
  if (!chat) return '';
  if (chat.type === 'group') return chat.title || 'Группа';
  const p = cachedUser(partnerOf(chat));
  return p ? p.name : 'Загрузка…';
}
export function chatAvatar(chat, size, withOnline = true) {
  if (chat.type === 'group') return avatar({ uid: chat.id, title: chat.title }, size, { group: true });
  const p = cachedUser(partnerOf(chat)) || { uid: partnerOf(chat), name: '?' };
  return avatar(p, size, { online: withOnline && isOnline(p.lastSeenMs) });
}
export function chatTime(chat) { return toMs(chat.lastMessage?.at) || toMs(chat.updatedAt) || toMs(chat.createdAt); }

export function typingUsers(chat) {
  const now = serverNow();
  return Object.entries(chat.typing || {})
    .filter(([uid, t]) => uid !== state.uid && now - toMs(t) < 6000 && (chat.members || []).includes(uid))
    .map(([uid]) => uid);
}

// Прочитано ли сообщение (время ms) кем-то из остальных участников
export function readByOthers(chat, atMs) {
  if (!atMs) return false;
  return Object.entries(chat.lastRead || {}).some(([uid, t]) => uid !== state.uid && toMs(t) >= atMs);
}

export function startChatList() {
  stopChatList();
  firstLoad = true;
  const q = query(collection(db, 'chats'), where('members', 'array-contains', state.uid));
  unsub = onSnapshot(q, (snap) => {
    const seen = new Set();
    for (const d of snap.docs) {
      const chat = { id: d.id, ...d.data({ serverTimestamps: 'estimate' }) };
      seen.add(d.id);
      state.chats.set(d.id, chat);
      const p = partnerOf(chat);
      if (p) watchUser(p);
      if (chat.type === 'group') { // имена для «Вера: …» и «… печатает»
        if (chat.lastMessage?.senderId) watchUser(chat.lastMessage.senderId);
        Object.keys(chat.typing || {}).forEach((u) => watchUser(u));
      }
      const lm = chat.lastMessage;
      if (lm?.id && lastSeenMsgIds.get(d.id) !== lm.id) {
        if (!firstLoad && lm.senderId !== state.uid && !d.metadata.hasPendingWrites) onNewMessage(chat);
        lastSeenMsgIds.set(d.id, lm.id);
      }
    }
    for (const id of [...state.chats.keys()]) if (!seen.has(id)) { state.chats.delete(id); emit('chat-removed', id); }
    firstLoad = false;
    render();
    emit('chats');
  }, (e) => console.error('chats', e));
}

export function stopChatList() {
  unsub?.(); unsub = null;
  state.chats.clear(); lastSeenMsgIds.clear();
}

export function setChatFilter(t) { filterText = t.trim().toLowerCase(); render(); }

let raf = 0;
export function render() {
  cancelAnimationFrame(raf);
  raf = requestAnimationFrame(doRender);
}
on('user', render);
on('active-chat', render);
setInterval(render, 30000); // обновить «в сети» и время
let hadTyping = false;
setInterval(() => { // «печатает…» гаснет само через несколько секунд
  const any = [...state.chats.values()].some((c) => typingUsers(c).length);
  if (any || hadTyping) render();
  hadTyping = any;
}, 2000);

function doRender() {
  const list = document.getElementById('chat-list');
  if (!list) return;
  const chats = [...state.chats.values()].sort((a, b) => chatTime(b) - chatTime(a));
  let total = 0;
  for (const c of chats) total += c.id === state.activeChatId && !document.hidden ? 0 : (c.unread?.[state.uid] || 0);
  setUnreadTotal(total);
  clear(list);
  const shown = filterText ? chats.filter((c) => chatTitle(c).toLowerCase().includes(filterText.replace(/^@/, ''))) : chats;
  if (!shown.length) {
    list.append(el('div', { class: 'list-empty' }, filterText ? 'Чаты не найдены' :
      el('div', {}, el('p', { text: 'Здесь пока пусто.' }), el('p', { class: 'small', text: 'Найдите собеседника по @username в поиске сверху или нажмите ✎, чтобы начать чат или создать группу.' }))));
    return;
  }
  for (const c of shown) list.append(chatItem(c));
}

function chatItem(chat) {
  const unread = chat.id === state.activeChatId ? 0 : (chat.unread?.[state.uid] || 0);
  const lm = chat.lastMessage;
  const typing = typingUsers(chat);
  const last = el('div', { class: 'ci-last' });
  if (typing.length) {
    last.append(el('span', { class: 'typing', text: chat.type === 'group' ? `${displayName(typing[0])} печатает…` : 'печатает…' }));
  } else if (lm) {
    if (lm.senderId === state.uid && lm.type !== 'system') last.append(el('b', { text: 'Вы: ' }));
    else if (chat.type === 'group' && lm.type !== 'system') last.append(el('b', { text: displayName(lm.senderId).split(' ')[0] + ': ' }));
    last.append(lm.text || '');
  } else {
    last.append(chat.type === 'group' ? 'Группа создана' : 'Нет сообщений');
  }
  let status = null;
  if (lm && lm.senderId === state.uid && lm.type !== 'system' && !typing.length) {
    status = el('span', { class: 'ci-status' }, icon(readByOthers(chat, toMs(lm.at)) ? 'checks' : 'check', 16));
  }
  return el('button', {
    class: 'chat-item' + (chat.id === state.activeChatId ? ' active' : ''), type: 'button', role: 'listitem',
    dataset: { chatId: chat.id }, onclick: () => emit('open-chat', chat.id)
  },
  chatAvatar(chat, 50),
  el('div', { class: 'ci-main' },
    el('div', { class: 'ci-row' }, el('span', { class: 'ci-name', text: chatTitle(chat) }), status, el('span', { class: 'ci-time', text: shortTime(chatTime(chat)) })),
    el('div', { class: 'ci-row', style: { marginTop: '2px' } }, last, unread ? el('span', { class: 'badge', text: unread > 99 ? '99+' : String(unread) }) : null)));
}
