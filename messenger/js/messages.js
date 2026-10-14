// Лента сообщений: живая подписка на последние 50, подгрузка старых, отрисовка.
import { db } from './fb.js';
import { collection, query, orderBy, limit, onSnapshot, getDocs, startAfter } from './fs.js';
import { state, on } from './state.js';
import { el, clear } from './dom.js';
import { icon } from './icons.js';
import { toMs, dayKey, dayLabel } from './util.js';
import { readByOthers } from './chatlist.js';
import { buildMessage, signature } from './message-render.js';
import { attachMessageMenu } from './message-actions.js';
import { openViewer } from './viewer.js';
import { watchUser } from './users.js';

const PAGE = 50;
const RUN_GAP = 5 * 60 * 1000;

export function createMessageList(chatId, scroller, handlers) {
  const inner = el('div', { class: 'msg-inner' });
  const loader = el('div', { class: 'load-more', hidden: true }, el('span', { class: 'spinner' }), 'Загрузка…');
  inner.append(loader);
  scroller.append(inner);
  const toBottom = el('button', { class: 'to-bottom', type: 'button', title: 'К последним сообщениям', hidden: true,
    onclick: () => scrollToBottom(true) }, icon('arrowDown'));
  scroller.parentElement.append(toBottom);

  const msgs = new Map();   // id → сообщение
  const nodes = new Map();  // id → { sig, node }
  let gotFirst = false, oldestSnap = null, hasMore = false, loading = false, firstLoad = true, newBelow = 0, destroyed = false;

  const toMsg = (d) => {
    const data = d.data({ serverTimestamps: 'estimate' });
    return { id: d.id, ...data, at: toMs(data.createdAt) || Date.now(), pending: d.metadata.hasPendingWrites };
  };

  const unsub = onSnapshot(query(collection(db, 'chats', chatId, 'messages'), orderBy('createdAt', 'desc'), limit(PAGE)),
    { includeMetadataChanges: true }, (snap) => {
      let added = 0, mineAdded = false;
      for (const ch of snap.docChanges({ includeMetadataChanges: true })) {
        if (ch.type === 'removed') continue; // выпало из окна последних 50 — оставляем у себя
        const m = toMsg(ch.doc);
        if (ch.type === 'added' && !msgs.has(m.id)) { added++; if (m.senderId === state.uid) mineAdded = true; }
        msgs.set(m.id, m);
      }
      if (firstLoad) {
        hasMore = snap.size >= PAGE;
        oldestSnap = snap.docs[snap.docs.length - 1] || null;
      }
      const wasBottom = nearBottom(); gotFirst = true;
      render();
      if (firstLoad || mineAdded || (wasBottom && added)) scrollToBottom(false);
      else if (added) { newBelow += added; updateToBottom(); }
      if (added || firstLoad) handlers.onNewVisible?.();
      firstLoad = false;
    }, (e) => { console.error('messages', e); handlers.onError?.(e); });

  async function loadOlder() {
    if (loading || !hasMore || !oldestSnap || destroyed) return;
    loading = true; loader.hidden = false;
    try {
      const snap = await getDocs(query(collection(db, 'chats', chatId, 'messages'), orderBy('createdAt', 'desc'), startAfter(oldestSnap), limit(PAGE)));
      hasMore = snap.size >= PAGE;
      if (snap.size) oldestSnap = snap.docs[snap.docs.length - 1];
      for (const d of snap.docs) if (!msgs.has(d.id)) msgs.set(d.id, toMsg(d));
      const prevH = scroller.scrollHeight, prevTop = scroller.scrollTop;
      loader.hidden = true;
      render();
      scroller.scrollTop = prevTop + (scroller.scrollHeight - prevH);
    } catch (e) { console.error(e); } finally { loading = false; loader.hidden = true; }
  }

  function nearBottom() { return scroller.scrollHeight - scroller.scrollTop - scroller.clientHeight < 120; }
  function scrollToBottom(smooth) {
    newBelow = 0; updateToBottom();
    scroller.scrollTo({ top: scroller.scrollHeight, behavior: smooth ? 'smooth' : 'auto' });
  }
  function updateToBottom() {
    const show = !nearBottom();
    toBottom.hidden = !show;
    toBottom.querySelector('.badge')?.remove();
    if (show && newBelow) toBottom.append(el('span', { class: 'badge', text: String(newBelow) }));
    if (!show) newBelow = 0;
  }

  const onScroll = () => {
    if (scroller.scrollTop < 300) loadOlder();
    updateToBottom();
    if (nearBottom()) handlers.onNewVisible?.();
  };
  scroller.addEventListener('scroll', onScroll, { passive: true });

  function jumpTo(id) {
    const n = nodes.get(id)?.node;
    if (!n) return;
    n.scrollIntoView({ block: 'center', behavior: 'smooth' });
    const b = n.querySelector('.bubble');
    b?.classList.remove('highlight'); void b?.offsetWidth; b?.classList.add('highlight');
  }

  function render() {
    if (destroyed) return;
    const chat = state.chats.get(chatId);
    const isGroup = chat?.type === 'group';
    const list = [...msgs.values()].sort((a, b) => a.at - b.at || (a.id < b.id ? -1 : 1));
    const frag = document.createDocumentFragment();
    let prevDay = null;
    for (let i = 0; i < list.length; i++) {
      const m = list[i], prev = list[i - 1], next = list[i + 1];
      if (isGroup) watchUser(m.senderId); // имя/аватар автора (в т.ч. вышедшего из группы)
      const dk = dayKey(m.at);
      if (dk !== prevDay) { frag.append(el('div', { class: 'day-sep' }, el('span', { text: dayLabel(m.at) }))); prevDay = dk; }
      const linked = (a, b) => a && b && a.senderId === b.senderId && a.type !== 'system' && b.type !== 'system'
        && a.type !== 'call' && b.type !== 'call' && dayKey(a.at) === dayKey(b.at) && Math.abs(b.at - a.at) < RUN_GAP;
      const o = {
        isGroup, cont: linked(prev, m), lastInRun: !linked(m, next),
        read: m.senderId === state.uid && chat ? readByOthers(chat, m.at) : false,
        onJump: jumpTo, onOpenImage: (msg) => openViewer(chatId, msg)
      };
      const sig = signature(m, o);
      let entry = nodes.get(m.id);
      if (!entry || entry.sig !== sig) {
        const node = buildMessage(m, o);
        attachMessageMenu(node, m, chatId, handlers);
        entry = { sig, node };
        nodes.set(m.id, entry);
      }
      frag.append(entry.node);
    }
    const keepTop = scroller.scrollTop;
    clear(inner);
    inner.append(loader);
    if (!list.length && gotFirst) inner.append(el('div', { class: 'list-empty', text: 'Сообщений пока нет. Напишите первым!' }));
    inner.append(frag);
    scroller.scrollTop = keepTop; // перестроение не должно сбивать прокрутку
  }

  const offUser = on('user', () => render());
  const offChats = on('chats', () => { const wasBottom = nearBottom(); render(); if (wasBottom) scroller.scrollTop = scroller.scrollHeight; });

  return {
    destroy() { destroyed = true; unsub(); offUser(); offChats(); scroller.removeEventListener('scroll', onScroll); toBottom.remove(); },
    scrollToBottom,
    getMessage: (id) => msgs.get(id),
    lastMessage: () => [...msgs.values()].sort((a, b) => b.at - a.at)[0] || null,
    jumpTo
  };
}
