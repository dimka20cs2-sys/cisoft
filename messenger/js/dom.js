// Безопасное построение DOM: только createElement/textContent.
import { icon } from './icons.js';
import { colorFor, initials, isDataImage } from './util.js';

export function el(tag, props = {}, ...children) {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(props || {})) {
    if (v == null || v === false) continue;
    if (k === 'class') node.className = v;
    else if (k === 'text') node.textContent = v;
    else if (k === 'style' && typeof v === 'object') Object.assign(node.style, v);
    else if (k.startsWith('on') && typeof v === 'function') node.addEventListener(k.slice(2), v);
    else if (k === 'dataset') Object.assign(node.dataset, v);
    else if (k in node && typeof v !== 'string') node[k] = v;
    else node.setAttribute(k, v === true ? '' : v);
  }
  append(node, children);
  return node;
}

function append(node, children) {
  for (const c of children.flat()) {
    if (c == null || c === false) continue;
    node.append(c instanceof Node ? c : document.createTextNode(String(c)));
  }
}

export function clear(node) { while (node.firstChild) node.firstChild.remove(); return node; }
export const $ = (sel, root = document) => root.querySelector(sel);

export function iconBtn(name, title, onclick, cls = '') {
  return el('button', { class: 'icon-btn ' + cls, type: 'button', title, 'aria-label': title, onclick }, icon(name));
}

// Аватар: картинка из профиля или цветной кружок с инициалами.
export function avatar(user, size = 44, opts = {}) {
  const uid = user?.uid || user?.id || '';
  const name = user?.title || user?.name || '?';
  const wrap = el('div', { class: 'avatar', style: { width: size + 'px', height: size + 'px', fontSize: Math.round(size * 0.38) + 'px' } });
  if (user?.avatar && isDataImage(user.avatar)) {
    wrap.append(el('img', { src: user.avatar, alt: '' }));
  } else if (opts.group) {
    wrap.style.background = colorFor(uid);
    wrap.append(icon('users', Math.round(size * 0.45)));
  } else {
    wrap.style.background = user?.color || colorFor(uid);
    wrap.textContent = initials(name);
  }
  if (opts.online) wrap.append(el('span', { class: 'online-dot' }));
  return wrap;
}

// Всплывающее уведомление внизу экрана
let toastTimer;
export function toast(text, kind = '') {
  let t = $('#toast');
  if (!t) { t = el('div', { id: 'toast', role: 'status', 'aria-live': 'polite' }); document.body.append(t); }
  t.className = 'show ' + kind;
  t.textContent = text;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { t.className = ''; }, 3800);
}

// Модальное окно. Возвращает { root, body, close }.
export function modal(title, { wide = false, onclose } = {}) {
  const root = el('div', { class: 'modal-backdrop' });
  const close = () => { root.remove(); document.removeEventListener('keydown', onKey); onclose?.(); };
  const onKey = (e) => { if (e.key === 'Escape') close(); };
  const body = el('div', { class: 'modal-body' });
  const box = el('div', { class: 'modal' + (wide ? ' wide' : ''), role: 'dialog', 'aria-modal': 'true', 'aria-label': title },
    el('div', { class: 'modal-head' }, el('h2', { text: title }), iconBtn('x', 'Закрыть', close)),
    body);
  root.append(box);
  root.addEventListener('mousedown', (e) => { if (e.target === root) close(); });
  document.addEventListener('keydown', onKey);
  document.body.append(root);
  return { root, body, close };
}

export function confirmDialog(title, text, okText = 'Да', danger = false) {
  return new Promise((resolve) => {
    let done = false;
    const m = modal(title, { onclose: () => { if (!done) resolve(false); } });
    const finish = (v) => { done = true; resolve(v); m.close(); };
    m.body.append(
      el('p', { class: 'muted', text }),
      el('div', { class: 'row-end' },
        el('button', { class: 'btn ghost', type: 'button', text: 'Отмена', onclick: () => finish(false) }),
        el('button', { class: 'btn ' + (danger ? 'danger' : 'primary'), type: 'button', text: okText, onclick: () => finish(true) })));
  });
}

// Понятный текст ошибки для пользователя
export function errText(e) {
  const code = e?.code || '';
  const map = {
    'auth/invalid-email': 'Неверный формат email.',
    'auth/email-already-in-use': 'Этот email уже зарегистрирован. Попробуйте войти.',
    'auth/weak-password': 'Слишком простой пароль — нужно минимум 6 символов.',
    'auth/invalid-credential': 'Неверный email или пароль.',
    'auth/wrong-password': 'Неверный email или пароль.',
    'auth/user-not-found': 'Пользователь с таким email не найден.',
    'auth/too-many-requests': 'Слишком много попыток. Подождите немного и попробуйте снова.',
    'auth/network-request-failed': 'Нет соединения с сервером. Проверьте интернет.',
    'permission-denied': 'Недостаточно прав для этого действия.',
    'unavailable': 'Сервер недоступен. Проверьте интернет.',
    'resource-exhausted': 'Превышен лимит сервера. Попробуйте позже.'
  };
  return map[code] || e?.userMessage || 'Что-то пошло не так. Попробуйте ещё раз.';
}
