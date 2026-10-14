// Настройки: профиль, звук, уведомления, тема, выход.
import { auth } from './fb.js';
import { signOut } from './fa.js';
import { el, modal, avatar, toast, errText, confirmDialog } from './dom.js';
import { icon } from './icons.js';
import { state, getPref, setPref } from './state.js';
import { updateMyProfile } from './users.js';
import { compressAvatar } from './image.js';
import { requestDesktopNotifications, notificationPermission } from './notify.js';
import { playMessageSound } from './sound.js';

export function applyTheme() {
  const t = getPref('theme') === 'light' ? 'light' : 'dark';
  document.documentElement.dataset.theme = t;
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', t === 'light' ? '#ffffff' : '#111217');
}

function switchRow(title, hint, checked, onchange) {
  const input = el('input', { type: 'checkbox', checked, 'aria-label': title });
  input.addEventListener('change', () => onchange(input.checked, input));
  return el('div', { class: 'switch-row' },
    el('div', { class: 'sr-text' }, title, hint ? el('small', { text: hint }) : null),
    el('label', { class: 'switch' }, input, el('span')));
}

export function openSettings() {
  const me = state.me || {};
  const m = modal('Настройки');
  const avaWrap = el('div', { class: 'ava-wrap' });
  const fileInput = el('input', { type: 'file', accept: 'image/*', hidden: true });
  const drawAva = () => avaWrap.replaceChildren(avatar({ ...state.me, uid: state.uid }, 72),
    el('button', { class: 'ava-edit', type: 'button', title: 'Сменить фото', 'aria-label': 'Сменить фото', onclick: () => fileInput.click() }, icon('camera', 16)));
  drawAva();
  fileInput.addEventListener('change', async () => {
    const f = fileInput.files[0]; fileInput.value = '';
    if (!f) return;
    try {
      const data = await compressAvatar(f);
      await updateMyProfile({ avatar: data });
      state.me = { ...state.me, avatar: data }; drawAva(); toast('Фото профиля обновлено', 'ok');
    } catch (e) { toast(errText(e), 'error'); }
  });

  const nameInput = el('input', { class: 'input', value: me.name || '', maxlength: 60, 'aria-label': 'Имя для показа' });
  const saveName = el('button', { class: 'btn', type: 'button', text: 'Сохранить' });
  saveName.addEventListener('click', async () => {
    const v = nameInput.value.trim();
    if (!v) { toast('Имя не может быть пустым', 'error'); return; }
    try { await updateMyProfile({ name: v.slice(0, 60) }); toast('Имя сохранено', 'ok'); } catch (e) { toast(errText(e), 'error'); }
  });

  m.body.append(
    el('div', { class: 'settings-profile' }, avaWrap,
      el('div', { style: { minWidth: '0' } },
        el('div', { style: { fontWeight: '600', fontSize: '17px' }, text: me.name || '' }),
        el('div', { class: 'muted', text: '@' + (me.username || '') }),
        el('div', { class: 'muted small', text: auth.currentUser?.email || '' }))),
    fileInput,
    el('div', { class: 'field' }, el('label', { text: 'Имя для показа' }),
      el('div', { style: { display: 'flex', gap: '8px' } }, nameInput, saveName)),
    me.avatar ? el('button', { class: 'link-btn small', type: 'button', text: 'Убрать фото профиля', style: { marginBottom: '10px' },
      onclick: async (e) => {
        try { await updateMyProfile({ avatar: null }); state.me = { ...state.me, avatar: null }; drawAva(); e.target.remove(); }
        catch (er) { toast(errText(er), 'error'); }
      } }) : '',
    switchRow('Звук уведомлений', 'Короткий сигнал при новом сообщении', getPref('sound'), (v) => { setPref('sound', v); if (v) playMessageSound(); }),
    switchRow('Уведомления на рабочем столе', desktopHint(), getPref('desktop') && notificationPermission() === 'granted', async (v, input) => {
      if (!v) { setPref('desktop', false); return; }
      const p = await requestDesktopNotifications();
      if (p !== 'granted') {
        input.checked = false;
        toast(p === 'denied' ? 'Уведомления запрещены в браузере. Разрешите их в настройках сайта (значок замка).' : 'Браузер не поддерживает уведомления.', 'error');
      } else toast('Уведомления включены', 'ok');
    }),
    switchRow('Светлая тема', 'По умолчанию — тёмная тема CISOFT', getPref('theme') === 'light', (v) => { setPref('theme', v ? 'light' : 'dark'); applyTheme(); }),
    el('div', { class: 'row-end' },
      el('button', { class: 'btn danger', type: 'button', onclick: async () => {
        if (!await confirmDialog('Выйти из аккаунта?', 'Чтобы снова пользоваться мессенджером, нужно будет войти по email и паролю.', 'Выйти', true)) return;
        m.close();
        await signOut(auth);
      } }, icon('logout', 18), 'Выйти')));
}

function desktopHint() {
  const p = notificationPermission();
  if (p === 'unsupported') return 'Не поддерживается этим браузером';
  if (p === 'denied') return 'Запрещено в настройках браузера';
  return 'Когда вкладка свернута';
}
