// Личный кабинет: состояние входа, профиль users/{uid}, userdata/{uid}, мои лайки.
// Тот же Firebase app ('[DEFAULT]') и тот же initializeAuth, что у мессенджера (messenger/js/fb.js),
// поэтому вход на сайте = вход в мессенджере (общая сессия в IndexedDB одного origin) и наоборот.
import { auth, db, isEmu } from '../messenger/js/fb.js';
import { onAuthStateChanged } from '../messenger/js/fa.js';
import { doc, onSnapshot, collection, query, where } from '../messenger/js/fs.js';
import { colorFor, initials, isDataImage, toMs } from '../messenger/js/util.js';

const CI = window.CI;
const esc = CI.esc;
const listeners = new Set();
const EMPTY = () => ({ favorites: {}, downloads: [], lastAccountVisit: 0 });

export const acc = CI.acc = Object.assign(CI.acc || {}, {
  ready: false,        // известно, вошёл ли пользователь (и загружен ли профиль)
  user: null,          // Firebase User
  profile: null,       // users/{uid} или null (профиль ещё не создан)
  data: EMPTY(),       // userdata/{uid}
  dataLoaded: false,
  likes: {},           // itemId → true
  on(fn) { listeners.add(fn); return () => listeners.delete(fn); }
});

let queued = false;
export function emit() {
  if (queued) return;
  queued = true;
  queueMicrotask(() => {
    queued = false;
    CI.myLikes = acc.user ? acc.likes : {};
    CI.myFavs = acc.user ? (acc.data.favorites || {}) : {};
    CI.paintStats(document);
    for (const fn of listeners) { try { fn(); } catch (e) { console.error(e); } }
  });
}

let unsubs = [];
function stopWatches() { unsubs.forEach((u) => u()); unsubs = []; }

onAuthStateChanged(auth, (user) => {
  stopWatches();
  acc.user = user || null;
  acc.profile = null;
  acc.data = EMPTY();
  acc.dataLoaded = !user;
  acc.likes = {};
  acc.ready = !user;
  if (user) {
    const uid = user.uid;
    const done = () => { if (!acc.ready) { acc.ready = true; } emit(); };
    unsubs.push(onSnapshot(doc(db, 'users', uid), (s) => {
      acc.profile = s.exists() ? { uid, ...s.data() } : null;
      done();
    }, done));
    unsubs.push(onSnapshot(doc(db, 'userdata', uid), (s) => {
      const d = s.data() || {};
      acc.data = {
        favorites: d.favorites && typeof d.favorites === 'object' ? d.favorites : {},
        downloads: Array.isArray(d.downloads) ? d.downloads : [],
        lastAccountVisit: Number(d.lastAccountVisit) || 0
      };
      acc.dataLoaded = true;
      emit();
    }, () => { acc.dataLoaded = true; emit(); }));
    unsubs.push(onSnapshot(query(collection(db, 'likes'), where('uid', '==', uid)), (snap) => {
      const m = {};
      snap.forEach((d) => { const v = d.data(); if (v && v.itemId) m[v.itemId] = true; });
      acc.likes = m;
      emit();
    }, () => {}));
  }
  emit();
});

// ── помощники для интерфейса ──
export function signedIn() { return !!(acc.ready && acc.user && acc.profile); }

// Аватар как в мессенджере: картинка или цветной кружок с инициалами
export function avatarHtml(p, size) {
  p = p || {};
  const st = 'width:' + size + 'px;height:' + size + 'px;font-size:' + Math.round(size * 0.38) + 'px;';
  if (p.avatar && isDataImage(p.avatar)) {
    return '<span class="acc-ava" style="' + st + '"><img src="' + esc(p.avatar) + '" alt=""></span>';
  }
  const bg = /^#[0-9a-fA-F]{3,8}$/.test(p.color || '') ? p.color : colorFor(p.uid || '');
  return '<span class="acc-ava" style="' + st + 'background:' + bg + '">' + esc(initials(p.name || '?')) + '</span>';
}

export function isAdmin() {
  const list = (CI.SITE.admins || []).map((x) => String(x).replace(/^@/, '').toLowerCase());
  return signedIn() && list.indexOf(String(acc.profile.usernameLower || '').toLowerCase()) >= 0;
}

// Самая новая запись changelog, вышедшая позже момента sinceMs (по дате записи, без времени)
export function updateAfter(it, sinceMs) {
  let best = null;
  for (const c of (it && it.changelog) || []) {
    const d = CI.parseDate(c.date);
    if (d && d.getTime() > sinceMs && (!best || String(c.date) > String(best.date))) best = c;
  }
  return best;
}

// Сколько избранных программ обновились с последнего визита в кабинет
export function freshUpdatesCount() {
  const favs = acc.data.favorites || {}, last = acc.data.lastAccountVisit || 0;
  return Object.keys(favs).filter((id) => {
    const it = CI.byId(id);
    return it && updateAfter(it, Math.max(Number(favs[id]) || 0, last));
  }).length;
}

export function joinedMs() {
  return toMs(acc.profile && acc.profile.createdAt) || Date.parse((acc.user && acc.user.metadata.creationTime) || '') || 0;
}

const ERR = {
  'auth/invalid-email': 'Неверный формат email.',
  'auth/missing-email': 'Введите email.',
  'auth/missing-password': 'Введите пароль.',
  'auth/email-already-in-use': 'Этот email уже зарегистрирован. Попробуйте войти.',
  'auth/weak-password': 'Слишком простой пароль — нужно минимум 6 символов.',
  'auth/invalid-credential': 'Неверный email или пароль.',
  'auth/invalid-login-credentials': 'Неверный email или пароль.',
  'auth/wrong-password': 'Неверный пароль.',
  'auth/user-not-found': 'Пользователь с таким email не найден.',
  'auth/user-mismatch': 'Пароль не подходит к этому аккаунту.',
  'auth/user-disabled': 'Этот аккаунт отключён.',
  'auth/too-many-requests': 'Слишком много попыток. Подождите немного и попробуйте снова.',
  'auth/network-request-failed': 'Нет соединения с сервером. Проверьте интернет.',
  'auth/requires-recent-login': 'Для этого действия нужно заново ввести пароль.',
  'auth/operation-not-allowed': 'Вход по email отключён в настройках проекта.',
  'permission-denied': 'Недостаточно прав для этого действия.',
  'unavailable': 'Сервер недоступен. Проверьте интернет.',
  'resource-exhausted': 'Превышен лимит сервера. Попробуйте позже.'
};
export function errText(e) {
  return ERR[(e && e.code) || ''] || (e && e.userMessage) || 'Что-то пошло не так. Попробуйте ещё раз.';
}

if (isEmu) window.__ciAcc = { acc, auth, db }; // только для локальных проверок на эмуляторе
