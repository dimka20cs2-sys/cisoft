// Правая панель: открытый чат (шапка, лента, поле ввода).
import { state, emit, on } from './state.js';
import { el, clear, iconBtn, toast } from './dom.js';
import { icon } from './icons.js';
import { toMs, presenceText, isOnline, plural } from './util.js';
import { cachedUser, watchUser, displayName } from './users.js';
import { chatTitle, chatAvatar, partnerOf, typingUsers } from './chatlist.js';
import { createMessageList } from './messages.js';
import { createComposer } from './composer.js';
import { markRead } from './send.js';
import { startCall } from './calls.js';
import { openGroupInfo, openUserInfo } from './groups.js';

let cur = null; // { chatId, list, composer, head, timer }
const isMobile = () => matchMedia('(max-width: 759px)').matches;

export function currentChatId() { return cur?.chatId || null; }

export function openChat(chatId) {
  if (cur?.chatId === chatId) { if (isMobile()) showPane(true); cur.composer.focus(); return; }
  closeChat(false);
  state.activeChatId = chatId;
  const pane = clear(document.getElementById('chat-pane'));
  const head = el('header', { class: 'chat-head' });
  const scroller = el('div', { class: 'messages' });
  pane.append(head, scroller);

  cur = { chatId, head, pane };
  cur.list = createMessageList(chatId, scroller, {
    onReply: (m) => cur?.composer.reply(m),
    onEdit: (m) => cur?.composer.edit(m),
    onNewVisible: () => maybeMarkRead(),
    onError: (e) => { if (e?.code === 'permission-denied') { toast('Нет доступа к этому чату', 'error'); closeChat(); } }
  });
  cur.composer = createComposer(chatId, pane, cur.list);
  pane.append(cur.composer.node);

  // группе — загрузить профили участников
  const chat = state.chats.get(chatId);
  (chat?.members || []).forEach((u) => watchUser(u));

  renderHead();
  cur.timer = setInterval(renderHead, 2000); // «печатает…» и «в сети» без лишних запросов
  if (isMobile()) { showPane(true); history.pushState({ chat: chatId }, ''); }
  emit('active-chat', chatId);
  maybeMarkRead(true);
  if (!isMobile()) cur.composer.focus();
}

export function closeChat(updateUi = true) {
  if (!cur) return;
  clearInterval(cur.timer);
  cur.list.destroy(); cur.composer.destroy();
  cur = null;
  state.activeChatId = null;
  if (updateUi) {
    const pane = clear(document.getElementById('chat-pane'));
    pane.append(el('div', { class: 'empty-pane' },
      el('div', { class: 'empty-ico' }), el('p', { text: 'Выберите чат слева или найдите собеседника по @username' })));
    showPane(false);
    emit('active-chat', null);
  }
}

function showPane(v) { document.getElementById('app').classList.toggle('show-chat', v); }

function goBack() {
  if (history.state?.chat) history.back(); else closeChat();
}
window.addEventListener('popstate', () => { if (cur && isMobile()) closeChat(); });

function renderHead() {
  if (!cur) return;
  const chat = state.chats.get(cur.chatId);
  const pu = chat?.type === 'direct' ? cachedUser(partnerOf(chat)) : null;
  const key = !chat ? 'none' : [chat.title, chat.type, (chat.members || []).length, typingUsers(chat).join(), pu?.name,
    pu ? presenceText(pu.lastSeenMs) : '', pu?.avatar?.length, chatTitle(chat),
    chat.type === 'group' ? (chat.members || []).map((u) => isOnline(cachedUser(u)?.lastSeenMs)).join() : ''].join('|');
  if (key === cur.headKey) return;
  cur.headKey = key;
  const head = clear(cur.head);
  head.append(iconBtn('back', 'Назад', goBack, 'only-mobile'));
  if (!chat) { head.append(el('div', { class: 'ch-info' }, el('div', { class: 'ch-title', text: 'Загрузка…' }))); return; }

  const sub = el('div', { class: 'ch-sub' });
  const typing = typingUsers(chat);
  if (chat.type === 'direct') {
    const p = cachedUser(partnerOf(chat));
    if (typing.length) { sub.textContent = 'печатает…'; sub.classList.add('typing'); }
    else if (p) { sub.textContent = presenceText(p.lastSeenMs); if (isOnline(p.lastSeenMs)) sub.classList.add('online'); }
  } else {
    const n = (chat.members || []).length;
    const online = (chat.members || []).filter((u) => u !== state.uid && isOnline(cachedUser(u)?.lastSeenMs)).length;
    if (typing.length) {
      sub.textContent = typing.length === 1 ? `${displayName(typing[0])} печатает…` : `${typing.length} печатают…`;
      sub.classList.add('typing');
    } else {
      sub.textContent = `${n} ${plural(n, 'участник', 'участника', 'участников')}` + (online ? `, ${online} в сети` : '');
    }
  }
  const info = el('button', {
    class: 'ch-info', type: 'button', title: chat.type === 'group' ? 'Информация о группе' : 'Профиль',
    onclick: () => chat.type === 'group' ? openGroupInfo(chat.id) : openUserInfo(partnerOf(chat))
  }, chatAvatar(chat, 42), el('div', { class: 'ch-text' }, el('div', { class: 'ch-title', text: chatTitle(chat) }), sub));
  head.append(info);
  if (chat.type === 'direct') {
    const partner = partnerOf(chat);
    head.append(
      iconBtn('phone', 'Аудиозвонок', () => startCall(chat.id, partner, false), 'accent call-audio'),
      iconBtn('video', 'Видеозвонок', () => startCall(chat.id, partner, true), 'accent call-video'));
  } else {
    head.append(iconBtn('info', 'Информация о группе', () => openGroupInfo(chat.id)));
  }
}

let lastMark = 0, markTimer = null;
function maybeMarkRead(force = false) {
  if (!cur || document.hidden) return;
  const chat = state.chats.get(cur.chatId);
  if (!chat) return;
  const lm = chat.lastMessage;
  const myRead = toMs(chat.lastRead?.[state.uid]);
  const need = (chat.unread?.[state.uid] || 0) > 0 || (lm && lm.senderId !== state.uid && toMs(lm.at) > myRead);
  if (!need) return;
  const wait = Math.max(0, 1500 - (Date.now() - lastMark));
  clearTimeout(markTimer);
  const id = cur.chatId;
  markTimer = setTimeout(() => { lastMark = Date.now(); markRead(id); }, wait);
}

on('chats', () => {
  if (cur) (state.chats.get(cur.chatId)?.members || []).forEach((u) => watchUser(u));
  renderHead(); maybeMarkRead();
});
on('user', () => renderHead());
on('open-chat', (id) => openChat(id));
on('chat-removed', (id) => {
  if (cur?.chatId === id) { closeChat(); toast('Вы больше не участник этого чата'); }
});
document.addEventListener('visibilitychange', () => { if (!document.hidden) maybeMarkRead(); });
window.addEventListener('focus', () => maybeMarkRead());
