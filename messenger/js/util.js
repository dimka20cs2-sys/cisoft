// Вспомогательные функции: время, цвета, ссылки.

export const USERNAME_RE = /^[a-zA-Z0-9_]{3,20}$/;

export function directChatId(a, b) { return [a, b].sort().join('_'); }

// Timestamp Firestore | Date | number → миллисекунды
export function toMs(t) {
  if (!t) return 0;
  if (typeof t === 'number') return t;
  if (t instanceof Date) return t.getTime();
  if (typeof t.toMillis === 'function') return t.toMillis();
  if (typeof t.seconds === 'number') return t.seconds * 1000;
  return 0;
}

const COLORS = ['#4f9dff', '#b07cff', '#3fd07a', '#ff8a4c', '#ff5c8a', '#2fc6c6', '#e6b422', '#7c8cff'];
export function colorFor(uid) {
  let h = 0;
  for (const ch of String(uid || '')) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return COLORS[h % COLORS.length];
}

export function initials(name) {
  const parts = String(name || '?').trim().split(/\s+/).filter(Boolean);
  const s = (parts[0]?.[0] || '?') + (parts[1]?.[0] || '');
  return s.toUpperCase();
}

const pad = (n) => String(n).padStart(2, '0');
export function timeHM(ms) { const d = new Date(ms); return pad(d.getHours()) + ':' + pad(d.getMinutes()); }

const MONTHS = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
function sameDay(a, b) { return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate(); }

export function dayLabel(ms) {
  const d = new Date(ms), now = new Date();
  const y = new Date(now); y.setDate(now.getDate() - 1);
  if (sameDay(d, now)) return 'Сегодня';
  if (sameDay(d, y)) return 'Вчера';
  const s = d.getDate() + ' ' + MONTHS[d.getMonth()];
  return d.getFullYear() === now.getFullYear() ? s : s + ' ' + d.getFullYear();
}
export function dayKey(ms) { const d = new Date(ms); return d.getFullYear() + '-' + d.getMonth() + '-' + d.getDate(); }

// Короткое время для списка чатов
export function shortTime(ms) {
  if (!ms) return '';
  const d = new Date(ms), now = new Date();
  if (sameDay(d, now)) return timeHM(ms);
  const diffDays = (now - d) / 864e5;
  if (diffDays < 6) return ['вс', 'пн', 'вт', 'ср', 'чт', 'пт', 'сб'][d.getDay()];
  return pad(d.getDate()) + '.' + pad(d.getMonth() + 1) + (d.getFullYear() === now.getFullYear() ? '' : '.' + String(d.getFullYear()).slice(2));
}

function plural(n, one, few, many) {
  const m10 = n % 10, m100 = n % 100;
  if (m10 === 1 && m100 !== 11) return one;
  if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return few;
  return many;
}
export { plural };

export const ONLINE_MS = 2 * 60 * 1000;
export function isOnline(lastSeenMs) { return !!lastSeenMs && serverNow() - lastSeenMs < ONLINE_MS; }

export function presenceText(lastSeenMs) {
  if (!lastSeenMs) return 'не в сети';
  const diff = Math.max(0, serverNow() - lastSeenMs);
  if (diff < ONLINE_MS) return 'в сети';
  const min = Math.floor(diff / 60000);
  if (min < 60) return `был(а) ${min} ${plural(min, 'минуту', 'минуты', 'минут')} назад`;
  const h = Math.floor(min / 60);
  if (h < 24) return `был(а) ${h} ${plural(h, 'час', 'часа', 'часов')} назад`;
  const d = new Date(lastSeenMs);
  return 'был(а) ' + dayLabel(lastSeenMs).toLowerCase() + ' в ' + timeHM(d.getTime());
}

export function fmtDuration(sec) {
  sec = Math.max(0, Math.round(sec));
  const h = Math.floor(sec / 3600), m = Math.floor((sec % 3600) / 60), s = sec % 60;
  return (h ? h + ':' + pad(m) : m) + ':' + pad(s);
}

// Разбивает текст на части: {text} или {url}. Только http(s).
const URL_RE = /\b((?:https?:\/\/|www\.)[^\s<>"']+)/gi;
export function splitLinks(text) {
  const out = [];
  let last = 0, m;
  URL_RE.lastIndex = 0;
  while ((m = URL_RE.exec(text))) {
    let raw = m[1];
    const trail = raw.match(/[.,!?;:)\]]+$/); // не включаем завершающую пунктуацию
    if (trail) raw = raw.slice(0, -trail[0].length);
    const start = m.index, end = start + raw.length;
    let href = raw.startsWith('www.') ? 'https://' + raw : raw;
    try {
      const u = new URL(href);
      if (u.protocol !== 'http:' && u.protocol !== 'https:') throw 0;
      href = u.href;
    } catch { continue; }
    if (start > last) out.push({ text: text.slice(last, start) });
    out.push({ url: href, text: raw });
    last = end;
    URL_RE.lastIndex = end;
  }
  if (last < text.length) out.push({ text: text.slice(last) });
  return out;
}

export function isDataImage(s) { return typeof s === 'string' && /^data:image\/(png|jpeg|jpg|webp|gif);base64,/.test(s); }

export function throttle(fn, ms) {
  let lastT = 0;
  return (...a) => { const n = Date.now(); if (n - lastT >= ms) { lastT = n; fn(...a); } };
}

// Поправка на расхождение часов компьютера и сервера (вычисляется по lastSeen)
let clockOffset = 0;
export function setClockOffset(ms) { if (Math.abs(ms) < 7 * 864e5) clockOffset = ms; }
export function serverNow() { return Date.now() + clockOffset; }
