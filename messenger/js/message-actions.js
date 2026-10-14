// Контекстное меню сообщения: ответить, копировать, изменить, удалить.
import { el, toast, confirmDialog, errText } from './dom.js';
import { icon } from './icons.js';
import { state } from './state.js';
import { deleteMessage } from './send.js';

let openMenu = null;
export function closeMenu() { openMenu?.remove(); openMenu = null; }
document.addEventListener('mousedown', (e) => { if (openMenu && !openMenu.contains(e.target)) closeMenu(); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMenu(); });
window.addEventListener('resize', closeMenu);

export function showMenu(x, y, items) {
  closeMenu();
  const m = el('div', { class: 'ctx-menu', role: 'menu' },
    items.map((it) => el('button', {
      type: 'button', role: 'menuitem', class: it.danger ? 'danger' : '',
      onclick: () => { closeMenu(); it.action(); }
    }, icon(it.icon, 18), it.label)));
  document.body.append(m);
  const r = m.getBoundingClientRect();
  m.style.left = Math.max(8, Math.min(x, innerWidth - r.width - 8)) + 'px';
  m.style.top = Math.max(8, Math.min(y, innerHeight - r.height - 8)) + 'px';
  openMenu = m;
  m.querySelector('button')?.focus();
}

export async function copyText(text) {
  try { await navigator.clipboard.writeText(text); }
  catch {
    const ta = el('textarea', { style: { position: 'fixed', opacity: '0' } });
    ta.value = text; document.body.append(ta); ta.select();
    try { document.execCommand('copy'); } catch { /* ignore */ }
    ta.remove();
  }
  toast('Текст скопирован');
}

function itemsFor(msg, chatId, handlers) {
  if (msg.type === 'system' || msg.deleted) return [];
  const mine = msg.senderId === state.uid;
  const items = [];
  if (msg.type !== 'call') items.push({ icon: 'reply', label: 'Ответить', action: () => handlers.onReply?.(msg) });
  if (msg.text) items.push({ icon: 'copy', label: 'Копировать текст', action: () => copyText(msg.text) });
  if (mine && msg.type === 'text' && !msg.pending) items.push({ icon: 'edit', label: 'Изменить', action: () => handlers.onEdit?.(msg) });
  if (mine && (msg.type === 'text' || msg.type === 'image') && !msg.pending) {
    items.push({
      icon: 'trash', label: 'Удалить', danger: true, action: async () => {
        if (!await confirmDialog('Удалить сообщение?', 'Сообщение будет удалено у всех участников чата.', 'Удалить', true)) return;
        try { await deleteMessage(chatId, msg); } catch (e) { toast(errText(e), 'error'); }
      }
    });
  }
  return items;
}

export function attachMessageMenu(node, msg, chatId, handlers) {
  const bubble = node.querySelector('.bubble');
  if (!bubble) return;
  const open = (x, y) => {
    const items = itemsFor(msg, chatId, handlers);
    if (items.length) showMenu(x, y, items);
  };
  bubble.addEventListener('contextmenu', (e) => {
    if (e.target.closest('a') && !e.shiftKey) return; // у ссылок — обычное меню браузера
    e.preventDefault();
    open(e.clientX, e.clientY);
  });
  // Долгое нажатие на сенсорных экранах
  let timer = null, sx = 0, sy = 0;
  bubble.addEventListener('touchstart', (e) => {
    const t = e.touches[0]; sx = t.clientX; sy = t.clientY;
    timer = setTimeout(() => { timer = null; open(sx, sy); }, 550);
  }, { passive: true });
  const cancel = () => { clearTimeout(timer); timer = null; };
  bubble.addEventListener('touchmove', (e) => {
    const t = e.touches[0];
    if (Math.abs(t.clientX - sx) > 10 || Math.abs(t.clientY - sy) > 10) cancel();
  }, { passive: true });
  bubble.addEventListener('touchend', cancel);
  bubble.addEventListener('dblclick', (e) => {
    if (msg.type === 'system' || msg.deleted || msg.type === 'call') return;
    if (window.getSelection()?.toString()) window.getSelection().removeAllRanges();
    e.preventDefault();
    handlers.onReply?.(msg);
  });
}
