// Шапка: «Войти» или аватар с меню «Личный кабинет / Мессенджер / Выйти».
import { acc, avatarHtml, freshUpdatesCount } from './acc-core.js';

const CI = window.CI, esc = CI.esc;
const slot = document.getElementById('acc-slot');
let open = false, lastHtml = '';

function html() {
  if (!acc.ready) return '';
  if (!acc.user) return '<button type="button" class="acc-login" data-act="login">Войти</button>';
  if (!acc.profile) return '<button type="button" class="acc-login" data-act="setup">Завершить регистрацию</button>';
  const p = acc.profile, n = freshUpdatesCount(), un = CI.msgr ? CI.msgr.unread() : 0;
  return '<button type="button" class="acc-btn" data-act="toggle" aria-haspopup="menu" aria-expanded="false" aria-controls="acc-menu" ' +
      'title="' + esc(p.name) + ' — личный кабинет" aria-label="Меню аккаунта">' + avatarHtml(p, 34) +
      (n ? '<b class="acc-dot" aria-hidden="true"></b>' : '') + '</button>' +
    '<div class="acc-menu" id="acc-menu" role="menu" hidden>' +
      '<div class="acc-menu-head">' + avatarHtml(p, 40) + '<div><b>' + esc(p.name) + '</b><small>@' + esc(p.username) + '</small></div></div>' +
      '<a role="menuitem" href="#/account" data-act="go"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 3.6-7 8-7s8 3 8 7"/></svg>Личный кабинет' +
        (n ? '<span class="acc-cnt" title="Обновились программы из избранного">' + n + '</span>' : '') + '</a>' +
      '<button type="button" role="menuitem" data-act="msgr"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3h11A2.5 2.5 0 0 1 20 5.5v8a2.5 2.5 0 0 1-2.5 2.5H10l-4.2 3.6c-.5.4-1.3.1-1.3-.6V16A2.5 2.5 0 0 1 4 13.5z"/></svg>Мессенджер' +
        '<b class="nbadge" data-unread' + (un > 0 ? '' : ' hidden') + '>' + (un > 99 ? '99+' : un) + '</b></button>' +
      '<button type="button" role="menuitem" data-act="logout"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3M10 17l-5-5 5-5M5 12h11"/></svg>Выйти</button>' +
    '</div>';
}

function setOpen(v) {
  const m = slot.querySelector('.acc-menu'), b = slot.querySelector('.acc-btn');
  open = !!(v && m);
  if (m) m.hidden = !open;
  if (b) b.setAttribute('aria-expanded', open ? 'true' : 'false');
  if (open) { const f = m.querySelector('[role=menuitem]'); if (f) f.focus(); }
}

function render() {
  const h = html();
  if (h === lastHtml) return;
  lastHtml = h;
  const wasOpen = open;
  slot.innerHTML = h;
  slot.classList.toggle('ready', acc.ready);
  if (wasOpen) setOpen(true);
}

slot.addEventListener('click', (e) => {
  const t = e.target.closest('[data-act]');
  if (!t) return;
  const act = t.dataset.act;
  if (act === 'login') acc.openAuth('login');
  else if (act === 'setup') acc.openAuth('setup');
  else if (act === 'toggle') setOpen(!open);
  else if (act === 'go') setOpen(false);
  else if (act === 'msgr') { setOpen(false); CI.msgr.open(); }
  else if (act === 'logout') { setOpen(false); acc.logout().then(() => CI.toast('Вы вышли из аккаунта')); }
});
document.addEventListener('mousedown', (e) => { if (open && !slot.contains(e.target)) setOpen(false); });
document.addEventListener('keydown', (e) => {
  if (!open) return;
  if (e.key === 'Escape') { e.stopPropagation(); setOpen(false); const b = slot.querySelector('.acc-btn'); if (b) b.focus(); return; }
  if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
    const items = [...slot.querySelectorAll('[role=menuitem]')];
    const i = items.indexOf(document.activeElement);
    const n = items[(i + (e.key === 'ArrowDown' ? 1 : items.length - 1)) % items.length];
    if (n) { e.preventDefault(); n.focus(); }
  }
}, true);
window.addEventListener('hashchange', () => setOpen(false));

acc.on(render);
if (CI.msgr && CI.msgr.onUnread) CI.msgr.onUnread(render);
render();
