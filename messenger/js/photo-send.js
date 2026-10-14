// Окно подтверждения отправки фото: сжатие, превью, подпись.
import { el, modal, toast, errText } from './dom.js';
import { compressPhoto } from './image.js';
import { sendImage, MAX_TEXT } from './send.js';

const MAX_FILES = 10;

export async function pickAndSendPhotos(chatId, files, reply) {
  files = files.slice(0, MAX_FILES);
  const m = modal(files.length > 1 ? `Отправить фото (${files.length})` : 'Отправить фото', { wide: true });
  const grid = el('div', { style: { display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '12px', justifyContent: 'center' } });
  const status = el('div', { class: 'muted small', text: 'Сжимаем изображение…' });
  const caption = el('input', { class: 'input', placeholder: 'Подпись (необязательно)', maxlength: MAX_TEXT, 'aria-label': 'Подпись' });
  const sendBtn = el('button', { class: 'btn primary', type: 'button', text: 'Отправить', disabled: true });
  m.body.append(grid, status, el('div', { class: 'field', style: { marginTop: '10px' } }, caption),
    el('div', { class: 'row-end' }, el('button', { class: 'btn ghost', type: 'button', text: 'Отмена', onclick: () => m.close() }), sendBtn));

  const ready = [];
  for (const f of files) {
    try {
      const c = await compressPhoto(f);
      ready.push(c);
      grid.append(el('img', {
        src: c.preview, alt: '',
        style: { maxWidth: files.length > 1 ? '140px' : '100%', maxHeight: files.length > 1 ? '140px' : '360px', borderRadius: '12px', objectFit: 'cover' }
      }));
    } catch (e) { toast(errText(e), 'error'); }
  }
  if (!m.root.isConnected) return;
  if (!ready.length) { m.close(); return; }
  const kb = Math.round(ready.reduce((s, c) => s + c.data.length * 0.75, 0) / 1024);
  status.textContent = `Готово к отправке: ${ready.length} фото, ≈ ${kb} КБ`;
  sendBtn.disabled = false;
  caption.focus();

  const go = async () => {
    sendBtn.disabled = true; sendBtn.textContent = 'Отправка…';
    try {
      for (let i = 0; i < ready.length; i++) {
        await sendImage(chatId, ready[i], i === 0 ? caption.value.trim() : '', i === 0 ? reply : null);
      }
      m.close();
    } catch (e) {
      toast(errText(e), 'error');
      sendBtn.disabled = false; sendBtn.textContent = 'Отправить';
    }
  };
  sendBtn.addEventListener('click', go);
  caption.addEventListener('keydown', (e) => { if (e.key === 'Enter' && !sendBtn.disabled) { e.preventDefault(); go(); } });
}
