// Окно входа: вкладки «Вход / Регистрация / Забыли пароль» и «Завершение регистрации» (если профиля ещё нет).
import { acc, errText, signedIn } from './acc-core.js';

const CI = window.CI, esc = CI.esc;
let cur = null; // { root, mode, onKey }

function field(name, label, type, attrs) {
  return '<div class="af"><label for="af-' + name + '">' + label + '</label>' +
    '<input class="ain" id="af-' + name + '" name="' + name + '" type="' + type + '" ' + (attrs || '') + '></div>';
}
const val = (name) => (cur.root.querySelector('[name="' + name + '"]') || {}).value || '';

const TABS = [['login', 'Вход'], ['register', 'Регистрация'], ['reset', 'Забыли пароль']];

function formHtml(mode, preset) {
  const p = preset || {};
  if (mode === 'register') {
    return field('name', 'Имя для показа', 'text', 'autocomplete="name" maxlength="60" placeholder="Например, Анна Петрова"') +
      field('username', 'Имя пользователя (@username)', 'text', 'autocomplete="username" maxlength="21" spellcheck="false" placeholder="anna_p"') +
      '<div class="af-hint">3–20 символов: латиница, цифры и _. По нему вас найдут в мессенджере.</div>' +
      field('email', 'Email', 'email', 'autocomplete="email"') +
      field('password', 'Пароль (минимум 6 символов)', 'password', 'autocomplete="new-password"') +
      '<div class="am-err" role="alert"></div><button class="am-btn" type="submit">Зарегистрироваться</button>';
  }
  if (mode === 'reset') {
    return '<p class="am-p">Отправим письмо со ссылкой для создания нового пароля.</p>' +
      field('email', 'Email, указанный при регистрации', 'email', 'autocomplete="email"') +
      '<div class="am-err" role="alert"></div><button class="am-btn" type="submit">Отправить ссылку</button>';
  }
  if (mode === 'setup') {
    return '<p class="am-p">Осталось выбрать, как вас будут видеть и находить другие.</p>' +
      field('name', 'Имя для показа', 'text', 'maxlength="60" value="' + esc(p.name || '') + '"') +
      field('username', 'Имя пользователя (@username)', 'text', 'maxlength="21" spellcheck="false" value="' + esc(p.username || '') + '"') +
      '<div class="am-err" role="alert">' + esc(p.error || '') + '</div><button class="am-btn" type="submit">Готово</button>' +
      '<div class="am-foot"><button type="button" class="am-link" data-act="logout">Выйти</button></div>';
  }
  return field('email', 'Email', 'email', 'autocomplete="email"') +
    field('password', 'Пароль', 'password', 'autocomplete="current-password"') +
    '<div class="am-err" role="alert"></div><button class="am-btn" type="submit">Войти</button>' +
    '<div class="am-foot"><button type="button" class="am-link" data-go="reset">Забыли пароль?</button>' +
    '<button type="button" class="am-link" data-go="register">Создать аккаунт</button></div>';
}

function render(mode, reason, preset) {
  cur.mode = mode;
  const body = cur.root.querySelector('.am-body');
  const tabs = mode === 'setup' ? '<h3 class="am-h">Завершение регистрации</h3>' :
    '<div class="am-tabs" role="tablist">' + TABS.map((t) =>
      '<button type="button" role="tab" aria-selected="' + (t[0] === mode) + '" class="' + (t[0] === mode ? 'on' : '') + '" data-go="' + t[0] + '">' + t[1] + '</button>').join('') + '</div>';
  body.innerHTML = tabs + (reason ? '<div class="am-why">' + esc(reason) + '</div>' : '') +
    '<form class="am-form" novalidate>' + formHtml(mode, preset) + '</form>';
  body.querySelectorAll('[data-go]').forEach((b) => { b.onclick = () => render(b.dataset.go, reason); });
  const lo = body.querySelector('[data-act="logout"]');
  if (lo) lo.onclick = () => { acc.logout(); closeAuth(); };
  const form = body.querySelector('form');
  form.onsubmit = (e) => { e.preventDefault(); submit(form); };
  const first = form.querySelector('input');
  // автофокус — только если пользователь ещё не начал вводить в другое поле
  if (first) setTimeout(() => { if (!form.contains(document.activeElement)) first.focus(); }, 30);
}

async function submit(form) {
  const err = form.querySelector('.am-err'), btn = form.querySelector('.am-btn');
  const mode = cur.mode, label = btn.textContent;
  err.className = 'am-err'; err.textContent = '';
  btn.disabled = true; btn.textContent = 'Подождите…';
  try {
    if (mode === 'login') {
      await acc.signIn(val('email'), val('password'));
      closeAuth(); CI.toast('Вы вошли в аккаунт');
    } else if (mode === 'register') {
      await acc.register({ name: val('name'), username: val('username'), email: val('email'), password: val('password') });
      closeAuth();
      CI.toast('Аккаунт создан — он работает и в мессенджере', { action: 'Кабинет', onAction: () => { location.hash = '#/account'; } });
    } else if (mode === 'reset') {
      await acc.resetPassword(val('email'));
      err.className = 'am-err ok'; err.textContent = 'Письмо отправлено. Проверьте почту (и папку «Спам»).';
    } else if (mode === 'setup') {
      await acc.completeProfile(val('name'), val('username'));
      closeAuth(); CI.toast('Профиль создан');
    }
  } catch (e) {
    if (e && e.needsSetup) { render('setup', '', { name: val('name'), username: val('username'), error: e.userMessage }); return; }
    if (cur && cur.root.contains(err)) err.textContent = errText(e);
  } finally {
    if (cur && cur.root.contains(btn)) { btn.disabled = false; btn.textContent = label; }
  }
}

export function openAuth(mode, reason) {
  mode = mode || 'login';
  if (acc.ready && acc.user && !acc.profile) mode = 'setup';
  else if (signedIn()) { location.hash = '#/account'; return; }
  closeAuth();
  const root = document.createElement('div');
  root.className = 'am-back';
  root.innerHTML = '<div class="am" role="dialog" aria-modal="true" aria-labelledby="am-title">' +
    '<button type="button" class="am-x" aria-label="Закрыть" title="Закрыть">✕</button>' +
    '<div class="am-brand"><span class="logo">' + esc(document.getElementById('logo').textContent || 'CI') + '</span>' +
    '<div><h2 id="am-title">Аккаунт ' + esc(CI.SITE.name || '') + '</h2><small>Один аккаунт для сайта и мессенджера</small></div></div>' +
    '<div class="am-body"></div></div>';
  const onKey = (e) => { if (e.key === 'Escape') { e.stopPropagation(); e.preventDefault(); closeAuth(); } };
  cur = { root, mode, onKey, back: document.activeElement };
  root.addEventListener('mousedown', (e) => { if (e.target === root) closeAuth(); });
  root.querySelector('.am-x').onclick = closeAuth;
  document.addEventListener('keydown', onKey, true);
  document.body.appendChild(root);
  document.body.classList.add('am-open');
  render(mode, reason);
}

export function closeAuth() {
  if (!cur) return;
  const c = cur; cur = null;
  document.removeEventListener('keydown', c.onKey, true);
  c.root.remove();
  document.body.classList.remove('am-open');
  try { if (c.back && c.back.focus) c.back.focus(); } catch (e) { /* ignore */ }
}

// Вошли в другом месте (например, в мессенджере) — окно больше не нужно
acc.on(() => { if (cur && cur.mode !== 'setup' && cur.mode !== 'register' && signedIn()) closeAuth(); });

acc.openAuth = openAuth;
acc.closeAuth = closeAuth;
