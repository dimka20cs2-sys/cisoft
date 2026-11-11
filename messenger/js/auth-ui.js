// Экраны входа, регистрации, сброса пароля и завершения профиля.
import { auth, configMissing } from './fb.js';
import {
  signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail, signOut,
  GoogleAuthProvider, signInWithPopup, signInWithRedirect
} from './fa.js';
import { el, clear, errText } from './dom.js';
import { claimProfile } from './users.js';
import { USERNAME_RE } from './util.js';

const root = () => document.getElementById('auth');

function card(...content) {
  const r = clear(root());
  const warn = configMissing
    ? el('div', { class: 'config-warn', text: 'Firebase ещё не настроен: вставьте конфиг проекта в messenger/config.js.' })
    : null;
  r.append(el('div', { class: 'auth-card' },
    el('div', { class: 'auth-brand' },
      el('img', { src: 'icons/icon-192.png', alt: '' }),
      el('div', {}, el('h1', { text: 'Pingo' }), el('div', { class: 'muted', text: 'Сообщения и звонки' }))),
    warn, ...content));
  r.hidden = false;
}

function field(label, attrs) {
  const input = el('input', { class: 'input', ...attrs });
  const id = 'f-' + attrs.name;
  input.id = id;
  return { input, node: el('div', { class: 'field' }, el('label', { for: id, text: label }), input) };
}

function tabs(active) {
  return el('div', { class: 'auth-tabs' },
    el('button', { type: 'button', class: active === 'login' ? 'on' : '', text: 'Вход', onclick: () => showAuth('login') }),
    el('button', { type: 'button', class: active === 'register' ? 'on' : '', text: 'Регистрация', onclick: () => showAuth('register') }));
}

// Вход через Google: всплывающее окно, а если браузер его заблокировал — переход на страницу Google и обратно.
// Новому пользователю после входа app.js покажет экран выбора @username (showSetup) с именем из Google.
function googleButton(err) {
  const icon = '<svg viewBox="0 0 48 48" width="18" height="18" aria-hidden="true"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"/><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/><path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z"/><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z"/></svg>';
  const btn = el('button', { type: 'button', class: 'btn block google-btn' });
  btn.innerHTML = icon + '<span>Войти через Google</span>';
  btn.addEventListener('click', async () => {
    if (err) err.textContent = '';
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    btn.disabled = true;
    try { await signInWithPopup(auth, provider); }
    catch (ex) {
      if (ex && (ex.code === 'auth/popup-blocked' || ex.code === 'auth/operation-not-supported-in-this-environment')) {
        try { await signInWithRedirect(auth, provider); return; } catch (ex2) { ex = ex2; }
      }
      if (ex && (ex.code === 'auth/popup-closed-by-user' || ex.code === 'auth/cancelled-popup-request')) return;
      if (err) err.textContent = ex && ex.code === 'auth/unauthorized-domain'
        ? 'Вход через Google ещё не включён для этого сайта (нужно добавить домен в Firebase).'
        : errText(ex);
    } finally { btn.disabled = false; }
  });
  return btn;
}

function orLine() { return el('div', { class: 'auth-or' }, el('span', { text: 'или' })); }

async function busy(btn, fn) {
  const txt = btn.textContent;
  btn.disabled = true; btn.textContent = 'Подождите…';
  try { await fn(); } finally { btn.disabled = false; btn.textContent = txt; }
}

export function showAuth(mode = 'login') {
  if (mode === 'register') return registerForm();
  if (mode === 'reset') return resetForm();
  const email = field('Email', { name: 'email', type: 'email', autocomplete: 'email', required: true });
  const pass = field('Пароль', { name: 'password', type: 'password', autocomplete: 'current-password', required: true });
  const err = el('div', { class: 'err-text' });
  const btn = el('button', { class: 'btn primary block', type: 'submit', text: 'Войти' });
  const form = el('form', { novalidate: true }, email.node, pass.node, err, btn,
    el('div', { class: 'auth-foot' },
      el('button', { type: 'button', class: 'link-btn', text: 'Забыли пароль?', onclick: () => showAuth('reset') }),
      el('button', { type: 'button', class: 'link-btn', text: 'Создать аккаунт', onclick: () => showAuth('register') })));
  form.addEventListener('submit', (e) => {
    e.preventDefault(); err.textContent = '';
    if (!email.input.value.trim() || !pass.input.value) { err.textContent = 'Введите email и пароль.'; return; }
    busy(btn, async () => {
      try { await signInWithEmailAndPassword(auth, email.input.value.trim(), pass.input.value); }
      catch (ex) { err.textContent = errText(ex); }
    });
  });
  card(tabs('login'), googleButton(err), orLine(), form);
  email.input.focus();
}

function registerForm() {
  const name = field('Имя для показа', { name: 'name', autocomplete: 'name', maxlength: 60, placeholder: 'Например, Анна Петрова' });
  const user = field('Имя пользователя (@username)', { name: 'username', autocomplete: 'username', maxlength: 20, placeholder: 'anna_p', spellcheck: false });
  const email = field('Email', { name: 'email', type: 'email', autocomplete: 'email' });
  const pass = field('Пароль (минимум 6 символов)', { name: 'password', type: 'password', autocomplete: 'new-password' });
  const err = el('div', { class: 'err-text' });
  const btn = el('button', { class: 'btn primary block', type: 'submit', text: 'Зарегистрироваться' });
  const form = el('form', { novalidate: true }, name.node, user.node, email.node, pass.node, err, btn);
  form.addEventListener('submit', (e) => {
    e.preventDefault(); err.textContent = '';
    const un = user.input.value.trim().replace(/^@/, '');
    if (!name.input.value.trim()) { err.textContent = 'Укажите имя для показа.'; return; }
    if (!USERNAME_RE.test(un)) { err.textContent = 'Имя пользователя: 3–20 символов — латиница, цифры и _.'; return; }
    if (pass.input.value.length < 6) { err.textContent = 'Пароль должен быть не короче 6 символов.'; return; }
    busy(btn, async () => {
      // Профиль создаётся в app.js после входа (pendingProfile), чтобы корректно пережить ошибки.
      pendingProfile = { name: name.input.value.trim(), username: un };
      try { await createUserWithEmailAndPassword(auth, email.input.value.trim(), pass.input.value); }
      catch (ex) { pendingProfile = null; err.textContent = errText(ex); }
    });
  });
  card(tabs('register'), googleButton(err), orLine(), form);
  name.input.focus();
}

function resetForm() {
  const email = field('Email, указанный при регистрации', { name: 'email', type: 'email', autocomplete: 'email' });
  const msg = el('div', { class: 'err-text' });
  const btn = el('button', { class: 'btn primary block', type: 'submit', text: 'Отправить ссылку' });
  const form = el('form', { novalidate: true },
    el('p', { class: 'muted small', text: 'Мы отправим письмо со ссылкой для создания нового пароля.' }),
    email.node, msg, btn,
    el('div', { class: 'auth-foot' }, el('button', { type: 'button', class: 'link-btn', text: '← Назад ко входу', onclick: () => showAuth('login') })));
  form.addEventListener('submit', (e) => {
    e.preventDefault(); msg.className = 'err-text'; msg.textContent = '';
    if (!email.input.value.trim()) { msg.textContent = 'Введите email.'; return; }
    busy(btn, async () => {
      try {
        await sendPasswordResetEmail(auth, email.input.value.trim());
        msg.className = 'ok-text';
        msg.textContent = 'Письмо отправлено. Проверьте почту (и папку «Спам»).';
      } catch (ex) { msg.textContent = errText(ex); }
    });
  });
  card(el('h2', { text: 'Сброс пароля', style: { fontSize: '18px', marginBottom: '8px' } }), form);
  email.input.focus();
}

export let pendingProfile = null;
export function takePendingProfile() { const p = pendingProfile; pendingProfile = null; return p; }

// Завершение регистрации: профиля ещё нет (или имя оказалось занято)
export function showSetup(uid, preset = {}, errorMsg = '', onDone) {
  const name = field('Имя для показа', { name: 'name', maxlength: 60, value: preset.name || '' });
  const user = field('Имя пользователя (@username)', { name: 'username', maxlength: 20, value: preset.username || '', spellcheck: false });
  const err = el('div', { class: 'err-text', text: errorMsg });
  const btn = el('button', { class: 'btn primary block', type: 'submit', text: 'Готово' });
  const form = el('form', { novalidate: true },
    el('p', { class: 'muted small', text: 'Осталось выбрать, как вас будут видеть и находить другие.' }),
    name.node, user.node, err, btn,
    el('div', { class: 'auth-foot' }, el('button', { type: 'button', class: 'link-btn', text: 'Выйти', onclick: () => signOut(auth) })));
  form.addEventListener('submit', (e) => {
    e.preventDefault(); err.textContent = '';
    busy(btn, async () => {
      try { await claimProfile(uid, name.input.value, user.input.value.trim().replace(/^@/, '')); onDone?.(); }
      catch (ex) { err.textContent = errText(ex); }
    });
  });
  card(el('h2', { text: 'Завершение регистрации', style: { fontSize: '18px', marginBottom: '8px' } }), form);
  (preset.name ? user : name).input.focus();
}

export function hideAuth() { root().hidden = true; clear(root()); }
