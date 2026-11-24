// Личный кабинет: блоки «Избранное», «Мои загрузки», «Мои лайки», «Мессенджер» (только разметка).
import { acc, updateAfter } from './acc-core.js';

const CI = window.CI, esc = CI.esc, T = CI.t;

export function fmtDay(ms) {
  return ms ? new Date(ms).toLocaleDateString(CI.locale(), { day: 'numeric', month: 'long', year: 'numeric' }) : '';
}
export function fmtTime(ms) {
  if (!ms) return '';
  const d = new Date(ms), now = new Date();
  const t = d.toLocaleTimeString(CI.locale(), { hour: '2-digit', minute: '2-digit' });
  if (d.toDateString() === now.toDateString()) return T('сегодня, {t}', { t });
  const y = new Date(now); y.setDate(now.getDate() - 1);
  if (d.toDateString() === y.toDateString()) return T('вчера, {t}', { t });
  return d.toLocaleDateString(CI.locale(), { day: 'numeric', month: 'short', year: 'numeric' }) + ', ' + t;
}

function head(title, count, extra) {
  return '<div class="acc-card-head"><h2>' + title + (count ? '<span class="acc-n">' + count + '</span>' : '') + '</h2>' + (extra || '') + '</div>';
}
function itemLink(it) {
  return '<a class="acc-row-name" href="#/item/' + encodeURIComponent(it.id) + '">' + esc(it.name) + '</a>';
}
function rowIcon(it) {
  return '<a class="acc-row-ico" href="#/item/' + encodeURIComponent(it.id) + '" tabindex="-1" aria-hidden="true">' + CI.icon(it) + '</a>';
}
function empty(text) { return '<div class="acc-empty">' + text + '</div>'; }

export function purchasesHtml() {
  const map = acc.data.purchases || {};
  const ids = Object.keys(map).sort((a, b) => (map[b].at || 0) - (map[a].at || 0));
  let rows = '';
  for (const id of ids) {
    const it = CI.byId(id), p = map[id];
    if (!it || !p) continue;
    rows += '<li class="acc-row">' + rowIcon(it) +
      '<div class="acc-row-main"><div class="acc-row-top">' + itemLink(it) + '<span class="pro-badge">PRO</span></div>' +
      '<small>' + T('Заказ') + ' ' + esc(p.order) + ' · ' + fmtDay(Number(p.at)) + '</small>' +
      '<code class="acc-key">' + esc(p.key) + '</code></div>' +
      '<button type="button" class="acc-link" data-act="copy-key" data-key="' + esc(p.key) + '">' + T('Скопировать ключ') + '</button></li>';
  }
  return head(T('Мои покупки'), ids.length) +
    (rows ? '<ul class="acc-list">' + rows + '</ul>' : empty(T('Здесь появятся лицензии Pro-программ, купленных в этом аккаунте.')));
}

// prevVisit — момент прошлого визита в кабинет (для пометки «новое»)
export function favoritesHtml(prevVisit) {
  const favs = acc.data.favorites || {};
  const ids = Object.keys(favs).sort((a, b) => (Number(favs[b]) || 0) - (Number(favs[a]) || 0));
  let rows = '';
  for (const id of ids) {
    const it = CI.byId(id), added = Number(favs[id]) || 0;
    if (!it) {
      rows += '<li class="acc-row"><div class="acc-row-main"><b>' + esc(id) + '</b><small>' + T('Программа убрана из каталога') + '</small></div>' +
        '<button type="button" class="fav sm on" data-fav="' + esc(id) + '" aria-pressed="true" title="' + T('Убрать из избранного') + '"><span class="star">★</span></button></li>';
      continue;
    }
    const upd = updateAfter(it, added);
    const fresh = upd && prevVisit && CI.parseDate(upd.date).getTime() > prevVisit;
    rows += '<li class="acc-row' + (upd ? ' has-upd' : '') + '">' + rowIcon(it) +
      '<div class="acc-row-main"><div class="acc-row-top">' + itemLink(it) + CI.badge(it.type) + '</div>' +
      '<small>' + (it.version ? 'v' + esc(it.version) + ' · ' : '') + T('в избранном с {date}', { date: fmtDay(added) }) + '</small>' +
      (upd ? '<a class="acc-upd" href="#/item/' + encodeURIComponent(it.id) + '">' + T('Обновлено до v{v}', { v: esc(upd.version) }) +
        (fresh ? ' · ' + T('новое') : '') + '</a>' : '') + '</div>' +
      '<button type="button" class="fav sm on" data-fav="' + esc(it.id) + '" aria-pressed="true" title="' + T('Убрать из избранного') + '"><span class="star">★</span></button></li>';
  }
  return head(T('Избранное'), ids.length) +
    (rows ? '<ul class="acc-list">' + rows + '</ul>' : empty(T('Пока пусто. Нажмите ☆ на карточке программы — она появится здесь, а мы подскажем, когда выйдет обновление.')));
}

export function downloadsHtml() {
  const list = acc.data.downloads || [];
  let rows = '';
  for (const d of list) {
    const it = CI.byId(d.itemId);
    if (!it) continue;
    rows += '<li class="acc-row">' + rowIcon(it) +
      '<div class="acc-row-main"><div class="acc-row-top">' + itemLink(it) + '</div>' +
      '<small>' + esc(T(d.label || 'Скачать')) + '</small></div>' +
      '<time class="acc-time" datetime="' + new Date(Number(d.at) || 0).toISOString() + '">' + fmtTime(Number(d.at)) + '</time></li>';
  }
  const clear = rows ? '<button type="button" class="acc-link" data-act="clear-dl">' + T('Очистить') + '</button>' : '';
  return head(T('Мои загрузки'), list.length, clear) +
    (rows ? '<ul class="acc-list">' + rows + '</ul>' : empty(T('Здесь появятся программы, которые вы скачали, пока были в аккаунте (последние 50).')));
}

export function likesHtml() {
  const ids = Object.keys(acc.likes || {});
  const items = ids.map((id) => CI.byId(id)).filter(Boolean);
  const rows = items.map((it) => '<li class="acc-row">' + rowIcon(it) +
    '<div class="acc-row-main"><div class="acc-row-top">' + itemLink(it) + CI.badge(it.type) + '</div>' +
    '<small>' + esc(it.short || '') + '</small></div>' +
    '<button type="button" class="like sm on" data-like="' + esc(it.id) + '" aria-pressed="true" title="' + T('Убрать лайк') + '">' +
    '<span class="heart">❤</span><span class="stat" data-count-like="' + esc(it.id) + '">' + CI.num(CI.st(it.id).likes) + '</span></button></li>').join('');
  return head(T('Мои лайки'), items.length) +
    (rows ? '<ul class="acc-list">' + rows + '</ul>' : empty(T('Вы ещё ничего не лайкнули. Сердечко ❤ есть на каждой карточке.')));
}

export function messengerHtml() {
  const known = CI.msgr && CI.msgr.unreadKnown && CI.msgr.unreadKnown();
  const n = known ? CI.msgr.unread() : 0;
  const line = !known ? T('Тот же аккаунт: вы уже вошли и в мессенджер.')
    : n > 0 ? T('Непрочитанных сообщений:') + ' <b class="acc-unread">' + CI.num(n) + '</b>'
      : T('Новых сообщений нет.');
  return head(T('Мессенджер')) + '<p class="acc-p">' + line + '</p>' +
    '<button type="button" class="acc-btn2 primary" data-act="open-msgr">' + T('Открыть мессенджер') + '</button>';
}
