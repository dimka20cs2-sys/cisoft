// Профили пользователей: кэш с живыми подписками, онлайн-статус, поиск.
import { db } from './fb.js';
import {
  doc, getDoc, onSnapshot, collection, query, where, orderBy, limit, getDocs,
  serverTimestamp, updateDoc, runTransaction
} from './fs.js';
import { state, emit } from './state.js';
import { toMs, colorFor, USERNAME_RE, setClockOffset } from './util.js';

const cache = new Map();   // uid → профиль
const subs = new Map();    // uid → unsubscribe
const waiters = new Map(); // uid → Promise

function norm(id, data) {
  if (!data) return null;
  return { uid: id, ...data, lastSeenMs: toMs(data.lastSeen) };
}

export function cachedUser(uid) { return cache.get(uid) || null; }

// Подписаться на профиль (один раз на uid). Изменения приходят событием 'user'.
export function watchUser(uid) {
  if (!uid) return Promise.resolve(null);
  if (waiters.has(uid)) return waiters.get(uid);
  const p = new Promise((resolve) => {
    let first = true;
    const unsub = onSnapshot(doc(db, 'users', uid), (snap) => {
      const u = norm(uid, snap.data());
      if (uid === state.uid && u?.lastSeenMs && pingAt && !snap.metadata.hasPendingWrites && Date.now() - pingAt < 15000
        && u.lastSeenMs !== cache.get(uid)?.lastSeenMs) {
        setClockOffset(u.lastSeenMs - (pingAt + Date.now()) / 2); pingAt = 0;
      }
      if (u) cache.set(uid, u);
      if (first) { first = false; resolve(u); }
      emit('user', { uid, user: u });
    }, () => { if (first) { first = false; resolve(null); } });
    subs.set(uid, unsub);
  });
  waiters.set(uid, p);
  return p;
}

export function displayName(uid) {
  if (uid === state.uid) return state.me?.name || 'Вы';
  return cache.get(uid)?.name || 'Пользователь';
}

export function stopAllUserWatches() {
  for (const u of subs.values()) u();
  subs.clear(); waiters.clear(); cache.clear();
}

// Поиск по @username: точное совпадение и по префиксу
export async function searchUsers(text) {
  const q = String(text || '').trim().replace(/^@/, '').toLowerCase();
  if (q.length < 1 || !/^[a-z0-9_]+$/.test(q)) return [];
  const snap = await getDocs(query(collection(db, 'users'),
    where('usernameLower', '>=', q), where('usernameLower', '<=', q + ''),
    orderBy('usernameLower'), limit(20)));
  const res = snap.docs.map((d) => norm(d.id, d.data())).filter((u) => u.uid !== state.uid);
  res.sort((a, b) => (b.usernameLower === q) - (a.usernameLower === q));
  for (const u of res) if (!cache.has(u.uid)) cache.set(u.uid, u);
  return res;
}

export async function getUserOnce(uid) {
  if (cache.has(uid)) return cache.get(uid);
  const s = await getDoc(doc(db, 'users', uid));
  const u = norm(uid, s.data());
  if (u) cache.set(uid, u);
  return u;
}

// Создание профиля с уникальным именем (транзакция usernames/{name} → uid)
export async function claimProfile(uid, name, username) {
  if (!USERNAME_RE.test(username)) {
    throw { userMessage: 'Имя пользователя: 3–20 символов, латиница, цифры и _.' };
  }
  const lower = username.toLowerCase();
  const cleanName = String(name || '').trim().slice(0, 60);
  if (!cleanName) throw { userMessage: 'Укажите имя для показа.' };
  await runTransaction(db, async (tx) => {
    const unRef = doc(db, 'usernames', lower);
    const taken = await tx.get(unRef);
    if (taken.exists() && taken.data().uid !== uid) {
      throw { userMessage: `Имя @${username} уже занято. Выберите другое.` };
    }
    if (!taken.exists()) tx.set(unRef, { uid });
    tx.set(doc(db, 'users', uid), {
      name: cleanName, username, usernameLower: lower, avatar: null,
      color: colorFor(uid), createdAt: serverTimestamp(), lastSeen: serverTimestamp()
    });
  });
}

export async function updateMyProfile(fields) {
  await updateDoc(doc(db, 'users', state.uid), fields);
}

// ---- Онлайн-статус ----
let presenceTimer = null;
let pingAt = 0;
function ping() {
  if (!state.uid) return;
  pingAt = Date.now();
  updateDoc(doc(db, 'users', state.uid), { lastSeen: serverTimestamp() }).catch(() => {});
}
export function startPresence() {
  ping();
  clearInterval(presenceTimer);
  presenceTimer = setInterval(ping, 60000); // пока вкладка открыта (даже свернута)
  document.addEventListener('visibilitychange', onVis);
  window.addEventListener('pagehide', ping);
}
function onVis() { if (!document.hidden) ping(); }
export function stopPresence() {
  clearInterval(presenceTimer);
  document.removeEventListener('visibilitychange', onVis);
  window.removeEventListener('pagehide', ping);
}
