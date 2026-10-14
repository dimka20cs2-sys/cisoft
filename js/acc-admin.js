// Личный кабинет: статистика по всем программам — только для @username из SITE.admins.
// Данные — публичные счётчики stats/* (скачивания, лайки). «Избранное» не считаем: это личные данные
// (userdata/{uid} доступен только владельцу), а общего счётчика избранного нет.
import { isAdmin } from './acc-core.js';

const CI = window.CI, esc = CI.esc;
const COLS = [['name', 'Программа'], ['type', 'Раздел'], ['downloads', 'Скачивания'], ['likes', 'Лайки']];
const sort = { key: 'downloads', dir: -1 };

export function adminHtml() {
  if (!isAdmin()) return '';
  const rows = CI.ITEMS.map((it) => ({ it, name: it.name, type: CI.TYPES[it.type] || it.type || '', downloads: CI.st(it.id).downloads || 0, likes: CI.st(it.id).likes || 0 }));
  const k = sort.key, dir = sort.dir;
  rows.sort((a, b) => {
    const x = a[k], y = b[k];
    const c = typeof x === 'number' ? x - y : String(x).localeCompare(String(y), 'ru', { sensitivity: 'base' });
    return c * dir || String(a.name).localeCompare(String(b.name), 'ru');
  });
  const tot = rows.reduce((s, r) => ({ d: s.d + r.downloads, l: s.l + r.likes }), { d: 0, l: 0 });
  const th = COLS.map((c) => {
    const on = c[0] === k, aria = on ? (dir > 0 ? 'ascending' : 'descending') : 'none';
    return '<th scope="col" aria-sort="' + aria + '" class="' + (c[0] === 'downloads' || c[0] === 'likes' ? 'num' : '') + '">' +
      '<button type="button" data-sort-col="' + c[0] + '">' + c[1] + '<span class="arr">' + (on ? (dir > 0 ? '▲' : '▼') : '') + '</span></button></th>';
  }).join('');
  const body = rows.map((r) => '<tr><td><a href="#/item/' + encodeURIComponent(r.it.id) + '">' + esc(r.name) + '</a></td>' +
    '<td>' + esc(r.type) + '</td><td class="num">' + CI.num(r.downloads) + '</td><td class="num">' + CI.num(r.likes) + '</td></tr>').join('');
  return '<div class="acc-card-head"><h2>Статистика <span class="acc-tag">админ</span></h2></div>' +
    '<p class="acc-p muted">' + (CI.statsOk ? 'Всего: ' + CI.num(tot.d) + ' ' + CI.plural(tot.d, 'скачивание', 'скачивания', 'скачиваний') +
      ', ' + CI.num(tot.l) + ' ' + CI.plural(tot.l, 'лайк', 'лайка', 'лайков') + '. ' : 'Счётчики загружаются… ') +
    'Избранное по программам не считается — это личные данные пользователей. Нажмите на заголовок, чтобы отсортировать.</p>' +
    '<div class="acc-table-wrap"><table class="acc-table"><thead><tr>' + th + '</tr></thead><tbody>' + body +
    '</tbody><tfoot><tr><td>Итого</td><td></td><td class="num">' + CI.num(tot.d) + '</td><td class="num">' + CI.num(tot.l) + '</td></tr></tfoot></table></div>';
}

// Клик по заголовку — сортировка (повторный клик меняет направление)
export function bindAdmin(box, rerender) {
  box.addEventListener('click', (e) => {
    const b = e.target.closest('[data-sort-col]');
    if (!b) return;
    const key = b.dataset.sortCol;
    if (sort.key === key) sort.dir = -sort.dir;
    else { sort.key = key; sort.dir = key === 'name' || key === 'type' ? 1 : -1; }
    rerender();
    const nb = box.querySelector('[data-sort-col="' + key + '"]');
    if (nb) nb.focus();
  });
}
