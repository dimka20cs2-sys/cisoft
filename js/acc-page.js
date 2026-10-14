// #/account — «Личный кабинет»: каркас страницы, профиль, обновление блоков при изменениях.
import { acc, avatarHtml, signedIn, isAdmin, joinedMs, errText } from './acc-core.js';
import { favoritesHtml, downloadsHtml, likesHtml, messengerHtml, purchasesHtml, fmtDay } from './acc-lists.js';
import { adminHtml, bindAdmin } from './acc-admin.js';
import { securityHtml, bindSecurity, openDeleteDialog } from './acc-security.js';

const CI = window.CI, esc = CI.esc;
const onPage = () => location.hash === '#/account';
let shape = '', prevVisit = 0, entered = false;

function computeShape() {
  if (!acc.ready) return 'loading';
  if (!acc.user) return 'guest';
  if (!acc.profile) return 'setup';
  return isAdmin() ? 'full-admin' : 'full';
}

const HEAD = '<section class="page-head"><h1>Личный кабинет</h1>' +
  '<p>Профиль, избранное, загрузки и лайки. Один аккаунт — и для сайта, и для мессенджера.</p></section>';

function guestHtml() {
  return HEAD + '<div class="acc-card acc-invite">' +
    '<div class="acc-invite-ico" aria-hidden="true"><svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 3.6-7 8-7s8 3 8 7"/></svg></div>' +
    '<h2>Войдите, чтобы открыть кабинет</h2>' +
    '<ul class="acc-perks"><li><b>☆ Избранное</b> — и подсказка, когда программа обновится</li>' +
      '<li><b>⬇ Мои загрузки</b> — что и когда вы скачивали</li>' +
      '<li><b>❤ Честные лайки</b> — один человек, один лайк</li>' +
      '<li><b>💬 Мессенджер</b> — тот же аккаунт, входить второй раз не нужно</li></ul>' +
    '<div class="acc-invite-btns"><button type="button" class="acc-btn2 primary" data-act="login">Войти</button>' +
    '<button type="button" class="acc-btn2" data-act="register">Зарегистрироваться</button></div></div>';
}

function setupHtml() {
  return HEAD + '<div class="acc-card acc-invite"><h2>Завершите регистрацию</h2>' +
    '<p class="acc-p">Вы вошли как ' + esc(acc.user.email || '') + ', но ещё не выбрали имя и @username.</p>' +
    '<div class="acc-invite-btns"><button type="button" class="acc-btn2 primary" data-act="setup">Выбрать имя</button>' +
    '<button type="button" class="acc-btn2" data-act="logout">Выйти</button></div></div>';
}

function profileViewHtml() {
  const p = acc.profile, j = joinedMs();
  return '<div class="acc-pv">' + avatarHtml(p, 84) +
    '<div class="acc-pv-info"><b class="acc-pv-name">' + esc(p.name) + '</b>' +
      '<span class="acc-pv-un">@' + esc(p.username) + '</span>' +
      '<span>' + esc(acc.user.email || '') + '</span>' +
      (j ? '<span>С нами с ' + fmtDay(j) + '</span>' : '') + '</div></div>' +
    '<div class="acc-pv-btns"><button type="button" class="acc-btn2 sm" data-act="pick-photo">' + (p.avatar ? 'Сменить фото' : 'Загрузить фото') + '</button>' +
    (p.avatar ? '<button type="button" class="acc-btn2 sm" data-act="remove-photo">Убрать фото</button>' : '') + '</div>';
}

function fullHtml() {
  return HEAD + '<div class="acc-layout"><div class="acc-main">' +
      '<section class="acc-card" id="acc-buy"></section>' +
      '<section class="acc-card" id="acc-fav"></section>' +
      '<section class="acc-card" id="acc-dl"></section>' +
      '<section class="acc-card" id="acc-likes"></section>' +
    '</div><aside class="acc-side">' +
      '<section class="acc-card acc-profile"><div class="acc-card-head"><h2>Профиль</h2></div><div id="acc-prof-view"></div>' +
        '<form class="acc-form acc-name" id="acc-name-form" novalidate><div class="af"><label for="acc-name">Имя для показа</label>' +
        '<div class="acc-inline"><input class="ain" id="acc-name" name="name" maxlength="60" value="' + esc(acc.profile.name) + '">' +
        '<button type="submit" class="acc-btn2 primary">Сохранить</button></div></div>' +
        '<div class="af-hint">@username поменять нельзя — по нему вас находят в мессенджере.</div></form>' +
        '<input type="file" accept="image/*" id="acc-file" hidden></section>' +
      '<section class="acc-card" id="acc-msgr"></section>' +
      '<section class="acc-card" id="acc-sec">' + securityHtml() + '</section>' +
    '</aside></div>' +
    '<section class="acc-card acc-admin" id="acc-admin"' + (isAdmin() ? '' : ' hidden') + '></section>';
}

function put(id, html) {
  const el = document.getElementById(id);
  if (el && el.__html !== html) { el.__html = html; el.innerHTML = html; }
}

function maybeVisit() {
  if (entered || !signedIn() || !acc.dataLoaded) return;
  entered = true;
  prevVisit = acc.data.lastAccountVisit || 0;
  acc.markVisit();
}

function fillSections() {
  maybeVisit();
  put('acc-prof-view', profileViewHtml());
  put('acc-buy', purchasesHtml());
  put('acc-fav', favoritesHtml(prevVisit));
  put('acc-dl', downloadsHtml());
  put('acc-likes', likesHtml());
  put('acc-msgr', messengerHtml());
  if (isAdmin()) put('acc-admin', adminHtml());
  CI.paintStats(CI.app);
}

export function renderAccount() {
  document.title = 'Личный кабинет — ' + (CI.SITE.name || '');
  shape = computeShape();
  if (shape === 'loading') CI.app.innerHTML = HEAD + '<div class="empty">Загрузка…</div>';
  else if (shape === 'guest') CI.app.innerHTML = guestHtml();
  else if (shape === 'setup') CI.app.innerHTML = setupHtml();
  else {
    CI.app.innerHTML = fullHtml();
    bindSecurity(CI.app);
    const adm = document.getElementById('acc-admin');
    bindAdmin(adm, () => put('acc-admin', adminHtml()));
    document.getElementById('acc-name-form').onsubmit = async (e) => {
      e.preventDefault();
      try { await acc.saveName(document.getElementById('acc-name').value); CI.toast('Имя сохранено'); }
      catch (ex) { CI.toast(errText(ex)); }
    };
    document.getElementById('acc-file').onchange = async (e) => {
      const f = e.target.files[0]; e.target.value = '';
      if (!f) return;
      try { await acc.setAvatarFile(f); CI.toast('Фото профиля обновлено'); } catch (ex) { CI.toast(errText(ex)); }
    };
    fillSections();
  }
}

function update() {
  if (!onPage()) return;
  if (computeShape() !== shape) { renderAccount(); return; }
  if (shape.indexOf('full') === 0) fillSections();
}

// Кнопки страницы (делегирование на #app)
CI.app.addEventListener('click', (e) => {
  const t = e.target.closest && e.target.closest('[data-act]');
  if (!t || !onPage()) return;
  const a = t.dataset.act;
  if (a === 'login' || a === 'register' || a === 'setup') acc.openAuth(a);
  else if (a === 'logout') acc.logout().then(() => CI.toast('Вы вышли из аккаунта'));
  else if (a === 'pick-photo') document.getElementById('acc-file').click();
  else if (a === 'remove-photo') acc.removeAvatar().then(() => CI.toast('Фото убрано'), (ex) => CI.toast(errText(ex)));
  else if (a === 'open-msgr') CI.msgr.open();
  else if (a === 'clear-dl') acc.clearDownloads();
  else if (a === 'copy-key') navigator.clipboard.writeText(t.dataset.key).then(() => CI.toast('Ключ скопирован'), () => CI.toast('Не удалось скопировать'));
  else if (a === 'delete-acc') openDeleteDialog();
});

window.addEventListener('hashchange', () => { if (!onPage()) entered = false; });
acc.on(update);
CI.onStats(update);
if (CI.msgr && CI.msgr.onUnread) CI.msgr.onUnread(update);
CI.renderAccount = renderAccount;
if (onPage()) renderAccount();
