// Точка входа: авторизация, запуск подписок, связывание интерфейса.
import { auth, isEmu } from './fb.js';
import { onAuthStateChanged } from './fa.js';
import { state, on } from './state.js';
import { el, clear, $, toast, errText } from './dom.js';
import { icon } from './icons.js';
import { showAuth, showSetup, hideAuth, takePendingProfile } from './auth-ui.js';
import { watchUser, getUserOnce, claimProfile, startPresence, stopPresence, stopAllUserWatches, searchUsers } from './users.js';
import { startChatList, stopChatList, setChatFilter, render as renderList } from './chatlist.js';
import { closeChat } from './chat-view.js';
import { startIncoming, stopIncoming } from './incoming.js';
import { currentCall } from './calls.js';
import { openSettings, applyTheme } from './settings.js';
import { openNewChat, userRow, startDirectWith } from './new-chat.js';
import './call-ui.js';

applyTheme();

// Статичные иконки в шапке списка
$('#btn-settings').append(icon('menu'));
$('#btn-new').append(icon('edit'));
$('.search-ico').append(icon('search', 18));
$('#btn-settings').addEventListener('click', () => openSettings());
$('#btn-new').addEventListener('click', () => openNewChat());

// Поиск: фильтр чатов + люди по @username
const searchInput = $('#search');
const results = $('#search-results');
let searchSeq = 0, searchTimer = null;
searchInput.addEventListener('input', () => {
  const q = searchInput.value.trim();
  setChatFilter(q);
  clearTimeout(searchTimer);
  if (q.replace(/^@/, '').length < 2) { results.hidden = true; clear(results); return; }
  searchTimer = setTimeout(async () => {
    const my = ++searchSeq;
    let users = [];
    try { users = await searchUsers(q); } catch (e) { console.warn(e); }
    if (my !== searchSeq) return;
    clear(results);
    results.hidden = false;
    results.append(el('div', { class: 'list-title', text: 'Люди' }));
    if (!users.length) results.append(el('div', { class: 'list-empty', style: { padding: '8px' }, text: 'Никого с таким @username' }));
    for (const u of users) {
      results.append(userRow(u, { onclick: async () => { searchInput.value = ''; setChatFilter(''); results.hidden = true; await startDirectWith(u.uid); } }));
    }
    results.append(el('div', { class: 'list-title', text: 'Чаты' }));
  }, 250);
});
searchInput.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') { searchInput.value = ''; setChatFilter(''); results.hidden = true; }
});

function showApp(v) {
  $('#boot').hidden = true;
  $('#app').hidden = !v;
}

let started = false;
async function start() {
  if (started) return;
  started = true;
  const me = await watchUser(state.uid);
  state.me = me;
  hideAuth();
  showApp(true);
  startPresence();
  startChatList();
  startIncoming();
}

on('user', ({ uid, user }) => {
  if (uid === state.uid && user) { state.me = user; renderList(); }
});

function teardown() {
  started = false;
  try { currentCall()?.hangup(); } catch { /* ignore */ }
  closeChat();
  stopIncoming();
  stopChatList();
  stopPresence();
  stopAllUserWatches();
  state.uid = null; state.me = null;
  showApp(false);
}

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    teardown();
    $('#boot').hidden = true;
    showAuth('login');
    return;
  }
  state.uid = user.uid;
  try {
    const prof = await getUserOnce(user.uid);
    if (!prof) {
      const pending = takePendingProfile();
      $('#boot').hidden = true;
      if (!pending) { showSetup(user.uid, {}, '', start); return; }
      try { await claimProfile(user.uid, pending.name, pending.username); }
      catch (e) { showSetup(user.uid, pending, errText(e), start); return; }
    }
    await start();
  } catch (e) {
    console.error(e);
    $('#boot').hidden = true;
    toast(errText(e), 'error');
    showSetup(user.uid, {}, 'Не удалось загрузить профиль. Проверьте интернет и попробуйте снова.', start);
  }
});

// PWA: service worker (на эмуляторе не нужен — не мешаем тестам кэшем)
if ('serviceWorker' in navigator && !isEmu) {
  window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));
}

if (isEmu || new URLSearchParams(location.search).get('test') === '1') window.__cisoft = { state }; // для автотестов
