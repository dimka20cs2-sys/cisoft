// Поле ввода: текст, эмодзи, ответ/редактирование, «печатает…», фото.
import { el, iconBtn, toast, errText } from './dom.js';
import { icon } from './icons.js';
import { sendText, editMessage, setTyping, MAX_TEXT } from './send.js';
import { displayName } from './users.js';
import { throttle } from './util.js';
import { state } from './state.js';
import { createEmojiPanel } from './emoji.js';
import { pickAndSendPhotos } from './photo-send.js';

export function createComposer(chatId, pane, list) {
  let mode = null; // { kind: 'reply' | 'edit', msg }
  let emoji = null;

  const ctx = el('div', { class: 'compose-ctx', hidden: true });
  const ta = el('textarea', { rows: 1, placeholder: 'Сообщение', 'aria-label': 'Сообщение', maxlength: MAX_TEXT + 500 });
  const counter = el('div', { class: 'char-count', hidden: true });
  const fileInput = el('input', { type: 'file', accept: 'image/*', multiple: true, hidden: true });
  const sendBtn = el('button', { class: 'icon-btn send-btn', type: 'button', title: 'Отправить (Enter)', 'aria-label': 'Отправить', onclick: () => submit() }, icon('send'));
  const emojiBtn = iconBtn('smile', 'Эмодзи', () => toggleEmoji());
  emojiBtn.dataset.emojiToggle = '1';
  const attachBtn = iconBtn('image', 'Отправить фото', () => fileInput.click());
  const inner = el('div', { class: 'composer-inner' }, ctx,
    el('div', { class: 'compose-row' }, attachBtn, emojiBtn, ta, sendBtn), counter, fileInput);
  const node = el('div', { class: 'composer' }, inner);

  const typing = throttle(() => setTyping(chatId), 3000);

  function autosize() {
    ta.style.height = 'auto';
    ta.style.height = Math.min(ta.scrollHeight + 2, 160) + 'px';
    const len = ta.value.length;
    counter.hidden = len < MAX_TEXT - 500;
    counter.textContent = `${len} / ${MAX_TEXT}`;
    counter.classList.toggle('over', len > MAX_TEXT);
    sendBtn.disabled = !ta.value.trim() || len > MAX_TEXT;
  }

  function setMode(m) {
    mode = m;
    ctx.replaceChildren();
    ctx.hidden = !m;
    if (!m) return;
    const isEdit = m.kind === 'edit';
    const preview = m.msg.type === 'image' ? '📷 Фото' + (m.msg.text ? ': ' + m.msg.text : '') : m.msg.text;
    ctx.append(
      el('span', { class: 'ctx-ico' }, icon(isEdit ? 'edit' : 'reply', 18)),
      el('div', { class: 'ctx-text' },
        el('b', { text: isEdit ? 'Редактирование' : 'Ответ ' + displayName(m.msg.senderId) }),
        el('span', { text: preview })),
      iconBtn('x', 'Отменить', () => { if (mode?.kind === 'edit') ta.value = ''; setMode(null); autosize(); }));
  }

  async function submit() {
    const text = ta.value.replace(/\s+$/, '');
    if (!text.trim()) return;
    if (text.length > MAX_TEXT) { toast(`Сообщение длиннее ${MAX_TEXT} символов`, 'error'); return; }
    const m = mode;
    ta.value = ''; setMode(null); autosize();
    try {
      if (m?.kind === 'edit') {
        if (text !== m.msg.text) await editMessage(chatId, m.msg.id, text);
      } else {
        const reply = m?.kind === 'reply' ? replyPayload(m.msg) : null;
        const p = sendText(chatId, text, reply);
        list.scrollToBottom(false);
        await p;
      }
    } catch (e) {
      toast(errText(e), 'error');
      if (!ta.value) { ta.value = text; autosize(); }
    }
  }

  ta.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey && !e.isComposing) { e.preventDefault(); submit(); }
    else if (e.key === 'Escape' && mode) { if (mode.kind === 'edit') ta.value = ''; setMode(null); autosize(); }
    else if (e.key === 'ArrowUp' && !ta.value && !mode) { // ↑ — изменить своё последнее
      const last = list.lastMessage();
      if (last && last.senderId === state.uid && last.type === 'text' && !last.deleted) { e.preventDefault(); startEdit(last); }
    }
  });
  ta.addEventListener('input', () => { autosize(); if (ta.value.trim() && mode?.kind !== 'edit') typing(); });

  // Вставка изображения из буфера обмена
  ta.addEventListener('paste', (e) => {
    const files = [...(e.clipboardData?.files || [])].filter((f) => f.type.startsWith('image/'));
    if (files.length) { e.preventDefault(); pickAndSendPhotos(chatId, files, takeReply()); }
  });
  fileInput.addEventListener('change', () => {
    const files = [...fileInput.files];
    fileInput.value = '';
    if (files.length) pickAndSendPhotos(chatId, files, takeReply());
  });

  // Перетаскивание файлов на чат
  let dragDepth = 0, dropZone = null;
  const hasFiles = (e) => [...(e.dataTransfer?.types || [])].includes('Files');
  const onEnter = (e) => {
    if (!hasFiles(e)) return;
    e.preventDefault(); dragDepth++;
    if (!dropZone) { dropZone = el('div', { class: 'drop-zone', text: 'Отпустите, чтобы отправить фото' }); pane.append(dropZone); }
  };
  const onOver = (e) => { if (hasFiles(e)) e.preventDefault(); };
  const onLeave = () => { if (--dragDepth <= 0) { dragDepth = 0; dropZone?.remove(); dropZone = null; } };
  const onDrop = (e) => {
    if (!hasFiles(e)) return;
    e.preventDefault(); dragDepth = 0; dropZone?.remove(); dropZone = null;
    const files = [...e.dataTransfer.files].filter((f) => f.type.startsWith('image/'));
    if (files.length) pickAndSendPhotos(chatId, files, takeReply());
    else toast('Можно отправлять только изображения', 'error');
  };
  pane.addEventListener('dragenter', onEnter);
  pane.addEventListener('dragover', onOver);
  pane.addEventListener('dragleave', onLeave);
  pane.addEventListener('drop', onDrop);

  function toggleEmoji() {
    if (emoji) { emoji.close(); return; }
    emoji = createEmojiPanel((e) => {
      const s = ta.selectionStart ?? ta.value.length, en = ta.selectionEnd ?? s;
      ta.value = ta.value.slice(0, s) + e + ta.value.slice(en);
      ta.focus(); ta.selectionStart = ta.selectionEnd = s + e.length;
      autosize();
    }, () => { emoji = null; });
    node.append(emoji.panel);
  }
  node.style.position = 'relative';

  function takeReply() {
    if (mode?.kind !== 'reply') return null;
    const r = replyPayload(mode.msg); setMode(null); return r;
  }
  function startEdit(msg) { setMode({ kind: 'edit', msg }); ta.value = msg.text || ''; autosize(); ta.focus(); }

  autosize();
  return {
    node,
    reply(msg) { setMode({ kind: 'reply', msg }); ta.focus(); },
    edit: startEdit,
    focus() { ta.focus(); },
    destroy() {
      emoji?.close();
      pane.removeEventListener('dragenter', onEnter); pane.removeEventListener('dragover', onOver);
      pane.removeEventListener('dragleave', onLeave); pane.removeEventListener('drop', onDrop);
    }
  };
}

export function replyPayload(msg) {
  const t = msg.type === 'image' ? '📷 Фото' + (msg.text ? ': ' + msg.text : '') : (msg.text || '');
  return { id: msg.id, text: t.slice(0, 200), senderName: displayName(msg.senderId).slice(0, 60) };
}
