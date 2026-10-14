// Поиск людей по @username, новый личный чат, создание группы.
import { el, clear, modal, avatar, toast, errText } from './dom.js';
import { icon } from './icons.js';
import { emit } from './state.js';
import { searchUsers } from './users.js';
import { openDirect, createGroup } from './send.js';
import { presenceText } from './util.js';

export function userRow(u, { onclick, selected = false, extra = null } = {}) {
  return el('button', { class: 'user-row' + (selected ? ' selected' : ''), type: 'button', onclick, dataset: { uid: u.uid } },
    avatar(u, 42),
    el('div', { class: 'ur-main' },
      el('div', { class: 'ur-name', text: u.name }),
      el('div', { class: 'ur-sub', text: '@' + u.username + ' · ' + presenceText(u.lastSeenMs) })),
    extra, selected ? icon('check', 20, 'accent') : null);
}

// Поле поиска + список результатов
export function userSearch({ onPick, isSelected = () => false, exclude = [], placeholder = 'Введите @username' }) {
  const input = el('input', { class: 'input', type: 'search', placeholder, autocomplete: 'off', spellcheck: false, 'aria-label': 'Поиск по имени пользователя' });
  const box = el('div', { class: 'list-box' });
  let seq = 0, last = [];
  const draw = () => {
    clear(box);
    const list = last.filter((u) => !exclude.includes(u.uid));
    if (!input.value.trim()) box.append(el('div', { class: 'list-empty', text: 'Начните вводить имя пользователя, например @anna' }));
    else if (!list.length) box.append(el('div', { class: 'list-empty', text: 'Никого не нашли' }));
    for (const u of list) box.append(userRow(u, { selected: isSelected(u.uid), onclick: () => { onPick(u); draw(); } }));
  };
  let t = null;
  input.addEventListener('input', () => {
    clearTimeout(t);
    t = setTimeout(async () => {
      const my = ++seq;
      try { const r = await searchUsers(input.value); if (my === seq) { last = r; draw(); } }
      catch (e) { if (my === seq) { last = []; draw(); toast(errText(e), 'error'); } }
    }, 250);
  });
  draw();
  const reset = () => { input.value = ''; last = []; draw(); input.focus(); };
  return { node: el('div', {}, input, box), input, redraw: draw, reset };
}

export async function startDirectWith(uid) {
  try { const id = await openDirect(uid); emit('open-chat', id); return id; }
  catch (e) { toast(errText(e), 'error'); return null; }
}

export function openNewChat() {
  const m = modal('Новый чат');
  const s = userSearch({ onPick: async (u) => { m.close(); await startDirectWith(u.uid); } });
  m.body.append(
    el('button', { class: 'user-row', type: 'button', onclick: () => { m.close(); openCreateGroup(); } },
      el('div', { class: 'avatar', style: { width: '42px', height: '42px', background: 'var(--second)', color: 'var(--accent)' } }, icon('users', 20)),
      el('div', { class: 'ur-main' }, el('div', { class: 'ur-name', text: 'Создать группу' }), el('div', { class: 'ur-sub', text: 'До 50 участников' }))),
    el('div', { class: 'list-title', text: 'Найти человека' }),
    s.node);
  s.input.focus();
}

export function openCreateGroup() {
  const m = modal('Новая группа', { wide: true });
  const selected = new Map();
  const title = el('input', { class: 'input', placeholder: 'Название группы', maxlength: 80, 'aria-label': 'Название группы' });
  const chips = el('div', { class: 'chips' });
  const err = el('div', { class: 'err-text' });
  const createBtn = el('button', { class: 'btn primary', type: 'button', text: 'Создать' });
  const drawChips = () => {
    clear(chips);
    if (!selected.size) chips.append(el('span', { class: 'muted small', text: 'Участники не выбраны' }));
    for (const u of selected.values()) {
      chips.append(el('span', { class: 'chip' }, u.name,
        el('button', { type: 'button', title: 'Убрать', 'aria-label': 'Убрать ' + u.name, onclick: () => { selected.delete(u.uid); drawChips(); s.redraw(); } }, icon('x', 14))));
    }
  };
  const s = userSearch({
    isSelected: (uid) => selected.has(uid),
    onPick: (u) => {
      if (selected.has(u.uid)) selected.delete(u.uid);
      else if (selected.size >= 49) { toast('В группе может быть не больше 50 участников'); return; }
      else { selected.set(u.uid, u); s.reset(); }
      drawChips();
    }
  });
  drawChips();
  m.body.append(el('div', { class: 'field' }, title), el('div', { class: 'list-title', text: 'Участники' }), chips, s.node, err,
    el('div', { class: 'row-end' }, el('button', { class: 'btn ghost', type: 'button', text: 'Отмена', onclick: () => m.close() }), createBtn));
  createBtn.addEventListener('click', async () => {
    err.textContent = '';
    if (!title.value.trim()) { err.textContent = 'Введите название группы.'; title.focus(); return; }
    if (!selected.size) { err.textContent = 'Добавьте хотя бы одного участника.'; return; }
    createBtn.disabled = true; createBtn.textContent = 'Создаём…';
    try {
      const id = await createGroup(title.value, [...selected.keys()]);
      m.close();
      emit('open-chat', id);
    } catch (e) {
      err.textContent = errText(e);
      createBtn.disabled = false; createBtn.textContent = 'Создать';
    }
  });
  title.focus();
}
