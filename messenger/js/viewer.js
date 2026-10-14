// Просмотр фото на весь экран.
import { el, iconBtn, toast } from './dom.js';
import { icon } from './icons.js';
import { isDataImage } from './util.js';
import { loadMedia } from './send.js';

export function openViewer(chatId, msg) {
  const img = el('img', { alt: 'Фото', src: isDataImage(msg.preview) ? msg.preview : '' });
  let full = null;
  const close = () => { root.remove(); document.removeEventListener('keydown', onKey); };
  const onKey = (e) => { if (e.key === 'Escape') close(); };
  const dl = el('a', { class: 'icon-btn v-dl', title: 'Сохранить', 'aria-label': 'Сохранить', download: 'cisoft-photo.jpg', href: '#',
    onclick: (e) => { if (!full) { e.preventDefault(); toast('Фото ещё загружается…'); } } }, icon('download'));
  const root = el('div', { class: 'viewer', role: 'dialog', 'aria-label': 'Просмотр фото' },
    img, dl, iconBtn('x', 'Закрыть', close, 'v-close'));
  root.addEventListener('click', (e) => { if (e.target === root) close(); });
  document.addEventListener('keydown', onKey);
  document.body.append(root);
  if (msg.mediaId) {
    loadMedia(chatId, msg.mediaId).then((data) => {
      if (isDataImage(data)) { full = data; img.src = data; dl.href = data; }
      else if (!data) toast('Фото больше недоступно', 'error');
    }).catch(() => toast('Не удалось загрузить фото', 'error'));
  }
}
