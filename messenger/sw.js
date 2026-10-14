// Service worker CISOFT Messenger: кэш «оболочки», сеть — в приоритете.
const CACHE = 'cisoft-msg-v1';
const SHELL = [
  './', 'index.html', 'config.js', 'manifest.webmanifest', 'icons/icon-192.png', 'icons/icon-512.png',
  'css/theme.css', 'css/layout.css', 'css/chat.css', 'css/overlays.css', 'css/call.css',
  'js/app.js', 'js/fb.js', 'js/fs.js', 'js/fa.js', 'js/state.js', 'js/util.js', 'js/dom.js', 'js/icons.js',
  'js/users.js', 'js/auth-ui.js', 'js/chatlist.js', 'js/chat-view.js', 'js/messages.js', 'js/message-render.js',
  'js/message-actions.js', 'js/composer.js', 'js/photo-send.js', 'js/image.js', 'js/send.js', 'js/emoji.js',
  'js/viewer.js', 'js/new-chat.js', 'js/groups.js', 'js/calls.js', 'js/rtc-media.js', 'js/call-ui.js',
  'js/incoming.js', 'js/sound.js', 'js/notify.js', 'js/settings.js'
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)).catch(() => {}).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys()
    .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
    .then(() => self.clients.claim()));
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return; // Firebase и CDN — напрямую в сеть
  e.respondWith(
    fetch(req).then((res) => {
      if (res.ok) { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(req, copy)); }
      return res;
    }).catch(() => caches.match(req).then((r) => r || caches.match('index.html')))
  );
});

// Клик по уведомлению — открыть/показать приложение
self.addEventListener('notificationclick', (e) => {
  e.notification.close();
  e.waitUntil(self.clients.matchAll({ type: 'window' }).then((list) => {
    for (const c of list) if ('focus' in c) return c.focus();
    return self.clients.openWindow('./');
  }));
});
