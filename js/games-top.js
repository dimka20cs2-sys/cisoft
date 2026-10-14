// Таблица лидеров игр (ES-модуль): gamescores/{игра}/scores/{uid} → { name, username, score, at }.
// Пишет только сам игрок и только свой лучший результат (правила Firestore). Без входа — лишь локальный рекорд.
import { db } from '../messenger/js/fb.js';
import { doc, getDoc, setDoc, getDocs, query, collection, orderBy, limit, serverTimestamp } from '../messenger/js/fs.js';
import { acc } from './acc-core.js';

const CI = window.CI, esc = CI.esc;
const fmt = (n) => Math.round(n).toLocaleString('ru-RU');
const cache = {}; // игра → { at, rows }

async function top(game, n) {
  const c = cache[game];
  if (c && Date.now() - c.at < 30000) return c.rows;
  const snap = await getDocs(query(collection(db, 'gamescores', game, 'scores'), orderBy('score', 'desc'), limit(n || 10)));
  const rows = snap.docs.map((d) => ({ uid: d.id, ...d.data() }));
  cache[game] = { at: Date.now(), rows };
  return rows;
}

function listHtml(g, rows) {
  if (!rows.length) return '<p class="top-note">Пока никого — стань первым!</p>';
  const me = acc.user && acc.user.uid;
  return '<ol class="top-list">' + rows.map((r) =>
    '<li class="' + (r.uid === me ? 'me' : '') + '"><span class="who">' + esc(r.name || ('@' + r.username)) + '</span>' +
    '<span class="pts">' + fmt(r.score) + ' ' + g.unit + '</span></li>').join('') + '</ol>';
}

function note() {
  return acc.user && acc.profile ? '' :
    '<p class="top-note">Войди в аккаунт (кнопка «Войти» вверху), чтобы попасть в таблицу.</p>';
}

CI.renderGameTop = async (g, el) => {
  if (!el) return;
  el.innerHTML = '<h2>Лучшие игроки</h2><p class="top-note">Загрузка…</p>';
  try { el.innerHTML = '<h2>Лучшие игроки</h2>' + listHtml(g, await top(g.id, 10)) + note(); }
  catch (e) { el.innerHTML = '<h2>Лучшие игроки</h2><p class="top-note">Таблица сейчас недоступна.</p>'; }
};

CI.renderGamesTop = async (el) => {
  if (!el) return;
  el.innerHTML = '<h2>Таблица лидеров</h2><div class="games-tops">' +
    CI.GAMES.map((g) => '<section data-top="' + g.id + '"><h2>' + esc(g.name) + '</h2><p class="top-note">Загрузка…</p></section>').join('') + '</div>';
  for (const g of CI.GAMES) {
    const s = el.querySelector('[data-top="' + g.id + '"]');
    try { const rows = await top(g.id, 5); if (s) s.innerHTML = '<h2>' + esc(g.name) + '</h2>' + listHtml(g, rows); }
    catch (e) { if (s) s.innerHTML = '<h2>' + esc(g.name) + '</h2><p class="top-note">Недоступно.</p>'; }
  }
};

CI.submitGameScore = async (g, score) => {
  if (!acc.user || !acc.profile) return;
  const ref = doc(db, 'gamescores', g.id, 'scores', acc.user.uid);
  try {
    const old = await getDoc(ref);
    if (old.exists() && (old.data().score || 0) >= score) return;
    await setDoc(ref, { name: acc.profile.name, username: acc.profile.username, score, at: serverTimestamp() });
    delete cache[g.id];
    const el = document.getElementById('game-top');
    if (el && location.hash === '#/games/' + g.id) CI.renderGameTop(g, el);
  } catch (e) { /* без сети или правила не пустили — локальный рекорд всё равно сохранён */ }
};

// Вошли/вышли — перерисовать таблицы на открытой странице (подсветка «я» и подсказка про вход)
function refresh() {
  const m = location.hash.match(/^#\/games(?:\/([\w-]+))?$/);
  if (!m) return;
  if (!m[1]) { CI.renderGamesTop(document.getElementById('games-top')); return; }
  const g = CI.GAMES.find((x) => x.id === m[1]);
  if (g) CI.renderGameTop(g, document.getElementById('game-top'));
}
let who = null;
acc.on(() => {
  const now = acc.ready ? (acc.user && acc.profile ? acc.user.uid : '') : null;
  if (now === null || now === who) return;
  const first = who === null;
  who = now;
  if (!first || now) refresh();
});
refresh(); // модуль мог загрузиться уже после отрисовки страницы