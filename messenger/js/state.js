// Общее состояние приложения и простая шина событий.
export const bus = new EventTarget();
export function emit(name, detail) { bus.dispatchEvent(new CustomEvent(name, { detail })); }
export function on(name, fn) {
  const h = (e) => fn(e.detail);
  bus.addEventListener(name, h);
  return () => bus.removeEventListener(name, h);
}

export const state = {
  uid: null,          // текущий пользователь
  me: null,           // профиль users/{uid}
  chats: new Map(),   // chatId → данные чата
  activeChatId: null, // открытый чат
  inCall: false
};

// Локальные настройки (храним в браузере пользователя).
const PREFS_KEY = 'cisoft-msg-prefs';
const defaults = { sound: true, desktop: false, theme: 'dark' };
let prefs = { ...defaults };
try { prefs = { ...defaults, ...JSON.parse(localStorage.getItem(PREFS_KEY) || '{}') }; } catch { /* нет доступа */ }

export function getPref(k) { return prefs[k]; }
export function setPref(k, v) {
  prefs[k] = v;
  try { localStorage.setItem(PREFS_KEY, JSON.stringify(prefs)); } catch { /* ignore */ }
  emit('prefs', { key: k, value: v });
}
