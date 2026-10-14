// Личный кабинет: действия — вход/регистрация, избранное, загрузки, честные лайки, профиль, пароль, удаление.
import { auth, db } from '../messenger/js/fb.js';
import {
  signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail, signOut,
  EmailAuthProvider, reauthenticateWithCredential, updatePassword, deleteUser
} from '../messenger/js/fa.js';
import {
  doc, setDoc, updateDoc, deleteDoc, deleteField, writeBatch, increment, serverTimestamp,
  getDocs, query, collection, where
} from '../messenger/js/fs.js';
import { claimProfile } from '../messenger/js/users.js';   // та же транзакция users + usernames, что в мессенджере
import { compressAvatar } from '../messenger/js/image.js'; // то же сжатие аватара
import { USERNAME_RE } from '../messenger/js/util.js';
import { acc, emit, signedIn, errText } from './acc-core.js';

const CI = window.CI;
const ID_RE = /^[a-z0-9-]{1,40}$/;
const uid = () => acc.user && acc.user.uid;
const udRef = () => doc(db, 'userdata', uid());
const userRef = () => doc(db, 'users', uid());
const fail = (m) => { throw { userMessage: m }; };

// ── вход и регистрация ──
async function signIn(email, pass) {
  email = String(email || '').trim();
  if (!email || !pass) fail('Введите email и пароль.');
  await signInWithEmailAndPassword(auth, email, pass);
}

// Профиль создаётся ТОЧНО как в мессенджере (claimProfile из messenger/js/users.js)
async function register({ name, username, email, password }) {
  name = String(name || '').trim();
  username = String(username || '').trim().replace(/^@/, '');
  email = String(email || '').trim();
  if (!name) fail('Укажите имя для показа.');
  if (!USERNAME_RE.test(username)) fail('Имя пользователя: 3–20 символов — латиница, цифры и _.');
  if (!email) fail('Введите email.');
  if (String(password || '').length < 6) fail('Пароль должен быть не короче 6 символов.');
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  try {
    await claimProfile(cred.user.uid, name, username);
  } catch (e) {
    throw { userMessage: errText(e), needsSetup: true }; // аккаунт создан, но @username занят — допишем профиль
  }
  if (CI.msgr && CI.msgr.reload) CI.msgr.reload(); // мессенджер в рамке мог увидеть вход раньше профиля
}

async function completeProfile(name, username) {
  await claimProfile(uid(), String(name || '').trim(), String(username || '').trim().replace(/^@/, ''));
  if (CI.msgr && CI.msgr.reload) CI.msgr.reload();
}

const resetPassword = (email) => {
  email = String(email || '').trim();
  if (!email) fail('Введите email.');
  return sendPasswordResetEmail(auth, email);
};
const logout = () => signOut(auth);

// ── избранное и загрузки (userdata/{uid}) ──
async function toggleFav(id) {
  if (!signedIn() || !ID_RE.test(id)) return;
  const favs = acc.data.favorites || {}, on = !!favs[id];
  if (!on && Object.keys(favs).length >= 200) { CI.toast('В избранном уже 200 программ — уберите лишние.'); return; }
  try {
    await setDoc(udRef(), { favorites: { [id]: on ? deleteField() : Date.now() } }, { merge: true });
    CI.toast(on ? 'Убрано из избранного' : 'Добавлено в избранное', on ? {} : { action: 'Кабинет', onAction: () => { location.hash = '#/account'; } });
  } catch (e) { CI.toast(errText(e)); }
}

function recordDownload(id, label) {
  if (!signedIn() || !ID_RE.test(id)) return;
  const list = [{ itemId: id, label: String(label || 'Скачать').slice(0, 80), at: Date.now() }]
    .concat(acc.data.downloads || []).slice(0, 50);
  acc.data.downloads = list; // сразу, чтобы два быстрых клика не потеряли запись
  setDoc(udRef(), { downloads: list }, { merge: true }).catch(() => {});
}

function clearDownloads() {
  if (!signedIn()) return;
  acc.data.downloads = [];
  setDoc(udRef(), { downloads: [] }, { merge: true }).catch((e) => CI.toast(errText(e)));
}

function markVisit() {
  if (!signedIn()) return Promise.resolve();
  return setDoc(udRef(), { lastAccountVisit: Date.now() }, { merge: true }).catch(() => {});
}

// ── честные лайки: likes/{itemId}_{uid} и ±1 в stats/{itemId}.likes одним batch ──
const likeBusy = new Set();
async function toggleLike(id) {
  if (!signedIn() || !ID_RE.test(id) || likeBusy.has(id)) return;
  likeBusy.add(id);
  const was = !!acc.likes[id];
  const b = writeBatch(db);
  const likeRef = doc(db, 'likes', id + '_' + uid()), statsRef = doc(db, 'stats', id);
  if (was) {
    b.delete(likeRef);
    b.set(statsRef, { likes: increment(-1) }, { merge: true });
  } else {
    b.set(likeRef, { uid: uid(), itemId: id, at: serverTimestamp() });
    b.set(statsRef, { likes: increment(1) }, { merge: true });
  }
  acc.likes = { ...acc.likes };
  if (was) delete acc.likes[id]; else acc.likes[id] = true;
  emit();
  try { await b.commit(); } catch (e) {
    acc.likes = { ...acc.likes };
    if (was) acc.likes[id] = true; else delete acc.likes[id];
    emit();
    CI.toast('Лайк не сохранён: ' + errText(e));
  } finally { likeBusy.delete(id); }
}

// ── профиль ──
async function saveName(v) {
  v = String(v || '').trim();
  if (!v) fail('Имя не может быть пустым.');
  await updateDoc(userRef(), { name: v.slice(0, 60) });
}
async function setAvatarFile(file) {
  const data = await compressAvatar(file);
  await updateDoc(userRef(), { avatar: data });
}
const removeAvatar = () => updateDoc(userRef(), { avatar: null });

async function reauth(pass) {
  if (!pass) fail('Введите текущий пароль.');
  await reauthenticateWithCredential(acc.user, EmailAuthProvider.credential(acc.user.email, pass));
}

async function changePassword(cur, next, again) {
  if (String(next || '').length < 6) fail('Новый пароль должен быть не короче 6 символов.');
  if (next !== again) fail('Новые пароли не совпадают.');
  if (next === cur) fail('Новый пароль совпадает с текущим.');
  await reauth(cur);
  await updatePassword(acc.user, next);
}

// Удаление: лайки (с −1 в счётчиках), userdata, запись usernames; профиль users/{uid} правила удалять
// не разрешают — очищаем его (имя «Удалённый аккаунт», без фото). Затем удаляем сам аккаунт входа.
async function deleteAccount(pass) {
  const user = acc.user, me = user.uid, prof = acc.profile;
  await reauth(pass);
  const snap = await getDocs(query(collection(db, 'likes'), where('uid', '==', me)));
  for (const d of snap.docs) {
    const b = writeBatch(db);
    b.delete(d.ref);
    b.set(doc(db, 'stats', d.data().itemId), { likes: increment(-1) }, { merge: true });
    await b.commit();
  }
  await deleteDoc(doc(db, 'userdata', me));
  if (prof) {
    await updateDoc(doc(db, 'users', me), { name: 'Удалённый аккаунт', avatar: null });
    await deleteDoc(doc(db, 'usernames', prof.usernameLower));
  }
  await deleteUser(user);
}

Object.assign(acc, {
  signIn, register, completeProfile, resetPassword, logout,
  toggleFav, recordDownload, clearDownloads, markVisit, toggleLike,
  saveName, setAvatarFile, removeAvatar, changePassword, deleteAccount
});
