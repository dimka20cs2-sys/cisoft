// Экраны входа, регистрации, сброса пароля и завершения профиля.
import { auth, configMissing } from './fb.js';
import {
  signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail, signOut
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
  card(tabs('login'), form);
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
  card(tabs('register'), form);
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
