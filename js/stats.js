// Счётчики скачиваний и лайков на Firebase Firestore: коллекция stats/{itemId} → { downloads, likes }.
// Используем тот же Firebase app ('[DEFAULT]'), что и мессенджер (messenger/js/fb.js): одна сессия входа
// на сайте и в мессенджере. Скачивания — анонимно +1; лайки меняются только в js/acc-api.js (батчем с likes/*).
// Любая ошибка — тихо, сайт работает без чисел.
const ID_RE = /^[a-z0-9-]{1,40}$/;

async function start() {
  const CI = window.CI;
  if (!CI) return;
  const { db, isEmu } = await import('../messenger/js/fb.js');
  const fs = await import('../messenger/js/fs.js');

  // +1 к скачиваниям; документ создаётся при первом обращении (правила разрешают только так)
  CI.attachStats((id, field) => {
    if (!ID_RE.test(id) || field !== 'downloads') return;
    fs.setDoc(fs.doc(db, 'stats', id), { downloads: fs.increment(1) }, { merge: true }).catch(() => {});
  });

  // Живые числа по всем программам (документов немного — по одному на программу)
  fs.onSnapshot(fs.collection(db, 'stats'), (snap) => {
    const map = {};
    snap.forEach((d) => {
      const v = d.data() || {};
      map[d.id] = { downloads: Number(v.downloads) || 0, likes: Number(v.likes) || 0 };
    });
    CI.setStats(map);
  }, () => { /* нет доступа/сети — без чисел */ });

  if (isEmu) window.__ciStats = { db, fs }; // только для локальных проверок на эмуляторе
}

start().catch(() => { /* CDN или Firebase недоступны — без чисел */ });
