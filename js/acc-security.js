// Личный кабинет: смена пароля, выход, удаление аккаунта (с подтверждением паролем).
import { acc, errText } from './acc-core.js';

const CI = window.CI, esc = CI.esc;

function pf(name, label, ac) {
  return '<div class="af"><label for="ap-' + name + '">' + label + '</label>' +
    '<input class="ain" id="ap-' + name + '" name="' + name + '" type="password" autocomplete="' + ac + '"></div>';
}

export function securityHtml() {
  return '<div class="acc-card-head"><h2>Безопасность</h2></div>' +
    '<details class="acc-det" id="acc-pass-det"><summary>Сменить пароль</summary>' +
      '<form class="acc-form" id="acc-pass-form" novalidate>' +
        pf('cur', 'Текущий пароль', 'current-password') +
        pf('next', 'Новый пароль (минимум 6 символов)', 'new-password') +
        pf('again', 'Новый пароль ещё раз', 'new-password') +
        '<div class="am-err" role="alert"></div>' +
        '<button class="acc-btn2 primary" type="submit">Сменить пароль</button>' +
      '</form></details>' +
    '<button type="button" class="acc-btn2" data-act="logout">' +
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3M10 17l-5-5 5-5M5 12h11"/></svg>Выйти из аккаунта</button>' +
    '<div class="acc-danger"><b>Удаление аккаунта</b>' +
      '<p>Удалит аккаунт для сайта и мессенджера. Отменить нельзя.</p>' +
      '<button type="button" class="acc-btn2 danger" data-act="delete-acc">Удалить аккаунт…</button></div>';
}

export function bindSecurity(root) {
  const form = root.querySelector('#acc-pass-form');
  if (!form) return;
  form.onsubmit = async (e) => {
    e.preventDefault();
    const err = form.querySelector('.am-err'), btn = form.querySelector('button[type=submit]');
    const v = (n) => form.querySelector('[name="' + n + '"]').value;
    err.className = 'am-err'; err.textContent = '';
    btn.disabled = true;
    try {
      await acc.changePassword(v('cur'), v('next'), v('again'));
      form.reset();
      err.className = 'am-err ok'; err.textContent = 'Пароль изменён.';
      CI.toast('Пароль изменён');
    } catch (ex) {
      err.textContent = ex && (ex.code === 'auth/invalid-credential' || ex.code === 'auth/wrong-password')
        ? 'Текущий пароль введён неверно.' : errText(ex);
    } finally { btn.disabled = false; }
  };
}

// Окно подтверждения удаления: честно перечисляем, что удаляется и что остаётся
export function openDeleteDialog() {
  const p = acc.profile || {};
  const root = document.createElement('div');
  root.className = 'am-back';
  root.innerHTML = '<div class="am" role="dialog" aria-modal="true" aria-labelledby="del-title">' +
    '<button type="button" class="am-x" aria-label="Закрыть" title="Закрыть">✕</button>' +
    '<h2 class="am-h danger" id="del-title">Удалить аккаунт?</h2>' +
    '<p class="am-p">Будет удалено сразу:</p><ul class="am-ul">' +
      '<li>вход по email <b>' + esc(acc.user && acc.user.email) + '</b> (для сайта и мессенджера);</li>' +
      '<li>избранное и история загрузок;</li>' +
      '<li>ваши лайки — счётчики программ уменьшатся;</li>' +
      '<li>имя <b>@' + esc(p.username || '') + '</b> освободится для других.</li></ul>' +
    '<p class="am-p">Останется: сообщения и фото, которые вы отправляли в чатах и группах (их видят собеседники), ' +
      'и карточка профиля в мессенджере — без фото, с именем «Удалённый аккаунт». Анонимные счётчики скачиваний не меняются.</p>' +
    '<form class="am-form" novalidate>' +
      '<div class="af"><label for="del-pass">Введите пароль для подтверждения</label>' +
      '<input class="ain" id="del-pass" name="password" type="password" autocomplete="current-password"></div>' +
      '<div class="am-err" role="alert"></div>' +
      '<div class="am-row"><button type="button" class="acc-btn2" data-close>Отмена</button>' +
      '<button type="submit" class="acc-btn2 danger">Удалить навсегда</button></div></form></div>';
  const onKey = (e) => { if (e.key === 'Escape') { e.stopPropagation(); close(); } };
  let busy = false;
  function close() { if (busy) return; document.removeEventListener('keydown', onKey, true); root.remove(); }
  root.addEventListener('mousedown', (e) => { if (e.target === root) close(); });
  root.querySelector('.am-x').onclick = close;
  root.querySelector('[data-close]').onclick = close;
  document.addEventListener('keydown', onKey, true);
  const form = root.querySelector('form');
  form.onsubmit = async (e) => {
    e.preventDefault();
    const err = form.querySelector('.am-err'), btn = form.querySelector('button[type=submit]');
    err.textContent = '';
    btn.disabled = true; btn.textContent = 'Удаляем…'; busy = true;
    try {
      await acc.deleteAccount(form.password.value);
      busy = false; close();
      location.hash = '#/';
      CI.toast('Аккаунт удалён');
    } catch (ex) {
      busy = false;
      err.textContent = ex && (ex.code === 'auth/invalid-credential' || ex.code === 'auth/wrong-password')
        ? 'Неверный пароль.' : errText(ex);
      btn.disabled = false; btn.textContent = 'Удалить навсегда';
    }
  };
  document.body.appendChild(root);
  setTimeout(() => root.querySelector('#del-pass').focus(), 30);
}
