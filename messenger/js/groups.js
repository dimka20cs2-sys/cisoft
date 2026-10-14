// Информация о группе (участники, добавление/удаление, выход) и профиль собеседника.
import { el, clear, modal, avatar, toast, errText, confirmDialog } from './dom.js';
import { icon } from './icons.js';
import { state, on } from './state.js';
import { cachedUser, watchUser } from './users.js';
import { addMember, removeMember, leaveGroup, renameGroup } from './send.js';
import { presenceText, isOnline, plural } from './util.js';
import { userRow, userSearch } from './new-chat.js';

export function openGroupInfo(chatId) {
  const chat0 = state.chats.get(chatId);
  if (!chat0) return;
  const m = modal('Группа', { wide: true, onclose: () => off() });
  const content = el('div');
  m.body.append(content);
  let adding = false;

  const draw = (force = false) => {
    const chat = state.chats.get(chatId);
    if (!chat) { m.close(); return; }
    const isOwner = chat.ownerId === state.uid;
    const keepFocus = document.activeElement?.closest?.('.add-member') ? document.activeElement : null;
    if (keepFocus && force !== true) return; // не мешаем вводу при поиске участника
    clear(content);
    const members = chat.members || [];
    members.forEach((u) => watchUser(u));

    const titleRow = el('div', { class: 'settings-profile' }, avatar({ uid: chat.id, title: chat.title }, 64, { group: true }),
      el('div', { style: { flex: '1', minWidth: '0' } },
        el('div', { style: { fontSize: '18px', fontWeight: '600' }, text: chat.title }),
        el('div', { class: 'muted small', text: `${members.length} ${plural(members.length, 'участник', 'участника', 'участников')}` })));
    content.append(titleRow);

    if (isOwner) {
      const t = el('input', { class: 'input', value: chat.title, maxlength: 80, 'aria-label': 'Название группы' });
      const save = el('button', { class: 'btn', type: 'button', text: 'Переименовать', onclick: async () => {
        if (!t.value.trim() || t.value.trim() === chat.title) return;
        try { await renameGroup(chatId, t.value); toast('Название изменено', 'ok'); } catch (e) { toast(errText(e), 'error'); }
      } });
      content.append(el('div', { style: { display: 'flex', gap: '8px', marginBottom: '10px' } }, t, save));
    }

    content.append(el('div', { class: 'list-title', text: 'Участники' }));
    const box = el('div', { class: 'list-box' });
    const sorted = [...members].sort((a, b) => (b === chat.ownerId) - (a === chat.ownerId));
    for (const uid of sorted) {
      const u = cachedUser(uid) || { uid, name: 'Загрузка…', username: '…' };
      const extra = el('span', { style: { display: 'flex', gap: '6px', alignItems: 'center' } });
      if (uid === chat.ownerId) extra.append(el('span', { class: 'tag', text: 'создатель' }));
      if (uid === state.uid) extra.append(el('span', { class: 'tag', text: 'вы' }));
      if (isOwner && uid !== state.uid) {
        extra.append(el('span', {
          class: 'icon-btn', role: 'button', tabindex: '0', title: 'Удалить из группы', 'aria-label': 'Удалить ' + u.name,
          onclick: async (e) => {
            e.stopPropagation();
            if (!await confirmDialog('Удалить участника?', `${u.name} больше не будет видеть сообщения группы.`, 'Удалить', true)) return;
            try { await removeMember(chatId, uid); } catch (er) { toast(errText(er), 'error'); }
          }
        }, icon('trash', 18)));
      }
      box.append(userRow(u, { extra, onclick: () => { if (uid !== state.uid) openUserInfo(uid); } }));
    }
    content.append(box);

    if (isOwner && members.length < 50) {
      if (!adding) {
        content.append(el('button', { class: 'btn', type: 'button', style: { marginTop: '8px' }, onclick: () => { adding = true; draw(); } },
          icon('userPlus', 18), 'Добавить участника'));
      } else {
        const s = userSearch({
          exclude: members,
          onPick: async (u) => {
            try { await addMember(chatId, u.uid); adding = false; toast(`${u.name} добавлен(а)`, 'ok'); draw(true); }
            catch (e) { toast(errText(e), 'error'); }
          }
        });
        content.append(el('div', { class: 'add-member', style: { marginTop: '8px' } }, el('div', { class: 'list-title', text: 'Добавить участника' }), s.node));
        setTimeout(() => s.input.focus());
      }
    }

    content.append(el('div', { class: 'row-end' },
      el('button', { class: 'btn danger', type: 'button', onclick: async () => {
        if (!await confirmDialog('Выйти из группы?', 'Вы перестанете получать сообщения этой группы.', 'Выйти', true)) return;
        try { await leaveGroup(chatId); m.close(); } catch (e) { toast(errText(e), 'error'); }
      } }, icon('logout', 18), 'Выйти из группы')));
  };
  const offChats = on('chats', () => draw());
  const offUser = on('user', () => { if (!adding) draw(); });
  const off = () => { offChats(); offUser(); };
  draw();
}

export async function openUserInfo(uid) {
  if (!uid) return;
  const u = cachedUser(uid) || await watchUser(uid);
  if (!u) { toast('Профиль не найден', 'error'); return; }
  const m = modal('Профиль');
  m.body.append(el('div', { style: { textAlign: 'center', padding: '6px 0 4px' } },
    el('div', { style: { display: 'flex', justifyContent: 'center', marginBottom: '12px' } }, avatar(u, 96, { online: isOnline(u.lastSeenMs) })),
    el('div', { style: { fontSize: '20px', fontWeight: '600' }, text: u.name }),
    el('div', { class: 'muted', text: '@' + u.username }),
    el('div', { class: 'small', style: { marginTop: '6px', color: isOnline(u.lastSeenMs) ? 'var(--accent)' : 'var(--muted)' }, text: presenceText(u.lastSeenMs) })));
}
