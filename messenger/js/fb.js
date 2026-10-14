import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js';
import { initializeAuth, indexedDBLocalPersistence, browserLocalPersistence, connectAuthEmulator } from './fa.js';
import { initializeFirestore, connectFirestoreEmulator } from './fs.js';
import { firebaseConfig, useEmulators, emulatorProjectId, emulatorHosts } from '../config.js';

const cfg = useEmulators
  ? { apiKey: 'demo-key', authDomain: emulatorProjectId + '.firebaseapp.com', projectId: emulatorProjectId }
  : firebaseConfig;

export const configMissing = !useEmulators && String(firebaseConfig.apiKey || '').startsWith('ВСТАВЬТЕ');

export const app = initializeApp(cfg);
// без popupRedirectResolver: вход только по почте, лишний скрипт apis.google.com не грузится (важно для WebView и CSP)
export const auth = initializeAuth(app, { persistence: [indexedDBLocalPersistence, browserLocalPersistence] });
export const db = initializeFirestore(app, { ignoreUndefinedProperties: true });

if (useEmulators) {
  connectAuthEmulator(auth, emulatorHosts.auth, { disableWarnings: true });
  connectFirestoreEmulator(db, emulatorHosts.firestoreHost, emulatorHosts.firestorePort);
}

export const isEmu = useEmulators;
