// Счётчики скачиваний и лайков на Firebase Firestore: коллекция stats/{itemId} → { downloads, likes }.
// Тот же проект, что у мессенджера; вход (Auth) не нужен. Любая ошибка — тихо, сайт работает без чисел.
const SDK = 'https://www.gstatic.com/firebasejs/11.0.2/';
const ID_RE = /^[a-z0-9-]{1,40}$/;

async function start() {
  const CI = window.CI;
  if (!CI) return;
  const cfgMod = await import('../messenger/config.js');
  const { initializeApp } = await import(SDK + 'firebase-app.js');
  const fs = await import(SDK + 'firebase-firestore.js');

  const emu = cfgMod.useEmulators;
  const cfg = emu
    ? { apiKey: 'demo-key', projectId: cfgMod.emulatorProjectId, appId: 'demo-site' }
    : cfgMod.firebaseConfig;
  const app = initializeApp(cfg, 'cisoft-site');
  const db = fs.getFirestore(app);
  if (emu) fs.connectFirestoreEmulator(db, cfgMod.emulatorHosts.firestoreHost, cfgMod.emulatorHosts.firestorePort);

  // +1 к одному полю; документ создаётся при первом обращении (правила разрешают только так)
  CI.attachStats((id, field) => {
    if (!ID_RE.test(id) || (field !== 'downloads' && field !== 'likes')) return;
    fs.setDoc(fs.doc(db, 'stats', id), { [field]: fs.increment(1) }, { merge: true }).catch(() => {});
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

  if (emu) window.__ciStats = { db, fs }; // только для локальных проверок на эмуляторе
}

start().catch(() => { /* CDN или Firebase недоступны — без чисел */ });
