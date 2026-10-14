// Построение DOM одного сообщения (без innerHTML с пользовательским текстом).
import { el, avatar } from './dom.js';
import { icon } from './icons.js';
import { state } from './state.js';
import { splitLinks, timeHM, colorFor, fmtDuration, isDataImage } from './util.js';
import { displayName, cachedUser } from './users.js';

// Текст с кликабельными ссылками
export function richText(text) {
  const frag = document.createDocumentFragment();
  for (const part of splitLinks(String(text || ''))) {
    if (part.url) frag.append(el('a', { href: part.url, target: '_blank', rel: 'noopener noreferrer nofollow', text: part.text }));
    else frag.append(document.createTextNode(part.text));
  }
  return frag;
}

function meta(msg, read, over = false) {
  const m = el('span', { class: 'meta' + (over ? ' over' : '') });
  if (msg.edited && !msg.deleted) m.append(el('span', { text: 'изм.' }));
  m.append(el('span', { text: timeHM(msg.at) }));
  if (msg.senderId === state.uid && !msg.deleted) {
    if (msg.pending) m.append(icon('clock', 13));
    else m.append(icon(read ? 'checks' : 'check', 15, read ? 'read' : ''));
    m.title = msg.pending ? 'Отправляется…' : read ? 'Прочитано' : 'Отправлено';
  }
  return m;
}

export function callInfo(msg) {
  const c = msg.call || {};
  const outgoing = c.callerId === state.uid;
  const kind = c.video ? 'видеозвонок' : 'звонок';
  let title, sub = '', missed = false;
  if (c.status === 'ended') {
    title = (outgoing ? 'Исходящий ' : 'Входящий ') + kind;
    sub = fmtDuration(c.duration);
  } else if (c.status === 'declined') {
    title = outgoing ? 'Звонок отклонён' : 'Отклонённый ' + kind;
    missed = !outgoing;
  } else if (c.status === 'failed') {
    title = 'Не удалось соединиться';
  } else if (outgoing) {
    title = c.status === 'cancelled' ? 'Отменённый ' + kind : 'Нет ответа';
  } else {
    title = 'Пропущенный ' + kind; missed = true;
  }
  return { title: title.charAt(0).toUpperCase() + title.slice(1), sub, missed, video: !!c.video };
}

export function buildMessage(msg, o) {
  const mine = msg.senderId === state.uid;

  if (msg.type === 'system') {
    return el('div', { class: 'msg system', dataset: { id: msg.id } }, el('span', { class: 'sys-pill', text: msg.text }));
  }

  const row = el('div', { class: 'msg' + (mine ? ' mine' : '') + (o.cont ? ' cont' : ''), dataset: { id: msg.id } });
  if (o.isGroup && !mine) {
    const slot = el('div', { class: 'avatar-slot' });
    if (o.lastInRun) slot.append(avatar(cachedUser(msg.senderId) || { uid: msg.senderId, name: displayName(msg.senderId) }, 34));
    row.append(slot);
  }

  const b = el('div', { class: 'bubble' });
  row.append(b);

  if (msg.type === 'call') {
    const info = callInfo(msg);
    b.append(el('div', { class: 'call-bubble' + (info.missed ? ' missed' : '') },
      el('span', { class: 'ci' }, icon(info.video ? 'video' : 'phone', 18)),
      el('div', {}, el('div', { class: 'ct', text: info.title }), el('div', { class: 'cs', text: info.sub || timeHM(msg.at) }))));
    if (info.sub) b.append(meta(msg, o.read));
    return row;
  }

  if (o.isGroup && !mine && !o.cont) {
    b.append(el('div', { class: 'sender', text: displayName(msg.senderId), style: { color: colorFor(msg.senderId) } }));
  }

  if (msg.deleted) {
    b.classList.add('deleted');
    b.append(el('span', { text: 'Сообщение удалено' }), meta(msg, o.read));
    return row;
  }

  if (msg.replyTo && msg.replyTo.id) {
    b.append(el('div', {
      class: 'reply-quote', title: 'Перейти к сообщению',
      onclick: (e) => { e.stopPropagation(); o.onJump?.(msg.replyTo.id); }
    }, el('b', { text: msg.replyTo.senderName || '' }), String(msg.replyTo.text || '').slice(0, 200)));
  }

  if (msg.type === 'image') {
    b.classList.add('image');
    if (isDataImage(msg.preview)) {
      const img = el('img', { class: 'photo', src: msg.preview, alt: 'Фото', loading: 'lazy', onclick: () => o.onOpenImage?.(msg) });
      if (msg.width && msg.height) img.style.aspectRatio = `${msg.width} / ${msg.height}`;
      b.append(img);
    }
    if (msg.text) {
      b.append(el('div', { class: 'caption' }, richText(msg.text), meta(msg, o.read)));
    } else {
      b.append(meta(msg, o.read, true));
    }
    return row;
  }

  b.append(richText(msg.text), meta(msg, o.read));
  return row;
}

// Подпись для сравнения: если не изменилась — элемент не пересобираем
export function signature(msg, o) {
  return [msg.text, msg.edited, msg.deleted, msg.pending, o.read, o.cont, o.lastInRun, !!msg.preview,
    msg.type === 'call' ? JSON.stringify(msg.call) : '', msg.replyTo?.id || '', msg.at,
    o.isGroup ? displayName(msg.senderId) : ''].join('|');
}
